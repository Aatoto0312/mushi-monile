'use strict';
// Receives a temporary invite over private IPC; never reads the ngrok credential.
const {step}=require('./ui-pilot.cjs');let browser,started=false;
const send=m=>{if(process.connected)process.send(m);};
async function stop(){if(browser)await browser.close();process.exit();}
process.on('disconnect',stop);process.on('message',async message=>{
  if(message?.type==='STOP')return stop();
  if(message?.type!=='START'||started)return;started=true;
  try{
    const {chromium}=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright');
    const expected='https://'+require('../ngrok-plan.json').hostname;
    const base=message.localTestBase||expected;
    if(base!==expected&&!/^http:\/\/127\.0\.0\.1:\d+$/.test(base))throw Error('HOST_INVALID');
    browser=await chromium.launch({channel:'msedge',headless:!!message.localTestBase});
    const context=await browser.newContext({viewport:{width:1100,height:800},extraHTTPHeaders:{'ngrok-skip-browser-warning':'1'}}),page=await context.newPage();
    let error=false;page.on('pageerror',()=>{error=true;send({type:'PC_ERROR',reason:'PAGE_ERROR'});});
    let response;for(let i=0;i<10;i++){try{response=await fetch(base+'/access',{method:'POST',headers:{Origin:base,'Content-Type':'application/json','ngrok-skip-browser-warning':'1'},body:JSON.stringify({invite:message.invite}),signal:AbortSignal.timeout(3000)});if(response.status===204)break;}catch{}await new Promise(r=>setTimeout(r,500));}
    if(!response||response.status!==204)throw Error('ACCESS_FAILED');message.invite=null;
    const cookie=response.headers.getSetCookie().find(value=>value.startsWith('mushi_preview='));if(!cookie)throw Error('COOKIE_MISSING');
    await context.addCookies([{name:'mushi_preview',value:cookie.split(';')[0].slice('mushi_preview='.length),domain:new URL(base).hostname,path:'/',httpOnly:true,secure:base.startsWith('https:'),sameSite:'Strict'}]);
    await page.goto(base+'/online.html');await page.waitForFunction(()=>document.querySelector('#create')&&!document.querySelector('#create').disabled);
    await page.locator('#name').fill('PCテスト担当');await page.locator('#create').click();await page.locator('#room').waitFor();const code=await page.locator('#room-code').textContent();
    await page.locator('#deck-select').selectOption('preset:OKAMAKIRI');await page.locator('#deck-apply').click();await page.waitForFunction(()=>!document.querySelector('#ready').disabled);await page.locator('#ready').click();
    send({type:'PC_ROOM_READY',code,preset:'OKAMAKIRI'});
    await page.locator('#board').waitFor({timeout:1800000});send({type:'PC_MATCH_STARTED',code});
    const deadline=Date.now()+1800000;
    while(Date.now()<deadline&&!error){
      const phase=await page.locator('#board').getAttribute('data-room-phase');if(phase!=='PLAYING'){send({type:'PC_MATCH_FINISHED',code,phase,result:(await page.locator('#actions').innerText()).slice(0,160)});return;}
      const version=await page.locator('#board').getAttribute('data-version');
      if(await step(page))await page.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),version,{timeout:20000});else await page.waitForTimeout(250);
    }
  }catch{send({type:'PC_ERROR',reason:'CONNECTION_OR_UI_FAILED'});}
});
