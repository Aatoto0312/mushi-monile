'use strict';
require('./engine-loader.js');
var TestRunner=require('./lib.js'); var h=require('./helpers.js'); var runner=new TestRunner();

runner.test('SET3 attachment-only skill filters targets without affecting its normal skill', function(){
  var state=h.newGame({rng:h.firstPlayerRng}); h.toMainPhase(state);
  var attacker=h.putInsectOnField(state,'P1','set3_001');
  var plain=h.putInsectOnField(state,'P2','set1_003');
  var enhanced=h.putInsectOnField(state,'P2','set1_004');
  enhanced.attachments=[new global.CardInstance({instanceId:state.nextInstanceId(),cardId:'minomushi_no_kakuremino',ownerId:'P2',zone:'FIELD'})];
  var skill=global.getCardDefinition(attacker.cardId).skills[1];
  var ids=global.getLegalAttackTargets(state,attacker.instanceId,skill.id).map(function(t){return t.instance&&t.instance.instanceId;});
  runner.assert(ids.indexOf(enhanced.instanceId)!==-1); runner.assert(ids.indexOf(plain.instanceId)===-1);
  runner.assertEqual(global.getLegalAttackTargets(state,attacker.instanceId,global.getCardDefinition(attacker.cardId).skills[0].id).length,2);
});

runner.test('SET3 partner and green-food skill requirements are enforced for Human and CPU legality', function(){
  var state=h.newGame({rng:h.firstPlayerRng}); h.toMainPhase(state);
  var horse=h.putInsectOnField(state,'P1','set3_008'); var target=h.putInsectOnField(state,'P2','set1_003');
  var combo=global.getCardDefinition(horse.cardId).skills[1];
  runner.assertEqual(global.getLegalAttackTargets(state,horse.instanceId,combo.id).length,0);
  h.putInsectOnField(state,'P1','set3_009');
  runner.assert(global.getLegalAttackTargets(state,horse.instanceId,combo.id).some(function(t){return t.instance===target;}));
  var green=h.putInsectOnField(state,'P1','set3_032');
  runner.assertEqual(global.getLegalAttackTargets(state,green.instanceId).length,0);
  for(var i=0;i<3;i++) h.addToFoodRaw(state,'P1',global.getCardDefinition('tonosamabatta'));
  runner.assert(global.getLegalAttackTargets(state,green.instanceId).length>0);
});

runner.test('SET3 field-color dynamic attack counts visible green insects',function(){
  var state=h.newGame({rng:h.firstPlayerRng}); h.toMainPhase(state);
  var attacker=h.putInsectOnField(state,'P1','set3_040');
  h.putInsectOnField(state,'P1','tonosamabatta'); var hidden=h.putInsectOnField(state,'P1','set1_003'); hidden.faceDown=true;
  var skill=global.getCardDefinition(attacker.cardId).skills[0];
  runner.assertEqual(global.getEffectiveAP(state,attacker,skill.baseAp,skill),600);
});

module.exports=runner; if(require.main===module){runner.runAll();}
