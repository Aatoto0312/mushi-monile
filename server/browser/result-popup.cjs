'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const rt=require('../lib/runtime.cjs'),{setup}=require('../../tests/fixtures/ui-layout.cjs');
// Test fixture only: the normal END action reaches the real failed-draw adjudicator.
let counts=[6,6];const original=rt.createRuntime;
function prepare(c,s,pair){setup(c,s,10,10,14);c.useEnhancement(s,'P1',s.player('P1').hand.find(x=>x.cardId==='kamikiri_no_daigaku').instanceId,s.player('P1').field[0].instanceId);s.player('P2').deck=[];s.manualDrawPlayers=['P1'];for(const [i,id] of ['P1','P2'].entries())s.player(id).territory.length=pair[i];}
rt.createRuntime=function(){const r=original(),start=r.start;r.start=(...args)=>{const s=start(...args);prepare(r.context,s,counts);return s;};return r;};
const {createCandidateServer}=require('../tools/candidate-server.cjs'),pw=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright');
const art=require('../tools/browser-actual-art.cjs').createActualArtCache(),out=process.env.MUSHI_UI_EVIDENCE||path.join(os.tmpdir(),'mushi-result-popup-screens');fs.mkdirSync(out,{recursive:true});
const candidate=process.env.MUSHI_CANDIDATE_DIRECTORY;if(!candidate)throw Error('CANDIDATE_REQUIRED');
const launch=kind=>pw[kind].launch(kind==='chromium'&&process.env.MUSHI_CHROMIUM_CHANNEL!=='bundled'?{channel:process.env.MUSHI_CHROMIUM_CHANNEL||'chrome'}:{});
const titles=['勝利！','敗北…','引き分け'],pairs=[[6,4],[4,6],[6,6]];
const popup=page=>page.locator('.battle-result-popup');
// Capability refs are deliberately regenerated on each server projection.
const finalState=view=>JSON.stringify({battle:view.battle,result:view.room.result},(key,value)=>key==='ref'?undefined:value);
async function photo(page,name){await page.waitForFunction(()=>[...document.querySelectorAll('img')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>0&&r.left<innerWidth&&r.bottom>0&&r.top<innerHeight;}).every(e=>e.complete&&e.naturalWidth));await page.screenshot({path:path.join(out,name+'.png')});}
async function fits(page){const r=await popup(page).boundingBox(),v=page.viewportSize();assert(r.x>=0&&r.y>=0&&r.x+r.width<=v.width&&r.y+r.height<=v.height);assert.equal(await page.locator('.battle-result-popup[open]').count(),1);}
async function startCpu(page,base,mode){await page.goto(base+'/index.html?battleUi='+mode);await page.locator('#btn-vs-cpu').click();await page.locator('#btn-deck-p1-kabuto').click();await page.locator('#btn-deck-p2-okama').click();}
for(const kind of ['chromium','webkit']){
 test(kind+' CPU both UIs: real engine win/loss/draw, inspect final board, reopen/replay/menu',async t=>{
  const app=createCandidateServer(candidate);await app.start();t.after(()=>app.stop());const browser=await launch(kind);t.after(()=>browser.close());
  const errors=[];
  for(const mode of ['legacy','new'])for(let i=0;i<3;i++){
   // Independent scenarios must not inherit a replayed game's timers/navigation.
   // Reload/reconnect and UI-switch persistence are exercised within each match.
   const page=await browser.newPage({viewport:{width:375,height:667},isMobile:true,hasTouch:true});page.setDefaultTimeout(15000);await art.install(page,t);page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>Math.random=()=>0);t.diagnostic(JSON.stringify({kind,mode,outcome:titles[i]}));
   await startCpu(page,app.url,mode);
   await page.evaluate(({code,pair})=>{const ui=MushiBattle.ui; (0,eval)('('+code+')')(window,ui.state,10,10,14);useEnhancement(ui.state,'P1',ui.state.player('P1').hand.find(x=>x.cardId==='kamikiri_no_daigaku').instanceId,ui.state.player('P1').field[0].instanceId);ui.state.player('P2').deck=[];ui.state.manualDrawPlayers=['P1'];ui.state.player('P1').territory.length=pair[0];ui.state.player('P2').territory.length=pair[1];ui.render();},{code:setup.toString(),pair:pairs[i]});
   await page.locator(mode==='new'?'#b-battle [data-role="end"]':'#btn-end-turn').click();await popup(page).waitFor({state:'visible'});
   assert.equal(await popup(page).locator('h2').innerText(),titles[i]);await fits(page);await photo(page,kind+'-cpu-'+mode+'-'+i);
   const final=await page.evaluate(()=>JSON.stringify(MushiBattle.ui.state));
   await popup(page).getByRole('button',{name:'盤面を見る',exact:true}).click();await page.evaluate(()=>{MushiBattle.ui.render();MushiBattle.ui.render();});assert(!await popup(page).isVisible());
   assert.equal(await page.evaluate(()=>JSON.stringify(MushiBattle.ui.state)),final);
   if(mode==='new'){
    assert(await page.locator('[data-role="all-actions"]').isDisabled());await page.locator('[data-role="own-field"]').evaluate(e=>e.scrollLeft=e.scrollWidth);assert(await page.locator('[data-role="own-field"]').evaluate(e=>e.scrollLeft>0));
    await page.locator('[data-role="own-field"] .unit').first().click();await page.getByRole('button',{name:'カード詳細',exact:true}).click();await page.locator('#sheet [data-role="close"]').click();
   }else{await page.locator('#self-field-zone .battle-card').first().click();await page.locator('#card-detail-modal').waitFor({state:'visible'});assert.equal(await page.locator('#card-detail-actions button').count(),0);await page.locator('#card-detail-close').click();}
   assert.equal(await page.evaluate(()=>JSON.stringify(MushiBattle.ui.state)),final);
   if(mode==='new'&&i===2){await page.locator('[data-role="menu"]').first().click();await page.getByRole('button',{name:'設定・退出など',exact:true}).click();await page.getByRole('button',{name:'旧UIへ切り替え',exact:true}).click();assert(!await popup(page).isVisible());await page.locator('#cpu-b-return').click();assert(!await popup(page).isVisible());assert.equal(await page.evaluate(()=>JSON.stringify(MushiBattle.ui.state)),final);}
   await page.getByRole('button',{name:'対戦結果：'+titles[i],exact:true}).click();await fits(page);
   if(i===0){await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await popup(page).locator('.result-glow').evaluate(e=>getComputedStyle(e).animationName),'none');await page.emulateMedia({reducedMotion:'no-preference'});}
   if(i===1){await page.keyboard.press('Escape');assert(!await popup(page).isVisible());assert.equal(await page.evaluate(()=>JSON.stringify(MushiBattle.ui.state)),final);await page.locator('.battle-result-open').click();}
   if(i===2){await page.setViewportSize({width:375,height:560});await fits(page);await photo(page,kind+'-cpu-'+mode+'-short');await page.setViewportSize({width:375,height:667});}
   if(i===0){await popup(page).getByRole('button',{name:'もう一度対戦',exact:true}).click();assert(!await popup(page).isVisible());assert.notEqual(await page.evaluate(()=>MushiBattle.ui.state.phase),'GAME_OVER');}
   else{await popup(page).getByRole('button',{name:'メニューへ',exact:true}).click();await page.locator('#mode-select-overlay').waitFor({state:'visible'});assert(!await popup(page).isVisible());}
   await page.close();
  }assert.deepEqual(errors,[]);
 });
 test(kind+' online both UIs: authoritative outcomes, spectator, reconnect, readonly inspection and confirmed leave',async t=>{
  const app=createCandidateServer(candidate,{rng:()=>0});await app.start();t.after(()=>app.stop());const browser=await launch(kind);t.after(()=>browser.close());
  for(const mode of ['legacy','new'])for(let i=0;i<3;i++){
   counts=pairs[i];const pages=await Promise.all([0,1,2].map(()=>browser.newPage({viewport:{width:375,height:667},isMobile:true,hasTouch:true}))),[a,b,w]=pages;const errors=[],packets=[],views=new Map();
   for(const p of pages){await p.addInitScript(()=>{window.__resultTestSockets=[];window.WebSocket=class extends WebSocket{constructor(...args){super(...args);window.__resultTestSockets.push(this);}};});p.setDefaultTimeout(15000);await art.install(p,t);p.on('pageerror',e=>errors.push(e.message));p.on('websocket',s=>{s.on('framesent',f=>packets.push(JSON.parse(f.payload.toString())));s.on('framereceived',f=>{const m=JSON.parse(f.payload.toString());if(m.type==='VIEW')views.set(p,m);});});await p.goto(app.url+(mode==='new'?'/online-b.html':'/online.html'));await p.waitForFunction(()=>!document.querySelector('#create').disabled);}
   await a.locator('#create').click();await a.locator('#room-code').waitFor();const code=await a.locator('#room-code').innerText();
   for(const [p,button] of [[b,'#join'],[w,'#watch']]){await p.locator('#code').fill(code);await p.locator(button).click();await p.locator('#room').waitFor();}
   for(const button of ['#deck-apply','#ready'])for(const p of [a,b]){const v=await p.locator('#board').getAttribute('data-version');await p.locator(button).click();await Promise.all(pages.map(q=>q.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),v)));}
   await a.locator(mode==='new'?'[data-role="end"]':'#actions [data-kind="END"]').click();
   for(const [n,p] of pages.entries()){await popup(p).waitFor({state:'visible'});const expected=n===2?(i===2?'引き分け':'プレイヤー（'+(i===0?'P1':'P2')+'）の勝利'):n===0?titles[i]:titles[i===0?1:i===1?0:2];assert.equal(await popup(p).locator('h2').innerText(),expected);await fits(p);assert.equal(await p.locator('#board').getAttribute('data-room-phase'),'ENDED');await photo(p,kind+'-online-'+mode+'-'+i+'-viewer'+n);await popup(p).getByRole('button',{name:'盤面を見る',exact:true}).click();}
   const finalVersion=await a.locator('#board').getAttribute('data-version'),actions=packets.filter(p=>p.type==='ACTION').length,finalView=finalState(views.get(a));
   if(mode==='new'){await a.locator('[data-role="own-field"] .unit').first().click();await a.getByRole('button',{name:'カード詳細',exact:true}).click();await a.locator('#sheet [data-role="close"]').click();assert(await w.locator('[data-role="all-actions"]').isDisabled());}
   else{await a.locator('[data-zone="player-field"] .battle-card').first().click();await a.locator('#overlay').waitFor({state:'visible'});assert.equal(await a.locator('#overlay-body [data-kind]').count(),0);await a.locator('#close-overlay').click();}
   if(i===2){if(mode==='new')await a.getByRole('link',{name:'旧UIへ',exact:true}).click();else{await a.locator('#menu').click();await a.getByRole('link',{name:'新UIへ切り替え',exact:true}).click();}await a.locator('.battle-result-open').waitFor();assert(!await popup(a).isVisible());}
   if(i===0){await a.context().setOffline(true);await a.evaluate(()=>window.__resultTestSockets.forEach(s=>s.close()));await a.waitForFunction(()=>document.querySelector('#connection').textContent==='切断中');assert(!await popup(a).isVisible());if(mode==='new'){await a.locator('[data-role="own-field"] .unit').first().click();await a.getByRole('button',{name:'カード詳細',exact:true}).click();await a.locator('#sheet [data-role="close"]').click();}else{await a.locator('[data-zone="player-field"] .battle-card').first().click();await a.locator('#overlay').waitFor({state:'visible'});await a.locator('#close-overlay').click();}await a.context().setOffline(false);await a.waitForFunction(()=>document.querySelector('#connection').textContent==='接続済み');}
   await a.reload();await a.locator('#board').waitFor({state:'visible'});assert(!await popup(a).isVisible());assert(Number(await a.locator('#board').getAttribute('data-version'))>=Number(finalVersion));
   for(const p of [a,w]){await p.reload();await p.locator('.battle-result-open').waitFor();assert(!await popup(p).isVisible());await p.locator('.battle-result-open').click();await fits(p);}
   assert.equal(require('node:crypto').createHash('sha256').update(finalState(views.get(a))).digest('hex'),require('node:crypto').createHash('sha256').update(finalView).digest('hex'),'final cards, HP, attachments and result survive reconnect');
   assert.equal(views.get(a).battle.actions.length,0);
   assert(await popup(w).locator('[data-result="replay"]').isDisabled());assert.equal(packets.filter(p=>p.type==='ACTION').length,actions);
   await popup(a).getByRole('button',{name:'もう一度対戦',exact:true}).click();await a.locator('[data-kind="CONFIRM_LEAVE"]').waitFor();assert.equal(packets.filter(p=>p.type==='LEAVE').length,0);await a.locator('[data-kind="CANCEL_LEAVE"]').click();assert(Number(await a.locator('#board').getAttribute('data-version'))>=Number(finalVersion));
   for(const p of pages){if(!await popup(p).isVisible())await p.locator('.battle-result-open').click();await popup(p).getByRole('button',{name:'メニューへ',exact:true}).click();await p.locator('[data-kind="CONFIRM_LEAVE"]').click();await p.locator('#entrance').waitFor({state:'visible'});}
   assert.deepEqual(errors,[]);for(const p of pages)await p.close();
  }
 });
}
