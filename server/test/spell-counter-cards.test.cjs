'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),rt=require('../lib/runtime.cjs'),original=rt.createRuntime,{cases,setup}=require('../../tests/fixtures/spell-counter-scenarios.cjs');let scenario;
rt.createRuntime=function(){const r=original(),start=r.start;r.start=(...args)=>{const s=start(...args);setup(r.context,s,...scenario);return s;};return r;};
const {createRoomService}=require('../lib/rooms.cjs');
function client(s){const messages=[],session=s.connect(m=>messages.push(m));let n=0;return{session,messages,last:t=>messages.filter(m=>m.type===t).at(-1),send(type,data={}){s.receive(session,{type,requestId:'counter_card_'+String(++n).padStart(8,'0'),versions:rt.VERSIONS,...data});}};}
for(const [id,variant]of cases)test(id+' '+variant+' authoritative counter, legal targets, resume, private watcher and duplicate action',()=>{
 scenario=[id,variant];const service=createRoomService({rng:()=>0});try{
 let a=client(service),b=client(service);const w=client(service);a.send('CREATE');const auth=a.last('SESSION');b.send('JOIN',{code:auth.roomCode});const bAuth=b.last('SESSION');w.send('WATCH',{code:auth.roomCode});
 for(const p of [a,b])p.send('DECK',{version:p.last('VIEW').room.version,preset:'KABUTOMUSHI'});for(const p of [a,b])p.send('READY',{version:p.last('VIEW').room.version,ready:true});
 let n=0;function act(p,actionId,selectedRefs=[]){const before=p.last('VIEW'),errors=p.messages.filter(m=>m.type==='ERROR').length,command={type:'ACTION',requestId:'counter_card_op_'+String(++n).padStart(8,'0'),versions:rt.VERSIONS,version:before.room.version,actionId,selectedRefs};service.receive(p.session,command);assert.equal(p.messages.filter(m=>m.type==='ERROR').length,errors,JSON.stringify(p.last('ERROR')));const version=p.last('VIEW').room.version;service.receive(p.session,command);assert.equal(p.last('VIEW').room.version,version);assert(p.last('ACK').duplicate);}
 act(a,a.last('VIEW').battle.actions.find(x=>x.kind==='SPELL').id);
 const d=a.last('VIEW').battle.decision;if(d){const target=d.options.find(x=>x.cardId===(variant==='hand'?'kabutomushi':'namitentou'));assert(target);act(a,d.actionId,[target.ref]);}
 if(variant==='variable'){
   assert.equal(a.last('VIEW').battle.actions.length,0);assert.equal(w.last('VIEW').battle.actions.length,0);
   service.disconnect(b.session);b=client(service);b.send('RESUME',{code:auth.roomCode,token:bAuth.token});const choices=b.last('VIEW').battle.actions.filter(x=>x.kind==='CHOICE');assert.equal(choices.length,2);act(b,choices[1].id);
 }
 const v=a.last('VIEW');assert.equal(v.battle.players.P1.availableCost,variant==='high'?18:variant==='replacement'?19:20);assert.equal(v.battle.decision,null);assert(v.battle.players.P1.discard.some(c=>c.cardId===(variant==='hand'?'set1_125':variant==='variable'?'set3_054':variant==='high'?'set2_053':'mushi_no_ibuki')));
 const expected=variant==='replacement'||variant==='high'&&id==='set7_027';assert.equal(v.battle.players.P2.field.filter(c=>c.cardId===id).length,expected?1:0);
 if(variant==='high')assert.equal(v.battle.players.P2.field.find(c=>c.cardId==='namitentou').currentHp,id==='set7_027'?2000:3000);
 if(variant==='hand'){const log=b.last('VIEW').battle.publicLog.map(x=>x.text).join(' ');assert(log.includes('使用対象を公開 カブトムシ'));assert(!log.includes('オオカマキリ'));assert.equal(v.battle.players.P1.hand.length,2);}
 service.disconnect(a.session);a=client(service);a.send('RESUME',{code:auth.roomCode,token:auth.token});assert.equal(a.last('VIEW').battle.players.P1.availableCost,v.battle.players.P1.availableCost);assert.equal(a.last('VIEW').room.phase,'PLAYING');
 for(const p of Object.values(w.last('VIEW').battle.players))for(const c of [...p.hand,...p.food,...p.territory,...p.resolving])if(c.hidden)assert.deepEqual(Object.keys(c).sort(),['hidden','label','ref','zone']);
 }finally{service.close();}
});
test('Both counter cards pass actual server deck validation within canonical20 cards',()=>{scenario=['set7_023','replacement'];const r=original();for(const id of ['set7_023','set7_027']){const deck=r.preset('KABUTOMUSHI');deck.cards[0].canonicalCardId=id;deck.cards[0].printingId='registry:'+id;const defs=r.validateDeck(deck);assert(defs.some(d=>d.id===id));assert.equal(defs.length,20);}});
