// Run against the local server with an external Playwright installation.
const {chromium,webkit}=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const out=path.resolve(__dirname,'../docs/astra-responsive');
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const kind=process.env.MUSHI_BROWSER||'chromium';
 const browser=await (kind==='webkit'?webkit:chromium).launch(kind==='webkit'?{headless:true}:{channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:390,height:560},isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 let checks=0;const check=(x,m)=>{assert(x,m);checks++;};
 try {
  await page.goto(process.env.MUSHI_URL||'http://127.0.0.1:8765',{waitUntil:'domcontentloaded'});
  for(const size of [{width:390,height:560},{width:844,height:300},{width:568,height:320},{width:667,height:375},{width:375,height:667},{width:844,height:390},{width:390,height:844}]){
   await page.setViewportSize(size);
   for(const target of ['#btn-vs-cpu','#btn-vs-human','#btn-tutorial']){
    await page.locator(target).scrollIntoViewIfNeeded();
    const nav=await page.locator('.lobby .app-nav').boundingBox(),button=await page.locator(target).boundingBox();
    check(Math.abs(nav.y+nav.height-size.height)<2,'Nav anchored to usable viewport '+JSON.stringify(size));
    check(button.y>=0&&button.y+button.height<=nav.y+1,'Home action clear of navigation '+target);
   }
   await page.screenshot({path:path.join(out,kind+'-home-'+size.width+'x'+size.height+'.png')});
  }
  await page.locator('#btn-tutorial').click();
  for(const size of [{width:390,height:560},{width:844,height:300},{width:568,height:320},{width:667,height:375},{width:360,height:640},{width:844,height:390},{width:430,height:932},{width:390,height:664}]){
   await page.setViewportSize(size);
   for(const count of [0,1,8])for(const hand of [1,12]){
    await page.evaluate(({count,hand})=>{
     const u=MushiBattle.ui,s=u.state,p=s.player(s.activePlayerId);
     const make=(zone,i)=>new CardInstance({instanceId:'responsive_'+zone+i,cardId:i%2?'kabutomushi':'namitentou',ownerId:p.id||s.activePlayerId,controllerId:s.activePlayerId,zone:zone.toUpperCase(),faceDown:false,currentHp:500});
     p.field=Array.from({length:count},(_,i)=>make('field',i));p.hand=Array.from({length:hand},(_,i)=>make('hand',i));u.render();
    },{count,hand});
    for(const selector of ['#self-field-zone .battle-card','#opp-field-zone .battle-card','#self-hand-zone .battle-card']){
     const cards=page.locator(selector);if(!await cards.count())continue;
     const card=cards.last();await card.evaluate(n=>n.scrollIntoView({block:'center',inline:'center'}));
     const r=await card.boundingBox();
     check(r.height>=96&&r.width>=68,'Recognizable card '+selector+' '+JSON.stringify({size,count,hand,r}));
     check(r.x>=-1&&r.x+r.width<=size.width+1&&r.y>=-1&&r.y+r.height<=size.height+1,'Entire card reachable '+selector+' '+JSON.stringify({size,count,hand,r}));
     check(await card.locator('.card-name-full').isVisible(),'Card name visible');
     const hp=card.locator('.card-hp');if(await hp.count()){
      const n=await card.locator('.card-name-full').boundingBox(),h=await hp.boundingBox();
      check(n.y+n.height<h.y,'Name and HP do not collide');
     }
    }
    await page.locator('#btn-draw').scrollIntoViewIfNeeded();
    const regions=await page.evaluate(()=>{
     const hand=document.querySelector('#zone-bottom .zone-group--hand').getBoundingClientRect();
     const controls=document.querySelector('.control-bar').getBoundingClientRect();
     const guide=document.querySelector('#tutorial-guide').getBoundingClientRect();
     return {hand:hand.bottom,controls:controls.top,guide:guide.top};
    });
    check(regions.hand<=regions.controls+1&&regions.controls<=regions.guide+1,'Controls and guide do not overlap hand '+JSON.stringify({size,regions}));
    check(await page.locator('#btn-draw').isVisible(),'Action reachable');
    check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No page horizontal overflow');
    if(hand===12&&count===8)await page.screenshot({path:path.join(out,kind+'-battle-'+size.width+'x'+size.height+'.png')});
   }
  }
  check(!errors.length,'No page errors '+errors.join(';'));
  // Desktop WebKit has zero env() insets. Inject nonzero values in served CSS
  // to exercise padding/layout arithmetic, not to claim real iOS emulation.
  const safe=await browser.newPage({viewport:{width:667,height:375},isMobile:true,hasTouch:true});
  await safe.route('**/*.css',async route=>{
   const response=await route.fetch();
   const css=(await response.text()).replace(/env\(safe-area-inset-(top|bottom|left|right)(?:,[^)]*)?\)/g,(_,side)=>({top:'20px',bottom:'21px',left:'44px',right:'44px'})[side]);
   await route.fulfill({response,body:css});
  });
  await safe.goto(process.env.MUSHI_URL||'http://127.0.0.1:8765',{waitUntil:'domcontentloaded'});
  await safe.locator('#btn-tutorial').scrollIntoViewIfNeeded();
  const safeNav=await safe.locator('.app-nav').boundingBox(),entry=await safe.locator('#btn-tutorial').boundingBox();
  check(entry.y+entry.height<=safeNav.y+1,'Safe-area home navigation reserves space');
  check(await safe.locator('.app-nav').evaluate(n=>getComputedStyle(n).paddingBottom)==='24px','Landscape navigation includes bottom inset');
  await safe.locator('#btn-tutorial').click();
  await safe.locator('#self-field-zone .battle-card').last().evaluate(n=>n.scrollIntoView({block:'center',inline:'center'}));
  const safeCard=await safe.locator('#self-field-zone .battle-card').last().boundingBox();
  check(safeCard.x>=44&&safeCard.x+safeCard.width<=623&&safeCard.height>=106,'Safe-area field card remains readable and reachable');
  await safe.screenshot({path:path.join(out,kind+'-safe-area.png')});
  await safe.close();
  console.log(kind+' RESPONSIVE CHECKS PASSED: '+checks);
 }catch(e){await page.screenshot({path:path.join(out,kind+'-failure.png')});throw e;}
 finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
