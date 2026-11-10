'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const rt=require('../lib/runtime.cjs'),original=rt.createRuntime;
const {build}=require('../../scripts/build-online-candidate.cjs');

const pw=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright');
const spell='set2_051', larva='namiageha_larva', adult='namiageha';

function setup(c,s,paired){
  s.phase='MAIN_PHASE';s.turnNumber=3;s.activePlayerId='P1';s.pendingEffect=null;
  const p=s.player('P1');
  for(const z of ['field','hand','discard','food','territory'])p[z]=[];
  p.availableCost=0;
  function put(cardId,zone){
    const def=c.getCardDefinition(cardId);
    const card=new c.CardInstance({instanceId:s.nextInstanceId(),cardId,ownerId:'P1',controllerId:'P1',zone,baseHp:def.baseHp,currentHp:def.baseHp,faceDown:zone==='TERRITORY'});
    p[zone.toLowerCase()].push(card);
    return card;
  }
  const source=put('set2_051','HAND'),larva=put('namiageha_larva','FIELD');
  const adult=put(paired?'namiageha':'set2_007','TERRITORY');
  c.drawTerritoryCard(s,'P1');
  c.resolveTerritoryDrawSelection(s,'P1',adult.instanceId);
  if(adult.zone!=='HAND'||s.pendingEffect)throw Error('Territory draw fixture did not complete');
  return {source:source.instanceId,larva:larva.instanceId,adult:adult.instanceId,faceDown:adult.faceDown};
}

const production=process.env.MUSHI_WHITE_NIGHT_REPRO_URL;
let paired=true;
if(!production){
  rt.createRuntime=()=>{
    const r=original(),start=r.start;
    r.start=(...args)=>{const s=start(...args);setup(r.context,s,paired);return s;};
    return r;
  };
}
const {createCandidateServer}=require('../tools/candidate-server.cjs');
for(const kind of production?['chromium']:['chromium','webkit']){
  for(const mode of production?['legacy','cpu']:['cpu','online']){
    test(kind+' '+mode+' White Night Emergence through battle UI',async t=>{
      let app;
      if(!production){
        const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mushi-white-night-'));
        t.after(()=>{assert.equal(path.dirname(dir),path.resolve(os.tmpdir()));assert(path.basename(dir).startsWith('mushi-white-night-'));fs.rmSync(dir,{recursive:true,force:true});});
        build(path.join(dir,'candidate'));app=createCandidateServer(path.join(dir,'candidate'),{rng:()=>0});await app.start();t.after(()=>app.stop());
      }
      const url=production||app.url;
      const browser=await pw[kind].launch(kind==='chromium'?{channel:'msedge'}:{});
      t.after(()=>browser.close());
      for(paired of production?[true]:[true,false]){
        const a=await browser.newPage({viewport:{width:375,height:667},isMobile:true,hasTouch:true});
        a.setDefaultTimeout(10000);
        const errors=[];
        a.on('pageerror',e=>errors.push(e.stack));
        let b,ids;
        try{
          if(mode==='online'){
            b=await browser.newPage();
            for(const p of [a,b]){await p.goto(url+'/online-b.html',{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>!document.querySelector('#create').disabled);}
            await a.locator('#create').click();
            await a.locator('#room-code').waitFor();
            await b.locator('#code').fill(await a.locator('#room-code').innerText());
            await b.locator('#join').click();
            await b.locator('#room').waitFor();
            for(const control of ['#deck-apply','#ready'])for(const p of [a,b]){
              const version=await p.locator('#board').getAttribute('data-version');
              await p.locator(control).click();
              await Promise.all([a,b].map(q=>q.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),version)));
            }
            await a.waitForFunction(()=>document.querySelector('#board').dataset.roomPhase==='PLAYING');
          }else{
            await a.goto(url+'/index.html'+(mode==='legacy'?'?battleUi=legacy':''),{waitUntil:'domcontentloaded'});
            await a.locator('#btn-vs-cpu').click();
            await a.locator('#btn-deck-p1-kabuto').click();
            await a.locator('#btn-deck-p2-okama').click();
            ids=await a.evaluate(({code,paired})=>{
              const ui=MushiBattle.ui;
              const fixture=(0,eval)('('+code+')')(window,ui.state,paired);
              if(location.hostname.endsWith('github.io')){
                const use=window.useSpell;
                window.useSpell=(...args)=>{try{return use(...args);}catch(e){(window.spellErrors||=[]).push(e.stack);throw e;}};
              }
              ui.render();
              return fixture;
            },{code:setup.toString(),paired});
          }

          if(mode==='legacy'){
            a.on('dialog',d=>d.dismiss());
            await a.locator('#self-hand-zone [data-instance-id="'+ids.source+'"]').first().click();
            await a.getByRole('button',{name:/術を使う/}).click();
            const stacks=await a.evaluate(()=>window.spellErrors); assert.match(stacks?.[0]||'',/選択可能なカードが不足しています/); t.diagnostic(JSON.stringify({ids,stacks}));
            return;
          }

          const toggle=a.locator('[data-role="hand-toggle"]');
          if(await toggle.getAttribute('aria-expanded')==='false')await toggle.click();
          await a.locator('[data-role="hand"] .unit[data-card-id="'+spell+'"]').click();
          const action=a.locator('#sheet [data-kind="SPELL"]');
          if(production){const actionCount=await action.count(),stacks=await a.evaluate(()=>window.spellErrors); assert.equal(actionCount,0); assert.match(stacks?.[0]||'',/選択可能なカードが不足しています/); t.diagnostic(JSON.stringify({ids,actionCount,stacks}));return;}
          if(!paired){
            assert.equal(await action.count(),0);
            await a.locator('#sheet [data-role="close"]').click();
            await a.locator('[data-role="hand"] .unit[data-card-id="'+spell+'"]').waitFor();
            await a.locator('[data-role="own-field"] .unit[data-card-id="'+larva+'"]').waitFor();
            assert.equal(await a.locator('[data-role="own-stats"]>span b').innerText(),'0');
          }else{
            await action.click({timeout:5000});
            const choices=a.locator('#sheet .online-choice-list button[data-ref]');
            await choices.first().waitFor();
            if(b){
              assert.equal(await b.locator('#sheet .online-choice-list').count(),0);
              await a.reload({waitUntil:'domcontentloaded'});
              await choices.first().waitFor();
            }
            assert.equal(await choices.count(),2);
            for(const choice of await choices.all())await choice.click();
            await a.getByRole('button',{name:/^選択を決定/}).click();
            await a.locator('[data-role="own-field"] .unit[data-card-id="'+adult+'"]').waitFor();
            assert.equal(await a.locator('[data-role="own-field"] .unit[data-card-id="'+larva+'"]').count(),0);
            assert.equal(await a.locator('[data-role="own-stats"]>span b').innerText(),'0');
            assert.equal(await a.locator('[data-role="own-stats"] button').filter({hasText:/^エサ/}).locator('b').innerText(),'1');
            if(b)await b.locator('[data-role="other-field"] .unit[data-card-id="'+adult+'"]').waitFor();
            else assert.deepEqual(await a.evaluate(()=>MushiBattle.ui.state.player('P1').food.map(card=>card.cardId)),[larva]);
          }
          assert.deepEqual(errors,[]);
        }catch(error){t.diagnostic(JSON.stringify({mode,paired,notice:await a.locator("#cpu-b-notice").allTextContents(),sheet:await a.locator("#sheet").allTextContents()}));throw error;}finally{await a.close();if(b)await b.close();}
      }
    });
  }
}
