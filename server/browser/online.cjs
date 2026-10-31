'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const playwright=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright');
for(const engine of ['chromium','webkit'])test(engine+' browser room, private views and reconnect',async t=>{
  const app=require('../dev.cjs').createDevServer({rng:()=>0});await app.start();t.after(()=>app.stop());
  const browser=await playwright[engine].launch(engine==='chromium'?{channel:'msedge',headless:true}:{headless:true});t.after(()=>browser.close());
  const context=await browser.newContext({viewport:{width:390,height:650}});const a=await context.newPage(),b=await (await browser.newContext({viewport:{width:390,height:650}})).newPage();const errors=[],failedAssets=[],privacyViolations=[];let observedViews=0,playerBytes=0,playerSentBytes=0,watcherSentBytes=0;
  for(const p of [a,b]){p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)failedAssets.push(r.status()+' '+r.url());});p.on('websocket',ws=>ws.on('framesent',frame=>{playerSentBytes+=Buffer.byteLength(frame.payload.toString());}).on('framereceived',frame=>{playerBytes+=Buffer.byteLength(frame.payload.toString());const m=JSON.parse(frame.payload.toString());if(m.type!=='VIEW'||!m.battle)return;observedViews++;const battle=m.battle,other=battle.players[battle.viewerId==='P1'?'P2':'P1'];if(other.hand.some(card=>!card.hidden||Object.keys(card).some(k=>!['ref','hidden','label','zone'].includes(k))))privacyViolations.push('opponent hand metadata');if(Object.hasOwn(other,'deck'))privacyViolations.push('deck order');if(Object.hasOwn(battle,'pendingEffect')||Object.hasOwn(battle,'continuation'))privacyViolations.push('Engine continuation');}));await p.goto('http://127.0.0.1:8788/online.html');await p.locator('#create').waitFor();await p.waitForFunction(()=>document.querySelector('#create')&&!document.querySelector('#create').disabled);}
  await a.locator('#name').fill('観察者一');await a.locator('#create').click();await a.locator('#room-code').waitFor();
  const code=await a.locator('#room-code').textContent();assert.match(code,/^\d{6}$/);
  const watchers=[];let watcherBytes=0;
  for(let i=0;i<3;i++){const wc=await browser.newContext({viewport:{width:390,height:650}}),w=await wc.newPage();watchers.push(w);w.on('pageerror',e=>errors.push(e.message));w.on('websocket',ws=>ws.on('framesent',frame=>{watcherSentBytes+=Buffer.byteLength(frame.payload.toString());}).on('framereceived',frame=>{watcherBytes+=Buffer.byteLength(frame.payload.toString());const m=JSON.parse(frame.payload.toString());if(m.type==='VIEW'&&m.battle){assert.equal(m.battle.viewerId,'SPECTATOR');assert.deepEqual(m.battle.actions,[]);assert.equal(m.battle.decision,null);for(const player of Object.values(m.battle.players))for(const card of player.hand){if(!card.hidden||card.cardId||card.name)privacyViolations.push('spectator hand leak');}}}));await w.goto('http://127.0.0.1:8788/online.html');await w.waitForFunction(()=>!document.querySelector('#watch').disabled);if(i===0){await w.locator('#code').fill(code);await w.locator('#watch').click();await w.locator('#room').waitFor();assert(await w.locator('#deck-apply').isHidden());}}
await b.locator('#code').fill(code);await b.locator('#join').click();
  for(const [p,preset] of [[a,'KABUTOMUSHI'],[b,'OKAMAKIRI']]){await p.locator('#deck-select').selectOption('preset:'+preset);await p.locator('#deck-apply').click();await p.waitForFunction(()=>document.querySelector('#ready')&&!document.querySelector('#ready').disabled);}
  await a.locator('#ready').click();await b.locator('#ready').click();await a.locator('#board').waitFor();await b.locator('#board').waitFor();
  for(const w of watchers.slice(1)){await w.locator('#code').fill(code);await w.locator('#watch').click();await w.locator('#board').waitFor();}
  await watchers[0].reload();await watchers[0].locator('#board').waitFor();assert((await watchers[0].locator('#turn-status').textContent()).includes('観戦中'));
  assert.equal(await watchers[0].locator('#actions button').count(),0);
  await a.reload();await a.locator('#board').waitFor();
  assert.equal(await a.locator('[data-zone="opponent-hand"] [data-hidden="true"]').count(),4);
  assert.equal(await a.locator('[data-zone="opponent-hand"] [data-card-id]').count(),0);
  for(const size of [{width:390,height:650},{width:844,height:390}]){await a.setViewportSize(size);await a.waitForTimeout(50);assert(await a.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1&&document.body.scrollHeight<=innerHeight+1&&document.querySelector('#online-app').getBoundingClientRect().height<=innerHeight+1));}
  let captured=false;for(let step=0;step<650;step++){
    if(await a.locator('#board').getAttribute('data-room-phase')==='ENDED')break;
    assert.equal(await a.locator('#board').getAttribute('data-room-phase'),'PLAYING');
    if(!captured&&process.env.MUSHI_ONLINE_SHOTS&&await a.locator('[data-zone="player-field"] .battle-card').count()){
      const fs=require('node:fs'),path=require('node:path');fs.mkdirSync(process.env.MUSHI_ONLINE_SHOTS,{recursive:true});
      for(const size of [{width:390,height:650},{width:844,height:390}]){await a.setViewportSize(size);await a.screenshot({path:path.join(process.env.MUSHI_ONLINE_SHOTS,engine+'-'+size.width+'.png')});}
      captured=true;
    }
    let played=false;
    for(const p of [a,b]){
      const version=await p.locator('#board').getAttribute('data-version');
      played=await require('../tools/ui-pilot.cjs').step(p);
      if(played){await Promise.all([a.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),version),b.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),version)]);break;}
    }
    assert(played,'No UI operation at step '+step);
  }
  assert.equal(await a.locator('#board').getAttribute('data-room-phase'),'ENDED');
  assert.equal(await b.locator('#board').getAttribute('data-room-phase'),'ENDED');
  for(const w of watchers){await w.waitForFunction(()=>document.querySelector('#board').dataset.roomPhase==='ENDED');await w.locator('#menu').click();assert.equal(await w.getByRole('button',{name:'投了',exact:true}).count(),0);}
  t.diagnostic(JSON.stringify({engine,spectators:3,watcherReceivedBytes:watcherBytes,playerReceivedBytes:playerBytes,playerSentBytes,watcherSentBytes,scope:'application WebSocket payload only; excludes assets and TLS'}));
  assert.deepEqual(errors,[]);
  assert.deepEqual(failedAssets,[]);
  assert(observedViews>20);assert.deepEqual(privacyViolations,[]);
});
