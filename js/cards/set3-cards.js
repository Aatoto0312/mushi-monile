(function (root, factory) {
  'use strict';
  var records = typeof module === 'object' && module.exports ? require('./full-catalog-data.js') : root.MushijingiFullCatalogData;
  var api = factory(root, records);
  if (typeof module === 'object' && module.exports) { module.exports = api; }
  root.MushijingiSet3Cards = api;
  if (root.cardRegistry) { api.register(root.cardRegistry); }
}(typeof globalThis !== 'undefined' ? globalThis : this, function (root, records) {
  'use strict';
  function definitionFromRecord(record) {
    var def = new root.CardDefinition(JSON.parse(JSON.stringify(record)));
    def.skills.forEach(function (skill, index) {
      skill.id = record.id + '_skill_' + (index + 1);
      skill.timing = 'ATTACK'; skill.effects = []; skill.additionalCost = [];
    });
    def.passiveAbilities.forEach(function (trait, index) {
      trait.id = record.id + '_trait_' + (index + 1); trait.effects = [];
    });
    var number = Number(record.officialNumber.split('/')[0]);
    if ([2,4,5,10,13,16].indexOf(number) !== -1) {
      def.costModifiers = [{ type: 'PER_FACE_UP_FOOD_COLOR', color: 'BLUE', per: 2, amount: -1, minimum: 0 }];
    }
    if (number === 3) {
      def.passiveAbilities[0].effects = [{ type: 'CARD_COST_MODIFIER', cardType: 'SPELL', printedCostMax: 1, amount: 1, affects: 'ALL_PLAYERS' }];
    }
    if (number === 18 || number === 25) {
      def.passiveAbilities[0].effects = [{ type: 'CARD_COST_MODIFIER', cardType: 'ENHANCEMENT', target: 'SELF', amount: -1, minimum: 0 }];
    }
    if (number === 19) { def.costModifiers = [{ type: 'OWN_FIELD_EMPTY', amount: -1, minimum: 0 }]; }
    if (number === 1) { def.skills[1].requirements = [{ type: 'TARGET_HAS_ATTACHMENT' }]; }
    if (number === 8) { def.skills[1].requirements = [{ type: 'OWN_FIELD_CARD_ID', cardId: 'set3_009' }]; }
    if (number === 9) { def.skills[1].requirements = [{ type: 'OWN_FIELD_CARD_ID', cardId: 'set3_008' }]; }
    if (number === 6 || number === 7) {
      def.skills[1].usageLimit = 'ONCE_PER_FIELD_STAY';
      def.skills[1].effects = [{ type:'OPTIONAL_FLIP_OPPONENT_FOOD_BEFORE_DAMAGE' }];
    }
    if (number === 28) { def.passiveAbilities[0].effects = [{ type: 'CANNOT_ATTACK' }]; }
    if (number === 29) { def.summonAlternatives=[{type:'SACRIFICE_OWN_FIELD',count:1,requiredNameSuffix:'（幼虫）'}]; }
    if (number === 30) { def.passiveAbilities[0].timing='ON_ENTER_FIELD';def.passiveAbilities[0].effects=[{type:'DESTROY_SELF_AT_END_TURN_UNLESS_ATTACHED'}]; }
    if (number === 32 || number === 35) {
      def.attackRequirements = [{ type: 'FACE_UP_FOOD_COLOR_COUNT', color: 'GREEN', minimum: number === 32 ? 3 : 2 }];
    }
    if (number === 40) { def.skills[0].dynamicAp = { type: 'OWN_FIELD_COLOR_COUNT', color: 'GREEN', multiplier: 300 }; }
    if (number === 39 || number === 42 || number === 45) {
      def.passiveAbilities[0].timing='ON_ENTER_FIELD'; def.passiveAbilities[0].optional=true;
      def.passiveAbilities[0].effects=[{type:'DEAL_DAMAGE_TO_TARGET',target:'OPPONENT_FIELD_INSECT',amount:number===39?300:number===42?200:100,ignoreAttributeMultiplier:true,suppressTerritoryDraw:true}];
    }
    if (number === 34) {
      def.skills.push({ id: 'gitai', name: '擬態', baseAp: null, timing: 'PASSIVE', effects: [], gitai: true });
    }
    if (number === 37) { def.passiveAbilities[0].timing='ON_DESTROYED';def.passiveAbilities[0].effects=[{type:'MOVE_CARD',target:'SOURCE',from:'DISCARD',to:'FOOD'}]; }
    if (number === 44) {
      def.skills.push({ id: record.id + '_lure', name: def.passiveAbilities[0].name, baseAp: null, timing: 'PASSIVE', effects: [], targetRule: 'FORCE_ATTACK_TO_SELF_GROUP' });
    }
    if (number === 46 || number === 47) {
      var amount = number === 46 ? 700 : 200;
      def.enhancementEffects = ['HP','AP'].map(function (stat) { return { type:'STAT_MODIFIER', stat:stat, amount:amount }; });
      def.enhancementEffects.push({ type:'OPTIONAL_ATTACH_FROM_TERRITORY' });
    }
    if (number === 55) {
      def.cardEffects = [{ type:'APPLY_STAT_MODIFIER_TO_ALL_OWN_FIELD', stat:'AP', amount:500, startTurnOffset:0, endTurnOffset:0 }];
    }
    def.implementationStatus = root.CardStatus.PARTIAL;
    def.implementationNotes = 'SET3 audit in progress; release gates have not passed.';
    return def;
  }
  function register(registry) {
    records.filter(function (record) { return record.set === 'BOOSTER_SET_3'; }).forEach(function (record) {
      if (!registry.has(record.id)) { registry.register(definitionFromRecord(record)); }
    });
  }
  return { definitionFromRecord: definitionFromRecord, register: register };
}));
