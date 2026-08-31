'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();

function kabutomushiDef() {
  return global.cardRegistry.get('kabutomushi');
}

runner.test('Kabutomushi1 CardDefinition基本確認', function () {
  var def = kabutomushiDef();
  runner.assertEqual(def.officialNumber, '40/130', 'officialNumber=40/130');
  runner.assertEqual(def.color, global.Attributes.BLUE, 'color=BLUE');
  runner.assertEqual(def.cost, 4, 'cost=4');
  runner.assertEqual(def.baseHp, 800, 'baseHp=800');
  runner.assertEqual(def.rarity, 'SR', 'rarity=SR');
  runner.assertEqual(def.implementationStatus, global.CardStatus.TESTED, 'status=TESTED');
  
  var skillNames = def.skills.map(function(s) { return s.name; });
  runner.assert(skillNames.indexOf('ツノ突進') !== -1, '技: ツノ突進');
  runner.assert(skillNames.indexOf('すくい投げ') !== -1, '技: すくい投げ');
  
  var tsunoTosshin = def.skills.find(function(s) { return s.id === 'tsuno_tosshin'; });
  runner.assertEqual(tsunoTosshin.baseAp, 500, 'ツノ突進 AP=500');
  
  var sukoinage = def.skills.find(function(s) { return s.id === 'sukoinage'; });
  runner.assertEqual(sukoinage.baseAp, 0, 'すくい投げ AP=0');
  runner.assertEqual(sukoinage.effects.length, 1, '効果1つ');
  runner.assertEqual(sukoinage.effects[0].type, 'TURN_FACE_DOWN', '効果: 裏向き');
  runner.assertEqual(sukoinage.effects[0].duration, 'UNTIL_END_OF_TURN', '持続: ターン終了時まで');
});

runner.test('Kabutomushi2 召喚可能', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  
  // エサ6枚
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  
  var kabutomushi = h.addToHandRaw(state, 'P1', kabutomushiDef());
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', kabutomushi.instanceId);
  
  var field = state.player('P1').field;
  runner.assertEqual(field.length, 1, '場に1体');
  runner.assertEqual(field[0].cardId, 'kabutomushi', 'カブトムシが場に');
  runner.assertEqual(field[0].currentHp, 800, 'HP=800');
});

runner.test('Kabutomushi3 ツノ突進 - 通常攻撃AP500', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  
  // エサ6枚
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  
  var kabutomushi = h.addToHandRaw(state, 'P1', kabutomushiDef());
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', kabutomushi.instanceId);
  
  // 相手に虫を出す (直接配置)
  var target = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 800 });
  
  var kabutoInst = state.player('P1').field.find(function(c) { return c.cardId === 'kabutomushi'; });
  
  var result = global.performAttack(state, kabutoInst.instanceId, target.instanceId, 'INSECT', 'tsuno_tosshin');
  
  runner.assertEqual(result.damageDealt, 500, 'ツノ突進ダメージ=500');
  runner.assertEqual(target.currentHp, 300, '相手HP=300 (800-500)');
});

runner.test('Kabutomushi4 すくい投げ - AP0で相手虫を裏返す', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  
  // エサ6枚
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  
  var kabutomushi = h.addToHandRaw(state, 'P1', kabutomushiDef());
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', kabutomushi.instanceId);
  
  // 相手に虫を出す (直接配置)
  var target = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 800 });
  
  var kabutoInst = state.player('P1').field.find(function(c) { return c.cardId === 'kabutomushi'; });
  
  var result = global.performAttack(state, kabutoInst.instanceId, target.instanceId, 'INSECT', 'sukoinage');
  
  runner.assertEqual(result.damageDealt, 0, 'すくい投げダメージ=0');
  runner.assertEqual(target.currentHp, 800, '相手HP変化なし');
  runner.assertEqual(target.faceDown, true, '相手虫が裏向き');
  runner.assertEqual(result.turnedFaceDown, true, '裏返しフラグ');
  runner.assertEqual(target.runtimeFlags.faceDownUntil, 'UNTIL_END_OF_TURN', 'ターン終了まで');
});

runner.test('Kabutomushi5 すくい投げ - 裏向き虫は攻撃対象外', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  
  // エサ6枚
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  
  var kabutomushi = h.addToHandRaw(state, 'P1', kabutomushiDef());
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', kabutomushi.instanceId);
  
  // 相手に虫を出し、裏向きにする (直接配置)
  var target = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 800 });
  target.faceDown = true;
  target.runtimeFlags = { faceDownUntil: 'UNTIL_END_OF_TURN' };
  
  var kabutoInst = state.player('P1').field.find(function(c) { return c.cardId === 'kabutomushi'; });
  
  // 裏向き虫を攻撃対象にしようとするとエラー
  var threw = false;
  try {
    global.performAttack(state, kabutoInst.instanceId, target.instanceId, 'INSECT', 'tsuno_tosshin');
  } catch (e) {
    threw = true;
  }
  runner.assert(threw, '裏向き虫は攻撃対象外');
  
  // ターン終了処理で表向きに戻る
  global.endTurn(state); // P1ターン終了
  // P2ターンで endTurn 呼ぶと全プレイヤーのUNTIL_END_OF_TURNが解除される
  // h.passFullTurnRefresh(state, 'P1') で次のP1ターンまで進める
  h.passFullTurnRefresh(state, 'P1');
  
  var target2 = state.player('P2').field[0];
  runner.assertEqual(target2.faceDown, false, 'ターン終了で表向きに戻る');
});

runner.test('Kabutomushi6 すくい投げ - 強化カードも一緒に裏返る', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  
  // エサ6枚
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  
  var kabutomushi = h.addToHandRaw(state, 'P1', kabutomushiDef());
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', kabutomushi.instanceId);
  
  // 相手に虫を出し、強化を装着 (ミノムシの隠れ蓑 - attachment)
  var minomushiDef = global.cardRegistry.get('minomushi_no_kakuremino');
  var target = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 800 });
  var enhancement = h.addToHandRaw(state, 'P2', minomushiDef);
  // 装着するにはメインフェイズが必要だが、直接テスト用にattachmentsに追加
  target.attachments = [enhancement];
  enhancement.zone = global.ZONES.FIELD;
  
  runner.assert(target.attachments && target.attachments.length > 0, '強化が付いている');
  
  // すくい投げで裏返す
  var kabutoInst = state.player('P1').field.find(function(c) { return c.cardId === 'kabutomushi'; });
  global.performAttack(state, kabutoInst.instanceId, target.instanceId, 'INSECT', 'sukoinage');
  
  runner.assertEqual(target.faceDown, true, '虫が裏向き');
  runner.assert(target.attachments && target.attachments.length > 0, '強化も一緒に裏向き (zone維持)');
  
  // ターン終了で表向きに戻る
  h.passFullTurnRefresh(state, 'P1');
  
  var target2 = state.player('P2').field[0];
  runner.assertEqual(target2.faceDown, false, '表向きに戻る');
  runner.assert(target2.attachments && target2.attachments.length > 0, '強化も表向きに戻る (zone維持)');
});

module.exports = runner;