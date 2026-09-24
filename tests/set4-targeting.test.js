'use strict';require('./engine-loader.js');var h=require('./helpers.js');var TestRunner=require('./lib.js');var runner=new TestRunner();
function playableCopy(sourceId,id){var raw=JSON.parse(JSON.stringify(getCardDefinition(sourceId)));raw.id=id;raw.implementationStatus='test';var d=new CardDefinition(raw);Object.keys(raw).forEach(function(k){d[k]=raw[k];});cardRegistry.register(d);return d;}
runner.test('Spell lure limits opponent field targets to all current lure hosts',function(){
 var s=h.newGame({rng:h.firstPlayerRng}),p=s.player('P1'),opp=s.player('P2');var spellDef=playableCopy('set2_055','test_set4_target_spell'),spell=h.addToHandRaw(s,'P1',spellDef);
 spellDef.cardEffects=[{type:'DEAL_DAMAGE_TO_TARGET',target:'OPPONENT_FIELD_INSECT',requiresTarget:true,amount:100}];
 var lure=h.putInsectOnField(s,'P2','set4_026',{hp:1000}),other=h.putInsectOnField(s,'P2','set1_003',{hp:1000});
 var candidates=getSpellTargetCandidates(s,'P1',spell.instanceId);runner.assertEqual(candidates.length,1);runner.assertEqual(candidates[0].instanceId,lure.instanceId);runner.assert(other.zone===ZONES.FIELD);
});
runner.test('Territory attachment suite exposes attach trigger and printed stat modifier',function(){
 var d=getCardDefinition('set4_046');runner.assert(d.enhancementEffects.some(function(e){return e.type==='OPTIONAL_ATTACH_FROM_TERRITORY';}));runner.assert(d.enhancementEffects.some(function(e){return e.stat==='AP'&&e.amount===400;}));
});
module.exports=runner;if(require.main===module)runner.runAll();
