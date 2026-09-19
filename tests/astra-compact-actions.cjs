const {chromium,webkit}=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await (process.env.MUSHI_BROWSER==='webkit'?webkit.launch():chromium.launch({channel:'msedge'}));
 const page=await browser.newPage({viewport:{width:390,height:560},isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());let checks=0;
 const ok=(v,m)=>{assert(v,m);checks++;console.log('PASS '+m);};
 async function fits(){ok(await page.locator('.battle-viewport').evaluate(n=>n.scrollHeight<=n.clientHeight+1),'No vertical board scroll');ok(await page.evaluate(()=>document.body.scrollHeight<=innerHeight+1&&document.documentElement.scrollHeight<=innerHeight+1),'No vertical body scroll');}
 try{
  await page.goto(process.env.MUSHI_URL||'http://127.0.0.1:8766',{waitUntil:'domcontentloaded'});
  await page.locator('#btn-vs-human').click();await page.locator('#btn-deck-p1-kabuto').click();await page.locator('#btn-deck-p2-okama').click();
  if(await page.locator('#pass-overlay').isVisible())await page.locator('#btn-pass-ok').click();
  for(const size of [{width:390,height:560},{width:844,height:300}]){
   await page.setViewportSize(size);
   // Fixtures are test-only. Production layout code never mutates GameState.
   await page.evaluate(()=>{
    const u=MushiBattle.ui,s=u.state,id=s.activePlayerId,p=s.player(id);
    const make=(cardId,zone,i)=>new CardInstance({instanceId:'compact-'+i,cardId,ownerId:id,controllerId:id,zone,faceDown:false,currentHp:500});
    p.field=[make('set1_028','FIELD',1),make('set1_031','FIELD',2)];p.hand=[make('set1_002','HAND',3)];p.availableCost=0;s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;u.render();
   });
   await page.locator('#self-hand-zone .battle-card').click();
   await page.locator('.detail-action-btn').filter({hasText:'虫2体'}).click();
   ok(await page.evaluate(()=>MushiBattle.ui.state.pendingEffect.selectionPurpose==='ALTERNATIVE_SUMMON_COST'),'Alternative summon enters CARD_SELECTION');await fits();
   await page.locator('#self-field-zone [data-instance-id="compact-1"]').click();
   await page.locator('#self-field-zone [data-instance-id="compact-2"]').click();
   ok(await page.evaluate(()=>{const s=MushiBattle.ui.state,p=s.player(s.activePlayerId);return !s.pendingEffect&&p.field.some(c=>c.cardId==='set1_002')&&p.availableCost===0;}),'Field taps resolve alternative summon');
   await page.evaluate(()=>{
    const u=MushiBattle.ui,s=u.state,id=s.activePlayerId,p=s.player(id);
    p.field=[new CardInstance({instanceId:'skill-card',cardId:'kabutomushi',ownerId:id,controllerId:id,zone:'FIELD',faceDown:false,currentHp:800})];u.render();
   });
   await page.locator('#self-field-zone .battle-card').click();
   ok(await page.locator('#compact-actions').isVisible(),'Attack skills open in dialog');
   await page.locator('#skill-select-row button').first().click();
   ok(!await page.locator('#compact-actions').isVisible(),'Skill choice closes dialog');
   ok(await page.evaluate(()=>MushiBattle.ui.actionState.mode==='attackTarget'),'Skill choice preserves attack target mode');await fits();
   await page.locator('#btn-cancel-attack').click();
   await page.locator('#self-field-zone .battle-card').click();await page.keyboard.press('Escape');
   await page.waitForFunction(()=>MushiBattle.ui.actionState.mode==='idle');
   ok(await page.evaluate(()=>MushiBattle.ui.actionState.mode==='idle'),'Escape cancels skill selection');
   await page.locator('#btn-compact-log').click();ok(await page.locator('#compact-log').isVisible(),'Battle log opens');
   await page.locator('#compact-log header button').click();await fits();
   await page.locator('#btn-battle-help').click();ok(await page.locator('#zone-inspector').isVisible(),'Help opens');await page.locator('#inspector-close').click();
   await page.evaluate(()=>{const u=MushiBattle.ui;triggerTerritoryDrawSelection(u.state,u.state.activePlayerId);u.render();});
   ok(await page.locator('#territory-picker').isVisible(),'Territory picker opens');
   await page.locator('#territory-picker-cards button').first().click();
   ok(!await page.locator('#territory-picker').isVisible(),'Territory choice resolves');
   if(await page.locator('#card-detail-modal').isVisible())await page.keyboard.press('Escape');
   await page.evaluate(()=>{
    const u=MushiBattle.ui,s=u.state,id=s.activePlayerId,p=s.player(id);
    const make=(zone,i)=>new CardInstance({instanceId:'arrows-'+zone+i,cardId:'kabutomushi',ownerId:id,controllerId:id,zone,faceDown:false,currentHp:800});
    p.field=Array.from({length:8},(_,i)=>make('FIELD',i));p.hand=Array.from({length:12},(_,i)=>make('HAND',i));u.render();
   });
   for(const id of ['self-field-zone','self-hand-zone']){
    const lane=page.locator('#'+id),group=lane.locator('..');
    await lane.evaluate(n=>n.scrollLeft=0);
    await group.locator('.scroll-cue--next').click();
    await page.waitForFunction(id=>document.getElementById(id).scrollLeft>0,id);
    ok(await group.locator('.scroll-cue--prev').isVisible(),id+' arrows expose hidden cards');
   }
   await fits();
  }
  await page.locator('#btn-new-game').click();ok(await page.locator('#deck-select-overlay').isVisible(),'Settings opens existing deck setup');
  ok(!errors.length,'No JavaScript errors '+errors.join(';'));
  console.log('COMPACT ACTION CHECKS PASSED: '+checks);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
