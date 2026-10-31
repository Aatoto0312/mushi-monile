'use strict';
// Start only after external-test approval. No tunnel/deployment is started here.
const {step}=require('./ui-pilot.cjs');
async function main(){
  const args=process.argv.slice(2),room=args.find(s=>s.startsWith('--room='))?.slice(7);
  if(!/^\d{6}$/.test(room||'')||args.some(s=>!s.startsWith('--room=')&&s!=='--approved-external-test'))throw Error('ROOM_REQUIRED');
  if(!args.includes('--approved-external-test'))throw Error('EXTERNAL_APPROVAL_REQUIRED');
  const {chromium}=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright'),browser=await chromium.launch({channel:'msedge',headless:false}),page=await browser.newPage({viewport:{width:1100,height:800}});
  try{
    await page.goto('https://'+require('../ngrok-plan.json').hostname+'/online.html');
    console.log('Enter the temporary trial invite in the browser if prompted. Never enter the ngrok authtoken here.');
    await page.waitForFunction(()=>document.querySelector('#join')&&!document.querySelector('#join').disabled,null,{timeout:300000});
    await page.locator('#code').fill(room);await page.locator('#join').click();await page.locator('#room').waitFor();await page.locator('#deck-select').selectOption('preset:OKAMAKIRI');await page.locator('#deck-apply').click();await page.waitForFunction(()=>!document.querySelector('#ready').disabled);await page.locator('#ready').click();await page.locator('#board').waitFor({timeout:300000});
    const deadline=Date.now()+1800000;
    while(Date.now()<deadline){
      const phase=await page.locator('#board').getAttribute('data-room-phase');if(phase!=='PLAYING'){console.log('Opponent stopped: '+phase);break;}
      const version=await page.locator('#board').getAttribute('data-version');
      if(await step(page))await page.waitForFunction(v=>Number(document.querySelector('#board').dataset.version)>Number(v),version,{timeout:20000});else await page.waitForTimeout(250);
    }
  }finally{await browser.close();}
}
if(require.main===module)main().catch(()=>{console.error('Opponent stopped safely: check connection/room or an unsupported UI decision. No automatic state mutation/retry loop.');process.exitCode=1;});
