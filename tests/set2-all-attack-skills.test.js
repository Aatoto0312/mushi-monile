'use strict';
require('./engine-loader.js');
require('../js/engine/cpu-agent.js');
var h = require('./helpers.js'), Runner = require('./lib.js'), runner = new Runner();

function resolvePending(state) {
  var agents = {
    P1: new global.CpuAgent('P1', { rng: function () { return 0; } }),
    P2: new global.CpuAgent('P2', { rng: function () { return 0; } })
  };
  for (var count = 0; state.pendingEffect && count < 20; count++) {
    var pending = state.pendingEffect, agent = agents[pending.playerId];
    var action = agent && agent.getPendingAction(state);
    if (!action || !agent.executeAction(state, action)) {
      throw new Error('unresolved pending for ' + pending.type + ' controlled by ' + pending.playerId);
    }
  }
  if (state.pendingEffect) { throw new Error('pending continuation did not finish'); }
}

global.cardRegistry.getBySet('BOOSTER_SET_2').filter(function (definition) {
  return definition.type === global.CardTypes.INSECT;
}).forEach(function (definition) {
  definition.skills.filter(function (skill) { return skill.timing === 'ATTACK'; }).forEach(function (skill, skillIndex) {
    runner.test(definition.id + ' attack skill ' + (skillIndex + 1) + ' resolves through selection and continuation', function () {
      var state = h.newGame({ rng: h.firstPlayerRng }); h.toMainPhase(state); state.turnNumber = 3;
      state.player('P1').hand = []; state.player('P1').field = [];
      state.player('P2').field = []; state.player('P2').territory = [];
      var attacker = h.putInsectOnField(state, 'P1', definition.id);
      var ally = h.putInsectOnField(state, 'P1', 'set1_003'); ally.attackedThisTurn = true;
      var targets = [
        h.putInsectOnField(state, 'P2', 'set1_003', { hp: 100000 }),
        h.putInsectOnField(state, 'P2', 'set1_004', { hp: 100000 })
      ];
      if (definition.id === 'set2_017') { targets[0].currentHp = targets[0].baseHp - 1; }
      var effect = (skill.effects || []).filter(function (item) { return item.type === 'ATTACK_MULTIPLE_TARGETS'; })[0];
      if (effect) {
        global.beginMultiTargetAttackSelection(state, attacker.instanceId, skill.id);
        global.resolveCardSelection(state, 'P1', targets.slice(0, effect.exactSelections).map(function (card) { return card.instanceId; }), true);
      } else {
        var legal = global.getLegalAttackTargets(state, attacker.instanceId, skill.id);
        runner.assert(legal.length > 0, definition.id + ' ' + skill.name + ' must have a legal target');
        var target = legal.filter(function (item) { return item.targetType === 'INSECT'; })[0] || legal[0];
        global.performAttack(state, attacker.instanceId,
          target.instance ? target.instance.instanceId : null, target.targetType, skill.id);
      }
      resolvePending(state);
      runner.assert(attacker.attackedThisTurn || attacker.zone !== global.ZONES.FIELD,
        definition.id + ' ' + skill.name + ' must complete its attack');
    });
  });
});

module.exports = runner;
if (require.main === module) runner.runAll().then(function (result) { if (result.failed) process.exitCode = 1; });
