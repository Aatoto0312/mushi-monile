'use strict';
var records = require('../js/cards/full-catalog-data.js');
require('../js/cards/card-definition.js');
var definitions = require('../js/cards/set3-cards.js');

function audit(evidence) {
  evidence = evidence || {};
  var issues = [];
  var cards = records.filter(function (card) { return card.set === 'BOOSTER_SET_3'; }).map(function (card) {
    var def = definitions.definitionFromRecord(card);
    var proof = evidence[card.id] || {};
    var status = proof.status || def.implementationStatus;
    if (status === 'PLAYABLE') {
      ['metadata','engine','human','cpu','regression'].forEach(function (gate) {
        if (!Array.isArray(proof[gate]) || !proof[gate].length) { issues.push(card.id + ': missing ' + gate + ' evidence'); }
      });
    }
    return { id: card.id, officialNumber: card.officialNumber, name: card.name, status: status, evidence: proof };
  });
  if (cards.length !== 60) { issues.push('Expected 60 SET3 cards'); }
  cards.forEach(function (card, index) { if (card.officialNumber !== (index + 1) + '/60') { issues.push('Official number coverage failure: ' + card.id); } });
  var counts = { PLAYABLE:0, PARTIAL:0, BLOCKED:0, RESEARCHED:0, UNIMPLEMENTED:0 };
  cards.forEach(function (card) { if (Object.hasOwn(counts, card.status)) { counts[card.status]++; } });
  return { count: cards.length, counts: counts, issues: issues, cards: cards };
}
module.exports = audit;
if (require.main === module) {
  var result = audit(); console.log(JSON.stringify(process.argv.includes('--summary') ? {count:result.count,counts:result.counts,issues:result.issues} : result,null,2));
  if (result.issues.length) { process.exitCode = 1; }
}
