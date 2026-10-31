'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),{WebSocketServer,WebSocket}=require('ws'),{createRoomService}=require('./lib/rooms.cjs');
const DEFAULT_ORIGINS=['http://127.0.0.1:8788','http://localhost:8788','https://aatoto0312.github.io'];
function createServer(options={}){
  if(options.host&&options.host!=='127.0.0.1')throw Error('LOOPBACK_ONLY');
  const allowed=new Set(options.allowedOrigins||DEFAULT_ORIGINS),service=createRoomService(options),upgrades=[],traffic=[];
  let boundPort=options.port??8787,stopping=false;
  const server=http.createServer({maxHeaderSize:8192},(req,res)=>{
    res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Content-Security-Policy',"default-src 'none'; frame-ancestors 'none'");
    if(options.httpHandler&&options.httpHandler(req,res))return;
    if(options.isAllowedOrigin?options.isAllowedOrigin(req.headers.origin):allowed.has(req.headers.origin)){res.setHeader('Access-Control-Allow-Origin',req.headers.origin);res.setHeader('Vary','Origin');}
    if(req.url==='/health'&&req.method==='GET'){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({status:'ok',bootId:service.bootId,versions:{protocol:service.meta.protocol,engine:service.meta.engine,cards:service.meta.cards}}));return;}
    res.writeHead(404,{'Content-Type':'application/json'});res.end('{"error":"NOT_FOUND"}');
  });
  server.requestTimeout=10000;server.headersTimeout=10000;
  const wss=new WebSocketServer({noServer:true,maxPayload:16384,perMessageDeflate:false,handleProtocols:protocols=>protocols.has('mushi-online-v1')?'mushi-online-v1':false});
  server.on('upgrade',(req,socket,head)=>{
    const now=Date.now();while(upgrades.length&&upgrades[0]<now-60000)upgrades.shift();
    const refuse=code=>{socket.end('HTTP/1.1 '+code+'\r\nConnection: close\r\nContent-Length: 0\r\n\r\n');};
    if(stopping)return refuse('503 Service Unavailable');
    if(req.url!=='/ws')return refuse('400 Bad Request');
    if(!(options.isAllowedOrigin?options.isAllowedOrigin(req.headers.origin):allowed.has(req.headers.origin)))return refuse('403 Forbidden');
    if(options.authorizeUpgrade&&!options.authorizeUpgrade(req))return refuse('403 Forbidden');
    if(upgrades.length>=60||service.stats().sessions>=32)return refuse('429 Too Many Requests');
    upgrades.push(now);wss.handleUpgrade(req,socket,head,ws=>wss.emit('connection',ws));
  });
  wss.on('connection',ws=>{
    ws.alive=true;ws.on('error',()=>{});ws.on('pong',()=>{ws.alive=true;});
    let session;
    try{session=service.connect(message=>{if(ws.readyState!==WebSocket.OPEN)return;if(ws.bufferedAmount>262144){ws.close(4008,'SLOW_CLIENT');return;}const payload=JSON.stringify(message);if(options.onTraffic)options.onTraffic('out',Buffer.byteLength(payload),session?.playerId?.startsWith('W')?'spectator':session?.playerId?'player':'unbound');ws.send(payload);},(code,reason)=>ws.close(code,reason));}catch{ws.close(1013,'SERVER_BUSY');return;}
    ws.on('message',(buffer,binary)=>{
      if(options.onTraffic)options.onTraffic('in',buffer.length,session?.playerId?.startsWith('W')?'spectator':session?.playerId?'player':'unbound');
      const now=Date.now();while(traffic.length&&traffic[0]<now-60000)traffic.shift();if(traffic.length>=2400){ws.close(4008,'RATE_LIMIT');return;}traffic.push(now);
      if(binary){ws.close(1003,'TEXT_JSON_REQUIRED');return;}
      let message;try{message=JSON.parse(buffer.toString('utf8'));}catch{ws.send('{"type":"ERROR","code":"MESSAGE_INVALID"}');return;}
      try{service.receive(session,message);}catch{ws.send('{"type":"ERROR","code":"SERVER_ERROR"}');}
    });
    ws.on('close',()=>service.disconnect(session));
  });
  const heartbeat=setInterval(()=>{for(const ws of wss.clients){if(!ws.alive){ws.terminate();continue;}ws.alive=false;ws.ping();}},30000);heartbeat.unref();
  const sweep=setInterval(()=>service.sweep(),10000);sweep.unref();
  async function start(){await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(boundPort,'127.0.0.1',()=>{server.off('error',reject);boundPort=server.address().port;resolve();});});return api;}
  async function stop(){if(stopping)return;stopping=true;clearInterval(heartbeat);clearInterval(sweep);service.close();await new Promise(resolve=>setTimeout(resolve,80));for(const ws of wss.clients)ws.terminate();await Promise.all([new Promise(resolve=>wss.close(resolve)),new Promise(resolve=>server.close(resolve))]);}
  const api={start,stop,get port(){return boundPort;},service};return api;
}
if(require.main===module){
  const file=process.env.MUSHI_SERVER_CONFIG||path.join(__dirname,'config.local.json'),config=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{};
  if(process.env.MUSHI_LOG_DIR){const logger=require('./lib/log.cjs').createLogger({directory:process.env.MUSHI_LOG_DIR});config.log=event=>{try{logger(event);}catch{/* Log failure must not expose state or interrupt a match. */}};}
  const api=createServer(config);api.start().then(()=>console.log(JSON.stringify({event:'API_LISTENING',host:'127.0.0.1',port:api.port}))).catch(()=>{console.error('API_START_FAILED');process.exitCode=1;});
  const shutdown=()=>api.stop().then(()=>process.exit(0));process.on('SIGINT',shutdown);process.on('SIGTERM',shutdown);process.on('message',message=>{if(message&&message.type==='SHUTDOWN')shutdown();});
}
module.exports={createServer,DEFAULT_ORIGINS};
