'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const runtimeModule = require('../lib/runtime.cjs');
const createRuntime = runtimeModule.createRuntime;
runtimeModule.createRuntime = function () {
  const runtime = createRuntime(), start = runtime.start;
  runtime.start = (...args) => {
    const state = start(...args), c = runtime.context;
    state.phase='MAIN_PHASE'; state.turnNumber=3; state.activePlayerId='P1';
    for(const pid of state.playerOrder)for(const zone of ['hand','field','food','territory','discard'])state.player(pid)[zone]=[];
    function card(id,player,zone) {
      const d=c.getCardDefinition(id);
      return new c.CardInstance({cardId:id,instanceId:state.nextInstanceId(),ownerId:player,controllerId:player,zone,baseHp:d.baseHp,currentHp:d.baseHp});
    }
    const source=card('set6_019','P1','FIELD');
    source.attachments.push(card('set7_054','P1','FIELD'));
    state.player('P1').field.push(source);
    for(let n=0;n<3;n++)state.player('P2').territory.push(card('set6_016','P2','TERRITORY'));
    return state;
  };
  return runtime;
};
const {createRoomService}=require('../lib/rooms.cjs');
function client(service) {
  const replies=[],session=service.connect(message=>replies.push(message));
  let request=0;
  return {
    session,last:type=>replies.filter(message=>message.type===type).at(-1),
    send(type,data={}) {
      service.receive(session,{type,requestId:'mandible_'+String(++request).padStart(8,'0'),versions:runtimeModule.VERSIONS,...data});
      assert(!replies.some(message=>message.type==='ERROR'),JSON.stringify(replies.filter(message=>message.type==='ERROR')));
    }
  };
}
test('Dual mandibles room resumes each private territory draw and rejects double processing',()=>{
 const service=createRoomService({rng:()=>0});
 try{
  const a=client(service),watcher=client(service);let b=client(service);
  a.send('CREATE');const code=a.last('SESSION').roomCode;b.send('JOIN',{code});watcher.send('WATCH',{code});
  const token=b.last('SESSION').token;
  for(const player of [a,b])player.send('DECK',{version:player.last('VIEW').room.version,preset:'KABUTOMUSHI'});
  for(const player of [a,b])player.send('READY',{version:player.last('VIEW').room.version,ready:true});
  const actor=a.last('VIEW'),attack=actor.battle.actions.find(action=>action.kind==='ATTACK'&&action.skill?.name==='大顎二刀');
  a.send('ACTION',{version:actor.room.version,actionId:attack.id,selectedRefs:[]});
  for(let draw=0;draw<2;draw++){
   assert.equal(a.last('VIEW').battle.decision,null);assert.equal(watcher.last('VIEW').battle.decision,null);
   service.disconnect(b.session);b=client(service);b.send('RESUME',{code,token});
   const view=b.last('VIEW'),d=view.battle.decision;assert.equal(d.options.length,3-draw);
   const command={type:'ACTION',requestId:'mandible_draw_0000000'+draw,versions:runtimeModule.VERSIONS,version:view.room.version,actionId:d.actionId,selectedRefs:[d.options[0].ref]};
   service.receive(b.session,command);assert(!b.last('ERROR'));
   const version=b.last('VIEW').room.version;
   service.receive(b.session,command);assert.equal(b.last('VIEW').room.version,version);assert(b.last('ACK').duplicate);
  }
  assert.equal(b.last('VIEW').battle.decision,null);
  assert.equal(b.last('VIEW').battle.players.P2.counts.territory,1);
 }finally{service.close();}
});
