(function(root,factory){
  'use strict';
  var records=typeof module==='object'&&module.exports?require('./full-catalog-data.js'):root.MushijingiFullCatalogData;
  var api=factory(root,records);
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.MushijingiExpansionCountCards=api;
  if(root.cardRegistry)api.register(root.cardRegistry);
}(typeof globalThis!=='undefined'?globalThis:this,function(root,records){
  'use strict';
  var rules={
    set6_015:{attackText:'自分の捨て札にある赤の虫の数×100のダメージを与える。',filter:{cardType:'INSECT',color:'RED'},multiplier:100},
    set6_032:{traitText:'自分の捨て札にある強化カード1つにつき、この虫のコストを1減らす。',filter:{cardType:'ENHANCEMENT'},discount:true},
    set6_038:{traitText:'自分の捨て札にある強化カード1つにつき、この虫のコストを1減らす。',filter:{cardType:'ENHANCEMENT'},discount:true},
    set7_005:{traitText:'自分の捨て札にある＜生きた化石＞を持つ虫1つにつき、これのコストを1減らす。',filter:{cardType:'INSECT',traitName:'生きた化石'},discount:true},
    set7_024:{attackText:'自分の捨て札にある毒と書かれた技を持つ虫の数×300のダメージを与える。',filter:{cardType:'INSECT',skillNameIncludes:'毒'},multiplier:300},
    set7_025:{attackText:'自分の捨て札にある毒と書かれた技を持つ虫の数×200のダメージを与える。',filter:{cardType:'INSECT',skillNameIncludes:'毒'},multiplier:200}
  };
  var playable=['set6_015','set6_032','set6_038','set7_005','set7_024','set7_025'];
  function clone(value){return JSON.parse(JSON.stringify(value));}
  function normalize(value){return String(value||'').normalize('NFKC').replace(/\s/g,'');}
  function definitionFromRecord(record){
    var rule=rules[record.id];if(!rule)throw Error('UNMAPPED_COUNT_CARD '+record.id);
    var def=new root.CardDefinition(clone(record));
    if(def.skills.length!==1||def.cardEffects.length||def.enhancementEffects.length||def.passiveAbilities.length!==(rule.discount?1:0))throw Error('UNMAPPED_COUNT_COMPONENT '+record.id);
    if(normalize(def.skills[0].effectText)!==normalize(rule.attackText)||normalize(def.passiveAbilities[0]&&def.passiveAbilities[0].effectText)!==normalize(rule.traitText))throw Error('COUNT_TEXT_MISMATCH '+record.id);
    def.skills[0].id=record.id+'_skill_1';def.skills[0].timing='ATTACK';def.skills[0].effects=[];def.skills[0].additionalCost=[];
    if(rule.discount)def.costModifiers=[{type:'PER_FILTERED_DISCARD',filter:clone(rule.filter),amount:-1,requiresKeywordTrait:true}];
    else def.skills[0].dynamicAp={type:'FILTERED_DISCARD_COUNT',filter:clone(rule.filter),multiplier:rule.multiplier};
    def.implementationStatus=playable.indexOf(record.id)!==-1?root.CardStatus.PLAYABLE:root.CardStatus.PARTIAL;
    def.implementationNotes='Shared visible-discard predicate. Per-card Engine, CPU, Human and WSS evidence required; final audit pending.';
    return def;
  }
  function register(registry){Object.keys(rules).forEach(function(id){var record=records.find(function(c){return c.id===id;});if(!record)throw Error('MISSING_COUNT_CARD '+id);registry.register(definitionFromRecord(record));});}
  return {register:register,definitionFromRecord:definitionFromRecord,wiredIds:Object.keys(rules),playableIds:playable.slice()};
}));
