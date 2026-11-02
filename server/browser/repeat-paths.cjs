'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const rt=require('../lib/runtime.cjs'),original=rt.createRuntime;
const {cases,setup}=require('../../tests/fixtures/repeat-scenarios.cjs');let scenario=cases[0];
rt.createRuntime=function(){const r=original(),start=r.start;r.start=function(...args){const s=start(...args);setup(r.context,s,...scenario);return s;};return r;};
const {build}=require('../../scripts/build-online-candidate.cjs'),{createCandidateServer}=require('../tools/candidate-server.cjs');
const pw=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright');
for(const kind of ['chromium','webkit'])for(const mode of ['cpu','online'])test(kind+' '+mode+' predicate cards paid summon,second skill,legal target and damage synchronize',async t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mushi-repeat-paths-'));
 t.after(()=>{assert.equal(path.dirname(dir),path.resolve(os.tmpdir()));assert(path.basename(dir).startsWith('mushi-repeat-paths-'));fs.rmSync(dir,{recursive:true,force:true});});
 build(path.join(dir,'candidate'));let app=createCandidateServer(path.join(dir,'candidate'),{rng:()=>0});await app.start();t.after(()=>app.stop());
 const browser=await pw[kind].launch(kind==='chromium'?{channel:'msedge'}:{});t.after(()=>browser.close());
 for(const [id,variant,available,ap,skillIndex,targetId,hpBefore] of cases.filter(c=>!process.env.MUSHI_PREDICATE_ONLY||c[0]===process.env.MUSHI_PREDICATE_ONLY)){scenario=[id,variant];console.log('PREDICATE_START',kind,mode,id);if(mode==='online'){await app.stop();app=createCandidateServer(path.join(dir,'candidate'),{rng:()=>0});await app.start();}
  const a=await browser.newPage({viewport:{width:375,height:667},isMobile:true,hasTouch:true}),errors=[];a.setDefaultTimeout(15000);a.on('pageerror',e=>errors.push(e.message));let b;
  try{
   if(mode==='cpu'){
    await a.goto(app.url+'/index.html',{waitUntil:'domcontentloaded'});await a.locator('#btn-vs-cpu').click();await a.locator('#btn-deck-p1-kabuto').click();await a.locator('#btn-deck-p2-okama').click();await a.locator('#cpu-b-shell').waitFor();
    await a.evaluate(({code,id,variant})=>{const ui=MushiBattle.ui;ui.cpuRunner.start=()=>Promise.resolve();(0,eval)('('+code+')')(window,ui.state,id,variant);ui.render();},{code:setup.toString(),id,variant});
   }else{
    b=await browser.newPage();for(const p of [a,b]){await p.goto(app.url+'/online-b.html',{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>!document.querySelector('#create').disabled);}
    await a.locator('#create').click();await a.locator('#room-code').waitFor();await b.locator('#code').fill(await a.locator('#room-code').innerText());await b.locator('#join').click();await b.locator('#room').waitFor();
    for(const p of [a,b]){const v=await p.locator('#board').getAttribute('data-version');await p.locator('#deck-apply').click();await Promise.all([a,b].map(q=>q.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),v)));}
    for(const p of [a,b]){const v=await p.locator('#board').getAttribute('data-version');await p.locator('#ready').click();await Promise.all([a,b].map(q=>q.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),v)));}
    await a.waitForFunction(()=>document.querySelector('#board').dataset.roomPhase==='PLAYING');
   }
   async function choose(){const version=await a.locator('#board').getAttribute('data-version');await a.locator('.online-choice-list button[data-ref]').first().click();await a.getByRole('button',{name:'選択を決定',exact:true}).click();await a.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),version);}
   if(await a.locator('[data-role="hand-toggle"]').getAttribute('aria-expanded')==='false')await a.locator('[data-role="hand-toggle"]').click();
   await a.locator('[data-role="hand"] .unit[data-card-id="'+id+'"]').click();await a.locator('#sheet [data-kind="SPELL"]').click();
   await choose();
   for(let step=0;step<skillIndex;step++){
    await a.locator('.online-choice-list button[data-ref]').first().waitFor();
    if(mode==='online'&&step===0){await a.reload({waitUntil:'domcontentloaded'});await a.locator('.online-choice-list button[data-ref]').first().waitFor();}
    await choose();
   }
   const expected=String(hpBefore-ap*(skillIndex+1));
   await a.waitForFunction(({id,hp})=>document.querySelector('[data-role="other-field"] .unit[data-card-id="'+id+'"]')?.innerText.includes(hp),{id:targetId,hp:expected});
   assert.equal(await a.locator('[data-role="own-stats"]>span b').innerText(),String(available));
   if(b)await b.waitForFunction(({id,hp})=>document.querySelector('[data-role="own-field"] .unit[data-card-id="'+id+'"]')?.innerText.includes(hp),{id:targetId,hp:expected});
   assert.deepEqual(errors,[]);
  }catch(e){console.log('COUNT_PATH_FAILURE',kind,mode,id,variant,e.message);console.log(await a.locator('#sheet-body').textContent().catch(()=>''));throw e;}finally{await a.close();if(b)await b.close();}
 }
});
