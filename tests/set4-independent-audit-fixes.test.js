'use strict';
require('./engine-loader.js');require('../js/engine/cpu-agent.js');
var h=require('./helpers.js'),Runner=require('./lib.js'),runner=new Runner();
function attach(s,p,host,id){var c=h.addToHandRaw(s,p,getCardDefinition(id));moveCard(s,c.instanceId,'HAND','FIELD',{playerId:p});s.player(p).field.splice(s.player(p).field.indexOf(c),1);c.zone='ATTACHMENT';host.attachments.push(c);return c;}
function game(){var s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);h.ensureCost(s,'P1',30);return s;}

runner.test('copy transfer selection survives JSON and recalculates HP after reattachment',function(){
 var s=game(),a=h.putInsectOnField(s,'P1','set1_003'),b=h.putInsectOnField(s,'P1','set1_004'),source=attach(s,'P1',a,'set4_048'),copy=h.addToHandRaw(s,'P1',getCardDefinition('set4_053'));
 useEnhancement(s,'P1',copy.instanceId,a.instanceId);resolveCardSelection(s,'P1',[source.instanceId],true);var spell=h.addToHandRaw(s,'P1',getCardDefinition('set1_104'));useSpell(s,'P1',spell.instanceId);resolveCardSelection(s,'P1',[copy.instanceId,b.instanceId],true);
 s.pendingEffect=JSON.parse(JSON.stringify(s.pendingEffect));resolveCardSelection(s,'P1',[source.instanceId],true);runner.assertEqual(copy.runtimeFlags.copiedEnhancementSourceId,source.instanceId);runner.assertEqual(calculateMaxHp(b,s),getCardDefinition(b.cardId).baseHp+600);
});

runner.test('simultaneous capture first keeps victim captured and fan becomes inapplicable',function(){
 var s=game(),a=h.putInsectOnField(s,'P1','set2_007',{hp:3000});attach(s,'P1',a,'set4_054');var v=h.putInsectOnField(s,'P2','set1_003',{hp:100});performAttack(s,a.instanceId,v.instanceId,'INSECT',getCardDefinition(a.cardId).skills[1].id);resolveChoiceSelection(s,'P1','CAPTURE_FIRST');runner.assertEqual(v.zone,'FIELD');runner.assertEqual(v.controllerId,'P1');
});

runner.test('simultaneous fan first bottoms victim and capture becomes inapplicable',function(){
 var s=game(),a=h.putInsectOnField(s,'P1','set2_007',{hp:3000});attach(s,'P1',a,'set4_054');var v=h.putInsectOnField(s,'P2','set1_003',{hp:100});performAttack(s,a.instanceId,v.instanceId,'INSECT',getCardDefinition(a.cardId).skills[1].id);s.pendingEffect=JSON.parse(JSON.stringify(s.pendingEffect));resolveChoiceSelection(s,'P1','BOTTOM_FIRST');runner.assertEqual(v.zone,'DECK');runner.assert(v.faceDown);
});

runner.test('food enhancement sequence re-evaluates copy legality after first attachment',function(){
 var s=game(),host=h.putInsectOnField(s,'P1','set1_003'),normal=h.addToFoodRaw(s,'P1',getCardDefinition('set4_046')),copy=h.addToFoodRaw(s,'P1',getCardDefinition('set4_053')),spell=h.addToHandRaw(s,'P1',getCardDefinition('set4_062'));
 useSpell(s,'P1',spell.instanceId);runner.assert(s.pendingEffect.options.indexOf(copy.instanceId)!==-1);resolveCardSelection(s,'P1',[normal.instanceId,copy.instanceId],true);resolveCardSelection(s,'P1',[host.instanceId],true);resolveCardSelection(s,'P1',[host.instanceId],true);runner.assertEqual(s.pendingEffect.selectionPurpose,'COPY_ENHANCEMENT_SOURCE');resolveCardSelection(s,'P1',[normal.instanceId],true);runner.assertEqual(normal.zone,'FIELD');runner.assertEqual(copy.zone,'FIELD');
});

runner.test('CPU can choose mandatory attachment-cost skill when the cost exists',function(){
 var s=game();s.player('P1').hand=[];var a=h.putInsectOnField(s,'P1','set4_039',{hp:3000});attach(s,'P1',a,'set4_046');h.putInsectOnField(s,'P2','set1_003',{hp:5000});var cpu=new CpuAgent('P1',{rng:function(){return .999;}}),action=cpu.decideMainPhaseAction(s);runner.assertEqual(action.skillId,getCardDefinition(a.cardId).skills[1].id);runner.assert(cpu.executeAction(s,action));runner.assertEqual(s.pendingEffect.selectionPurpose,'ATTACK_ADDITIONAL_COST_ATTACHMENT');
});

runner.test('blind selection survives JSON and resolves only the selected hidden card',function(){
 var s=game(),a=h.putInsectOnField(s,'P1','set4_007',{hp:3000}),v=h.putInsectOnField(s,'P2','set1_003',{hp:5000});s.player('P2').hand=[];var insect=h.addToHandRaw(s,'P2',getCardDefinition('set1_004')),enh=h.addToHandRaw(s,'P2',getCardDefinition('set4_046'));performAttack(s,a.instanceId,v.instanceId,'INSECT',getCardDefinition(a.cardId).skills[1].id);s.pendingEffect=JSON.parse(JSON.stringify(s.pendingEffect));resolveCardSelection(s,'P1',[enh.instanceId],true);runner.assertEqual(enh.zone,'FOOD');runner.assertEqual(insect.zone,'HAND');runner.assert(a.attackedThisTurn);
});

module.exports=runner;if(require.main===module)runner.runAll().then(function(r){if(r.failed)process.exitCode=1;});
