'use strict';

var schema = require('./schema.js');

var CANONICAL_CARD_ID = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;
var PRINTING_ID = /^printing:[a-z0-9][a-z0-9_-]*(?::[a-z0-9][a-z0-9_-]*){2,}$/;
var RULES_ID = /^rules:[a-z0-9][a-z0-9_-]*(?::[a-z0-9][a-z0-9_-]*)+$/;

function result(errors) {
  return { valid: errors.length === 0, errors: errors };
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function hasOwn(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function requireFields(value, fields, path, errors) {
  fields.forEach(function (field) {
    if (!hasOwn(value, field)) {
      errors.push(path + '/' + field + ': required');
    }
  });
}

function validateFieldState(value) {
  var errors = [];
  if (!isRecord(value)) {
    return result(['FieldState: must be an object']);
  }
  requireFields(value, schema.schemas.FieldState.required, 'FieldState', errors);
  if (schema.FIELD_STATES.indexOf(value.state) === -1) {
    errors.push('FieldState/state: unsupported state');
    return result(errors);
  }
  if (value.state === 'known' && !hasOwn(value, 'value')) {
    errors.push('FieldState/value: required when state is known');
  }
  if (value.state === 'not_applicable' && !nonEmptyString(value.reason)) {
    errors.push('FieldState/reason: required when state is not_applicable');
  }
  if (value.state === 'blocked' && !nonEmptyString(value.blockedReason)) {
    errors.push('FieldState/blockedReason: required when state is blocked');
  }
  return result(errors);
}

function validateUnique(items, key, path, errors) {
  var seen = Object.create(null);
  items.forEach(function (item, index) {
    if (!isRecord(item) || !nonEmptyString(item[key])) {
      errors.push(path + '/' + index + '/' + key + ': non-empty string required');
      return;
    }
    if (seen[item[key]]) {
      errors.push(path + '/' + index + '/' + key + ': duplicate ' + item[key]);
    }
    seen[item[key]] = true;
  });
}

function validateCardData(data) {
  var errors = [];
  if (!isRecord(data)) {
    return result(['CardData: must be an object']);
  }
  requireFields(data, schema.schemas.CardData.required, 'CardData', errors);
  if (data.schemaVersion !== schema.CARD_DATA_SCHEMA_VERSION) {
    errors.push('CardData/schemaVersion: unsupported version');
  }
  ['identities', 'printings', 'rules', 'verifications'].forEach(function (key) {
    if (!Array.isArray(data[key])) {
      errors.push('CardData/' + key + ': array required');
    }
  });
  if (errors.some(function (error) { return /array required$/.test(error); })) {
    return result(errors);
  }

  validateUnique(data.identities, 'canonicalCardId', 'CardData/identities', errors);
  validateUnique(data.printings, 'printingId', 'CardData/printings', errors);
  validateUnique(data.rules, 'rulesId', 'CardData/rules', errors);
  validateUnique(data.verifications, 'verificationId', 'CardData/verifications', errors);

  data.identities.forEach(function (identity, index) {
    if (!isRecord(identity)) { return; }
    requireFields(identity, schema.schemas.CardIdentity.required, 'CardData/identities/' + index, errors);
    if (!CANONICAL_CARD_ID.test(identity.canonicalCardId || '')) {
      errors.push('CardData/identities/' + index + '/canonicalCardId: invalid format');
    }
    if (!nonEmptyString(identity.canonicalName)) {
      errors.push('CardData/identities/' + index + '/canonicalName: non-empty string required');
    }
  });

  data.printings.forEach(function (printing, index) {
    if (!isRecord(printing)) { return; }
    requireFields(printing, schema.schemas.CardPrinting.required, 'CardData/printings/' + index, errors);
    if (!PRINTING_ID.test(printing.printingId || '')) {
      errors.push('CardData/printings/' + index + '/printingId: invalid format');
    }
    if (!CANONICAL_CARD_ID.test(printing.canonicalCardId || '')) {
      errors.push('CardData/printings/' + index + '/canonicalCardId: invalid format');
    }
    if (!RULES_ID.test(printing.rulesId || '')) {
      errors.push('CardData/printings/' + index + '/rulesId: invalid format');
    }
  });

  data.rules.forEach(function (rules, index) {
    if (!isRecord(rules)) { return; }
    var path = 'CardData/rules/' + index;
    requireFields(rules, schema.schemas.CardRules.required, path, errors);
    if (!RULES_ID.test(rules.rulesId || '')) {
      errors.push(path + '/rulesId: invalid format');
    }
    if (!CANONICAL_CARD_ID.test(rules.canonicalCardId || '')) {
      errors.push(path + '/canonicalCardId: invalid format');
    }
    ['type', 'color', 'cost', 'baseHp', 'spellEffects', 'enhancementEffects'].forEach(function (field) {
      if (hasOwn(rules, field)) {
        validateFieldState(rules[field]).errors.forEach(function (error) {
          errors.push(path + '/' + field + ': ' + error);
        });
      }
    });
    ['skills', 'traits', 'passiveEffects'].forEach(function (field) {
      if (hasOwn(rules, field) && !Array.isArray(rules[field])) {
        errors.push(path + '/' + field + ': array required');
      }
    });
  });

  data.verifications.forEach(function (verification, index) {
    if (!isRecord(verification)) { return; }
    requireFields(verification, schema.schemas.Verification.required, 'CardData/verifications/' + index, errors);
  });
  return result(errors);
}

module.exports = {
  patterns: Object.freeze({ canonicalCardId: CANONICAL_CARD_ID, printingId: PRINTING_ID, rulesId: RULES_ID }),
  validateFieldState: validateFieldState,
  validateCardData: validateCardData
};
