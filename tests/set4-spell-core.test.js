'use strict';require('./engine-loader.js');var h=require('./helpers.js');var TestRunner=require('./lib.js');var runner=new TestRunner();
function copy(source,id){var raw=JSON.parse(JSON.stringify(getCardDefinition(source)));raw.id=id;raw.implementationStatus='test';var d=new CardDefinition(raw);Object.keys(raw).forEach(function(k){d[k]=raw[k];});cardRegistry.register(d);return d;}
runner.test('Extreme-night emergence exchanges a matching field larva and discarded adult',function(){
 var s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);s.player('P1').availableCost=20;var spell=h.addToHandRaw(s,'P1',copy('set4_057','test_set4_057')),larva=h.putInsectOnField(s,'P1','set4_011',{hp:500}),adult=h.addToHandRaw(s,'P1',getCardDefinition('set1_004'));moveCard(s,adult.instanceId,ZONES.HAND,ZONES.DISCARD,{playerId:'P1'});
 useSpell(s,'P1',spell.instanceId);runner.assertEqual(s.pendingEffect.type,'CARD_SELECTION');resolveCardSelection(s,'P1',[larva.instanceId,adult.instanceId]);runner.assertEqual(larva.zone,ZONES.DISCARD);runner.assertEqual(adult.zone,ZONES.FIELD);
});
runner.test('Spell barrier grants serialized opponent spell immunity through next turn end',function(){
 var s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);s.player('P1').availableCost=20;var spell=h.addToHandRaw(s,'P1',copy('set4_061','test_set4_061')),target=h.putInsectOnField(s,'P1','set1_003',{hp:1000});
 useSpell(s,'P1',spell.instanceId,target.instanceId);runner.assert(target.runtimeFlags.opponentSpellImmunityUntilTurn>=s.turnNumber+1);var restored=JSON.parse(JSON.stringify(s));runner.assertEqual(restored.players.P1.field[0].runtimeFlags.opponentSpellImmunityUntilTurn,target.runtimeFlags.opponentSpellImmunityUntilTurn);
});
module.exports=runner;if(require.main===module)runner.runAll();
