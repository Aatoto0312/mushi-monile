'use strict';require('./engine-loader.js');var h=require('./helpers.js');var TestRunner=require('./lib.js');var runner=new TestRunner();
function card(cardId,owner,zone,id,faceDown){return new CardInstance({instanceId:id,cardId,ownerId:owner,controllerId:owner,zone,faceDown:!!faceDown});}
runner.test('Living fossil discounts per matching discarded trait but preserves printed cost',function(){
  const state=h.newGame({rng:h.firstPlayerRng}),p=state.player('P1'),def=getCardDefinition('set4_001');
  p.discard=[card('set4_003','P1',ZONES.DISCARD,'f1'),card('set4_010','P1',ZONES.DISCARD,'f2'),card('set1_003','P1',ZONES.DISCARD,'other')];
  runner.assertEqual(getEffectiveCardCost(state,'P1',def),4);runner.assertEqual(def.cost,6);
});
runner.test('Aquatic larva counts only visible opposing blue food',function(){
  const state=h.newGame({rng:h.firstPlayerRng}),opp=state.player('P2'),def=getCardDefinition('set4_011');
  opp.food=[card('set2_016','P2',ZONES.FOOD,'b1'),card('set2_016','P2',ZONES.FOOD,'b2'),card('set2_016','P2',ZONES.FOOD,'b3'),card('set2_016','P2',ZONES.FOOD,'hidden',true)];
  runner.assertEqual(getEffectiveCardCost(state,'P1',def),def.cost-1);
});
runner.test('Scavenger receives continuous AP and HP only with all three discard colors',function(){
  const state=h.newGame({rng:h.firstPlayerRng}),p=state.player('P1'),source=card('set4_014','P1',ZONES.FIELD,'scavenger');
  source.baseHp=500;source.currentHp=500;p.field=[source];
  p.discard=[card('set2_001','P1',ZONES.DISCARD,'r'),card('set2_016','P1',ZONES.DISCARD,'b')];
  runner.assertEqual(getEffectiveAP(state,source,200),200);
  p.discard.push(card('set2_031','P1',ZONES.DISCARD,'g'));
  runner.assertEqual(getEffectiveAP(state,source,200),400);runner.assertEqual(calculateMaxHp(source,state),700);
});
runner.test('Intimidating horn taxes printed multi-skill insects for both players',function(){
  const state=h.newGame({rng:h.firstPlayerRng}),p=state.player('P1'),opp=state.player('P2');
  p.field=[card('set4_015','P1',ZONES.FIELD,'horn')];
  runner.assertEqual(getEffectiveCardCost(state,'P2',getCardDefinition('set4_002')),6);
  runner.assertEqual(getEffectiveCardCost(state,'P2',getCardDefinition('set4_022')),getCardDefinition('set4_022').cost);
  opp.field=[];
});
module.exports=runner;if(require.main===module)runner.runAll();
