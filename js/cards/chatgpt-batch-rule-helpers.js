/* ChatGPT batch prototype: pure, side-effect-free rule predicates.
 * This module is NOT wired to the runtime registry. Do not mark cards PLAYABLE
 * until the Engine integration and all behavioral tests pass.
 */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MushiBatchRuleHelpers = api;
})(globalThis, function () {
  'use strict';

  function array(value) { return Array.isArray(value) ? value : []; }
  function cardName(card) { return String(card && card.name || ''); }
  function hasSkillEffect(skill) {
    if (!skill) return false;
    if (array(skill.effects).length) return true;
    // An effectText is not necessarily meaningful; printed text may be empty.
    return Boolean(String(skill.effectText || '').trim());
  }
  function hasNoSkillEffects(definition) {
    return Boolean(definition && array(definition.skills).every(function (skill) {
      return !hasSkillEffect(skill);
    }));
  }
  function isLarva(definition) {
    return /[（(]幼虫[）)]/.test(cardName(definition));
  }
  function isColor(definition, color) {
    return Boolean(definition && String(definition.color || '').toUpperCase() === color);
  }
  function canAttach(cardId, hostDefinition) {
    if (!hostDefinition || hostDefinition.type !== 'INSECT') return false;
    switch (cardId) {
      case 'set5_048':
      case 'set5_049': return hasNoSkillEffects(hostDefinition);
      case 'set5_055': return isLarva(hostDefinition);
      case 'set5_050': return isColor(hostDefinition, 'RED');
      case 'set5_051': return isColor(hostDefinition, 'BLUE');
      case 'set5_052': return isColor(hostDefinition, 'GREEN');
      default: return null; // Not an attachment restriction defined by this module.
    }
  }
  function enhancementBonus(cardId, ownFoodCount) {
    switch (cardId) {
      case 'set5_048':
      case 'set5_055': return { hp: 400, ap: 400 };
      case 'set5_049': return { hp: 800, ap: 800 };
      case 'set6_055': return { hp: 700, ap: 700 };
      case 'set5_052':
        if (!Number.isInteger(ownFoodCount) || ownFoodCount < 0) return null;
        return ownFoodCount >= 6 ? { hp: 800, ap: 800 } : { hp: 400, ap: 400 };
      default: return null;
    }
  }
  function shouldReturnAttachmentOnAttackDestruction(cardId, destroyedByInsectAttack) {
    return Boolean(destroyedByInsectAttack && (
      cardId === 'set5_048' || cardId === 'set5_049' || cardId === 'set5_055'
    ));
  }
  function isDiscardDeployBlocked(fieldInsects) {
    return array(fieldInsects).some(function (entry) {
      if (!entry || entry.faceDown || entry.suppressed || entry.skillsSuppressed) return false;
      return entry.cardId === 'set7_046' ||
        Boolean(entry.definition && entry.definition.id === 'set7_046');
    });
  }
  function areaDamageSpec(cardId, unhealableTargetDamage) {
    switch (cardId) {
      case 'set8_008':
        return { damage: 200, sides: 'OPPONENT', ignoreWeakness: true,
          preventTerritoryDrawOnKill: true, optional: true, endTurn: false };
      case 'set8_057':
        return { damage: 300, sides: 'BOTH', ignoreWeakness: false,
          preventTerritoryDrawOnKill: false, optional: false, endTurn: true };
      case 'set8_058':
        return { damage: 1200, sides: 'BOTH', ignoreWeakness: true,
          preventTerritoryDrawOnKill: false, optional: false, endTurn: true };
      case 'set5_061':
        if (!Number.isInteger(unhealableTargetDamage) || unhealableTargetDamage <= 0) return null;
        return { damage: unhealableTargetDamage, sides: 'BOTH', ignoreWeakness: true,
          preventTerritoryDrawOnKill: false, optional: false, endTurn: true };
      default: return null;
    }
  }
  return {
    canAttach: canAttach,
    enhancementBonus: enhancementBonus,
    hasNoSkillEffects: hasNoSkillEffects,
    isLarva: isLarva,
    shouldReturnAttachmentOnAttackDestruction: shouldReturnAttachmentOnAttackDestruction,
    isDiscardDeployBlocked: isDiscardDeployBlocked,
    areaDamageSpec: areaDamageSpec
  };
});
