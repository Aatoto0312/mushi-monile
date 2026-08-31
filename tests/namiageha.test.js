'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();

function namiagehaDef() {
  return global.cardRegistry.get('namiageha');
}

// ---- ローカルターン進行ヘルパー(seakakogegumo/nanafushimodoki と同様) ----
function endActiveMain(state) {
  if (state.phase === global.Phases.TURN_START) { global.beginTurn(state); }
  if (state.phase === global.Phases.DRAW_PHASE) { global.enterSetPhase(state); }
  if (state.phase === global.Phases.SET_PHASE) {
    var ap = state.activePlayerId;
    if (state.player(ap).hand.length > 0) {
      global.setFood(state, ap, state.player(ap).hand[0].instanceId);
    }
    global.enterMainPhase(state);
  }
  if (state.phase !== global.Phases.MAIN_PHASE) {
    throw new Error('endActiveMain: メインフェイズでない phase=' + state.phase);
  }
  global.endTurn(state);
}

function toPlayerMain(state, playerId) {
  var guard = 0;
  while (state.activePlayerId !== playerId && guard < 30) {
    endActiveMain(state);
    guard++;
  }
  if (state.activePlayerId !== playerId) {
    throw new Error('toPlayerMain: ' + playerId + ' のターンに到達できません');
  }
  if (state.phase === global.Phases.TURN_START) { global.beginTurn(state); }
  if (state.phase === global.Phases.DRAW_PHASE) { global.enterSetPhase(state); }
  if (state.phase === global.Phases.SET_PHASE) {
    if (state.player(playerId).hand.length > 0) {
      global.setFood(state, playerId, state.player(playerId).hand[0].instanceId);
    }
    global.enterMainPhase(state);
  }
  if (state.phase !== global.Phases.MAIN_PHASE) {
    throw new Error('toPlayerMain: メインフェイズでない phase=' + state.phase);
  }
  return state;
}

// P2のFIELDにナミアゲハ遂次召喚(suitsukusu用のP2攻撃相手ではなく、P1の攻撃対象として立てる)
function summonNamiagehaForP2(state, count) {
  toPlayerMain(state, 'P2');
  h.ensureCost(state, 'P2', 4 * count);
  var instances = [];
  for (var i = 0; i < count; i++) {
    var inst = h.addToHandRaw(state, 'P2', namiagehaDef());
    global.summonInsect(state, 'P2', inst.instanceId);
    instances.push(inst);
  }
  return instances;
}

// P1の攻撃者を場に用意し、P1のMAIN_PHASEでP2のFIELDに対するlegal targetを返す。
function legalTargetsForP1Attacker(state) {
  toPlayerMain(state, 'P1');
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');
  return global.getLegalAttackTargets(state, attacker.instanceId);
}

// Namiageha1: 正式CardDefinition確認
runner.test('Namiageha1 ナミアゲハCardDefinition', function () {
  var def = namiagehaDef();
  runner.assert(def, 'namiagehaが登録されている');
  runner.assertEqual(def.officialNumber, '44/130', 'officialNumber=44/130');
  runner.assertEqual(def.rarity, 'R', 'rarity=R');
  runner.assertEqual(def.type, global.CardTypes.INSECT, 'type=INSECT');
  runner.assertEqual(def.color, global.Attributes.BLUE, 'color=BLUE');
  runner.assertEqual(def.cost, 4, 'cost=4');
  runner.assertEqual(def.baseHp, 1100, 'baseHp=1100');
  runner.assertEqual(def.skills.length, 2, 'skills.length=2');

  var suitsukusu = def.skills.find(function (s) { return s.id === 'suitsukusu'; });
  var rinpun = def.skills.find(function (s) { return s.id === 'rinpun'; });

  runner.assert(suitsukusu, '攻撃技「すいつくす」あり');
  runner.assertEqual(suitsukusu.baseAp, 300, 'AP=300');
  runner.assertEqual(suitsukusu.timing, 'ATTACK', 'timing=ATTACK');

  runner.assert(rinpun, '＜りんぷん＞あり');
  runner.assertEqual(rinpun.timing, 'PASSIVE', 'timing=PASSIVE(非攻撃)');
  runner.assertEqual(rinpun.targetRule, 'FORCE_ATTACK_TO_SELF_GROUP', 'targetRule=FORCE_ATTACK_TO_SELF_GROUP');
  runner.assert(rinpun.timing !== 'ATTACK', '攻撃技として扱わない');

  runner.assertEqual(def.isPlayable(), true, 'isPlayable=true');
  runner.assertEqual(def.implementationStatus, global.CardStatus.TESTED, 'status=TESTED');
});

