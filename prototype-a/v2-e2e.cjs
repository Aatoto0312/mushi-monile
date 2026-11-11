'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const runtime=require('../server/lib/runtime.cjs'),original=runtime.createRuntime;
const {setup}=require('./fixture.cjs');
runtime.createRuntime=()=>{const r=original(),start=r.start;r.start=(...args)=>{const s=start(...args);setup(r.context,s);return s;};return r;};
const {createPrototypeServer}=require('./server.cjs');
const pw=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright');
const art=require('../server/tools/browser-actual-art.cjs').createActualArtCache();
const output=process.env.MUSHI_A_EVIDENCE||path.join(os.tmpdir(),'mushi-a-v2-evidence-20261112');
fs.mkdirSync(output,{recursive:true});
const metrics=[];

async function cpu(page,url,route,counts=[4,3,4]){
 await page.goto(url+route,{waitUntil:'load'});
 await page.locator('#btn-vs-cpu').click();await page.locator('#btn-deck-p1-kabuto').click();await page.locator('#btn-deck-p2-okama').click();
 await page.evaluate(({code,counts})=>{const ui=MushiBattle.ui;(0,eval)('('+code+')')(window,ui.state,...counts);ui.render();},{code:setup.toString(),counts});
}
async function capture(page,name){
 await page.waitForFunction(()=>[...document.querySelectorAll('.unit img,.battle-card img')].filter(i=>i.getBoundingClientRect().width>0).every(i=>i.complete&&i.naturalWidth>0));
 await page.evaluate(async()=>{await Promise.all([...document.querySelectorAll('.unit img,.battle-card img')].filter(i=>i.getBoundingClientRect().width>0).map(i=>i.decode()));await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
 await page.screenshot({path:path.join(output,name+'.png')});
}
async function measure(page,kind,mode,state){
 const data=await page.evaluate(({kind,mode,state})=>{
  const legacy=mode==='legacy',card=document.querySelector(legacy?'#self-field-zone .battle-card':'[data-role="own-field"] .unit');
  const hp=card?.querySelector(legacy?'.card-hp':'.hp'),ap=card?.querySelector(legacy?'.card-atk':'.ap');
  const box=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom};};
  const root=legacy?document.querySelector('.mobile-frame'):document.querySelector('#board');
  const scrollable=[document.documentElement,document.body,...root.querySelectorAll('*'),root].filter(e=>e.getBoundingClientRect().height>0&&(e===root||e===document.documentElement||e===document.body||['auto','scroll'].includes(getComputedStyle(e).overflowY)));
  const lanes=legacy?[]:['other-field','own-field','hand'].map(role=>{const e=document.querySelector('[data-role="'+role+'"]'),heading=e.querySelector('.card-heading'),hp=e.querySelector('.hp');return {role,...box(e),count:e.querySelectorAll('.unit').length,horizontalScroll:e.scrollWidth-e.clientWidth,headingBottom:heading?.getBoundingClientRect().bottom,hpTop:hp?.getBoundingClientRect().top};});
  return {kind,mode,state,viewport:{width:innerWidth,height:innerHeight},card:card&&box(card),hpFont:hp&&parseFloat(getComputedStyle(hp).fontSize),apFont:ap&&parseFloat(getComputedStyle(ap).fontSize),verticalScroll:Math.max(0,...scrollable.map(e=>e.scrollHeight-e.clientHeight)),pageWidth:document.documentElement.scrollWidth,lanes,rail:legacy?null:box(document.querySelector('.rail'))};
 },{kind,mode,state});metrics.push(data);return data;
}
function validate(data){
 assert(data.card.width>=90&&data.card.width<=105,JSON.stringify(data));
 assert(data.hpFont>=12&&data.apFont>=12);
 assert(data.verticalScroll<=1,'vertical scrolling '+JSON.stringify(data));
 assert(data.pageWidth<=data.viewport.width);
 for(const lane of data.lanes){assert(lane.height>=50,lane.role+' too short');assert(lane.y>=0&&lane.bottom<=data.rail.y+1,lane.role+' out of view');assert(lane.headingBottom<=lane.hpTop,lane.role+' name and stats overlap');}
 assert(data.rail.bottom<=data.viewport.height+1);
}
for(const kind of ['chromium','webkit']){
 test(kind+' A v2 viewport, independent lanes, readability and comparison captures',async t=>{
  const app=createPrototypeServer();await app.start();t.after(()=>app.stop());
  const browser=await pw[kind].launch(kind==='chromium'&&process.env.MUSHI_A_CHROMIUM_CHANNEL!=='bundled'?{channel:'chrome'}:{});t.after(()=>browser.close());
  const page=await browser.newPage({viewport:{width:375,height:667},isMobile:true,hasTouch:true});
  page.setDefaultTimeout(15000);await art.install(page,t);await page.addInitScript(()=>Math.random=()=>0);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const [mode,route] of [['legacy','/index.html?battleUi=legacy'],['v1','/prototype-a/cpu.html'],['v2','/prototype-a/cpu-v2.html']]){
   await cpu(page,app.url,route);await capture(page,kind+'-'+mode+'-normal');
   const data=await measure(page,kind,mode,'normal');if(mode==='v2')validate(data);
  }
  const width=metrics.at(-1).card.width;
  for(const height of [667,560]){
   await page.setViewportSize({width:375,height});await cpu(page,app.url,'/prototype-a/cpu-v2.html');
   await page.locator('[data-role="hand-toggle"]').click();
   assert.equal(await page.locator('[data-role="hand-toggle"]').getAttribute('aria-expanded'),'true');
   validate(await measure(page,kind,'v2','expanded-'+height));await capture(page,kind+'-v2-expanded-'+height);
   await cpu(page,app.url,'/prototype-a/cpu-v2.html',[10,10,14]);
   assert.equal((await measure(page,kind,'v2','many-'+height)).card.width,width);
   for(const lane of ['other-field','own-field','hand']){
    const el=page.locator('[data-role="'+lane+'"]');assert(await el.evaluate(e=>e.scrollWidth>e.clientWidth));
    await el.evaluate(e=>e.scrollLeft=e.scrollWidth);assert(await el.evaluate(e=>e.scrollLeft>0));
    await el.evaluate(e=>e.scrollLeft=0);
   }
   validate(await measure(page,kind,'v2','many-compact-'+height));await capture(page,kind+'-v2-many-'+height);
   await page.locator('[data-role="hand-toggle"]').click();validate(await measure(page,kind,'v2','many-expanded-'+height));await capture(page,kind+'-v2-many-expanded-'+height);
  }
  await page.setViewportSize({width:375,height:667});await cpu(page,app.url,'/prototype-a/cpu-v2.html');
  await page.locator('[data-role="own-field"] .unit').first().click();await page.getByRole('button',{name:'カード詳細',exact:true}).click();
  await capture(page,kind+'-v2-detail');await page.locator('#sheet [data-role="close"]').click();
  const held=id=>page.locator('[data-role="hand"] .unit[data-card-id="'+id+'"]');
  await held('namitentou').click();await page.locator('#sheet [data-kind="SUMMON"]').click();
  await page.locator('[data-role="own-field"] .unit').nth(4).waitFor();
  await held('mushi_no_ibuki').click();await page.locator('#sheet [data-kind="SPELL"]').click();
  await held('kamikiri_no_daigaku').click();await page.getByRole('button',{name:'強化を使う',exact:true}).click();
  await page.locator('[data-role="own-field"] .target').first().click();
  await page.locator('[data-role="own-field"] .unit').first().click();await page.getByRole('button',{name:'攻撃する',exact:true}).click();await page.locator('[data-skill]').first().click();
  validate(await measure(page,kind,'v2','target'));await capture(page,kind+'-v2-target');
  await page.setViewportSize({width:375,height:560});validate(await measure(page,kind,'v2','target-560'));await capture(page,kind+'-v2-target-560');
  await page.setViewportSize({width:375,height:667});
  await page.locator('[data-role="cancel"]').click();
  await page.locator('[data-role="end"]').click();await page.waitForFunction(()=>MushiBattle.ui.state.turnNumber>3);
  assert.deepEqual(errors,[]);
 });
 test(kind+' A v2 online uses existing commands and resumes',async t=>{
  const app=createPrototypeServer();await app.start();t.after(()=>app.stop());
  const browser=await pw[kind].launch(kind==='chromium'&&process.env.MUSHI_A_CHROMIUM_CHANNEL!=='bundled'?{channel:'chrome'}:{});t.after(()=>browser.close());
  const pages=await Promise.all([0,1].map(()=>browser.newPage({viewport:{width:375,height:667},isMobile:true,hasTouch:true})));
  const [a,b]=pages;
  for(const p of pages){await art.install(p,t);await p.goto(app.url+'/prototype-a/online-v2.html');await p.waitForFunction(()=>!document.querySelector('#create').disabled);}
  await a.locator('#create').click();await a.locator('#room-code').waitFor();await b.locator('#code').fill(await a.locator('#room-code').innerText());await b.locator('#join').click();await b.locator('#room').waitFor();
  for(const control of ['#deck-apply','#ready'])for(const p of pages){const version=await p.locator('#board').getAttribute('data-version');await p.locator(control).click();await Promise.all(pages.map(q=>q.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),version)));}
  await a.locator('[data-role="hand"] .unit[data-card-id="namitentou"]').click();await a.locator('#sheet [data-kind="SUMMON"]').click();await b.locator('[data-role="other-field"] .unit').nth(4).waitFor();
  await a.reload();await a.locator('[data-role="own-field"] .unit').nth(4).waitFor();
  validate(await measure(a,kind,'v2','online'));await capture(a,kind+'-v2-online');
  assert.equal(await b.locator('[data-role="hand"] [data-card-id]').count(),0);
 });
}
test.after(()=>fs.writeFileSync(path.join(output,'v2-metrics.json'),JSON.stringify(metrics,null,2)));
