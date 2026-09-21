'use strict';

var TestRunner = require('./lib.js');
var audit = require('../scripts/audit-set2-battle.js');
var runner = new TestRunner();

runner.test('SET2 audit covers 55 unique official identities without claiming implementation', function () {
  var result = audit();
  runner.assertEqual(result.count, 55);
  runner.assertEqual(result.issues.length, 0);
  runner.assertEqual(result.counts.RESEARCHED, 6);
  runner.assertEqual(result.counts.PARTIAL, 49);
  runner.assertEqual(result.counts.PLAYABLE, 0);
  runner.assertEqual(result.cards.filter(function (c) { return c.type === 'INSECT'; }).length, 45);
  runner.assertEqual(result.cards.filter(function (c) { return c.type === 'SPELL'; }).length, 5);
  runner.assertEqual(result.cards.filter(function (c) { return c.type === 'ENHANCEMENT'; }).length, 5);
});

runner.test('SET2 audit rejects PLAYABLE without all five evidence paths', function () {
  var result = audit({ set2_001: { status: 'PLAYABLE', engine: ['tests/example.js'] } });
  runner.assertEqual(result.issues.length, 4);
  ['metadata', 'human', 'cpu', 'regression'].forEach(function (gate) {
    runner.assert(result.issues.some(function (issue) { return issue.includes('missing ' + gate); }));
  });
});

runner.test('SET2 audit rejects untraceable blockers and unknown identities', function () {
  var result = audit({ set2_001: { status: 'BLOCKED' }, set2_999: { status: 'PLAYABLE' } });
  runner.assertEqual(result.issues.length, 2);
});

module.exports = runner;
if (require.main === module) { runner.runAll(); }
