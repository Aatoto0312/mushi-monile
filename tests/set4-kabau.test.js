'use strict';require('./engine-loader.js');var h=require('./helpers.js');var TestRunner=require('./lib.js');var runner=new TestRunner();
runner.test('Kabau territory entry forces attacks for the current turn then returns to owner hand',function(){
  var s=h.newGame({rng:h.firstPlayerRng}),p=s.player('P1');var raw=JSON.parse(JSON.stringify(getCardDefinition('set4_004')));raw.id='test_set4_kabau';raw.implementationStatus='test';var d=new CardDefinition(raw);Object.keys(raw).forEach(function(k){d[k]=raw[k];});cardRegistry.register(d);
  var kabau=new CardInstance({instanceId:'kabau',cardId:d.id,ownerId:'P1',controllerId:'P1',zone:ZONES.TERRITORY,faceDown:true,baseHp:d.baseHp,currentHp:d.baseHp});
  var ally=h.putInsectOnField(s,'P1','set1_003',{hp:1000});p.territory=[kabau];s.activePlayerId='P2';s.phase=Phases.MAIN_PHASE;
  drawTerritoryCard(s,'P1');resolveTerritoryDrawSelection(s,'P1',kabau.instanceId);runner.assertEqual(s.pendingEffect.type,'TERRITORY_DRAW_CHOICE');resolvePendingTerritoryChoice(s,'USE_TOBIDASU');
  var attacker=h.putInsectOnField(s,'P2','set1_003',{hp:1000});var targets=getLegalAttackTargets(s,attacker.instanceId,getCardDefinition(attacker.cardId).skills[0].id);
  runner.assertEqual(targets.length,1);runner.assertEqual(targets[0].instance.instanceId,kabau.instanceId);endTurn(s);runner.assertEqual(kabau.zone,ZONES.HAND);runner.assert(p.hand.indexOf(kabau)!==-1);runner.assert(ally.zone===ZONES.FIELD);
});
module.exports=runner;if(require.main===module)runner.runAll();