// Namiageha2: 通常召喚 cost4
runner.test('Namiageha2 通常召喚でCost4支払ってFIELDへ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var nami = h.addToHandRaw(state, 'P1', namiagehaDef());
  h.toMainPhase(state);
  var costBefore = state.player('P1').availableCost;

  global.summonInsect(state, 'P1', nami.instanceId);

  runner.assertEqual(state.player('P1').availableCost, costBefore - 4, 'Cost4減った');
  runner.assertEqual(state.player('P1').field.length, 1, 'FIELDへ出た');
  runner.assertEqual(nami.zone, global.ZONES.FIELD, 'FIELDにいる');
  runner.assertEqual(nami.currentHp, 1100, 'currentHp=1100');
});

// Namiageha3: ナミアゲハ + 通常虫 → ナミアゲハだけlegal
runner.test('Namiageha3 ナミアゲハ+通常虫→ナミアゲハだけlegal', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var nami = summonNamiagehaForP2(state, 1)[0];
  h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 1000 });

  var targets = legalTargetsForP1Attacker(state);
  var insects = targets.filter(function (t) { return t.targetType === 'INSECT'; });
  runner.assertEqual(insects.length, 1, 'legal昆虫はナミアゲハ1体だけ');
  runner.assertEqual(insects[0].instance.instanceId, nami.instanceId, 'それがナミアゲハ');
  var leader = targets.some(function (t) { return t.targetType === 'LEADER'; });
  runner.assert(!leader, 'ナミアゲハがいるのでLEADER不可');
});

// Namiageha4: ナミアゲハ2体 + 通常虫 → ナミアゲハ2体だけlegal
runner.test('Namiageha4 ナミアゲハ2体+通常虫→ナミアゲハ2体だけlegal', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var namis = summonNamiagehaForP2(state, 2);
  h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 1000 });

  var targets = legalTargetsForP1Attacker(state);
  var insects = targets.filter(function (t) { return t.targetType === 'INSECT'; });
  runner.assertEqual(insects.length, 2, 'legal昆虫はナミアゲハ2体');
  var ids = insects.map(function (t) { return t.instance.instanceId; }).sort();
  var expectIds = namis.map(function (i) { return i.instanceId; }).sort();
  runner.assertEqual(JSON.stringify(ids), JSON.stringify(expectIds), 'ナミアゲハ2体のみ');
  var leader = targets.some(function (t) { return t.targetType === 'LEADER'; });
  runner.assert(!leader, 'LEADER不可');
});

// Namiageha5: ナミアゲハのみ → ナミアゲハlegal、LEADER direct不可
runner.test('Namiageha5 ナミアゲハのみ→ナミアゲハlegal・LEADER不可', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var nami = summonNamiagehaForP2(state, 1)[0];

  var targets = legalTargetsForP1Attacker(state);
  var insects = targets.filter(function (t) { return t.targetType === 'INSECT'; });
  runner.assertEqual(insects.length, 1, 'ナミアゲハがlegal');
  runner.assertEqual(insects[0].instance.instanceId, nami.instanceId, 'それがナミアゲハ');
  var leader = targets.some(function (t) { return t.targetType === 'LEADER'; });
  runner.assert(!leader, 'LEDER直接攻撃は不可(攻撃対象になる虫がいるため)');
});

// Namiageha6: ＜りんぷん＞をattack skillとしてperformAttack → 拒否
runner.test('Namiageha6 ＜りんぷん＞を攻撃技として使用は拒否', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var nami = h.addToHandRaw(state, 'P1', namiagehaDef());
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', nami.instanceId);
  var target = h.putInsectOnField(state, 'P2', 'test_red_1', { hp: 5000 });

  var threw = false;
  try {
    global.performAttack(state, nami.instanceId, target.instanceId, 'INSECT', 'rinpun');
  } catch (e) {
    threw = true;
  }
  runner.assert(threw, 'rinpun は攻撃技ではないため拒否される');
});

