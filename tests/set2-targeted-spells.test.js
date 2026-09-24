'use strict';
require('./engine-loader.js');
var h = require('./helpers.js');
var TestRunner = require('./lib.js');
var runner = new TestRunner();
function testDefinition(number, effect) {
  var raw = JSON.parse(JSON.stringify(global.getCardDefinition('set2_0' + number)));
  raw.id = 'test_targeted_set2_' + number;
  raw.set = null;
  raw.implementationStatus = 'test';
  raw.cardEffects = [effect];
  global.cardRegistry.register(new global.CardDefinition(raw));
  return global.getCardDefinition(raw.id);
}
var boost = testDefinition(54, { type: 'APPLY_STAT_MODIFIER', target: 'OWN_FIELD_INSECT', requiresTarget: true, stat: 'AP', amount: 500 });
var harvest = testDefinition(55, { type: 'MOVE_TARGET', target: 'OWN_FOOD', cardTypes: ['SPELL', 'ENHANCEMENT'], requiresTarget: true, from: 'FOOD', to: 'HAND' });
function fixture(def) {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.toMainPhase(state);
  state.turnNumber = 3;
  state.player('P1').field = [];
  state.player('P1').food = [];
  h.ensureCost(state, 'P1', 5);
  return { state: state, spell: h.addToHandRaw(state, 'P1', def) };
}
runner.test('Targeted AP spell offers only own visible insects and expires at turn end', function () {
  var f = fixture(boost);
  var target = h.putInsectOnField(f.state, 'P1', 'set1_003');
  var other = h.putInsectOnField(f.state, 'P1', 'set1_003');
  other.faceDown = true;
  h.putInsectOnField(f.state, 'P2', 'set1_003');
  runner.assertEqual(global.getSpellTargetCandidates(f.state, 'P1', f.spell.instanceId).map(function (c) { return c.instanceId; }).join(','), target.instanceId);
  global.useSpell(f.state, 'P1', f.spell.instanceId, target.instanceId);
  runner.assertEqual(global.getEffectiveAP(f.state, target, 100), 600);
  runner.assertEqual(global.getEffectiveAP(f.state, other, 100), 100);
  global.endTurn(f.state);
  runner.assertEqual(global.getEffectiveAP(f.state, target, 100), 100);
});
runner.test('Typed food retrieval excludes insects and face-down food, then completes selection', function () {
  var f = fixture(harvest);
  var legal = h.addToFoodRaw(f.state, 'P1', global.getCardDefinition('set1_117'));
  var alsoLegal = h.addToFoodRaw(f.state, 'P1', global.getCardDefinition('set1_100'));
  h.addToFoodRaw(f.state, 'P1', global.getCardDefinition('set1_003'));
  var hidden = h.addToFoodRaw(f.state, 'P1', global.getCardDefinition('set1_117'));
  hidden.faceDown = true;
  runner.assertEqual(global.getSpellTargetCandidates(f.state, 'P1', f.spell.instanceId).length, 2);
  global.useSpell(f.state, 'P1', f.spell.instanceId);
  runner.assertEqual(f.state.pendingEffect.type, 'SPELL_TARGET_SELECTION');
  global.resolveSpellTargetSelection(f.state, 'P1', legal.instanceId);
  runner.assertEqual(legal.zone, 'HAND');
  runner.assertEqual(alsoLegal.zone, 'FOOD');
  runner.assertEqual(f.state.pendingEffect, null);
  global.endTurn(f.state);
  runner.assertEqual(f.state.activePlayerId, 'P2');
});
module.exports = runner;
if (require.main === module) { runner.runAll(); }
