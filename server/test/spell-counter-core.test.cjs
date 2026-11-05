'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),rt=require('../lib/runtime.cjs'),original=rt.createRuntime;
rt.createRuntime=function(){const r=original(),start=r.start;r.start=(...args)=>{const s=start(...args),c=r.context;
  const raw=JSON.parse(JSON.stringify(c.getCardDefinition('set1_003')));raw.id='test_room_counter';raw.set=null;raw.implementationStatus='test';raw.passiveAbilities=[{name:'counter test',timing:'ON_OPPONENT_SPELL_USED',effects:[{type:'DESTROY_SELF_AND_COUNTER_SPELL'}]}];const def=new c.CardDefinition(raw);Object.assign(def,raw);c.cardRegistry.register(def);
  s.turnNumber=3;s.phase=c.Phases.MAIN_PHASE;s.activePlayerId='P1';s.player('P1').availableCost=20;s.player('P1').hand=[];s.player('P1').field=[];s.player('P2').field=[];
  function add(pid,id,zone){const d=c.getCardDefinition(id),x=new c.CardInstance({instanceId:s.nextInstanceId(),cardId:id,ownerId:pid,controllerId:pid,zone,currentHp:d.baseHp});s.player(pid)[zone.toLowerCase()].push(x);return x;}
  add('P1','set3_054','HAND');add('P2',raw.id,'FIELD');add('P2',raw.id,'FIELD');add('P2','set1_003','FIELD');return s;};return r;};
const {createRoomService}=require('../lib/rooms.cjs');
function client(s){const messages=[],session=s.connect(m=>messages.push(m));let n=0;return{session,last:t=>messages.filter(m=>m.type===t).at(-1),send(type,data={}){s.receive(session,{type,requestId:'counter_'+String(++n).padStart(8,'0'),versions:rt.VERSIONS,...data});}};}
test('Server counter ordering preserves effect cost, decision authority, resume and duplicate protection',()=>{
  const service=createRoomService({rng:()=>0});try{
    const a=client(service),w=client(service);let b=client(service);a.send('CREATE');const auth=a.last('SESSION');b.send('JOIN',{code:auth.roomCode});const bAuth=b.last('SESSION');w.send('WATCH',{code:auth.roomCode});
    for(const p of [a,b])p.send('DECK',{version:p.last('VIEW').room.version,preset:'KABUTOMUSHI'});
    for(const p of [a,b])p.send('READY',{version:p.last('VIEW').room.version,ready:true});
    const before=a.last('VIEW');
    const action=before.battle.actions.find(x=>x.kind==='SPELL');assert(action);
    a.send('ACTION',{version:before.room.version,actionId:action.id,selectedRefs:[]});assert(!a.last('ERROR'),JSON.stringify(a.last('ERROR')));
    const targeting=a.last('VIEW');assert(targeting.battle.decision);
    const targetChoice=targeting.battle.decision.options.find(x=>x.cardId==='set1_003');assert(targetChoice);
    a.send('ACTION',{version:targeting.room.version,actionId:targeting.battle.decision.actionId,selectedRefs:[targetChoice.ref]});assert(!a.last('ERROR'),JSON.stringify(a.last('ERROR')));
    assert.equal(a.last('VIEW').battle.players.P1.availableCost,20);assert.equal(a.last('VIEW').battle.decision,null);assert.equal(w.last('VIEW').battle.decision,null);assert.equal(a.last('VIEW').battle.actions.length,0);assert.equal(w.last('VIEW').battle.actions.length,0);
    service.disconnect(b.session);b=client(service);b.send('RESUME',{code:auth.roomCode,token:bAuth.token});const v=b.last('VIEW'),choices=v.battle.actions.filter(x=>x.kind==='CHOICE');assert.equal(choices.length,2);
    a.send('ACTION',{version:v.room.version,actionId:choices[0].id,selectedRefs:[]});assert.equal(a.last('ERROR').code,'NOT_DECISION_OWNER');
    const command={type:'ACTION',requestId:'counter_resolve_duplicate',versions:rt.VERSIONS,version:v.room.version,actionId:choices[0].id,selectedRefs:[]};service.receive(b.session,command);assert(!b.last('ERROR'));
    const after=b.last('VIEW');assert.equal(after.battle.decision,null);assert.equal(after.battle.players.P1.availableCost,20);assert(after.battle.players.P1.discard.some(x=>x.cardId==='set3_054'));assert.equal(after.battle.players.P2.field.length,1);
    service.receive(b.session,command);assert(b.last('ACK').duplicate);assert.equal(b.last('VIEW').room.version,after.room.version);
    for(const p of Object.values(w.last('VIEW').battle.players))for(const card of [...p.hand,...p.territory,...p.food])if(card.hidden)assert.deepEqual(Object.keys(card).sort(),['hidden','label','ref','zone']);
  }finally{service.close();}
});
