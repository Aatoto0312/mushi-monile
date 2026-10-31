'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{fork}=require('node:child_process'),path=require('node:path');
test('private IPC companion creates a room and readies through real browser UI without exposing invite',async t=>{
  const invite='LOCAL_TEST_INVITE_NOT_REAL_123456',app=require('../preview.cjs').createPreview({port:0,inviteToken:invite});await app.start();t.after(()=>app.stop());
  const child=fork(path.join(__dirname,'../tools/operator-companion.cjs'),[],{windowsHide:true,stdio:['ignore','ignore','ignore','ipc']});t.after(()=>child.kill());
  const message=await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('companion timeout')),20000);child.on('message',m=>{clearTimeout(timer);resolve(m);});child.send({type:'START',invite,localTestBase:'http://127.0.0.1:'+app.port});});
  assert.equal(message.type,'PC_ROOM_READY');assert.match(message.code,/^\d{6}$/);assert(!JSON.stringify(message).includes(invite));assert.equal(message.preset,'OKAMAKIRI');
  child.send({type:'STOP'});await new Promise(resolve=>child.once('exit',resolve));
});
