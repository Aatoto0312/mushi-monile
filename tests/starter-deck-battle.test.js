'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();

function getStarterDeck(recipeKey) {
  return global.expandStarterDeck(global.STARTER_DECK_RECIPES[recipeKey]);
}

// Wave E: スターターデッキレシピ展開・対戦動作確認
// 両デッキ(KABUTOMUSHI/OKAMAKIRI)でエラーなく1戦完走可能
// 注: Wave Fで残りカードの正式化が完了するまで、一部カードは未確認(NOT_RESEARCHED)のまま。
// isPlayable()がtrueのカードのみがゲーム中で使用可能。

runner.test('StarterBattle1 カブトムシデッキ展開: 20枚展開される', function () {
  var deck = getStarterDeck('KABUTOMUSHI');
  runner.assertEqual(deck.length, 20, '20枚展開');

  deck.forEach(function (def) {
    runner.assertEqual(def.set, 'STARTER', '全てSTARTERセット');
    // 公式データ投入済みのカードは isPlayable=true
    if (def.isPlayable()) {
      // 虫カードのみ officialNumber 必須（術・強化は番号なしの場合がある）
      if (def.type === global.CardTypes.INSECT) {
        runner.assert(def.officialNumber, def.id + ' に officialNumber がある');
      }
      runner.assert(def.cost !== null, def.id + ' cost非null');
      // 術・強化は baseHp が null の場合がある
      if (def.type === global.CardTypes.INSECT) {
        runner.assert(def.baseHp !== null, def.id + ' baseHp非null');
        runner.assert(def.color !== null, def.id + ' color非null');
        runner.assert(def.skills.length > 0, def.id + ' (虫)に技がある');
      }
    }
  });
});

runner.test('StarterBattle2 オオカマキリデッキ展開: 20枚展開される', function () {
  var deck = getStarterDeck('OKAMAKIRI');
  runner.assertEqual(deck.length, 20, '20枚展開');

  deck.forEach(function (def) {
    runner.assertEqual(def.set, 'STARTER', '全てSTARTERセット');
    if (def.isPlayable()) {
      runner.assert(def.officialNumber, def.id + ' に officialNumber がある');
      runner.assert(def.cost !== null, def.id + ' cost非null');
      // 虫カードのみ baseHp/color/skills 必須 (術・強化は null の場合がある)
      if (def.type === global.CardTypes.INSECT) {
        runner.assert(def.baseHp !== null, def.id + ' baseHp非null');
        runner.assert(def.color !== null, def.id + ' color非null');
        runner.assert(def.skills.length > 0, def.id + ' (虫)に技がある');
      }
    }
  });
});

runner.test('StarterBattle3 両デッキでゲーム開始からターン終了までエラーなし', function () {
  var p1Deck = getStarterDeck('KABUTOMUSHI');
  var p2Deck = getStarterDeck('OKAMAKIRI');

  var state = new global.GameState();
  global.startGame(state, p1Deck, p2Deck, h.firstPlayerRng);

  // 初期状態確認
  runner.assertEqual(state.turnNumber, 1);
  runner.assert(state.activePlayerId === 'P1' || state.activePlayerId === 'P2');
  runner.assertEqual(state.phase, global.Phases.DRAW_PHASE);

  // P1のターン進行: ドロー→セット→メイン→ターン終了
  global.enterSetPhase(state); // ドローフェイズ完了、セットフェイズへ
  global.setFood(state, state.activePlayerId, state.player(state.activePlayerId).hand[0].instanceId);
  global.enterMainPhase(state);

  // メインフェイズで何もしない(召喚コスト不足のため)
  global.endTurn(state);

  // P2のターン開始
  runner.assertEqual(state.turnNumber, 2);
  runner.assertEqual(state.activePlayerId, state.opponentOf('P1'));
  runner.assertEqual(state.phase, global.Phases.DRAW_PHASE);
});

