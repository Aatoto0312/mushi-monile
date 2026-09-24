'use strict';
require('./engine-loader.js');
var h=require('./helpers.js'), TestRunner=require('./lib.js'), runner=new TestRunner();
require('../js/engine/cpu-agent.js');
function fixture(){
 var s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);s.turnNumber=3;
 s.player('P2').territory=[];
 var a=h.putInsectOnField(s,'P1','set1_068');
 var targets=[h.putInsectOnField(s,'P2','set1_003',{hp:100}),h.putInsectOnField(s,'P2','set1_003',{hp:100})];
 var territories=[h.addToTerritoryRaw(s,'P2',global.getCardDefinition('set1_003')),h.addToTerritoryRaw(s,'P2',global.getCardDefinition('set1_003'))];
 return {s:s,a:a,targets:targets,territories:territories,skill:global.getCardDefinition('set1_068').skills[1]};
}
runner.test('Ordered multi attack waits for each territory selection and resumes exactly once',function(){
 var f=fixture();
 global.performMultiTargetAttack(f.s,f.a.instanceId,f.targets.map(function(c){return c.instanceId;}),f.skill.id);
 runner.assertEqual(f.targets[0].zone,'DISCARD');
 runner.assertEqual(f.targets[1].zone,'FIELD','second hit waits for first territory resolution');
 runner.assertEqual(f.s.pendingEffect.type,'TERRITORY_DRAW_SELECTION');
 runner.assert(f.s.pendingEffect.afterResolution,'pending owns serializable continuation');
 JSON.stringify(f.s.pendingEffect.afterResolution);
 global.resolveTerritoryDrawSelection(f.s,'P2',f.territories[0].instanceId);
 runner.assertEqual(f.targets[1].zone,'DISCARD');
 runner.assertEqual(f.s.pendingEffect.type,'TERRITORY_DRAW_SELECTION');
 global.resolveTerritoryDrawSelection(f.s,'P2',f.territories[1].instanceId);
 runner.assertEqual(f.s.pendingEffect,null);
 runner.assertEqual(f.territories.filter(function(c){return c.zone==='HAND';}).length,2);
 global.endTurn(f.s);runner.assertEqual(f.s.activePlayerId,'P2');
});
runner.test('Multi-target skill cannot bypass target count through single-attack API',function(){
 var f=fixture(),failed=false;
 try{global.performAttack(f.s,f.a.instanceId,f.targets[0].instanceId,'INSECT',f.skill.id);}catch(e){failed=true;}
 runner.assert(failed,'single-target entry must reject this skill');
 runner.assertEqual(f.targets[0].currentHp,100);
});
runner.test('CPU executes multi-target selection and both territory continuations without stalling',function(){
 var f=fixture(),cpu=new global.CpuAgent('P1'),defender=new global.CpuAgent('P2');
 runner.assert(cpu.executeAction(f.s,{type:'ATTACK',attackerInstanceId:f.a.instanceId,targetInstanceId:f.targets[0].instanceId,targetType:'INSECT',skillId:f.skill.id}));
 runner.assertEqual(f.s.pendingEffect.selectionPurpose,'ATTACK_MULTI');
 runner.assert(cpu.executeAction(f.s,cpu.getPendingAction(f.s)));
 for(var i=0;i<4&&f.s.pendingEffect;i++){runner.assert(defender.executeAction(f.s,defender.getPendingAction(f.s)));}
 runner.assertEqual(f.s.pendingEffect,null);
 runner.assert(f.targets.every(function(c){return c.zone==='DISCARD';}));
});
runner.test('Multi attack continuation survives optional jump-out choice',function(){
 var f=fixture();f.territories[0].cardId='set1_009';
 global.performMultiTargetAttack(f.s,f.a.instanceId,f.targets.map(function(c){return c.instanceId;}),f.skill.id);
 global.resolveTerritoryDrawSelection(f.s,'P2',f.territories[0].instanceId);
 runner.assertEqual(f.s.pendingEffect.type,'TERRITORY_DRAW_CHOICE');
 runner.assertEqual(f.targets[1].zone,'FIELD');
 global.resolvePendingTerritoryChoice(f.s,'USE_TOBIDASU');
 runner.assertEqual(f.targets[1].zone,'DISCARD');
 global.resolveTerritoryDrawSelection(f.s,'P2',f.territories[1].instanceId);
 runner.assertEqual(f.s.pendingEffect,null);
});
runner.test('Returning attack source to hand cancels remaining hits',function(){
 var f=fixture();f.targets[0].cardId='set1_092';
 global.performMultiTargetAttack(f.s,f.a.instanceId,f.targets.map(function(c){return c.instanceId;}),f.skill.id);
 runner.assertEqual(f.a.zone,'HAND');
 global.resolveTerritoryDrawSelection(f.s,'P2',f.territories[0].instanceId);
 runner.assertEqual(f.targets[1].zone,'FIELD');
 runner.assertEqual(f.targets[1].currentHp,100);
 runner.assertEqual(f.s.pendingEffect,null);
});
module.exports=runner;if(require.main===module)runner.runAll();
