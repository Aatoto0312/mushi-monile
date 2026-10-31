'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{spawn}=require('node:child_process');
test('deadline ends both owned children including a hung child without touching other processes',async()=>{
  const {superviseSession}=require('../lib/test-deadline.cjs');
  const make=()=>spawn(process.execPath,['-e','setInterval(()=>{},1000)'],{windowsHide:true,stdio:['ignore','ignore','ignore','ipc']});
  const untouched=make();try{const a=make(),b=make(),session=superviseSession([a,b],{durationMs:80,graceMs:40});const reason=await session.done;assert.equal(reason,'DEADLINE');assert(a.exitCode!==null||a.signalCode!==null);assert(b.exitCode!==null||b.signalCode!==null);assert.equal(untouched.exitCode,null);}finally{untouched.kill();}
});
test('owned child crash ends its peer; manual stop is idempotent',async()=>{
  const {superviseSession}=require('../lib/test-deadline.cjs');const a=spawn(process.execPath,['-e','process.exit(2)'],{stdio:'ignore',windowsHide:true}),b=spawn(process.execPath,['-e','setInterval(()=>{},1000)'],{stdio:'ignore',windowsHide:true});const s=superviseSession([a,b],{durationMs:5000,graceMs:20});assert.equal(await s.done,'CHILD_EXIT');await s.stop();assert(b.exitCode!==null||b.signalCode!==null);
});
