'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();

function seakakoDef() {
  return global.cardRegistry.get('seakakogegumo');
}

// Seakako1: 正式CardDefinition確認
runner.test('Seakako1 セアカゴケグモCardDefinition', function () {
  var def = seakakoDef();
  runner.assert(def, 'seakakogegumoが登録されている');
  runner.assertEqual(def.officialNumber, '22/130', 'officialNumber=22/130');
  runner.assertEqual(def.type, global.CardTypes.INSECT, 'type=INSECT');
  runner.assertEqual(def.color, global.Attributes.RED, 'color=RED');
  runner.assertEqual(def.cost, 2, 'cost=2');
  runner.assertEqual(def.baseHp, 400, 'baseHp=400');
  runner.assertEqual(def.rarity, 'R', 'rarity=R');
  runner.assertEqual(def.skills.length, 2, 'skills.length=2');

  var kamuSkill = def.skills.find(function (s) { return s.id === 'kamu'; });
  var dokubariSkill = def.skills.find(function (s) { return s.id === 'dokubari'; });

  runner.assert(kamuSkill, '通常攻撃「かむ」あり');
  runner.assertEqual(kamuSkill.name, 'かむ', '技名=かむ');
  runner.assertEqual(kamuSkill.baseAp, 100, 'AP=100');
  runner.assertEqual(kamuSkill.timing, 'ATTACK', 'timing=ATTACK');
  runner.assertEqual(kamuSkill.usageLimit, null, 'usageLimit=null(制限なし)');

  runner.assert(dokubariSkill, '特殊攻撃「毒針」あり');
  runner.assertEqual(dokubariSkill.name, '毒針', '技名=毒針');
  runner.assertEqual(dokubariSkill.baseAp, 400, 'AP=400');
  runner.assertEqual(dokubariSkill.timing, 'ATTACK', 'timing=ATTACK');
  runner.assertEqual(dokubariSkill.usageLimit, 'ONCE_PER_FIELD_STAY', 'usageLimit=ONCE_PER_FIELD_STAY');

  runner.assertEqual(def.isPlayable(), true, 'isPlayable=true');
  runner.assertEqual(def.implementationStatus, global.CardStatus.TESTED, 'status=TESTED');
});

// Seakako2: 通常召喚 cost2
runner.test('Seakako2 通常召喚でCost2支払ってFIELDへ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var seakako = h.addToHandRaw(state, 'P1', seakakoDef());
  h.toMainPhase(state);
  var costBefore = state.player('P1').availableCost;

  global.summonInsect(state, 'P1', seakako.instanceId);

  runner.assertEqual(state.player('P1').availableCost, costBefore - 2, 'Cost2減った');
  runner.assertEqual(state.player('P1').field.length, 1, 'FIELDへ出た');
  runner.assertEqual(seakako.zone, global.ZONES.FIELD, 'FIELDにいる');
  runner.assertEqual(seakako.currentHp, 400, 'currentHp=400');
  runner.assertEqual(seakako.usedSkills.length, 0, 'usedSkillsは空で開始');
});

// Seakako3: かむ は何度でも使用可能
runner.test('Seakako3 かむ は何度でも使用可能', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var seakako = h.addToHandRaw(state, 'P1', seakakoDef());
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', seakako.instanceId);

  var target = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 1000 });

  // 1回目
  var res1 = global.performAttack(state, seakako.instanceId, target.instanceId, 'INSECT', 'kamu');
  runner.assertEqual(res1.damageDealt, 100, '1回目ダメージ=100');
  runner.assert(seakako.attackedThisTurn, '攻撃済みフラグON');

  // 次の自分のターンまで進めて attackedThisTurn をリセット
  h.passFullTurnRefresh(state, 'P1');
  runner.assertEqual(seakako.attackedThisTurn, false, 'ターン終了でリセット');

  // 2回目
  var res2 = global.performAttack(state, seakako.instanceId, target.instanceId, 'INSECT', 'kamu');
  runner.assertEqual(res2.damageDealt, 100, '2回目ダメージ=100');
});

// Seakako4: 毒針 初回使用可能・AP400
runner.test('Seakako4 毒針 初回使用可能・AP400', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var seakako = h.addToHandRaw(state, 'P1', seakakoDef());
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', seakako.instanceId);

  var target = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 1000 });

  var res = global.performAttack(state, seakako.instanceId, target.instanceId, 'INSECT', 'dokubari');
  runner.assertEqual(res.damageDealt, 400, '毒針ダメージ=400');
  runner.assertEqual(res.skill.id, 'dokubari', '使用技=毒針');
  runner.assert(seakako.usedSkills.indexOf('dokubari') !== -1, 'usedSkillsに毒針が記録');
});

