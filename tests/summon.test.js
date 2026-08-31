'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();

// Test 8: 虫召喚
runner.test('Test8 召喚後 HAND-1 / FIELD+1 / currentHp=baseHp', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var def = h.defById('test_red_1');
  var handBefore = state.player('P1').hand.length;
  h.addToFoodRaw(state, 'P1', def); // コスト確保 food=1
  var summonCard = h.addToHandRaw(state, 'P1', def);
  h.toMainPhase(state); // availableCost = food.length = 1 (red_1 cost1)
  global.summonInsect(state, 'P1', summonCard.instanceId);
  runner.assertEqual(state.player('P1').hand.length, handBefore, 'HAND - 0(追加分のみ消費)');
  runner.assertEqual(state.player('P1').field.length, 1, 'FIELD +1');
  var summoned = state.player('P1').field[0];
  runner.assertEqual(summoned.currentHp, def.baseHp, 'currentHp=baseHp');
});

// Test 9: CardInstance独立
runner.test('Test9 同じ定義の2枚は独立したHPを持つ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var def = h.defById('test_blue_1');
  var a = h.putInsectOnField(state, 'P1', 'test_blue_1');
  var b = h.putInsectOnField(state, 'P1', 'test_blue_1');
  // aのみダメージ
  a.currentHp -= 200;
  runner.assertEqual(a.currentHp, def.baseHp - 200, 'aのHPが減少');
  runner.assertEqual(b.currentHp, def.baseHp, 'bのHPは変化なし');
  runner.assertEqual(def.baseHp, 700, 'CardDefinition.baseHpは不変');
});

// Test 13: 場の可変数(3枠制限なし)
runner.test('Test13 4体以上の虫を場に持てる', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  for (var i = 0; i < 5; i++) {
    h.putInsectOnField(state, 'P1', 'test_red_1');
  }
  runner.assertEqual(state.player('P1').field.length, 5, 'FIELD=5(制限なし)');
});

module.exports = runner;
