'use strict';
// A browser operator, not a second rules engine. It sees only DOM-visible options.
async function step(page){
  if(await page.locator('#board').getAttribute('data-room-phase')!=='PLAYING')return false;
  const choices=page.locator('dialog[open] .online-choice-list');
  if(await choices.count()){
    const hint=await page.locator('dialog[open] #overlay-body>p').textContent(),max=Number(hint.match(/〜(\d+)/)[1]);
    for(let i=0;i<Math.min(max,await choices.locator('button').count());i++)await choices.locator('button').nth(i).click();
    await page.locator('[data-kind="CONFIRM_SELECTION"]').click();return true;
  }
  const instant=page.locator('#actions button:not([data-kind="END"]):not([data-kind="MAIN"])');
  if(await instant.count()){await instant.first().click();return true;}
  const cards=page.locator('[data-zone="player-hand"] .can-act,[data-zone="player-field"] .can-act');
  if(await cards.count()){await cards.first().click();await page.locator('#overlay-body>button[data-kind]').first().click();return true;}
  for(const kind of ['MAIN','END'])if(await page.locator('#actions [data-kind="'+kind+'"]').count()){await page.locator('#actions [data-kind="'+kind+'"]').click();return true;}
  return false;
}
module.exports={step};
