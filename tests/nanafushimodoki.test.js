'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();

function nanafushiDef() {
  return global.cardRegistry.get('nanafushimodoki');
}

// ---- ローカルターン進行ヘルパー ----
// アクティブプレイヤーを MAIN_PHASE まで進めてからターンを終了する。
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

// 指定プレイヤーのターン開始まで進め、その MAIN_PHASE へ遷移させる。
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

// Nanafushi1: 正式CardDefinition確認
runner.test('Nanafushi1 ナナフシモドキCardDefinition', function () {
  var def = nanafushiDef();
  runner.assert(def, 'nanafushimodokiが登録されている');
  runner.assertEqual(def.officialNumber, '80/130', 'officialNumber=80/130');
  runner.assertEqual(def.rarity, 'R', 'rarity=R');
  runner.assertEqual(def.type, global.CardTypes.INSECT, 'type=INSECT');
  runner.assertEqual(def.color, global.Attributes.GREEN, 'color=GREEN');
  runner.assertEqual(def.cost, 3, 'cost=3');
  runner.assertEqual(def.baseHp, 400, 'baseHp=400');
  runner.assertEqual(def.skills.length, 2, 'skills.length=2');

  var kaburitsuku = def.skills.find(function (s) { return s.id === 'kaburitsuku'; });
  var gitai = def.skills.find(function (s) { return s.id === 'gitai'; });

  runner.assert(kaburitsuku, '攻撃技「かぶりつく」あり');
  runner.assertEqual(kaburitsuku.name, 'かぶりつく', '技名=かぶりつく');
  runner.assertEqual(kaburitsuku.baseAp, 400, 'AP=400');
  runner.assertEqual(kaburitsuku.timing, 'ATTACK', 'timing=ATTACK');
  runner.assertEqual(kaburitsuku.usageLimit, null, 'usageLimit=null');

  runner.assert(gitai, '＜擬態＞あり');
  runner.assertEqual(gitai.name, '＜擬態＞', '技名=＜擬態＞');
  runner.assertEqual(gitai.timing, 'ENTER_FIELD', 'timing=ENTER_FIELD(非攻撃)');
  runner.assertEqual(gitai.gitai, true, 'gitaiフラグ=true');
  runner.assert(gitai.timing !== 'ATTACK', '攻撃技として扱わない');

  runner.assertEqual(def.isPlayable(), true, 'isPlayable=true');
  runner.assertEqual(def.implementationStatus, global.CardStatus.TESTED, 'status=TESTED');
});

// Nanafushi2: 通常召喚 cost3
runner.test('Nanafushi2 通常召喚でCost3支払ってFIELDへ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var nana = h.addToHandRaw(state, 'P1', nanafushiDef());
  h.toMainPhase(state);
  var costBefore = state.player('P1').availableCost;

  global.summonInsect(state, 'P1', nana.instanceId);

  runner.assertEqual(state.player('P1').availableCost, costBefore - 3, 'Cost3減った');
  runner.assertEqual(state.player('P1').field.length, 1, 'FIELDへ出た');
  runner.assertEqual(nana.zone, global.ZONES.FIELD, 'FIELDにいる');
  runner.assertEqual(nana.currentHp, 400, 'currentHp=400');
  runner.assertEqual(nana.runtimeFlags && nana.runtimeFlags.isGitaiProtected, true, 'gitai保護フラグ設定');
});

// Nanafushi3: 自分ターンに場へ → 次の相手ターンで擬態有効 → 攻撃対象にできない
runner.test('Nanafushi3 自分ターン場出し→次の相手ターンで擬態有効・攻撃不可', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  // P2のターンでP2(所有者)がナナフシを召喚
  toPlayerMain(state, 'P2');
  h.ensureCost(state, 'P2', 3);
  var nana = h.addToHandRaw(state, 'P2', nanafushiDef());
  global.summonInsect(state, 'P2', nana.instanceId);
  // P2が召喚したターン turnNumber=2、active=P2=owner → 保護ターン=3
  runner.assert(nana.runtimeFlags.gitaiProtectedTurn === 3, '保護ターン=3（P2自有の次の相手=P1ターン）');

  // P1のターンへ（turn 3、擬態有効ターン）
  toPlayerMain(state, 'P1');
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');
  var targets = global.getLegalAttackTargets(state, attacker.instanceId);

  // ナナフシは攻撃対象にならない
  var insectTargets = targets.filter(function (t) { return t.targetType === 'INSECT'; });
  runner.assertEqual(insectTargets.length, 0, 'ナナフシは攻撃対象にならない');
  // 直接攻撃対象(LEADER)が存在
  var leaderTarget = targets.some(function (t) { return t.targetType === 'LEADER'; });
  runner.assert(leaderTarget, 'LEADER直接攻撃が合法');

  // 直接 performAttack でも拒否される
  var threw = false;
  try {
    global.performAttack(state, attacker.instanceId, nana.instanceId, 'INSECT', null);
  } catch (e) {
    threw = true;
  }
  runner.assert(threw, '擬態中の虫へ攻撃は拒否される');
});

