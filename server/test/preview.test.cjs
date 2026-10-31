'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{WebSocket}=require('ws');
test('preview invite gate protects assets and WS, permits exact-origin authenticated viewers only',async t=>{
  const app=require('../preview.cjs').createPreview({port:0,inviteToken:'TEST_INVITE_NOT_A_REAL_SECRET_12345'});await app.start();t.after(()=>app.stop());const base='http://127.0.0.1:'+app.port;
  let response=await fetch(base+'/online.html');assert.equal(response.status,200);assert((await response.text()).includes('試験参加コード'));assert.equal((await fetch(base+'/js/cards/starter-cards.js')).status,401);
  response=await fetch(base+'/access',{method:'POST',headers:{'Content-Type':'application/json','Origin':base},body:JSON.stringify({invite:'wrong'})});assert.equal(response.status,403);
  response=await fetch(base+'/access',{method:'POST',headers:{'Content-Type':'application/json','Origin':base},body:JSON.stringify({invite:'TEST_INVITE_NOT_A_REAL_SECRET_12345'})});assert.equal(response.status,204);const cookie=response.headers.get('set-cookie').split(';')[0];assert(response.headers.get('set-cookie').includes('HttpOnly'));const headers={Cookie:cookie};
  for(const url of ['/online.html','/online/config.json','/online/contract.json','/js/cards/starter-cards.js'])assert.equal((await fetch(base+url,{headers})).status,200,url);
  let bytes=app.metrics().httpSentBytes;assert.equal((await fetch(base+'/online.html',{method:'HEAD',headers})).status,200);assert.equal(app.metrics().httpSentBytes,bytes);
  assert.equal((await fetch(base+'/health',{headers})).status,200);assert(app.metrics().httpSentBytes>bytes);
  for(const url of ['/server/index.cjs','/docs/online-beta/progress.md','/.git/config','/online/../server/config.local.json'])assert.equal((await fetch(base+url,{headers})).status,404,url);
  const connect=(origin,cookie)=>new Promise(resolve=>{const ws=new WebSocket(base.replace('http:','ws:')+'/ws','mushi-online-v1',{headers:{Origin:origin,...cookie?{Cookie:cookie}:{}}});ws.on('message',()=>{ws.terminate();resolve(101);});ws.on('unexpected-response',(_,r)=>{r.resume();ws.terminate();resolve(r.statusCode);});ws.on('error',()=>{});});
  assert.equal(await connect(base,cookie),101);assert.equal(await connect('https://evil.invalid',cookie),403);assert.equal(await connect(base,null),403);assert(app.metrics().httpRequests>0);assert(app.metrics().wsSentBytes>0);
});
