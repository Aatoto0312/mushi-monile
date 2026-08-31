'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();

function minminDef() {
  return global.cardRegistry.get('minminzemi');
}

// 共通ヘルパー: 縄張りドロー選択を解決して誘発状態にする
function triggerAndSelectTerritory(state, playerId) {
  global.drawTerritoryCard(state, playerId);
  if (state.pendingEffect && state.pendingEffect.type === 'TERRITORY_DRAW_SELECTION') {
    var territoryInst = state.pendingEffect.options[0];
    global.resolveTerritoryDrawSelection(state, playerId, territoryInst);
  }
}

// Tobidasu1: CardDefinition確認
runner.test('Tobidasu1 ミンミンゼミCardDefinition', function () {
  var def = minminDef();
  runner.assert(def, 'minminzemiが登録されている');
  runner.assertEqual(def.officialNumber, '47/130', 'officialNumber=47/130');
  runner.assertEqual(def.type, global.CardTypes.INSECT, 'type=INSECT');
  runner.assertEqual(def.color, global.Attributes.BLUE, 'color=BLUE');
  runner.assertEqual(def.cost, 3, 'cost=3');
  runner.assertEqual(def.baseHp, 500, 'baseHp=500');
  runner.assertEqual(def.skills.length, 2, 'skills.length=2');
  var attackSkill = def.skills.find(function (s) { return s.timing === 'ATTACK'; });
  var triggerSkill = def.skills.find(function (s) { return s.timing === 'TERRITORY_DRAW'; });
  runner.assert(attackSkill, '攻撃技あり');
  runner.assertEqual(attackSkill.name, 'しぼりとる', '攻撃技名=しぼりとる');
  runner.assertEqual(attackSkill.baseAp, 200, 'AP=200');
  runner.assert(triggerSkill, '誘発技あり');
  runner.assertEqual(triggerSkill.name, '＜とびだす＞', '誘発技名=＜とびだす＞');
  runner.assertEqual(triggerSkill.timing, 'TERRITORY_DRAW', 'timing=TERRITORY_DRAW');
  runner.assertEqual(triggerSkill.optional, true, 'optional=true');
  runner.assertEqual(def.implementationStatus, global.CardStatus.TESTED, 'status=TESTED');
  runner.assertEqual(def.isPlayable(), true, 'isPlayable=true');
});

// Tobidasu2: 通常召喚
runner.test('Tobidasu2 通常召喚でCost3支払ってFIELDへ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var minmin = h.addToHandRaw(state, 'P1', minminDef());
  h.toMainPhase(state);
  var costBefore = state.player('P1').availableCost;
  
  global.summonInsect(state, 'P1', minmin.instanceId);
  
  runner.assertEqual(state.player('P1').availableCost, costBefore - 3, 'Cost3減った');
  runner.assertEqual(state.player('P1').field.length, 1, 'FIELDへ出た');
  runner.assertEqual(minmin.zone, global.ZONES.FIELD, 'FIELDにいる');
  runner.assertEqual(minmin.currentHp, 500, 'currentHp=500');
});

// Tobidasu3: 縄張りから引き、USE_TOBIDASUでFIELDへ
runner.test('Tobidasu3 縄張りドローでUSE_TOBIDASU選択', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.setTerritoryEmpty(state, 'P1');
  h.addToTerritoryRaw(state, 'P1', minminDef());
  h.toMainPhase(state);
  var territoryBefore = state.player('P1').territory.length;
  var handBefore = state.player('P1').hand.length;
  var fieldBefore = state.player('P1').field.length;
  var costBefore = state.player('P1').availableCost;
  
  triggerAndSelectTerritory(state, 'P1');
  runner.assert(state.pendingEffect, 'pendingEffectが発生 (TERRITORY_DRAW_CHOICE)');
  runner.assertEqual(state.pendingEffect.type, 'TERRITORY_DRAW_CHOICE', 'とびだす選択待ち');
  runner.assertEqual(JSON.stringify(state.pendingEffect.options), JSON.stringify(['USE_TOBIDASU', 'TAKE_TO_HAND']), '選択肢');
  
  global.resolvePendingTerritoryChoice(state, 'USE_TOBIDASU');
  
  runner.assertEqual(state.player('P1').territory.length, territoryBefore - 1, 'Territory -1');
  runner.assertEqual(state.player('P1').hand.length, handBefore, 'Hand増加なし');
  runner.assertEqual(state.player('P1').field.length, fieldBefore + 1, 'FIELD +1');
  runner.assertEqual(state.player('P1').availableCost, costBefore, 'Cost変化なし');
  runner.assert(!state.pendingEffect, 'pendingEffectクリア');
});

