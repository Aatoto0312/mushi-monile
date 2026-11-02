'use strict';
// Private IPC only; no management route or credentials on the public listener.
const {createPublicServer}=require('./public.cjs'),{createLogger}=require('./lib/log.cjs');
let api,log;
const send=m=>{if(process.connected)process.send(m);};
process.on('message',async m=>{
  if(m?.type==='START'&&!api){
    try{
      log=createLogger({directory:m.logDirectory});
      api=createPublicServer({port:m.port,log:e=>{try{log(e);}catch{}}});await api.start();
      send({type:'READY',port:api.port});
    }catch{send({type:'START_FAILED'});process.exitCode=1;process.disconnect();}
  }else if(m?.type==='STATUS'&&api){send({type:'STATUS',requestId:m.requestId,status:api.service.operationalStatus()});
  }else if(m?.type==='STOP_IF_IDLE'&&api){
    const s=api.service.operationalStatus();
    if(s.lobbyRooms||s.playingRooms||s.reconnectingPlayers){send({type:'BUSY',requestId:m.requestId});return;}
    // stop sets the listener stopping flag before yielding: no join/check race.
    await api.stop();send({type:'STOPPED',requestId:m.requestId});process.disconnect();
  }else if(m?.type==='TEST_STOP'&&process.env.NODE_ENV==='test'&&api){await api.stop();process.disconnect();}
});
process.on('uncaughtException',()=>{try{log?.({event:'PUBLIC_UNCAUGHT_EXCEPTION'});}finally{process.exit(1);}});
process.on('unhandledRejection',()=>{try{log?.({event:'PUBLIC_UNHANDLED_REJECTION'});}finally{process.exit(1);}});
