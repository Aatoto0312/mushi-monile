'use strict';
const fs=require('node:fs'),path=require('node:path'),{dataDirectory}=require('./supervisor.cjs');
async function request(command,directory=dataDirectory()){
  if(!['status','stop'].includes(command))throw Error('COMMAND_INVALID');
  const auth=JSON.parse(fs.readFileSync(path.join(directory,'operations.local.json'),'utf8'));
  if(!Number.isInteger(auth.port)||auth.port<1||auth.port>65535||typeof auth.token!=='string'||!/^[A-Za-z0-9_-]{43}$/.test(auth.token))throw Error('OPERATIONS_CONFIG_INVALID');
  const response=await fetch('http://127.0.0.1:'+auth.port+'/'+command,{method:command==='stop'?'POST':'GET',headers:{Authorization:'Bearer '+auth.token},signal:AbortSignal.timeout(5000)});
  if(!response.ok)throw Error('OPERATIONS_REQUEST_FAILED');return command==='status'?response.json():{status:'stopping'};
}
if(require.main===module){const command=process.argv[2];if(command==='logs'){for(const kind of ['api','supervisor']){try{const file=path.join(dataDirectory(),'logs',kind,'online.0.jsonl');console.log(kind+'\n'+fs.readFileSync(file,'utf8').split('\n').slice(-101).join('\n'));}catch{console.error(kind.toUpperCase()+'_LOGS_UNAVAILABLE');}}}else request(command).then(result=>console.log(JSON.stringify(result))).catch(()=>{console.error('LOCAL_SUPERVISOR_UNAVAILABLE');process.exitCode=1;});}
module.exports={request};
