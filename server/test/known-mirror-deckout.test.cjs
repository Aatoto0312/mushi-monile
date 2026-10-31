const {test}=require('node:test'),assert=require('node:assert/strict');
const {createRuntime}=require('../lib/runtime.cjs'),{prepareView,applyCapability}=require('../lib/gateway.cjs');
test('KNOWN NEEDS_RULING: deterministic mirror deck-out with equal territory fails closed, not a completed match',()=>{
 const r=createRuntime();let s=r.start(r.preset('KABUTOMUSHI'),r.preset('KABUTOMUSHI'),()=>0);
 const priority=['DRAW','SET_FOOD','SUMMON','ALTERNATIVE','SPELL','ENHANCE','FIELD_ABILITY','MULTI_ATTACK','ATTACK','CHOICE','TERRITORY_CHOICE','MAIN','TO_SET','END'];
 for(let step=0;step<700;step++){
  const prepared=prepareView(r,s,s.pendingEffect?.playerId||s.activePlayerId),v=prepared.view;
  if(v.blockedReason){assert.equal(step,144);assert.equal(v.blockedReason,'ENGINE_NO_LEGAL_COMMAND');for(const id of s.playerOrder){assert.equal(s.player(id).deck.length,0);assert.equal(s.player(id).territory.length,1);}assert.throws(()=>r.context.endTurn(r.restore(s)),/同数時の公式裁定未確認/);return;}
  const a=v.decision?v.actions.find(a=>a.id===v.decision.actionId):v.actions.find(a=>a.kind===priority.find(k=>v.actions.some(a=>a.kind===k)));
  assert(a,'mirror regression stopped earlier than its known ruling boundary');s=applyCapability(r,s,prepared.capabilities,a.id,v.decision?v.decision.options.slice(0,v.decision.max).map(c=>c.ref):[]);
 }
 assert.fail('known ruling boundary was not reproduced');
});
