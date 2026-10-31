'use strict';
require('./engine-loader.js');
var h=require('./helpers.js'), Runner=require('./lib.js'), runner=new Runner();
runner.test('SET5 Devil Eye requires an attachment on attacker rather than defender', function () {
  var state=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(state);
  var attacker=h.putInsectOnField(state,'P1','set5_001');
  var defender=h.putInsectOnField(state,'P2','set1_003',{hp:10000});
  var skill=getCardDefinition(attacker.cardId).skills[1];
  runner.assertEqual(getLegalAttackTargets(state,attacker.instanceId,skill.id).length,0);
  var attachment=h.addToHandRaw(state,'P1',getCardDefinition('set4_046'));
  attachment.zone='ATTACHMENT';state.player('P1').hand.splice(state.player('P1').hand.indexOf(attachment),1);attacker.attachments.push(attachment);
  runner.assert(getLegalAttackTargets(state,attacker.instanceId,skill.id).some(function(t){return t.instance===defender;}));
});
runner.test('SET5 long arm has no legal action without exactly two opponent insects', function () {
  var state=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(state);
  var attacker=h.putInsectOnField(state,'P1','set5_021'),skill=getCardDefinition(attacker.cardId).skills[1];
  state.player('P2').field=[];
  runner.assertEqual(getLegalAttackTargets(state,attacker.instanceId,skill.id).length,0);
  h.putInsectOnField(state,'P2','set1_003');
  runner.assertEqual(getLegalAttackTargets(state,attacker.instanceId,skill.id).length,0);
  h.putInsectOnField(state,'P2','set1_004');
  runner.assertEqual(getLegalAttackTargets(state,attacker.instanceId,skill.id).length,2);
});
runner.test('SET5 discard spells cannot target bell insect in field but suppression restores legality', function () {
  var state=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(state);
  var bell=h.putInsectOnField(state,'P2','set5_028');
  var spell=h.addToHandRaw(state,'P1',getCardDefinition('jinkaichu_no_bakunetsudan'));
  runner.assertEqual(getSpellTargetCandidates(state,'P1',spell.instanceId).some(function(c){return c.instanceId===bell.instanceId;}),false);
  h.putInsectOnField(state,'P1','set4_043');
  runner.assertEqual(getSpellTargetCandidates(state,'P1',spell.instanceId).some(function(c){return c.instanceId===bell.instanceId;}),true);
});
module.exports=runner;if(require.main===module){runner.runAll();}
