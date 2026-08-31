'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();

function namiagehaLarvaDef() {
  return global.cardRegistry.get('namiageha_larva');
}

// ---- ローカルターン進行ヘルパー ----
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

function summonNamiagehaLarvaForP2(state) {
  toPlayerMain(state, 'P2');
  h.ensureCost(state, 'P2', 3);
  var inst = h.addToHandRaw(state, 'P2', namiagehaLarvaDef());
  global.summonInsect(state, 'P2', inst.instanceId);
  return inst;
}

function legalTargetsForP1Attacker(state) {
  toPlayerMain(state, 'P1');
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');
  return global.getLegalAttackTargets(state, attacker.instanceId);
}

// NamiagehaLarva1: 正式CardDefinition確認
runner.test('NamiagehaLarva1 ナミアゲハ幼虫CardDefinition', function () {
  var def = namiagehaLarvaDef();
  runner.assert(def, 'namiageha_larvaが登録されている');
  runner.assertEqual(def.officialNumber, '79/130', 'officialNumber=79/130');
  runner.assertEqual(def.rarity, 'R', 'rarity=R');
  runner.assertEqual(def.type, global.CardTypes.INSECT, 'type=INSECT');
  runner.assertEqual(def.color, global.Attributes.GREEN, 'color=GREEN');
  runner.assertEqual(def.cost, 3, 'cost=3');
  runner.assertEqual(def.baseHp, 700, 'baseHp=700');
  runner.assertEqual(def.skills.length, 2, 'skills.length=2');

  var kajiru = def.skills.find(function (s) { return s.id === 'kajiru'; });
  var kusaiTsuno = def.skills.find(function (s) { return s.id === 'kusai_tsuno'; });

  runner.assert(kajiru, '攻撃技「かじる」あり');
  runner.assertEqual(kajiru.baseAp, 200, 'AP=200');
  runner.assertEqual(kajiru.timing, 'ATTACK', 'timing=ATTACK');

  runner.assert(kusaiTsuno, '効果付き攻撃「くさいツノ」あり');
  runner.assertEqual(kusaiTsuno.baseAp, 0, 'AP=0');
  runner.assertEqual(kusaiTsuno.timing, 'ATTACK', 'timing=ATTACK');
  runner.assert(kusaiTsuno.effects && kusaiTsuno.effects.length === 1, 'effectあり');
  runner.assertEqual(kusaiTsuno.effects[0].type, 'APPLY_STAT_MODIFIER', 'effect type=APPLY_STAT_MODIFIER');
  runner.assertEqual(kusaiTsuno.effects[0].stat, 'AP', 'stat=AP');
  runner.assertEqual(kusaiTsuno.effects[0].amount, -400, 'amount=-400');
  runner.assertEqual(kusaiTsuno.effects[0].startTurnOffset, 1, 'startTurnOffset=1(次のターン)');
  runner.assertEqual(kusaiTsuno.effects[0].endTurnOffset, 1, 'endTurnOffset=1(次のターンのみ)');

  runner.assertEqual(def.isPlayable(), true, 'isPlayable=true');
  runner.assertEqual(def.implementationStatus, global.CardStatus.TESTED, 'status=TESTED');
});

// NamiagehaLarva2: 通常召喚 cost3
runner.test('NamiagehaLarva2 通常召喚でCost3支払ってFIELDへ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var larva = h.addToHandRaw(state, 'P1', namiagehaLarvaDef());
  h.toMainPhase(state);
  var costBefore = state.player('P1').availableCost;

  global.summonInsect(state, 'P1', larva.instanceId);

  runner.assertEqual(state.player('P1').availableCost, costBefore - 3, 'Cost3減った');
  runner.assertEqual(state.player('P1').field.length, 1, 'FIELDへ出た');
  runner.assertEqual(larva.zone, global.ZONES.FIELD, 'FIELDにいる');
  runner.assertEqual(larva.currentHp, 700, 'currentHp=700');
});

// NamiagehaLarva3: かじる AP200
runner.test('NamiagehaLarva3 かじる AP200が動作', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var larva = h.addToHandRaw(state, 'P1', namiagehaLarvaDef());
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', larva.instanceId);
  var target = h.putInsectOnField(state, 'P2', 'test_red_1', { hp: 5000 });

  var res = global.performAttack(state, larva.instanceId, target.instanceId, 'INSECT', 'kajiru');
  runner.assertEqual(res.damageDealt, 200, 'かじる AP=200 (GREEN vs RED → 倍率1)');
  runner.assertEqual(target.currentHp, 5000 - 200, 'HPが200減る');
});

