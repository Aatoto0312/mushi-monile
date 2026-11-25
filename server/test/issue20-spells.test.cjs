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
    if (['set8_057','set8_058','set5_061'].includes(scenario)) {
      for (const card of state.player('P2').field) card.currentHp=100;
      if(scenario==='set5_061')state.player('P2').field[0].runtimeFlags.unhealableDamage=200;
    }
    if(scenario==='set7_059'){
      const enemy=state.player('P2');
      for(let i=0;i<2;i++)enemy.hand.push(new r.context.CardInstance({cardId:'set1_100',instanceId:state.nextInstanceId(),zone:'HAND',ownerId:'P2',controllerId:'P2'}));
      enemy.field=enemy.field.slice(0,1);
      for(let i=0;i<3;i++)enemy.food.push(new r.context.CardInstance({cardId:'namitentou',instanceId:state.nextInstanceId(),zone:'FOOD',ownerId:'P2',controllerId:'P2'}));
    }
    if(['set5_042','set6_027','set8_026'].includes(scenario)){
      const host=p.hand[0];
      r.context.moveCard(state,host.instanceId,'HAND','FIELD',{playerId:'P1'});
      const drawn=new r.context.CardInstance({cardId:scenario==='set5_042'?'tonosamabatta':'minminzemi',instanceId:state.nextInstanceId(),ownerId:'P1',controllerId:'P1',zone:'TERRITORY',faceDown:true});
      p.territory.push(drawn);
      r.context.destroyInsect(state,host.instanceId,'ATTACK',state.player('P2').field[0].instanceId,{});
      r.context.resolveTerritoryDrawSelection(state,'P1',drawn.instanceId);
    }
    return state;
  };
  return r;
};
const {createRoomService}=require('../lib/rooms.cjs');

for(const id of ['set8_062','set8_063','set5_057','set5_058','set5_059','set8_057','set8_058','set5_061','set7_059','set5_042','set6_027','set8_026']) test(id+' room cast and turn-end projection',t=>{
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
  let b=client();const w=client();
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
  if(['set5_042','set6_027','set8_026'].includes(id)){
    assert.equal(w.view().battle.actions.length,0);assert.equal(b.view().battle.actions.length,0);
    service.disconnect(a.session);a=client();a.send('RESUME',{code:auth.roomCode,token:auth.token});
    act(a.view().battle.actions.find(x=>x.kind==='CHOICE'&&x.label.includes('場に出す')).id);
    assert(a.view().battle.players.P1.field.some(x=>x.cardId===(id==='set5_042'?'tonosamabatta':'minminzemi')));
    return;
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
  if(id==='set7_059'){
    act(a.view().battle.actions.find(x=>x.kind==='END').id);
    const seat=b.last('SESSION');service.disconnect(b.session);b=client();b.send('RESUME',{code:auth.roomCode,token:seat.token});
    for(const kind of ['MAIN','ENHANCE','ENHANCE']){
      const action=b.view().battle.actions.find(x=>x.kind===kind);assert(action,kind);
      b.send('ACTION',{version:b.view().room.version,actionId:action.id,selectedRefs:[]});
    }
    assert.equal(b.view().battle.players.P2.discard.filter(x=>x.cardId==='set1_100').length,1);
    assert.equal(b.view().battle.players.P2.field[0].attachments.length,1);
    return;
  }
  if (['set8_057','set8_058','set5_061'].includes(id)) {
    const seat=b.last('SESSION');service.disconnect(b.session);b=client();b.send('RESUME',{code:auth.roomCode,token:seat.token});
    assert.equal(w.view().battle.actions.length,0);
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
