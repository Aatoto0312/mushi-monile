'use strict';

var schema = require('./schema.js');
var legacyValidator = require('./validator.js');
var phase2Validator = require('./phase2-validator.js');

module.exports = {
  CARD_DATA_SCHEMA_VERSION: schema.CARD_DATA_SCHEMA_VERSION,
  FIELD_STATES: schema.FIELD_STATES,
  VERIFICATION_STATUSES: phase2Validator.VERIFICATION_STATUSES,
  schemas: schema.schemas,
  patterns: legacyValidator.patterns,
  validateFieldState: legacyValidator.validateFieldState,
  validateVerification: phase2Validator.validateVerification,
  validateCardData: phase2Validator.validateCardData
};
