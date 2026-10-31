'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),http=require('node:http');
test('development frontend exposes public files and refuses repo/private paths',async t=>{
  const {createDevServer}=require('../dev.cjs');const app=createDevServer({port:0,apiPort:0});await app.start();t.after(()=>app.stop());
  const base='http://127.0.0.1:'+app.port;
  assert.equal((await fetch(base+'/index.html')).status,200);
  assert.equal((await fetch(base+'/toolbox.html')).status,200);
  for(const path of ['/online-b.html','/battle-ui/board.js','/battle-ui/presentation.js','/battle-ui/board.css','/prototype-b/style.css'])assert.equal((await fetch(base+path)).status,200,path);
  for(const path of ['/prototype-b/app.js','/prototype-b/model.js','/prototype-b/trial.cjs','/battle-ui/presentation.test.cjs'])assert.equal((await fetch(base+path)).status,404,path);
  const contract=await (await fetch(base+'/online/contract.json')).json();assert.equal(contract.protocol,'mushi-online/1');
  for(const path of ['/server/package.json','/.git/config','/docs/online-beta/design.md','/.ai-worker/state','/server/node_modules/ws/index.js','/online/config.local.json','/online/%2e%2e/server/package.json']){
    assert.equal(await new Promise(resolve=>http.get(base+path,r=>{r.resume();resolve(r.statusCode);})),404,path);
  }
  assert.equal((await fetch('http://127.0.0.1:'+app.apiPort+'/health')).status,200);
});
