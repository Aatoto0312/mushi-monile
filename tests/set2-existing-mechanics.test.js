'use strict';
require('./engine-loader.js');
var h=require('./helpers.js'),Runner=require('./lib.js'),runner=new Runner();

function main(){var s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);s.turnNumber=3;s.player('P1').field=[];s.player('P2').field=[];s.player('P2').territory=[];return s;}
function playableCopy(id){var raw=JSON.parse(JSON.stringify(global.getCardDefinition(id)));raw.id='test_existing_'+id;raw.set=null;raw.implementationStatus='test';if(!global.cardRegistry.has(raw.id))global.cardRegistry.register(new global.CardDefinition(raw));return global.getCardDefinition(raw.id);}

[15,30,37,44].forEach(function(number){
 runner.test('SET2 '+number+' uses the shared jump-out lifecycle',function(){
  var s=main(),id='set2_'+String(number).padStart(3,'0'),card=h.addToTerritoryRaw(s,'P2',global.getCardDefinition(id));
  global.drawTerritoryCard(s,'P2');global.resolveTerritoryDrawSelection(s,'P2',card.instanceId);
  runner.assertEqual(s.pendingEffect.type,'TERRITORY_DRAW_CHOICE');
  global.resolvePendingTerritoryChoice(s,'USE_TOBIDASU');
  runner.assertEqual(card.zone,'FIELD');runner.assert(s.player('P2').field.includes(card));
 });
});

[20,23].forEach(function(number){
 runner.test('SET2 '+number+' forces attacks to its visible lure group',function(){
  var s=main(),lure=h.putInsectOnField(s,'P2','set2_'+String(number).padStart(3,'0')),ordinary=h.putInsectOnField(s,'P2','set1_003'),attacker=h.putInsectOnField(s,'P1','set1_004');
  var targets=global.getLegalAttackTargets(s,attacker.instanceId);
  runner.assertEqual(targets.length,1);runner.assertEqual(targets[0].instance.instanceId,lure.instanceId);
  lure.faceDown=true;targets=global.getLegalAttackTargets(s,attacker.instanceId);
  runner.assert(targets.some(function(target){return target.instance&&target.instance.instanceId===ordinary.instanceId;}));
 });
});

[33,42].forEach(function(number){
 runner.test('SET2 '+number+' shared mimic protection applies only on the next opponent turn',function(){
  var s=main(),protectedCard=h.addToHandRaw(s,'P1',playableCopy('set2_'+String(number).padStart(3,'0')));h.ensureCost(s,'P1',10);
  global.summonInsect(s,'P1',protectedCard.instanceId);global.endTurn(s);h.toMainPhase(s);
  var attacker=h.putInsectOnField(s,'P2','set1_004');
  runner.assert(!global.getLegalAttackTargets(s,attacker.instanceId).some(function(target){return target.instance&&target.instance.instanceId===protectedCard.instanceId;}));
 });
});

[3,5,12,24].forEach(function(number){
 runner.test('SET2 '+number+' once-per-field attack cannot be reused before leaving field',function(){
  var s=main(),attacker=h.putInsectOnField(s,'P1','set2_'+String(number).padStart(3,'0')),target=h.putInsectOnField(s,'P2','set1_003',{hp:10000});
  var skill=global.getCardDefinition(attacker.cardId).skills[1];
  global.performAttack(s,attacker.instanceId,target.instanceId,'INSECT',skill.id);attacker.attackedThisTurn=false;
  var rejected=false;try{global.performAttack(s,attacker.instanceId,target.instanceId,'INSECT',skill.id);}catch(error){rejected=true;}
  runner.assert(rejected);runner.assert(attacker.usedSkills.includes(skill.id));
 });
});

[48,49].forEach(function(number){
 runner.test('SET2 '+number+' applies its canonical HP and AP enhancement values',function(){
  var s=main(),host=h.putInsectOnField(s,'P1','set1_003'),card=h.addToHandRaw(s,'P1',playableCopy('set2_'+String(number).padStart(3,'0'))),amount=number===48?300:500;
  host.currentHp-=200;h.ensureCost(s,'P1',10);global.useEnhancement(s,'P1',card.instanceId,host.instanceId);
  runner.assertEqual(global.calculateMaxHp(host,s),host.baseHp+amount);
  runner.assertEqual(host.currentHp,host.baseHp+amount-200);
  runner.assertEqual(global.getEffectiveAP(s,host,100),100+amount);
 });
});

module.exports=runner;
if(require.main===module)runner.runAll().then(function(result){if(result.failed)process.exitCode=1;});
