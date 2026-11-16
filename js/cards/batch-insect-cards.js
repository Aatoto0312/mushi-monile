(function(root){'use strict';
var records=typeof module==='object'&&module.exports?require('./full-catalog-data'):root.MushijingiFullCatalogData;
var ids=['set7_004','set8_003','set6_001','set8_013'];
var printedTexts={set7_004:'この技を受けた虫は、次にダメージを受けたとき破壊される。',set8_003:'これを場に出すとき、コストを支払う代わりに自分の場の強化カードがついた虫を1つ選び、破壊してもよい。',set8_013:'この虫は自分の場にいるコスト2以下の～アリ科が持つ、＜＞の技でない技を使用できる。',set6_001:'この技は1度だけ使用できる。攻撃後、手札から強化カードか術カードを1つ選び、これに使用してもよい。'};
function definitionFromRecord(record){
 if(ids.indexOf(record.id)<0||record.cardEffects.length||record.enhancementEffects.length)throw Error('UNMAPPED_BATCH_INSECT '+record.id);
 var effectText=record.id==='set7_004'||record.id==='set6_001'?record.skills[1].effectText:record.passiveAbilities[0].effectText;
 if(effectText!==printedTexts[record.id])throw Error('CHANGED_BATCH_INSECT_TEXT '+record.id);
 var d=new root.CardDefinition(JSON.parse(JSON.stringify(record)));
 d.skills.forEach(function(skill,i){skill.id=d.id+'_skill_'+(i+1);skill.timing='ATTACK';skill.effects=[];skill.additionalCost=[];});
 if(d.id==='set7_004')d.skills[1].effects=[{type:'MARK_ATTACK_TARGET_DESTROY_ON_NEXT_DAMAGE'}];
 if(d.id==='set8_003')d.summonAlternatives=[{type:'SACRIFICE_OWN_FIELD',count:1,requiresAttachment:true}];
 if(d.id==='set8_013')d.passiveAbilities[0].effects=[{type:'BORROW_ALLY_ATTACK_SKILLS',familySuffix:'アリ科',maxPrintedCost:2}];
 if(d.id==='set6_001'){d.skills[1].usageLimit='ONCE_PER_FIELD_STAY';d.skills[1].effects=[{type:'FREE_CARD_USE_AFTER_ATTACK',from:'HAND',cardTypes:['SPELL','ENHANCEMENT']}];}
 d.implementationStatus=root.CardStatus.PLAYABLE;
 d.implementationNotes=['Printed text mapped to generic Engine effects; focused batch-insects tests verify combat, payment, borrowing and serialized postattack choices.'];
 return d;
}
var api={wiredIds:ids,playableIds:ids.slice(),definitionFromRecord:definitionFromRecord,register:function(registry){ids.forEach(function(id){registry.register(definitionFromRecord(records.find(function(r){return r.id===id;})));});}};
root.MushijingiBatchInsectCards=api;if(root.cardRegistry)api.register(root.cardRegistry);if(typeof module==='object'&&module.exports)module.exports=api;
})(globalThis);
