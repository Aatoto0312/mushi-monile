(function (root, factory) {
  'use strict';
  var records = typeof module === 'object' && module.exports ? require('./full-catalog-data.js') : root.MushijingiFullCatalogData;
  var api = factory(root, records);
  if (typeof module === 'object' && module.exports) { module.exports = api; }
  root.MushijingiSet2Cards = api;
  if (root.cardRegistry) { api.register(root.cardRegistry); }
}(typeof globalThis !== 'undefined' ? globalThis : this, function (root, records) {
  'use strict';

  // Definitions add executable metadata to the one canonical catalog. Status
  // remains PARTIAL until metadata, Engine, Human and CPU verification is complete.
  function definitionFromRecord(record) {
    var raw = JSON.parse(JSON.stringify(record));
    var def = new root.CardDefinition(raw);
    var number = Number(record.officialNumber.split('/')[0]);
    def.skills.forEach(function (skill, index) {
      skill.id = record.id + '_skill_' + (index + 1);
      skill.timing = 'ATTACK';
      skill.effects = [];
      skill.additionalCost = [];
    });
    def.passiveAbilities.forEach(function (trait, index) {
      trait.id = record.id + '_trait_' + (index + 1);
      trait.effects = [];
    });
    var connected = [1,3,4,5,6,8,9,10,11,12,13,14,15,16,17,18,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,52,53,54,55];
    if (number === 1) {
      def.skills[0].effects = [{ type: 'DAMAGE_DOES_NOT_HEAL' }];
      def.passiveAbilities[0].timing = 'ON_ENTER_FIELD';
      def.passiveAbilities[0].optional = true;
      def.passiveAbilities[0].effects = [{ type: 'CHOOSE_SELF_COLOR', colors: ['BLUE', 'GREEN'] }];
    }
    if (number === 11) { def.skills[0].targetRule = 'OPPONENT_CHOOSES_TARGET'; }
    if (number === 7) {
      connected.push(number);
      def.skills[1].effects = [{ type: 'CAPTURE_ATTACK_DESTROYED_TARGET', destroyAtEndTurn: true }];
    }
    if (number === 2) {
      connected.push(number);
      def.skills[1].usageLimit = 'ONCE_PER_FIELD_STAY';
      def.skills[1].effects = [{ type: 'COPY_ALLY_COLOR_BEFORE_ATTACK' }];
    }
    if (number === 19) {
      connected.push(number);
      def.passiveAbilities[0].timing = 'ON_ENTER_FIELD';
      def.passiveAbilities[0].optional = true;
      def.passiveAbilities[0].effects = [{ type: 'MOVE_SELECTED', from: 'DISCARD', to: 'FIELD', count: 1,
        requiredTag: 'セミ科', cardType: 'INSECT', prohibitAttackThisTurn: true }];
    }
    if (number === 14 || number === 34) { def.skills[0].effects = [{ type: 'GROW_ON_TERRITORY', amount: number === 14 ? 100 : 200 }]; }
    if (number === 43) { def.skills[1].effects = [{ type: 'APPLY_STAT_MODIFIER', target: 'SELF', stat: 'HP', amount: 100, startTurnOffset: 1, endTurnOffset: 1 }]; }
    if (number === 40) { def.skills[0].effects = [{ type: 'OPTIONAL_FLIP_FOOD_ON_TERRITORY' }]; }
    if (number === 17) {
      def.skills[1].usageLimit = 'ONCE_PER_FIELD_STAY';
      def.skills[1].targetRule = 'INSECT_ONLY';
      def.skills[1].effects = [{ type: 'DESTROY_WOUNDED_TARGET_BEFORE_DAMAGE' }];
    }
    if (number === 27) {
      def.passiveAbilities[0].timing = 'ON_DESTROYED';
      def.passiveAbilities[0].condition = { type: 'DESTROYED_BY_OPPONENT_ATTACK' };
      def.passiveAbilities[0].effects = [{ type: 'MARK_ATTACK_SOURCE_DESTROY_ON_NEXT_CONTROLLER_TURN' }];
    }
    if (number === 31) {
      def.passiveAbilities[0].timing = 'ON_DESTROYED';
      def.passiveAbilities[0].condition = { type: 'DESTROYED_BY_OPPONENT_ATTACK' };
      def.passiveAbilities[0].effects = [{ type: 'DESTROY_SOURCE' }];
    }
    if (number === 9 || number === 25) {
      def.skills[1].usageLimit = 'ONCE_PER_FIELD_STAY';
      def.skills[1].effects = [{ type: 'HIDE_SOURCE_AFTER_ATTACK', endTurnOffset: 1 }];
    }
    if (number === 24) {
      def.skills[0].effects = [{ type: 'SUPPRESS_TERRITORY_TRIGGER_FOR_ATTACK' }];
      def.skills[1].usageLimit = 'ONCE_PER_FIELD_STAY';
    }
    if (number === 52) { def.cardEffects = [{ type: 'SUPPRESS_OPPONENT_TERRITORY_TRIGGER' }]; }
    if (number === 50) {
      connected.push(number);
      def.enhancementEffects = [{ type: 'SUMMON_ATTACHED_FROM_HAND' }, { type: 'PREVENT_HOST_ATTACK' },
        { type: 'DESTROY_ATTACHMENT_AFTER_TURNS', turnOffset: 1 }];
    }
    if (number === 51) {
      connected.push(number);
      def.cardEffects = [{ type: 'EXCHANGE_MATCHING_FORM', nameSuffix: '（幼虫）',
        firstZone: 'FIELD', firstDestination: 'FOOD', secondZone: 'HAND', secondDestination: 'FIELD' }];
    }
    if ([3,5,12].indexOf(number) !== -1) { def.skills[1].usageLimit = 'ONCE_PER_FIELD_STAY'; }
    if (number === 4) { def.skills[1].effects = [{ type: 'GRANT_DAMAGE_SHIELD', startTurnOffset: 1, endTurnOffset: 1 }]; }
    if (number === 13 || number === 22) {
      def.skills[1].effects = [{ type: 'APPLY_STAT_MODIFIER', target: 'SELF', stat: 'AP', amount: number === 13 ? 300 : 400, startTurnOffset: 2, endTurnOffset: 2 }];
    }
    if (number === 16) { def.passiveAbilities[0].effects = [{ type: 'PREVENT_DAMAGE', limit: 'FIRST_PER_TURN' }]; }
    if ([15,30,37,44].indexOf(number) !== -1) {
      def.skills.push({ id: 'tobidasu', name: 'とびだす', baseAp: null, timing: 'TERRITORY_DRAW', optional: true, effects: [{ type: 'OFFER_SELF_TO_FIELD' }] });
    }
    if (number === 20 || number === 23) {
      def.skills.push({ id: record.id + '_lure', name: def.passiveAbilities[0].name, baseAp: null, timing: 'PASSIVE', effects: [], targetRule: 'FORCE_ATTACK_TO_SELF_GROUP' });
    }
    if (number === 21) {
      def.skills[1].effects = [{ type: 'ATTACK_MULTIPLE_TARGETS', exactSelections: 2, ordered: true }];
    }
    if (number === 33 || number === 42) {
      def.skills.push({ id: 'gitai', name: '擬態', baseAp: null, timing: 'PASSIVE', effects: [], gitai: true });
    }
    if (number === 47) { def.enhancementEffects = [{ type: 'PREVENT_DAMAGE', sourceType: 'ATTACK', consumeSelf: true }]; }
    if (number === 41) { def.passiveAbilities[0].effects = [{ type: 'PREVENT_DAMAGE', sourceType: 'ATTACK', skillNameIncludes: '毒' }]; }
    if (number === 45) { def.passiveAbilities[0].effects = [{ type: 'CANNOT_ATTACK' }, { type: 'OPPONENT_SPELL_TARGET_IMMUNITY' }]; }
    if (number === 46) { def.enhancementEffects = [{ type: 'IGNORE_WEAKNESS' }]; }
    if (number === 48 || number === 49) {
      def.enhancementEffects = ['HP', 'AP'].map(function (stat) { return { type: 'STAT_MODIFIER', stat: stat, amount: number === 48 ? 300 : 500 }; });
    }
    if (number === 53) { def.cardEffects = [{ type: 'DEAL_DAMAGE_TO_TARGET', target: 'OPPONENT_FIELD_INSECT', amount: 1000, ignoreAttributeMultiplier: true }]; }
    if (number === 54) { def.cardEffects = [{ type: 'APPLY_STAT_MODIFIER', target: 'OWN_FIELD_INSECT', requiresTarget: true, stat: 'AP', amount: 500 }]; }
    if (number === 55) { def.cardEffects = [{ type: 'MOVE_TARGET', target: 'OWN_FOOD', cardTypes: ['SPELL', 'ENHANCEMENT'], requiresTarget: true, from: 'FOOD', to: 'HAND' }]; }
    ['cardEffects', 'enhancementEffects'].forEach(function (key) {
      if (def[key].length && record[key].length) { def[key][0].effectText = record[key].map(function (effect) { return effect.effectText || ''; }).join(' '); }
    });
    if (connected.indexOf(number) !== -1) {
      def.implementationStatus = root.CardStatus.PARTIAL;
      def.implementationNotes = 'Mechanic wiring in progress; metadata and Human/CPU paths are not yet fully verified.';
    }
    return def;
  }
  function register(registry) {
    records.filter(function (record) { return record.set === 'BOOSTER_SET_2'; }).forEach(function (record) {
      if (!registry.has(record.id)) { registry.register(definitionFromRecord(record)); }
    });
  }
  return { definitionFromRecord: definitionFromRecord, register: register };
}));
