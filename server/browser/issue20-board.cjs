'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {createRuntime} = require('../lib/runtime.cjs');
const runtime = require('../lib/runtime.cjs');

function setup(c, s) {
  s.phase = 'MAIN_PHASE'; s.turnNumber = 3; s.activePlayerId = 'P1'; s.pendingEffect = null;
  for (const pid of s.playerOrder)
    for (const zone of ['field','hand','food','discard']) s.player(pid)[zone] = [];
  function put(id, zone, owner='P1', hp) {
    const def = c.getCardDefinition(id);
    const card = new c.CardInstance({instanceId:s.nextInstanceId(),cardId:id,zone,ownerId:owner,
      controllerId:owner,currentHp:hp ?? def.baseHp,baseHp:hp ?? def.baseHp});
    s.player(owner)[zone.toLowerCase()].push(card);
  }
  put('set8_017','FOOD'); put('set8_039','FOOD');
  put('set8_035','HAND'); put('jinkaichu_no_bakunetsudan','HAND');
  put('set6_044','FIELD','P2'); put('jinkaichu_no_bakunetsudan','DISCARD','P2');
  put('set5_021','FIELD'); put('set7_032','FIELD');
  put('kabutomushi','FIELD','P2',5000); put('kabutomushi','FIELD','P2',5000);
  s.player('P1').availableCost = c.getCardDefinition('set8_035').cost - 2 + c.getCardDefinition('jinkaichu_no_bakunetsudan').cost;
}

runtime.createRuntime = () => {
  const r = createRuntime(), start = r.start;
  r.start = (...args) => { const s = start(...args); setup(r.context,s); return s; };
  return r;
};
const {createCandidateServer} = require('../tools/candidate-server.cjs');
const pw = require(process.env.MUSHI_PLAYWRIGHT_PATH || 'playwright');

for (const kind of ['chromium','webkit']) for (const mode of ['cpu','online']) {
  test(kind + ' ' + mode + ' ordered hits, king discount and resistance on SE3', async t => {
    const app = createCandidateServer(process.env.MUSHI_CANDIDATE_DIRECTORY, {rng:()=>0});
    await app.start(); t.after(()=>app.stop());
    const browser = await pw[kind].launch(kind==='chromium' && process.env.MUSHI_CHROMIUM_CHANNEL!=='bundled' ? {channel:'msedge'} : {});
    t.after(()=>browser.close());
    const a = await browser.newPage({viewport:{width:375,height:667},isMobile:true,hasTouch:true});
    const errors=[]; a.on('pageerror',e=>errors.push(e.message)); a.setDefaultTimeout(10000);
    await a.addInitScript(()=>Math.random=()=>0);
    let b;
    if (mode==='cpu') {
      await a.goto(app.url+'/index.html',{waitUntil:'domcontentloaded'}); await a.locator('#btn-vs-cpu').click();
      await a.locator('#btn-deck-p1-kabuto').click(); await a.locator('#btn-deck-p2-okama').click();
      await a.locator('#cpu-b-shell').waitFor();
      await a.evaluate(text=>{const ui=MushiBattle.ui; (0,eval)('('+text+')')(window,ui.state); ui.render();},setup.toString());
    } else {
      b = await browser.newPage();
      for(const p of [a,b]) {
        await p.goto(app.url+'/online-b.html',{waitUntil:'domcontentloaded'}); await p.waitForFunction(()=>!document.querySelector('#create').disabled);
      }
      await a.locator('#create').click(); await a.locator('#room-code').waitFor();
      await b.locator('#code').fill(await a.locator('#room-code').innerText()); await b.locator('#join').click();
      await b.locator('#room').waitFor();
      for (const button of ['#deck-apply','#ready']) for (const p of [a,b]) {
        const v=Number(await p.locator('#board').getAttribute('data-version'));
        await p.locator(button).click();
        await Promise.all([a,b].map(q=>q.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>v,v)));
      }
    }
    const card = (role,id) => a.locator('[data-role="'+role+'"] .unit[data-card-id="'+id+'"]');
    async function hand(id) {
      if (await a.locator('[data-role="hand-toggle"]').getAttribute('aria-expanded') !== 'true')
        await a.locator('[data-role="hand-toggle"]').click();
      await card('hand',id).click();
    }
    await hand('set8_035'); await a.locator('#sheet [data-kind="SUMMON"]').click();
    await card('own-field','set8_035').click();
    assert(await a.getByRole('button',{name:'攻撃する',exact:true}).isVisible());
    await a.getByRole('button',{name:'キャンセル',exact:true}).click();
    await hand('jinkaichu_no_bakunetsudan');
    await a.locator('#sheet [data-kind="SPELL"]').click();
    await a.locator('.online-choice-list button').filter({hasText:'ホソヘリカメムシ'}).click();
    await a.locator('[data-kind="CONFIRM_SELECTION"]').click();
    await a.waitForFunction(()=>!document.querySelector('[data-role="hand"] [data-card-id="jinkaichu_no_bakunetsudan"]'));
    assert.match(await card('other-field','set6_044').locator('.hp').innerText(),/300/);
    for(const [index,id] of ['set5_021','set7_032'].entries()) {
      await card('own-field',id).click(); await a.getByRole('button',{name:'攻撃する',exact:true}).click();
      await a.locator('[data-skill]').filter({hasText:'テナガ'}).click();
      const list=a.locator('.online-choice-list');
      await list.waitFor();
      if(mode==='online' && !index) {await a.reload(); await list.waitFor(); assert.equal(await b.locator('.online-choice-list:visible').count(),0);}
      const options=list.locator('button').filter({hasText:'カブトムシ'});
      assert.equal(await options.count(),2);
      await options.nth(1).click(); await options.first().click();
      const hp=await card('other-field','kabutomushi').first().locator('.hp').innerText();
      await a.locator('[data-kind="CONFIRM_SELECTION"]').click(); await list.waitFor({state:'hidden'});
      const values=await card('other-field','kabutomushi').locator('.hp').allInnerTexts();
      assert.equal(values.length,2); assert.equal(values[0],values[1]); assert.notEqual(values[0],hp);
      if(b) {
        await b.waitForFunction(value=>document.querySelector('[data-role="own-field"] [data-card-id="kabutomushi"] .hp').innerText===value,values[0]);
      }
    }
    assert.deepEqual(errors,[]);
  });
}
