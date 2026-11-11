'use strict';
const fs=require('node:fs'),path=require('node:path');
const {createServer}=require('../server/index.cjs');
const {ROOT,VERSIONS}=require('../server/lib/runtime.cjs');
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.ico':'image/x-icon','.woff2':'font/woff2'};

function prototypePage(file,version='v1'){
 let html=fs.readFileSync(path.join(ROOT,file),'utf8');
 html=html.replace('<html lang="ja">','<html lang="ja" data-battle-ui="a">');
 html=html.replace('<head>','<head><base href="/">');
 html=html.replace('</head>','<link rel="stylesheet" href="prototype-a/a.css"></head>');
 if(version==='v2'){
  html=html.replace('data-battle-ui="a"','data-battle-ui="a" data-a-version="v2"');
  html=html.replace('</head>','<link rel="stylesheet" href="prototype-a/v2.css"></head>');
 }
 html=html.replace(/(<script src="battle-ui\/board\.js[^"\n]*"><\/script>)/,'$1<script src="prototype-a/view.js"></script>');
 html=html.replace(/<title>[^<]*<\/title>/,'<title>蟲神器 A案・'+(file==='index.html'?'CPU対戦':'オンライン対戦')+'</title>');
 html=html.replace('B案オンライン検証','A案オンライン試作');
 return html;
}

function createPrototypeServer(options={}){
 let app;
 app=createServer({port:options.port??0,rng:options.rng,isAllowedOrigin:origin=>origin==='http://127.0.0.1:'+app.port,httpHandler(req,res){
  if(!['GET','HEAD'].includes(req.method))return false;
  let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{return false;}
  let data,type;
  if(/^\/prototype-a\/(?:cpu|online)(?:-v2)?\.html$/.test(name)){
   data=Buffer.from(prototypePage(name.includes('/cpu')?'index.html':'online-b.html',name.endsWith('-v2.html')?'v2':'v1'));type=MIME['.html'];
  }else if(name==='/online/config.json'){
   data=Buffer.from(JSON.stringify({productionEnabled:false,localEndpoint:'ws://127.0.0.1:'+app.port+'/ws',allowedProductionHosts:[]}));type=MIME['.json'];
  }else if(name==='/online/contract.json'){
   data=Buffer.from(JSON.stringify(VERSIONS));type=MIME['.json'];
  }else{
   if(name==='/'||name==='/prototype-a/')name='/prototype-a/index.html';
   if(!/^\/(?:index\.html|online\.html|online-b\.html|toolbox\.html|prototype-a\/(?:index\.html|a\.css|v2\.css|view\.js)|prototype-b\/(?:base\.css|style\.css|forest\.png)|(?:js|css|shared|toolbox|assets|battle-ui|online)\/[a-zA-Z0-9_./-]+)$/.test(name)||name.split('/').some(p=>p.startsWith('.')||p.startsWith('_'))||name.includes('.local.'))return false;
   type=MIME[path.extname(name)];if(!type)return false;
   try{
    const real=fs.realpathSync(path.join(ROOT,name.slice(1)));
    if(!real.startsWith(ROOT+path.sep)||!fs.statSync(real).isFile())return false;
    data=fs.readFileSync(real);
   }catch{return false;}
  }
  res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://mushijingi.com; connect-src 'self' ws://127.0.0.1:"+app.port+"; frame-ancestors 'none'"});
  res.end(req.method==='HEAD'?'':data);return true;
 }});
 return {start:()=>app.start(),stop:()=>app.stop(),get port(){return app.port;},get url(){return 'http://127.0.0.1:'+app.port;}};
}
if(require.main===module){
 const value=process.argv[2],port=value==null?8820:Number(value);
 if(!Number.isInteger(port)||port<1||port>65535)throw Error('PORT_INVALID');
 const app=createPrototypeServer({port});
 app.start().then(()=>console.log('A_PROTOTYPE_READY '+app.url+'/prototype-a/')).catch(error=>{console.error(error.code||'START_FAILED');process.exitCode=1;});
 const stop=()=>app.stop().then(()=>process.exit());
 process.on('SIGINT',stop);process.on('SIGTERM',stop);
}
module.exports={createPrototypeServer};
