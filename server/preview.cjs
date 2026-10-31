'use strict';
// Local-only until separately approved controller starts an ngrok child.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{createServer}=require('./index.cjs'),{ROOT,VERSIONS}=require('./lib/runtime.cjs');
const plan=require('./ngrok-plan.json');require('./lib/ngrok-preparation.cjs').makeEndpointConfig(plan);
const HOST=plan.hostname,ORIGIN='https://'+HOST;
function createPreview(options={}){
  if(typeof options.inviteToken!=='string'||options.inviteToken.length<24)throw Error('INVITE_REQUIRED');
  const inviteHash=crypto.createHash('sha256').update(options.inviteToken).digest(),cookieToken=crypto.randomBytes(32).toString('base64url');
  const totals={httpRequests:0,httpSentBytes:0,wsSentBytes:0,wsReceivedBytes:0,wsSpectatorSentBytes:0,wsPlayerSentBytes:0};let attempts=[];const events=[];
  const html=fs.readFileSync(path.join(ROOT,'online.html'),'utf8');
  const files=new Set(['/online.html',...Array.from(html.matchAll(/(?:src|href)="([^"?#]+\.(?:js|css))"/g),m=>'/'+m[1])]);
  const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2'};
  let app;
  const localOrigin=()=> 'http://127.0.0.1:'+app.port;
  const validHost=req=>req.headers.host===HOST||req.headers.host==='127.0.0.1:'+app.port;
  const authenticated=req=>(req.headers.cookie||'').split(';').some(v=>v.trim()==='mushi_preview='+cookieToken);
  const gate='<!doctype html><html lang="ja"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="same-origin"><title>蟲神器 接続試験</title><h1>試験参加コード</h1><p>30分限定です。Pagesの保存デッキはこの別サイトには引き継がれません。</p><form method="post" action="/access"><input name="invite" type="password" required autocomplete="off"><button>参加</button></form></html>';
  function handler(req,res){
    totals.httpRequests++;res.setHeader('Referrer-Policy','same-origin');
    const send=(status,body,type='text/plain; charset=utf-8')=>{if(req.method!=='HEAD')totals.httpSentBytes+=Buffer.byteLength(body);res.writeHead(status,{'Content-Type':type});res.end(req.method==='HEAD'?'':body);};
    if(!validHost(req)){send(403,'Forbidden');return true;}
    let name;try{name=decodeURIComponent(req.url.split('?')[0]);}catch{send(400,'Bad request');return true;}
    if(name==='/access'&&req.method==='POST'){
      if(![ORIGIN,localOrigin()].includes(req.headers.origin)){send(403,'Forbidden');return true;}
      attempts=attempts.filter(t=>t>Date.now()-60000);if(attempts.length>=20){send(429,'Try later');return true;}attempts.push(Date.now());
      let body='',tooLarge=false;req.on('data',b=>{if(Buffer.byteLength(body)+b.length>2048){tooLarge=true;req.destroy();}else body+=b;});
      req.on('end',()=>{if(tooLarge)return;let value;try{value=req.headers['content-type']==='application/json'?JSON.parse(body).invite:new URLSearchParams(body).get('invite');}catch{send(403,'Forbidden');return;}
        if(typeof value!=='string'||!crypto.timingSafeEqual(crypto.createHash('sha256').update(value).digest(),inviteHash)){send(403,'Forbidden');return;}
        res.setHeader('Set-Cookie','mushi_preview='+cookieToken+'; HttpOnly; SameSite=Strict; Path=/; Max-Age=1800'+(req.headers.host===HOST?'; Secure':''));
        if(req.headers['content-type']==='application/json')send(204,'');else{res.setHeader('Location','/online.html');send(303,'');}
      });return true;
    }
    if(!authenticated(req)){
      if(req.method==='GET'&&['/','/online.html'].includes(name)){res.setHeader('Content-Security-Policy',"default-src 'none'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");send(200,gate,'text/html; charset=utf-8');}
      else send(401,'Invite required');return true;
    }
    if(!['GET','HEAD'].includes(req.method)){send(404,'Not found');return true;}
    if(name==='/health'){send(200,JSON.stringify({status:'ok',versions:VERSIONS}),mime['.json']);return true;}
    if(name==='/')name='/online.html';
    res.setHeader('Content-Security-Policy',"default-src 'self'; connect-src 'self' wss://"+HOST+" ws://127.0.0.1:"+app.port+"; img-src 'self' data: https://mushijingi.com; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
    if(name==='/online/config.json'){send(200,JSON.stringify({productionEnabled:true,productionEndpoint:'wss://'+HOST+'/ws',allowedProductionHosts:[HOST],localEndpoint:localOrigin().replace('http:','ws:')+'/ws'}),mime['.json']);return true;}
    if(name==='/online/contract.json'){send(200,JSON.stringify(VERSIONS),mime['.json']);return true;}
    if(['/index.html','/toolbox.html'].includes(name)){res.setHeader('Location','https://aatoto0312.github.io/mushi-monile/'+name.slice(1));send(302,'');return true;}
    if(name.split('/').some(s=>s==='..'||s.startsWith('.'))||!files.has(name)&&!/^\/assets\/[a-zA-Z0-9_./-]+\.(?:png|jpe?g|webp|svg|woff2)$/.test(name)){send(404,'Not found');return true;}
    try{const file=fs.realpathSync(path.resolve(ROOT,'.'+name));if(!file.startsWith(ROOT+path.sep)||!fs.statSync(file).isFile()){send(404,'Not found');return true;}const data=fs.readFileSync(file);if(req.method!=='HEAD')totals.httpSentBytes+=data.length;res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Content-Length':data.length});res.end(req.method==='HEAD'?'':data);}catch{send(404,'Not found');}return true;
  }
  app=createServer({port:options.port??8790,allowedOrigins:[ORIGIN],isAllowedOrigin:origin=>origin===ORIGIN||origin===localOrigin(),httpHandler:handler,authorizeUpgrade:req=>validHost(req)&&authenticated(req),log:event=>{events.push(event);if(events.length>500)events.shift();},onTraffic:(direction,n,role)=>{totals[direction==='in'?'wsReceivedBytes':'wsSentBytes']+=n;if(direction==='out'&&role==='spectator')totals.wsSpectatorSentBytes+=n;if(direction==='out'&&role==='player')totals.wsPlayerSentBytes+=n;}});
  return {...app,get port(){return app.port;},metrics:()=>({...totals}),report:()=>({metrics:{...totals},events:events.slice()})};
}
module.exports={createPreview,HOST,ORIGIN};
