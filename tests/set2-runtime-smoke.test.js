'use strict';
require('./engine-loader.js');
var TestRunner = require('./lib.js');
var h = require('./helpers.js');
var runner = new TestRunner();

// Test copies bypass only the release-status gate, never the action/target/cost
// rules. Production definitions remain PARTIAL until all release gates pass.
global.cardRegistry.getBySet('BOOSTER_SET_2').filter(function (def) {
  return def.implementationStatus === 'PARTIAL';
}).forEach(function (definition) {
  var raw = JSON.parse(JSON.stringify(definition));
  raw.id = 'test_runtime_' + definition.id;
  raw.set = null;
  raw.implementationStatus = 'test';
  var def = new global.CardDefinition(raw);
  global.cardRegistry.register(def);
  runner.test(definition.id + ' uses its connected definition through a Battle action and turn continuation', function () {
    var state = h.newGame({ rng: h.firstPlayerRng });
    h.toMainPhase(state);
    state.turnNumber = 3;
    state.player('P1').field = [];
    state.player('P2').field = [];
    state.player('P2').territory = [];
    var held = h.addToHandRaw(state, 'P1', def);
    h.ensureCost(state, 'P1', 20);
    if (def.type === 'INSECT') {
      global.summonInsect(state, 'P1', held.instanceId);
      runner.assertEqual(held.zone, 'FIELD');
      runner.assertEqual(state.player('P1').availableCost, 20 - def.cost);
      var target = h.putInsectOnField(state, 'P2', 'set1_003', { hp: 10000 });
      if (def.skills.some(function (skill) { return skill.timing === 'ATTACK'; })) {
        global.performAttack(state, held.instanceId, target.instanceId, 'INSECT', def.skills[0].id);
        runner.assert(held.attackedThisTurn, 'attack completes');
      } else { runner.assertEqual(global.getLegalAttackTargets(state, held.instanceId).length, 0, 'non-attacker has no attack actions'); }
    } else if (def.type === 'ENHANCEMENT') {
      var host = h.putInsectOnField(state, 'P1', 'set1_003');
      global.useEnhancement(state, 'P1', held.instanceId, host.instanceId);
      runner.assertEqual(host.attachments[0], held);
      runner.assertEqual(state.player('P1').availableCost, 20 - def.cost);
    } else if (definition.id === 'set2_052') {
      global.useSpell(state, 'P1', held.instanceId);
      runner.assertEqual(held.zone, 'DISCARD');
      runner.assertEqual(state.player('P2').territoryTriggerSuppressionUntilTurn, state.turnNumber);
    } else if (definition.id === 'set2_054') {
      var ally = h.putInsectOnField(state, 'P1', 'set1_003');
      global.useSpell(state, 'P1', held.instanceId, ally.instanceId);
      runner.assertEqual(global.getEffectiveAP(state, ally, 100), 600);
      runner.assertEqual(held.zone, 'DISCARD');
    } else if (definition.id === 'set2_055') {
      var food = h.addToFoodRaw(state, 'P1', global.getCardDefinition('set1_117'));
      global.useSpell(state, 'P1', held.instanceId, food.instanceId);
      runner.assertEqual(food.zone, 'HAND');
      runner.assertEqual(held.zone, 'DISCARD');
    } else {
      var victim = h.putInsectOnField(state, 'P2', 'set1_003', { hp: 1500 });
      global.useSpell(state, 'P1', held.instanceId, victim.instanceId);
      runner.assertEqual(victim.currentHp, 500);
      runner.assertEqual(held.zone, 'DISCARD');
      runner.assertEqual(state.player('P1').availableCost, 20 - def.cost);
    }
    runner.assertEqual(state.pendingEffect, null);
    global.endTurn(state);
    runner.assertEqual(state.activePlayerId, 'P2');
    runner.assertEqual(state.pendingEffect, null);
  });
});
module.exports = runner;
if (require.main === module) { runner.runAll(); }
