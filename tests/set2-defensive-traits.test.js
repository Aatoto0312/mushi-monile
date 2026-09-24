'use strict';
require('./engine-loader.js');
var h=require('./helpers.js'), TestRunner=require('./lib.js'), runner=new TestRunner();
function copy(number){
 var raw=JSON.parse(JSON.stringify(global.getCardDefinition('set2_'+String(number).padStart(3,'0'))));
 raw.id='test_defensive_set2_'+number;raw.set=null;raw.implementationStatus='test';
 var def=new global.CardDefinition(raw);global.cardRegistry.register(def);return def;
}
var poisonBody=copy(41),bubble=copy(45),weakness=copy(46),boost=copy(54);
function state(){var s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);s.turnNumber=3;s.player('P2').territory=[];return s;}
runner.test('SET2 poison body prevents poison-named attacks but not ordinary attacks',function(){
 var s=state(),target=h.putInsectOnField(s,'P2',poisonBody.id),attacker=h.putInsectOnField(s,'P1','set1_005');
 var result=global.performAttack(s,attacker.instanceId,target.instanceId,'INSECT',global.getCardDefinition('set1_005').skills[1].id);
 runner.assertEqual(result.damageDealt,0);runner.assertEqual(target.zone,'FIELD');
 var ordinary=h.putInsectOnField(s,'P1','set1_003');
 global.performAttack(s,ordinary.instanceId,target.instanceId,'INSECT');
 runner.assertEqual(target.zone,'DISCARD');
});
runner.test('SET2 bubble excludes opponent spell targets and cannot attack',function(){
 var s=state(),target=h.putInsectOnField(s,'P2',bubble.id),spell=h.addToHandRaw(s,'P1',global.getCardDefinition('set1_117'));
 h.ensureCost(s,'P1',10);
 runner.assertEqual(global.getSpellTargetCandidates(s,'P1',spell.instanceId).length,0);
 var failed=false;try{global.useSpell(s,'P1',spell.instanceId,target.instanceId);}catch(e){failed=true;}
 runner.assert(failed);runner.assertEqual(target.zone,'FIELD');runner.assertEqual(spell.zone,'HAND');
 s.activePlayerId='P2';runner.assertEqual(global.getLegalAttackTargets(s,target.instanceId).length,0);
});
runner.test('SET2 bubble remains a legal target for its controller own spell',function(){
 var s=state(),target=h.putInsectOnField(s,'P1',bubble.id),spell=h.addToHandRaw(s,'P1',boost);
 global.useSpell(s,'P1',spell.instanceId,target.instanceId);
 runner.assertEqual(spell.zone,'DISCARD');
});
runner.test('SET2 weakness protection cancels only the attribute multiplier',function(){
 var s=state(),target=h.putInsectOnField(s,'P2','set2_032',{hp:2000});
 var attachment=h.addToHandRaw(s,'P2',weakness);s.activePlayerId='P2';h.ensureCost(s,'P2',10);
 global.useEnhancement(s,'P2',attachment.instanceId,target.instanceId);s.activePlayerId='P1';
 var attacker=h.putInsectOnField(s,'P1','set1_003');
 var result=global.performAttack(s,attacker.instanceId,target.instanceId,'INSECT');
 runner.assertEqual(result.multiplier,1);runner.assertEqual(result.damageDealt,700);runner.assertEqual(target.currentHp,1300);
});
module.exports=runner;if(require.main===module)runner.runAll();
