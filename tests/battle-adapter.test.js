'use strict';

var fs = require('fs');
var path = require('path');
var TestRunner = require('./lib.js');
var snapshotApi = require('../shared/card-data/legacy-starter-snapshot.js');
var runner = new TestRunner();

function loadAdapter() {
  try {
    return require('../shared/battle-adapter');
  } catch (err) {
    throw new Error('read-only battle adapter must be implemented: ' + err.message);
  }
}

function loadData() {
  delete require.cache[require.resolve('../shared/card-data/starter-v1.js')];
  return require('../shared/card-data/starter-v1.js');
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) { return value; }
  Object.freeze(value);
  Object.keys(value).forEach(function (key) { deepFreeze(value[key]); });
  return value;
}

runner.test('Battle adapter produces 24 definitions without touching default registry', function () {
  var beforeSize = global.cardRegistry.size();
  var result = loadAdapter().adaptCardData(loadData());
  runner.assertEqual(result.definitions.length, 24, 'definition count');
  runner.assertEqual(result.errors.length, 0, 'no fatal errors');
  runner.assertEqual(global.cardRegistry.size(), beforeSize, 'default registry unchanged');
});

runner.test('Battle adapter keeps canonicalCardId as engineDefinitionId', function () {
  var result = loadAdapter().adaptCardData(loadData());
  result.definitions.forEach(function (definition) {
    runner.assertEqual(definition.engineDefinitionId, definition.id, 'engine ID: ' + definition.id);
  });
});

runner.test('Battle adapter preserves blocked Ibuki number as null with diagnostic', function () {
  var result = loadAdapter().adaptCardData(loadData());
  var ibuki = result.definitions.filter(function (x) { return x.id === 'mushi_no_ibuki'; })[0];
  runner.assertEqual(ibuki.officialNumber, null, 'blocked number is not guessed');
  runner.assert(result.warnings.some(function (x) {
    return x.code === 'BLOCKED_FIELD' && x.entityId === 'mushi_no_ibuki' && x.fieldPath === '/officialNumber';
  }), 'blocked official number warning');
});

runner.test('Battle adapter recombines skills and traits without loss', function () {
  var result = loadAdapter().adaptCardData(loadData());
  var expected = {
    minminzemi: '＜とびだす＞',
    namiageha: '＜りんぷん＞',
    nanafushimodoki: '＜擬態＞'
  };
  Object.keys(expected).forEach(function (id) {
    var definition = result.definitions.filter(function (x) { return x.id === id; })[0];
    runner.assert(definition.skills.some(function (skill) { return skill.name === expected[id]; }), 'trait restored: ' + id);
  });
});

runner.test('Battle adapter output has zero unexpected legacy snapshot differences', function () {
  var adapter = loadAdapter();
  var result = adapter.adaptCardData(loadData());
  var snapshot = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'starter-card-registry.snapshot.v1.json'), 'utf8'));
  var comparison = adapter.compareDefinitionsToLegacySnapshot(result.definitions, snapshot);
  runner.assertEqual(comparison.unexpectedDifferences.length, 0, JSON.stringify(comparison.unexpectedDifferences));
  comparison.intentionalDifferences.forEach(function (difference) {
    runner.assert(adapter.INTENTIONAL_DIFFERENCE_CODES.indexOf(difference.code) !== -1, 'allowed difference: ' + difference.code);
  });
});

runner.test('Battle adapter instances register only in a temporary registry', function () {
  var adapter = loadAdapter();
  var beforeSize = global.cardRegistry.size();
  var result = adapter.createCardDefinitions(loadData(), global.CardDefinition);
  var temporary = new global.CardRegistry();
  result.definitions.forEach(function (definition) { temporary.register(definition); });
  runner.assertEqual(temporary.size(), 24, 'temporary registry size');
  runner.assertEqual(global.cardRegistry.size(), beforeSize, 'default registry size');
  runner.assertEqual(temporary.getAll().filter(function (x) { return x.type === global.CardTypes.INSECT; }).length, 16, 'insects');
  runner.assertEqual(temporary.getAll().filter(function (x) { return x.type === global.CardTypes.SPELL; }).length, 4, 'spells');
  runner.assertEqual(temporary.getAll().filter(function (x) { return x.type === global.CardTypes.ENHANCEMENT; }).length, 4, 'enhancements');
});

