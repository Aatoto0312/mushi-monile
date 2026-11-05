'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),os=require('os'),path=require('path');
const rt=require('../lib/runtime.cjs'),original=rt.createRuntime,{cases,setup}=require('../../tests/fixtures/spell-counter-scenarios.cjs');let scenario=cases[0];
rt.createRuntime=function(){const r=original(),start=r.start;r.start=(...args)=>{const s=start(...args);setup(r.context,s,...scenario);return s;};return r;};
const {build}=require('../../scripts/build-online-candidate.cjs'),{createCandidateServer}=require('../tools/candidate-server.cjs'),pw=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright'),art=require('../tools/browser-actual-art.cjs');
for(const kind of ['chromium','webkit'])for(const mode of ['cpu','online'])test(kind+' '+mode+' real counters, target declaration and effect payment',async t=>{
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'mushi-counter-paths-'));t.after(()=>{assert.equal(path.dirname(parent),path.resolve(os.tmpdir()));assert(path.basename(parent).startsWith('mushi-counter-paths-'));fs.rmSync(parent,{recursive:true,force:true});});
 build(path.join(parent,'candidate'));let app=createCandidateServer(path.join(parent,'candidate'),{rng:()=>0});await app.start();t.after(()=>app.stop());const browser=await pw[kind].launch(kind==='chromium'?{channel:'msedge'}:{});t.after(()=>browser.close());
 for(const [id,variant]of cases){scenario=[id,variant];if(mode==='online'){await app.stop();app=createCandidateServer(path.join(parent,'candidate'),{rng:()=>0});await app.start();}
  const a=await browser.newPage({viewport:{width:375,height:667},isMobile:true,hasTouch:true}),errors=[];let b;a.setDefaultTimeout(12000);await art.installActualArt(a,t);a.on('pageerror',e=>errors.push(e.message));
  try{
   if(mode==='cpu'){
    await a.addInitScript(()=>{Math.random=()=>0;});await a.goto(app.url+'/index.html');await a.locator('#btn-vs-cpu').click();await a.locator('#btn-deck-p1-kabuto').click();await a.locator('#btn-deck-p2-okama').click();await a.locator('#cpu-b-shell').waitFor();
    await a.evaluate(({code,id,variant})=>{const ui=MushiBattle.ui;ui.cpuRunner.start=()=>Promise.resolve();(0,eval)('('+code+')')(window,ui.state,id,variant);ui.render();},{code:setup.toString(),id,variant});
   }else{
    b=await browser.newPage();b.setDefaultTimeout(12000);await art.installActualArt(b,t);for(const p of [a,b]){await p.goto(app.url+'/online-b.html');await p.waitForFunction(()=>!document.querySelector('#create').disabled);}
    await a.locator('#create').click();await a.locator('#room-code').waitFor();await b.locator('#code').fill(await a.locator('#room-code').innerText());await b.locator('#join').click();await b.locator('#room').waitFor();
    for(const p of [a,b]){const v=await p.locator('#board').getAttribute('data-version');await p.locator('#deck-apply').click();await Promise.all([a,b].map(q=>q.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),v)));}
    for(const p of [a,b]){const v=await p.locator('#board').getAttribute('data-version');await p.locator('#ready').click();await Promise.all([a,b].map(q=>q.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),v)));}
    await a.waitForFunction(()=>document.querySelector('#board').dataset.roomPhase==='PLAYING');
   }
   const spellId=variant==='hand'?'set1_125':variant==='variable'?'set3_054':variant==='high'?'set2_053':'mushi_no_ibuki';
   if(await a.locator('[data-role=hand-toggle]').getAttribute('aria-expanded')==='false')await a.locator('[data-role=hand-toggle]').click();
   await a.locator('[data-role=hand] .unit[data-card-id="'+spellId+'"]').click();await a.locator('#sheet [data-kind=SPELL]').click();
   if(variant!=='replacement'){await a.locator('#sheet .online-choice-list').waitFor();await a.locator('#sheet .online-choice-list button[data-ref]').filter({hasText:variant==='hand'?'カブトムシ':'ナミテントウ'}).click();await a.locator('#sheet [data-kind=CONFIRM_SELECTION]').click();}
   if(variant==='variable'){
    if(mode==='cpu')await a.evaluate(()=>{const ui=MushiBattle.ui;for(let i=0;ui.state.pendingEffect&&i<10;i++){const cpu=new CpuAgent(ui.state.pendingEffect.playerId,{rng:()=>0});if(!cpu.executeAction(ui.state,cpu.getPendingAction(ui.state)))throw Error('CPU counter choice failed');}ui.render();});
    else{await b.locator('[data-role=all-actions]').click();await b.locator('#sheet [data-kind=CHOICE]').first().click();}
   }
   const expectedCost=variant==='high'?18:variant==='replacement'?19:20,remaining=variant==='replacement'||variant==='high'&&id==='set7_027'?1:0;
   await a.waitForFunction(cost=>document.querySelector('[data-role=own-stats] > span b').textContent===String(cost),expectedCost);
   await a.waitForFunction(({id,n})=>document.querySelectorAll('[data-role=other-field] .unit[data-card-id="'+id+'"]').length===n,{id,n:remaining});
   if(variant==='hand'){const p=b||a;await p.locator('[data-role=menu]').first().click();await p.getByRole('button',{name:'対戦ログ',exact:true}).click();const log=await p.locator('#sheet-body').innerText();assert(log.includes('使用対象を公開 カブトムシ'));assert(log.includes('術打ち消し'));assert(!log.includes('オオカマキリ'));await p.locator('#close').click();}
   if(mode==='online'){await a.reload();await a.waitForFunction(cost=>document.querySelector('[data-role=own-stats] > span b')?.textContent===String(cost),expectedCost);assert.equal(await a.locator('[data-role=other-field] .unit[data-card-id="'+id+'"]').count(),remaining);}
   assert.deepEqual(errors,[]);
  }catch(e){console.log('COUNTER_PATH_FAILURE',kind,mode,id,variant,e.message);throw e;}finally{await a.close();if(b)await b.close();}
 }t.diagnostic(JSON.stringify({cardIds:['set7_023','set7_027'],scenarios:cases.length,mode}));
});
