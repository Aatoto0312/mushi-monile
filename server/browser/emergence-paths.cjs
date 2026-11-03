'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const rt=require('../lib/runtime.cjs'),original=rt.createRuntime;
const {cases,setup}=require('../../tests/fixtures/emergence-scenarios.cjs');let scenario=cases[0];
rt.createRuntime=function(){const r=original(),start=r.start;r.start=function(...args){const s=start(...args);setup(r.context,s,...scenario);return s;};return r;};
const {build}=require('../../scripts/build-online-candidate.cjs'),{createCandidateServer}=require('../tools/candidate-server.cjs');
const pw=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright');
for(const kind of ['chromium','webkit'])for(const mode of ['cpu','online'])test(kind+' '+mode+' predicate cards paid summon,second skill,legal target and damage synchronize',async t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mushi-emergence-paths-'));
 t.after(()=>{assert.equal(path.dirname(dir),path.resolve(os.tmpdir()));assert(path.basename(dir).startsWith('mushi-emergence-paths-'));fs.rmSync(dir,{recursive:true,force:true});});
 build(path.join(dir,'candidate'));let app=createCandidateServer(path.join(dir,'candidate'),{rng:()=>0});await app.start();t.after(()=>app.stop());
 const browser=await pw[kind].launch(kind==='chromium'?{channel:'msedge'}:{});t.after(()=>browser.close());
 for(const [id,variant,hp,ap,partner] of cases.filter(c=>!process.env.MUSHI_PREDICATE_ONLY||c[0]===process.env.MUSHI_PREDICATE_ONLY)){scenario=[id,variant,hp,ap,partner];console.log('PREDICATE_START',kind,mode,id);if(mode==='online'){await app.stop();app=createCandidateServer(path.join(dir,'candidate'),{rng:()=>0});await app.start();}
  const a=await browser.newPage({viewport:{width:375,height:667},isMobile:true,hasTouch:true}),errors=[];a.setDefaultTimeout(15000);a.on('pageerror',e=>errors.push(e.message));let b;
  try{
   if(mode==='cpu'){
    await a.goto(app.url+'/index.html',{waitUntil:'domcontentloaded'});await a.locator('#btn-vs-cpu').click();await a.locator('#btn-deck-p1-kabuto').click();await a.locator('#btn-deck-p2-okama').click();await a.locator('#cpu-b-shell').waitFor();
    await a.evaluate(({code,id,variant,hp,ap,partner})=>{const ui=MushiBattle.ui;ui.cpuRunner.start=()=>Promise.resolve();(0,eval)('('+code+')')(window,ui.state,id,variant,hp,ap,partner);if(variant==='death'){const cpu=new CpuAgent('P2',{rng:()=>0}),s=ui.state;cpu.executeAction(s,{type:'ATTACK',attackerInstanceId:s.player('P2').field[0].instanceId,targetInstanceId:s.player('P1').field[0].instanceId,targetType:'INSECT'});}ui.render();},{code:setup.toString(),id,variant,hp,ap,partner});
   }else{
    b=await browser.newPage();for(const p of [a,b]){await p.goto(app.url+'/online-b.html',{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>!document.querySelector('#create').disabled);}
    await a.locator('#create').click();await a.locator('#room-code').waitFor();await b.locator('#code').fill(await a.locator('#room-code').innerText());await b.locator('#join').click();await b.locator('#room').waitFor();
    for(const p of [a,b]){const v=await p.locator('#board').getAttribute('data-version');await p.locator('#deck-apply').click();await Promise.all([a,b].map(q=>q.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),v)));}
    for(const p of [a,b]){const v=await p.locator('#board').getAttribute('data-version');await p.locator('#ready').click();await Promise.all([a,b].map(q=>q.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),v)));}
    await a.waitForFunction(()=>document.querySelector('#board').dataset.roomPhase==='PLAYING');
   }
   if(variant==='death'&&mode==='online'){
    await b.locator('[data-role="own-field"] .unit').click();await b.getByRole('button',{name:'攻撃する',exact:true}).click();await b.locator('[data-skill]').first().click();await b.locator('[data-role="other-field"] .target[data-card-id="'+id+'"]').click();await a.locator('.online-choice-list button[data-ref]:visible').first().waitFor();
   }else if(variant!=='death'){
    if(await a.locator('[data-role="hand-toggle"]').getAttribute('aria-expanded')==='false')await a.locator('[data-role="hand-toggle"]').click();
    const v=await a.locator('#board').getAttribute('data-version'),spell=variant==='night'?'set4_057':'set2_051';
    await a.locator('[data-role="hand"] .unit[data-card-id="'+spell+'"]').click();await a.locator('#sheet [data-kind="SPELL"]').click();await a.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),v);
   }
   const choices=a.locator('.online-choice-list button[data-ref]:visible');
   if(await choices.count()){
    if(mode==='online'){await a.reload({waitUntil:'domcontentloaded'});await choices.first().waitFor();}
    const v=await a.locator('#board').getAttribute('data-version');
    if(variant==='death'){assert.equal(await choices.count(),1);await choices.first().click();}
    else{assert.equal(await choices.count(),2);for(const choice of await choices.all())await choice.click();}
    await a.getByRole('button',{name:'選択を決定',exact:true}).click();await a.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),v);
   }
   const adult=variant==='death'?partner:id;
   const source=a.locator('[data-role="own-field"] .unit[data-card-id="'+adult+'"]').first();await source.waitFor();
   assert.equal(await a.locator('[data-role="own-stats"]>span b').innerText(),String(10));
   assert((await source.innerText()).includes(String(hp)));assert((await source.innerText()).includes(String(ap)));
   await source.click();await a.getByRole('button',{name:'カード詳細',exact:true}).click();assert((await a.locator('#sheet-body').innerText()).includes('転生強化'));await a.locator('[data-role="close"]').click();
   if(variant!=='death'){
    await source.click();await a.getByRole('button',{name:'攻撃する',exact:true}).click();assert((await a.locator('[data-skill]').first().innerText()).includes(String(ap)));await a.locator('[data-skill]').first().click();await a.locator('[data-role="other-field"] .target[data-card-id="set5_004"]').click();
    await a.waitForFunction(id=>document.querySelector('[data-role="own-field"] .unit[data-card-id="'+id+'"]')?.classList.contains('used'),adult);
    const expected=String(5000-ap*2);assert((await a.locator('[data-role="other-field"] .unit').innerText()).includes(expected));
   }
   if(b){await b.waitForFunction(id=>!!document.querySelector('[data-role="other-field"] .unit[data-card-id="'+id+'"]'),adult);assert((await b.locator('[data-role="other-field"] .unit[data-card-id="'+adult+'"]').innerText()).includes(String(hp)));}
   assert.deepEqual(errors,[]);
  }catch(e){console.log('COUNT_PATH_FAILURE',kind,mode,id,variant,e.message);console.log(await a.locator('#sheet-body').textContent().catch(()=>''));throw e;}finally{await a.close();if(b)await b.close();}
 }
});
