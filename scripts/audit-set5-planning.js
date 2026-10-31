'use strict';
// Planning evidence only. A classification is not a completion certificate.
var fs = require('fs');
var path = require('path');
var records = require('../js/cards/full-catalog-data.js').filter(function (r) { return r.set === 'BOOSTER_SET_5'; });
var groups = [
  ['A', [4,10,20,36], 'Vanilla attack; existing summon/attack paths'],
  ['B', [1,2,5,12,17,19,21,22,23,24,26,27,28,33,41,45,46,47,48,49,50,51,52,53,55,56,57,60,62,63,64], 'Reuse/extend legality, counts, targets, territory or attachment metadata'],
  ['C', [3,6,7,9,11,13,14,15,16,18,25,29,30,31,32,35,38,40,42,43,44,54,58,59,61], 'Additional declarative mechanic / lifecycle or event integration'],
  ['D', [8,34,37,39], 'Opponent hand-discard replacement/trigger or before-spell-resolution event sequencing']
];
var qa = 'https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F-1/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/';
var rows = records.map(function (record) {
  var number = Number(record.officialNumber.split('/')[0]);
  var matches = groups.filter(function (g) { return g[1].indexOf(number) !== -1; });
  if (matches.length !== 1) { throw new Error('Classification must be unique: ' + record.id); }
  return {
    cardId:record.id, officialNumber:record.officialNumber, name:record.name,
    classification:matches[0][0], planningReason:matches[0][2],
    metadata:{type:record.type,color:record.color,cost:record.cost,baseHp:record.baseHp,tags:record.tags},
    skills:record.skills, traits:record.passiveAbilities,
    cardEffects:record.cardEffects, enhancementEffects:record.enhancementEffects,
    officialQa:qa,
    sourceReview:'PENDING_CARD_TEXT_AND_RULE_CROSSCHECK',
    humanEvidence:[], cpuEvidence:[], effectEvidence:[], serializationEvidence:[],
    completion:'NOT_CERTIFIED'
  };
});
if (rows.length !== 64) { throw new Error('Expected 64 SET5 cards'); }
var out = path.join(__dirname, '..', 'docs', 'battle-expansion', 'set5-mechanic-matrix.json');
fs.writeFileSync(out, JSON.stringify({baseline:'2ea76fad5f419037122d7b24a71a784117fbe385',purpose:'Pre-implementation classification; no PLAYABLE evidence inferred',cards:rows}, null, 2) + '\n');
console.log('SET5 planning matrix: ' + rows.length + ' cards; ' + groups.map(function (g) { return g[0] + '=' + g[1].length; }).join(', '));
