'use strict';
// Test operator: reads visible legal choices only; no GameState access.
async function step(page){
 if(await page.locator('#board').getAttribute('data-room-phase')!=='PLAYING'||await page.locator('[data-role="all-actions"]').isDisabled())return false;
 const confirm=page.locator('#b-battle dialog[open] [data-kind="CONFIRM_SELECTION"]');
 if(await confirm.count()){
  const hint=await page.locator('#sheet-body>p').first().innerText(),max=Number(hint.match(/〜(\d+)/)[1]),choices=page.locator('#b-battle .online-choice-list>button');
  for(let i=0;i<Math.min(max,await choices.count());i++)await choices.nth(i).click();await confirm.click();return true;
 }
 await page.locator('[data-role="all-actions"]').click();const choices=page.locator('#sheet-body>button[data-kind]');
 const kinds=await choices.evaluateAll(nodes=>nodes.map(n=>n.dataset.kind));if(!kinds.length){await page.locator('#close').click();return false;}
 const priority=['DRAW','SET_FOOD','SUMMON','ALTERNATIVE','SPELL','ENHANCE','FIELD_ABILITY','MULTI_ATTACK','ATTACK','CHOICE','TERRITORY_CHOICE','MAIN','TO_SET','END'];
 let index=kinds.indexOf(priority.find(k=>kinds.includes(k)));if(index<0)index=0;await choices.nth(index).click();return true;
}
module.exports={step};
