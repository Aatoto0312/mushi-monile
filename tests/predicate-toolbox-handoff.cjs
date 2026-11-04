"use strict";
const {chromium,webkit}=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await(process.env.MUSHI_BROWSER==='webkit'?webkit.launch():chromium.launch({channel:'msedge'}));const page=await browser.newPage({viewport:{width:390,height:664},isMobile:true,hasTouch:true});const errors=[],missing=[];let checks=0;page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()===404)missing.push(r.url());});
const ready=Object.keys(require('../scripts/set5-battle-evidence.js'));
const expansion=['dive','repeat','entry','economy'].flatMap(kind=>require('../js/cards/expansion-'+kind+'-cards.js').playableIds).concat(require('../js/cards/expansion-predicate-cards.js').playableIds,require('../js/cards/expansion-reuse-cards.js').playableIds,require('../js/cards/expansion-count-cards.js').playableIds);const pool=[...new Set(require('./fixtures/foodpayment-scenarios.cjs').cases.concat(require('./fixtures/attachchain-scenarios.cjs').cases).concat(require('../js/cards/expansion-economy-cards').playableIds.concat(Object.keys(require('../scripts/food-wave-evidence')),Object.keys(require('../scripts/emergence-evidence')),Object.keys(require('../scripts/growth-entry-evidence')),expansion,ready)))];const offset=Number(process.env.MUSHI_DECK_OFFSET||0),deckPool=pool.slice(offset).concat(pool.slice(0,offset)).slice(0,20),deckCards=deckPool.concat(deckPool.slice(0,20-deckPool.length));
try{await page.addInitScript(()=>{Math.random=()=>0.9;});await page.goto((process.env.MUSHI_URL||'http://127.0.0.1:8765')+'/toolbox.html',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.querySelectorAll('.card-row').length===565);checks++;
await page.locator('.filter-panel').evaluate(el=>el.open=true);await page.selectOption('#status-filter','PLAYABLE');assert.equal(await page.locator('.card-row').count(),441);checks++;
for(const set of [6,7,8]){await page.selectOption('#set-filter','BOOSTER_SET_'+set);const expected=expansion.filter(id=>id.startsWith('set'+set+'_')).sort();assert.deepEqual((await page.locator('.card-open').evaluateAll(es=>es.map(e=>e.dataset.cardId))).sort(),expected);checks++;}
await page.selectOption('#set-filter','BOOSTER_SET_5');assert.equal(await page.locator('.card-row').count(),38);checks++;
assert.deepEqual((await page.locator('.card-open').evaluateAll(es=>es.map(e=>e.dataset.cardId))).sort(),ready.slice().sort());checks++;
await page.selectOption('#status-filter','UNAVAILABLE');assert.equal(await page.locator('.card-row').count(),13);checks++;
await page.selectOption('#status-filter','PARTIAL');assert.equal(await page.locator('.card-row').count(),13);checks++;
await page.selectOption('#status-filter','PLAYABLE');await page.selectOption('#set-filter','');
for(const id of deckCards){await page.locator('.card-add[data-add="'+id+'"]').click();}
await page.locator('.app-nav [data-view="decks"]').click();assert.equal(await page.locator('#deck-total').textContent(),'20 / 20');checks++;
await page.fill('#deck-name','SET5 basic runtime handoff');await page.locator('#save-deck').click();assert(await page.locator('#battle-deck').isEnabled());checks++;
await page.locator('#battle-deck').click();await page.waitForURL('**/index.html?deck=*',{waitUntil:'domcontentloaded'});await page.locator('#btn-vs-cpu').click();await page.locator('#btn-user-deck-p1').click();await page.locator('#btn-deck-p2-okama').click();
await page.waitForFunction(()=>!!window.MushiBattle?.ui?.cpuMode&&!!MushiBattle.ui.state.players.P1);checks++;
assert(await page.evaluate(ids=>{const s=MushiBattle.ui.state,p=s.player('P1'),cards=['deck','hand','territory','field','food','discard','resolving'].flatMap(zone=>p[zone]||[]);return cards.length===20&&ids.every(id=>cards.filter(c=>c.cardId===id).length===ids.filter(expected=>expected===id).length)&&cards.every(c=>getCardDefinition(c.cardId).isPlayable());},deckCards));checks++;
for(let i=0;i<10;i++){
 await page.waitForFunction(()=>{const u=MushiBattle.ui;return u.state.phase===Phases.GAME_OVER||(u.state.activePlayerId==='P1'&&!u.cpuRunner?.isRunning)||u.state.pendingEffect?.playerId==='P1';},null,{timeout:20000});
 if(await page.locator('#territory-picker').isVisible()){await page.locator('#territory-picker-cards button').first().click();continue;}
 if(await page.evaluate(()=>MushiBattle.ui.state.phase===Phases.GAME_OVER||MushiBattle.ui.state.activePlayerId==='P1'&&!MushiBattle.ui.cpuRunner?.isRunning))break;
 throw new Error('Unhandled Human pending during CPU: '+await page.evaluate(()=>JSON.stringify(MushiBattle.ui.state.pendingEffect)));
}
assert(await page.evaluate(()=>MushiBattle.ui.state.phase===Phases.GAME_OVER||MushiBattle.ui.state.activePlayerId==='P1'&&!MushiBattle.ui.cpuRunner?.isRunning));checks++;
assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);checks+=2;console.log('SET5 TOOLBOX HANDOFF CHECKS PASSED: '+checks);
}catch(error){console.error('SET5 toolbox handoff diagnostic',JSON.stringify({url:page.url(),message:await page.locator('#storage-message').textContent().catch(()=>null),toast:await page.locator('#collection-toast').textContent().catch(()=>null),errors,missing}));throw error;}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
