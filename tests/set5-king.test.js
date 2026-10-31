'use strict';require('./engine-loader.js');var h=require('./helpers.js'),Runner=require('./lib.js'),runner=new Runner();
runner.test('SET5 King cannot attack entry turn but suppression immediately removes restriction',function(){
  var s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);var a=h.putInsectOnField(s,'P1','set5_015');a.enteredFieldTurn=s.turnNumber;
  var skill=getCardDefinition(a.cardId).skills[0];runner.assertEqual(getLegalAttackTargets(s,a.instanceId,skill.id).length,0);
  var silencer=h.putInsectOnField(s,'P2','set4_043');runner.assert(getLegalAttackTargets(s,a.instanceId,skill.id).length>0);
  s.player('P2').field.splice(s.player('P2').field.indexOf(silencer),1);runner.assertEqual(getLegalAttackTargets(s,a.instanceId,skill.id).length,0);
  s.turnNumber++;runner.assert(getLegalAttackTargets(s,a.instanceId,skill.id).length>0);
});
runner.test('Entry trigger suppression does not suppress the King continuous attack restriction',function(){
  var s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);var a=h.putInsectOnField(s,'P1','set5_015');a.enteredFieldTurn=s.turnNumber;
  h.putInsectOnField(s,'P1','set4_005');var skill=getCardDefinition(a.cardId).skills[0];runner.assertEqual(getLegalAttackTargets(s,a.instanceId,skill.id).length,0);
});
module.exports=runner;if(require.main===module){runner.runAll();}