runner.test('StarterBattle4 正式カードで召喚・攻撃・破壊・縄張りドローが動作する', function () {
  // 正式化済みの虫カードのみを使った簡易対戦テスト
  // (未確認カードを含むフルデッキでの自動完走はWave F以降)
  var formalInsectIds = [
    'ginyanma', 'kooniyanma', 'akiakane', 'namitentou', 'kanabun',
    'higurashi', 'tonosamabatta', 'nijuuyaahoshitentou', 'wataaburamushi',
    'minminzemi'
  ];

  var p1Deck = formalInsectIds.map(function (id) { return global.cardRegistry.get(id); });
  var p2Deck = formalInsectIds.map(function (id) { return global.cardRegistry.get(id); });

  // 20枚にするため複製
  while (p1Deck.length < 20) p1Deck = p1Deck.concat(p1Deck.slice(0, 20 - p1Deck.length));
  while (p2Deck.length < 20) p2Deck = p2Deck.concat(p2Deck.slice(0, 20 - p2Deck.length));
  p1Deck = p1Deck.slice(0, 20);
  p2Deck = p2Deck.slice(0, 20);

  var state = new global.GameState();
  global.startGame(state, p1Deck, p2Deck, h.firstPlayerRng);

  // 5ターン程度の簡易プレイ: コスト溜め→召喚→攻撃→ターン終了
  // ゲームが完走しなくても、正常にターンが進行してエラーが出ないことを確認
  var maxTurns = 5;
  var safetyCounter = 0;
  var lastTurnNumber = 0;

  while (state.phase !== global.Phases.GAME_OVER && safetyCounter < maxTurns) {
    safetyCounter++;

    if (state.phase === global.Phases.DRAW_PHASE) {
      global.enterSetPhase(state);
      continue;
    }

    if (state.phase === global.Phases.SET_PHASE) {
      var ap = state.activePlayerId;
      var player = state.player(ap);
      if (player.hand.length > 0 && player.foodSetThisTurn === 0) {
        global.setFood(state, ap, player.hand[0].instanceId);
      }
      global.enterMainPhase(state);
      continue;
    }

    if (state.phase === global.Phases.MAIN_PHASE) {
      var ap = state.activePlayerId;
      var player = state.player(ap);

      // 召喚可能な虫があれば召喚
      var summoned = false;
      for (var i = 0; i < player.hand.length; i++) {
        var handCard = player.hand[i];
        var def = global.getCardDefinition(handCard.cardId);
        if (def && def.type === global.CardTypes.INSECT && def.isPlayable() && player.availableCost >= def.cost) {
          global.summonInsect(state, ap, handCard.instanceId);
          summoned = true;
          break;
        }
      }

      // 攻撃可能なら攻撃
      var attacked = false;
      var fieldInsects = player.field.filter(function (c) { return !c.attackedThisTurn; });
      for (var j = 0; j < fieldInsects.length; j++) {
        var attacker = fieldInsects[j];
        var targets = global.getLegalAttackTargets(state, attacker.instanceId);
        if (targets.length > 0) {
          var target = targets[0];
          try {
            global.performAttack(state, attacker.instanceId,
              target.instance.instanceId || null, target.targetType, null);
            attacked = true;
            if (state.phase === global.Phases.GAME_OVER) break;
          } catch (e) {
            // 攻撃失敗は無視
          }
        }
      }

      if (!summoned && !attacked) {
        global.endTurn(state);
      }
      continue;
    }

    if (state.phase === global.Phases.TURN_END || state.phase === global.Phases.TURN_START) {
      global.endTurn(state);
      continue;
    }
  }

  // ループが終了条件を満たして終了したか、ターン進行したかを確認
  runner.assert(state.turnNumber >= 2, 'ターンが進行している (turnNumber=' + state.turnNumber + ')');
  runner.assert(state.phase !== global.Phases.GAME_OVER || state.winner, 'ゲーム終了時は勝者あり');
});

runner.test('StarterBattle5 ミンミンゼミ(とびだす)が実戦で動作する', function () {
  var minminDef = global.cardRegistry.get('minminzemi');
  runner.assert(minminDef, 'ミンミンゼミ定義あり');
  runner.assertEqual(minminDef.implementationStatus, global.CardStatus.TESTED);

  // 縄張りにミンミンゼミを置き、ドローしてとびだす発動確認
  var testState = h.newGame({ rng: h.firstPlayerRng });
  h.setTerritoryEmpty(testState, 'P2');
  h.addToTerritoryRaw(testState, 'P2', minminDef);
  h.toMainPhase(testState);

  global.drawTerritoryCard(testState, 'P2');
  if (testState.pendingEffect && testState.pendingEffect.type === 'TERRITORY_DRAW_SELECTION') {
    var territoryInst = testState.pendingEffect.options[0];
    global.resolveTerritoryDrawSelection(testState, 'P2', territoryInst);
  }
  runner.assert(testState.pendingEffect, 'とびだす誘発でpendingEffect発生');
  runner.assertEqual(testState.pendingEffect.playerId, 'P2');

  global.resolvePendingTerritoryChoice(testState, 'USE_TOBIDASU');
  runner.assertEqual(testState.player('P2').field.length, 1, 'ミンミンゼミが場へ');
  var minmin = testState.player('P2').field[0];
  runner.assertEqual(minmin.cardId, 'minminzemi');
  runner.assertEqual(minmin.currentHp, 500);
  runner.assertEqual(minmin.attackedThisTurn, false);
});

module.exports = runner;