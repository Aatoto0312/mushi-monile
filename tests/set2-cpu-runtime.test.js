'use strict';
require('./engine-loader.js');require('../js/engine/cpu-agent.js');
var h=require('./helpers.js'),Runner=require('./lib.js'),runner=new Runner();
// Connection smoke, not an effect-specific release gate. Each production
// definition is copied verbatim except its identity and unreleased status.
global.cardRegistry.getBySet('BOOSTER_SET_2').filter(function(d){return d.implementationStatus==='PARTIAL';}).forEach(function(original){
 var raw=JSON.parse(JSON.stringify(original));raw.id='test_cpu_'+raw.id;raw.set=null;raw.implementationStatus='test';var def=new global.CardDefinition(raw);global.cardRegistry.register(def);
 runner.test(original.id+' CPU uses definition and continues without unresolved selection',function(){
  var s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);s.turnNumber=3;s.player('P1').hand=[];s.player('P1').field=[];s.player('P2').field=[];s.player('P2').territory=[];
  var held=h.addToHandRaw(s,'P1',def);h.ensureCost(s,'P1',20);
  if(def.type!=='INSECT')h.putInsectOnField(s,'P1','set1_003');
  h.putInsectOnField(s,'P2','set1_003',{hp:10000});
  if(original.id==='set2_055')h.addToFoodRaw(s,'P1',global.getCardDefinition('set1_117'));
  if(original.id==='set2_051'){
   h.putInsectOnField(s,'P1','namiageha_larva');h.addToHandRaw(s,'P1',global.getCardDefinition('namiageha'));s.player('P1').availableCost=0;
  }
  if(original.id==='set2_050'){
   h.addToHandRaw(s,'P1',global.getCardDefinition('set1_001'));s.player('P1').availableCost=4;
  }
  var cpu=new global.CpuAgent('P1',{rng:function(){return 0;}}),opponent=new global.CpuAgent('P2',{rng:function(){return 0;}});
  var action=cpu.decideMainPhaseAction(s);runner.assertEqual(action.instanceId,held.instanceId,'CPU must actually choose this card');runner.assert(cpu.executeAction(s,action));
  for(var i=0;i<20&&s.activePlayerId==='P1'&&!s.winner;i++){
   var actor=s.pendingEffect&&s.pendingEffect.playerId==='P2'?opponent:cpu;
   var next=s.pendingEffect?actor.getPendingAction(s):actor.decideMainPhaseAction(s);
   runner.assert(next,'pending must have a legal action');runner.assert(actor.executeAction(s,next),'CPU action must resolve');
  }
  runner.assertEqual(s.pendingEffect,null);runner.assert(s.activePlayerId==='P2'||s.winner,'turn continues or Battle ends');runner.assert(held.zone!=='HAND','card was used');
 });
});
module.exports=runner;if(require.main===module)runner.runAll();
