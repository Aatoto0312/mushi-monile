'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();

function nijiDef() {
  return global.cardRegistry.get('niji_no_kakehashi');
}

// Niji1: 正式CardDefinition確認
runner.test('Niji1 虹の架け橋CardDefinition', function () {
  var def = nijiDef();
  runner.assert(def, 'niji_no_kakehashiが登録されている');
  runner.assertEqual(def.officialNumber, '118/130', 'officialNumber=118/130');
  runner.assertEqual(def.rarity, 'R', 'rarity=R');
  runner.assertEqual(def.type, global.CardTypes.SPELL, 'type=SPELL');
  runner.assertEqual(def.cost, 1, 'cost=1');
  runner.assertEqual(def.cardEffects.length, 1, 'cardEffects.length=1');
  runner.assertEqual(def.cardEffects[0].type, 'RETRIEVE_FROM_DISCARD', 'effect type');
  runner.assertEqual(def.cardEffects[0].cardType, 'INSECT', 'cardType=INSECT');
  runner.assertEqual(def.isPlayable(), true, 'isPlayable=true');
  runner.assertEqual(def.implementationStatus, global.CardStatus.TESTED, 'status=TESTED');
});

// Niji2: 基本使用 捨て札の虫を手札に加える
runner.test('Niji2 捨て札の虫を手札に加える', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.toMainPhase(state);

  // 虫を捨て札に置く
  var discardedInsect = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  global.moveCard(state, discardedInsect.instanceId, global.ZONES.HAND, global.ZONES.DISCARD, { playerId: 'P1' });
  runner.assertEqual(state.player('P1').discard.length, 1, 'discardに1枚');

  var niji = h.addToHandRaw(state, 'P1', nijiDef());
  var handBefore = state.player('P1').hand.length;

  global.useSpell(state, 'P1', niji.instanceId);

  runner.assertEqual(state.player('P1').hand.length, handBefore, '手札枚変化なし(虹DISCARD+虫回収=±0)');
  // 回収した虫が手札にある
  var hasRetrieved = state.player('P1').hand.some(function (c) { return c.cardId === 'test_red_1' && c.instanceId === discardedInsect.instanceId; });
  runner.assert(hasRetrieved, '回収した虫が手札にある');
  runner.assertEqual(niji.zone, global.ZONES.DISCARD, '虹の架け橋はDISCARD');
});

// Niji3: 虫以外回収しない
runner.test('Niji3 術カードは回収しない', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.toMainPhase(state);

  // 術カードを捨て札に置く
  var spellDef = global.cardRegistry.get('mushi_no_ibuki'); // SPELL
  var discardedSpell = h.addToHandRaw(state, 'P1', spellDef);
  global.moveCard(state, discardedSpell.instanceId, global.ZONES.HAND, global.ZONES.DISCARD, { playerId: 'P1' });
  runner.assertEqual(state.player('P1').discard.length, 1, 'discardに術1枚');

  var niji = h.addToHandRaw(state, 'P1', nijiDef());
  var handBefore = state.player('P1').hand.length;
  global.useSpell(state, 'P1', niji.instanceId);

  // 術は回収されない → 手札は-1(虹のみDISCARD)
  runner.assertEqual(state.player('P1').hand.length, handBefore - 1, '術は回収されず手札-1');
  runner.assertEqual(state.player('P1').discard.length, 2, 'discardに2枚(術+虹)');
});

// Niji4: 捨て札に虫がいなければ空振り
runner.test('Niji4 捨て札に虫なし→空振り', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.toMainPhase(state);

  var niji = h.addToHandRaw(state, 'P1', nijiDef());
  var handBefore = state.player('P1').hand.length;
  global.useSpell(state, 'P1', niji.instanceId);

  runner.assertEqual(state.player('P1').hand.length, handBefore - 1, '手札-1(虹のみDISCARD)');
  runner.assertEqual(niji.zone, global.ZONES.DISCARD, '虹の架け橋はDISCARD');
});

// Niji5: コスト不足で使用不可
runner.test('Niji5 コスト不足で拒否', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var niji = h.addToHandRaw(state, 'P1', nijiDef());
  h.toMainPhase(state); // cost=0

  var threw = false;
  try {
    global.useSpell(state, 'P1', niji.instanceId);
  } catch (e) {
    threw = true;
  }
  runner.assert(threw, 'コスト不足で拒否');
  runner.assertEqual(niji.zone, global.ZONES.HAND, 'HANDに残る');
});

// Niji6: 使用後DISCARDへ
runner.test('Niji6 使用後DISCARDへ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.toMainPhase(state);

  var niji = h.addToHandRaw(state, 'P1', nijiDef());
  var result = global.useSpell(state, 'P1', niji.instanceId);

  runner.assertEqual(result.finalZone, global.ZONES.DISCARD, 'finalZone=DISCARD');
  runner.assertEqual(niji.zone, global.ZONES.DISCARD, 'DISCARDへ移動');
  runner.assertEqual(state.player('P1').resolving.length, 0, 'RESOLVINGは空');
});

// Niji7: メインフェイズ以外では使用不可
runner.test('Niji7 メインフェイズ以外では使用不可', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var niji = h.addToHandRaw(state, 'P1', nijiDef());
  var threw = false;
  try { global.useSpell(state, 'P1', niji.instanceId); } catch (e) { threw = true; }
  runner.assert(threw, 'DRAW_PHASEで拒否');
});

// Niji8: 複数虫捨て札→1体回収
runner.test('Niji8 複数虫捨て札→1体回収', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.toMainPhase(state);

  // 2体捨て札
  var d1 = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  global.moveCard(state, d1.instanceId, global.ZONES.HAND, global.ZONES.DISCARD, { playerId: 'P1' });
  var d2 = h.addToHandRaw(state, 'P1', h.defById('test_blue_1'));
  global.moveCard(state, d2.instanceId, global.ZONES.HAND, global.ZONES.DISCARD, { playerId: 'P1' });
  runner.assertEqual(state.player('P1').discard.length, 2, 'discardに2枚');

  var niji = h.addToHandRaw(state, 'P1', nijiDef());
  var handBefore = state.player('P1').hand.length;
  global.useSpell(state, 'P1', niji.instanceId);

  // 1体回収+虹DISCARD → 手札変化なし
  runner.assertEqual(state.player('P1').hand.length, handBefore, '手札変化なし(虹DISCARD+1体回収=±0)');
  runner.assertEqual(state.player('P1').discard.length, 2, 'discardに2枚(残り1虫+虹)');
});

module.exports = runner;
