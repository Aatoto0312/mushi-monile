'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();

// Test 14: ターン終了
runner.test('Test14 ターン終了でavailableCost=0になり交代', function () {
  var state = h.newGame({ rng: h.firstPlayerRng }); // P1先攻
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_blue_1')); // food=2
  h.toMainPhase(state);
  runner.assertEqual(state.player('P1').availableCost, 2, 'コスト獲得後=2');
  global.endTurn(state);
  runner.assertEqual(state.player('P1').availableCost, 0, 'availableCost=0');
  runner.assertEqual(state.activePlayerId, 'P2', 'アクティブ交代');
  runner.assertEqual(state.turnNumber, 2, 'turnNumber=2');
});

// Test 15: 勝利
runner.test('Test15 相手縄張り0で本体攻撃 → winner=attacker', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.toMainPhase(state);
  h.setTerritoryEmpty(state, 'P2');
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');
  global.performAttack(state, attacker.instanceId, null, 'LEADER', null);
  runner.assertEqual(state.winner, 'P1', 'winner=P1');
  runner.assertEqual(state.phase, global.Phases.GAME_OVER, 'ゲーム終了');
});

module.exports = runner;
