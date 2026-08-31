'use strict';

var schema = require('./schema.js');
var validator = require('./validator.js');

module.exports = {
  DECK_FORMAT_VERSION: schema.DECK_FORMAT_VERSION,
  deckFormatSchema: schema.deckFormatSchema,
  patterns: validator.patterns,
  validateDeckFormat: validator.validateDeckFormat
};
