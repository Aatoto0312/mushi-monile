'use strict';
require('./engine-loader.js');require('../js/engine/cpu-agent.js');
var h=require('./helpers.js'),Runner=require('./lib.js'),runner=new Runner();
function copy(id){var raw=JSON.parse(JSON.stringify(global.getCardDefinition(id)));raw.id='test_capture_'+id;raw.set=null;raw.implementationStatus='test';var def=new global.CardDefinition(raw);global.cardRegistry.register(def);return def;}
var def=copy('set2_007'),ryu=copy('set2_001'),poison=copy('set2_031');
function fixture(cardId){var s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);s.turnNumber=3;s.player('P1').field=[];s.player('P2').field=[];s.player('P2').territory=[];var a=h.putInsectOnField(s,'P1',def.id),b=h.putInsectOnField(s,'P2',cardId||'set1_003',{hp:100});return {s:s,a:a,b:b};}
function attack(f){return global.performAttack(f.s,f.a.instanceId,f.b.instanceId,'INSECT',def.skills[1].id);}
runner.test('Capture moves destroyed enemy under attacker control, retains ownership and destroys at end turn',function(){
 var f=fixture();attack(f);runner.assert(f.s.player('P1').field.includes(f.b));runner.assertEqual(f.b.ownerId,'P2');runner.assertEqual(f.b.currentHp,1400);
 runner.assert(global.getLegalAttackTargets(f.s,f.b.instanceId).length>0);
 global.endTurn(f.s);runner.assert(f.s.player('P2').discard.includes(f.b));runner.assert(!f.s.player('P1').discard.includes(f.b));
});
runner.test('Capture entry choice precedes territory acquisition and survives serialization',function(){
 var f=fixture(ryu.id);h.addToTerritoryRaw(f.s,'P2',global.getCardDefinition('set1_003'));attack(f);
 runner.assertEqual(f.s.pendingEffect.type,'CHOICE_SELECTION');runner.assertEqual(f.s.pendingEffect.playerId,'P1');runner.assertEqual(f.s.player('P2').territory.length,1);
 f.s.pendingEffect=JSON.parse(JSON.stringify(f.s.pendingEffect));global.resolveChoiceSelection(f.s,'P1','GREEN');
 runner.assertEqual(f.s.pendingEffect.type,'TERRITORY_DRAW_SELECTION');runner.assertEqual(f.s.pendingEffect.playerId,'P2');
 global.resolveTerritoryDrawSelection(f.s,'P2',f.s.pendingEffect.options[0]);runner.assertEqual(f.s.pendingEffect,null);runner.assertEqual(f.b.runtimeFlags.colorOverride,'GREEN');
});
runner.test('Captured retaliation insect still destroys original attacker, then returns to owner at end turn',function(){
 var f=fixture(poison.id);attack(f);runner.assert(f.s.player('P1').field.includes(f.b));runner.assertEqual(f.a.zone,'DISCARD');
 global.endTurn(f.s);runner.assert(f.s.player('P2').discard.includes(f.b));
});
runner.test('Destruction replacement prevents capture',function(){
 var f=fixture(),shell=h.addToHandRaw(f.s,'P2',global.getCardDefinition('set1_102'));
 f.s.player('P2').hand.splice(f.s.player('P2').hand.indexOf(shell),1);shell.zone='FIELD';f.b.attachments.push(shell);
 attack(f);runner.assert(f.s.player('P2').field.includes(f.b));runner.assertEqual(shell.zone,'DISCARD');runner.assert(!f.b.runtimeFlags.destroyAtEndTurn);
});
module.exports=runner;if(require.main===module)runner.runAll().then(function(r){if(r.failed)process.exitCode=1;});
