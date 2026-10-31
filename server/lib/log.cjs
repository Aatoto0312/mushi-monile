'use strict';
const fs=require('node:fs'),path=require('node:path');
function createLogger({directory,maxBytes=1048576,files=5}){
  if(!path.isAbsolute(directory)||!Number.isInteger(maxBytes)||maxBytes<256||!Number.isInteger(files)||files<1||files>20)throw Error('LOG_CONFIG_INVALID');
  fs.mkdirSync(directory,{recursive:true});const file=i=>path.join(directory,'online.'+i+'.jsonl');
  return event=>{
    const safe={at:new Date().toISOString()};
    for(const key of ['event','matchId','playerId','engine','cards','phase'])if(typeof event[key]==='string')safe[key]=event[key].slice(0,key==='event'?40:80);
    if(Number.isSafeInteger(event.version))safe.version=event.version;
    if(Number.isSafeInteger(event.turn))safe.turn=event.turn;
    const line=JSON.stringify(safe)+'\n';if(Buffer.byteLength(line)>maxBytes)return;
    if(fs.existsSync(file(0))&&fs.statSync(file(0)).size+Buffer.byteLength(line)>maxBytes){
      if(fs.existsSync(file(files-1)))fs.unlinkSync(file(files-1));
      for(let i=files-2;i>=0;i--)if(fs.existsSync(file(i)))fs.renameSync(file(i),file(i+1));
    }
    fs.appendFileSync(file(0),line,{mode:0o600});
  };
}
module.exports={createLogger};
