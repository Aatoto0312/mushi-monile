'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const wait=async fn=>{const until=Date.now()+15000;while(Date.now()<until){if(await fn())return;await new Promise(r=>setTimeout(r,50));}throw Error('supervisor timeout');};
test('operational logs redact arbitrary/private fields and rotate within a fixed bound',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mushi-log-'));
  const log=require('../lib/log.cjs').createLogger({directory:dir,maxBytes:512,files:3});
  for(let i=0;i<50;i++)log({event:'ROOM_CREATED',matchId:'match-'+i,playerId:'P1',turn:i,phase:'MAIN_PHASE',token:'SECRET_TOKEN',hand:['PRIVATE_CARD'],state:{secret:'SECRET_STATE'}});
  const files=fs.readdirSync(dir);assert(files.length<=3);for(const file of files){const text=fs.readFileSync(path.join(dir,file),'utf8');assert(!/SECRET|PRIVATE|token|hand|state/.test(text));assert(fs.statSync(path.join(dir,file)).size<=512);for(const line of text.trim().split('\n')){const event=JSON.parse(line);assert(Number.isInteger(event.turn));assert.equal(event.phase,'MAIN_PHASE');}}
});
test('local supervisor restarts only its own API child and requires authentication to stop',async t=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mushi-supervisor-')),config=path.join(dir,'config.json');fs.writeFileSync(config,JSON.stringify({port:0}));
  const app=require('../supervisor.cjs').createSupervisor({port:0,directory:dir,configFile:config,restartDelayMs:50});await app.start();t.after(()=>app.stop());
  await wait(()=>app.status().childPort>0);const old=app.status().childPid;
  assert(fs.existsSync(path.join(dir,'logs/api')));assert(fs.existsSync(path.join(dir,'logs/supervisor')));
  const base='http://127.0.0.1:'+app.port;assert.equal((await fetch(base+'/status')).status,401);
  assert.equal((await fetch(base+'/status',{headers:{Authorization:'Bearer '+'é'.repeat(43)},signal:AbortSignal.timeout(2000)})).status,401);
  const auth=JSON.parse(fs.readFileSync(path.join(dir,'operations.local.json'),'utf8'));
  assert.equal((await fetch(base+'/status',{headers:{Authorization:'Bearer '+auth.token}})).status,200);
  assert.equal((await require('../operations.cjs').request('status',dir)).status,'running');
  // The PID was obtained directly from the supervisor created in this test.
  process.kill(old);await wait(()=>app.status().childPid&&app.status().childPid!==old&&app.status().childPort>0);
  assert.equal((await fetch('http://127.0.0.1:'+app.status().childPort+'/health')).status,200);
  assert.equal((await fetch(base+'/stop',{method:'POST'})).status,401);
  assert.equal((await fetch(base+'/stop',{method:'POST',headers:{Authorization:'Bearer '+auth.token}})).status,202);
  await wait(()=>app.status().stopped);
});
