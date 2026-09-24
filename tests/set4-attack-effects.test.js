'use strict';require('./engine-loader.js');var h=require('./helpers.js');var TestRunner=require('./lib.js');var runner=new TestRunner();
function copy(source,id){var raw=JSON.parse(JSON.stringify(getCardDefinition(source)));raw.id=id;raw.implementationStatus='test';var d=new CardDefinition(raw);Object.keys(raw).forEach(function(k){d[k]=raw[k];});cardRegistry.register(d);return d;}
runner.test('Army ant poison changes the surviving attacked insect to green until turn end',function(){
 var s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);var d=copy('set4_008','test_set4_008'),a=h.putInsectOnField(s,'P1',d.id,{hp:1000}),target=h.putInsectOnField(s,'P2','set2_016',{hp:5000});
 performAttack(s,a.instanceId,target.instanceId,'INSECT',d.skills[0].id);runner.assertEqual(getEffectiveColor(target),'GREEN');endTurn(s);runner.assertEqual(target.runtimeFlags.colorOverride,undefined);
});
runner.test('Fan attack taxes opponent spell cost only during their next turn',function(){
 var s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);var d=copy('set4_017','test_set4_017'),a=h.putInsectOnField(s,'P1',d.id,{hp:1000}),target=h.putInsectOnField(s,'P2','set2_001',{hp:5000}),spell=getCardDefinition('set2_055'),printed=spell.cost;
 performAttack(s,a.instanceId,target.instanceId,'INSECT',d.skills[1].id);runner.assertEqual(getEffectiveCardCost(s,'P2',spell),printed);endTurn(s);runner.assertEqual(getEffectiveCardCost(s,'P2',spell),printed+1);
});
module.exports=runner;if(require.main===module)runner.runAll();
