'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();

// Wave C で正式化したスターター基本虫9種
var STARTER_IDS = [
  'ginyanma', 'kooniyanma', 'akiakane', 'namitentou', 'kanabun',
  'higurashi', 'tonosamabatta', 'nijuuyaahoshitentou', 'wataaburamushi'
];

var EXPECTED_NUMBERS = {
  ginyanma: '6/130',
  kooniyanma: '11/130',
  akiakane: '24/130',
  namitentou: '30/130',
  kanabun: '63/130',
  higurashi: '64/130',
  tonosamabatta: '71/130',
  nijuuyaahoshitentou: '91/130',
  wataaburamushi: '95/130'
};

var OFFICIAL = {
  ginyanma:            { color: 'RED',   cost: 5, hp: 1100, ap: 700 },
  kooniyanma:          { color: 'RED',   cost: 4, hp: 800,  ap: 500 },
  akiakane:            { color: 'RED',   cost: 2, hp: 500,  ap: 200 },
  namitentou:          { color: 'RED',   cost: 1, hp: 300,  ap: 100 },
  kanabun:             { color: 'BLUE',  cost: 1, hp: 300,  ap: 100 },
  higurashi:           { color: 'BLUE',  cost: 2, hp: 200,  ap: 200 },
  tonosamabatta:       { color: 'GREEN', cost: 5, hp: 1200, ap: 700 },
  nijuuyaahoshitentou: { color: 'GREEN', cost: 2, hp: 300,  ap: 300 },
  wataaburamushi:      { color: 'GREEN', cost: 1, hp: 300,  ap: 100 }
};

// BasicStarter1: 9種の基本データ・isPlayable
runner.test('BasicStarter1 9種のCardDefinitionが基本要件を満たす', function () {
  STARTER_IDS.forEach(function (id) {
    var def = global.cardRegistry.get(id);
    runner.assert(def, id + ' が登録されている');
    runner.assertEqual(def.type, global.CardTypes.INSECT, id + ' type=INSECT');
    runner.assert(def.cost !== null, id + ' cost非null');
    runner.assert(def.baseHp !== null, id + ' baseHp非null');
    runner.assert(def.color !== null, id + ' color非null');
    runner.assertEqual(def.skills.length, 1, id + ' skills.length=1');
    runner.assert(def.skills[0].baseAp !== null, id + ' baseAp非null');
    runner.assertEqual(def.isPlayable(), true, id + ' isPlayable=true');
  });
});

// BasicStarter2: カード番号確認
runner.test('BasicStarter2 公式カード番号が一致', function () {
  STARTER_IDS.forEach(function (id) {
    var def = global.cardRegistry.get(id);
    runner.assertEqual(def.officialNumber, EXPECTED_NUMBERS[id], id + ' officialNumber');
  });
});

// BasicStarter3: CardInstance生成時 currentHp === baseHp
runner.test('BasicStarter3 生成時currentHp=baseHp', function () {
  STARTER_IDS.forEach(function (id) {
    var state = h.newGame({ rng: h.firstPlayerRng });
    var inst = h.putInsectOnField(state, 'P1', id);
    runner.assertEqual(inst.currentHp, inst.baseHp, id + ' currentHp=baseHp');
    runner.assert(inst.baseHp === global.cardRegistry.get(id).baseHp, id + ' baseHpが定義値と一致');
  });
});

// BasicStarter4: 十分なCostで全9種を召喚できる
runner.test('BasicStarter4 全9種を召喚できる', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var totalCost = 0;
  STARTER_IDS.forEach(function (id) {
    h.addToHandRaw(state, 'P1', global.cardRegistry.get(id));
    totalCost += global.cardRegistry.get(id).cost;
  });
  // 所要コスト分(>= totalCost)のフードを用意
  var costUpTo = totalCost;
  for (var i = 0; i < costUpTo; i++) {
    h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  }
  h.toMainPhase(state); // availableCost = food.length = totalCost
  runner.assertEqual(state.player('P1').availableCost, totalCost, 'availableCost=totalCost');

  STARTER_IDS.forEach(function (id) {
    var handInst = h.firstHandInstance(state, 'P1', id);
    var def = global.cardRegistry.get(id);
    var summoned = global.summonInsect(state, 'P1', handInst.instanceId);
    runner.assertEqual(summoned.zone, global.ZONES.FIELD, id + ' が場に出る');
    runner.assertEqual(summoned.currentHp, def.baseHp, id + ' 召喚後currentHp=baseHp');
  });
  runner.assertEqual(state.player('P1').field.length, STARTER_IDS.length, '場に9体');
  runner.assertEqual(state.player('P1').availableCost, 0, 'コストを使い切る');
});

