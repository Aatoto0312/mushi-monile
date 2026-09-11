(function (global) {
  'use strict';

  // 対戦画面の制御。エンジンとDOMを橋渡しする。ルール判定はエンジン側に任せる。
  //
  // ホットシート方式: アクティブプレイヤー(操作側)を常に画面下「あなた」、相手を画面上「相手」に動的視点切替。
  // ターン交代時は視点も交代し、端末を渡す旨のオーバーレイを表示する。

  function BattleUI(engine) {
    this.engine = engine;
    this.state = engine.state;
    this.logUI = new BattleLogUI('#battle-log');

    this.actionState = {
      mode: 'idle', // idle | attackTarget | confirm | territoryChoice
      attackerInstanceId: null,
      skillId: null,
      legalTargets: [],
      pendingAttackTarget: null,
      sacrificeCandidates: null,
      enhancementInstanceId: null,
      enhancementDef: null,
      pendingEnh: null
    };

    this._lastActivePlayerId = null;
    this._lastBattleEventId = 0;
    this._damageVectorQueue = [];
    this._damageVectorActive = false;
    this.cpuMode = false;
    this.cpuRunner = null;
    this.selectedDecks = { P1: 'KABUTOMUSHI', P2: 'OKAMAKIRI' };
    this._deckSelectDone = { P1: false, P2: false };
    this.tutorialController = null;
    this._tutorialAutoTimer = null;
  }

  // 縄張りピッカー用のカード種別ラベル
  function territoryTypeLabel(def) {
    if (!def) { return '?'; }
    var map = {};
    map[global.CardTypes.INSECT] = '蟲';
    map[global.CardTypes.SPELL] = '術';
    map[global.CardTypes.ENHANCEMENT] = '強化';
    return map[def.type] || '?';
  }

  BattleUI.prototype.attach = function () {
    var self = this;
    document.getElementById('btn-end-turn').addEventListener('click', function () {
      var pending=global.getPendingEffect(self.state);
      if(pending&&pending.type==='CARD_SELECTION'){
        try{global.completeCardSelection(self.state,pending.playerId);self.render();}catch(e){alert(e.message);}return;
      }
      self.onEndTurn();
    });
    document.getElementById('btn-new-game').addEventListener('click', function () {
      self.returnToDeckSelect();
    });
    document.getElementById('btn-to-main').addEventListener('click', function () {
      self.onToMainPhase();
    });
    var btnDraw = document.getElementById('btn-draw');
    if (btnDraw) {
      btnDraw.addEventListener('click', function () {
        self.onDraw();
      });
    }
    document.getElementById('game-over').addEventListener('click', function () {
      self.newGame();
    });
    document.getElementById('btn-pass-ok').addEventListener('click', function () {
      self.hidePassOverlay();
    });
    var btnNg2 = document.getElementById('btn-new-game-2');
    if (btnNg2) {
      btnNg2.addEventListener('click', function () {
        self.newGame();
      });
    }

    // デッキ選択ボタン
    this._bindDeckButtons();

    // 直接攻撃ボタン
    document.getElementById('btn-direct-attack').addEventListener('click', function () {
      self.onDirectAttack();
    });
    // 攻撃キャンセルボタン
    document.getElementById('btn-cancel-attack').addEventListener('click', function () {
      self.cancelAttack();
    });

    // CPU戦モード切替ボタン
    var btnVsCpu = document.getElementById('btn-vs-cpu');
    if (btnVsCpu) {
      btnVsCpu.addEventListener('click', function () {
        self.startVsCpu();
      });
    }
    var btnVsHuman = document.getElementById('btn-vs-human');
    if (btnVsHuman) {
      btnVsHuman.addEventListener('click', function () {
        self.startVsHuman();
      });
    }
    var btnTutorial = document.getElementById('btn-tutorial');
    if (btnTutorial) btnTutorial.addEventListener('click', function () { self.startTutorial(); });
    var btnTutorialExit = document.getElementById('btn-tutorial-exit');
    if (btnTutorialExit) btnTutorialExit.addEventListener('click', function () { self.exitTutorial(); });
    var btnTutorialMode = document.getElementById('btn-tutorial-mode-select');
    if (btnTutorialMode) btnTutorialMode.addEventListener('click', function () { self.exitTutorial(); });
    var btnTutorialReplay = document.getElementById('btn-tutorial-replay');
    if (btnTutorialReplay) btnTutorialReplay.addEventListener('click', function () { self.restartTutorial(); });

    // カード詳細モーダル閉じる
    var modalClose = document.getElementById('card-detail-close');
    if (modalClose) {
      modalClose.addEventListener('click', function () {
        self.hideCardDetail();
      });
    }
    var modalBg = document.getElementById('card-detail-modal');
    if (modalBg) {
      modalBg.addEventListener('click', function (e) {
        if (e.target === modalBg) self.hideCardDetail();
      });
    }
  };

  BattleUI.prototype.startVsHuman = function () {
    this._deactivateTutorial();
    this.cpuMode = false;
    this._openDeckSelect();
  };

  BattleUI.prototype.startVsCpu = function () {
    this._deactivateTutorial();
    this.cpuMode = true;
    this._openDeckSelect();
  };

  BattleUI.prototype._bindDeckButtons = function () {
    var self = this;
    var bind = function (btnId, side, recipe) {
      var btn = document.getElementById(btnId);
      if (btn) {
        btn.addEventListener('click', function () {
          self.selectDeck(side, recipe);
        });
      }
    };
    bind('btn-deck-p1-kabuto', 'P1', 'KABUTOMUSHI');
    bind('btn-deck-p1-okama', 'P1', 'OKAMAKIRI');
    bind('btn-deck-p2-kabuto', 'P2', 'KABUTOMUSHI');
    bind('btn-deck-p2-okama', 'P2', 'OKAMAKIRI');
    var bindUser = function (buttonId, selectId, side) {
      var button = document.getElementById(buttonId);
      if (button) button.addEventListener('click', function () {
        var select = document.getElementById(selectId);
        if (select && select.value) self.selectDeck(side, 'USER:' + select.value);
      });
    };
    bindUser('btn-user-deck-p1', 'user-deck-p1', 'P1');
    bindUser('btn-user-deck-p2', 'user-deck-p2', 'P2');
  };

  BattleUI.prototype._loadUserDecks = function () {
    var runtime = global.MushijingiDeckRuntime;
    if (!runtime) return;
    var store;
    try { store = runtime.parseStore(localStorage.getItem(runtime.STORAGE_KEY)); }
    catch (error) { store = runtime.parseStore(null); }
    var handoff = null;
    try { handoff = sessionStorage.getItem(runtime.HANDOFF_KEY) || new URLSearchParams(location.search).get('deck'); } catch (error2) { handoff = null; }
    ['P1', 'P2'].forEach(function (side) {
      var suffix = side.toLowerCase(), select = document.getElementById('user-deck-' + suffix), button = document.getElementById('btn-user-deck-' + suffix);
      if (!select) return;
      select.innerHTML = '<option value="">保存デッキなし</option>' + store.decks.map(function (deck) {
        var valid = runtime.validateForBattle(deck, global.cardRegistry).valid;
        return '<option value="' + deck.deckId.replace(/"/g, '&quot;') + '"' + (valid ? '' : ' disabled') + '>' + deck.deckName.replace(/[&<>]/g, '') + (valid ? '' : '（対戦不可）') + '</option>';
      }).join('');
      if (side === 'P1' && handoff) select.value = handoff;
      if (button) button.disabled = !store.decks.some(function (deck) { return runtime.validateForBattle(deck, global.cardRegistry).valid; });
    });
    var edit = document.getElementById('battle-to-toolbox');
    if (edit && handoff) edit.href = 'toolbox.html?edit=' + encodeURIComponent(handoff);
  };

  BattleUI.prototype._openDeckSelect = function () {
    this._loadUserDecks();
    this.hideModeSelect();
    var self = this;
    var title = document.getElementById('deck-select-title');
    if (title) {
      title.textContent = this.cpuMode ? 'あなたとCPUのデッキを選択してください' : 'P1・P2のデッキを選択してください';
    }
    var p1Label = document.getElementById('deck-p1-label');
    if (p1Label) {
      p1Label.textContent = this.cpuMode ? 'あなた（P1）' : 'P1';
    }
    var p2Label = document.getElementById('deck-p2-label');
    if (p2Label) {
      p2Label.textContent = this.cpuMode ? 'CPU（P2）' : 'P2';
    }
    this._deckSelectDone = { P1: false, P2: false };
    var ov = document.getElementById('deck-select-overlay');
    if (ov) ov.style.display = 'flex';
  };

  BattleUI.prototype.hideDeckSelect = function () {
    var ov = document.getElementById('deck-select-overlay');
    if (ov) ov.style.display = 'none';
  };

  BattleUI.prototype.selectDeck = function (side, recipe) {
    this.selectedDecks[side] = recipe;
    this._deckSelectDone[side] = true;
    if (this._deckSelectDone.P1 && this._deckSelectDone.P2) {
      this.hideDeckSelect();
      this._beginNewGame();
    }
  };

  BattleUI.prototype.hideModeSelect = function () {
    var overlay = document.getElementById('mode-select-overlay');
    if (overlay) overlay.style.display = 'none';
  };

  BattleUI.prototype.showModeSelect = function () {
    var overlay = document.getElementById('mode-select-overlay');
    if (overlay) overlay.style.display = 'flex';
  };

  BattleUI.prototype._resetActionState = function () {
    this.actionState = { mode: 'idle', attackerInstanceId: null, skillId: null, legalTargets: [], pendingAttackTarget: null, sacrificeCandidates: null, enhancementInstanceId: null, enhancementDef: null, pendingEnh: null };
  };

  BattleUI.prototype._deactivateTutorial = function () {
    if (this._tutorialAutoTimer) { clearTimeout(this._tutorialAutoTimer); this._tutorialAutoTimer = null; }
    if (this.tutorialController) this.tutorialController.active = false;
    this.tutorialController = null;
    if (document.body) document.body.classList.remove('tutorial-active');
    var guide = document.getElementById('tutorial-guide');
    if (guide) guide.style.display = 'none';
  };

  BattleUI.prototype.startTutorial = function () {
    if (this.cpuRunner) { this.cpuRunner.isRunning = false; this.cpuRunner = null; }
    this.cpuMode = false;
    this.hideModeSelect();
    this.hideDeckSelect();
    this._resetActionState();
    this.tutorialController = new global.TutorialController(this.engine, this, global.TUTORIAL_SCENARIOS.basicV01);
    this.tutorialController.start();
    this.state = this.engine.state;
    this._lastBattleEventId = 0;
    this._damageVectorQueue = [];
    this._damageVectorActive = false;
    if (this.logUI) this.logUI.clear();
    if (document.body) document.body.classList.add('tutorial-active');
    this.render();
  };

  BattleUI.prototype.restartTutorial = function () {
    if (!this.tutorialController) return;
    this._resetActionState();
    this.tutorialController.restart();
    this.state = this.engine.state;
    this._lastBattleEventId = 0;
    this._damageVectorQueue = [];
    this._damageVectorActive = false;
    var go = document.getElementById('game-over'); if (go) go.style.display = 'none';
    this.render();
  };

  BattleUI.prototype.exitTutorial = function () {
    if (this.tutorialController) this.tutorialController.exit();
    this.state = this.engine.state;
    this._resetActionState();
    this._deactivateTutorial();
['card-detail-modal', 'pass-overlay', 'game-over', 'damage-vector', 'cpu-thinking', 'cpu-action-log', 'territory-picker'].forEach(function (id) { var el = document.getElementById(id); if (el) el.style.display = 'none'; });
    this.showModeSelect();
  };

  BattleUI.prototype._tutorialAllows = function (action, payload) {
    return !this.tutorialController || this.tutorialController.allows(action, payload || {});
  };

  BattleUI.prototype._beginNewGame = function () {
    var resolveDeck = function (selection, fallback) {
      if (typeof selection === 'string' && selection.indexOf('USER:') === 0 && global.MushijingiDeckRuntime) {
        var store = global.MushijingiDeckRuntime.parseStore(localStorage.getItem(global.MushijingiDeckRuntime.STORAGE_KEY));
        var saved = global.MushijingiDeckRuntime.findDeck(store, selection.slice(5));
        var validation = global.MushijingiDeckRuntime.validateForBattle(saved, global.cardRegistry);
        if (!validation.valid) throw new Error(validation.errors.join(' '));
        return validation.definitions;
      }
      return global.expandStarterDeck(global.STARTER_DECK_RECIPES[selection] || global.STARTER_DECK_RECIPES[fallback]);
    };
    var p1Deck = resolveDeck(this.selectedDecks.P1, 'KABUTOMUSHI');
    var p2Deck = resolveDeck(this.selectedDecks.P2, 'OKAMAKIRI');
    this.engine.newGame(p1Deck, p2Deck, {});
    this.state = this.engine.state;

    // 手動ドロー対象を設定: CPUモードは人間(P1)のみ、ホットシートは両者
    this.state.manualDrawPlayers = this.cpuMode ? ['P1'] : ['P1', 'P2'];

    this.logUI.clear();
    this.actionState.mode = 'idle';
    this._lastActivePlayerId = null;
    this._lastBattleEventId = 0;
    this._damageVectorQueue = [];
    this._damageVectorActive = false;
    this.hidePassOverlay();
    var go = document.getElementById('game-over');
    if (go) go.style.display = 'none';

    // CPUモード時はCPUランナーを初期化
    if (this.cpuMode) {
      this.cpuRunner = new global.CpuRunner(this.engine, this, {
        thinkDelay: 300,
        maxActionsPerTurn: 50,
        onActionLog: function (msg) {
          global.CpuToast.show(document.getElementById('cpu-action-log'), msg);
        }
      });
    }

    this.render();

    // CPUモードでP2ターンなら自動開始
    if (this.cpuMode && this.state.activePlayerId === 'P2') {
      this._startCpuTurn();
    }
  };

  BattleUI.prototype.newGame = function () {
    if (this.tutorialController) { this.restartTutorial(); return; }
    this.hideDeckSelect();
    this._beginNewGame();
  };

  BattleUI.prototype.returnToDeckSelect = function () {
    if (this.tutorialController) { this.exitTutorial(); return; }
    if (this.cpuRunner) {
      this.cpuRunner.isRunning = false;
      this.cpuRunner = null;
    }

    this.state = this.engine.resetSession();
    this.actionState = {
      mode: 'idle',
      attackerInstanceId: null,
      skillId: null,
      legalTargets: [],
      pendingAttackTarget: null,
      sacrificeCandidates: null,
      enhancementInstanceId: null,
      enhancementDef: null,
      pendingEnh: null
    };
    this._detailInstanceId = null;
    this._lastActivePlayerId = null;
    this._lastBattleEventId = 0;
    this._damageVectorQueue = [];
    this._damageVectorActive = false;
    this.selectedDecks = { P1: null, P2: null };
    this._deckSelectDone = { P1: false, P2: false };
    this._loadUserDecks();

    if (this.logUI) this.logUI.clear();
    var idsToHide = ['card-detail-modal', 'pass-overlay', 'game-over', 'damage-vector', 'cpu-thinking', 'cpu-action-log', 'territory-picker'];
    for (var i = 0; i < idsToHide.length; i++) {
      var hidden = document.getElementById(idsToHide[i]);
      if (hidden) hidden.style.display = 'none';
    }
    var skillRow = document.getElementById('skill-select-row');
    if (skillRow) {
      skillRow.innerHTML = '';
      skillRow.style.display = 'none';
    }
    this._openDeckSelect();
  };

  BattleUI.prototype.render = function () {
    if (this.tutorialController) this.tutorialController.observe();
    var s = this.state;
    var activeId = s.activePlayerId;

    // CPUモード時は固定視点 (P1=下, P2=上)
    var selfId = this.cpuMode ? 'P1' : activeId;
    var oppId = this.cpuMode ? 'P2' : s.opponentOf(activeId);

    var selfPlayer = s.player(selfId);
    var oppPlayer = s.player(oppId);

    // ターン/フェイズ表示
    this.setText('turn-text', 'TURN ' + s.turnNumber);
    var phaseLabelText = this.phaseLabel(s.phase);
    this.setText('phase-text', phaseLabelText);

    // プレイヤーラベル表示 (先攻/後攻付き)
    var selfTurn = (s.firstPlayerId === selfId) ? '（先攻）' : '（後攻）';
    var oppTurn = (s.firstPlayerId === oppId) ? '（先攻）' : '（後攻）';
    this.setText('self-player-label', 'あなた (' + selfId + ') ' + selfTurn);
    this.setText('opp-player-label', (this.cpuMode ? 'CPU' : '相手') + ' (' + oppId + ') ' + oppTurn);

    // 描画: 上=相手, 下=自分
    this.renderOpponent(oppPlayer, oppId);
    this.renderSelf(selfPlayer, selfId);

    // 盤面DOM更新後に、エンジンが確定した未表示イベントだけを演出へ渡す。
    this.renderBattleEvents();

    // コントロール更新
    this.renderControls();

    // ゲームオーバー表示
    if (s.phase === global.Phases.GAME_OVER && s.winner) {
      var winnerText;
      if (this.cpuMode) {
        winnerText = s.winner === 'P1' ? 'あなた（P1）の勝利！' : 'CPU（P2）の勝利！';
      } else {
        winnerText = s.winner === 'P1' ? 'P1の勝利！' : 'P2の勝利！';
      }
      var wtEl = document.getElementById('winner-text');
      if (wtEl) wtEl.textContent = winnerText;
      var winnerMsg = document.getElementById('winner-message');
      if (winnerMsg) winnerMsg.textContent = winnerText;
      var go = document.getElementById('game-over');
      if (go) go.style.display = 'flex';
    }

    // CPU思考中表示
    var cpuThinking = document.getElementById('cpu-thinking');
    if (cpuThinking) {
      var pending = getPendingEffect(s);
      var isCpuTurn = (this.cpuMode && activeId === 'P2');
      // CPUターン中で、かつP1のpending解決待ちではない場合に表示
      var isP1Pending = !!(pending && pending.playerId === 'P1');
      cpuThinking.style.display = (isCpuTurn && !isP1Pending) ? 'block' : 'none';
    }

    // Pending Effect表示
    this.renderPendingEffect(s);

    // 詳細モーダル表示中なら更新
    if (this._detailInstanceId) {
      var holder = findAnywhere(s, this._detailInstanceId);
      if (holder) {
        this.showCardDetail(holder.instance, []);
      }
    }

    // CPUターンの自動開始
    // - P2のターン開始
    // - P1ターン中にP2のpendingEffectが発生した場合もCPU選択だけ自動実行
    if (this.cpuMode) {
      var pending = getPendingEffect(s);
      var hasP2Pending = !!(pending && pending.playerId === 'P2');
      if (hasP2Pending || (activeId === 'P2' && s.phase !== global.Phases.GAME_OVER)) {
        this._startCpuTurn();
      }
    }
    this.renderTutorialGuide();

    // デバッグ: レイアウトメトリクスを記録
    this._renderLayoutMetrics();
  };

  BattleUI.prototype.renderTutorialGuide = function () {
    var controller = this.tutorialController;
    var guide = document.getElementById('tutorial-guide');
    if (!guide) return;
    if (!controller || !controller.active) { guide.style.display = 'none'; return; }
    guide.style.display = 'block';
    var step = controller.currentStep();
    var complete = controller.isComplete();
    this.setText('tutorial-step', complete ? 'COMPLETE' : 'STEP ' + (controller.stepIndex + 1) + ' / ' + controller.scenario.steps.length);
    this.setText('tutorial-message', complete ? 'おめでとうございます。基本対戦を完走しました！' : step.message);
    var actions = document.getElementById('tutorial-complete-actions');
    if (actions) actions.style.display = complete ? 'flex' : 'none';
    document.querySelectorAll('.tutorial-allowed, .tutorial-blocked').forEach(function (el) { el.classList.remove('tutorial-allowed'); el.classList.remove('tutorial-blocked'); });
    var allowed = controller.allowedInstanceIds();
    document.querySelectorAll('[data-instance-id]').forEach(function (el) { el.classList.add(allowed.indexOf(el.dataset.instanceId) >= 0 ? 'tutorial-allowed' : 'tutorial-blocked'); });
    var buttonMap = { DRAW: 'btn-draw', ENTER_MAIN: 'btn-to-main', DIRECT_ATTACK: 'btn-direct-attack' };
    Object.keys(buttonMap).forEach(function (action) { var el = document.getElementById(buttonMap[action]); if (el && controller.allows(action)) el.classList.add('tutorial-allowed'); });
    if (step && step.autoResolve && this.state.pendingEffect && !this._tutorialAutoTimer) {
      var self = this;
      this._tutorialAutoTimer = setTimeout(function () {
        self._tutorialAutoTimer = null;
        if (self.tutorialController) { self.tutorialController.observe(); self.render(); }
      }, 450);
    }
  };

  BattleUI.prototype._startCpuTurn = function () {
    if (!this.cpuMode || !this.cpuRunner || this.cpuRunner.isRunning) return;
    var s = this.state;
    var pending = getPendingEffect(s);
    var isP2Turn = s.activePlayerId === 'P2' && s.phase !== global.Phases.GAME_OVER;
    var hasP2Pending = !!(pending && pending.playerId === 'P2');
    if (!isP2Turn && !hasP2Pending) return;
    this.cpuRunner.start().then(function () {
      // ターン終了後に再レンダリング
    }).catch(function (e) {
      console.error('CPU turn error:', e);
    });
  };

  BattleUI.prototype.phaseLabel = function (phase) {
    var map = {};
    map[Phases.TURN_START] = 'ターン開始';
    map[Phases.DRAW_PHASE] = 'ドローフェイズ';
    map[Phases.SET_PHASE] = 'セットフェイズ';
    map[Phases.MAIN_PHASE] = 'メインフェイズ';
    map[Phases.TURN_END] = 'ターン終了';
    map[Phases.GAME_OVER] = 'ゲーム終了';
    return map[phase] || phase;
  };

  // 相手側 (上)
  BattleUI.prototype.renderOpponent = function (player, playerId) {
    var id = 'opp';

    // 山札
    this.renderZoneDeck(id + '-deck-zone', player.deck.length);

    // 手札 (裏向き表示)
    this.renderZoneHand(id + '-hand-zone', player.hand.length, false, null, playerId);

    // エサ (両プレイヤー表向き)
    this.renderZoneFood(id + '-food-zone', player.food.length, true, player.food, playerId);

    // 場 (相手の場: 通常タップで詳細、攻撃選択中は攻撃対象に選択)
    this.renderZoneField(id + '-field-zone', player.field, false, playerId);

    // 捨て場
    this.renderZoneDiscard(id + '-discard-zone', player.discard, playerId);

    // 縄張り (常時コンパクト表示。選択UIは専用ピッカーで行う)
    this.renderZoneTerritory(id + '-territory-zone', player.territory);

    // コスト表示
    this.setText(id + '-cost', '使用可能コスト: ' + player.availableCost + ' / ' + player.food.length);
  };

  // 自分側 (下 / アクティブ)
  BattleUI.prototype.renderSelf = function (player, playerId) {
    var id = 'self';

    // 山札
    this.renderZoneDeck(id + '-deck-zone', player.deck.length);

    // 手札 (表向き・操作可能)
    this.renderZoneHand(id + '-hand-zone', player.hand.length, true, player.hand, playerId);

    // エサ (表向き・詳細参照可能)
    this.renderZoneFood(id + '-food-zone', player.food.length, true, player.food, playerId);

    // 場 (自分の場: タップで攻撃開始・詳細)
    this.renderZoneField(id + '-field-zone', player.field, true, playerId);

    // 捨て場
    this.renderZoneDiscard(id + '-discard-zone', player.discard, playerId);

    // 縄張り (常時コンパクト表示。選択UIは専用ピッカーで行う)
    this.renderZoneTerritory(id + '-territory-zone', player.territory);

    // コスト表示
    this.setText(id + '-cost', '使用可能コスト: ' + player.availableCost + ' / ' + player.food.length);
  };

  // ゾーン: 山札
  BattleUI.prototype.renderZoneDeck = function (zoneId, count) {
    var container = document.getElementById(zoneId);
    if (!container) return;
    this.setZoneCount(zoneId, count);
    container.innerHTML = '';
    container.appendChild(CardUI.renderDeck(count));
  };

// ゾーン: 手札
  BattleUI.prototype.renderZoneHand = function (zoneId, count, isSelf, handInstances, playerId) {
    var container = document.getElementById(zoneId);
    if (!container) return;
    this.setZoneCount(zoneId, count);
    container.innerHTML = '';

    var self = this;
    var cardRow = document.createElement('div');
    cardRow.className = 'card-row';
    container.appendChild(cardRow);

    if (isSelf && handInstances) {
      handInstances.forEach(function (inst) {
        var el = CardUI.renderCard(inst, ZONES.HAND, self.state);
        if (self._detailInstanceId === inst.instanceId) {
          el.classList.add('selected-hand-card');
          el.setAttribute('aria-current', 'true');
        }
        el.addEventListener('click', function () {
          el.classList.add('selected-hand-card');
          self.onHandCardTap(playerId, inst);
        });
        cardRow.appendChild(el);
      });
    } else {
      // 相手の手札は内容非公開。枚数はラベルのcountバッジで表示し、
      // カードは小型スタック(最大3枚)だけ描画して縦積みを避ける。
      var backsToRender = Math.min(count, 3);
      for (var i = 0; i < backsToRender; i++) {
        var back = CardUI.renderFaceDown(null, null);
        back.classList.add('hand-back');
        cardRow.appendChild(back);
      }
    }
  };

  // ゾーン: エサ (公開情報のため両プレイヤー表向き)
  BattleUI.prototype.renderZoneFood = function (zoneId, count, isSelf, foodInstances, playerId) {
    var container = document.getElementById(zoneId);
    if (!container) return;
    this.setZoneCount(zoneId, count);
    container.innerHTML = '';

    var self = this;
    var cardRow = document.createElement('div');
    cardRow.className = 'card-row';
    container.appendChild(cardRow);

    if (foodInstances) {
      foodInstances.forEach(function (inst) {
        var el = CardUI.renderCard(inst, ZONES.FOOD, self.state);
        var pending = getPendingEffect(self.state);
        if (pending && (pending.type === 'SPELL_TARGET_SELECTION' || pending.type === 'CARD_SELECTION') && pending.options.indexOf(inst.instanceId) !== -1) { el.classList.add('legal-target'); }
        el.addEventListener('click', function () {
          var current = getPendingEffect(self.state);
          if (current && current.type === 'SPELL_TARGET_SELECTION' && current.options.indexOf(inst.instanceId) !== -1) {
            global.resolveSpellTargetSelection(self.state, current.playerId, inst.instanceId); self.render(); return;
          }
          if (current && current.type === 'CARD_SELECTION' && current.options.indexOf(inst.instanceId) !== -1) { global.selectPendingCard(self.state,current.playerId,inst.instanceId); self.render(); return; }
          self.showCardDetail(inst, []);
        });
        cardRow.appendChild(el);
      });
    }
  };

  // ゾーン: 場
  BattleUI.prototype.renderZoneField = function (zoneId, fieldInstances, isSelf, playerId) {
    var container = document.getElementById(zoneId);
    if (!container) return;
    container.innerHTML = '';

    var cardRow = document.createElement('div');
    cardRow.className = 'card-row';
    container.appendChild(cardRow);

    var self = this;
    fieldInstances.forEach(function (inst) {
      var el = CardUI.renderCard(inst, ZONES.FIELD, self.state);
      var pending = getPendingEffect(self.state);
      if (pending && pending.type === 'SPELL_TARGET_SELECTION' && pending.options.indexOf(inst.instanceId) !== -1) {
        el.classList.add('legal-target');
      }
      el.addEventListener('click', function () {
        self.onFieldCardTap(playerId, inst, el);
      });
      cardRow.appendChild(el);
    });
  };

  // ゾーン: 縄張り
  // 常時コンパクト表示（最大2枚のスタック + 枚数バッジがauthoritative）。
  // 選択pendingの選択UIは専用オーバーレイ（territory picker）で行い、このゾーンは伸ばさない。
  BattleUI.prototype.renderZoneTerritory = function (zoneId, territoryInstances) {
    var container = document.getElementById(zoneId);
    if (!container) return;
    this.setZoneCount(zoneId, territoryInstances ? territoryInstances.length : 0);
    container.innerHTML = '';

    var compactRow = document.createElement('div');
    compactRow.className = 'card-row card-row--compact';
    container.appendChild(compactRow);
    if (territoryInstances && territoryInstances.length > 0) {
      var stackSize = Math.min(territoryInstances.length, 2);
      for (var i = 0; i < stackSize; i++) {
        compactRow.appendChild(this._buildTerritoryCompact(territoryInstances[i]));
      }
    }
  };

  // 通常縄張り表示の1枚分。裏向きならカードバック、表向きなら小型のfaceupチップ。
  BattleUI.prototype._buildTerritoryCompact = function (inst) {
    var el, def;
    if (inst.faceDown) {
      el = CardUI.renderFaceDown(null, inst);
      el.classList.add('hand-back');
      return el;
    }
    def = CardUI.getDef(inst);
    el = document.createElement('button');
    el.type = 'button';
    el.className = 'territory-faceup territory-faceup--mini ' + (CardUI.colorClass ? CardUI.colorClass(def) : '');
    el.dataset.instanceId = inst.instanceId;
    var name = document.createElement('span');
    name.className = 'territory-faceup__name';
    name.textContent = CardUI.shortName ? CardUI.shortName(def) : (def && def.name ? def.name : '?');
    el.appendChild(name);
    return el;
  };

// 捨て場ゾーン (表向き。最新が最後)
  BattleUI.prototype.renderZoneDiscard = function (zoneId, discardInstances, playerId) {
    var self = this;
    var container = document.getElementById(zoneId);
    if (!container) return;
    this.setZoneCount(zoneId, discardInstances ? discardInstances.length : 0);
    container.innerHTML = '';

    if (!discardInstances || discardInstances.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'discard-empty';
      empty.textContent = '（なし）';
      container.appendChild(empty);
      return;
    }

    var cardRow = document.createElement('div');
    cardRow.className = 'card-row';
    container.appendChild(cardRow);

    discardInstances.forEach(function (inst) {
      var el = CardUI.renderCard(inst, ZONES.DISCARD, self.state);
      var pending = getPendingEffect(self.state);
      if (pending && pending.type === 'DISCARD_INSECT_SELECTION' && pending.playerId === playerId && pending.options.indexOf(inst.instanceId) !== -1) {
        el.classList.add('legal-target');
      }
      el.addEventListener('click', function () { self.onDiscardCardTap(playerId, inst); });
      cardRow.appendChild(el);
    });
  };

  BattleUI.prototype.renderBattleEvents = function () {
    var unseen = global.getBattleEventsSince ? global.getBattleEventsSince(this.state, this._lastBattleEventId || 0) : [];
    var self = this;
    unseen.forEach(function (event) {
      self._lastBattleEventId = Math.max(self._lastBattleEventId || 0, event.id);
      if (event.type === 'DAMAGE') { self._damageVectorQueue.push(event); }
    });
    if (!this._damageVectorActive) { this._showNextDamageVector(); }
  };

  BattleUI.prototype._showNextDamageVector = function () {
    var event = this._damageVectorQueue.shift();
    if (!event) { this._damageVectorActive = false; return; }
    var overlay = document.getElementById('damage-vector');
    var line = document.getElementById('damage-vector-line');
    var label = document.getElementById('damage-vector-label');
    if (!overlay || !line || !label) { this._damageVectorActive = false; return; }

    var source = document.querySelector('[data-instance-id="' + event.sourceInstanceId + '"]');
    var target = document.querySelector('[data-instance-id="' + event.targetInstanceId + '"]');
    var sourceRect = source && source.getBoundingClientRect ? source.getBoundingClientRect() : null;
    var targetRect = target && target.getBoundingClientRect ? target.getBoundingClientRect() : null;
    var viewportWidth = window.innerWidth || 390;
    var viewportHeight = window.innerHeight || 844;
    var startX = sourceRect ? sourceRect.left + sourceRect.width / 2 : viewportWidth / 2;
    var startY = sourceRect ? sourceRect.top + sourceRect.height / 2 : viewportHeight * 0.65;
    var endX = targetRect ? targetRect.left + targetRect.width / 2 : viewportWidth / 2;
    var endY = targetRect ? targetRect.top + targetRect.height / 2 : viewportHeight * 0.3;
    var dx = endX - startX;
    var dy = endY - startY;
    line.style.left = startX + 'px';
    line.style.top = startY + 'px';
    line.style.width = Math.sqrt(dx * dx + dy * dy) + 'px';
    line.style.transform = 'rotate(' + Math.atan2(dy, dx) + 'rad)';

    var names = (event.sourceName || '攻撃元') + ' → ' + (event.targetName || '攻撃対象');
    var damage = String(event.damage) + ' DAMAGE';
    if (event.colorMultiplier && event.colorMultiplier !== 1) {
      damage = event.baseDamage + ' ×' + event.colorMultiplier + ' = ' + event.damage + ' DAMAGE';
    }
    label.textContent = names + '\n' + damage;
    overlay.style.display = 'block';
    this._damageVectorActive = true;

    var self = this;
    setTimeout(function () {
      overlay.style.display = 'none';
      self._damageVectorActive = false;
      self._showNextDamageVector();
    }, 1100);
  };

  BattleUI.prototype.onDiscardCardTap = function (playerId, instance) {
    var pending = getPendingEffect(this.state);
    if (!pending || pending.type !== 'DISCARD_INSECT_SELECTION') {
      this.showCardDetail(instance, []);
      return;
    }
    if (pending.playerId !== playerId || pending.options.indexOf(instance.instanceId) === -1) return;
    try {
      global.resolveDiscardInsectSelection(this.state, playerId, instance.instanceId);
      this.render();
    } catch (e) {
      alert(e.message);
      this.render();
    }
  };

  BattleUI.prototype.setText = function (elId, text) {
    var el = document.getElementById(elId);
    if (el) { el.textContent = text; }
  };

  // ゾーンラベルへ枚数バッジを反映。zoneId (例: 'self-food-zone') -> 'self-food-count'
  BattleUI.prototype.setZoneCount = function (zoneId, count) {
    var el = document.getElementById(zoneId.replace(/-zone$/, '-count'));
    if (el) { el.textContent = count; }
  };

  BattleUI.prototype.renderControls = function () {
    var s = this.state;
    var btnMain = document.getElementById('btn-to-main');
    var btnEnd = document.getElementById('btn-end-turn');
    var btnSet = document.getElementById('btn-to-set');
    var btnDraw = document.getElementById('btn-draw');

    // CPUターン中は人間側の操作を無効化
    var isCpuTurn = this.cpuMode && s.activePlayerId === 'P2';
    var cardSelection=global.getPendingEffect(s);
    if(cardSelection&&cardSelection.type==='CARD_SELECTION'&&!isCpuTurn){
      if(btnSet)btnSet.style.display='none';if(btnMain)btnMain.style.display='none';if(btnDraw)btnDraw.style.display='none';
      if(btnEnd){btnEnd.style.display='block';btnEnd.textContent='選択を決定 ('+(cardSelection.selectedIds||[]).length+'/'+cardSelection.maxSelections+')';btnEnd.disabled=(cardSelection.selectedIds||[]).length<cardSelection.minSelections;}
      return;
    }
    if(btnEnd)btnEnd.textContent='ターン終了';

    if (s.phase === Phases.GAME_OVER) {
      if (btnSet) btnSet.style.display = 'none';
      if (btnMain) btnMain.style.display = 'none';
      if (btnEnd) btnEnd.style.display = 'none';
      if (btnDraw) btnDraw.style.display = 'none';
    } else if (s.phase === Phases.DRAW_PHASE) {
      // 手動ドロー表示: アクティブが手動ドロー対象の人間で、ドローすべき&未ドローならドローボタン
      var manualDraw = global.isManualDrawPlayer(s, s.activePlayerId) &&
                       global.expectsDraw(s, s.activePlayerId) &&
                       !s.drewThisTurn;
      if (btnDraw) {
        btnDraw.style.display = (manualDraw && !isCpuTurn) ? 'block' : 'none';
      }
      if (btnSet) {
        btnSet.style.display = isCpuTurn ? 'none' : (manualDraw ? 'none' : 'block');
        btnSet.disabled = isCpuTurn;
      }
      if (btnMain) btnMain.style.display = 'none';
      if (btnEnd) btnEnd.style.display = 'none';
    } else if (s.phase === Phases.SET_PHASE) {
      if (btnSet) btnSet.style.display = 'none';
      if (btnMain) btnMain.disabled = isCpuTurn;
      if (btnMain) btnMain.style.display = isCpuTurn ? 'none' : 'block';
      if (btnEnd) btnEnd.style.display = 'none';
      if (btnDraw) btnDraw.style.display = 'none';
    } else if (s.phase === Phases.MAIN_PHASE) {
      if (btnSet) btnSet.style.display = 'none';
      if (btnMain) btnMain.style.display = 'none';
      if (btnEnd) btnEnd.disabled = isCpuTurn;
      if (btnEnd) btnEnd.style.display = isCpuTurn ? 'none' : 'block';
      if (btnDraw) btnDraw.style.display = 'none';
    } else {
      if (btnSet) btnSet.style.display = 'none';
      if (btnMain) btnMain.style.display = 'none';
      if (btnEnd) btnEnd.style.display = 'none';
      if (btnDraw) btnDraw.style.display = 'none';
    }

    this.renderAttackButtons();
  };

  // 攻撃キャンセル・直接攻撃ボタンの表示制御
  BattleUI.prototype.renderAttackButtons = function () {
    var st = this.actionState;
    var isAttackMode = st.mode === 'attackTarget' || st.mode === 'selectSkill' ||
      st.mode === 'sacrificeTarget' || st.mode === 'colorPicker';
    var btnDirect = document.getElementById('btn-direct-attack');
    var btnCancel = document.getElementById('btn-cancel-attack');

    // 直接攻撃: attackTargetモードでLEADERが合法対象にある場合のみ表示
    var hasLeader = false;
    if (st.mode === 'attackTarget' && st.legalTargets) {
      hasLeader = st.legalTargets.some(function (t) { return t.targetType === 'LEADER'; });
    }
    btnDirect.style.display = hasLeader ? 'block' : 'none';
    btnCancel.style.display = isAttackMode ? 'block' : 'none';
  };

BattleUI.prototype.renderPendingEffect = function (state) {
    var pending = getPendingEffect(state);
    var statusText = document.getElementById('status-text');
    if (!statusText) return;

    // 縄張り選択ピッカーの表示/非表示を常に同期する（pending解除・GAME_OVER等で必ず閉じる）
    this._syncTerritoryPicker(pending);

    if (!pending) {
      if (statusText.textContent === 'あなたの縄張りを1枚選択してください' ||
          statusText.textContent === 'とびだすを使用するか選択してください' ||
          statusText.textContent === '術の対象にする相手の虫を選択してください' ||
          statusText.textContent === 'あなたの行動待ちです' ||
          statusText.textContent === 'CPUが選択中...') {
        statusText.textContent = '';
      }
      return;
    }

    var activeHumanId = this.cpuMode ? 'P1' : state.activePlayerId;
    if (pending.playerId === activeHumanId) {
      if (pending.type === 'TERRITORY_DRAW_SELECTION') {
        statusText.textContent = 'あなたの縄張りを1枚選択してください';
      } else if (pending.type === 'DISCARD_INSECT_SELECTION') {
        statusText.textContent = '手札に戻す虫を捨て場から選択してください';
      } else if (pending.type === 'SPELL_TARGET_SELECTION') {
        statusText.textContent = '術の対象にする相手の虫を選択してください';
      } else if (pending.type === 'TERRITORY_DRAW_CHOICE') {
        statusText.textContent = 'とびだすを使用するか選択してください';
        this.showTerritoryChoiceModal(pending);
      } else {
        statusText.textContent = 'あなたの行動待ちです';
      }
    } else {
      statusText.textContent = 'CPUが選択中...';
    }
  };

  // この端末で人が解決すべき縄張りドロー選択か判定する。
  // CPU戦: P1だけが人間(P2はCPUが自動解決)。Hotseat/チュートリアル: どちらのplayerIdも人間が解決する。
  BattleUI.prototype._resolveTerritoryPickerPending = function (pending) {
    if (!pending || pending.type !== 'TERRITORY_DRAW_SELECTION') {
      return null;
    }
    if (this.cpuMode && pending.playerId !== 'P1') {
      return null;
    }
    return pending;
  };

  // 縄張り選択ピッカーの表示/非表示を同期する。Battle viewportのgridサイズには一切影響しない。
  BattleUI.prototype._syncTerritoryPicker = function (pending) {
    var picker = document.getElementById('territory-picker');
    var cardsEl = document.getElementById('territory-picker-cards');
    if (!picker || !cardsEl) return;

    var target = this._resolveTerritoryPickerPending(pending);
    if (!target) {
      picker.style.display = 'none';
      cardsEl.innerHTML = '';
      return;
    }

    var player = this.state.player(target.playerId);
    var territory = player ? (player.territory || []) : [];
    cardsEl.innerHTML = '';
    var self = this;
    territory.forEach(function (inst) {
      cardsEl.appendChild(self._buildTerritoryPickerCard(target.playerId, inst));
    });

    var title = document.getElementById('territory-picker-title');
    if (title) {
      title.textContent = '縄張りを1枚選択してください（現在 ' + territory.length + '枚）';
    }
    picker.style.display = 'flex';
  };

  // ピッカー用カード1枚。横スクロール/内部scrollで全枚タップ可能サイズを確保する。
  // 裏向き→カードバック、表向き(例:《蜜蝋の壁》)→faceup表示。
  BattleUI.prototype._buildTerritoryPickerCard = function (playerId, inst) {
    var self = this;
    var el;
    if (inst.faceDown) {
      el = CardUI.renderFaceDown(function (i) {
        self.onTerritoryCardTap(playerId, i);
      }, inst);
      el.classList.add('territory-picker__card', 'territory-picker__card--back');
      return el;
    }

    var def = CardUI.getDef(inst);
    el = document.createElement('button');
    el.type = 'button';
    el.className = 'territory-picker__card territory-picker__card--up ' + (CardUI.colorClass ? CardUI.colorClass(def) : '');
    el.dataset.instanceId = inst.instanceId;
    el.addEventListener('click', function () {
      self.onTerritoryCardTap(playerId, inst);
    });

    var name = document.createElement('span');
    name.className = 'territory-picker__up-name';
    name.textContent = CardUI.shortName ? CardUI.shortName(def) : (def && def.name ? def.name : '?');
    el.appendChild(name);

    var type = document.createElement('span');
    type.className = 'territory-picker__up-type';
    type.textContent = territoryTypeLabel(def);
    el.appendChild(type);
    return el;
  };

  BattleUI.prototype.showTerritoryChoiceModal = function (pending) {
    if (this._handlingChoice) return;
    this._handlingChoice = true;
    var self = this;
    var card = findAnywhere(this.state, pending.cardInstanceId).instance;
    var def = CardUI.getDef(card);
    var cardName = def ? def.name : 'カード';

    setTimeout(function () {
      var useTobidasu = confirm(cardName + ' の ＜とびだす＞ を使用しますか？\n「キャンセル」で手札に加えます。');
      var choice = useTobidasu ? 'USE_TOBIDASU' : 'TAKE_TO_HAND';
      try {
        resolvePendingTerritoryChoice(self.state, choice);
        self._handlingChoice = false;
        self.render();
      } catch (e) {
        alert(e.message);
        self._handlingChoice = false;
        self.render();
      }
    }, 100);
  };

  BattleUI.prototype.onHandCardTap = function (playerId, instance) {
    if (this.actionState.mode === 'colorPicker') return;
    if (!this._tutorialAllows('HAND_CARD', { instanceId: instance.instanceId })) return;
    // CPUターン中は人間側の操作を無効化
    if (this.cpuMode && this.state.activePlayerId === 'P2') {
      return;
    }
    var pending = getPendingEffect(this.state);
    if (pending) {
      if (pending.type === 'CARD_SELECTION' && pending.playerId === playerId && pending.options.indexOf(instance.instanceId) !== -1) { global.selectPendingCard(this.state,playerId,instance.instanceId);this.render(); }
      if (pending.type === 'SPELL_TARGET_SELECTION' && pending.playerId === playerId && pending.options.indexOf(instance.instanceId) !== -1) {
        global.resolveSpellTargetSelection(this.state, playerId, instance.instanceId); this.render();
      }
      return;
    }

    var self = this;
    var def = CardUI.getDef(instance) || {};

    var isActive = this.state.activePlayerId === playerId;
    var actions = [];

    if (isActive && this.state.phase === Phases.SET_PHASE) {
      actions.push({
        label: 'エサにする',
        onSelect: function () {
          try {
            setFood(self.state, playerId, instance.instanceId);
            self.render();
          } catch (e) {
            alert(e.message);
            self.render();
          }
        }
      });
    } else if (isActive && this.state.phase === Phases.MAIN_PHASE) {
      if (def.type === CardTypes.INSECT) {
        actions.push({
          label: '場に出す (コスト ' + (def.cost != null ? def.cost : 0) + ')',
          onSelect: function () {
            try {
              summonInsect(self.state, playerId, instance.instanceId);
              self.render();
            } catch (e) {
              alert(e.message);
              self.render();
            }
          }
        });
      } else if (def.type === CardTypes.SPELL) {
        actions.push({
          label: '術を使う (コスト ' + (def.cost != null ? def.cost : 0) + ')',
          onSelect: function () {
            try {
              useSpell(self.state, playerId, instance.instanceId);
              self.hideCardDetail();
              self.render();
            } catch (e) {
              alert(e.message);
              self.render();
            }
          }
        });
      } else if (def.type === CardTypes.ENHANCEMENT) {
        actions.push({
          label: '強化する (コスト ' + (def.cost != null ? def.cost : 0) + ')',
          onSelect: function () {
            self.beginEnhancementTargetSelection(playerId, instance);
            self.hideCardDetail();
          }
        });
      }
    }

    this.showCardDetail(instance, actions);
  };

  BattleUI.prototype.onFieldCardTap = function (playerId, instance, el) {
    var tutorialAction = this.actionState.mode === 'attackTarget' ? 'ATTACK_TARGET' :
      (this.actionState.mode === 'enhanceTarget' ? 'ENHANCEMENT_TARGET' : 'FIELD_CARD');
    if (!this._tutorialAllows(tutorialAction, { instanceId: instance.instanceId })) return;
    // CPUターン中は人間側の操作を無効化
    if (this.cpuMode && this.state.activePlayerId === 'P2') {
      return;
    }
    var pending = getPendingEffect(this.state);
    if (pending) {
      if (pending.type === 'CARD_SELECTION' && pending.playerId === playerId && pending.options.indexOf(instance.instanceId) !== -1) { try { global.selectPendingCard(this.state,playerId,instance.instanceId); this.render(); } catch(e) { alert(e.message); } return; }
      if (pending.type === 'SPELL_TARGET_SELECTION' && pending.playerId === this.state.activePlayerId &&
          pending.options.indexOf(instance.instanceId) !== -1) {
        try {
          global.resolveSpellTargetSelection(this.state, pending.playerId, instance.instanceId);
          this.render();
        } catch (e) {
          alert(e.message);
          this.render();
        }
      }
      return;
    }

    var self = this;
    var st = this.actionState;
    var activeId = this.state.activePlayerId;

    if (st.mode === 'colorPicker') return;

    if (st.mode === 'sacrificeTarget') {
      this.onSacrificeTargetTap(playerId, instance);
      return;
    }

    // 強化対象選択中 (enhanceTarget モード) の場合
    if (st.mode === 'enhanceTarget') {
      this.onEnhancementTargetTap(playerId, instance);
      return;
    }

    // 攻撃対象選択中 (attackTarget モード) の場合 → 自分の虫タップは無視
    if (st.mode === 'attackTarget') {
      // 相手の虫をタップした場合
      if (playerId !== activeId) {
        var targets = st.legalTargets.filter(function (t) {
          return t.targetType === 'INSECT' && t.instance.instanceId === instance.instanceId;
        });
        if (targets.length > 0) {
          this.confirmAttack(targets[0]);
        } else {
          alert('その虫は攻撃対象に選択できません');
        }
      }
      return;
    }

    // スキル選択中は無視
    if (st.mode === 'selectSkill') {
      return;
    }

    // メインフェイズ以外は詳細表示のみ
    if (this.state.phase !== Phases.MAIN_PHASE) {
      this.showCardDetail(instance, []);
      return;
    }

    // 相手の虫をタップした場合 → 詳細表示のみ
    if (playerId !== activeId) {
      this.showCardDetail(instance, []);
      return;
    }

    // --- ここから自分の虫をタップ → 攻撃者選択 ---
    var continuous = instance.runtimeFlags && instance.runtimeFlags.continuousAttack;
    var hasContinuous = !!(continuous && continuous.usedCount < continuous.maxCount);
    if (instance.attackedThisTurn && !hasContinuous) {
      alert('この蟲は既に攻撃済みです');
      return;
    }

    var def = CardUI.getDef(instance);
    if (!def) return;

    // 連撃中は同じ技だけを使用する。
    var attackSkills = (def.skills || []).filter(function (s) {
      return s.timing === 'ATTACK' && (!hasContinuous || s.id === continuous.skillId);
    });
    if (attackSkills.length === 0) {
      alert('攻撃技がありません');
      return;
    }

    // 既存の攻撃者選択を解除してから新規選択
    this.clearAttackerHighlight();

    // 攻撃者を記録
    st.attackerInstanceId = instance.instanceId;
    st.legalTargets = [];

    // 選択中ビジュアル
    if (el) {
      el.classList.add('selected-attacker');
      this._selectedAttackerEl = el;
    }

    // ATTACK技が1つだけ → 自動選自動選択して対象選択へ
    if (attackSkills.length === 1) {
      st.skillId = attackSkills[0].id;
      this.beginAttackTargetSelection(playerId, instance);
      return;
    }

    // ATTACK技が2つ以上 → ユーザーに技を選択させる
    st.mode = 'selectSkill';
    st.skillId = null;
    document.getElementById('status-text').textContent = def.name + ' - 攻撃技を選択してください';
    this.renderAttackButtons();

    // スキル選択ボタンを動的生成
    var skillRow = document.getElementById('skill-select-row');
    skillRow.innerHTML = '';
    attackSkills.forEach(function (skill) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'skill-select-btn';
      btn.textContent = skill.name + ' (AP' + (skill.baseAp || 0) + ')';
      btn.addEventListener('click', function () {
        self.onSkillSelect(skill.id, playerId, instance);
      });
      skillRow.appendChild(btn);
    });
    skillRow.style.display = 'flex';
  };

  BattleUI.prototype.onTerritoryZoneTap = function (playerId, role) {
    if (!this._tutorialAllows('DIRECT_ATTACK')) return;
    var st = this.actionState;
    if (st.mode !== 'attackTarget') { return; }
    var leader = st.legalTargets.filter(function (t) { return t.targetType === 'LEADER'; })[0];
    if (leader) {
      this.confirmAttack(leader);
    }
  };

  // 防御側の縄張り選択
  BattleUI.prototype.onTerritoryCardTap = function (playerId, territoryInstance) {
    var pending = getPendingEffect(this.state);
    if (!pending || pending.type !== 'TERRITORY_DRAW_SELECTION') {
      return;
    }
    if (pending.playerId !== playerId) {
      return; // 被害を受けたプレイヤーの縄張りだけ選択可能
    }

    try {
      resolveTerritoryDrawSelection(this.state, playerId, territoryInstance.instanceId);
      this.render();
    } catch (e) {
      alert(e.message);
    }
  };

  // スキル選択完了 → 対象選択へ
  BattleUI.prototype.onSkillSelect = function (skillId, playerId, instance) {
    if (!this._tutorialAllows('SKILL', { instanceId: instance.instanceId, skillId: skillId })) return;
    var st = this.actionState;
    st.mode = 'attacking';
    st.skillId = skillId;
    document.getElementById('skill-select-row').style.display = 'none';
    document.getElementById('skill-select-row').innerHTML = '';
    this.beginAttackTargetSelection(playerId, instance);
  };

  // 本体直接攻撃ボタン
  BattleUI.prototype.onDirectAttack = function () {
    if (this.actionState.mode === 'colorPicker') return;
    if (!this._tutorialAllows('DIRECT_ATTACK')) return;
    var st = this.actionState;
    var leaderTarget = null;
    if (st.legalTargets) {
      for (var i = 0; i < st.legalTargets.length; i++) {
        if (st.legalTargets[i].targetType === 'LEADER') {
          leaderTarget = st.legalTargets[i];
          break;
        }
      }
    }
    if (leaderTarget) {
      this.confirmAttack(leaderTarget);
    }
  };

  // 攻撃取消
  BattleUI.prototype.cancelAttack = function () {
    // 強化対象・色選択中のキャンセル
    if (this.actionState.mode === 'enhanceTarget' || this.actionState.mode === 'colorPicker') {
      this.cancelEnhancementMode();
      return;
    }
    if (this.actionState.mode === 'sacrificeTarget') {
      this.cancelSacrificeMode();
      return;
    }
    this.clearAttackerHighlight();
    this.actionState.mode = 'idle';
    this.actionState.attackerInstanceId = null;
    this.actionState.skillId = null;
    this.actionState.legalTargets = [];
    this.actionState.pendingAttackTarget = null;
    this.actionState.sacrificeCandidates = null;
    var skillRow = document.getElementById('skill-select-row');
    if (skillRow) { skillRow.style.display = 'none'; skillRow.innerHTML = ''; }
    this.hideColorPicker();
    this.renderAttackButtons();
    document.getElementById('status-text').textContent = '';
  };

  // 選択中攻撃者ハイライト解除
  BattleUI.prototype.clearAttackerHighlight = function () {
    if (this._selectedAttackerEl) {
      this._selectedAttackerEl.classList.remove('selected-attacker');
      this._selectedAttackerEl = null;
    }
  };

  // 強化対象選択開始
  BattleUI.prototype.beginEnhancementTargetSelection = function (playerId, enhancement) {
    var st = this.actionState;
    var def = CardUI.getDef(enhancement);
    if (!def) return;

    // 合法対象: 自分の場の表向きの虫
    var player = this.state.player(playerId);
    var legalTargets = player.field.filter(function (c) { return !c.faceDown; });
    if (legalTargets.length === 0) {
      alert('強化対象の虫がいません');
      return;
    }

    st.mode = 'enhanceTarget';
    st.enhancementInstanceId = enhancement.instanceId;
    st.enhancementDef = def;
    st.legalTargets = legalTargets.map(function (c) { return c.instanceId; });

    // ハイライト
    document.querySelectorAll('.field-card').forEach(function (el) { el.classList.remove('legal-target'); });
    legalTargets.forEach(function (c) {
      var el = document.querySelector('[data-instance-id="' + c.instanceId + '"]');
      if (el) el.classList.add('legal-target');
    });

    document.getElementById('btn-cancel-attack').style.display = 'block';
    document.getElementById('status-text').textContent = '強化する対象の蟲を選択してください';
  };

  // 強化対象タップ
  BattleUI.prototype.onEnhancementTargetTap = function (playerId, instance) {
    if (!this._tutorialAllows('ENHANCEMENT_TARGET', { instanceId: instance.instanceId })) return;
    var st = this.actionState;
    if (st.mode !== 'enhanceTarget') { return; }
    if (playerId !== this.state.activePlayerId) { return; }
    if (st.legalTargets.indexOf(instance.instanceId) === -1) {
      alert('この蟲には強化カードを装着できません');
      return;
    }

    var enhInstanceId = st.enhancementInstanceId;
    var def = st.enhancementDef;
    var colorEffect = null;
    (def && def.enhancementEffects || []).some(function (effect) {
      if (effect && effect.type === 'COLOR_OVERRIDE' && effect.colors && effect.colors.length) {
        colorEffect = effect;
        return true;
      }
      return false;
    });
    if (colorEffect) {
      this.beginColorSelection(enhInstanceId, instance.instanceId, colorEffect.colors);
      return;
    }
    this.cancelEnhancementMode();

    try {
      useEnhancement(this.state, playerId, enhInstanceId, instance.instanceId);
      this.render();
    } catch (e) {
      alert(e.message);
      this.render();
    }
  };

  BattleUI.prototype.beginColorSelection = function (enhInstanceId, targetInstanceId, colors) {
    var self = this;
    var st = this.actionState;
    st.mode = 'colorPicker';
    st.pendingEnh = { enhInstanceId: enhInstanceId, targetInstanceId: targetInstanceId, colors: colors.slice() };
    var row = document.getElementById('color-select-row') || document.getElementById('skill-select-row');
    if (row) {
      row.innerHTML = '';
      row.classList.add('color-select-active');
      colors.forEach(function (color) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'color-btn color-btn-' + String(color).toLowerCase();
        button.textContent = self._colorJa(color);
        button.addEventListener('click', function () { self.onColorSelect(color); });
        row.appendChild(button);
      });
      row.style.display = 'flex';
    }
    var status = document.getElementById('status-text');
    if (status) status.textContent = '色を選択してください';
    this.renderAttackButtons();
  };

  BattleUI.prototype._colorJa = function (color) {
    var labels = {};
    labels[Attributes.RED] = '赤';
    labels[Attributes.BLUE] = '青';
    labels[Attributes.GREEN] = '緑';
    return labels[color] || color;
  };

  BattleUI.prototype.onColorSelect = function (color) {
    var st = this.actionState;
    if (st.mode !== 'colorPicker' || !st.pendingEnh || st.pendingEnh.colors.indexOf(color) === -1) return;
    var pending = st.pendingEnh;
    var playerId = this.state.activePlayerId;
    this.cancelEnhancementMode();
    try {
      global.useEnhancement(this.state, playerId, pending.enhInstanceId, pending.targetInstanceId, color);
      this.render();
    } catch (e) {
      alert(e.message);
      this.render();
    }
  };

  BattleUI.prototype.hideColorPicker = function () {
    var row = document.getElementById('color-select-row') || document.getElementById('skill-select-row');
    if (row) { row.classList.remove('color-select-active'); row.style.display = 'none'; row.innerHTML = ''; }
  };

  // 強化モード解除(キャンセル・完了時にハイライトをクリア)
  BattleUI.prototype.cancelEnhancementMode = function () {
    var st = this.actionState;
    st.mode = 'idle';
    st.enhancementInstanceId = null;
    st.enhancementDef = null;
    st.legalTargets = [];
    st.pendingEnh = null;
    this.hideColorPicker();
    document.querySelectorAll('.legal-target').forEach(function (el) { el.classList.remove('legal-target'); });
    document.getElementById('btn-cancel-attack').style.display = 'none';
    document.getElementById('status-text').textContent = '';
  };

  BattleUI.prototype.beginAttackTargetSelection = function (playerId, attacker) {
    var targets = getLegalAttackTargets(this.state, attacker.instanceId);
    if (targets.length === 0) {
      alert('攻撃対象が存在しません');
      return;
    }
    this.actionState.mode = 'attackTarget';
    this.actionState.legalTargets = targets;

    // ハイライト: 相手の虫
    var allField = document.querySelectorAll('.field-card');
    allField.forEach(function (el) {
      el.classList.remove('legal-target');
    });
    targets.forEach(function (t) {
      if (t.targetType === 'INSECT') {
        var targetEl = document.querySelector('[data-instance-id="' + t.instance.instanceId + '"]');
        if (targetEl) targetEl.classList.add('legal-target');
      }
    });

    // 直接攻撃(LEADER)が合法ならボタンを表示
    var hasLeader = targets.some(function (t) { return t.targetType === 'LEADER'; });
    if (hasLeader) {
      document.getElementById('opp-territory-zone').classList.add('legal-leader-target');
    }

    this.renderAttackButtons();
    document.getElementById('status-text').textContent = '攻撃対象を選択してください';
  };

  BattleUI.prototype.confirmAttack = function (target) {
    var st = this.actionState;
    var attackerId = st.attackerInstanceId;
    var skillId = st.skillId;
    var holder = attackerId ? findAnywhere(this.state, attackerId) : null;
    var def = holder ? CardUI.getDef(holder.instance) : null;
    var skill = (def && def.skills || []).filter(function (candidate) {
      return candidate.id === skillId && candidate.timing === 'ATTACK';
    })[0];
    if (skill && global.skillRequiresSacrifice(skill)) {
      this.beginSacrificeTargetSelection(target);
      return;
    }
    this.resolveAttack(target, null);
  };

  BattleUI.prototype.resolveAttack = function (target, chosenSacrificeInstanceId) {
    var st = this.actionState;
    var attackerId = st.attackerInstanceId;
    var skillId = st.skillId;
    var targetId = target.targetType === 'LEADER' ? null : target.instance.instanceId;
    try {
      var result = global.performAttack(this.state, attackerId, targetId, target.targetType, skillId, chosenSacrificeInstanceId);
      if (result && result.continuousAttackAvailable) {
        st.mode = 'attackTarget';
        st.attackerInstanceId = attackerId;
        st.skillId = skillId;
        st.pendingAttackTarget = null;
        st.sacrificeCandidates = null;
        st.legalTargets = global.getLegalAttackTargets(this.state, attackerId);
        this.render();
        this.beginAttackTargetSelection(this.state.activePlayerId, result.attacker);
        var status = document.getElementById('status-text');
        if (status) status.textContent = 'カマ連撃：2回目の攻撃対象を選択してください';
        return;
      }
      this.finishAttackSelection();
      this.render();
    } catch (e) {
      this.finishAttackSelection();
      alert(e.message);
      this.render();
    }
  };

  BattleUI.prototype.finishAttackSelection = function () {
    var st = this.actionState;
    st.mode = 'idle';
    st.attackerInstanceId = null;
    st.skillId = null;
    st.legalTargets = [];
    st.pendingAttackTarget = null;
    st.sacrificeCandidates = null;
    this.clearAttackerHighlight();
    document.querySelectorAll('.legal-target').forEach(function (el) { el.classList.remove('legal-target'); });
    document.querySelectorAll('.legal-leader-target').forEach(function (el) { el.classList.remove('legal-leader-target'); });
    var row = document.getElementById('skill-select-row');
    if (row) { row.style.display = 'none'; row.innerHTML = ''; }
    this.hideColorPicker();
    this.renderAttackButtons();
  };

  BattleUI.prototype.beginSacrificeTargetSelection = function (target) {
    var st = this.actionState;
    var candidates = global.getSacrificeCandidates(this.state, st.attackerInstanceId);
    if (!candidates.length) {
      alert('追加コストの自虫破壊に十分な虫がいません');
      this.cancelAttack();
      return;
    }
    st.mode = 'sacrificeTarget';
    st.pendingAttackTarget = target;
    st.sacrificeCandidates = candidates.map(function (candidate) { return candidate.instanceId; });
    candidates.forEach(function (candidate) {
      var el = document.querySelector('[data-instance-id="' + candidate.instanceId + '"]');
      if (el) el.classList.add('legal-target');
    });
    var status = document.getElementById('status-text');
    if (status) status.textContent = '共食い：破壊する自虫を選択してください';
    this.renderAttackButtons();
  };

  BattleUI.prototype.onSacrificeTargetTap = function (playerId, instance) {
    var st = this.actionState;
    if (st.mode !== 'sacrificeTarget' || playerId !== this.state.activePlayerId) return;
    if (st.sacrificeCandidates.indexOf(instance.instanceId) === -1) {
      alert('この蟲は犠牲対象に選択できません');
      return;
    }
    this.resolveAttack(st.pendingAttackTarget, instance.instanceId);
  };

  BattleUI.prototype.cancelSacrificeMode = function () {
    this.finishAttackSelection();
    var status = document.getElementById('status-text');
    if (status) status.textContent = '';
  };

  BattleUI.prototype.onEndTurn = function () {
    if (this.actionState.mode === 'colorPicker') return;
    if (!this._tutorialAllows('END_TURN')) return;
    // CPUターン中は人間側の操作を無効化
    if (this.cpuMode && this.state.activePlayerId === 'P2') {
      return;
    }
    this.cancelAttack();

    var pending = getPendingEffect(this.state);
    if (pending) {
      alert('選択待ちの処理があります');
      return;
    }
    try {
      endTurn(this.state);
      this.render();
      this.showPassOverlay();
    } catch (e) {
      alert(e.message);
    }
  };

  BattleUI.prototype.onDraw = function () {
    if (this.actionState.mode === 'colorPicker') return;
    if (!this._tutorialAllows('DRAW')) return;
    // CPUターン中は人間側の操作を無効化
    if (this.cpuMode && this.state.activePlayerId === 'P2') {
      return;
    }
    try {
      global.drawCardOnce(this.state, this.state.activePlayerId);
      this.render();
    } catch (e) {
      alert(e.message);
      this.render();
    }
  };

  BattleUI.prototype.onToSetPhase = function () {
    if (this.actionState.mode === 'colorPicker') return;
    // CPUターン中は人間側の操作を無効化
    if (this.cpuMode && this.state.activePlayerId === 'P2') {
      return;
    }
    this.cancelAttack();

    try {
      enterSetPhase(this.state);
      this.render();
    } catch (e) {
      alert(e.message);
    }
  };

  BattleUI.prototype.onToMainPhase = function () {
    if (this.actionState.mode === 'colorPicker') return;
    if (!this._tutorialAllows('ENTER_MAIN')) return;
    // CPUターン中は人間側の操作を無効化
    if (this.cpuMode && this.state.activePlayerId === 'P2') {
      return;
    }
    this.cancelAttack();

    try {
      enterMainPhase(this.state);
      this.render();
    } catch (e) {
      alert(e.message);
    }
  };

  BattleUI.prototype.showPassOverlay = function () {
    var activeId = this.state.activePlayerId;
    var label = activeId === 'P1' ? 'P1 のターン' : 'P2 のターン';
    document.getElementById('pass-message').textContent = label + ' です。端末を渡してください。';
    document.getElementById('pass-overlay').style.display = 'flex';
  };

  BattleUI.prototype.hidePassOverlay = function () {
    document.getElementById('pass-overlay').style.display = 'none';
  };

  // カード詳細モーダル
  BattleUI.prototype._detailInstanceId = null;

  BattleUI.prototype.showCardDetail = function (instance, actions) {
    this._detailInstanceId = instance.instanceId;
    var detail = CardUI.getCardDetail(instance, this.state);
    if (!detail) return;

    var modal = document.getElementById('card-detail-modal');
    var content = document.getElementById('card-detail-content');
    var actionsEl = document.getElementById('card-detail-actions');

    content.innerHTML = '';
    actionsEl.innerHTML = '';

    // 基本情報
    var nameEl = document.createElement('div');
    nameEl.className = 'detail-name';
    nameEl.textContent = detail.name;
    content.appendChild(nameEl);

    var meta = document.createElement('div');
    meta.className = 'detail-meta';
    var shownColor = detail.colorChanged ? detail.color + ' → ' + detail.effectiveColor : detail.color;
    var typeColor = detail.type + ' | ' + shownColor + ' | コスト: ' + detail.cost;
    meta.textContent = typeColor;
    content.appendChild(meta);

    if (detail.baseHp != null) {
      var hp = document.createElement('div');
      hp.className = 'detail-hp';
      hp.textContent = 'HP: ' + detail.currentHp + ' / ' + detail.effectiveMaxHp;
      if (detail.hpBonus) hp.textContent += '（基本' + detail.baseHp + ' ' + (detail.hpBonus > 0 ? '+' : '') + detail.hpBonus + '）';
      content.appendChild(hp);
    }

    if (detail.attachments && detail.attachments.length) {
      var attached = document.createElement('div');
      attached.className = 'detail-attachments';
      attached.textContent = '装着中: ' + detail.attachments.join('、');
      content.appendChild(attached);
    }

    if ((detail.apModifierSources && detail.apModifierSources.length) || (detail.hpModifierSources && detail.hpModifierSources.length)) {
      var sources = document.createElement('div');
      sources.className = 'detail-modifier-sources';
      var sourceText = [];
      if (detail.apModifierSources.length) sourceText.push('AP補正: ' + detail.apModifierSources.join('、'));
      if (detail.hpModifierSources.length) sourceText.push('HP補正: ' + detail.hpModifierSources.join('、'));
      sources.textContent = sourceText.join(' / ');
      content.appendChild(sources);
    }

    if (detail.skills && detail.skills.length > 0) {
      var skillTitle = document.createElement('div');
      skillTitle.className = 'detail-section-title';
      skillTitle.textContent = '技';
      content.appendChild(skillTitle);

      detail.skills.forEach(function (s) {
        var sk = document.createElement('div');
        sk.className = 'detail-skill';
        var text = s.name;
        if (s.timing === 'ATTACK') {
          var shownAp = s.effectiveAp != null ? s.effectiveAp : (s.baseAp != null ? s.baseAp : 0);
          text += ' (AP ' + shownAp + ')';
          if (s.apBonus) text += '（基本' + (s.baseAp || 0) + ' + 強化' + s.apBonus + '）';
        }
        if (s.effectText) text += ': ' + s.effectText;
        if (s.optional) text += ' [任意]';
        sk.textContent = text;
        content.appendChild(sk);
      });
    }

    if (detail.traits && detail.traits.length > 0) {
      var traitTitle = document.createElement('div');
      traitTitle.className = 'detail-section-title';
      traitTitle.textContent = '特性';
      content.appendChild(traitTitle);

      detail.traits.forEach(function (t) {
        var tr = document.createElement('div');
        tr.className = 'detail-trait';
        var text = t.name;
        if (t.effectText) text += ': ' + t.effectText;
        tr.textContent = text;
        content.appendChild(tr);
      });
    }

    // passiveAbilities (常在効果)
    if (detail.passiveAbilities && detail.passiveAbilities.length > 0) {
      var paTitle = document.createElement('div');
      paTitle.className = 'detail-section-title';
      paTitle.textContent = '常在効果';
      content.appendChild(paTitle);

      detail.passiveAbilities.forEach(function (pa) {
        var el = document.createElement('div');
        el.className = 'detail-passive';
        var text = pa.name || '常在効果';
        if (pa.effectText) text += ': ' + pa.effectText;
        el.textContent = text;
        content.appendChild(el);
      });
    }

    // cardEffects (術・強化の効果)
    if (detail.cardEffects && detail.cardEffects.length > 0) {
      var ceTitle = document.createElement('div');
      ceTitle.className = 'detail-section-title';
      ceTitle.textContent = '効果';
      content.appendChild(ceTitle);
      detail.cardEffects.forEach(function (ce) {
        var el = document.createElement('div');
        el.className = 'detail-effect';
        el.textContent = ce.text || ce.description || '効果';
        content.appendChild(el);
      });
    }

    // enhancementEffects (強化)
    if (detail.enhancementEffects && detail.enhancementEffects.length > 0) {
      var eeTitle = document.createElement('div');
      eeTitle.className = 'detail-section-title';
      eeTitle.textContent = '強化効果';
      content.appendChild(eeTitle);
      detail.enhancementEffects.forEach(function (ee) {
        var el = document.createElement('div');
        el.className = 'detail-enhance';
        el.textContent = ee.text || ee.description || '強化';
        content.appendChild(el);
      });
    }

    // rulings
    if (detail.rulings && detail.rulings.length > 0) {
      var rTitle = document.createElement('div');
      rTitle.className = 'detail-section-title';
      rTitle.textContent = '裁定';
      content.appendChild(rTitle);
      detail.rulings.forEach(function (r) {
        var el = document.createElement('div');
        el.className = 'detail-ruling';
        el.textContent = r;
        content.appendChild(el);
      });
    }

    if (detail.biologicalNote) {
      var bio = document.createElement('div');
      bio.className = 'detail-bio';
      bio.textContent = detail.biologicalNote;
      content.appendChild(bio);
    }

    // アクションボタン
    actions.forEach(function (a) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'detail-action-btn';
      btn.textContent = a.label;
      btn.addEventListener('click', function () {
        a.onSelect();
      });
      actionsEl.appendChild(btn);
    });

    modal.style.display = 'flex';
  };

  BattleUI.prototype.hideCardDetail = function () {
    this._detailInstanceId = null;
    var selected = document.querySelectorAll ? document.querySelectorAll('.selected-hand-card') : [];
    for (var i = 0; i < selected.length; i++) selected[i].classList.remove('selected-hand-card');
    document.getElementById('card-detail-modal').style.display = 'none';
  };

  /* -------------------------------------------------------
     Layout metrics: 実測ヘルパー（Safari実機デバッグ用）
     getBoundingClientRect / scrollHeight / innerHeight を収集し
     #layout-metrics に短いサマリを書き込む。
     ------------------------------------------------------- */
  BattleUI.prototype.measureLayout = function () {
    var doc = global.document || null;
    var win = typeof window !== 'undefined' ? window : null;
    var root = doc && doc.querySelector ? (doc.querySelector('.battle-viewport') || doc.querySelector('.mobile-frame')) : null;
    var safeRect = function (node) {
      if (!node || typeof node.getBoundingClientRect !== 'function') return null;
      try { var r = node.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, height: r.height }; }
      catch (_e) { return null; }
    };
    var metrics = {
      innerHeight: win ? win.innerHeight : null,
      docScrollHeight: doc && doc.documentElement ? doc.documentElement.scrollHeight : null,
      bodyScrollHeight: doc && doc.body ? doc.body.scrollHeight : null,
      viewportRect: safeRect(root),
      zones: {},
      lastElementBottom: null,
      ok: false,
      summary: ''
    };
    var ids = ['zone-top','zone-bottom','self-field-zone','opp-field-zone',
      'self-hand-zone','opp-hand-zone','self-territory-zone','opp-territory-zone',
      'self-food-zone','opp-food-zone','self-discard-zone','opp-discard-zone',
      'self-deck-zone','opp-deck-zone'];
    var maxBottom = 0;
    for (var i = 0; i < ids.length; i++) {
      var el = doc && doc.getElementById ? doc.getElementById(ids[i]) : null;
      var rect = safeRect(el);
      if (rect) { metrics.zones[ids[i]] = rect; if (rect.bottom > maxBottom) maxBottom = rect.bottom; }
    }
    var logRect = safeRect(doc && doc.querySelector ? doc.querySelector('.log-section') : null);
    if (logRect && logRect.bottom > maxBottom) maxBottom = logRect.bottom;
    var controlRect = safeRect(doc && doc.querySelector ? doc.querySelector('.control-bar') : null);
    if (controlRect && controlRect.bottom > maxBottom) maxBottom = controlRect.bottom;
    metrics.lastElementBottom = maxBottom || null;

    metrics.ok = metrics.viewportRect !== null && metrics.viewportRect.height <= (metrics.innerHeight || Infinity) && (metrics.lastElementBottom || 0) <= (metrics.innerHeight || Infinity);
    metrics.summary = 'VH:' + (metrics.innerHeight || '?') + ' ROOT:' + (metrics.viewportRect ? Math.round(metrics.viewportRect.height) : '?') + ' SCROLL:' + (metrics.docScrollHeight || '?') + (metrics.ok ? ' OK' : ' !!');
    return metrics;
  };

  BattleUI.prototype._renderLayoutMetrics = function () {
    if (typeof global.document === 'undefined' || !global.document.getElementById) return;
    try {
      var m = this.measureLayout();
      var indicator = global.document.getElementById('layout-metrics');
      if (indicator) { indicator.textContent = m.summary; indicator.className = m.ok ? '' : 'bad'; }
    } catch (_e) { /* metrics never block */ }
  };

  global.BattleUI = BattleUI;
})(typeof window !== 'undefined' ? window : globalThis);
