'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();

function battaDef() {
  return global.cardRegistry.get('batta_no_kyousou');
}

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

// Batta1: 正式CardDefinition確認
runner.test('Batta1 飛蝗の凶相CardDefinition', function () {
  var def = battaDef();
  runner.assert(def, 'batta_no_kyousouが登録されている');
  runner.assertEqual(def.officialNumber, '129/130', 'officialNumber=129/130');
  runner.assertEqual(def.rarity, 'N', 'rarity=N');
  runner.assertEqual(def.type, global.CardTypes.SPELL, 'type=SPELL');
  runner.assertEqual(def.cost, 0, 'cost=0');
  runner.assertEqual(def.cardEffects.length, 1, 'cardEffects.length=1');
  runner.assertEqual(def.cardEffects[0].type, 'APPLY_STAT_MODIFIER_TO_ALL_OWN_FIELD', 'effect type');
  runner.assertEqual(def.cardEffects[0].stat, 'AP', 'stat=AP');
  runner.assertEqual(def.cardEffects[0].amount, 200, 'amount=200');

  runner.assertEqual(def.isPlayable(), true, 'isPlayable=true');
  runner.assertEqual(def.implementationStatus, global.CardStatus.TESTED, 'status=TESTED');
});

// Batta2: cost0使用
runner.test('Batta2 cost0使用', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var inst = h.addToHandRaw(state, 'P1', battaDef());
  h.toMainPhase(state);

  var res = global.useSpell(state, 'P1', inst.instanceId);
  runner.assertEqual(res.finalZone, global.ZONES.DISCARD, '最終移動先DISCARD');
  runner.assertEqual(inst.zone, global.ZONES.DISCARD, 'DISCARDへ移動');
});

// Batta3: 使用時FIELDにいる全自虫へAP+200
runner.test('Batta3 使用時FIELDにいる全自虫へAP+200', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  // P1場に2体
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var inst1 = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  var inst2 = h.addToHandRaw(state, 'P1', h.defById('test_red_2'));
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', inst1.instanceId);
  global.summonInsect(state, 'P1', inst2.instanceId);

  // 飛蝗の凶相を使用
  var batta = h.addToHandRaw(state, 'P1', battaDef());
  global.useSpell(state, 'P1', batta.instanceId);

  // 両方に +200
  var def = global.getCardDefinition('test_red_1');
  var baseAp = def.skills[0].baseAp; // 500
  var ap1 = global.getEffectiveAP(state, inst1, baseAp);
  var ap2 = global.getEffectiveAP(state, inst2, baseAp);
  runner.assertEqual(ap1, 500 + 200, '1体目 +200');
  runner.assertEqual(ap2, 500 + 200, '2体目 +200');
});

// Batta4: 使用後に場へ出した虫には+200なし
runner.test('Batta4 使用後に場へ出した虫には+200なし', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var inst1 = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', inst1.instanceId);

  // 飛蝗使用
  var batta = h.addToHandRaw(state, 'P1', battaDef());
  global.useSpell(state, 'P1', batta.instanceId);

  // 使用後に召喚
  h.addToFoodRaw(state, 'P1', h.defById('test_blue_1'));
  var inst2 = h.addToHandRaw(state, 'P1', h.defById('test_blue_1'));
  global.summonInsect(state, 'P1', inst2.instanceId);

  // 最初の虫は +200、後の虫は +0
  var def1 = global.getCardDefinition('test_red_1');
  var ap1 = global.getEffectiveAP(state, inst1, def1.skills[0].baseAp);
  var def2 = global.getCardDefinition('test_blue_1');
  var ap2 = global.getEffectiveAP(state, inst2, def2.skills[0].baseAp);
  runner.assertEqual(ap1, 500 + 200, '使用時いた虫は +200');
  runner.assertEqual(ap2, def2.skills[0].baseAp, '使用後に出た虫は +0');
});

// Batta5: ターン終了時に+200消失
runner.test('Batta5 ターン終了時に+200消失', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var inst1 = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', inst1.instanceId);

  var batta = h.addToHandRaw(state, 'P1', battaDef());
  global.useSpell(state, 'P1', batta.instanceId);

  // turn1 では +200
  var def = global.getCardDefinition('test_red_1');
  var ap1 = global.getEffectiveAP(state, inst1, def.skills[0].baseAp);
  runner.assertEqual(ap1, 500 + 200, 'turn1 は +200');

  // ターン終了(P1 end → P2 turn2)
  endActiveMain(state);
  toPlayerMain(state, 'P2');

  // turn2 では +0
  endActiveMain(state); // P2 end
  endActiveMain(state); // P1 turn3
  toPlayerMain(state, 'P1');
  var apAfter = global.getEffectiveAP(state, inst1, def.skills[0].baseAp);
  runner.assertEqual(apAfter, 500, 'turn3 では +200 消失');
});

// Batta6: 複数回使用時の重複
runner.test('Batta6 複数回使用時の重複挙動', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var inst1 = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', inst1.instanceId);

  // 2回使用
  var batta1 = h.addToHandRaw(state, 'P1', battaDef());
  global.useSpell(state, 'P1', batta1.instanceId);
  var batta2 = h.addToHandRaw(state, 'P1', battaDef());
  global.useSpell(state, 'P1', batta2.instanceId);

  // 両方とも turn1 なので重複して +400
  var def = global.getCardDefinition('test_red_1');
  var ap = global.getEffectiveAP(state, inst1, def.skills[0].baseAp);
  runner.assertEqual(ap, 500 + 400, '同一ターンで2回使用なら重複して +400');
});

// Batta7: 色相性はmodifier適用後に計算
runner.test('Batta7 色相性はmodifier適用後に計算', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var inst1 = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', inst1.instanceId);

  var batta = h.addToHandRaw(state, 'P1', battaDef());
  global.useSpell(state, 'P1', batta.instanceId);

  // test_red_1 は RED, baseAp=500, +200 = 700
  // GREEN 対象なら倍率2 → 700 * 2 = 1400
  var def = global.getCardDefinition('test_red_1');
  var target = h.putInsectOnField(state, 'P2', 'test_green_1', { hp: 5000 });
  var res = global.performAttack(state, inst1.instanceId, target.instanceId, 'INSECT', def.skills[0].id);
  runner.assertEqual(res.multiplier, 2, 'RED vs GREEN → 2倍');
  runner.assertEqual(res.damageDealt, 1400, '修正後AP(700)に対して倍率適用');
});

module.exports = runner;