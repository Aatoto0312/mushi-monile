'use strict';

var INTENTIONAL_DIFFERENCE_CODES = Object.freeze([
  'OFFICIAL_NUMBER_NORMALIZED',
  'OFFICIAL_NUMBER_CONFLICT_PRESERVED',
  'RARITY_CATALOG_ENRICHMENT',
  'RUNTIME_EFFECT_TEXT_ENRICHMENT',
  'FIELD_STATE_WRAPPING',
  'SKILLS_TRAITS_SPLIT',
  'ENHANCEMENT_EFFECTS_FORMALIZED',
  'VERIFICATION_MODEL_ADDED'
]);

function same(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function parseOfficialNumber(value) {
  var match = typeof value === 'string' && /^0*(\d+)\/(\d+)$/.exec(value);
  return match ? { number: Number(match[1]), total: Number(match[2]) } : null;
}

function indexBy(items, key) {
  var result = Object.create(null);
  items.forEach(function (item) { result[item[key]] = item; });
  return result;
}

function stripCurrentHpPolicy(effects) {
  return effects.map(function (effect) {
    var copy = {};
    Object.keys(effect).forEach(function (key) {
      if (key !== 'currentHpPolicy') { copy[key] = effect[key]; }
    });
    return copy;
  });
}

var HARIGANEMUSHI_RUNTIME_EFFECT_TEXT =
  'この強化カードを付けた虫が相手の虫の攻撃によって破壊されたとき、その攻撃した虫も破壊する。';
var BATTA_RUNTIME_EFFECT_TEXT =
  'ターン終了時まで、自分のすべての虫の攻撃力を２００増やす。';

function isHariganemushiRuntimeEffectTextOnlyDifference(cardId, sharedEffects, runtimeEffects) {
  if (cardId !== 'hariganemushi_no_michizure' ||
      !Array.isArray(sharedEffects) || !Array.isArray(runtimeEffects) ||
      sharedEffects.length !== runtimeEffects.length || runtimeEffects.length < 1 ||
      runtimeEffects[0].effectText !== HARIGANEMUSHI_RUNTIME_EFFECT_TEXT ||
      Object.prototype.hasOwnProperty.call(sharedEffects[0], 'effectText')) {
    return false;
  }
  var withoutDisplayText = JSON.parse(JSON.stringify(runtimeEffects));
  delete withoutDisplayText[0].effectText;
  return same(sharedEffects, withoutDisplayText);
}

function isBattaRuntimeEffectTextOnlyDifference(cardId, sharedEffects, runtimeEffects) {
  if (cardId !== 'batta_no_kyousou' || !Array.isArray(sharedEffects) || !Array.isArray(runtimeEffects) ||
      sharedEffects.length !== runtimeEffects.length || runtimeEffects.length !== 1 ||
      runtimeEffects[0].effectText !== BATTA_RUNTIME_EFFECT_TEXT ||
      Object.prototype.hasOwnProperty.call(sharedEffects[0], 'effectText')) return false;
  var withoutDisplayText = JSON.parse(JSON.stringify(runtimeEffects));
  delete withoutDisplayText[0].effectText;
  return same(sharedEffects, withoutDisplayText);
}

function compareStarterV1ToLegacySnapshot(data, snapshot) {
  var unexpected = [];
  var intentional = [];
  var identities = indexBy(data.identities, 'canonicalCardId');
  var printings = indexBy(data.printings, 'canonicalCardId');
  var rules = indexBy(data.rules, 'canonicalCardId');
  var verifications = indexBy(data.verifications, 'verificationId');

  function expectEqual(cardId, field, actual, expected) {
    if (!same(actual, expected)) {
      unexpected.push({ cardId: cardId, field: field, expected: expected, actual: actual });
    }
  }

  function allow(cardId, field, code) {
    intentional.push({ cardId: cardId, field: field, code: code });
  }

  snapshot.cards.forEach(function (legacy) {
    var identity = identities[legacy.id];
    var printing = printings[legacy.id];
    var cardRules = rules[legacy.id];
    if (!identity || !printing || !cardRules) {
      unexpected.push({ cardId: legacy.id, field: '/', expected: 'complete common records', actual: 'missing' });
      return;
    }

    expectEqual(legacy.id, 'id', identity.canonicalCardId, legacy.id);
    expectEqual(legacy.id, 'name', identity.canonicalName, legacy.name);
    expectEqual(legacy.id, 'set', printing.setId, legacy.set);
    expectEqual(legacy.id, 'starterDeck', printing.starterDeck, legacy.starterDeck);
    expectEqual(legacy.id, 'tags', identity.tags, legacy.tags);

    if (printing.collectorNumber.state === 'known') {
      expectEqual(legacy.id, 'officialNumber.numeric', {
        number: printing.collectorNumber.value.number,
        total: printing.collectorNumber.value.total
      }, parseOfficialNumber(legacy.officialNumber));
      if (printing.officialNumberDisplay.value !== legacy.officialNumber) {
        allow(legacy.id, 'officialNumber', 'OFFICIAL_NUMBER_NORMALIZED');
      }
    } else if (legacy.officialNumber === null && printing.collectorNumber.state === 'blocked') {
      allow(legacy.id, 'officialNumber', 'OFFICIAL_NUMBER_CONFLICT_PRESERVED');
    } else {
      unexpected.push({ cardId: legacy.id, field: 'officialNumber', expected: legacy.officialNumber, actual: printing.collectorNumber });
    }

    if (legacy.rarity === null && printing.rarity.state === 'known') {
      allow(legacy.id, 'rarity', 'RARITY_CATALOG_ENRICHMENT');
    } else {
      expectEqual(legacy.id, 'rarity', printing.rarity.value, legacy.rarity);
    }

    expectEqual(legacy.id, 'type', cardRules.type.value, legacy.type);
    expectEqual(legacy.id, 'cost', cardRules.cost.value, legacy.cost);
    expectEqual(legacy.id, 'implementationStatus', cardRules.implementationStatus.value, legacy.implementationStatus);
    if (cardRules.color.state === 'known') {
      expectEqual(legacy.id, 'color', cardRules.color.value, legacy.color);
    } else if (legacy.color === null) {
      allow(legacy.id, 'color', 'FIELD_STATE_WRAPPING');
    }
    if (cardRules.baseHp.state === 'known') {
      expectEqual(legacy.id, 'baseHp', cardRules.baseHp.value, legacy.baseHp);
    } else if (legacy.baseHp === null) {
      allow(legacy.id, 'baseHp', 'FIELD_STATE_WRAPPING');
    }

    var legacyTraits = legacy.skills.filter(function (skill) { return /^＜.*＞$/.test(skill.name || ''); });
    var legacyAttackSkills = legacy.skills.filter(function (skill) { return !/^＜.*＞$/.test(skill.name || ''); });
    expectEqual(legacy.id, 'skills', cardRules.skills, legacyAttackSkills);
    expectEqual(legacy.id, 'traits', cardRules.traits, legacyTraits);
    if (legacyTraits.length) { allow(legacy.id, 'skills/traits', 'SKILLS_TRAITS_SPLIT'); }

    if (legacy.type === 'SPELL') {
      if (isBattaRuntimeEffectTextOnlyDifference(legacy.id, cardRules.spellEffects.value, legacy.cardEffects)) {
        allow(legacy.id, 'cardEffects/0/effectText', 'RUNTIME_EFFECT_TEXT_ENRICHMENT');
      } else {
        expectEqual(legacy.id, 'cardEffects', cardRules.spellEffects.value, legacy.cardEffects);
      }
    } else {
      expectEqual(legacy.id, 'cardEffects', legacy.cardEffects, []);
    }
    if (legacy.type === 'ENHANCEMENT') {
      expectEqual(legacy.id, 'enhancementEffects', stripCurrentHpPolicy(cardRules.enhancementEffects.value), legacy.enhancementEffects || []);
      allow(legacy.id, 'enhancementEffects', 'ENHANCEMENT_EFFECTS_FORMALIZED');
    } else {
      expectEqual(legacy.id, 'enhancementEffects', legacy.enhancementEffects, []);
    }
    if (isHariganemushiRuntimeEffectTextOnlyDifference(legacy.id, cardRules.passiveEffects, legacy.passiveAbilities)) {
      allow(legacy.id, 'passiveAbilities/0/effectText', 'RUNTIME_EFFECT_TEXT_ENRICHMENT');
    } else {
      expectEqual(legacy.id, 'passiveAbilities', cardRules.passiveEffects, legacy.passiveAbilities);
    }

    var coreVerification = verifications[cardRules.verificationRef];
    expectEqual(legacy.id, 'sourceRefs', coreVerification.sourceRefs, legacy.sourceRefs);
    expectEqual(legacy.id, 'verificationNotes', coreVerification.notes, legacy.verificationNotes === null ? [] : [legacy.verificationNotes]);
    expectEqual(legacy.id, 'sourceLevel', coreVerification.status, legacy.sourceLevel === 'A' ? 'VERIFIED_OFFICIAL' : 'UNVERIFIED');
    allow(legacy.id, 'verification', 'VERIFICATION_MODEL_ADDED');
    allow(legacy.id, 'fieldStates', 'FIELD_STATE_WRAPPING');
  });

  return { unexpectedDifferences: unexpected, intentionalDifferences: intentional };
}

module.exports = {
  INTENTIONAL_DIFFERENCE_CODES: INTENTIONAL_DIFFERENCE_CODES,
  compareStarterV1ToLegacySnapshot: compareStarterV1ToLegacySnapshot
};
