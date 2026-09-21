'use strict';
require('./engine-loader.js'); require('../js/engine/cpu-agent.js');
var h=require('./helpers.js'),Runner=require('./lib.js'),runner=new Runner();
var raw=JSON.parse(JSON.stringify(global.getCardDefinition('set2_019')));
raw.id='test_entry_revival';raw.set=null;raw.implementationStatus='test';
var def=new global.CardDefinition(raw);global.cardRegistry.register(def);
function fixture(){var s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);s.turnNumber=3;s.player('P1').discard=[];return s;}
function discard(s,cardId){var c=h.addToHandRaw(s,'P1',global.getCardDefinition(cardId));global.moveCard(s,c.instanceId,'HAND','DISCARD');return c;}
function summon(s){var c=h.addToHandRaw(s,'P1',def);h.ensureCost(s,'P1',10);global.summonInsect(s,'P1',c.instanceId);return c;}
runner.test('Emperor entry offers only own discarded cicadas, including SET1 family metadata',function(){
 var s=fixture(),c=discard(s,'set1_052');discard(s,'set1_003');summon(s);
 runner.assertEqual(s.pendingEffect.options.join(','),c.instanceId);
 global.resolveCardSelection(s,'P1',[c.instanceId],true);
 runner.assertEqual(c.zone,'FIELD');runner.assertEqual(c.currentHp,global.getCardDefinition(c.cardId).baseHp);
 runner.assertEqual(global.getLegalAttackTargets(s,c.instanceId).length,0);
 c.attackedThisTurn=false;runner.assertEqual(global.getLegalAttackTargets(s,c.instanceId).length,0,'ready effects cannot remove attack prohibition');
 runner.assertEqual(s.pendingEffect,null);
});
runner.test('Emperor revives another emperor and serializable selection continues to a third cicada',function(){
 var s=fixture(),second=discard(s,def.id),third=discard(s,'set1_056');summon(s);
 global.resolveCardSelection(s,'P1',[second.instanceId],true);
 runner.assertEqual(s.pendingEffect.options.join(','),third.instanceId);
 s.pendingEffect=JSON.parse(JSON.stringify(s.pendingEffect));
 var cpu=new global.CpuAgent('P1');runner.assert(cpu.executeAction(s,cpu.getPendingAction(s)));
 runner.assertEqual(third.zone,'FIELD');runner.assertEqual(s.pendingEffect,null);
 runner.assertEqual(global.getLegalAttackTargets(s,second.instanceId).length,0);
});
runner.test('Exchange entry sees the cicada just moved to discard',function(){
 var s=fixture(),emperor=discard(s,def.id),old=h.putInsectOnField(s,'P1','set1_052');
 global.batchMoveCards(s,[{instanceId:emperor.instanceId,from:'DISCARD',to:'FIELD'},{instanceId:old.instanceId,from:'FIELD',to:'DISCARD'}]);
 runner.assertEqual(s.pendingEffect.options.join(','),old.instanceId);
 global.resolveCardSelection(s,'P1',[],true);runner.assertEqual(s.pendingEffect,null);runner.assertEqual(old.zone,'DISCARD');
});
runner.test('Starter cicadas are eligible for emperor revival',function(){
 var s=fixture(),a=discard(s,'minminzemi'),b=discard(s,'higurashi');summon(s);
 runner.assertEqual(s.pendingEffect.options.join(','),[a.instanceId,b.instanceId].join(','));
});
module.exports=runner;if(require.main===module)runner.runAll().then(function(r){if(r.failed)process.exitCode=1;});