// BasicStarter5: 全9種が通常攻撃でき、APに応じてダメージ計算される
runner.test('BasicStarter5 全9種が通常攻撃できる', function () {
  STARTER_IDS.forEach(function (id) {
    var def = global.cardRegistry.get(id);
    var state = h.newGame({ rng: h.firstPlayerRng });
    var attacker = h.putInsectOnField(state, 'P1', id);
    // 高HPの対象を用意(破壊されてもダメージは確認可能)
    var target = h.putInsectOnField(state, 'P2', 'tonosamabatta');
    h.toMainPhase(state);

    var targetDef = global.cardRegistry.get('tonosamabatta');
    var expected = def.skills[0].baseAp * global.getAttributeMultiplier(def.color, targetDef.color);
    var res = global.performAttack(state, attacker.instanceId, target.instanceId, 'INSECT', null);

    runner.assertEqual(res.damageDealt, expected, id + ' ダメージ=AP*相性');
    runner.assertEqual(res.skill.baseAp, def.skills[0].baseAp, id + ' APは定義値');
    runner.assert(attacker.attackedThisTurn, id + ' 攻撃済みフラグ');
  });
});

// BasicStarter6: 属性相性(公式カードで確認)
runner.test('BasicStarter6 属性相性 RED→GREEN / BLUE→RED / GREEN→BLUE = x2', function () {
  function attackWith(attackerId, targetId) {
    var state = h.newGame({ rng: h.firstPlayerRng });
    var attacker = h.putInsectOnField(state, 'P1', attackerId);
    var target = h.putInsectOnField(state, 'P2', targetId);
    h.toMainPhase(state);
    return global.performAttack(state, attacker.instanceId, target.instanceId, 'INSECT', null);
  }

  // RED → GREEN = x2
  var r1 = attackWith('ginyanma', 'tonosamabatta');
  runner.assertEqual(r1.multiplier, 2, 'RED→GREEN x2');
  runner.assertEqual(r1.damageDealt, 700 * 2, 'RED→GREEN ダメージ1400');

  // BLUE → RED = x2
  var r2 = attackWith('kanabun', 'ginyanma');
  runner.assertEqual(r2.multiplier, 2, 'BLUE→RED x2');
  runner.assertEqual(r2.damageDealt, 100 * 2, 'BLUE→RED ダメージ200');

  // GREEN → BLUE = x2
  var r3 = attackWith('tonosamabatta', 'kanabun');
  runner.assertEqual(r3.multiplier, 2, 'GREEN→BLUE x2');
  runner.assertEqual(r3.damageDealt, 700 * 2, 'GREEN→BLUE ダメージ1400');
});

// BasicStarter7: 同一CardDefinitionから複数CardInstanceでHP独立
runner.test('BasicStarter7 同一定義の複数インスタンスでHP独立', function () {
  var def = global.cardRegistry.get('ginyanma');
  var state = h.newGame({ rng: h.firstPlayerRng });
  var a = h.putInsectOnField(state, 'P1', 'ginyanma');
  var b = h.putInsectOnField(state, 'P1', 'ginyanma');
  a.currentHp = 300;
  runner.assertEqual(a.currentHp, 300, 'aのHP=300');
  runner.assertEqual(b.currentHp, def.baseHp, 'bのHPはbaseHpのまま');
  runner.assert(a !== b, '別インスタンス');
});

// BasicStarter8: 特殊能力が勝手に追加されていない
runner.test('BasicStarter8 9種のskills/effectsが空', function () {
  STARTER_IDS.forEach(function (id) {
    var def = global.cardRegistry.get(id);
    runner.assertEqual(def.skills[0].effects.length, 0, id + ' skills[0].effects=0');
    runner.assertEqual(def.passiveAbilities.length, 0, id + ' passiveAbilities=0');
    runner.assertEqual(def.cardEffects.length, 0, id + ' cardEffects=0');
  });
});

// レシピ展開時に正式CardDefinitionが返ることの確認
runner.test('BasicStarter-Recipe 正式化カードはレシピ展開で正式定義が返る', function () {
  var beetle = global.expandStarterDeck(global.STARTER_DECK_RECIPES.KABUTOMUSHI);
  var mantis = global.expandStarterDeck(global.STARTER_DECK_RECIPES.OKAMAKIRI);
  var both = beetle.concat(mantis);

  STARTER_IDS.forEach(function (id) {
    var inBoth = both.some(function (def) { return def.id === id; });
    if (inBoth) {
      var def = global.cardRegistry.get(id);
      runner.assertEqual(def.isPlayable(), true, id + ' 展開時は正式・playable');
      runner.assert(def.officialNumber, id + ' officialNumberが設定済み');
    }
  });

  // 各レシピは20枚のまま
  runner.assertEqual(beetle.length, 20, 'KABUTOMUSHI 20枚');
  runner.assertEqual(mantis.length, 20, 'OKAMAKIRI 20枚');
});

module.exports = runner;
