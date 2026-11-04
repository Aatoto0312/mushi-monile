'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const rt=require('../lib/runtime.cjs'),original=rt.createRuntime;
const {cases,setup}=require('../../tests/fixtures/keyword-enhancements-scenarios.cjs');let scenario=cases[0];
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
    await a.evaluate(({code,id,variant})=>{const ui=MushiBattle.ui;ui.cpuRunner.start=()=>Promise.resolve();(0,eval)('('+code+')')(window,ui.state,id,variant);ui.state.activePlayerId='P1';ui.render();},{code:setup.toString(),id,variant});
   }else{
    b=await browser.newPage();await art.install(b,t);for(const p of [a,b]){await p.goto(app.url+'/online-b.html',{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>!document.querySelector('#create').disabled);}
    await a.locator('#create').click();await a.locator('#room-code').waitFor();await b.locator('#code').fill(await a.locator('#room-code').innerText());await b.locator('#join').click();await b.locator('#room').waitFor();
    for(const p of [a,b]){const v=await p.locator('#board').getAttribute('data-version');await p.locator('#deck-apply').click();await Promise.all([a,b].map(q=>q.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),v)));}
    for(const p of [a,b]){const v=await p.locator('#board').getAttribute('data-version');await p.locator('#ready').click();await Promise.all([a,b].map(q=>q.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),v)));}
    await a.waitForFunction(()=>document.querySelector('#board').dataset.roomPhase==='PLAYING');
   }
   const sourceId=variant==='rope'?'kabutomushi':'set5_028';
   if(variant!=='territory'){
    if(await a.locator('[data-role="hand-toggle"]').getAttribute('aria-expanded')==='false')await a.locator('[data-role="hand-toggle"]').click();await a.locator('[data-role="hand"] .unit[data-card-id="'+id+'"]').click();await a.getByRole('button',{name:'カード詳細',exact:true}).click();assert((await a.locator('#sheet-body').innerText()).includes(id==='set5_046'?'100':'300'));await a.locator('[data-role="close"]').click();
    await a.locator('[data-role="hand"] .unit[data-card-id="'+id+'"]').click();await a.getByRole('button',{name:'強化を使う',exact:true}).click();await a.locator('[data-role="own-field"] .target[data-card-id="'+sourceId+'"]').click();await a.waitForFunction(id=>document.querySelector('[data-role="own-field"] .unit[data-card-id="'+id+'"]')?.textContent.includes('強化 1'),sourceId);
   }
   if(variant==='rope'){
    if(mode==='cpu'){await a.evaluate(()=>{const ui=MushiBattle.ui;ui.state.activePlayerId='P2';const cpu=new CpuAgent('P2',{rng:()=>0.99}),action=cpu.decideMainPhaseAction(ui.state);if(action.type!=='USE_SPELL'||!cpu.executeAction(ui.state,action))throw Error('CPU_SPELL_ENTRY');const entering=ui.state.player('P2').field.find(c=>c.cardId==='namitentou');if(!entering||getLegalAttackTargets(ui.state,entering.instanceId).length)throw Error('ENTRY_RESTRICTION_MISSING');ui.render();});}
    else{await a.locator('[data-role=end]').click();await b.locator('[data-role=end]').waitFor();for(let i=0;i<4;i++){if(await b.locator('[data-role=end]').innerText()==='ターン終了')break;await b.locator('[data-role=end]').waitFor({state:'visible'});const ver=await b.locator('#board').getAttribute('data-version');await b.locator('[data-role=end]').click();await b.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),ver);}if(await b.locator('[data-role="hand-toggle"]').getAttribute('aria-expanded')==='false')await b.locator('[data-role="hand-toggle"]').click();await b.locator('[data-role="hand"] .unit[data-card-id="set6_056"]').click();await b.locator('#sheet [data-kind=SPELL]').click();await b.locator('[data-role="own-field"] .unit[data-card-id="namitentou"]').waitFor();await b.reload({waitUntil:'domcontentloaded'});await b.locator('[data-role="own-field"] .unit[data-card-id="namitentou"]').click();assert.equal(await b.getByRole('button',{name:'攻撃する',exact:true}).count(),0);}
    await a.locator('[data-role="other-field"] .unit[data-card-id="namitentou"]').waitFor();
   }else{
    if(variant==='mask'){if(await a.locator('[data-role="hand-toggle"]').getAttribute('aria-expanded')==='false')await a.locator('[data-role="hand-toggle"]').click();await a.locator('[data-role="hand"] .unit[data-card-id="set5_064"]').click();await a.locator('#sheet [data-kind=SPELL]').click();}
    else if(mode==='cpu'){await a.evaluate(()=>{const ui=MushiBattle.ui;ui.state.activePlayerId='P2';const source=ui.state.player('P2').field[0],target=ui.state.player('P1').field.find(c=>c.cardId==='namitentou'),skill=getEffectiveAttackSkills(ui.state,source)[0],cpu=new CpuAgent('P2');if(!cpu.executeAction(ui.state,{type:'ATTACK',attackerInstanceId:source.instanceId,targetInstanceId:target.instanceId,targetType:'INSECT',skillId:skill.id}))throw Error('CPU_ATTACK');ui.render();});}
    else{await b.locator('[data-role="own-field"] .unit[data-card-id="kabutomushi"]').click();await b.getByRole('button',{name:'攻撃する',exact:true}).click();await b.locator('[data-skill]').first().click();await b.locator('[data-role="other-field"] .target[data-card-id="namitentou"]').click();}
    for(let step=0;step<2;step++){await a.locator('#sheet .online-choice-list').waitFor();if(mode==='online'&&step===1){await a.reload({waitUntil:'domcontentloaded'});await a.locator('#sheet .online-choice-list').waitFor();}const opts=a.locator('#sheet .online-choice-list button[data-ref]');assert.equal(await opts.count(),1);const ver=mode==='online'?await a.locator('#board').getAttribute('data-version'):null;await opts.first().click();await a.locator('#sheet [data-kind=CONFIRM_SELECTION]').click();if(mode==='online')await a.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),ver);}
    if(variant==='mask'){await a.waitForFunction(()=>document.querySelector('[data-role="own-field"] .unit[data-card-id="set5_028"] .hp')?.textContent.includes('HP 300 /'));assert(!(await a.locator('[data-role="own-field"] .unit[data-card-id="set5_028"]').getAttribute('class')).includes('used'));}
    else{await a.waitForFunction(()=>document.querySelector('[data-role="own-field"] .unit[data-card-id="set5_028"]')?.textContent.includes('強化 1'));assert((await a.locator('[data-role="own-field"] .unit[data-card-id="set5_028"]').innerText()).includes('600'));}
   }
   assert.deepEqual(errors,[]);
  }catch(e){console.log('COUNT_PATH_FAILURE',kind,mode,id,variant,e.message);console.log(await a.locator('#sheet-body').textContent().catch(()=>''));throw e;}finally{await a.close();if(b)await b.close();}
 }
});
