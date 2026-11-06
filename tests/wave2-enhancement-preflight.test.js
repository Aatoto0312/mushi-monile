'use strict';
// Wave 2 preflight: verify the exact nine enhancement IDs before any registration.
// This test intentionally does not count unimplemented cards as PLAYABLE.
const assert = require('node:assert/strict');
require('./engine-loader.js');
const catalog = require('../js/cards/full-catalog-data.js');
const ids = [
  'set6_049', 'set6_051', 'set6_054',
  'set7_052', 'set7_053', 'set7_056',
  'set8_049', 'set8_050', 'set8_052'
];
assert.equal(new Set(ids).size, 9, 'Wave 2 ID list must be unique');
for (const id of ids) {
  const matches = catalog.filter(record => record.id === id);
  assert.equal(matches.length, 1, id + ': expected one catalog record');
  const record = matches[0];
  assert.equal(record.type, 'ENHANCEMENT', id + ': expected enhancement');
  const definition = global.getCardDefinition(id);
  // Explicit reporting prevents treating a registered but partial card as completed.
  const state = !definition ? 'NOT_REGISTERED'
    : definition.isPlayable() ? 'PLAYABLE'
    : definition.implementationStatus || 'PARTIAL';
  assert.ok(definition, id + ': should be registered');
  assert.equal(state, 'PARTIAL', id + ': unresolved effect must not be promoted');
  assert.equal(definition.id, id);
  assert.equal(definition.type, 'ENHANCEMENT');
  assert.ok(definition.implementationNotes.includes('NOT PLAYABLE'));
  const statEffects = definition.enhancementEffects.filter(effect => effect.type === 'STAT_MODIFIER');
  for (const effect of statEffects) {
    assert.ok(['HP','AP'].includes(effect.stat));
    assert.ok(Number.isFinite(effect.amount) && effect.amount > 0);
  }
  console.log('WAVE2_CARD ' + JSON.stringify({
    id, name: record.name, state,
    effectText: (record.enhancementEffects || []).map(effect => effect.effectText || '')
  }));
}
console.log('WAVE2_PREFLIGHT_OK 9 catalog entries verified; no PLAYABLE promotion');
