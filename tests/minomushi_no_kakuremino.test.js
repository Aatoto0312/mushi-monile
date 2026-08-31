'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();

function minomushiDef() {
  return global.cardRegistry.get('minomushi_no_kakuremino');
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

// Minomushi1: 正式CardDefinition確認
runner.test('Minomushi1 蓑虫の隠れ蓑CardDefinition', function () {
  var def = minomushiDef();
  runner.assert(def, 'minomushi_no_kakureminoが登録されている');
  runner.assertEqual(def.officialNumber, '108/130', 'officialNumber=108/130');
  runner.assertEqual(def.rarity, 'N', 'rarity=N');
  runner.assertEqual(def.type, global.CardTypes.ENHANCEMENT, 'type=ENHANCEMENT');
  runner.assertEqual(def.cost, 0, 'cost=0');
  runner.assertEqual(def.enhancementEffects.length, 1, 'enhancementEffects.length=1');
  runner.assertEqual(def.enhancementEffects[0].stat, 'HP', 'stat=HP');
  runner.assertEqual(def.enhancementEffects[0].amount, 500, 'amount=500');

  runner.assertEqual(def.isPlayable(), true, 'isPlayable=true');
  runner.assertEqual(def.implementationStatus, global.CardStatus.TESTED, 'status=TESTED');
});

// Minomushi2: cost0
runner.test('Minomushi2 cost0', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var inst = h.addToHandRaw(state, 'P1', minomushiDef());
  h.toMainPhase(state);

  runner.assertEqual(state.player('P1').availableCost, 0, 'availableCost=0');
});

// Minomushi3: 自分虫へattach
runner.test('Minomushi3 自分虫へattach', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var target = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', target.instanceId);

  var enhancement = h.addToHandRaw(state, 'P1', minomushiDef());
  var attached = global.useEnhancement(state, 'P1', enhancement.instanceId, target.instanceId);

  runner.assertEqual(attached.instanceId, enhancement.instanceId, '戻り値は装着したインスタンス');
  runner.assertEqual(enhancement.zone, global.ZONES.FIELD, 'zone=FIELD');
  runner.assertEqual(target.attachments.length, 1, 'attachments に1枚');
  runner.assertEqual(target.attachments[0].instanceId, enhancement.instanceId, 'それが装着したカード');
});

// Minomushi4: HP+500 (装着時 currentHp は変化しない＝公式未確認のため安全側で実装)
runner.test('Minomushi4 HP+500 装着時 currentHp は変化しない', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var target = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', target.instanceId);

  // わざとダメージを与えて currentHp < maxHp 状態にする
  target.currentHp = 600; // baseHp=800 の虫を 600 に
  var hpBefore = global.calculateMaxHp(target);
  runner.assertEqual(hpBefore, 800, 'baseHp=800');
  runner.assertEqual(target.currentHp, 600, 'currentHp=600 (ダメージ済み)');

  var enhancement = h.addToHandRaw(state, 'P1', minomushiDef());
  global.useEnhancement(state, 'P1', enhancement.instanceId, target.instanceId);
  var hpAfter = global.calculateMaxHp(target);

  runner.assertEqual(hpAfter, hpBefore + 500, '最大HPが +500 (800→1300)');
  runner.assertEqual(target.currentHp, 600, 'currentHp は変化しない (600 のまま)');
});

// Minomushi5: 相手虫には使用不可
runner.test('Minomushi5 相手虫には使用不可', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var target = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', target.instanceId);

  var enhancement = h.addToHandRaw(state, 'P1', minomushiDef());
  var oppTarget = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 1000 });

  var threw = false;
  try {
    global.useEnhancement(state, 'P1', enhancement.instanceId, oppTarget.instanceId);
  } catch (e) {
    threw = true;
  }
  runner.assert(threw, '相手の虫には装着不可');
});