// Nanafushi4: 擬態中ナナフシ + 通常虫 → 通常虫だけがlegal target
runner.test('Nanafushi4 擬態中ナナフシ+通常虫→通常虫だけlegal', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  toPlayerMain(state, 'P2');
  h.ensureCost(state, 'P2', 3);
  var nana = h.addToHandRaw(state, 'P2', nanafushiDef());
  global.summonInsect(state, 'P2', nana.instanceId);
  var normal = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 1000 });

  toPlayerMain(state, 'P1'); // turn3 擬態有効
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');
  var targets = global.getLegalAttackTargets(state, attacker.instanceId);

  var insectTargets = targets.filter(function (t) { return t.targetType === 'INSECT'; });
  runner.assertEqual(insectTargets.length, 1, 'legal昆虫は1体だけ');
  runner.assertEqual(insectTargets[0].instance.instanceId, normal.instanceId, 'それは通常虫');
  var leader = targets.some(function (t) { return t.targetType === 'LEADER'; });
  runner.assert(!leader, '通常虫がいるのでLEADERはlegalでない');
});

// Nanafushi5: 擬態中ナナフシだけ → LEADER direct legal
runner.test('Nanafushi5 擬態中ナナフシだけ→直接攻撃legal', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  toPlayerMain(state, 'P2');
  h.ensureCost(state, 'P2', 3);
  var nana = h.addToHandRaw(state, 'P2', nanafushiDef());
  global.summonInsect(state, 'P2', nana.instanceId);

  toPlayerMain(state, 'P1'); // turn3 擬態有効
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');
  var targets = global.getLegalAttackTargets(state, attacker.instanceId);

  var insectTargets = targets.filter(function (t) { return t.targetType === 'INSECT'; });
  runner.assertEqual(insectTargets.length, 0, '昆虫対象なし');
  var leader = targets.some(function (t) { return t.targetType === 'LEADER'; });
  runner.assert(leader, 'LEADER直接攻撃がlegal');
});

// Nanafushi6: 擬態中ナナフシ2体 → どちらもtarget不可、LEADER legal
runner.test('Nanafushi6 擬態中ナナフシ2体→両方不可・LEADER legal', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  toPlayerMain(state, 'P2');
  h.ensureCost(state, 'P2', 6);
  var nana1 = h.addToHandRaw(state, 'P2', nanafushiDef());
  var nana2 = h.addToHandRaw(state, 'P2', nanafushiDef());
  global.summonInsect(state, 'P2', nana1.instanceId);
  global.summonInsect(state, 'P2', nana2.instanceId);

  toPlayerMain(state, 'P1'); // turn3 両方擬態有効
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');
  var targets = global.getLegalAttackTargets(state, attacker.instanceId);

  var insectTargets = targets.filter(function (t) { return t.targetType === 'INSECT'; });
  runner.assertEqual(insectTargets.length, 0, 'どちらのナナフシも対象不可');
  var leader = targets.some(function (t) { return t.targetType === 'LEADER'; });
  runner.assert(leader, 'LEADER直接攻撃がlegal');
});

// Nanafushi7: 擬態が終了したターン以降 → 再び通常攻撃対象
runner.test('Nanafushi7 擬態終了後は再び攻撃対象', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  toPlayerMain(state, 'P2');
  h.ensureCost(state, 'P2', 3);
  var nana = h.addToHandRaw(state, 'P2', nanafushiDef());
  global.summonInsect(state, 'P2', nana.instanceId);

  // turn3(P1)は擬態有効
  toPlayerMain(state, 'P1');
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');
  var targetsProtected = global.getLegalAttackTargets(state, attacker.instanceId);
  runner.assertEqual(targetsProtected.filter(function (t) { return t.targetType === 'INSECT'; }).length, 0, '擬態有効ターンは対象不可');

  // 2ターン進めて turn5(P1)へ → 擬態終了、再び対象になる
  endActiveMain(state); // → P2 turn4
  endActiveMain(state); // → P1 turn5
  toPlayerMain(state, 'P1');
  var targetsAfter = global.getLegalAttackTargets(state, attacker.instanceId);
  var insectTargets = targetsAfter.filter(function (t) { return t.targetType === 'INSECT'; });
  runner.assertEqual(insectTargets.length, 1, '擬態終了後は対象になる');
  runner.assertEqual(insectTargets[0].instance.instanceId, nana.instanceId, 'それがナナフシ');
});

