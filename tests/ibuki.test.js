'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();

function ibukiDef() {
  return global.cardRegistry.get('mushi_no_ibuki');
}

// ---- Ibuki Test 1: 正式CardDefinition確認 ----
runner.test('Ibuki1 正式CardDefinition', function () {
  var def = ibukiDef();
  runner.assert(def, 'mushi_no_ibukiが登録されている');
  runner.assertEqual(def.name, '蟲の息吹', 'name');
  runner.assertEqual(def.type, global.CardTypes.SPELL, 'type=SPELL');
  runner.assertEqual(def.cost, 1, 'cost=1');
  var order = {
    NOT_RESEARCHED: 0, RESEARCHED: 1, SPEC_COMPLETE: 2, IMPLEMENTED: 3, TESTED: 4
  };
  runner.assert(order[def.implementationStatus] >= order[global.CardStatus.SPEC_COMPLETE], 'status>=SPEC_COMPLETE');
  runner.assertEqual(def.isPlayable(), true, 'isPlayable=true');
  // 効果はMOVE_SELFでHAND→FOOD
  runner.assertEqual(def.cardEffects[0].type, 'MOVE_SELF', 'effect type');
  runner.assertEqual(def.cardEffects[0].to, 'FOOD', 'effect to=FOOD');
});

// ---- Ibuki Test 2: 基本使用 ----
runner.test('Ibuki2 基本使用 Food2/Cost2 → Food3/Cost1/カードはFOOD', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_blue_1')); // food=2
  var ibuki = h.addToHandRaw(state, 'P1', ibukiDef());
  h.toMainPhase(state); // availableCost = food.length = 2

  global.useSpell(state, 'P1', ibuki.instanceId);

  runner.assertEqual(state.player('P1').food.length, 3, 'Food=3');
  runner.assertEqual(state.player('P1').availableCost, 1, 'availableCost=1');
  runner.assert(ibuki.zone !== global.ZONES.HAND, 'HANDにいない');
  runner.assertEqual(ibuki.zone, global.ZONES.FOOD, 'FOODにいる');
  runner.assertEqual(state.player('P1').resolving.length, 0, 'RESOLVINGは空(過渡状態は残らない)');
});

// ---- Ibuki Test 3: エサ増加によるコスト再獲得禁止 ----
runner.test('Ibuki3 エサ増加でもコスト再獲得しない', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_blue_1')); // food=2
  var ibuki = h.addToHandRaw(state, 'P1', ibukiDef());
  h.toMainPhase(state); // cost=2

  global.useSpell(state, 'P1', ibuki.instanceId);

  // 期待は Food3 / Cost1。3や2にならないこと。
  runner.assertEqual(state.player('P1').food.length, 3, 'Food=3');
  runner.assertEqual(state.player('P1').availableCost, 1, 'availableCost=1(再獲得されない)');
  runner.assert(state.player('P1').availableCost !== 3, 'Costは3でない');
  runner.assert(state.player('P1').availableCost !== 2, 'Costは2でない');
});

// ---- Ibuki Test 4: 通常エサセット回数と独立 ----
runner.test('Ibuki4 foodSetThisTurnに影響しない', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  // SET_PHASEで通常エサ1枚
  h.toSetPhase(state);
  var handInsect = h.firstHandInsect(state, 'P1');
  global.setFood(state, 'P1', handInsect.instanceId);
  runner.assertEqual(state.player('P1').foodSetThisTurn, 1, '通常エサセット後 foodSetThisTurn=1');

  // MAIN_PHASEへ
  global.enterMainPhase(state); // cost = food.length = 1
  var ibuki = h.addToHandRaw(state, 'P1', ibukiDef());
  global.useSpell(state, 'P1', ibuki.instanceId);

  runner.assertEqual(state.player('P1').foodSetThisTurn, 1, '蟲の息吹後もfoodSetThisTurn=1');
  runner.assert(state.player('P1').foodSetThisTurn !== 2, '2にならない');
});

