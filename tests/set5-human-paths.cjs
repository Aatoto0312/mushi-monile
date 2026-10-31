'use strict';
const {chromium,webkit}=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{
  const browser=await(process.env.MUSHI_BROWSER==='webkit'?webkit.launch():chromium.launch({channel:'msedge'}));
  const page=await browser.newPage({viewport:{width:390,height:650},isMobile:true,hasTouch:true});
  const errors=[],failedRequests=[];page.on('pageerror',error=>errors.push(error.message));
  page.on('requestfailed',request=>failedRequests.push({url:request.url(),failure:request.failure()}));let checks=0;
  try{
    await page.goto(process.env.MUSHI_URL||'http://127.0.0.1:8765',{waitUntil:'domcontentloaded'});
    try{await page.waitForFunction(()=>!!window.MushiBattle?.ui);}catch(error){console.error('Startup diagnostics',JSON.stringify({errors,failedRequests,url:page.url()}));throw error;}
    await page.locator('#btn-vs-human').click();await page.locator('#btn-deck-p1-kabuto').click();await page.locator('#btn-deck-p2-okama').click();
    if(await page.locator('#pass-overlay').isVisible())await page.locator('#btn-pass-ok').click();
    await page.evaluate(()=>{
      const u=MushiBattle.ui,s=u.state,pid=s.activePlayerId,p=s.player(pid),op=s.player(s.opponentOf(pid));
      // Provisional mechanics are tested under a test-only definition. This
      // fixture neither releases the canonical PARTIAL card nor certifies it.
      const raw=JSON.parse(JSON.stringify(getCardDefinition('set5_003')));raw.id='test_set5_human_offering';raw.set=null;raw.implementationStatus='test';
      const d=new CardDefinition(raw);Object.assign(d,raw);cardRegistry.register(d);
      const make=(id,zone,n)=>new CardInstance({instanceId:'set5-human-'+n,cardId:id,ownerId:pid,controllerId:pid,zone,faceDown:false,baseHp:getCardDefinition(id).baseHp,currentHp:getCardDefinition(id).baseHp});
      s.phase=Phases.MAIN_PHASE;s.turnNumber=3;s.pendingEffect=null;p.field=[];p.hand=[make(d.id,'HAND',1),make('set1_003','HAND',2),make('jinkaichu_no_bakunetsudan','HAND',3)];p.food=[];p.availableCost=20;
      for(let i=0;i<6;i++)p.food.push(make('set1_003','FOOD',10+i));op.field=[];op.territory=[];u.actionState={mode:'idle'};u.render();
    });
    await page.locator('#self-hand-zone [data-instance-id="set5-human-1"]').click();
    await page.locator('.detail-action-btn').filter({hasText:'場に出す'}).click();
    assert.equal(await page.evaluate(()=>MushiBattle.ui.state.pendingEffect.selectionPurpose),'ENTRY_OFFERING');checks++;
    assert.deepEqual(await page.evaluate(()=>MushiBattle.ui.state.pendingEffect.options),['set5-human-2']);checks++;
    await page.locator('#self-hand-zone [data-instance-id="set5-human-2"]').click();
    await page.locator('#btn-end-turn').click();
    assert(await page.evaluate(()=>{const s=MushiBattle.ui.state,p=s.player(s.activePlayerId);return !s.pendingEffect&&p.field.some(c=>c.instanceId==='set5-human-1')&&p.discard.some(c=>c.instanceId==='set5-human-2')&&p.hand.some(c=>c.instanceId==='set5-human-3');}));checks++;
    assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1));checks++;
    await page.setViewportSize({width:844,height:390});
    await page.evaluate(()=>{
      const u=MushiBattle.ui,s=u.state,pid=s.activePlayerId,p=s.player(pid),oppid=s.opponentOf(pid),op=s.player(oppid);
      const raw=JSON.parse(JSON.stringify(getCardDefinition('set5_005')));raw.id='test_set5_human_blue';raw.set=null;raw.implementationStatus='test';
      const d=new CardDefinition(raw);Object.assign(d,raw);cardRegistry.register(d);
      const make=(id,owner,zone,n,hp)=>new CardInstance({instanceId:'set5-blue-'+n,cardId:id,ownerId:owner,controllerId:owner,zone,faceDown:false,baseHp:hp||getCardDefinition(id).baseHp,currentHp:hp||getCardDefinition(id).baseHp});
      s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;p.field=[];p.hand=[make(d.id,pid,'HAND',1)];p.availableCost=20;
      op.field=[make('set1_031',oppid,'FIELD',2,10000)];op.territory=[];u.actionState={mode:'idle'};u.hideCardDetail();u.render();
    });
    await page.locator('#self-hand-zone [data-instance-id="set5-blue-1"]').click();
    await page.locator('.detail-action-btn').filter({hasText:'場に出す'}).click();
    assert.deepEqual(await page.locator('#skill-select-row button').allTextContents(),['青','変更しない']);checks++;
    await page.locator('#skill-select-row button').filter({hasText:/^青$/}).click();
    assert.equal(await page.evaluate(()=>getEffectiveColor(MushiBattle.ui.state.player(MushiBattle.ui.state.activePlayerId).field[0])),'BLUE');checks++;
    await page.locator('#self-field-zone [data-instance-id="set5-blue-1"]').click();
    await page.locator('#opp-field-zone [data-instance-id="set5-blue-2"]').click();
    assert(await page.evaluate(()=>{const s=MushiBattle.ui.state,a=s.player(s.activePlayerId).field[0],target=s.player(s.opponentOf(s.activePlayerId)).field[0];return !s.pendingEffect&&a.attackedThisTurn&&target.runtimeFlags.unhealableDamage>0;}));checks++;
    assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1));checks++;
    await page.setViewportSize({width:390,height:650});
    await page.evaluate(()=>{
      const u=MushiBattle.ui,s=u.state,pid=s.activePlayerId,p=s.player(pid),oppid=s.opponentOf(pid),op=s.player(oppid);
      const make=(id,owner,zone,n)=>new CardInstance({instanceId:'set5-ant-'+n,cardId:id,ownerId:owner,controllerId:owner,zone,faceDown:zone==='TERRITORY',baseHp:getCardDefinition(id).baseHp,currentHp:getCardDefinition(id).baseHp});
      s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;p.hand=[];p.field=[make('set1_003',pid,'FIELD',1)];op.field=[make('set5_009',oppid,'FIELD',2)];op.territory=[make('set1_003',oppid,'TERRITORY',3),make('set1_004',oppid,'TERRITORY',4)];
      u.actionState={mode:'idle'};u.hideCardDetail();u.render();
    });
    await page.locator('#self-field-zone [data-instance-id="set5-ant-1"]').click();
    await page.locator('#opp-field-zone [data-instance-id="set5-ant-2"]').click();
    assert(await page.evaluate(()=>MushiBattle.ui.state.player(MushiBattle.ui.state.activePlayerId).field[0].runtimeFlags.destroyOnNextDamage));checks++;
    await page.locator('#territory-picker-cards button').first().click();
    assert(await page.evaluate(()=>{const s=MushiBattle.ui.state,p=s.player(s.opponentOf(s.activePlayerId));return !s.pendingEffect&&p.discard.some(c=>c.instanceId==='set5-ant-2')&&s.phase===Phases.MAIN_PHASE;}));checks++;
    await page.evaluate(()=>{
      const u=MushiBattle.ui,s=u.state,pid=s.activePlayerId,p=s.player(pid),oppid=s.opponentOf(pid),op=s.player(oppid);
      const make=(id,owner,zone,n,hp)=>new CardInstance({instanceId:'set5-food-'+n,cardId:id,ownerId:owner,controllerId:owner,zone,faceDown:zone==='FOOD',baseHp:hp||getCardDefinition(id).baseHp,currentHp:hp||getCardDefinition(id).baseHp});
      s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;p.hand=[];p.field=[make('set5_033',pid,'FIELD',1)];p.food=[make('set1_003',pid,'FOOD',2)];p.availableCost=8;op.field=[make('set1_003',oppid,'FIELD',3,10000)];op.territory=[];u.actionState={mode:'idle'};u.hideCardDetail();u.render();
    });
    await page.locator('#self-field-zone [data-instance-id="set5-food-1"]').click();
    await page.locator('#skill-select-row button').filter({hasText:'草切り'}).click();
    await page.locator('#opp-field-zone [data-instance-id="set5-food-3"]').click();
    assert.equal(await page.evaluate(()=>MushiBattle.ui.state.pendingEffect.selectionPurpose),'ATTACK_ADDITIONAL_COST_FOOD');checks++;
    await page.locator('#self-food-zone').locator('..').click();
    const blindFood=page.locator('#inspector-body .inspector-card');
    assert(await blindFood.isEnabled(),'a legal facedown food cost must remain selectable');checks++;
    assert(!(await page.locator('#inspector-body').innerText()).includes('メキシカンレッドニー'),'hidden food identity must not leak');checks++;
    await blindFood.click();
    assert(await page.evaluate(()=>{const s=MushiBattle.ui.state,p=s.player(s.activePlayerId),op=s.player(s.opponentOf(s.activePlayerId));return !s.pendingEffect&&p.food.length===0&&p.availableCost===8&&op.field[0].currentHp===9100;}));checks++;
    await page.evaluate(()=>{
      const u=MushiBattle.ui,s=u.state,pid=s.activePlayerId,p=s.player(pid),oppid=s.opponentOf(pid),op=s.player(oppid);
      const make=(id,owner,zone,n,hp,hidden)=>new CardInstance({instanceId:'set5-glow-'+n,cardId:id,ownerId:owner,controllerId:owner,zone,faceDown:!!hidden,baseHp:hp||getCardDefinition(id).baseHp,currentHp:hp||getCardDefinition(id).baseHp});
      s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;p.hand=[];p.field=[make('set5_045',pid,'FIELD',1)];p.food=[make('set1_003',pid,'FOOD',2,null,true),make('set1_004',pid,'FOOD',3,null,false)];op.field=[make('set1_003',oppid,'FIELD',4,100)];op.territory=[make('set1_003',oppid,'TERRITORY',5,null,true),make('set1_003',oppid,'TERRITORY',6,null,true)];u.actionState={mode:'idle'};u.hideCardDetail();u.render();
    });
    await page.locator('#self-field-zone [data-instance-id="set5-glow-1"]').click();
    await page.locator('#opp-field-zone [data-instance-id="set5-glow-4"]').click();
    await page.locator('#territory-picker-cards button').first().click();
    assert.deepEqual(await page.evaluate(()=>MushiBattle.ui.state.pendingEffect.options),['set5-glow-2']);checks++;
    await page.locator('#self-food-zone').locator('..').click();
    assert(!(await page.locator('#inspector-body .inspector-card').first().innerText()).includes('メキシカンレッドニー'));checks++;
    await page.locator('#inspector-body .inspector-card').first().click();
    await page.locator('#btn-end-turn').click();
    assert(await page.evaluate(()=>{const s=MushiBattle.ui.state,p=s.player(s.activePlayerId);return !s.pendingEffect&&!p.food[0].faceDown&&s.phase===Phases.MAIN_PHASE;}));checks++;
    assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1));checks++;
    await page.setViewportSize({width:844,height:390});
    await page.evaluate(()=>{
      const u=MushiBattle.ui,s=u.state,pid=s.activePlayerId,p=s.player(pid);
      const make=(id,zone,n)=>new CardInstance({instanceId:'set5-flee-'+n,cardId:id,ownerId:pid,controllerId:pid,zone,faceDown:false,baseHp:getCardDefinition(id).baseHp,currentHp:getCardDefinition(id).baseHp});
      s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;p.field=[make('set5_011','FIELD',1)];p.hand=[make('test_set5_human_blue','HAND',2)];p.availableCost=20;u.actionState={mode:'idle'};u.hideCardDetail();u.render();
    });
    await page.locator('#self-hand-zone [data-instance-id="set5-flee-2"]').click();
    await page.locator('.detail-action-btn').filter({hasText:'場に出す'}).click();
    assert.equal(await page.evaluate(()=>MushiBattle.ui.state.pendingEffect.selectionPurpose),'SIMULTANEOUS_TRIGGER_ORDER');checks++;
    assert(await page.locator('#compact-actions').isVisible());checks++;
    await page.locator('#skill-select-row button').filter({hasText:'青頭'}).click();
    assert(await page.evaluate(()=>MushiBattle.ui.state.player(MushiBattle.ui.state.activePlayerId).field.some(c=>c.instanceId==='set5-flee-1')));checks++;
    await page.locator('#skill-select-row button').filter({hasText:/^青$/}).click();
    assert(await page.evaluate(()=>{const s=MushiBattle.ui.state,p=s.player(s.activePlayerId);return !s.pendingEffect&&p.field.length===1&&getEffectiveColor(p.field[0])==='BLUE'&&p.discard.some(c=>c.instanceId==='set5-flee-1');}));checks++;
    assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1));checks++;
    await page.evaluate(()=>{
      const u=MushiBattle.ui,s=u.state,pid=s.activePlayerId,p=s.player(pid),oppid=s.opponentOf(pid),op=s.player(oppid);
      const make=(id,owner,n,hp)=>new CardInstance({instanceId:'set5-growth-'+n,cardId:id,ownerId:owner,controllerId:owner,zone:'FIELD',faceDown:false,baseHp:getCardDefinition(id).baseHp,currentHp:hp||getCardDefinition(id).baseHp});
      s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;p.hand=[];p.field=[make('set5_029',pid,1)];op.field=[make('set1_003',oppid,2,10000)];op.territory=[];u.actionState={mode:'idle'};u.hideCardDetail();u.render();
    });
    await page.locator('#self-field-zone [data-instance-id="set5-growth-1"]').click();
    await page.locator('#opp-field-zone [data-instance-id="set5-growth-2"]').click();
    assert(await page.evaluate(()=>{const s=MushiBattle.ui.state,p=s.player(s.activePlayerId);return !s.pendingEffect&&p.field[0].currentHp===1700&&calculateMaxHp(p.field[0],s)===1700&&getEffectiveAP(s,p.field[0],1100,getCardDefinition(p.field[0].cardId).skills[0])===1400;}));checks++;
    assert.equal(await page.evaluate(()=>MushiBattle.ui.state.player(MushiBattle.ui.state.opponentOf(MushiBattle.ui.state.activePlayerId)).field[0].currentHp),8900);checks++;
    assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1));checks++;
    await page.evaluate(()=>{
      const u=MushiBattle.ui,s=u.state,pid=s.activePlayerId,p=s.player(pid),oppid=s.opponentOf(pid),op=s.player(oppid);
      const raw=JSON.parse(JSON.stringify(getCardDefinition('set5_032')));raw.id='test_set5_human_conceal';raw.set=null;raw.implementationStatus='test';const d=new CardDefinition(raw);Object.assign(d,raw);cardRegistry.register(d);
      const make=(id,owner,zone,n)=>new CardInstance({instanceId:'set5-conceal-'+n,cardId:id,ownerId:owner,controllerId:owner,zone,faceDown:false,baseHp:getCardDefinition(id).baseHp,currentHp:getCardDefinition(id).baseHp});
      s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;p.field=[];p.hand=[make(d.id,pid,'HAND',1)];p.food=[make('set1_003',pid,'FOOD',2)];p.food[0].runtimeFlags.colorOverride='BLUE';p.availableCost=20;op.field=[];op.food=[make('minminzemi',oppid,'FOOD',3)];op.territory=[];u.actionState={mode:'idle'};u.hideCardDetail();u.render();
    });
    await page.locator('#self-hand-zone [data-instance-id="set5-conceal-1"]').click();
    await page.locator('.detail-action-btn').filter({hasText:'場に出す'}).click();
    assert.deepEqual(await page.locator('#skill-select-row button').allTextContents(),['赤','青','緑','無色']);checks++;
    await page.locator('#skill-select-row button').filter({hasText:/^青$/}).click();
    assert(await page.evaluate(()=>{const s=MushiBattle.ui.state;return !s.pendingEffect&&s.playerOrder.every(pid=>s.player(pid).food[0].faceDown);}));checks++;
    assert.equal(await page.evaluate(()=>MushiBattle.ui.state.player(MushiBattle.ui.state.activePlayerId).availableCost),16);checks++;
    assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1));checks++;
    await page.evaluate(()=>{
      const u=MushiBattle.ui,s=u.state,pid=s.activePlayerId,p=s.player(pid),oppid=s.opponentOf(pid),op=s.player(oppid);
      const raw=JSON.parse(JSON.stringify(getCardDefinition('set5_060')));raw.id='test_set5_human_poison_reset';raw.set=null;raw.implementationStatus='test';const d=new CardDefinition(raw);Object.assign(d,raw);cardRegistry.register(d);
      const make=(id,zone,n)=>new CardInstance({instanceId:'set5-poison-'+n,cardId:id,ownerId:pid,controllerId:pid,zone,faceDown:false,baseHp:getCardDefinition(id).baseHp,currentHp:getCardDefinition(id).baseHp});
      s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;p.field=[make('set1_005','FIELD',2),make('set1_010','FIELD',3),make('set1_003','FIELD',4)];p.field.forEach(c=>c.attackedThisTurn=true);p.hand=[make(d.id,'HAND',1)];p.availableCost=5;op.field=[];op.territory=[];u.actionState={mode:'idle'};u.hideCardDetail();u.render();
    });
    await page.locator('#self-hand-zone [data-instance-id="set5-poison-1"]').click();
    await page.locator('.detail-action-btn').filter({hasText:'術を使う'}).click();
    assert.deepEqual(await page.evaluate(()=>MushiBattle.ui.state.pendingEffect.options),['set5-poison-2','set5-poison-3']);checks++;
    await page.locator('#self-field-zone [data-instance-id="set5-poison-3"]').click();
    assert(await page.evaluate(()=>{const s=MushiBattle.ui.state,p=s.player(s.activePlayerId);return !s.pendingEffect&&p.field[0].attackedThisTurn&&!p.field[1].attackedThisTurn&&p.field[2].attackedThisTurn&&p.availableCost===3;}));checks++;
    assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1));checks++;
    for(const number of [57,62]){
      await page.evaluate(number=>{
        document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());
        const u=MushiBattle.ui,s=u.state,pid=s.activePlayerId,p=s.player(pid),op=s.player(s.opponentOf(pid));
        const raw=JSON.parse(JSON.stringify(getCardDefinition('set5_0'+number)));raw.id='test_set5_human_discard_'+number;raw.set=null;raw.implementationStatus='test';const d=new CardDefinition(raw);Object.assign(d,raw);cardRegistry.register(d);
        const make=(id,zone,n)=>new CardInstance({instanceId:'set5-discard-'+n,cardId:id,ownerId:pid,controllerId:pid,zone,faceDown:false,baseHp:getCardDefinition(id).baseHp,currentHp:getCardDefinition(id).baseHp});
        s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;p.field=[];p.food=[];p.discard=[make(number===57?'set1_003':'set3_047','DISCARD',2),make('set4_053','DISCARD',3),make('set4_051','DISCARD',4)];p.hand=[make(d.id,'HAND',1)];p.availableCost=10;op.field=[];op.territory=[];u.actionState={mode:'idle'};u.hideCardDetail();u.render();
      },number);
      await page.locator('#self-hand-zone [data-instance-id="set5-discard-1"]').click();
      await page.locator('.detail-action-btn').filter({hasText:'術を使う'}).click();
      assert.deepEqual(await page.evaluate(()=>MushiBattle.ui.state.pendingEffect.options),number===57?['set5-discard-2','set5-discard-3','set5-discard-4']:['set5-discard-2','set5-discard-3']);checks++;
      for(const index of [0,1]){
        await page.locator('#self-discard-zone').locator('..').click();
        await page.locator('#inspector-body .inspector-card').nth(index).click();
      }
      if(number===62)await page.locator('#btn-end-turn').click();
      assert(await page.evaluate(number=>{const s=MushiBattle.ui.state,p=s.player(s.activePlayerId);return !s.pendingEffect&&(number===57?p.food.length===2&&p.food.every(c=>c.faceDown)&&p.availableCost===6:p.hand.length===2&&p.discard.some(c=>c.instanceId==='set5-discard-4')&&p.availableCost===10);},number));checks++;
      assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1));checks++;
    }
    await page.evaluate(()=>{
      const u=MushiBattle.ui,s=u.state,pid=s.activePlayerId,p=s.player(pid),op=s.player(s.opponentOf(pid));
      const raw=JSON.parse(JSON.stringify(getCardDefinition('set5_056')));raw.id='test_set5_human_matching_discount';raw.set=null;raw.implementationStatus='test';const d=new CardDefinition(raw);Object.assign(d,raw);cardRegistry.register(d);
      const make=(id,zone,n)=>new CardInstance({instanceId:'set5-discount-'+n,cardId:id,ownerId:pid,controllerId:pid,zone,faceDown:false,baseHp:getCardDefinition(id).baseHp,currentHp:getCardDefinition(id).baseHp});
      s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;p.nextUseCostModifiers=[];p.field=[];p.discard=[];p.food=[make('namiageha_larva','FOOD',3)];p.hand=[make(d.id,'HAND',1),make('namiageha','HAND',2)];p.availableCost=1;op.field=[];op.territory=[];u.actionState={mode:'idle'};u.hideCardDetail();u.render();
    });
    await page.locator('#self-hand-zone [data-instance-id="set5-discount-1"]').click();
    await page.locator('.detail-action-btn').filter({hasText:'術を使う'}).click();
    assert.equal(await page.evaluate(()=>getEffectiveCardCost(MushiBattle.ui.state,MushiBattle.ui.state.activePlayerId,getCardDefinition('namiageha'))),1);checks++;
    await page.locator('#self-hand-zone [data-instance-id="set5-discount-2"]').click();
    await page.locator('.detail-action-btn').filter({hasText:'場に出す'}).click();
    assert(await page.evaluate(()=>{const s=MushiBattle.ui.state,p=s.player(s.activePlayerId);return !s.pendingEffect&&p.field.some(c=>c.instanceId==='set5-discount-2')&&p.availableCost===0&&getEffectiveCardCost(s,s.activePlayerId,getCardDefinition('namiageha'))===4;}));checks++;
    assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1));checks++;
    await page.evaluate(()=>{
      const u=MushiBattle.ui,s=u.state,pid=s.activePlayerId,p=s.player(pid),oppid=s.opponentOf(pid),op=s.player(oppid);
      const make=(id,owner,zone,n,hp)=>new CardInstance({instanceId:'set5-route-'+n,cardId:id,ownerId:owner,controllerId:owner,zone,faceDown:zone==='TERRITORY'||zone==='FOOD',baseHp:getCardDefinition(id).baseHp,currentHp:hp||getCardDefinition(id).baseHp});
      s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;p.field=[make('set5_045',pid,'FIELD',1)];p.hand=[];p.food=[make('set1_003',pid,'FOOD',5)];op.field=[make('set1_003',oppid,'FIELD',2,100)];op.territory=[make('set5_040',oppid,'TERRITORY',3)];op.food=[];op.availableCost=2;u.actionState={mode:'idle'};u.hideCardDetail();u.render();
    });
    await page.locator('#self-field-zone [data-instance-id="set5-route-1"]').click();
    await page.locator('#opp-field-zone [data-instance-id="set5-route-2"]').click();
    await page.locator('#territory-picker-cards button').first().click();
    assert.equal(await page.evaluate(()=>MushiBattle.ui.state.pendingEffect.selectionPurpose),'TERRITORY_CARD_DESTINATION');checks++;
    await page.locator('#skill-select-row button').filter({hasText:'エサ場に置く'}).click();
    assert.equal(await page.evaluate(()=>MushiBattle.ui.state.pendingEffect.selectionPurpose),'REVEAL_OWN_FOOD');checks++;
    assert(await page.evaluate(()=>{const s=MushiBattle.ui.state,p=s.player(s.opponentOf(s.activePlayerId));return p.food.length===1&&!p.food[0].faceDown&&p.availableCost===2;}));checks++;
    await page.locator('#self-food-zone').locator('..').click();
    await page.locator('#inspector-body .inspector-card').click();
    await page.locator('#btn-end-turn').click();
    assert(await page.evaluate(()=>!MushiBattle.ui.state.pendingEffect));checks++;
    assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1));checks++;
    await page.evaluate(()=>{
      const u=MushiBattle.ui,s=u.state,pid=s.activePlayerId,p=s.player(pid),oppid=s.opponentOf(pid),op=s.player(oppid);
      const make=(id,owner,zone,n)=>new CardInstance({instanceId:'set5-armour-'+n,cardId:id,ownerId:owner,controllerId:owner,zone,faceDown:false,baseHp:getCardDefinition(id).baseHp,currentHp:getCardDefinition(id).baseHp});
      s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;p.field=[];p.hand=[make('jinkaichu_no_bakunetsudan',pid,'HAND',1)];p.availableCost=20;op.field=[make('set5_043',oppid,'FIELD',2),make('set1_003',oppid,'FIELD',3)];op.field[0].enteredFieldTurn=s.turnNumber-1;op.territory=[];u.actionState={mode:'idle'};u.hideCardDetail();u.render();
    });
    await page.locator('#self-hand-zone [data-instance-id="set5-armour-1"]').click();
    await page.locator('.detail-action-btn').filter({hasText:'術を使う'}).click();
    assert((await page.evaluate(()=>MushiBattle.ui.state.pendingEffect.options)).includes('set5-armour-2'));checks++;
    await page.locator('#opp-field-zone [data-instance-id="set5-armour-2"]').click();
    assert(await page.evaluate(()=>{const s=MushiBattle.ui.state,p=s.player(s.activePlayerId),op=s.player(s.opponentOf(s.activePlayerId));return !s.pendingEffect&&op.field[0].currentHp===1200&&p.discard.some(c=>c.instanceId==='set5-armour-1')&&p.availableCost===20-getCardDefinition('jinkaichu_no_bakunetsudan').cost;}));checks++;
    assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1));checks++;
    await page.evaluate(()=>{
      const u=MushiBattle.ui,s=u.state,pid=s.activePlayerId,p=s.player(pid),oppid=s.opponentOf(pid),op=s.player(oppid);
      const make=(id,owner,zone,n)=>new CardInstance({instanceId:'set5-emerge-'+n,cardId:id,ownerId:owner,controllerId:owner,zone,faceDown:false,baseHp:getCardDefinition(id).baseHp,currentHp:getCardDefinition(id).baseHp});
      s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;p.field=[make('set2_034',pid,'FIELD',2)];p.hand=[make('set4_057',pid,'HAND',1)];p.discard=[make('set5_044',pid,'DISCARD',3)];p.availableCost=20;op.field=[];op.territory=[];u.actionState={mode:'idle'};u.hideCardDetail();u.render();
    });
    await page.locator('#self-hand-zone [data-instance-id="set5-emerge-1"]').click();
    await page.locator('.detail-action-btn').filter({hasText:'術を使う'}).click();
    assert.equal(await page.evaluate(()=>MushiBattle.ui.state.pendingEffect.selectionPurpose),'EXCHANGE_MATCHING_FORM');checks++;
    await page.locator('#self-field-zone [data-instance-id="set5-emerge-2"]').click();
    await page.locator('#self-discard-zone').locator('..').click();
    await page.locator('#inspector-body .inspector-card').click();
    assert(await page.evaluate(()=>{const s=MushiBattle.ui.state,p=s.player(s.activePlayerId),adult=p.field[0];return !s.pendingEffect&&adult.instanceId==='set5-emerge-3'&&adult.currentHp===1500&&calculateMaxHp(adult,s)===1500&&getEffectiveAP(s,adult,1100)===1600;}));checks++;
    assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1));checks++;
    await page.evaluate(()=>{
      const u=MushiBattle.ui,s=u.state,pid=s.activePlayerId,p=s.player(pid),oppid=s.opponentOf(pid),op=s.player(oppid);
      const raw=JSON.parse(JSON.stringify(getCardDefinition('set5_046')));raw.id='test_set5_human_rope';raw.set=null;raw.implementationStatus='test';const d=new CardDefinition(raw);Object.assign(d,raw);cardRegistry.register(d);
      const make=(id,owner,zone,n)=>new CardInstance({instanceId:'set5-rope-'+n,cardId:id,ownerId:owner,controllerId:owner,zone,faceDown:false,baseHp:getCardDefinition(id).baseHp,currentHp:getCardDefinition(id).baseHp});
      s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;p.field=[make('namiageha',pid,'FIELD',2)];p.hand=[make(d.id,pid,'HAND',1)];p.availableCost=20;op.field=[];op.territory=[];u.actionState={mode:'idle'};u.hideCardDetail();u.render();
    });
    await page.locator('#self-hand-zone [data-instance-id="set5-rope-1"]').click();
    await page.locator('.detail-action-btn').filter({hasText:'強化する'}).click();
    await page.locator('#self-field-zone [data-instance-id="set5-rope-2"]').click();
    assert(await page.evaluate(()=>{const s=MushiBattle.ui.state,host=s.player(s.activePlayerId).field[0];return host.attachments.length===1&&calculateMaxHp(host,s)===getCardDefinition(host.cardId).baseHp+100;}));checks++;
    await page.evaluate(()=>{
      const u=MushiBattle.ui,s=u.state;s.activePlayerId=s.opponentOf(s.activePlayerId);const pid=s.activePlayerId,p=s.player(pid);
      const make=(id,n)=>new CardInstance({instanceId:'set5-rope-'+n,cardId:id,ownerId:pid,controllerId:pid,zone:'HAND',faceDown:false,baseHp:getCardDefinition(id).baseHp,currentHp:getCardDefinition(id).baseHp});
      s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;p.hand=[make('set1_125',3),make('namiageha',4)];p.availableCost=20;u.actionState={mode:'idle'};u.hideCardDetail();u.render();
    });
    await page.locator('#self-hand-zone [data-instance-id="set5-rope-3"]').click();
    await page.locator('.detail-action-btn').filter({hasText:'術を使う'}).click();
    assert(await page.evaluate(()=>{const s=MushiBattle.ui.state,entrant=s.player(s.activePlayerId).field[0];return !s.pendingEffect&&entrant.instanceId==='set5-rope-4'&&getLegalAttackTargets(s,entrant.instanceId,getCardDefinition(entrant.cardId).skills[0].id).length===0;}));checks++;
    assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1));checks++;
    await page.evaluate(()=>{
      const u=MushiBattle.ui,s=u.state,pid=s.activePlayerId,p=s.player(pid),op=s.player(s.opponentOf(pid));
      const raw=JSON.parse(JSON.stringify(getCardDefinition('set5_047')));raw.id='test_set5_human_mask';raw.set=null;raw.implementationStatus='test';const d=new CardDefinition(raw);Object.assign(d,raw);cardRegistry.register(d);
      const make=(id,zone,n)=>new CardInstance({instanceId:'set5-mask-'+n,cardId:id,ownerId:pid,controllerId:pid,zone,faceDown:false,baseHp:getCardDefinition(id).baseHp,currentHp:getCardDefinition(id).baseHp});
      s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;p.field=[make('set4_008','FIELD',2),make('set4_006','FIELD',3)];p.hand=[make(d.id,'HAND',1)];p.availableCost=20;op.field=[];op.territory=[];u.actionState={mode:'idle'};u.hideCardDetail();u.render();
    });
    assert.equal(await page.evaluate(()=>getEffectiveAttackSkills(MushiBattle.ui.state,MushiBattle.ui.state.player(MushiBattle.ui.state.activePlayerId).field[0]).length),2);checks++;
    await page.locator('#self-hand-zone [data-instance-id="set5-mask-1"]').click();
    await page.locator('.detail-action-btn').filter({hasText:'強化する'}).click();
    await page.locator('#self-field-zone [data-instance-id="set5-mask-2"]').click();
    assert(await page.evaluate(()=>{const s=MushiBattle.ui.state,host=s.player(s.activePlayerId).field[0];return !s.pendingEffect&&host.attachments.length===1&&areInsectKeywordSkillsSuppressed(s,host)&&getEffectiveAttackSkills(s,host).length===1&&calculateMaxHp(host,s)===getCardDefinition(host.cardId).baseHp+300;}));checks++;
    assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1));checks++;
    await page.evaluate(()=>{
      const u=MushiBattle.ui,s=u.state,pid=s.activePlayerId,p=s.player(pid),oppid=s.opponentOf(pid),op=s.player(oppid);
      const make=(id,owner,zone,n)=>new CardInstance({instanceId:'set5-nest-'+n,cardId:id,ownerId:owner,controllerId:owner,zone,faceDown:false,baseHp:getCardDefinition(id).baseHp,currentHp:getCardDefinition(id).baseHp});
      s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;p.field=[make('set5_013',pid,'FIELD',1)];p.discard=[];p.territory=[];p.field[0].attachments=[make('set3_047',pid,'FIELD',2)];op.field=[make('set1_003',oppid,'FIELD',3)];op.territory=[];u.actionState={mode:'idle'};u.hideCardDetail();
      destroyInsect(s,'set5-nest-1','ATTACK','set5-nest-3',{skill:getCardDefinition('set1_003').skills[0]},{skipTerritoryDraw:true});u.render();
    });
    assert.equal(await page.evaluate(()=>MushiBattle.ui.state.pendingEffect.selectionPurpose),'RETURN_DESTROYED_HOST_ATTACHMENT');checks++;
    await page.locator('#self-discard-zone').locator('..').click();
    await page.locator('#inspector-body .inspector-card').filter({hasText:'黄金虫'}).click();
    assert.deepEqual(await page.evaluate(()=>MushiBattle.ui.state.pendingEffect.selectedIds),['set5-nest-2']);checks++;
    await page.locator('#btn-end-turn').click();
    assert(await page.evaluate(()=>{const s=MushiBattle.ui.state,p=s.player(s.activePlayerId);return !s.pendingEffect&&p.hand.some(c=>c.instanceId==='set5-nest-2')&&p.discard.some(c=>c.instanceId==='set5-nest-1');}));checks++;
    await page.evaluate(()=>{
      const u=MushiBattle.ui,s=u.state,pid=s.activePlayerId,p=s.player(pid),op=s.player(s.opponentOf(pid));
      const d=getCardDefinition('set5_016');
      const make=(id,zone,n)=>new CardInstance({instanceId:'set5-paid-'+n,cardId:id,ownerId:pid,controllerId:pid,zone,faceDown:false,baseHp:getCardDefinition(id).baseHp,currentHp:getCardDefinition(id).baseHp});
      s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;p.field=[];p.hand=[make(d.id,'HAND',1)];p.discard=[make('set3_047','DISCARD',2)];p.food=[];p.availableCost=20;op.field=[];op.territory=[];u.actionState={mode:'idle'};u.hideCardDetail();u.render();
    });
    await page.locator('#self-hand-zone [data-instance-id="set5-paid-1"]').click();
    await page.locator('.detail-action-btn').filter({hasText:'場に出す'}).click();
    assert.equal(await page.evaluate(()=>MushiBattle.ui.state.pendingEffect.selectionPurpose),'ENTRY_ATTACH_ENHANCEMENT');checks++;
    await page.locator('#self-discard-zone').locator('..').click();
    await page.locator('#inspector-body .inspector-card').click();
    await page.locator('#btn-end-turn').click();
    assert(await page.evaluate(()=>{const s=MushiBattle.ui.state,p=s.player(s.activePlayerId);return !s.pendingEffect&&p.field[0].attachments.length===1&&p.field[0].currentHp===1200&&p.availableCost===15;}));checks++;
    for(const id of ['set5_004','set5_010','set5_020','set5_036']){
      await page.evaluate(id=>{
        const u=MushiBattle.ui,s=u.state,pid=s.activePlayerId,p=s.player(pid),op=s.player(s.opponentOf(pid)),d=getCardDefinition(id);
        s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;p.field=[];p.hand=[new CardInstance({instanceId:'set5-basic',cardId:id,ownerId:pid,controllerId:pid,zone:'HAND',faceDown:false,baseHp:d.baseHp,currentHp:d.baseHp})];p.food=[];p.availableCost=d.cost;op.field=[];op.territory=[];u.actionState={mode:'idle'};u.hideCardDetail();u.render();
      },id);
      await page.locator('#self-hand-zone [data-instance-id="set5-basic"]').click();
      await page.locator('.detail-action-btn').filter({hasText:'場に出す'}).click();
      assert(await page.evaluate(id=>{const s=MushiBattle.ui.state,p=s.player(s.activePlayerId);return !s.pendingEffect&&p.field.length===1&&p.field[0].cardId===id&&p.availableCost===0&&p.field[0].currentHp===getCardDefinition(id).baseHp;},id));checks++;
      await page.evaluate(id=>{const u=MushiBattle.ui,s=u.state,opid=s.opponentOf(s.activePlayerId),d=getCardDefinition(id);s.player(opid).field=[new CardInstance({instanceId:'set5-basic-target',cardId:id,ownerId:opid,controllerId:opid,zone:'FIELD',faceDown:false,baseHp:d.baseHp,currentHp:3000})];u.render();},id);
      await page.locator('#self-field-zone [data-instance-id="set5-basic"]').click();
      await page.locator('#opp-field-zone [data-instance-id="set5-basic-target"]').click();
      assert(await page.evaluate(id=>{const s=MushiBattle.ui.state,p=s.player(s.activePlayerId),op=s.player(s.opponentOf(s.activePlayerId));return !s.pendingEffect&&p.field[0].attackedThisTurn&&op.field[0].currentHp===3000-getCardDefinition(id).skills[0].baseAp;},id));checks++;

    }
    await page.evaluate(()=>{
      const u=MushiBattle.ui,s=u.state,pid=s.activePlayerId,p=s.player(pid),opid=s.opponentOf(pid),op=s.player(opid),d=getCardDefinition('set5_018');
      const make=(id,owner,zone,n)=>new CardInstance({instanceId:'set5-chain-'+n,cardId:id,ownerId:owner,controllerId:owner,zone,faceDown:false,baseHp:getCardDefinition(id).baseHp,currentHp:getCardDefinition(id).baseHp});
      s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;p.field=[make(d.id,pid,'FIELD',1)];p.hand=[];op.field=[];op.territory=[make('set1_003',opid,'TERRITORY',2)];op.food=[make('minminzemi',opid,'FOOD',3),make('minminzemi',opid,'FOOD',4)];u.actionState={mode:'idle'};u.hideCardDetail();u.render();
    });
    await page.locator('#self-field-zone [data-instance-id="set5-chain-1"]').click();
    await page.locator('#skill-select-row button').filter({hasText:'樹液吸収'}).click();
    await page.locator('#zone-top .zone-group--territory').click();
    await page.locator('#territory-picker [data-instance-id="set5-chain-2"]').click();
    await page.locator('#opp-food-zone').locator('..').click();await page.locator('#inspector-body .inspector-card').nth(0).click();await page.locator('#btn-end-turn').click();
    assert.equal(await page.evaluate(()=>MushiBattle.ui.state.pendingEffect.selectionPurpose),'FLIP_FOLLOWUP_FOOD');checks++;
    await page.locator('#opp-food-zone').locator('..').click();await page.locator('#inspector-body .inspector-card').nth(1).click();await page.locator('#btn-end-turn').click();
    assert(await page.evaluate(()=>{const s=MushiBattle.ui.state;return !s.pendingEffect&&s.player(s.opponentOf(s.activePlayerId)).food.every(c=>c.faceDown);}));checks++;
    await page.evaluate(()=>{
      const u=MushiBattle.ui,s=u.state,pid=s.activePlayerId,p=s.player(pid),opid=s.opponentOf(pid),op=s.player(opid),d=getCardDefinition('set5_018');
      p.field[0].attackedThisTurn=false;p.field.push(new CardInstance({instanceId:'set5-chain-ally',cardId:'minminzemi',ownerId:pid,controllerId:pid,zone:'FIELD',faceDown:false,currentHp:500,baseHp:500}));
      op.field=[new CardInstance({instanceId:'set5-chain-target',cardId:d.id,ownerId:opid,controllerId:opid,zone:'FIELD',faceDown:false,currentHp:5000,baseHp:5000})];op.territory=[];u.actionState={mode:'idle'};u.render();
    });
    await page.locator('#self-field-zone [data-instance-id="set5-chain-1"]').click();await page.locator('#skill-select-row button').filter({hasText:'合唱'}).click();await page.locator('#opp-field-zone [data-instance-id="set5-chain-target"]').click();
    assert(await page.evaluate(()=>{const s=MushiBattle.ui.state;return !s.pendingEffect&&s.player(s.opponentOf(s.activePlayerId)).field[0].currentHp===4100;}));checks++;
    assert.deepEqual(errors,[]);checks++;
    console.log('SET5 HUMAN EFFECT CHECKS PASSED: '+checks);
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
