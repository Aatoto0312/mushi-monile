'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();

function ibukiDef() {
  return global.cardRegistry.get('mushi_no_ibuki');
}

// SpellRollback 1: 解決途中(RESOLVE_EFFECT)で例外 → 使用直前の状態へ復旧
runner.test('SpellRollback1 解決途中の例外で復旧', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1')); // food=1
  var ibuki = h.addToHandRaw(state, 'P1', ibukiDef());
  h.toMainPhase(state); // cost=1

  var foodBefore = state.player('P1').food.length;
  var discardBefore = state.player('P1').discard.length;
  var costBefore = state.player('P1').availableCost;

  // 解決中(RESOLVE_EFFECT)に意図的に例外を発生させるテスト用フック
  global.spellResolveHook = function () {
    throw new Error('意図的な解決失敗');
  };
  var threw = false;
  try {
    global.useSpell(state, 'P1', ibuki.instanceId);
  } catch (e) {
    threw = true;
  } finally {
    global.spellResolveHook = null;
  }

  runner.assert(threw, '例外が再送出される');
  runner.assertEqual(state.player('P1').availableCost, costBefore, 'Costが使用前へ復元');
  runner.assertEqual(ibuki.zone, global.ZONES.HAND, 'カードがHANDへ戻る');
  runner.assertEqual(state.player('P1').resolving.length, 0, 'RESOLVING=0');
  runner.assertEqual(state.player('P1').food.length, foodBefore, 'Food変化なし');
  runner.assertEqual(state.player('P1').discard.length, discardBefore, 'Discard変化なし');
});

// SpellRollback 2: 最終移動(FINALIZE)失敗 → 使用直前の状態へ復旧
runner.test('SpellRollback2 最終移動失敗で復旧', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1')); // food=1
  var ibuki = h.addToHandRaw(state, 'P1', ibukiDef());
  h.toMainPhase(state); // cost=1

  var foodBefore = state.player('P1').food.length;
  var discardBefore = state.player('P1').discard.length;
  var costBefore = state.player('P1').availableCost;

  // FINALIZE(RESOLVING→最終移動)の moveCard だけを意図的に失敗させる
  var origMove = global.moveCard;
  global.moveCard = function (s, id, from, to, opts) {
    if (from === global.ZONES.RESOLVING) {
      throw new Error('最終移動失敗');
    }
    return origMove.call(null, s, id, from, to, opts);
  };
  var threw = false;
  try {
    global.useSpell(state, 'P1', ibuki.instanceId);
  } catch (e) {
    threw = true;
  } finally {
    global.moveCard = origMove;
  }

  runner.assert(threw, '例外が再送出される');
  runner.assertEqual(state.player('P1').availableCost, costBefore, 'Costが使用前へ復元');
  runner.assertEqual(ibuki.zone, global.ZONES.HAND, 'カードがHANDへ戻る');
  runner.assertEqual(state.player('P1').resolving.length, 0, 'RESOLVING=0');
  runner.assertEqual(state.player('P1').food.length, foodBefore, 'Food変化なし');
  runner.assertEqual(state.player('P1').discard.length, discardBefore, 'Discard変化なし');
});

module.exports = runner;
