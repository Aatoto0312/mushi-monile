'use strict';

// Join the canonical catalog to implementation evidence; never duplicate card data.
var records = require('../js/cards/full-catalog-data.js');
require('../js/cards/card-definition.js');
var definitions = require('../js/cards/set2-cards.js');
var vanilla = [6, 8, 10, 18, 26, 28, 29, 32, 35, 36, 38, 39];
var existing = [3, 5, 12, 15, 20, 21, 23, 24, 30, 33, 37, 42, 43, 44, 48, 49, 53, 54];
var researchFlags = {};
var imageVerification = {
  16: 'https://mushijingi.com/images/card/146.jpg',
  22: 'https://mushijingi.com/images/card/152.jpg',
  38: 'https://mushijingi.com/images/card/168.jpg'
};

function audit(evidence) {
  evidence = evidence || {};
  var issues = [];
  var cards = records.filter(function (card) { return card.set === 'BOOSTER_SET_2'; }).map(function (card) {
    var number = Number(card.officialNumber.split('/')[0]);
    var proof = evidence[card.id] || {};
    var runtimeDefinition = definitions.definitionFromRecord(card);
    var status = proof.status || runtimeDefinition.implementationStatus;
    if (['PLAYABLE', 'PARTIAL', 'BLOCKED', 'RESEARCHED', 'UNIMPLEMENTED'].indexOf(status) === -1) {
      issues.push(card.id + ': invalid status');
    }
    if (status === 'PLAYABLE') {
      ['metadata', 'engine', 'human', 'cpu', 'regression'].forEach(function (gate) {
        if (!Array.isArray(proof[gate]) || !proof[gate].length || proof[gate].some(function (ref) { return typeof ref !== 'string' || !ref.trim(); })) {
          issues.push(card.id + ': missing ' + gate + ' evidence');
        }
      });
    }
    if (status === 'BLOCKED' && (!proof.reason || !proof.sources || !proof.sources.length)) {
      issues.push(card.id + ': BLOCKED requires reason and investigated sources');
    }
    return {
      id: card.id, officialNumber: card.officialNumber, name: card.name,
      type: card.type, color: card.color, cost: card.cost, HP: card.baseHp,
      skills: card.skills, traits: card.passiveAbilities,
      effects: card.cardEffects.concat(card.enhancementEffects), tags: card.tags,
      rulings: card.rulings, sources: card.sourceRefs, verification: card.verificationNotes,
      classification: vanilla.indexOf(number) !== -1 ? 'VANILLA' : existing.indexOf(number) !== -1 ? 'EXISTING_MECHANIC' : 'EXTEND_OR_NEW_MECHANIC',
      researchFlag: researchFlags[number] || null,
      inspectedCardImage: imageVerification[number] || null,
      status: status, evidence: proof
    };
  });
  if (cards.length !== 55) { issues.push('Expected 55 SET2 cards'); }
  if (new Set(cards.map(function (c) { return c.id; })).size !== 55) { issues.push('Identity coverage failure'); }
  cards.forEach(function (c, i) {
    if (c.officialNumber !== (i + 1) + '/55') { issues.push('Official number coverage failure: ' + c.id); }
  });
  Object.keys(evidence).forEach(function (id) {
    if (!cards.some(function (c) { return c.id === id; })) { issues.push('Unknown evidence card: ' + id); }
  });
  var counts = { PLAYABLE: 0, PARTIAL: 0, BLOCKED: 0, RESEARCHED: 0, UNIMPLEMENTED: 0 };
  cards.forEach(function (card) { if (Object.hasOwn(counts, card.status)) { counts[card.status]++; } });
  return { count: cards.length, counts: counts, issues: issues, cards: cards };
}

module.exports = audit;
if (require.main === module) {
  var result = audit();
  console.log(JSON.stringify(process.argv.includes('--summary') ? { count: result.count, counts: result.counts, issues: result.issues } : result, null, 2));
  if (result.issues.length) { process.exitCode = 1; }
}