// Minomushi6: 同じ虫へ複数attachment可能
runner.test('Minomushi6 同じ虫へ複数attachment可能', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var target = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', target.instanceId);

  var enh1 = h.addToHandRaw(state, 'P1', minomushiDef());
  global.useEnhancement(state, 'P1', enh1.instanceId, target.instanceId);
  var enh2 = h.addToHandRaw(state, 'P1', minomushiDef());
  global.useEnhancement(state, 'P1', enh2.instanceId, target.instanceId);

  runner.assertEqual(target.attachments.length, 2, '2枚装着可能');
  var hp = global.calculateMaxHp(target);
  runner.assertEqual(hp, target.baseHp + 500 + 500, 'HP+1000 (2枚分)');
});

// Minomushi6b: 複数装着時の currentHp 変化なし
runner.test('Minomushi6b 複数装着時 currentHp 変化なし', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var target = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', target.instanceId);

  target.currentHp = 600;
  var enh1 = h.addToHandRaw(state, 'P1', minomushiDef());
  global.useEnhancement(state, 'P1', enh1.instanceId, target.instanceId);
  var enh2 = h.addToHandRaw(state, 'P1', minomushiDef());
  global.useEnhancement(state, 'P1', enh2.instanceId, target.instanceId);

  var hp = global.calculateMaxHp(target);
  runner.assertEqual(hp, target.baseHp + 500 + 500, '最大HP+1000');
  runner.assertEqual(target.currentHp, 600, 'currentHp は 600 のまま');
});

// Minomushi7: 虫が破壊されたら隠れ蓑もDISCARD
runner.test('Minomushi7 虫が破壊されたら隠れ蓑もDISCARD', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var target = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', target.instanceId);

  var enhancement = h.addToHandRaw(state, 'P1', minomushiDef());
  global.useEnhancement(state, 'P1', enhancement.instanceId, target.instanceId);

  toPlayerMain(state, 'P1');
  global.moveCard(state, target.instanceId, global.ZONES.FIELD, global.ZONES.DISCARD, { playerId: 'P1' });

  var inDiscard = state.player('P1').discard.some(function (c) { return c.instanceId === enhancement.instanceId; });
  runner.assert(inDiscard, '強化カードが DISCARD に移動');
  runner.assertEqual(enhancement.zone, global.ZONES.DISCARD, 'zone=DISCARD');
});

// Minomushi8: 虫が手札へ戻った場合も隠れ蓑DISCARD
runner.test('Minomushi8 虫が手札へ戻った場合も隠れ蓑DISCARD', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var target = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', target.instanceId);

  var enhancement = h.addToHandRaw(state, 'P1', minomushiDef());
  global.useEnhancement(state, 'P1', enhancement.instanceId, target.instanceId);

  toPlayerMain(state, 'P1');
  global.moveCard(state, target.instanceId, global.ZONES.FIELD, global.ZONES.HAND, { playerId: 'P1' });

  var inDiscard = state.player('P1').discard.some(function (c) { return c.instanceId === enhancement.instanceId; });
  runner.assert(inDiscard, '強化カードが DISCARD に移動');
});

// Minomushi9: attachment消失後HP modifier消失
runner.test('Minomushi9 attachment消失後HP modifier消失', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var target = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', target.instanceId);

  var enhancement = h.addToHandRaw(state, 'P1', minomushiDef());
  global.useEnhancement(state, 'P1', enhancement.instanceId, target.instanceId);

  var hpWith = global.calculateMaxHp(target);
  runner.assertEqual(hpWith, target.baseHp + 500, '装着時 HP+500');

  toPlayerMain(state, 'P1');
  global.moveCard(state, target.instanceId, global.ZONES.FIELD, global.ZONES.DISCARD, { playerId: 'P1' });

  var newTarget = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  global.summonInsect(state, 'P1', newTarget.instanceId);
  var hpNew = global.calculateMaxHp(newTarget);
  runner.assertEqual(hpNew, target.baseHp, '新しい虫は baseHp のみ');

  var hpDiscard = global.calculateMaxHp(target);
  runner.assertEqual(hpDiscard, target.baseHp, 'DISCARD にいる虫は baseHp');
});

module.exports = runner;