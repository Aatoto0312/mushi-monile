'use strict';
require('./engine-loader.js');
var TestRunner = require('./lib.js');
var h = require('./helpers.js');
var runner = new TestRunner();
require('../js/engine/cpu-agent.js');

global.cardRegistry.register(new global.CardDefinition({
  id: 'test_first_damage_shield', name: 'First damage shield', type: 'INSECT',
  color: 'RED', cost: 0, baseHp: 1500, implementationStatus: 'test',
  skills: [{ id: 'shield_attack', name: 'Attack', timing: 'ATTACK', baseAp: 100 }],
  passiveAbilities: [{ id: 'shield', effects: [{ type: 'PREVENT_DAMAGE', limit: 'FIRST_PER_TURN' }] }]
}));
global.cardRegistry.register(new global.CardDefinition({
  id: 'test_consume_damage_shield', name: 'Consume damage shield', type: 'ENHANCEMENT',
  cost: 0, implementationStatus: 'test',
  enhancementEffects: [{ type: 'PREVENT_DAMAGE', sourceType: 'ATTACK', consumeSelf: true }]
}));
global.cardRegistry.register(new global.CardDefinition({
  id: 'test_shield_attack', name: 'Shield attack', type: 'INSECT', color: 'RED',
  cost: 0, baseHp: 1000, implementationStatus: 'test',
  skills: [{ id: 'grant_shield', name: 'Shield', timing: 'ATTACK', baseAp: 0,
    effects: [{ type: 'GRANT_DAMAGE_SHIELD', startTurnOffset: 1, endTurnOffset: 1 }] }]
}));

