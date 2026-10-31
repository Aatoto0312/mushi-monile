const {test}=require('node:test'),assert=require('node:assert/strict'),WS=require('ws'),{createServer}=require('../index.cjs');
test('existing API accepts Pages Origin, denies foreign Origin, exposes no static site or repository',async t=>{
 const app=createServer({port:0});await app.start();t.after(()=>app.stop());
 const ws=new WS('ws://127.0.0.1:'+app.port+'/ws','mushi-online-v1',{origin:'https://aatoto0312.github.io'});t.after(()=>ws.terminate());
 const hello=await new Promise((resolve,reject)=>{ws.once('message',raw=>resolve(JSON.parse(raw)));ws.once('error',reject);});assert.equal(hello.type,'HELLO');
 const rejected=await new Promise(resolve=>{const other=new WS('ws://127.0.0.1:'+app.port+'/ws','mushi-online-v1',{origin:'https://foreign.example'});other.on('error',()=>{});other.once('unexpected-response',(_,res)=>{res.resume();resolve(res.statusCode);});});assert.equal(rejected,403);
 for(const file of ['/online-b.html','/online/config.json','/toolbox.html','/server/index.cjs','/.git/config'])assert.equal((await fetch('http://127.0.0.1:'+app.port+file)).status,404,file);
});
