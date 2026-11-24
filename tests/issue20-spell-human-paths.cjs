'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const pw=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright');

for(const kind of ['chromium','webkit']) test(kind+' local human uses both spells and sees only a card back in discard',async t=>{
  const browser=await pw[kind].launch(kind==='chromium'?{channel:'msedge'}:{});
  t.after(()=>browser.close());
  const page=await browser.newPage({viewport:{width:390,height:670}});
  page.setDefaultTimeout(7000);
  await page.goto(process.env.MUSHI_URL||pathToFileURL(path.resolve(__dirname,'../index.html')).href,{waitUntil:'domcontentloaded'});
  await page.locator('#btn-vs-human').click();
  await page.locator('#btn-deck-p1-kabuto').click();
  await page.locator('#btn-deck-p2-okama').click();
  if(await page.locator('#pass-overlay').isVisible()) await page.locator('#btn-pass-ok').click();
  for(const id of ['set8_062','set8_063']) {
    await page.evaluate(id=>{
      const ui=MushiBattle.ui,s=ui.state,pid=s.activePlayerId,p=s.player(pid);
      s.phase=Phases.MAIN_PHASE;s.turnNumber=3;s.pendingEffect=null;
      function make(cardId,zone,instanceId,faceDown=false) {
        return new CardInstance({cardId,zone,instanceId,ownerId:pid,controllerId:pid,faceDown});
      }
      p.hand=[make(id,'HAND','held')];p.field=[];
      p.discard=[make('kabutomushi','DISCARD','visible'),make('namitentou','DISCARD','second'),make('tonosamabatta','DISCARD','hidden',true)];
      p.availableCost=4;ui.actionState={mode:'idle'};ui.render();
    },id);
    await page.locator('#self-hand-zone .battle-card').click();
    await page.locator('.detail-action-btn').filter({hasText:'術を使う'}).click();
    if(id==='set8_062') {
      await page.locator('#self-discard-zone [data-instance-id="visible"]').evaluate(el=>el.click());
      assert.equal(await page.evaluate(()=>MushiBattle.ui.state.player(MushiBattle.ui.state.activePlayerId).field[0]?.instanceId),'visible');
      assert.equal(await page.locator('#self-discard-zone [data-instance-id="hidden"]').getAttribute('data-card-id'),null);
      assert(!await page.locator('#self-discard-zone [data-instance-id="hidden"]').innerText().then(x=>x.includes('トノサマバッタ')));
    } else {
      assert.equal(await page.evaluate(()=>{const s=MushiBattle.ui.state;return s.player(s.opponentOf(s.activePlayerId)).keywordSuppressionUntilTurn}),4);
    }
  }
});
