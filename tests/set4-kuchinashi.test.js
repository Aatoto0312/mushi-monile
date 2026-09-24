'use strict';require('./engine-loader.js');var h=require('./helpers.js');var TestRunner=require('./lib.js');var runner=new TestRunner();
runner.test('Kuchinashi removes insect keyword traits globally while preserving completed delayed state',function(){
 var s=h.newGame({rng:h.firstPlayerRng}),tax=h.putInsectOnField(s,'P2','set4_015',{hp:1500}),army=h.putInsectOnField(s,'P1','set4_006',{hp:1000}),ally=h.putInsectOnField(s,'P1','set4_008',{hp:1000}),twoSkill=getCardDefinition('set4_002');
 runner.assertEqual(getEffectiveCardCost(s,'P1',twoSkill),twoSkill.cost+1);runner.assert(getEffectiveAttackSkills(s,army).some(function(skill){return skill.name==='毒針';}));
 var kabau=h.putInsectOnField(s,'P2','set4_004',{hp:1500});kabau.runtimeFlags={returnToOwnerHandAtEndTurn:s.turnNumber,forceAttackTargetUntilTurn:s.turnNumber};
 h.putInsectOnField(s,'P1','set4_043',{hp:500});runner.assertEqual(getEffectiveCardCost(s,'P1',twoSkill),twoSkill.cost);runner.assert(!getEffectiveAttackSkills(s,army).some(function(skill){return skill.name==='毒針';}));
 runner.assertEqual(kabau.runtimeFlags.returnToOwnerHandAtEndTurn,s.turnNumber);runner.assert(tax.zone===ZONES.FIELD&&ally.zone===ZONES.FIELD);
});
module.exports=runner;if(require.main===module)runner.runAll();
