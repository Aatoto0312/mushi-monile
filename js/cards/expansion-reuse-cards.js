(function (root, factory) {
  'use strict';
  var records = typeof module === 'object' && module.exports ? require('./full-catalog-data.js') : root.MushijingiFullCatalogData;
  var api = factory(root, records);
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.MushijingiExpansionReuseCards = api;
  if (root.cardRegistry) api.register(root.cardRegistry);
}(typeof globalThis !== 'undefined' ? globalThis : this, function (root, records) {
  'use strict';
  // Explicitly reviewed recipes, not automatic text-to-rule inference.
  // A donor contributes executable metadata only after full-text equality.
  var recipes = {
    set6_029: {}, set6_045: {}, set7_043: {}, set7_050: {}, set8_046: {},
    set6_009: { attackCount: 2, skills: { 1: ['set2_003', 1] } },
    set7_003: { attackCount: 2, skills: { 1: ['set2_003', 1] } },
    set8_012: { skills: { 0: ['set2_001', 0] } },
    set8_020: { traits: 'set5_028' },
    set8_035: { traits: 'set5_015' },
    set6_023: { attackCount: 2, skills: { 1: ['set2_009', 1] } },
    set6_034: { attackCount: 2, skills: { 1: ['set2_009', 1] } },
    set6_039: { attackCount: 2, skills: { 1: ['set2_009', 1] } },
    set6_040: { traits: 'set5_011' },
    set6_048: { traits: 'set3_043' },
    set7_039: { traits: 'set2_015' },
    set7_047: { traits: 'set2_020' },
    set8_002: { traits: 'set2_001' },
    set8_009: { traits: 'set2_015' },
    set8_025: { traits: 'set2_020' },
    set8_010: { attackCount: 2, skills: { 1: ['set3_011', 1] } }
  };
  var playable = ['set6_029', 'set6_045', 'set7_043', 'set7_050', 'set8_046', 'set6_009', 'set7_003', 'set8_012', 'set8_020', 'set8_035', 'set6_023', 'set6_034', 'set6_039', 'set6_040', 'set6_048', 'set7_039', 'set7_047', 'set8_002', 'set8_009', 'set8_025', 'set8_010'];
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function text(value) { return String(value || '').normalize('NFKC').replace(/\s/g, ''); }
  function requireSameText(actual, donor, id) {
    if (text(actual.effectText) !== text(donor.effectText)) throw Error('REUSE_TEXT_MISMATCH ' + id);
  }
  function definitionFromRecord(record) {
    if (!Object.prototype.hasOwnProperty.call(recipes, record.id)) throw Error('UNMAPPED_CARD ' + record.id);
    var recipe = recipes[record.id], d = new root.CardDefinition(clone(record));
    if (d.skills.length !== (recipe.attackCount || 1)) throw Error('UNMAPPED_ATTACK_COUNT ' + d.id);
    if ((d.cardEffects || []).length || (d.enhancementEffects || []).length) throw Error('UNMAPPED_CARD_EFFECT ' + d.id);
    d.skills = d.skills.map(function (printed, index) {
      var sourceRef = recipe.skills && recipe.skills[index], skill;
      if (sourceRef) {
        var source = root.getCardDefinition(sourceRef[0]).skills[sourceRef[1]];
        if (source.timing !== 'ATTACK') throw Error('UNMAPPED_ATTACK_DONOR ' + d.id);
        requireSameText(printed, source, d.id);
        skill = Object.assign(clone(source), printed, { effects: clone(source.effects || []), additionalCost: clone(source.additionalCost || []), usageLimit: source.usageLimit || null });
      } else {
        if (text(printed.effectText)) throw Error('UNMAPPED_SKILL_TEXT ' + d.id);
        skill = Object.assign(printed, { effects: [], additionalCost: [] });
      }
      skill.id = d.id + '_skill_' + (index + 1);
      skill.timing = 'ATTACK';
      return skill;
    });
    if (recipe.traits) {
      var donor = root.getCardDefinition(recipe.traits);
      if (donor.passiveAbilities.length !== d.passiveAbilities.length) throw Error('REUSE_TRAIT_MISMATCH ' + d.id);
      d.passiveAbilities = d.passiveAbilities.map(function (printed, index) {
        var source = donor.passiveAbilities[index];
        requireSameText(printed, source, d.id);
        return Object.assign(clone(source), { id: d.id + '_trait_' + (index + 1), name: printed.name, effectText: printed.effectText });
      });
      donor.skills.filter(function (skill) { return skill.timing !== 'ATTACK'; }).forEach(function (skill, index) {
        var copy = clone(skill);
        if (copy.id !== 'tobidasu') copy.id = d.id + '_aux_' + index;
        d.skills.push(copy);
      });
    } else if (d.passiveAbilities.length) throw Error('UNMAPPED_TRAIT_TEXT ' + d.id);
    d.implementationStatus = playable.indexOf(d.id) !== -1 ? root.CardStatus.PLAYABLE : root.CardStatus.PARTIAL;
    d.implementationNotes = 'Explicit cross-set reuse recipe; per-card tests and evidence are separate from registration. Final audit pending.';
    return d;
  }
  function register(registry) {
    Object.keys(recipes).forEach(function (id) {
      var record = records.find(function (r) { return r.id === id; });
      if (!record) throw Error('Missing canonical record ' + id);
      registry.register(definitionFromRecord(record));
    });
  }
  return { register: register, definitionFromRecord: definitionFromRecord, wiredIds: Object.keys(recipes), playableIds: playable.slice(), recipes: clone(recipes) };
}));
