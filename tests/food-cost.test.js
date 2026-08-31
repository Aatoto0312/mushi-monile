'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();
var defs = {
  red1: 'test_red_1',
  blue1: 'test_blue_1'
};

// Test 4: エサセット
runner.test('Test4 初期手札4枚から1枚エサへ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  state.phase = global.Phases.SET_PHASE; // P1アクティブ, SET_PHASE
  var card = h.firstHandInsect(state, 'P1');
  runner.assert(card, '手札に虫がある');
  global.setFood(state, 'P1', card.instanceId);
  runner.assertEqual(state.player('P1').hand.length, 3, 'Hand=3');
  runner.assertEqual(state.player('P1').food.length, 1, 'Food=1');
});

// Test 5: メイン開始コスト
runner.test('Test5 Food=1ならavailableCost=1', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById(defs.red1)); // food=1
  h.toMainPhase(state);
  runner.assertEqual(state.player('P1').food.length, 1, 'Food=1');
  runner.assertEqual(state.player('P1').availableCost, 1, 'availableCost=1');
});

// Test 6: コスト支払い
runner.test('Test6 1コスト虫を召喚してもエサは減らない', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById(defs.red1)); // food
  h.addToFoodRaw(state, 'P1', h.defById(defs.blue1)); // food=2
  var summonCard = h.addToHandRaw(state, 'P1', h.defById(defs.red1)); // cost1
  h.toMainPhase(state);
  runner.assertEqual(state.player('P1').availableCost, 2, 'availableCost=2');
  global.summonInsect(state, 'P1', summonCard.instanceId);
  runner.assertEqual(state.player('P1').food.length, 2, 'Food=2(減らない)');
  runner.assertEqual(state.player('P1').availableCost, 1, 'availableCost=1');
});

// Test 7: FoodとavailableCostは独立
runner.test('Test7 エサが増えてもavailableCostは自動増加しない', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  state.phase = global.Phases.MAIN_PHASE;
  state.player('P1').availableCost = 1; // 手動で1に
  h.addToFoodRaw(state, 'P1', h.defById(defs.red1));
  h.addToFoodRaw(state, 'P1', h.defById(defs.blue1));
  runner.assertEqual(state.player('P1').food.length, 2, 'Food=2');
  runner.assertEqual(state.player('P1').availableCost, 1, 'availableCostは1のまま');
});

// Test 19: 1ターンのエサセットは1回まで
runner.test('Test19 1ターンのエサセット2回目は拒否', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  state.phase = global.Phases.SET_PHASE;
  var card1 = h.firstHandInsect(state, 'P1');
  global.setFood(state, 'P1', card1.instanceId);
  var card2 = h.firstHandInsect(state, 'P1');
  var threw = false;
  try {
    global.setFood(state, 'P1', card2.instanceId);
  } catch (e) { threw = true; }
  runner.assert(threw, '2回目は拒否される');
});

// Test 28: SET_PHASE以外でエサセット不可
runner.test('Test28 SET_PHASE以外でエサセット不可', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  state.phase = global.Phases.MAIN_PHASE;
  var card = h.firstHandInsect(state, 'P1');
  var threw = false;
  try { global.setFood(state, 'P1', card.instanceId); } catch (e) { threw = true; }
  runner.assert(threw, 'MAIN_PHASEでエサセットは拒否');
});

// Test 20: MAIN_PHASEへ2回入ってコストを再獲得できない
runner.test('Test20 メインフェイズへ2回入れない', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.toMainPhase(state);
  var cost = state.player('P1').availableCost;
  var threw = false;
  try { global.enterMainPhase(state); } catch (e) { threw = true; }
  runner.assert(threw, '2回目のメインフェイズ遷移は拒否');
  runner.assertEqual(state.player('P1').availableCost, cost, 'コストは再獲得されない');
});

module.exports = runner;
