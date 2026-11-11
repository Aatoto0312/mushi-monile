'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {build}=require('../../scripts/build-online-candidate.cjs'),{createCandidateServer}=require('../tools/candidate-server.cjs'),{createRuntime}=require('../lib/runtime.cjs');
const pw=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright');
for(const engine of ['chromium','webkit'])test(engine+' Pages-subpath Toolbox save → B room → real match, spectator and reconnect',async t=>{
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'mushi-toolbox-online-'));
 t.after(()=>{assert.equal(path.dirname(parent),path.resolve(os.tmpdir()));assert(path.basename(parent).startsWith('mushi-toolbox-online-'));fs.rmSync(parent,{recursive:true,force:true});});
 if(process.env.MUSHI_CANDIDATE_DIRECTORY)fs.cpSync(process.env.MUSHI_CANDIDATE_DIRECTORY,path.join(parent,'candidate'),{recursive:true});else build(path.join(parent,'candidate'));const app=createCandidateServer(path.join(parent,'candidate'),{rng:()=>0});await app.start();t.after(()=>app.stop());
 const browser=await pw[engine].launch(engine==='chromium'&&process.env.MUSHI_CHROMIUM_CHANNEL!=='bundled'?{channel:process.env.MUSHI_CHROMIUM_CHANNEL||'msedge'}:{});t.after(()=>browser.close());
 const context=await browser.newContext({viewport:{width:390,height:740},isMobile:true,hasTouch:true}),a=await context.newPage(),b=await(await browser.newContext({viewport:{width:390,height:740}})).newPage(),w=await(await browser.newContext()).newPage();
 for(const p of [a,b,w])p.setDefaultTimeout(8000);
 const runtime=createRuntime(),sentinel=JSON.parse(JSON.stringify(runtime.preset('OKAMAKIRI')));sentinel.deckName='既存デッキ保持';
 await context.addInitScript(deck=>{if(!localStorage.getItem('mushijingiToolboxDecksV1'))localStorage.setItem('mushijingiToolboxDecksV1',JSON.stringify({storageVersion:1,activeDeckId:deck.deckId,decks:[deck]}));},sentinel);
 const errors=[],missing=[],leaks=[];for(const p of [a,b,w]){p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.url().startsWith(app.url)&&r.status()>=400)missing.push(r.url());});p.on('websocket',ws=>ws.on('framereceived',f=>{const m=JSON.parse(f.payload.toString());if(m.type!=='VIEW'||!m.battle)return;for(const player of Object.values(m.battle.players)){if(player.deck)leaks.push('deck');if(player.id!==m.battle.viewerId)for(const c of player.hand)if(!c.hidden||c.cardId||c.name)leaks.push('hand');}}));}
 await a.goto(app.url+'/toolbox.html#decks');await a.locator('#new-deck').click();await a.locator('.app-nav [data-view="cards"]').click();
 const recipe=runtime.preset('KABUTOMUSHI');for(const c of recipe.cards)for(let i=0;i<c.quantity;i++)await a.locator('.card-add[data-add="'+c.canonicalCardId+'"]').click();
 await a.locator('.app-nav [data-view="decks"]').click();await a.locator('#deck-name').fill('ToolboxからB案へ');await a.locator('#save-deck').click();
 assert.equal(await a.locator('#deck-total').innerText(),'20 / 20');const savedId=await a.locator('#deck-selector').inputValue();
 assert(await a.locator('#online-battle-deck').isEnabled());await a.locator('#online-battle-deck').click();await a.waitForURL('**/online-b.html?deck=*');
 await a.waitForFunction(()=>!document.querySelector('#create').disabled);assert.equal(await a.locator('#deck-select').inputValue(),'saved:1');
 await a.locator('#create').click();await a.locator('#room-code').waitFor();const code=await a.locator('#room-code').innerText();assert.match(code,/^\d{6}$/);
 for(const p of [b,w]){await p.goto(app.url+'/online-b.html');await p.waitForFunction(()=>!document.querySelector('#join').disabled);await p.locator('#code').fill(code);await p.locator(p===b?'#join':'#watch').click();await p.locator('#room').waitFor();}
 await b.locator('#deck-select').selectOption('preset:OKAMAKIRI');
 for(const p of [a,b]){await p.locator('#deck-apply').click();await p.waitForFunction(()=>!document.querySelector('#ready').disabled);}
 await a.locator('#ready').click();await b.locator('#ready').click();for(const p of [a,b,w])await p.locator('#board').waitFor();
 await a.reload();await a.locator('#board').waitFor();assert.equal(await a.locator('#board').getAttribute('data-room-phase'),'PLAYING');
 await b.goto('about:blank');await a.getByText('相手の再接続を待っています（最大5分）',{exact:true}).waitFor();await b.goto(app.url+'/online-b.html');await b.locator('#board').waitFor();await a.getByText('相手の再接続を待っています（最大5分）',{exact:true}).waitFor({state:'hidden'});
 let actions=0;for(let i=0;i<700;i++){
  if(await a.locator('#board').getAttribute('data-room-phase')==='ENDED')break;let acted=false;
  for(const p of [a,b]){const v=await p.locator('#board').getAttribute('data-version');if(await require('../tools/b-ui-pilot.cjs').step(p)){actions++;await Promise.all([a,b,w].map(p=>p.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),v)));acted=true;break;}}
  assert(acted,'no legal UI step '+i+' / room='+await a.locator('#board').getAttribute('data-room-phase')+' / '+await a.locator('[data-role="instruction"]').innerText());
 }
 for(const p of [a,b,w])assert.equal(await p.locator('#board').getAttribute('data-room-phase'),'ENDED');
 const store=await a.evaluate(()=>JSON.parse(localStorage.getItem('mushijingiToolboxDecksV1')));assert.equal(store.decks.length,2);assert.deepEqual(store.decks[0],sentinel);assert.deepEqual(store.decks.find(d=>d.deckId===savedId).cards,recipe.cards);
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);assert.deepEqual(leaks,[]);t.diagnostic(JSON.stringify({actions,prefix:'/mushi-monile/',savedDeckIdPreserved:true}));
});
