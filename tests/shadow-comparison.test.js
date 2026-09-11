'use strict';

var TestRunner = require('./lib.js');
var runner = new TestRunner();

function loadShadowApi() {
  try {
    return require('../shared/shadow-comparison');
  } catch (err) {
    throw new Error('shadow comparison API must be implemented: ' + err.message);
  }
}

function loadData() {
  delete require.cache[require.resolve('../shared/card-data/starter-v1.js')];
  return require('../shared/card-data/starter-v1.js');
}

function clone(value) { return JSON.parse(JSON.stringify(value)); }

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) { return value; }
  Object.freeze(value);
  Object.keys(value).forEach(function (key) { deepFreeze(value[key]); });
  return value;
}

function legacyStarterDefinitions() {
  return global.cardRegistry.getAll().filter(function (definition) {
    return definition.set === 'STARTER' && definition.implementationStatus !== global.CardStatus.TEST;
  });
}

function compare(data) {
  return loadShadowApi().compareShadowDefinitions({
    legacyDefinitions: legacyStarterDefinitions(),
    sharedData: data || loadData(),
    CardDefinitionCtor: global.CardDefinition
  });
}

runner.test('Shadow comparison matches all 24 cards and tracks runtime intentional differences', function () {
  var api = loadShadowApi();
  var result = compare();
  runner.assertEqual(api.INTENTIONAL_DIFFERENCE_CODES.length, 2, 'shadow allowlist size');
  runner.assert(api.INTENTIONAL_DIFFERENCE_CODES.indexOf('RARITY_CATALOG_ENRICHMENT') !== -1, 'rarity enrichment allowed');
  runner.assert(api.INTENTIONAL_DIFFERENCE_CODES.indexOf('RUNTIME_EFFECT_TEXT_ENRICHMENT') !== -1, 'runtime effect text enrichment allowed');
  runner.assertEqual(result.comparedCards, 24, 'compared cards');
  runner.assertEqual(result.matchedCards, 24, 'matched cards');
  runner.assertEqual(result.intentionalDifferences.length, 13, 'intentional differences');
  runner.assertEqual(result.unexpectedDifferences.length, 0, 'unexpected differences');
  var runtimeText = result.intentionalDifferences.filter(function (difference) {
    return difference.reasonCode === 'RUNTIME_EFFECT_TEXT_ENRICHMENT';
  });
  runner.assertEqual(runtimeText.length, 2, 'two runtime display enrichments');
  runner.assert(runtimeText.some(function (item) { return item.canonicalCardId === 'hariganemushi_no_michizure' && item.fieldPath === '/passiveAbilities/0/effectText'; }), 'hariganemushi display text');
  runner.assert(runtimeText.some(function (item) { return item.canonicalCardId === 'batta_no_kyousou' && item.fieldPath === '/cardEffects/0/effectText'; }), 'batta display text');
});

runner.test('Runtime effect text allowlist does not apply to another card', function () {
  var data = clone(loadData());
  data.rules.filter(function (item) { return item.canonicalCardId === 'tamamushiiro_no_uka'; })[0].passiveEffects = [
    { effectText: 'test-only-runtime-text' }
  ];
  var result = compare(data);
  runner.assert(result.unexpectedDifferences.some(function (difference) {
    return difference.canonicalCardId === 'tamamushiiro_no_uka' && difference.fieldPath === '/passiveAbilities';
  }), 'same nested field is not allowed for another card');
});

runner.test('Runtime effect text allowlist does not apply to another field on the same card', function () {
  var data = clone(loadData());
  data.rules.filter(function (item) { return item.canonicalCardId === 'hariganemushi_no_michizure'; })[0].cost.value = 9;
  var result = compare(data);
  runner.assert(result.unexpectedDifferences.some(function (difference) {
    return difference.canonicalCardId === 'hariganemushi_no_michizure' && difference.fieldPath === '/cost';
  }), 'another field remains unexpected');
});

runner.test('Runtime effect text allowlist does not hide structured passive changes', function () {
  var data = clone(loadData());
  data.rules.filter(function (item) { return item.canonicalCardId === 'hariganemushi_no_michizure'; })[0]
    .passiveEffects[0].effects[0].type = 'MOVE_SELF';
  var result = compare(data);
  runner.assert(result.unexpectedDifferences.some(function (difference) {
    return difference.canonicalCardId === 'hariganemushi_no_michizure' && difference.fieldPath === '/passiveAbilities';
  }), 'structured passive change remains unexpected');
});

runner.test('Runtime effect text allowlist does not add display text to shared official data', function () {
  var data = loadData();
  var passive = data.rules.filter(function (item) {
    return item.canonicalCardId === 'hariganemushi_no_michizure';
  })[0].passiveEffects[0];
  runner.assertEqual(Object.prototype.hasOwnProperty.call(passive, 'effectText'), false, 'shared passive remains structured only');
});