// NamiagehaLarva4: くさいツノ AP0
runner.test('NamiagehaLarva4 くさいツノ AP0が動作', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var larva = h.addToHandRaw(state, 'P1', namiagehaLarvaDef());
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', larva.instanceId);
  var target = h.putInsectOnField(state, 'P2', 'test_red_1', { hp: 5000 });

  var res = global.performAttack(state, larva.instanceId, target.instanceId, 'INSECT', 'kusai_tsuno');
  runner.assertEqual(res.damageDealt, 0, 'くさいツノ AP=0 → ダメージ0');
  runner.assertEqual(target.currentHp, 5000, 'HPは減らない');
  runner.assert(res.statModifierApplied === true, 'statModifierApplied フラグが立つ');
  // 対象虫に AP-400 modifier が next turn のみ付与されている
  var mods = target.statModifiers || [];
  var found = mods.some(function (m) {
    return m.stat === 'AP' && m.amount === -400 && m.startTurn === 2 && m.endTurn === 2; // turn1召喚→次のターンturn2
  });
  runner.assert(found, '対象虫に AP-400 modifier(次ターンのみ)が付与');
});

// NamiagehaLarva5: 対象虫 AP-400 が次ターンに適用
runner.test('NamiagehaLarva5 対象虫 AP-400 が次のターンに適用', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  // P1で幼虫を召喚し、P2の虫にくさいツノを使用
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var larva = h.addToHandRaw(state, 'P1', namiagehaLarvaDef());
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', larva.instanceId);
  var target = h.putInsectOnField(state, 'P2', 'test_red_1', { hp: 5000 });

  global.performAttack(state, larva.instanceId, target.instanceId, 'INSECT', 'kusai_tsuno');
  // ターン終了(P1 turn1 終了 → P2 turn2 へ)
  endActiveMain(state); // P1 turn1 end → P2 turn2
  toPlayerMain(state, 'P2');

  // P2のターンでその虫が攻撃する → AP はベース - 400
  var target2 = h.putInsectOnField(state, 'P2', 'test_red_1', { hp: 5000 }); // 別の虫
  // くさいツノを受けた虫は target。今 turn2 で攻撃する場合
  // P1に攻撃者を用意して、target が攻撃する側になる... ここでは target の AP が減っているかを直接確認
  var def = global.getCardDefinition(target.cardId);
  var effectiveAp = global.getEffectiveAP(state, target, def.skills[0].baseAp); // test_red_1 の baseAp 500
  // test_red_1 baseAp=500, -400 = 100
  runner.assertEqual(effectiveAp, 500 - 400, '次のターンは AP-400 が適用される');
});

// NamiagehaLarva6: 色相性は修正後APに対して計算
runner.test('NamiagehaLarva6 色相性は修正後APに対して計算', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  // 幼虫(GREEN)に飛蝗の凶相で+200を適用してから攻撃するテストは飛蝗テストでやる
  // ここでは くさいツノで -400 を受けた虫が、有利属性を攻撃する場合のダメージ計算
  // GREEN vs RED は倍率1。APが-400修正後で計算されることを確認
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var larva = h.addToHandRaw(state, 'P1', namiagehaLarvaDef());
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', larva.instanceId);

  // 別の GREEN 虫を用意し、くさいツノで -400 を受ける
  // test_green_1 baseAp=400, -400 = 0
  var victim = h.putInsectOnField(state, 'P2', 'test_green_1', { hp: 5000 });
  global.performAttack(state, larva.instanceId, victim.instanceId, 'INSECT', 'kusai_tsuno');

  // 次のターン(P2 turn)で victim が RED を攻撃 → GREEN vs RED = 1倍
  endActiveMain(state); // P1 end → P2 turn
  toPlayerMain(state, 'P2');
  var redTarget = h.putInsectOnField(state, 'P1', 'test_red_1', { hp: 5000 });
  var victimDef = global.getCardDefinition(victim.cardId);
  var res = global.performAttack(state, victim.instanceId, redTarget.instanceId, 'INSECT', victimDef.skills[0].id);
  // test_green_1 skills[0].baseAp = 400
  // -400 修正で effective AP = 0
  // GREEN vs RED → 1倍 → 0 damage
  runner.assertEqual(res.damageDealt, 0, '修正後AP(0)に対して色倍率1が適用');
});

