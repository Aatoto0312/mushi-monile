'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { createRuntime } = require('../lib/runtime.cjs');
const { prepareView, applyCapability } = require('../lib/gateway.cjs');

function fixture() {
  const runtime = createRuntime();
  const c = runtime.context;
  const state = runtime.start(runtime.preset('KABUTOMUSHI'), runtime.preset('OKAMAKIRI'), () => 0);
  state.phase = 'MAIN_PHASE';
  state.turnNumber = 3;
  for (const player of state.playerOrder) {
    for (const zone of ['hand','field','food','territory','discard']) state.player(player)[zone] = [];
  }
  function put(id, zone, player='P1') {
    const def = c.getCardDefinition(id);
    const card = new c.CardInstance({instanceId:state.nextInstanceId(),cardId:id,ownerId:player,controllerId:player,zone,baseHp:def.baseHp,currentHp:def.baseHp});
    state.player(player)[zone.toLowerCase()].push(card);
    return card;
  }
  return {runtime,c,state,put};
}

for (const attacker of ['set6_043','set7_026']) {
  test(attacker+' resumes private choices through the room gateway', () => {
    const {runtime,c,state,put} = fixture();
    const source=put(attacker,'FIELD'), target=put('set6_016','FIELD','P2');
    const adult=put('set6_017',attacker==='set6_043'?'HAND':'TERRITORY');
    if(attacker==='set6_043')put('set2_050','HAND');
    const skill=c.getCardDefinition(attacker).skills[1];
    const actions=prepareView(runtime,state,'P1');
    const attack=actions.view.actions.find(a=>a.kind==='ATTACK' && a.skill?.name===skill.name);
    assert(attack);
    let next=applyCapability(runtime,state,actions.capabilities,attack.id,[]);
    for (let step=0;step<(attacker==='set6_043'?2:1);step++) {
      next=runtime.restore(next);
      assert.equal(prepareView(runtime,next,'P2').view.decision,null);
      assert.equal(prepareView(runtime,next,'SPECTATOR').view.decision,null);
      const owner=prepareView(runtime,next,'P1'), choice=owner.view.decision;
      assert.equal(choice.options.length,1);
      next=applyCapability(runtime,next,owner.capabilities,choice.actionId,[choice.options[0].ref]);
    }
    assert.equal(next.pendingEffect,null);
    if(attacker==='set6_043')assert(next.player('P1').field.some(x=>x.instanceId===adult.instanceId));
    else assert.equal(next.activePlayerId,'P2');
  });
}

test('Cricket blocks room revival on both sides and permits capture by attack',()=>{
  const {runtime,c,state,put}=fixture();
  const cricket=put('set7_046','FIELD','P2'),captor=put('set2_007','FIELD'),victim=put('set1_003','FIELD','P2');
  victim.currentHp=1;
  for(const player of state.playerOrder){
    const card=put('namitentou','DISCARD',player);
    assert.throws(()=>c.moveCard(state,card.instanceId,'DISCARD','FIELD',{playerId:player}),/捨て札/);
  }
  const restored=runtime.restore(state);
  c.performAttack(restored,captor.instanceId,victim.instanceId,'INSECT',c.getCardDefinition(captor.cardId).skills[1].id);
  assert(restored.player('P1').field.some(x=>x.instanceId===victim.instanceId));
  assert(restored.player('P2').field.some(x=>x.instanceId===cricket.instanceId));
});
