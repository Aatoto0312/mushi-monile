'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const rt=require('../lib/runtime.cjs'),original=rt.createRuntime;
const {cases,setup}=require('../../tests/fixtures/independent-scenarios.cjs');let scenario=cases[0];
rt.createRuntime=function(){const r=original(),start=r.start;r.start=function(...args){const s=start(...args);setup(r.context,s,...scenario);return s;};return r;};
const {build}=require('../../scripts/build-online-candidate.cjs'),{createCandidateServer}=require('../tools/candidate-server.cjs');
const pw=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright');
// Persist verified real JPEG bytes in the OS temp directory to avoid repeated publisher downloads.
const artDir=path.join(os.tmpdir(),'mushi-real-card-art-cache');fs.mkdirSync(artDir,{recursive:true});
const art=require('../tools/browser-actual-art.cjs').createActualArtCache(async(url,options)=>{const f=path.join(artDir,require('crypto').createHash('sha256').update(url).digest('hex')+'.jpg');if(fs.existsSync(f)){const bytes=fs.readFileSync(f);return {status:200,arrayBuffer:async()=>bytes};}const response=await fetch(url,options);if(response.status!==200)return response;const bytes=Buffer.from(await response.arrayBuffer());if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255)fs.writeFileSync(f,bytes);return {status:response.status,arrayBuffer:async()=>bytes};});
for(const kind of ['chromium','webkit'])for(const mode of ['cpu','online'])test(kind+' '+mode+' predicate cards paid summon,second skill,legal target and damage synchronize',async t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mushi-predicate-paths-'));
 t.after(()=>{assert.equal(path.dirname(dir),path.resolve(os.tmpdir()));assert(path.basename(dir).startsWith('mushi-predicate-paths-'));fs.rmSync(dir,{recursive:true,force:true});});
 build(path.join(dir,'candidate'));let app=createCandidateServer(path.join(dir,'candidate'),{rng:()=>0});await app.start();t.after(()=>app.stop());
 const browser=await pw[kind].launch(kind==='chromium'?{channel:'msedge'}:{});t.after(()=>browser.close());
 for(const [id,variant,available,ap,skillIndex,targetId,hpBefore] of cases.filter(c=>!process.env.MUSHI_PREDICATE_ONLY||c[0]===process.env.MUSHI_PREDICATE_ONLY)){scenario=[id,variant];console.log('PREDICATE_START',kind,mode,id);if(mode==='online'){await app.stop();app=createCandidateServer(path.join(dir,'candidate'),{rng:()=>0});await app.start();}
  const a=await browser.newPage({viewport:{width:375,height:667},isMobile:true,hasTouch:true}),errors=[];a.setDefaultTimeout(15000);await art.install(a,t);a.on('pageerror',e=>errors.push(e.message));let b;
  try{
   if(mode==='cpu'){
    await a.goto(app.url+'/index.html',{waitUntil:'domcontentloaded'});await a.locator('#btn-vs-cpu').click();await a.locator('#btn-deck-p1-kabuto').click();await a.locator('#btn-deck-p2-okama').click();await a.locator('#cpu-b-shell').waitFor();
    await a.evaluate(({code,id,variant})=>{const ui=MushiBattle.ui;ui.cpuRunner.start=()=>Promise.resolve();(0,eval)('('+code+')')(window,ui.state,id,variant);ui.render();},{code:setup.toString(),id,variant});
   }else{
    b=await browser.newPage();await art.install(b,t);for(const p of [a,b]){await p.goto(app.url+'/online-b.html',{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>!document.querySelector('#create').disabled);}
    await a.locator('#create').click();await a.locator('#room-code').waitFor();await b.locator('#code').fill(await a.locator('#room-code').innerText());await b.locator('#join').click();await b.locator('#room').waitFor();
    for(const p of [a,b]){const v=await p.locator('#board').getAttribute('data-version');await p.locator('#deck-apply').click();await Promise.all([a,b].map(q=>q.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),v)));}
    for(const p of [a,b]){const v=await p.locator('#board').getAttribute('data-version');await p.locator('#ready').click();await Promise.all([a,b].map(q=>q.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),v)));}
    await a.waitForFunction(()=>document.querySelector('#board').dataset.roomPhase==='PLAYING');
   }
   if(await a.locator('[data-role="hand-toggle"]').getAttribute('aria-expanded')==='false')await a.locator('[data-role="hand-toggle"]').click();
   await a.locator('[data-role="hand"] .unit[data-card-id="'+id+'"]').click();await a.locator('#sheet [data-kind="SUMMON"]').click();
   const source=a.locator('[data-role="own-field"] .unit[data-card-id="'+id+'"]');await source.waitFor();
   assert.equal(await a.locator('[data-role="own-stats"]>span b').innerText(),String(available));
   if(variant==='sourceattachment'){if(await a.locator('[data-role="hand-toggle"]').getAttribute('aria-expanded')==='false')await a.locator('[data-role="hand-toggle"]').click();await a.locator('[data-role="hand"] .unit[data-card-id="minomushi_no_kakuremino"]').click();await a.getByRole('button',{name:'強化を使う',exact:true}).click();await source.click();await a.waitForFunction(()=>document.querySelector('[data-role="own-field"] .unit')?.textContent.includes('強化 1'));}
   await source.click();await a.getByRole('button',{name:'カード詳細',exact:true}).click();assert((await a.locator('#sheet-body').innerText()).length>20);await a.locator('[data-role="close"]').click();
   await source.click();await a.getByRole('button',{name:'攻撃する',exact:true}).click();
   assert((await a.locator('[data-skill]').nth(skillIndex).innerText()).includes(String(ap)),'Engine-issued skill AP');
   await a.locator('[data-skill]').nth(skillIndex).click();await a.locator('[data-role="other-field"] .target[data-card-id="'+targetId+'"]').click();
   await a.waitForFunction(id=>document.querySelector('[data-role="own-field"] .unit[data-card-id="'+id+'"]')?.classList.contains('used'),id);
   const defs=rt.createRuntime().context,color=defs.getCardDefinition(id).color,targetColor=variant==='color'?'COLORLESS':defs.getCardDefinition(targetId).color;const factor=({RED:'GREEN',BLUE:'RED',GREEN:'BLUE'})[color]===targetColor?2:1;const damage=ap*factor,hp=String(hpBefore-damage);
   if(variant.startsWith('bounce')){
    assert.equal(await a.locator('[data-role="other-field"] .unit[data-card-id="'+targetId+'"]').count(),0);
    if(b){await b.waitForFunction(()=>document.querySelectorAll('[data-role="own-field"] .unit').length===0);await b.waitForFunction(id=>document.querySelector('[data-role="other-field"] .unit[data-card-id="'+id+'"]')?.classList.contains('used'),id);}
   }else{
   assert((await a.locator('[data-role="other-field"] .unit[data-card-id="'+targetId+'"]').innerText()).includes(hp));
   if(b){await b.waitForFunction(id=>document.querySelector('[data-role="other-field"] .unit[data-card-id="'+id+'"]')?.classList.contains('used'),id);assert((await b.locator('[data-role="own-field"] .unit[data-card-id="'+targetId+'"]').innerText()).includes(hp));}
   }
   if(variant==='sourceattachment'){await source.click();await a.getByRole('button',{name:'攻撃する',exact:true}).click();await a.locator('[data-skill]').filter({hasText:'蟷螂蘭舞'}).click();await a.locator('[data-role="other-field"] .target[data-card-id="'+targetId+'"]').click();await a.waitForFunction(hp=>document.querySelector('[data-role="other-field"] .unit .hp')?.textContent.includes('HP '+hp+' /'),hpBefore-damage*2);if(b)await b.waitForFunction(hp=>document.querySelector('[data-role="own-field"] .unit .hp')?.textContent.includes('HP '+hp+' /'),hpBefore-damage*2);}
   assert.deepEqual(errors,[]);
  }catch(e){console.log('COUNT_PATH_FAILURE',kind,mode,id,variant,e.message);console.log(await a.locator('#sheet-body').textContent().catch(()=>''));throw e;}finally{await a.close();if(b)await b.close();}
 }
});






