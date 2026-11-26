(function (root) {
  'use strict';
  var catalog = typeof module === 'object' && module.exports
    ? require('./full-catalog-data.js') : root.MushijingiFullCatalogData;
  var emperor = {type: 'FOOD_TRAIT_AURA', traitName: '王様', costDelta: -1};
  var traits = {
    set5_042: {type:'SUMMON_FAMILY_FROM_DESTRUCTION_DRAW',suffixes:['バッタ科','イナゴ科']},
    set6_027: {type:'SUMMON_FAMILY_FROM_DESTRUCTION_DRAW',families:['セミ科']},
    set8_026: {type:'SUMMON_FAMILY_FROM_DESTRUCTION_DRAW',families:['セミ科']},
    set6_005:{type:'OPPONENT_DRAW_TO_DESTROY_SOURCE',count:2},
    set8_027:{type:'OPTIONAL_DRAWN_TERRITORY_EFFECT',action:'REVEAL_AND_DRAW',attackOnly:true},
    set6_046:{type:'OPTIONAL_DRAWN_TERRITORY_EFFECT',action:'DISCARD_FOR_OPTIONAL_DRAWS'},
    set8_017: emperor,
    set8_039: emperor,
    set6_044: {type: 'PREVENT_MATCHING_DISCARD_SPELL_DAMAGE'}
  };
  Object.keys(traits).forEach(function (id) {
    var record = catalog.find(function (row) { return row.id === id; });
    var def = new root.CardDefinition(JSON.parse(JSON.stringify(record)));
    if (def.type !== 'INSECT' || def.skills.length !== 1 || def.skills[0].effectText ||
        def.passiveAbilities.length !== 1 || def.cardEffects.length || def.enhancementEffects.length) {
      throw new Error('UNMAPPED_ZONE_TRAIT ' + id);
    }
    Object.assign(def.skills[0], {id: id + '_skill_1', timing: 'ATTACK', effects: [], additionalCost: []});
    def.passiveAbilities[0].effects = [Object.assign({}, traits[id])];
    if(id==='set6_005'){def.passiveAbilities[0].timing='ON_ENTER_FIELD';def.passiveAbilities[0].optional=false;}
    if(id==='set8_026'){
      def.rulingStatus='PROVISIONAL';
      def.implementationNotes='暫定裁定：収録データの「ゼミ科」は同名技を持つ第6弾の個別Q&Aに準じセミ科の完全一致として扱う。ツノゼミ科は含まない。';
    }
    if (id === 'set6_044') {
      // Replace the malformed catalog transcription with an original rules summary.
      def.passiveAbilities[0].effectText = 'どちらかの捨て札に同名の術があれば、その術によるダメージは0。';
    }
    def.implementationStatus = root.CardStatus.PLAYABLE;
    root.cardRegistry.register(def);
  });

  var longhorn = new root.CardDefinition(JSON.parse(JSON.stringify(catalog.find(function (row) {
    return row.id === 'set7_032';
  }))));
  longhorn.skills.forEach(function (skill, i) {
    Object.assign(skill, {id: longhorn.id + '_skill_' + (i + 1), timing: 'ATTACK', effects: [], additionalCost: []});
  });
  longhorn.skills[1].effects.push({
    type: 'ATTACK_MULTIPLE_TARGETS', exactSelections: 2, ordered: true,
    sameColor: true, sameNameBonus: 500
  });
  longhorn.implementationStatus = root.CardStatus.PLAYABLE;
  root.cardRegistry.register(longhorn);
}(globalThis));
