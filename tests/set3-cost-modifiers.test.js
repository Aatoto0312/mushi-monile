'use strict';
require('./engine-loader.js');
var TestRunner = require('./lib.js');
var h = require('./helpers.js');
var runner = new TestRunner();

runner.test('SET3 aquatic insects reduce summon cost by one per two face-up blue food', function () {
  var state = h.newGame({ rng: h.firstPlayerRng }); h.toMainPhase(state);
  var raw = JSON.parse(JSON.stringify(global.getCardDefinition('set3_002')));
  raw.id = 'test_set3_aquatic'; raw.implementationStatus = 'test';
  var def = new global.CardDefinition(raw); def.costModifiers = raw.costModifiers; global.cardRegistry.register(def);
  var held = h.addToHandRaw(state, 'P1', def);
  state.player('P1').food = [];
  h.addToFoodRaw(state, 'P1', global.getCardDefinition('kabutomushi'));
  h.addToFoodRaw(state, 'P1', global.getCardDefinition('kabutomushi'));
  h.addToFoodRaw(state, 'P1', global.getCardDefinition('kabutomushi')).faceDown = true;
  state.player('P1').availableCost = 4;
  runner.assertEqual(global.getEffectiveCardCost(state, 'P1', def), 4);
  global.summonInsect(state, 'P1', held.instanceId);
  runner.assertEqual(state.player('P1').availableCost, 0);
});

runner.test('SET3 low-cost spell tax uses printed cost and stacks across both fields', function () {
  var state = h.newGame({ rng: h.firstPlayerRng }); h.toMainPhase(state);
  var tax = global.getCardDefinition('set3_003');
  h.putInsectOnField(state, 'P1', tax.id);
  h.putInsectOnField(state, 'P2', tax.id);
  var spell = global.getCardDefinition('niji_no_kakehashi');
  runner.assertEqual(spell.cost, 1);
  runner.assertEqual(global.getEffectiveCardCost(state, 'P1', spell), 3);
});

runner.test('SET3 empty-field and host enhancement discounts are contextual', function () {
  var state = h.newGame({ rng: h.firstPlayerRng }); h.toMainPhase(state);
  var night = global.getCardDefinition('set3_019');
  runner.assertEqual(global.getEffectiveCardCost(state, 'P1', night), night.cost - 1);
  var host = h.putInsectOnField(state, 'P1', 'set3_018');
  runner.assertEqual(global.getEffectiveCardCost(state, 'P1', global.getCardDefinition('set3_046'), { targetInstanceId: host.instanceId }), 2);
});

module.exports = runner;
if (require.main === module) { runner.runAll(); }
