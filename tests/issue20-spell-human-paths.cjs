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
  for(const id of ['set8_062','set8_063','set5_057','set8_057','set8_058','set5_061']) {
    await page.evaluate(id=>{
      const ui=MushiBattle.ui,s=ui.state,pid=s.activePlayerId,p=s.player(pid);
      s.phase=Phases.MAIN_PHASE;s.turnNumber=3;s.pendingEffect=null;
      function make(cardId,zone,instanceId,faceDown=false) {
        return new CardInstance({cardId,zone,instanceId,ownerId:pid,controllerId:pid,faceDown});
      }
      p.hand=[make(id,'HAND',id+'_held')];p.field=[];s.player(s.opponentOf(pid)).field=[];
      p.discard=[make('kabutomushi','DISCARD','visible'),make('namitentou','DISCARD','second'),make('tonosamabatta','DISCARD','hidden',true)];
      if(id==='set5_061'){
        const enemy=s.opponentOf(pid);
        const bug=new CardInstance({cardId:'namitentou',zone:'FIELD',instanceId:s.nextInstanceId(),ownerId:enemy,controllerId:enemy,baseHp:300,currentHp:100});
        bug.runtimeFlags.unhealableDamage=200;s.player(enemy).field.push(bug);
      }
      p.availableCost=10;ui.actionState={mode:'idle'};ui.render();
    },id);
    await page.locator('#self-hand-zone .battle-card').click();
    await page.locator('.detail-action-btn').filter({hasText:'術を使う'}).click();
    if (['set8_057','set8_058','set5_061'].includes(id)) {
      assert.equal(await page.evaluate(id=>MushiBattle.ui.state.playerOrder.some(pid=>MushiBattle.ui.state.player(pid).discard.some(c=>c.instanceId===id+'_held')),id),true);
      if(await page.locator('#pass-overlay').isVisible()) await page.locator('#btn-pass-ok').click();
      continue;
    }
    if(id==='set5_057') {
      for (const ref of ['visible','second']) {
        await page.locator('#self-discard-zone [data-instance-id="'+ref+'"]').evaluate(el=>el.click());
      }
      if (await page.evaluate(()=>Boolean(MushiBattle.ui.state.pendingEffect))) await page.locator('#btn-end-turn').click();
      assert.deepEqual(await page.evaluate(()=>{
        const s=MushiBattle.ui.state;
        return s.player(s.activePlayerId).food.filter(c=>['visible','second'].includes(c.instanceId) && c.faceDown).map(c=>c.instanceId).sort();
      }),['second','visible']);
    } else if(id==='set8_062') {
      await page.locator('#self-discard-zone [data-instance-id="visible"]').evaluate(el=>el.click());
      assert.equal(await page.evaluate(()=>MushiBattle.ui.state.player(MushiBattle.ui.state.activePlayerId).field[0]?.instanceId),'visible');
      assert.equal(await page.locator('#self-discard-zone [data-instance-id="hidden"]').getAttribute('data-card-id'),null);
      assert(!await page.locator('#self-discard-zone [data-instance-id="hidden"]').innerText().then(x=>x.includes('トノサマバッタ')));
    } else {
      assert.equal(await page.evaluate(()=>{const s=MushiBattle.ui.state;return s.player(s.opponentOf(s.activePlayerId)).keywordSuppressionUntilTurn}),4);
    }
  }
  for(const [id,damage] of [['set5_058',400],['set5_059',800]]) {
    await page.evaluate(id=>{
      const ui=MushiBattle.ui,s=ui.state,pid=s.activePlayerId,enemy=s.opponentOf(pid);
      const make=(cardId,zone,ownerId)=>new CardInstance({cardId,zone,instanceId:s.nextInstanceId(),ownerId,controllerId:ownerId});
      const attacker=make('kabutomushi','FIELD',enemy), spell=make(id,'TERRITORY',pid);
      attacker.baseHp=attacker.currentHp=2000;
      s.player(enemy).field=[attacker];s.player(pid).territory.push(spell);
      triggerTerritoryDrawSelection(s,pid,{attackSourceInstanceId:attacker.instanceId});
      resolveTerritoryDrawSelection(s,pid,spell.instanceId);
      ui.render();
    },id);
    await page.getByRole('button',{name:'迎撃を使う',exact:true}).click();
    assert.equal(await page.evaluate(()=>{
      const s=MushiBattle.ui.state;return s.player(s.opponentOf(s.activePlayerId)).field[0].currentHp;
    }),2000-damage);
  }
});
