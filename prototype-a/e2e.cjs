'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const runtime=require('../server/lib/runtime.cjs'),original=runtime.createRuntime;
const {setup}=require('./fixture.cjs');
runtime.createRuntime=()=>{const r=original(),start=r.start;r.start=(...args)=>{const s=start(...args);setup(r.context,s);return s;};return r;};
const {createPrototypeServer}=require('./server.cjs');
const pw=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright');
const art=require('../server/tools/browser-actual-art.cjs').createActualArtCache();
const output=process.env.MUSHI_A_EVIDENCE||path.join(os.tmpdir(),'mushi-a-evidence-20261111');
fs.mkdirSync(output,{recursive:true});
const metrics=[];

async function launchCpu(page,url,route,counts=[4,3,4]){
 await page.goto(url+route,{waitUntil:'load'});
 await page.locator('#btn-vs-cpu').click();
 await page.locator('#btn-deck-p1-kabuto').click();
 await page.locator('#btn-deck-p2-okama').click();
 await page.evaluate(({source,counts})=>{
  const ui=MushiBattle.ui;(0,eval)('('+source+')')(window,ui.state,...counts);ui.render();
 },{source:setup.toString(),counts});
}
async function measure(page,mode){
 const data=await page.evaluate(mode=>{
  const box=e=>e?{width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}:null;
  const selector=mode==='legacy'?'#self-field .battle-card':'[data-role="own-field"] .unit';
  const card=document.querySelector(selector)||document.querySelector('#self-field-zone .battle-card');
  const info=card?.querySelector(mode==='legacy'?'.card-hp':'.hp');
  return {mode,viewport:{width:innerWidth,height:innerHeight},card:box(card),art:box(card?.querySelector('.art,.specimen-art')),hpFont:info&&getComputedStyle(info).fontSize,pageWidth:document.documentElement.scrollWidth};
 },mode);
 metrics.push(data);return data;
}
async function shot(page,name){
 await page.waitForFunction(()=>[...document.querySelectorAll('.unit img,.battle-card img')].filter(img=>img.getBoundingClientRect().width>0).every(img=>img.complete&&img.naturalWidth>0));
 await page.evaluate(async()=>{
  await Promise.all([...document.querySelectorAll('.unit img,.battle-card img')].filter(img=>img.getBoundingClientRect().width>0).map(img=>img.decode()));
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
 });
 await page.screenshot({path:path.join(output,name+'.png')});
}

