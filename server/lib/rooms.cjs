'use strict';
const crypto=require('node:crypto'),{createRuntime,VERSIONS}=require('./runtime.cjs'),{prepareView,applyCapability}=require('./gateway.cjs');
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const PUBLIC_ERRORS=new Set(['MESSAGE_INVALID','VERSION_MISMATCH','ROOM_UNAVAILABLE','ROOM_FULL','ROOM_LIMIT','AUTH_INVALID','ALREADY_BOUND','STALE_STATE','OPERATION_REUSED','NOT_DECISION_OWNER','ROOM_STATE','PEER_DISCONNECTED','DECK_INVALID','DECK_VERSION','ACTION_INVALID','SELECTION_INVALID','RATE_LIMIT','SPECTATOR_LIMIT','SPECTATOR_READ_ONLY']);
const FIELDS={CREATE:['name'],JOIN:['code','name'],WATCH:['code'],RESUME:['code','token'],DECK:['version','preset','deck'],READY:['version','ready'],ACTION:['version','actionId','selectedRefs'],RESIGN:['version'],LEAVE:['version'],SYNC:[]};
const fail=code=>{throw Error(code);};
function createRoomService(options={}){
  const now=options.now||Date.now,rooms=new Map(),sessions=new Map(),bootId=crypto.randomUUID(),catalog=createRuntime(),logger=options.log||(()=>{});
  const maxRooms=options.maxRooms||8,maxSessions=options.maxSessions||32,grace=options.disconnectGraceMs||300000,creationTimes=[],lookupTimes=[];
  function log(kind,room,playerId){logger({event:kind,matchId:room&&room.matchId,playerId,version:room&&room.version,turn:room&&room.state&&room.state.turnNumber,phase:room&&room.state&&room.state.phase,engine:VERSIONS.engine,cards:VERSIONS.cards});}
  function send(session,message){if(session&&!session.closed)try{session.send(message);}catch{/* socket close handles presence */}}
  function connect(output,close=()=>{}){
    if(sessions.size>=maxSessions)throw Error('RATE_LIMIT');
    const session={id:crypto.randomUUID(),send:output,close,closed:false,roomCode:null,playerId:null,received:[]};sessions.set(session.id,session);
    send(session,{type:'HELLO',bootId,versions:VERSIONS,catalogCount:catalog.meta.catalogCount,playableCount:catalog.meta.playableCount,playableIds:catalog.definitions.map(d=>d.id),presets:Object.entries(catalog.context.STARTER_DECK_RECIPES).map(([id,r])=>({id,name:r.name}))});
    return session;
  }
  function getRoom(code){if(typeof code!=='string')fail('ROOM_UNAVAILABLE');const normalized=code.replaceAll('-','').toUpperCase();if(!/^\d{6}$/.test(normalized)||!rooms.has(normalized))fail('ROOM_UNAVAILABLE');return rooms.get(normalized);}
  function bind(session,room,seat){session.roomCode=room.code;session.playerId=seat.id;seat.sessionId=session.id;seat.connected=true;seat.disconnectedAt=null;}
  function newSeat(session,room,id,name){const token=crypto.randomBytes(32).toString('base64url'),seat={id,name:Array.from(String(name||'プレイヤー').normalize('NFKC').replace(/[\u0000-\u001f\u007f]/g,'').trim()).slice(0,24).join('')||'プレイヤー',tokenHash:hash(token),ready:false,deck:null,receipts:new Map()};room.players[id]=seat;bind(session,room,seat);send(session,{type:'SESSION',roomCode:room.code,playerId:id,token,bootId,role:'PLAYER'});return seat;}
  function members(room){return [...Object.values(room.players),...Object.values(room.watchers)];}
  function member(room,id){return room.players[id]||room.watchers[id];}
  function bump(room){room.version++;room.cache.clear();room.lastActiveAt=now();}
  function paused(room){return room.phase==='PLAYING'&&Object.values(room.players).some(seat=>!seat.connected);}
  function assessProgress(room){
    if(room.phase!=='PLAYING'||!room.state)return;
    const owner=room.state.pendingEffect?room.state.pendingEffect.playerId:room.state.activePlayerId;
    const prepared=prepareView(room.runtime,room.state,owner);
    if(prepared.view.blockedReason){room.phase='ABORTED';room.reason='ENGINE_BLOCKED';room.endedAt=now();log('ENGINE_BLOCKED',room,owner);}
  }
  function snapshot(room,pid){
    if(room.cache.has(pid))return room.cache.get(pid);
    const prepared=room.state?prepareView(room.runtime,room.state,room.watchers[pid]?'SPECTATOR':pid):null;
    if(prepared&&(room.phase!=='PLAYING'||paused(room))){prepared.view.actions=[];prepared.view.decision=null;prepared.capabilities.clear();}
    const result={message:{type:'VIEW',room:{code:room.code,matchId:room.matchId,version:room.version,phase:room.phase,reason:room.reason||null,result:room.result||null,paused:paused(room),spectatorCount:Object.values(room.watchers).filter(w=>w.connected).length,players:Object.values(room.players).map(seat=>({id:seat.id,name:seat.name,connected:!!seat.connected,ready:seat.ready,deckSelected:!!seat.deck,...(seat.id===pid&&seat.deck?{deckName:String(seat.deck.deckName||'保存デッキ').slice(0,80)}:{})}))},battle:prepared&&prepared.view},capabilities:prepared?prepared.capabilities:new Map()};
    room.cache.set(pid,result);return result;
  }
  function broadcast(room){for(const seat of members(room)){const session=sessions.get(seat.sessionId);if(session&&seat.connected)send(session,snapshot(room,seat.id).message);}}
  function ack(session,requestId,room,extra={}){const value={type:'ACK',requestId,version:room?room.version:0,...extra};send(session,value);return value;}
  function receive(session,message){
    const requestId=message&&message.requestId;
    try{
      if(!session||session.closed||!sessions.has(session.id))fail('AUTH_INVALID');
      session.received=session.received.filter(time=>time>now()-60000);if(session.received.length>=(options.messagesPerMinute||600))fail('RATE_LIMIT');session.received.push(now());
      if(!message||typeof message!=='object'||Array.isArray(message)||!FIELDS[message.type]||typeof requestId!=='string'||!/^[A-Za-z0-9_-]{8,64}$/.test(requestId)||Object.keys(message).some(k=>!['type','requestId','versions',...FIELDS[message.type]].includes(k)))fail('MESSAGE_INVALID');
      if(!message.versions||Object.keys(VERSIONS).some(k=>message.versions[k]!==VERSIONS[k]))fail('VERSION_MISMATCH');
      if(['CREATE','JOIN','WATCH','RESUME'].includes(message.type)){
        if(message.name!==undefined&&(typeof message.name!=='string'||message.name.length>200))fail('MESSAGE_INVALID');
        if(session.roomCode)fail('ALREADY_BOUND');
        if(message.type!=='CREATE'){
          session.lookups=(session.lookups||[]).filter(time=>time>now()-60000);
          while(lookupTimes.length&&lookupTimes[0]<=now()-60000)lookupTimes.shift();
          if(session.lookups.length>=10||lookupTimes.length>=120)fail('RATE_LIMIT');
          session.lookups.push(now());lookupTimes.push(now());
        }
        let room;
        if(message.type==='CREATE'){
          while(creationTimes.length&&creationTimes[0]<now()-300000)creationTimes.shift();if(rooms.size>=maxRooms||creationTimes.length>=10)fail('ROOM_LIMIT');creationTimes.push(now());
          let code;do{code=String(crypto.randomInt(100000,1000000));}while(rooms.has(code));
          room={code,matchId:crypto.randomUUID(),phase:'LOBBY',version:1,players:{},watchers:{},cache:new Map(),createdAt:now(),lastActiveAt:now(),runtime:createRuntime(),state:null};rooms.set(code,room);newSeat(session,room,'P1',message.name);log('ROOM_CREATED',room,'P1');
        }else{
          room=getRoom(message.code);
          if(message.type==='JOIN'){
            if(['ENDED','ABORTED','CLOSED'].includes(room.phase))fail('ROOM_STATE');if(room.phase!=='LOBBY'||room.players.P2)fail('ROOM_FULL');newSeat(session,room,'P2',message.name);bump(room);log('ROOM_JOINED',room,'P2');
          }else if(message.type==='WATCH'){
            if(!['LOBBY','PLAYING'].includes(room.phase))fail('ROOM_STATE');
            if(Object.keys(room.watchers).length>=(options.maxSpectators||3))fail('SPECTATOR_LIMIT');
            const token=crypto.randomBytes(32).toString('base64url'),id='W'+crypto.randomBytes(8).toString('hex');
            const watcher={id,tokenHash:hash(token)};room.watchers[id]=watcher;bind(session,room,watcher);bump(room);
            send(session,{type:'SESSION',roomCode:room.code,playerId:id,role:'SPECTATOR',token,bootId});log('WATCH_JOINED',room);
          }else{
            if(typeof message.token!=='string'||message.token.length>128)fail('AUTH_INVALID');const wanted=hash(message.token),seat=members(room).find(p=>crypto.timingSafeEqual(Buffer.from(p.tokenHash,'hex'),Buffer.from(wanted,'hex')));if(!seat)fail('AUTH_INVALID');
            const previous=sessions.get(seat.sessionId);if(previous){previous.roomCode=null;previous.playerId=null;previous.closed=true;sessions.delete(previous.id);previous.close(4001,'SESSION_REPLACED');}
            bind(session,room,seat);bump(room);send(session,{type:'SESSION',roomCode:room.code,playerId:seat.id,role:room.watchers[seat.id]?'SPECTATOR':'PLAYER',bootId});log('RECONNECTED',room,seat.id);
          }
        }
        ack(session,requestId,room);broadcast(room);return;
      }
      const room=getRoom(session.roomCode),seat=member(room,session.playerId);if(!seat||seat.sessionId!==session.id)fail('AUTH_INVALID');
      if(message.type==='SYNC'){ack(session,requestId,room);send(session,snapshot(room,seat.id).message);return;}
      if(room.watchers[seat.id]){
        if(message.type!=='LEAVE')fail('SPECTATOR_READ_ONLY');
        if(message.version!==room.version)fail('STALE_STATE');
        delete room.watchers[seat.id];session.roomCode=null;session.playerId=null;bump(room);ack(session,requestId,room);broadcast(room);return;
      }
      const digest=hash(JSON.stringify(message)),receipt=seat.receipts.get(requestId);
      if(receipt){if(receipt.digest!==digest)fail('OPERATION_REUSED');send(session,{...receipt.ack,duplicate:true});send(session,snapshot(room,seat.id).message);return;}
      if(!Number.isSafeInteger(message.version)||message.version!==room.version)fail('STALE_STATE');
      if(message.type==='DECK'){
        if(room.phase!=='LOBBY')fail('ROOM_STATE');if(!!message.preset===!!message.deck)fail('DECK_INVALID');const deck=message.preset?room.runtime.preset(message.preset):message.deck;room.runtime.validateDeck(deck);seat.deck=JSON.parse(JSON.stringify(deck));seat.ready=false;bump(room);log('DECK_VALIDATED',room,seat.id);
      }else if(message.type==='READY'){
        if(room.phase!=='LOBBY'||typeof message.ready!=='boolean')fail('ROOM_STATE');if(message.ready&&!seat.deck)fail('DECK_INVALID');seat.ready=message.ready;
        if(Object.keys(room.players).length===2&&Object.values(room.players).every(p=>p.connected&&p.ready&&p.deck)){room.state=room.runtime.start(room.players.P1.deck,room.players.P2.deck,options.rng);room.phase='PLAYING';log('MATCH_STARTED',room);}
        assessProgress(room);bump(room);
      }else if(message.type==='ACTION'){
        if(room.phase!=='PLAYING')fail('ROOM_STATE');if(paused(room))fail('PEER_DISCONNECTED');
        const owner=room.state.pendingEffect?room.state.pendingEffect.playerId:room.state.activePlayerId;if(owner!==seat.id)fail('NOT_DECISION_OWNER');
        if(typeof message.actionId!=='string'||message.actionId.length>64||!Array.isArray(message.selectedRefs)||message.selectedRefs.length>40)fail('MESSAGE_INVALID');
        const cache=snapshot(room,seat.id),cap=cache.capabilities.get(message.actionId);room.state=applyCapability(room.runtime,room.state,cache.capabilities,message.actionId,message.selectedRefs);
        if(room.state.phase==='GAME_OVER'){room.phase='ENDED';room.result={winner:room.state.winner,reason:'GAME_OVER'};room.endedAt=now();}
        assessProgress(room);bump(room);log(cap?cap.operation.kind:'ACTION',room,seat.id);
      }else if(message.type==='RESIGN'||message.type==='LEAVE'){
        if(room.phase==='PLAYING'){room.phase='ENDED';room.result={winner:seat.id==='P1'?'P2':'P1',reason:'RESIGNED'};room.endedAt=now();bump(room);log('RESIGNED',room,seat.id);}
        else if(room.phase==='LOBBY'){
          if(seat.id==='P1'){room.phase='CLOSED';room.reason='HOST_LEFT';room.endedAt=now();bump(room);}
          else{delete room.players.P2;session.roomCode=null;session.playerId=null;if(room.players.P1)room.players.P1.ready=false;bump(room);}
        }else if(message.type!=='LEAVE')fail('ROOM_STATE');
        if(message.type==='LEAVE'){
          seat.connected=false;seat.sessionId=null;seat.tokenHash=hash(crypto.randomBytes(32).toString('base64url'));
          session.roomCode=null;session.playerId=null;bump(room);log('LEFT',room,seat.id);
        }
      }else fail('MESSAGE_INVALID');
      const result=ack(session,requestId,room);seat.receipts.set(requestId,{digest,ack:result});while(seat.receipts.size>128)seat.receipts.delete(seat.receipts.keys().next().value);broadcast(room);
    }catch(error){const code=PUBLIC_ERRORS.has(error.message)?error.message:'ENGINE_REJECTED';send(session,{type:'ERROR',requestId:typeof requestId==='string'?requestId.slice(0,64):null,code});if(session&&session.roomCode&&rooms.has(session.roomCode))send(session,snapshot(rooms.get(session.roomCode),session.playerId).message);}
  }
  function disconnect(session){if(!session||session.closed)return;session.closed=true;sessions.delete(session.id);const room=rooms.get(session.roomCode),seat=room&&member(room,session.playerId);if(seat&&seat.sessionId===session.id){seat.connected=false;seat.sessionId=null;seat.disconnectedAt=now();bump(room);log('DISCONNECTED',room,seat.id);broadcast(room);}}
  function sweep(){for(const room of rooms.values()){
    for(const watcher of Object.values(room.watchers))if(!watcher.connected&&watcher.disconnectedAt!=null&&now()-watcher.disconnectedAt>grace){delete room.watchers[watcher.id];bump(room);}
    if(room.phase==='PLAYING'&&Object.values(room.players).some(p=>!p.connected&&p.disconnectedAt!=null&&now()-p.disconnectedAt>grace)){room.phase='ABORTED';room.reason='PEER_TIMEOUT';room.endedAt=now();bump(room);log('MATCH_ABORTED',room);broadcast(room);}
    if(room.phase==='LOBBY'&&now()-room.lastActiveAt>1800000||room.phase==='PLAYING'&&now()-room.createdAt>7200000){room.phase='ABORTED';room.reason='ROOM_EXPIRED';room.endedAt=now();bump(room);broadcast(room);}
    if(room.endedAt!=null&&now()-room.endedAt>300000){rooms.delete(room.code);for(const seat of members(room)){const session=sessions.get(seat.sessionId);if(session){session.roomCode=null;session.playerId=null;send(session,{type:'ROOM_EXPIRED'});}}}
  }}
  function close(){for(const room of rooms.values()){if(room.phase==='PLAYING'||room.phase==='LOBBY'){room.phase='ABORTED';room.reason='SERVER_RESTART';bump(room);broadcast(room);}}for(const session of sessions.values()){send(session,{type:'SERVER_STOPPING',bootId});session.close(1012,'SERVER_RESTART');session.closed=true;}sessions.clear();rooms.clear();}
  return {connect,receive,disconnect,sweep,close,bootId,meta:catalog.meta,stats:()=>({rooms:rooms.size,sessions:sessions.size})};
}
module.exports={createRoomService};