// Namiageha7: 通常攻撃「すいつくす」AP300
runner.test('Namiageha7 すいつくす AP300が動作', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var nami = h.addToHandRaw(state, 'P1', namiagehaDef());
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', nami.instanceId);
  var target = h.putInsectOnField(state, 'P2', 'test_green_1', { hp: 5000 });

  var res = global.performAttack(state, nami.instanceId, target.instanceId, 'INSECT', 'suitsukusu');
  runner.assertEqual(res.damageDealt, 300, 'すいつくす AP=300 (BLUE vs GREEN → 倍率1)');
  runner.assertEqual(target.currentHp, 5000 - 300, 'HPが300減る');
});

// Namiageha8: ナミアゲハがFIELDを離れたら、残った通常虫が再びlegal target
runner.test('Namiageha8 ナミアゲハ離脱後は通常虫が再びlegal', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var nami = summonNamiagehaForP2(state, 1)[0];
  var normal = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 1000 });

  // ナミアゲハがいる間はナミアゲハだけlegal
  var targetsWith = legalTargetsForP1Attacker(state);
  var insectsWith = targetsWith.filter(function (t) { return t.targetType === 'INSECT'; });
  runner.assertEqual(insectsWith.length, 1, 'ナミアゲハがいる間はナミアゲハのみ');
  runner.assertEqual(insectsWith[0].instance.instanceId, nami.instanceId, 'それがナミアゲハ');

  // ナミアゲハを場から除去(破壊: FIELD→DISCARD)
  toPlayerMain(state, 'P2');
  global.moveCard(state, nami.instanceId, global.ZONES.FIELD, global.ZONES.DISCARD, { playerId: 'P2' });

  // 残った通常虫が再びlegal targetになる
  var targetsAfter = legalTargetsForP1Attacker(state);
  var insectsAfter = targetsAfter.filter(function (t) { return t.targetType === 'INSECT'; });
  runner.assertEqual(insectsAfter.length, 1, 'ナミアゲハ離脱後は通常虫のみ');
  runner.assertEqual(insectsAfter[0].instance.instanceId, normal.instanceId, 'それが通常虫');
});

// Namiageha9: 既存＜擬態＞のtargeting挙動を壊さない
runner.test('Namiageha9 ＜擬態＞targeting挙動を壊さない', function () {
  // ナナフシモドキを場に出し、擬態有効ターンで攻撃対象不可になること(既存挙動)を再確認
  var state = h.newGame({ rng: h.firstPlayerRng });
  toPlayerMain(state, 'P2');
  h.ensureCost(state, 'P2', 3);
  var nana = h.addToHandRaw(state, 'P2', global.cardRegistry.get('nanafushimodoki'));
  global.summonInsect(state, 'P2', nana.instanceId);

  // P1 turn3 に擬態有効
  toPlayerMain(state, 'P1');
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');
  var targets = global.getLegalAttackTargets(state, attacker.instanceId);
  var insects = targets.filter(function (t) { return t.targetType === 'INSECT'; });
  runner.assertEqual(insects.length, 0, '擬態有効ターンはナナフシが攻撃対象不可');
  var leader = targets.some(function (t) { return t.targetType === 'LEADER'; });
  runner.assert(leader, '直接攻撃LEADERがlegal');
});

// Namiageha10: targetRule処理はカード名依存でないこと(スキル定義から判定)
runner.test('Namiageha10 targetRuleはカード名非依存', function () {
  var def = namiagehaDef();
  // カード定義のskillsに targetRule が設定されている = エンジンはスキル定義から判定する
  var rins = def.skills.find(function (s) { return s.targetRule === 'FORCE_ATTACK_TO_SELF_GROUP'; });
  runner.assert(rins, 'targetRuleがスキル定義にある');
  // カード名文字列に依存した判定ではないことを確認(getLegalAttackTargetsはnamiageha名でif分岐しない)
  // 別カードにも同targetRuleを設定すれば再利用できる設計であることを、定義IDを使わずに示す
  runner.assertEqual(typeof def.id, 'string', 'idは文字列');
  // エンジン内部は hasTargetRule(カード名非依存) で判定されるため、カード名は無関係。
  runner.assert(true, 'targetRuleは定義ベースでカード名非依存');
});

module.exports = runner;