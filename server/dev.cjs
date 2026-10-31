'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),{ROOT,VERSIONS}=require('./lib/runtime.cjs'),{createServer}=require('./index.cjs');
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.ico':'image/x-icon','.woff2':'font/woff2'};
function createDevServer(options={}){
  let port=options.port??8788;const api=createServer({port:options.apiPort??8787,allowedOrigins:options.allowedOrigins||['http://127.0.0.1:8788','http://localhost:8788'],rng:options.rng});
  const server=http.createServer(async(req,res)=>{
    res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
    const fail=()=>{res.writeHead(404);res.end('Not found');};
    if(req.method!=='GET'&&req.method!=='HEAD')return fail();
    let name;try{name=decodeURIComponent(req.url.split('?')[0]);}catch{return fail();}
    if(name==='/online/contract.json'){res.writeHead(200,{'Content-Type':MIME['.json']});return res.end(req.method==='HEAD'?'':JSON.stringify(VERSIONS));}
    if(name==='/')name='/index.html';
    if(!/^\/(?:index\.html|toolbox\.html|online\.html|online-b\.html|battle-ui\/(?:board\.css|board\.js|presentation\.js|engine-view\.js|cpu-adapter\.js|cpu-controller\.js|cpu\.css)|prototype-b\/(?:style\.css|base\.css|forest\.png)|(?:js|css|shared|toolbox|assets|online)\/[a-zA-Z0-9_./-]+)$/.test(name)||name.split('/').some(p=>p==='..'||p.startsWith('.'))||name.includes('.local.')||!MIME[path.extname(name).toLowerCase()])return fail();
    const file=path.resolve(ROOT,'.'+name);
    try{const real=await fs.promises.realpath(file);if(!real.startsWith(ROOT+path.sep))return fail();const stat=await fs.promises.stat(real);if(!stat.isFile())return fail();res.writeHead(200,{'Content-Type':MIME[path.extname(name).toLowerCase()],'Content-Length':stat.size});if(req.method==='HEAD')return res.end();const stream=fs.createReadStream(real);stream.on('error',()=>res.destroy());stream.pipe(res);}catch{return fail();}
  });
  server.requestTimeout=10000;server.headersTimeout=10000;
  return {get port(){return port;},get apiPort(){return api.port;},async start(){await api.start();try{await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',()=>{port=server.address().port;server.off('error',reject);resolve();});});}catch(error){await api.stop();throw error;}},async stop(){await Promise.all([api.stop(),new Promise(resolve=>server.close(resolve))]);}};
}
if(require.main===module){const app=createDevServer();app.start().then(()=>console.log(JSON.stringify({event:'LOCAL_DEV_READY',url:'http://127.0.0.1:'+app.port,apiPort:app.apiPort}))).catch(()=>{console.error('DEV_START_FAILED');process.exitCode=1;});const stop=()=>app.stop().then(()=>process.exit(0));process.on('SIGINT',stop);process.on('SIGTERM',stop);process.on('message',message=>{if(message&&message.type==='SHUTDOWN')stop();});}
module.exports={createDevServer};
