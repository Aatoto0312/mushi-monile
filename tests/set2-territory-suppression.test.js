'use strict';
require('./engine-loader.js');
var h=require('./helpers.js'), Runner=require('./lib.js'), runner=new Runner();
require('../js/engine/cpu-agent.js');
function copy(n){var raw=JSON.parse(JSON.stringify(global.getCardDefinition('set2_'+String(n).padStart(3,'0'))));raw.id='test_suppression_'+n;raw.set=null;raw.implementationStatus='test';var d=new global.CardDefinition(raw);global.cardRegistry.register(d);return d;}
var insect=copy(24),spell=copy(52);
function fixture(){var s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);s.turnNumber=3;s.player('P2').territory=[];s.player('P2').field=[];return s;}
function territory(s,p){return h.addToTerritoryRaw(s,p,global.getCardDefinition('set1_009'));}
runner.test('Golden attack suppresses jump-out for both destruction and direct attack',function(){
 ['INSECT','LEADER'].forEach(function(type){var s=fixture(),a=h.putInsectOnField(s,'P1',insect.id),t=territory(s,'P2');var target=type==='INSECT'?h.putInsectOnField(s,'P2','set1_003',{hp:100}):null;
 global.performAttack(s,a.instanceId,target?target.instanceId:null,type,insect.skills[0].id);
 global.resolveTerritoryDrawSelection(s,'P2',t.instanceId);runner.assertEqual(s.pendingEffect,null);runner.assertEqual(t.zone,'HAND');});
});
runner.test('Suppression of a skill does not leak into the other skill',function(){
 var s=fixture(),a=h.putInsectOnField(s,'P1',insect.id),t=territory(s,'P2');global.performAttack(s,a.instanceId,null,'LEADER',insect.skills[1].id);global.resolveTerritoryDrawSelection(s,'P2',t.instanceId);runner.assertEqual(s.pendingEffect.type,'TERRITORY_DRAW_CHOICE');
});
runner.test('Smoke suppresses only opponent jump-out through the current turn',function(){
 var s=fixture(),held=h.addToHandRaw(s,'P1',spell);global.useSpell(s,'P1',held.instanceId);runner.assertEqual(held.zone,'DISCARD');
 var t=territory(s,'P2');global.drawTerritoryCard(s,'P2');global.resolveTerritoryDrawSelection(s,'P2',t.instanceId);runner.assertEqual(s.pendingEffect,null);runner.assertEqual(t.zone,'HAND');
 s.player('P1').territory=[];var own=territory(s,'P1');global.drawTerritoryCard(s,'P1');global.resolveTerritoryDrawSelection(s,'P1',own.instanceId);runner.assertEqual(s.pendingEffect.type,'TERRITORY_DRAW_CHOICE');global.resolvePendingTerritoryChoice(s,'TAKE_TO_HAND');
 global.endTurn(s);var next=territory(s,'P2');global.drawTerritoryCard(s,'P2');global.resolveTerritoryDrawSelection(s,'P2',next.instanceId);runner.assertEqual(s.pendingEffect.type,'TERRITORY_DRAW_CHOICE');
});
runner.test('CPU chooses and resolves targetless smoke without leaving a pending action',function(){
 var s=fixture();s.player('P1').hand=[];var held=h.addToHandRaw(s,'P1',spell),cpu=new global.CpuAgent('P1',{rng:function(){return 0;}});
 var action=cpu.decideMainPhaseAction(s);runner.assertEqual(action.type,'USE_SPELL');runner.assertEqual(action.instanceId,held.instanceId);runner.assert(cpu.executeAction(s,action));runner.assertEqual(s.pendingEffect,null);
 runner.assert(cpu.executeAction(s,{type:'END_TURN'}));runner.assertEqual(s.activePlayerId,'P2');
});
module.exports=runner;if(require.main===module)runner.runAll();
