'use strict';

var battleAdapter = require('../battle-adapter');

var INTENTIONAL_DIFFERENCE_CODES = battleAdapter.RUNTIME_INTENTIONAL_DIFFERENCE_CODES;

var COMPARISON_FIELDS = Object.freeze([
  'id',
  'officialNumber',
  'name',
  'set',
  'rarity',
  'starterDeck',
  'type',
  'color',
  'cost',
  'baseHp',
  'skills',
  'passiveAbilities',
  'cardEffects',
  'enhancementEffects',
  'tags',
  'implementationStatus',
  'sourceLevel',
  'sourceRefs',
  'verificationNotes'
]);

function clone(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function indexById(items) {
  var result = Object.create(null);
  (items || []).forEach(function (item) { result[item.id] = item; });
  return result;
}

function comparableLegacyCard(definition) {
  var card = {};
  COMPARISON_FIELDS.forEach(function (field) {
    var value = definition[field];
    if (field === 'enhancementEffects' && value === undefined) { value = null; }
    card[field] = clone(value);
  });
  return card;
}

function difference(cardId, fieldPath, legacyValue, shadowValue, classification, reasonCode) {
  return {
    canonicalCardId: cardId,
    fieldPath: fieldPath,
    legacyValue: clone(legacyValue),
    shadowValue: clone(shadowValue),
    classification: classification,
    reasonCode: reasonCode
  };
}

function toFieldPath(field) {
  if (!field || field === '/') { return '/'; }
  return field.charAt(0) === '/' ? field : '/' + field;
}

function compareShadowDefinitions(options) {
  options = options || {};
  var legacyDefinitions = options.legacyDefinitions || [];
  var adapterResult = battleAdapter.createCardDefinitions(options.sharedData, options.CardDefinitionCtor);
  var legacySnapshot = { cards: legacyDefinitions.map(comparableLegacyCard) };
  var baseComparison = battleAdapter.compareDefinitionsToLegacySnapshot(adapterResult.definitions, legacySnapshot);
  var intentional = [];
  var unexpected = [];

  baseComparison.intentionalDifferences.forEach(function (item) {
    var mapped = difference(item.cardId, toFieldPath(item.field), item.expected, item.actual, 'intentional', item.code);
    if (INTENTIONAL_DIFFERENCE_CODES.indexOf(item.code) === -1) {
      mapped.classification = 'unexpected';
      mapped.reasonCode = 'UNALLOWLISTED_DIFFERENCE';
      unexpected.push(mapped);
    } else {
      intentional.push(mapped);
    }
  });

  baseComparison.unexpectedDifferences.forEach(function (item) {
    unexpected.push(difference(item.cardId, toFieldPath(item.field), item.expected, item.actual, 'unexpected', 'VALUE_MISMATCH'));
  });

  var legacyById = indexById(legacyDefinitions);
  var shadowById = indexById(adapterResult.definitions);
  adapterResult.definitions.forEach(function (shadow) {
    if (!legacyById[shadow.id]) {
      unexpected.push(difference(shadow.id, '/', undefined, 'definition', 'unexpected', 'EXTRA_SHADOW_CARD'));
    }
  });

  legacyDefinitions.forEach(function (legacy) {
    var shadow = shadowById[legacy.id];
    if (!shadow) { return; }
    var legacyPlayable = legacy.isPlayable();
    var shadowPlayable = shadow.isPlayable();
    if (legacyPlayable !== shadowPlayable) {
      unexpected.push(difference(legacy.id, '/isPlayable()', legacyPlayable, shadowPlayable, 'unexpected', 'VALUE_MISMATCH'));
    }
  });

  var cardsWithUnexpected = Object.create(null);
  unexpected.forEach(function (item) { cardsWithUnexpected[item.canonicalCardId] = true; });

  return {
    comparedCards: legacyDefinitions.length,
    matchedCards: legacyDefinitions.filter(function (item) { return !cardsWithUnexpected[item.id]; }).length,
    intentionalDifferences: intentional,
    unexpectedDifferences: unexpected,
    diagnostics: clone(adapterResult.diagnostics)
  };
}

function printable(value) {
  var encoded = JSON.stringify(value);
  return encoded === undefined ? 'undefined' : encoded;
}

function formatShadowReport(result) {
  var warnings = result.diagnostics.filter(function (item) { return item.severity === 'warning'; }).length;
  var errors = result.diagnostics.filter(function (item) { return item.severity === 'error'; }).length;
  var lines = [
    'Shadow cards: ' + result.comparedCards,
    'Matched: ' + result.matchedCards,
    'Intentional differences: ' + result.intentionalDifferences.length,
    'Unexpected differences: ' + result.unexpectedDifferences.length,
    'Warnings: ' + warnings,
    'Errors: ' + errors
  ];
  result.unexpectedDifferences.forEach(function (item) {
    lines.push(
      item.canonicalCardId + ' ' + item.fieldPath +
      ' legacy=' + printable(item.legacyValue) +
      ' shadow=' + printable(item.shadowValue) +
      ' reason=' + item.reasonCode
    );
  });
  return lines.join('\n');
}

function assertNoUnexpectedDifferences(result) {
  if (result.unexpectedDifferences.length > 0) {
    throw new Error('Shadow comparison failed closed.\n' + formatShadowReport(result));
  }
  return result;
}

module.exports = {
  COMPARISON_FIELDS: COMPARISON_FIELDS,
  INTENTIONAL_DIFFERENCE_CODES: INTENTIONAL_DIFFERENCE_CODES,
  compareShadowDefinitions: compareShadowDefinitions,
  formatShadowReport: formatShadowReport,
  assertNoUnexpectedDifferences: assertNoUnexpectedDifferences
};
