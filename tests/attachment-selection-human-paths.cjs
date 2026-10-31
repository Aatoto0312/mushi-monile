"use strict";
const {chromium,webkit}=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await(process.env.MUSHI_BROWSER==='webkit'?webkit.launch():chromium.launch({channel:'msedge'}));const page=await browser.newPage({viewport:{width:390,height:650},isMobile:true,hasTouch:true});page.setDefaultTimeout(5000);let checks=0;const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{await page.goto(process.env.MUSHI_URL||'http://127.0.0.1:8765',{waitUntil:'domcontentloaded'});await page.locator('#btn-vs-human').click();await page.locator('#btn-deck-p1-kabuto').click();await page.locator('#btn-deck-p2-okama').click();if(await page.locator('#pass-overlay').isVisible())await page.locator('#btn-pass-ok').click();
await page.evaluate(()=>{
 const u=MushiBattle.ui,s=u.state,pid=s.activePlayerId,p=s.player(pid),op=s.player(s.opponentOf(pid));
 const make=(id,zone,n)=>new CardInstance({instanceId:'attachment-human-'+n,cardId:id,ownerId:pid,controllerId:pid,zone,faceDown:false,baseHp:getCardDefinition(id).baseHp,currentHp:getCardDefinition(id).baseHp});
 s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;p.field=[make('set1_003','FIELD',1),make('set1_004','FIELD',2)];p.field[0].attachments=[make('set3_047','FIELD',3)];p.hand=[make('set4_053','HAND',4)];p.availableCost=20;op.field=[];op.territory=[];u.actionState={mode:'idle'};u.hideCardDetail();u.render();
});
await page.locator('#self-hand-zone [data-instance-id="attachment-human-4"]').click();await page.locator('.detail-action-btn').filter({hasText:'強化する'}).click();await page.locator('#self-field-zone [data-instance-id="attachment-human-2"]').click();
assert.equal(await page.evaluate(()=>MushiBattle.ui.state.pendingEffect.selectionPurpose),'COPY_ENHANCEMENT_SOURCE');checks++;
await page.locator('#attachment-picker [data-instance-id="attachment-human-3"]').click();
assert(await page.evaluate(()=>{const s=MushiBattle.ui.state,p=s.player(s.activePlayerId);return !s.pendingEffect&&p.field[1].attachments[0].runtimeFlags.copiedEnhancementSourceId==='attachment-human-3'&&p.field[1].currentHp===getCardDefinition(p.field[1].cardId).baseHp+200;}));checks++;
await page.evaluate(()=>{const u=MushiBattle.ui,s=u.state,pid=s.activePlayerId;const c=new CardInstance({instanceId:'attachment-human-5',cardId:'set1_104',ownerId:pid,controllerId:pid,zone:'HAND',faceDown:false});s.player(pid).hand=[c];u.render();});
await page.locator('#self-hand-zone [data-instance-id="attachment-human-5"]').click();await page.locator('.detail-action-btn').filter({hasText:'術を使う'}).click();
await page.locator('#attachment-picker [data-instance-id="attachment-human-4"]').click();await page.locator('#attachment-picker [data-instance-id="attachment-human-1"]').click();
assert.equal(await page.evaluate(()=>MushiBattle.ui.state.pendingEffect.selectionPurpose),'COPY_ENHANCEMENT_SOURCE');checks++;
await page.locator('#attachment-picker [data-instance-id="attachment-human-3"]').click();assert(await page.evaluate(()=>!MushiBattle.ui.state.pendingEffect));checks++;
assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1));checks++;
for(const number of [4,63,64]){
await page.evaluate(number=>{
 const u=MushiBattle.ui,s=u.state,pid=s.activePlayerId,p=s.player(pid),op=s.player(s.opponentOf(pid)),d=getCardDefinition(number===4?'set4_064':'set5_0'+number);
 const make=(id,zone,n)=>new CardInstance({instanceId:'spell-attachment-'+n,cardId:id,ownerId:pid,controllerId:pid,zone,faceDown:false,baseHp:getCardDefinition(id).baseHp,currentHp:getCardDefinition(id).baseHp});
 s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;p.field=[make('set1_003','FIELD',1)];p.field[0].attachments=[make('set3_047','FIELD',2)];p.field[0].currentHp+=200;p.field[0].attackedThisTurn=number===64;p.hand=[make(d.id,'HAND',3)];p.food=[];p.discard=[];p.availableCost=20;op.field=number===4?[new CardInstance({instanceId:'spell-attachment-target',cardId:'set1_003',ownerId:s.opponentOf(pid),controllerId:s.opponentOf(pid),zone:'FIELD',faceDown:false,baseHp:3000,currentHp:3000})]:[];op.territory=[];u.actionState={mode:'idle'};u.hideCardDetail();u.render();
},number);
await page.locator('#self-hand-zone [data-instance-id="spell-attachment-3"]').click();await page.locator('.detail-action-btn').filter({hasText:'術を使う'}).click();
if(number===64)await page.locator('#self-field-zone [data-instance-id="spell-attachment-1"]').click();
await page.locator('#attachment-picker [data-instance-id="spell-attachment-2"]').click();
if(number===4){await page.locator('#opp-field-zone [data-instance-id="spell-attachment-target"]').click();await page.locator('#btn-end-turn').click();}
assert(await page.evaluate(number=>{const s=MushiBattle.ui.state,p=s.player(s.activePlayerId);return !s.pendingEffect&&p.discard.some(c=>c.instanceId==='spell-attachment-2')&&(number===4?s.player(s.opponentOf(s.activePlayerId)).field[0].currentHp===2300:number===63?p.food.some(c=>c.instanceId==='spell-attachment-3'):!p.field[0].attackedThisTurn);},number));checks++;
}
await page.setViewportSize({width:844,height:390});assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1));checks++;
assert.deepEqual(errors,[]);checks++;console.log('ATTACHMENT HUMAN CHECKS PASSED: '+checks);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
