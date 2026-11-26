'use strict';
require('./engine-loader');
require('../js/engine/cpu-agent');
const assert = require('node:assert/strict');
const helpers = require('./helpers');
const runner = new (require('./lib'))();

function main() {
  const state = helpers.newGame({rng: helpers.firstPlayerRng});
  helpers.toMainPhase(state);
  state.turnNumber = 3;
  for (const id of state.playerOrder) {
    const player = state.player(id);
    player.food = []; player.field = []; player.hand = []; player.discard = [];
    player.availableCost = 12;
  }
  return state;
}

for (const id of ['set8_017', 'set8_039']) {
  runner.test(id + ' face-up food permits a discounted king to attack only while its aura is present', () => {
    const state = main(), definition = getCardDefinition(id);
    assert.ok(definition?.isPlayable());
    const king = getCardDefinition('set8_035');
    const food = helpers.addToFoodRaw(state, 'P1', definition);
    const enemyFood = helpers.addToFoodRaw(state, 'P2', definition);
    const other = helpers.addToFoodRaw(state, 'P1', getCardDefinition('set8_017'));
    assert.equal(getEffectiveCardCost(state, 'P1', king), king.cost - 2);
    other.faceDown = true;
    const card = helpers.addToHandRaw(state, 'P1', king);
    const cpu = new CpuAgent('P1', {rng: () => 0});
    const action = cpu.decideMainPhaseAction(state);
    assert.equal(action.type, 'SUMMON');
    assert.ok(cpu.executeAction(state, action));
    assert.equal(state.player('P1').availableCost, 12 - king.cost + 1);
    assert.ok(getLegalAttackTargets(state, card.instanceId).length);
    food.faceDown = true;
    assert.equal(getLegalAttackTargets(state, card.instanceId).length, 0);
    assert.equal(getEffectiveCardCost(state, 'P2', king), king.cost - 1);
    enemyFood.faceDown = true;
    assert.equal(getEffectiveCardCost(state, 'P2', king), king.cost);
    food.faceDown = false;
    helpers.putInsectOnField(state, 'P2', 'set4_043');
    assert.equal(getEffectiveCardCost(state, 'P1', king), king.cost);
  });
}

for (const owner of ['P1', 'P2']) {
  runner.test('Resistance compares both public discards, copy owner ' + owner, () => {
    const state = main();
    assert.ok(getCardDefinition('set6_044')?.isPlayable());
    const bug = helpers.putInsectOnField(state, 'P2', 'set6_044');
    const spell = getCardDefinition('jinkaichu_no_bakunetsudan');
    const copy = helpers.addToHandRaw(state, owner, spell);
    moveCard(state, copy.instanceId, 'HAND', 'DISCARD', {playerId: owner});
    const hand = helpers.addToHandRaw(state, 'P1', spell);
    useSpell(state, 'P1', hand.instanceId, bug.instanceId);
    assert.equal(bug.currentHp, 300);
    assert.equal(hand.zone, 'DISCARD');
    assert.equal(state.player('P1').availableCost, 12 - spell.cost);
  });
}

runner.test('Hidden and resolving spells do not count as earlier discarded copies', () => {
  const state = main();
  assert.ok(getCardDefinition('set6_044')?.isPlayable());
  const bug = helpers.putInsectOnField(state, 'P2', 'set6_044');
  const spell = getCardDefinition('jinkaichu_no_bakunetsudan');
  const copy = helpers.addToHandRaw(state, 'P1', spell);
  moveCard(state, copy.instanceId, 'HAND', 'DISCARD', {playerId: 'P1', faceDown: true});
  const hand = helpers.addToHandRaw(state, 'P1', spell);
  useSpell(state, 'P1', hand.instanceId, bug.instanceId);
  assert.equal(bug.zone, 'DISCARD');
});

module.exports = runner;
if (require.main === module) runner.runAll();
