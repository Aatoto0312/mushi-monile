'use strict';
require('./engine-loader.js');require('../js/engine/cpu-agent.js');
var h=require('./helpers.js'),Runner=require('./lib.js'),runner=new Runner();
var raw=JSON.parse(JSON.stringify(global.getCardDefinition('set2_002')));raw.id='test_attack_color';raw.set=null;raw.implementationStatus='test';
var def=new global.CardDefinition(raw);global.cardRegistry.register(def);
function fixture(){var s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);s.turnNumber=3;s.player('P1').field=[];s.player('P2').field=[];s.player('P2').territory=[];return {s:s,a:h.putInsectOnField(s,'P1',def.id),target:h.putInsectOnField(s,'P2','set1_003',{hp:10000})};}
runner.test('Mimic attack requires another visible ally and cannot choose self or opponent',function(){
 var f=fixture();runner.assertEqual(global.getLegalAttackTargets(f.s,f.a.instanceId,def.skills[1].id).length,0);
 var ally=h.putInsectOnField(f.s,'P1','minminzemi');ally.faceDown=true;
 runner.assertEqual(global.getLegalAttackTargets(f.s,f.a.instanceId,def.skills[1].id).length,0);ally.faceDown=false;
 global.performAttack(f.s,f.a.instanceId,f.target.instanceId,'INSECT',def.skills[1].id);
 runner.assertEqual(f.s.pendingEffect.options.join(','),ally.instanceId);runner.assertEqual(f.target.currentHp,10000);
 var rejected=false;try{global.resolveCardSelection(f.s,'P1',[f.a.instanceId],true);}catch(e){rejected=true;}runner.assert(rejected);
 global.resolveCardSelection(f.s,'P1',[ally.instanceId],true);
 runner.assertEqual(f.a.runtimeFlags.colorOverride,'BLUE');runner.assertEqual(f.s.pendingEffect,null);
 runner.assertEqual(f.target.currentHp,9000,'blue attack exploits red weakness before damage');
 f.a.attackedThisTurn=false;runner.assertEqual(global.getLegalAttackTargets(f.s,f.a.instanceId,def.skills[1].id).length,0);
 global.endTurn(f.s);runner.assert(!f.a.runtimeFlags.colorOverride);
});
runner.test('CPU resolves color copying using effective color, including colorless',function(){
 var f=fixture(),ally=h.putInsectOnField(f.s,'P1','minminzemi');ally.runtimeFlags.colorOverride='COLORLESS';
 global.performAttack(f.s,f.a.instanceId,f.target.instanceId,'INSECT',def.skills[1].id);
 var cpu=new global.CpuAgent('P1');runner.assert(cpu.executeAction(f.s,cpu.getPendingAction(f.s)));
 runner.assertEqual(f.a.runtimeFlags.colorOverride,'COLORLESS');runner.assertEqual(f.target.currentHp,9500);
});
module.exports=runner;if(require.main===module)runner.runAll().then(function(r){if(r.failed)process.exitCode=1;});
