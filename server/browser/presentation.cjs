'use strict';
// Presentation-only projected-frame fixtures. These are not Engine/game-path evidence.
const test=require('node:test'),assert=require('node:assert/strict'),{VERSIONS}=require('../lib/runtime.cjs');
const playwright=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright');
for(const engine of ['chromium','webkit'])test(engine+' projected choices distinguish instances and display authoritative per-skill AP',async t=>{
  const app=require('../dev.cjs').createDevServer({port:0,apiPort:0});await app.start();t.after(()=>app.stop());
  const browser=await playwright[engine].launch(engine==='chromium'?{channel:'msedge',headless:true}:{headless:true});t.after(()=>browser.close());const page=await browser.newPage();
  const visible=(ref,hp,zone='FIELD')=>({ref,hidden:false,cardId:'kabutomushi',name:'カブトムシ',zone,currentHp:hp,maxHp:800,color:'BLUE',skills:[{name:'技一',ap:950},{name:'技二',ap:250}],attachments:[]});
  const attacker=visible('attacker',800),healthy=visible('healthy',800),wounded=visible('wounded',200),held=visible('held',800,'HAND');
  const player=(id,field,hand)=>({id,availableCost:4,counts:{hand:hand.length,deck:10,territory:6,food:1,discard:0},field,hand,territory:[],food:[],discard:[],resolving:[]});
  const attackView={type:'VIEW',room:{code:'ABCD23456789',matchId:'presentation-only',version:1,phase:'PLAYING',paused:false,players:[{id:'P1',name:'あなた',connected:true},{id:'P2',name:'相手',connected:true}]},battle:{viewerId:'P1',turn:1,phase:'MAIN_PHASE',activePlayerId:'P1',players:{P1:player('P1',[attacker],[held]),P2:player('P2',[healthy,wounded],[])},actions:[{id:'attack-a',kind:'ATTACK',label:'技一 → カブトムシ',sourceRef:'attacker',targetRef:'healthy'},{id:'attack-b',kind:'ATTACK',label:'技一 → カブトムシ',sourceRef:'attacker',targetRef:'wounded'}],decision:null}};
  const choiceView=JSON.parse(JSON.stringify(attackView));choiceView.room.version=2;choiceView.battle.actions=[{id:'choose',kind:'CARDS',label:'選択を決定'}];choiceView.battle.decision={actionId:'choose',min:1,max:1,exact:1,options:[attacker,held,{ref:'blind',hidden:true,label:'裏向きのカード',zone:'HAND'}],groups:[],partitions:[],combinations:[]};
  const closedView=JSON.parse(JSON.stringify(attackView));closedView.room.version=3;closedView.room.phase='CLOSED';closedView.room.reason='HOST_LEFT';closedView.battle=null;
  await page.addInitScript(({versions,attackView,choiceView,closedView})=>{let syncs=0;window.WebSocket=class{
    constructor(){queueMicrotask(()=>this.emit({type:'HELLO',bootId:'fixture',versions,presets:[],playableIds:[]}));}
    emit(message){this.onmessage&&this.onmessage({data:JSON.stringify(message)});}
    send(raw){const p=JSON.parse(raw);if(p.type==='CREATE'){this.emit({type:'SESSION',roomCode:'ABCD23456789',playerId:'P1',token:'fixture',bootId:'fixture'});this.emit({type:'ACK',requestId:p.requestId});this.emit(attackView);}else if(p.type==='SYNC'){this.emit({type:'ACK',requestId:p.requestId});this.emit(++syncs===1?choiceView:closedView);}}
    close(){}
  };},{versions:VERSIONS,attackView,choiceView,closedView});
  await page.goto('http://127.0.0.1:'+app.port+'/online.html');await page.locator('#create').click();
  for(const size of [{width:390,height:560},{width:844,height:300},{width:568,height:320}]){await page.setViewportSize(size);assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1&&document.body.scrollHeight<=innerHeight+1&&document.querySelector('#online-app').getBoundingClientRect().height<=innerHeight+1),'one screen '+JSON.stringify(size));assert(await page.locator('[data-zone="player-field"] button').evaluate(el=>{const a=el.getBoundingClientRect(),b=el.parentElement.getBoundingClientRect();return a.height>=70&&a.y>=b.y-1&&a.bottom<=b.bottom+1;}),'field card must not be clipped '+JSON.stringify(size));}
  await page.setViewportSize({width:390,height:650});await page.locator('[data-zone="player-field"] button').click();
  const labels=await page.locator('#overlay-body [data-kind="ATTACK"]').allTextContents();assert.equal(new Set(labels).size,2,'wounded and healthy targets must be distinguishable');
  assert(labels.some(x=>x.includes('200/800')));assert(labels.some(x=>x.includes('800/800')));
  const detail=await page.locator('.online-detail').textContent();assert(detail.includes('技一')&&detail.includes('950'));assert(detail.includes('技二')&&detail.includes('250'));
  await page.locator('#close-overlay').click();await page.locator('#menu').click();await page.getByRole('button',{name:'サーバーの状態を再取得'}).click();
  const choices=await page.locator('.online-choice-list>button').allTextContents();assert.notEqual(choices[0],choices[1]);assert(choices[0].includes('場'));assert(choices[1].includes('手札'));assert(!choices[2].includes('カブトムシ'));assert(!choices[2].includes('800'));
  await page.getByText('選択候補の詳細を確認',{exact:true}).click();assert.equal(await page.locator('.online-candidate-details>details').count(),2);await page.locator('.online-candidate-details>details').first().locator('summary').click();assert((await page.locator('.online-candidate-details .online-detail').first().textContent()).includes('950'));
  await page.locator('#close-overlay').click();await page.locator('#menu').click();await page.getByRole('button',{name:'サーバーの状態を再取得'}).click();assert((await page.locator('#notice').textContent()).includes('ホストが退出'));assert(await page.locator('#room').isVisible());assert(await page.locator('#ready').isDisabled());
});
