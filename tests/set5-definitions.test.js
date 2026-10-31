'use strict';
require('./engine-loader.js');
var TestRunner = require('./lib.js');
var runner = new TestRunner();
var records = require('../js/cards/full-catalog-data.js');

[4, 10, 20, 36].forEach(function (number) {
  runner.test('SET5 vanilla ' + number + ' has complete basic attack mapping and explicit card-level certification', function () {
    var id = 'set5_' + String(number).padStart(3, '0');
    var record = records.find(function (entry) { return entry.id === id; });
    var def = getCardDefinition(id);
    runner.assert(!!def, 'SET5 runtime module must register the card');
    runner.assertEqual(def.officialNumber, record.officialNumber);
    runner.assertEqual(def.cost, record.cost);
    runner.assertEqual(def.baseHp, record.baseHp);
    runner.assertEqual(def.skills.length, record.skills.length);
    def.skills.forEach(function (skill, index) {
      runner.assertEqual(skill.timing, 'ATTACK');
      runner.assertEqual(skill.baseAp, record.skills[index].baseAp);
      runner.assertEqual(skill.name, record.skills[index].name);
      runner.assertEqual(skill.effects.length, 0);
    });
    runner.assertEqual(def.implementationStatus, CardStatus.PLAYABLE);
  });
});

module.exports = runner;
if (require.main === module) { runner.runAll(); }
