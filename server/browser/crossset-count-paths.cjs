'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const rt=require('../lib/runtime.cjs'),original=rt.createRuntime;
const cases=[['set6_015',false],['set6_032',false],['set6_038',false],['set7_005',false],['set7_024',false],['set7_025',false],['set7_024',true],['set7_025',true],['set6_015','EMPTY']];
let scenario=cases[0];
function setup(c,s,id,variant){
 const d=c.getCardDefinition(id);d.implementationStatus='test';s.phase='MAIN_PHASE';s.turnNumber=3;s.activePlayerId='P1';s.pendingEffect=null;
 for(const p of s.playerOrder)for(const zone of ['field','hand','discard','food'])s.player(p)[zone]=[];
 function put(pid,cardId,zone,down=false){const d=c.getCardDefinition(cardId),card=new c.CardInstance({instanceId:s.nextInstanceId(),cardId,ownerId:pid,controllerId:pid,zone,faceDown:down,baseHp:d.baseHp,currentHp:d.baseHp});s.player(pid)[zone.toLowerCase()].push(card);return card;}
 put('P1',id,'HAND');s.player('P1').availableCost=10;
 const target=put('P2','set1_003','FIELD');target.baseHp=5000;target.currentHp=5000;
 if(variant==='EMPTY')return;
 const discount=['set6_032','set6_038','set7_005'].includes(id);
 if(discount){const donor=id==='set7_005'?'set4_010':'minomushi_no_kakuremino';put('P1',donor,'DISCARD');put('P1',donor,'DISCARD',true);}
 else if(id==='set6_015'){put('P1','set1_003','DISCARD');put('P1','set1_003','DISCARD');put('P1','set5_020','DISCARD');put('P1','set1_003','DISCARD',true);}
 else{put('P1','set1_008','DISCARD');put('P1','set3_039','DISCARD');put('P1','set1_008','DISCARD',true);}
 if(variant===true)put('P2','set4_043','FIELD');
}
rt.createRuntime=function(){const r=original(),start=r.start;r.start=function(...args){const s=start(...args);setup(r.context,s,...scenario);return s;};return r;};
const {build}=require('../../scripts/build-online-candidate.cjs'),{createCandidateServer}=require('../tools/candidate-server.cjs');
const pw=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright');
for(const kind of ['chromium','webkit'])for(const mode of ['cpu','online'])test(kind+' '+mode+' filtered discard card-specific operations and current AP synchronize',async t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mushi-count-paths-'));
 t.after(()=>{assert.equal(path.dirname(dir),path.resolve(os.tmpdir()));assert(path.basename(dir).startsWith('mushi-count-paths-'));fs.rmSync(dir,{recursive:true,force:true});});
 build(path.join(dir,'candidate'));let app=createCandidateServer(path.join(dir,'candidate'),{rng:()=>0});await app.start();t.after(()=>app.stop());
 const browser=await pw[kind].launch(kind==='chromium'?{channel:'msedge'}:{});t.after(()=>browser.close());
 for(const [id,variant] of cases){scenario=[id,variant];if(mode==='online'){await app.stop();app=createCandidateServer(path.join(dir,'candidate'),{rng:()=>0});await app.start();}
  const a=await browser.newPage({viewport:{width:375,height:667},isMobile:true,hasTouch:true}),errors=[];a.on('pageerror',e=>errors.push(e.message));let b;
  try{
   if(mode==='cpu'){
    await a.goto(app.url+'/index.html');await a.locator('#btn-vs-cpu').click();await a.locator('#btn-deck-p1-kabuto').click();await a.locator('#btn-deck-p2-okama').click();await a.locator('#cpu-b-shell').waitFor();
    await a.evaluate(({code,id,variant})=>{const ui=MushiBattle.ui;ui.cpuRunner.start=()=>Promise.resolve();(0,eval)('('+code+')')(window,ui.state,id,variant);ui.render();},{code:setup.toString(),id,variant});
   }else{
    b=await browser.newPage();for(const p of [a,b]){await p.goto(app.url+'/online-b.html');await p.waitForFunction(()=>!document.querySelector('#create').disabled);}
    await a.locator('#create').click();await a.locator('#room-code').waitFor();await b.locator('#code').fill(await a.locator('#room-code').innerText());await b.locator('#join').click();await b.locator('#room').waitFor();
    for(const p of [a,b]){const v=await p.locator('#board').getAttribute('data-version');await p.locator('#deck-apply').click();await Promise.all([a,b].map(q=>q.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),v)));}
    for(const p of [a,b]){const v=await p.locator('#board').getAttribute('data-version');await p.locator('#ready').click();await Promise.all([a,b].map(q=>q.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),v)));}
    await a.waitForFunction(()=>document.querySelector('#board').dataset.roomPhase==='PLAYING');
   }
   if(await a.locator('[data-role="hand-toggle"]').getAttribute('aria-expanded')==='false')await a.locator('[data-role="hand-toggle"]').click();
   await a.locator('[data-role="hand"] .unit[data-card-id="'+id+'"]').click();await a.locator('#sheet [data-kind="SUMMON"]').click();
   const source=a.locator('[data-role="own-field"] .unit[data-card-id="'+id+'"]');await source.waitFor();
   const available={'set6_015':9,'set6_032':6,'set6_038':8,'set7_005':8,'set7_024':7,'set7_025':8}[id];
   assert.equal(await a.locator('[data-role="own-stats"]>span b').innerText(),String(available));
   await source.click();await a.getByRole('button',{name:'カード詳細',exact:true}).click();assert((await a.locator('#sheet-body').innerText()).length>20);await a.locator('[data-role="close"]').click();
   await source.click();await a.getByRole('button',{name:'攻撃する',exact:true}).click();
   const ap=id==='set6_015'?(variant==='EMPTY'?0:200):id==='set7_024'?(variant===true?300:600):id==='set7_025'?(variant===true?200:400):id==='set6_032'?800:400;
   assert((await a.locator('[data-skill]').first().innerText()).includes(String(ap)),'Engine-issued skill AP');
   await a.locator('[data-skill]').first().click();await a.locator('[data-role="other-field"] .target[data-card-id="set1_003"]').click();
   await a.waitForFunction(()=>document.querySelector('[data-role="own-field"] .unit')?.classList.contains('used'));
   const damage=ap*(id==='set7_024'||id==='set7_025'?2:1),hp=String(5000-damage);
   assert((await a.locator('[data-role="other-field"] .unit[data-card-id="set1_003"]').innerText()).includes(hp));
   if(b){await b.waitForFunction(()=>document.querySelector('[data-role="other-field"] .unit')?.classList.contains('used'));assert((await b.locator('[data-role="own-field"] .unit[data-card-id="set1_003"]').innerText()).includes(hp));}
   assert.deepEqual(errors,[]);
  }catch(e){console.log('COUNT_PATH_FAILURE',kind,mode,id,variant,e.message);console.log(await a.locator('#sheet-body').textContent().catch(()=>''));throw e;}finally{await a.close();if(b)await b.close();}
 }
});