// Nanafushi8: 相手ターン中に出す → その相手ターンでは擬態無効、次の相手ターンで有効
runner.test('Nanafushi8 相手ターン中場出し→現在は無効・次の相手ターンで有効', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  // 一旦P2のターンへ(turn2) - 相手ターン中にP1のナナフシをFIELDへ出す
  toPlayerMain(state, 'P2');
  // P1所有のナナフシを、P2のターン中にP1のFIELDへ(engineのmoveCard経由=正式FIELD entry)
  var nana = h.addToHandRaw(state, 'P1', nanafushiDef());
  global.moveCard(state, nana.instanceId, global.ZONES.HAND, global.ZONES.FIELD, { playerId: 'P1' });
  // active=P2(=相手), turn2 → 保護ターン=2+2=4
  runner.assert(nana.runtimeFlags.gitaiProtectedTurn === 4, '保護ターン=4');

  // 現在のP2ターン(turn2): 擬態はまだ有効ではない → P2攻撃者でナナフシを対象可能
  var attackerP2 = h.putInsectOnField(state, 'P2', 'test_red_1');
  var targetsTurn2 = global.getLegalAttackTargets(state, attackerP2.instanceId);
  var insectTurn2 = targetsTurn2.filter(function (t) { return t.targetType === 'INSECT'; });
  runner.assertEqual(insectTurn2.length, 1, '現在の相手ターンでは攻撃対象にできる');
  runner.assertEqual(insectTurn2[0].instance.instanceId, nana.instanceId, 'それがナナフシ');

  // 自分のターン(P1 turn3)を挟み、次の相手ターン(P2 turn4)へ → 擬態有効
  endActiveMain(state); // → P1 turn3
  endActiveMain(state); // → P2 turn4
  toPlayerMain(state, 'P2');
  var attackerP2b = h.putInsectOnField(state, 'P2', 'test_red_2');
  var targetsTurn4 = global.getLegalAttackTargets(state, attackerP2b.instanceId);
  var insectTurn4 = targetsTurn4.filter(function (t) { return t.targetType === 'INSECT'; });
  runner.assertEqual(insectTurn4.length, 0, '次の相手ターンでは擬態が有効で対象不可');
  var leaderTurn4 = targetsTurn4.some(function (t) { return t.targetType === 'LEADER'; });
  runner.assert(leaderTurn4, 'LEADER直接攻撃がlegal');
});

// Nanafushi9: ＜擬態＞をattack skillとしてperformAttack → 拒否
runner.test('Nanafushi9 ＜擬態＞を攻撃技として使用は拒否', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var nana = h.addToHandRaw(state, 'P1', nanafushiDef());
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', nana.instanceId);
  var target = h.putInsectOnField(state, 'P2', 'test_red_1', { hp: 5000 });

  var threw = false;
  try {
    global.performAttack(state, nana.instanceId, target.instanceId, 'INSECT', 'gitai');
  } catch (e) {
    threw = true;
  }
  runner.assert(threw, 'gitai は攻撃技ではないため拒否される');

  // 通常攻撃「かぶりつく」は使用可能 (GREEN vs RED → 倍率1)
  var res = global.performAttack(state, nana.instanceId, target.instanceId, 'INSECT', 'kaburitsuku');
  runner.assertEqual(res.damageDealt, 400, 'かぶりつく AP=400 で成立');
});

// Nanafushi10: 擬態は攻撃targetingのみに影響し、汎用zone/card選択を禁止しない
runner.test('Nanafushi10 擬態は攻撃targingのみ制限・汎用選択は維持', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  toPlayerMain(state, 'P2');
  h.ensureCost(state, 'P2', 3);
  var nana = h.addToHandRaw(state, 'P2', nanafushiDef());
  global.summonInsect(state, 'P2', nana.instanceId);

  toPlayerMain(state, 'P1'); // turn3 擬態有効
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');

  // 攻撃targetingのみ制限されている
  var insectTargets = global.getLegalAttackTargets(state, attacker.instanceId)
    .filter(function (t) { return t.targetType === 'INSECT'; });
  runner.assertEqual(insectTargets.length, 0, '攻撃対象には含まれない');

  // 汎用zone/card選択(findAnywhere / getCardDefinition / findInZone)は影響しない
  var found = global.findAnywhere(state, nana.instanceId);
  runner.assert(found, 'findAnywhere でナナフシを参照できる');
  runner.assertEqual(found.zone, global.ZONES.FIELD, 'FIELDにいる');
  runner.assert(global.getCardDefinition(nana.cardId), 'getCardDefinition で定義を取得できる');
  var byZone = global.findInZone(state, 'P2', global.ZONES.FIELD, nana.instanceId);
  runner.assert(byZone, 'findInZone でFIELDから探せる');

  // isAttackTargetable は対象制限専用。汎用選択とは独立。
  runner.assertEqual(global.isAttackTargetable(state, nana), false, '擬態有効中は攻撃対象不可のみ');
});

module.exports = runner;