function fixture() {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.toMainPhase(state);
  state.turnNumber = 3;
  state.player('P2').territory = [];
  var target = h.putInsectOnField(state, 'P2', 'test_first_damage_shield');
  return { state: state, target: target };
}
function damage(f, amount, sourceType) {
  var result = {};
  global.applyDamage(f.state, null, f.target, amount, sourceType || 'ATTACK', null, f.target.instanceId, result);
  return result;
}
function attach(f) {
  var card = new global.CardInstance({ instanceId: f.state.nextInstanceId(), cardId: 'test_consume_damage_shield', ownerId: 'P2', zone: 'FIELD' });
  f.target.attachments.push(card);
  return card;
}
runner.test('First damage prevention includes AP0 and resets on the next turn', function () {
  var f = fixture();
  runner.assertEqual(damage(f, 0).damageDealt, 0);
  runner.assertEqual(damage(f, 300).damageDealt, 300);
  f.state.turnNumber++;
  runner.assertEqual(damage(f, 300).damageDealt, 0);
  runner.assertEqual(f.target.currentHp, 1200);
});
runner.test('First damage prevention includes spell damage', function () {
  var f = fixture();
  runner.assertEqual(damage(f, 1000, 'SPELL').damageDealt, 0);
  runner.assertEqual(damage(f, 1000, 'SPELL').damageDealt, 1000);
});
runner.test('All attack prevention attachments consume even when another shield makes damage zero', function () {
  var f = fixture(), first = attach(f), second = attach(f);
  runner.assertEqual(damage(f, 500).damageDealt, 0);
  runner.assertEqual(f.target.attachments.length, 0);
  runner.assertEqual(first.zone, 'DISCARD');
  runner.assertEqual(second.zone, 'DISCARD');
  runner.assertEqual(damage(f, 500).damageDealt, 500);
});
runner.test('Attack prevention attachment survives spell damage', function () {
  var f = fixture(), attachment = attach(f);
  damage(f, 500, 'SPELL');
  runner.assertEqual(f.target.attachments.length, 1);
  runner.assertEqual(attachment.zone, 'FIELD');
});
runner.test('Scheduled shield is active only during its designated opponent turn', function () {
  var f = fixture();
  // Exhaust the permanent shield so only the temporary shield is measured.
  damage(f, 0);
  f.target.runtimeFlags.damageShields = [{ startTurn: 4, endTurn: 4, used: false }];
  runner.assertEqual(damage(f, 100).damageDealt, 100);
  f.state.turnNumber = 4;
  // Both shields observe this same event and both become used.
  runner.assertEqual(damage(f, 100).damageDealt, 0);
  runner.assertEqual(f.target.runtimeFlags.damageShields[0].used, true);
  runner.assertEqual(damage(f, 100).damageDealt, 100);
  f.state.turnNumber = 5;
  damage(f, 0);
  runner.assertEqual(damage(f, 100).damageDealt, 100);
});
[false, true].forEach(function (direct) {
  runner.test('Attack grants a next-turn shield after ' + (direct ? 'direct' : 'insect') + ' attack', function () {
    var f = fixture();
    var source = h.putInsectOnField(f.state, 'P1', 'test_shield_attack');
    if (direct) { f.state.player('P2').field = []; }
    global.performAttack(f.state, source.instanceId, direct ? null : f.target.instanceId, direct ? 'LEADER' : 'INSECT');
    runner.assertEqual(source.runtimeFlags.damageShields.length, 1);
    var shield = source.runtimeFlags.damageShields[0];
    runner.assertEqual(shield.startTurn, 4);
    runner.assertEqual(shield.endTurn, 4);
    f.target = source;
    runner.assertEqual(damage(f, 100).damageDealt, 100);
    f.state.turnNumber++;
    runner.assertEqual(damage(f, 100).damageDealt, 0);
    runner.assertEqual(damage(f, 100).damageDealt, 100);
  });
});
runner.test('SET1 destruction spell destroys without generating damage', function () {
  var f = fixture();
  var spell = h.addToHandRaw(f.state, 'P1', global.getCardDefinition('set1_117'));
  h.ensureCost(f.state, 'P1', 10);
  var hp = f.target.currentHp;
  global.useSpell(f.state, 'P1', spell.instanceId, f.target.instanceId);
  runner.assertEqual(f.target.zone, 'DISCARD');
  runner.assertEqual(f.target.currentHp, hp, 'destruction is not damage');
  runner.assertEqual(f.state.pendingEffect, null, 'spell destruction does not draw territory');
});
runner.test('Re-entering field resets first-damage prevention in the same turn', function () {
  var f = fixture();
  damage(f, 100);
  global.moveCard(f.state, f.target.instanceId, 'FIELD', 'HAND');
  global.moveCard(f.state, f.target.instanceId, 'HAND', 'FIELD');
  runner.assertEqual(damage(f, 100).damageDealt, 0);
});
runner.test('CPU skips destruction spell without a target and uses it with a legal target', function () {
  var f = fixture(), player = f.state.player('P1');
  player.hand = [];
  var spell = h.addToHandRaw(f.state, 'P1', global.getCardDefinition('set1_117'));
  h.ensureCost(f.state, 'P1', 10);
  var cpu = new global.CpuAgent('P1', { rng: function () { return 0; } });
  f.target.faceDown = true;
  runner.assert(cpu.decideMainPhaseAction(f.state).type !== 'USE_SPELL');
  f.target.faceDown = false;
  var action = cpu.decideMainPhaseAction(f.state);
  runner.assertEqual(action.type, 'USE_SPELL');
  runner.assertEqual(action.instanceId, spell.instanceId);
  cpu.executeAction(f.state, action);
  runner.assertEqual(f.target.zone, 'DISCARD');
});
runner.test('Prevented poison does not stop later ordinary damage from healing', function () {
  var f = fixture();
  var attacker = h.putInsectOnField(f.state, 'P1', 'set1_005');
  global.performAttack(f.state, attacker.instanceId, f.target.instanceId, 'INSECT', global.getCardDefinition('set1_005').skills[1].id);
  runner.assertEqual(f.target.currentHp, 1500);
  damage(f, 200);
  global.endTurn(f.state);
  runner.assertEqual(f.target.currentHp, 1500);
});
runner.test('Only poison damage persists; ordinary damage still heals', function () {
  var f = fixture();
  f.target = h.putInsectOnField(f.state, 'P2', 'set1_003');
  var attacker = h.putInsectOnField(f.state, 'P1', 'set1_005');
  global.performAttack(f.state, attacker.instanceId, f.target.instanceId, 'INSECT', global.getCardDefinition('set1_005').skills[1].id);
  damage(f, 200);
  global.endTurn(f.state);
  runner.assertEqual(f.target.currentHp, 900);
});
runner.test('Lethal poison survives shell replacement and still destroys with territory acquisition', function () {
  var f = fixture();
  h.addToTerritoryRaw(f.state, 'P2', global.getCardDefinition('set1_003'));
  f.target = h.putInsectOnField(f.state, 'P2', 'set1_003', { hp: 100 });
  f.target.runtimeFlags = { unhealableDamage: 1200 };
  var shell = h.addToHandRaw(f.state, 'P2', global.getCardDefinition('set1_102'));
  f.state.activePlayerId = 'P2'; h.ensureCost(f.state, 'P2', 10);
  global.useEnhancement(f.state, 'P2', shell.instanceId, f.target.instanceId);
  f.state.activePlayerId = 'P1';
  var attacker = h.putInsectOnField(f.state, 'P1', 'set1_005');
  var result = global.performAttack(f.state, attacker.instanceId, f.target.instanceId, 'INSECT', global.getCardDefinition('set1_005').skills[1].id);
  runner.assertEqual(shell.zone, 'DISCARD');
  runner.assertEqual(f.target.zone, 'DISCARD');
  runner.assert(result.defenderDestroyed);
  runner.assertEqual(f.state.pendingEffect.type, 'TERRITORY_DRAW_SELECTION');
});
module.exports = runner;
if (require.main === module) { runner.runAll(); }
