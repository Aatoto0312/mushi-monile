'use strict';

var schema = require('./schema.js');
var cardData = require('../card-data');

var DECK_ID = /^deck:[a-z0-9][a-z0-9_-]*(?::[a-z0-9][a-z0-9_-]*)+$/;
var RULESET_ID = /^[a-z0-9][a-z0-9_-]*(?::[a-z0-9][a-z0-9_-]*)+$/;

function hasOwn(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateDeckFormat(deck) {
  var errors = [];
  if (deck === null || typeof deck !== 'object' || Array.isArray(deck)) {
    return { valid: false, errors: ['Deck: must be an object'] };
  }
  schema.deckFormatSchema.required.forEach(function (field) {
    if (!hasOwn(deck, field)) { errors.push('Deck/' + field + ': required'); }
  });
  if (deck.formatVersion !== schema.DECK_FORMAT_VERSION) {
    errors.push('Deck/formatVersion: unsupported version');
  }
  if (!DECK_ID.test(deck.deckId || '')) { errors.push('Deck/deckId: invalid format'); }
  ['deckName', 'createdAt', 'updatedAt', 'cardDataVersion'].forEach(function (field) {
    if (!nonEmptyString(deck[field])) { errors.push('Deck/' + field + ': non-empty string required'); }
  });
  if (!RULESET_ID.test(deck.rulesetId || '')) { errors.push('Deck/rulesetId: invalid format'); }
  if (!Array.isArray(deck.cards)) {
    errors.push('Deck/cards: array required');
    return { valid: false, errors: errors };
  }

  var seenPrintingIds = Object.create(null);
  deck.cards.forEach(function (entry, index) {
    var path = 'Deck/cards/' + index;
    if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) {
      errors.push(path + ': object required');
      return;
    }
    schema.deckFormatSchema.cardRequired.forEach(function (field) {
      if (!hasOwn(entry, field)) { errors.push(path + '/' + field + ': required'); }
    });
    if (!cardData.patterns.printingId.test(entry.printingId || '')) {
      errors.push(path + '/printingId: invalid format');
    } else if (seenPrintingIds[entry.printingId]) {
      errors.push(path + '/printingId: duplicate entry');
    } else {
      seenPrintingIds[entry.printingId] = true;
    }
    if (!cardData.patterns.canonicalCardId.test(entry.canonicalCardId || '')) {
      errors.push(path + '/canonicalCardId: invalid format');
    }
    if (!Number.isInteger(entry.quantity) || entry.quantity <= 0) {
      errors.push(path + '/quantity: positive integer required');
    }
  });
  return { valid: errors.length === 0, errors: errors };
}

module.exports = {
  patterns: Object.freeze({ deckId: DECK_ID, rulesetId: RULESET_ID }),
  validateDeckFormat: validateDeckFormat
};
