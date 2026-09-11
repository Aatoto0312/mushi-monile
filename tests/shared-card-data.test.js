'use strict';

var fs = require('fs');
var path = require('path');
var TestRunner = require('./lib.js');

var runner = new TestRunner();

function loadCardData() {
  try {
    return require('../shared/card-data');
  } catch (err) {
    throw new Error('shared/card-data boundary must be implemented: ' + err.message);
  }
}

function loadSnapshot() {
  try {
    return require('../shared/card-data/legacy-starter-snapshot.js');
  } catch (err) {
    throw new Error('legacy starter snapshot generator must be implemented: ' + err.message);
  }
}

runner.test('FieldState accepts all five supported states', function () {
  var api = loadCardData();
  var samples = [
    { state: 'known', value: 0 },
    { state: 'not_applicable', reason: 'card_type_is_spell' },
    { state: 'unknown' },
    { state: 'researching' },
    { state: 'blocked', blockedReason: 'sources_conflict' }
  ];
  samples.forEach(function (sample) {
    var result = api.validateFieldState(sample);
    runner.assertEqual(result.valid, true, 'valid state: ' + sample.state);
  });
});

runner.test('FieldState rejects unsupported state', function () {
  var result = loadCardData().validateFieldState({ state: 'guessed', value: 5 });
  runner.assertEqual(result.valid, false, 'unsupported state is rejected');
});

runner.test('FieldState known requires an own value property', function () {
  var result = loadCardData().validateFieldState({ state: 'known' });
  runner.assertEqual(result.valid, false, 'known without value is rejected');
});

runner.test('FieldState blocked requires a non-empty blockedReason', function () {
  var result = loadCardData().validateFieldState({ state: 'blocked' });
  runner.assertEqual(result.valid, false, 'blocked without reason is rejected');
});

function validBoundary() {
  return {
    schemaVersion: 'mushijingi-card-db/1.0',
    identities: [
      { canonicalCardId: 'ginyanma', canonicalName: 'ギンヤンマ' }
    ],
    printings: [
      {
        printingId: 'printing:set1:006:standard',
        canonicalCardId: 'ginyanma',
        rulesId: 'rules:ginyanma:set1-006'
      }
    ],
    rules: [
      {
        rulesId: 'rules:ginyanma:set1-006',
        canonicalCardId: 'ginyanma',
        type: { state: 'known', value: 'INSECT' },
        color: { state: 'known', value: 'RED' },
        cost: { state: 'known', value: 5 },
        baseHp: { state: 'known', value: 1100 },
        skills: [],
        traits: [],
        spellEffects: { state: 'not_applicable', reason: 'card_type_is_insect' },
        enhancementEffects: { state: 'not_applicable', reason: 'card_type_is_insect' },
        passiveEffects: []
      }
    ],
    verifications: []
  };
}

runner.test('Card data boundary accepts minimum v1 structures', function () {
  runner.assertEqual(loadCardData().validateCardData(validBoundary()).valid, true, 'valid boundary');
});

runner.test('Card data boundary detects duplicate canonicalCardId', function () {
  var data = validBoundary();
  data.identities.push({ canonicalCardId: 'ginyanma', canonicalName: 'ギンヤンマ' });
  runner.assertEqual(loadCardData().validateCardData(data).valid, false, 'duplicate canonicalCardId');
});

runner.test('Card data boundary detects duplicate printingId', function () {
  var data = validBoundary();
  data.printings.push({
    printingId: 'printing:set1:006:standard',
    canonicalCardId: 'ginyanma',
    rulesId: 'rules:ginyanma:set1-006'
  });
  runner.assertEqual(loadCardData().validateCardData(data).valid, false, 'duplicate printingId');
});

runner.test('Card data boundary detects duplicate rulesId', function () {
  var data = validBoundary();
  data.rules.push(data.rules[0]);
  runner.assertEqual(loadCardData().validateCardData(data).valid, false, 'duplicate rulesId');
});

runner.test('Legacy STARTER snapshot matches the fixed 24-card baseline', function () {
  var snapshotApi = loadSnapshot();
  var actual = snapshotApi.createStarterCardSnapshot(global.cardRegistry);
  var fixturePath = path.join(__dirname, 'fixtures', 'starter-card-registry.snapshot.v1.json');
  runner.assert(fs.existsSync(fixturePath), 'fixed snapshot fixture exists');
  var expected = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  runner.assertEqual(snapshotApi.serializeStarterCardSnapshot(actual), JSON.stringify(expected, null, 2) + '\n', 'snapshot is unchanged');
  runner.assertEqual(actual.cardCount, 24, 'only 24 official STARTER cards');
  runner.assertEqual(actual.cards.some(function (card) { return card.set === 'TEST'; }), false, 'test cards excluded');
});

module.exports = runner;