for(const kind of ['chromium','webkit']){
 test(kind+' A layout, scrolling, details and actual CPU actions',async t=>{
  const app=createPrototypeServer();await app.start();t.after(()=>app.stop());
  const browser=await pw[kind].launch(kind==='chromium'&&process.env.MUSHI_A_CHROMIUM_CHANNEL!=='bundled'?{channel:process.env.MUSHI_A_CHROMIUM_CHANNEL||'chrome'}:{});t.after(()=>browser.close());
  const page=await browser.newPage({viewport:{width:375,height:667},isMobile:true,hasTouch:true});
  page.setDefaultTimeout(15000);await art.install(page,t);
  await page.addInitScript(()=>Math.random=()=>0);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const [mode,route] of [['legacy','/index.html?battleUi=legacy'],['b','/index.html'],['a','/prototype-a/cpu.html']]){
   await launchCpu(page,app.url,route);
   if(mode!=='legacy')await page.locator('#cpu-b-shell').waitFor();
   const data=await measure(page,mode);assert(data.card,mode+' card exists');
   await shot(page,kind+'-'+mode+'-normal');
  }
  const base=metrics.at(-1).card.width;
  assert(base>=116);
  await page.locator('[data-role="hand-toggle"]').click();
  assert.equal(await page.locator('[data-role="hand-toggle"]').getAttribute('aria-expanded'),'false');
  await page.locator('#board').evaluate(e=>e.scrollTop=e.scrollHeight);
  await shot(page,kind+'-a-collapsed');
  await page.locator('[data-role="hand-toggle"]').click();
  await page.locator('#board').evaluate(e=>e.scrollTop=e.scrollHeight);
  await shot(page,kind+'-a-expanded');
  await page.locator('[data-role="own-field"] .unit').first().click();
  await page.getByRole('button',{name:'カード詳細',exact:true}).click();
  assert((await page.locator('#sheet-body').innerText()).includes('印刷コスト 4'));
  await shot(page,kind+'-a-detail');
  const close=page.locator('#sheet [data-role="close"]');
  const rect=await close.boundingBox();assert(rect.y>=0&&rect.y+rect.height<=667);
  await close.click();
  for(const [name,counts] of [['five',[5,5,6]],['many',[10,10,14]],['empty',[0,0,0]]]){
   await launchCpu(page,app.url,'/prototype-a/cpu.html',counts);
   if(counts[0])assert.equal((await measure(page,'a')).card.width,base);
   if(name==='many'){
    for(const role of ['own-field','other-field','hand']){
     const lane=page.locator('[data-role="'+role+'"]');
     assert(await lane.evaluate(e=>e.scrollWidth>e.clientWidth));
     await lane.evaluate(e=>e.scrollLeft=e.scrollWidth);assert(await lane.evaluate(e=>e.scrollLeft>0));
    }
   }
   if(name==='empty')assert(await page.locator('.field').first().evaluate(e=>e.getBoundingClientRect().height<85));
   await page.locator('#board').evaluate(e=>e.scrollTop=0);
   await shot(page,kind+'-a-'+name);
   if(name==='many'){
    await page.locator('#board').evaluate(e=>e.scrollTop=e.scrollHeight);
    const handBottom=await page.locator('[data-role="hand"]').evaluate(e=>e.getBoundingClientRect().bottom);
    const railTop=await page.locator('.rail').evaluate(e=>e.getBoundingClientRect().top);
    assert(handBottom<=railTop,'hand must be fully reachable above the action bar');
   }
  }
  for(const size of [{width:375,height:560},{width:667,height:375},{width:1280,height:800}]){
   await page.setViewportSize(size);await launchCpu(page,app.url,'/prototype-a/cpu.html');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   const rail=await page.locator('.live-arena>.rail').boundingBox();assert(rail.y>=0&&rail.y+rail.height<=size.height+1);
   await page.locator('[data-role="hand"]').scrollIntoViewIfNeeded();
   const toggle=await page.locator('[data-role="hand-toggle"]').boundingBox();assert(toggle.y+toggle.height<=rail.y);
   await measure(page,'a');await shot(page,kind+'-a-'+size.width+'x'+size.height);
  }
  await page.setViewportSize({width:375,height:1200});await launchCpu(page,app.url,'/prototype-a/cpu.html');
  await shot(page,kind+'-a-overview-375x1200');
  await page.setViewportSize({width:375,height:667});await launchCpu(page,app.url,'/prototype-a/cpu.html');
  await operations(page);
  await page.locator('[data-role="end"]').click();
  for(let i=0;i<12;i++){
   await page.waitForFunction(()=>{
    const s=MushiBattle.ui.state;
    return s.turnNumber>=5&&s.activePlayerId==='P1'||s.pendingEffect?.playerId==='P1';
   },null,{timeout:15000});
   const returned=await page.evaluate(()=>MushiBattle.ui.state.turnNumber>=5&&MushiBattle.ui.state.activePlayerId==='P1');
   if(returned)break;
   // The CPU can destroy an insect, requiring the human to draw a territory.
   const choices=page.locator('#sheet .online-choice-list button[data-ref]');
   if(await choices.count()){
    await choices.first().click();await page.locator('#sheet [data-kind="CONFIRM_SELECTION"]').click();
   }else await page.locator('#sheet [data-kind="TERRITORY_CHOICE"]').last().click();
  }
  assert(await page.evaluate(()=>MushiBattle.ui.state.turnNumber>=5&&MushiBattle.ui.state.activePlayerId==='P1'));
  assert.deepEqual(errors,[]);
 });
 test(kind+' A online actions, privacy and reconnect use the existing API',async t=>{
  const app=createPrototypeServer();await app.start();t.after(()=>app.stop());
  const browser=await pw[kind].launch(kind==='chromium'&&process.env.MUSHI_A_CHROMIUM_CHANNEL!=='bundled'?{channel:process.env.MUSHI_A_CHROMIUM_CHANNEL||'chrome'}:{});t.after(()=>browser.close());
  const pages=await Promise.all([0,1,2].map(()=>browser.newPage({viewport:{width:375,height:667},isMobile:true,hasTouch:true})));
  const [a,b,w]=pages,errors=[];
  for(const p of pages){p.setDefaultTimeout(15000);await art.install(p,t);p.on('pageerror',e=>errors.push(e.message));await p.goto(app.url+'/prototype-a/online.html');await p.waitForFunction(()=>!document.querySelector('#create').disabled);}
  await a.locator('#create').click();await a.locator('#room-code').waitFor();const code=await a.locator('#room-code').innerText();
  await b.locator('#code').fill(code);await b.locator('#join').click();await b.locator('#room').waitFor();
  await w.locator('#code').fill(code);await w.locator('#watch').click();await w.locator('#room').waitFor();
  for(const control of ['#deck-apply','#ready'])for(const p of [a,b]){
   const version=await p.locator('#board').getAttribute('data-version');await p.locator(control).click();
   await Promise.all(pages.map(q=>q.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),version)));
  }
  await a.waitForFunction(()=>document.querySelector('#board').dataset.roomPhase==='PLAYING');
  assert.equal(await b.locator('[data-role="hand"] [data-card-id]').count(),0);
  assert.equal(await w.locator('[data-role="hand"] [data-card-id]').count(),0);
  await operations(a);
  await b.locator('[data-role="other-field"] .unit').nth(4).waitFor();
  await a.reload();await a.locator('[data-role="own-field"] .unit').nth(4).waitFor();
  assert.equal(await a.locator('[data-role="own-field"] .unit').count(),5);
  await shot(a,kind+'-a-online');
  await a.locator('[data-role="end"]').click();
  await b.waitForFunction(()=>document.querySelector('[data-role="instruction"]').textContent==='あなたの番');
  assert.deepEqual(errors,[]);
 });
}

