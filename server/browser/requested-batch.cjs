'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const rt=require('../lib/runtime.cjs'),original=rt.createRuntime,{cases}=require('../../tests/fixtures/requested-batch-scenarios.cjs');let scenario;
rt.createRuntime=()=>{const r=original(),start=r.start;r.start=(...args)=>{const s=start(...args);scenario.setup(r.context,s,scenario.id);return s;};return r;};
const {build}=require('../../scripts/build-online-candidate.cjs'),{createCandidateServer}=require('../tools/candidate-server.cjs');
const pw=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright'),art=require('../tools/browser-actual-art.cjs').createActualArtCache();
const selected=cases.filter(x=>!process.env.MUSHI_BATCH_ONLY||x.id===process.env.MUSHI_BATCH_ONLY);
async function online(browser,url){const a=await browser.newPage({viewport:{width:375,height:667},isMobile:true,hasTouch:true}),b=await browser.newPage();
 for(const p of [a,b]){p.setDefaultTimeout(12000);await art.install(p,{after:()=>{},diagnostic:()=>{}});await p.goto(url+'/online-b.html');await p.waitForFunction(()=>!document.querySelector('#create').disabled);}
 await a.locator('#create').click();await a.locator('#room-code').waitFor();await b.locator('#code').fill(await a.locator('#room-code').innerText());await b.locator('#join').click();await b.locator('#room').waitFor();
 for(const p of [a,b]){await p.locator('#deck-apply').click();await p.waitForFunction(()=>!document.querySelector('#ready').disabled);}for(const p of [a,b])await p.locator('#ready').click();await a.waitForFunction(()=>document.querySelector('#board').dataset.roomPhase==='PLAYING');return {a,b};
}
async function settle(page,mode){let reconnected=false;for(let n=0;n<25;n++){
 if(mode==='legacy'){
   const p=await page.evaluate(()=>{const x=MushiBattle.ui.state.pendingEffect;return x?{type:x.type,options:x.options,exact:x.exactSelections,min:x.minSelections,max:x.maxSelections,combinations:x.allowedCombinations,purpose:x.selectionPurpose,continuation:x.continuation?.type}:null;});if(!p)return;
   if(p.type==='CHOICE_SELECTION'){const choices=page.locator('#skill-select-row button:visible'),use=choices.filter({hasText:'コストを支払わず使用'});await (await use.count()?use.first():choices.first()).click();continue;}
   if(p.type==='SPELL_TARGET_SELECTION'){await page.locator('[data-instance-id="'+p.options[0]+'"]').filter({visible:true}).first().click();continue;}
   const picker=page.locator('#attachment-picker[open]'),modal=await picker.isVisible();const ids=p.combinations?.[0]||p.options.slice(0,p.exact??Math.max(p.min,Math.min(1,p.max)));for(const id of ids)await (modal?picker.locator('[data-instance-id="'+id+'"]'):page.locator('[data-instance-id="'+id+'"]').filter({visible:true}).first()).click();const same=await page.evaluate(p=>{const x=MushiBattle.ui.state.pendingEffect;return x?.type==='CARD_SELECTION'&&x.selectionPurpose===p.purpose&&x.continuation?.type===p.continuation;},p);if(same){if(await picker.isVisible())await picker.getByRole('button',{name:'選択を決定',exact:true}).click();else await page.locator('#btn-end-turn').click();}continue;
 }
 const list=page.locator('.online-choice-list:visible'),choices=page.locator('#sheet-body [data-kind="CHOICE"]:visible');
 if(await list.count()){
   if(mode==='online'&&!reconnected){reconnected=true;await page.reload();await page.locator('.online-choice-list:visible').waitFor();}
   const text=await page.locator('#sheet-body>p').first().innerText(),match=text.match(/最大(\d+)枚/)||text.match(/〜(\d+)枚/);assert(match,text);const max=Number(match[1]),items=page.locator('.online-choice-list:visible button[data-ref]');
   for(let i=0;i<Math.min(max,await items.count());i++)await items.nth(i).click();const version=await page.locator('#board').getAttribute('data-version');await page.locator('[data-kind="CONFIRM_SELECTION"]:visible').click();await page.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),version);continue;
 }
 if(await choices.count()){const use=choices.filter({hasText:'コストを支払わず使用'}),version=await page.locator('#board').getAttribute('data-version');await (await use.count()?use.first():choices.first()).click();await page.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),version);continue;}
 return;
 }throw Error('Pending selection loop');}