// Tobidasu4: TAKE_TO_HAND選択
runner.test('Tobidasu4 縄張りドローでTAKE_TO_HAND選択', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.setTerritoryEmpty(state, 'P1');
  h.addToTerritoryRaw(state, 'P1', minminDef());
  h.toMainPhase(state);
  var territoryBefore = state.player('P1').territory.length;
  var handBefore = state.player('P1').hand.length;
  var fieldBefore = state.player('P1').field.length;
  
  triggerAndSelectTerritory(state, 'P1');
  runner.assert(state.pendingEffect, 'pendingEffectあり');
  
  global.resolvePendingTerritoryChoice(state, 'TAKE_TO_HAND');
  
  runner.assertEqual(state.player('P1').territory.length, territoryBefore - 1, 'Territory -1');
  runner.assertEqual(state.player('P1').hand.length, handBefore + 1, 'Hand +1');
  runner.assertEqual(state.player('P1').field.length, fieldBefore, 'FIELD変化なし');
  runner.assert(!state.pendingEffect, 'pendingEffectクリア');
});

// Tobidasu5: FIELDに表向きミンミンゼミあり → 使用不可
runner.test('Tobidasu5 FIELDに表向きミンミンゼミがあると使用不可', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.setTerritoryEmpty(state, 'P1');
  h.putInsectOnField(state, 'P1', 'minminzemi');
  h.addToTerritoryRaw(state, 'P1', minminDef());
  h.toMainPhase(state);
  var handBefore = state.player('P1').hand.length;
  var fieldBefore = state.player('P1').field.length;
  
  triggerAndSelectTerritory(state, 'P1');
  
  runner.assert(!state.pendingEffect, 'pendingEffectなし (自動HAND)');
  runner.assertEqual(state.player('P1').hand.length, handBefore + 1, 'HAND +1');
  runner.assertEqual(state.player('P1').field.length, fieldBefore, 'FIELD増加なし');
});

// Tobidasu6: FIELDに裏向きミンミンゼミのみ → 使用可能
runner.test('Tobidasu6 FIELDに裏向きミンミンゼミのみなら使用可能', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.setTerritoryEmpty(state, 'P1');
  var faceDown = h.putInsectOnField(state, 'P1', 'minminzemi');
  faceDown.faceDown = true;
  h.addToTerritoryRaw(state, 'P1', minminDef());
  h.toMainPhase(state);
  
  triggerAndSelectTerritory(state, 'P1');
  
  runner.assert(state.pendingEffect, 'pendingEffect発生 (裏向きは条件外)');
  runner.assertEqual(JSON.stringify(state.pendingEffect.options), JSON.stringify(['USE_TOBIDASU', 'TAKE_TO_HAND']), '選択可能');
});

// Tobidasu7: Cost=0でも使用可能
runner.test('Tobidasu7 Cost=0でも<とびだす>使用可能', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.setTerritoryEmpty(state, 'P1');
  h.addToTerritoryRaw(state, 'P1', minminDef());
  h.toMainPhase(state);
  runner.assertEqual(state.player('P1').availableCost, 0, 'Cost=0');
  
  triggerAndSelectTerritory(state, 'P1');
  runner.assert(state.pendingEffect, 'pendingEffect発生');
  
  global.resolvePendingTerritoryChoice(state, 'USE_TOBIDASU');
  
  runner.assertEqual(state.player('P1').availableCost, 0, 'Cost変化なし');
  runner.assertEqual(state.player('P1').field.length, 1, 'FIELDへ出た');
});

// Tobidasu8: 相手ターン中でも使用可能
runner.test('Tobidasu8 相手ターン中の縄張りドローでも使用可能', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.setTerritoryEmpty(state, 'P1');
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.toMainPhase(state);
  global.endTurn(state);
  h.addToTerritoryRaw(state, 'P1', minminDef());
  
  triggerAndSelectTerritory(state, 'P1');
  
  runner.assert(state.pendingEffect, 'pendingEffect発生');
  runner.assertEqual(state.pendingEffect.playerId, 'P1', '選択権はカード所有者P1');
  
  global.resolvePendingTerritoryChoice(state, 'USE_TOBIDASU');
  
  runner.assertEqual(state.player('P1').field.length, 1, 'P1のFIELDへ出た');
});

