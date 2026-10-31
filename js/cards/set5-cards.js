(function (root, factory) {
  'use strict';
  var records = typeof module === 'object' && module.exports ? require('./full-catalog-data.js') : root.MushijingiFullCatalogData;
  var api = factory(root, records);
  if (typeof module === 'object' && module.exports) { module.exports = api; }
  root.MushijingiSet5Cards = api;
  if (root.cardRegistry) { api.register(root.cardRegistry); }
}(typeof globalThis !== 'undefined' ? globalThis : this, function (root, records) {
  'use strict';
  // Only connect definitions whose full text has been mapped. Registration is
  // deliberately separate from completion evidence and release status.
  var wiredNumbers = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 35, 36, 37, 38, 39, 40, 41, 43, 44, 45, 46, 47, 56, 57, 60, 62, 63, 64];
  var playableNumbers = [1, 2, 3, 4, 5, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 22, 23, 24, 26, 29, 30, 31, 32, 33, 35, 36, 37, 38, 39, 40, 41, 43, 45, 63, 64];
  function definitionFromRecord(record) {
    var def = new root.CardDefinition(JSON.parse(JSON.stringify(record)));
    def.skills.forEach(function (skill, index) {
      skill.id = record.id + '_skill_' + (index + 1);
      skill.timing = 'ATTACK';
      skill.effects = [];
      skill.additionalCost = [];
    });
    var number = Number(record.officialNumber.split('/')[0]);
    if (number === 1) { def.skills[1].requirements = [{type:'SOURCE_HAS_ATTACHMENT'}]; }
    if (number === 2) { def.skills[0].dynamicAp = {type:'FOOD_COLOR_COUNT',color:'RED',multiplier:300}; }
    if (number === 3) {
      def.passiveAbilities[0].timing = 'ON_ENTER_FIELD';
      def.passiveAbilities[0].effects = [{type:'MOVE_OWN_ZONE_CARD_OR_DESTROY_SELF_ON_ENTRY',from:'HAND',to:'DISCARD',cardType:'INSECT'}];
    }
    if (number === 9) {
      def.passiveAbilities[0].timing = 'ON_DESTROYED';
      def.passiveAbilities[0].condition = {type:'DESTROYED_BY_ATTACK'};
      def.passiveAbilities[0].effects = [{type:'MARK_ATTACK_SOURCE_DESTROY_ON_NEXT_DAMAGE'}];
    }
    if (number === 7) { def.passiveAbilities[0].timing='ON_OTHER_OWN_INSECT_DESTROYED';def.passiveAbilities[0].condition={type:'DESTROYED_BY_ATTACK'};def.passiveAbilities[0].effects=[{type:'DRAW_OPPONENT_TERRITORY'}]; }
    if (number === 5) {
      def.skills[0].effects = [{type:'DAMAGE_DOES_NOT_HEAL'}];
      def.passiveAbilities[0].timing = 'ON_ENTER_FIELD';
      def.passiveAbilities[0].optional = true;
      def.passiveAbilities[0].effects = [{type:'CHOOSE_SELF_COLOR',colors:['BLUE']}];
    }
    if (number === 15) { def.passiveAbilities[0].effects = [{type:'CANNOT_ATTACK_ENTRY_TURN'}]; }
    if ([11,14,24,26,41].indexOf(number)!==-1) {
      def.passiveAbilities[0].timing='ON_OTHER_OWN_INSECT_ENTER';
      def.passiveAbilities[0].effects=[{type:'DESTROY_SELF'}];
    }
    if (number === 12) {
      def.skills[1].usageLimit = 'ONCE_PER_FIELD_STAY';
      def.skills[1].effects = [{type:'APPLY_ATTACK_RESTRICTION',startTurnOffset:1,endTurnOffset:1,whileSourceOnField:false}];
    }
    if (number === 17 || number === 19) { def.costModifiers = [{type:'PER_OPPONENT_FACE_DOWN_FOOD',per:2,amount:-1,minimum:0,requiresKeywordTrait:true}]; }
    if (number === 21) { def.skills[1].effects = [{type:'ATTACK_MULTIPLE_TARGETS',exactSelections:2,ordered:true}]; }
    if (number === 33) { def.skills[1].additionalCost = [{type:'SACRIFICE_OWN_FOOD',amount:1}]; }
    if (number === 35) {
      def.passiveAbilities[0].timing = 'ON_ENTER_FIELD';
      def.passiveAbilities[0].optional = true;
      def.passiveAbilities[0].effects = [{type:'MOVE_SELECTED',from:'DISCARD',to:'HAND',cardType:'ENHANCEMENT',printedCost:0,count:1}];
    }
    if (number === 22 || number === 23) {
      def.continuousStatModifiers = [{type:'OWN_FIELD_CARD_ID',cardId:number===22?'set5_023':'set5_022',stats:['AP'],amount:600}];
    }
    if (number === 28) { def.passiveAbilities[0].effects = [{type:'SPELL_TARGET_IMMUNITY'}]; }
    if (number === 25) { def.skills[1].effects = [{type:'GAIN_COST_ON_TERRITORY',minimumRemainingTerritory:5,amount:1}]; }
    if (number === 27) { def.skills[0].effects = [{type:'OPTIONAL_FLIP_FOOD_ON_TERRITORY',color:'BLUE',cardType:'INSECT',maxSelections:2}]; }
    if (number === 45) { def.skills[0].effects = [{type:'OPTIONAL_FLIP_FOOD_ON_TERRITORY',controller:'SELF',faceDown:true,targetFaceDown:false,maxSelections:1}]; }
    if (number === 29) { def.skills[0].effects = [{type:'GROW_AFTER_ATTACK',amount:300,stats:['HP','AP']}]; }
    if (number === 30) { def.passiveAbilities[0].timing='ACTIVATED_FIELD';def.passiveAbilities[0].effects=[{type:'DEPLOY_MATCHING_HAND_INSECT',prohibitAttackThisTurn:true}]; }
    if (number === 31) { def.skills[0].effects = [{type:'GROW_ON_ATTACK_KILL',amount:200,stats:['HP','AP']}]; }
    if (number === 32) {
      def.passiveAbilities[0].timing='ON_ENTER_FIELD';
      def.passiveAbilities[0].effects=[{type:'CHOOSE_COLOR_AND_CONCEAL_FOOD',colors:['RED','BLUE','GREEN','COLORLESS']}];
    }
    if (number === 60) { def.cardEffects=[{type:'RESET_ATTACK',requiresTarget:true,target:'OWN_ATTACKED_FIELD_INSECT',requiredSkillNameSubstring:'毒'}]; }
    if (number === 57) { def.cardEffects=[{type:'MOVE_SELECTED_ZONE_CARDS',from:'DISCARD',to:'FOOD',exactSelections:2,faceDown:true,suppressFoodCostThisTurn:true}]; }
    if (number === 62) { def.cardEffects=[{type:'MOVE_SELECTED_ZONE_CARDS',from:'DISCARD',to:'HAND',cardType:'ENHANCEMENT',nameSubstrings:['甲冑','贋作'],minSelections:0,maxSelections:2}]; }
    if (number === 56) { def.cardEffects=[{type:'DISCOUNT_NEXT_MATCHING_FORM',sourceZone:'FOOD',nameSuffix:'（幼虫）',amount:3}]; }
    if (number === 40) { def.passiveAbilities[0].timing='TERRITORY_DRAW';def.passiveAbilities[0].effects=[{type:'OPTIONAL_SELF_DRAW_DESTINATION',destination:'FOOD'}]; }
    if (number === 38) { def.passiveAbilities[0].timing='TERRITORY_DRAW';def.passiveAbilities[0].effects=[{type:'OPTIONAL_SELF_DRAW_DESTINATION',destination:'TERRITORY',replaceNextTerritoryDraw:true,discardAtEndTurn:true}]; }
    if (number === 37 || number === 39) { def.passiveAbilities[0].timing='ON_OPPONENT_SPELL_USED';def.passiveAbilities[0].effects=[{type:'DESTROY_SELF'}]; }
    if (number === 43) { def.passiveAbilities[0].effects=[{type:'PREVENT_OPPONENT_SPELL_DAMAGE_AND_DESTRUCTION',turnAfterEntry:1}]; }
    if (number === 44) { def.passiveAbilities[0].timing='ON_ENTER_FIELD';def.passiveAbilities[0].effects=[{type:'GROW_SELF_IF_ENTRY_CARD_NAME',nameSubstring:'羽化',amount:500,stats:['HP','AP']}]; }
    if (number === 46) { def.enhancementEffects=[{type:'STAT_MODIFIER',stat:'HP',amount:100},{type:'STAT_MODIFIER',stat:'AP',amount:100},{type:'PROHIBIT_OPPONENT_SPELL_ENTRY_ATTACK_THIS_TURN'}]; }
    if (number === 47) { def.enhancementEffects=[{type:'STAT_MODIFIER',stat:'HP',amount:300},{type:'STAT_MODIFIER',stat:'AP',amount:300},{type:'SUPPRESS_HOST_KEYWORD_SKILLS'},{type:'OPTIONAL_ATTACH_FROM_TERRITORY'}]; }
    if (number === 6) { def.passiveAbilities[0].timing='ON_DESTROYED';def.passiveAbilities[0].condition={type:'HAD_ATTACHMENT_WHEN_DESTROYED'};def.passiveAbilities[0].effects=[{type:'MOVE_CARD',target:'SOURCE',from:'DISCARD',to:'HAND'}]; }
    if (number === 13) { def.passiveAbilities[0].timing='ON_DESTROYED';def.passiveAbilities[0].condition={type:'DESTROYED_BY_ATTACK'};def.passiveAbilities[0].resolutionPhase='AFTER_ATTACHMENT_TRIGGERS';def.passiveAbilities[0].effects=[{type:'OPTIONAL_RETURN_DESTROYED_HOST_ATTACHMENT'}]; }
    if (number === 16) { def.passiveAbilities[0].timing='ON_ENTER_FIELD';def.passiveAbilities[0].optional=true;def.passiveAbilities[0].effects=[{type:'ATTACH_FROM_OWN_ZONE_ON_ENTRY',from:'DISCARD',maxPrintedCost:3,entryMethod:'NORMAL_SUMMON'}]; }
    if (number === 63) { def.cardEffects=[{type:'DESTROY_OWN_ATTACHMENT_TO_MOVE_SELF',to:'FOOD',suppressFoodCostThisTurn:true}]; }
    if (number === 64) { def.cardEffects=[{type:'DESTROY_ATTACHMENT_TO_RESET_ATTACK_HOST',requiresTarget:true,target:'ANY_ATTACKED_ATTACHED_FIELD_INSECT'}]; }
    if (number === 18) { def.skills[0].effects=[{type:'OPTIONAL_FLIP_FOOD_ON_TERRITORY',cardType:'INSECT',maxSelections:1,followUpIfColor:'BLUE',followUpColor:'BLUE'}];def.skills[1].requirements=[{type:'OWN_FIELD_TAG_COUNT',tag:'セミ科',minimum:2}]; }
    def.implementationStatus = playableNumbers.indexOf(number)!==-1 ? root.CardStatus.PLAYABLE : root.CardStatus.PARTIAL;
    def.implementationNotes = playableNumbers.indexOf(number)!==-1 ? 'SET5 card-level basic playability: printed data, Engine legality, CPU and Human paths recorded in scripts/set5-battle-evidence.js. Final cross-set audit pending.' : 'SET5 definition wired; Human/CPU and card-specific completion audit pending.';
    if(number===7)def.implementationNotes='PARTIAL: serialized destruction watcher is wired. NEEDS_RULING: condition timing with SET3-15 threshold-dependent destruction effect; see scripts/set5-ruling-questions.json. No PLAYABLE certification.';
    return def;
  }
  function register(registry) {
    records.filter(function (record) {
      return record.set === 'BOOSTER_SET_5' && wiredNumbers.indexOf(Number(record.officialNumber.split('/')[0])) !== -1;
    }).forEach(function (record) {
      if (!registry.has(record.id)) { registry.register(definitionFromRecord(record)); }
    });
  }
  return { playableNumbers: playableNumbers.slice(), wiredNumbers: wiredNumbers.slice(), definitionFromRecord: definitionFromRecord, register: register };
}));
