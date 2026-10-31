'use strict';require('./engine-loader.js');
var h=require('./helpers.js'),Runner=require('./lib.js'),runner=new Runner();
runner.test('SET5 red claw uses controller visible effective red food, including color changes',function(){
  var s=h.newGame({rng:h.firstPlayerRng}),a=h.putInsectOnField(s,'P2','set5_002');a.ownerId='P1';s.player('P2').food=[];
  var red=h.addToFoodRaw(s,'P2',getCardDefinition('set2_001'));
  var hidden=h.addToFoodRaw(s,'P2',getCardDefinition('set2_001'));hidden.faceDown=true;
  var changed=h.addToFoodRaw(s,'P2',getCardDefinition('set2_016'));changed.runtimeFlags={colorOverride:'RED'};
  var skill=getCardDefinition(a.cardId).skills[0];runner.assertEqual(getEffectiveAP(s,a,skill.baseAp,skill),600);
});
[17,19].forEach(function(n){runner.test('SET5 '+n+' discounts each pair of opposing facedown food without reading identity',function(){
  var s=h.newGame({rng:h.firstPlayerRng}),d=getCardDefinition('set5_'+String(n).padStart(3,'0'));s.player('P2').food=[];
  for(var i=0;i<5;i++){var food=h.addToFoodRaw(s,'P2',getCardDefinition('set1_003'));food.faceDown=i<4;}
  runner.assertEqual(getEffectiveCardCost(s,'P1',d),d.cost-2);runner.assertEqual(d.cost,n===17?5:4);
  s.player('P2').food[0].faceDown=false;runner.assertEqual(getEffectiveCardCost(s,'P1',d),d.cost-1);
});});
runner.test('Global keyword suppression removes intrinsic discount traits in hand across SET3–5',function(){
  var s=h.newGame({rng:h.firstPlayerRng});s.player('P1').food=[];s.player('P2').food=[];
  for(var i=0;i<4;i++){h.addToFoodRaw(s,'P1',getCardDefinition('set2_016'));var hidden=h.addToFoodRaw(s,'P2',getCardDefinition('set2_016'));hidden.faceDown=true;}
  var fossil=h.addToHandRaw(s,'P1',getCardDefinition('set4_003'));moveCard(s,fossil.instanceId,'HAND','DISCARD',{playerId:'P1'});
  h.putInsectOnField(s,'P2','set4_043');
  ['set3_002','set4_001','set5_017','set5_019'].forEach(function(id){var def=getCardDefinition(id);runner.assertEqual(getEffectiveCardCost(s,'P1',def),def.cost,id+' trait discount must stop');});
});
module.exports=runner;if(require.main===module){runner.runAll();}
