'use strict';

require('./engine-loader.js');
require('../js/engine/cpu-agent.js');
var h = require('./helpers.js');
var Runner = require('./lib.js');
var runner = new Runner();

function attach(state, playerId, host, cardId) {
  var card = h.addToHandRaw(state, playerId, getCardDefinition(cardId));
  moveCard(state, card.instanceId, ZONES.HAND, ZONES.FIELD, { playerId: playerId });
  state.player(playerId).field.splice(state.player(playerId).field.indexOf(card), 1);
  card.zone = 'ATTACHMENT';
  host.attachments.push(card);
  return card;
}

runner.test('SET4-53 reselects its copied enhancement when it is transferred', function() {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.toMainPhase(state);
  h.ensureCost(state, 'P1', 20);
  var firstHost = h.putInsectOnField(state, 'P1', 'set1_003');
  var secondHost = h.putInsectOnField(state, 'P1', 'set1_004');
  var source = attach(state, 'P1', firstHost, 'set4_046');
  var copy = h.addToHandRaw(state, 'P1', getCardDefinition('set4_053'));
  useEnhancement(state, 'P1', copy.instanceId, firstHost.instanceId);
  resolveCardSelection(state, 'P1', [source.instanceId], true);
  var transfer = h.addToHandRaw(state, 'P1', getCardDefinition('set1_104'));
  useSpell(state, 'P1', transfer.instanceId);
  resolveCardSelection(state, 'P1', [copy.instanceId, secondHost.instanceId], true);
  runner.assert(state.pendingEffect && state.pendingEffect.selectionPurpose === 'COPY_ENHANCEMENT_SOURCE',
    'official ruling requires a new source choice when the copy enhancement is transferred');
});

runner.test('SET4-62 excludes enhancements whose use requirements cannot be satisfied', function() {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.toMainPhase(state);
  h.ensureCost(state, 'P1', 20);
  h.putInsectOnField(state, 'P1', 'set1_003');
  var incompatible = h.addToFoodRaw(state, 'P1', getCardDefinition('set3_048'));
  var spell = h.addToHandRaw(state, 'P1', getCardDefinition('set4_062'));
  useSpell(state, 'P1', spell.instanceId);
  runner.assert(state.pendingEffect.options.indexOf(incompatible.instanceId) === -1,
    'official ruling forbids selecting an enhancement that requires discard insects');
});

runner.test('SET4-54 and SET2-07 expose the official same-controller resolution order choice', function() {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.toMainPhase(state);
  var attacker = h.putInsectOnField(state, 'P1', 'set2_007', { hp: 3000 });
  attach(state, 'P1', attacker, 'set4_054');
  var victim = h.putInsectOnField(state, 'P2', 'set1_003', { hp: 100 });
  var captureSkill = getCardDefinition(attacker.cardId).skills[1];
  performAttack(state, attacker.instanceId, victim.instanceId, 'INSECT', captureSkill.id);
  runner.assert(state.pendingEffect && state.pendingEffect.selectionPurpose === 'SIMULTANEOUS_EFFECT_ORDER',
    'official ruling lets the controller choose capture-first or fan-first');
});

runner.test('CPU does not choose SET4-39 second skill without an enhancement to pay', function() {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.toMainPhase(state);
  state.player('P1').hand = [];
  var attacker = h.putInsectOnField(state, 'P1', 'set4_039', { hp: 3000 });
  h.putInsectOnField(state, 'P2', 'set1_003', { hp: 5000 });
  var cpu = new CpuAgent('P1', { rng: function() { return 0.999; } });
  var action = cpu.decideMainPhaseAction(state);
  var expensiveSkill = getCardDefinition(attacker.cardId).skills[1];
  runner.assert(action.skillId !== expensiveSkill.id,
    'CPU must filter a skill whose mandatory attachment-destruction cost cannot be paid');
});

runner.test('SET4-07 lets the attacker choose an opponent hand card without revealing its face', function() {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.toMainPhase(state);
  state.player('P2').hand = [];
  var attacker = h.putInsectOnField(state, 'P1', 'set4_007', { hp: 3000 });
  var target = h.putInsectOnField(state, 'P2', 'set1_003', { hp: 5000 });
  h.addToHandRaw(state, 'P2', getCardDefinition('set1_004'));
  h.addToHandRaw(state, 'P2', getCardDefinition('set4_046'));
  var skill = getCardDefinition(attacker.cardId).skills[1];
  performAttack(state, attacker.instanceId, target.instanceId, 'INSECT', skill.id);
  runner.assert(state.pendingEffect && state.pendingEffect.selectionPurpose === 'BLIND_OPPONENT_HAND',
    'card text requires the attacker to choose one hidden hand card');
});

module.exports = runner;
if (require.main === module) {
  runner.runAll().then(function(result) { if (result.failed) process.exitCode = 1; });
}
