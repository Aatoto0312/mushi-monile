'use strict';

require('./engine-loader.js');
var TestRunner = require('./lib.js');
var h = require('./helpers.js');
var runner = new TestRunner();

function mainState() {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.toMainPhase(state);
  state.player('P1').field = [];
  state.player('P2').field = [];
  state.player('P1').territory = [];
  state.player('P2').territory = [];
  return state;
}

runner.test('SET1DynamicAP 食物色・捨て札・場数・相方存在を汎用計算する', function () {
  var state = mainState();
  var hiari = h.putInsectOnField(state, 'P1', 'set1_021');
  h.addToFoodRaw(state, 'P1', global.getCardDefinition('set1_003'));
  h.addToFoodRaw(state, 'P1', global.getCardDefinition('set1_028'));
  var target = h.putInsectOnField(state, 'P2', 'set1_028', { hp: 1000 });
  var result = global.performAttack(state, hiari.instanceId, target.instanceId, 'INSECT');
  runner.assertEqual(result.apVal, 400);
});

runner.test('SET1AttackRestriction 次のターンだけ攻撃を禁止する', function () {
  var state = mainState();
  var source = h.putInsectOnField(state, 'P1', 'set1_015');
  var target = h.putInsectOnField(state, 'P2', 'set1_028', { hp: 1000 });
  global.performAttack(state, source.instanceId, target.instanceId, 'INSECT', global.getCardDefinition('set1_015').skills[1].id);
  state.activePlayerId = 'P2';
  state.turnNumber += 1;
  runner.assertEqual(global.getLegalAttackTargets(state, target.instanceId).length, 0);
});

runner.test('SET1PoisonMist 攻撃破壊時に攻撃元を手札へ戻す', function () {
  var state = mainState();
  var source = h.putInsectOnField(state, 'P1', 'set1_003');
  var target = h.putInsectOnField(state, 'P2', 'set1_092', { hp: 100 });
  global.performAttack(state, source.instanceId, target.instanceId, 'INSECT');
  runner.assert(state.player('P1').hand.some(function (card) { return card.instanceId === source.instanceId; }));
});

runner.test('SET1MoveTarget ヘラクレスは場にいる間1回だけ相手虫を手札へ戻す', function () {
  var state = mainState();
  var source = h.putInsectOnField(state, 'P1', 'set1_034');
  var target = h.putInsectOnField(state, 'P2', 'set1_067');
  var skill = global.getCardDefinition('set1_034').skills[1];
  global.performAttack(state, source.instanceId, target.instanceId, 'INSECT', skill.id);
  runner.assert(state.player('P2').hand.some(function (card) { return card.instanceId === target.instanceId; }));
});

runner.test('SET1AttachmentTargetRule 鳳蝶の蟲惑は既存攻撃誘導へ合流する', function () {
  var state = mainState();
  var attacker = h.putInsectOnField(state, 'P1', 'set1_003');
  var forced = h.putInsectOnField(state, 'P2', 'set1_028');
  h.putInsectOnField(state, 'P2', 'set1_031');
  var attachment = new global.CardInstance({ instanceId: state.nextInstanceId(), cardId: 'set1_109', ownerId: 'P2', zone: global.ZONES.FIELD });
  forced.attachments.push(attachment);
  var legal = global.getLegalAttackTargets(state, attacker.instanceId);
  runner.assertEqual(legal.length, 1);
  runner.assertEqual(legal[0].instance.instanceId, forced.instanceId);
});

module.exports = runner;
