'use strict';require('./engine-loader.js');var h=require('./helpers.js');var TestRunner=require('./lib.js');var runner=new TestRunner();
function testDefinition(sourceId,testId){var old=getCardDefinition(testId);if(old)return old;var raw=JSON.parse(JSON.stringify(getCardDefinition(sourceId)));raw.id=testId;raw.implementationStatus='test';var d=new CardDefinition(raw);Object.keys(raw).forEach(function(k){d[k]=raw[k];});cardRegistry.register(d);return d;}
runner.test('Berserk entry destroys selected visible food without reducing generated cost',function(){
  var s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);var def=testDefinition('set4_016','test_set4_016'),p=s.player('P1');p.availableCost=20;
  var food=h.addToFoodRaw(s,'P1',getCardDefinition('set2_001'));var insect=h.addToHandRaw(s,'P1',def);summonInsect(s,'P1',insect.instanceId);
  runner.assertEqual(s.pendingEffect.selectionPurpose,'ENTRY_FOOD_DESTRUCTION');var generated=p.availableCost;resolveCardSelection(s,'P1',[food.instanceId]);
  runner.assertEqual(food.zone,ZONES.DISCARD);runner.assertEqual(p.availableCost,generated);runner.assertEqual(insect.zone,ZONES.FIELD);
});
runner.test('Berserk entry destroys itself when no visible food can be selected',function(){
  var s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);var def=testDefinition('set4_016','test_set4_016_empty'),p=s.player('P1');p.availableCost=20;
  var hidden=h.addToFoodRaw(s,'P1',getCardDefinition('set2_001'));hidden.faceDown=true;var insect=h.addToHandRaw(s,'P1',def);summonInsect(s,'P1',insect.instanceId);
  runner.assertEqual(insect.zone,ZONES.DISCARD);runner.assertEqual(s.pendingEffect,null);
});
runner.test('Danger sense suppresses later entry traits but not an already resolved entry',function(){
  var s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);var p=s.player('P1');p.availableCost=30;
  var colorDef=testDefinition('set2_001','test_set4_entry_color');colorDef.passiveAbilities=[{id:'entry',name:'登場時',timing:'ON_ENTER_FIELD',optional:true,effects:[{type:'CHOOSE_SELF_COLOR',colors:['BLUE','GREEN']}]}];
  var first=h.addToHandRaw(s,'P1',colorDef);summonInsect(s,'P1',first.instanceId);runner.assertEqual(s.pendingEffect.type,'CHOICE_SELECTION');resolveChoiceSelection(s,'P1','DECLINE');
  var suppressor=h.addToHandRaw(s,'P1',testDefinition('set4_005','test_set4_005'));summonInsect(s,'P1',suppressor.instanceId);
  var later=h.addToHandRaw(s,'P1',colorDef);summonInsect(s,'P1',later.instanceId);runner.assertEqual(s.pendingEffect,null);
});
module.exports=runner;if(require.main===module)runner.runAll();
