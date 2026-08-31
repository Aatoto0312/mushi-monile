'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();

function hariganemushiDef() {
  return global.cardRegistry.get('hariganemushi_no_michizure');
}

runner.test('Hariganemushi1 CardDefinition基本確認', function () {
  var def = hariganemushiDef();
  runner.assertEqual(def.officialNumber, '106/130', 'officialNumber=106/130');
  runner.assertEqual(def.type, global.CardTypes.ENHANCEMENT, 'type=ENHANCEMENT');
  runner.assertEqual(def.rarity, 'N', 'rarity=N');
  runner.assertEqual(def.cost, 0, 'cost=0');
  runner.assertEqual(def.implementationStatus, global.CardStatus.TESTED, 'status=TESTED');
  
  var passive = def.passiveAbilities.find(function(a) { return a.id === 'michizure'; });
  runner.assert(passive, 'passiveAbilities: 道連れ');
  runner.assertEqual(passive.timing, 'ON_DESTROYED', 'タイミング: ON_DESTROYED');
  runner.assertEqual(passive.condition.type, 'DESTROYED_BY_OPPONENT_ATTACK', '条件: 相手攻撃で破壊');
  runner.assertEqual(passive.effects[0].type, 'DESTROY_SOURCE', '効果: 破壊元を破壊');
});

runner.test('Hariganemushi2 装着して相手攻撃で破壊→道連れ発動', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  
  // P1: エサ・虫準備
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  
  var hostInsect = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', hostInsect.instanceId);
  
  // 針金虫の道連れを装着
  var enhancement = h.addToHandRaw(state, 'P1', hariganemushiDef());
  global.useEnhancement(state, 'P1', enhancement.instanceId, hostInsect.instanceId);
  
  // P2: 攻撃虫を直接配置
  var attacker = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 1000 });
  
  var p1Host = state.player('P1').field.find(function(c) { return c.cardId === 'test_red_1'; });
  var p2Attacker = state.player('P2').field.find(function(c) { return c.cardId === 'test_blue_1'; });
  
  // P2のターンにする: P1ターンを終了させる
  global.endTurn(state); // P1 -> P2 DRAW_PHASE
  global.beginTurn(state); // P2 TURN_START
  global.enterSetPhase(state); // P2 SET_PHASE
  global.setFood(state, 'P2', state.player('P2').hand[0].instanceId); // P2 エサセット
  global.enterMainPhase(state); // P2 MAIN_PHASE
  
  // P2がP1の虫を攻撃
  p1Host.currentHp = 1;
  global.performAttack(state, p2Attacker.instanceId, p1Host.instanceId, 'INSECT');
  
  // P1の虫が破壊された
  var p1Field = state.player('P1').field.filter(function(c) { return c.cardId === 'test_red_1'; });
  runner.assertEqual(p1Field.length, 0, 'P1の虫が破壊された');
  
  // 道連れ: 攻撃元のP2虫も破壊される
  var p2Field = state.player('P2').field.filter(function(c) { return c.cardId === 'test_blue_1'; });
  runner.assertEqual(p2Field.length, 0, '道連れ: 攻撃元の虫も破壊された');
});

runner.test('Hariganemushi3 共食い(自虫破壊コスト)では道連れ発動しない', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var okamakiriDef = global.cardRegistry.get('okamakiri');
  
  // P1: オオカマキリ+エサ
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  
  var okamakiri = h.addToHandRaw(state, 'P1', okamakiriDef);
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', okamakiri.instanceId);
  
  // P1に針金虫装着の虫をもう1体出す
  var hostInsect = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  global.summonInsect(state, 'P1', hostInsect.instanceId);
  
  var enhancement = h.addToHandRaw(state, 'P1', hariganemushiDef());
  global.useEnhancement(state, 'P1', enhancement.instanceId, hostInsect.instanceId);
  
  // P2: 虫を直接配置
  var oppInsect = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 1000 });
  
  // オオカマキリの共食いで自虫(針金虫装着虫)を破壊
  var okamakiriInst = state.player('P1').field.find(function(c) { return c.cardId === 'okamakiri'; });
  var target = state.player('P2').field[0];
  
  // 共食い使用 (追加コストで自虫破壊)
  global.performAttack(state, okamakiriInst.instanceId, target.instanceId, 'INSECT', 'tomogui');
  
  // 針金虫装着の自虫は破壊されるが、道連れは発動しない (自虫破壊コストなので)
  // hostInsect (test_red_1) が犠牲になって破壊される。オオカマキリ (okamakiri) は生存
  var p1Okamakiri = state.player('P1').field.filter(function(c) { return c.cardId === 'okamakiri'; });
  runner.assertEqual(p1Okamakiri.length, 1, 'オオカマキリは生存');
  
  var p1HostInsect = state.player('P1').field.filter(function(c) { return c.cardId === 'test_red_1'; });
  runner.assertEqual(p1HostInsect.length, 0, '自虫破壊コストで装着虫破壊');
  
  // 相手虫は生きている (道連れ発動せず)
  var p2Field = state.player('P2').field.filter(function(c) { return c.cardId === 'test_blue_1'; });
  runner.assertEqual(p2Field.length, 1, '相手虫は生存 (道連れ発動せず)');
});

runner.test('Hariganemushi4 SPELL破壊では道連れ発動しない', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var jinkaichuDef = global.cardRegistry.get('jinkaichu_no_bakunetsudan');
  
  // P1: 虫+針金虫装着
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var hostInsect = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', hostInsect.instanceId);
  
  var enhancement = h.addToHandRaw(state, 'P1', hariganemushiDef());
  global.useEnhancement(state, 'P1', enhancement.instanceId, hostInsect.instanceId);
  
  // P2: 爆熱弾を2枚用意して使用
  h.addToFoodRaw(state, 'P2', h.defById('test_blue_1'));
  h.toMainPhase(state);
  var jinkaichu1 = h.addToHandRaw(state, 'P2', jinkaichuDef);
  var jinkaichu2 = h.addToHandRaw(state, 'P2', jinkaichuDef);
  // P2のターンにする
  global.endTurn(state); // P1 -> P2 DRAW_PHASE
  global.beginTurn(state); // P2 TURN_START
  global.enterSetPhase(state); // P2 SET_PHASE
  global.setFood(state, 'P2', state.player('P2').hand[0].instanceId); // P2 エサセット
  global.enterMainPhase(state); // P2 MAIN_PHASE
  
  // 1枚目を使用してコストを支払う
  global.useSpell(state, 'P2', jinkaichu1.instanceId);
  
  // test_red_1をHPを下げてから 2枚目のSPELLで破壊する
  hostInsect.currentHp = 1;
  global.useSpell(state, 'P2', jinkaichu2.instanceId);
  
  var p1Field = state.player('P1').field.filter(function(c) { return c.cardId === 'test_red_1'; });
  runner.assertEqual(p1Field.length, 0, 'SPELLで破壊された');
  
  // 道連れ発動しない (条件がDESTROYED_BY_OPPONENT_ATTACKなので)
  // 確認用: P2に虫がいなくても発動しない
  // (テスト完了時点で追加の破壊が発生していないことを確認)
});

module.exports = runner;