runner.test('Shadow comparison includes every required field including isPlayable', function () {
  var data = clone(loadData());
  var rules = data.rules.filter(function (item) { return item.canonicalCardId === 'ginyanma'; })[0];
  rules.implementationStatus = { state: 'known', value: 'NOT_RESEARCHED' };
  var result = compare(data);
  runner.assert(result.unexpectedDifferences.some(function (difference) {
    return difference.canonicalCardId === 'ginyanma' && difference.fieldPath === '/implementationStatus';
  }), 'status difference detected');
  runner.assert(result.unexpectedDifferences.some(function (difference) {
    return difference.canonicalCardId === 'ginyanma' && difference.fieldPath === '/isPlayable()';
  }), 'isPlayable difference detected');
});

runner.test('Shadow comparison preserves adapter diagnostics', function () {
  var result = compare();
  var warningCounts = result.diagnostics.reduce(function (counts, item) {
    if (item.severity === 'warning') { counts[item.code] = (counts[item.code] || 0) + 1; }
    return counts;
  }, {});
  runner.assertEqual(warningCounts.UNKNOWN_FIELD_STATE, 8, 'unknown states');
  runner.assertEqual(warningCounts.BLOCKED_FIELD, 2, 'blocked states');
  runner.assertEqual(result.diagnostics.filter(function (x) { return x.severity === 'error'; }).length, 0, 'errors');
});

runner.test('Shadow comparison fails closed for a non-allowlisted cost regression', function () {
  var data = clone(loadData());
  var rules = data.rules.filter(function (item) { return item.canonicalCardId === 'ginyanma'; })[0];
  rules.cost.value = 99;
  var api = loadShadowApi();
  var result = compare(data);
  var difference = result.unexpectedDifferences.filter(function (item) {
    return item.canonicalCardId === 'ginyanma' && item.fieldPath === '/cost';
  })[0];
  runner.assert(difference, 'cost regression detected');
  runner.assertEqual(difference.legacyValue, 5, 'legacy cost');
  runner.assertEqual(difference.shadowValue, 99, 'shadow cost');
  runner.assertEqual(difference.classification, 'unexpected', 'classification');
  var threw = false;
  try { api.assertNoUnexpectedDifferences(result); } catch (err) {
    threw = /ginyanma/.test(err.message) && /\/cost/.test(err.message) && /99/.test(err.message);
  }
  runner.assert(threw, 'fail-closed assertion includes actionable detail');
});

runner.test('Shadow report is concise on success and detailed on failure', function () {
  var api = loadShadowApi();
  var success = api.formatShadowReport(compare());
  runner.assert(success.indexOf('Shadow cards: 24') !== -1, 'card count');
  runner.assert(success.indexOf('Matched: 24') !== -1, 'matched count');
  runner.assert(success.indexOf('Intentional differences: 13') !== -1, 'intentional count');
  runner.assert(success.indexOf('Unexpected differences: 0') !== -1, 'unexpected count');
  runner.assert(success.indexOf('Warnings: 10') !== -1, 'warnings');
  runner.assert(success.indexOf('Errors: 0') !== -1, 'errors');

  var data = clone(loadData());
  data.rules.filter(function (item) { return item.canonicalCardId === 'ginyanma'; })[0].cost.value = 99;
  var failure = api.formatShadowReport(compare(data));
  runner.assert(failure.indexOf('ginyanma') !== -1, 'failure card ID');
  runner.assert(failure.indexOf('/cost') !== -1, 'failure field');
  runner.assert(failure.indexOf('legacy=5') !== -1, 'legacy value');
  runner.assert(failure.indexOf('shadow=99') !== -1, 'shadow value');
});

runner.test('Shadow comparison is repeatable and does not mutate shared or legacy data', function () {
  var data = clone(loadData());
  var sharedBefore = JSON.stringify(data);
  deepFreeze(data);
  var legacy = legacyStarterDefinitions();
  var legacyBefore = JSON.stringify(legacy);
  var registryBefore = JSON.stringify(global.cardRegistry.getAll());
  var sizeBefore = global.cardRegistry.size();
  var api = loadShadowApi();
  var options = { legacyDefinitions: legacy, sharedData: data, CardDefinitionCtor: global.CardDefinition };
  var first = api.compareShadowDefinitions(options);
  var second = api.compareShadowDefinitions(options);
  runner.assertEqual(JSON.stringify(first), JSON.stringify(second), 'repeatable output');
  runner.assertEqual(JSON.stringify(data), sharedBefore, 'shared data unchanged');
  runner.assertEqual(JSON.stringify(legacy), legacyBefore, 'legacy definitions unchanged');
  runner.assertEqual(global.cardRegistry.size(), sizeBefore, 'registry size unchanged');
  runner.assertEqual(JSON.stringify(global.cardRegistry.getAll()), registryBefore, 'registry content unchanged');
});

module.exports = runner;