// Tobidasu9: <とびだす>で場に出た後のCardInstance状態
runner.test('Tobidasu9 <とびだす>で場に出た後のCardInstance状態', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.setTerritoryEmpty(state, 'P1');
  h.addToTerritoryRaw(state, 'P1', minminDef());
  h.toMainPhase(state);
  triggerAndSelectTerritory(state, 'P1');
  global.resolvePendingTerritoryChoice(state, 'USE_TOBIDASU');
  
  var minmin = state.player('P1').field[0];
  runner.assertEqual(minmin.currentHp, 500, 'currentHp=500');
  runner.assertEqual(minmin.baseHp, 500, 'baseHp=500');
  runner.assertEqual(minmin.attackedThisTurn, false, 'attackedThisTurn=false');
  runner.assertEqual(minmin.faceDown, false, 'faceDown=false');
});

// Tobidasu10: 2枚連続で引く - 1枚目使用、2枚目不可
runner.test('Tobidasu10 2枚連続: 1枚目使用→2枚目不可', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.setTerritoryEmpty(state, 'P1');
  h.addToTerritoryRaw(state, 'P1', minminDef());
  h.addToTerritoryRaw(state, 'P1', minminDef());
  h.toMainPhase(state);
  
  triggerAndSelectTerritory(state, 'P1');
  global.resolvePendingTerritoryChoice(state, 'USE_TOBIDASU');
  runner.assertEqual(state.player('P1').field.length, 1, '1枚目FIELD');
  runner.assert(!state.pendingEffect, '解決済み');
  
  triggerAndSelectTerritory(state, 'P1');
  runner.assert(!state.pendingEffect, 'pendingEffectなし (自動HAND)');
  runner.assertEqual(state.player('P1').field.length, 1, 'FIELD増加なし (1枚目のがいるため)');
  runner.assertEqual(state.player('P1').hand.length, 5, 'HAND +1 (初期4枚+1)');
});

// Tobidasu11: 1枚目使用しない → 2枚目使用可能
runner.test('Tobidasu11 1枚目HAND→2枚目使用可能', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.setTerritoryEmpty(state, 'P1');
  h.addToTerritoryRaw(state, 'P1', minminDef());
  h.addToTerritoryRaw(state, 'P1', minminDef());
  h.toMainPhase(state);
  
  triggerAndSelectTerritory(state, 'P1');
  global.resolvePendingTerritoryChoice(state, 'TAKE_TO_HAND');
  runner.assertEqual(state.player('P1').hand.length, 5, '1枚目HAND (初期4枚+1)');
  runner.assert(!state.pendingEffect, '解決済み');
  
  triggerAndSelectTerritory(state, 'P1');
  runner.assert(state.pendingEffect, '2枚目でpendingEffect発生');
  runner.assertEqual(JSON.stringify(state.pendingEffect.options), JSON.stringify(['USE_TOBIDASU', 'TAKE_TO_HAND']), '選択可能');
  
  global.resolvePendingTerritoryChoice(state, 'USE_TOBIDASU');
  runner.assertEqual(state.player('P1').field.length, 1, '2枚目FIELDへ');
});

// Tobidasu12: performAttackにskillId='tobidasu'を渡しても攻撃できない
runner.test('Tobidasu12 <とびだす>は攻撃技として扱われない', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var minmin = h.addToHandRaw(state, 'P1', minminDef());
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', minmin.instanceId);
  
  var target = h.putInsectOnField(state, 'P2', 'test_red_1');
  
  var threw = false;
  try {
    global.performAttack(state, minmin.instanceId, target.instanceId, 'INSECT', 'tobidasu');
  } catch (e) {
    threw = true;
  }
  runner.assert(threw, 'tobidasuスキルでは攻撃できない');
  
  global.performAttack(state, minmin.instanceId, target.instanceId, 'INSECT', null);
  runner.assertEqual(minmin.attackedThisTurn, true, '通常攻撃は可能');
});

module.exports = runner;