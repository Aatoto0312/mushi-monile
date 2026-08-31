'use strict';

var DECK_FORMAT_VERSION = 'mushijingi-deck/1.0';
var deckFormatSchema = Object.freeze({
  required: Object.freeze([
    'formatVersion', 'deckId', 'deckName', 'createdAt', 'updatedAt',
    'cardDataVersion', 'rulesetId', 'cards'
  ]),
  cardRequired: Object.freeze(['printingId', 'canonicalCardId', 'quantity'])
});

module.exports = { DECK_FORMAT_VERSION: DECK_FORMAT_VERSION, deckFormatSchema: deckFormatSchema };
