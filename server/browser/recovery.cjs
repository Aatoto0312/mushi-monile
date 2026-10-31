'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {chromium,webkit}=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright');
test('mixed Edge and WebKit clients pause, resume and explicitly abandon a restarted-server match',async t=>{
  let app=require('../dev.cjs').createDevServer({rng:()=>0});await app.start();t.after(()=>app.stop());
  const edge=await chromium.launch({channel:'msedge',headless:true}),safari=await webkit.launch({headless:true});t.after(()=>Promise.all([edge.close(),safari.close()]));
  const a=await edge.newPage({viewport:{width:390,height:650}}),b=await safari.newPage({viewport:{width:844,height:390}});for(const p of [a,b])p.on('dialog',d=>d.accept());
  const url='http://127.0.0.1:8788/online.html';
  async function join(){await a.locator('#create').click();const code=await a.locator('#room-code').textContent();await b.locator('#code').fill(code);await b.locator('#join').click();await b.locator('#room').waitFor();return code;}
  async function ready(){for(const [p,id] of [[a,'KABUTOMUSHI'],[b,'OKAMAKIRI']]){await p.locator('#deck-select').selectOption('preset:'+id);await p.locator('#deck-apply').click();await p.waitForFunction(()=>!document.querySelector('#ready').disabled);}await a.locator('#ready').click();await b.locator('#ready').click();await a.locator('#board').waitFor();await b.locator('#board').waitFor();}
  for(const p of [a,b]){await p.goto(url);await p.waitForFunction(()=>!document.querySelector('#create').disabled);}
  const oldCode=await join();await ready();
  await b.goto('about:blank');await a.getByText('相手の再接続を待っています（最大5分）',{exact:true}).waitFor();assert.equal(await a.locator('#actions button').count(),0);
  await b.goto(url);await b.locator('#board').waitFor();await a.getByText('相手の再接続を待っています（最大5分）',{exact:true}).waitFor({state:'hidden'});
  assert.equal(await a.locator('#board').getAttribute('data-room-phase'),'PLAYING');
  await app.stop();app=require('../dev.cjs').createDevServer({rng:()=>0});await app.start();
  for(const p of [a,b]){await p.locator('#entrance').waitFor();await p.waitForFunction(()=>!document.querySelector('#create').disabled);assert((await p.locator('#notice').textContent()).includes('ルームがありません'));}
  const newCode=await join();assert.notEqual(newCode,oldCode);await ready();await a.locator('#menu').click();await a.getByRole('button',{name:'投了',exact:true}).click();
  for(const p of [a,b])await p.waitForFunction(()=>document.querySelector('#board').dataset.roomPhase==='ENDED');
  for(const p of [a,b]){await p.locator('#menu').click();await p.getByRole('button',{name:'ルームを終了して戻る'}).click();await p.locator('#entrance').waitFor();}
  await join();await a.locator('#leave').click();await b.getByText('ホストが退出したためルームを終了しました。',{exact:true}).waitFor();assert(await b.locator('#ready').isDisabled());await b.locator('#leave').click();await b.locator('#entrance').waitFor();
});
