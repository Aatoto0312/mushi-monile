const {test}=require('node:test'),assert=require('node:assert/strict'),{createRuntime}=require('../lib/runtime.cjs');
const pw=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright');
const candidate=process.env.MUSHI_CANDIDATE_DIRECTORY;if(!candidate)throw Error('MUSHI_CANDIDATE_DIRECTORY is required');
const {createCandidateServer}=require('../tools/candidate-server.cjs');
for(const engine of ['chromium','webkit']){
 test(engine+' candidate preserves invalid saved decks and gives actionable errors',async t=>{
  const app=createCandidateServer(candidate);await app.start();t.after(()=>app.stop());const base=app.url;
  const browser=await pw[engine].launch(engine==='chromium'?{channel:'msedge'}:{});t.after(()=>browser.close());const preset=JSON.parse(JSON.stringify(createRuntime().preset('KABUTOMUSHI'))),errors=[];
  for(const kind of ['partial','wrong-version','nineteen','missing','malformed']){
   const deck=JSON.parse(JSON.stringify(preset));if(kind==='partial'){assert.equal(createRuntime().context.getCardDefinition('set5_007').implementationStatus,'PARTIAL');deck.cards[0]={canonicalCardId:'set5_007',printingId:'registry:set5_007',quantity:2};}if(kind==='wrong-version')deck.formatVersion='future/v2';if(kind==='nineteen')deck.cards[0].quantity=1;if(kind==='malformed')deck.cards[0]=null;
   const raw=JSON.stringify({storageVersion:1,activeDeckId:deck.deckId,decks:[deck]}),context=await browser.newContext();await context.addInitScript(raw=>localStorage.setItem('mushijingiToolboxDecksV1',raw),raw);const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/online-b.html?deck='+encodeURIComponent(kind==='missing'?'absent':deck.deckId));await page.waitForFunction(()=>!document.querySelector('#create').disabled);await page.locator('#create').click();await page.locator('#room').waitFor();assert(await page.locator('#deck-apply').isDisabled(),kind);assert(await page.locator('#ready').isDisabled(),kind);assert((await page.locator('#deck-readiness').innerText()).length>10,kind);assert.equal(await page.evaluate(()=>localStorage.getItem('mushijingiToolboxDecksV1')),raw);
   await page.locator('#deck-select').selectOption('preset:KABUTOMUSHI');assert(await page.locator('#deck-apply').isEnabled());await context.close();
  }assert.deepEqual(errors,[]);
 });
 test(engine+' candidate retains the old online UI room, legal actions and resume',async t=>{
  const app=createCandidateServer(candidate);await app.start();t.after(()=>app.stop());const base=app.url;
  const browser=await pw[engine].launch(engine==='chromium'?{channel:'msedge'}:{});t.after(()=>browser.close());const a=await browser.newPage(),b=await(await browser.newContext()).newPage(),errors=[];
  for(const p of [a,b]){p.on('pageerror',e=>errors.push(e.message));await p.goto(base+'/online.html');await p.waitForFunction(()=>!document.querySelector('#create').disabled);}
  await a.locator('#create').click();await a.locator('#room-code').waitFor();await b.locator('#code').fill(await a.locator('#room-code').innerText());await b.locator('#join').click();await b.locator('#room').waitFor();
  for(const [p,preset]of [[a,'KABUTOMUSHI'],[b,'OKAMAKIRI']]){await p.locator('#deck-select').selectOption('preset:'+preset);await p.locator('#deck-apply').click();await p.waitForFunction(()=>!document.querySelector('#ready').disabled);}
  await a.locator('#ready').click();await b.locator('#ready').click();for(const p of[a,b])await p.locator('#board').waitFor();
  for(let i=0;i<12;i++){let acted=false;for(const p of[a,b]){const v=await p.locator('#board').getAttribute('data-version');if(await require('../tools/ui-pilot.cjs').step(p)){await Promise.all([a,b].map(p=>p.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),v)));acted=true;break;}}assert(acted);}
  await a.reload();await a.locator('#board').waitFor();assert.equal(await a.locator('#board').getAttribute('data-room-phase'),'PLAYING');assert.deepEqual(errors,[]);
 });
}