for(const kind of ['chromium','webkit'])for(const mode of ['cpu','legacy','online'])test(kind+' '+mode+' requested batch actual card operations',async t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mushi-nine-'));t.after(()=>{assert.equal(path.dirname(dir),path.resolve(os.tmpdir()));assert(path.basename(dir).startsWith('mushi-nine-'));fs.rmSync(dir,{recursive:true,force:true});});
 const candidate=process.env.MUSHI_CANDIDATE_DIRECTORY||path.join(dir,'candidate');if(!process.env.MUSHI_CANDIDATE_DIRECTORY)build(candidate);
 const browser=await pw[kind].launch(kind==='chromium'&&process.env.MUSHI_CHROMIUM_CHANNEL!=='bundled'?{channel:'msedge'}:{});t.after(()=>browser.close());
 for(const item of selected){scenario=item;const app=createCandidateServer(candidate,{rng:()=>0});await app.start();let a,b;const errors=[];try{
   if(mode==='online')({a,b}=await online(browser,app.url));else{a=await browser.newPage({viewport:{width:375,height:667},isMobile:true,hasTouch:true});a.setDefaultTimeout(12000);await art.install(a,t);await a.goto(app.url+'/index.html?battleUi='+(mode==='legacy'?'legacy':'new'));await a.locator('#btn-vs-cpu').click();await a.locator('#btn-deck-p1-kabuto').click();await a.locator('#btn-deck-p2-okama').click();await a.evaluate(({code,id})=>{const ui=MushiBattle.ui;ui.cpuRunner.start=()=>Promise.resolve();(0,eval)('('+code+')')(window,ui.state,id);ui.render();},{code:item.setup.toString(),id:item.id});}
   a.on('pageerror',e=>errors.push(e.message));const insect=['set7_004','set6_001','set8_013'].includes(item.id);
   if(mode==='legacy'){
     const sourceId=await a.evaluate(id=>{const p=MushiBattle.ui.state.player('P1');return [...p.field,...p.hand].find(x=>x.cardId===id).instanceId;},item.id);
     if(insect){await a.locator('#self-field-zone [data-instance-id="'+sourceId+'"]').click();await a.locator('#skill-select-row button:visible').last().click();await a.locator('#opp-field-zone [data-instance-id]').first().click();}
     else{await a.locator('#self-hand-zone [data-instance-id="'+sourceId+'"]').click();const name=item.id==='set8_003'?/自分の場の虫.*破壊/:item.id==='set5_054'?/^強化する/:/^術を使う/;await a.locator('#card-detail-actions button').filter({hasText:name}).click();}
   }else{
     const version=await a.locator('#board').getAttribute('data-version');
     if(insect){await a.locator('[data-role="own-field"] .unit[data-card-id="'+item.id+'"]').click();await a.getByRole('button',{name:'攻撃する',exact:true}).click();await a.locator('[data-skill]').last().click();await a.locator('[data-role="other-field"] .unit').first().click();}
     else{await a.locator('[data-role="hand-toggle"]').click();await a.locator('[data-role="hand"] .unit[data-card-id="'+item.id+'"]').click();if(item.id==='set5_054')await a.getByRole('button',{name:'強化を使う',exact:true}).click();else await a.locator('#sheet [data-kind="'+(item.id==='set8_003'?'ALTERNATIVE':'SPELL')+'"]').click();}
     await a.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),version);
   }
   await settle(a,mode);
   if(mode!=='online'){const result=await a.evaluate(id=>{const s=MushiBattle.ui.state,p=s.player('P1'),host=p.field.find(x=>x.cardId===id)||p.field[0];return {pending:!!s.pendingEffect,field:p.field.map(x=>x.cardId),attached:host?.attachments?.length||0,attacked:host?.attackedThisTurn,marked:s.player('P2').field[0]?.runtimeFlags.destroyOnNextDamage,hp:s.player('P2').field[0]?.currentHp,cost:p.availableCost,grant:!!s.freeCardUse};},item.id);assert(!result.pending&&!result.grant,JSON.stringify(result));if(item.id==='set7_004')assert(result.marked);if(item.id==='set6_063')assert(result.field.includes('namitentou'));if(item.id==='set8_003'){assert(result.field.includes(item.id));assert.equal(result.cost,0);}if(['set5_054','set7_064','set6_001'].includes(item.id))assert.equal(result.attached,1);if(item.id==='set7_064')assert.equal(result.attacked,false);}
   else{await b.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>=Number(v),await a.locator('#board').getAttribute('data-version'));if(item.id==='set6_063')assert(await a.locator('[data-role="own-field"] .unit[data-card-id="namitentou"]').count());if(item.id==='set8_003')assert(await a.locator('[data-role="own-field"] .unit[data-card-id="set8_003"]').count());if(['set5_054','set7_064','set6_001'].includes(item.id))assert((await a.locator('[data-role="own-field"]').innerText()).includes('強化 1'));}
   assert.deepEqual(errors,[]);if(process.env.MUSHI_UI_EVIDENCE){fs.mkdirSync(process.env.MUSHI_UI_EVIDENCE,{recursive:true});await a.screenshot({path:path.join(process.env.MUSHI_UI_EVIDENCE,kind+'-'+mode+'-'+item.id+'.png')});}t.diagnostic(item.id+' actual UI path passed');
 }catch(error){console.error('BATCH_UI_FAIL',kind,mode,item.id,error.message);throw error;}finally{if(a)await a.close();if(b)await b.close();await app.stop();}}
});
