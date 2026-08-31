'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();

// Test 10: 通常攻撃でダメージ適用
runner.test('Test10 AP500でHP800の虫を攻撃 → currentHp=300', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.toMainPhase(state);
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1'); // AP 500
  var defender = h.putInsectOnField(state, 'P2', 'test_red_2', { hp: 800 }); // HP 800
  global.performAttack(state, attacker.instanceId, defender.instanceId, 'INSECT', null);
  runner.assertEqual(defender.currentHp, 300, 'HPが500減って300');
  runner.assertEqual(attacker.attackedThisTurn, true, '攻撃済みフラグ');
});

// Test 11: 属性相性でダメージ2倍
runner.test('Test11 有利属性へのAP500攻撃 → damage=1000', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.toMainPhase(state);
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1'); // RED
  var defender = h.putInsectOnField(state, 'P2', 'test_green_2', { hp: 1100 }); // GREEN
  global.performAttack(state, attacker.instanceId, defender.instanceId, 'INSECT', null);
  runner.assertEqual(defender.currentHp, 100, '1000ダメージ適用で残り100');
});

// Test 12: HP0以下で破壊
runner.test('Test12 HP500に500以上のダメージ → FIELD→DISCARD', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.toMainPhase(state);
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');
  var defender = h.putInsectOnField(state, 'P2', 'test_red_1', { hp: 500 });
  global.performAttack(state, attacker.instanceId, defender.instanceId, 'INSECT', null);
  runner.assertEqual(defender.zone, global.ZONES.DISCARD, 'DISCARDへ移動');
});

// Test 21: 相手場に虫がいるときは直接攻撃不可
runner.test('Test21 相手場に虫がいるとき直接攻撃は不可', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.toMainPhase(state);
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');
  h.putInsectOnField(state, 'P2', 'test_red_1');
  var threw = false;
  try {
    global.performAttack(state, attacker.instanceId, null, 'LEADER', null);
  } catch (e) {
    threw = true;
  }
  runner.assert(threw, 'LEADER攻撃は拒否');
});

// Test 22: 攻撃で相手虫を破壊 → 相手縄張り-1, 手札+1
runner.test('Test22 敵虫破壊で相手縄張りが1枚減り手札が1枚増える', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.toMainPhase(state);
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');
  var defender = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 300 });
  var terrBefore = state.player('P2').territory.length;
  var handBefore = state.player('P2').hand.length;
  global.performAttack(state, attacker.instanceId, defender.instanceId, 'INSECT', null);

  // 防御側が縄張りを選択
  runner.assert(state.pendingEffect, '縄張り選択pending');
  var terrInst = state.pendingEffect.options[0];
  global.resolveTerritoryDrawSelection(state, 'P2', terrInst);

  runner.assertEqual(state.player('P2').territory.length, terrBefore - 1, '縄張り-1');
  runner.assertEqual(state.player('P2').hand.length, handBefore + 1, '手札+1');
});

// Test 23: 術等による破壊では縄張りを引かない
runner.test('Test23 SPELL破壊では縄張りを引かない', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var defender = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 100 });
  var terrBefore = state.player('P2').territory.length;
  var handBefore = state.player('P2').hand.length;
  global.destroyInsect(state, defender.instanceId, 'SPELL', 'src', null);
  runner.assertEqual(state.player('P2').territory.length, terrBefore, '縄張りは減らない');
  runner.assertEqual(state.player('P2').hand.length, handBefore, '手札は増えない');
});

// Test 24: 相手縄張り0 + 敵虫破壊では勝利にならない
runner.test('Test24 縄張り0の敵虫破壊では勝利にならない', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.setTerritoryEmpty(state, 'P2');
  h.toMainPhase(state);
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');
  var defender = h.putInsectOnField(state, 'P2', 'test_red_1', { hp: 100 });
  global.performAttack(state, attacker.instanceId, defender.instanceId, 'INSECT', null);
  runner.assertEqual(state.winner, null, '勝利判定なし');
});

// Test 25: 相手縄張り0 + 本体直接攻撃 → 勝利
runner.test('Test25 縄張り0で直接攻撃すると勝利', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.setTerritoryEmpty(state, 'P2');
  h.toMainPhase(state);
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');
  global.performAttack(state, attacker.instanceId, null, 'LEADER', null);
  runner.assertEqual(state.winner, 'P1', 'P1の勝利');
  runner.assertEqual(state.phase, global.Phases.GAME_OVER, 'GAME_OVERフェイズ');
});

// Test 26: ターン終了でダメージ回復
runner.test('Test26 ターン終了で虫のHPが全回復', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.toMainPhase(state);
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1'); // AP 500
  var defender = h.putInsectOnField(state, 'P2', 'test_red_2', { hp: 800 }); // HP 800
  global.performAttack(state, attacker.instanceId, defender.instanceId, 'INSECT', null);
  runner.assertEqual(defender.currentHp, 300, '攻撃直後はHP300');
  global.endTurn(state);
  var defenderDef = global.getCardDefinition(defender.cardId);
  runner.assertEqual(defender.currentHp, defenderDef.baseHp, 'ターン終了後全回復');
});

module.exports = runner;