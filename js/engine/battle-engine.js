(function (global) {
  'use strict';

  function now() {
    return new Date();
  }

  function shuffleArray(arr, rng) {
    rng = rng || Math.random;
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function assertDeckSize(defs) {
    if (!defs || defs.length !== RULES.DECK_SIZE) {
      throw new Error('デッキは ' + RULES.DECK_SIZE + ' 枚でなければなりません (受け取った枚数: ' + (defs ? defs.length : 0) + ')');
    }
  }

  // ---- ゲーム開始 ----

  function createPlayer(state, playerId, deckDefs, rng) {
    rng = rng || Math.random;
    // カードの参照を複製せず、各定義から独立した CardInstance を生成する。
    var zoneSet = createPlayerZoneSet(playerId, playerId);
    state.players[playerId] = zoneSet;
    state.playerOrder.push(playerId);

    deckDefs.forEach(function (def) {
      zoneSet.deck.push(new CardInstance({
        instanceId: state.nextInstanceId(),
        cardId: def.id,
        ownerId: playerId,
        zone: ZONES.DECK,
        faceDown: true,
        currentHp: def.baseHp,
        baseHp: def.baseHp
      }));
    });
    shuffleArray(zoneSet.deck, rng);
  }

  // 初期配置: 縄張り6枚(裏向き) → 手札4枚
  function setupInitialZones(state, playerId, rng) {
    var player = state.player(playerId);
    for (var i = 0; i < RULES.INITIAL_TERRITORY; i++) {
      moveCard(state, player.deck[0].instanceId, ZONES.DECK, ZONES.TERRITORY, { playerId: playerId, faceDown: true });
    }
    for (var j = 0; j < RULES.INITIAL_HAND; j++) {
      moveCard(state, player.deck[0].instanceId, ZONES.DECK, ZONES.HAND, { playerId: playerId, faceDown: false });
    }
  }

  function log(state, turnNumber, text) {
    state.battleLog.push({
      timestamp: now(),
      turnNumber: turnNumber,
      text: text
    });
  }

  // BattleEventは状態差分ではなく、エンジンで確定した出来事そのものを記録する。
  function emitBattleEvent(state, type, payload) {
    if (!state.battleEvents) { state.battleEvents = []; }
    state._battleEventCounter = (state._battleEventCounter || 0) + 1;
    var event = { id: state._battleEventCounter, type: type, turnNumber: state.turnNumber, activePlayerId: state.activePlayerId };
    Object.keys(payload || {}).forEach(function (key) { event[key] = payload[key]; });
    state.battleEvents.push(event);
    return event;
  }

  function getBattleEventsSince(state, lastEventId) {
    lastEventId = lastEventId || 0;
    return (state.battleEvents || []).filter(function (event) { return event.id > lastEventId; });
  }

  // 50/50 ランダムで先攻決定。ロジックと演出を分離するため、
  // 演出表示は呼び出し側(UI)がそのまま利用する。
  function determineFirstPlayer(player1Id, player2Id, rng) {
    rng = rng || Math.random;
    return rng() < 0.5 ? player1Id : player2Id;
  }

  function startGame(state, p1Defs, p2Defs, rng) {
    rng = rng || Math.random;
    assertDeckSize(p1Defs);
    assertDeckSize(p2Defs);

    createPlayer(state, 'P1', p1Defs, rng);
    createPlayer(state, 'P2', p2Defs, rng);

    var firstPlayerId = determineFirstPlayer('P1', 'P2', rng);
    state.firstPlayerId = firstPlayerId;

    setupInitialZones(state, 'P1', rng);
    setupInitialZones(state, 'P2', rng);

    state.turnNumber = 1;
    state.activePlayerId = firstPlayerId;
    state.phase = Phases.DRAW_PHASE;

    log(state, state.turnNumber, firstPlayerId + ' が先攻');

    // ドロー判定(先攻1ターン目はスキップ)を含むターン開始
    beginTurn(state);

    return state;
  }

  // ---- ターン進行 ----

  function beginTurn(state) {
    if (state.phase === Phases.GAME_OVER) { return state; }
    var ap = state.activePlayerId;
    state.phase = Phases.TURN_START;

    var isFirstTurnFirstPlayer =
      state.turnNumber === 1 && state.activePlayerId === state.firstPlayerId;

    // ドロー制御: 手動ドロー対象のプレイヤーは beginTurn で自動ドローせず、
    // フェイズを DRAW_PHASE にしておく(UI の「1枚ドロー」ボタンを待つ)。
    var manual = isManualDrawPlayer(state, ap);
    var expectedDraw = !isFirstTurnFirstPlayer;

    if (expectedDraw && !manual) {
      var drawnCard = drawCard(state, ap);
      state.drewThisTurn = !!drawnCard;
      if (!drawnCard) { resolveFailedDraw(state, ap); }
    } else if (isFirstTurnFirstPlayer) {
      state.drewThisTurn = false;
      log(state, state.turnNumber, ap + ' は先攻1ターン目のためドローしない');
    } else {
      // 手動ドロー対象: まだ引いていない
      state.drewThisTurn = false;
      log(state, state.turnNumber, ap + ' はドロー待ちです');
    }

    if (state.phase !== Phases.GAME_OVER) { state.phase = Phases.DRAW_PHASE; }
    log(state, state.turnNumber, 'TURN ' + state.turnNumber + ' ' + ap + ' 開始');
    if (isFirstTurnFirstPlayer || (expectedDraw && !manual && state.drewThisTurn)) {
      enterSetPhase(state);
    }
    return state;
  }

  // playerId が手動ドロー対象かどうか
  function isManualDrawPlayer(state, playerId) {
    if (!state.manualDrawPlayers) { return false; }
    return state.manualDrawPlayers.indexOf(playerId) !== -1;
  }

  // 手動ドロー対象が「このターンドローすべきか」(先攻1ターン目はドローなし)
  function expectsDraw(state, playerId) {
    var noDraw = state.turnNumber === 1 && state.activePlayerId === state.firstPlayerId;
    return !noDraw;
  }

  // 手動ドロー: DRAW_PHASE 中に1回だけ実行可能
  function drawCardOnce(state, playerId) {
    assertActivePlayer(state, playerId);
    if (state.phase !== Phases.DRAW_PHASE) {
      throw new Error('ドローフェイズ以外ではドローできません');
    }
    if (!expectsDraw(state, playerId)) {
      throw new Error('先攻1ターン目はドローできません');
    }
    if (state.drewThisTurn) {
      throw new Error('このターンは既にドローしています');
    }
    var card = drawCard(state, playerId);
    if (!card) {
      resolveFailedDraw(state, playerId);
      return null;
    }
    state.drewThisTurn = true;
    enterSetPhase(state);
    return card;
  }

  function enterSetPhase(state) {
    if (state.phase === Phases.GAME_OVER) {
      throw new Error('ゲームは終了しています');
    }
    // 自動遷移後に古い呼び出し経路が到着しても、再遷移・再ログしない。
    if (state.phase === Phases.SET_PHASE) { return state; }
    if (state.phase !== Phases.DRAW_PHASE) {
      throw new Error('ドローフェイズからのみセットフェイズへ進めます');
    }
    if (expectsDraw(state, state.activePlayerId) && !state.drewThisTurn) {
      throw new Error('ドローするまでセットフェイズへ進めません');
    }
    state.phase = Phases.SET_PHASE;
    log(state, state.turnNumber, state.activePlayerId + ' はセットフェイズへ');
    return state;
  }

  function drawCard(state, playerId) {
    var player = state.player(playerId);
    if (player.deck.length === 0) {
      return null;
    }
    var card = moveCard(state, player.deck[0].instanceId, ZONES.DECK, ZONES.HAND, { playerId: playerId });
    // 通常ドローは縄張り経由ではないため onTerritoryDraw は発火しない。
    var drawDef = global.getCardDefinition ? global.getCardDefinition(card.cardId) : null;
    log(state, state.turnNumber, playerId + ' は1枚ドローした' + (drawDef ? '（' + drawDef.name + '）' : ''));
    return card;
  }

  // 山札0枚そのものではなく、必要な通常ドローが実際に失敗した時だけ判定する。
  function resolveFailedDraw(state, playerId) {
    var p1Territory = state.player('P1').territory.length;
    var p2Territory = state.player('P2').territory.length;
    log(state, state.turnNumber, playerId + ' は山札がなくカードを引けなかった');
    if (p1Territory === p2Territory) {
      state.phase = Phases.DRAW_PHASE;
      throw new Error('山札切れ時の縄張りが同数です（同数時の公式裁定未確認）');
    }
    state.winner = p1Territory > p2Territory ? 'P1' : 'P2';
    state.phase = Phases.GAME_OVER;
    log(state, state.turnNumber, '山札切れ：縄張り枚数 ' + p1Territory + ' 対 ' + p2Territory + ' で ' + state.winner + ' の勝利');
    emitBattleEvent(state, 'GAME_OVER', {
      reason: 'FAILED_DRAW',
      failedPlayerId: playerId,
      winner: state.winner,
      territoryCounts: { P1: p1Territory, P2: p2Territory }
    });
    return state.winner;
  }

  // 縄張りからカードを引く処理（攻撃・直接攻撃による防御側の選択）。
  // TERRITORY -> RESOLVING -> HAND (または <とびだす> 判定へ)
  function triggerTerritoryDrawSelection(state, playerId, territoryContext) {
    var player = state.player(playerId);
    if (player.territory.length === 0) {
      return null;
    }

    state.pendingEffect = {
      type: 'TERRITORY_DRAW_SELECTION',
      playerId: playerId,
      context: territoryContext || null,
      options: player.territory.map(function(t) { return t.instanceId; })
    };

    log(state, state.turnNumber, playerId + ' は引く縄張りを選択してください');
    return null;
  }

  function resolveTerritoryDrawSelection(state, playerId, instanceId) {
    var pending = state.pendingEffect;
    if (!pending || pending.type !== 'TERRITORY_DRAW_SELECTION') {
      throw new Error('縄張り選択待ちではありません');
    }
    if (pending.playerId !== playerId) {
      throw new Error('選択権がありません');
    }

    var card = findInZone(state, playerId, ZONES.TERRITORY, instanceId);
    if (!card) {
      throw new Error('選択された縄張りが存在しません');
    }

    moveCard(state, instanceId, ZONES.TERRITORY, ZONES.RESOLVING, { playerId: playerId });
    state.pendingEffect = null;

    log(state, state.turnNumber, playerId + ' は縄張りを選択した');

    // 互換性: 既存の onTerritoryDraw フックを呼び出し (Test18 等)
    if (state.onTerritoryDraw) {
      state.onTerritoryDraw(playerId, card);
    }

    // <とびだす> 判定へ
    return checkTerritoryDrawTrigger(state, playerId, card, pending.context);
  }

  // 縄張りドロー（攻撃破壊・直接攻撃時）
  function drawTerritoryCard(state, playerId, territoryContext) {
    return triggerTerritoryDrawSelection(state, playerId, territoryContext);
  }

  // 縄張りドロー後の誘発処理を確認
  function checkTerritoryDrawTrigger(state, playerId, card, context) {
    var def = getCardDefinition(card.cardId);
    if (!def || !def.skills) {
      // 誘発なし → HAND へ
      return finalizeTerritoryDraw(state, playerId, card, card.runtimeFlags && card.runtimeFlags.specialTerritoryDrawDestination || 'HAND');
    }

    // timing === 'TERRITORY_DRAW' かつ optional なスキルを探す
    var triggerSkill = def.skills.find(function (skill) {
      return skill.timing === 'TERRITORY_DRAW' && skill.optional === true;
    });

    if (!triggerSkill) {
      // 誘発スキルなし → HAND へ
      return finalizeTerritoryDraw(state, playerId, card, card.runtimeFlags && card.runtimeFlags.specialTerritoryDrawDestination || 'HAND');
    }

    // ＜とびだす＞使用条件チェック: 自分の場に有効な同スキル持ちがいるか
    // hasEffectiveSkill が faceDown 判定などを集約
    var ownerId = card.ownerId;
    var hasSkillOnField = hasEffectiveSkill(state, ownerId, triggerSkill.id);

    if (hasSkillOnField || (context && context.suppressTerritoryTrigger)) {
      // 条件不成立 → HAND へ
      return finalizeTerritoryDraw(state, playerId, card, card.runtimeFlags && card.runtimeFlags.specialTerritoryDrawDestination || 'HAND');
    }

    // 条件成立 → 選択肢を提示 (pending state)
    state.pendingEffect = {
      type: 'TERRITORY_DRAW_CHOICE',
      playerId: ownerId,
      cardInstanceId: card.instanceId,
      skillId: triggerSkill.id,
      options: ['USE_TOBIDASU', 'TAKE_TO_HAND']
    };

    log(state, state.turnNumber, ownerId + ' は ' + getCardDefinition(card.cardId).name + ' の誘発を確認中');
    
    // 選択待ち。resolvePendingTerritoryChoice() で解決
    return card;
  }

  // 縄張りドローを確定させる (HAND または FIELD へ)
  function finalizeTerritoryDraw(state, playerId, card, destinationZone) {
    if (destinationZone === 'FIELD') {
      // FIELD へ出す (コスト不要、通常召喚ではない)
      moveCard(state, card.instanceId, ZONES.RESOLVING, ZONES.FIELD, { playerId: playerId });
      card.currentHp = card.baseHp || getCardDefinition(card.cardId).baseHp;
      card.baseHp = card.baseHp || getCardDefinition(card.cardId).baseHp;
      card.attackedThisTurn = false;
      card.faceDown = false;
      log(state, state.turnNumber, playerId + ' は ' + getCardDefinition(card.cardId).name + ' を縄張りから場へ出した');
    } else {
      var destination = destinationZone === ZONES.DISCARD ? ZONES.DISCARD : ZONES.HAND;
      moveCard(state, card.instanceId, ZONES.RESOLVING, destination, { playerId: playerId });
      log(state, state.turnNumber, playerId + ' は縄張りから1枚を' + (destination===ZONES.DISCARD?'捨て札へ送った':'手札へ加えた'));
    }
    return card;
  }

  function assertActivePlayer(state, playerId) {
    if (state.activePlayerId !== playerId) {
      throw new Error('アクティブプレイヤーではありません');
    }
  }

  // ---- 選択待ちガード ----
  function assertNoPendingEffect(state) {
    if (state.pendingEffect) {
      throw new Error('選択待ちの効果があります: ' + state.pendingEffect.type);
    }
  }

  // ---- セットフェイズ ----

  function setFood(state, playerId, handInstanceId) {
    assertNoPendingEffect(state);
    assertActivePlayer(state, playerId);
    if (state.phase !== Phases.SET_PHASE) {
      throw new Error('セットフェイズ以外ではエサをセットできません');
    }
    var player = state.player(playerId);
    var held = findInZone(state, playerId, ZONES.HAND, handInstanceId);
    if (!held) {
      throw new Error('カードが手札にありません');
    }
    if (player.foodSetThisTurn >= RULES.MAX_FOOD_PER_SET) {
      throw new Error('このターンのエサセットは済んでいます');
    }
    var def = getCardDefinition(held.cardId);
    moveCard(state, handInstanceId, ZONES.HAND, ZONES.FOOD, { playerId: playerId, faceDown: false });
    player.foodSetThisTurn++;
    log(state, state.turnNumber, playerId + ' は ' + (def ? def.name : held.cardId) + ' をエサにした | 使用可能コスト: ' + player.food.length);
    return held;
  }

  function gainCost(state, playerId) {
    var player = state.player(playerId);
    player.availableCost = player.food.length;
    log(state, state.turnNumber, playerId + ' はコスト ' + player.availableCost + ' を獲得した');
    return player.availableCost;
  }

  // セットフェイズ → メインフェイズへの遷移。コストを獲得する。
  // メインフェイズに既にいる場合は2度目のコスト獲得を拒否する。
  function enterMainPhase(state) {
    assertNoPendingEffect(state);
    assertActivePlayer(state, state.activePlayerId);
    if (state.phase !== Phases.SET_PHASE) {
      throw new Error('セットフェイズからのみメインフェイズへ進めます');
    }
    state.phase = Phases.MAIN_PHASE;
    gainCost(state, state.activePlayerId);
    return state;
  }

  // ---- 召喚 ----

  function summonInsect(state, playerId, handInstanceId, summonOptions) {
    summonOptions = summonOptions || {};
    assertNoPendingEffect(state);
    assertActivePlayer(state, playerId);
    if (state.phase !== Phases.MAIN_PHASE) {
      throw new Error('メインフェイズ以外では召喚できません');
    }
    var player = state.player(playerId);
    var held = findInZone(state, playerId, ZONES.HAND, handInstanceId);
    if (!held || held.zone !== ZONES.HAND) {
      throw new Error('手札にありません');
    }
    var def = getCardDefinition(held.cardId);
    if (!def) {
      throw new Error('カード定義が見つかりません: ' + held.cardId);
    }
    if (def.type !== CardTypes.INSECT) {
      throw new Error('虫カードではありません');
    }
    if (!def.isPlayable()) {
      throw new Error('このカードはまだ使用可能になっていません(正式データ確認待ち)');
    }
    var alternative = (def.summonAlternatives || [])[0];
    if (summonOptions.alternative && alternative && !summonOptions.selectedIds) {
      var summonCandidates = player.field.filter(function (card) { return !card.faceDown; });
      createCardSelection(state, { playerId: playerId, options: summonCandidates.map(function(c){return c.instanceId;}), exactSelections: alternative.count, candidateZones:[ZONES.FIELD], selectionPurpose:'ALTERNATIVE_SUMMON_COST', continuation:{type:'SUMMON_ALTERNATIVE',sourceInstanceId:handInstanceId} });
      return { pending:true };
    }
    if (!summonOptions.alternative && player.availableCost < def.cost) {
      throw new Error('コストが不足しています');
    }
    if (summonOptions.alternative) {
      if (!alternative || !summonOptions.selectedIds || summonOptions.selectedIds.length !== alternative.count) { throw new Error('代替召喚コストが不正です'); }
      summonOptions.selectedIds.forEach(function(id){ var target=findInZone(state,playerId,ZONES.FIELD,id); if(!target||target.faceDown) throw new Error('代替コスト対象が不正です'); });
      summonOptions.selectedIds.forEach(function(id){ destroyInsect(state,id,'SACRIFICE',handInstanceId,null,{skipTerritoryDraw:true}); });
    } else {
      player.availableCost -= def.cost;
    }

    moveCard(state, handInstanceId, ZONES.HAND, ZONES.FIELD, { playerId: playerId });
    held.currentHp = def.baseHp;
    held.baseHp = def.baseHp;
    held.attackedThisTurn = false;
    held.usedSkills = [];
    held.faceDown = false;
    held.enteredFieldTurn = state.turnNumber;

    (def.passiveAbilities || []).filter(function(a){return a.timing === 'ON_ENTER_FIELD';}).forEach(function(ability){
      (ability.effects || []).forEach(function(effect){
        if (effect.type === 'MOVE_SELECTED' && effect.from === ZONES.HAND && effect.to === ZONES.FOOD && player.hand.length) {
          createCardSelection(state,{playerId:playerId,options:player.hand.map(function(c){return c.instanceId;}),minSelections:ability.optional?0:1,maxSelections:effect.count||1,candidateZones:[ZONES.HAND],selectionPurpose:'ON_ENTER_FIELD_MOVE',continuation:{type:'MOVE_SELECTED',from:effect.from,to:effect.to,grantCost:effect.grantCost}});
        }
      });
    });

    log(state, state.turnNumber, playerId + ' は ' + def.name + ' を召喚した | コスト' + def.cost + ' | 残りコスト: ' + player.availableCost);
    return held;
  }

  // ---- 術カード使用 ----

  function insectCards(cards) {
    return (cards || []).filter(function (card) { var def = getCardDefinition(card.cardId); return def && def.type === CardTypes.INSECT; });
  }

  function createCardSelection(state, spec) {
    var options = (spec.options || []).slice();
    var min = spec.exactSelections != null ? spec.exactSelections : (spec.minSelections != null ? spec.minSelections : 1);
    var max = spec.exactSelections != null ? spec.exactSelections : (spec.maxSelections != null ? spec.maxSelections : min);
    if (options.length < min) { throw new Error('選択可能なカードが不足しています'); }
    if ((spec.selectionGroups || []).some(function(group){return !group.length;})) { throw new Error('必要な選択対象グループが空です'); }
    state.pendingEffect = {
      type: 'CARD_SELECTION', playerId: spec.playerId, controller: spec.controller || spec.playerId,
      options: options, selectedIds: [], minSelections: min, maxSelections: max,
      exactSelections: spec.exactSelections, candidateZones: (spec.candidateZones || []).slice(),
      selectionGroups: (spec.selectionGroups || []).map(function(group){return group.slice();}),
      selectionPurpose: spec.selectionPurpose || 'CARD_SELECTION', continuation: spec.continuation || null
    };
    return state.pendingEffect;
  }

  function resolveCardSelection(state, playerId, instanceIds, finish) {
    var pending = state.pendingEffect;
    if (!pending || pending.type !== 'CARD_SELECTION' || pending.playerId !== playerId) { throw new Error('カード選択待ちではありません'); }
    var ids = Array.isArray(instanceIds) ? instanceIds.slice() : [instanceIds];
    var unique = [];
    ids.forEach(function (id) { if (pending.options.indexOf(id) === -1) throw new Error('選択対象外のカードです'); if (unique.indexOf(id) !== -1) throw new Error('同じカードを重複選択できません'); unique.push(id); });
    var mustFinish = finish !== false;
    if (unique.length > pending.maxSelections) { throw new Error('選択枚数が上限を超えています'); }
    if (mustFinish && unique.length < pending.minSelections) { throw new Error('必要な枚数を選択してください'); }
    if (mustFinish && pending.selectionGroups.length && pending.selectionGroups.some(function(group){return !unique.some(function(id){return group.indexOf(id)!==-1;});})) { throw new Error('各対象グループから選択してください'); }
    pending.selectedIds = unique;
    if (!mustFinish) { return pending; }
    state.pendingEffect = null;
    try { return resolveSelectionContinuation(state, pending, unique); }
    catch (err) { state.pendingEffect = pending; throw err; }
  }

  function selectPendingCard(state, playerId, instanceId) {
    var pending=state.pendingEffect;
    if(!pending||pending.type!=='CARD_SELECTION'||pending.playerId!==playerId||pending.options.indexOf(instanceId)===-1) throw new Error('このカードは選択できません');
    var selected=(pending.selectedIds||[]).slice(), index=selected.indexOf(instanceId);
    if(index===-1){if(selected.length>=pending.maxSelections)throw new Error('選択上限です');selected.push(instanceId);}else{selected.splice(index,1);}
    pending.selectedIds=selected;
    if(pending.exactSelections!=null&&selected.length===pending.exactSelections)return resolveCardSelection(state,playerId,selected,true);
    return pending;
  }

  function completeCardSelection(state, playerId) {
    var pending=state.pendingEffect;
    return resolveCardSelection(state,playerId,pending&&pending.selectedIds||[],true);
  }

  function resolveSelectionContinuation(state, pending, ids) {
    var c = pending.continuation || {};
    if (c.type === 'USE_SPELL') { return useSpell(state, pending.playerId, c.sourceInstanceId, ids); }
    if (c.type === 'SUMMON_ALTERNATIVE') { return summonInsect(state, pending.playerId, c.sourceInstanceId, { alternative: true, selectedIds: ids }); }
    if (c.type === 'DIRECT_ATTACK_FOOD') {
      moveCard(state, ids[0], ZONES.FOOD, ZONES.HAND, { playerId: pending.playerId });
      if (c.territoryPlayerId && state.player(c.territoryPlayerId).territory.length) { triggerTerritoryDrawSelection(state, c.territoryPlayerId, c.territoryContext); }
      return ids;
    }
    if (c.type === 'ATTACK_MULTI') { return performMultiTargetAttack(state, c.attackerInstanceId, ids, c.skillId); }
    if (c.type === 'MOVE_SELECTED') { ids.forEach(function(id){moveCard(state,id,c.from,c.to,{playerId:pending.playerId});}); return ids; }
    throw new Error('未対応の選択継続です: ' + c.type);
  }

  function getComplexSpellSelection(state, playerId, sourceId, effect) {
    var player = state.player(playerId), opponent = state.player(state.opponentOf(playerId));
    if (effect.type === 'MOVE_MATCHING_COLOR_INSECTS') {
      var food = insectCards(player.food), colors = {};
      food.forEach(function (card) { var d=getCardDefinition(card.cardId); colors[d.color]=(colors[d.color]||0)+1; });
      return { options: food.filter(function(card){return colors[getCardDefinition(card.cardId).color] >= 1;}), minSelections: effect.minSelections, maxSelections: effect.maxSelections, zones:[ZONES.FOOD] };
    }
    if (effect.type === 'EXCHANGE_INSECTS') {
      var firstGroup=insectCards(player[effect.firstZone.toLowerCase()]), secondGroup=insectCards(player[effect.secondZone.toLowerCase()]);
      return { options:firstGroup.concat(secondGroup),groups:[firstGroup.map(function(c){return c.instanceId;}),secondGroup.map(function(c){return c.instanceId;})],exactSelections:2,zones:[effect.firstZone,effect.secondZone] };
    }
    if (effect.type === 'TRANSFER_OWN_ATTACHMENT') {
      var ownAtt=[]; player.field.forEach(function(host){(host.attachments||[]).forEach(function(att){ownAtt.push(att);});});
      var hosts=player.field.filter(function(card){return !card.faceDown;});
      return { options:ownAtt.concat(hosts),groups:[ownAtt.map(function(c){return c.instanceId;}),hosts.map(function(c){return c.instanceId;})],exactSelections:2,zones:['ATTACHMENT',ZONES.FIELD] };
    }
    if (effect.type === 'DESTROY_OPPONENT_ATTACHMENT') {
      var oppAtt=[]; opponent.field.forEach(function(host){(host.attachments||[]).forEach(function(att){oppAtt.push(att);});});
      return { options:oppAtt, exactSelections:1, zones:['ATTACHMENT'] };
    }
    return null;
  }

  // 術カードの cardEffects を評価して、解決後の最終移動先を返す。
  // 術の基本終了先は DISCARD(使い切り)。効果が最終移動先を上書きすることで
  // 《蟲の息吹》のような「自身をエサ場へ」が実現する。
  // カード名if文は使わず、cardEffects の内容に応じて決まる。
  function getSpellTargetCandidates(state, playerId, handInstanceId) {
    var held = findInZone(state, playerId, ZONES.HAND, handInstanceId);
    var def = held ? getCardDefinition(held.cardId) : null;
    if (!def || def.type !== CardTypes.SPELL) { return []; }
    var candidates = [];
    (def.cardEffects || []).forEach(function (effect) {
      if (!effect || (!effect.requiresTarget && effect.type !== 'DEAL_DAMAGE_TO_TARGET')) { return; }
      if (effect.target === 'OPPONENT_FIELD_INSECT') {
        candidates = state.player(state.opponentOf(playerId)).field.filter(function (card) {
          return !card.faceDown;
        });
      } else if (effect.target === 'OWN_ATTACKED_FIELD_INSECT') {
        candidates = state.player(playerId).field.filter(function (card) { return !card.faceDown && card.attackedThisTurn; });
      } else if (effect.target === 'OWN_FOOD_INSECT') {
        candidates = state.player(playerId).food.filter(function (card) { var d = getCardDefinition(card.cardId); return d && d.type === CardTypes.INSECT; });
      } else if (effect.target === 'OWN_HAND_INSECT') {
        candidates = state.player(playerId).hand.filter(function (card) { var d = getCardDefinition(card.cardId); return (!effect.excludeSource || card.instanceId !== handInstanceId) && d && d.type === CardTypes.INSECT; });
      }
    });
    return candidates;
  }

  function resolveSpellEffects(state, playerId, instance, def, chosenTargetInstanceId) {
    var effects = def.cardEffects || [];
    var finalZone = ZONES.DISCARD;
    effects.forEach(function (effect) {
      if (!effect) { return; }
      var chosenIds = Array.isArray(chosenTargetInstanceId) ? chosenTargetInstanceId : (chosenTargetInstanceId ? [chosenTargetInstanceId] : []);
      if (effect.type === 'MOVE_SELF' && effect.to && CardInstance.isZone(effect.to)) {
        finalZone = effect.to;
      }
      // APPLY_STAT_MODIFIER_TO_ALL_OWN_FIELD: 使用時点で自分FIELDにいる全虫へ一時的AP修飾
      if (effect.type === 'APPLY_STAT_MODIFIER_TO_ALL_OWN_FIELD') {
        var ownField = state.player(playerId).field;
        ownField.forEach(function (insect) {
          var mod = {
            id: effect.id,
            sourceInstanceId: instance.instanceId,
            stat: effect.stat,
            amount: effect.amount,
            startTurn: state.turnNumber,
            endTurn: state.turnNumber
          };
          addStatModifier(state, insect, mod);
        });
      }
      // DEAL_DAMAGE_TO_TARGET: 対象虫へ固定ダメージ(爆熱弾等)
      if (effect.type === 'DEAL_DAMAGE_TO_TARGET') {
        var targets = [];
        if (effect.target === 'OPPONENT_FIELD_INSECT') {
          var opponentId = state.opponentOf(playerId);
          // 術は擬態を無視 (公式Q&A: 術targetingまで禁止しない)
          targets = state.player(opponentId).field.filter(function (c) {
            return !c.faceDown; // faceDownのみ除外
          });
        }
        if (targets.length === 0) {
          throw new Error('対象となる虫がいません');
        }
        var target = targets.filter(function (candidate) {
          return candidate.instanceId === chosenTargetInstanceId;
        })[0];
        if (!target) { throw new Error('選択した虫は術の対象にできません'); }
        var dmg = effect.amount || 0;
        var multiplier = effect.ignoreAttributeMultiplier ? 1 : getAttributeMultiplier(def.color || Attributes.COLORLESS, getEffectiveColor(target));
        var finalDmg = dmg * multiplier;
        applyDamage(state, instance, target, finalDmg, 'SPELL', instance.instanceId, target.instanceId, {
          effectId: effect.id || effect.type,
          multiplier: multiplier,
          apVal: dmg
        });
        var spellResult = {};
        spellResult.damageDealt = finalDmg;
      }
      // RETRIEVE_FROM_DISCARD: 捨て札の虫を1体手札に加える
      if (effect.type === 'RETRIEVE_FROM_DISCARD') {
        var player = state.player(playerId);
        var insectCandidates = [];
        for (var di = 0; di < player.discard.length; di++) {
          var discardDef = getCardDefinition(player.discard[di].cardId);
          if (discardDef && discardDef.type === CardTypes.INSECT) {
            insectCandidates.push(player.discard[di]);
          }
        }
        if (insectCandidates.length === 1) {
          moveCard(state, insectCandidates[0].instanceId, ZONES.DISCARD, ZONES.HAND, { playerId: playerId });
        } else if (insectCandidates.length > 1) {
          state.pendingEffect = {
            type: 'DISCARD_INSECT_SELECTION',
            playerId: playerId,
            sourceInstanceId: instance.instanceId,
            options: insectCandidates.map(function (candidate) { return candidate.instanceId; })
          };
        }
      }
      if (effect.type === 'RESET_ATTACK') {
        var resetTarget = chosenTargetInstanceId && findAnywhere(state, chosenTargetInstanceId);
        if (!resetTarget || resetTarget.playerId !== playerId || resetTarget.zone !== ZONES.FIELD) { throw new Error('攻撃済みの自分の虫を選んでください'); }
        resetTarget.instance.attackedThisTurn = false;
        if (resetTarget.instance.runtimeFlags) { delete resetTarget.instance.runtimeFlags.continuousAttack; }
      }
      if (effect.type === 'MOVE_TARGET') {
        var moveTarget = chosenTargetInstanceId && findAnywhere(state, chosenTargetInstanceId);
        if (!moveTarget || moveTarget.playerId !== playerId || moveTarget.zone !== effect.from) { throw new Error('移動対象が正しいゾーンにありません'); }
        var moved = moveCard(state, chosenTargetInstanceId, effect.from, effect.to, { playerId: playerId });
        if (effect.to === ZONES.FIELD && effect.destroyAtEndTurn) {
          if (!moved.runtimeFlags) { moved.runtimeFlags = {}; }
          moved.runtimeFlags.destroyAtEndTurn = state.turnNumber;
        }
      }
      if (effect.type === 'APPLY_ATTACK_RESTRICTION') {
        var restricted = chosenTargetInstanceId && findAnywhere(state, chosenTargetInstanceId);
        if (!restricted || restricted.zone !== ZONES.FIELD) { throw new Error('攻撃禁止の対象が場にいません'); }
        if (!restricted.instance.runtimeFlags) { restricted.instance.runtimeFlags = {}; }
        if (!restricted.instance.runtimeFlags.attackRestrictions) { restricted.instance.runtimeFlags.attackRestrictions = []; }
        restricted.instance.runtimeFlags.attackRestrictions.push({ sourceInstanceId: instance.instanceId, startTurn: state.turnNumber + (effect.startTurnOffset || 0), endTurn: state.turnNumber + (effect.endTurnOffset || 0), whileSourceOnField: false });
      }
      if (effect.type === 'ADD_SELF_AS_FACE_UP_TERRITORY') {
        finalZone = ZONES.TERRITORY;
        instance.runtimeFlags = instance.runtimeFlags || {};
        instance.runtimeFlags.specialTerritoryDrawDestination = effect.drawDestination || ZONES.HAND;
        instance.faceDown = false;
      }
      if (effect.type === 'REVEAL_TOP_AND_ROUTE') {
        var top = state.player(playerId).deck[0];
        if (!top) { resolveFailedDraw(state, playerId); return; }
        var topDef = getCardDefinition(top.cardId);
        var dest = topDef && topDef.type === CardTypes.INSECT ? effect.insectTo : effect.otherTo;
        var routed = moveCard(state, top.instanceId, ZONES.DECK, dest, { playerId: playerId, faceDown:false });
        if (dest === ZONES.FIELD) { routed.currentHp=topDef.baseHp; routed.baseHp=topDef.baseHp; routed.attackedThisTurn=false; if(effect.destroyInsectAtEndTurn){routed.runtimeFlags.destroyAtEndTurn=state.turnNumber;} }
      }
      if (effect.type === 'MOVE_MATCHING_COLOR_INSECTS') {
        var selected = chosenIds.map(function(id){return findInZone(state,playerId,effect.from,id);});
        if (!selected.length || selected.some(function(c){return !c;})) throw new Error('移動対象が不正です');
        var firstColor=getCardDefinition(selected[0].cardId).color;
        if (selected.some(function(c){var d=getCardDefinition(c.cardId);return d.type!==CardTypes.INSECT||d.color!==firstColor;})) throw new Error('同じ色の虫を選択してください');
        batchMoveCards(state, selected.map(function(c){return {instanceId:c.instanceId,from:effect.from,to:effect.to,playerId:playerId};})).forEach(function(c){var d=getCardDefinition(c.cardId);c.currentHp=d.baseHp;c.baseHp=d.baseHp;c.attackedThisTurn=false;if(effect.destroyAtEndTurn)c.runtimeFlags.destroyAtEndTurn=state.turnNumber;});
      }
      if (effect.type === 'EXCHANGE_INSECTS') {
        if (chosenIds.length !== 2) throw new Error('交換する2枚を選択してください');
        var first=findInZone(state,playerId,effect.firstZone,chosenIds[0])||findInZone(state,playerId,effect.firstZone,chosenIds[1]);
        var second=findInZone(state,playerId,effect.secondZone,chosenIds[0])||findInZone(state,playerId,effect.secondZone,chosenIds[1]);
        if(!first||!second) throw new Error('各ゾーンから1枚ずつ選択してください');
        var fd=getCardDefinition(first.cardId), sd=getCardDefinition(second.cardId);
        if(fd.type!==CardTypes.INSECT||sd.type!==CardTypes.INSECT||(effect.requireSameCost&&fd.cost!==sd.cost)) throw new Error('交換条件を満たしていません');
        batchMoveCards(state,[{instanceId:first.instanceId,from:effect.firstZone,to:effect.secondZone,playerId:playerId},{instanceId:second.instanceId,from:effect.secondZone,to:effect.firstZone,playerId:playerId}]);
        first.currentHp=fd.baseHp; first.baseHp=fd.baseHp; first.attackedThisTurn=effect.enteringCannotAttackThisTurn===true;
      }
      if (effect.type === 'TRANSFER_OWN_ATTACHMENT') {
        var attHolder=findAttachment(state,chosenIds[0])||findAttachment(state,chosenIds[1]);
        var hostHolder=findAnywhere(state,chosenIds[0])||findAnywhere(state,chosenIds[1]);
        if(!attHolder||!hostHolder||hostHolder.playerId!==playerId||hostHolder.zone!==ZONES.FIELD||hostHolder.instance===attHolder.host) throw new Error('付け替え対象が不正です');
        attHolder.host.attachments.splice(attHolder.index,1); hostHolder.instance.attachments.push(attHolder.instance);
      }
      if (effect.type === 'DESTROY_OPPONENT_ATTACHMENT') {
        var destroyedAttachment=findAttachment(state,chosenIds[0]);
        if(!destroyedAttachment||destroyedAttachment.playerId!==state.opponentOf(playerId)) throw new Error('相手の強化カードを選択してください');
        destroyedAttachment.host.attachments.splice(destroyedAttachment.index,1); destroyedAttachment.instance.zone=ZONES.DISCARD; state.player(destroyedAttachment.instance.ownerId).discard.push(destroyedAttachment.instance);
      }
    });
    // 効果解決処理の注入フック(通常は null)。テスト・将来の複雑な効果用の拡張点。
    if (global.spellResolveHook) {
      global.spellResolveHook(state, playerId, instance, def);
    }
    return finalZone;
  }

  // 術の解決途中で例外が起きた場合の状態復旧。
  // 対象はこの1枚の術使用のみ。可能な範囲で「使用直前」へ戻す。
  // カード効果そのものによる正常な破壊・移動は復旧対象ではない。
  function rollbackSpellToHand(state, playerId, instanceId, snapshot) {
    var player = state.player(playerId);

    // コストを支払い前へ戻す
    if (snapshot && snapshot.availableCost != null) {
      player.availableCost = snapshot.availableCost;
    }

    // カードを現在の場所から HANd へ戻す(どのゾーンにいても確実に)。
    var holder = findAnywhere(state, instanceId);
    if (holder && holder.instance.zone !== ZONES.HAND) {
      var zoneArr = getPlayerZoneArray(state, holder.playerId, holder.zone);
      var idx = zoneArr.indexOf(holder.instance);
      if (idx !== -1) {
        zoneArr.splice(idx, 1);
      }
      holder.instance.zone = ZONES.HAND;
      player.hand.push(holder.instance);
    }

    // 一時領域は必ず空にする
    player.resolving = [];
  }

  // 術カード使用の汎用処理。
  // 順序: VALIDATE → PAY_COST → RESOLVE_EFFECT → FINALIZE
  // RESOLVING(一時領域)を経由するため、カードは解決中も HAND に残らない。
  // 最終的な移動先は cardEffects によって決まり、基本は DISCARD。
  // VALIDATE 失敗は状態変更ゼロ。PAY_COST以降の内部エラーは rollback で
  // 「使用直前」へ復旧する。
  function useSpell(state, playerId, handInstanceId, chosenTargetInstanceId) {
    // ---- VALIDATE ----
    assertNoPendingEffect(state);
    assertActivePlayer(state, playerId);
    if (state.phase !== Phases.MAIN_PHASE) {
      throw new Error('メインフェイズ以外では術を使えません');
    }
    var player = state.player(playerId);
    var held = findInZone(state, playerId, ZONES.HAND, handInstanceId);
    if (!held || held.zone !== ZONES.HAND) {
      throw new Error('手札に術カードがありません');
    }
    var def = getCardDefinition(held.cardId);
    if (!def) {
      throw new Error('カード定義が見つかりません: ' + held.cardId);
    }
    if (def.type !== CardTypes.SPELL) {
      throw new Error('術カードではありません');
    }
    if (!def.isPlayable()) {
      throw new Error('このカードはまだ使用可能になっていません');
    }
    if (player.availableCost < def.cost) {
      throw new Error('コストが不足しています');
    }

    if (!Array.isArray(chosenTargetInstanceId)) {
      var complexEffect = (def.cardEffects || []).filter(function(effect){return getComplexSpellSelection(state,playerId,handInstanceId,effect);})[0];
      if (complexEffect) {
        var selection=getComplexSpellSelection(state,playerId,handInstanceId,complexEffect);
        createCardSelection(state,{playerId:playerId,options:selection.options.map(function(c){return c.instanceId;}),selectionGroups:selection.groups,minSelections:selection.minSelections,maxSelections:selection.maxSelections,exactSelections:selection.exactSelections,candidateZones:selection.zones,selectionPurpose:complexEffect.type,continuation:{type:'USE_SPELL',sourceInstanceId:handInstanceId}});
        return {pending:true};
      }
    }

    var targetedEffects = (def.cardEffects || []).filter(function (effect) {
      return effect && !getComplexSpellSelection(state,playerId,handInstanceId,effect) && (effect.type === 'DEAL_DAMAGE_TO_TARGET' || effect.requiresTarget);
    });
    if (targetedEffects.length > 0) {
      var targetCandidates = getSpellTargetCandidates(state, playerId, handInstanceId);
      if (targetCandidates.length === 0) { throw new Error('対象となる虫がいません'); }
      if (!chosenTargetInstanceId && targetCandidates.length === 1) {
        chosenTargetInstanceId = targetCandidates[0].instanceId;
      } else if (!chosenTargetInstanceId) {
        state.pendingEffect = {
          type: 'SPELL_TARGET_SELECTION',
          playerId: playerId,
          sourceInstanceId: handInstanceId,
          options: targetCandidates.map(function (candidate) { return candidate.instanceId; })
        };
        return { pending: true, targetCandidates: targetCandidates };
      } else if (!targetCandidates.some(function (candidate) { return candidate.instanceId === chosenTargetInstanceId; })) {
        throw new Error('選択した虫は術の対象にできません');
      }
    }

    // 使用直前の状態を記録(rollback用)。
    var snapshot = {
      availableCost: player.availableCost,
      originalZone: ZONES.HAND
    };

    // 解決開始。エラー時は使用直前の状態へ復旧する。
    try {
      // ---- PAY_COST ----
      player.availableCost -= def.cost;

      var result = {
        spellInstance: held,
        def: def,
        finalZone: null,
        foodDelta: 0
      };

      // ---- RESOLVE_EFFECT: HAND → RESOLVING(一時領域) ----
      moveCard(state, handInstanceId, ZONES.HAND, ZONES.RESOLVING, { playerId: playerId });

      // 最終移動先を cardEffects から決定
      var finalZone = resolveSpellEffects(state, playerId, held, def, chosenTargetInstanceId);

      // ---- FINALIZE: RESOLVING → 最終移動先 ----
      moveCard(state, held.instanceId, ZONES.RESOLVING, finalZone, { playerId: playerId });
      result.finalZone = finalZone;
      if (finalZone === ZONES.FOOD) {
        result.foodDelta = 1;
      }

      log(state, state.turnNumber, playerId + ' は ' + def.name + ' を使用した');
      return result;
    } catch (err) {
      // 効果解決中・最終移動中の内部エラー → 使用直前の状態へ復旧して再送出。
      rollbackSpellToHand(state, playerId, held.instanceId, snapshot);
      throw err;
    }
  }

  // ---- 強化カード使用 ----
  // 自分の虫に強化カードを装着する。
  // 強化カードは HAND から対象虫の attachments へ移動する。
  // 強化カード自体は zone=FIELD のまま所有者情報を保持する。
  // chosenColor: COLOR_OVERRIDE系の場合、'RED' | 'BLUE' | 'GREEN' を指定
  function useEnhancement(state, playerId, handInstanceId, targetInstanceId, chosenColor) {
    // ---- VALIDATE ----
    assertNoPendingEffect(state);
    assertActivePlayer(state, playerId);
    if (state.phase !== Phases.MAIN_PHASE) {
      throw new Error('メインフェイズ以外では強化カードを使えません');
    }
    var player = state.player(playerId);
    var held = findInZone(state, playerId, ZONES.HAND, handInstanceId);
    if (!held || held.zone !== ZONES.HAND) {
      throw new Error('手札に強化カードがありません');
    }
    var def = getCardDefinition(held.cardId);
    if (!def) {
      throw new Error('カード定義が見つかりません: ' + held.cardId);
    }
    if (def.type !== CardTypes.ENHANCEMENT) {
      throw new Error('強化カードではありません');
    }
    if (!def.isPlayable()) {
      throw new Error('このカードはまだ使用可能になっていません');
    }
    if (player.availableCost < def.cost) {
      throw new Error('コストが不足しています');
    }
    // 対象虫が自分の場にいるか
    var target = findInZone(state, playerId, ZONES.FIELD, targetInstanceId);
    if (!target) {
      throw new Error('自分の場に対象の虫がいません');
    }
    if (target.faceDown) {
      throw new Error('裏向きの虫には強化カードを装着できません');
    }

    // COLOR_OVERRIDE系の場合、色の選択を検証
    if (def.enhancementEffects) {
      def.enhancementEffects.forEach(function (eff) {
        if (eff.type === 'COLOR_OVERRIDE' && eff.colors) {
          if (!chosenColor) {
            throw new Error('色を選択してください: RED, BLUE, GREEN');
          }
          var validColors = eff.colors;
          var isValid = validColors.indexOf(chosenColor) !== -1;
          if (!isValid) {
            throw new Error('無効な色です: ' + chosenColor + ' (有効: ' + validColors.join(', ') + ')');
          }
          // 選択色をインスタンスに保存
          held.chosenColor = chosenColor;
        }
      });
    }

    // ---- PAY_COST ----
    player.availableCost -= def.cost;

    // HAND から強化カードを取り出し、対象虫の attachments へ追加
    // zone は FIELD のまま所有者情報を維持
    var fromArr = getPlayerZoneArray(state, playerId, ZONES.HAND);
    var idx = fromArr.indexOf(held);
    if (idx === -1) {
      throw new Error('useEnhancement: handInstance not in HAND');
    }
    fromArr.splice(idx, 1);
    held.zone = ZONES.FIELD;
    if (!target.attachments) { target.attachments = []; }
    target.attachments.push(held);
    // 【BLOCKED】装着時の currentHp 挙動は公式未確認。
    // 公式裁定確認まで currentHp は変化させない（最大HPのみ増加）。
    // base/max 1000 / current 600 に +500 装着 → max 1500 / current 600 の想定で実装。

    log(state, state.turnNumber, playerId + ' は ' + def.name + ' を ' + getCardDefinition(target.cardId).name + ' に装着した' + (chosenColor ? '(' + chosenColor + ')' : ''));
    return held;
  }

  // ---- 攻撃 ----

  function hasValidFieldInsects(state, player) {
    return hasAttackableInsect(state, player);
  }

  // プレイヤーが有効なスキルを持つ虫を場に持つか判定。
  // faceDown=true の虫は場にいないものとして扱う。
  // skillId: 特定のスキルIDを持つかどうかをチェック。undefinedなら任意のスキル。
  function hasEffectiveSkill(state, playerId, skillId) {
    var player = state.player(playerId);
    return player.field.some(function (inst) {
      if (inst.faceDown) { return false; }
      var def = getCardDefinition(inst.cardId);
      if (!def || !def.skills) { return false; }
      return def.skills.some(function (skill) {
        if (skillId && skill.id !== skillId) { return false; }
        return true;
      });
    });
  }

  // 合法な攻撃対象を返す。
  // 攻撃対象判定は以下の2段階で行う(＜擬態＞/＜りんぷん＞等をカード名分岐なしで共存させる)。
  //   1. まず isAttackTargetable() で「そもそも攻撃可能な虫」を取得(擬態中・faceDown等を除外)
  //   2. その中に attackTargetRule = 'FORCE_ATTACK_TO_SELF_GROUP' の能力を持つ虫が
  //      1体以上あれば(＜りんぷん＞等)、legal targets をその虫群だけに絞る
  //   3. そのような虫がなければ、通常のtargetable insects 全体をlegalにする
  //   4. 最終的にlegal insectが0体なら LEADER 直接攻撃を許可
  function getLegalAttackTargets(state, attackerInstanceId) {
    var holder = findAnywhere(state, attackerInstanceId);
    if (!holder) { return []; }
    if (state.activePlayerId !== holder.instance.ownerId) { return []; }
    if (state.phase !== Phases.MAIN_PHASE) { return []; }
    var attacker = holder.instance;
    if (attacker.zone !== ZONES.FIELD) { return []; }
    var restrictions = (attacker.runtimeFlags && attacker.runtimeFlags.attackRestrictions) || [];
    var attackBlocked = restrictions.some(function (restriction) {
      if (state.turnNumber < restriction.startTurn || state.turnNumber > restriction.endTurn) { return false; }
      if (!restriction.whileSourceOnField) { return true; }
      var source = restriction.sourceInstanceId && findAnywhere(state, restriction.sourceInstanceId);
      return !!(source && source.zone === ZONES.FIELD);
    });
    if (attackBlocked) { return []; }
    // 連続攻撃中は attackedThisTurn を無視
    var isContinuousAttack = false;
    if (attacker.runtimeFlags && attacker.runtimeFlags.continuousAttack) {
      var ca = attacker.runtimeFlags.continuousAttack;
      if (ca.usedCount < ca.maxCount) {
        isContinuousAttack = true;
      }
    }
    if (!isContinuousAttack && attacker.attackedThisTurn) { return []; }

    var opponentId = state.opponentOf(holder.instance.ownerId);
    var opponent = state.player(opponentId);
    var targets = [];

    // 段階1: まず攻撃可能(isAttackTargetable)な虫を列挙
    var targetable = [];
    opponent.field.forEach(function (defender) {
      if (isAttackTargetable(state, defender)) {
        targetable.push(defender);
      }
    });

    // 段階2: 攻撃対象を自分へ強制する能力を持ち、かつ攻撃可能な虫群を検出
    var forcing = targetable.filter(function (defender) {
      return hasTargetRule(state, defender, 'FORCE_ATTACK_TO_SELF_GROUP');
    });

    var legalPool = forcing.length > 0 ? forcing : targetable;

    legalPool.forEach(function (defender) {
      targets.push({ targetType: 'INSECT', instance: defender, playerId: opponentId });
    });

    // 段階4: legal insect が0体なら LEADER 直接攻撃
    if (targets.length === 0) {
      targets.push({ targetType: 'LEADER', instance: null, playerId: opponentId });
    }

    return targets;
  }

  // 虫が指定の attackTargetRule を持つ攻撃対象制限能力を持つか判定する(カード名分岐なし)。
  // skill.targetRule に FORCE_ATTACK_TO_SELF_GROUP 等を設定したスキル(＜鳴く＞・＜かばう＞等)を
  // 将来も再利用できる。
  function hasTargetRule(state, instance, rule) {
    if (!instance || instance.faceDown) { return false; }
    var def = getCardDefinition(instance.cardId);
    if (!def || !def.skills) { return false; }
    var ownRule = def.skills.some(function (skill) {
      return skill.targetRule === rule;
    });
    if (ownRule) { return true; }
    return (instance.attachments || []).some(function (attachment) {
      var attachmentDef = getCardDefinition(attachment.cardId);
      return !!(attachmentDef && (attachmentDef.enhancementEffects || []).some(function (effect) { return effect.targetRule === rule; }));
    });
  }

  // 攻撃実行。targetType は 'INSECT' | 'LEADER'
  function performAttack(state, attackerInstanceId, targetInstanceId, targetType, skillId, chosenSacrificeInstanceId, attackOptions) {
    attackOptions = attackOptions || {};
    assertActivePlayer(state, state.activePlayerId);
    if (state.phase !== Phases.MAIN_PHASE) {
      throw new Error('メインフェイズ以外では攻撃できません');
    }

    var ap = state.activePlayerId;
    var holder = findAnywhere(state, attackerInstanceId);
    if (!holder || holder.zone !== ZONES.FIELD) {
      throw new Error('攻撃する虫が場にいません');
    }
    var attacker = holder.instance;
    // 連続攻撃(カマ連撃等)中は attackedThisTurn を無視して許可
    var isContinuousAttack = false;
    if (attacker.runtimeFlags && attacker.runtimeFlags.continuousAttack) {
      var ca = attacker.runtimeFlags.continuousAttack;
      // 使用中のスキルIDと一致し、まだ最大回数に達していない場合
      if (ca.skillId === skillId && ca.usedCount < ca.maxCount) {
        isContinuousAttack = true;
      }
    }
    if (!isContinuousAttack && attacker.attackedThisTurn) {
      throw new Error('既に攻撃済みです');
    }

    // 合法対象チェック(エンジン側で検証)
    var legalTargets = getLegalAttackTargets(state, attackerInstanceId);
    var legal = false;
    if (targetType === 'INSECT') {
      legal = legalTargets.some(function (t) {
        return t.targetType === 'INSECT' && t.instance.instanceId === targetInstanceId;
      });
      if (!legal) {
        throw new Error('指定した攻撃対象は合法ではありません');
      }
    } else if (targetType === 'LEADER') {
      legal = legalTargets.some(function (t) { return t.targetType === 'LEADER'; });
      if (!legal) {
        throw new Error('相手の場に虫がいるため直接攻撃できません');
      }
    } else {
      throw new Error('不正な攻撃対象タイプです: ' + targetType);
    }

    var def = getCardDefinition(attacker.cardId);
    // 攻撃可能な技は timing === 'ATTACK' のもののみ
    var attackSkills = def.skills.filter(function (s) { return s.timing === 'ATTACK'; });
    if (attackSkills.length === 0) {
      throw new Error('攻撃技がありません');
    }
    var skill = attackSkills[0];
    if (skillId) {
      var found = attackSkills.filter(function (s) { return s.id === skillId; })[0];
      if (found) {
        skill = found;
      } else {
        throw new Error('指定されたスキルは攻撃技ではありません: ' + skillId);
      }
    }
    if (!skill) {
      throw new Error('攻撃技がありません');
    }

    // usageLimit チェック: ONCE_PER_FIELD_STAY の場合、同一CardInstanceの場滞在中に1度だけ使用可能
    if (skill.usageLimit === 'ONCE_PER_FIELD_STAY') {
      if (attacker.usedSkills && attacker.usedSkills.indexOf(skill.id) !== -1) {
        throw new Error('この技は場にいる間1度しか使用できません: ' + skill.name);
      }
    }

    // 追加コスト支払い
    if (skill.additionalCost && skill.additionalCost.length > 0) {
      payAdditionalCosts(state, attacker, skill.additionalCost, chosenSacrificeInstanceId);
    }

    // AP modifier (一時的な攻撃力補正) を適用
    var apVal = getEffectiveAP(state, attacker, skill.baseAp || 0, skill);

    var opponentId = state.opponentOf(ap);
    var result = {
      attackerInstanceId: attackerInstanceId,
      attacker: attacker,
      def: def,
      skill: skill,
      targetType: targetType,
      baseAp: skill.baseAp || 0,
      apVal: apVal,
      multiplier: 1,
      finalAp: 0,
      damageDealt: 0,
      defenderDestroyed: false,
      wasTerritoryDraw: false,
      victory: false,
      attackerName: def.name || attacker.cardId,
      skillName: skill.name || skill.id
    };

    emitBattleEvent(state, 'ATTACK', {
      sourceInstanceId: attacker.instanceId,
      targetInstanceId: targetInstanceId,
      targetType: targetType,
      skillId: skill.id,
      sourceName: result.attackerName
    });

    if (targetType === 'INSECT') {
      var defender = findInZone(state, opponentId, ZONES.FIELD, targetInstanceId);
      if (!defender) {
        throw new Error('対象の虫が場にいません');
      }
      var attackerColor = getEffectiveColor(attacker);
      var defenderColor = getEffectiveColor(defender);
      var multiplier = getAttributeMultiplier(attackerColor, defenderColor);
      var dmg = apVal * multiplier;
      result.multiplier = multiplier;
      result.finalAp = dmg;
      result.defenderName = (getCardDefinition(defender.cardId) || {}).name || defender.cardId;
      result.colorAdvText = multiplier === 2 ? '有利 ×2' : (multiplier === 1 ? '等倍 ×1' : (multiplier < 1 ? '不利 ×' + multiplier : '×' + multiplier));

      result.defenderPreHp = defender.currentHp;
      // 最終APは負数を保持できるが、ダメージは0を下限とする。
      var finalDmg = Math.max(0, dmg);
      var selfDestructAfterDamage = (skill.effects || []).some(function(effect){return effect.type === 'SELF_DESTRUCT_AFTER_DAMAGE_BEFORE_TARGET_DESTRUCTION';});
      applyDamage(state, attacker, defender, finalDmg, 'ATTACK', attacker.instanceId, targetInstanceId, result, { deferDestruction:selfDestructAfterDamage });
      if (selfDestructAfterDamage && attacker.zone === ZONES.FIELD) {
        destroyInsect(state, attacker.instanceId, 'ABILITY', attacker.instanceId, null, { skipTerritoryDraw:true });
      }
      if (selfDestructAfterDamage && defender.zone === ZONES.FIELD && defender.currentHp <= 0) {
        destroyInsect(state, defender.instanceId, 'ATTACK', attacker.instanceId, result);
      }

      // 攻撃ログ(戦闘検証用): 実際の計算値のみを使用
      log(state, state.turnNumber,
        ap + '「' + result.attackerName + '」→ 技「' + result.skillName + '」 AP' + result.baseAp + ' → ' +
        opponentId + '「' + result.defenderName + '」を攻撃 | 攻撃前HP: ' + result.defenderPreHp +
        ' | 色相性: ' + result.colorAdvText + ' | AP補正: ' + (result.apVal - result.baseAp) +
        ' | 最終AP: ' + result.finalAp + ' | ダメージ: ' + result.damageDealt +
        ' | 攻撃後HP: ' + result.defenderCurrentHp +
        (result.defenderDestroyed ? ' | → 「' + result.defenderName + '」破壊' : ''));
 
      // スキルの追加効果(effects)を解決 (くさいツノ等の統計修飾付与など)
      if (skill.effects && skill.effects.length > 0) {
        skill.effects.forEach(function (effect) {
          if (!effect) { return; }
          if (effect.type === 'APPLY_STAT_MODIFIER' && targetType === 'INSECT') {
            var mod = {
              id: effect.id,
              sourceInstanceId: attacker.instanceId,
              stat: effect.stat,
              amount: effect.amount,
              startTurn: (effect.startTurnOffset != null) ? (state.turnNumber + effect.startTurnOffset) : state.turnNumber,
              endTurn: (effect.endTurnOffset != null) ? (state.turnNumber + effect.endTurnOffset) : state.turnNumber
            };
            addStatModifier(state, defender, mod);
            result.statModifierApplied = true;
          }
          if (effect.type === 'APPLY_ATTACK_RESTRICTION' && targetType === 'INSECT') {
            if (!defender.runtimeFlags) { defender.runtimeFlags = {}; }
            if (!defender.runtimeFlags.attackRestrictions) { defender.runtimeFlags.attackRestrictions = []; }
            defender.runtimeFlags.attackRestrictions.push({
              sourceInstanceId: attacker.instanceId,
              startTurn: state.turnNumber + (effect.startTurnOffset || 0),
              endTurn: state.turnNumber + (effect.endTurnOffset || 0),
              whileSourceOnField: effect.whileSourceOnField === true
            });
          }
          if (effect.type === 'TURN_FACE_DOWN' && targetType === 'INSECT') {
            // すくい投げ等: 対象を裏向きにする (ターン終了時まで)
            defender.faceDown = true;
            if (!defender.runtimeFlags) { defender.runtimeFlags = {}; }
            defender.runtimeFlags.faceDownUntil = 'UNTIL_END_OF_TURN';
            result.turnedFaceDown = true;
          }
          if (effect.type === 'MOVE_ATTACK_TARGET_TO_HAND' && targetType === 'INSECT' && defender.zone === ZONES.FIELD) {
            moveCard(state, defender.instanceId, ZONES.FIELD, ZONES.HAND, { playerId: opponentId });
            result.targetMovedToHand = true;
          }
          if (effect.type === 'DAMAGE_DOES_NOT_HEAL' && targetType === 'INSECT' && defender.zone === ZONES.FIELD) {
            defender.runtimeFlags = defender.runtimeFlags || {};
            defender.runtimeFlags.damageDoesNotHeal = true;
          }
          if (effect.type === 'CHOOSE_COLOR_FOR_ALL_OPPONENT_FIELD' && targetType === 'INSECT') {
            if ([Attributes.RED,Attributes.BLUE,Attributes.GREEN].indexOf(attackOptions.chosenColor)===-1) throw new Error('赤・青・緑から色を選択してください');
            state.player(opponentId).field.forEach(function(card){card.runtimeFlags=card.runtimeFlags||{};card.runtimeFlags.colorOverride=attackOptions.chosenColor;card.runtimeFlags.colorOverrideUntil='UNTIL_END_OF_TURN';});
          }
          if (effect.type === 'TRANSFER_OWN_ATTACHMENT') {
            var transfer=findAttachment(state,attackOptions.attachmentInstanceId);
            var destination=findInZone(state,ap,ZONES.FIELD,attackOptions.destinationInstanceId);
            if(!transfer||transfer.playerId!==ap||!destination||destination===attacker||destination===transfer.host) throw new Error('付け替える強化と別の自分の虫を選択してください');
            transfer.host.attachments.splice(transfer.index,1); destination.attachments.push(transfer.instance);
          }
          
        });
      }
    } else if (targetType === 'LEADER') {
      var opp = state.player(opponentId);
      if (hasValidFieldInsects(state, opp)) {
        throw new Error('相手の場に虫がいるため直接攻撃できません');
      }
      result.defenderName = opponentId;
      log(state, state.turnNumber,
        ap + '「' + result.attackerName + '」→ 技「' + result.skillName + '」AP' + result.baseAp + ' → ' +
        opponentId + '本体へ直接攻撃');
      if (opp.territory.length > 0) {
        // 直接攻撃が成立 → 縄張りから1枚を手札へ
        result.zerosTerritory = false;
        var directFoodEffect=(skill.effects||[]).filter(function(effect){return effect.type==='ON_DIRECT_ATTACK_MOVE_OPPONENT_FOOD_TO_HAND';})[0];
        if(directFoodEffect&&opp.food.length){
          createCardSelection(state,{playerId:opponentId,options:opp.food.map(function(c){return c.instanceId;}),exactSelections:1,candidateZones:[ZONES.FOOD],selectionPurpose:'DIRECT_ATTACK_FOOD_RETURN',continuation:{type:'DIRECT_ATTACK_FOOD',territoryPlayerId:opponentId,territoryContext:null}});
        } else { drawTerritoryCard(state, opponentId); }
        result.wasTerritoryDraw = true;
        log(state, state.turnNumber, opponentId + ' は縄張りを1枚選択する');
      } else {
        // 相手縄張り0枚で直接攻撃成立 → 勝利
        result.zerosTerritory = true;
        state.winner = ap;
        state.phase = Phases.GAME_OVER;
        result.victory = true;
        log(state, state.turnNumber, ap + ' は ' + opponentId + '(縄張り0枚)へ直接攻撃し勝利した');
      }
    }

    attacker.attackedThisTurn = true;
    // usageLimit が ONCE_PER_FIELD_STAY の技を記録
    if (skill.usageLimit === 'ONCE_PER_FIELD_STAY') {
      if (!attacker.usedSkills) { attacker.usedSkills = []; }
      if (attacker.usedSkills.indexOf(skill.id) === -1) {
        attacker.usedSkills.push(skill.id);
      }
    }
    
    // 連続攻撃(カマ連撃)の可否を判定
    if (skill.effects) {
      skill.effects.forEach(function (effect) {
        if (effect.type === 'CONTINUOUS_ATTACK') {
          // 既存のcontinuousAttackフラグがあれば更新、なければ新規作成
          var ca = attacker.runtimeFlags && attacker.runtimeFlags.continuousAttack;
          if (ca && ca.skillId === skill.id && ca.usedCount < ca.maxCount) {
            // 2回目以降の攻撃実行時: usedCountをインクリメント
            ca.usedCount += 1;
            if (ca.usedCount >= ca.maxCount) {
              // 最大回数到達 → フラグ削除
              delete attacker.runtimeFlags.continuousAttack;
            }
            result.continuousAttackAvailable = ca.usedCount < ca.maxCount;
          } else if (!ca) {
            // 1回目の攻撃: 新規作成
            var canContinue = checkContinuousAttack(state, attacker, effect);
            if (canContinue) {
              if (!attacker.runtimeFlags) { attacker.runtimeFlags = {}; }
              attacker.runtimeFlags.continuousAttack = {
                maxCount: effect.maxCount || 2,
                usedCount: 1,
                skillId: skill.id,
                immediate: effect.immediate || false,
                requiresOpponentFieldInsect: effect.requiresOpponentFieldInsect || false
              };
              result.continuousAttackAvailable = true;
            }
          }
        }
      });
    }
    
    emitBattleEvent(state,'ATTACK_COMPLETED',{sourceInstanceId:attacker.instanceId,targetInstanceId:targetInstanceId,targetType:targetType,skillId:skill.id});
    log(state, state.turnNumber, ap + ' の ' + def.name + ' が攻撃した(' + (result.damageDealt || 0) + 'ダメージ)');
    return result;
  }

  function performMultiTargetAttack(state, attackerInstanceId, targetInstanceIds, skillId) {
    var holder=findAnywhere(state,attackerInstanceId);
    if(!holder||holder.zone!==ZONES.FIELD||holder.playerId!==state.activePlayerId) throw new Error('攻撃する虫が場にいません');
    var attacker=holder.instance, def=getCardDefinition(attacker.cardId);
    var skill=(def.skills||[]).filter(function(s){return s.id===skillId;})[0];
    var multi=skill&&(skill.effects||[]).filter(function(e){return e.type==='ATTACK_MULTIPLE_TARGETS';})[0];
    if(!multi||!Array.isArray(targetInstanceIds)||targetInstanceIds.length!==multi.exactSelections||targetInstanceIds[0]===targetInstanceIds[1]) throw new Error('異なる攻撃対象を2体選択してください');
    var legal=getLegalAttackTargets(state,attackerInstanceId).filter(function(t){return t.targetType==='INSECT';}).map(function(t){return t.instance.instanceId;});
    if(targetInstanceIds.some(function(id){return legal.indexOf(id)===-1;})) throw new Error('指定した攻撃対象は合法ではありません');
    var results=[];
    targetInstanceIds.forEach(function(id){
      var target=findInZone(state,state.opponentOf(holder.playerId),ZONES.FIELD,id);
      if(!target) return;
      var result={attackerInstanceId:attackerInstanceId,attacker:attacker,def:def,skill:skill,targetType:'INSECT',baseAp:skill.baseAp||0,apVal:getEffectiveAP(state,attacker,skill.baseAp||0,skill),multiplier:1,damageDealt:0,defenderDestroyed:false};
      result.multiplier=getAttributeMultiplier(getEffectiveColor(attacker),getEffectiveColor(target)); result.finalAp=result.apVal*result.multiplier;
      applyDamage(state,attacker,target,Math.max(0,result.finalAp),'ATTACK',attacker.instanceId,target.instanceId,result);
      results.push(result);
    });
    attacker.attackedThisTurn=true;
    emitBattleEvent(state,'ATTACK_COMPLETED',{sourceInstanceId:attacker.instanceId,skillId:skill.id,targetInstanceIds:targetInstanceIds.slice()});
    return results;
  }

  // 連続攻撃可否チェック (カマ連撃等)
  // requiresOpponentFieldInsect: 相手FIELDに面向き虫(faceDownでない虫)が存在する必要がある
  // 擬態虫は「場にいる」ので含める。faceDownのみ除外。
  function checkContinuousAttack(state, attacker, effect) {
    var maxCount = effect.maxCount || 2;
    // usedCountは呼び出し元で管理されるため、ここでは条件のみチェック
    
    var opponentId = state.opponentOf(attacker.ownerId);
    var oppField = state.player(opponentId).field;
    
    // requiresOpponentFieldInsect: 相手FIELDに面向き虫が存在する必要がある
    if (effect.requiresOpponentFieldInsect) {
      var opponent = state.player(opponentId);
      if (!hasFaceUpFieldInsect(opponent)) {
        return false; // 相手に面向き虫がいなければ連続攻撃不可
      }
    }
    
    return true;
  }

  // 直接攻撃可能判定用: isAttackTargetable() を使用
  // faceDown, 擬態保護中を除外
  function hasAttackableInsect(state, player) {
    return player.field.some(function (c) {
      return isAttackTargetable(state, c);
    });
  }

  // カマ連撃条件用: 面向き虫(faceDownでない)が存在するか
  // 擬態虫は含める
  function hasFaceUpFieldInsect(player) {
    return player.field.some(function (c) {
      return !c.faceDown;
    });
  }

  // カード色を返す。強化カードの COLOR_OVERRIDE 効果を優先する。
  // 玉虫色の羽化等の色変更は attachment 経由で参照される。
  // COLOR_OVERRIDE が colors 配列を持つ場合、attachment.chosenColor を優先
  function getEffectiveColor(instance) {
    if (instance.runtimeFlags && instance.runtimeFlags.colorOverride) { return instance.runtimeFlags.colorOverride; }
    var attachments = instance.attachments || [];
    for (var i = 0; i < attachments.length; i++) {
      var att = attachments[i];
      var attDef = global.getCardDefinition ? global.getCardDefinition(att.cardId) : null;
      if (!attDef || !attDef.enhancementEffects) { continue; }
      for (var j = 0; j < attDef.enhancementEffects.length; j++) {
        var e = attDef.enhancementEffects[j];
        if (e && e.type === 'COLOR_OVERRIDE') {
          // インスタンスに保存された chosenColor を最優先
          if (att.chosenColor) {
            return att.chosenColor;
          }
          // 互換性: 単一 color 指定の場合
          if (e.color) {
            return e.color;
          }
        }
      }
    }
    var def = global.getCardDefinition(instance.cardId);
    return def ? def.color : Attributes.COLORLESS;
  }

  // 追加コスト支払い (共食い等)
  function payAdditionalCosts(state, attacker, additionalCosts, chosenSacrificeInstanceId) {
    var ownerId = attacker.ownerId;
    var player = state.player(ownerId);
    
    additionalCosts.forEach(function (cost) {
      if (cost.type === 'SACRIFICE_OWN_INSECT') {
        var count = cost.amount || 1;
        // 自分の場から虫を選んで破壊 (攻撃者以外)
        var candidates = player.field.filter(function (c) {
          return c.instanceId !== attacker.instanceId;
        });
        if (candidates.length < count) {
          throw new Error('追加コストの自虫破壊に十分な虫がいません');
        }
        var chosen = candidates.filter(function (c) {
          return c.instanceId === chosenSacrificeInstanceId;
        })[0];
        if (!chosen) {
          throw new Error(chosenSacrificeInstanceId ? '指定された自虫は破壊対象にできません' : '破壊する自虫を選択してください');
        }
        if (count !== 1) {
          throw new Error('複数体の自虫破壊には対応していません');
        }
        destroyInsect(state, chosen.instanceId, 'SACRIFICE', attacker.instanceId, null, { skipTerritoryDraw: true });
      }
      if (cost.type === 'SACRIFICE_OWN_FOOD') {
        var foodCandidate=findInZone(state,ownerId,ZONES.FOOD,chosenSacrificeInstanceId);
        if(!foodCandidate) throw new Error('破壊するエサを選択してください');
        moveCard(state,foodCandidate.instanceId,ZONES.FOOD,ZONES.DISCARD,{playerId:ownerId});
      }
    });
  }

  function skillRequiresSacrifice(skill) {
    return !!(skill && skill.additionalCost && skill.additionalCost.some(function (cost) {
      return cost.type === 'SACRIFICE_OWN_INSECT';
    }));
  }

  function getSacrificeCandidates(state, attackerInstanceId) {
    var holder = findAnywhere(state, attackerInstanceId);
    if (!holder || holder.zone !== ZONES.FIELD) { return []; }
    return state.player(holder.instance.ownerId).field.filter(function (candidate) {
      return candidate.instanceId !== attackerInstanceId && !candidate.faceDown;
    });
  }

  // ダメージ適用 (target はダメージを受ける虫)
  function applyDamage(state, attacker, target, damage, sourceType, sourceInstanceId, targetInstanceId, result, opts) {
    opts = opts || {};
    if (target.zone !== ZONES.FIELD) {
      return target;
    }
    target.currentHp -= damage;
    result.damageDealt = damage;
    result.defenderCurrentHp = target.currentHp;
    var sourceDef = attacker && global.getCardDefinition ? global.getCardDefinition(attacker.cardId) : null;
    var targetDef = global.getCardDefinition ? global.getCardDefinition(target.cardId) : null;
    emitBattleEvent(state, 'DAMAGE', {
      sourceInstanceId: sourceInstanceId,
      targetInstanceId: targetInstanceId,
      damage: damage,
      baseDamage: result && result.apVal != null ? Math.max(0, result.apVal) : damage,
      damageType: sourceType,
      skillId: result && result.skill ? result.skill.id : null,
      effectId: result && result.effectId ? result.effectId : null,
      colorMultiplier: result && result.multiplier != null ? result.multiplier : 1,
      sourceName: sourceDef ? sourceDef.name : null,
      targetName: targetDef ? targetDef.name : null
    });
    if (target.currentHp <= 0 && !opts.deferDestruction) {
      destroyInsect(state, target.instanceId, sourceType, sourceInstanceId, result);
    }
    return target;
  }

  // 破壊。sourceType が ATTACK の場合のみ、破壊された側が縄張りから1枚引く。
  // sourceType: 'ATTACK' | 'SPELL' | 'ABILITY' | 'SACRIFICE' | 'EFFECT'
  function destroyInsect(state, targetInstanceId, sourceType, sourceInstanceId, result, opts) {
    opts = opts || {};
    var holder = findAnywhere(state, targetInstanceId);
    if (!holder || holder.zone !== ZONES.FIELD) {
      return null;
    }
    var destroyedCard = holder.instance;
    var defenderPlayerId = holder.playerId;
    
    // 破壊前に attachments を snapshot (死亡誘発で使用)
    var attachmentsSnapshot = (destroyedCard.attachments || []).slice();

    // 破壊確定前の置換。最初の合法な置換だけを適用し、DESTROYイベントは発生させない。
    for (var ri = 0; ri < attachmentsSnapshot.length; ri++) {
      var replacementAttachment = attachmentsSnapshot[ri];
      var replacementDef = getCardDefinition(replacementAttachment.cardId);
      var replacement = replacementDef && (replacementDef.enhancementEffects || []).filter(function(e){return e.type === 'DESTRUCTION_REPLACEMENT';})[0];
      if (!replacement) continue;
      var attachmentIndex = destroyedCard.attachments.indexOf(replacementAttachment);
      if (attachmentIndex !== -1) destroyedCard.attachments.splice(attachmentIndex,1);
      replacementAttachment.zone=ZONES.DISCARD;
      state.player(replacementAttachment.ownerId).discard.push(replacementAttachment);
      if (replacement.healToMax) destroyedCard.currentHp=calculateMaxHp(destroyedCard);
      emitBattleEvent(state,'DESTROY_REPLACED',{targetInstanceId:targetInstanceId,replacementInstanceId:replacementAttachment.instanceId,damageType:sourceType});
      if(result){result.defenderDestroyed=false;result.destructionReplaced=true;result.defenderCurrentHp=destroyedCard.currentHp;}
      return destroyedCard;
    }
    
    var destroyedDef = global.getCardDefinition ? global.getCardDefinition(destroyedCard.cardId) : null;
    var destroyedName = destroyedDef ? destroyedDef.name : destroyedCard.cardId;
    
    // FIELD→DISCARD へ移動 (1回だけ)
    moveCard(state, targetInstanceId, ZONES.FIELD, ZONES.DISCARD, { playerId: defenderPlayerId });
    emitBattleEvent(state, 'DESTROY', {
      sourceInstanceId: sourceInstanceId,
      targetInstanceId: targetInstanceId,
      damageType: sourceType,
      targetName: destroyedName
    });
    log(state, state.turnNumber, defenderPlayerId + '「' + destroyedName + '」が破壊された（' + sourceType + '）→ ' + defenderPlayerId + '捨て場へ');
    
    // onDestroyed triggers を解決 (死亡誘発) - host自身 + attachments 双方
    resolveOnDestroyedTriggers(state, destroyedCard, sourceType, sourceInstanceId, attachmentsSnapshot);
    
    if (result) {
      result.defenderDestroyed = true;
      result.destroyedInstanceId = targetInstanceId;
      result.sourceType = sourceType;
      result.sourceInstanceId = sourceInstanceId;
      result.targetInstanceId = targetInstanceId;
    }
    log(state, state.turnNumber, defenderPlayerId + ' の虫は破壊された');

    // 攻撃由来の破壊のみ、相手(破壊された側)が縄張りから1枚を手札へ加える
    if (sourceType === 'ATTACK' && !opts.skipTerritoryDraw) {
      var suppressed = state.player(defenderPlayerId).field.some(function(card){return (card.attachments||[]).some(function(att){var d=getCardDefinition(att.cardId);return d&&(d.enhancementEffects||[]).some(function(e){return e.type==='SUPPRESS_TERRITORY_DRAW_WHILE_ATTACHED';});});});
      if (!suppressed) {
        var sourceHolder=findAnywhere(state,sourceInstanceId), suppressTrigger=false;
        if(sourceHolder&&sourceHolder.zone===ZONES.FIELD){suppressTrigger=(sourceHolder.instance.attachments||[]).some(function(att){var d=getCardDefinition(att.cardId);return d&&(d.enhancementEffects||[]).some(function(e){return e.type==='SUPPRESS_TERRITORY_TRIGGER_FOR_ATTACK';});});}
        drawTerritoryCard(state, defenderPlayerId, {suppressTerritoryTrigger:suppressTrigger});
      }
    }
    return destroyedCard;
  }

  // 死亡誘発能力を解決 (host自身 + attachments 双方)
  function resolveOnDestroyedTriggers(state, destroyedCard, sourceType, sourceInstanceId, attachmentsSnapshot) {
    var def = global.getCardDefinition ? global.getCardDefinition(destroyedCard.cardId) : null;
    
    // host自身の passiveAbilities
    if (def && def.passiveAbilities) {
      var abilities = def.passiveAbilities.filter(function (a) {
        return a.timing === 'ON_DESTROYED';
      });
      
      abilities.forEach(function (ability) {
        if (ability.condition && !checkCondition(state, destroyedCard, ability.condition, sourceType, sourceInstanceId)) {
          return;
        }
        if (ability.effects) {
          ability.effects.forEach(function (effect) {
            resolveEffect(state, destroyedCard, effect, sourceType, sourceInstanceId);
          });
        }
      });
    }
    
    // attachments 側の ON_DESTROYED (針金虫の道連れ等)
    if (attachmentsSnapshot && attachmentsSnapshot.length > 0) {
      attachmentsSnapshot.forEach(function (att) {
        var attDef = global.getCardDefinition ? global.getCardDefinition(att.cardId) : null;
        if (!attDef || !attDef.passiveAbilities) { return; }
        
        var attAbilities = attDef.passiveAbilities.filter(function (a) {
          return a.timing === 'ON_DESTROYED';
        });
        
        attAbilities.forEach(function (ability) {
          if (ability.condition && !checkCondition(state, destroyedCard, ability.condition, sourceType, sourceInstanceId)) {
            return;
          }
          if (ability.effects) {
            ability.effects.forEach(function (effect) {
              resolveEffect(state, destroyedCard, effect, sourceType, sourceInstanceId);
            });
          }
        });
      });
    }
  }

  // 条件チェック
  function checkCondition(state, card, condition, sourceType, sourceInstanceId) {
    if (!condition) { return true; }
    if (condition.type === 'DESTROYED_BY_ATTACK') {
      return sourceType === 'ATTACK';
    }
    if (condition.type === 'DESTROYED_BY_OPPONENT_ATTACK') {
      return sourceType === 'ATTACK' && sourceInstanceId && 
        global.findAnywhere(state, sourceInstanceId).playerId !== card.ownerId;
    }
    return true;
  }

  // 汎用効果解決
  function resolveEffect(state, sourceCard, effect, sourceType, sourceInstanceId) {
    if (!effect) { return; }
    
    // MOVE_CARD: カード移動
    if (effect.type === 'MOVE_CARD') {
      var target = effect.target === 'SOURCE' ? sourceCard : 
        (effect.targetId ? global.findAnywhere(state, effect.targetId).instance : null);
      if (target && effect.from && effect.to) {
        global.moveCard(state, target.instanceId, effect.from, effect.to, { playerId: target.ownerId });
      }
    }
    
    // DEAL_DAMAGE: ダメージ
    if (effect.type === 'DEAL_DAMAGE') {
      var target = effect.targetId ? global.findAnywhere(state, effect.targetId).instance : null;
      if (target && target.zone === global.ZONES.FIELD) {
        var dmg = effect.amount || 0;
        global.applyDamage(state, sourceCard, target, dmg, 'ABILITY', sourceCard.instanceId, target.instanceId, {
          effectId: effect.id || effect.type,
          multiplier: 1,
          apVal: dmg
        });
      }
    }
    // DESTROY_SOURCE: 破壊元を破壊 (道連れ等)
    if (effect.type === 'DESTROY_SOURCE') {
      if (sourceInstanceId) {
        var holder = global.findAnywhere(state, sourceInstanceId);
        if (holder && holder.instance.zone === global.ZONES.FIELD) {
          global.destroyInsect(state, sourceInstanceId, 'ABILITY', sourceCard.instanceId, null, { skipTerritoryDraw: true });
        }
      }
    }
    if (effect.type === 'RETURN_ATTACK_SOURCE_TO_HAND' && sourceInstanceId) {
      var sourceHolder = global.findAnywhere(state, sourceInstanceId);
      if (sourceHolder && sourceHolder.zone === global.ZONES.FIELD) {
        global.moveCard(state, sourceInstanceId, global.ZONES.FIELD, global.ZONES.HAND, { playerId: sourceHolder.playerId });
      }
    }
  }

  // ---- ターン終了 ----

  function healFieldDamage(player) {
    player.field.forEach(function (c) {
      if (!(c.runtimeFlags && c.runtimeFlags.damageDoesNotHeal)) c.currentHp = calculateCurrentMaxHp(c);
    });
  }

function endTurn(state) {
    if (state.phase === Phases.GAME_OVER) { return state; }
    assertActivePlayer(state, state.activePlayerId);
    if (state.phase !== Phases.MAIN_PHASE) {
      throw new Error('メインフェイズ以外ではターンを終了できません');
    }

    var ap = state.activePlayerId;
    var player = state.player(ap);
    player.availableCost = 0;
    var delayedDestructions = [];
    state.playerOrder.forEach(function (pid) {
      state.player(pid).field.forEach(function (card) {
        if (card.runtimeFlags && card.runtimeFlags.destroyAtEndTurn === state.turnNumber) { delayedDestructions.push(card.instanceId); }
      });
    });
    delayedDestructions.forEach(function (instanceId) {
      destroyInsect(state, instanceId, 'EFFECT', null, null, { skipTerritoryDraw: true });
    });
    
    // 全プレイヤーの場のダメージを回復
    state.playerOrder.forEach(function (pid) {
      healFieldDamage(state.player(pid));
    });
    player.field.forEach(function (c) {
      c.attackedThisTurn = false;
      // faceDown 解除 (UNTIL_END_OF_TURN のカードを全プレイヤーのFIELDから処理)
      if (c.runtimeFlags && c.runtimeFlags.faceDownUntil === 'UNTIL_END_OF_TURN') {
        c.faceDown = false;
        c.runtimeFlags.faceDownUntil = null;
        // 裏向きで付いていた強化カードも表向きに戻る (zoneは変わらない)
        if (c.attachments) {
          c.attachments.forEach(function (att) {
            // attachmentはzone=FIELDのままなので特に処理不要
          });
        }
      }
      // usedSkills はターン単位で全消去しない。ONCE_PER_FIELD_STAY 等の usage state は
      // 場にいる間保持され、場を離れた時点で zone-engine が該当履歴をリセットする。
      // 将来 ONCE_PER_TURN を追加する場合は、ここで該当タイプのみリセットする。
    });
    player.foodSetThisTurn = 0;

    if (state.winner) {
      state.phase = Phases.GAME_OVER;
      return state;
    }

    // ターン終了時に faceDown 解除 (UNTIL_END_OF_TURN のカードを全プレイヤーのFIELDから処理)
    var allPlayers = state.playerOrder;
    allPlayers.forEach(function (pid) {
      var pl = state.player(pid);
      pl.field.forEach(function (c) {
        if (c.runtimeFlags && c.runtimeFlags.faceDownUntil === 'UNTIL_END_OF_TURN') {
          c.faceDown = false;
          c.runtimeFlags.faceDownUntil = null;
          // 裏向きで付いていた強化カードも表向きに戻る (zoneは変わらない)
          if (c.attachments) {
            c.attachments.forEach(function (att) {
              // attachmentはzone=FIELDのままなので特に処理不要
            });
          }
        }
        if (c.runtimeFlags && c.runtimeFlags.colorOverrideUntil === 'UNTIL_END_OF_TURN') { delete c.runtimeFlags.colorOverride; delete c.runtimeFlags.colorOverrideUntil; }
        // usedSkills はターン単位で全消去しない。ONCE_PER_FIELD_STAY 等の usage state は
        // 場にいる間保持され、場を離れた時点で zone-engine が該当履歴をリセットする。
        // 将来 ONCE_PER_TURN を追加する場合は、ここで該当タイプのみリセットする。
      });
    });

    log(state, state.turnNumber, ap + ' のターン終了');
    state.activePlayerId = state.opponentOf(ap);
    state.turnNumber += 1;
    // ターン番号更新に伴い、期限切れ statModifier を全場面で掃除
    allPlayers.forEach(function (pid) {
      var pl = state.player(pid);
      pl.field.forEach(function (c) {
        global.pruneStatModifiers(state, c, false);
      });
    });
    state.phase = Phases.TURN_START;
    beginTurn(state);
    return state;
  }

  global.shuffleArray = shuffleArray;
  global.determineFirstPlayer = determineFirstPlayer;
  global.startGame = startGame;
  global.beginTurn = beginTurn;
  global.drawCard = drawCard;
  global.drawTerritoryCard = drawTerritoryCard;
  global.checkTerritoryDrawTrigger = checkTerritoryDrawTrigger;
  global.finalizeTerritoryDraw = finalizeTerritoryDraw;
  global.resolvePendingTerritoryChoice = resolvePendingTerritoryChoice;
  global.getPendingEffect = getPendingEffect;
  global.hasEffectiveSkill = hasEffectiveSkill;
  // 縄張りドロー選択の解決
  function resolvePendingTerritoryChoice(state, choice) {
    var pending = state.pendingEffect;
    if (!pending || pending.type !== 'TERRITORY_DRAW_CHOICE') {
      throw new Error('解決待ちの縄張りドロー選択がありません');
    }
    if (choice !== 'USE_TOBIDASU' && choice !== 'TAKE_TO_HAND') {
      throw new Error('不正な選択: ' + choice);
    }

    var cardInstanceId = pending.cardInstanceId;
    var ownerId = pending.playerId;
    var card = findAnywhere(state, cardInstanceId).instance;

    state.pendingEffect = null;

    if (choice === 'USE_TOBIDASU') {
      // FIELD へ
      return finalizeTerritoryDraw(state, ownerId, card, 'FIELD');
    } else {
      // HAND へ
      return finalizeTerritoryDraw(state, ownerId, card, 'HAND');
    }
  }

  // 現在の pending effect を取得 (UI 用)
  function getPendingEffect(state) {
    return state.pendingEffect || null;
  }

  function resolveDiscardInsectSelection(state, playerId, instanceId) {
    var pending = state.pendingEffect;
    if (!pending || pending.type !== 'DISCARD_INSECT_SELECTION' || pending.playerId !== playerId) {
      throw new Error('捨て場の虫選択待ちではありません');
    }
    if (pending.options.indexOf(instanceId) === -1) {
      throw new Error('その虫は回収対象に選択できません');
    }
    var candidate = findInZone(state, playerId, ZONES.DISCARD, instanceId);
    var def = candidate ? getCardDefinition(candidate.cardId) : null;
    if (!candidate || !def || def.type !== CardTypes.INSECT) {
      throw new Error('選択した虫が捨て場にありません');
    }
    state.pendingEffect = null;
    return moveCard(state, instanceId, ZONES.DISCARD, ZONES.HAND, { playerId: playerId });
  }

  function resolveSpellTargetSelection(state, playerId, instanceId) {
    var pending = state.pendingEffect;
    if (!pending || pending.type !== 'SPELL_TARGET_SELECTION' || pending.playerId !== playerId) {
      throw new Error('術の対象選択待ちではありません');
    }
    if (pending.options.indexOf(instanceId) === -1) {
      throw new Error('その虫は術の対象に選択できません');
    }
    state.pendingEffect = null;
    try {
      return useSpell(state, playerId, pending.sourceInstanceId, instanceId);
    } catch (err) {
      state.pendingEffect = pending;
      throw err;
    }
  }

  global.resolvePendingTerritoryChoice = resolvePendingTerritoryChoice;
  global.resolveTerritoryDrawSelection = resolveTerritoryDrawSelection;
  global.triggerTerritoryDrawSelection = triggerTerritoryDrawSelection;
  global.getPendingEffect = getPendingEffect;
  global.resolveDiscardInsectSelection = resolveDiscardInsectSelection;
  global.resolveSpellTargetSelection = resolveSpellTargetSelection;
  global.createCardSelection = createCardSelection;
  global.resolveCardSelection = resolveCardSelection;
  global.selectPendingCard = selectPendingCard;
  global.completeCardSelection = completeCardSelection;
  global.setFood = setFood;
  global.gainCost = gainCost;
  global.enterMainPhase = enterMainPhase;
  global.summonInsect = summonInsect;
  global.useSpell = useSpell;
  global.getSpellTargetCandidates = getSpellTargetCandidates;
  global.resolveSpellEffects = resolveSpellEffects;
  global.getLegalAttackTargets = getLegalAttackTargets;
  global.performAttack = performAttack;
  global.performMultiTargetAttack = performMultiTargetAttack;
  global.skillRequiresSacrifice = skillRequiresSacrifice;
  global.getSacrificeCandidates = getSacrificeCandidates;
  global.applyDamage = applyDamage;
  global.destroyInsect = destroyInsect;
  global.endTurn = endTurn;
  global.useEnhancement = useEnhancement;
  global.getEffectiveColor = getEffectiveColor;
  global.resolveOnDestroyedTriggers = resolveOnDestroyedTriggers;
  global.resolveEffect = resolveEffect;
  global.checkCondition = checkCondition;
  global.enterSetPhase = enterSetPhase;
  global.emitBattleEvent = emitBattleEvent;
  global.getBattleEventsSince = getBattleEventsSince;
  global.isManualDrawPlayer = isManualDrawPlayer;
  global.expectsDraw = expectsDraw;
  global.drawCardOnce = drawCardOnce;
})(typeof window !== 'undefined' ? window : globalThis);
