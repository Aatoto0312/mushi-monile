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
    // This is an already-resolved replacement, not a new keyword trigger.
    // It consumes the draw before any card is chosen/revealed or draw effects fire.
    var replacement = player.territory.find(function(card) {
      return card.runtimeFlags && card.runtimeFlags.replaceNextTerritoryDraw;
    });
    if (replacement) {
      moveTerritoryWithStatAdjustment(state, playerId, replacement, ZONES.DISCARD);
      return null;
    }
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

  function moveTerritoryWithStatAdjustment(state, playerId, card, destination) {
    var snapshots=state.player(playerId).field.map(function(insect){return {card:insect,maxHp:calculateMaxHp(insect,state)};});
    moveCard(state,card.instanceId,card.zone,destination,{playerId:playerId});
    snapshots.forEach(function(snapshot){snapshot.card.currentHp+=calculateMaxHp(snapshot.card,state)-snapshot.maxHp;});
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
    if(continuation.type==='ORDER_TRIGGER_CONTINUATIONS'){
      var triggerSteps=(continuation.steps||[]).slice();if(!triggerSteps.length)return;
      var eligibleTriggers=triggerSteps.filter(function(step){return isTriggerStepEligible(step,triggerSteps);});
      if(!eligibleTriggers.length)throw new Error('誘発の依存関係を解決できません');
      var triggerController=eligibleTriggers.some(function(step){return step.playerId===state.activePlayerId;})?state.activePlayerId:eligibleTriggers[0].playerId;
      var triggerOptions=[];triggerSteps.forEach(function(step,index){if(step.playerId===triggerController&&isTriggerStepEligible(step,triggerSteps))triggerOptions.push({value:String(index),label:step.label});});
      if(triggerOptions.length===1){
        var nextTrigger=triggerSteps.splice(Number(triggerOptions[0].value),1)[0];
        resumeAfterSelection(state,{type:'SEQUENCE',steps:[nextTrigger.continuation,{type:'ORDER_TRIGGER_CONTINUATIONS',steps:triggerSteps}]});return;
      }
      state.pendingEffect={type:'CHOICE_SELECTION',playerId:triggerController,controller:triggerController,selectionPurpose:'SIMULTANEOUS_TRIGGER_ORDER',prompt:'先に解決する効果を選んでください',options:triggerOptions,continuation:{type:'ORDER_TRIGGER_CONTINUATIONS',steps:triggerSteps}};return;
    }
    if(continuation.type==='DESTROY_ENTRY_WATCHER'){
      // The entry event has already happened; the entrant leaving does not
      // undo this trigger. Only the affected watcher must still be in play.
      var entryWatcher=findAnywhere(state,continuation.sourceInstanceId);
      if(entryWatcher&&entryWatcher.zone===ZONES.FIELD&&(entryWatcher.instance.runtimeFlags.fieldEntrySerial||0)===(continuation.fieldEntrySerial||0)){
        destroyInsect(state,entryWatcher.instance.instanceId,'ABILITY',entryWatcher.instance.instanceId,null,{skipTerritoryDraw:true});
      }return;
    }
    if(continuation.type==='RESOLVE_COMMITTED_SPELL'){
      var committedSpell=findInZone(state,continuation.playerId,ZONES.RESOLVING,continuation.sourceInstanceId);
      if(committedSpell)completeCommittedSpell(state,continuation.playerId,committedSpell,getCardDefinition(committedSpell.cardId),continuation.targetInstanceId,continuation.spellOptions);
      return;
    }
    if(continuation.type==='FINALIZE_COMMITTED_SPELL'){
      var finishingSpell=findInZone(state,continuation.playerId,ZONES.RESOLVING,continuation.sourceInstanceId);
      if(finishingSpell)finalizeCommittedSpell(state,continuation.playerId,finishingSpell,getCardDefinition(finishingSpell.cardId),continuation.finalZone);
      return;
    }
    if(continuation.type==='SERIAL_SPELL_DAMAGE'){
      var repeatSource=findAnywhere(state,continuation.sourceInstanceId);
      var repeatDef=repeatSource&&getCardDefinition(repeatSource.instance.cardId);
      if(!repeatDef)return;
      var remaining=continuation.remaining;
      if(continuation.condition){
        var met=continuation.condition==='SAME_NAME_IN_OWN_DISCARD' && state.player(continuation.playerId).discard.some(function(card){return !card.faceDown&&card.instanceId!==continuation.sourceInstanceId&&getCardDefinition(card.cardId).name===repeatDef.name;});
        if(continuation.condition==='OWN_FOOD_RGB')met=['RED','BLUE','GREEN'].every(function(color){return state.player(continuation.playerId).food.some(function(card){return !card.faceDown&&getEffectiveColor(card)===color;});});
        if(!met)return;
      }
      if(remaining<=0)return;
      var repeatTargets=getSpellTargetsForDefinition(state,continuation.playerId,repeatDef,continuation.sourceInstanceId);
      if(!repeatTargets.length)return;
      createCardSelection(state,{playerId:continuation.playerId,options:repeatTargets.map(function(card){return card.instanceId;}),exactSelections:1,candidateZones:[ZONES.FIELD],selectionPurpose:'SERIAL_SPELL_DAMAGE',continuation:{type:'RESOLVE_SERIAL_SPELL_DAMAGE',playerId:continuation.playerId,sourceInstanceId:continuation.sourceInstanceId,amount:continuation.amount},});
      state.pendingEffect.afterResolution={type:'SERIAL_SPELL_DAMAGE',playerId:continuation.playerId,sourceInstanceId:continuation.sourceInstanceId,amount:continuation.amount,remaining:remaining-1};return;
    }
    if(continuation.type==='GROW_ATTACK_SOURCE'){
      var growingSource=findAnywhere(state,continuation.sourceInstanceId);
      if(growingSource&&growingSource.zone===ZONES.FIELD&&(growingSource.instance.runtimeFlags.fieldEntrySerial||0)===(continuation.fieldEntrySerial||0)){
        (continuation.stats||['HP','AP']).forEach(function(stat){addStatModifier(state,growingSource.instance,{sourceInstanceId:continuation.sourceInstanceId,stat:stat,amount:continuation.amount,duration:'FIELD_STAY'});});
      }return;
    }
    if(continuation.type==='APPLY_FIELD_ENTRY_ATTACK_RESTRICTION'){
      var restrictedEntrant=findAnywhere(state,continuation.targetInstanceId);
      if(restrictedEntrant&&restrictedEntrant.zone===ZONES.FIELD&&(restrictedEntrant.instance.runtimeFlags.fieldEntrySerial||0)===(continuation.fieldEntrySerial||0)){
        restrictedEntrant.instance.runtimeFlags.attackRestrictions=(restrictedEntrant.instance.runtimeFlags.attackRestrictions||[]).concat([{startTurn:continuation.turnNumber,endTurn:continuation.turnNumber,whileSourceOnField:false,sourceInstanceId:continuation.sourceInstanceId}]);
      }return;
    }
    if(continuation.type==='RESOLVE_DESTROYED_ABILITY'){
      if((continuation.ability.effects||[]).some(function(effect){return effect.type==='DEPLOY_ADULT_ON_OPPONENT_DESTRUCTION';})){
        var dying=continuation.sourceCard,dyingController=dying.controllerId||dying.ownerId,receipt=dying.destructionReceipt;
        if(dying.faceDown||!receipt||receipt.actorControllerId!==state.opponentOf(dyingController))return;
        var dyingDef=getCardDefinition(dying.cardId),adultName=dyingDef.name.replace(/[（(]幼虫[）)]/g,'').trim();
        resumeAfterSelection(state,{type:'FIELD_ENTRY_EFFECT',playerId:dyingController,sourceInstanceId:dying.instanceId,optional:true,effect:{type:'SELECT_ON_ENTRY',from:ZONES.HAND,controller:'SELF',faceDown:false,cardType:CardTypes.INSECT,nameEquals:adultName,operation:'MOVE',to:ZONES.FIELD,entryCause:{kind:'TRAIT',abilityName:continuation.ability.name,sourceInstanceId:dying.instanceId,playerId:dyingController}}});return;
      }
      if(continuation.ability.condition&&!checkCondition(state,continuation.sourceCard,continuation.ability.condition,continuation.sourceType,continuation.sourceInstanceId))return;
      resumeAfterSelection(state,{type:'SEQUENCE',steps:(continuation.ability.effects||[]).map(function(effect){return {type:'RESOLVE_SNAPSHOT_EFFECT',sourceCard:continuation.sourceCard,effect:effect,sourceType:continuation.sourceType,sourceInstanceId:continuation.sourceInstanceId};})});return;
    }
    if(continuation.type==='RESOLVE_SNAPSHOT_EFFECT'){
      resolveEffect(state,continuation.sourceCard,continuation.effect,continuation.sourceType,continuation.sourceInstanceId);return;
    }
    if(continuation.type==='RESET_ATTACKED_HOST'){
      var resetHost=findAnywhere(state,continuation.hostInstanceId);
      if(resetHost&&resetHost.zone===ZONES.FIELD&&(resetHost.instance.runtimeFlags.fieldEntrySerial||0)===continuation.fieldEntrySerial){resetHost.instance.attackedThisTurn=false;delete resetHost.instance.runtimeFlags.continuousAttack;}
      return;
    }
    if(continuation.type==='END_TURN_FIELD_RETURN'){
      var returning=findAnywhere(state,continuation.instanceId);
      if(returning&&returning.zone===ZONES.FIELD&&(returning.instance.runtimeFlags.fieldEntrySerial||0)===continuation.fieldEntrySerial&&returning.instance.runtimeFlags.returnToOwnerHandAtEndTurn===continuation.turnNumber)moveCard(state,continuation.instanceId,ZONES.FIELD,ZONES.HAND,{playerId:returning.playerId});
      return;
    }
    if(continuation.type==='END_TURN_FIELD_DESTRUCTION'){
      var delayed=findAnywhere(state,continuation.instanceId);
      if(delayed&&delayed.zone===ZONES.FIELD&&(delayed.instance.runtimeFlags.fieldEntrySerial||0)===continuation.fieldEntrySerial){
        var flags=delayed.instance.runtimeFlags;
        if(flags.destroyAtEndTurn===continuation.turnNumber||flags.destroyAtEndTurnUnlessAttached===continuation.turnNumber&&!(delayed.instance.attachments||[]).length)destroyInsect(state,continuation.instanceId,'EFFECT',null,null,{skipTerritoryDraw:true});
      }return;
    }
    if(continuation.type==='END_TURN_ATTACHMENT_DESTRUCTION'){
      var delayedAttachment=findAttachment(state,continuation.instanceId);
      if(delayedAttachment&&delayedAttachment.instance.runtimeFlags.destroyAtEndTurn===continuation.turnNumber){delete delayedAttachment.instance.runtimeFlags.destroyAtEndTurn;destroyAttachedEnhancement(state,delayedAttachment);}return;
    }
    if(continuation.type==='END_TURN_TERRITORY_DISCARD'){
      var expiringTerritory=findAnywhere(state,continuation.instanceId);
      if(expiringTerritory&&expiringTerritory.zone===ZONES.TERRITORY&&expiringTerritory.instance.runtimeFlags.discardTerritoryAtEndTurn===continuation.turnNumber){
        moveTerritoryWithStatAdjustment(state,expiringTerritory.playerId,expiringTerritory.instance,ZONES.DISCARD);
      }return;
    }
    if(continuation.type==='FINISH_END_TURN'){finishEndTurn(state,continuation);return;}
    if(continuation.type==='END_TURN_REFRESH_STATS'){
      var refresh=findAnywhere(state,continuation.instanceId);
      if(refresh&&refresh.zone===ZONES.FIELD&&(refresh.instance.runtimeFlags.fieldEntrySerial||0)===continuation.fieldEntrySerial){
        var previousState={turnNumber:continuation.previousTurn,playerOrder:state.playerOrder,player:state.player.bind(state)},oldMaximum=calculateMaxHp(refresh.instance,previousState);
        refresh.instance.currentHp+=calculateMaxHp(refresh.instance,state)-oldMaximum;pruneStatModifiers(state,refresh.instance,false);
        if(refresh.instance.currentHp<=0)destroyInsect(state,refresh.instance.instanceId,'EFFECT',null,null,{skipTerritoryDraw:true});
      }return;
    }
    if(continuation.type==='BEGIN_TURN_AFTER_END'){
      if(state.winner){state.phase=Phases.GAME_OVER;return;}
      if(state.activePlayerId!==(continuation.previousPlayerId||continuation.playerId)||state.turnNumber!==continuation.turnNumber)throw new Error('ターン開始の継続状態が不正です');
      state.activePlayerId=continuation.playerId;state.phase=Phases.TURN_START;beginTurn(state);return;
    }
    if (continuation.type === 'DESTROYED_CARD_FOLLOWUP') { finishDestroyedCard(state, continuation); return; }
    if(continuation.type==='ORDER_ATTACK_KILL_EFFECTS'){continueAttackKillEffects(state,continuation.context,continuation.effects);return;}
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
      if (!remainingMoves.length) { resumeAfterSelection(state, continuation.afterResolution); return; }
      var nextMove = remainingMoves.shift();
      var currentHolder = findAnywhere(state, nextMove.instanceId);
      // A preceding trigger may legally move or destroy a later candidate. In
      // that case it is no longer eligible for the original move, so skip it
      // rather than reviving it from a stale snapshot.
      if (!currentHolder || (nextMove.requireFaceUp && currentHolder.instance.faceDown) || currentHolder.zone !== nextMove.from ||
          (nextMove.sourcePlayerId && currentHolder.playerId !== nextMove.sourcePlayerId)) {
        resumeAfterSelection(state, { type: 'SERIAL_ZONE_MOVES', moves: remainingMoves, afterResolution:continuation.afterResolution });
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
      resumeAfterSelection(state, { type: 'SERIAL_ZONE_MOVES', moves: remainingMoves, afterResolution:continuation.afterResolution });
      return;
    }
    if(continuation.type==='DEPLOY_ATTACK_MATCHING_FORM'){
      var formOptions=state.player(continuation.playerId).discard.filter(function(card){var def=!card.faceDown&&getCardDefinition(card.cardId);return def&&def.type===CardTypes.INSECT&&String(def.name).normalize('NFKC')===continuation.adultName;});
      if(formOptions.length){createCardSelection(state,{playerId:continuation.playerId,options:formOptions.map(function(card){return card.instanceId;}),exactSelections:1,candidateZones:[ZONES.DISCARD],selectionPurpose:'DEPLOY_ATTACK_MATCHING_FORM',continuation:{type:'DEPLOY_ATTACK_MATCHING_FORM_SELECTED',playerId:continuation.playerId,adultName:continuation.adultName,attack:continuation.attack}});}else resumeAfterSelection(state,{type:'FINISH_FORM_ATTACK',attack:continuation.attack});return;
    }
    if(continuation.type==='GAIN_COST_AFTER_SOURCE_DESTRUCTION'){
      state.player(continuation.playerId).availableCost+=continuation.amount;
      emitBattleEvent(state,'COST_GAIN',{playerId:continuation.playerId,amount:continuation.amount});
      resumeAfterSelection(state,{type:'FINISH_FORM_ATTACK',attack:continuation.attack});return;
    }
    if(continuation.type==='FINISH_FORM_ATTACK'){

      var formAttack=continuation.attack,formSource=findInZone(state,formAttack.playerId,ZONES.FIELD,formAttack.attackerInstanceId);
      if(formSource&&!formSource.faceDown&&(formSource.runtimeFlags.fieldEntrySerial||0)===formAttack.attackerFieldEntrySerial){formAttack.recalculateAp=true;resolveCommittedAttack(state,formAttack);}return;
    }
    if(continuation.type==='RESOLVE_COMMITTED_ATTACK'){resolveCommittedAttack(state,continuation);return;}
    if(continuation.type==='TARGET_ATTACHMENT_AFTER_ATTACK'){
      var attachmentDefender=findInZone(state,continuation.targetPlayerId,ZONES.FIELD,continuation.targetInstanceId);
      if(state.phase===Phases.GAME_OVER||!attachmentDefender||(attachmentDefender.runtimeFlags.fieldEntrySerial||0)!==continuation.fieldEntrySerial)return;
      var targetAttachments=(attachmentDefender.attachments||[]).filter(function(card){return !card.faceDown;});
      if(targetAttachments.length)createCardSelection(state,{playerId:continuation.playerId,options:targetAttachments.map(function(card){return card.instanceId;}),minSelections:0,maxSelections:1,candidateZones:['ATTACHMENT'],selectionPurpose:'TARGET_ATTACHMENT_OPERATION',continuation:{type:'TARGET_ATTACHMENT_OPERATION',targetPlayerId:continuation.targetPlayerId,targetInstanceId:continuation.targetInstanceId,fieldEntrySerial:continuation.fieldEntrySerial,operation:continuation.operation}});
      return;
    }
    if(continuation.type==='ATTACH_AFTER_ATTACK'){
      var attachmentAttacker=findInZone(state,continuation.playerId,ZONES.FIELD,continuation.sourceInstanceId);
      if(state.phase===Phases.GAME_OVER||!attachmentAttacker||(attachmentAttacker.runtimeFlags.fieldEntrySerial||0)!==continuation.fieldEntrySerial)return;
      resumeAfterSelection(state,{type:'FIELD_ENTRY_EFFECT',playerId:continuation.playerId,sourceInstanceId:continuation.sourceInstanceId,optional:true,effect:continuation.effect});return;
    }
    if (continuation.type === 'FIELD_ENTRY_EFFECT') {
      var entryEffect = continuation.effect;
      if(entryEffect.type==='ATTACH_SAME_NAME_FROM_DISCARD'){
        var chainSource=findAttachment(state,continuation.sourceInstanceId);if(!chainSource)return;
        var chainHost=chainSource.host,chainCandidates=state.player(continuation.playerId).discard.filter(function(card){return !card.faceDown&&getCardDefinition(card.cardId).name===entryEffect.name&&isForcedAttachmentHostLegal(state,continuation.playerId,card,chainHost);});
        if(chainCandidates.length)createCardSelection(state,{playerId:continuation.playerId,options:chainCandidates.map(function(card){return card.instanceId;}),minSelections:0,maxSelections:1,candidateZones:[ZONES.DISCARD],selectionPurpose:'CHAIN_ATTACHMENT',continuation:{type:'CHAIN_ATTACHMENT',name:entryEffect.name,hostInstanceId:chainHost.instanceId,fieldEntrySerial:chainHost.runtimeFlags.fieldEntrySerial||0}});
        return;
      }
      if(entryEffect.sourceGrowth)entryEffect=Object.assign({},entryEffect,{sourceEntrySerial:continuation.entryEvent.fieldEntrySerial});
      if(entryEffect.excludeSource)entryEffect=Object.assign({},entryEffect,{excludedInstanceId:continuation.sourceInstanceId});
      if(entryEffect.adultFormOfSource)entryEffect=Object.assign({},entryEffect,{nameEquals:continuation.entryEvent.printedName.replace(/[（(]幼虫[）)]/g,'').trim()});
      if(entryEffect.printedCostMaxFromSource)entryEffect=Object.assign({},entryEffect,{printedCostMax:continuation.entryEvent.printedCost});
      var entryReceipt=continuation.entryEvent&&continuation.entryEvent.cause;
      if(entryEffect.requiresPaidEntry&&(!entryReceipt||entryReceipt.kind!=='SUMMON'||entryReceipt.method!=='NORMAL_SUMMON'))return;
      if(entryEffect.requiredOwnDiscardNameSubstring&&!state.player(continuation.playerId).discard.some(function(card){var d=!card.faceDown&&getCardDefinition(card.cardId);return d&&d.name.indexOf(entryEffect.requiredOwnDiscardNameSubstring)!==-1;}))return;
      if(entryEffect.type==='GROW_FROM_SUMMONING_ATTACHMENT'){
        var origin=continuation.entryEvent&&continuation.entryEvent.cause,host=findAnywhere(state,continuation.sourceInstanceId);
        if(!origin||origin.kind!=='ENHANCEMENT'||!host||host.zone!==ZONES.FIELD||(host.instance.runtimeFlags.fieldEntrySerial||0)!==continuation.entryEvent.fieldEntrySerial)return;
        var originDef=getCardDefinition(origin.cardId),attachment=findAttachment(state,origin.instanceId);
        if(!originDef||originDef.name!==entryEffect.attachmentName||!attachment||attachment.host.instanceId!==host.instance.instanceId)return;
        destroyAttachedEnhancement(state,attachment);
        if(host.instance.zone!==ZONES.FIELD)return;
        addStatModifier(state,host.instance,{sourceInstanceId:continuation.sourceInstanceId,stat:'HP',amount:entryEffect.hp,duration:'FIELD_STAY'});
        addStatModifier(state,host.instance,{sourceInstanceId:continuation.sourceInstanceId,stat:'AP',amount:entryEffect.ap,duration:'FIELD_STAY'});return;
      }
      if(entryEffect.type==='SELECT_ON_ENTRY'){
        if(entryEffect.minimumOpponentFoodAdvantage!=null&&state.player(state.opponentOf(continuation.playerId)).food.length-state.player(continuation.playerId).food.length<entryEffect.minimumOpponentFoodAdvantage)return;
        var entryChoices=getEntrySelectionCandidates(state,continuation.playerId,entryEffect);
        if(entryEffect.allCandidates){entryChoices.forEach(function(card){addStatModifier(state,card,{sourceInstanceId:continuation.sourceInstanceId,stat:entryEffect.stat,amount:entryEffect.amount});});return;}
        if(!entryChoices.length)return;
        var entryPairs=[];
        if(entryEffect.exactOptionalCount===2){if(entryChoices.length<2)return;entryChoices.forEach(function(a,i){entryChoices.slice(i+1).forEach(function(b){entryPairs.push([a.instanceId,b.instanceId]);});});entryPairs.push([]);}
        createCardSelection(state,{playerId:continuation.playerId,options:entryChoices.map(function(card){return card.instanceId;}),minSelections:continuation.optional?0:1,maxSelections:Math.min(entryEffect.maxSelections||1,entryChoices.length),allowedCombinations:entryPairs,selectionAtMostOneGroups:entryEffect.distinctColor?['RED','BLUE','GREEN','COLORLESS'].map(function(color){return entryChoices.filter(function(card){return getEffectiveColor(card)===color;}).map(function(card){return card.instanceId;});}):[],candidateZones:[entryEffect.from],selectionPurpose:'ENTRY_'+entryEffect.operation,continuation:{type:'RESOLVE_ENTRY_SELECTION',playerId:continuation.playerId,sourceInstanceId:continuation.sourceInstanceId,effect:entryEffect}});return;
      }
      if(entryEffect.type==='ATTACH_FROM_ZONE_TO_OWN_INSECT'){
        var entryAttachChoices=getEntryAttachAnyCandidates(state,continuation.playerId,entryEffect);
        if(entryAttachChoices.length)createCardSelection(state,{playerId:continuation.playerId,options:entryAttachChoices.map(function(card){return card.instanceId;}),minSelections:0,maxSelections:1,candidateZones:[entryEffect.from],selectionPurpose:'ENTRY_CHOOSE_ATTACHMENT',continuation:{type:'ENTRY_CHOOSE_ATTACHMENT_HOST',effect:entryEffect}});
        return;
      }
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
      if(entryEffect.type==='CHOOSE_COLOR_AND_CONCEAL_FOOD'){
        var concealColorLabels={RED:'赤',BLUE:'青',GREEN:'緑',COLORLESS:'無色'};
        state.pendingEffect={type:'CHOICE_SELECTION',playerId:continuation.playerId,controller:continuation.playerId,selectionPurpose:'CONCEAL_FOOD_COLOR',prompt:'裏返すエサの色を指定してください',options:entryEffect.colors.map(function(color){return {value:color,label:concealColorLabels[color]};}),continuation:{type:'CONCEAL_FOOD_BY_COLOR',playerIds:state.playerOrder.slice()}};return;
      }
      if(entryEffect.type==='ATTACH_FROM_OWN_ZONE_ON_ENTRY'){
        var attachmentEntryHost=findInZone(state,continuation.playerId,ZONES.FIELD,continuation.sourceInstanceId);
        if(!attachmentEntryHost)return;
        var attachmentEntryCause=attachmentEntryHost.runtimeFlags.fieldEntryCause;
        if(entryEffect.entryMethod&&(!attachmentEntryCause||attachmentEntryCause.method!==entryEffect.entryMethod))return;
        var entryAttachments=getEntryAttachmentCandidates(state,continuation.playerId,attachmentEntryHost,entryEffect);
        if(entryAttachments.length)createCardSelection(state,{playerId:continuation.playerId,options:entryAttachments.map(function(card){return card.instanceId;}),minSelections:continuation.optional?0:1,maxSelections:1,candidateZones:[entryEffect.from],selectionPurpose:'ENTRY_ATTACH_ENHANCEMENT',continuation:{type:'ENTRY_ATTACH_ENHANCEMENT',hostInstanceId:attachmentEntryHost.instanceId,fieldEntrySerial:attachmentEntryHost.runtimeFlags.fieldEntrySerial||0,effect:entryEffect}});
        return;
      }
      if(entryEffect.type==='GROW_SELF_IF_ENTRY_CARD_NAME'){
        var enteringSource=findInZone(state,continuation.playerId,ZONES.FIELD,continuation.sourceInstanceId),cause=enteringSource&&enteringSource.runtimeFlags.fieldEntryCause,causeDefinition=cause&&getCardDefinition(cause.cardId);
        if(causeDefinition&&causeDefinition.name.indexOf(entryEffect.nameSubstring)!==-1){(entryEffect.stats||[]).forEach(function(stat){addStatModifier(state,enteringSource,{sourceInstanceId:continuation.sourceInstanceId,stat:stat,amount:entryEffect.amount,duration:'FIELD_STAY'});});}return;
      }
      if(entryEffect.type==='GROW_SELF_IF_ENTRY_EFFECT_NAME'){
        var growthCause=continuation.entryEvent&&continuation.entryEvent.cause||{},growthDefinition=growthCause.kind==='SPELL'&&getCardDefinition(growthCause.cardId);
        var growthName=growthDefinition?growthDefinition.name:(growthCause.kind==='TRAIT'||growthCause.kind==='SKILL')?(growthCause.abilityName||growthCause.skillName||''):'';
        var growing=findAnywhere(state,continuation.sourceInstanceId);
        if(growthName.indexOf(entryEffect.nameSubstring)!==-1&&growing&&growing.zone===ZONES.FIELD&&(growing.instance.runtimeFlags.fieldEntrySerial||0)===continuation.entryEvent.fieldEntrySerial)(entryEffect.stats||[]).forEach(function(stat){addStatModifier(state,growing.instance,{sourceInstanceId:continuation.sourceInstanceId,stat:stat,amount:entryEffect.amount,duration:'FIELD_STAY'});});return;
      }
      if(entryEffect.type==='IGNORE_WEAKNESS_NEXT_OPPONENT_TURN'||entryEffect.type==='PREVENT_ATTACK_TARGET_NEXT_OPPONENT_TURN'){
        var protectedEntry=findAnywhere(state,continuation.sourceInstanceId);
        if(protectedEntry){protectedEntry.instance.runtimeFlags=protectedEntry.instance.runtimeFlags||{};protectedEntry.instance.runtimeFlags[entryEffect.type==='IGNORE_WEAKNESS_NEXT_OPPONENT_TURN'?'ignoreWeaknessTurn':'preventAttackTargetTurn']=state.turnNumber+(state.activePlayerId===protectedEntry.playerId?1:2);}return;
      }
      if (entryEffect.type === 'MOVE_SELECTED') {
        var entryCandidates = getPlayerZoneArray(state, continuation.playerId, entryEffect.from).filter(function(card) {
          var definition = getCardDefinition(card.cardId);
          return (!entryEffect.cardType || definition.type === entryEffect.cardType) &&
            (entryEffect.printedCost == null || definition.cost === entryEffect.printedCost) &&
            (!entryEffect.requiredTag || definition.tags.indexOf(entryEffect.requiredTag) !== -1);
        });
        if (!entryCandidates.length) { return; }
        createCardSelection(state, { playerId: continuation.playerId,
          options: entryCandidates.map(function(card) { return card.instanceId; }),
          minSelections: continuation.optional ? 0 : 1, maxSelections: entryEffect.count || 1,
          candidateZones: [entryEffect.from], selectionPurpose: 'ON_ENTER_FIELD_MOVE',
          continuation: { type: 'MOVE_SELECTED', from: entryEffect.from, to: entryEffect.to, grantCost: entryEffect.grantCost,
            cardType: entryEffect.cardType, printedCost: entryEffect.printedCost, requiredTag: entryEffect.requiredTag, prohibitAttackThisTurn: entryEffect.prohibitAttackThisTurn } });
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
      if (entryEffect.type === 'DESTROY_OWN_FOOD_OR_SELF_ON_ENTRY') {
        var entryOwner=state.player(continuation.playerId);
        var visibleFood=entryOwner.food.filter(function(card){return !card.faceDown;});
        if(!visibleFood.length){
          var unpaidSource=findInZone(state,continuation.playerId,ZONES.FIELD,continuation.sourceInstanceId);
          if(unpaidSource){destroyInsect(state,unpaidSource.instanceId,'ABILITY',unpaidSource.instanceId,null,{skipTerritoryDraw:true});}
          return;
        }
        createCardSelection(state,{playerId:continuation.playerId,options:visibleFood.map(function(card){return card.instanceId;}),
          exactSelections:1,candidateZones:[ZONES.FOOD],selectionPurpose:'ENTRY_FOOD_DESTRUCTION',
          continuation:{type:'DESTROY_ENTRY_FOOD',sourceInstanceId:continuation.sourceInstanceId,playerId:continuation.playerId}});
      }
      if (entryEffect.type === 'MOVE_OWN_ZONE_CARD_OR_DESTROY_SELF_ON_ENTRY') {
        var offeringCards = getPlayerZoneArray(state,continuation.playerId,entryEffect.from).filter(function(card) {
          var offeredDefinition = getCardDefinition(card.cardId);
          return offeredDefinition && (!entryEffect.cardType || offeredDefinition.type === entryEffect.cardType);
        });
        if (!offeringCards.length) {
          var offeringSource = findInZone(state,continuation.playerId,ZONES.FIELD,continuation.sourceInstanceId);
          if (offeringSource) { destroyInsect(state,offeringSource.instanceId,'ABILITY',offeringSource.instanceId,null,{skipTerritoryDraw:true}); }
          return;
        }
        createCardSelection(state,{playerId:continuation.playerId,options:offeringCards.map(function(card){return card.instanceId;}),
          minSelections:0,maxSelections:1,candidateZones:[entryEffect.from],selectionPurpose:'ENTRY_OFFERING',
          continuation:{type:'RESOLVE_ENTRY_OFFERING',playerId:continuation.playerId,sourceInstanceId:continuation.sourceInstanceId,
            from:entryEffect.from,to:entryEffect.to,cardType:entryEffect.cardType}});
        return;
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
        if (effect.type === 'GAIN_COST_ON_TERRITORY' && state.player(continuation.territoryPlayerId).territory.length >= (effect.minimumRemainingTerritory || 0)) {
          state.player(source.playerId).availableCost += effect.amount || 1;
        }
        if (effect.type === 'DISCARD_OPPONENT_HAND_ON_TERRITORY') {
          var discardPlayer=state.player(continuation.territoryPlayerId);
          if(discardPlayer.hand.length>=(effect.minimumHand||1)){createCardSelection(state,{playerId:continuation.territoryPlayerId,options:discardPlayer.hand.map(function(c){return c.instanceId;}),exactSelections:effect.count||1,candidateZones:[ZONES.HAND],selectionPurpose:'OPPONENT_HAND_DISCARD',continuation:{type:'DISCARD_SELECTED_HAND',targetPlayerId:continuation.territoryPlayerId}});}
        }
      });
      var bottomEffect=attackSkill&&(attackSkill.effects||[]).find(function(effect){return effect.type==='BOTTOM_DISCARD_ON_TERRITORY';});
      if(bottomEffect)resumeAfterSelection(state,{type:'OPTIONAL_BOTTOM_DECK_DISCARD',playerId:source.playerId,targetPlayerId:continuation.territoryPlayerId,cardType:bottomEffect.cardType,maxSelections:1,faceDown:true});
      var foodEffect=attackSkill&&(attackSkill.effects||[]).find(function(effect){return effect.type==='OPTIONAL_FLIP_FOOD_ON_TERRITORY';});
      if (foodEffect) {
        var foodPlayerId=foodEffect.controller==='SELF'?source.playerId:continuation.territoryPlayerId;
        var expectedFaceDown=!!foodEffect.faceDown;
        var food = state.player(foodPlayerId).food.filter(function(c) {
          if(!!c.faceDown!==expectedFaceDown)return false;
          // A hidden food's identity must never be inspected to build its candidates.
          if(c.faceDown&&!(foodEffect.inspectOwnHidden&&foodPlayerId===source.playerId))return !foodEffect.color&&!foodEffect.cardType;
          var definition=getCardDefinition(c.cardId);
          return (!foodEffect.cardType||definition&&definition.type===foodEffect.cardType)&&(!foodEffect.color||getEffectiveColor(c)===foodEffect.color);
        });
        if (food.length) {
          createCardSelection(state, { playerId: source.playerId, options: food.map(function(c) { return c.instanceId; }),
            minSelections: 0, maxSelections: Math.min(foodEffect.maxSelections||1,food.length), candidateZones: [ZONES.FOOD], selectionPurpose: foodEffect.targetFaceDown===false?'REVEAL_OWN_FOOD':'FLIP_OPPONENT_FOOD',
            continuation: { type: 'FLIP_SELECTED_FOOD', effect:{inspectOwnHidden:!!foodEffect.inspectOwnHidden}, targetPlayerId: foodPlayerId, expectedFaceDown:expectedFaceDown,
              targetFaceDown:foodEffect.targetFaceDown!==false,color:foodEffect.color,cardType:foodEffect.cardType,followUpIfColor:foodEffect.followUpIfColor,followUpColor:foodEffect.followUpColor,followUpCardType:foodEffect.followUpCardType } });
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
    if(continuation.type==='ATTACK_AFTER_BLIND_ROUTE'){
      performAttack(state,continuation.attackerInstanceId,continuation.targetInstanceId,continuation.targetType,continuation.skillId,null,{blindRouted:true});return;
    }
    if(continuation.type==='ATTACH_FOOD_ENHANCEMENTS_SEQUENCE'){
      continueFoodEnhancementSequence(state,continuation);return;
    }
    if(continuation.type==='OPTIONAL_BOTTOM_DECK_DISCARD'){
      var discardPlayer=state.player(continuation.targetPlayerId),discardOptions=discardPlayer.discard.filter(function(card){var d=continuation.cardType&&!card.faceDown&&getCardDefinition(card.cardId);return !continuation.cardType||d&&d.type===continuation.cardType;});
      if(discardOptions.length){createCardSelection(state,{playerId:continuation.playerId,options:discardOptions.map(function(card){return card.instanceId;}),minSelections:0,maxSelections:Math.min(continuation.maxSelections||1,discardOptions.length),candidateZones:[ZONES.DISCARD],selectionPurpose:'OPTIONAL_BOTTOM_DECK_DISCARD',continuation:{type:'MOVE_DISCARD_TO_BOTTOM_DECK',targetPlayerId:continuation.targetPlayerId,cardType:continuation.cardType,faceDown:continuation.faceDown}});}return;
    }
    if(continuation.type==='DESTROY_VISIBLE_SEQUENCE'){
      var destroyIds=(continuation.instanceIds||[]).slice();if(!destroyIds.length){resumeAfterSelection(state,continuation.afterResolution);return;}
      var destroyId=destroyIds.shift(),destroyHolder=findAnywhere(state,destroyId);
      if(destroyHolder&&destroyHolder.zone===ZONES.FIELD&&!destroyHolder.instance.faceDown){destroyInsect(state,destroyId,'SPELL',continuation.sourceInstanceId,null,{skipTerritoryDraw:true});}
      resumeAfterSelection(state,{type:'DESTROY_VISIBLE_SEQUENCE',instanceIds:destroyIds,sourceInstanceId:continuation.sourceInstanceId,afterResolution:continuation.afterResolution});return;
    }
    if(continuation.type==='END_ACTIVE_TURN'){
      if(state.player(state.activePlayerId).resolving.length){state._postSpellContinuation=continuation;return;}
      endTurn(state);return;
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
    var keywordSuppressed=card.runtimeFlags&&card.runtimeFlags.suppressKeywordSkills||areInsectKeywordSkillsSuppressed(state,card);
    var route=!keywordSuppressed&&def&&(def.passiveAbilities||[]).filter(function(ability){return ability.timing==='TERRITORY_DRAW';}).reduce(function(all,ability){return all.concat(ability.effects||[]);},[]).find(function(effect){return effect.type==='OPTIONAL_SELF_DRAW_DESTINATION';});
    if(route){
      var destinationLabels={FOOD:'エサ場に置く',TERRITORY:'表向きで縄張りに置く',HAND:'手札に加える'};
      state.pendingEffect={type:'CHOICE_SELECTION',playerId:playerId,controller:playerId,selectionPurpose:'TERRITORY_CARD_DESTINATION',prompt:def.name+'の置き先を選んでください',options:[{value:route.destination,label:destinationLabels[route.destination]},{value:'HAND',label:destinationLabels.HAND}],continuation:{type:'ROUTE_DRAWN_TERRITORY_CARD',playerId:playerId,sourceInstanceId:card.instanceId,route:route}};return card;
    }
    var territoryAttachment=def&&(def.enhancementEffects||[]).some(function(effect){return effect.type==='OPTIONAL_ATTACH_FROM_TERRITORY';});
    if(territoryAttachment){
      var attachmentHosts=state.player(playerId).field.filter(function(host){return !host.faceDown&&isForcedAttachmentHostLegal(state,playerId,card,host);});
      if(attachmentHosts.length){createCardSelection(state,{playerId:playerId,options:attachmentHosts.map(function(host){return host.instanceId;}),minSelections:0,maxSelections:1,candidateZones:[ZONES.FIELD],selectionPurpose:'ATTACH_FROM_TERRITORY',continuation:{type:'ATTACH_TERRITORY_CARD',attachmentInstanceId:card.instanceId}});return card;}
    }
    if (!def || !def.skills) {
      // 誘発なし → HAND へ
      return finalizeTerritoryDraw(state, playerId, card, card.runtimeFlags && card.runtimeFlags.specialTerritoryDrawDestination || 'HAND');
    }

    // timing === 'TERRITORY_DRAW' かつ optional なスキルを探す
    var triggerSkill = !keywordSuppressed && def.skills.find(function (skill) {
      return skill.timing === 'TERRITORY_DRAW' && skill.optional === true;
    });

    var grant = state.player(playerId).territoryTriggerGrant;
    if (grant && grant.active && state.player(playerId).territory.length === 0) { grant.active = false; }
    var grantedSkillId=!keywordSuppressed&&getGrantedTerritorySkillId(state,playerId,def);
    if (!triggerSkill && grantedSkillId) {
      triggerSkill = { id: grantedSkillId, timing:'TERRITORY_DRAW', optional:true };
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
    } else if(destinationZone===ZONES.TERRITORY){
      moveTerritoryWithStatAdjustment(state,playerId,card,ZONES.TERRITORY);
      card.faceDown=false;
    } else {
      var destination = destinationZone === ZONES.DISCARD ? ZONES.DISCARD : destinationZone === ZONES.FOOD ? ZONES.FOOD : ZONES.HAND;
      moveCard(state, card.instanceId, ZONES.RESOLVING, destination, { playerId: playerId });
      if(destination===ZONES.FOOD){card.faceDown=false;card.runtimeFlags=card.runtimeFlags||{};card.runtimeFlags.foodCostSuppressedTurn=state.turnNumber;}
      log(state, state.turnNumber, playerId + ' は縄張りから1枚を' + (destination===ZONES.DISCARD?'捨て札へ送った':destination===ZONES.FOOD?'エサ場へ置いた':'手札へ加えた'));
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
    ['FOOD','DISCARD'].forEach(function(zone){state.player(playerId)[zone.toLowerCase()].forEach(function(source){if(source.faceDown)return;var sourceDef=getCardDefinition(source.cardId);(sourceDef&&sourceDef.enhancementEffects||[]).forEach(function(effect){if(effect.type!=='ZONE_COST_MODIFIER'||effect.sourceZone!==zone||effect.cardType&&effect.cardType!==definition.type||effect.nameSubstring&&definition.name.indexOf(effect.nameSubstring)===-1||effect.families&&!(definition.tags||[]).some(function(tag){return effect.families.indexOf(tag)!==-1;}))return;cost+=effect.amount;});});});
    (definition.costModifiers || []).forEach(function (modifier) {
      if (modifier.requiresKeywordTrait && areInsectKeywordSkillsSuppressed(state,{cardId:definition.id})) { return; }
      if(modifier.type==='PER_DISTINCT_FACE_UP_FOOD_INSECT_COLOR'){
        var colors={};player.food.forEach(function(card){if(card.faceDown)return;var d=getCardDefinition(card.cardId);if(d&&d.type===CardTypes.INSECT)colors[getEffectiveColor(card)]=true;});
        cost+=Object.keys(colors).length*modifier.amount;
      }
      if(modifier.type==='PER_DISTINCT_FACE_UP_FOOD_COLOR'){var foundColors={};player.food.forEach(function(card){if(!card.faceDown){var color=getEffectiveColor(card);if(!modifier.colors||modifier.colors.indexOf(color)!==-1)foundColors[color]=true;}});cost+=Object.keys(foundColors).length*modifier.amount;}
      if(modifier.type==='PER_FACE_DOWN_FOOD')cost+=Math.floor(player.food.filter(function(card){return card.faceDown;}).length/(modifier.per||1))*modifier.amount;
      if(modifier.type==='OWN_VISIBLE_FIELD_NAME'&&player.field.some(function(card){if(card.faceDown)return false;var d=getCardDefinition(card.cardId);return d&&d.name===modifier.name;}))cost+=modifier.amount;
      if(modifier.type==='OPPONENT_FACE_UP_FOOD_COLOR_THRESHOLD'&&state.player(state.opponentOf(playerId)).food.filter(function(card){return !card.faceDown&&getEffectiveColor(card)===modifier.color;}).length>=modifier.minimum)cost+=modifier.amount;
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
      if (modifier.type === 'PER_FILTERED_DISCARD') {
        cost += countVisibleDiscardCards(state, playerId, modifier.filter) * modifier.amount;
      }
      if (modifier.type === 'PER_DISCARD_TRAIT') {
        var traitCount = player.discard.filter(function (card) {
          var discardedDef = getCardDefinition(card.cardId);
          return discardedDef && (discardedDef.passiveAbilities || []).some(function (ability) { return ability.name === modifier.traitName; });
        }).length;
        cost += Math.floor(traitCount / (modifier.per || 1)) * modifier.amount;
      }
      if (modifier.type === 'PER_OPPONENT_FACE_UP_FOOD_COLOR') {
        var opponent = state.player(state.opponentOf(playerId));
        var opponentCount = opponent.food.filter(function (card) {
          var opponentFoodDef = !card.faceDown && getCardDefinition(card.cardId);
          return opponentFoodDef && opponentFoodDef.color === modifier.color;
        }).length;
        cost += Math.floor(opponentCount / modifier.per) * modifier.amount;
      }
      if (modifier.type === 'PER_OPPONENT_FACE_DOWN_FOOD') {
        var hiddenFoodCount = state.player(state.opponentOf(playerId)).food.filter(function (card) {
          return card.faceDown;
        }).length;
        cost += Math.floor(hiddenFoodCount / (modifier.per || 1)) * modifier.amount;
      }
      // Cost adjustments are additive; apply the zero floor only after every
      // reduction and increase (official Neptune / Living Fossil ruling).
    });
    state.playerOrder.forEach(function (controllerId) {
      state.player(controllerId).field.forEach(function (source) {
        if (source.faceDown) { return; }
        if (areInsectKeywordSkillsSuppressed(state,source)) { return; }
        var sourceDef = getCardDefinition(source.cardId);
        (sourceDef && sourceDef.passiveAbilities || []).forEach(function (ability) {
          (ability.effects || []).forEach(function (effect) {
            if (effect.type !== 'CARD_COST_MODIFIER' || (effect.cardType && effect.cardType !== definition.type)) { return; }
            if (effect.affects !== 'ALL_PLAYERS' && controllerId !== playerId) { return; }
            if (effect.printedCostMax != null && definition.cost > effect.printedCostMax) { return; }
            if (effect.minimumPrintedSkills != null && ((definition.skills||[]).length+(definition.passiveAbilities||[]).length)<effect.minimumPrintedSkills) { return; }
            if (effect.minimumEffectiveSkills != null && getEffectiveTechniqueCount(state,playerId,definition) < effect.minimumEffectiveSkills) { return; }
            if (effect.target === 'SELF' && context.targetInstanceId !== source.instanceId) { return; }
            cost += effect.amount;
          });
        });
      });
    });
    if(definition.type===CardTypes.ENHANCEMENT&&player.nextEnhancementDiscount&&state.turnNumber<=player.nextEnhancementDiscount.endTurn){cost-=player.nextEnhancementDiscount.amount;}
    (player.runtimeCostModifiers||[]).forEach(function(modifier){if(definition.type===modifier.cardType&&state.turnNumber>=modifier.startTurn&&state.turnNumber<=modifier.endTurn){cost+=modifier.amount;}});
    (player.nextUseCostModifiers||[]).forEach(function(modifier){if(matchesNextUseCostModifier(state,playerId,definition,modifier))cost+=modifier.amount;});
    if(definition.foodPaymentDiscount){var foodPaymentCount=context.foodPaymentCount==null?player.food.filter(function(card){return !card.faceDown;}).length:context.foodPaymentCount;cost-=foodPaymentCount*definition.foodPaymentDiscount;}
    return Math.max(0, cost);
  }

  function getEffectiveTechniqueCount(state,playerId,definition){
    var skills=definition.skills||[],count=skills.length+(definition.passiveAbilities||[]).length,grantedSkillId=getGrantedTerritorySkillId(state,playerId,definition);
    if(grantedSkillId&&!skills.some(function(skill){return skill.id===grantedSkillId;}))count++;
    return count;
  }

  function getGrantedTerritorySkillId(state,playerId,definition){
    var player=state.player(playerId),grant=player.territoryTriggerGrant;
    if(!grant||!grant.active||!player.territory.length||!definition||definition.type!==CardTypes.INSECT)return null;
    return (definition.tags||[]).some(function(tag){return (grant.familySuffixes||[]).some(function(suffix){return tag.endsWith(suffix);});})?(grant.skillId||'tobidasu'):null;
  }

  function matchesNextUseCostModifier(state,playerId,definition,modifier){
    if(state.turnNumber>modifier.endTurn||definition.type!==modifier.cardType)return false;
    if(modifier.nameSuffix){
      if(definition.name.endsWith(modifier.nameSuffix))return false;
      return insectCards(getPlayerZoneArray(state,playerId,modifier.sourceZone)).some(function(source){var name=getCardDefinition(source.cardId).name;return name.endsWith(modifier.nameSuffix)&&name.slice(0,-modifier.nameSuffix.length)===definition.name;});
    }
    return true;
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

    player.nextUseCostModifiers=(player.nextUseCostModifiers||[]).filter(function(modifier){return state.turnNumber<=modifier.endTurn&&!matchesNextUseCostModifier(state,playerId,def,modifier);});
    moveCard(state, handInstanceId, ZONES.HAND, ZONES.FIELD, { playerId: playerId, runtimeFlags:{fieldEntryCause:{kind:'SUMMON',method:summonOptions.alternative?'ALTERNATIVE_SUMMON':'NORMAL_SUMMON',paidCost:summonOptions.alternative?0:summonCost,playerId:playerId}} });
    held.currentHp = def.baseHp;
    emitBattleEvent(state,'SUMMON',{sourceInstanceId:held.instanceId,playerId:playerId});
    held.baseHp = def.baseHp;
    held.attackedThisTurn = false;
    held.usedSkills = [];
    held.faceDown = false;
    held.enteredFieldTurn = state.turnNumber;

    log(state, state.turnNumber, playerId + ' は ' + def.name + ' を召喚した | コスト' + summonCost + ' | 残りコスト: ' + player.availableCost);
    return held;
  }

  // ---- 術カード使用 ----

  function getEntrySelectionCandidates(state,playerId,effect){
    var targetPlayerId=effect.controller==='OPPONENT'?state.opponentOf(playerId):playerId;
    return getPlayerZoneArray(state,targetPlayerId,effect.from).filter(function(card){
      if(card.instanceId===effect.excludedInstanceId)return false;
      var entryHidden=!!card.faceDown&&!(effect.from===ZONES.HAND&&targetPlayerId===playerId);
      if(effect.faceDown!=null&&entryHidden!==effect.faceDown)return false;
      if(entryHidden&&!(effect.inspectOwnHidden&&targetPlayerId===playerId&&effect.from===ZONES.FOOD))return !effect.cardType&&!effect.colors&&!effect.nameSubstring&&!effect.nameEquals&&!effect.requiredTraitName&&!effect.printedCostMaxFromSource&&effect.printedCostMax==null;
      var definition=getCardDefinition(card.cardId);
      return !!definition&&(!effect.cardType||definition.type===effect.cardType)&&
        (!effect.familySuffixes||(definition.tags||[]).some(function(tag){return effect.familySuffixes.some(function(suffix){return tag.slice(-suffix.length)===suffix;});}))&&
        (!effect.requiredTraitName||(!areInsectKeywordSkillsSuppressed(state,card)&&!(card.runtimeFlags&&card.runtimeFlags.suppressKeywordSkills)&&(definition.passiveAbilities||[]).some(function(ability){return ability.name===effect.requiredTraitName;})))&&
        (!effect.colors||effect.colors.indexOf(getEffectiveColor(card))!==-1)&&
        (!effect.nameSubstring||definition.name.indexOf(effect.nameSubstring)!==-1)&&
        (!effect.nameEquals||definition.name===effect.nameEquals)&&
        (effect.printedCostMax==null||definition.cost<=effect.printedCostMax);
    });
  }

  function getPendingEntrySelectionConstraints(state,pending){
    var c=pending&&pending.continuation;
    if(!c)return null;
    if(c.type==='DEPLOY_ATTACK_MATCHING_FORM_SELECTED'){
      var formIds=state.player(c.playerId).discard.filter(function(card){var def=!card.faceDown&&getCardDefinition(card.cardId);return pending.options.indexOf(card.instanceId)!==-1&&def&&def.type===CardTypes.INSECT&&String(def.name).normalize('NFKC')===c.adultName;}).map(function(card){return card.instanceId;});
      return {options:formIds,atMostOneGroups:[],selectionBounds:formIds.length?null:{minSelections:0,maxSelections:0,exactSelections:0}};
    }
    if(c.type==='ATTACH_FOOD_ENHANCEMENT_TO_HOST'){
      var foodChoice=findInZone(state,pending.playerId,ZONES.FOOD,c.attachmentInstanceId);
      var foodHosts=foodChoice?insectCards(state.player(pending.playerId).field).filter(function(host){if(pending.options.indexOf(host.instanceId)===-1)return false;if(c.selectedHosts)return c.selectedHosts.some(function(target){return target.instanceId===host.instanceId&&(host.runtimeFlags.fieldEntrySerial||0)===target.fieldEntrySerial;})&&isForcedAttachmentHostLegal(state,pending.playerId,foodChoice,host);return isSpellSelectionTargetLegal(state,pending.playerId,host)&&[foodChoice].concat((c.remainingAttachmentIds||[]).map(function(id){return findInZone(state,pending.playerId,ZONES.FOOD,id);}).filter(Boolean)).some(function(food){return isForcedAttachmentHostLegal(state,pending.playerId,food,host);});}):[];
      return {options:foodHosts.map(function(host){return host.instanceId;}),atMostOneGroups:[],selectionBounds:foodHosts.length?null:{minSelections:0,maxSelections:0,exactSelections:0}};
    }
    if(c.type==='TARGET_ATTACHMENT_OPERATION'){
      var currentAttachmentHost=findInZone(state,c.targetPlayerId,ZONES.FIELD,c.targetInstanceId);
      var currentAttachmentIds=currentAttachmentHost&&(currentAttachmentHost.runtimeFlags.fieldEntrySerial||0)===c.fieldEntrySerial?(currentAttachmentHost.attachments||[]).filter(function(card){return !card.faceDown&&pending.options.indexOf(card.instanceId)!==-1;}).map(function(card){return card.instanceId;}):[];
      return {options:currentAttachmentIds,atMostOneGroups:[],selectionBounds:currentAttachmentIds.length?null:{minSelections:0,maxSelections:0,exactSelections:0}};
    }
    if(c.type==='ENTRY_ATTACH_ENHANCEMENT'){
      var attachmentHost=findInZone(state,pending.playerId,ZONES.FIELD,c.hostInstanceId);
      var eligible=attachmentHost&&(attachmentHost.runtimeFlags.fieldEntrySerial||0)===c.fieldEntrySerial?getEntryAttachmentCandidates(state,pending.playerId,attachmentHost,c.effect):[];
      return {options:eligible.map(function(card){return card.instanceId;}).filter(function(id){return pending.options.indexOf(id)!==-1;}),atMostOneGroups:[]};
    }
    if(c.type!=='RESOLVE_ENTRY_SELECTION')return null;
    var cards=getEntrySelectionCandidates(state,c.playerId,c.effect).filter(function(card){return pending.options.indexOf(card.instanceId)!==-1;});
    return {options:cards.map(function(card){return card.instanceId;}),atMostOneGroups:c.effect.distinctColor?['RED','BLUE','GREEN','COLORLESS'].map(function(color){return cards.filter(function(card){return getEffectiveColor(card)===color;}).map(function(card){return card.instanceId;});}):[]};
  }

  function resolveFieldEntryEffects(state, instanceId) {
    var holder = findAnywhere(state, instanceId);
    if (!holder || holder.zone !== ZONES.FIELD) { return; }
    var definition = getCardDefinition(holder.instance.cardId);
    var entrySerial=holder.instance.runtimeFlags.fieldEntrySerial||0;
    if(holder.instance.runtimeFlags.resolvedEntryEffectSerial===entrySerial)return;
    holder.instance.runtimeFlags.resolvedEntryEffectSerial=entrySerial;
    if(holder.instance.faceDown)return;
    var entryEvent={cause:Object.assign({},holder.instance.runtimeFlags.fieldEntryCause||{}),fieldEntrySerial:entrySerial,printedCost:definition.cost,printedName:definition.name};
    var entrySuppressed=state.playerOrder.some(function(playerId){return state.player(playerId).field.some(function(source){
      return hasPassiveEffect(state,source,'SUPPRESS_ENTER_FIELD_TRAITS');
    });});
    var entryTriggers=[];
    var entryCause=holder.instance.runtimeFlags.fieldEntryCause;
    if(entryCause&&entryCause.kind==='SPELL')state.playerOrder.forEach(function(pid){
      if(pid===holder.playerId)return;
      state.player(pid).field.forEach(function(host){
        if(host.faceDown)return;
        (host.attachments||[]).forEach(function(attachment){
          var attachmentDef=getCardDefinition(attachment.cardId);
          if((attachmentDef&&attachmentDef.enhancementEffects||[]).some(function(effect){return effect.type==='PROHIBIT_OPPONENT_SPELL_ENTRY_ATTACK_THIS_TURN';}))entryTriggers.push({playerId:pid,label:attachmentDef.name,continuation:{type:'APPLY_FIELD_ENTRY_ATTACK_RESTRICTION',targetInstanceId:instanceId,fieldEntrySerial:holder.instance.runtimeFlags.fieldEntrySerial||0,turnNumber:state.turnNumber,sourceInstanceId:attachment.instanceId}});
        });
      });
    });
    if(!entrySuppressed)state.player(holder.playerId).field.forEach(function(watcher){
      if(watcher.instanceId===instanceId||watcher.faceDown||watcher.runtimeFlags&&watcher.runtimeFlags.suppressKeywordSkills||areInsectKeywordSkillsSuppressed(state,watcher))return;
      var watcherDef=getCardDefinition(watcher.cardId);
      (watcherDef&&watcherDef.passiveAbilities||[]).filter(function(ability){return ability.timing==='ON_OTHER_OWN_INSECT_ENTER';}).forEach(function(ability){
        (ability.effects||[]).forEach(function(effect){if(effect.type==='DESTROY_SELF')entryTriggers.push({playerId:holder.playerId,label:watcherDef.name+'〈'+ability.name+'〉',continuation:{type:'DESTROY_ENTRY_WATCHER',sourceInstanceId:watcher.instanceId,fieldEntrySerial:watcher.runtimeFlags.fieldEntrySerial||0}});});
      });
    });
    var hasEntryWatchers=entryTriggers.length>0;
    if(!entrySuppressed&&!(holder.instance.runtimeFlags&&holder.instance.runtimeFlags.suppressKeywordSkills)&&!areInsectKeywordSkillsSuppressed(state,holder.instance)){
      (definition.passiveAbilities||[]).filter(function(ability){return ability.timing==='ON_ENTER_FIELD';}).forEach(function(ability){
        entryTriggers.push({playerId:holder.playerId,label:definition.name+'〈'+ability.name+'〉',continuation:{type:'SEQUENCE',steps:(ability.effects||[]).map(function(effect){return {type:'FIELD_ENTRY_EFFECT',playerId:holder.playerId,sourceInstanceId:instanceId,optional:!!ability.optional,entryEvent:entryEvent,effect:effect};})}});
      });
    }
    if(hasEntryWatchers)resumeAfterSelection(state,{type:'ORDER_TRIGGER_CONTINUATIONS',steps:entryTriggers});
    else entryTriggers.forEach(function(trigger){resumeAfterSelection(state,trigger.continuation);});
  }

  function insectCards(cards) {
    return (cards || []).filter(function (card) { var def = getCardDefinition(card.cardId); return !card.faceDown && def && def.type === CardTypes.INSECT; });
  }

  function collectFieldAbilityActions(state, playerId, sourceInstanceId, allowPending) {
    if ((!allowPending && state.pendingEffect) || state.activePlayerId !== playerId || state.phase !== Phases.MAIN_PHASE) { return []; }
    var source = findInZone(state, playerId, ZONES.FIELD, sourceInstanceId);
    if (!source || source.faceDown || source.runtimeFlags && source.runtimeFlags.suppressKeywordSkills || areInsectKeywordSkillsSuppressed(state, source)) { return []; }
    var definition = getCardDefinition(source.cardId);
    if (!definition || !definition.isPlayable()) { return []; }
    var actions = [];
    (definition.passiveAbilities || []).forEach(function(ability, index) {
      if (ability.timing !== 'ACTIVATED_FIELD' || (ability.effects || []).length !== 1) { return; }
      var effect = ability.effects[0];
      if (effect.type !== 'DEPLOY_MATCHING_HAND_INSECT') { return; }
      var candidates = state.player(playerId).hand.filter(function(card) {
        var d = getCardDefinition(card.cardId);
        return !card.faceDown && d && d.type === CardTypes.INSECT && d.isPlayable() && d.name === definition.name;
      });
      if (candidates.length) { actions.push({abilityIndex:index,label:ability.name,candidateIds:candidates.map(function(card) { return card.instanceId; })}); }
    });
    return actions;
  }

  function getFieldAbilityActions(state, playerId, sourceInstanceId) {
    return collectFieldAbilityActions(state, playerId, sourceInstanceId, false);
  }

  function activateFieldAbility(state, playerId, sourceInstanceId, abilityIndex) {
    assertNoPendingEffect(state);
    var action = getFieldAbilityActions(state, playerId, sourceInstanceId).find(function(item) { return item.abilityIndex === abilityIndex; });
    if (!action) { throw new Error('現在使用できる場の特性ではありません'); }
    var source = findInZone(state, playerId, ZONES.FIELD, sourceInstanceId);
    return createCardSelection(state, {playerId:playerId,options:action.candidateIds,minSelections:0,maxSelections:1,
      candidateZones:[ZONES.HAND],selectionPurpose:'ACTIVATED_FIELD_DEPLOY',continuation:{type:'DEPLOY_FROM_FIELD_ABILITY',
        sourceInstanceId:sourceInstanceId,abilityIndex:abilityIndex,sourceFieldEntrySerial:source.runtimeFlags.fieldEntrySerial||0,turnNumber:state.turnNumber}});
  }

  function getPendingFieldAbilityCandidates(state, pending) {
    pending = pending || state.pendingEffect;
    var continuation = pending && pending.continuation;
    if (!continuation || continuation.type !== 'DEPLOY_FROM_FIELD_ABILITY') { return null; }
    var source = findInZone(state, pending.playerId, ZONES.FIELD, continuation.sourceInstanceId);
    if (!source || (source.runtimeFlags.fieldEntrySerial||0) !== continuation.sourceFieldEntrySerial || state.turnNumber !== continuation.turnNumber) { return []; }
    var action = collectFieldAbilityActions(state, pending.playerId, continuation.sourceInstanceId, true).find(function(item) { return item.abilityIndex === continuation.abilityIndex; });
    return action ? action.candidateIds.filter(function(id) { return pending.options.indexOf(id) !== -1; }) : [];
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
      selectionAtMostOneGroups:(spec.selectionAtMostOneGroups||[]).map(function(group){return group.slice();}),
      selectionGroups: (spec.selectionGroups || []).map(function(group){return group.slice();}),
      selectionPartitions: (spec.selectionPartitions || []).map(function(group){return group.slice();}),
      allowedCombinations: (spec.allowedCombinations || []).map(function(group) { return group.slice(); }),
      selectionPurpose: spec.selectionPurpose || 'CARD_SELECTION', continuation: spec.continuation || null,
      firstSelectionOptions:spec.firstSelectionOptions==null?null:spec.firstSelectionOptions.slice(),
      hiddenSelection: !!spec.hiddenSelection
    };
    return state.pendingEffect;
  }

  function suppressTerritoryFollowup(work,sourceInstanceId,fieldEntrySerial){
    if(!work)return false;
    var context=work.type==='DESTROYED_TERRITORY_FOLLOWUP'?work.context:work.type==='DESTROYED_CARD_FOLLOWUP'?work:null;
    if(context&&context.destroyedCard&&(!sourceInstanceId||context.destroyedCard.instanceId===sourceInstanceId)&&(fieldEntrySerial==null||(context.destroyedCard.runtimeFlags&&context.destroyedCard.runtimeFlags.fieldEntrySerial||0)===fieldEntrySerial)){
      context.skipTerritoryDraw=true;return true;
    }
    var steps=work.steps||[];for(var i=0;i<steps.length;i++)if(suppressTerritoryFollowup(steps[i],sourceInstanceId,fieldEntrySerial))return true;
    return suppressTerritoryFollowup(work.afterResolution,sourceInstanceId,fieldEntrySerial);
  }

  function resolveChoiceSelection(state, playerId, value) {
    var pending = state.pendingEffect;
    if (!pending || pending.type !== 'CHOICE_SELECTION' || pending.playerId !== playerId) {
      throw new Error('選択待ちではありません');
    }
    if (!pending.options.some(function(option) { return option.value === value; })) { throw new Error('選択肢が不正です'); }
    var continuation = pending.continuation;
    if (!continuation) { throw new Error('未対応の選択継続です'); }
    if(continuation.type==='ORDER_TRIGGER_CONTINUATIONS'){
      var orderedSteps=continuation.steps.slice(),chosenTrigger=orderedSteps.splice(Number(value),1)[0];
      if(!isTriggerStepEligible(chosenTrigger,continuation.steps))throw new Error('先に解決する必要がある誘発が残っています');
      state.pendingEffect=null;
      resumeAfterSelection(state,{type:'SEQUENCE',steps:[chosenTrigger.continuation,{type:'ORDER_TRIGGER_CONTINUATIONS',steps:orderedSteps}]});
      resumeAfterSelection(state,pending.afterResolution);return;
    } else if(continuation.type==='ENHANCEMENT_FOOD_PAYMENT_COUNT'){
      if(value==='CANCEL'){cancelPendingEnhancementPayment(state,playerId);return;}
      var paymentSource=findInZone(state,playerId,ZONES.HAND,continuation.sourceInstanceId),paymentDef=paymentSource&&getCardDefinition(paymentSource.cardId),paymentCount=Number(value),paymentFood=state.player(playerId).food.filter(function(card){return !card.faceDown;});
      if(!paymentDef||!getEnhancementTargetCandidates(state,playerId,paymentSource.instanceId).some(function(card){return card.instanceId===continuation.targetInstanceId;})||paymentFood.length<paymentCount||getEffectiveCardCost(state,playerId,paymentDef,{targetInstanceId:continuation.targetInstanceId,foodPaymentCount:paymentCount})>state.player(playerId).availableCost)throw new Error('支払い条件が変化しました');
      state.pendingEffect=null;
      if(!paymentCount)useEnhancement(state,playerId,paymentSource.instanceId,continuation.targetInstanceId,continuation.chosenColor,{foodPaymentIds:[]});
      else createCardSelection(state,{playerId:playerId,options:paymentFood.map(function(card){return card.instanceId;}),exactSelections:paymentCount,candidateZones:[ZONES.FOOD],selectionPurpose:'ENHANCEMENT_FOOD_PAYMENT',continuation:{type:'ENHANCEMENT_FOOD_PAYMENT_CARDS',sourceInstanceId:paymentSource.instanceId,targetInstanceId:continuation.targetInstanceId,chosenColor:continuation.chosenColor}});
      resumeAfterSelection(state,pending.afterResolution);return;
    } else if(continuation.type==='USE_SPELL_VARIABLE_COST'){
      var paid=Number(value);state.pendingEffect=null;return useSpell(state,playerId,continuation.sourceInstanceId,continuation.targetInstanceId,{variablePayment:paid});
    } else if(continuation.type==='USE_SPELL_PAYMENT_METHOD'){
      state.pendingEffect=null;return useSpell(state,playerId,continuation.sourceInstanceId,continuation.targetInstanceId,{paymentMode:value});
    } else if(continuation.type==='SUPPRESS_DESTROYED_TERRITORY'){
      if(value==='SUPPRESS')suppressTerritoryFollowup(pending.afterResolution,continuation.sourceInstanceId,continuation.fieldEntrySerial);
    } else if(continuation.type==='SET_SELF_COLOR'){
      var holder = findAnywhere(state, continuation.sourceInstanceId);
      if (value !== 'DECLINE' && holder && holder.zone === ZONES.FIELD) {
        holder.instance.runtimeFlags = holder.instance.runtimeFlags || {};
        holder.instance.runtimeFlags.colorOverride = value;
        holder.instance.runtimeFlags.colorOverrideUntil = 'UNTIL_END_OF_TURN';
      }
    } else if(continuation.type==='SET_OWN_FOOD_COLOR'){
      if(value!=='DECLINE'){state.player(continuation.playerId).food.forEach(function(food){if(!food.faceDown){food.runtimeFlags=food.runtimeFlags||{};food.runtimeFlags.colorOverride=value;food.runtimeFlags.colorOverrideUntilTurn=continuation.endTurn;}});}
    } else if(continuation.type==='ROUTE_DRAWN_TERRITORY_CARD'){
      var routedCard=findInZone(state,continuation.playerId,ZONES.RESOLVING,continuation.sourceInstanceId);
      if(!routedCard)throw new Error('引いた縄張りが解決領域にありません');
      finalizeTerritoryDraw(state,continuation.playerId,routedCard,value);
      if(value===ZONES.TERRITORY&&continuation.route){
        routedCard.runtimeFlags=routedCard.runtimeFlags||{};
        if(continuation.route.replaceNextTerritoryDraw)routedCard.runtimeFlags.replaceNextTerritoryDraw=true;
        if(continuation.route.discardAtEndTurn)routedCard.runtimeFlags.discardTerritoryAtEndTurn=state.turnNumber;
      }
    } else if(continuation.type==='CONCEAL_FOOD_BY_COLOR'){
      continuation.playerIds.forEach(function(pid){state.player(pid).food.forEach(function(food){
        if(food.faceDown)return;
        var foodDefinition=getCardDefinition(food.cardId);
        if(foodDefinition&&foodDefinition.type===CardTypes.INSECT&&getEffectiveColor(food)===value)food.faceDown=true;
      });});
    } else if(continuation.type==='CHOOSE_ATTACK_KILL_ORDER'){
      state.pendingEffect=null;
      var remainingKillEffects=continuation.effects.slice(),chosenKillIndex=remainingKillEffects.findIndex(function(job){return job.value===value;}),chosenKillEffect=remainingKillEffects.splice(chosenKillIndex,1)[0];
      resolveAttackKillEffect(state,continuation.context,chosenKillEffect);
      resumeAfterSelection(state,{type:'ORDER_ATTACK_KILL_EFFECTS',context:continuation.context,effects:remainingKillEffects});
      resumeAfterSelection(state,pending.afterResolution);return;
    } else if(continuation.type==='RESOLVE_SIMULTANEOUS_ATTACK_KILL'){
      state.pendingEffect=null;
      var simultaneousContext=continuation.context;
      simultaneousContext.simultaneousAttackKillResolved=true;
      if(value==='CAPTURE_FIRST'){
        applyCaptureDestroyedCard(state,simultaneousContext);
      }else{
        applyBottomDeckDestroyedCard(state,simultaneousContext);
      }
      finishDestroyedCard(state,simultaneousContext);
      return;
    } else {
      throw new Error('未対応の選択継続です');
    }
    state.pendingEffect = null;
    resumeAfterSelection(state, pending.afterResolution);
  }

  function isTriggerStepEligible(step,steps){return !(step.dependsOn||[]).some(function(dependency){return steps.some(function(other){return other.triggerId===dependency;});});}

  function resolveCardSelection(state, playerId, instanceIds, finish) {
    var pending = state.pendingEffect;
    if (!pending || pending.type !== 'CARD_SELECTION' || pending.playerId !== playerId) { throw new Error('カード選択待ちではありません'); }
    var ids = Array.isArray(instanceIds) ? instanceIds.slice() : [instanceIds];
    var unique = [];
    ids.forEach(function (id) { if (pending.options.indexOf(id) === -1) throw new Error('選択対象外のカードです'); if (unique.indexOf(id) !== -1) throw new Error('同じカードを重複選択できません'); unique.push(id); });
    if(unique.length&&pending.firstSelectionOptions&&pending.firstSelectionOptions.indexOf(unique[0])===-1)throw new Error('最初に使用できるカードを選択してください');
    var mustFinish = finish !== false;
    var currentSelectionConstraints=getPendingEntrySelectionConstraints(state,pending),selectionBounds=currentSelectionConstraints&&currentSelectionConstraints.selectionBounds||pending;
    if (unique.length > selectionBounds.maxSelections) { throw new Error('選択枚数が上限を超えています'); }
    if (mustFinish && unique.length < selectionBounds.minSelections) { throw new Error('必要な枚数を選択してください'); }
    if(mustFinish&&pending.selectionPartitions&&pending.selectionPartitions.length&&!pending.selectionPartitions.some(function(group){return unique.every(function(id){return group.indexOf(id)!==-1;});}))throw new Error('同じ条件のカードを選択してください');
    if (mustFinish && pending.selectionGroups.length && pending.selectionGroups.some(function(group){return !unique.some(function(id){return group.indexOf(id)!==-1;});})) { throw new Error('各対象グループから選択してください'); }
    if (mustFinish && pending.allowedCombinations && pending.allowedCombinations.length && !pending.allowedCombinations.some(function(group) {
      return group.length === unique.length && group.every(function(id) { return unique.indexOf(id) !== -1; });
    })) { throw new Error('対応するカードの組み合わせを選択してください'); }
    var entryConstraints=getPendingEntrySelectionConstraints(state,pending);
    if((entryConstraints?entryConstraints.atMostOneGroups:pending.selectionAtMostOneGroups||[]).some(function(group){return unique.filter(function(id){return group.indexOf(id)!==-1;}).length>1;}))throw new Error('各グループから1枚まで選択してください');
    var previousSelectedIds=pending.selectedIds;
    pending.selectedIds = unique;
    if (!mustFinish) { return pending; }
    state.pendingEffect = null;
    try {
      var resolved = resolveSelectionContinuation(state, pending, unique);
      resumeAfterSelection(state, pending.afterResolution);
      return resolved;
    }
    catch (err) { pending.selectedIds=previousSelectedIds;state.pendingEffect = pending; throw err; }
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
    if(c.type==='TARGET_ATTACHMENT_OPERATION'){
      if(!ids.length)return;
      var selectedTargetAttachment=findAttachment(state,ids[0]);
      if(!selectedTargetAttachment||selectedTargetAttachment.playerId!==c.targetPlayerId||selectedTargetAttachment.host.instanceId!==c.targetInstanceId||(selectedTargetAttachment.host.runtimeFlags.fieldEntrySerial||0)!==c.fieldEntrySerial)throw new Error('強化対象が変化しました');
      if(c.operation==='DESTROY')return destroyAttachedEnhancement(state,selectedTargetAttachment);
      if(c.operation!=='RETURN')throw new Error('強化操作が不正です');
      var priorTargetMax=calculateMaxHp(selectedTargetAttachment.host,state),returnedTargetAttachment=selectedTargetAttachment.instance;
      selectedTargetAttachment.host.attachments.splice(selectedTargetAttachment.index,1);
      returnedTargetAttachment.zone=ZONES.HAND;returnedTargetAttachment.controllerId=returnedTargetAttachment.ownerId;returnedTargetAttachment.faceDown=false;
      state.player(returnedTargetAttachment.ownerId).hand.push(returnedTargetAttachment);
      preserveDamageAfterMaxHpChange(state,selectedTargetAttachment.host,priorTargetMax);return returnedTargetAttachment;
    }
    if (c.type === 'DEPLOY_FROM_FIELD_ABILITY') {
      if (!ids.length) { return; }
      var currentCandidates = getPendingFieldAbilityCandidates(state, pending);
      if (ids.length !== 1 || currentCandidates.indexOf(ids[0]) === -1) { throw new Error('場の特性の使用元または手札の対象が不正です'); }
      var source = findInZone(state, pending.playerId, ZONES.FIELD, c.sourceInstanceId);
      var ability = getCardDefinition(source.cardId).passiveAbilities[c.abilityIndex], flags = {fieldEntryCause:{kind:'ABILITY',sourceInstanceId:c.sourceInstanceId}};
      if (ability.effects[0].prohibitAttackThisTurn) { flags.attackRestrictions = [{startTurn:state.turnNumber,endTurn:state.turnNumber,whileSourceOnField:false}]; }
      resumeAfterSelection(state, {type:'SERIAL_ZONE_MOVES',moves:[{instanceId:ids[0],sourcePlayerId:pending.playerId,playerId:pending.playerId,from:ZONES.HAND,to:ZONES.FIELD,runtimeFlags:flags}]});
      return;
    }
    if (c.type === 'RESOLVE_ENTRY_OFFERING') {
      if (!ids.length) {
        var decliningSource = findInZone(state,c.playerId,ZONES.FIELD,c.sourceInstanceId);
        if (decliningSource) { destroyInsect(state,decliningSource.instanceId,'ABILITY',decliningSource.instanceId,null,{skipTerritoryDraw:true}); }
        return;
      }
      var offering = findInZone(state,c.playerId,c.from,ids[0]);
      var offeringDef = offering && getCardDefinition(offering.cardId);
      if (!offeringDef || (c.cardType && offeringDef.type !== c.cardType)) { throw new Error('供物にできる自分のカードを選んでください'); }
      return moveCard(state,offering.instanceId,c.from,c.to,{playerId:c.playerId});
    }
    if(c.type==='DEPLOY_ATTACK_MATCHING_FORM_SELECTED'){
      var formSelected=findInZone(state,c.playerId,ZONES.DISCARD,ids[0]),formDef=formSelected&&!formSelected.faceDown&&getCardDefinition(formSelected.cardId);
      if(formDef&&formDef.type===CardTypes.INSECT&&String(formDef.name).normalize('NFKC')===c.adultName)moveCard(state,formSelected.instanceId,ZONES.DISCARD,ZONES.FIELD,{playerId:c.playerId,faceDown:false,runtimeFlags:{fieldEntryCause:{kind:'ABILITY',sourceInstanceId:c.attack.attackerInstanceId,playerId:c.playerId}}});
      resumeAfterSelection(state,{type:'FINISH_FORM_ATTACK',attack:c.attack});return;
    }
    if (c.type === 'USE_ENHANCEMENT') { return useEnhancement(state, pending.playerId, c.sourceInstanceId, ids[0]); }
    if (c.type === 'USE_COPY_ENHANCEMENT') { return useEnhancement(state, pending.playerId, c.sourceInstanceId, c.targetInstanceId, null, {copySourceId:ids[0]}); }
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
    if(c.type==='FLIP_FOOD_DAMAGE'){
      var foodDamageTarget=findInZone(state,c.targetPlayerId,ZONES.FIELD,c.targetInstanceId);
      var validFoodTarget=foodDamageTarget&&!foodDamageTarget.faceDown&&(foodDamageTarget.runtimeFlags.fieldEntrySerial||0)===c.targetEntrySerial&&isSpellSelectionTargetLegal(state,pending.playerId,foodDamageTarget);
      if(!validFoodTarget){if(!ids.length)return;throw new Error('術の対象が場を離れています');}
      ids.forEach(function(id){var food=findInZone(state,pending.playerId,ZONES.FOOD,id);if(!food||food.faceDown)throw new Error('表向きの自分のエサを選んでください');});
      ids.forEach(function(id){findInZone(state,pending.playerId,ZONES.FOOD,id).faceDown=true;});
      var damageSource=findAnywhere(state,c.sourceInstanceId),amount=ids.length*c.perFood;
      applyDamage(state,damageSource&&damageSource.instance,foodDamageTarget,amount,'SPELL',c.sourceInstanceId,foodDamageTarget.instanceId,{effectId:'FLIP_FOOD_FOR_DAMAGE',multiplier:1,apVal:amount});return;
    }
    if (c.type === 'FLIP_SELECTED_FOOD') {
      ids.forEach(function(id) {
        var food = findInZone(state, c.targetPlayerId, ZONES.FOOD, id);
        if (!food || !!food.faceDown!==!!c.expectedFaceDown || (c.color&&getEffectiveColor(food)!==c.color) ||
            (c.cardType&&getCardDefinition(food.cardId).type!==c.cardType)) { throw new Error('現在の条件を満たすエサを選んでください'); }
      });
      var foodFollowUp=ids.length===1&&c.followUpIfColor&&getEffectiveColor(findInZone(state,c.targetPlayerId,ZONES.FOOD,ids[0]))===c.followUpIfColor;
      ids.forEach(function(id){findInZone(state,c.targetPlayerId,ZONES.FOOD,id).faceDown=c.targetFaceDown!==false;});
      if(foodFollowUp){
        var followUpFoods=state.player(c.targetPlayerId).food.filter(function(card){var definition=!card.faceDown&&getCardDefinition(card.cardId);return definition&&(!c.followUpColor||getEffectiveColor(card)===c.followUpColor)&&(!c.followUpCardType||definition.type===c.followUpCardType);});
        if(followUpFoods.length)createCardSelection(state,{playerId:pending.playerId,options:followUpFoods.map(function(card){return card.instanceId;}),minSelections:0,maxSelections:1,candidateZones:[ZONES.FOOD],selectionPurpose:'FLIP_FOLLOWUP_FOOD',continuation:{type:'FLIP_SELECTED_FOOD',targetPlayerId:c.targetPlayerId,expectedFaceDown:false,targetFaceDown:true,color:c.followUpColor,cardType:c.followUpCardType}});
      }
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
    if(c.type==='RESOLVE_ENTRY_SELECTION'){
      var legalEntries=getEntrySelectionCandidates(state,c.playerId,c.effect);
      if(ids.some(function(id){return !legalEntries.some(function(card){return card.instanceId===id;});}))throw new Error('登場時効果の対象が現在の条件を満たしません');
      if(c.effect.distinctColor){var selectedColors={};ids.forEach(function(id){var card=legalEntries.find(function(card){return card.instanceId===id;}),color=getEffectiveColor(card);if(selectedColors[color])throw new Error('同じ色の虫は1つまでです');selectedColors[color]=true;});}
      var entryTargetPlayer=c.effect.controller==='OPPONENT'?state.opponentOf(c.playerId):c.playerId;
      ids.forEach(function(id){var card=legalEntries.filter(function(candidate){return candidate.instanceId===id;})[0];
        if(c.effect.operation==='SET_FACE')card.faceDown=c.effect.targetFaceDown;
        else if(c.effect.operation==='STAT_MODIFIER')addStatModifier(state,card,{sourceInstanceId:c.sourceInstanceId,stat:c.effect.stat,amount:c.effect.amount});
        else if(c.effect.operation==='DESTROY')destroyInsect(state,id,'EFFECT',c.sourceInstanceId);
        else if(c.effect.operation==='MOVE')moveCard(state,id,c.effect.from,c.effect.to,{playerId:entryTargetPlayer,faceDown:c.effect.targetFaceDown,runtimeFlags:c.effect.to===ZONES.FIELD?{fieldEntryCause:c.effect.entryCause||{kind:'ABILITY',sourceInstanceId:c.sourceInstanceId,playerId:c.playerId}}:c.effect.suppressFoodCostThisTurn?{foodCostSuppressedTurn:state.turnNumber}:null});
        else throw new Error('未対応の登場時操作');
      });
      if(ids.length&&c.effect.sourceGrowth){var growHolder=findAnywhere(state,c.sourceInstanceId),growSource=growHolder&&growHolder.zone===ZONES.FIELD&&growHolder.instance;if(growSource&&(growSource.runtimeFlags.fieldEntrySerial||0)===c.effect.sourceEntrySerial)(c.effect.sourceGrowth.stats||[]).forEach(function(stat){addStatModifier(state,growSource,{sourceInstanceId:c.sourceInstanceId,stat:stat,amount:c.effect.sourceGrowth.amount,duration:'FIELD_STAY'});});}
      return ids;
    }
    if(c.type==='ENHANCEMENT_FOOD_PAYMENT_CARDS'){return useEnhancement(state,pending.playerId,c.sourceInstanceId,c.targetInstanceId,c.chosenColor,{foodPaymentIds:ids});}
    if(c.type==='CHAIN_ATTACHMENT'){
      if(!ids.length)return ids;
      var chainCard=findInZone(state,pending.playerId,ZONES.DISCARD,ids[0]),chainHost=findInZone(state,pending.playerId,ZONES.FIELD,c.hostInstanceId);
      if(!chainCard||chainCard.faceDown||getCardDefinition(chainCard.cardId).name!==c.name||!chainHost||(chainHost.runtimeFlags.fieldEntrySerial||0)!==c.fieldEntrySerial||!isForcedAttachmentHostLegal(state,pending.playerId,chainCard,chainHost))throw new Error('装着候補が変化しました');
      return attachExistingEnhancement(state,pending.playerId,chainCard,chainHost);
    }
    if (c.type === 'ENTRY_DAMAGE') {
      if (!ids.length) { return ids; }
      var sourceHolder=findAnywhere(state,c.sourceInstanceId);
      var target=findInZone(state,c.targetPlayerId,ZONES.FIELD,ids[0]);
      if (!target || target.faceDown) { throw new Error('表向きの相手虫を選んでください'); }
      applyDamage(state,sourceHolder&&sourceHolder.instance,target,c.amount,'EFFECT',c.sourceInstanceId,target.instanceId,{sourceControllerId:pending.playerId,suppressTerritoryDraw:!!c.suppressTerritoryDraw,effectId:'ENTRY_DAMAGE',multiplier:1,apVal:c.amount});
      return ids;
    }
    if (c.type === 'DISCARD_SELECTED_HAND') {
      ids.forEach(function(id){if(!findInZone(state,c.targetPlayerId,ZONES.HAND,id))throw new Error('手札のカードを選んでください');});
      ids.forEach(function(id){moveCard(state,id,ZONES.HAND,ZONES.DISCARD,{playerId:c.targetPlayerId});});
      return ids;
    }
    if(c.type==='ATTACK_WITH_ADDITIONAL_COST'){
      if (c.attackerFieldEntrySerial != null) {
        var costAttacker = findInZone(state, pending.playerId, ZONES.FIELD, c.attackerInstanceId);
        if (!costAttacker || (costAttacker.runtimeFlags.fieldEntrySerial||0) !== c.attackerFieldEntrySerial || state.turnNumber !== c.declaredTurnNumber) { throw new Error('追加コスト選択前の攻撃元が場を離れています'); }
      }
      if (c.targetFieldEntrySerial != null) {
        var costTarget = findInZone(state, c.targetPlayerId, ZONES.FIELD, c.targetInstanceId);
        if (!costTarget || (costTarget.runtimeFlags.fieldEntrySerial||0) !== c.targetFieldEntrySerial) { throw new Error('追加コスト選択前の攻撃対象が場を離れています'); }
      }
      return performAttack(state,c.attackerInstanceId,c.targetInstanceId,c.targetType,c.skillId,ids[0],{additionalCostSelected:true,
        additionalCostFoodIds:pending.selectionPurpose==='ATTACK_ADDITIONAL_COST_FOOD'?ids.slice():null});
    }
    if(c.type==='BLIND_ROUTE_SELECTED'){
      var blind=findInZone(state,c.targetPlayerId,ZONES.HAND,ids[0]);
      if(!blind){
        var remainingBlindHand=state.player(c.targetPlayerId).hand;
        if(remainingBlindHand.length){
          return createCardSelection(state,{playerId:pending.playerId,options:remainingBlindHand.map(function(card){return card.instanceId;}),exactSelections:1,candidateZones:[ZONES.HAND],selectionPurpose:'BLIND_OPPONENT_HAND',hiddenSelection:true,continuation:c});
        }
        return null;
      }
      var blindDef=getCardDefinition(blind.cardId),destination=blindDef&&blindDef.type===CardTypes.INSECT?ZONES.FIELD:ZONES.FOOD;
      resumeAfterSelection(state,{type:'SERIAL_ZONE_MOVES',moves:[{instanceId:blind.instanceId,sourcePlayerId:c.targetPlayerId,playerId:c.targetPlayerId,from:ZONES.HAND,to:destination}],afterResolution:{type:'ATTACK_AFTER_BLIND_ROUTE',attackerInstanceId:c.attackerInstanceId,targetInstanceId:c.targetInstanceId,targetType:c.targetType,skillId:c.skillId}});
      return blind;
    }
    if(c.type==='DESTROY_SELECTED_WITHOUT_TERRITORY'){
      ids.forEach(function(id){var target=findInZone(state,c.targetPlayerId,ZONES.FIELD,id);if(target&&!target.faceDown){destroyInsect(state,id,'EFFECT',c.sourceInstanceId,null,{skipTerritoryDraw:true});}});return ids;
    }
    if(c.type==='RESOLVE_SERIAL_SPELL_DAMAGE'){
      var source=findAnywhere(state,c.sourceInstanceId),definition=source&&getCardDefinition(source.instance.cardId);
      var legal=getSpellTargetsForDefinition(state,c.playerId,definition,c.sourceInstanceId);
      var selected=legal.filter(function(card){return card.instanceId===ids[0];})[0];
      if(!selected)throw new Error('連続ダメージの対象が不正です');
      applyDamage(state,source.instance,selected,c.amount,'SPELL',c.sourceInstanceId,selected.instanceId,{effectId:'SERIAL_SPELL_DAMAGE',multiplier:1,apVal:c.amount});return ids;
    }
    if(c.type==='DAMAGE_SELECTED'){
      ids.forEach(function(id){var target=findInZone(state,c.targetPlayerId,ZONES.FIELD,id);if(!target||target.faceDown)throw new Error('ダメージ対象が不正です');applyDamage(state,null,target,c.amount,'SPELL',c.sourceInstanceId,id,{effectId:c.effectType||'DAMAGE_SELECTED',multiplier:1,apVal:c.amount});});return ids;
    }
    if(c.type==='MOVE_DISCARD_TO_BOTTOM_DECK'){
      ids.forEach(function(id){var card=findInZone(state,c.targetPlayerId,ZONES.DISCARD,id);if(!card||(c.cardType&&(card.faceDown||getCardDefinition(card.cardId).type!==c.cardType)))throw new Error('捨て札のカードを選んでください');moveCard(state,id,ZONES.DISCARD,ZONES.DECK,{playerId:c.targetPlayerId,faceDown:c.faceDown!==false});});return ids;
    }
    if(c.type==='RETURN_DESTROYED_HOST_ATTACHMENT'){
      var returnedIds=pending.selectedIds||[],returnedAttachment=returnedIds.length&&findAnywhere(state,returnedIds[0]);
      if(returnedIds.length&&(!returnedAttachment||returnedAttachment.zone!==ZONES.DISCARD||(c.attachmentIds||[]).indexOf(returnedIds[0])===-1))throw new Error('戻す強化カードがありません');
      if(returnedAttachment)moveCard(state,returnedAttachment.instance.instanceId,ZONES.DISCARD,ZONES.HAND,{playerId:returnedAttachment.instance.ownerId});
      return;
    }
    if(c.type==='MOVE_DISCARD_TO_HAND'){
      ids.forEach(function(id){var card=findInZone(state,c.targetPlayerId,ZONES.DISCARD,id);if(!card)throw new Error('捨て札のカードを選んでください');moveCard(state,id,ZONES.DISCARD,ZONES.HAND,{playerId:c.targetPlayerId});});return ids;
    }
    if(c.type==='ATTACH_FOOD_ENHANCEMENT_TO_HOST'){
      if(!ids.length){resumeAfterSelection(state,{type:'ATTACH_FOOD_ENHANCEMENTS_SEQUENCE',playerId:pending.playerId,attachmentIds:(c.remainingAttachmentIds||[]).slice(),selectedHosts:c.selectedHosts||[]});return;}
      var foodAttachment=findInZone(state,pending.playerId,ZONES.FOOD,c.attachmentInstanceId),host=findInZone(state,pending.playerId,ZONES.FIELD,ids[0]);
      if(!foodAttachment||foodAttachment.faceDown||!host||!isForcedAttachmentHostLegal(state,pending.playerId,foodAttachment,host))throw new Error('強化の装着対象が不正です');
      var declaredAttachmentHosts=c.selectedHosts;
      if(!declaredAttachmentHosts){
        declaredAttachmentHosts=ids.map(function(hostId){var target=findInZone(state,pending.playerId,ZONES.FIELD,hostId);if(!target||target.faceDown||!isSpellSelectionTargetLegal(state,pending.playerId,target))throw new Error('術の対象にできない虫です');return {instanceId:hostId,fieldEntrySerial:target.runtimeFlags.fieldEntrySerial||0};});
      }else if(!declaredAttachmentHosts.some(function(target){return target.instanceId===host.instanceId&&(host.runtimeFlags.fieldEntrySerial||0)===target.fieldEntrySerial;}))throw new Error('最初に選んだ虫を指定してください');
      var foodDef=getCardDefinition(foodAttachment.cardId),foodCopy=(foodDef.enhancementEffects||[]).some(function(effect){return effect.type==='COPY_ENHANCEMENT_STATS_TRACK_SOURCE';});
      if(foodCopy){
        var forcedSources=getOwnAttachments(state,pending.playerId,foodAttachment.instanceId);
        createCardSelection(state,{playerId:pending.playerId,options:forcedSources.map(function(source){return source.instanceId;}),exactSelections:1,candidateZones:['ATTACHMENT'],selectionPurpose:'COPY_ENHANCEMENT_SOURCE',continuation:{type:'ATTACH_FORCED_COPY_SOURCE',attachmentInstanceId:foodAttachment.instanceId,hostInstanceId:host.instanceId,afterResolution:{type:'ATTACH_FOOD_ENHANCEMENTS_SEQUENCE',playerId:pending.playerId,attachmentIds:(c.remainingAttachmentIds||[]).slice(),selectedHosts:declaredAttachmentHosts}}});return foodAttachment;
      }
      attachExistingEnhancement(state,pending.playerId,foodAttachment,host,{forced:true,afterResolution:{type:'ATTACH_FOOD_ENHANCEMENTS_SEQUENCE',playerId:pending.playerId,attachmentIds:(c.remainingAttachmentIds||[]).slice(),selectedHosts:declaredAttachmentHosts}});return foodAttachment;
    }
    if(c.type==='RESELECT_TRANSFERRED_COPY'){
      var transferred=findAttachment(state,c.attachmentInstanceId),copySource=findAttachment(state,ids[0]);
      if(!transferred||!copySource||copySource.playerId!==pending.playerId||copySource.instance.instanceId===transferred.instance.instanceId)throw new Error('コピー元の強化カードが不正です');
      var transferCopyMax=calculateMaxHp(transferred.host,state);
      setCopiedEnhancementSource(transferred.instance,copySource.instance);
      preserveDamageAfterMaxHpChange(state,transferred.host,transferCopyMax);
      return transferred.instance;
    }
    if(c.type==='ATTACH_FORCED_COPY_SOURCE'){
      var forced=findInZone(state,pending.playerId,ZONES.FOOD,c.attachmentInstanceId),forcedHost=findInZone(state,pending.playerId,ZONES.FIELD,c.hostInstanceId),forcedSource=findAttachment(state,ids[0]);
      if(!forced||!forcedHost||!forcedSource||forcedSource.playerId!==pending.playerId)throw new Error('コピー強化の装着対象が不正です');
      attachExistingEnhancement(state,pending.playerId,forced,forcedHost,{forced:true,copySource:forcedSource.instance});
      resumeAfterSelection(state,c.afterResolution);return forced;
    }
    if(c.type==='DESTROY_ENTRY_FOOD'){
      var entryFood=findInZone(state,c.playerId,ZONES.FOOD,ids[0]);
      if(!entryFood||entryFood.faceDown){throw new Error('表向きの自分のエサを選んでください');}
      moveCard(state,entryFood.instanceId,ZONES.FOOD,ZONES.DISCARD,{playerId:c.playerId});return entryFood;
    }
    if (c.type === 'USE_SPELL') { return useSpell(state, pending.playerId, c.sourceInstanceId, ids); }
    if (c.type === 'USE_SPELL_TERRITORY_PAYMENT') {
      return useSpell(state, pending.playerId, c.sourceInstanceId, c.targetInstanceId,
        { paymentMode:'TERRITORY', territoryPaymentIds:ids });
    }
    if(c.type==='DESTROY_ATTACHMENT_RESET_HOST'){
      var resetAttachment=findAttachment(state,ids[0]),resetTarget=findAnywhere(state,c.hostInstanceId);
      if(!resetAttachment||!resetTarget||resetTarget.zone!==ZONES.FIELD||resetAttachment.host!==resetTarget.instance||(resetTarget.instance.runtimeFlags.fieldEntrySerial||0)!==c.fieldEntrySerial)throw new Error('破壊する強化カードがありません');
      destroyAttachedEnhancement(state,resetAttachment);
      resumeAfterSelection(state,{type:'RESET_ATTACKED_HOST',hostInstanceId:c.hostInstanceId,fieldEntrySerial:c.fieldEntrySerial});return;
    }
    if(c.type==='ENTRY_CHOOSE_ATTACHMENT_HOST'){
      if(!ids.length)return;
      var chosenEntryAttachment=getEntryAttachAnyCandidates(state,pending.playerId,c.effect).find(function(card){return card.instanceId===ids[0];});
      if(!chosenEntryAttachment)throw new Error('装着できる強化カードがありません');
      var entryHosts=insectCards(state.player(pending.playerId).field).filter(function(host){return getEntryAttachmentCandidates(state,pending.playerId,host,c.effect).indexOf(chosenEntryAttachment)!==-1;});
      createCardSelection(state,{playerId:pending.playerId,options:entryHosts.map(function(host){return host.instanceId;}),minSelections:0,maxSelections:1,candidateZones:[ZONES.FIELD],selectionPurpose:'ENTRY_ATTACHMENT_HOST',continuation:{type:'ENTRY_ATTACH_TO_SELECTED_HOST',attachmentInstanceId:ids[0],effect:c.effect}});return;
    }
    if(c.type==='ENTRY_ATTACH_TO_SELECTED_HOST'){
      if(!ids.length)return;
      var chosenHost=findInZone(state,pending.playerId,ZONES.FIELD,ids[0]);
      var chosenAttachment=chosenHost&&getEntryAttachmentCandidates(state,pending.playerId,chosenHost,c.effect).find(function(card){return card.instanceId===c.attachmentInstanceId;});
      if(!chosenAttachment)throw new Error('強化カードまたは装着先が現在の条件を満たしません');
      return attachExistingEnhancement(state,pending.playerId,chosenAttachment,chosenHost,{entryEffect:c.effect});
    }
    if(c.type==='ENTRY_ATTACH_ENHANCEMENT'){
      if(!ids.length)return;
      var entryAttachmentHost=findInZone(state,pending.playerId,ZONES.FIELD,c.hostInstanceId);
      if(!entryAttachmentHost||(entryAttachmentHost.runtimeFlags.fieldEntrySerial||0)!==c.fieldEntrySerial)throw new Error('登場した虫が場にいません');
      var legalEntryAttachments=getEntryAttachmentCandidates(state,pending.playerId,entryAttachmentHost,c.effect);
      var entryAttachment=legalEntryAttachments.find(function(card){return card.instanceId===ids[0];});
      if(!entryAttachment)throw new Error('装着できる強化カードがありません');
      return attachExistingEnhancement(state,pending.playerId,entryAttachment,entryAttachmentHost,{entryEffect:c.effect});
    }
    if(c.type==='ATTACH_EXISTING_COPY'){
      var pendingAttachment=findAnywhere(state,c.attachmentInstanceId),pendingHost=findInZone(state,pending.playerId,ZONES.FIELD,c.hostInstanceId),copySource=findAttachment(state,ids[0]);
      if(!pendingAttachment||pendingAttachment.playerId!==pending.playerId||pendingAttachment.instance.controllerId!==pending.playerId||pendingAttachment.zone!==c.sourceZone||!pendingHost||(pendingHost.runtimeFlags.fieldEntrySerial||0)!==c.fieldEntrySerial||!copySource||copySource.playerId!==pending.playerId||!isEnhancementEligibleForForcedAttach(state,pending.playerId,pendingAttachment.instance))throw new Error('装着先またはコピー元がありません');
      if(c.entryEffect&&getEntryAttachmentCandidates(state,pending.playerId,pendingHost,c.entryEffect).indexOf(pendingAttachment.instance)===-1)throw new Error('登場時の装着条件を満たしません');
      return attachExistingEnhancement(state,pending.playerId,pendingAttachment.instance,pendingHost,{copySource:copySource.instance});
    }
    if(c.type==='ATTACH_TERRITORY_CARD'){
      var drawnAttachment=findInZone(state,pending.playerId,ZONES.RESOLVING,c.attachmentInstanceId);
      if(!drawnAttachment)throw new Error('縄張りから引いた強化カードがありません');
      if(!ids.length)return finalizeTerritoryDraw(state,pending.playerId,drawnAttachment,ZONES.HAND);
      var drawnHost=findInZone(state,pending.playerId,ZONES.FIELD,ids[0]);if(!drawnHost||drawnHost.faceDown)throw new Error('表向きの自分の虫を選んでください');
      return attachExistingEnhancement(state,pending.playerId,drawnAttachment,drawnHost);
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
            (c.printedCost != null && definition.cost !== c.printedCost) ||
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
    var selection = getRawComplexSpellSelection(state, playerId, sourceId, effect);
    if (!selection) { return null; }
    selection.options = selection.options.filter(function(card) { return isSpellSelectionTargetLegal(state, playerId, card); });
    var legalIds = selection.options.map(function(card) { return card.instanceId; });
    if (selection.allowedCombinations) {
      selection.allowedCombinations = selection.allowedCombinations.filter(function(pair) { return pair.every(function(id) { return legalIds.indexOf(id) !== -1; }); });
      // An empty constrained pair list must not become an unrestricted list of
      // cards. Remove candidates that no longer belong to a surviving pair.
      selection.options = selection.options.filter(function(card) { return selection.allowedCombinations.some(function(pair) { return pair.indexOf(card.instanceId) !== -1; }); });
      legalIds = selection.options.map(function(card) { return card.instanceId; });
    }
    if (selection.groups) { selection.groups = selection.groups.map(function(group) { return group.filter(function(id) { return legalIds.indexOf(id) !== -1; }); }); }
    return selection;
  }

  // Immunity belongs to a selected field insect, not cards in hidden/non-field
  // zones or attachments selected independently from their host.
  function isSpellSelectionTargetLegal(state, playerId, card) {
    var holder = findAnywhere(state, card.instanceId);
    if (!holder || holder.zone !== ZONES.FIELD) { return true; }
    if (hasPassiveEffect(state, card, 'SPELL_TARGET_IMMUNITY')) { return false; }
    return holder.playerId === playerId ||
      (!hasPassiveEffect(state, card, 'OPPONENT_SPELL_TARGET_IMMUNITY') &&
       !(card.runtimeFlags && card.runtimeFlags.opponentSpellImmunityUntilTurn >= state.turnNumber));
  }

  function getRawComplexSpellSelection(state, playerId, sourceId, effect) {
    var player = state.player(playerId), opponent = state.player(state.opponentOf(playerId));
    if(effect.type==='MOVE_SELECTED_ZONE_CARDS'){
      var movable=getPlayerZoneArray(state,playerId,effect.from).filter(function(card){
        if(card.faceDown||(effect.excludeSource&&card.instanceId===sourceId))return false;
        var d=getCardDefinition(card.cardId);
        return d&&(!effect.cardType||d.type===effect.cardType)&&(effect.printedCostMaximum==null||d.cost<=effect.printedCostMaximum)&&(!effect.nameSubstrings||effect.nameSubstrings.some(function(part){return d.name.indexOf(part)!==-1;}));
      });
      return {options:movable,exactSelections:effect.exactSelections,minSelections:effect.minSelections,maxSelections:effect.maxSelections,zones:[effect.from]};
    }
    if(effect.type==='REVIVE_MATCHING_LARVA'){
      var adultNames={};insectCards(player.field).forEach(function(card){var name=getCardDefinition(card.cardId).name;if(!name.endsWith('（幼虫）'))adultNames[name]=true;});
      var larvae=insectCards(player.discard).filter(function(card){var name=getCardDefinition(card.cardId).name;return name.endsWith('（幼虫）')&&adultNames[name.slice(0,-4)];});
      return {options:larvae,exactSelections:1,zones:[ZONES.DISCARD]};
    }
    if(effect.type==='EXCHANGE_OPPONENT_FIELD_FOOD'){
      var oppField=insectCards(opponent.field),oppFood=insectCards(opponent.food);
      return {options:oppField.concat(oppFood),groups:[oppField.map(function(c){return c.instanceId;}),oppFood.map(function(c){return c.instanceId;})],exactSelections:2,zones:[ZONES.FIELD,ZONES.FOOD]};
    }
    if(effect.type==='RETURN_OWN_FOOD_CARDS'){
      var returnable=player.food.filter(function(card){var d=!card.faceDown&&getCardDefinition(card.cardId);return d&&(!effect.cardType||d.type===effect.cardType);});
      return {options:returnable,minSelections:effect.minSelections,maxSelections:Math.min(effect.maxSelections,returnable.length),zones:[ZONES.FOOD]};
    }
    if(effect.type==='ATTACH_OWN_FOOD_ENHANCEMENTS'){
      var hosts=insectCards(player.field).filter(function(host){return isSpellSelectionTargetLegal(state,playerId,host);});
      var foodEnhancements=player.food.filter(function(card){return isEnhancementEligibleForForcedAttach(state,playerId,card)&&hosts.some(function(host){return isForcedAttachmentHostLegal(state,playerId,card,host);});});
      var firstAttachments=foodEnhancements.filter(function(card){var def=getCardDefinition(card.cardId);return !(def.enhancementEffects||[]).some(function(effect){return effect.type==='COPY_ENHANCEMENT_STATS_TRACK_SOURCE';})||getOwnAttachments(state,playerId,card.instanceId).length>0;});
      foodEnhancements=firstAttachments.concat(foodEnhancements.filter(function(card){return firstAttachments.indexOf(card)===-1;}));
      return {options:firstAttachments.length?foodEnhancements:[],firstSelectionOptions:firstAttachments.map(function(card){return card.instanceId;}),minSelections:effect.minSelections,maxSelections:Math.min(effect.maxSelections,foodEnhancements.length),zones:[ZONES.FOOD]};
    }
    if(effect.type==='DESTROY_OWN_ATTACHMENT_TO_MOVE_SELF'){
      return {options:getOwnAttachments(state,playerId),exactSelections:1,zones:['ATTACHMENT']};
    }
    if(effect.type==='DESTROY_ATTACHMENT_TO_RESET_ATTACK_HOST'){
      return {options:getSpellTargetCandidates(state,playerId,sourceId),exactSelections:1,zones:[ZONES.FIELD]};
    }
    if(effect.type==='DESTROY_OWN_ATTACHMENT_OPTIONAL_DAMAGE'){
      var ownAttachments=[];player.field.forEach(function(host){(host.attachments||[]).forEach(function(att){ownAttachments.push(att);});});
      return {options:ownAttachments,exactSelections:1,zones:['ATTACHMENT']};
    }
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
      food.forEach(function (card) { var d=getCardDefinition(card.cardId); (colors[d.color]||(colors[d.color]=[])).push(card.instanceId); });
      return { options:food,partitions:Object.keys(colors).map(function(color){return colors[color];}),minSelections: effect.minSelections, maxSelections: effect.maxSelections, zones:[ZONES.FOOD] };
    }
    if (effect.type === 'EXCHANGE_INSECTS') {
      var firstGroup=insectCards(player[effect.firstZone.toLowerCase()]), secondGroup=insectCards(player[effect.secondZone.toLowerCase()]);
      if(effect.requireSameCost){
        var exchangePairs=[];firstGroup.forEach(function(first){secondGroup.forEach(function(second){if(getCardDefinition(first.cardId).cost===getCardDefinition(second.cardId).cost)exchangePairs.push([first.instanceId,second.instanceId]);});});
        return {options:firstGroup.concat(secondGroup).filter(function(card){return exchangePairs.some(function(pair){return pair.indexOf(card.instanceId)!==-1;});}),exactSelections:2,allowedCombinations:exchangePairs,zones:[effect.firstZone,effect.secondZone]};
      }
      return { options:firstGroup.concat(secondGroup),groups:[firstGroup.map(function(c){return c.instanceId;}),secondGroup.map(function(c){return c.instanceId;})],exactSelections:2,zones:[effect.firstZone,effect.secondZone] };
    }
    if (effect.type === 'TRANSFER_OWN_ATTACHMENT') {
      var ownAtt=[]; player.field.forEach(function(host){(host.attachments||[]).forEach(function(att){ownAtt.push(att);});});
      var hosts=player.field.filter(function(card){return !card.faceDown;});
      var transferPairs=[];ownAtt.forEach(function(att){var holder=findAttachment(state,att.instanceId);hosts.forEach(function(host){if(canTransferExistingEnhancement(state,playerId,holder,host))transferPairs.push([att.instanceId,host.instanceId]);});});
      ownAtt=ownAtt.filter(function(att){return transferPairs.some(function(pair){return pair[0]===att.instanceId;});});hosts=hosts.filter(function(host){return transferPairs.some(function(pair){return pair[1]===host.instanceId;});});
      return { options:ownAtt.concat(hosts),groups:[ownAtt.map(function(c){return c.instanceId;}),hosts.map(function(c){return c.instanceId;})],allowedCombinations:transferPairs,exactSelections:2,zones:['ATTACHMENT',ZONES.FIELD] };
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
    return getSpellTargetsForDefinition(state,playerId,def,handInstanceId);
  }

  function getSpellTargetsForDefinition(state,playerId,def,handInstanceId) {
    if (!def || def.type !== CardTypes.SPELL) { return []; }
    var candidates = [];
    (def.cardEffects || []).forEach(function (effect) {
      if (!effect || (!effect.requiresTarget && effect.type !== 'DEAL_DAMAGE_TO_TARGET')) { return; }
      if (effect.target === 'OPPONENT_FIELD_INSECT') {
        candidates = state.player(state.opponentOf(playerId)).field.filter(function (card) {
          return !card.faceDown;
        });
      } else if(effect.target==='ANY_ATTACKED_ATTACHED_FIELD_INSECT'){
        candidates=[];state.playerOrder.forEach(function(pid){candidates=candidates.concat(state.player(pid).field.filter(function(card){return !card.faceDown&&card.attackedThisTurn&&(card.attachments||[]).length>0;}));});
      } else if(effect.target==='ANY_ATTACKED_FIELD_INSECT'){
        candidates=[];state.playerOrder.forEach(function(pid){candidates=candidates.concat(state.player(pid).field.filter(function(card){return !card.faceDown&&card.attackedThisTurn;}));});
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
      if(effect.requiredSkillNameSubstring){
        candidates=candidates.filter(function(card){
          var skills=getEffectiveAttackSkills(state,card),definition=getCardDefinition(card.cardId);
          if(!(card.runtimeFlags&&card.runtimeFlags.suppressKeywordSkills)&&!areInsectKeywordSkillsSuppressed(state,card)){
            skills=skills.concat((definition&&definition.skills||[]).filter(function(skill){return skill.timing!=='ATTACK';}),definition&&definition.passiveAbilities||[]);
          }
          return skills.some(function(skill){return typeof skill.name==='string'&&skill.name.indexOf(effect.requiredSkillNameSubstring)!==-1;});
        });
      }
    });
    if((def.cardEffects||[]).some(function(effect){return effect.printedCostPayment;})){var budget=state.player(playerId).availableCost-getEffectiveCardCost(state,playerId,def);candidates=candidates.filter(function(card){return getCardDefinition(card.cardId).cost<=budget;});}
    if((def.cardEffects||[]).some(function(effect){return effect.requireDestinationOwner;})){candidates=candidates.filter(function(card){var holder=findAnywhere(state,card.instanceId);return holder&&card.ownerId===holder.playerId;});}
    candidates=candidates.filter(function (card) {
      return isSpellSelectionTargetLegal(state, playerId, card);
    });
    var opponentLures=state.player(state.opponentOf(playerId)).field.filter(function(card){return hasCardOrAttachmentEffect(state,card,'FORCE_OPPONENT_SPELL_TARGET_TO_SELF_GROUP');});
    if(opponentLures.length&&candidates.some(function(card){return findAnywhere(state,card.instanceId).playerId!==playerId;})){
      candidates=candidates.filter(function(card){return opponentLures.indexOf(card)!==-1;});
    }
    return candidates;
  }

  function hasCardOrAttachmentEffect(state,card,type){
    if(!card||card.faceDown){return false;}
    if(hasPassiveEffect(state,card,type)){return true;}
    return (card.attachments||[]).some(function(attachment){var def=getCardDefinition(attachment.cardId);return (def&&def.enhancementEffects||[]).some(function(effect){return effect.type===type;});});
  }

  function hasPassiveEffect(state,card, type) {
    if (!card || card.faceDown) { return false; }
    if(card.runtimeFlags&&card.runtimeFlags.suppressKeywordSkills||areInsectKeywordSkillsSuppressed(state,card)){return false;}
    var def = getCardDefinition(card.cardId);
    return (def && def.passiveAbilities || []).some(function (ability) {
      return (ability.effects || []).some(function (effect) { return effect.type === type && (!effect.requiresAttachment || (card.attachments||[]).length>0); });
    });
  }

  function isOpponentSpellPreventedByEntryWindow(state,target,sourceType,sourceInstanceId){
    if(sourceType!=='SPELL'||!target||target.enteredFieldTurn==null)return false;
    if(!hasPassiveEffect(state,target,'PREVENT_OPPONENT_SPELL_DAMAGE_AND_DESTRUCTION'))return false;
    var targetHolder=findAnywhere(state,target.instanceId),sourceHolder=findAnywhere(state,sourceInstanceId);
    if(!targetHolder||!sourceHolder||targetHolder.playerId===sourceHolder.playerId)return false;
    var def=getCardDefinition(target.cardId);
    return (def.passiveAbilities||[]).some(function(ability){return (ability.effects||[]).some(function(effect){return effect.type==='PREVENT_OPPONENT_SPELL_DAMAGE_AND_DESTRUCTION'&&
      state.turnNumber===(effect.nextOpponentTurn ? target.runtimeFlags.nextOpponentTurnAfterEntry : target.enteredFieldTurn+effect.turnAfterEntry)&&
      (!effect.requiredFood || state.player(targetHolder.playerId).food.filter(function(food){return !food.faceDown && getEffectiveColor(food)===effect.requiredFood.color;}).length>=effect.requiredFood.minimum);});});
  }

  function getAttackMultiplier(state, attackerColor, defender) {
    if(defender.runtimeFlags&&defender.runtimeFlags.ignoreWeaknessTurn===state.turnNumber){return 1;}
    var ignoreWeakness = (defender.attachments || []).some(function (attachment) {
      var def = getCardDefinition(attachment.cardId);
      return (def && def.enhancementEffects || []).some(function (effect) { return effect.type === 'IGNORE_WEAKNESS'; });
    });
    return ignoreWeakness ? 1 : getAttributeMultiplier(attackerColor, getEffectiveColor(defender));
  }

  function spellEntryFlags(state,playerId,instance,extra){
    var flags={enteredBySpellTurn:state.turnNumber,fieldEntryCause:{kind:'SPELL',cardId:instance.cardId,instanceId:instance.instanceId,playerId:playerId}};
    Object.keys(extra||{}).forEach(function(key){flags[key]=extra[key];});return flags;
  }

  function resolveSpellEffects(state, playerId, instance, def, chosenTargetInstanceId, spellOptions) {
    spellOptions = spellOptions || {};
    var effects = def.cardEffects || [];
    var finalZone = ZONES.DISCARD;
    effects.forEach(function (effect) {
      if (!effect) { return; }
      // Targets were chosen before spell-use triggers. A departed/re-entered or
      // captured target cannot be replaced by a newly selected insect.
      if(spellOptions.committedTargetSnapshots&&(effect.requiresTarget||effect.type==='DEAL_DAMAGE_TO_TARGET'||['EXCHANGE_OPPONENT_FIELD_FOOD','EXCHANGE_INSECTS','EXCHANGE_MATCHING_FORM','DESTROY_OPPONENT_ATTACHMENT','TRANSFER_OWN_ATTACHMENT','DESTROY_OWN_ATTACHMENT_OPTIONAL_DAMAGE','DESTROY_OWN_ATTACHMENT_TO_MOVE_SELF'].indexOf(effect.type)!==-1)){
        var lostTarget=spellOptions.committedTargetSnapshots.some(function(snapshot){return !isCommittedSpellTargetCurrent(state,snapshot);});
        if(lostTarget)return;
      }
      if(effect.type==='SELF_TO_FOOD_WITH_COST'){
        moveCard(state,instance.instanceId,ZONES.RESOLVING,ZONES.FOOD,{playerId:playerId,faceDown:false});finalZone=ZONES.FOOD;state.player(playerId).availableCost+=effect.amount;
        resumeAfterSelection(state,{type:'FIELD_ENTRY_EFFECT',playerId:playerId,sourceInstanceId:instance.instanceId,optional:true,effect:{type:'SELECT_ON_ENTRY',from:ZONES.DISCARD,controller:'SELF',operation:'MOVE',to:ZONES.FOOD,targetFaceDown:true,suppressFoodCostThisTurn:true}});
      }
      if(effect.type==='FLIP_FOOD_FOR_DAMAGE'){
        var chosenFoodTarget=findInZone(state,state.opponentOf(playerId),ZONES.FIELD,chosenTargetInstanceId);
        if(!chosenFoodTarget||chosenFoodTarget.faceDown)throw new Error('相手の虫を選んでください');
        var faceUpFood=state.player(playerId).food.filter(function(food){return !food.faceDown;});
        createCardSelection(state,{playerId:playerId,options:faceUpFood.map(function(food){return food.instanceId;}),minSelections:0,maxSelections:faceUpFood.length,candidateZones:[ZONES.FOOD],selectionPurpose:'FLIP_FOOD_FOR_DAMAGE',continuation:{type:'FLIP_FOOD_DAMAGE',sourceInstanceId:instance.instanceId,targetInstanceId:chosenTargetInstanceId,targetPlayerId:state.opponentOf(playerId),targetEntrySerial:chosenFoodTarget.runtimeFlags.fieldEntrySerial||0,perFood:effect.perFood}});
      }
      if (effect.type === 'SUPPRESS_OPPONENT_TERRITORY_TRIGGER') {
        state.player(state.opponentOf(playerId)).territoryTriggerSuppressionUntilTurn = state.turnNumber;
      }
      var chosenIds = Array.isArray(chosenTargetInstanceId) ? chosenTargetInstanceId : (chosenTargetInstanceId ? [chosenTargetInstanceId] : []);
      if(effect.type==='PAID_FOOD_DEPLOY'){
        var paidFood=findInZone(state,playerId,ZONES.FOOD,chosenTargetInstanceId),paidDef=paidFood&&!paidFood.faceDown&&getCardDefinition(paidFood.cardId);
        if(!paidDef||paidDef.type!==CardTypes.INSECT||state.player(playerId).availableCost<paidDef.cost)return;
        state.player(playerId).availableCost-=paidDef.cost;finalZone=ZONES.FOOD;
        moveCard(state,paidFood.instanceId,ZONES.FOOD,ZONES.FIELD,{playerId:playerId,faceDown:false,runtimeFlags:spellEntryFlags(state,playerId,instance)});
      }
      if(effect.type==='DISCOUNT_NEXT_MATCHING_FORM'||effect.type==='GRANT_NEXT_USE_COST'){
        var discountedPlayer=state.player(playerId);
        discountedPlayer.nextUseCostModifiers=(discountedPlayer.nextUseCostModifiers||[]).concat([{cardType:effect.cardType||CardTypes.INSECT,sourceZone:effect.sourceZone,nameSuffix:effect.nameSuffix,amount:-effect.amount,endTurn:state.turnNumber,sourceInstanceId:instance.instanceId}]);
      }
      if(effect.type==='MOVE_SELECTED_ZONE_CARDS'){
        resumeAfterSelection(state,{type:'SERIAL_ZONE_MOVES',moves:chosenIds.map(function(id){return {instanceId:id,sourcePlayerId:playerId,playerId:playerId,from:effect.from,to:effect.to,faceDown:effect.faceDown,requireFaceUp:true,runtimeFlags:effect.to===ZONES.FIELD?spellEntryFlags(state,playerId,instance,effect.enteringCannotAttackThisTurn?{attackRestrictions:[{startTurn:state.turnNumber,endTurn:state.turnNumber,whileSourceOnField:false}]}:{}):effect.suppressFoodCostThisTurn?{foodCostSuppressedTurn:state.turnNumber}:null};})});
      }
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
        var dmg = effect.dynamicAmount&&effect.dynamicAmount.type==='OWN_FACE_DOWN_FOOD_COUNT'?state.player(playerId).food.filter(function(food){return food.faceDown;}).length*effect.dynamicAmount.multiplier:(effect.amount||0);
        var multiplier = effect.ignoreAttributeMultiplier ? 1 : getAttributeMultiplier(def.color || Attributes.COLORLESS, getEffectiveColor(target));
        var finalDmg = dmg * multiplier;
        applyDamage(state, instance, target, finalDmg, 'SPELL', instance.instanceId, target.instanceId, {
          effectId: effect.id || effect.type,
          multiplier: multiplier,
          apVal: dmg
        });
        if(effect.repeat)resumeAfterSelection(state,{type:'SERIAL_SPELL_DAMAGE',playerId:playerId,sourceInstanceId:instance.instanceId,amount:dmg,remaining:effect.repeat.additional,condition:effect.repeat.condition});
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
        if (!resetTarget || !getSpellTargetsForDefinition(state,playerId,{type:CardTypes.SPELL,cardEffects:[effect]},instance.instanceId).some(function(card){return card.instanceId===resetTarget.instance.instanceId;})) { return; }
        resetTarget.instance.attackedThisTurn = false;
        emitBattleEvent(state,'ATTACK_RESET',{playerId:playerId,sourceInstanceId:instance.instanceId,targetInstanceId:resetTarget.instance.instanceId});
        if (resetTarget.instance.runtimeFlags) { delete resetTarget.instance.runtimeFlags.continuousAttack; }
      }
      if (effect.type === 'MOVE_TARGET') {
        var moveTarget = chosenTargetInstanceId && findAnywhere(state, chosenTargetInstanceId);
        var movePlayerId=effect.controller==='OPPONENT'?state.opponentOf(playerId):playerId;
        if (!moveTarget || moveTarget.playerId !== movePlayerId || moveTarget.zone !== effect.from || (effect.requireDestinationOwner&&moveTarget.instance.ownerId!==movePlayerId)) { throw new Error('移動対象が正しいゾーンにありません'); }
        var moved = moveCard(state, chosenTargetInstanceId, effect.from, effect.to, { playerId: movePlayerId,faceDown:effect.faceDown,runtimeFlags:effect.to===ZONES.FIELD?spellEntryFlags(state,playerId,instance,effect.destroyAtEndTurn?{destroyAtEndTurn:state.turnNumber}:null):null });
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
      if(effect.type==='GRANT_OPPONENT_SPELL_IMMUNITY'){
        var immuneTarget=chosenTargetInstanceId&&findInZone(state,playerId,ZONES.FIELD,chosenTargetInstanceId);
        if(!immuneTarget||immuneTarget.faceDown)throw new Error('表向きの自分の虫を選んでください');
        immuneTarget.runtimeFlags=immuneTarget.runtimeFlags||{};immuneTarget.runtimeFlags.opponentSpellImmunityUntilTurn=state.turnNumber+(effect.endTurnOffset||0);
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
        var routed = moveCard(state, top.instanceId, ZONES.DECK, dest, { playerId: playerId, faceDown:false,runtimeFlags:dest===ZONES.FIELD?spellEntryFlags(state,playerId,instance,effect.destroyInsectAtEndTurn?{destroyAtEndTurn:state.turnNumber}:null):null });
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
              runtimeFlags: spellEntryFlags(state,playerId,instance,{ destroyAtEndTurn:effect.destroyAtEndTurn ? state.turnNumber : undefined })
            };
          })
        });
      }
      if(effect.type==='FLIP_OWN_FOOD_FACE_UP'){
        chosenIds.forEach(function(id){var food=findInZone(state,playerId,ZONES.FOOD,id);if(!food||!food.faceDown)throw new Error('裏向きの自分のエサを選んでください');food.faceDown=false;});
      }
      if(effect.type==='SUMMON_HAND_BY_FAMILY_SUFFIX'){
        var serial=chosenIds.map(function(id){var card=findInZone(state,playerId,ZONES.HAND,id),cardDef=card&&getCardDefinition(card.cardId);if(!cardDef||cardDef.type!==CardTypes.INSECT||!cardDef.tags.some(function(tag){return tag.slice(-effect.familySuffix.length)===effect.familySuffix;}))throw new Error('対象の科の虫を選んでください');var flags=spellEntryFlags(state,playerId,instance);if(effect.destroyAtEndTurn)flags.destroyAtEndTurn=state.turnNumber;return {instanceId:id,sourcePlayerId:playerId,playerId:playerId,from:ZONES.HAND,to:ZONES.FIELD,runtimeFlags:flags};});
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
        batchMoveCards(state,[{instanceId:first.instanceId,from:effect.firstZone,to:effect.secondZone,playerId:playerId,runtimeFlags:effect.secondZone===ZONES.FIELD?spellEntryFlags(state,playerId,instance):null},{instanceId:second.instanceId,from:effect.secondZone,to:effect.firstZone,playerId:playerId,runtimeFlags:effect.firstZone===ZONES.FIELD?spellEntryFlags(state,playerId,instance):null}]);
        first.currentHp=fd.baseHp; first.baseHp=fd.baseHp; first.attackedThisTurn=effect.enteringCannotAttackThisTurn===true;
      }
      if (effect.type === 'EXCHANGE_MATCHING_FORM') {
        var formSelection = getComplexSpellSelection(state, playerId, instance.instanceId, effect);
        var pair = formSelection.allowedCombinations.find(function(group) {
          return chosenIds.length === group.length && group.every(function(id) { return chosenIds.indexOf(id) !== -1; });
        });
        if (!pair) { throw new Error('対応するカードの組み合わせを選択してください'); }
        batchMoveCards(state, [
          { instanceId: pair[0], from: effect.firstZone, to: effect.firstDestination, playerId: playerId,runtimeFlags:effect.firstDestination===ZONES.FIELD?spellEntryFlags(state,playerId,instance):null },
          { instanceId: pair[1], from: effect.secondZone, to: effect.secondDestination, playerId: playerId,runtimeFlags:effect.secondDestination===ZONES.FIELD?spellEntryFlags(state,playerId,instance):null }
        ]);
      }
      if(effect.type==='REVIVE_MATCHING_LARVA'){
        var larva=findInZone(state,playerId,ZONES.DISCARD,chosenIds[0]);if(!larva)throw new Error('対応する幼虫を選択してください');
        resumeAfterSelection(state,{type:'SERIAL_ZONE_MOVES',moves:[{instanceId:larva.instanceId,sourcePlayerId:playerId,playerId:playerId,from:ZONES.DISCARD,to:ZONES.FIELD,runtimeFlags:spellEntryFlags(state,playerId,instance,{attackRestrictions:[{startTurn:state.turnNumber,endTurn:state.turnNumber,whileSourceOnField:false}]})}]});
      }
      if(effect.type==='EXCHANGE_OPPONENT_FIELD_FOOD'){
        var exchangeOpponentId=state.opponentOf(playerId),fieldCard=findInZone(state,exchangeOpponentId,ZONES.FIELD,chosenIds[0])||findInZone(state,exchangeOpponentId,ZONES.FIELD,chosenIds[1]),foodCard=findInZone(state,exchangeOpponentId,ZONES.FOOD,chosenIds[0])||findInZone(state,exchangeOpponentId,ZONES.FOOD,chosenIds[1]);
        if(!fieldCard||fieldCard.faceDown||!foodCard||foodCard.faceDown)throw new Error('相手の場とエサ場から虫を1つずつ選んでください');
        batchMoveCards(state,[{instanceId:fieldCard.instanceId,from:ZONES.FIELD,to:ZONES.FOOD,playerId:exchangeOpponentId},{instanceId:foodCard.instanceId,from:ZONES.FOOD,to:ZONES.FIELD,playerId:exchangeOpponentId,runtimeFlags:spellEntryFlags(state,playerId,instance)}]);
      }
      if(effect.type==='DESTROY_ALL_VISIBLE_INSECTS_END_TURN'){
        var allVisible=[];state.playerOrder.forEach(function(pid){state.player(pid).field.forEach(function(card){if(!card.faceDown)allVisible.push(card.instanceId);});});
        resumeAfterSelection(state,{type:'DESTROY_VISIBLE_SEQUENCE',instanceIds:allVisible,sourceInstanceId:instance.instanceId,afterResolution:{type:'END_ACTIVE_TURN'}});
      }
      if(effect.type==='RETURN_OWN_FOOD_CARDS'){
        chosenIds.forEach(function(id){var card=findInZone(state,playerId,ZONES.FOOD,id),cardDef=card&&getCardDefinition(card.cardId);if(!card||card.faceDown||(effect.cardType&&cardDef.type!==effect.cardType))throw new Error('エサ場の対象が不正です');moveCard(state,id,ZONES.FOOD,ZONES.HAND,{playerId:playerId});});
      }
      if(effect.type==='RETURN_OWN_FOOD_AND_SELF_TO_FOOD'){
        var returnedFood=findInZone(state,playerId,ZONES.FOOD,chosenTargetInstanceId);if(!returnedFood||returnedFood.faceDown)throw new Error('表向きの自分のエサを選んでください');moveCard(state,returnedFood.instanceId,ZONES.FOOD,ZONES.HAND,{playerId:playerId});finalZone=ZONES.FOOD;instance.runtimeFlags=instance.runtimeFlags||{};instance.runtimeFlags.foodCostSuppressedTurn=state.turnNumber;
      }
      if(effect.type==='ATTACH_OWN_FOOD_ENHANCEMENTS'){
        if(!chosenIds.length)throw new Error('装着する強化カードを選んでください');
        resumeAfterSelection(state,{type:'ATTACH_FOOD_ENHANCEMENTS_SEQUENCE',playerId:playerId,attachmentIds:chosenIds.slice()});
      }
      if(effect.type==='DAMAGE_AND_CHAIN_SAME_NAME'){
        var firstChain=findInZone(state,state.opponentOf(playerId),ZONES.FIELD,chosenTargetInstanceId);if(!firstChain||firstChain.faceDown)throw new Error('相手の虫を選んでください');
        var chainName=getCardDefinition(firstChain.cardId).name;applyDamage(state,instance,firstChain,effect.amount,'SPELL',instance.instanceId,firstChain.instanceId,{effectId:effect.type,multiplier:1,apVal:effect.amount});
        var chainCandidates=state.player(state.opponentOf(playerId)).field.filter(function(card){return !card.faceDown&&card.instanceId!==chosenTargetInstanceId&&getCardDefinition(card.cardId).name===chainName;});
        if(chainCandidates.length){createCardSelection(state,{playerId:playerId,options:chainCandidates.map(function(card){return card.instanceId;}),minSelections:0,maxSelections:1,candidateZones:[ZONES.FIELD],selectionPurpose:'CHAIN_SAME_NAME_DAMAGE',continuation:{type:'DAMAGE_SELECTED',targetPlayerId:state.opponentOf(playerId),sourceInstanceId:instance.instanceId,amount:effect.amount,effectType:effect.type}});}
      }
      if(effect.type==='DESTROY_OWN_ATTACHMENT_TO_MOVE_SELF'){
        var foodSacrifice=findAttachment(state,chosenIds[0]);
        if(!foodSacrifice||foodSacrifice.playerId!==playerId)throw new Error('自分の強化カードを選んでください');
        destroyAttachedEnhancement(state,foodSacrifice);
        finalZone=effect.to;
        if(effect.suppressFoodCostThisTurn)instance.runtimeFlags.foodCostSuppressedTurn=state.turnNumber;
      }
      if(effect.type==='DESTROY_ATTACHMENT_TO_RESET_ATTACK_HOST'){
        var resetHost=findAnywhere(state,chosenIds[0]);
        if(!resetHost||resetHost.zone!==ZONES.FIELD||resetHost.instance.faceDown||!resetHost.instance.attackedThisTurn||!resetHost.instance.attachments.length)throw new Error('攻撃済みの強化された虫を選んでください');
        createCardSelection(state,{playerId:playerId,options:resetHost.instance.attachments.map(function(att){return att.instanceId;}),exactSelections:1,candidateZones:['ATTACHMENT'],selectionPurpose:'RESET_HOST_ATTACHMENT',continuation:{type:'DESTROY_ATTACHMENT_RESET_HOST',hostInstanceId:resetHost.instance.instanceId,fieldEntrySerial:resetHost.instance.runtimeFlags.fieldEntrySerial||0}});
      }
      if(effect.type==='DESTROY_OWN_ATTACHMENT_OPTIONAL_DAMAGE'){
        var sacrifice=findAttachment(state,chosenIds[0]);if(!sacrifice||sacrifice.playerId!==playerId)throw new Error('自分の強化カードを選んでください');
        var sacrificeMax=calculateMaxHp(sacrifice.host,state);sacrifice.host.attachments.splice(sacrifice.index,1);sacrifice.instance.zone=ZONES.DISCARD;state.player(sacrifice.instance.ownerId).discard.push(sacrifice.instance);resolveAttachmentDiscarded(state,sacrifice.instance);preserveDamageAfterMaxHpChange(state,sacrifice.host,sacrificeMax);
        var optionalTargets=state.player(state.opponentOf(playerId)).field.filter(function(card){return !card.faceDown;});
        if(optionalTargets.length){createCardSelection(state,{playerId:playerId,options:optionalTargets.map(function(card){return card.instanceId;}),minSelections:0,maxSelections:1,candidateZones:[ZONES.FIELD],selectionPurpose:'OPTIONAL_DAMAGE_TARGET',continuation:{type:'DAMAGE_SELECTED',targetPlayerId:state.opponentOf(playerId),sourceInstanceId:instance.instanceId,amount:effect.amount,effectType:effect.type}});}
      }
      if (effect.type === 'TRANSFER_OWN_ATTACHMENT') {
        var attHolder=findAttachment(state,chosenIds[0])||findAttachment(state,chosenIds[1]);
        var hostHolder=findAnywhere(state,chosenIds[0])||findAnywhere(state,chosenIds[1]);
        if(!attHolder||!hostHolder||hostHolder.playerId!==playerId||hostHolder.zone!==ZONES.FIELD||hostHolder.instance===attHolder.host) throw new Error('付け替え対象が不正です');
        transferExistingEnhancement(state,playerId,attHolder,hostHolder.instance);
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
    player.nextUseCostModifiers=snapshot.nextUseCostModifiers;
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
    (def.cardEffects||[]).forEach(function(effect){
      if(chosenTargetInstanceId==null)return;
      var selected=Array.isArray(chosenTargetInstanceId)?chosenTargetInstanceId:[chosenTargetInstanceId],selection=getComplexSpellSelection(state,playerId,handInstanceId,effect);
      if(!selection)return;
      if(selected.length&&selection.firstSelectionOptions&&selection.firstSelectionOptions.indexOf(selected[0])===-1)throw new Error('最初に使用できるカードを選択してください');
      var minimum=selection.exactSelections!=null?selection.exactSelections:selection.minSelections,maximum=selection.exactSelections!=null?selection.exactSelections:selection.maxSelections;
      if(selected.length<minimum||selected.length>maximum||selected.some(function(id,index){return selected.indexOf(id)!==index||!selection.options.some(function(card){return card.instanceId===id;});}))throw new Error('移動対象の枚数または条件が不正です');
      if((selection.groups||[]).some(function(group){return !selected.some(function(id){return group.indexOf(id)!==-1;});}))throw new Error('各対象グループから選択してください');
      if(selection.partitions&&selection.partitions.length&&!selection.partitions.some(function(group){return selected.every(function(id){return group.indexOf(id)!==-1;});}))throw new Error('同じ色の虫を選択してください');
      if(selection.allowedCombinations&&selection.allowedCombinations.length&&!selection.allowedCombinations.some(function(group){return group.length===selected.length&&group.every(function(id){return selected.indexOf(id)!==-1;});}))throw new Error('対応するカードの組み合わせを選択してください');
    });
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
        createCardSelection(state,{playerId:playerId,options:selection.options.map(function(c){return c.instanceId;}),firstSelectionOptions:selection.firstSelectionOptions,selectionGroups:selection.groups,selectionPartitions:selection.partitions,allowedCombinations:selection.allowedCombinations,minSelections:selection.minSelections,maxSelections:selection.maxSelections,exactSelections:selection.exactSelections,candidateZones:selection.zones,selectionPurpose:complexEffect.type,continuation:{type:'USE_SPELL',sourceInstanceId:handInstanceId}});
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
    if(variableCostEffect&&spellOptions.variablePayment!=null){
      var additionalPayment=spellOptions.variablePayment;
      var basePayment=territoryCostEffect&&spellOptions.paymentMode==='TERRITORY'?0:spellCost;
      if(typeof additionalPayment!=='number'||!isFinite(additionalPayment)||Math.floor(additionalPayment)!==additionalPayment||additionalPayment<0||additionalPayment>player.availableCost-basePayment)throw new Error('追加支払いは使用可能コスト以内の整数を指定してください');
    }
    if(variableCostEffect&&spellOptions.variablePayment==null){
      var paymentOptions=[];for(var payment=0;payment<=player.availableCost-spellCost;payment++){paymentOptions.push({value:String(payment),label:String(payment)+'コスト'});}
      state.pendingEffect={type:'CHOICE_SELECTION',playerId:playerId,controller:playerId,selectionPurpose:'VARIABLE_COST_PAYMENT',prompt:'追加で支払うコストを選んでください',options:paymentOptions,continuation:{type:'USE_SPELL_VARIABLE_COST',sourceInstanceId:handInstanceId,targetInstanceId:chosenTargetInstanceId}};
      return {pending:true};
    }

    // 使用直前の状態を記録(rollback用)。
    var snapshot = {
      availableCost: player.availableCost,
      nextUseCostModifiers:player.nextUseCostModifiers,
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

      player.nextUseCostModifiers=(player.nextUseCostModifiers||[]).filter(function(modifier){return state.turnNumber<=modifier.endTurn&&!matchesNextUseCostModifier(state,playerId,def,modifier);});
      var result = {
        spellInstance: held,
        def: def,
        finalZone: null,
        foodDelta: 0
      };

      // ---- RESOLVE_EFFECT: HAND → RESOLVING(一時領域) ----
      moveCard(state, handInstanceId, ZONES.HAND, ZONES.RESOLVING, { playerId: playerId });

      emitBattleEvent(state,'SPELL_USED',{sourceInstanceId:held.instanceId,playerId:playerId});
      var spellUseTriggers=[];
      state.player(state.opponentOf(playerId)).field.forEach(function(watcher){
        if(watcher.faceDown||areInsectKeywordSkillsSuppressed(state,watcher))return;
        var watcherDef=getCardDefinition(watcher.cardId);
        (watcherDef&&watcherDef.passiveAbilities||[]).filter(function(ability){return ability.timing==='ON_OPPONENT_SPELL_USED';}).forEach(function(ability){
          (ability.effects||[]).filter(function(effect){return effect.type==='DESTROY_SELF';}).forEach(function(){spellUseTriggers.push({playerId:watcher.controllerId||watcher.ownerId,label:watcherDef.name+'／'+ability.name,continuation:{type:'DESTROY_ENTRY_WATCHER',sourceInstanceId:watcher.instanceId,fieldEntrySerial:watcher.runtimeFlags.fieldEntrySerial||0}});});
        });
      });
      if(spellUseTriggers.length){
        var committedOptions=Object.assign({},spellOptions);
        if(chosenTargetInstanceId){
          committedOptions.committedTargetSnapshots=[].concat(chosenTargetInstanceId).map(function(id){return snapshotCommittedSpellTarget(state,id);}).filter(Boolean);
        }
        resumeAfterSelection(state,{type:'SEQUENCE',steps:[{type:'ORDER_TRIGGER_CONTINUATIONS',steps:spellUseTriggers},{type:'RESOLVE_COMMITTED_SPELL',playerId:playerId,sourceInstanceId:held.instanceId,targetInstanceId:chosenTargetInstanceId,spellOptions:committedOptions}]});
        result.pending=!!state.pendingEffect;result.finalZone=held.zone===ZONES.RESOLVING?null:held.zone;result.foodDelta=result.finalZone===ZONES.FOOD?1:0;return result;
      }
      return completeCommittedSpell(state,playerId,held,def,chosenTargetInstanceId,spellOptions);
    } catch (err) {
      // 効果解決中・最終移動中の内部エラー → 使用直前の状態へ復旧して再送出。
      rollbackSpellToHand(state, playerId, held.instanceId, snapshot);
      throw err;
    }
  }

  function completeCommittedSpell(state,playerId,held,def,chosenTargetInstanceId,spellOptions){
    var finalZone=resolveSpellEffects(state,playerId,held,def,chosenTargetInstanceId,spellOptions);
    if(state.pendingEffect&&(def.cardEffects||[]).some(function(effect){return !!effect.repeat||!!effect.deferFinalization;})){
      resumeAfterSelection(state,{type:'FINALIZE_COMMITTED_SPELL',playerId:playerId,sourceInstanceId:held.instanceId,finalZone:finalZone});
      return {pending:true,spellInstance:held,def:def,finalZone:finalZone,foodDelta:0};
    }
    return finalizeCommittedSpell(state,playerId,held,def,finalZone);
  }

  function finalizeCommittedSpell(state,playerId,held,def,finalZone){
    var finalFaceEffect=(def.cardEffects||[]).find(function(effect){return effect.selfFinalZone===finalZone;});
    if(held.zone!==finalZone)moveCard(state,held.instanceId,ZONES.RESOLVING,finalZone,{playerId:playerId,faceDown:finalFaceEffect?finalFaceEffect.selfFinalFaceDown:undefined});
    log(state,state.turnNumber,playerId+' は '+def.name+' を使用した');
    if(state._postSpellContinuation){var postSpell=state._postSpellContinuation;delete state._postSpellContinuation;resumeAfterSelection(state,postSpell);}
    return {spellInstance:held,def:def,finalZone:finalZone,foodDelta:finalZone===ZONES.FOOD?1:0};
  }

  function snapshotCommittedSpellTarget(state,instanceId){
    var attachment=findAttachment(state,instanceId);
    if(attachment)return {instanceId:instanceId,zone:'ATTACHMENT',playerId:attachment.playerId,hostInstanceId:attachment.host.instanceId,fieldEntrySerial:attachment.host.runtimeFlags.fieldEntrySerial||0};
    var holder=findAnywhere(state,instanceId);
    return holder&&{instanceId:instanceId,zone:holder.zone,playerId:holder.playerId,fieldEntrySerial:holder.instance.runtimeFlags.fieldEntrySerial||0};
  }

  function isCommittedSpellTargetCurrent(state,snapshot){
    var current=snapshotCommittedSpellTarget(state,snapshot.instanceId);
    return !!current&&current.zone===snapshot.zone&&current.playerId===snapshot.playerId&&current.hostInstanceId===snapshot.hostInstanceId&&
      (current.zone!==ZONES.FIELD&&current.zone!=='ATTACHMENT'||current.fieldEntrySerial===snapshot.fieldEntrySerial);
  }

  // ---- 強化カード使用 ----
  function matchesAttachmentHostDefinition(attachmentDef,host){var hostDef=getCardDefinition(host.cardId);var suffixes=attachmentDef.attachmentHostFamilySuffixes||(attachmentDef.attachmentHostFamilySuffix?[attachmentDef.attachmentHostFamilySuffix]:null);return !suffixes||(hostDef.tags||[]).some(function(tag){return suffixes.some(function(suffix){return tag.endsWith(suffix);});});}
  function activeAttachmentLimit(state,host){var def=getCardDefinition(host.cardId);if(def.attachmentLimitRequiresTrait&&(areInsectKeywordSkillsSuppressed(state,host)||(host.runtimeFlags&&host.runtimeFlags.suppressKeywordSkills)))return null;return def.attachmentLimit;}

  function getEnhancementTargetCandidates(state, playerId, sourceId) {
    var source = findInZone(state, playerId, ZONES.HAND, sourceId);
    var definition = source && getCardDefinition(source.cardId);
    if (!definition || definition.type !== CardTypes.ENHANCEMENT) { return []; }
    var trackedRevival=(definition.enhancementEffects||[]).some(function(effect){return effect.type==='REVIVE_TWO_TRACKED_INSECTS';});
    if(trackedRevival){var discardTargets=insectCards(state.player(playerId).discard);return discardTargets.length>=2?discardTargets:[];}
    var summons = (definition.enhancementEffects || []).some(function(effect) { return effect.type === 'SUMMON_ATTACHED_FROM_HAND'; });
    return insectCards(state.player(playerId)[summons ? 'hand' : 'field']).filter(function(card){
      var hostDef=getCardDefinition(card.cardId);
      var limit=activeAttachmentLimit(state,card);return matchesAttachmentHostDefinition(definition,card)&&(limit==null || (card.attachments||[]).length<limit);
    });
  }

  function getOwnAttachments(state, playerId, excludedInstanceId) {
    var result=[];
    state.player(playerId).field.forEach(function(host){(host.attachments||[]).forEach(function(att){if(att.instanceId!==excludedInstanceId)result.push(att);});});
    return result;
  }

  function isEnhancementEligibleForForcedAttach(state,playerId,attachment){
    if(!attachment||attachment.faceDown)return false;
    var def=getCardDefinition(attachment.cardId),effects=def&&def.enhancementEffects||[];
    if(!def||def.type!==CardTypes.ENHANCEMENT)return false;
    if(effects.some(function(effect){return effect.type==='REVIVE_TWO_TRACKED_INSECTS'||effect.type==='SUMMON_ATTACHED_FROM_HAND';}))return false;
    if(effects.some(function(effect){return effect.type==='COPY_ENHANCEMENT_STATS_TRACK_SOURCE';})&&!getOwnAttachments(state,playerId,attachment.instanceId).length){
      var canFollowFoodSource=state.player(playerId).food.some(function(candidate){
        if(candidate===attachment||candidate.faceDown)return false;
        var candidateDef=getCardDefinition(candidate.cardId),candidateEffects=candidateDef&&candidateDef.enhancementEffects||[];
        return candidateDef&&candidateDef.type===CardTypes.ENHANCEMENT&&!candidateEffects.some(function(effect){return effect.type==='REVIVE_TWO_TRACKED_INSECTS'||effect.type==='SUMMON_ATTACHED_FROM_HAND'||effect.type==='COPY_ENHANCEMENT_STATS_TRACK_SOURCE';});
      });
      if(!canFollowFoodSource)return false;
    }
    return insectCards(state.player(playerId).field).some(function(host){return isForcedAttachmentHostLegal(state,playerId,attachment,host);});
  }

  function isForcedAttachmentHostLegal(state,playerId,attachment,host){
    if(!host||host.faceDown||!matchesAttachmentHostDefinition(getCardDefinition(attachment.cardId),host))return false;
    var hostDef=getCardDefinition(host.cardId);
    var limit=activeAttachmentLimit(state,host);return limit==null||(host.attachments||[]).length<limit;
  }

  function setCopiedEnhancementSource(copy,source){
    var copiedDef=getCardDefinition(source.cardId);copy.runtimeFlags=copy.runtimeFlags||{};
    copy.runtimeFlags.copiedEnhancementSourceId=source.instanceId;
    copy.runtimeFlags.copiedStatEffects=(copiedDef.enhancementEffects||[]).filter(function(effect){return effect.type==='STAT_MODIFIER'&&(effect.stat==='AP'||effect.stat==='HP');}).map(function(effect){return {stat:effect.stat,amount:effect.amount||0};});
  }

  function getEntryAttachmentCandidates(state,playerId,host,effect){
    return getPlayerZoneArray(state,playerId,effect.from).filter(function(card){
      var definition=getCardDefinition(card.cardId);
      if(!definition||definition.type!==CardTypes.ENHANCEMENT||effect.maxPrintedCost!=null&&definition.cost>effect.maxPrintedCost)return false;
      if(!isEnhancementEligibleForForcedAttach(state,playerId,card)||!isForcedAttachmentHostLegal(state,playerId,card,host))return false;
      if((definition.enhancementEffects||[]).some(function(e){return e.type==='COPY_ENHANCEMENT_STATS_TRACK_SOURCE';})&&!getOwnAttachments(state,playerId,card.instanceId).length)return false;
      return true;
    });
  }

  function getEntryAttachAnyCandidates(state,playerId,effect){
    var choices=[];
    insectCards(state.player(playerId).field).forEach(function(host){getEntryAttachmentCandidates(state,playerId,host,effect).forEach(function(card){if(choices.indexOf(card)===-1)choices.push(card);});});
    return choices;
  }

  function resolveAttachmentEntryEffects(state,playerId,attachment,afterResolution,transfer){
    var definition=getCardDefinition(attachment.cardId);
    var jobs=(definition.enhancementEffects||[]).filter(function(effect){return effect.timing==='ON_ATTACH'||(!transfer&&effect.timing==='ON_ENTER_FIELD');}).map(function(effect){return {playerId:playerId,label:definition.name,continuation:{type:'FIELD_ENTRY_EFFECT',playerId:playerId,sourceInstanceId:attachment.instanceId,optional:!!effect.optional,effect:effect}};});
    var holder=findAttachment(state,attachment.instanceId),host=holder&&holder.host;
    if(host&&!host.faceDown&&!areInsectKeywordSkillsSuppressed(state,host)){
      var hostDefinition=getCardDefinition(host.cardId);
      (hostDefinition.passiveAbilities||[]).filter(function(ability){return ability.timing==='ON_HOST_ATTACHMENT';}).forEach(function(ability){
        jobs.push({playerId:holder.playerId,label:hostDefinition.name+'〈'+ability.name+'〉',continuation:{type:'SEQUENCE',steps:(ability.effects||[]).map(function(effect){return {type:'FIELD_ENTRY_EFFECT',playerId:holder.playerId,sourceInstanceId:host.instanceId,optional:!!ability.optional,effect:effect};})}});
      });
    }
    var steps=[{type:'ORDER_TRIGGER_CONTINUATIONS',steps:jobs}];if(afterResolution)steps.push(afterResolution);
    resumeAfterSelection(state,{type:'SEQUENCE',steps:steps});
  }

  function attachExistingEnhancement(state,playerId,attachment,host,options){
    options=options||{};
    if(!isForcedAttachmentHostLegal(state,playerId,attachment,host))throw new Error('強化の装着対象が不正です');
    var holder=findAnywhere(state,attachment.instanceId),oldMax=calculateMaxHp(host,state);
    var attachmentDefinition=getCardDefinition(attachment.cardId),needsCopy=(attachmentDefinition&&attachmentDefinition.enhancementEffects||[]).some(function(effect){return effect.type==='COPY_ENHANCEMENT_STATS_TRACK_SOURCE';});
    if(needsCopy&&!options.copySource){
      var copyChoices=getOwnAttachments(state,playerId,attachment.instanceId);
      if(!holder||!copyChoices.length)throw new Error('コピー元にできる強化カードがありません');
      createCardSelection(state,{playerId:playerId,options:copyChoices.map(function(card){return card.instanceId;}),exactSelections:1,candidateZones:['ATTACHMENT'],selectionPurpose:'COPY_ENHANCEMENT_SOURCE',continuation:{type:'ATTACH_EXISTING_COPY',attachmentInstanceId:attachment.instanceId,sourceZone:holder.zone,hostInstanceId:host.instanceId,fieldEntrySerial:host.runtimeFlags.fieldEntrySerial||0,entryEffect:options.entryEffect}});return {pending:true};
    }
    if(holder){var sourceCards=getPlayerZoneArray(state,holder.playerId,holder.zone);sourceCards.splice(sourceCards.indexOf(attachment),1);}
    attachment.controllerId=playerId;
    attachment.faceDown=false;
    attachment.zone=ZONES.FIELD;host.attachments=host.attachments||[];host.attachments.push(attachment);
    if(options.copySource)setCopiedEnhancementSource(attachment,options.copySource);
    preserveDamageAfterMaxHpChange(state,host,oldMax);
    resolveAttachmentEntryEffects(state,playerId,attachment,options.afterResolution);
    return attachment;
  }

  function transferExistingEnhancement(state,playerId,holder,destination){
    if(!canTransferExistingEnhancement(state,playerId,holder,destination))throw new Error('付け替え対象が不正です');
    var def=getCardDefinition(holder.instance.cardId),isCopy=def&&(def.enhancementEffects||[]).some(function(effect){return effect.type==='COPY_ENHANCEMENT_STATS_TRACK_SOURCE';});
    var availableSources=isCopy?getOwnAttachments(state,playerId,holder.instance.instanceId):[];
    if(isCopy&&!availableSources.length)throw new Error('コピー元にできる強化カードがありません');
    var oldSourceMax=calculateMaxHp(holder.host,state),oldDestinationMax=calculateMaxHp(destination,state);
    holder.host.attachments.splice(holder.index,1);destination.attachments=destination.attachments||[];destination.attachments.push(holder.instance);
    if(isCopy){holder.instance.runtimeFlags=holder.instance.runtimeFlags||{};delete holder.instance.runtimeFlags.copiedEnhancementSourceId;delete holder.instance.runtimeFlags.copiedStatEffects;}
    preserveDamageAfterMaxHpChange(state,holder.host,oldSourceMax);preserveDamageAfterMaxHpChange(state,destination,oldDestinationMax);
    if(isCopy){
      var refreshed=getOwnAttachments(state,playerId,holder.instance.instanceId);
      createCardSelection(state,{playerId:playerId,options:refreshed.map(function(source){return source.instanceId;}),exactSelections:1,candidateZones:['ATTACHMENT'],selectionPurpose:'COPY_ENHANCEMENT_SOURCE',continuation:{type:'RESELECT_TRANSFERRED_COPY',attachmentInstanceId:holder.instance.instanceId}});
    }
    if(!isCopy)resolveAttachmentEntryEffects(state,playerId,holder.instance,null,true);
    return holder.instance;
  }

  function canTransferExistingEnhancement(state,playerId,holder,destination){
    var destinationHolder=destination&&findAnywhere(state,destination.instanceId);
    if(!holder||holder.playerId!==playerId||!destinationHolder||destinationHolder.playerId!==playerId||destinationHolder.zone!==ZONES.FIELD||destination===holder.host||!isForcedAttachmentHostLegal(state,playerId,holder.instance,destination))return false;
    var definition=getCardDefinition(holder.instance.cardId),copy=(definition&&definition.enhancementEffects||[]).some(function(effect){return effect.type==='COPY_ENHANCEMENT_STATS_TRACK_SOURCE';});
    return !copy||getOwnAttachments(state,playerId,holder.instance.instanceId).length>0;
  }

  function continueFoodEnhancementSequence(state,continuation){
    var ids=(continuation.attachmentIds||[]).slice();if(!ids.length)return;
    var id=ids.shift(),attachment=findInZone(state,continuation.playerId,ZONES.FOOD,id);
    var next={type:'ATTACH_FOOD_ENHANCEMENTS_SEQUENCE',playerId:continuation.playerId,attachmentIds:ids,selectedHosts:continuation.selectedHosts};
    if(!attachment||!isEnhancementEligibleForForcedAttach(state,continuation.playerId,attachment)){resumeAfterSelection(state,next);return;}
    var currentHosts=insectCards(state.player(continuation.playerId).field).filter(function(host){return isForcedAttachmentHostLegal(state,continuation.playerId,attachment,host);});
    if(continuation.selectedHosts)currentHosts=currentHosts.filter(function(host){return continuation.selectedHosts.some(function(target){return target.instanceId===host.instanceId&&(host.runtimeFlags.fieldEntrySerial||0)===target.fieldEntrySerial;});});
    else currentHosts=currentHosts.filter(function(host){return isSpellSelectionTargetLegal(state,continuation.playerId,host);});
    if(!currentHosts.length){resumeAfterSelection(state,next);return;}
    var hosts=currentHosts.slice();
    if(!continuation.selectedHosts)insectCards(state.player(continuation.playerId).field).forEach(function(host){if(hosts.indexOf(host)!==-1||!isSpellSelectionTargetLegal(state,continuation.playerId,host))return;if(ids.some(function(otherId){var other=findInZone(state,continuation.playerId,ZONES.FOOD,otherId);return other&&isForcedAttachmentHostLegal(state,continuation.playerId,other,host);}))hosts.push(host);});
    createCardSelection(state,{playerId:continuation.playerId,options:hosts.map(function(host){return host.instanceId;}),firstSelectionOptions:currentHosts.map(function(host){return host.instanceId;}),minSelections:1,maxSelections:continuation.selectedHosts?1:Math.min(2,hosts.length),candidateZones:[ZONES.FIELD],selectionPurpose:'ATTACH_FOOD_ENHANCEMENT_HOST',continuation:{type:'ATTACH_FOOD_ENHANCEMENT_TO_HOST',attachmentInstanceId:id,remainingAttachmentIds:ids,selectedHosts:continuation.selectedHosts}});
  }
  // 自分の虫に強化カードを装着する。
  // 強化カードは HAND から対象虫の attachments へ移動する。
  // 強化カード自体は zone=FIELD のまま所有者情報を保持する。
  // chosenColor: COLOR_OVERRIDE系の場合、'RED' | 'BLUE' | 'GREEN' を指定
  function getPendingEnhancementPaymentStatus(state){
    var pending=state.pendingEffect;if(!pending||pending.selectionPurpose!=='ENHANCEMENT_FOOD_PAYMENT')return null;
    var c=pending.continuation,source=findInZone(state,pending.playerId,ZONES.HAND,c.sourceInstanceId),definition=source&&getCardDefinition(source.cardId),ids=state.player(pending.playerId).food.filter(function(card){return !card.faceDown&&(!pending.exactSelections||pending.options.indexOf(card.instanceId)!==-1);}).map(function(card){return card.instanceId;}),cost=definition&&getEffectiveCardCost(state,pending.playerId,definition,{targetInstanceId:c.targetInstanceId,foodPaymentCount:pending.type==='CARD_SELECTION'?pending.exactSelections:undefined});
    return {candidateIds:ids,canContinue:!!(source&&definition&&getEnhancementTargetCandidates(state,pending.playerId,source.instanceId).some(function(card){return card.instanceId===c.targetInstanceId;})&&ids.length>=(pending.exactSelections||0)&&cost<=state.player(pending.playerId).availableCost)};
  }
  function cancelPendingEnhancementPayment(state,playerId){var pending=state.pendingEffect;if(!pending||pending.playerId!==playerId||pending.selectionPurpose!=='ENHANCEMENT_FOOD_PAYMENT')throw new Error('取り消せる支払いではありません');state.pendingEffect=null;resumeAfterSelection(state,pending.afterResolution);return true;}
  global.getPendingEnhancementPaymentStatus=getPendingEnhancementPaymentStatus;
  global.cancelPendingEnhancementPayment=cancelPendingEnhancementPayment;
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
    var paymentIds=enhancementOptions.foodPaymentIds;
    if(def.foodPaymentDiscount&&Array.isArray(paymentIds)&&(new Set(paymentIds).size!==paymentIds.length||paymentIds.some(function(id){var food=findInZone(state,playerId,ZONES.FOOD,id);return !food||food.faceDown;})))throw new Error('表向きのエサを重複せず選んでください');
    var enhancementCost = getEffectiveCardCost(state, playerId, def, { targetInstanceId: targetInstanceId,foodPaymentCount:Array.isArray(paymentIds)?paymentIds.length:undefined });
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
    if(def.foodPaymentDiscount&&!Array.isArray(paymentIds)){
      var paymentOptions=[],countLimit=player.food.filter(function(card){return !card.faceDown;}).length;
      for(var count=0;count<=countLimit;count++)if(getEffectiveCardCost(state,playerId,def,{targetInstanceId:targetInstanceId,foodPaymentCount:count})<=player.availableCost)paymentOptions.push({value:String(count),label:'エサ'+count+'枚を裏返して支払う'});
      paymentOptions.push({value:'CANCEL',label:'支払いを取り消す'});
      state.pendingEffect={type:'CHOICE_SELECTION',playerId:playerId,controller:playerId,selectionPurpose:'ENHANCEMENT_FOOD_PAYMENT',options:paymentOptions,continuation:{type:'ENHANCEMENT_FOOD_PAYMENT_COUNT',sourceInstanceId:handInstanceId,targetInstanceId:targetInstanceId,chosenColor:chosenColor}};return {pending:true};
    }
    var copyEffect=(def.enhancementEffects||[]).filter(function(effect){return effect.type==='COPY_ENHANCEMENT_STATS_TRACK_SOURCE';})[0];
    if(copyEffect&&!enhancementOptions.copySourceId){
      var copyCandidates=[];player.field.forEach(function(host){(host.attachments||[]).forEach(function(att){if(att.instanceId!==handInstanceId)copyCandidates.push(att);});});
      if(!copyCandidates.length)throw new Error('修正値を参照する強化カードがありません');
      createCardSelection(state,{playerId:playerId,options:copyCandidates.map(function(att){return att.instanceId;}),exactSelections:1,candidateZones:['ATTACHMENT'],selectionPurpose:'COPY_ENHANCEMENT_SOURCE',continuation:{type:'USE_COPY_ENHANCEMENT',sourceInstanceId:handInstanceId,targetInstanceId:targetInstanceId}});return {pending:true};
    }
    var copiedSource=copyEffect&&findAttachment(state,enhancementOptions.copySourceId);
    if(copyEffect&&(!copiedSource||copiedSource.playerId!==playerId))throw new Error('参照する強化カードが不正です');

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
    if(def.foodPaymentDiscount)(paymentIds||[]).forEach(function(id){findInZone(state,playerId,ZONES.FOOD,id).faceDown=true;});
    player.availableCost -= enhancementCost;
    if(player.nextEnhancementDiscount&&state.turnNumber<=player.nextEnhancementDiscount.endTurn){player.nextEnhancementDiscount=null;}

    if (summons) {
      moveCard(state, target.instanceId, ZONES.HAND, ZONES.FIELD, { playerId: playerId, deferEntryEffects: true, runtimeFlags:{fieldEntryCause:{kind:'ENHANCEMENT',cardId:held.cardId,instanceId:held.instanceId,playerId:playerId}} });
    }
    // HAND から強化カードを取り出し、対象虫の attachments へ追加
    // zone は FIELD のまま所有者情報を維持
    var fromArr = getPlayerZoneArray(state, playerId, ZONES.HAND);
    var idx = fromArr.indexOf(held);
    if (idx === -1) {
      throw new Error('useEnhancement: handInstance not in HAND');
    }
    fromArr.splice(idx, 1);
    held.faceDown = false;
    held.zone = ZONES.FIELD;
    if (!target.attachments) { target.attachments = []; }
    var previousMaxHp = calculateMaxHp(target, state);
    target.attachments.push(held);
    if(copyEffect){
      setCopiedEnhancementSource(held,copiedSource.instance);
    }
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
    emitBattleEvent(state,'ENHANCEMENT_USED',{sourceInstanceId:held.instanceId,targetInstanceId:target.instanceId,playerId:playerId});
    resolveAttachmentEntryEffects(state,playerId,held);

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
      if(areInsectKeywordSkillsSuppressed(state,inst)){return false;}
      var def = getCardDefinition(inst.cardId);
      if (!def || !def.skills) { return false; }
      var grantedSkillId=getGrantedTerritorySkillId(state,playerId,def);
      if(grantedSkillId&&(!skillId||skillId===grantedSkillId))return true;
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
    if (hasPassiveEffect(state,attacker, 'CANNOT_ATTACK')) { return []; }
    if (attacker.enteredFieldTurn === state.turnNumber && hasPassiveEffect(state,attacker, 'CANNOT_ATTACK_ENTRY_TURN')) { return []; }
    if(attacker.runtimeFlags&&attacker.runtimeFlags.enteredBySpellTurn===state.turnNumber&&state.playerOrder.some(function(pid){return state.player(pid).field.some(function(card){return hasPassiveEffect(state,card,'SPELL_SUMMONS_CANNOT_ATTACK_THIS_TURN');});})){return [];}
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
    if(skillRequirements.some(function(requirement){return requirement.type==='OPPONENT_VISIBLE_FIELD_COUNT'&&state.player(state.opponentOf(holder.playerId)).field.filter(function(card){return !card.faceDown;}).length<requirement.minimum;}))return [];
    if(skillRequirements.some(function(requirement){return requirement.type==='OWN_VISIBLE_DISCARD_COUNT'&&countVisibleDiscardCards(state,holder.playerId,{cardType:requirement.cardType})<requirement.minimum;}))return [];
    if(skillRequirements.some(function(requirement){return requirement.type==='OWN_FIELD_TAG_COUNT'&&state.player(holder.playerId).field.filter(function(card){var definition=!card.faceDown&&getCardDefinition(card.cardId);return definition&&(definition.tags||[]).indexOf(requirement.tag)!==-1;}).length<requirement.minimum;})){return [];}
    if (skillRequirements.some(function (requirement) {
      return requirement.type === 'SOURCE_HAS_ATTACHMENT' && !(attacker.attachments || []).length;
    })) { return []; }
    if (skillRequirements.some(function (requirement) {
      return requirement.type === 'OWN_FIELD_CARD_ID' && !state.player(holder.playerId).field.some(function (card) {
        return !card.faceDown && card.cardId === requirement.cardId;
      });
    })) { return []; }
    if (skillRequirements.some(function (requirement) { return requirement.type === 'TARGET_HAS_ATTACHMENT'; })) {
      legalPool = legalPool.filter(function (defender) { return (defender.attachments || []).length > 0; });
    }
    legalPool=legalPool.filter(function(defender){return !skillRequirements.some(function(requirement){
      if(requirement.type==='TARGET_PRINTED_COST'){var d=getCardDefinition(defender.cardId);return !d||(requirement.minimum!=null&&d.cost<requirement.minimum)||(requirement.maximum!=null&&d.cost>requirement.maximum);}
      if(requirement.type==='TARGET_DAMAGED')return defender.currentHp>=calculateMaxHp(defender,state);
      if(requirement.type==='TARGET_COLOR')return getEffectiveColor(defender)!==requirement.color;
      return false;
    });});
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
    if(instance.runtimeFlags&&instance.runtimeFlags.suppressKeywordSkills||areInsectKeywordSkillsSuppressed(state,instance)){return false;}
    if (rule === 'FORCE_ATTACK_TO_SELF_GROUP' && instance.runtimeFlags &&
        instance.runtimeFlags.forceAttackTargetUntilTurn === state.turnNumber) { return true; }
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

  function hasIndividualKeywordSuppression(instance) {
    return !!(instance && ((instance.runtimeFlags && instance.runtimeFlags.suppressKeywordSkills) ||
      (instance.attachments || []).some(function(attachment) {
        var definition = getCardDefinition(attachment.cardId);
        return (definition && definition.enhancementEffects || []).some(function(effect) {
          return effect.type === 'SUPPRESS_HOST_KEYWORD_SKILLS';
        });
      })));
  }

  function areInsectKeywordSkillsSuppressed(state, instance) {
    if(!state||!instance){return false;}var targetDef=getCardDefinition(instance.cardId);
    if(!targetDef||targetDef.type!==CardTypes.INSECT){return false;}
    if(hasIndividualKeywordSuppression(instance)){return true;}
    var isSuppressor=(targetDef.passiveAbilities||[]).some(function(ability){return (ability.effects||[]).some(function(effect){return effect.type==='SUPPRESS_ALL_OTHER_INSECT_KEYWORD_SKILLS';});});
    if(isSuppressor){return false;}
    return state.playerOrder.some(function(playerId){return state.player(playerId).field.some(function(card){
      if(card.faceDown||hasIndividualKeywordSuppression(card)){return false;}var def=getCardDefinition(card.cardId);return (def&&def.passiveAbilities||[]).some(function(ability){return (ability.effects||[]).some(function(effect){return effect.type==='SUPPRESS_ALL_OTHER_INSECT_KEYWORD_SKILLS';});});
    });});
  }

  function getEffectiveAttackSkills(state, instance) {
    var def=getCardDefinition(instance&&instance.cardId),own=(def&&def.skills||[]).filter(function(skill){return skill.timing==='ATTACK';});
    if(!instance||instance.faceDown||instance.runtimeFlags&&instance.runtimeFlags.suppressKeywordSkills||areInsectKeywordSkillsSuppressed(state,instance)){return own;}
    var shares=(def.passiveAbilities||[]).some(function(ability){return (ability.effects||[]).some(function(effect){return effect.type==='SHARE_LINKED_ALLY_ATTACK_SKILLS';});});
    if(!shares){return own;}
    var holder=findAnywhere(state,instance.instanceId),result=own.slice(),seen={};result.forEach(function(skill){seen[skill.name]=true;});
    if(!holder){return result;}
    state.player(holder.playerId).field.forEach(function(ally){
      if(ally===instance||ally.faceDown||areInsectKeywordSkillsSuppressed(state,ally)){return;}
      var allyDef=getCardDefinition(ally.cardId),linked=(allyDef&&allyDef.passiveAbilities||[]).some(function(ability){return (ability.effects||[]).some(function(effect){return effect.type==='SHARE_LINKED_ALLY_ATTACK_SKILLS';});});
      if(!linked){return;}(allyDef.skills||[]).filter(function(skill){return skill.timing==='ATTACK';}).forEach(function(skill){if(!seen[skill.name]){seen[skill.name]=true;result.push(skill);}});
    });return result;
  }

  // 攻撃実行。targetType は 'INSECT' | 'LEADER'
  function stampDestructionActor(state,snapshot,sourceType,sourceInstanceId,result,options){
    var source=sourceInstanceId&&findAnywhere(state,sourceInstanceId);
    snapshot.destructionReceipt={actorControllerId:result&&result.sourceControllerId||options&&options.sourceControllerId||source&&source.playerId||null,sourceType:sourceType};
  }

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
    var attackerFieldEntrySerial=attacker.runtimeFlags.fieldEntrySerial||0;
    var attackedTargetSnapshot=targetType==='INSECT'&&findInZone(state,state.opponentOf(ap),ZONES.FIELD,targetInstanceId);
    var attackedTargetFieldSerial=attackedTargetSnapshot&&(attackedTargetSnapshot.runtimeFlags.fieldEntrySerial||0);
    // 攻撃可能な技は timing === 'ATTACK' のもののみ
    var attackSkills = getEffectiveAttackSkills(state, attacker);
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

    var blindRoute=(skill.effects||[]).some(function(effect){return effect.type==='BLIND_ROUTE_OPPONENT_HAND';});
    if(blindRoute&&!attackOptions.blindRouted){
      var blindOpponent=state.opponentOf(ap),blindHand=state.player(blindOpponent).hand;
      if(blindHand.length){createCardSelection(state,{playerId:ap,options:blindHand.map(function(card){return card.instanceId;}),exactSelections:1,candidateZones:[ZONES.HAND],selectionPurpose:'BLIND_OPPONENT_HAND',hiddenSelection:true,continuation:{type:'BLIND_ROUTE_SELECTED',targetPlayerId:blindOpponent,attackerInstanceId:attackerInstanceId,targetInstanceId:targetInstanceId,targetType:targetType,skillId:skill.id}});return {pending:true};}
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
      var foodCost=(skill.additionalCost||[]).find(function(cost){return cost.type==='SACRIFICE_OWN_FOOD';});
      if(foodCost&&!chosenSacrificeInstanceId&&!attackOptions.additionalCostSelected){
        var foodCostCandidates=state.player(ap).food.slice();
        if(foodCostCandidates.length<(foodCost.amount||1))throw new Error('破壊する自分のエサがありません');
        createCardSelection(state,{playerId:ap,options:foodCostCandidates.map(function(food){return food.instanceId;}),
          exactSelections:foodCost.amount||1,candidateZones:[ZONES.FOOD],selectionPurpose:'ATTACK_ADDITIONAL_COST_FOOD',
          continuation:snapshotAttackCostContinuation(state,attackerInstanceId,targetInstanceId,targetType,skill.id)});
        return {pending:true};
      }
      var attachmentCost=(skill.additionalCost||[]).some(function(cost){return cost.type==='DESTROY_OWN_ATTACHMENT';});
      if(attachmentCost&&!attackOptions.additionalCostSelected){
        var attachmentCandidates=[];state.player(ap).field.forEach(function(host){(host.attachments||[]).forEach(function(att){attachmentCandidates.push(att);});});
        if(!attachmentCandidates.length)throw new Error('破壊する自分の強化カードがありません');
        createCardSelection(state,{playerId:ap,options:attachmentCandidates.map(function(att){return att.instanceId;}),exactSelections:1,candidateZones:['ATTACHMENT'],selectionPurpose:'ATTACK_ADDITIONAL_COST_ATTACHMENT',continuation:snapshotAttackCostContinuation(state,attackerInstanceId,targetInstanceId,targetType,skill.id)});return {pending:true};
      }
      payAdditionalCosts(state, attacker, skill.additionalCost, chosenSacrificeInstanceId, attackOptions.additionalCostFoodIds);
    }

    // AP modifier (一時的な攻撃力補正) を適用
    var apVal = getEffectiveAP(state, attacker, skill.baseAp || 0, skill);

    var opponentId = state.opponentOf(ap);
    var result = {
      sourceControllerId: ap,
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

    var committedAttack={type:'RESOLVE_COMMITTED_ATTACK',playerId:ap,opponentId:opponentId,attackerInstanceId:attacker.instanceId,attackerFieldEntrySerial:attackerFieldEntrySerial,targetInstanceId:targetInstanceId,targetType:targetType,targetFieldEntrySerial:attackedTargetFieldSerial,skill:skill,apVal:apVal,result:result,attackOptions:attackOptions};
    var sourceFormEffect=(skill.effects||[]).find(function(effect){return effect.type==='DESTROY_SOURCE_DEPLOY_MATCHING_FORM'||effect.type==='DESTROY_SOURCE_BEFORE_DAMAGE';});
    if(sourceFormEffect){
      var sourceFollowup=sourceFormEffect.type==='DESTROY_SOURCE_DEPLOY_MATCHING_FORM'?{type:'DEPLOY_ATTACK_MATCHING_FORM',playerId:ap,adultName:String(def.name).normalize('NFKC').replace(String(sourceFormEffect.nameSuffix).normalize('NFKC'),''),attack:committedAttack}:{type:'GAIN_COST_AFTER_SOURCE_DESTRUCTION',playerId:ap,amount:sourceFormEffect.gainCost,attack:committedAttack};
      destroyInsect(state,attacker.instanceId,'ABILITY',attacker.instanceId,{}, {skipTerritoryDraw:true,sourceControllerId:ap});
      resumeAfterSelection(state,sourceFollowup);return result;
    }
    var preDamageAttachmentEffect=(skill.effects||[]).find(function(effect){return effect.type==='TARGET_ATTACHMENT_BEFORE_DAMAGE';});
    var preDamageHost=targetType==='INSECT'&&findInZone(state,opponentId,ZONES.FIELD,targetInstanceId);
    if(preDamageAttachmentEffect&&preDamageHost&&(preDamageHost.attachments||[]).length){
      createCardSelection(state,{playerId:ap,options:preDamageHost.attachments.map(function(card){return card.instanceId;}),exactSelections:1,candidateZones:['ATTACHMENT'],selectionPurpose:'TARGET_ATTACHMENT_OPERATION',continuation:{type:'TARGET_ATTACHMENT_OPERATION',targetPlayerId:opponentId,targetInstanceId:targetInstanceId,fieldEntrySerial:attackedTargetFieldSerial,operation:preDamageAttachmentEffect.operation}});
      committedAttack.recalculateAp=true;state.pendingEffect.afterResolution=committedAttack;return {pending:true};
    }
    return resolveCommittedAttack(state,committedAttack);
  }

  // Resume only resolution: costs and the attack announcement have already committed.
  function resolveCommittedAttack(state,c){
    var committedSource=findAnywhere(state,c.attackerInstanceId);if(!committedSource)return c.result;
    var attacker=committedSource.instance,ap=c.playerId,opponentId=c.opponentId,targetInstanceId=c.targetInstanceId,targetType=c.targetType,skill=c.skill,apVal=c.apVal,result=c.result,attackOptions=c.attackOptions||{},attackerFieldEntrySerial=c.attackerFieldEntrySerial,attackedTargetFieldSerial=c.targetFieldEntrySerial,def={name:result.attackerName};
    if(c.recalculateAp){apVal=getEffectiveAP(state,attacker,skill.baseAp||0,skill);result.apVal=apVal;}
    var committedDefender=targetType==='INSECT'&&findInZone(state,opponentId,ZONES.FIELD,targetInstanceId);
    if (targetType === 'INSECT' && committedDefender && (committedDefender.runtimeFlags.fieldEntrySerial||0)===attackedTargetFieldSerial) {
      var defender = committedDefender;
      if (skill.bonusApAgainstAttached && (defender.attachments || []).length) { apVal += skill.bonusApAgainstAttached; result.apVal = apVal; }
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
      if (selfDestructAfterDamage && defender.zone === ZONES.FIELD && (defender.currentHp <= 0 || result.destroyAfterAttackDamage || result.destroyAfterDamage)) {
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
          if (effect.type === 'APPLY_STAT_MODIFIER' && effect.target !== 'SELF' && effect.target !== 'SOURCE' && targetType === 'INSECT') {
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
          if (effect.type === 'FORCE_ATTACK_TO_SOURCE_NEXT_OPPONENT_TURN' && attacker.zone === ZONES.FIELD) {
            attacker.runtimeFlags = attacker.runtimeFlags || {};
            attacker.runtimeFlags.forceAttackTargetUntilTurn = state.turnNumber + 1;
          }
          if(effect.type==='SET_ATTACK_TARGET_COLOR_UNTIL_END_TURN'&&targetType==='INSECT'&&defender.zone===ZONES.FIELD){
            defender.runtimeFlags=defender.runtimeFlags||{};defender.runtimeFlags.colorOverride=effect.color;defender.runtimeFlags.colorOverrideUntil='UNTIL_END_OF_TURN';
          }
          if(effect.type==='TAX_OPPONENT_CARD_TYPE_AFTER_ATTACK'){
            var attackTaxPlayer=state.player(opponentId);attackTaxPlayer.runtimeCostModifiers=attackTaxPlayer.runtimeCostModifiers||[];
            attackTaxPlayer.runtimeCostModifiers.push({cardType:effect.cardType,amount:effect.amount,startTurn:state.turnNumber+(effect.startTurnOffset||0),endTurn:state.turnNumber+(effect.endTurnOffset||0)});
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
            transferExistingEnhancement(state,ap,transfer,destination);
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
      if (effect.type !== 'APPLY_STAT_MODIFIER' || (effect.target !== 'SELF' && effect.target !== 'SOURCE') || attacker.zone !== ZONES.FIELD) { return; }
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
      if(effect.type==='TARGET_ATTACHMENT_AFTER_ATTACK'&&targetType==='INSECT'){
        resumeAfterSelection(state,{type:'TARGET_ATTACHMENT_AFTER_ATTACK',playerId:ap,targetPlayerId:opponentId,targetInstanceId:targetInstanceId,fieldEntrySerial:attackedTargetFieldSerial,operation:effect.operation});
      }
      if(effect.type==='ATTACH_AFTER_ATTACK'){
        resumeAfterSelection(state,{type:'ATTACH_AFTER_ATTACK',playerId:ap,sourceInstanceId:attacker.instanceId,fieldEntrySerial:attackerFieldEntrySerial,effect:effect.attachment});
      }
      if(effect.type==='GROW_AFTER_ATTACK'){
        resumeAfterSelection(state,{type:'GROW_ATTACK_SOURCE',sourceInstanceId:attacker.instanceId,fieldEntrySerial:attackerFieldEntrySerial,amount:effect.amount,stats:effect.stats});
      }
      if (effect.type === 'HIDE_SOURCE_AFTER_ATTACK') {
        resumeAfterSelection(state, { type: 'HIDE_ATTACK_SOURCE', instanceId: attacker.instanceId,
          enteredFieldTurn: attacker.enteredFieldTurn, endTurn: state.turnNumber + effect.endTurnOffset });
      }
    });
    var optionalDiscard=(skill.effects||[]).filter(function(effect){return effect.type==='OPTIONAL_BOTTOM_DECK_OPPONENT_DISCARD';})[0];
    if(optionalDiscard){resumeAfterSelection(state,{type:'OPTIONAL_BOTTOM_DECK_DISCARD',playerId:ap,targetPlayerId:opponentId,maxSelections:optionalDiscard.maxSelections||1,faceDown:optionalDiscard.faceDown!==false});}
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
    var skill=getEffectiveAttackSkills(state,holder.instance).filter(function(s){return s.id===skillId;})[0];
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
    var skill=getEffectiveAttackSkills(state,attacker).filter(function(s){return s.id===skillId;})[0];
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
    var skill=getEffectiveAttackSkills(state,attacker).filter(function(s){return s.id===continuation.skillId;})[0];
    var results=[];
    for (var i=continuation.nextIndex;i<targetInstanceIds.length;i++) {
      if (attacker.zone !== ZONES.FIELD) { break; }
      var target=findInZone(state,state.opponentOf(continuation.playerId),ZONES.FIELD,targetInstanceIds[i]);
      if(!target||target.faceDown) { continue; }
      var multiAp=getEffectiveAP(state,attacker,skill.baseAp||0,skill);if(skill.bonusApAgainstAttached&&(defender.attachments||[]).length){multiAp+=skill.bonusApAgainstAttached;}
      var result={attackerInstanceId:attackerInstanceId,attacker:attacker,def:def,skill:skill,targetType:'INSECT',baseAp:skill.baseAp||0,apVal:multiAp,multiplier:1,damageDealt:0,defenderDestroyed:false};
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
  function snapshotAttackCostContinuation(state, attackerId, targetId, targetType, skillId) {
    var source = findAnywhere(state, attackerId), target = targetType === 'INSECT' && findAnywhere(state, targetId);
    var continuation = {type:'ATTACK_WITH_ADDITIONAL_COST',attackerInstanceId:attackerId,targetInstanceId:targetId,targetType:targetType,skillId:skillId,
      attackerFieldEntrySerial:source.instance.runtimeFlags.fieldEntrySerial||0,declaredTurnNumber:state.turnNumber};
    if (target) { continuation.targetPlayerId=target.playerId;continuation.targetFieldEntrySerial=target.instance.runtimeFlags.fieldEntrySerial||0; }
    return continuation;
  }

  function getPendingAttackCostStatus(state) {
    var pending = state.pendingEffect, c = pending && pending.continuation;
    if (!pending || pending.type !== 'CARD_SELECTION' || !c || c.type !== 'ATTACK_WITH_ADDITIONAL_COST') { return null; }
    var source = findInZone(state, pending.playerId, ZONES.FIELD, c.attackerInstanceId);
    var current = !!source && (c.attackerFieldEntrySerial == null ||
      (source.runtimeFlags.fieldEntrySerial||0) === c.attackerFieldEntrySerial && state.turnNumber === c.declaredTurnNumber);
    if (current && c.targetFieldEntrySerial != null) {
      var target = findInZone(state, c.targetPlayerId, ZONES.FIELD, c.targetInstanceId);
      current = !!target && (target.runtimeFlags.fieldEntrySerial||0) === c.targetFieldEntrySerial;
    }
    if (current) {
      var skill = getEffectiveAttackSkills(state,source).find(function(item) { return item.id === c.skillId; });
      current = !!skill && canPaySkillAdditionalCosts(state,c.attackerInstanceId,skill);
    }
    if (current) { current = getLegalAttackTargets(state,c.attackerInstanceId,c.skillId).some(function(target) { return target.targetType === c.targetType && (c.targetType !== 'INSECT' || target.instance.instanceId === c.targetInstanceId); }); }
    var candidates = pending.options.filter(function(id) {
      if (pending.selectionPurpose === 'ATTACK_ADDITIONAL_COST_FOOD') { return !!findInZone(state,pending.playerId,ZONES.FOOD,id); }
      var attachment = findAttachment(state,id);return !!attachment && attachment.playerId === pending.playerId;
    });
    return {canContinue:current && candidates.length >= pending.minSelections,candidateIds:candidates};
  }

  function cancelPendingAttackCost(state, playerId) {
    var status = getPendingAttackCostStatus(state), pending = state.pendingEffect;
    if (!status || pending.playerId !== playerId || status.canContinue) { throw new Error('続行できる攻撃の追加コストは取り消せません'); }
    state.pendingEffect = null;
    resumeAfterSelection(state, pending.afterResolution);
  }

  function payAdditionalCosts(state, attacker, additionalCosts, chosenSacrificeInstanceId, chosenFoodIds) {
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
        var foodIds=chosenFoodIds||[chosenSacrificeInstanceId];
        if(foodIds.length!==(cost.amount||1)||foodIds.some(function(id,index){return foodIds.indexOf(id)!==index||!findInZone(state,ownerId,ZONES.FOOD,id);}))throw new Error('必要な数の自分のエサを選択してください');
        foodIds.forEach(function(id){moveCard(state,id,ZONES.FOOD,ZONES.DISCARD,{playerId:ownerId});});
      }
      if(cost.type==='DESTROY_OWN_ATTACHMENT'){
        var selectedAttachment=findAttachment(state,chosenSacrificeInstanceId);
        if(!selectedAttachment||selectedAttachment.playerId!==ownerId)throw new Error('破壊する自分の強化カードを選択してください');
        var attachment=selectedAttachment.instance,host=selectedAttachment.host,index=selectedAttachment.index,oldMaxHp=calculateMaxHp(host,state);
        host.attachments.splice(index,1);attachment.zone=ZONES.DISCARD;state.player(attachment.ownerId).discard.push(attachment);resolveAttachmentDiscarded(state,attachment);preserveDamageAfterMaxHpChange(state,host,oldMaxHp);
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
    (!areInsectKeywordSkillsSuppressed(state,target) && def && def.passiveAbilities || []).forEach(function (ability, index) {
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
    if(isOpponentSpellPreventedByEntryWindow(state,target,sourceType,sourceInstanceId))damage=0;
    damage = preventDamage(state, target, damage, sourceType, result && result.skill);
    if (sourceType === 'ATTACK' && result && result.skill && (result.skill.effects || []).some(function(effect) { return effect.type === 'DAMAGE_DOES_NOT_HEAL'; })) {
      target.runtimeFlags = target.runtimeFlags || {};
      target.runtimeFlags.unhealableDamage = (target.runtimeFlags.unhealableDamage || 0) + Math.max(0, damage);
    }
    target.currentHp -= damage;
    // This marker is an already resolved effect. Losing the original trait
    // cannot remove it; even zero damage consumes it before replacement.
    result.destroyAfterDamage = !!(target.runtimeFlags && target.runtimeFlags.destroyOnNextDamage);
    if (result.destroyAfterDamage) { delete target.runtimeFlags.destroyOnNextDamage; }
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
    if ((target.currentHp <= 0 || result.destroyAfterAttackDamage || result.destroyAfterDamage) && !opts.deferDestruction) {
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
    if(isOpponentSpellPreventedByEntryWindow(state,destroyedCard,sourceType,sourceInstanceId))return destroyedCard;
    var defenderPlayerId = holder.playerId;
    var destroyedSnapshot = JSON.parse(JSON.stringify(destroyedCard));
    destroyedSnapshot.controllerId = defenderPlayerId;
    stampDestructionActor(state,destroyedSnapshot,sourceType,sourceInstanceId,result,opts);
    
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
      if (replacement.healToMax) destroyedCard.currentHp=calculateMaxHp(destroyedCard, state) - (destroyedCard.runtimeFlags && destroyedCard.runtimeFlags.unhealableDamage || 0);
      emitBattleEvent(state,'DESTROY_REPLACED',{targetInstanceId:targetInstanceId,replacementInstanceId:replacementAttachment.instanceId,damageType:sourceType});
      if(result){result.defenderDestroyed=false;result.destructionReplaced=true;result.defenderCurrentHp=destroyedCard.currentHp;}
      if (destroyedCard.currentHp <= 0) {
        return destroyInsect(state, targetInstanceId, sourceType, sourceInstanceId, result, opts);
      }
      return destroyedCard;
    }
    
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

    var destroyedDef = global.getCardDefinition ? global.getCardDefinition(destroyedCard.cardId) : null;
    var destroyedName = destroyedDef ? destroyedDef.name : destroyedCard.cardId;
    
    var suppressHostKeywords = destroyedCard.faceDown || areInsectKeywordSkillsSuppressed(state, destroyedCard);
    var destructionWatchers=collectOtherOwnDestructionTriggers(state,destroyedSnapshot,defenderPlayerId,sourceType,sourceInstanceId);
    var attackKillSource=sourceType==='ATTACK'&&findAnywhere(state,sourceInstanceId);
    var attackKillEffects=sourceType==='ATTACK'?collectAttackKillEffects(state,attackKillSource,result&&result.skill,defenderPlayerId):null;
    var deferAttachmentDestruction = !suppressHostKeywords && sourceType==='ATTACK' && (destroyedDef&&destroyedDef.passiveAbilities||[]).some(function(ability){return ability.timing==='ON_DESTROYED'&&(ability.effects||[]).some(function(effect){return effect.type==='OPTIONAL_RETURN_DESTROYED_HOST_ATTACHMENT';});});
    // FIELD→DISCARD へ移動 (1回だけ)
    moveCard(state, targetInstanceId, ZONES.FIELD, ZONES.DISCARD, { playerId: defenderPlayerId, deferAttachmentDestruction:deferAttachmentDestruction });
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
    var bottomDeckTrigger=capturingSource&&capturingSource.zone===ZONES.FIELD&&(capturingSource.instance.attachments||[]).some(function(att){var d=getCardDefinition(att.cardId);return d&&(d.enhancementEffects||[]).some(function(effect){return effect.type==='BOTTOM_DECK_HOST_ATTACK_KILL';});});
    resumeAfterSelection(state, { type: 'DESTROYED_CARD_FOLLOWUP', destroyedCard: destroyedSnapshot,
      defenderPlayerId: defenderPlayerId, sourceType: sourceType, sourceInstanceId: sourceInstanceId,
      deferredAttachmentIds:deferAttachmentDestruction?attachmentsSnapshot.map(function(att){return att.instanceId;}):[], attachmentsSnapshot: attachmentsSnapshot, suppressHostKeywords: suppressHostKeywords, skipTerritoryDraw: !!opts.skipTerritoryDraw,
      skill: result && result.skill || null, captureEffect:capture||null, captureControllerId:attackKillSource&&attackKillSource.playerId||null,attackKillEffects:attackKillEffects,
      hasBottomDeckTrigger:!!bottomDeckTrigger,destructionWatchers:destructionWatchers });
    return destroyedCard;
  }

  function finishDestroyedCard(state, context) {
    var destroyedCard = context.destroyedCard, sourceType = context.sourceType, sourceInstanceId = context.sourceInstanceId;
    var defenderPlayerId = context.defenderPlayerId;
    if(context.attackKillEffects){
      var killEffects=context.attackKillEffects;delete context.attackKillEffects;
      // Legacy saved continuations below retain their original schema. New
      // events resolve every attacker-side effect through one ordered queue.
      context.simultaneousAttackKillResolved=true;context.attackKillEnhancementsInitialized=true;context.attackKillDestroyChoices=0;
      continueAttackKillEffects(state,context,killEffects);return destroyedCard;
    }
    if(context.captureEffect&&context.hasBottomDeckTrigger&&!context.simultaneousAttackKillResolved){
      state.pendingEffect={type:'CHOICE_SELECTION',playerId:context.captureControllerId,controller:context.captureControllerId,selectionPurpose:'SIMULTANEOUS_EFFECT_ORDER',prompt:'同時に発生した効果の解決順を選んでください',options:[{value:'CAPTURE_FIRST',label:'操り針を先に解決'},{value:'BOTTOM_FIRST',label:'軍配虫の大団扇を先に解決'}],continuation:{type:'RESOLVE_SIMULTANEOUS_ATTACK_KILL',context:context}};return destroyedCard;
    }
    if(sourceType==='ATTACK'&&!context.attackKillEnhancementsInitialized){
      context.attackKillEnhancementsInitialized=true;context.attackKillDestroyChoices=0;
      var attackSource=findAnywhere(state,sourceInstanceId);
      if(attackSource&&attackSource.zone===ZONES.FIELD){
        (attackSource.instance.attachments||[]).forEach(function(att){var attDef=getCardDefinition(att.cardId);(attDef&&attDef.enhancementEffects||[]).forEach(function(effect){
          if(effect.type==='DESTROY_OPPONENT_CHOICE_AFTER_HOST_ATTACK_KILL')context.attackKillDestroyChoices++;
          if(effect.type==='BOTTOM_DECK_HOST_ATTACK_KILL'){
            if(!context.captureEffect||!context.hasBottomDeckTrigger)applyBottomDeckDestroyedCard(state,context,effect.faceDown!==false);
          }
        });});
      }
    }
    if(context.attackKillDestroyChoices>0){
      var remainingTargets=state.player(defenderPlayerId).field.filter(function(card){return !card.faceDown;});
      context.attackKillDestroyChoices--;
      if(remainingTargets.length){createCardSelection(state,{playerId:defenderPlayerId,controller:defenderPlayerId,options:remainingTargets.map(function(card){return card.instanceId;}),exactSelections:1,candidateZones:[ZONES.FIELD],selectionPurpose:'ATTACK_KILL_ENHANCEMENT_DESTROY',continuation:{type:'DESTROY_SELECTED_WITHOUT_TERRITORY',targetPlayerId:defenderPlayerId,sourceInstanceId:sourceInstanceId}});resumeAfterSelection(state,context);return destroyedCard;}
    }
    if(!context.suppressDestroyedCardTriggers){resolveOnDestroyedTriggers(state, destroyedCard, sourceType, sourceInstanceId, context.attachmentsSnapshot, context.suppressHostKeywords,context.destructionWatchers);}
    else if(context.destructionWatchers&&context.destructionWatchers.length){resumeAfterSelection(state,{type:'ORDER_TRIGGER_CONTINUATIONS',steps:context.destructionWatchers});}

    if(state.pendingEffect){resumeAfterSelection(state,{type:'DESTROYED_TERRITORY_FOLLOWUP',context:context});return destroyedCard;}
    return finishDestroyedTerritory(state,context);
  }

  function collectAttackKillEffects(state,source,skill,defenderPlayerId){
    if(!source||source.zone!==ZONES.FIELD||source.playerId===defenderPlayerId)return [];
    var jobs=[],sourceId=source.instance.instanceId,serial=source.instance.runtimeFlags.fieldEntrySerial||0;
    function add(effect,label,value){var key=value,index=1;while(jobs.some(function(job){return job.value===key;}))key=value+'_'+index++;
      jobs.push({effect:JSON.parse(JSON.stringify(effect)),label:label+'を先に解決',value:key,playerId:source.playerId,sourceInstanceId:sourceId,fieldEntrySerial:serial});}
    (skill&&skill.effects||[]).forEach(function(effect){if(effect.type==='CAPTURE_ATTACK_DESTROYED_TARGET')add(effect,skill.name,'CAPTURE_FIRST');if(effect.type==='GROW_ON_ATTACK_KILL')add(effect,skill.name,'GROW_FIRST');if(effect.type==='SELECT_ON_ATTACK_KILL')add(effect,skill.name,'SELECT_FIRST');});
    (source.instance.attachments||[]).forEach(function(att){var d=getCardDefinition(att.cardId);(d&&d.enhancementEffects||[]).forEach(function(effect){
      if(effect.type==='BOTTOM_DECK_HOST_ATTACK_KILL')add(effect,d.name,'BOTTOM_FIRST');
      if(effect.type==='DESTROY_OPPONENT_CHOICE_AFTER_HOST_ATTACK_KILL')add(effect,d.name,'DESTROY_FIRST');
    });});return jobs;
  }

  function continueAttackKillEffects(state,context,effects){
    var remaining=(effects||[]).slice();
    if(!remaining.length){finishDestroyedCard(state,context);return;}
    if(remaining.length===1){resolveAttackKillEffect(state,context,remaining[0]);resumeAfterSelection(state,{type:'ORDER_ATTACK_KILL_EFFECTS',context:context,effects:[]});return;}
    state.pendingEffect={type:'CHOICE_SELECTION',playerId:remaining[0].playerId,controller:remaining[0].playerId,selectionPurpose:'SIMULTANEOUS_EFFECT_ORDER',prompt:'同時に発生した効果の解決順を選んでください',options:remaining.map(function(job){return {value:job.value,label:job.label};}),continuation:{type:'CHOOSE_ATTACK_KILL_ORDER',context:context,effects:remaining}};
  }

  function resolveAttackKillEffect(state,context,job){
    var effect=job.effect;
    if(effect.type==='SELECT_ON_ATTACK_KILL'){resumeAfterSelection(state,{type:'FIELD_ENTRY_EFFECT',playerId:job.playerId,sourceInstanceId:job.sourceInstanceId,optional:true,effect:effect.selection});return;}
    if(effect.type==='CAPTURE_ATTACK_DESTROYED_TARGET'){applyCaptureDestroyedCard(state,context);return;}
    if(effect.type==='BOTTOM_DECK_HOST_ATTACK_KILL'){applyBottomDeckDestroyedCard(state,context,effect.faceDown!==false);return;}
    if(effect.type==='GROW_ON_ATTACK_KILL'){resumeAfterSelection(state,{type:'GROW_ATTACK_SOURCE',sourceInstanceId:job.sourceInstanceId,fieldEntrySerial:job.fieldEntrySerial,amount:effect.amount,stats:effect.stats});return;}
    if(effect.type==='DESTROY_OPPONENT_CHOICE_AFTER_HOST_ATTACK_KILL'){
      var remainingTargets=state.player(context.defenderPlayerId).field.filter(function(card){return !card.faceDown;});
      if(remainingTargets.length)createCardSelection(state,{playerId:context.defenderPlayerId,controller:context.defenderPlayerId,options:remainingTargets.map(function(card){return card.instanceId;}),exactSelections:1,candidateZones:[ZONES.FIELD],selectionPurpose:'ATTACK_KILL_ENHANCEMENT_DESTROY',continuation:{type:'DESTROY_SELECTED_WITHOUT_TERRITORY',targetPlayerId:context.defenderPlayerId,sourceInstanceId:job.sourceInstanceId}});
    }
  }

  function canPaySkillAdditionalCosts(state, attackerInstanceId, skill) {
    var holder=findAnywhere(state,attackerInstanceId);
    if(!holder||holder.zone!==ZONES.FIELD)return false;
    var player=state.player(holder.playerId);
    return (skill&&skill.additionalCost||[]).every(function(cost){
      var count=cost.amount||1;
      if(cost.type==='SACRIFICE_OWN_INSECT')return player.field.filter(function(card){return card.instanceId!==attackerInstanceId&&!card.faceDown;}).length>=count;
      if(cost.type==='SACRIFICE_OWN_FOOD')return player.food.length>=count;
      if(cost.type==='DESTROY_OWN_ATTACHMENT'){
        var attachments=0;player.field.forEach(function(host){attachments+=(host.attachments||[]).length;});return attachments>=count;
      }
      return false;
    });
  }

  function applyCaptureDestroyedCard(state,context){
    if(context.attackKillTargetMoved)return false;
    var holder=findAnywhere(state,context.destroyedCard.instanceId);if(!holder||holder.zone!==ZONES.DISCARD)return false;
    context.attackKillTargetMoved=true;
    moveCard(state,context.destroyedCard.instanceId,ZONES.DISCARD,ZONES.FIELD,{playerId:context.captureControllerId});
    var captured=findAnywhere(state,context.destroyedCard.instanceId);if(captured&&context.captureEffect.destroyAtEndTurn)captured.instance.runtimeFlags.destroyAtEndTurn=state.turnNumber;
    return true;
  }

  function applyBottomDeckDestroyedCard(state,context,faceDown){
    if(context.attackKillTargetMoved)return false;
    var holder=findAnywhere(state,context.destroyedCard.instanceId);if(!holder||holder.zone!==ZONES.DISCARD)return false;
    context.attackKillTargetMoved=true;
    moveCard(state,context.destroyedCard.instanceId,ZONES.DISCARD,ZONES.DECK,{playerId:context.destroyedCard.ownerId,faceDown:faceDown!==false});return true;
  }

  function finishDestroyedTerritory(state, context) {
    var destroyedCard=context.destroyedCard,sourceType=context.sourceType,sourceInstanceId=context.sourceInstanceId,defenderPlayerId=context.defenderPlayerId;
    if(context.deferredAttachmentIds&&context.deferredAttachmentIds.length){
      var deferredId=context.deferredAttachmentIds.shift(),deferredHolder=findAnywhere(state,deferredId);
      if(deferredHolder&&deferredHolder.zone===ZONES.DISCARD)resolveAttachmentDiscarded(state,deferredHolder.instance);
      resumeAfterSelection(state,{type:'DESTROYED_TERRITORY_FOLLOWUP',context:context});return destroyedCard;
    }

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
  function collectOtherOwnDestructionTriggers(state,destroyedCard,controllerId,sourceType,sourceInstanceId){
    var jobs=[];
    if(destroyedCard.faceDown)return jobs;
    state.player(controllerId).field.forEach(function(watcher){
      if(watcher.instanceId===destroyedCard.instanceId||watcher.faceDown||areInsectKeywordSkillsSuppressed(state,watcher))return;
      var definition=getCardDefinition(watcher.cardId),snapshot=JSON.parse(JSON.stringify(watcher));snapshot.controllerId=controllerId;
      (definition&&definition.passiveAbilities||[]).forEach(function(ability,index){
        if(ability.timing!=='ON_OTHER_OWN_INSECT_DESTROYED'||!checkCondition(state,snapshot,ability.condition,sourceType,sourceInstanceId))return;
        jobs.push({triggerId:'watcher-'+watcher.instanceId+'-'+index,playerId:controllerId,label:definition.name+'〈'+ability.name+'〉',continuation:{type:'RESOLVE_DESTROYED_ABILITY',sourceCard:snapshot,ability:ability,sourceType:sourceType,sourceInstanceId:sourceInstanceId}});
      });
    });return jobs;
  }

  function resolveOnDestroyedTriggers(state, destroyedCard, sourceType, sourceInstanceId, attachmentsSnapshot, suppressHostKeywords,watcherTriggers) {
    var def=getCardDefinition(destroyedCard.cardId),before=[],after=[],attachmentSteps=[];
    function step(ability){return {type:'RESOLVE_DESTROYED_ABILITY',sourceCard:destroyedCard,ability:ability,sourceType:sourceType,sourceInstanceId:sourceInstanceId};}
    if(!suppressHostKeywords)(def&&def.passiveAbilities||[]).forEach(function(ability){
      if(ability.timing!=='ON_DESTROYED')return;
      (ability.resolutionPhase==='AFTER_ATTACHMENT_TRIGGERS'?after:before).push(step(ability));
    });
    (attachmentsSnapshot||[]).forEach(function(attachment){
      var attachmentDef=getCardDefinition(attachment.cardId);
      (attachmentDef&&attachmentDef.passiveAbilities||[]).forEach(function(ability){if(ability.timing==='ON_DESTROYED')attachmentSteps.push(step(ability));});
    });
    if(watcherTriggers&&watcherTriggers.length){
      var controller=destroyedCard.controllerId||destroyedCard.ownerId,attachmentIds=attachmentSteps.map(function(work,index){return 'attachment-'+index;}),jobs=[];
      before.forEach(function(work,index){jobs.push({triggerId:'host-'+index,playerId:controller,label:def.name+'〈'+work.ability.name+'〉',continuation:work});});
      attachmentSteps.forEach(function(work,index){jobs.push({triggerId:attachmentIds[index],playerId:controller,label:work.ability.name||'強化カードの破壊時効果',continuation:work});});
      after.forEach(function(work,index){jobs.push({triggerId:'host-after-'+index,dependsOn:attachmentIds.slice(),playerId:controller,label:def.name+'〈'+work.ability.name+'〉',continuation:work});});
      resumeAfterSelection(state,{type:'ORDER_TRIGGER_CONTINUATIONS',steps:jobs.concat(watcherTriggers)});
    }else resumeAfterSelection(state,{type:'SEQUENCE',steps:before.concat(attachmentSteps,after)});
  }

  // 条件チェック
  function checkCondition(state, card, condition, sourceType, sourceInstanceId) {
    if (!condition) { return true; }
    if (condition.type === 'HAD_ATTACHMENT_WHEN_DESTROYED') { return (card.attachments || []).length > 0; }
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
    if(effect.type==='DRAW_OPPONENT_TERRITORY'){drawTerritoryCard(state,state.opponentOf(sourceCard.controllerId||sourceCard.ownerId));return;}
    if (effect.type === 'MARK_ATTACK_SOURCE_DESTROY_ON_NEXT_CONTROLLER_TURN') {
      var marked = sourceInstanceId && findAnywhere(state, sourceInstanceId);
      if (marked && marked.zone === ZONES.FIELD) {
        marked.instance.runtimeFlags = marked.instance.runtimeFlags || {};
        marked.instance.runtimeFlags.destroyOnAttackTurn = state.turnNumber + (state.activePlayerId === sourceCard.ownerId ? 2 : 1);
      }
    }
    if (effect.type === 'MARK_ATTACK_SOURCE_DESTROY_ON_NEXT_DAMAGE') {
      var markedDamageSource = sourceInstanceId && findAnywhere(state,sourceInstanceId);
      if (markedDamageSource && markedDamageSource.zone === ZONES.FIELD) {
        markedDamageSource.instance.runtimeFlags = markedDamageSource.instance.runtimeFlags || {};
        markedDamageSource.instance.runtimeFlags.destroyOnNextDamage = true;
      }
    }
    if(effect.type==='OPPONENT_DISCARD_HAND'){
      var controllerId=sourceCard.controllerId||sourceCard.ownerId,discardPlayerId=state.opponentOf(controllerId),discardHand=state.player(discardPlayerId).hand;
      if(discardHand.length){createCardSelection(state,{playerId:discardPlayerId,options:discardHand.map(function(c){return c.instanceId;}),exactSelections:Math.min(effect.count||1,discardHand.length),candidateZones:[ZONES.HAND],selectionPurpose:'OPPONENT_HAND_DISCARD',continuation:{type:'DISCARD_SELECTED_HAND',targetPlayerId:discardPlayerId}});}
    }
    if(effect.type==='OPTIONAL_SUPPRESS_OWN_TERRITORY'){
      var choicePlayer=sourceCard.controllerId||sourceCard.ownerId;state.pendingEffect={type:'CHOICE_SELECTION',playerId:choicePlayer,controller:choicePlayer,prompt:'縄張りを引かないことを選びますか',options:[{value:'SUPPRESS',label:'引かない'},{value:'ALLOW',label:'引く'}],continuation:{type:'SUPPRESS_DESTROYED_TERRITORY',sourceInstanceId:sourceCard.instanceId,fieldEntrySerial:sourceCard.runtimeFlags&&sourceCard.runtimeFlags.fieldEntrySerial||0}};
    }
    if(effect.type==='OPTIONAL_FLIP_OPPONENT_FOOD_ON_DESTROYED'){
      var flipController=sourceCard.controllerId||sourceCard.ownerId,flipOpponent=state.opponentOf(flipController);
      var flipCandidates=state.player(flipOpponent).food.filter(function(card){return !card.faceDown;});
      if(flipCandidates.length){createCardSelection(state,{playerId:flipController,options:flipCandidates.map(function(card){return card.instanceId;}),minSelections:0,maxSelections:Math.min(effect.maxSelections||1,flipCandidates.length),candidateZones:[ZONES.FOOD],selectionPurpose:'FLIP_OPPONENT_FOOD',continuation:{type:'FLIP_SELECTED_FOOD',targetPlayerId:flipOpponent}});}
    }
    if(effect.type==='OPTIONAL_RETURN_DESTROYED_HOST_ATTACHMENT'){
      var returnedController=sourceCard.controllerId||sourceCard.ownerId,returnIds=(sourceCard.attachments||[]).map(function(att){return att.instanceId;}).filter(function(id){var current=findAnywhere(state,id);return current&&current.zone===ZONES.DISCARD;});
      if(returnIds.length)createCardSelection(state,{playerId:returnedController,controller:returnedController,options:returnIds,minSelections:0,maxSelections:1,candidateZones:[ZONES.DISCARD],selectionPurpose:'RETURN_DESTROYED_HOST_ATTACHMENT',continuation:{type:'RETURN_DESTROYED_HOST_ATTACHMENT',attachmentIds:returnIds}});
    }
    if(effect.type==='OPTIONAL_RETURN_OWN_DISCARD_ENHANCEMENT'){
      var retrievalController=sourceCard.controllerId||sourceCard.ownerId,retrievalOptions=state.player(retrievalController).discard.filter(function(card){var definition=getCardDefinition(card.cardId);return definition&&definition.type===CardTypes.ENHANCEMENT;});
      if(retrievalOptions.length){createCardSelection(state,{playerId:retrievalController,options:retrievalOptions.map(function(card){return card.instanceId;}),minSelections:0,maxSelections:Math.min(effect.maxSelections||1,retrievalOptions.length),candidateZones:[ZONES.DISCARD],selectionPurpose:'RETURN_OWN_DISCARD_ENHANCEMENT',continuation:{type:'MOVE_DISCARD_TO_HAND',targetPlayerId:retrievalController}});}
    }
    
    // MOVE_CARD: カード移動
    if (effect.type === 'MOVE_CARD') {
      var target = effect.target === 'SOURCE' ? sourceCard : 
        (effect.targetId && global.findAnywhere(state, effect.targetId) ? global.findAnywhere(state, effect.targetId).instance : null);
      var currentHolder = target && global.findAnywhere(state, target.instanceId);
      if (currentHolder && currentHolder.zone === effect.from && effect.to) {
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
          sourceControllerId:sourceCard.controllerId||sourceCard.ownerId,
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
          global.destroyInsect(state, sourceInstanceId, 'ABILITY', sourceCard.instanceId, null, { skipTerritoryDraw: true, sourceControllerId:sourceCard.controllerId||sourceCard.ownerId });
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

  function destroyAttachedEnhancement(state, holder){
    var previousMax=calculateMaxHp(holder.host,state),attachment=holder.instance;
    holder.host.attachments.splice(holder.index,1);attachment.zone=ZONES.DISCARD;attachment.controllerId=attachment.ownerId;
    state.player(attachment.ownerId).discard.push(attachment);
    resolveAttachmentDiscarded(state,attachment);
    preserveDamageAfterMaxHpChange(state,holder.host,previousMax);
    return attachment;
  }

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
    if(trackedEffect&&trackedIds&&trackedIds.length){resumeAfterSelection(state,{type:'DESTROY_TRACKED_SEQUENCE',instanceIds:trackedIds.slice(),attachmentInstanceId:attachment.instanceId});}
    var linkedCopies=[];state.playerOrder.forEach(function(playerId){state.player(playerId).field.forEach(function(host){(host.attachments||[]).forEach(function(candidate){if(candidate.runtimeFlags&&candidate.runtimeFlags.copiedEnhancementSourceId===attachment.instanceId)linkedCopies.push(candidate.instanceId);});});});
    linkedCopies.forEach(function(copyId){var copy=findAttachment(state,copyId);if(!copy)return;var oldMax=calculateMaxHp(copy.host,state);copy.host.attachments.splice(copy.index,1);copy.instance.zone=ZONES.DISCARD;state.player(copy.instance.ownerId).discard.push(copy.instance);resolveAttachmentDiscarded(state,copy.instance);preserveDamageAfterMaxHpChange(state,copy.host,oldMax);});
  }

  function healFieldDamage(state, player) {
    player.field.forEach(function (c) {
      if (!(c.runtimeFlags && c.runtimeFlags.damageDoesNotHeal)) {
        c.currentHp = calculateCurrentMaxHp(c, state) - (c.runtimeFlags && c.runtimeFlags.unhealableDamage || 0);
      }
    });
  }

function endTurn(state) {
    if(state.phase===Phases.GAME_OVER)return state;
    assertNoPendingEffect(state);assertActivePlayer(state,state.activePlayerId);
    if(state.phase!==Phases.MAIN_PHASE)throw new Error('メインフェイズ以外ではターンを終了できません');
    var ap=state.activePlayerId,turn=state.turnNumber,returns=[],destructions=[],attachments=[],territories=[];
    state.player(ap).availableCost=0;
    state.playerOrder.forEach(function(pid){state.player(pid).field.forEach(function(card){
      var flags=card.runtimeFlags||{},entrySerial=flags.fieldEntrySerial||0;
      if(flags.returnToOwnerHandAtEndTurn===turn)returns.push({type:'END_TURN_FIELD_RETURN',instanceId:card.instanceId,fieldEntrySerial:entrySerial,turnNumber:turn});
      if(flags.destroyAtEndTurn===turn||flags.destroyAtEndTurnUnlessAttached===turn)destructions.push({type:'END_TURN_FIELD_DESTRUCTION',instanceId:card.instanceId,fieldEntrySerial:entrySerial,turnNumber:turn});
      (card.attachments||[]).forEach(function(att){if(att.runtimeFlags&&att.runtimeFlags.destroyAtEndTurn===turn)attachments.push({type:'END_TURN_ATTACHMENT_DESTRUCTION',instanceId:att.instanceId,turnNumber:turn});});
    });state.player(pid).territory.forEach(function(card){if(card.runtimeFlags&&card.runtimeFlags.discardTerritoryAtEndTurn===turn)territories.push({type:'END_TURN_TERRITORY_DISCARD',instanceId:card.instanceId,turnNumber:turn});});});
    resumeAfterSelection(state,{type:'SEQUENCE',steps:returns.concat(destructions,attachments,territories,[{type:'FINISH_END_TURN',playerId:ap,turnNumber:turn}])});
    return state;
  }

  function finishEndTurn(state, continuation) {
    if(state.activePlayerId!==continuation.playerId||state.turnNumber!==continuation.turnNumber)throw new Error('ターン終了の継続状態が不正です');
    var ap=continuation.playerId,player=state.player(ap);
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
    var nextPlayerId = state.opponentOf(ap);
    state.turnNumber += 1;
    // ターン番号更新に伴い、期限切れ statModifier を全場面で掃除
    var refreshSteps=[];
    allPlayers.forEach(function(pid){state.player(pid).field.forEach(function(card){refreshSteps.push({type:'END_TURN_REFRESH_STATS',instanceId:card.instanceId,fieldEntrySerial:card.runtimeFlags.fieldEntrySerial||0,previousTurn:state.turnNumber-1});});});
    refreshSteps.push({type:'BEGIN_TURN_AFTER_END',playerId:nextPlayerId,previousPlayerId:ap,turnNumber:state.turnNumber});
    resumeAfterSelection(state,{type:'SEQUENCE',steps:refreshSteps});
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
      var territoryDef=getCardDefinition(card.cardId);
      var territorySkill=territoryDef&&(territoryDef.skills||[]).filter(function(skill){return skill.id===pending.skillId;})[0];
      if(territorySkill&&(territorySkill.effects||[]).some(function(effect){return effect.type==='KABAU_TERRITORY_ENTRY';})){
        card.runtimeFlags=card.runtimeFlags||{};
        card.runtimeFlags.forceAttackTargetUntilTurn=state.turnNumber;
        card.runtimeFlags.returnToOwnerHandAtEndTurn=state.turnNumber;
      }
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
  global.getFieldAbilityActions = getFieldAbilityActions;
  global.activateFieldAbility = activateFieldAbility;
  global.getPendingEntrySelectionConstraints = getPendingEntrySelectionConstraints;
  global.getPendingFieldAbilityCandidates = getPendingFieldAbilityCandidates;
  global.getPendingAttackCostStatus = getPendingAttackCostStatus;
  global.cancelPendingAttackCost = cancelPendingAttackCost;
  global.resolveSpellEffects = resolveSpellEffects;
  global.getLegalAttackTargets = getLegalAttackTargets;
  global.getEffectiveAttackSkills = getEffectiveAttackSkills;
  global.areInsectKeywordSkillsSuppressed = areInsectKeywordSkillsSuppressed;
  global.performAttack = performAttack;
  global.performMultiTargetAttack = performMultiTargetAttack;
  global.beginMultiTargetAttackSelection = beginMultiTargetAttackSelection;
  global.skillRequiresSacrifice = skillRequiresSacrifice;
  global.canPaySkillAdditionalCosts = canPaySkillAdditionalCosts;
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
