'use strict';
require('./engine-loader.js');
var h=require('./helpers.js'),Runner=require('./lib.js'),runner=new Runner();
function fixture(n){var raw=JSON.parse(JSON.stringify(global.getCardDefinition('set2_'+String(n).padStart(3,'0'))));raw.id='test_hiding_'+n;raw.set=null;raw.implementationStatus='test';var d=new global.CardDefinition(raw);if(!global.cardRegistry.has(d.id))global.cardRegistry.register(d);var s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);s.turnNumber=3;s.player('P2').territory=[];s.player('P2').field=[];return {s:s,a:h.putInsectOnField(s,'P1',d.id),skill:d.skills[1]};}
[9,25].forEach(function(n){runner.test('SET2 '+n+' hides only after territory and jump-out finish, through next opponent turn',function(){
 var f=fixture(n),t=h.addToTerritoryRaw(f.s,'P2',global.getCardDefinition('set1_009'));
 global.performAttack(f.s,f.a.instanceId,null,'LEADER',f.skill.id);runner.assert(!f.a.faceDown);
 global.resolveTerritoryDrawSelection(f.s,'P2',t.instanceId);runner.assertEqual(f.s.pendingEffect.type,'TERRITORY_DRAW_CHOICE');runner.assert(!f.a.faceDown);
 global.resolvePendingTerritoryChoice(f.s,'TAKE_TO_HAND');runner.assert(f.a.faceDown);runner.assertEqual(f.s.pendingEffect,null);
 global.endTurn(f.s);runner.assert(f.a.faceDown);h.toMainPhase(f.s);global.endTurn(f.s);runner.assert(!f.a.faceDown);
 runner.assert(f.a.usedSkills.includes(f.skill.id),'once per field stay remains consumed');
});});
runner.test('Hiding resolves immediately without territory and field exit cancels its duration',function(){
 var f=fixture(9),target=h.putInsectOnField(f.s,'P2','set1_003',{hp:1000});global.performAttack(f.s,f.a.instanceId,target.instanceId,'INSECT',f.skill.id);runner.assert(f.a.faceDown);
 global.moveCard(f.s,f.a.instanceId,'FIELD','HAND',{playerId:'P1'});runner.assert(!f.a.faceDown);runner.assertEqual(f.a.runtimeFlags.faceDownUntilTurn,undefined);
});
module.exports=runner;if(require.main===module)runner.runAll();
