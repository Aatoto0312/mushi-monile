(function (root, factory) {
  'use strict';
  var records = typeof module === 'object' && module.exports ? require('./full-catalog-data.js') : root.MushijingiFullCatalogData;
  var api = factory(root, records);
  if (typeof module === 'object' && module.exports) { module.exports = api; }
  root.MushijingiSet4Cards = api;
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
    if ([1, 3, 10].indexOf(number) !== -1) {
      def.costModifiers = [{ type:'PER_DISCARD_TRAIT', traitName:'生きた化石', per:1, amount:-1, minimum:0 }];
    }
    if ([11, 12].indexOf(number) !== -1) {
      def.costModifiers = [{ type:'PER_OPPONENT_FACE_UP_FOOD_COLOR', color:'BLUE', per:3, amount:-1, minimum:0 }];
    }
    if (number === 2) {
      def.skills[1].usageLimit='ONCE_PER_FIELD_STAY';
      def.skills[1].effects=[{type:'DISCARD_OPPONENT_HAND_ON_TERRITORY',count:1}];
    }
    if (number === 5) { def.passiveAbilities[0].effects=[{type:'SUPPRESS_ENTER_FIELD_TRAITS',affects:'ALL_PLAYERS'}]; }
    if ([4,9,19,31].indexOf(number) !== -1) {
      def.skills.push({id:record.id+'_kabau',name:'かばう',baseAp:null,timing:'TERRITORY_DRAW',optional:true,effects:[{type:'KABAU_TERRITORY_ENTRY'}]});
    }
    if (number === 13) { def.skills[0].effects=[{type:'FORCE_ATTACK_TO_SOURCE_NEXT_OPPONENT_TURN'}]; }
    if (number === 14) { def.continuousStatModifiers=[{type:'OWN_DISCARD_COLORS',colors:['RED','BLUE','GREEN'],stats:['HP','AP'],amount:200}]; }
    if (number === 15) { def.passiveAbilities[0].effects=[{type:'CARD_COST_MODIFIER',cardType:'INSECT',minimumPrintedSkills:2,amount:1,affects:'ALL_PLAYERS'}]; }
    if (number === 16) { def.passiveAbilities[0].timing='ON_ENTER_FIELD';def.passiveAbilities[0].effects=[{type:'DESTROY_OWN_FOOD_OR_SELF_ON_ENTRY'}]; }
    if (number === 18) { def.skills[1].effects=[{type:'ATTACK_MULTIPLE_TARGETS',count:2,exact:true}]; }
    if (number === 20) { def.passiveAbilities[0].effects=[{type:'PREVENT_DAMAGE',sourceType:'ATTACK',skillNameIncludes:'毒'}]; }
    if (number === 21) { def.passiveAbilities[0].timing='ON_DESTROYED';def.passiveAbilities[0].condition={type:'DESTROYED_BY_ATTACK'};def.passiveAbilities[0].optional=true;def.passiveAbilities[0].effects=[{type:'OPTIONAL_FLIP_OPPONENT_FOOD_ON_DESTROYED',maxSelections:2}]; }
    if (number === 23) { def.continuousStatModifiers=[{type:'SOLE_VISIBLE_OWN_INSECT',stats:['AP'],amount:200}]; }
    if ([24,25].indexOf(number) !== -1) { def.skills[1].usageLimit='ONCE_PER_FIELD_STAY';def.skills[1].effects=[{type:'OPTIONAL_FLIP_OPPONENT_FOOD_BEFORE_DAMAGE'}]; }
    if (number === 26) { def.passiveAbilities[0].effects=[{type:'FORCE_OPPONENT_SPELL_TARGET_TO_SELF_GROUP'}]; }
    if (number === 27) { def.skills[0].bonusApAgainstAttached=300; }
    if ([29,32].indexOf(number) !== -1) { def.continuousStatModifiers=[{type:'OWN_FOOD_MINIMUM',minimum:8,stats:['HP','AP'],amount:number===29?1000:500}]; }
    if (number === 33) { def.skills[0].effects=[{type:'GROW_ON_TERRITORY',amount:200,stats:['HP','AP']}]; }
    if (number === 34) { def.passiveAbilities[0].timing='ON_DESTROYED';def.passiveAbilities[0].condition={type:'DESTROYED_BY_ATTACK'};def.passiveAbilities[0].effects=[{type:'MOVE_CARD',target:'SOURCE',from:'DISCARD',to:'FOOD'}]; }
    if (number === 36) { def.skills[1].additionalCost=[{type:'SACRIFICE_OWN_INSECT',amount:1}]; }
    if (number === 37) { def.passiveAbilities[0].timing='ON_DESTROYED';def.passiveAbilities[0].condition={type:'DESTROYED_BY_ATTACK'};def.passiveAbilities[0].optional=true;def.passiveAbilities[0].effects=[{type:'OPTIONAL_FLIP_OPPONENT_FOOD_ON_DESTROYED',maxSelections:1}]; }
    if (number === 38) { def.skills.push({id:record.id+'_gitai',name:'ベイツ型擬態',baseAp:null,timing:'PASSIVE',effects:[],gitai:true}); }
    if (number === 41) { def.continuousStatModifiers=[{type:'HAS_ATTACHMENT',stats:['HP','AP'],amount:100}]; }
    if (number === 44) { def.skills[1].effects=[{type:'APPLY_STAT_MODIFIER',target:'SOURCE',stat:'HP',amount:200,startTurnOffset:1,endTurnOffset:1}]; }
    if (number >= 46 && number <= 50) {
      var amounts={46:400,47:700,48:600,49:1000,50:1000};
      def.enhancementEffects=[{type:'STAT_MODIFIER',stat:number<=47||number===50?'AP':'HP',amount:amounts[number]},{type:'OPTIONAL_ATTACH_FROM_TERRITORY'}];
    }
    if(number===51){def.enhancementEffects=[{type:'FORCE_OPPONENT_SPELL_TARGET_TO_SELF_GROUP'}];}
    def.implementationStatus = root.CardStatus.PARTIAL;
    def.implementationNotes = 'SET4 metadata is wired; Battle completion requires the card evidence audit.';
    return def;
  }
  function register(registry) {
    records.filter(function (record) { return record.set === 'BOOSTER_SET_4'; }).forEach(function (record) {
      if (!registry.has(record.id)) { registry.register(definitionFromRecord(record)); }
    });
  }
  return { definitionFromRecord: definitionFromRecord, register: register };
}));
