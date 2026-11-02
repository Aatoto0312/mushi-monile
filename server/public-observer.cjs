'use strict';
const fs=require('node:fs'),path=require('node:path'),{fork}=require('node:child_process'),{createLogger}=require('./lib/log.cjs');
function createPublicObserver({directory,port=8791,intervalMs=10000,testMode=false}){
  if(!path.isAbsolute(directory)||!Number.isInteger(port)||port<0||port>65535||intervalMs<100)throw Error('OPERATIONS_CONFIG');
  fs.mkdirSync(directory,{recursive:true});
  const log=createLogger({directory:path.join(directory,'logs')}),pending=new Map();let child,timer,seq=0,boundPort=port,exited;
  let state={running:false,automaticRestart:false};
  function persist(){const temp=path.join(directory,'status.json.tmp');fs.writeFileSync(temp,JSON.stringify({...state,at:new Date().toISOString()},null,2)+'\n',{mode:0o600});fs.renameSync(temp,path.join(directory,'status.json'));}
  function request(type){if(!child?.connected)return Promise.reject(Error('API_NOT_CONNECTED'));return new Promise((resolve,reject)=>{const id=++seq,deadline=setTimeout(()=>{pending.delete(id);reject(Error('STATUS_UNAVAILABLE'));},5000);pending.set(id,{resolve:m=>{clearTimeout(deadline);resolve(m);},reject});child.send({type,requestId:id});});}
  async function refresh(){const m=await request('STATUS');state={...state,...m.status};persist();return {...state};}
  async function start(){
    if(child)throw Error('ALREADY_STARTED');
    child=fork(path.join(__dirname,'public-worker.cjs'),[],{windowsHide:true,stdio:['ignore','ignore','ignore','ipc'],env:{...process.env,NODE_ENV:testMode?'test':'production'}});
    exited=new Promise(resolve=>child.once('exit',(code,signal)=>{clearInterval(timer);state={...state,running:false,exitCode:code,exitSignal:signal||null};persist();log({event:'PUBLIC_API_EXIT',phase:signal||'CODE_'+code});for(const p of pending.values())p.reject(Error('API_EXITED'));pending.clear();resolve();}));
    child.on('message',m=>{const p=pending.get(m?.requestId);if(p){pending.delete(m.requestId);p.resolve(m);}});
    await new Promise((resolve,reject)=>{const deadline=setTimeout(()=>reject(Error('API_START_TIMEOUT')),10000);const ready=m=>{if(m.type==='READY'){clearTimeout(deadline);child.off('message',ready);boundPort=m.port;resolve();}else if(m.type==='START_FAILED'){clearTimeout(deadline);reject(Error('API_START_FAILED'));}};child.on('message',ready);child.once('error',reject);child.send({type:'START',port,logDirectory:path.join(directory,'logs')});});
    state={running:true,pid:child.pid,startedAt:new Date().toISOString(),port:boundPort,automaticRestart:false};log({event:'PUBLIC_API_STARTED'});await refresh();
    timer=setInterval(()=>refresh().catch(()=>{state.statusUnavailableAt=new Date().toISOString();persist();}),intervalMs);timer.unref();
  }
  async function stopIfIdle(){const m=await request('STOP_IF_IDLE');if(m.type==='BUSY')return false;await exited;return true;}
  async function stopForTest(){if(!testMode)throw Error('TEST_ONLY');if(child?.connected){child.send({type:'TEST_STOP'});await exited;}}
  return {start,refresh,stopIfIdle,stopForTest,get port(){return boundPort;}};
}
// Manual foreground operation only. No task/service registration or auto-restart.
if(require.main===module){const app=createPublicObserver({directory:process.argv[2]||path.join(require('node:os').homedir(),'.mushijingi-online-beta','public-observer')});app.start().then(()=>console.log('OBSERVED_PUBLIC_API_READY')).catch(()=>{console.error('OBSERVED_PUBLIC_API_START_FAILED');process.exitCode=1;});}
module.exports={createPublicObserver};