runner.test('Temporary adapter definitions match playability and starter recipe IDs', function () {
  var result = loadAdapter().createCardDefinitions(loadData(), global.CardDefinition);
  var temporary = new global.CardRegistry();
  result.definitions.forEach(function (definition) { temporary.register(definition); });
  result.definitions.forEach(function (definition) {
    runner.assertEqual(definition.isPlayable(), global.cardRegistry.get(definition.id).isPlayable(), 'playability: ' + definition.id);
  });
  Object.keys(global.STARTER_DECK_RECIPES).forEach(function (recipeId) {
    Object.keys(global.STARTER_DECK_RECIPES[recipeId].cardCounts).forEach(function (cardId) {
      runner.assert(temporary.get(cardId), 'recipe ID resolves: ' + cardId);
    });
  });
});

runner.test('Adapter CardDefinition can create a basic CardInstance', function () {
  var result = loadAdapter().createCardDefinitions(loadData(), global.CardDefinition);
  var ginyanma = result.definitions.filter(function (x) { return x.id === 'ginyanma'; })[0];
  var instance = new global.CardInstance({
    instanceId: 'adapter-instance-1', cardId: ginyanma.id, ownerId: 'P1', zone: global.ZONES.HAND,
    currentHp: ginyanma.baseHp, baseHp: ginyanma.baseHp
  });
  runner.assertEqual(instance.cardId, 'ginyanma', 'card ID');
  runner.assertEqual(instance.currentHp, 1100, 'HP');
});

runner.test('Battle adapter does not mutate deeply frozen shared data', function () {
  var data = clone(loadData());
  var before = JSON.stringify(data);
  deepFreeze(data);
  var result = loadAdapter().adaptCardData(data);
  runner.assertEqual(result.errors.length, 0, 'frozen input converts');
  runner.assertEqual(JSON.stringify(data), before, 'input unchanged');
});

runner.test('Battle adapter reports missing records and ID mismatches', function () {
  var adapter = loadAdapter();
  var missingPrinting = clone(loadData());
  missingPrinting.printings.pop();
  runner.assert(adapter.adaptCardData(missingPrinting).errors.some(function (x) { return x.code === 'MISSING_PRINTING'; }), 'missing printing');
  var missingRules = clone(loadData());
  missingRules.rules.pop();
  runner.assert(adapter.adaptCardData(missingRules).errors.some(function (x) { return x.code === 'MISSING_RULES'; }), 'missing rules');
  var mismatch = clone(loadData());
  mismatch.printings[0].canonicalCardId = 'okamakiri';
  runner.assert(adapter.adaptCardData(mismatch).errors.some(function (x) { return x.code === 'ID_MISMATCH'; }), 'ID mismatch');
});

runner.test('Battle adapter rejects unsupported structured effects', function () {
  var data = clone(loadData());
  var spell = data.rules.filter(function (x) { return x.canonicalCardId === 'niji_no_kakehashi'; })[0];
  spell.spellEffects.value.push({ type: 'UNKNOWN_FUTURE_EFFECT' });
  var result = loadAdapter().adaptCardData(data);
  runner.assert(result.errors.some(function (x) { return x.code === 'UNSUPPORTED_EFFECT'; }), 'unsupported effect error');
});

runner.test('Battle adapter reports unknown and blocked FieldState values', function () {
  var data = clone(loadData());
  var rules = data.rules.filter(function (x) { return x.canonicalCardId === 'ginyanma'; })[0];
  rules.cost = { state: 'blocked', blockedReason: 'test-block' };
  var result = loadAdapter().adaptCardData(data);
  runner.assert(result.errors.some(function (x) { return x.code === 'BLOCKED_FIELD'; }), 'blocked required field');
  runner.assert(result.warnings.some(function (x) { return x.code === 'UNKNOWN_FIELD_STATE'; }), 'unknown non-applicable color warnings retained');
});

module.exports = runner;
