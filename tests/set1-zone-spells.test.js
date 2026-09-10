'use strict';
require('./engine-loader.js');
require('../js/engine/cpu-agent.js');
var TestRunner = require('./lib.js');
var h = require('./helpers.js');
var runner = new TestRunner();

function stateMain() { var s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);s.player('P1').field=[];s.player('P2').field=[];return s; }

runner.test('SET1ZoneSpell 斑猫の手招きはFOOD選択pendingからHANDへ移す', function () {
  var s=stateMain(), p=s.player('P1');
  var food=h.addToFoodRaw(s,'P1',global.getCardDefinition('set1_028'));
  h.addToFoodRaw(s,'P1',global.getCardDefinition('set1_031'));
  var spell=h.addToHandRaw(s,'P1',global.getCardDefinition('set1_121'));
  var result=global.useSpell(s,'P1',spell.instanceId);
  runner.assert(result.pending);
  global.resolveSpellTargetSelection(s,'P1',food.instanceId);
  runner.assert(p.hand.some(function(c){return c.instanceId===food.instanceId;}));
});

runner.test('SET1ZoneSpell 蟷螂の構えは攻撃済み虫を再攻撃可能にする', function () {
  var s=stateMain();
  var insect=h.putInsectOnField(s,'P1','set1_028');insect.attackedThisTurn=true;
  var spell=h.addToHandRaw(s,'P1',global.getCardDefinition('set1_115'));h.ensureCost(s,'P1',3);
  global.useSpell(s,'P1',spell.instanceId,insect.instanceId);
  runner.assertEqual(insect.attackedThisTurn,false);
});

runner.test('SET1ZoneSpell CPUは新しいfood選択pendingを共通resolverで完遂する', function () {
  var s=stateMain(), p=s.player('P1');
  var food=h.addToFoodRaw(s,'P1',global.getCardDefinition('set1_028'));
  h.addToFoodRaw(s,'P1',global.getCardDefinition('set1_031'));
  var spell=h.addToHandRaw(s,'P1',global.getCardDefinition('set1_121'));
  global.useSpell(s,'P1',spell.instanceId);
  var cpu=new global.CpuAgent('P1',{rng:function(){return 0;}});
  var action=cpu.getPendingAction(s);
  runner.assertEqual(action.type,'RESOLVE_SPELL_TARGET_SELECTION');
  runner.assert(cpu.executeAction(s,action));
  runner.assert(p.hand.some(function(c){return c.instanceId===food.instanceId;}));
});

module.exports=runner;