async function operations(page){
 const hand=id=>page.locator('[data-role="hand"] .unit[data-card-id="'+id+'"]');
 await hand('namitentou').first().click();await page.locator('#sheet [data-kind="SUMMON"]').click();
 await page.locator('[data-role="own-field"] .unit').nth(4).waitFor();
 await hand('mushi_no_ibuki').click();await page.locator('#sheet [data-kind="SPELL"]').click();
 await page.waitForFunction(()=>![...document.querySelectorAll('[data-role="hand"] [data-card-id]')].some(e=>e.dataset.cardId==='mushi_no_ibuki'));
 await hand('kamikiri_no_daigaku').click();await page.getByRole('button',{name:'強化を使う',exact:true}).click();
 await page.locator('[data-role="own-field"] .unit.target').first().click();
 await page.locator('[data-role="own-field"] .unit').first().click();
 await page.getByRole('button',{name:'攻撃する',exact:true}).click();await page.locator('[data-skill]').first().click();
 assert(await page.locator('[data-role="other-field"] .target').count()>0);
 await page.locator('[data-role="cancel"]').click();
 await page.locator('[data-role="own-field"] .unit').first().click();
 await page.getByRole('button',{name:'攻撃する',exact:true}).click();await page.locator('[data-skill]').first().click();
 await shot(page,'target-'+(await page.evaluate(()=>document.title)).replace(/[^a-zA-Z0-9]/g,'_'));
 await page.locator('[data-role="other-field"] .target').first().click();
 await page.waitForFunction(()=>document.querySelector('[data-role="own-field"] .unit')?.classList.contains('used'));
}
test.after(()=>{fs.writeFileSync(path.join(output,'metrics.json'),JSON.stringify(metrics,null,2));});
