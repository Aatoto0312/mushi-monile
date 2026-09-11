'use strict';

var legacyValidator = require('./validator.js');

var VERIFICATION_STATUSES = Object.freeze([
  'UNVERIFIED', 'VERIFIED_OFFICIAL', 'VERIFIED_SECONDARY', 'CONFLICTED', 'BLOCKED'
]);

function hasOwn(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateVerification(value) {
  var errors = [];
  if (!isRecord(value)) { return { valid: false, errors: ['Verification: must be an object'] }; }
  ['verificationId', 'entityId', 'fieldPath', 'status', 'notes'].forEach(function (field) {
    if (!hasOwn(value, field)) { errors.push('Verification/' + field + ': required'); }
  });
  if (!nonEmptyString(value.verificationId)) { errors.push('Verification/verificationId: non-empty string required'); }
  if (!nonEmptyString(value.entityId)) { errors.push('Verification/entityId: non-empty string required'); }
  if (!nonEmptyString(value.fieldPath) || value.fieldPath.charAt(0) !== '/') { errors.push('Verification/fieldPath: absolute field path required'); }
  if (VERIFICATION_STATUSES.indexOf(value.status) === -1) { errors.push('Verification/status: unsupported status'); }
  if (!Array.isArray(value.notes)) { errors.push('Verification/notes: array required'); }
  if (hasOwn(value, 'sourceRefs') && !Array.isArray(value.sourceRefs)) { errors.push('Verification/sourceRefs: array required'); }
  return { valid: errors.length === 0, errors: errors };
}

function validateCardData(data) {
  if (!isRecord(data)) { return { valid: false, errors: ['CardData: must be an object'] }; }
  var compatibilityInput = Object.assign({}, data, {
    verifications: Array.isArray(data.verifications) ? data.verifications.map(function (verification) {
      return {
        verificationId: verification.verificationId,
        subject: {
          entityType: 'shadow',
          entityId: verification.entityId,
          fieldPath: verification.fieldPath
        },
        status: verification.status
      };
    }) : data.verifications
  });
  var errors = legacyValidator.validateCardData(compatibilityInput).errors.slice();
  if (!Array.isArray(data.verifications)) { return { valid: false, errors: errors }; }
  data.verifications.forEach(function (verification, index) {
    validateVerification(verification).errors.forEach(function (error) {
      errors.push('CardData/verifications/' + index + ': ' + error);
    });
  });
  if (Array.isArray(data.printings)) {
    data.printings.forEach(function (printing, index) {
      ['collectorNumber', 'officialNumberDisplay', 'rarity'].forEach(function (field) {
        if (hasOwn(printing, field)) {
          legacyValidator.validateFieldState(printing[field]).errors.forEach(function (error) {
            errors.push('CardData/printings/' + index + '/' + field + ': ' + error);
          });
        }
      });
    });
  }
  var identityIds = Object.create(null);
  var rulesIds = Object.create(null);
  (data.identities || []).forEach(function (identity) { identityIds[identity.canonicalCardId] = true; });
  (data.rules || []).forEach(function (rules) { rulesIds[rules.rulesId] = true; });
  (data.printings || []).forEach(function (printing, index) {
    if (!identityIds[printing.canonicalCardId]) { errors.push('CardData/printings/' + index + '/canonicalCardId: missing identity'); }
    if (!rulesIds[printing.rulesId]) { errors.push('CardData/printings/' + index + '/rulesId: missing rules'); }
  });
  (data.rules || []).forEach(function (rules, index) {
    if (!identityIds[rules.canonicalCardId]) { errors.push('CardData/rules/' + index + '/canonicalCardId: missing identity'); }
  });
  return { valid: errors.length === 0, errors: errors };
}

module.exports = {
  VERIFICATION_STATUSES: VERIFICATION_STATUSES,
  validateVerification: validateVerification,
  validateCardData: validateCardData
};
