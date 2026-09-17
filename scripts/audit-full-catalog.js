'use strict';

var data = require('../js/cards/full-catalog-data.js');

function duplicates(values) {
  var seen = Object.create(null), duplicate = [];
  values.forEach(function (value) {
    if (seen[value] && duplicate.indexOf(value) === -1) { duplicate.push(value); }
    seen[value] = true;
  });
  return duplicate;
}

function audit(records) {
  var issues = [], allowedTypes = ['INSECT', 'SPELL', 'ENHANCEMENT'];
  var allowedColors = ['RED', 'BLUE', 'GREEN', 'COLORLESS', null];
  var allowedRarities = ['N', 'R', 'SR', 'LR', 'UR'];
  duplicates(records.map(function (card) { return card.id; })).forEach(function (id) { issues.push('duplicate id: ' + id); });
  Object.keys(records.reduce(function (sets, card) { (sets[card.set] || (sets[card.set] = [])).push(card); return sets; }, {})).forEach(function (set) {
    var cards = records.filter(function (card) { return card.set === set; });
    duplicates(cards.map(function (card) { return card.officialNumber; })).forEach(function (number) { issues.push(set + ' duplicate number: ' + number); });
    var denominators = cards.map(function (card) { return Number(card.officialNumber.split('/')[1]); });
    var expected = denominators[0];
    if (!expected || denominators.some(function (number) { return number !== expected; })) { issues.push(set + ' malformed denominator'); }
    var actualNumbers = cards.map(function (card) { return Number(card.officialNumber.split('/')[0]); }).sort(function (a, b) { return a - b; });
    if (actualNumbers.length !== expected || actualNumbers.some(function (number, index) { return number !== index + 1; })) { issues.push(set + ' number coverage'); }
  });
  records.forEach(function (card) {
    if (!card.name) { issues.push(card.id + ' missing name'); }
    if (allowedTypes.indexOf(card.type) === -1) { issues.push(card.id + ' unknown type'); }
    if (!Number.isInteger(card.cost) || card.cost < 0) { issues.push(card.id + ' invalid cost'); }
    if (allowedColors.indexOf(card.color) === -1) { issues.push(card.id + ' unknown color'); }
    if (allowedRarities.indexOf(card.rarity) === -1) { issues.push(card.id + ' unknown rarity'); }
    if (card.type === 'INSECT' && (!Number.isInteger(card.baseHp) || card.baseHp <= 0)) { issues.push(card.id + ' missing insect HP'); }
    ['skills', 'passiveAbilities', 'cardEffects', 'enhancementEffects', 'rulings', 'tags'].forEach(function (key) {
      if (!Array.isArray(card[key])) { issues.push(card.id + ' malformed ' + key); }
    });
    (card.skills || []).forEach(function (skill) { if (!skill || !skill.name || skill.baseAp == null) { issues.push(card.id + ' malformed skill'); } });
    (card.passiveAbilities || []).forEach(function (trait) { if (!trait || !trait.name || !trait.effectText) { issues.push(card.id + ' malformed trait'); } });
    var visible = JSON.stringify([card.skills, card.passiveAbilities, card.cardEffects, card.enhancementEffects, card.rulings]);
    if (/\[object Object\]|canonicalCardId|implementationNotes|audit memo/i.test(visible)) { issues.push(card.id + ' internal memo/object leak'); }
  });
  var sameNames = records.reduce(function (groups, card) { (groups[card.name] || (groups[card.name] = [])).push(card.id); return groups; }, Object.create(null));
  return {
    count: records.length,
    bySet: records.reduce(function (counts, card) { counts[card.set] = (counts[card.set] || 0) + 1; return counts; }, Object.create(null)),
    issues: issues,
    repeatedNames: Object.keys(sameNames).filter(function (name) { return sameNames[name].length > 1; }).map(function (name) { return { name: name, ids: sameNames[name] }; })
  };
}

var result = audit(data);
if (require.main === module) {
  console.log(JSON.stringify(result, null, 2));
  if (result.issues.length) { process.exitCode = 1; }
}
module.exports = audit;
