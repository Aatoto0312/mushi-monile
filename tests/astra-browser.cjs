/* Run against a local HTTP server. Playwright stays a test-only dependency.
   MUSHI_PLAYWRIGHT_PATH may point to an external Playwright installation. */
const {chromium,webkit}=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base=process.env.MUSHI_URL||'http://127.0.0.1:8765';
const shots=process.env.MUSHI_SCREENSHOTS||path.resolve(__dirname,'../docs/astra-screenshots');
fs.mkdirSync(shots,{recursive:true});
(async()=>{
  const browser=await (process.env.MUSHI_BROWSER==='webkit'?webkit.launch({headless:true}):chromium.launch({channel:'msedge',headless:true}));
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('dialog',d=>d.accept());
  let checks=0;
  function ok(value,message){assert(value,message);checks++;console.log('PASS '+message);}
  async function shot(name){await page.screenshot({path:path.join(shots,name+'.png'),animations:'disabled'});}
  async function layout(name){
    const m=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
    ok(m.scroll<=m.width+1,name+' has no horizontal page overflow');
  }
  async function clickRef(ref,zone='self-field-zone'){
    const id=await page.evaluate(ref=>MushiBattle.ui.tutorialController.refs[ref],ref);
    await page.locator('#'+zone+' [data-instance-id="'+id+'"]').click();
  }
  async function step(id){await page.waitForFunction(id=>MushiBattle.ui.tutorialController.currentStep()?.id===id,id,{timeout:8000});}
  async function finishCpu(){
    for(let i=0;i<10;i++){
      await page.waitForFunction(()=>{const u=MushiBattle.ui;return (u.state.activePlayerId==='P1'&&!u.cpuRunner?.isRunning)||(u.state.pendingEffect?.playerId==='P1');},null,{timeout:15000});
      if(await page.locator('#territory-picker').isVisible()){await page.locator('#territory-picker-cards button').first().click();continue;}
      if(await page.evaluate(()=>MushiBattle.ui.state.activePlayerId==='P1'&&!MushiBattle.ui.cpuRunner?.isRunning))return;
      await page.waitForTimeout(200);
    }
    throw new Error('CPU did not return control after resolving territory choices');
  }
  try{
    await page.goto(base);await page.locator('#hero-cards img').first().waitFor();
    await page.waitForFunction(()=>document.querySelector('#hero-cards img').naturalWidth>0);
    await shot('01-home-390');await layout('Home 390');
    for(const size of [{width:360,height:640},{width:430,height:932},{width:1280,height:900}]){
      await page.setViewportSize(size);await layout('Home '+size.width);await page.locator('#btn-tutorial').scrollIntoViewIfNeeded();
      ok(await page.locator('#btn-tutorial').isVisible(),'Tutorial entry reachable at '+size.width);
    }
    await page.setViewportSize({width:390,height:844});
    await page.locator('.lobby .app-nav a[href="toolbox.html"]').click();
    await page.waitForFunction(()=>document.querySelectorAll('#card-list .card-row').length===501);
    ok(await page.locator('.filter-panel').getAttribute('open')===null,'Filters start collapsed');
    await layout('Catalog');await shot('02-catalog-390');
    await page.locator('#search-input').fill('存在しないカードzz');
    ok(await page.locator('#empty-message').isVisible(),'Empty search explains no results');
    await page.locator('#search-input').fill('ナミテントウ');
    await page.locator('.card-open').first().click();
    ok(await page.locator('#card-detail').isVisible(),'Card observation sheet opens');
    await page.locator('#detail-add').click();await page.locator('#detail-add').click();await page.locator('#detail-add').click();
    ok((await page.locator('#detail-feedback').textContent()).includes('2枚まで'),'Duplicate limit feedback visible inside dialog');
    await shot('03-observation-390');
    await page.keyboard.press('Escape');ok(!await page.locator('#card-detail').isVisible(),'Escape closes observation sheet');
    await page.locator('.app-nav [data-view="decks"]').click();
    await page.locator('#deck-name').fill('標本帖 テストデッキ');await page.locator('#save-deck').click();
    await page.reload();ok(await page.locator('#deck-name').inputValue()==='標本帖 テストデッキ','Saved deck and deck route survive reload');
    ok(await page.locator('#deck-total').textContent()==='2 / 20','Saved quantities survive reload');
    await page.locator('[data-dec]').click();ok(await page.locator('#deck-total').textContent()==='1 / 20','Decrease quantity');
    await page.locator('[data-inc]').click();await page.locator('#save-deck').click();
    await page.locator('#duplicate-deck').click();ok(await page.locator('#deck-selector option').count()===2,'Duplicate deck');
    await page.locator('#delete-deck').click();ok(await page.locator('#deck-selector option').count()===1,'Delete selected duplicate');
    await page.locator('#new-deck').click();await page.locator('#deck-name').fill('森の20枚');
    await page.locator('.add-from-catalog').click();await page.locator('#search-input').fill('');
    await page.locator('.filter-panel summary').click();await page.locator('#set-filter').selectOption('STARTER');
    await page.locator('.filter-panel summary').click();
    for(let i=0;i<10;i++){await page.locator('#card-list .card-add').nth(i).click();await page.locator('#card-list .card-add').nth(i).click();}
    await page.locator('#card-list .card-add').nth(10).click();
    ok((await page.locator('#collection-toast').textContent()).includes('20枚'),'20-card limit feedback visible in catalog');
    await page.locator('.app-nav [data-view="decks"]').click();
    ok(await page.locator('#deck-total').textContent()==='20 / 20','20-card constructed deck');
    ok(await page.locator('#battle-deck').isEnabled(),'Existing battle-ready validation retained');
    await page.locator('#save-deck').click();await shot('04-deck-390');
    await page.locator('#battle-deck').click();await page.waitForURL('**/index.html?deck=*');
    await page.locator('#btn-vs-cpu').click();
    ok((await page.locator('#user-deck-p1 option').allTextContents()).some(x=>x.includes('森の20枚')),'Saved deck available in battle setup');
    await shot('05-setup-390');
    await page.locator('#btn-user-deck-p1').click();await page.locator('#btn-deck-p2-okama').click();
    await finishCpu();
    if(await page.locator('#btn-draw').isVisible())await page.locator('#btn-draw').click();
    // Safari touch clicks do not focus buttons. Establish keyboard focus
    // explicitly before testing that the dialog restores it after a rerender.
    await page.locator('#self-hand-zone .battle-card').first().focus();
    await page.keyboard.press('Enter');
    await page.locator('.detail-action-btn').filter({hasText:'エサにする'}).click();
    ok(!await page.locator('#card-detail-modal').isVisible(),'Food action closes the card sheet');
    ok(await page.evaluate(()=>document.activeElement!==document.body&&!!document.activeElement.closest('.battle-viewport')),'Focus restored after card action replaces the opener');
    await page.locator('#zone-bottom .zone-group--food').click();
    ok(await page.locator('#inspector-body .inspector-card').count()===1,'Public food inspector displays full cards');
    await page.locator('#inspector-close').click();
    await page.locator('#zone-top .zone-group--territory').click();
    ok(await page.locator('#inspector-body img').count()===0,'Hidden opponent territory never exposes card images');
    await page.locator('#inspector-close').click();await page.locator('#btn-to-main').click();
    await shot('06-battle-390');
    for(const size of [{width:360,height:640},{width:430,height:932},{width:844,height:390},{width:1280,height:900}]){
      await page.setViewportSize(size);await layout('Battle '+size.width+'x'+size.height);
      // Short viewports scroll the board instead of shrinking field cards.
      await page.locator('#btn-end-turn').scrollIntoViewIfNeeded();
      const m=await page.locator('#btn-end-turn').boundingBox();ok(m.y>=0&&m.y+m.height<=size.height+1,'Controls reachable inside viewport '+size.width);
      await page.locator('#self-hand-zone .battle-card').first().scrollIntoViewIfNeeded();
      const hand=await page.locator('#self-hand-zone .battle-card').first().boundingBox();ok(hand.height>=96&&hand.y>=-1&&hand.y+hand.height<=size.height+1,'Readable hand in '+size.width);
      await shot('battle-'+size.width+'x'+size.height);
    }
    await page.setViewportSize({width:390,height:844});await page.locator('#btn-end-turn').click();
    ok(!await page.locator('#pass-overlay').isVisible(),'CPU game does not show hotseat handoff');
    await finishCpu();
    ok(await page.evaluate(()=>MushiBattle.ui.state.turnNumber>=3),'CPU turn completes and returns control');
    await page.goto(base);await page.locator('#btn-tutorial').click();await step('draw');await shot('07-tutorial-390');
    await page.setViewportSize({width:360,height:640});
    const tutorialField=await page.locator('#opp-field-zone .battle-card').first().boundingBox();
    ok(tutorialField.height>=65,'Tutorial opponent card remains readable at 360x640');
    await shot('tutorial-360x640');await page.setViewportSize({width:390,height:844});
    await page.locator('#btn-draw').click();await step('set-food');
    await clickRef('foodCardInstanceId','self-hand-zone');await page.locator('.detail-action-btn').filter({hasText:'エサにする'}).click();await step('enter-main');
    await page.locator('#btn-to-main').click();await step('summon');
    await clickRef('drawCardInstanceId','self-hand-zone');await page.locator('.detail-action-btn').filter({hasText:'場に出す'}).click();await step('weakness-attack');
    await clickRef('drawCardInstanceId');await clickRef('opponentInsectInstanceId','opp-field-zone');
    if(await page.locator('#card-detail-modal').isVisible())await page.locator('.detail-action-btn').last().click();
    await step('direct-attack');await clickRef('firstDirectAttackerInstanceId');await page.locator('#btn-direct-attack').click();
    if(await page.locator('#card-detail-modal').isVisible())await page.locator('.detail-action-btn').last().click();
    await step('use-spell');await clickRef('spellInstanceId','self-hand-zone');await page.locator('.detail-action-btn').filter({hasText:'術を使う'}).click();
    await step('use-enhancement');await clickRef('enhancementInstanceId','self-hand-zone');await page.locator('.detail-action-btn').filter({hasText:'強化する'}).click();await clickRef('enhancementTargetInstanceId');
    await step('final-direct-attack');await clickRef('finalDirectAttackerInstanceId');await page.locator('#btn-direct-attack').click();
    if(await page.locator('#card-detail-modal').isVisible())await page.locator('.detail-action-btn').last().click();
    await page.waitForFunction(()=>MushiBattle.ui.tutorialController.isComplete());
    ok(await page.evaluate(()=>MushiBattle.ui.state.winner==='P1'),'Tutorial completed through actual UI: draw, food, summon, attack, territory, spell, enhancement, victory');
    await shot('08-victory-390');
    await page.locator('#btn-tutorial-replay').click();await step('draw');
    ok(await page.locator('#status-text').textContent(),'Tutorial replay shows compact guidance');
    await page.locator('#status-text').click();await page.locator('.tutorial-exit').click();
    ok(await page.locator('#mode-select-overlay').isVisible(),'Tutorial exit returns to home');
    await page.goto(base);await page.locator('#btn-vs-human').click();await page.locator('#btn-deck-p1-kabuto').click();await page.locator('#btn-deck-p2-okama').click();
    if(await page.locator('#pass-overlay').isVisible())await page.locator('#btn-pass-ok').click();
    if(await page.locator('#btn-draw').isVisible())await page.locator('#btn-draw').click();
    await page.locator('#btn-to-main').click();const before=await page.evaluate(()=>MushiBattle.ui.state.activePlayerId);
    await page.locator('#btn-end-turn').click();ok(await page.locator('#pass-overlay').isVisible(),'Hotseat pass screen conceals the board');
    await page.locator('#btn-pass-ok').click();ok(await page.evaluate(()=>MushiBattle.ui.state.activePlayerId)!==before,'Hotseat changes perspective');
    // Synthetic crowded board exercises scroll containers without changing production rules.
    await page.evaluate(()=>{
      const ui=MushiBattle.ui,s=ui.state,id=s.activePlayerId,p=s.player(id);
      const make=(zone,i)=>new CardInstance({instanceId:'layout_'+zone+'_'+i,cardId:i%2?'kabutomushi':'namitentou',ownerId:id,controllerId:id,zone:zone.toUpperCase(),faceDown:false,currentHp:300});
      p.hand=Array.from({length:12},(_,i)=>make('hand',i));p.field=Array.from({length:8},(_,i)=>make('field',i));p.food=Array.from({length:20},(_,i)=>make('food',i));p.discard=Array.from({length:20},(_,i)=>make('discard',i));
      s.phase=Phases.MAIN_PHASE;p.availableCost=20;ui.render();
    });
    await page.setViewportSize({width:360,height:640});await layout('Crowded board');
    await page.locator('#self-hand-zone .battle-card').last().scrollIntoViewIfNeeded();
    const lastHand=await page.locator('#self-hand-zone .battle-card').last().boundingBox();
    ok(lastHand.x+lastHand.width<=361,'Last of 12 hand cards reachable by horizontal scroll');
    await page.locator('#self-field-zone .battle-card').last().scrollIntoViewIfNeeded();
    const lastField=await page.locator('#self-field-zone .battle-card').last().boundingBox();
    ok(lastField.x+lastField.width<=361,'Last of 8 field cards reachable by horizontal scroll');
    await page.locator('#zone-bottom .zone-group--discard').click();
    ok(await page.locator('#inspector-body .inspector-card').count()===20,'All 20 discard cards accessible in inspector');
    await page.locator('#inspector-body .inspector-card').last().click();
    ok(await page.locator('#card-detail-modal').isVisible(),'Last discard card opens detail');
    await page.keyboard.press('Escape');
    await page.evaluate(()=>{
      const ui=MushiBattle.ui,s=ui.state,p=s.player(s.activePlayerId);
      createCardSelection(s,{playerId:s.activePlayerId,options:p.food.map(c=>c.instanceId),minSelections:1,maxSelections:2,candidateZones:[ZONES.FOOD]});ui.render();
    });
    ok(await page.locator('#zone-bottom .zone-group--food').evaluate(n=>n.classList.contains('has-pending-target')),'Pending food targets indicated on visible zone counter');
    await page.locator('#zone-bottom .zone-group--food').click();await page.locator('#inspector-body .inspector-card').first().click();
    ok(await page.evaluate(()=>MushiBattle.ui.state.pendingEffect.selectedIds.length===1),'Inspector selection uses existing engine pending selection');
    await page.locator('#zone-bottom .zone-group--food').click();
    ok(await page.locator('#inspector-body [aria-pressed="true"]').count()===1,'Selected food identified when inspector reopens');
    await shot('09-food-selection-360');
    const offline=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
    await offline.route('**/images/card/**',route=>route.abort());
    const fallback=await offline.newPage();await fallback.goto(base+'/toolbox.html');
    await fallback.waitForSelector('.art-unavailable');
    ok(await fallback.locator('.card-name').first().textContent()==='ニセハナマオウカマキリ','Image failure keeps card identity readable');
    await fallback.locator('.card-add').first().click();
    ok((await fallback.locator('#collection-toast').textContent()).includes('追加しました'),'Image failure does not prevent deck editing');
    ok(await fallback.locator('.card-add').first().evaluate(n=>getComputedStyle(n).transitionDuration)==='0s','Reduced motion preference respected');
    await offline.close();
    ok(errors.length===0,'No JavaScript page errors: '+errors.join('; '));
    console.log('BROWSER CHECKS PASSED: '+checks);
  }catch(error){await shot('failure');console.error(error);console.error('Page errors:',errors);process.exitCode=1;}
  finally{await browser.close();}
})();
