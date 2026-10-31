'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{fork,spawn}=require('node:child_process'),{superviseSession}=require('./lib/test-deadline.cjs');
// Parent IPC is required: never run as an unattended task or service.
if(!process.send)throw Error('PRIVATE_CONTROLLER_REQUIRED');
const plan=require('./ngrok-plan.json');require('./lib/ngrok-preparation.cjs').makeEndpointConfig(plan);
const trialDeadline=require('./lib/trial-deadline.cjs').trialDeadline,deadline=trialDeadline(process.env.MUSHI_TRIAL_DEADLINE),session=superviseSession([],{durationMs:deadline.remainingMs}),invite=crypto.randomBytes(24).toString('base64url');let api,agent,readyTimer,configDirectory;
const status=value=>{if(process.connected)process.send({type:'STATUS',status:value});};
session.done.then(reason=>{clearTimeout(readyTimer);status(reason);process.exit();});
process.on('SIGINT',()=>session.stop('SIGNAL'));process.on('SIGTERM',()=>session.stop('SIGNAL'));
process.on('disconnect',()=>session.stop('CONTROLLER_LOST'));process.on('message',m=>{if(m?.type==='STOP')session.stop();});
try{
  const credentialDirectory=path.join(process.env.USERPROFILE,'.mushijingi-online-beta/ngrok'),auth=path.join(credentialDirectory,'auth.yml');
  if(!fs.statSync(auth).isFile())throw Error('AUTH_MISSING');
  // Only token-free endpoint config is written. Credential file stays in place.
  configDirectory=fs.mkdtempSync(path.join(process.env.USERPROFILE,'.mushijingi-online-beta/trial-'));
  const endpoint=path.join(configDirectory,'endpoint.yml');fs.writeFileSync(endpoint,'version: 3\nendpoints:\n  - name: mushijingi-beta-trial\n    url: https://'+plan.hostname+'\n    upstream:\n      url: http://127.0.0.1:8790\n',{flag:'wx'});
  api=fork(path.join(__dirname,'preview-worker.cjs'),[],{windowsHide:true,stdio:['ignore','ignore','ignore','ipc']});session.track(api);
  readyTimer=setTimeout(()=>session.stop('PREVIEW_NOT_READY'),10000);
  api.on('message',m=>{
    if(m?.type==='REPORT'&&process.connected)process.send(m);
    if(m?.type==='FAILED')session.stop('PREVIEW_FAILED');
    if(m?.type==='READY'&&!agent){
      clearTimeout(readyTimer);
      agent=spawn('powershell.exe',['-NoProfile','-NonInteractive','-File',path.join(__dirname,'Run-OwnedAgent.ps1'),'-AgentPath',path.join(process.env.LOCALAPPDATA,'Microsoft/WindowsApps/ngrok.exe'),'-AuthPath',auth,'-EndpointPath',endpoint,'-GuardianId',String(process.pid),'-DurationMs',String(trialDeadline(deadline.iso).remainingMs)],{windowsHide:true,stdio:'ignore'});session.track(agent,true);
      if(process.connected)process.send({type:'INVITE',invite});status('RUNNING_MAX_30_MINUTES');
    }
  });api.send({type:'START',inviteToken:invite});
}catch{status('PREPARATION_FAILED');session.stop('PREPARATION_FAILED');}
