'use strict';
// Local Pages-subpath rehearsal using the existing authoritative server. No ngrok.
const fs=require('node:fs'),path=require('node:path'),{createServer}=require('../index.cjs');
function createCandidateServer(directory,options={}){
 const site=path.resolve(directory,'site'),manifest=JSON.parse(fs.readFileSync(path.join(directory,'manifest.json'))),allowed=new Set(manifest.files.map(f=>f.path));
 const prefix='/mushi-monile/';let api;
 const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2'};
 api=createServer({port:options.port??0,rng:options.rng,now:options.now,isAllowedOrigin:origin=>origin==='http://127.0.0.1:'+api.port,httpHandler(req,res){
  let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{return false;}
  if(name===prefix.slice(0,-1)&&['GET','HEAD'].includes(req.method)){res.writeHead(308,{Location:prefix});res.end();return true;}
  if(!name.startsWith(prefix))return false;if(!['GET','HEAD'].includes(req.method))return false;
  name=name.slice(prefix.length)||'index.html';if(name.split('/').some(p=>p==='..'||p.startsWith('.')||p.startsWith('_'))||!allowed.has(name))return false;
  const file=path.join(site,name),data=name==='online/config.json'?Buffer.from(JSON.stringify({...JSON.parse(fs.readFileSync(file)),localEndpoint:'ws://127.0.0.1:'+api.port+'/ws'})):fs.readFileSync(file);
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://mushijingi.com; connect-src 'self' ws://127.0.0.1:"+api.port+"; frame-ancestors 'none'");
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(req.method==='HEAD'?'':data);return true;
 }});
 return {async start(){await api.start();return this;},stop:()=>api.stop(),get url(){return 'http://127.0.0.1:'+api.port+prefix.slice(0,-1);},get port(){return api.port;}};
}
if(require.main===module){const dir=process.argv[2];if(!dir)throw Error('CANDIDATE_DIRECTORY_REQUIRED');const app=createCandidateServer(dir);app.start().then(()=>console.log(JSON.stringify({url:app.url})));process.on('SIGINT',()=>app.stop().then(()=>process.exit()));process.on('SIGTERM',()=>app.stop().then(()=>process.exit()));}
module.exports={createCandidateServer};
