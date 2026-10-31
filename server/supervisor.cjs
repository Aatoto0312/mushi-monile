'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto'),{fork}=require('node:child_process'),{createLogger}=require('./lib/log.cjs');
function dataDirectory(){if(!process.env.LOCALAPPDATA)throw Error('LOCALAPPDATA_REQUIRED');return path.join(process.env.LOCALAPPDATA,'MushijingiOnlineBeta');}
function createSupervisor(options={}){
  const directory=options.directory||dataDirectory(),token=crypto.randomBytes(32).toString('base64url');
  let port=options.port??8789,child=null,childPort=null,restartTimer,stopping=false,stopped=false,failures=0;
  const log=createLogger({directory:path.join(directory,'logs/supervisor')});
  const record=event=>{try{log(event);}catch{/* No private error details written to stdout. */}};
  function status(){return {status:stopped?'stopped':stopping?'stopping':childPort?'running':'recovering',childPid:child&&child.pid||null,childPort,stopped};}
  function spawn(){
    if(stopping)return;childPort=null;
    child=fork(path.join(__dirname,'index.cjs'),[],{cwd:path.resolve(__dirname,'..'),windowsHide:true,stdio:['ignore','pipe','ignore','ipc'],env:{...process.env,MUSHI_SERVER_CONFIG:options.configFile||path.join(__dirname,'config.local.json'),MUSHI_LOG_DIR:path.join(directory,'logs/api')}});
    let buffered='';const owned=child;
    child.stdout.on('data',data=>{buffered=(buffered+data.toString()).slice(-8192);let n;while((n=buffered.indexOf('\n'))>=0){const line=buffered.slice(0,n);buffered=buffered.slice(n+1);try{const msg=JSON.parse(line);if(msg.event==='API_LISTENING'&&Number.isInteger(msg.port)&&child===owned){childPort=msg.port;failures=0;record({event:'API_READY'});}}catch{/* Never relay arbitrary child output. */}}});
    const schedule=()=>{if(child!==owned)return;child=null;childPort=null;if(!stopping){record({event:'API_EXITED'});restartTimer=setTimeout(spawn,Math.min(30000,(options.restartDelayMs??1000)*2**Math.min(failures++,5)));}};
    child.on('error',schedule);child.on('exit',schedule);
  }
  const server=http.createServer({maxHeaderSize:4096},(req,res)=>{
    res.setHeader('Cache-Control','no-store');res.setHeader('Content-Security-Policy',"default-src 'none'");
    if(req.headers.origin){res.writeHead(403);return res.end();}
    const supplied=Buffer.from(req.headers.authorization||''),wanted=Buffer.from('Bearer '+token);
    if(supplied.length!==wanted.length||!crypto.timingSafeEqual(supplied,wanted)){res.writeHead(401);return res.end();}
    if(req.url==='/status'&&req.method==='GET'){res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify(status()));}
    if(req.url==='/stop'&&req.method==='POST'){res.writeHead(202);res.end();setImmediate(()=>stop());return;}
    res.writeHead(404);res.end();
  });server.requestTimeout=5000;server.headersTimeout=5000;
  let stopPromise;
  function stop(){if(stopPromise)return stopPromise;stopping=true;clearTimeout(restartTimer);stopPromise=(async()=>{
    if(child){const owned=child;await new Promise(resolve=>{const timer=setTimeout(()=>{if(owned.exitCode===null)owned.kill();resolve();},5000);owned.once('exit',()=>{clearTimeout(timer);resolve();});try{owned.send({type:'SHUTDOWN'});}catch{owned.kill();}});}
    await new Promise(resolve=>server.close(resolve));stopped=true;record({event:'SUPERVISOR_STOPPED'});
    const file=path.join(directory,'operations.local.json');try{const saved=JSON.parse(fs.readFileSync(file,'utf8'));if(saved.token===token)fs.unlinkSync(file);}catch{}
  })();return stopPromise;}
  return {status,get port(){return port;},async start(){await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',()=>{port=server.address().port;server.off('error',reject);resolve();});});try{const file=path.join(directory,'operations.local.json');fs.writeFileSync(file,JSON.stringify({port,token})+'\n',{mode:0o600});spawn();}catch(error){await stop();throw error;}},stop};
}
if(require.main===module){const app=createSupervisor();app.start().then(()=>console.log('SUPERVISOR_STARTED_LOCAL_ONLY')).catch(()=>{console.error('SUPERVISOR_START_FAILED');process.exitCode=1;});const shutdown=()=>app.stop().then(()=>process.exit(0));process.on('SIGINT',shutdown);process.on('SIGTERM',shutdown);}
module.exports={createSupervisor,dataDirectory};
