'use strict';require('./engine-loader.js');var h=require('./helpers.js'),Runner=require('./lib.js'),runner=new Runner();
runner.test('SET5 partner continuous AP follows controller, visible ally and trait suppression',function(){
  var s=h.newGame({rng:h.firstPlayerRng}),source=h.putInsectOnField(s,'P2','set5_022');source.ownerId='P1';
  var skill=getCardDefinition(source.cardId).skills[0];runner.assertEqual(getEffectiveAP(s,source,skill.baseAp,skill),300);
  var ally=h.putInsectOnField(s,'P2','set5_023');runner.assertEqual(getEffectiveAP(s,source,skill.baseAp,skill),900);
  ally.faceDown=true;runner.assertEqual(getEffectiveAP(s,source,skill.baseAp,skill),300);
  ally.faceDown=false;h.putInsectOnField(s,'P1','set4_043');runner.assertEqual(getEffectiveAP(s,source,skill.baseAp,skill),300);
});
runner.test('SET5 reciprocal partner bonus is not granted by enemy partner',function(){
  var s=h.newGame({rng:h.firstPlayerRng}),source=h.putInsectOnField(s,'P1','set5_023');h.putInsectOnField(s,'P2','set5_022');
  var skill=getCardDefinition(source.cardId).skills[0];runner.assertEqual(getEffectiveAP(s,source,skill.baseAp,skill),300);
  h.putInsectOnField(s,'P1','set5_022');runner.assertEqual(getEffectiveAP(s,source,skill.baseAp,skill),900);
});
module.exports=runner;if(require.main===module){runner.runAll();}
