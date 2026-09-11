'use strict';

var phase2Compatibility = require('../card-data/starter-v1-compatibility.js');

var INTENTIONAL_DIFFERENCE_CODES = phase2Compatibility.INTENTIONAL_DIFFERENCE_CODES;
var RUNTIME_INTENTIONAL_DIFFERENCE_CODES = Object.freeze(
  INTENTIONAL_DIFFERENCE_CODES.filter(function (code) {
    return code === 'RARITY_CATALOG_ENRICHMENT' || code === 'RUNTIME_EFFECT_TEXT_ENRICHMENT';
  })
);

var SUPPORTED_EFFECTS = Object.freeze({
  MOVE_SELF: true,
  APPLY_STAT_MODIFIER_TO_ALL_OWN_FIELD: true,
  RETRIEVE_FROM_DISCARD: true,
  DEAL_DAMAGE_TO_TARGET: true,
  OFFER_SELF_TO_FIELD: true,
  APPLY_STAT_MODIFIER: true,
  CONTINUOUS_ATTACK: true,
  TURN_FACE_DOWN: true,
  DESTROY_SOURCE: true
});

var SUPPORTED_ADDITIONAL_COSTS = Object.freeze({
  SACRIFICE_OWN_INSECT: true
});

function clone(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function indexBy(items, key) {
  var result = Object.create(null);
  (items || []).forEach(function (item) { result[item[key]] = item; });
  return result;
}

function diagnostic(severity, code, entityId, fieldPath, message) {
  return { severity: severity, code: code, entityId: entityId, fieldPath: fieldPath, message: message };
}

function addDiagnostic(context, severity, code, entityId, fieldPath, message) {
  var item = diagnostic(severity, code, entityId, fieldPath, message);
  context.diagnostics.push(item);
  (severity === 'error' ? context.errors : context.warnings).push(item);
}

function resolveFieldState(field, options, context) {
  options = options || {};
  var fallback = clone(options.fallback);
  if (!field || typeof field !== 'object') {
    addDiagnostic(context, options.required ? 'error' : 'warning', 'UNKNOWN_FIELD_STATE', options.entityId, options.fieldPath, 'FieldState is missing.');
    return fallback;
  }
  if (field.state === 'known') { return clone(field.value); }
  if (field.state === 'not_applicable') { return fallback; }
  if (field.state === 'unknown' || field.state === 'researching') {
    addDiagnostic(context, 'warning', 'UNKNOWN_FIELD_STATE', options.entityId, options.fieldPath, 'FieldState is ' + field.state + '; no value was inferred.');
    return fallback;
  }
  if (field.state === 'blocked') {
    addDiagnostic(context, options.required ? 'error' : 'warning', 'BLOCKED_FIELD', options.entityId, options.fieldPath, field.blockedReason || 'Field is blocked.');
    return fallback;
  }
  addDiagnostic(context, options.required ? 'error' : 'warning', 'UNKNOWN_FIELD_STATE', options.entityId, options.fieldPath, 'Unsupported FieldState: ' + String(field.state));
  return fallback;
}

function validateEffect(effect, entityId, fieldPath, context) {
  if (!effect || typeof effect !== 'object') {
    addDiagnostic(context, 'error', 'UNSUPPORTED_EFFECT', entityId, fieldPath, 'Effect must be an object.');
    return;
  }
  if (effect.type) {
    if (!SUPPORTED_EFFECTS[effect.type]) {
      addDiagnostic(context, 'error', 'UNSUPPORTED_EFFECT', entityId, fieldPath, 'Unsupported effect type: ' + effect.type);
    }
    return;
  }
  if (effect.stat === 'AP' || effect.stat === 'HP') { return; }
  addDiagnostic(context, 'error', 'UNSUPPORTED_EFFECT', entityId, fieldPath, 'Effect has no supported type or stat.');
}

function validateEffects(definition, entityId, context) {
  (definition.cardEffects || []).forEach(function (effect, index) {
    validateEffect(effect, entityId, '/spellEffects/' + index, context);
  });
  (definition.enhancementEffects || []).forEach(function (effect, index) {
    if (effect.type === 'COLOR_OVERRIDE') { return; }
    validateEffect(effect, entityId, '/enhancementEffects/' + index, context);
  });
  (definition.skills || []).forEach(function (skill, skillIndex) {
    (skill.additionalCost || []).forEach(function (cost, costIndex) {
      if (!cost || !SUPPORTED_ADDITIONAL_COSTS[cost.type]) {
        addDiagnostic(context, 'error', 'UNSUPPORTED_EFFECT', entityId, '/skills/' + skillIndex + '/additionalCost/' + costIndex, 'Unsupported additional cost type: ' + String(cost && cost.type));
      }
    });
    (skill.effects || []).forEach(function (effect, effectIndex) {
      validateEffect(effect, entityId, '/skills/' + skillIndex + '/effects/' + effectIndex, context);
    });
  });
  (definition.passiveAbilities || []).forEach(function (ability, abilityIndex) {
    (ability.effects || []).forEach(function (effect, effectIndex) {
      validateEffect(effect, entityId, '/passiveEffects/' + abilityIndex + '/effects/' + effectIndex, context);
    });
  });
}

function legacySourceLevel(verification) {
  return verification && verification.status === 'VERIFIED_OFFICIAL' ? 'A' : 'D';
}

function buildDefinition(identity, printing, rules, verifications, context) {
  var id = identity.canonicalCardId;
  var officialNumber = null;
  if (printing.collectorNumber && printing.collectorNumber.state === 'known') {
    officialNumber = String(printing.collectorNumber.value.number) + '/' + String(printing.collectorNumber.value.total);
  } else {
    resolveFieldState(printing.collectorNumber, { entityId: id, fieldPath: '/officialNumber', fallback: null }, context);
  }

  var enhancementEffects = resolveFieldState(rules.enhancementEffects, {
    entityId: id, fieldPath: '/enhancementEffects', fallback: []
  }, context);
  if (Array.isArray(enhancementEffects)) {
    enhancementEffects = enhancementEffects.map(function (effect, index) {
      var copy = clone(effect);
      if (copy.currentHpPolicy) {
        resolveFieldState(copy.currentHpPolicy, {
          entityId: id, fieldPath: '/enhancementEffects/' + index + '/currentHpPolicy', fallback: null
        }, context);
        delete copy.currentHpPolicy;
      }
      return copy;
    });
  }

  var verification = verifications[rules.verificationRef];
  var definition = {
    id: id,
    engineDefinitionId: id,
    officialNumber: officialNumber,
    name: identity.canonicalName,
    set: printing.setId || null,
    rarity: resolveFieldState(printing.rarity, { entityId: id, fieldPath: '/rarity', fallback: null }, context),
    starterDeck: printing.starterDeck || null,
    type: resolveFieldState(rules.type, { entityId: id, fieldPath: '/type', fallback: null, required: true }, context),
    color: resolveFieldState(rules.color, { entityId: id, fieldPath: '/color', fallback: null }, context),
    cost: resolveFieldState(rules.cost, { entityId: id, fieldPath: '/cost', fallback: null, required: true }, context),
    baseHp: resolveFieldState(rules.baseHp, { entityId: id, fieldPath: '/baseHp', fallback: null }, context),
    skills: clone(rules.skills || []).concat(clone(rules.traits || [])),
    passiveAbilities: clone(rules.passiveEffects || []),
    cardEffects: resolveFieldState(rules.spellEffects, { entityId: id, fieldPath: '/spellEffects', fallback: [] }, context),
    enhancementEffects: enhancementEffects,
    tags: clone(identity.tags || []),
    implementationStatus: resolveFieldState(rules.implementationStatus, { entityId: id, fieldPath: '/implementationStatus', fallback: 'NOT_RESEARCHED', required: true }, context),
    sourceLevel: legacySourceLevel(verification),
    sourceRefs: clone(verification ? verification.sourceRefs : []),
    verificationNotes: verification && verification.notes && verification.notes.length ? verification.notes[0] : null
  };
  validateEffects(definition, id, context);
  return definition;
}

function adaptCardData(data) {
  var context = { definitions: [], diagnostics: [], warnings: [], errors: [] };
  var printingsByIdentity = indexBy(data && data.printings, 'canonicalCardId');
  var rulesById = indexBy(data && data.rules, 'rulesId');
  var verifications = indexBy(data && data.verifications, 'verificationId');

  (data && data.printings || []).forEach(function (printing) {
    var referencedRules = rulesById[printing.rulesId];
    if (referencedRules && referencedRules.canonicalCardId !== printing.canonicalCardId) {
      addDiagnostic(context, 'error', 'ID_MISMATCH', printing.printingId, '/canonicalCardId', 'Printing and referenced rules canonicalCardId do not match.');
    }
  });

  (data && data.identities || []).forEach(function (identity) {
    var id = identity.canonicalCardId;
    var printing = printingsByIdentity[id];
    if (!printing) {
      addDiagnostic(context, 'error', 'MISSING_PRINTING', id, '/printings', 'No printing refers to this identity.');
      return;
    }
    var rules = rulesById[printing.rulesId];
    if (!rules) {
      addDiagnostic(context, 'error', 'MISSING_RULES', id, '/rules', 'Printing rulesId cannot be resolved: ' + printing.rulesId);
      return;
    }
    if (printing.canonicalCardId !== id || rules.canonicalCardId !== id) {
      addDiagnostic(context, 'error', 'ID_MISMATCH', id, '/canonicalCardId', 'Identity, printing, and rules IDs do not match.');
      return;
    }
    context.definitions.push(buildDefinition(identity, printing, rules, verifications, context));
  });
  return context;
}

function createCardDefinitions(data, CardDefinitionCtor) {
  var result = adaptCardData(data);
  if (result.errors.length) {
    return { definitions: [], diagnostics: result.diagnostics, warnings: result.warnings, errors: result.errors };
  }
  var instances = result.definitions.map(function (definition) {
    var instance = new CardDefinitionCtor(clone(definition));
    instance.engineDefinitionId = definition.engineDefinitionId;
    if (Array.isArray(definition.enhancementEffects)) {
      instance.enhancementEffects = clone(definition.enhancementEffects);
    }
    return instance;
  });
  return { definitions: instances, diagnostics: result.diagnostics, warnings: result.warnings, errors: result.errors };
}

function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

var HARIGANEMUSHI_RUNTIME_EFFECT_TEXT =
  'この強化カードを付けた虫が相手の虫の攻撃によって破壊されたとき、その攻撃した虫も破壊する。';

function isHariganemushiRuntimeEffectTextOnlyDifference(cardId, shadowEffects, legacyEffects) {
  if (cardId !== 'hariganemushi_no_michizure' ||
      !Array.isArray(shadowEffects) || !Array.isArray(legacyEffects) ||
      shadowEffects.length !== legacyEffects.length || legacyEffects.length < 1 ||
      legacyEffects[0].effectText !== HARIGANEMUSHI_RUNTIME_EFFECT_TEXT ||
      Object.prototype.hasOwnProperty.call(shadowEffects[0], 'effectText')) {
    return false;
  }
  var withoutDisplayText = clone(legacyEffects);
  delete withoutDisplayText[0].effectText;
  return same(shadowEffects, withoutDisplayText);
}

var BATTA_RUNTIME_EFFECT_TEXT =
  'ターン終了時まで、自分のすべての虫の攻撃力を２００増やす。';

function isBattaRuntimeEffectTextOnlyDifference(cardId, shadowEffects, legacyEffects) {
  if (cardId !== 'batta_no_kyousou' || !Array.isArray(shadowEffects) || !Array.isArray(legacyEffects) ||
      shadowEffects.length !== legacyEffects.length || legacyEffects.length !== 1 ||
      legacyEffects[0].effectText !== BATTA_RUNTIME_EFFECT_TEXT ||
      Object.prototype.hasOwnProperty.call(shadowEffects[0], 'effectText')) return false;
  var withoutDisplayText = clone(legacyEffects);
  delete withoutDisplayText[0].effectText;
  return same(shadowEffects, withoutDisplayText);
}

function compareDefinitionsToLegacySnapshot(definitions, snapshot) {
  var unexpected = [];
  var intentional = [];
  var byId = indexBy(definitions, 'id');
  var fields = ['id', 'officialNumber', 'name', 'set', 'rarity', 'starterDeck', 'type', 'color', 'cost', 'baseHp', 'skills', 'passiveAbilities', 'cardEffects', 'enhancementEffects', 'tags', 'implementationStatus', 'sourceLevel', 'sourceRefs', 'verificationNotes'];
  (snapshot.cards || []).forEach(function (legacy) {
    var current = byId[legacy.id];
    if (!current) {
      unexpected.push({ cardId: legacy.id, field: '/', expected: 'definition', actual: 'missing' });
      return;
    }
    fields.forEach(function (field) {
      var actual = current[field] === undefined && field === 'enhancementEffects' ? null : current[field];
      if (same(actual, legacy[field])) { return; }
      if (field === 'rarity' && legacy.rarity === null && actual !== null) {
        intentional.push({ cardId: legacy.id, field: field, code: 'RARITY_CATALOG_ENRICHMENT', expected: legacy[field], actual: actual });
        return;
      }
      if (field === 'passiveAbilities' &&
          isHariganemushiRuntimeEffectTextOnlyDifference(legacy.id, actual, legacy[field])) {
        intentional.push({
          cardId: legacy.id,
          field: 'passiveAbilities/0/effectText',
          code: 'RUNTIME_EFFECT_TEXT_ENRICHMENT',
          expected: legacy[field][0].effectText,
          actual: undefined
        });
        return;
      }
      if (field === 'cardEffects' && isBattaRuntimeEffectTextOnlyDifference(legacy.id, actual, legacy[field])) {
        intentional.push({ cardId: legacy.id, field: 'cardEffects/0/effectText', code: 'RUNTIME_EFFECT_TEXT_ENRICHMENT', expected: legacy[field][0].effectText, actual: undefined });
        return;
      }
      unexpected.push({ cardId: legacy.id, field: field, expected: legacy[field], actual: actual });
    });
  });
  return { unexpectedDifferences: unexpected, intentionalDifferences: intentional };
}

module.exports = {
  INTENTIONAL_DIFFERENCE_CODES: INTENTIONAL_DIFFERENCE_CODES,
  RUNTIME_INTENTIONAL_DIFFERENCE_CODES: RUNTIME_INTENTIONAL_DIFFERENCE_CODES,
  adaptCardData: adaptCardData,
  createCardDefinitions: createCardDefinitions,
  compareDefinitionsToLegacySnapshot: compareDefinitionsToLegacySnapshot
};
