'use strict';
// Focused unit checks for ChatGPT's *unwired* rule helpers.
// These checks are not a PLAYABLE certification or an Engine integration test.
const assert = require('node:assert/strict');
const rules = require('../js/cards/chatgpt-batch-rule-helpers');

function insect(name, color, skills) {
  return { type: 'INSECT', name, color, skills: skills || [] };
}

assert.equal(rules.canAttach('set5_048', insect('甲虫', 'RED', [{ effectText: '' }])), true);
assert.equal(rules.canAttach('set5_049', insect('甲虫', 'RED', [{ effectText: '攻撃後、効果を使う' }])), false);
assert.equal(rules.canAttach('set5_055', insect('蛾（幼虫）', 'GREEN')), true);
assert.equal(rules.canAttach('set5_055', insect('蛾', 'GREEN')), false);
assert.equal(rules.canAttach('set5_050', insect('虫', 'RED')), true);
assert.equal(rules.canAttach('set5_051', insect('虫', 'RED')), false);
assert.equal(rules.canAttach('set5_052', insect('虫', 'GREEN')), true);
assert.equal(rules.canAttach('set5_052', { type: 'SPELL', color: 'GREEN' }), false);

assert.deepEqual(rules.enhancementBonus('set5_052', 5), { hp: 400, ap: 400 });
assert.deepEqual(rules.enhancementBonus('set5_052', 6), { hp: 800, ap: 800 });
assert.equal(rules.enhancementBonus('set5_052', -1), null);
assert.deepEqual(rules.enhancementBonus('set6_055', 0), { hp: 700, ap: 700 });

assert.equal(rules.shouldReturnAttachmentOnAttackDestruction('set5_048', true), true);
assert.equal(rules.shouldReturnAttachmentOnAttackDestruction('set5_048', false), false);
assert.equal(rules.shouldReturnAttachmentOnAttackDestruction('set5_052', true), false);

assert.equal(rules.isDiscardDeployBlocked([{ cardId: 'set7_046', faceDown: true }]), false);
assert.equal(rules.isDiscardDeployBlocked([{ cardId: 'set7_046', suppressed: true }]), false);
assert.equal(rules.isDiscardDeployBlocked([{ cardId: 'set7_046', faceDown: false }]), true);

assert.deepEqual(rules.areaDamageSpec('set8_057'), {
  damage: 300, sides: 'BOTH', ignoreWeakness: false,
  preventTerritoryDrawOnKill: false, optional: false, endTurn: true
});
assert.deepEqual(rules.areaDamageSpec('set8_008'), {
  damage: 200, sides: 'OPPONENT', ignoreWeakness: true,
  preventTerritoryDrawOnKill: true, optional: true, endTurn: false
});
assert.equal(rules.areaDamageSpec('set5_061', 0), null);
assert.equal(rules.areaDamageSpec('set5_061', 300).damage, 300);

console.log('ChatGPT batch helper checks passed (not an Engine integration test)');