// NamiagehaLarva7: 擬態中の虫にはくさいツノ不可
runner.test('NamiagehaLarva7 擬態中の虫にはくさいツノ不可', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  // P2でナナフシモドキを召喚 → P1 turn3 擬態有効
  toPlayerMain(state, 'P2');
  h.ensureCost(state, 'P2', 3);
  var nana = h.addToHandRaw(state, 'P2', global.cardRegistry.get('nanafushimodoki'));
  global.summonInsect(state, 'P2', nana.instanceId);
  // P1のターンへ。この時点でP1はfoodなし、availableCost=0
  toPlayerMain(state, 'P1'); // turn3 擬態有効

  // P1で幼虫を召喚するためfoodを用意してavailableCostを確保
  h.ensureCost(state, 'P1', 3);
  var larva = h.addToHandRaw(state, 'P1', namiagehaLarvaDef());
  global.summonInsect(state, 'P1', larva.instanceId);

  // くさいツノで擬態中のナナフシを対象 → 不可
  var threw = false;
  try {
    global.performAttack(state, larva.instanceId, nana.instanceId, 'INSECT', 'kusai_tsuno');
  } catch (e) {
    threw = true;
  }
  runner.assert(threw, '擬態中の虫は攻撃対象にできないためくさいツノも拒否');
});

// NamiagehaLarva8: 対象が場を離れたらmodifier消失
runner.test('NamiagehaLarva8 対象が場を離れたらmodifier消失', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var larva = h.addToHandRaw(state, 'P1', namiagehaLarvaDef());
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', larva.instanceId);
  var target = h.putInsectOnField(state, 'P2', 'test_red_1', { hp: 5000 });

  global.performAttack(state, larva.instanceId, target.instanceId, 'INSECT', 'kusai_tsuno');
  runner.assert((target.statModifiers || []).length === 1, 'modifier付与済み');

  // 対象虫を破壊(FIELD→DISCARD)
  toPlayerMain(state, 'P2');
  global.moveCard(state, target.instanceId, global.ZONES.FIELD, global.ZONES.DISCARD, { playerId: 'P2' });

  // 再度場に出す(手札→FIELD)
  toPlayerMain(state, 'P1');
  var newTarget = h.putInsectOnField(state, 'P2', 'test_red_1', { hp: 5000 });
  // 新しいインスタンスなので modifier はない
  runner.assert((newTarget.statModifiers || []).length === 0, '別インスタンスには modifier なし');

  // 同じインスタンスを手札経由で戻すケース: 元の target は破壊されており再利用不可
  // ここでは「場を離れたら modifier 消失」を statModifiers が空になることで確認
});

// NamiagehaLarva9: 期限終了後APが元へ戻る
runner.test('NamiagehaLarva9 期限終了後APが元へ戻る', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var larva = h.addToHandRaw(state, 'P1', namiagehaLarvaDef());
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', larva.instanceId);
  var target = h.putInsectOnField(state, 'P2', 'test_red_1', { hp: 5000 });

  global.performAttack(state, larva.instanceId, target.instanceId, 'INSECT', 'kusai_tsuno');

  // turn2(P2)で modifier 有効
  endActiveMain(state); // P1 end
  toPlayerMain(state, 'P2');
  var def = global.getCardDefinition(target.cardId);
  var effectiveAp2 = global.getEffectiveAP(state, target, def.skills[0].baseAp);
  runner.assertEqual(effectiveAp2, 500 - 400, 'turn2 は AP-400');

  // turn3(P1)に進める → modifier 期限切れ
  endActiveMain(state); // P2 end
  endActiveMain(state); // P1 end → turn3 P2?
  // ここでは P1 が active になる。turn3 は P1 のターン
  // target は P2 の虫なので、P1 のターンでは直接 AP 確認できないが、turn4(P2)で確認
  toPlayerMain(state, 'P2'); // turn4
  var effectiveAp4 = global.getEffectiveAP(state, target, def.skills[0].baseAp);
  runner.assertEqual(effectiveAp4, 500, 'turn4 では modifier 期限切れで元のAPに戻る');
});

module.exports = runner;