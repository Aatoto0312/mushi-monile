'use strict';
let app;
process.on('message',async message=>{
  if(message?.type==='START'&&!app){try{app=require('./preview.cjs').createPreview({inviteToken:message.inviteToken});await app.start();process.send?.({type:'READY',port:app.port});}catch{process.send?.({type:'FAILED'});process.exitCode=1;process.disconnect?.();}}
  if(message?.type==='SHUTDOWN'){if(app){await app.stop();const report=app.report();process.send?.({type:'REPORT',report});}process.exit(0);}
});
process.on('disconnect',()=>{if(app)app.stop().finally(()=>process.exit());else process.exit();});