// ---- Ibuki Test 5: コスト不足 ----
runner.test('Ibuki5 コスト不足では拒否し状態を変えない', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var ibuki = h.addToHandRaw(state, 'P1', ibukiDef());
  h.toMainPhase(state); // food=0 → availableCost=0
  runner.assertEqual(state.player('P1').availableCost, 0, 'コスト0');

  var foodBefore = state.player('P1').food.length;
  var threw = false;
  try {
    global.useSpell(state, 'P1', ibuki.instanceId);
  } catch (e) {
    threw = true;
  }
  runner.assert(threw, 'コスト不足で拒否');
  runner.assertEqual(state.player('P1').food.length, foodBefore, 'Food変化なし');
  runner.assertEqual(state.player('P1').availableCost, 0, 'Cost変化なし');
  runner.assertEqual(ibuki.zone, global.ZONES.HAND, 'HANDに残る');
});

// ---- Ibuki Test 6: MAIN_PHASE以外では使用不可 ----
runner.test('Ibuki6 MAIN_PHASE以外では使用不可', function () {
  // DRAW_PHASE
  var state = h.newGame({ rng: h.firstPlayerRng });
  var ibuki = h.addToHandRaw(state, 'P1', ibukiDef());
  var threw = false;
  try { global.useSpell(state, 'P1', ibuki.instanceId); } catch (e) { threw = true; }
  runner.assert(threw, 'DRAW_PHASEで拒否');

  // SET_PHASE
  var state2 = h.newGame({ rng: h.firstPlayerRng });
  h.toSetPhase(state2);
  var ibuki2 = h.addToHandRaw(state2, 'P1', ibukiDef());
  threw = false;
  try { global.useSpell(state2, 'P1', ibuki2.instanceId); } catch (e) { threw = true; }
  runner.assert(threw, 'SET_PHASEで拒否');
});

// ---- Ibuki Test 7: 非アクティブプレイヤーは使用不可 ----
runner.test('Ibuki7 非アクティブプレイヤーは使用不可', function () {
  var state = h.newGame({ rng: h.firstPlayerRng }); // P1アクティブ
  h.addToFoodRaw(state, 'P2', h.defById('test_red_1')); // P2にfood
  h.toMainPhase(state); // P1のMAIN
  var ibuki = h.addToHandRaw(state, 'P2', ibukiDef());
  var threw = false;
  try { global.useSpell(state, 'P2', ibuki.instanceId); } catch (e) { threw = true; }
  runner.assert(threw, '非アクティブ(P2)は拒否');
});

// ---- Ibuki Test 8: 強化カードはuseSpellできない ----
runner.test('Ibuki8 強化カードはuseSpellできない', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  // 正式化された強化カード(type=ENHANCEMENT)は術として使用不可
  var enhancement = global.cardRegistry.get('tamamushiiro_no_uka');
  runner.assert(enhancement, 'tamamushiiro_no_ukaが存在');
  runner.assertEqual(enhancement.type, global.CardTypes.ENHANCEMENT, 'type=ENHANCEMENT');
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var inst = h.addToHandRaw(state, 'P1', enhancement);
  h.toMainPhase(state);
  var threw = false;
  try { global.useSpell(state, 'P1', inst.instanceId); } catch (e) { threw = true; }
  runner.assert(threw, '強化カードはuseSpellで拒否');
});

// ---- Spell Pipeline Test: 通常術は HAND→RESOLVING→DISCARD ----
runner.test('SpellPipeline 通常術はDISCARDへ', function () {
  var def = global.cardRegistry.get('test_spell_1');
  runner.assert(def, 'テスト術1が登録されている');
  runner.assertEqual(def.type, global.CardTypes.SPELL, 'type=SPELL');
  runner.assertEqual(def.isPlayable(), true, 'テスト術は使用可');

  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1')); // food=1
  var inst = h.addToHandRaw(state, 'P1', def);
  h.toMainPhase(state); // cost=1
  var foodBefore = state.player('P1').food.length;

  var result = global.useSpell(state, 'P1', inst.instanceId);

  runner.assertEqual(result.finalZone, global.ZONES.DISCARD, '最終移動先はDISCARD');
  runner.assertEqual(inst.zone, global.ZONES.DISCARD, 'DISCARDにいる');
  runner.assertEqual(state.player('P1').availableCost, 0, 'コスト支払い後0');
  runner.assertEqual(state.player('P1').food.length, foodBefore, 'Food変化なし(通常術)');
  runner.assertEqual(state.player('P1').resolving.length, 0, 'RESOLVINGは空');
  runner.assert(inst.zone !== global.ZONES.HAND, 'HANDに残らない');
});

module.exports = runner;
