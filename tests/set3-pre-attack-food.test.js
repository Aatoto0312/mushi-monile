'use strict';
require('./engine-loader.js');
var TestRunner=require('./lib.js'); var h=require('./helpers.js'); var runner=new TestRunner();

function setup(){var state=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(state);var a=h.putInsectOnField(state,'P1','set3_006');var d=h.putInsectOnField(state,'P2','set1_003',{hp:5000});var f=h.addToFoodRaw(state,'P2',global.getCardDefinition('kabutomushi'));return {state:state,a:a,d:d,f:f,skill:global.getCardDefinition(a.cardId).skills[1]};}

runner.test('SET3 weak poison needle offers optional food concealment before damage',function(){
  var x=setup(); var before=x.d.currentHp;
  var result=global.performAttack(x.state,x.a.instanceId,x.d.instanceId,'INSECT',x.skill.id);
  runner.assert(result.pending); runner.assertEqual(x.d.currentHp,before); runner.assertEqual(x.state.pendingEffect.selectionPurpose,'PRE_ATTACK_FLIP_OPPONENT_FOOD');
  global.resolveCardSelection(x.state,'P1',[x.f.instanceId],true);
  runner.assert(x.f.faceDown); runner.assert(x.d.currentHp<before); runner.assert(x.a.attackedThisTurn); runner.assertEqual(x.state.pendingEffect,null);
});

runner.test('SET3 weak poison needle can decline and is once per field stay',function(){
  var x=setup(); global.performAttack(x.state,x.a.instanceId,x.d.instanceId,'INSECT',x.skill.id);
  global.resolveCardSelection(x.state,'P1',[],true);
  runner.assert(!x.f.faceDown); runner.assert((x.a.usedSkills||[]).indexOf(x.skill.id)!==-1);
  x.a.attackedThisTurn=false;
  runner.assertEqual(global.getLegalAttackTargets(x.state,x.a.instanceId,x.skill.id).length,0);
});

module.exports=runner;if(require.main===module){runner.runAll();}
