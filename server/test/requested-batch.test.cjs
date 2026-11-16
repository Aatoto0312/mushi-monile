'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const rt=require('../lib/runtime.cjs'),make=rt.createRuntime,{cases}=require('../../tests/fixtures/requested-batch-scenarios.cjs');let scenario,state;
rt.createRuntime=()=>{const r=make(),start=r.start;r.start=(...args)=>{const s=start(...args);scenario.setup(r.context,s,scenario.id);state=s;return s;};return r;};
const gateway=require('../lib/gateway.cjs'),apply=gateway.applyCapability;gateway.applyCapability=(...args)=>{state=apply(...args);return state;};
const {createRoomService}=require('../lib/rooms.cjs');
function client(service){const messages=[],session=service.connect(m=>messages.push(m));let n=0;return {session,last:t=>messages.filter(m=>m.type===t).at(-1),send(type,data={}){service.receive(session,{type,requestId:'batch_'+String(++n).padStart(8,'0'),versions:rt.VERSIONS,...data});}};}
for(const item of cases)test(item.id+' authoritative effects, observer privacy, pending reconnect and duplicate protection',()=>{
 scenario=item;const service=createRoomService({rng:()=>0});try{
 let a=client(service),b=client(service);const watcher=client(service);a.send('CREATE');const auth={P1:a.last('SESSION')};b.send('JOIN',{code:auth.P1.roomCode});auth.P2=b.last('SESSION');watcher.send('WATCH',{code:auth.P1.roomCode});
 for(const p of [a,b])p.send('DECK',{version:p.last('VIEW').room.version,preset:'KABUTOMUSHI'});
 for(const p of [a,b])p.send('READY',{version:p.last('VIEW').room.version,ready:true});
 let n=0;function act(p,id,refs=[]){const message={type:'ACTION',requestId:'batch_op_'+String(++n).padStart(8,'0'),versions:rt.VERSIONS,version:p.last('VIEW').room.version,actionId:id,selectedRefs:refs};service.receive(p.session,message);assert(!p.last('ERROR'),JSON.stringify(p.last('ERROR')));const version=p.last('VIEW').room.version;service.receive(p.session,message);assert.equal(p.last('VIEW').room.version,version);assert.equal(p.last('ACK').duplicate,true);}
 const view=a.last('VIEW').battle,source=[...view.players.P1.field,...view.players.P1.hand].find(x=>x.cardId===item.id);assert(source,item.id);
 const kind=item.id==='set8_003'?'ALTERNATIVE':item.id==='set5_054'?'ENHANCE':item.id==='set6_063'||item.id==='set6_064'||item.id==='set7_064'?'SPELL':'ATTACK';
 const options=view.actions.filter(x=>x.kind===kind&&x.sourceRef===source.ref),action=kind==='ATTACK'?options.at(-1):options[0];assert(action,item.id+' action');act(a,action.id);
 let resumed=false,steps=0;
 while(state.pendingEffect&&steps++<30){let owner=state.pendingEffect.playerId,p=owner==='P1'?a:b;const other=owner==='P1'?b:a;assert.equal(other.last('VIEW').battle.decision,null);assert.equal(watcher.last('VIEW').battle.decision,null);
   if(!resumed){service.disconnect(p.session);p=client(service);p.send('RESUME',{code:auth[owner].roomCode,token:auth[owner].token});assert(!p.last('ERROR'));if(owner==='P1')a=p;else b=p;resumed=true;}
   const battle=p.last('VIEW').battle,d=battle.decision;if(d){const refs=d.combinations?.[0]||d.options.slice(0,Math.max(d.min,Math.min(1,d.max))).map(x=>x.ref);act(p,d.actionId,refs);}else{const choices=battle.actions.filter(x=>x.kind==='CHOICE'||x.kind==='TERRITORY_CHOICE');const choice=choices.find(x=>x.label.includes('コストを支払わず使用'))||choices[0];assert(choice,'pending choice '+state.pendingEffect.type);act(p,choice.id);}
 }
 assert.equal(state.pendingEffect,null);assert(!state.freeCardUse);assert.equal(watcher.last('VIEW').room.version,a.last('VIEW').room.version);
 if(item.id==='set6_063'){assert(state.player('P1').field.some(x=>x.cardId==='namitentou'));assert(a.last('VIEW').battle.publicLog.some(x=>x.text.includes('山札のカードを公開')));}
 if(item.id==='set6_064'){assert(state.player('P2').field[0].currentHp<5000);assert.equal(state.player('P1').availableCost,20-make().context.getCardDefinition(item.id).cost);assert(watcher.last('VIEW').battle.publicLog.some(x=>x.text.includes('塵芥虫の爆熱弾')));}
 if(item.id==='set5_054'){const host=state.player('P1').field[0];assert.equal(host.attachments[0].cardId,item.id);assert(host.runtimeFlags.suppressKeywordSkills);}
 if(item.id==='set7_064'){assert.equal(state.player('P1').field[0].attackedThisTurn,false);assert.equal(state.player('P1').field[0].attachments.length,1);}
 if(item.id==='set7_004')assert(state.player('P2').field[0].runtimeFlags.destroyOnNextDamage);
 if(item.id==='set8_003'){assert(state.player('P1').field.some(x=>x.cardId===item.id));assert.equal(state.player('P1').availableCost,0);}
 if(item.id==='set6_001')assert.equal(state.player('P1').field.find(x=>x.cardId===item.id).attachments.length,1);
 if(item.id==='set8_013')assert(state.player('P2').field[0].currentHp<3000);
 for(const player of Object.values(watcher.last('VIEW').battle.players)){assert(!Object.hasOwn(player,'deck'));for(const card of [...player.hand,...player.food])if(card.hidden)assert.deepEqual(Object.keys(card).sort(),['hidden','label','ref','zone']);}
 service.disconnect(a.session);a=client(service);a.send('RESUME',{code:auth.P1.roomCode,token:auth.P1.token});assert(!a.last('ERROR'));assert.equal(a.last('VIEW').battle.phase,state.phase);
 }finally{service.close();}
});
