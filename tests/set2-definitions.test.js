'use strict';
require('./engine-loader.js');
var TestRunner = require('./lib.js');
var runner = new TestRunner();
var data = require('../js/cards/full-catalog-data.js');

runner.test('SET2 runtime definitions preserve all 55 canonical identities and metadata', function () {
  data.filter(function (c) { return c.set === 'BOOSTER_SET_2'; }).forEach(function (record) {
    var def = global.getCardDefinition(record.id);
    runner.assert(def, record.id + ' must load into Battle runtime');
    ['officialNumber', 'name', 'type', 'color', 'cost', 'baseHp'].forEach(function (key) {
      runner.assertEqual(def[key], record[key], record.id + ' ' + key);
    });
    runner.assertEqual(def.implementationStatus, 'PLAYABLE', 'audited cards expose release status');
    runner.assertEqual(def.isPlayable(), true, 'audited cards are Battle playable');
    def.skills.filter(function (s) { return s.timing === 'ATTACK'; }).forEach(function (skill, index) {
      runner.assertEqual(skill.baseAp, record.skills[index].baseAp);
      runner.assert(skill.id && Array.isArray(skill.effects));
    });
  });
});
runner.test('SET2 definitions connect shield and scheduled modifier mechanics', function () {
  runner.assert(global.getCardDefinition('set2_004'), 'SET2 definitions loaded');
  runner.assertEqual(global.getCardDefinition('set2_004').skills[1].effects[0].type, 'GRANT_DAMAGE_SHIELD');
  runner.assertEqual(global.getCardDefinition('set2_013').skills[1].effects[0].target, 'SELF');
  runner.assertEqual(global.getCardDefinition('set2_016').passiveAbilities[0].effects[0].type, 'PREVENT_DAMAGE');
  runner.assertEqual(global.getCardDefinition('set2_047').enhancementEffects[0].consumeSelf, true);
  [48, 49].forEach(function (n) {
    runner.assertEqual(global.getCardDefinition('set2_0' + n).enhancementEffects.length, 2);
  });
});

module.exports = runner;
if (require.main === module) { runner.runAll(); }
