'use strict';
require('./engine-loader.js');require('../js/engine/cpu-agent.js');
var h=require('./helpers.js'),Runner=require('./lib.js'),runner=new Runner();
var raw=JSON.parse(JSON.stringify(global.getCardDefinition('set2_050')));raw.id='test_summon_attachment';raw.set=null;raw.implementationStatus='test';
var def=new global.CardDefinition(raw);global.cardRegistry.register(def);
function fixture(){var s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);s.turnNumber=3;s.player('P1').hand=[];s.player('P1').field=[];s.player('P2').field=[];h.ensureCost(s,'P1',4);return s;}
runner.test('Summon attachment selects hand insect, pays only enhancement cost and blocks attack',function(){
 var s=fixture(),host=h.addToHandRaw(s,'P1',global.getCardDefinition('set1_001')),card=h.addToHandRaw(s,'P1',def);
 global.useEnhancement(s,'P1',card.instanceId);
 runner.assertEqual(s.pendingEffect.options.join(','),host.instanceId);
 global.resolveCardSelection(s,'P1',[host.instanceId],true);
 runner.assertEqual(host.zone,'FIELD');runner.assertEqual(host.attachments[0],card);runner.assertEqual(s.player('P1').availableCost,0);
 runner.assertEqual(global.getLegalAttackTargets(s,host.instanceId).length,0);
 global.endTurn(s);runner.assertEqual(host.attachments.length,1);
 h.toMainPhase(s);global.endTurn(s);runner.assertEqual(host.attachments.length,0);runner.assertEqual(card.zone,'DISCARD');
 h.toMainPhase(s);runner.assert(global.getLegalAttackTargets(s,host.instanceId).length>0);
});
runner.test('Summon attachment cannot target field insect or use without hand insect',function(){
 var s=fixture(),host=h.putInsectOnField(s,'P1','set1_003'),card=h.addToHandRaw(s,'P1',def);
 var rejected=false;try{global.useEnhancement(s,'P1',card.instanceId,host.instanceId);}catch(e){rejected=true;}
 runner.assert(rejected);runner.assertEqual(card.zone,'HAND');runner.assertEqual(s.player('P1').availableCost,4);
});
runner.test('CPU can choose summon attachment with empty field and resolves its hand target',function(){
 var s=fixture(),host=h.addToHandRaw(s,'P1',global.getCardDefinition('set1_001')),card=h.addToHandRaw(s,'P1',def),cpu=new global.CpuAgent('P1');
 var action=cpu.decideMainPhaseAction(s);runner.assertEqual(action.instanceId,card.instanceId);runner.assert(cpu.executeAction(s,action));
 if(s.pendingEffect)runner.assert(cpu.executeAction(s,cpu.getPendingAction(s)));
 runner.assertEqual(host.zone,'FIELD');runner.assertEqual(host.attachments[0],card);runner.assertEqual(s.pendingEffect,null);
});
runner.test('Transferring summon attachment transfers restriction and preserves scheduled expiry',function(){
 var s=fixture(),host=h.addToHandRaw(s,'P1',global.getCardDefinition('set1_001')),card=h.addToHandRaw(s,'P1',def);
 global.useEnhancement(s,'P1',card.instanceId,host.instanceId);
 var other=h.putInsectOnField(s,'P1','set1_003'),spell=h.addToHandRaw(s,'P1',global.getCardDefinition('set1_104'));h.ensureCost(s,'P1',10);
 global.useSpell(s,'P1',spell.instanceId);global.resolveCardSelection(s,'P1',[card.instanceId,other.instanceId],true);
 runner.assert(global.getLegalAttackTargets(s,host.instanceId).length>0);runner.assertEqual(global.getLegalAttackTargets(s,other.instanceId).length,0);
 global.endTurn(s);h.toMainPhase(s);global.endTurn(s);
 runner.assertEqual(other.attachments.length,0);runner.assertEqual(card.zone,'DISCARD');
});
module.exports=runner;if(require.main===module)runner.runAll().then(function(r){if(r.failed)process.exitCode=1;});
