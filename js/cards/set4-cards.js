(function (root, factory) {
  'use strict';
  var records = typeof module === 'object' && module.exports ? require('./full-catalog-data.js') : root.MushijingiFullCatalogData;
  var api = factory(root, records);
  if (typeof module === 'object' && module.exports) { module.exports = api; }
  root.MushijingiSet4Cards = api;
  if (root.cardRegistry) { api.register(root.cardRegistry); }
}(typeof globalThis !== 'undefined' ? globalThis : this, function (root, records) {
  'use strict';
  var alphaPlayableNumbers = [1,3,4,5,6,8,9,10,11,12,14,15,16,17,19,22,23,26,29,30,31,32,34,35,38,41,42,43,46,47,48,49,50,51,57,61];
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
    if ([6,8,13].indexOf(number) !== -1) { def.passiveAbilities[0].effects=[{type:'SHARE_LINKED_ALLY_ATTACK_SKILLS'}]; }
    if(number===6){def.skills[0].dynamicAp={type:'OWN_FIELD_FAMILY_SUFFIX_COUNT',familySuffix:'アリ科',multiplier:200};}
    if ([4,9,19,31].indexOf(number) !== -1) {
      def.skills.push({id:record.id+'_kabau',name:'かばう',baseAp:null,timing:'TERRITORY_DRAW',optional:true,effects:[{type:'KABAU_TERRITORY_ENTRY'}]});
    }
    if (number === 13) { def.skills[0].effects=[{type:'FORCE_ATTACK_TO_SOURCE_NEXT_OPPONENT_TURN'}]; }
    if (number === 8) { def.skills[0].effects=[{type:'SET_ATTACK_TARGET_COLOR_UNTIL_END_TURN',color:'GREEN'}]; }
    if (number === 14) { def.continuousStatModifiers=[{type:'OWN_DISCARD_COLORS',colors:['RED','BLUE','GREEN'],stats:['HP','AP'],amount:200}]; }
    if (number === 15) { def.passiveAbilities[0].effects=[{type:'CARD_COST_MODIFIER',cardType:'INSECT',minimumPrintedSkills:2,amount:1,affects:'ALL_PLAYERS'}]; }
    if (number === 16) { def.passiveAbilities[0].timing='ON_ENTER_FIELD';def.passiveAbilities[0].effects=[{type:'DESTROY_OWN_FOOD_OR_SELF_ON_ENTRY'}]; }
    if (number === 18) { def.skills[1].effects=[{type:'ATTACK_MULTIPLE_TARGETS',exactSelections:2,ordered:true}]; }
    if (number === 17) { def.skills[1].effects=[{type:'TAX_OPPONENT_CARD_TYPE_AFTER_ATTACK',cardType:'SPELL',amount:1,startTurnOffset:1,endTurnOffset:1}]; }
    if (number === 20) { def.passiveAbilities[0].effects=[{type:'PREVENT_DAMAGE',sourceType:'ATTACK',skillNameIncludes:'毒'}]; }
    if (number === 21) { def.passiveAbilities[0].timing='ON_DESTROYED';def.passiveAbilities[0].condition={type:'DESTROYED_BY_ATTACK'};def.passiveAbilities[0].optional=true;def.passiveAbilities[0].effects=[{type:'OPTIONAL_FLIP_OPPONENT_FOOD_ON_DESTROYED',maxSelections:2}]; }
    if (number === 23) { def.continuousStatModifiers=[{type:'SOLE_VISIBLE_OWN_INSECT',stats:['AP'],amount:200}]; }
    if ([24,25].indexOf(number) !== -1) { def.skills[1].usageLimit='ONCE_PER_FIELD_STAY';def.skills[1].effects=[{type:'OPTIONAL_FLIP_OPPONENT_FOOD_BEFORE_DAMAGE'}]; }
    if (number === 26) { def.passiveAbilities[0].effects=[{type:'FORCE_OPPONENT_SPELL_TARGET_TO_SELF_GROUP'}]; }
    if (number === 27) { def.skills[0].bonusApAgainstAttached=300; }
    if (number === 28) { def.skills[1].usageLimit='ONCE_PER_FIELD_STAY'; }
    if ([29,32].indexOf(number) !== -1) { def.continuousStatModifiers=[{type:'OWN_FOOD_MINIMUM',minimum:8,stats:['HP','AP'],amount:number===29?1000:500}]; }
    if (number === 33) { def.skills[0].effects=[{type:'GROW_ON_TERRITORY',amount:200,stats:['HP','AP']}]; }
    if (number === 34) { def.passiveAbilities[0].timing='ON_DESTROYED';def.passiveAbilities[0].condition={type:'DESTROYED_BY_ATTACK'};def.passiveAbilities[0].effects=[{type:'MOVE_CARD',target:'SOURCE',from:'DISCARD',to:'FOOD'}]; }
    if (number === 36) { def.skills[1].additionalCost=[{type:'SACRIFICE_OWN_INSECT',amount:1}]; }
    if (number === 37) { def.passiveAbilities[0].timing='ON_DESTROYED';def.passiveAbilities[0].condition={type:'DESTROYED_BY_ATTACK'};def.passiveAbilities[0].optional=true;def.passiveAbilities[0].effects=[{type:'OPTIONAL_FLIP_OPPONENT_FOOD_ON_DESTROYED',maxSelections:1}]; }
    if (number === 38) { def.skills.push({id:record.id+'_gitai',name:'ベイツ型擬態',baseAp:null,timing:'PASSIVE',effects:[],gitai:true}); }
    if (number === 41) { def.continuousStatModifiers=[{type:'HAS_ATTACHMENT',stats:['HP','AP'],amount:100}]; }
    if(number===43){def.passiveAbilities[0].effects=[{type:'SUPPRESS_ALL_OTHER_INSECT_KEYWORD_SKILLS'}];}
    if (number === 44) { def.skills[1].effects=[{type:'APPLY_STAT_MODIFIER',target:'SOURCE',stat:'HP',amount:200,startTurnOffset:1,endTurnOffset:1}]; }
    if (number >= 46 && number <= 50) {
      var amounts={46:400,47:700,48:600,49:1000,50:1000};
      def.enhancementEffects=[{type:'STAT_MODIFIER',stat:number<=47||number===50?'AP':'HP',amount:amounts[number]},{type:'OPTIONAL_ATTACH_FROM_TERRITORY'}];
    }
    if(number===51){def.enhancementEffects=[{type:'FORCE_OPPONENT_SPELL_TARGET_TO_SELF_GROUP'}];}
    if(number===57){def.cardEffects=[{type:'EXCHANGE_MATCHING_FORM',nameSuffix:'（幼虫）',firstZone:'FIELD',firstDestination:'DISCARD',secondZone:'DISCARD',secondDestination:'FIELD'}];}
    if(number===61){def.cardEffects=[{type:'GRANT_OPPONENT_SPELL_IMMUNITY',target:'OWN_FIELD_INSECT',requiresTarget:true,endTurnOffset:1}];}
    var alphaPlayable = alphaPlayableNumbers.indexOf(number) !== -1;
    def.implementationStatus = alphaPlayable ? root.CardStatus.PLAYABLE : root.CardStatus.PARTIAL;
    def.implementationNotes = alphaPlayable
      ? 'SET4 alpha: card text, generic mechanic, Human/CPU reachability and regression evidence are recorded in scripts/set4-battle-evidence.js.'
      : 'SET4 alpha: Battle wiring exists, but card-specific completion evidence is incomplete; keep unavailable for Battle.';
    return def;
  }
  function register(registry) {
    records.filter(function (record) { return record.set === 'BOOSTER_SET_4'; }).forEach(function (record) {
      if (!registry.has(record.id)) { registry.register(definitionFromRecord(record)); }
    });
  }
  return { alphaPlayableNumbers: alphaPlayableNumbers.slice(), definitionFromRecord: definitionFromRecord, register: register };
}));
