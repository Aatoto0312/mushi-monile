'use strict';
require('./engine-loader');
require('../js/engine/cpu-agent');
const h = require('./helpers');
const assert = require('node:assert/strict');
const runner = new (require('./lib'))();

function board(id, defenders) {
  const state = h.newGame({rng: h.firstPlayerRng});
  h.toMainPhase(state);
  state.turnNumber = 3;
  assert.ok(getCardDefinition(id)?.isPlayable(), id);
  const attacker = h.putInsectOnField(state, 'P1', id);
  const targets = defenders.map(cardId => h.putInsectOnField(state, 'P2', cardId, {hp: 5000}));
  return {state, attacker, targets, skill: getCardDefinition(id).skills[1]};
}

for (const id of ['set5_021', 'set7_032']) {
  runner.test(id + ' cannot spread attacks across two forced targets', () => {
    const {state, attacker, skill, targets} = board(id, ['namiageha', 'namiageha', 'kabutomushi']);
    assert.equal(getLegalAttackTargets(state, attacker.instanceId, skill.id).length, 0);
    assert.throws(() => beginMultiTargetAttackSelection(state, attacker.instanceId, skill.id));
    assert.throws(() => performMultiTargetAttack(state, attacker.instanceId,
      targets.slice(0,2).map(t => t.instanceId), skill.id));
    assert.equal(attacker.attackedThisTurn, false);
    assert.equal(state.pendingEffect, null);
  });
  runner.test(id + ' commits the player order and resolves each selected hit once after JSON restore', () => {
    const {state, attacker, skill, targets} = board(id, ['kabutomushi', 'kabutomushi']);
    beginMultiTargetAttackSelection(state, attacker.instanceId, skill.id);
    const restored = Object.assign(new GameState(), JSON.parse(JSON.stringify(state)));
    const ids = targets.map(t => t.instanceId).reverse();
    resolveCardSelection(restored, 'P1', ids, true);
    const hits = restored.battleEvents.filter(e => e.type === 'DAMAGE').slice(-2);
    assert.deepEqual(hits.map(e => e.targetInstanceId), ids);
    assert.equal(hits[0].baseDamage, skill.baseAp + (id === 'set7_032' ? 500 : 0));
    assert.throws(() => resolveCardSelection(restored, 'P1', ids, true));
    assert.equal(restored.pendingEffect, null);
  });
}

runner.test('Same-color selection uses current colors; different names receive no pair bonus', () => {
  const {state, attacker, skill, targets} = board('set7_032', ['kabutomushi','kabutomushi','namitentou']);
  targets[1].runtimeFlags.colorOverride = 'COLORLESS';
  targets[2].runtimeFlags.colorOverride = getEffectiveColor(targets[0]);
  beginMultiTargetAttackSelection(state, attacker.instanceId, skill.id);
  assert.deepEqual(state.pendingEffect.options, [targets[0].instanceId, targets[2].instanceId]);
  const cpu = new CpuAgent('P1', {rng: () => 0});
  assert.ok(cpu.executeAction(state, cpu.getPendingAction(state)));
  assert.equal(state.pendingEffect, null);
  assert.equal(targets[1].currentHp, 5000);
  assert.equal(state.battleEvents.filter(e => e.type === 'DAMAGE').at(-1).baseDamage, skill.baseAp);
});

module.exports = runner;
if (require.main === module) runner.runAll();
