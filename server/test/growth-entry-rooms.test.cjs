'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),runtime=require('../lib/runtime.cjs'),original=runtime.createRuntime;
const {cases,setup}=require('../../tests/fixtures/growth-entry-scenarios.cjs');let scenario;
runtime.createRuntime=function(){const r=original(),start=r.start;r.start=function(...args){const s=start(...args);setup(r.context,s,...scenario);return s;};return r;};
const {createRoomService}=require('../lib/rooms.cjs');
function client(s){const messages=[],session=s.connect(m=>messages.push(m));let n=0;return {session,last:t=>messages.filter(m=>m.type===t).at(-1),send(type,data={}){s.receive(session,{type,requestId:'growth_request_'+String(++n).padStart(8,'0'),versions:runtime.VERSIONS,...data});}};}
for(const c of cases)test(c[0]+' authoritative entry, duplicate operation, private choice, reconnect and resulting stats',()=>{
 scenario=c.slice(0,2);const service=createRoomService({rng:()=>0});
 try{let a=client(service);const b=client(service),w=client(service);a.send('CREATE');const auth=a.last('SESSION');b.send('JOIN',{code:auth.roomCode});w.send('WATCH',{code:auth.roomCode});for(const p of [a,b])p.send('DECK',{version:p.last('VIEW').room.version,preset:'KABUTOMUSHI'});for(const p of [a,b])p.send('READY',{version:p.last('VIEW').room.version,ready:true});
 const before=a.last('VIEW'),action=before.battle.actions.find(x=>x.kind===(c[1]==='emerge'?'SPELL':'SUMMON'));assert(action);let n=0;
 function execute(actionId,selectedRefs){const v=a.last('VIEW'),m={type:'ACTION',requestId:'growth_action_'+String(++n).padStart(8,'0'),versions:runtime.VERSIONS,version:v.room.version,actionId,selectedRefs};service.receive(a.session,m);assert(!a.last('ERROR'),JSON.stringify(a.last('ERROR')));const after=a.last('VIEW').room.version;service.receive(a.session,m);assert.equal(a.last('VIEW').room.version,after);assert.equal(a.last('ACK').duplicate,true);}
 execute(action.id,[]);
 for(let step=0;step<4&&a.last('VIEW').battle.decision;step++){
  const pending=a.last('VIEW');assert.equal(pending.battle.players.P1.availableCost,c[2]);assert.equal(b.last('VIEW').battle.decision,null);assert.equal(w.last('VIEW').battle.decision,null);
  service.disconnect(a.session);assert.equal(b.last('VIEW').room.paused,true);a=client(service);a.send('RESUME',{code:auth.roomCode,token:auth.token});const resumed=a.last('VIEW');assert.equal(resumed.room.paused,false);assert.equal(resumed.battle.players.P1.availableCost,c[2]);const d=resumed.battle.decision;assert(d);execute(d.actionId,d.options.slice(0,d.min||1).map(x=>x.ref));
 }
 const view=a.last('VIEW');assert.equal(view.battle.decision,null);assert.equal(view.battle.players.P1.availableCost,c[2]);const card=view.battle.players.P1.field.find(x=>x.cardId===c[0]);assert(card,c[0]);assert.equal(card.skills[0].ap,c[3]);assert.equal(w.last('VIEW').room.version,view.room.version);
 if(c[1]==='adult')assert(view.battle.players.P1.field.some(x=>x.cardId==='set2_016'));
 if(c[1]==='attach')assert.equal(card.attachments[0].cardId,'minomushi_no_kakuremino');
 }finally{service.close();}
});
test('All five certified cards are accepted in one canonical20-card deck; PARTIAL remains rejected',()=>{
 const r=original(),ids=cases.map(c=>c[0]),names=new Set(ids.map(id=>r.context.getCardDefinition(id).name)),fill=[];
 for(const d of r.definitions){if(d.set!=='STARTER'||names.has(d.name))continue;names.add(d.name);fill.push(d.id);if(fill.length===20-ids.length)break;}
 const deck={...r.preset('KABUTOMUSHI'),cards:ids.concat(fill).map(canonicalCardId=>({canonicalCardId,quantity:1}))};
 assert.equal(r.validateDeck(deck).length,20);deck.cards[0].canonicalCardId='set5_007';assert.throws(()=>r.validateDeck(deck),/DECK_INVALID/);
});
