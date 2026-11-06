(function(root,factory){'use strict';var records=typeof module==='object'&&module.exports?require('./full-catalog-data'):root.MushijingiFullCatalogData,api=factory(root,records);if(typeof module==='object'&&module.exports)module.exports=api;root.MushijingiExpansionPredicateCards=api;if(root.cardRegistry)api.register(root.cardRegistry);}(typeof globalThis!=='undefined'?globalThis:this,function(root,records){'use strict';
var specs={
set7_011:{text:'次の相手のターン、この虫が１度目に受けた虫の攻撃によるダメージを０にする。',requirements:[],effects:[{type:'GRANT_DAMAGE_SHIELD',sourceType:'ATTACK',startTurnOffset:1,endTurnOffset:1}]},
set7_012:{text:'次の相手のターン、この虫が１度目に受けた術カードによるダメージを０にする。',requirements:[],effects:[{type:'GRANT_DAMAGE_SHIELD',sourceType:'SPELL',startTurnOffset:1,endTurnOffset:1}]},
set8_030:{text:'この技は無色の虫にしか使用できない。この技を受けた虫の体力が減っていたなら、それを破壊する。※このとき相手は縄張りを引く。',requirements:[{type:'TARGET_COLOR',color:'COLORLESS'}],insectOnly:true,effects:[{type:'DESTROY_WOUNDED_TARGET_BEFORE_DAMAGE'}]},
set7_022:{text:'この技は相手の場に虫が2つ以上いないと使用できない。',requirements:[{type:'OPPONENT_VISIBLE_FIELD_COUNT',minimum:2}]},
set8_004:{text:'この技はこれに強化カードがついていないと使用できない。攻撃後、相手の場に虫がいれば、もう1度だけ使用できる。',requirements:[{type:'SOURCE_HAS_ATTACHMENT'}],effects:[{type:'CONTINUOUS_ATTACK',maxCount:2,immediate:true,requiresOpponentFieldInsect:true}]},
set7_031:{firstText:'自分の場の～バチ科の虫の数×100のダメージを与える。',firstDynamicAp:{type:'OWN_FIELD_FAMILY_SUFFIX_COUNT',familySuffix:'バチ科',multiplier:100},text:'この技は相手のコスト1以下の虫にしか使用できない。この技を受けた虫を手札に戻す。',requirements:[{type:'TARGET_PRINTED_COST',maximum:1}],effects:[{type:'MOVE_ATTACK_TARGET_TO_HAND'}],insectOnly:true},
set6_006:{text:'この技は自分の捨て札に虫が5つ以上あるとき使用できる。',requirements:[{type:'OWN_VISIBLE_DISCARD_COUNT',cardType:'INSECT',minimum:5}]},
set6_018:{text:'この技はコスト5以上の虫にしか使用できない。',requirements:[{type:'TARGET_PRINTED_COST',minimum:5}],insectOnly:true},
set6_021:{text:'この技は体力が減っている虫にしか使用できない。',requirements:[{type:'TARGET_DAMAGED'}],insectOnly:true},
set7_015:{text:'この技はコスト１以下の虫にしか使用できない。',requirements:[{type:'TARGET_PRINTED_COST',maximum:1}],insectOnly:true},
set7_017:{text:'この技は1度だけ使用できる。この技は無色の虫にしか使用できない。',requirements:[{type:'TARGET_COLOR',color:'COLORLESS'}],insectOnly:true,once:true},
set7_018:{text:'この技は強化カードがついた虫にしか使用できない。',requirements:[{type:'TARGET_HAS_ATTACHMENT'}],insectOnly:true},
set7_028:{text:'この技は強化カードがついた虫にしか使用できない。',requirements:[{type:'TARGET_HAS_ATTACHMENT'}],insectOnly:true},
set7_042:{text:'この技は体力が減っている虫にしか使用できない。',requirements:[{type:'TARGET_DAMAGED'}],insectOnly:true},
set7_006:{trait:'自分のエサ場の虫の色1種類につき、これのコストを1減らす。',modifier:{type:'PER_DISTINCT_FACE_UP_FOOD_INSECT_COLOR',amount:-1}},
set7_019:{trait:'自分のエサ場の虫の色1種類につき、これのコストを1減らす。',modifier:{type:'PER_DISTINCT_FACE_UP_FOOD_INSECT_COLOR',amount:-1}},
set7_033:{trait:'自分のエサ場の虫の色1種類につき、これのコストを1減らす。',modifier:{type:'PER_DISTINCT_FACE_UP_FOOD_INSECT_COLOR',amount:-1}},
set7_021:{trait:'自分の裏向きのエサ2つにつき、これのコストを1減らす。',modifier:{type:'PER_FACE_DOWN_FOOD',per:2,amount:-1}},
set7_029:{trait:'自分の裏向きのエサ2つにつき、これのコストを1減らす。',modifier:{type:'PER_FACE_DOWN_FOOD',per:2,amount:-1}},
set7_010:{trait:'自分の場にアキアカネがいるなら、これのコストを１減らす。',modifier:{type:'OWN_VISIBLE_FIELD_NAME',name:'アキアカネ',amount:-1}},
set8_014:{trait:'相手の青のエサが3つ以上あるとき、この虫のコストを1減らす。',modifier:{type:'OPPONENT_FACE_UP_FOOD_COLOR_THRESHOLD',color:'BLUE',minimum:3,amount:-1}}
};
var playable=["set7_011","set7_012","set8_030","set7_022","set8_004","set7_031","set6_006","set6_018","set6_021","set7_015","set7_017","set7_018","set7_028","set7_042","set7_006","set7_019","set7_033","set7_021","set7_029","set7_010","set8_014"];function clone(x){return JSON.parse(JSON.stringify(x))}function norm(t){return String(t||'').normalize('NFKC').replace(/\s/g,'')}
function definitionFromRecord(record){var spec=specs[record.id];if(!spec)throw Error('UNMAPPED_PREDICATE');var d=new root.CardDefinition(clone(record));if(d.cardEffects.length||d.enhancementEffects.length||d.skills.length!==(spec.trait?1:2)||d.passiveAbilities.length!==(spec.trait?1:0))throw Error('UNMAPPED_PREDICATE_COMPONENT '+record.id);d.skills.forEach(function(sk,i){if(i===0&&norm(sk.effectText)!==norm(spec.firstText))throw Error('UNMAPPED_BASIC_EFFECT '+record.id);sk.id=record.id+'_skill_'+(i+1);sk.timing='ATTACK';sk.effects=i===1&&spec.effects?clone(spec.effects):[];if(i===0&&spec.firstDynamicAp)sk.dynamicAp=clone(spec.firstDynamicAp);sk.additionalCost=[];});if(spec.trait){if(norm(d.passiveAbilities[0].effectText)!==norm(spec.trait))throw Error('PREDICATE_TEXT_MISMATCH '+record.id);d.costModifiers=[Object.assign(clone(spec.modifier),{requiresKeywordTrait:true})];}else{if(norm(d.skills[1].effectText)!==norm(spec.text))throw Error('PREDICATE_TEXT_MISMATCH '+record.id);d.skills[1].requirements=clone(spec.requirements);if(spec.insectOnly)d.skills[1].targetRule='INSECT_ONLY';if(spec.once)d.skills[1].usageLimit='ONCE_PER_FIELD_STAY';}d.implementationStatus=playable.indexOf(record.id)>=0?root.CardStatus.PLAYABLE:root.CardStatus.PARTIAL;d.implementationNotes='Explicit full-text checked predicate mapping. Individual CPU/Human/WSS tests required; finalAUDITED pending.';return d;}
return {wiredIds:Object.keys(specs),playableIds:playable,definitionFromRecord:definitionFromRecord,register:function(registry){Object.keys(specs).forEach(function(id){registry.register(definitionFromRecord(records.find(function(r){return r.id===id})))})}};
}));
