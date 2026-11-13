'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {createCandidateServer}=require('../tools/candidate-server.cjs'),{createRuntime}=require('../lib/runtime.cjs');
const {setup}=require('../../tests/fixtures/ui-layout.cjs'),pilot=require('../tools/b-ui-pilot.cjs');
const pw=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright'),art=require('../tools/browser-actual-art.cjs').createActualArtCache();
const output=process.env.MUSHI_UI_EVIDENCE||path.join(os.tmpdir(),'mushi-new-ui-release');fs.mkdirSync(output,{recursive:true});
const candidate=process.env.MUSHI_CANDIDATE_DIRECTORY;
if(!candidate&&!process.env.MUSHI_PUBLIC_URL)throw Error('BUILT_CANDIDATE_REQUIRED');
const measurements=[];
const launch=kind=>pw[kind].launch(kind==='chromium'&&process.env.MUSHI_CHROMIUM_CHANNEL!=='bundled'?{channel:process.env.MUSHI_CHROMIUM_CHANNEL||'chrome'}:{});
async function server(t){if(process.env.MUSHI_PUBLIC_URL)return process.env.MUSHI_PUBLIC_URL;const app=createCandidateServer(candidate,{rng:()=>0});await app.start();t.after(()=>app.stop());return app.url;}
async function startCpu(page,base){await page.goto(base+'/index.html',{waitUntil:'load'});await page.locator('#btn-vs-cpu').click();await page.locator('#btn-deck-p1-kabuto').click();await page.locator('#btn-deck-p2-okama').click();}
async function screen(page,name){await page.waitForFunction(()=>[...document.querySelectorAll('img')].filter(i=>i.getBoundingClientRect().width>0&&!i.loading.includes('lazy')).every(i=>i.complete&&i.naturalWidth>0));await page.screenshot({path:path.join(output,name+'.png')});}
async function layout(page,kind,state){
 const m=await page.evaluate(()=>{const b=document.querySelector('#board'),rail=document.querySelector('.live-arena>.rail').getBoundingClientRect();return {viewport:[innerWidth,innerHeight],scroll:Math.max(b.scrollHeight-b.clientHeight,document.documentElement.scrollHeight-innerHeight),width:document.querySelector('[data-role="own-field"] .unit')?.getBoundingClientRect().width,hp:parseFloat(getComputedStyle(document.querySelector('.live-arena .unit .hp')).fontSize),ap:parseFloat(getComputedStyle(document.querySelector('.live-arena .unit .ap')).fontSize),railBottom:rail.bottom,lanes:['other-field','own-field','hand'].map(role=>{const e=document.querySelector('[data-role="'+role+'"]'),r=e.getBoundingClientRect();return {role,top:r.top,bottom:r.bottom,height:r.height,scroll:e.scrollWidth-e.clientWidth};})};});
 assert.equal(m.width,96);assert(m.hp>=12&&m.ap>=12);assert(m.scroll<=1);assert(m.railBottom<=m.viewport[1]+1);for(const lane of m.lanes)assert(lane.top>=0&&lane.bottom<=m.railBottom-40&&lane.height>=50,JSON.stringify(lane));measurements.push({kind,state,...m});
}
for(const kind of ['chromium','webkit']){
 test(kind+' released new UI fits SE3 and preserves old UI, preferences and game state',async t=>{
  const base=await server(t),browser=await launch(kind);t.after(()=>browser.close());
  const context=await browser.newContext({viewport:{width:375,height:667},isMobile:true,hasTouch:true}),page=await context.newPage();page.setDefaultTimeout(15000);await art.install(page,t);await page.addInitScript(()=>Math.random=()=>0);
  const errors=[],missing=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)missing.push(r.url());});
  await startCpu(page,base);
  await page.evaluate(code=>{(0,eval)('('+code+')')(window,MushiBattle.ui.state);MushiBattle.ui.render();},setup.toString());
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('[data-role="own-field"] .unit')).width==='96px');
  await layout(page,kind,'normal');await screen(page,kind+'-new-normal');
  await page.locator('[data-role="hand-toggle"]').click();await layout(page,kind,'expanded');await screen(page,kind+'-new-expanded');
  await page.locator('[data-role="own-field"] .unit').first().click();await page.getByRole('button',{name:'カード詳細',exact:true}).click();await screen(page,kind+'-new-detail');await page.locator('#sheet [data-role="close"]').click();
  const before=await page.evaluate(()=>JSON.stringify(MushiBattle.ui.state));
  await page.locator('[data-role="menu"]').first().click();await page.getByRole('button',{name:'設定・退出など',exact:true}).click();await page.getByRole('button',{name:'旧UIへ切り替え',exact:true}).click();
  assert.equal(await page.evaluate(()=>JSON.stringify(MushiBattle.ui.state)),before);
  assert.equal(await page.evaluate(()=>localStorage.getItem('mushijingiBattleUiV1')),'legacy');
  const switchBounds=await page.locator('#cpu-b-return').boundingBox();assert(switchBounds.y>=-1&&switchBounds.y+switchBounds.height<=668,'new UI switch must be visible without page scrolling '+JSON.stringify(switchBounds));
  assert.equal(await page.locator('#self-field-zone .battle-card').first().evaluate(e=>e.getBoundingClientRect().width),76);
  await screen(page,kind+'-legacy-normal');
  await page.reload({waitUntil:'load'});await page.locator('#btn-vs-cpu').click();await page.locator('#btn-deck-p1-kabuto').click();await page.locator('#btn-deck-p2-okama').click();await page.locator('#cpu-b-return').waitFor();
  assert(await page.locator('#cpu-b-shell').isHidden());await page.getByRole('button',{name:'新UIへ',exact:true}).click();await page.locator('#cpu-b-shell').waitFor();
  assert.equal(await page.evaluate(()=>localStorage.getItem('mushijingiBattleUiV1')),'new');
  for(const height of [667,560]){
   await page.setViewportSize({width:375,height});await page.evaluate(code=>{(0,eval)('('+code+')')(window,MushiBattle.ui.state,10,10,14);MushiBattle.ui.render();},setup.toString());
   for(const role of ['other-field','own-field','hand']){const lane=page.locator('[data-role="'+role+'"]');await page.waitForFunction(role=>{const e=document.querySelector('[data-role="'+role+'"]');return e.scrollWidth>e.clientWidth;},role);assert(await lane.evaluate(e=>e.scrollWidth>e.clientWidth));await lane.evaluate(e=>e.scrollLeft=e.scrollWidth);assert(await lane.evaluate(e=>e.scrollLeft>0));await lane.evaluate(e=>e.scrollLeft=0);}
   await layout(page,kind,'many-'+height);await screen(page,kind+'-new-many-'+height);
   if(await page.locator('[data-role="hand-toggle"]').getAttribute('aria-expanded')==='false')await page.locator('[data-role="hand-toggle"]').click();
   await layout(page,kind,'many-expanded-'+height);await screen(page,kind+'-new-many-expanded-'+height);
  }
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 });
 test(kind+' Toolbox saved deck completes CPU new UI and replay remains available',async t=>{
  const base=await server(t),browser=await launch(kind);t.after(()=>browser.close());
  const page=await browser.newPage({viewport:{width:375,height:667},isMobile:true,hasTouch:true});page.setDefaultTimeout(15000);await art.install(page,t);
  const deck=createRuntime().preset('KABUTOMUSHI'),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(deck=>{Math.random=()=>0;localStorage.setItem('mushijingiToolboxDecksV1',JSON.stringify({storageVersion:1,activeDeckId:deck.deckId,decks:[deck]}));},deck);
  await page.goto(base+'/toolbox.html#decks');await page.locator('#battle-deck').click();await page.locator('#btn-vs-cpu').click();assert.equal(await page.locator('#user-deck-p1').inputValue(),deck.deckId);await page.locator('#btn-user-deck-p1').click();await page.locator('#btn-deck-p2-okama').click();await page.locator('#cpu-b-shell').waitFor();await page.evaluate(()=>MushiBattle.ui.cpuRunner.thinkDelay=1);
  let actions=0;
  for(let i=0;i<650;i++){
   if(await page.locator('#board').getAttribute('data-room-phase')==='ENDED')break;
   const version=await page.locator('#board').getAttribute('data-version');
   if(await pilot.step(page)){actions++;await page.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),version);}else await page.waitForTimeout(20);
  }
  assert.equal(await page.locator('#board').getAttribute('data-room-phase'),'ENDED');await screen(page,kind+'-cpu-result');await page.locator('.battle-result-popup [data-result="replay"]').click();await page.waitForFunction(()=>document.querySelector('#board').dataset.roomPhase==='PLAYING');
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('mushijingiToolboxDecksV1')).decks[0].cards),deck.cards);assert.deepEqual(errors,[]);t.diagnostic(JSON.stringify({completedCpuMatches:1,actions}));
 });
 test(kind+' online old/new switch preserves seat, spectator, private cards and reconnect',async t=>{
  const base=await server(t),browser=await launch(kind);t.after(()=>browser.close());
  const pages=await Promise.all([0,1,2].map(()=>browser.newPage({viewport:{width:375,height:667},isMobile:true,hasTouch:true}))),[a,b,w]=pages;
  const errors=[],leaks=[];
  for(const page of pages){page.setDefaultTimeout(15000);await art.install(page,t);page.on('pageerror',e=>errors.push(e.message));page.on('websocket',ws=>ws.on('framereceived',frame=>{const packet=JSON.parse(frame.payload.toString());if(packet.type!=='VIEW'||!packet.battle)return;for(const p of Object.values(packet.battle.players)){if(p.deck)leaks.push('deck');if(p.id!==packet.battle.viewerId)for(const card of p.hand)if(!card.hidden||card.cardId||card.name)leaks.push('hand');}}));await page.goto(base+'/online-b.html');await page.waitForFunction(()=>!document.querySelector('#create').disabled);}
  await a.locator('#create').click();await a.locator('#room-code').waitFor();const code=await a.locator('#room-code').innerText();
  for(const [page,button] of [[b,'#join'],[w,'#watch']]){await page.locator('#code').fill(code);await page.locator(button).click();await page.locator('#room').waitFor();}
  for(const button of ['#deck-apply','#ready'])for(const p of [a,b]){const version=await p.locator('#board').getAttribute('data-version');await p.locator(button).click();await Promise.all(pages.map(q=>q.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),version)));}
  await a.locator('#board').waitFor();const seat=await a.evaluate(()=>sessionStorage.getItem('mushiOnlineSeatV1'));
  await a.getByRole('link',{name:'旧UIへ',exact:true}).click();await a.locator('[data-zone="player-hand"] .battle-card').first().waitFor();assert.equal(await a.evaluate(()=>sessionStorage.getItem('mushiOnlineSeatV1')),seat);
  await a.locator('#menu').click();await a.getByRole('link',{name:'新UIへ切り替え',exact:true}).click();await a.locator('.live-arena').waitFor();await a.reload();await a.locator('.live-arena').waitFor();assert.equal(await a.evaluate(()=>sessionStorage.getItem('mushiOnlineSeatV1')),seat);
  await w.reload();await w.locator('.live-arena').waitFor();assert(await w.locator('[data-role="all-actions"]').isDisabled());assert.equal(await w.locator('[data-role="hand"] [data-card-id]').count(),0);
  await screen(a,kind+'-online-new');await screen(w,kind+'-spectator-new');
  a.on('dialog',dialog=>dialog.accept());await a.locator('#menu').click();await a.getByRole('button',{name:'投了',exact:true}).click();await b.waitForFunction(()=>document.querySelector('#board').dataset.roomPhase==='ENDED');
  assert.equal(await a.locator('.battle-result-popup h2').innerText(),'敗北…');assert.equal(await b.locator('.battle-result-popup h2').innerText(),'勝利！');
  for(const p of pages)await p.locator('.battle-result-popup [data-result="board"]').click();
  for(const p of [w,b,a]){
   if(await p.locator('#entrance').isVisible())continue;
   await p.locator('#menu').click();await p.getByRole('button',{name:p===w?'観戦を終了して戻る':'ルームを終了して戻る',exact:true}).click();await p.locator('[data-kind="CONFIRM_LEAVE"]').click();await p.locator('#entrance').waitFor();
  }
  assert.deepEqual(errors,[]);assert.deepEqual(leaks,[]);
 });
}
test.after(()=>fs.writeFileSync(path.join(output,'layout-metrics.json'),JSON.stringify(measurements,null,2)));
