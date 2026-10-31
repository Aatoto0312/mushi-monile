'use strict';
// Call only after human approval, from an operator-owned visible terminal.
const path=require('node:path'),fs=require('node:fs'),net=require('node:net'),{fork}=require('node:child_process');
function validateLaunch(args,interactive){if(args.length!==1||args[0]!=='--approved-30-minute-test')throw Error('APPROVAL_REQUIRED');if(!interactive)throw Error('INTERACTIVE_CONSOLE_REQUIRED');}
function launch(){
  validateLaunch(process.argv.slice(2),!!process.stdin.isTTY&&!!process.stdout.isTTY);
  const createdAt=new Date(),deadline=require('./lib/trial-deadline.cjs').trialDeadline(process.env.MUSHI_TRIAL_DEADLINE,+createdAt),directory=fs.mkdtempSync(path.join(process.env.USERPROFILE,'.mushijingi-online-beta/operator-'));
  const reportPath=path.join(directory,'state.json'),state={createdAt:createdAt.toISOString(),deadlineAt:deadline.iso,controllerPid:process.pid,status:'STARTING'};
  const save=()=>fs.writeFileSync(reportPath,JSON.stringify(state,null,2));let companion,ending=false;save();
  const child=fork(path.join(__dirname,'test-session-guardian.cjs'),[],{env:{...process.env,MUSHI_TRIAL_DEADLINE:deadline.iso},windowsHide:true,stdio:['ignore','ignore','ignore','ipc']});
  state.guardianPid=child.pid;save();
  child.on('message',m=>{
    if(m.type==='INVITE'){
      console.log('Temporary preview: https://'+require('./ngrok-plan.json').hostname+'/online.html');console.log('Trial invite (operator screen only, never send authtoken): '+m.invite);
      companion=fork(path.join(__dirname,'tools/operator-companion.cjs'),[],{windowsHide:true,stdio:['ignore','ignore','ignore','ipc']});state.companionPid=companion.pid;
      companion.on('message',event=>{state.pc=event;state.pcUpdatedAt=new Date().toISOString();if(event.type==='PC_ROOM_READY'){state.roomCode=event.code;state.publicConfirmedAt=new Date().toISOString();console.log('iPhone: join room '+event.code+' and choose KABUTOMUSHI.');}if(event.type==='PC_ERROR'&&!ending){console.log('PC error; stopping trial safely.');stop();}save();});
      companion.send({type:'START',invite:m.invite});
    }
    else if(m.type==='STATUS'){state.status=m.status;console.log('Trial status: '+m.status);}
    else if(m.type==='REPORT'){state.report=m.report;console.log('Application payload counters: '+JSON.stringify(m.report.metrics));}
    save();
  });
  const stop=()=>{if(ending)return;ending=true;state.stopRequestedAt=new Date().toISOString();save();if(child.connected)child.send({type:'STOP'});};
  const stopPoll=setInterval(()=>{if(fs.existsSync(path.join(directory,'STOP')))stop();},250);
  process.on('SIGINT',stop);process.on('SIGTERM',stop);
  child.on('exit',async()=>{
    ending=true;clearInterval(stopPoll);if(companion?.connected)companion.send({type:'STOP'});
    state.stoppedAt=new Date().toISOString();
    state.localPortClosed=await new Promise(resolve=>{const socket=net.connect({host:'127.0.0.1',port:8790});socket.on('connect',()=>{socket.destroy();resolve(false);});socket.on('error',()=>resolve(true));});
    for(let i=0;i<3;i++){try{const r=await fetch('https://'+require('./ngrok-plan.json').hostname+'/online.html',{headers:{'ngrok-skip-browser-warning':'1'},signal:AbortSignal.timeout(5000)}),body=await r.text();state.externalStopCheck={httpStatus:r.status,offlineConfirmed:body.includes('ERR_NGROK_3200')||r.headers.get('ngrok-error-code')==='ERR_NGROK_3200'};if(state.externalStopCheck.offlineConfirmed)break;}catch{state.externalStopCheck={networkUnreachable:true,offlineConfirmed:false};}await new Promise(r=>setTimeout(r,1000));}
    save();console.log('Trial stopped; sanitized report: '+reportPath);process.exit();
  });
}
if(require.main===module)try{launch();}catch{console.error('Not started: explicit approval and a private interactive console are required.');process.exitCode=1;}
module.exports={validateLaunch};
