(function (global) {
  'use strict';
  var opponentAttackSelectionToken = {};

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

    var territoryHpSnapshots=state.player(playerId).field.map(function(fieldCard){return {card:fieldCard,maxHp:calculateMaxHp(fieldCard,state)};});
    moveCard(state, instanceId, ZONES.TERRITORY, ZONES.RESOLVING, { playerId: playerId });
    territoryHpSnapshots.forEach(function(snapshot){snapshot.card.currentHp+=calculateMaxHp(snapshot.card,state)-snapshot.maxHp;});
    state.player(playerId).field.forEach(function(fieldCard){
      var fieldDef=getCardDefinition(fieldCard.cardId),controller=fieldCard.controllerId||fieldCard.ownerId;
      var gains=fieldDef&&(fieldDef.passiveAbilities||[]).some(function(ability){return (ability.effects||[]).some(function(effect){return effect.type==='GAIN_AP_PER_TERRITORY_DRAW_ON_OPPONENT_TURN';});});
      if(gains&&state.activePlayerId!==controller){fieldCard.runtimeFlags=fieldCard.runtimeFlags||{};fieldCard.runtimeFlags.territoryDrawApBonus=(fieldCard.runtimeFlags.territoryDrawApBonus||0)+300;}
    });
    state.pendingEffect = null;

    log(state, state.turnNumber, playerId + ' は縄張りを選択した');

    // 互換性: 既存の onTerritoryDraw フックを呼び出し (Test18 等)
    if (state.onTerritoryDraw) {
      state.onTerritoryDraw(playerId, card);
    }

    // <とびだす> 判定へ
    var drawn = checkTerritoryDrawTrigger(state, playerId, card, pending.context);
    if (pending.context && pending.context.attackSourceInstanceId) {
      resumeAfterSelection(state, { type: 'TERRITORY_ATTACK_EFFECTS', context: pending.context, territoryPlayerId: playerId });
    }
    resumeAfterSelection(state, pending.afterResolution);
    return drawn;
  }

  // Serializable work suspended by a territory/trigger choice. A choice that
  // opens another choice passes the same continuation on instead of losing it.
  function resumeAfterSelection(state, continuation) {
    if (!continuation) { return; }
    if (state.pendingEffect) {
      var previous = state.pendingEffect.afterResolution;
      state.pendingEffect.afterResolution = previous ? { type: 'SEQUENCE', steps: [previous, continuation] } : continuation;
      return;
    }
    if (continuation.type === 'SEQUENCE') {
      continuation.steps.forEach(function(step) { resumeAfterSelection(state, step); });
      return;
    }
    if (continuation.type === 'DESTROYED_CARD_FOLLOWUP') { finishDestroyedCard(state, continuation); return; }
    if (continuation.type === 'DESTROYED_TERRITORY_FOLLOWUP') { finishDestroyedTerritory(state, continuation.context); return; }
    if (continuation.type === 'ATTACK_AFTER_DEFENDER_EXCHANGE') {
      performAttack(state, continuation.attackerInstanceId, continuation.targetInstanceId, 'INSECT', continuation.skillId, null,
        { preDamageExchangeResolved:true, skipTargetLegality:true });
      return;
    }
    if (continuation.type === 'USE_SPELL_TERRITORY_PAYMENT') {
      useSpell(state, continuation.playerId, continuation.sourceInstanceId, continuation.targetInstanceId,
        { paymentMode:'TERRITORY', territoryPaymentIds:continuation.territoryPaymentIds });
      return;
    }
    if(continuation.type==='TRACKED_REVIVAL_SEQUENCE'){
      var trackedMoves=(continuation.moves||[]).slice();
      if(!trackedMoves.length)return;
      var trackedMove=trackedMoves.shift(),trackedHolder=findAnywhere(state,trackedMove.instanceId);
      if(!trackedHolder||trackedHolder.zone!==ZONES.DISCARD){resumeAfterSelection(state,{type:'TRACKED_REVIVAL_SEQUENCE',moves:trackedMoves,attachmentInstanceId:continuation.attachmentInstanceId,hostInstanceId:continuation.hostInstanceId});return;}
      var revived=moveCard(state,trackedMove.instanceId,ZONES.DISCARD,ZONES.FIELD,{playerId:continuation.playerId,deferEntryEffects:true,runtimeFlags:{suppressKeywordSkills:true,trackedByAttachmentIds:[continuation.attachmentInstanceId]}});
      if(revived.instanceId===continuation.hostInstanceId){
        var resolvingAttachment=findInZone(state,continuation.playerId,ZONES.RESOLVING,continuation.attachmentInstanceId);
        if(resolvingAttachment){var resolving=state.player(continuation.playerId).resolving;resolving.splice(resolving.indexOf(resolvingAttachment),1);resolvingAttachment.zone=ZONES.FIELD;revived.attachments=revived.attachments||[];revived.attachments.push(resolvingAttachment);}
      }
      resolveFieldEntryEffects(state,revived.instanceId);
      resumeAfterSelection(state,{type:'TRACKED_REVIVAL_SEQUENCE',moves:trackedMoves,attachmentInstanceId:continuation.attachmentInstanceId,hostInstanceId:continuation.hostInstanceId,playerId:continuation.playerId});
      return;
    }
    if(continuation.type==='DESTROY_TRACKED_SEQUENCE'){
      var trackedIds=(continuation.instanceIds||[]).slice();if(!trackedIds.length)return;var trackedId=trackedIds.shift(),tracked=findAnywhere(state,trackedId);
      if(tracked&&tracked.zone===ZONES.FIELD){destroyInsect(state,trackedId,'EFFECT',continuation.attachmentInstanceId,null,{skipTerritoryDraw:true});}
      resumeAfterSelection(state,{type:'DESTROY_TRACKED_SEQUENCE',instanceIds:trackedIds,attachmentInstanceId:continuation.attachmentInstanceId});return;
    }
    if(continuation.type==='DISCARD_HAND_DOWN_SEQUENCE'){
      var discardPlayers=(continuation.playerIds||[]).slice();if(!discardPlayers.length)return;var discardId=discardPlayers.shift(),discardPlayer=state.player(discardId),needed=Math.max(0,discardPlayer.hand.length-continuation.limit);
      if(needed){createCardSelection(state,{playerId:discardId,options:discardPlayer.hand.map(function(c){return c.instanceId;}),exactSelections:needed,candidateZones:[ZONES.HAND],selectionPurpose:'DISCARD_HAND_DOWN_TO',continuation:{type:'DISCARD_SELECTED_HAND',targetPlayerId:discardId}});state.pendingEffect.afterResolution={type:'DISCARD_HAND_DOWN_SEQUENCE',playerIds:discardPlayers,limit:continuation.limit};}
      else{resumeAfterSelection(state,{type:'DISCARD_HAND_DOWN_SEQUENCE',playerIds:discardPlayers,limit:continuation.limit});}return;
    }
    if (continuation.type === 'SERIAL_ZONE_MOVES') {
      var remainingMoves = (continuation.moves || []).slice();
      if (!remainingMoves.length) { return; }
      var nextMove = remainingMoves.shift();
      var currentHolder = findAnywhere(state, nextMove.instanceId);
      // A preceding trigger may legally move or destroy a later candidate. In
      // that case it is no longer eligible for the original move, so skip it
      // rather than reviving it from a stale snapshot.
      if (!currentHolder || currentHolder.zone !== nextMove.from ||
          (nextMove.sourcePlayerId && currentHolder.playerId !== nextMove.sourcePlayerId)) {
        resumeAfterSelection(state, { type: 'SERIAL_ZONE_MOVES', moves: remainingMoves });
        return;
      }
      var serialMoved = moveCard(state, nextMove.instanceId, nextMove.from, nextMove.to, {
        playerId: nextMove.playerId || currentHolder.playerId,
        faceDown: nextMove.faceDown,
        deferEntryEffects: true,
        runtimeFlags: nextMove.runtimeFlags
      });
      if (nextMove.runtimeFlags) {
        serialMoved.runtimeFlags = serialMoved.runtimeFlags || {};
        Object.keys(nextMove.runtimeFlags).forEach(function(flag) {
          serialMoved.runtimeFlags[flag] = nextMove.runtimeFlags[flag];
        });
      }
      if (nextMove.from !== ZONES.FIELD && nextMove.to === ZONES.FIELD) {
        resolveFieldEntryEffects(state, serialMoved.instanceId);
      }
      resumeAfterSelection(state, { type: 'SERIAL_ZONE_MOVES', moves: remainingMoves });
      return;
    }
    if (continuation.type === 'FIELD_ENTRY_EFFECT') {
      var entryEffect = continuation.effect;
      if (entryEffect.type === 'CHOOSE_SELF_COLOR') {
        var colorLabels = { RED: '赤', BLUE: '青', GREEN: '緑', COLORLESS: '無色' };
        var choices = entryEffect.colors.map(function(color) { return { value: color, label: colorLabels[color] }; });
        if (continuation.optional) { choices.push({ value: 'DECLINE', label: '変更しない' }); }
        state.pendingEffect = { type: 'CHOICE_SELECTION', playerId: continuation.playerId,
          controller: continuation.playerId, prompt: 'このターンの色を選んでください', options: choices,
          continuation: { type: 'SET_SELF_COLOR', sourceInstanceId: continuation.sourceInstanceId } };
        return;
      }
      if(entryEffect.type==='CHOOSE_OWN_FOOD_COLOR'){
        var foodChoices=entryEffect.colors.map(function(color){return {value:color,label:color};});
        if(continuation.optional){foodChoices.push({value:'DECLINE',label:'変更しない'});}
        state.pendingEffect={type:'CHOICE_SELECTION',playerId:continuation.playerId,controller:continuation.playerId,selectionPurpose:'OWN_FOOD_COLOR',prompt:'エサの色を選んでください',options:foodChoices,continuation:{type:'SET_OWN_FOOD_COLOR',playerId:continuation.playerId,endTurn:state.turnNumber+(entryEffect.endTurnOffset||0)}};return;
      }
      if(entryEffect.type==='IGNORE_WEAKNESS_NEXT_OPPONENT_TURN'||entryEffect.type==='PREVENT_ATTACK_TARGET_NEXT_OPPONENT_TURN'){
        var protectedEntry=findAnywhere(state,continuation.sourceInstanceId);
        if(protectedEntry){protectedEntry.instance.runtimeFlags=protectedEntry.instance.runtimeFlags||{};protectedEntry.instance.runtimeFlags[entryEffect.type==='IGNORE_WEAKNESS_NEXT_OPPONENT_TURN'?'ignoreWeaknessTurn':'preventAttackTargetTurn']=state.turnNumber+(state.activePlayerId===protectedEntry.playerId?1:2);}return;
      }
      if (entryEffect.type === 'MOVE_SELECTED') {
        var entryCandidates = getPlayerZoneArray(state, continuation.playerId, entryEffect.from).filter(function(card) {
          var definition = getCardDefinition(card.cardId);
          return (!entryEffect.cardType || definition.type === entryEffect.cardType) &&
            (!entryEffect.requiredTag || definition.tags.indexOf(entryEffect.requiredTag) !== -1);
        });
        if (!entryCandidates.length) { return; }
        createCardSelection(state, { playerId: continuation.playerId,
          options: entryCandidates.map(function(card) { return card.instanceId; }),
          minSelections: continuation.optional ? 0 : 1, maxSelections: entryEffect.count || 1,
          candidateZones: [entryEffect.from], selectionPurpose: 'ON_ENTER_FIELD_MOVE',
          continuation: { type: 'MOVE_SELECTED', from: entryEffect.from, to: entryEffect.to, grantCost: entryEffect.grantCost,
            cardType: entryEffect.cardType, requiredTag: entryEffect.requiredTag, prohibitAttackThisTurn: entryEffect.prohibitAttackThisTurn } });
      }
      if (entryEffect.type === 'DEAL_DAMAGE_TO_TARGET' && entryEffect.target === 'OPPONENT_FIELD_INSECT') {
        var entryTargets = state.player(state.opponentOf(continuation.playerId)).field.filter(function(card){return !card.faceDown;});
        if (!entryTargets.length) { return; }
        createCardSelection(state,{playerId:continuation.playerId,options:entryTargets.map(function(card){return card.instanceId;}),
          minSelections:continuation.optional?0:1,maxSelections:1,candidateZones:[ZONES.FIELD],selectionPurpose:'ON_ENTER_FIELD_DAMAGE',
          continuation:{type:'ENTRY_DAMAGE',sourceInstanceId:continuation.sourceInstanceId,targetPlayerId:state.opponentOf(continuation.playerId),
            amount:entryEffect.amount,suppressTerritoryDraw:!!entryEffect.suppressTerritoryDraw}});
      }
      if (entryEffect.type === 'DESTROY_SELF_AT_END_TURN_UNLESS_ATTACHED') {
        var scheduledSelf=findAnywhere(state,continuation.sourceInstanceId);
        if(scheduledSelf&&scheduledSelf.zone===ZONES.FIELD){scheduledSelf.instance.runtimeFlags=scheduledSelf.instance.runtimeFlags||{};scheduledSelf.instance.runtimeFlags.destroyAtEndTurnUnlessAttached=state.turnNumber;}
      }
      return;
    }
    if (continuation.type === 'TERRITORY_ATTACK_EFFECTS') {
      var attackContext = continuation.context;
      var source = findAnywhere(state, attackContext.attackSourceInstanceId);
      if (!source || source.zone !== ZONES.FIELD) { return; }
      var sourceDefinition = getCardDefinition(source.instance.cardId);
      var attackSkill = (sourceDefinition.skills || []).filter(function(skill) { return skill.id === attackContext.skillId; })[0];
      (attackSkill && attackSkill.effects || []).forEach(function(effect) {
        if (effect.type === 'GROW_ON_TERRITORY') {
          ['HP', 'AP'].forEach(function(stat) {
            addStatModifier(state, source.instance, { sourceInstanceId: source.instance.instanceId,
              stat: stat, amount: effect.amount, duration: 'FIELD_STAY' });
          });
        }
        if (effect.type === 'DISCARD_OPPONENT_HAND_ON_TERRITORY') {
          var discardPlayer=state.player(continuation.territoryPlayerId);
          if(discardPlayer.hand.length){createCardSelection(state,{playerId:continuation.territoryPlayerId,options:discardPlayer.hand.map(function(c){return c.instanceId;}),exactSelections:effect.count||1,candidateZones:[ZONES.HAND],selectionPurpose:'OPPONENT_HAND_DISCARD',continuation:{type:'DISCARD_SELECTED_HAND',targetPlayerId:continuation.territoryPlayerId}});}
        }
      });
      if (attackSkill && (attackSkill.effects || []).some(function(effect) { return effect.type === 'OPTIONAL_FLIP_FOOD_ON_TERRITORY'; })) {
        var food = state.player(continuation.territoryPlayerId).food.filter(function(c) { return !c.faceDown; });
        if (food.length) {
          createCardSelection(state, { playerId: source.playerId, options: food.map(function(c) { return c.instanceId; }),
            minSelections: 0, maxSelections: 1, candidateZones: [ZONES.FOOD], selectionPurpose: 'FLIP_OPPONENT_FOOD',
            continuation: { type: 'FLIP_SELECTED_FOOD', targetPlayerId: continuation.territoryPlayerId } });
        }
      }
      return;
    }
    if (continuation.type === 'MULTI_ATTACK_REMAINING') { continueMultiTargetAttack(state, continuation); return; }
    if (continuation.type === 'HIDE_ATTACK_SOURCE') {
      var holder = findAnywhere(state, continuation.instanceId);
      if (holder && holder.zone === ZONES.FIELD && holder.instance.enteredFieldTurn === continuation.enteredFieldTurn) {
        holder.instance.faceDown = true;
        holder.instance.runtimeFlags = holder.instance.runtimeFlags || {};
        holder.instance.runtimeFlags.faceDownUntilTurn = continuation.endTurn;
      }
      return;
    }
    throw new Error('未対応の継続処理: ' + continuation.type);
  }

  // 縄張りドロー（攻撃破壊・直接攻撃時）
  function drawTerritoryCard(state, playerId, territoryContext) {
    return triggerTerritoryDrawSelection(state, playerId, territoryContext);
  }

  // 縄張りドロー後の誘発処理を確認
  function checkTerritoryDrawTrigger(state, playerId, card, context) {
    var def = getCardDefinition(card.cardId);
    var territoryAttachment=def&&(def.enhancementEffects||[]).some(function(effect){return effect.type==='OPTIONAL_ATTACH_FROM_TERRITORY';});
    if(territoryAttachment){
      var attachmentHosts=state.player(playerId).field.filter(function(host){return !host.faceDown;});
      if(attachmentHosts.length){createCardSelection(state,{playerId:playerId,options:attachmentHosts.map(function(host){return host.instanceId;}),minSelections:0,maxSelections:1,candidateZones:[ZONES.FIELD],selectionPurpose:'ATTACH_FROM_TERRITORY',continuation:{type:'ATTACH_TERRITORY_CARD',attachmentInstanceId:card.instanceId}});return card;}
    }
    if (!def || !def.skills) {
      // 誘発なし → HAND へ
      return finalizeTerritoryDraw(state, playerId, card, card.runtimeFlags && card.runtimeFlags.specialTerritoryDrawDestination || 'HAND');
    }

    // timing === 'TERRITORY_DRAW' かつ optional なスキルを探す
    var triggerSkill = !(card.runtimeFlags && card.runtimeFlags.suppressKeywordSkills) && def.skills.find(function (skill) {
      return skill.timing === 'TERRITORY_DRAW' && skill.optional === true;
    });

    var grant = state.player(playerId).territoryTriggerGrant;
    if (grant && grant.active && state.player(playerId).territory.length === 0) { grant.active = false; }
    if (!triggerSkill && grant && grant.active && !(card.runtimeFlags && card.runtimeFlags.suppressKeywordSkills) &&
        def.type === CardTypes.INSECT && (def.tags || []).some(function(tag) {
          return (grant.familySuffixes || []).some(function(suffix) { return tag.slice(-suffix.length) === suffix; });
        })) {
      triggerSkill = { id: grant.skillId || 'tobidasu', timing:'TERRITORY_DRAW', optional:true };
    }

    if (!triggerSkill) {
      // 誘発スキルなし → HAND へ
      return finalizeTerritoryDraw(state, playerId, card, card.runtimeFlags && card.runtimeFlags.specialTerritoryDrawDestination || 'HAND');
    }

    // ＜とびだす＞使用条件チェック: 自分の場に有効な同スキル持ちがいるか
    // hasEffectiveSkill が faceDown 判定などを集約
    var ownerId = card.ownerId;
    var hasSkillOnField = hasEffectiveSkill(state, ownerId, triggerSkill.id);

    var suppressedUntil = state.player(playerId).territoryTriggerSuppressionUntilTurn;
    if (hasSkillOnField || (context && context.suppressTerritoryTrigger) ||
        (suppressedUntil != null && state.turnNumber <= suppressedUntil)) {
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

  function getEffectiveCardCost(state, playerId, definition, context) {
    context = context || {};
    if (!definition) { return 0; }
    var cost = definition.cost != null ? definition.cost : 0;
    var player = state.player(playerId);
    (definition.costModifiers || []).forEach(function (modifier) {
      if (modifier.type === 'PER_FACE_UP_FOOD_COLOR') {
        var count = player.food.filter(function (card) {
          var foodDef = !card.faceDown && getCardDefinition(card.cardId);
          return foodDef && foodDef.color === modifier.color;
        }).length;
        cost += Math.floor(count / modifier.per) * modifier.amount;
      }
      if (modifier.type === 'OWN_FIELD_EMPTY' && !player.field.some(function (card) { return !card.faceDown; })) {
        cost += modifier.amount;
      }
      if (modifier.minimum != null) { cost = Math.max(modifier.minimum, cost); }
    });
    state.playerOrder.forEach(function (controllerId) {
      state.player(controllerId).field.forEach(function (source) {
        if (source.faceDown) { return; }
        var sourceDef = getCardDefinition(source.cardId);
        (sourceDef && sourceDef.passiveAbilities || []).forEach(function (ability) {
          (ability.effects || []).forEach(function (effect) {
            if (effect.type !== 'CARD_COST_MODIFIER' || (effect.cardType && effect.cardType !== definition.type)) { return; }
            if (effect.affects !== 'ALL_PLAYERS' && controllerId !== playerId) { return; }
            if (effect.printedCostMax != null && definition.cost > effect.printedCostMax) { return; }
            if (effect.target === 'SELF' && context.targetInstanceId !== source.instanceId) { return; }
            cost += effect.amount;
            if (effect.minimum != null) { cost = Math.max(effect.minimum, cost); }
          });
        });
      });
    });
    if(definition.type===CardTypes.ENHANCEMENT&&player.nextEnhancementDiscount&&state.turnNumber<=player.nextEnhancementDiscount.endTurn){cost-=player.nextEnhancementDiscount.amount;}
    (player.runtimeCostModifiers||[]).forEach(function(modifier){if(definition.type===modifier.cardType&&state.turnNumber>=modifier.startTurn&&state.turnNumber<=modifier.endTurn){cost+=modifier.amount;}});
    return Math.max(0, cost);
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

  function getAvailableSummonMethods(state, playerId, handInstanceId) {
    if (!state || state.pendingEffect || state.phase !== Phases.MAIN_PHASE || state.activePlayerId !== playerId) {
      return [];
    }
    var player = state.player(playerId);
    var held = findInZone(state, playerId, ZONES.HAND, handInstanceId);
    var def = held && getCardDefinition(held.cardId);
    if (!held || !def || def.type !== CardTypes.INSECT || !def.isPlayable()) {
      return [];
    }
    var methods = [];
    var effectiveCost = getEffectiveCardCost(state, playerId, def);
    if (player.availableCost >= effectiveCost) {
      methods.push({ type: 'NORMAL', cost: effectiveCost });
    }
    (def.summonAlternatives || []).forEach(function (alternative) {
      if (alternative.type !== 'SACRIFICE_OWN_FIELD') { return; }
      var candidates = player.field.filter(function (card) {
        var candidateDef=!card.faceDown&&getCardDefinition(card.cardId);
        return candidateDef && (!alternative.requiredNameSuffix || candidateDef.name.slice(-alternative.requiredNameSuffix.length)===alternative.requiredNameSuffix);
      });
      if (candidates.length >= alternative.count) {
        methods.push({ type: 'ALTERNATIVE', alternativeType: alternative.type, count: alternative.count });
      }
    });
    return methods;
  }

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
      var summonCandidates = player.field.filter(function (card) {
        var candidateDef=!card.faceDown&&getCardDefinition(card.cardId);
        return candidateDef && (!alternative.requiredNameSuffix || candidateDef.name.slice(-alternative.requiredNameSuffix.length)===alternative.requiredNameSuffix);
      });
      createCardSelection(state, { playerId: playerId, options: summonCandidates.map(function(c){return c.instanceId;}), exactSelections: alternative.count, candidateZones:[ZONES.FIELD], selectionPurpose:'ALTERNATIVE_SUMMON_COST', continuation:{type:'SUMMON_ALTERNATIVE',sourceInstanceId:handInstanceId} });
      return { pending:true };
    }
    var summonCost = getEffectiveCardCost(state, playerId, def);
    if (!summonOptions.alternative && player.availableCost < summonCost) {
      throw new Error('コストが不足しています');
    }
    if (summonOptions.alternative) {
      if (!alternative || !summonOptions.selectedIds || summonOptions.selectedIds.length !== alternative.count) { throw new Error('代替召喚コストが不正です'); }
      summonOptions.selectedIds.forEach(function(id){ var target=findInZone(state,playerId,ZONES.FIELD,id),targetDef=target&&getCardDefinition(target.cardId); if(!target||target.faceDown||(alternative.requiredNameSuffix&&targetDef.name.slice(-alternative.requiredNameSuffix.length)!==alternative.requiredNameSuffix)) throw new Error('代替コスト対象が不正です'); });
      summonOptions.selectedIds.forEach(function(id){ destroyInsect(state,id,'SACRIFICE',handInstanceId,null,{skipTerritoryDraw:true}); });
    } else {
      player.availableCost -= summonCost;
    }

    moveCard(state, handInstanceId, ZONES.HAND, ZONES.FIELD, { playerId: playerId });
    held.currentHp = def.baseHp;
    held.baseHp = def.baseHp;
    held.attackedThisTurn = false;
    held.usedSkills = [];
    held.faceDown = false;
    held.enteredFieldTurn = state.turnNumber;

    log(state, state.turnNumber, playerId + ' は ' + def.name + ' を召喚した | コスト' + summonCost + ' | 残りコスト: ' + player.availableCost);
    return held;
  }

  // ---- 術カード使用 ----

  function resolveFieldEntryEffects(state, instanceId) {
    var holder = findAnywhere(state, instanceId);
    if (!holder || holder.zone !== ZONES.FIELD) { return; }
    var definition = getCardDefinition(holder.instance.cardId);
    if(holder.instance.runtimeFlags&&holder.instance.runtimeFlags.suppressKeywordSkills){return;}
    (definition.passiveAbilities || []).filter(function(ability) { return ability.timing === 'ON_ENTER_FIELD'; }).forEach(function(ability) {
      (ability.effects || []).forEach(function(effect) {
        resumeAfterSelection(state, { type: 'FIELD_ENTRY_EFFECT', playerId: holder.playerId,
          sourceInstanceId: instanceId, optional: !!ability.optional, effect: effect });
      });
    });
  }

  function insectCards(cards) {
    return (cards || []).filter(function (card) { var def = getCardDefinition(card.cardId); return !card.faceDown && def && def.type === CardTypes.INSECT; });
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
      allowedCombinations: (spec.allowedCombinations || []).map(function(group) { return group.slice(); }),
      selectionPurpose: spec.selectionPurpose || 'CARD_SELECTION', continuation: spec.continuation || null
    };
    return state.pendingEffect;
  }

  function resolveChoiceSelection(state, playerId, value) {
    var pending = state.pendingEffect;
    if (!pending || pending.type !== 'CHOICE_SELECTION' || pending.playerId !== playerId) {
      throw new Error('選択待ちではありません');
    }
    if (!pending.options.some(function(option) { return option.value === value; })) { throw new Error('選択肢が不正です'); }
    var continuation = pending.continuation;
    if (!continuation) { throw new Error('未対応の選択継続です'); }
    if(continuation.type==='USE_SPELL_VARIABLE_COST'){
      var paid=Number(value);state.pendingEffect=null;return useSpell(state,playerId,continuation.sourceInstanceId,continuation.targetInstanceId,{variablePayment:paid});
    } else if(continuation.type==='USE_SPELL_PAYMENT_METHOD'){
      state.pendingEffect=null;return useSpell(state,playerId,continuation.sourceInstanceId,continuation.targetInstanceId,{paymentMode:value});
    } else if(continuation.type==='SUPPRESS_DESTROYED_TERRITORY'){
      if(value==='SUPPRESS'&&pending.afterResolution&&pending.afterResolution.context){pending.afterResolution.context.skipTerritoryDraw=true;}
    } else if(continuation.type==='SET_SELF_COLOR'){
      var holder = findAnywhere(state, continuation.sourceInstanceId);
      if (value !== 'DECLINE' && holder && holder.zone === ZONES.FIELD) {
        holder.instance.runtimeFlags = holder.instance.runtimeFlags || {};
        holder.instance.runtimeFlags.colorOverride = value;
        holder.instance.runtimeFlags.colorOverrideUntil = 'UNTIL_END_OF_TURN';
      }
    } else if(continuation.type==='SET_OWN_FOOD_COLOR'){
      if(value!=='DECLINE'){state.player(continuation.playerId).food.forEach(function(food){if(!food.faceDown){food.runtimeFlags=food.runtimeFlags||{};food.runtimeFlags.colorOverride=value;food.runtimeFlags.colorOverrideUntilTurn=continuation.endTurn;}});}
    } else {
      throw new Error('未対応の選択継続です');
    }
    state.pendingEffect = null;
    resumeAfterSelection(state, pending.afterResolution);
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
    if (mustFinish && pending.allowedCombinations && pending.allowedCombinations.length && !pending.allowedCombinations.some(function(group) {
      return group.length === unique.length && group.every(function(id) { return unique.indexOf(id) !== -1; });
    })) { throw new Error('対応するカードの組み合わせを選択してください'); }
    pending.selectedIds = unique;
    if (!mustFinish) { return pending; }
    state.pendingEffect = null;
    try {
      var resolved = resolveSelectionContinuation(state, pending, unique);
      resumeAfterSelection(state, pending.afterResolution);
      return resolved;
    }
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
    if (c.type === 'USE_ENHANCEMENT') { return useEnhancement(state, pending.playerId, c.sourceInstanceId, ids[0]); }
    if(c.type==='ENHANCEMENT_TRACKED_REVIVAL_CHOOSE_HOST'){
      return createCardSelection(state,{playerId:pending.playerId,options:ids.slice(),exactSelections:1,candidateZones:[ZONES.DISCARD],selectionPurpose:'TRACKED_REVIVAL_HOST',continuation:{type:'USE_TRACKED_REVIVAL_ENHANCEMENT',sourceInstanceId:c.sourceInstanceId,trackedIds:ids.slice()}});
    }
    if(c.type==='USE_TRACKED_REVIVAL_ENHANCEMENT'){
      return useEnhancement(state,pending.playerId,c.sourceInstanceId,ids[0],null,{trackedIds:(c.trackedIds||[]).slice()});
    }
    if (c.type === 'ATTACK_WITH_ALLY_COLOR') {
      return performAttack(state, c.attackerInstanceId, c.targetInstanceId, c.targetType, c.skillId, null,
        { copyColorFrom: ids[0] });
    }
    if (c.type === 'OPPONENT_ATTACK_TARGET') {
      return performAttack(state, c.attackerInstanceId, ids[0], 'INSECT', c.skillId, null,
        { opponentSelectionToken: opponentAttackSelectionToken });
    }
    if (c.type === 'FLIP_SELECTED_FOOD') {
      ids.forEach(function(id) {
        var food = findInZone(state, c.targetPlayerId, ZONES.FOOD, id);
        if (!food || food.faceDown) { throw new Error('表向きのエサを選んでください'); }
        food.faceDown = true;
      });
      return ids;
    }
    if (c.type === 'ATTACK_PRE_FLIP') {
      ids.forEach(function(id) {
        var food = findInZone(state, c.targetPlayerId, ZONES.FOOD, id);
        if (!food || food.faceDown) { throw new Error('表向きのエサを選んでください'); }
        food.faceDown = true;
      });
      return performAttack(state, c.attackerInstanceId, c.targetInstanceId, c.targetType, c.skillId, null, { preEffectsResolved:true });
    }
    if (c.type === 'ATTACK_DEFENDER_EXCHANGE') {
      var original = findInZone(state, c.targetPlayerId, ZONES.FIELD, c.originalTargetInstanceId);
      var incoming = findInZone(state, c.targetPlayerId, ZONES.FOOD, ids[0]);
      var incomingDef = incoming && getCardDefinition(incoming.cardId);
      if (!original || !incoming || incoming.faceDown || !incomingDef || incomingDef.type !== CardTypes.INSECT) {
        throw new Error('入れ替える虫が不正です');
      }
      batchMoveCards(state, [
        { instanceId: original.instanceId, from: ZONES.FIELD, to: ZONES.FOOD, playerId: original.ownerId },
        { instanceId: incoming.instanceId, from: ZONES.FOOD, to: ZONES.FIELD, playerId: c.targetPlayerId }
      ]);
      if (pending.afterResolution) { pending.afterResolution.targetInstanceId = incoming.instanceId; }
      return incoming;
    }
    if (c.type === 'ENTRY_DAMAGE') {
      if (!ids.length) { return ids; }
      var sourceHolder=findAnywhere(state,c.sourceInstanceId);
      var target=findInZone(state,c.targetPlayerId,ZONES.FIELD,ids[0]);
      if (!target || target.faceDown) { throw new Error('表向きの相手虫を選んでください'); }
      applyDamage(state,sourceHolder&&sourceHolder.instance,target,c.amount,'EFFECT',c.sourceInstanceId,target.instanceId,{suppressTerritoryDraw:!!c.suppressTerritoryDraw,effectId:'ENTRY_DAMAGE',multiplier:1,apVal:c.amount});
      return ids;
    }
    if (c.type === 'DISCARD_SELECTED_HAND') {
      ids.forEach(function(id){var card=findInZone(state,c.targetPlayerId,ZONES.HAND,id);if(!card){throw new Error('手札のカードを選んでください');}moveCard(state,id,ZONES.HAND,ZONES.DISCARD,{playerId:c.targetPlayerId});});
      return ids;
    }
    if (c.type === 'USE_SPELL') { return useSpell(state, pending.playerId, c.sourceInstanceId, ids); }
    if (c.type === 'USE_SPELL_TERRITORY_PAYMENT') {
      return useSpell(state, pending.playerId, c.sourceInstanceId, c.targetInstanceId,
        { paymentMode:'TERRITORY', territoryPaymentIds:ids });
    }
    if(c.type==='ATTACH_TERRITORY_CARD'){
      var drawnAttachment=findInZone(state,pending.playerId,ZONES.RESOLVING,c.attachmentInstanceId);
      if(!drawnAttachment)throw new Error('縄張りから引いた強化カードがありません');
      if(!ids.length)return finalizeTerritoryDraw(state,pending.playerId,drawnAttachment,ZONES.HAND);
      var drawnHost=findInZone(state,pending.playerId,ZONES.FIELD,ids[0]);if(!drawnHost||drawnHost.faceDown)throw new Error('表向きの自分の虫を選んでください');
      var resolvingCards=state.player(pending.playerId).resolving;resolvingCards.splice(resolvingCards.indexOf(drawnAttachment),1);drawnAttachment.zone=ZONES.FIELD;drawnHost.attachments=drawnHost.attachments||[];drawnHost.attachments.push(drawnAttachment);return drawnAttachment;
    }
    if (c.type === 'SUMMON_ALTERNATIVE') { return summonInsect(state, pending.playerId, c.sourceInstanceId, { alternative: true, selectedIds: ids }); }
    if (c.type === 'DIRECT_ATTACK_FOOD') {
      moveCard(state, ids[0], ZONES.FOOD, ZONES.HAND, { playerId: pending.playerId });
      if (c.territoryPlayerId && state.player(c.territoryPlayerId).territory.length) { triggerTerritoryDrawSelection(state, c.territoryPlayerId, c.territoryContext); }
      return ids;
    }
    if (c.type === 'ATTACK_MULTI') { return performMultiTargetAttack(state, c.attackerInstanceId, ids, c.skillId); }
    if (c.type === 'MOVE_SELECTED') {
      ids.forEach(function(id) {
        var card = findInZone(state, pending.playerId, c.from, id);
        var definition = card && getCardDefinition(card.cardId);
        if (!definition || (c.cardType && definition.type !== c.cardType) ||
            (c.requiredTag && definition.tags.indexOf(c.requiredTag) === -1)) { throw new Error('移動対象が不正です'); }
      });
      ids.forEach(function(id) {
        moveCard(state, id, c.from, c.to, { playerId: pending.playerId, onMove: function(s, card) {
          if (c.prohibitAttackThisTurn) {
            card.runtimeFlags = card.runtimeFlags || {};
            card.runtimeFlags.attackRestrictions = (card.runtimeFlags.attackRestrictions || []).concat([
              { startTurn: s.turnNumber, endTurn: s.turnNumber, whileSourceOnField: false }
            ]);
          }
        } });
      });
      return ids;
    }
    throw new Error('未対応の選択継続です: ' + c.type);
  }

  function getComplexSpellSelection(state, playerId, sourceId, effect) {
    var player = state.player(playerId), opponent = state.player(state.opponentOf(playerId));
    if (effect.type === 'EXCHANGE_MATCHING_FORM') {
      var combinations = [], candidates = [];
      insectCards(player[effect.firstZone.toLowerCase()]).forEach(function(first) {
        var name = getCardDefinition(first.cardId).name;
        if (!name.endsWith(effect.nameSuffix)) { return; }
        var otherName = name.slice(0, -effect.nameSuffix.length);
        insectCards(player[effect.secondZone.toLowerCase()]).forEach(function(second) {
          if (getCardDefinition(second.cardId).name !== otherName) { return; }
          combinations.push([first.instanceId, second.instanceId]);
          [first, second].forEach(function(card) { if (candidates.indexOf(card) === -1) { candidates.push(card); } });
        });
      });
      return { options: candidates, exactSelections: 2, allowedCombinations: combinations, zones: [effect.firstZone, effect.secondZone] };
    }
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
    if(effect.type==='FLIP_OWN_FOOD_FACE_UP'){
      var hiddenFood=player.food.filter(function(card){return card.faceDown;});
      return {options:hiddenFood,minSelections:effect.minSelections,maxSelections:effect.maxSelections,zones:[ZONES.FOOD]};
    }
    if(effect.type==='SUMMON_HAND_BY_FAMILY_SUFFIX'){
      var familyCandidates=insectCards(player.hand).filter(function(card){return getCardDefinition(card.cardId).tags.some(function(tag){return tag.slice(-effect.familySuffix.length)===effect.familySuffix;});});
      return {options:familyCandidates,minSelections:effect.minSelections,maxSelections:effect.maxSelections,zones:[ZONES.HAND]};
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
      } else if (effect.target === 'OWN_FIELD_INSECT') {
        candidates = state.player(playerId).field.filter(function (card) { return !card.faceDown; });
      } else if (effect.target === 'OWN_FOOD') {
        candidates = state.player(playerId).food.filter(function (card) {
          var foodDef = getCardDefinition(card.cardId);
          return !card.faceDown && foodDef && (!effect.cardTypes || effect.cardTypes.indexOf(foodDef.type) !== -1);
        });
      } else if (effect.target === 'OWN_FOOD_INSECT') {
        candidates = state.player(playerId).food.filter(function (card) { var d = getCardDefinition(card.cardId); return !card.faceDown && d && d.type === CardTypes.INSECT; });
      } else if (effect.target === 'OWN_HAND_INSECT') {
        candidates = state.player(playerId).hand.filter(function (card) { var d = getCardDefinition(card.cardId); return (!effect.excludeSource || card.instanceId !== handInstanceId) && d && d.type === CardTypes.INSECT; });
      }
    });
    return candidates.filter(function (card) {
      var holder = findAnywhere(state, card.instanceId);
      return !holder || holder.zone !== ZONES.FIELD || holder.playerId === playerId || !hasPassiveEffect(card, 'OPPONENT_SPELL_TARGET_IMMUNITY');
    });
  }

  function hasPassiveEffect(card, type) {
    if (!card || card.faceDown) { return false; }
    if(card.runtimeFlags&&card.runtimeFlags.suppressKeywordSkills){return false;}
    var def = getCardDefinition(card.cardId);
    return (def && def.passiveAbilities || []).some(function (ability) {
      return (ability.effects || []).some(function (effect) { return effect.type === type; });
    });
  }

  function getAttackMultiplier(state, attackerColor, defender) {
    if(defender.runtimeFlags&&defender.runtimeFlags.ignoreWeaknessTurn===state.turnNumber){return 1;}
    var ignoreWeakness = (defender.attachments || []).some(function (attachment) {
      var def = getCardDefinition(attachment.cardId);
      return (def && def.enhancementEffects || []).some(function (effect) { return effect.type === 'IGNORE_WEAKNESS'; });
    });
    return ignoreWeakness ? 1 : getAttributeMultiplier(attackerColor, getEffectiveColor(defender));
  }

  function resolveSpellEffects(state, playerId, instance, def, chosenTargetInstanceId, spellOptions) {
    spellOptions = spellOptions || {};
    var effects = def.cardEffects || [];
    var finalZone = ZONES.DISCARD;
    effects.forEach(function (effect) {
      if (!effect) { return; }
      if (effect.type === 'SUPPRESS_OPPONENT_TERRITORY_TRIGGER') {
        state.player(state.opponentOf(playerId)).territoryTriggerSuppressionUntilTurn = state.turnNumber;
      }
      var chosenIds = Array.isArray(chosenTargetInstanceId) ? chosenTargetInstanceId : (chosenTargetInstanceId ? [chosenTargetInstanceId] : []);
      if (effect.type === 'MOVE_SELF' && effect.to && CardInstance.isZone(effect.to)) {
        finalZone = effect.to;
      }
      if (effect.type === 'APPLY_STAT_MODIFIER') {
        var statTarget = findInZone(state, playerId, ZONES.FIELD, chosenTargetInstanceId);
        if (!statTarget || statTarget.faceDown) { throw new Error('自分の表向きの虫を選んでください'); }
        addStatModifier(state, statTarget, { sourceInstanceId: instance.instanceId,
          stat: effect.stat, amount: effect.amount,
          startOffset: effect.startTurnOffset || 0, endOffset: effect.endTurnOffset || 0 });
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
      if (effect.type === 'DESTROY_TARGET') {
        var destructionTarget = findInZone(state, state.opponentOf(playerId), ZONES.FIELD, chosenTargetInstanceId);
        if (!destructionTarget || destructionTarget.faceDown) { throw new Error('選択した虫は術の対象にできません'); }
        destroyInsect(state, destructionTarget.instanceId, 'SPELL', instance.instanceId);
      }
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
      if(effect.type==='VARIABLE_COST_DAMAGE'){
        var variableTarget=findInZone(state,state.opponentOf(playerId),ZONES.FIELD,chosenTargetInstanceId);
        if(!variableTarget||variableTarget.faceDown)throw new Error('表向きの相手虫を選んでください');
        var variableDamage=(spellOptions.variablePayment||0)*effect.damagePerCost;
        applyDamage(state,instance,variableTarget,variableDamage,'SPELL',instance.instanceId,variableTarget.instanceId,{effectId:effect.type,multiplier:1,apVal:variableDamage});
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
        if(effect.to===ZONES.FIELD){moved.runtimeFlags=moved.runtimeFlags||{};moved.runtimeFlags.enteredBySpellTurn=state.turnNumber;}
      }
      if (effect.type === 'APPLY_ATTACK_RESTRICTION') {
        var restricted = chosenTargetInstanceId && findAnywhere(state, chosenTargetInstanceId);
        if (!restricted || restricted.zone !== ZONES.FIELD) { throw new Error('攻撃禁止の対象が場にいません'); }
        if (!restricted.instance.runtimeFlags) { restricted.instance.runtimeFlags = {}; }
        if (!restricted.instance.runtimeFlags.attackRestrictions) { restricted.instance.runtimeFlags.attackRestrictions = []; }
        restricted.instance.runtimeFlags.attackRestrictions.push({ sourceInstanceId: instance.instanceId, startTurn: state.turnNumber + (effect.startTurnOffset || 0), endTurn: state.turnNumber + (effect.endTurnOffset || 0), whileSourceOnField: false });
      }
      if(effect.type==='HIDE_TARGET'){
        var hiddenTarget=chosenTargetInstanceId&&findInZone(state,playerId,ZONES.FIELD,chosenTargetInstanceId);
        if(!hiddenTarget||hiddenTarget.faceDown)throw new Error('表向きの自分の虫を選んでください');
        hiddenTarget.faceDown=true;hiddenTarget.runtimeFlags=hiddenTarget.runtimeFlags||{};hiddenTarget.runtimeFlags.faceDownUntilTurn=state.turnNumber+(effect.endTurnOffset||0);
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
        if (!selected.length || selected.some(function(c){return !c || c.faceDown;})) throw new Error('移動対象が不正です');
        var firstColor=getCardDefinition(selected[0].cardId).color;
        if (selected.some(function(c){var d=getCardDefinition(c.cardId);return d.type!==CardTypes.INSECT||d.color!==firstColor;})) throw new Error('同じ色の虫を選択してください');
        resumeAfterSelection(state, {
          type: 'SERIAL_ZONE_MOVES',
          moves: selected.map(function(c) {
            return {
              instanceId: c.instanceId,
              sourcePlayerId: playerId,
              playerId: playerId,
              from: effect.from,
              to: effect.to,
              runtimeFlags: { enteredBySpellTurn:state.turnNumber, destroyAtEndTurn:effect.destroyAtEndTurn ? state.turnNumber : undefined }
            };
          })
        });
      }
      if(effect.type==='FLIP_OWN_FOOD_FACE_UP'){
        chosenIds.forEach(function(id){var food=findInZone(state,playerId,ZONES.FOOD,id);if(!food||!food.faceDown)throw new Error('裏向きの自分のエサを選んでください');food.faceDown=false;});
      }
      if(effect.type==='SUMMON_HAND_BY_FAMILY_SUFFIX'){
        var serial=chosenIds.map(function(id){var card=findInZone(state,playerId,ZONES.HAND,id),cardDef=card&&getCardDefinition(card.cardId);if(!cardDef||cardDef.type!==CardTypes.INSECT||!cardDef.tags.some(function(tag){return tag.slice(-effect.familySuffix.length)===effect.familySuffix;}))throw new Error('対象の科の虫を選んでください');var flags={enteredBySpellTurn:state.turnNumber};if(effect.destroyAtEndTurn)flags.destroyAtEndTurn=state.turnNumber;return {instanceId:id,sourcePlayerId:playerId,playerId:playerId,from:ZONES.HAND,to:ZONES.FIELD,runtimeFlags:flags};});
        resumeAfterSelection(state,{type:'SERIAL_ZONE_MOVES',moves:serial});
      }
      if(effect.type==='EACH_PLAYER_DISCARD_DOWN_TO'){
        resumeAfterSelection(state,{type:'DISCARD_HAND_DOWN_SEQUENCE',playerIds:state.playerOrder.filter(function(pid){return state.player(pid).hand.length>=effect.threshold;}),limit:effect.limit});
      }
      if(effect.type==='DRAW_OWN_TERRITORY'){
        if(state.player(playerId).territory.length){triggerTerritoryDrawSelection(state,playerId,{suppressTerritoryTrigger:!!effect.suppressTerritoryTrigger});}
      }
      if(effect.type==='DISCOUNT_NEXT_CARD_TYPE'&&effect.cardType==='ENHANCEMENT'){
        state.player(playerId).nextEnhancementDiscount={amount:effect.amount,endTurn:state.turnNumber+(effect.endTurnOffset||0)};
      }
      if(effect.type==='TAX_OPPONENT_CARD_TYPE'){
        var taxed=state.player(state.opponentOf(playerId));taxed.runtimeCostModifiers=taxed.runtimeCostModifiers||[];taxed.runtimeCostModifiers.push({cardType:effect.cardType,amount:effect.amount,startTurn:state.turnNumber+(effect.startTurnOffset||0),endTurn:state.turnNumber+(effect.endTurnOffset||0)});
      }
      if(effect.type==='GRANT_TERRITORY_TRIGGER_BY_FAMILY_SUFFIX_UNTIL_EMPTY'){
        var grantPlayer=state.player(playerId);
        if(!grantPlayer.territoryTriggerGrant){grantPlayer.territoryTriggerGrant={active:grantPlayer.territory.length>0,familySuffixes:(effect.familySuffixes||[]).slice(),skillId:effect.skillId||'tobidasu',sourceInstanceId:instance.instanceId};}
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
      if (effect.type === 'EXCHANGE_MATCHING_FORM') {
        var formSelection = getComplexSpellSelection(state, playerId, instance.instanceId, effect);
        var pair = formSelection.allowedCombinations.find(function(group) {
          return chosenIds.length === group.length && group.every(function(id) { return chosenIds.indexOf(id) !== -1; });
        });
        if (!pair) { throw new Error('対応するカードの組み合わせを選択してください'); }
        batchMoveCards(state, [
          { instanceId: pair[0], from: effect.firstZone, to: effect.firstDestination, playerId: playerId },
          { instanceId: pair[1], from: effect.secondZone, to: effect.secondDestination, playerId: playerId }
        ]);
      }
      if (effect.type === 'TRANSFER_OWN_ATTACHMENT') {
        var attHolder=findAttachment(state,chosenIds[0])||findAttachment(state,chosenIds[1]);
        var hostHolder=findAnywhere(state,chosenIds[0])||findAnywhere(state,chosenIds[1]);
        if(!attHolder||!hostHolder||hostHolder.playerId!==playerId||hostHolder.zone!==ZONES.FIELD||hostHolder.instance===attHolder.host) throw new Error('付け替え対象が不正です');
        var oldSourceHp = calculateMaxHp(attHolder.host, state), oldDestinationHp = calculateMaxHp(hostHolder.instance, state);
        attHolder.host.attachments.splice(attHolder.index,1); hostHolder.instance.attachments.push(attHolder.instance);
        preserveDamageAfterMaxHpChange(state, attHolder.host, oldSourceHp);
        preserveDamageAfterMaxHpChange(state, hostHolder.instance, oldDestinationHp);
      }
      if (effect.type === 'DESTROY_OPPONENT_ATTACHMENT') {
        var destroyedAttachment=findAttachment(state,chosenIds[0]);
        if(!destroyedAttachment||destroyedAttachment.playerId!==state.opponentOf(playerId)) throw new Error('相手の強化カードを選択してください');
        var oldHostHp = calculateMaxHp(destroyedAttachment.host, state);
        destroyedAttachment.host.attachments.splice(destroyedAttachment.index,1); destroyedAttachment.instance.zone=ZONES.DISCARD; state.player(destroyedAttachment.instance.ownerId).discard.push(destroyedAttachment.instance);
        preserveDamageAfterMaxHpChange(state, destroyedAttachment.host, oldHostHp);
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
  function useSpell(state, playerId, handInstanceId, chosenTargetInstanceId, spellOptions) {
    spellOptions = spellOptions || {};
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
    var spellCost = getEffectiveCardCost(state, playerId, def);
    var territoryCostEffect=(def.cardEffects||[]).filter(function(effect){return effect.type==='ALTERNATIVE_TERRITORY_COST';})[0];
    var canPayNormally=player.availableCost>=spellCost;
    var canPayTerritory=!!territoryCostEffect&&player.territory.length>=(territoryCostEffect.count||0);
    if (!canPayNormally && !canPayTerritory) {
      throw new Error('コストが不足しています');
    }

    if (!Array.isArray(chosenTargetInstanceId)) {
      var complexEffect = (def.cardEffects || []).filter(function(effect){return getComplexSpellSelection(state,playerId,handInstanceId,effect);})[0];
      if (complexEffect) {
        var selection=getComplexSpellSelection(state,playerId,handInstanceId,complexEffect);
        createCardSelection(state,{playerId:playerId,options:selection.options.map(function(c){return c.instanceId;}),selectionGroups:selection.groups,allowedCombinations:selection.allowedCombinations,minSelections:selection.minSelections,maxSelections:selection.maxSelections,exactSelections:selection.exactSelections,candidateZones:selection.zones,selectionPurpose:complexEffect.type,continuation:{type:'USE_SPELL',sourceInstanceId:handInstanceId}});
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

    if(territoryCostEffect&&!spellOptions.paymentMode){
      var paymentMethods=[];
      if(canPayNormally){paymentMethods.push({value:'NORMAL',label:'コストを支払う'});}
      if(canPayTerritory){paymentMethods.push({value:'TERRITORY',label:'縄張りを'+territoryCostEffect.count+'枚捨てる'});}
      state.pendingEffect={type:'CHOICE_SELECTION',playerId:playerId,controller:playerId,selectionPurpose:'SPELL_PAYMENT_METHOD',prompt:'支払い方法を選んでください',options:paymentMethods,continuation:{type:'USE_SPELL_PAYMENT_METHOD',sourceInstanceId:handInstanceId,targetInstanceId:chosenTargetInstanceId}};
      return {pending:true};
    }
    if(territoryCostEffect&&spellOptions.paymentMode==='TERRITORY'&&!spellOptions.territoryPaymentIds){
      createCardSelection(state,{playerId:playerId,options:player.territory.map(function(card){return card.instanceId;}),exactSelections:territoryCostEffect.count,candidateZones:[ZONES.TERRITORY],selectionPurpose:'SPELL_TERRITORY_PAYMENT',continuation:{type:'USE_SPELL_TERRITORY_PAYMENT',sourceInstanceId:handInstanceId,targetInstanceId:chosenTargetInstanceId}});
      return {pending:true};
    }
    if(territoryCostEffect&&spellOptions.paymentMode==='NORMAL'&&!canPayNormally){throw new Error('コストが不足しています');}

    var variableCostEffect=(def.cardEffects||[]).filter(function(effect){return effect.type==='VARIABLE_COST_DAMAGE';})[0];
    if(variableCostEffect&&spellOptions.variablePayment==null){
      var paymentOptions=[];for(var payment=0;payment<=player.availableCost-spellCost;payment++){paymentOptions.push({value:String(payment),label:String(payment)+'コスト'});}
      state.pendingEffect={type:'CHOICE_SELECTION',playerId:playerId,controller:playerId,selectionPurpose:'VARIABLE_COST_PAYMENT',prompt:'追加で支払うコストを選んでください',options:paymentOptions,continuation:{type:'USE_SPELL_VARIABLE_COST',sourceInstanceId:handInstanceId,targetInstanceId:chosenTargetInstanceId}};
      return {pending:true};
    }

    // 使用直前の状態を記録(rollback用)。
    var snapshot = {
      availableCost: player.availableCost,
      originalZone: ZONES.HAND
    };

    // 解決開始。エラー時は使用直前の状態へ復旧する。
    try {
      // ---- PAY_COST ----
      if(territoryCostEffect&&spellOptions.paymentMode==='TERRITORY'){
        var territoryIds=spellOptions.territoryPaymentIds||[];
        if(territoryIds.length!==territoryCostEffect.count||territoryIds.some(function(id){return !findInZone(state,playerId,ZONES.TERRITORY,id);}))throw new Error('代替コストの縄張りが不正です');
        territoryIds.forEach(function(id){moveCard(state,id,ZONES.TERRITORY,ZONES.DISCARD,{playerId:playerId});});
      }else{
        player.availableCost -= spellCost + (spellOptions.variablePayment || 0);
      }

      var result = {
        spellInstance: held,
        def: def,
        finalZone: null,
        foodDelta: 0
      };

      // ---- RESOLVE_EFFECT: HAND → RESOLVING(一時領域) ----
      moveCard(state, handInstanceId, ZONES.HAND, ZONES.RESOLVING, { playerId: playerId });

      // 最終移動先を cardEffects から決定
      var finalZone = resolveSpellEffects(state, playerId, held, def, chosenTargetInstanceId, spellOptions);

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
  function getEnhancementTargetCandidates(state, playerId, sourceId) {
    var source = findInZone(state, playerId, ZONES.HAND, sourceId);
    var definition = source && getCardDefinition(source.cardId);
    if (!definition || definition.type !== CardTypes.ENHANCEMENT) { return []; }
    var trackedRevival=(definition.enhancementEffects||[]).some(function(effect){return effect.type==='REVIVE_TWO_TRACKED_INSECTS';});
    if(trackedRevival){var discardTargets=insectCards(state.player(playerId).discard);return discardTargets.length>=2?discardTargets:[];}
    var summons = (definition.enhancementEffects || []).some(function(effect) { return effect.type === 'SUMMON_ATTACHED_FROM_HAND'; });
    return insectCards(state.player(playerId)[summons ? 'hand' : 'field']).filter(function(card){
      var hostDef=getCardDefinition(card.cardId);
      return hostDef.attachmentLimit==null || (card.attachments||[]).length<hostDef.attachmentLimit;
    });
  }
  // 自分の虫に強化カードを装着する。
  // 強化カードは HAND から対象虫の attachments へ移動する。
  // 強化カード自体は zone=FIELD のまま所有者情報を保持する。
  // chosenColor: COLOR_OVERRIDE系の場合、'RED' | 'BLUE' | 'GREEN' を指定
  function useEnhancement(state, playerId, handInstanceId, targetInstanceId, chosenColor, enhancementOptions) {
    enhancementOptions=enhancementOptions||{};
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
    var enhancementCost = getEffectiveCardCost(state, playerId, def, { targetInstanceId: targetInstanceId });
    if (player.availableCost < enhancementCost) {
      throw new Error('コストが不足しています');
    }
    var trackedRevival=(def.enhancementEffects||[]).filter(function(effect){return effect.type==='REVIVE_TWO_TRACKED_INSECTS';})[0];
    if(trackedRevival&&!enhancementOptions.trackedIds){
      var discardInsects=insectCards(player.discard);
      createCardSelection(state,{playerId:playerId,options:discardInsects.map(function(card){return card.instanceId;}),exactSelections:2,candidateZones:[ZONES.DISCARD],selectionPurpose:'TRACKED_REVIVAL_INSECTS',continuation:{type:'ENHANCEMENT_TRACKED_REVIVAL_CHOOSE_HOST',sourceInstanceId:handInstanceId}});
      return {pending:true};
    }
    if(trackedRevival){
      var trackedIds=enhancementOptions.trackedIds||[];
      if(trackedIds.length!==2||trackedIds.indexOf(targetInstanceId)===-1||trackedIds.some(function(id){var card=findInZone(state,playerId,ZONES.DISCARD,id),cardDef=card&&getCardDefinition(card.cardId);return !cardDef||cardDef.type!==CardTypes.INSECT;}))throw new Error('捨て札の虫2つと装着先を選んでください');
      player.availableCost-=enhancementCost;
      moveCard(state,held.instanceId,ZONES.HAND,ZONES.RESOLVING,{playerId:playerId});
      held.runtimeFlags=held.runtimeFlags||{};held.runtimeFlags.trackedInsectInstanceIds=trackedIds.slice();
      resumeAfterSelection(state,{type:'TRACKED_REVIVAL_SEQUENCE',playerId:playerId,moves:trackedIds.map(function(id){return {instanceId:id};}),attachmentInstanceId:held.instanceId,hostInstanceId:targetInstanceId});
      return held;
    }
    var summons = (def.enhancementEffects || []).some(function(effect) { return effect.type === 'SUMMON_ATTACHED_FROM_HAND'; });
    var candidates = getEnhancementTargetCandidates(state, playerId, handInstanceId);
    if (summons && !targetInstanceId) {
      createCardSelection(state, { playerId: playerId, options: candidates.map(function(card) { return card.instanceId; }),
        exactSelections: 1, candidateZones: [ZONES.HAND], selectionPurpose: 'SUMMON_ATTACHED_FROM_HAND',
        continuation: { type: 'USE_ENHANCEMENT', sourceInstanceId: handInstanceId } });
      return { pending: true };
    }
    var target = candidates.find(function(card) { return card.instanceId === targetInstanceId; });
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
    player.availableCost -= enhancementCost;
    if(player.nextEnhancementDiscount&&state.turnNumber<=player.nextEnhancementDiscount.endTurn){player.nextEnhancementDiscount=null;}

    if (summons) {
      moveCard(state, target.instanceId, ZONES.HAND, ZONES.FIELD, { playerId: playerId, deferEntryEffects: true });
    }
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
    var previousMaxHp = calculateMaxHp(target, state);
    target.attachments.push(held);
    (def.enhancementEffects || []).forEach(function(effect) {
      if (effect.type === 'DESTROY_ATTACHMENT_AFTER_TURNS') {
        held.runtimeFlags = held.runtimeFlags || {};
        held.runtimeFlags.destroyAtEndTurn = state.turnNumber + effect.turnOffset;
      }
      if(effect.type==='PREVENT_HOST_ATTACK_TARGET_NEXT_OPPONENT_TURN'){
        held.runtimeFlags=held.runtimeFlags||{};
        held.runtimeFlags.preventHostAttackTargetTurn=state.turnNumber+(state.activePlayerId===playerId?1:2);
      }
    });
    preserveDamageAfterMaxHpChange(state, target, previousMaxHp);
    if (summons) { resolveFieldEntryEffects(state, target.instanceId); }

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
      if(inst.runtimeFlags&&inst.runtimeFlags.suppressKeywordSkills){return false;}
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
  function getLegalAttackTargets(state, attackerInstanceId, skillId) {
    var holder = findAnywhere(state, attackerInstanceId);
    if (!holder) { return []; }
    if (state.activePlayerId !== holder.playerId) { return []; }
    if (state.phase !== Phases.MAIN_PHASE) { return []; }
    var attacker = holder.instance;
    if(attacker.faceDown){return [];}
    var attackerDef = getCardDefinition(attacker.cardId);
    var attackRequirements = attackerDef.attackRequirements || [];
    if (attackRequirements.some(function (requirement) {
      if (requirement.type !== 'FACE_UP_FOOD_COLOR_COUNT') { return false; }
      return state.player(holder.playerId).food.filter(function (card) {
        var foodDef = !card.faceDown && getCardDefinition(card.cardId);
        return foodDef && foodDef.color === requirement.color;
      }).length < requirement.minimum;
    })) { return []; }
    if (attacker.zone !== ZONES.FIELD) { return []; }
    if (skillId) {
      var requestedSkill = getCardDefinition(attacker.cardId).skills.find(function(skill) { return skill.id === skillId; });
      if (requestedSkill && (requestedSkill.effects || []).some(function(effect) { return effect.type === 'COPY_ALLY_COLOR_BEFORE_ATTACK'; }) &&
          !state.player(holder.playerId).field.some(function(card) { return card !== attacker && !card.faceDown; })) { return []; }
    }
    if (hasPassiveEffect(attacker, 'CANNOT_ATTACK')) { return []; }
    if(attacker.runtimeFlags&&attacker.runtimeFlags.enteredBySpellTurn===state.turnNumber&&state.playerOrder.some(function(pid){return state.player(pid).field.some(function(card){return hasPassiveEffect(card,'SPELL_SUMMONS_CANNOT_ATTACK_THIS_TURN');});})){return [];}
    if ((attacker.attachments || []).some(function(attachment) {
      return (getCardDefinition(attachment.cardId).enhancementEffects || []).some(function(effect) { return effect.type === 'PREVENT_HOST_ATTACK'; });
    })) { return []; }
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

    var opponentId = state.opponentOf(holder.playerId);
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

    var selectedRequirementSkill = skillId && (attackerDef.skills || []).filter(function (skill) { return skill.id === skillId; })[0];
    var skillRequirements = selectedRequirementSkill && selectedRequirementSkill.requirements || [];
    if (skillRequirements.some(function (requirement) {
      return requirement.type === 'OWN_FIELD_CARD_ID' && !state.player(holder.playerId).field.some(function (card) {
        return !card.faceDown && card.cardId === requirement.cardId;
      });
    })) { return []; }
    if (skillRequirements.some(function (requirement) { return requirement.type === 'TARGET_HAS_ATTACHMENT'; })) {
      legalPool = legalPool.filter(function (defender) { return (defender.attachments || []).length > 0; });
    }
    if (skillRequirements.some(function (requirement) { return requirement.type === 'OPPONENT_FACE_UP_FOOD_INSECT'; }) &&
        !opponent.food.some(function(card) { var foodDef=!card.faceDown&&getCardDefinition(card.cardId); return foodDef&&foodDef.type===CardTypes.INSECT; })) {
      return [];
    }

    legalPool.forEach(function (defender) {
      targets.push({ targetType: 'INSECT', instance: defender, playerId: opponentId });
    });

    // 段階4: legal insect が0体なら LEADER 直接攻撃
    var selectedSkill = skillId && (getCardDefinition(attacker.cardId).skills || []).filter(function(skill) { return skill.id === skillId; })[0];
    if (selectedSkill && selectedSkill.usageLimit === 'ONCE_PER_FIELD_STAY' && (attacker.usedSkills || []).indexOf(skillId) !== -1) { return []; }
    var multiTargetEffect = selectedSkill && (selectedSkill.effects || []).filter(function(effect) { return effect.type === 'ATTACK_MULTIPLE_TARGETS'; })[0];
    if (multiTargetEffect && targets.length < (multiTargetEffect.exactSelections || 2)) { return []; }
    if (targets.length === 0 && !(selectedSkill && selectedSkill.targetRule === 'INSECT_ONLY')) {
      targets.push({ targetType: 'LEADER', instance: null, playerId: opponentId });
    }

    return targets;
  }

  // 虫が指定の attackTargetRule を持つ攻撃対象制限能力を持つか判定する(カード名分岐なし)。
  // skill.targetRule に FORCE_ATTACK_TO_SELF_GROUP 等を設定したスキル(＜鳴く＞・＜かばう＞等)を
  // 将来も再利用できる。
  function hasTargetRule(state, instance, rule) {
    if (!instance || instance.faceDown) { return false; }
    if(instance.runtimeFlags&&instance.runtimeFlags.suppressKeywordSkills){return false;}
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
    assertNoPendingEffect(state);
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
    if ((skill.effects || []).some(function (effect) { return effect.type === 'ATTACK_MULTIPLE_TARGETS'; })) {
      throw new Error('この技は複数の虫を選択して使用してください');
    }

    // usageLimit チェック: ONCE_PER_FIELD_STAY の場合、同一CardInstanceの場滞在中に1度だけ使用可能
    if (skill.usageLimit === 'ONCE_PER_FIELD_STAY') {
      if (attacker.usedSkills && attacker.usedSkills.indexOf(skill.id) !== -1) {
        throw new Error('この技は場にいる間1度しか使用できません: ' + skill.name);
      }
    }

    // 合法対象チェック(エンジン側で検証)
    var legalTargets = getLegalAttackTargets(state, attackerInstanceId, skill.id);
    if (skill.targetRule === 'OPPONENT_CHOOSES_TARGET' && legalTargets.length > 1 && attackOptions.opponentSelectionToken !== opponentAttackSelectionToken) {
      createCardSelection(state, { playerId: state.opponentOf(ap), options: legalTargets.map(function(t) { return t.instance.instanceId; }),
        exactSelections: 1, candidateZones: [ZONES.FIELD], selectionPurpose: 'OPPONENT_ATTACK_TARGET',
        continuation: { type: 'OPPONENT_ATTACK_TARGET', attackerInstanceId: attackerInstanceId, skillId: skill.id } });
      return { pending: true };
    }
    var legal = false;
    if (targetType === 'INSECT' && attackOptions.skipTargetLegality) {
      var resumedTarget = findInZone(state, state.opponentOf(ap), ZONES.FIELD, targetInstanceId);
      if (!resumedTarget) { throw new Error('対象の虫が場にいません'); }
      legal = true;
    } else if (targetType === 'INSECT') {
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

    if (!attackOptions.preEffectsResolved && (skill.effects || []).some(function(effect) { return effect.type === 'OPTIONAL_FLIP_OPPONENT_FOOD_BEFORE_DAMAGE'; })) {
      var preAttackFood = state.player(state.opponentOf(ap)).food.filter(function(card) { return !card.faceDown; });
      if (preAttackFood.length) {
        createCardSelection(state, { playerId:ap, options:preAttackFood.map(function(card){return card.instanceId;}), minSelections:0, maxSelections:1,
          candidateZones:[ZONES.FOOD], selectionPurpose:'PRE_ATTACK_FLIP_OPPONENT_FOOD', continuation:{type:'ATTACK_PRE_FLIP', targetPlayerId:state.opponentOf(ap),
            attackerInstanceId:attackerInstanceId,targetInstanceId:targetInstanceId,targetType:targetType,skillId:skill.id} });
        return { pending:true };
      }
    }

    if (!attackOptions.preDamageExchangeResolved && targetType === 'INSECT' &&
        (skill.effects || []).some(function(effect) { return effect.type === 'EXCHANGE_DEFENDER_WITH_OPPONENT_FOOD_BEFORE_DAMAGE'; })) {
      var exchangeOpponentId = state.opponentOf(ap);
      var exchangeFood = state.player(exchangeOpponentId).food.filter(function(card) {
        var foodDef = !card.faceDown && getCardDefinition(card.cardId);
        return foodDef && foodDef.type === CardTypes.INSECT;
      });
      if (!exchangeFood.length) { throw new Error('入れ替えられる相手のエサ場の虫がいません'); }
      createCardSelection(state, { playerId:ap, options:exchangeFood.map(function(card){return card.instanceId;}), exactSelections:1,
        candidateZones:[ZONES.FOOD], selectionPurpose:'ATTACK_DEFENDER_EXCHANGE',
        continuation:{type:'ATTACK_DEFENDER_EXCHANGE',targetPlayerId:exchangeOpponentId,originalTargetInstanceId:targetInstanceId} });
      state.pendingEffect.afterResolution={type:'ATTACK_AFTER_DEFENDER_EXCHANGE',attackerInstanceId:attackerInstanceId,
        targetInstanceId:null,targetType:'INSECT',skillId:skill.id};
      return { pending:true };
    }

    // 追加コスト支払い
    if ((skill.effects || []).some(function(effect) { return effect.type === 'COPY_ALLY_COLOR_BEFORE_ATTACK'; })) {
      var colorSources = state.player(ap).field.filter(function(card) { return card !== attacker && !card.faceDown; });
      if (!colorSources.length) { throw new Error('色を参照する別の虫がいません'); }
      if (!attackOptions.copyColorFrom) {
        createCardSelection(state, { playerId: ap, options: colorSources.map(function(card) { return card.instanceId; }),
          exactSelections: 1, candidateZones: [ZONES.FIELD], selectionPurpose: 'COPY_ALLY_COLOR',
          continuation: { type: 'ATTACK_WITH_ALLY_COLOR', attackerInstanceId: attackerInstanceId,
            targetInstanceId: targetInstanceId, targetType: targetType, skillId: skill.id } });
        return { pending: true };
      }
      var colorSource = colorSources.find(function(card) { return card.instanceId === attackOptions.copyColorFrom; });
      if (!colorSource) { throw new Error('色を参照する虫が不正です'); }
      attacker.runtimeFlags = attacker.runtimeFlags || {};
      attacker.runtimeFlags.colorOverride = getEffectiveColor(colorSource);
      attacker.runtimeFlags.colorOverrideUntil = 'UNTIL_END_OF_TURN';
    }
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
      var multiplier = getAttackMultiplier(state, attackerColor, defender);
      var dmg = apVal * multiplier;
      result.multiplier = multiplier;
      result.finalAp = dmg;
      result.defenderName = (getCardDefinition(defender.cardId) || {}).name || defender.cardId;
      result.colorAdvText = multiplier === 2 ? '有利 ×2' : (multiplier === 1 ? '等倍 ×1' : (multiplier < 1 ? '不利 ×' + multiplier : '×' + multiplier));

      result.defenderPreHp = defender.currentHp;
      // 最終APは負数を保持できるが、ダメージは0を下限とする。
      var finalDmg = Math.max(0, dmg);
      if ((skill.effects || []).some(function(effect) { return effect.type === 'DESTROY_WOUNDED_TARGET_BEFORE_DAMAGE'; }) && defender.currentHp < calculateMaxHp(defender, state)) {
        destroyInsect(state, defender.instanceId, 'ATTACK', attacker.instanceId, result);
      }
      var selfDestructAfterDamage = (skill.effects || []).some(function(effect){return effect.type === 'SELF_DESTRUCT_AFTER_DAMAGE_BEFORE_TARGET_DESTRUCTION';});
      applyDamage(state, attacker, defender, finalDmg, 'ATTACK', attacker.instanceId, targetInstanceId, result, { deferDestruction:selfDestructAfterDamage });
      if (selfDestructAfterDamage && attacker.zone === ZONES.FIELD) {
        destroyInsect(state, attacker.instanceId, 'ABILITY', attacker.instanceId, null, { skipTerritoryDraw:true });
      }
      if (selfDestructAfterDamage && defender.zone === ZONES.FIELD && (defender.currentHp <= 0 || result.destroyAfterAttackDamage)) {
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
          if (effect.type === 'APPLY_STAT_MODIFIER' && effect.target !== 'SELF' && targetType === 'INSECT') {
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
          if (effect.type === 'CHOOSE_COLOR_FOR_ALL_OPPONENT_FIELD' && targetType === 'INSECT') {
            if ([Attributes.RED,Attributes.BLUE,Attributes.GREEN].indexOf(attackOptions.chosenColor)===-1) throw new Error('赤・青・緑から色を選択してください');
            state.player(opponentId).field.forEach(function(card){card.runtimeFlags=card.runtimeFlags||{};card.runtimeFlags.colorOverride=attackOptions.chosenColor;card.runtimeFlags.colorOverrideUntil='UNTIL_END_OF_TURN';});
          }
          if (effect.type === 'TRANSFER_OWN_ATTACHMENT') {
            var transfer=findAttachment(state,attackOptions.attachmentInstanceId);
            var destination=findInZone(state,ap,ZONES.FIELD,attackOptions.destinationInstanceId);
            if(!transfer||transfer.playerId!==ap||!destination||destination===attacker||destination===transfer.host) throw new Error('付け替える強化と別の自分の虫を選択してください');
            var oldTransferHp = calculateMaxHp(transfer.host, state), oldTargetHp = calculateMaxHp(destination, state);
            transfer.host.attachments.splice(transfer.index,1); destination.attachments.push(transfer.instance);
            preserveDamageAfterMaxHpChange(state, transfer.host, oldTransferHp);
            preserveDamageAfterMaxHpChange(state, destination, oldTargetHp);
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
        var visibleFood = opp.food.filter(function(c) { return !c.faceDown; });
        if(directFoodEffect&&visibleFood.length){
          createCardSelection(state,{playerId:opponentId,options:visibleFood.map(function(c){return c.instanceId;}),exactSelections:1,candidateZones:[ZONES.FOOD],selectionPurpose:'DIRECT_ATTACK_FOOD_RETURN',continuation:{type:'DIRECT_ATTACK_FOOD',territoryPlayerId:opponentId,territoryContext:null}});
        } else { drawTerritoryCard(state, opponentId, { attackSourceInstanceId: attacker.instanceId, skillId: skill.id, suppressTerritoryTrigger: (skill.effects || []).some(function(effect) { return effect.type === 'SUPPRESS_TERRITORY_TRIGGER_FOR_ATTACK'; }) }); }
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

    // Self modifiers also apply on a direct attack. Resolve after damage so a
    // newly granted bonus cannot retroactively change the triggering attack.
    (skill.effects || []).forEach(function (effect) {
      if (effect.type === 'GRANT_DAMAGE_SHIELD' && attacker.zone === ZONES.FIELD) {
        attacker.runtimeFlags = attacker.runtimeFlags || {};
        var shields = attacker.runtimeFlags.damageShields || [];
        shields = shields.filter(function (shield) { return shield.endTurn >= state.turnNumber && !shield.used; });
        shields.push({ startTurn: state.turnNumber + (effect.startTurnOffset || 0),
          endTurn: state.turnNumber + (effect.endTurnOffset || 0),
          sourceType: effect.sourceType || null, used: false });
        attacker.runtimeFlags.damageShields = shields;
      }
      if (effect.type !== 'APPLY_STAT_MODIFIER' || effect.target !== 'SELF' || attacker.zone !== ZONES.FIELD) { return; }
      addStatModifier(state, attacker, {
        id: effect.id, sourceInstanceId: attacker.instanceId,
        stat: effect.stat, amount: effect.amount,
        startOffset: effect.startTurnOffset || 0,
        endOffset: effect.endTurnOffset || 0
      });
      result.statModifierApplied = true;
    });

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
    
    (skill.effects || []).forEach(function(effect) {
      if (effect.type === 'HIDE_SOURCE_AFTER_ATTACK') {
        resumeAfterSelection(state, { type: 'HIDE_ATTACK_SOURCE', instanceId: attacker.instanceId,
          enteredFieldTurn: attacker.enteredFieldTurn, endTurn: state.turnNumber + effect.endTurnOffset });
      }
    });
    emitBattleEvent(state,'ATTACK_COMPLETED',{sourceInstanceId:attacker.instanceId,targetInstanceId:targetInstanceId,targetType:targetType,skillId:skill.id});
    log(state, state.turnNumber, ap + ' の ' + def.name + ' が攻撃した(' + (result.damageDealt || 0) + 'ダメージ)');
    return result;
  }

  function beginMultiTargetAttackSelection(state, attackerInstanceId, skillId) {
    assertNoPendingEffect(state);
    if (state.phase !== Phases.MAIN_PHASE) { throw new Error('メインフェイズ以外では攻撃できません'); }
    var holder=findAnywhere(state,attackerInstanceId);
    if(!holder||holder.zone!==ZONES.FIELD||holder.playerId!==state.activePlayerId||holder.instance.attackedThisTurn) { throw new Error('攻撃できる自分の虫を選んでください'); }
    var def=getCardDefinition(holder.instance.cardId);
    var skill=(def.skills||[]).filter(function(s){return s.id===skillId;})[0];
    var effect=skill&&(skill.effects||[]).filter(function(e){return e.type==='ATTACK_MULTIPLE_TARGETS';})[0];
    if(!effect) { throw new Error('複数対象の技ではありません'); }
    var candidates=getLegalAttackTargets(state,attackerInstanceId).filter(function(t){return t.targetType==='INSECT';});
    return createCardSelection(state,{playerId:holder.playerId,options:candidates.map(function(t){return t.instance.instanceId;}),
      exactSelections:effect.exactSelections,candidateZones:[ZONES.FIELD],selectionPurpose:'ATTACK_MULTI',
      continuation:{type:'ATTACK_MULTI',attackerInstanceId:attackerInstanceId,skillId:skillId}});
  }

  function performMultiTargetAttack(state, attackerInstanceId, targetInstanceIds, skillId) {
    assertNoPendingEffect(state);
    if (state.phase !== Phases.MAIN_PHASE) { throw new Error('メインフェイズ以外では攻撃できません'); }
    var holder=findAnywhere(state,attackerInstanceId);
    if(!holder||holder.zone!==ZONES.FIELD||holder.playerId!==state.activePlayerId) throw new Error('攻撃する虫が場にいません');
    var attacker=holder.instance, def=getCardDefinition(attacker.cardId);
    var skill=(def.skills||[]).filter(function(s){return s.id===skillId;})[0];
    var multi=skill&&(skill.effects||[]).filter(function(e){return e.type==='ATTACK_MULTIPLE_TARGETS';})[0];
    if(!multi||!Array.isArray(targetInstanceIds)||targetInstanceIds.length!==multi.exactSelections||new Set(targetInstanceIds).size!==targetInstanceIds.length) throw new Error('異なる攻撃対象を指定数選択してください');
    if (attacker.attackedThisTurn) { throw new Error('既に攻撃済みです'); }
    var legal=getLegalAttackTargets(state,attackerInstanceId).filter(function(t){return t.targetType==='INSECT';}).map(function(t){return t.instance.instanceId;});
    if(targetInstanceIds.some(function(id){return legal.indexOf(id)===-1;})) throw new Error('指定した攻撃対象は合法ではありません');
    attacker.attackedThisTurn=true;
    return continueMultiTargetAttack(state, { type:'MULTI_ATTACK_REMAINING', playerId:holder.playerId,
      attackerInstanceId:attackerInstanceId, skillId:skillId, targetInstanceIds:targetInstanceIds.slice(), nextIndex:0 });
  }

  function continueMultiTargetAttack(state, continuation) {
    var attackerInstanceId=continuation.attackerInstanceId, targetInstanceIds=continuation.targetInstanceIds;
    var holder=findAnywhere(state,attackerInstanceId);
    if(!holder||holder.zone!==ZONES.FIELD||holder.playerId!==continuation.playerId) { return []; }
    var attacker=holder.instance,def=getCardDefinition(attacker.cardId);
    var skill=def.skills.filter(function(s){return s.id===continuation.skillId;})[0];
    var results=[];
    for (var i=continuation.nextIndex;i<targetInstanceIds.length;i++) {
      if (attacker.zone !== ZONES.FIELD) { break; }
      var target=findInZone(state,state.opponentOf(continuation.playerId),ZONES.FIELD,targetInstanceIds[i]);
      if(!target||target.faceDown) { continue; }
      var result={attackerInstanceId:attackerInstanceId,attacker:attacker,def:def,skill:skill,targetType:'INSECT',baseAp:skill.baseAp||0,apVal:getEffectiveAP(state,attacker,skill.baseAp||0,skill),multiplier:1,damageDealt:0,defenderDestroyed:false};
      result.multiplier=getAttackMultiplier(state,getEffectiveColor(attacker),target); result.finalAp=result.apVal*result.multiplier;
      applyDamage(state,attacker,target,Math.max(0,result.finalAp),'ATTACK',attacker.instanceId,target.instanceId,result);
      results.push(result);
      if (state.pendingEffect) {
        continuation.nextIndex=i+1;
        state.pendingEffect.afterResolution=continuation;
        return results;
      }
    }
    emitBattleEvent(state,'ATTACK_COMPLETED',{sourceInstanceId:attacker.instanceId,skillId:skill.id,targetInstanceIds:targetInstanceIds.slice()});
    return results;
  }

  // 連続攻撃可否チェック (カマ連撃等)
  // requiresOpponentFieldInsect: 相手FIELDに面向き虫(faceDownでない虫)が存在する必要がある
  // 擬態虫は「場にいる」ので含める。faceDownのみ除外。
  function checkContinuousAttack(state, attacker, effect) {
    var maxCount = effect.maxCount || 2;
    // usedCountは呼び出し元で管理されるため、ここでは条件のみチェック
    
    var opponentId = state.opponentOf(findAnywhere(state, attacker.instanceId).playerId);
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
    var ownerId = findAnywhere(state, attacker.instanceId).playerId;
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
    return state.player(holder.playerId).field.filter(function (candidate) {
      return candidate.instanceId !== attackerInstanceId && !candidate.faceDown;
    });
  }

  // All matching shields observe the same damage event, including zero damage.
  // Do not short-circuit: consumable attachments are consumed together.
  function preventDamage(state, target, damage, sourceType, skill) {
    var def = getCardDefinition(target.cardId);
    var prevented = false;
    target.runtimeFlags = target.runtimeFlags || {};
    var used = target.runtimeFlags.damagePreventionTurns || (target.runtimeFlags.damagePreventionTurns = {});
    (target.runtimeFlags.damageShields || []).forEach(function (shield) {
      if (shield.used || state.turnNumber < shield.startTurn || state.turnNumber > shield.endTurn ||
          (shield.sourceType && shield.sourceType !== sourceType)) { return; }
      shield.used = true;
      prevented = true;
    });
    (def && def.passiveAbilities || []).forEach(function (ability, index) {
      (ability.effects || []).forEach(function (effect, effectIndex) {
        if (effect.type !== 'PREVENT_DAMAGE' || (effect.sourceType && effect.sourceType !== sourceType)) { return; }
        if (effect.skillNameIncludes && (!skill || String(skill.name).indexOf(effect.skillNameIncludes) === -1)) { return; }
        var key = (ability.id || String(index)) + ':' + effectIndex;
        if (effect.limit === 'FIRST_PER_TURN' && used[key] === state.turnNumber) { return; }
        used[key] = state.turnNumber;
        prevented = true;
      });
    });
    (target.attachments || []).slice().forEach(function (attachment) {
      var attachmentDef = getCardDefinition(attachment.cardId);
      var shields = (attachmentDef && attachmentDef.enhancementEffects || []).filter(function (effect) {
        return effect.type === 'PREVENT_DAMAGE' && (!effect.sourceType || effect.sourceType === sourceType);
      });
      if (!shields.length) { return; }
      prevented = true;
      if (shields.some(function (effect) { return effect.consumeSelf; })) {
        target.attachments.splice(target.attachments.indexOf(attachment), 1);
        attachment.zone = ZONES.DISCARD;
        state.player(attachment.ownerId).discard.push(attachment);
      }
    });
    return prevented ? 0 : damage;
  }

  // ダメージ適用 (target はダメージを受ける虫)
  function applyDamage(state, attacker, target, damage, sourceType, sourceInstanceId, targetInstanceId, result, opts) {
    opts = opts || {};
    if (target.zone !== ZONES.FIELD) {
      return target;
    }
    damage = preventDamage(state, target, damage, sourceType, result && result.skill);
    if (sourceType === 'ATTACK' && result && result.skill && (result.skill.effects || []).some(function(effect) { return effect.type === 'DAMAGE_DOES_NOT_HEAL'; })) {
      target.runtimeFlags = target.runtimeFlags || {};
      target.runtimeFlags.unhealableDamage = (target.runtimeFlags.unhealableDamage || 0) + Math.max(0, damage);
    }
    target.currentHp -= damage;
    result.damageDealt = damage;
    result.defenderCurrentHp = target.currentHp;
    result.destroyAfterAttackDamage = sourceType === 'ATTACK' && !!(target.runtimeFlags &&
      target.runtimeFlags.destroyOnAttackTurn === state.turnNumber);
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
    if ((target.currentHp <= 0 || result.destroyAfterAttackDamage) && !opts.deferDestruction) {
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
    var destroyedSnapshot = JSON.parse(JSON.stringify(destroyedCard));
    destroyedSnapshot.controllerId = defenderPlayerId;
    
    // 破壊前に attachments を snapshot (死亡誘発で使用)
    var attachmentsSnapshot = (destroyedCard.attachments || []).slice();

    // Some enhancements replace their own normal discard destination when the
    // host is destroyed by an insect attack. This does not replace host
    // destruction and therefore happens before the shared field-leave cleanup.
    if(sourceType==='ATTACK'){
      attachmentsSnapshot.forEach(function(attachment){
        var attachmentDef=getCardDefinition(attachment.cardId);
        var returns=attachmentDef&&(attachmentDef.enhancementEffects||[]).some(function(effect){return effect.type==='RETURN_SELF_TO_HAND_IF_HOST_DESTROYED_BY_ATTACK';});
        if(!returns)return;
        var attachmentIndex=destroyedCard.attachments.indexOf(attachment);
        if(attachmentIndex!==-1){destroyedCard.attachments.splice(attachmentIndex,1);attachment.zone=ZONES.HAND;state.player(attachment.ownerId).hand.push(attachment);}
      });
    }

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
      if (replacement.healToMax) destroyedCard.currentHp=calculateMaxHp(destroyedCard, state) - (destroyedCard.runtimeFlags && destroyedCard.runtimeFlags.unhealableDamage || 0);
      emitBattleEvent(state,'DESTROY_REPLACED',{targetInstanceId:targetInstanceId,replacementInstanceId:replacementAttachment.instanceId,damageType:sourceType});
      if(result){result.defenderDestroyed=false;result.destructionReplaced=true;result.defenderCurrentHp=destroyedCard.currentHp;}
      if (destroyedCard.currentHp <= 0) {
        return destroyInsect(state, targetInstanceId, sourceType, sourceInstanceId, result, opts);
      }
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
    
    if (result) {
      result.defenderDestroyed = true;
      result.destroyedInstanceId = targetInstanceId;
      result.sourceType = sourceType;
      result.sourceInstanceId = sourceInstanceId;
      result.targetInstanceId = targetInstanceId;
    }
    log(state, state.turnNumber, defenderPlayerId + ' の虫は破壊された');

    var capture = sourceType === 'ATTACK' && result && result.skill && (result.skill.effects || []).find(function(effect) {
      return effect.type === 'CAPTURE_ATTACK_DESTROYED_TARGET';
    });
    var capturingSource = capture && findAnywhere(state, sourceInstanceId);
    if (capturingSource && capturingSource.zone === ZONES.FIELD) {
      moveCard(state, targetInstanceId, ZONES.DISCARD, ZONES.FIELD, { playerId: capturingSource.playerId });
      if (capture.destroyAtEndTurn) { destroyedCard.runtimeFlags.destroyAtEndTurn = state.turnNumber; }
    }
    resumeAfterSelection(state, { type: 'DESTROYED_CARD_FOLLOWUP', destroyedCard: destroyedSnapshot,
      defenderPlayerId: defenderPlayerId, sourceType: sourceType, sourceInstanceId: sourceInstanceId,
      attachmentsSnapshot: attachmentsSnapshot, skipTerritoryDraw: !!opts.skipTerritoryDraw,
      skill: result && result.skill || null });
    return destroyedCard;
  }

  function finishDestroyedCard(state, context) {
    var destroyedCard = context.destroyedCard, sourceType = context.sourceType, sourceInstanceId = context.sourceInstanceId;
    var defenderPlayerId = context.defenderPlayerId;
    resolveOnDestroyedTriggers(state, destroyedCard, sourceType, sourceInstanceId, context.attachmentsSnapshot);

    if(state.pendingEffect){resumeAfterSelection(state,{type:'DESTROYED_TERRITORY_FOLLOWUP',context:context});return destroyedCard;}
    return finishDestroyedTerritory(state,context);
  }

  function finishDestroyedTerritory(state, context) {
    var destroyedCard=context.destroyedCard,sourceType=context.sourceType,sourceInstanceId=context.sourceInstanceId,defenderPlayerId=context.defenderPlayerId;

    // 攻撃由来の破壊のみ、相手(破壊された側)が縄張りから1枚を手札へ加える
    if (sourceType === 'ATTACK' && !context.skipTerritoryDraw) {
      var suppressed = state.player(defenderPlayerId).field.some(function(card){return (card.attachments||[]).some(function(att){var d=getCardDefinition(att.cardId);return d&&(d.enhancementEffects||[]).some(function(e){return e.type==='SUPPRESS_TERRITORY_DRAW_WHILE_ATTACHED';});});});
      if (!suppressed) {
        var sourceHolder=findAnywhere(state,sourceInstanceId), suppressTrigger=false;
        if(sourceHolder&&sourceHolder.zone===ZONES.FIELD){suppressTrigger=(sourceHolder.instance.attachments||[]).some(function(att){var d=getCardDefinition(att.cardId);return d&&(d.enhancementEffects||[]).some(function(e){return e.type==='SUPPRESS_TERRITORY_TRIGGER_FOR_ATTACK';});});}
        suppressTrigger = suppressTrigger || !!(context.skill && (context.skill.effects || []).some(function(effect) { return effect.type === 'SUPPRESS_TERRITORY_TRIGGER_FOR_ATTACK'; }));
        drawTerritoryCard(state, defenderPlayerId, {suppressTerritoryTrigger:suppressTrigger, attackSourceInstanceId:sourceInstanceId, skillId:context.skill && context.skill.id});
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
      if(sourceType!=='ATTACK'){return false;}
      if(condition.opponentHandMinimum!=null){var controller=card.controllerId||card.ownerId;return state.player(state.opponentOf(controller)).hand.length>=condition.opponentHandMinimum;}
      return true;
    }
    if (condition.type === 'DESTROYED_BY_OPPONENT_ATTACK') {
      return sourceType === 'ATTACK' && sourceInstanceId && 
        global.findAnywhere(state, sourceInstanceId).playerId !== (card.controllerId || card.ownerId);
    }
    return true;
  }

  // 汎用効果解決
  function resolveEffect(state, sourceCard, effect, sourceType, sourceInstanceId) {
    if (!effect) { return; }
    if (effect.type === 'MARK_ATTACK_SOURCE_DESTROY_ON_NEXT_CONTROLLER_TURN') {
      var marked = sourceInstanceId && findAnywhere(state, sourceInstanceId);
      if (marked && marked.zone === ZONES.FIELD) {
        marked.instance.runtimeFlags = marked.instance.runtimeFlags || {};
        marked.instance.runtimeFlags.destroyOnAttackTurn = state.turnNumber + (state.activePlayerId === sourceCard.ownerId ? 2 : 1);
      }
    }
    if(effect.type==='OPPONENT_DISCARD_HAND'){
      var controllerId=sourceCard.controllerId||sourceCard.ownerId,discardPlayerId=state.opponentOf(controllerId),discardHand=state.player(discardPlayerId).hand;
      if(discardHand.length){createCardSelection(state,{playerId:discardPlayerId,options:discardHand.map(function(c){return c.instanceId;}),exactSelections:Math.min(effect.count||1,discardHand.length),candidateZones:[ZONES.HAND],selectionPurpose:'OPPONENT_HAND_DISCARD',continuation:{type:'DISCARD_SELECTED_HAND',targetPlayerId:discardPlayerId}});}
    }
    if(effect.type==='OPTIONAL_SUPPRESS_OWN_TERRITORY'){
      var choicePlayer=sourceCard.controllerId||sourceCard.ownerId;state.pendingEffect={type:'CHOICE_SELECTION',playerId:choicePlayer,controller:choicePlayer,prompt:'縄張りを引かないことを選びますか',options:[{value:'SUPPRESS',label:'引かない'},{value:'ALLOW',label:'引く'}],continuation:{type:'SUPPRESS_DESTROYED_TERRITORY'}};
    }
    
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

  function preserveDamageAfterMaxHpChange(state, card, previousMaxHp) {
    card.currentHp += calculateMaxHp(card, state) - previousMaxHp;
    if (card.zone === ZONES.FIELD && card.currentHp <= 0) {
      destroyInsect(state, card.instanceId, 'EFFECT', null, null, { skipTerritoryDraw: true });
    }
  }

  function resolveAttachmentDiscarded(state, attachment) {
    var def=getCardDefinition(attachment.cardId);
    var trackedEffect=def&&(def.enhancementEffects||[]).filter(function(effect){return effect.type==='REVIVE_TWO_TRACKED_INSECTS'&&effect.destroyTrackedWhenAttachmentDestroyed;})[0];
    var trackedIds=attachment.runtimeFlags&&attachment.runtimeFlags.trackedInsectInstanceIds;
    if(!trackedEffect||!trackedIds||!trackedIds.length)return;
    resumeAfterSelection(state,{type:'DESTROY_TRACKED_SEQUENCE',instanceIds:trackedIds.slice(),attachmentInstanceId:attachment.instanceId});
  }

  function healFieldDamage(state, player) {
    player.field.forEach(function (c) {
      if (!(c.runtimeFlags && c.runtimeFlags.damageDoesNotHeal)) {
        c.currentHp = calculateCurrentMaxHp(c, state) - (c.runtimeFlags && c.runtimeFlags.unhealableDamage || 0);
      }
    });
  }

function endTurn(state) {
    if (state.phase === Phases.GAME_OVER) { return state; }
    assertNoPendingEffect(state);
    assertActivePlayer(state, state.activePlayerId);
    if (state.phase !== Phases.MAIN_PHASE) {
      throw new Error('メインフェイズ以外ではターンを終了できません');
    }

    var ap = state.activePlayerId;
    var player = state.player(ap);
    player.availableCost = 0;
    var delayedDestructions = [];
    var delayedAttachments = [];
    state.playerOrder.forEach(function (pid) {
      state.player(pid).field.forEach(function (card) {
        if (card.runtimeFlags && (card.runtimeFlags.destroyAtEndTurn === state.turnNumber ||
          (card.runtimeFlags.destroyAtEndTurnUnlessAttached === state.turnNumber && !(card.attachments||[]).length))) { delayedDestructions.push(card.instanceId); }
        (card.attachments || []).forEach(function(attachment) {
          if (attachment.runtimeFlags && attachment.runtimeFlags.destroyAtEndTurn === state.turnNumber) { delayedAttachments.push(attachment.instanceId); }
        });
      });
    });
    delayedDestructions.forEach(function (instanceId) {
      destroyInsect(state, instanceId, 'EFFECT', null, null, { skipTerritoryDraw: true });
    });
    
    delayedAttachments.forEach(function(instanceId) {
      var holder = findAttachment(state, instanceId);
      if (!holder) { return; }
      var maxHp = calculateMaxHp(holder.host, state);
      holder.host.attachments.splice(holder.index, 1);
      holder.instance.zone = ZONES.DISCARD;
      state.player(holder.instance.ownerId).discard.push(holder.instance);
      delete holder.instance.runtimeFlags.destroyAtEndTurn;
      preserveDamageAfterMaxHpChange(state, holder.host, maxHp);
    });
    // 全プレイヤーの場のダメージを回復
    state.playerOrder.forEach(function (pid) {
      healFieldDamage(state, state.player(pid));
      state.player(pid).field.forEach(function(card){if(card.runtimeFlags){delete card.runtimeFlags.territoryDrawApBonus;}});
      state.player(pid).food.forEach(function(card){if(card.runtimeFlags&&card.runtimeFlags.colorOverrideUntilTurn!=null&&card.runtimeFlags.colorOverrideUntilTurn<=state.turnNumber){delete card.runtimeFlags.colorOverride;delete card.runtimeFlags.colorOverrideUntilTurn;}});
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
        if (c.runtimeFlags && c.runtimeFlags.faceDownUntilTurn != null && c.runtimeFlags.faceDownUntilTurn <= state.turnNumber) {
          c.faceDown = false;
          delete c.runtimeFlags.faceDownUntilTurn;
        }
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
      pl.field.slice().forEach(function (c) {
        var previousTurnState = { turnNumber: state.turnNumber - 1, playerOrder: state.playerOrder, player: state.player.bind(state) };
        var previousMaxHp = calculateMaxHp(c, previousTurnState);
        c.currentHp += calculateMaxHp(c, state) - previousMaxHp;
        global.pruneStatModifiers(state, c, false);
        if (c.currentHp <= 0) { destroyInsect(state, c.instanceId, 'EFFECT', null, null, { skipTerritoryDraw: true }); }
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
      finalizeTerritoryDraw(state, ownerId, card, 'FIELD');
    } else {
      // HAND へ
      finalizeTerritoryDraw(state, ownerId, card, 'HAND');
    }
    resumeAfterSelection(state, pending.afterResolution);
    return card;
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
  global.getComplexSpellSelection = getComplexSpellSelection;
  global.getEnhancementTargetCandidates = getEnhancementTargetCandidates;
  global.resolveChoiceSelection = resolveChoiceSelection;
  global.resolveFieldEntryEffects = resolveFieldEntryEffects;
  global.resolveCardSelection = resolveCardSelection;
  global.selectPendingCard = selectPendingCard;
  global.completeCardSelection = completeCardSelection;
  global.setFood = setFood;
  global.gainCost = gainCost;
  global.getEffectiveCardCost = getEffectiveCardCost;
  global.enterMainPhase = enterMainPhase;
  global.getAvailableSummonMethods = getAvailableSummonMethods;
  global.summonInsect = summonInsect;
  global.useSpell = useSpell;
  global.getSpellTargetCandidates = getSpellTargetCandidates;
  global.resolveSpellEffects = resolveSpellEffects;
  global.getLegalAttackTargets = getLegalAttackTargets;
  global.performAttack = performAttack;
  global.performMultiTargetAttack = performMultiTargetAttack;
  global.beginMultiTargetAttackSelection = beginMultiTargetAttackSelection;
  global.skillRequiresSacrifice = skillRequiresSacrifice;
  global.getSacrificeCandidates = getSacrificeCandidates;
  global.applyDamage = applyDamage;
  global.destroyInsect = destroyInsect;
  global.endTurn = endTurn;
  global.useEnhancement = useEnhancement;
  global.getEffectiveColor = getEffectiveColor;
  global.resolveOnDestroyedTriggers = resolveOnDestroyedTriggers;
  global.resolveAttachmentDiscarded = resolveAttachmentDiscarded;
  global.resolveEffect = resolveEffect;
  global.checkCondition = checkCondition;
  global.enterSetPhase = enterSetPhase;
  global.emitBattleEvent = emitBattleEvent;
  global.getBattleEventsSince = getBattleEventsSince;
  global.isManualDrawPlayer = isManualDrawPlayer;
  global.expectsDraw = expectsDraw;
  global.drawCardOnce = drawCardOnce;
})(typeof window !== 'undefined' ? window : globalThis);
