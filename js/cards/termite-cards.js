(function(root,factory){'use strict';
  var records=typeof module==='object'&&module.exports?require('./full-catalog-data'):root.MushijingiFullCatalogData;
  var api=factory(root,records);
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.MushijingiTermiteCards=api;
  if(root.cardRegistry)api.register(root.cardRegistry);
})(globalThis,function(root,records){'use strict';
  var ids=['set8_042','set8_043','set8_044'];
  var decomposition='攻撃後、自分の捨て札の表向きのカードを最大2つ選び、裏向きにしてもよい。※裏向きの捨て札は、ないものとして扱う。';
  var colony='自分の捨て札の裏向きのカード1つにつき、この虫の体力と攻撃力を200増やす。';
  function definitionFromRecord(record){
    if(!record||ids.indexOf(record.id)===-1||record.type!=='INSECT'||record.skills.length!==1||
       record.passiveAbilities.length!==1||record.skills[0].name!=='分解'||record.skills[0].effectText!==decomposition||
       record.passiveAbilities[0].name!=='コロニー'||record.passiveAbilities[0].effectText!==colony||
       record.cardEffects.length||record.enhancementEffects.length)throw Error('TERMITE_CARD_TEXT_MISMATCH');
    var d=new root.CardDefinition(JSON.parse(JSON.stringify(record)));
    d.skills[0].id=record.id+'_skill_1';
    d.skills[0].timing='ATTACK';
    d.skills[0].additionalCost=[];
    d.skills[0].effects=[{type:'SELECT_AFTER_ATTACK',selection:{
      type:'SELECT_ON_ENTRY',from:'DISCARD',controller:'SELF',faceDown:false,
      maxSelections:2,operation:'SET_FACE',targetFaceDown:true
    }}];
    d.passiveAbilities[0].id=record.id+'_trait_1';
    d.passiveAbilities[0].timing='CONTINUOUS';
    d.passiveAbilities[0].effects=[];
    d.continuousStatModifiers=[{type:'OWN_FACE_DOWN_DISCARD_COUNT',stats:['HP','AP'],multiplier:200}];
    d.implementationStatus=root.CardStatus.PLAYABLE;
    return d;
  }
  return {wiredIds:ids.slice(),playableIds:ids.slice(),definitionFromRecord:definitionFromRecord,
    register:function(registry){ids.forEach(function(id){
      var record=records.find(function(card){return card.id===id;});
      registry.register(definitionFromRecord(record));
    });}};
});
