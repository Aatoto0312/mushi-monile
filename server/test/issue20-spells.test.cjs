'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const runtime=require('../lib/runtime.cjs');
const createRuntime=runtime.createRuntime;
const {setup}=require('../../tests/fixtures/food-wave-scenarios.cjs');
let scenario;
runtime.createRuntime=function() {
  const r=createRuntime(),start=r.start;
  r.start=(...args)=>{
    const state=start(...args);
    setup(r.context,state,scenario,'damage');
    const p=state.player('P1');
    for(const card of p.food.slice()) {
      r.context.moveCard(state,card.instanceId,'FOOD','DISCARD',{playerId:'P1',faceDown:false});
    }
    if (scenario==='set5_058' || scenario==='set5_059') {
      const spell=p.hand[0];
      r.context.moveCard(state,spell.instanceId,'HAND','TERRITORY',{playerId:'P1'});
      const attacker=state.player('P2').field[0];
      attacker.currentHp=attacker.baseHp=3000;
      r.context.triggerTerritoryDrawSelection(state,'P1',{attackSourceInstanceId:attacker.instanceId});
      r.context.resolveTerritoryDrawSelection(state,'P1',spell.instanceId);
    }
    if (['set8_057','set8_058'].includes(scenario)) {
      for (const card of state.player('P2').field) card.currentHp=100;
    }
    return state;
  };
  return r;
};
const {createRoomService}=require('../lib/rooms.cjs');

for(const id of ['set8_062','set8_063','set5_057','set5_058','set5_059','set8_057','set8_058']) test(id+' room cast and turn-end projection',t=>{
  scenario=id;
  const service=createRoomService({rng:()=>0});
  t.after(()=>service.close());
  let sequence=0;
  function client() {
    const messages=[], session=service.connect(m=>messages.push(m));
    const last=type=>messages.filter(m=>m.type===type).at(-1);
    function send(type,fields={}) {
      const message={type,requestId:'issue20_spell_'+String(++sequence).padStart(8,'0'),versions:runtime.VERSIONS,...fields};
      service.receive(session,message);
      assert.equal(last('ERROR'),undefined);
      return message;
    }
    return {session,last,send,view:()=>last('VIEW')};
  }
  let a=client();
  const b=client(),w=client();
  a.send('CREATE');
  const auth=a.last('SESSION');
  b.send('JOIN',{code:auth.roomCode});
  w.send('WATCH',{code:auth.roomCode});
  for(const seat of [a,b]) seat.send('DECK',{version:seat.view().room.version,preset:'KABUTOMUSHI'});
  for(const seat of [a,b]) seat.send('READY',{version:seat.view().room.version,ready:true});
  function act(actionId,selectedRefs=[]) {
    const message=a.send('ACTION',{version:a.view().room.version,actionId,selectedRefs});
    const previous=a.view().room.version;
    service.receive(a.session,message);
    assert.equal(a.view().room.version,previous);
    assert(a.last('ACK').duplicate);
  }
  if (id==='set5_058' || id==='set5_059') {
    assert.equal(w.view().battle.decision,null);
    assert.equal(b.view().battle.decision,null);
    service.disconnect(a.session);
    a=client();
    a.send('RESUME',{code:auth.roomCode,token:auth.token});
    act(a.view().battle.actions.find(x=>x.kind==='CHOICE' && x.label.includes('迎撃')).id);
    assert(a.view().battle.players.P1.discard.some(x=>x.cardId===id));
    assert.equal(a.view().battle.players.P1.availableCost,10);
    return;
  }
  act(a.view().battle.actions.find(x=>x.kind==='SPELL').id);
  if (['set8_057','set8_058'].includes(id)) {
    const choices=b.view().battle.actions.filter(x=>x.kind==='CHOICE');
    assert.equal(choices.length,2);
    b.send('ACTION',{version:b.view().room.version,actionId:choices[0].id,selectedRefs:[]});
    assert.equal(b.view().battle.players.P2.field.length,0);
    assert(a.view().battle.players.P1.discard.some(x=>x.cardId===id));
    return;
  }
  if (id==='set5_057') {
    assert.equal(b.view().battle.decision,null);
    assert.equal(w.view().battle.decision,null);
    service.disconnect(a.session);
    a=client();
    a.send('RESUME',{code:auth.roomCode,token:auth.token});
    const choice=a.view().battle.decision;
    act(choice.actionId,choice.options.slice(0,2).map(x=>x.ref));
    assert.equal(a.view().battle.players.P1.availableCost,6);
    for (const viewer of [b,w]) {
      const food=viewer.view().battle.players.P1.food;
      assert.equal(food.length,2);
      assert(food.every(card=>card.hidden && !card.cardId));
    }
  } else if(id==='set8_062') {
    assert(a.view().battle.decision);
    assert.equal(b.view().battle.decision,null);
    assert.equal(w.view().battle.decision,null);
    service.disconnect(a.session);
    a=client();
    a.send('RESUME',{code:auth.roomCode,token:auth.token});
    const choice=a.view().battle.decision;
    act(choice.actionId,[choice.options.find(x=>x.cardId==='kabutomushi').ref]);
    assert(a.view().battle.players.P1.field.some(x=>x.cardId==='kabutomushi'));
    act(a.view().battle.actions.find(x=>x.kind==='END').id);
    for(const seat of [a,b,w]) {
      const hidden=seat.view().battle.players.P1.discard.filter(x=>x.hidden);
      assert.equal(hidden.length,1);
      assert.deepEqual(Object.keys(hidden[0]).sort(),['hidden','label','ref','zone']);
    }
  } else {
    assert.equal(a.view().battle.players.P1.availableCost,8);
    assert(a.view().battle.players.P1.discard.some(x=>x.cardId===id));
  }
});
