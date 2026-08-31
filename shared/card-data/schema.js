'use strict';

var CARD_DATA_SCHEMA_VERSION = 'mushijingi-card-db/1.0';
var FIELD_STATES = Object.freeze(['known', 'not_applicable', 'unknown', 'researching', 'blocked']);

// Dependency-free structural schema. It can later be translated to JSON Schema
// without coupling the current application to a schema library.
var schemas = Object.freeze({
  FieldState: Object.freeze({
    required: ['state'],
    states: FIELD_STATES,
    stateRequirements: Object.freeze({
      known: ['value'],
      not_applicable: ['reason'],
      unknown: [],
      researching: [],
      blocked: ['blockedReason']
    })
  }),
  CardIdentity: Object.freeze({ required: ['canonicalCardId', 'canonicalName'] }),
  CardPrinting: Object.freeze({ required: ['printingId', 'canonicalCardId', 'rulesId'] }),
  CardRules: Object.freeze({
    required: [
      'rulesId', 'canonicalCardId', 'type', 'color', 'cost', 'baseHp',
      'skills', 'traits', 'spellEffects', 'enhancementEffects', 'passiveEffects'
    ]
  }),
  Verification: Object.freeze({
    required: ['verificationId', 'subject', 'status'],
    subjectRequired: ['entityType', 'entityId', 'fieldPath']
  }),
  CardData: Object.freeze({
    required: ['schemaVersion', 'identities', 'printings', 'rules', 'verifications']
  })
});

module.exports = {
  CARD_DATA_SCHEMA_VERSION: CARD_DATA_SCHEMA_VERSION,
  FIELD_STATES: FIELD_STATES,
  schemas: schemas
};