// Seakako5: 同じCardInstanceで毒針2回目拒否
runner.test('Seakako5 同じCardInstanceで毒針2回目拒否', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var seakako = h.addToHandRaw(state, 'P1', seakakoDef());
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', seakako.instanceId);

  var target = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 1000 });

  // 1回目成功
  global.performAttack(state, seakako.instanceId, target.instanceId, 'INSECT', 'dokubari');
  runner.assert(seakako.usedSkills.indexOf('dokubari') !== -1, '1回目で記録済み');

  // 次の自分のターンまで進めて attackedThisTurn をリセット
  h.passFullTurnRefresh(state, 'P1');
  runner.assertEqual(seakako.attackedThisTurn, false, 'ターン終了でリセット');

  // 2回目拒否（usedSkills に残っているため）
  var threw = false;
  try {
    global.performAttack(state, seakako.instanceId, target.instanceId, 'INSECT', 'dokubari');
  } catch (e) {
    threw = true;
    runner.assert(e.message.indexOf('1度しか使用できません') !== -1, 'エラーメッセージ確認');
  }
  runner.assert(threw, '2回目は拒否される');

  // かむは使用可能なこと
  var resKamu = global.performAttack(state, seakako.instanceId, target.instanceId, 'INSECT', 'kamu');
  runner.assertEqual(resKamu.damageDealt, 100, 'かむは使用可能');
});

// Seakako6: 別のセアカゴケグモは毒針使用可能
runner.test('Seakako6 別のセアカゴケグモは毒針使用可能', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var seakako1 = h.addToHandRaw(state, 'P1', seakakoDef());
  var seakako2 = h.addToHandRaw(state, 'P1', seakakoDef());
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', seakako1.instanceId);
  global.summonInsect(state, 'P1', seakako2.instanceId);

  var target = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 1000 });

  // 1体目で毒針使用
  global.performAttack(state, seakako1.instanceId, target.instanceId, 'INSECT', 'dokubari');
  runner.assert(seakako1.usedSkills.indexOf('dokubari') !== -1, '1体目は使用済み');

  // 2体目で毒針使用可能
  var res = global.performAttack(state, seakako2.instanceId, target.instanceId, 'INSECT', 'dokubari');
  runner.assertEqual(res.damageDealt, 400, '2体目は毒針使用可能');
  runner.assert(seakako2.usedSkills.indexOf('dokubari') !== -1, '2体目も使用済み記録');
});

// Seakako7: 場を離れて再び場に出ると毒針使用可能に戻る
runner.test('Seakako7 場を離れて再び場に出ると毒針使用可能に戻る', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var seakako = h.addToHandRaw(state, 'P1', seakakoDef());
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', seakako.instanceId);

  var target = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 1000 });

  // 毒針使用
  global.performAttack(state, seakako.instanceId, target.instanceId, 'INSECT', 'dokubari');
  runner.assert(seakako.usedSkills.indexOf('dokubari') !== -1, '使用済み');

  // 手札に戻す（ゾーン移動でusedSkillsリセットされる）
  var handInst = global.moveCard(state, seakako.instanceId, global.ZONES.FIELD, global.ZONES.HAND, { playerId: 'P1' });
  runner.assertEqual(handInst.usedSkills.length, 0, '手札に戻すとusedSkillsリセット');

  // 再召喚に足りるコストを確保してから再召喚
  h.ensureCost(state, 'P1', 2);
  global.summonInsect(state, 'P1', handInst.instanceId);
  runner.assertEqual(handInst.usedSkills.length, 0, '再召喚でもusedSkills空');

  // 再度毒針使用可能
  var res = global.performAttack(state, handInst.instanceId, target.instanceId, 'INSECT', 'dokubari');
  runner.assertEqual(res.damageDealt, 400, '再召喚後も毒針使用可能');
});

// Seakako8: 使用拒否時に attackedThisTurn / usedSkills / 盤面を壊さない
runner.test('Seakako8 使用拒否時に状態を変えない', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var seakako = h.addToHandRaw(state, 'P1', seakakoDef());
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', seakako.instanceId);

  var target = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 1000 });

  // 1回目成功
  global.performAttack(state, seakako.instanceId, target.instanceId, 'INSECT', 'dokubari');
  runner.assert(seakako.usedSkills.indexOf('dokubari') !== -1);

  // 次の自分のターンまで進めて attackedThisTurn をリセット
  h.passFullTurnRefresh(state, 'P1');
  runner.assertEqual(seakako.attackedThisTurn, false, 'attackedThisTurnはfalse');

  // 2回目試行（拒否される）
  var threw = false;
  var hpBefore = target.currentHp;
  try {
    global.performAttack(state, seakako.instanceId, target.instanceId, 'INSECT', 'dokubari');
  } catch (e) {
    threw = true;
  }
  runner.assert(threw, '2回目拒否');

  // 状態が変わっていないこと
  runner.assertEqual(seakako.attackedThisTurn, false, 'attackedThisTurnはfalseのまま');
  runner.assertEqual(target.currentHp, hpBefore, '相手HP変化なし');
  runner.assertEqual(seakako.usedSkills.length, 1, 'usedSkills増えていない');
  runner.assert(seakako.usedSkills.indexOf('dokubari') !== -1, 'dokubariのみ記録');
});

module.exports = runner;