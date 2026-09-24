'use strict';
require('./engine-loader.js');require('../js/engine/cpu-agent.js');
var h=require('./helpers.js'),Runner=require('./lib.js'),runner=new Runner();
var raw=JSON.parse(JSON.stringify(global.getCardDefinition('set2_051')));raw.id='test_hatching';raw.set=null;raw.implementationStatus='test';
var def=new global.CardDefinition(raw);global.cardRegistry.register(def);
function fixture(){var s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);s.turnNumber=3;s.player('P1').hand=[];s.player('P1').field=[];s.player('P2').field=[];return s;}
runner.test('Hatching requires a matching pair and does not spend or move anything without one',function(){
 var s=fixture(),spell=h.addToHandRaw(s,'P1',def);h.putInsectOnField(s,'P1','namiageha_larva');
 var rejected=false;try{global.useSpell(s,'P1',spell.instanceId);}catch(e){rejected=true;}
 runner.assert(rejected);runner.assertEqual(spell.zone,'HAND');runner.assertEqual(s.pendingEffect,null);
});
runner.test('Hatching moves larva to food without cost and adult can attack; delayed death ends',function(){
 var s=fixture(),spell=h.addToHandRaw(s,'P1',def),larva=h.putInsectOnField(s,'P1','namiageha_larva'),adult=h.addToHandRaw(s,'P1',global.getCardDefinition('namiageha'));
 larva.attackedThisTurn=true;larva.runtimeFlags.destroyAtEndTurn=s.turnNumber;var cost=s.player('P1').availableCost;
 global.useSpell(s,'P1',spell.instanceId);
 runner.assertEqual(s.pendingEffect.type,'CARD_SELECTION');
 global.resolveCardSelection(s,'P1',[larva.instanceId,adult.instanceId],true);
 runner.assertEqual(larva.zone,'FOOD');runner.assertEqual(adult.zone,'FIELD');runner.assertEqual(s.player('P1').availableCost,cost);
 runner.assert(!larva.runtimeFlags.destroyAtEndTurn);runner.assert(global.getLegalAttackTargets(s,adult.instanceId).length>0);
 runner.assertEqual(spell.zone,'DISCARD');runner.assertEqual(s.pendingEffect,null);
});
runner.test('Hatching a controlled larva sends food to original owner',function(){
 var s=fixture(),spell=h.addToHandRaw(s,'P1',def),larva=h.putInsectOnField(s,'P1','namiageha_larva'),adult=h.addToHandRaw(s,'P1',global.getCardDefinition('namiageha'));
 larva.ownerId='P2';global.useSpell(s,'P1',spell.instanceId);global.resolveCardSelection(s,'P1',[larva.instanceId,adult.instanceId],true);
 runner.assert(s.player('P2').food.includes(larva));runner.assert(!s.player('P1').food.includes(larva));
});
runner.test('Hatching rejects mismatched pairs without moving cards or losing selection',function(){
 var s=fixture(),spell=h.addToHandRaw(s,'P1',def),a=h.putInsectOnField(s,'P1','namiageha_larva'),b=h.putInsectOnField(s,'P1','set1_034');
 // A second valid pair uses a definition copy only to isolate combination validation.
 var larvaRaw=JSON.parse(JSON.stringify(global.getCardDefinition('namiageha_larva')));larvaRaw.id='test_hatch_other_larva';larvaRaw.set=null;larvaRaw.name='別の虫（幼虫）';global.cardRegistry.register(new global.CardDefinition(larvaRaw));b.cardId=larvaRaw.id;
 var adultRaw=JSON.parse(JSON.stringify(global.getCardDefinition('namiageha')));adultRaw.id='test_hatch_other_adult';adultRaw.set=null;adultRaw.name='別の虫';global.cardRegistry.register(new global.CardDefinition(adultRaw));
 var x=h.addToHandRaw(s,'P1',global.getCardDefinition('namiageha')),y=h.addToHandRaw(s,'P1',global.getCardDefinition(adultRaw.id));
 global.useSpell(s,'P1',spell.instanceId);var pending=s.pendingEffect,rejected=false;
 try{global.resolveCardSelection(s,'P1',[a.instanceId,y.instanceId],true);}catch(e){rejected=true;}
 runner.assert(rejected);runner.assertEqual(s.pendingEffect,pending);runner.assertEqual(a.zone,'FIELD');runner.assertEqual(y.zone,'HAND');
 global.resolveCardSelection(s,'P1',[a.instanceId,x.instanceId],true);runner.assertEqual(s.pendingEffect,null);
});
module.exports=runner;if(require.main===module)runner.runAll().then(function(r){if(r.failed)process.exitCode=1;});
