'use strict';
require('./engine-loader.js'); require('../js/engine/cpu-agent.js');
var h = require('./helpers.js'), Runner = require('./lib.js'), runner = new Runner();
var raw = JSON.parse(JSON.stringify(global.getCardDefinition('set2_001')));
raw.id = 'test_entry_color'; raw.set = null; raw.implementationStatus = 'test';
var def = new global.CardDefinition(raw); global.cardRegistry.register(def);
function fixture() {
  var s = h.newGame({rng:h.firstPlayerRng}); h.toMainPhase(s); s.turnNumber = 3;
  var card = h.addToHandRaw(s,'P1',def); h.ensureCost(s,'P1',10);
  global.summonInsect(s,'P1',card.instanceId); return {s:s, card:card};
}
runner.test('Entry color offers only blue, green and declining; invalid choices preserve pending',function() {
  var f=fixture(), pending=f.s.pendingEffect;
  runner.assertEqual(pending.type,'CHOICE_SELECTION');
  runner.assertEqual(pending.options.map(function(o){return o.value;}).join(','),'BLUE,GREEN,DECLINE');
  var turnRejected=false;try{global.endTurn(f.s);}catch(e){turnRejected=true;}
  runner.assert(turnRejected,'turn cannot end while an entry choice remains');
  ['RED','COLORLESS'].forEach(function(value) {
    var rejected=false;try{global.resolveChoiceSelection(f.s,'P1',value);}catch(e){rejected=true;}
    runner.assert(rejected);runner.assertEqual(f.s.pendingEffect,pending);
  });
  global.resolveChoiceSelection(f.s,'P1','GREEN');
  runner.assertEqual(f.card.runtimeFlags.colorOverride,'GREEN');
  runner.assertEqual(f.s.pendingEffect,null);
  global.endTurn(f.s); runner.assert(!f.card.runtimeFlags.colorOverride);
});
runner.test('Entry color can be declined and CPU resolves a serialized choice',function() {
  var f=fixture();global.resolveChoiceSelection(f.s,'P1','DECLINE');
  runner.assert(!f.card.runtimeFlags.colorOverride);
  global.moveCard(f.s,f.card.instanceId,'FIELD','DISCARD');
  global.moveCard(f.s,f.card.instanceId,'DISCARD','FIELD');
  f.s.pendingEffect=JSON.parse(JSON.stringify(f.s.pendingEffect));
  var cpu=new global.CpuAgent('P1');runner.assert(cpu.executeAction(f.s,cpu.getPendingAction(f.s)));
  runner.assertEqual(f.s.pendingEffect,null);runner.assertEqual(f.card.runtimeFlags.colorOverride,'BLUE');
});
module.exports=runner;if(require.main===module)runner.runAll().then(function(r){if(r.failed)process.exitCode=1;});
