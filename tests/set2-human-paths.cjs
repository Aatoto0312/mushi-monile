// Incremental wiring tests. Test copies bypass the release-status gate only;
// production definitions stay PARTIAL until all required paths are verified.
const {chromium,webkit}=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await (process.env.MUSHI_BROWSER==='webkit'?webkit.launch():chromium.launch({channel:'msedge'}));
 const page=await browser.newPage({viewport:{width:390,height:560},isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());let checks=0;
 const ok=(v,m)=>{assert(v,m);checks++;console.log('PASS '+m);};
 try{
  await page.goto(process.env.MUSHI_URL||'http://127.0.0.1:8766',{waitUntil:'domcontentloaded'});
  await page.locator('#btn-vs-human').click();await page.locator('#btn-deck-p1-kabuto').click();await page.locator('#btn-deck-p2-okama').click();
  if(await page.locator('#pass-overlay').isVisible())await page.locator('#btn-pass-ok').click();
  for(const size of [{width:390,height:560},{width:844,height:300}]){
   await page.setViewportSize(size);
   await page.evaluate(()=>{
    const u=MushiBattle.ui,s=u.state,id=s.activePlayerId,p=s.player(id);
    const raw=JSON.parse(JSON.stringify(getCardDefinition('set2_001')));raw.id='test_human_set2_001';raw.set=null;raw.implementationStatus='test';
    if(!cardRegistry.has(raw.id))cardRegistry.register(new CardDefinition(raw));
    p.field=[];p.hand=[new CardInstance({instanceId:'entry-color-human',cardId:raw.id,ownerId:id,controllerId:id,zone:'HAND',faceDown:false,currentHp:raw.baseHp,baseHp:raw.baseHp})];
    p.availableCost=10;s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;u.actionState={mode:'idle'};u.render();
   });
   await page.locator('#self-hand-zone .battle-card').click();
   await page.locator('.detail-action-btn').filter({hasText:'場に出す'}).click();
   ok(await page.evaluate(()=>MushiBattle.ui.state.pendingEffect?.type==='CHOICE_SELECTION'),'Summon opens entry color choice');
   await page.locator('#skill-select-row button').filter({hasText:/^青$/}).click({timeout:5000});
   ok(await page.evaluate(()=>{const s=MushiBattle.ui.state;return !s.pendingEffect&&s.player(s.activePlayerId).field[0].runtimeFlags.colorOverride==='BLUE';}),'Human color button resolves entry effect');
   ok(await page.locator('#skill-select-row').isHidden(),'Resolved choice buttons close');
   await page.evaluate(()=>{
    const u=MushiBattle.ui,s=u.state,id=s.activePlayerId,p=s.player(id);
    const raw=JSON.parse(JSON.stringify(getCardDefinition('set2_019')));raw.id='test_human_set2_019';raw.set=null;raw.implementationStatus='test';
    if(!cardRegistry.has(raw.id))cardRegistry.register(new CardDefinition(raw));
    const make=(cardId,zone,i)=>new CardInstance({instanceId:'revival-human-'+i,cardId,ownerId:id,controllerId:id,zone,faceDown:false,currentHp:1000,baseHp:1000});
    p.field=[];p.hand=[make(raw.id,'HAND',1)];p.discard=[make('set1_052','DISCARD',2)];p.availableCost=10;
    s.pendingEffect=null;u.actionState={mode:'idle'};u.render();
   });
   await page.locator('#self-hand-zone .battle-card').click();
   await page.locator('.detail-action-btn').filter({hasText:'場に出す'}).click();
   await page.locator('#zone-bottom .zone-group--discard').click();
   await page.locator('#inspector-body .inspector-card.legal-target').click({timeout:5000});
   await page.locator('#btn-end-turn').click();
   ok(await page.evaluate(()=>{const s=MushiBattle.ui.state;return !s.pendingEffect&&s.player(s.activePlayerId).field.length===2;}),'Human discard drawer selection revives cicada');
   await page.evaluate(()=>{
    const u=MushiBattle.ui,s=u.state,id=s.activePlayerId,p=s.player(id);
    const raw=JSON.parse(JSON.stringify(getCardDefinition('set2_051')));raw.id='test_human_set2_051';raw.set=null;raw.implementationStatus='test';
    if(!cardRegistry.has(raw.id))cardRegistry.register(new CardDefinition(raw));
    const make=(cardId,zone,i)=>new CardInstance({instanceId:'hatch-human-'+i,cardId,ownerId:id,controllerId:id,zone,faceDown:false,currentHp:1000,baseHp:1000});
    p.field=[make('namiageha_larva','FIELD',1)];p.hand=[make(raw.id,'HAND',2),make('namiageha','HAND',3)];p.food=[];p.availableCost=0;
    s.pendingEffect=null;u.actionState={mode:'idle'};u.render();
   });
   await page.locator('#self-hand-zone [data-instance-id="hatch-human-2"]').click();
   await page.locator('.detail-action-btn').filter({hasText:'術を使う'}).click();
   await page.locator('#self-field-zone [data-instance-id="hatch-human-1"]').click();
   await page.locator('#self-hand-zone [data-instance-id="hatch-human-3"]').click();
   ok(await page.evaluate(()=>{const s=MushiBattle.ui.state,p=s.player(s.activePlayerId);return !s.pendingEffect&&p.field.length===1&&p.field[0].cardId==='namiageha'&&p.availableCost===0;}),'Human field and hand selections resolve matching metamorphosis');
   await page.evaluate(()=>{
    const u=MushiBattle.ui,s=u.state,id=s.activePlayerId,p=s.player(id),opp=s.opponentOf(id);
    const raw=JSON.parse(JSON.stringify(getCardDefinition('set2_002')));raw.id='test_human_set2_002';raw.set=null;raw.implementationStatus='test';
    if(!cardRegistry.has(raw.id))cardRegistry.register(new CardDefinition(raw));
    const make=(cardId,owner,i)=>new CardInstance({instanceId:'mimic-human-'+i,cardId,ownerId:owner,controllerId:owner,zone:'FIELD',faceDown:false,currentHp:2000,baseHp:2000});
    p.field=[make(raw.id,id,1),make('minminzemi',id,2)];p.hand=[];s.player(opp).field=[make('set1_003',opp,3)];
    s.turnNumber=3;s.pendingEffect=null;u.actionState={mode:'idle'};u.render();
   });
   await page.locator('#self-field-zone [data-instance-id="mimic-human-1"]').click();
   await page.locator('#skill-select-row button').filter({hasText:'擬態攻撃'}).click();
   await page.locator('#opp-field-zone .battle-card').click();
   ok(await page.evaluate(()=>MushiBattle.ui.state.pendingEffect?.selectionPurpose==='COPY_ALLY_COLOR'),'Mimic attack asks for ally before damage');
   await page.locator('#self-field-zone [data-instance-id="mimic-human-2"]').click();
   ok(await page.evaluate(()=>{const s=MushiBattle.ui.state;return !s.pendingEffect&&s.player(s.activePlayerId).field[0].runtimeFlags.colorOverride==='BLUE'&&s.player(s.opponentOf(s.activePlayerId)).field[0].currentHp===1000;}),'Human ally selection changes attack color before damage');
   await page.evaluate(()=>{
    const u=MushiBattle.ui,s=u.state,id=s.activePlayerId,p=s.player(id);
    const raw=JSON.parse(JSON.stringify(getCardDefinition('set2_050')));raw.id='test_human_set2_050';raw.set=null;raw.implementationStatus='test';
    if(!cardRegistry.has(raw.id))cardRegistry.register(new CardDefinition(raw));
    const make=(cardId,i)=>new CardInstance({instanceId:'summon-attach-human-'+i,cardId,ownerId:id,controllerId:id,zone:'HAND',faceDown:false});
    p.field=[];p.hand=[make(raw.id,1),make('set1_001',2)];p.availableCost=4;s.pendingEffect=null;u.actionState={mode:'idle'};u.render();
   });
   await page.locator('#self-hand-zone [data-instance-id="summon-attach-human-1"]').click();
   await page.locator('.detail-action-btn').filter({hasText:'強化する'}).click();
   await page.locator('#self-hand-zone [data-instance-id="summon-attach-human-2"]').click();
   ok(await page.evaluate(()=>{const s=MushiBattle.ui.state,p=s.player(s.activePlayerId);return !s.pendingEffect&&p.field.length===1&&p.field[0].attachments.length===1&&p.availableCost===0&&getLegalAttackTargets(s,p.field[0].instanceId).length===0;}),'Human enhancement action summons hand insect with attack restriction');
   await page.evaluate(()=>{
    const u=MushiBattle.ui,s=u.state,id=s.activePlayerId,p=s.player(id),opp=s.opponentOf(id);
    const raw=JSON.parse(JSON.stringify(getCardDefinition('set2_007')));raw.id='test_human_set2_007';raw.set=null;raw.implementationStatus='test';
    if(!cardRegistry.has(raw.id))cardRegistry.register(new CardDefinition(raw));
    const make=(cardId,owner,zone,i)=>new CardInstance({instanceId:'capture-human-'+i,cardId,ownerId:owner,controllerId:owner,zone,faceDown:false,currentHp:100,baseHp:100});
    p.field=[make(raw.id,id,'FIELD',1)];p.hand=[];s.player(opp).field=[make('test_human_set2_001',opp,'FIELD',2)];s.player(opp).territory=[make('set1_003',opp,'TERRITORY',3)];
    s.pendingEffect=null;u.actionState={mode:'idle'};u.render();
   });
   await page.locator('#self-field-zone .battle-card').click();
   await page.locator('#skill-select-row button').filter({hasText:'操り針'}).click();
   await page.locator('#opp-field-zone .battle-card').click();
   ok(await page.evaluate(()=>MushiBattle.ui.state.pendingEffect?.type==='CHOICE_SELECTION'),'Capture offers entering insect choice before territory');
   await page.locator('#skill-select-row button').filter({hasText:/^緑$/}).click();
   await page.locator('#territory-picker-cards button').first().click();
   ok(await page.evaluate(()=>{const s=MushiBattle.ui.state,p=s.player(s.activePlayerId);return !s.pendingEffect&&p.field.length===2&&p.field[1].ownerId!==s.activePlayerId&&p.field[1].runtimeFlags.colorOverride==='GREEN';}),'Human capture entry and defending territory choice complete');
   await page.evaluate(()=>{
    const u=MushiBattle.ui,s=u.state,id=s.activePlayerId,p=s.player(id);
    const raw=JSON.parse(JSON.stringify(getCardDefinition('set2_054')));
    raw.id='test_human_set2_054';raw.set=null;raw.implementationStatus='test';
    if(!cardRegistry.has(raw.id))cardRegistry.register(new CardDefinition(raw));
    const make=(cardId,zone,i)=>new CardInstance({instanceId:'set2-human-'+i,cardId,ownerId:id,controllerId:id,zone,faceDown:false,currentHp:1000,baseHp:1000});
    p.field=[make('set1_003','FIELD',1),make('set1_003','FIELD',2)];
    p.hand=[make(raw.id,'HAND',3)];p.availableCost=10;s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;
    u.actionState={mode:'idle'};u.render();
   });
   await page.locator('#self-hand-zone .battle-card').click();
   await page.locator('.detail-action-btn').filter({hasText:'術を使う'}).click();
   ok(await page.evaluate(()=>MushiBattle.ui.state.pendingEffect?.type==='SPELL_TARGET_SELECTION'),'Card tap/action enters spell target selection');
   ok(!(await page.locator('#status-text').textContent()).includes('相手の虫'),'Own-target spell does not instruct choosing an opponent');
   await page.locator('#self-field-zone [data-instance-id="set2-human-1"]').click();
   ok(await page.evaluate(()=>{const s=MushiBattle.ui.state,p=s.player(s.activePlayerId);return !s.pendingEffect&&getEffectiveAP(s,p.field[0],100)===600&&getEffectiveAP(s,p.field[1],100)===100;}),'Own field tap resolves selected AP boost');
   ok(await page.locator('.battle-viewport').evaluate(n=>n.scrollHeight<=n.clientHeight+1),'Board has no vertical overflow');
   ok(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1),'Body has no vertical overflow');
   await page.evaluate(()=>{
    const u=MushiBattle.ui,s=u.state,id=s.activePlayerId,p=s.player(id),opp=s.opponentOf(id);
    const raw=JSON.parse(JSON.stringify(getCardDefinition('set2_021')));raw.id='test_human_set2_021';raw.set=null;raw.implementationStatus='test';
    if(!cardRegistry.has(raw.id))cardRegistry.register(new CardDefinition(raw));
    const make=(cardId,owner,i)=>new CardInstance({instanceId:'multi-human-'+i,cardId,ownerId:owner,controllerId:owner,zone:'FIELD',faceDown:false,currentHp:1000,baseHp:1000});
    p.field=[make(raw.id,id,1)];p.hand=[];s.player(opp).field=[make('set1_003',opp,2),make('set1_003',opp,3)];
    s.turnNumber=3;s.phase=Phases.MAIN_PHASE;s.pendingEffect=null;u.actionState={mode:'idle'};u.render();
   });
   await page.locator('#self-field-zone .battle-card').click();
   await page.locator('#skill-select-row button').filter({hasText:'フタマタバサミ'}).click();
   ok(await page.evaluate(()=>MushiBattle.ui.state.pendingEffect?.selectionPurpose==='ATTACK_MULTI'),'Multi-target skill opens shared card selection');
   await page.locator('#opp-field-zone [data-instance-id="multi-human-2"]').click();
   await page.locator('#opp-field-zone [data-instance-id="multi-human-3"]').click();
   ok(await page.evaluate(()=>{const s=MushiBattle.ui.state,p=s.player(s.opponentOf(s.activePlayerId));return !s.pendingEffect&&p.field.every(c=>c.currentHp===800); }),'Both opponent taps resolve ordered attacks');
   await page.evaluate(()=>{
    const u=MushiBattle.ui,s=u.state,id=s.activePlayerId,p=s.player(id),opp=s.opponentOf(id);
    for(const n of ['009','052']){const raw=JSON.parse(JSON.stringify(getCardDefinition('set2_'+n)));raw.id='test_human_set2_'+n;raw.set=null;raw.implementationStatus='test';if(!cardRegistry.has(raw.id))cardRegistry.register(new CardDefinition(raw));}
    const make=(cardId,owner,zone,i)=>new CardInstance({instanceId:'hide-human-'+i,cardId,ownerId:owner,controllerId:owner,zone,faceDown:false,currentHp:1000,baseHp:1000});
    p.field=[make('test_human_set2_009',id,'FIELD',1)];p.hand=[make('test_human_set2_052',id,'HAND',2)];p.availableCost=10;
    s.player(opp).field=[make('set1_003',opp,'FIELD',3)];s.player(opp).territory=[];s.pendingEffect=null;u.actionState={mode:'idle'};u.render();
   });
   await page.locator('#self-hand-zone .battle-card').click();
   await page.locator('.detail-action-btn').filter({hasText:'術を使う'}).click();
   ok(await page.evaluate(()=>{const s=MushiBattle.ui.state;return !s.pendingEffect&&s.player(s.opponentOf(s.activePlayerId)).territoryTriggerSuppressionUntilTurn===s.turnNumber;}),'Targetless smoke resolves through Human card action');
   await page.locator('#self-field-zone .battle-card').click();
   await page.locator('#skill-select-row button').filter({hasText:'かくれる'}).click();
   await page.locator('#opp-field-zone .battle-card').click();
   ok(await page.evaluate(()=>{const s=MushiBattle.ui.state;return !s.pendingEffect&&s.player(s.activePlayerId).field[0].faceDown;}),'Human hiding skill resolves and returns to Battle');
   await page.evaluate(()=>{
    const u=MushiBattle.ui,s=u.state,id=s.activePlayerId,p=s.player(id),opp=s.opponentOf(id);
    const raw=JSON.parse(JSON.stringify(getCardDefinition('set2_040')));raw.id='test_human_set2_040';raw.set=null;raw.implementationStatus='test';if(!cardRegistry.has(raw.id))cardRegistry.register(new CardDefinition(raw));
    const make=(cardId,owner,zone,i)=>new CardInstance({instanceId:'food-human-'+i,cardId,ownerId:owner,controllerId:owner,zone,faceDown:false,currentHp:100,baseHp:100});
    p.field=[make(raw.id,id,'FIELD',1)];p.hand=[];s.player(opp).field=[make('set1_003',opp,'FIELD',2)];s.player(opp).territory=[make('set1_003',opp,'TERRITORY',3)];s.player(opp).food=[make('set1_003',opp,'FOOD',4)];s.pendingEffect=null;u.actionState={mode:'idle'};u.render();
   });
   await page.locator('#self-field-zone .battle-card').click();await page.locator('#opp-field-zone .battle-card').click();
   await page.locator('#territory-picker-cards button').first().click();
   ok(await page.evaluate(()=>MushiBattle.ui.state.pendingEffect?.selectionPurpose==='FLIP_OPPONENT_FOOD'),'Territory resolution opens optional food choice');
   await page.locator('#zone-top .zone-group--food').click();
   await page.locator('#inspector-body .inspector-card.legal-target').click();
   await page.locator('#btn-end-turn').click();
   ok(await page.evaluate(()=>{const s=MushiBattle.ui.state;return !s.pendingEffect&&s.player(s.opponentOf(s.activePlayerId)).food[0].faceDown;}),'Food drawer selection and confirmation resolve effect');
   await page.locator('#zone-top .zone-group--food').click();
   ok((await page.locator('#inspector-body').textContent()).includes('裏向きのエサ')&&await page.locator('#inspector-body .inspector-card img').count()===0,'Hidden food drawer reveals no card identity');
   await page.locator('#inspector-close').click();
   await page.evaluate(()=>{
    const u=MushiBattle.ui,s=u.state,id=s.activePlayerId,opp=s.opponentOf(id);
    const raw=JSON.parse(JSON.stringify(getCardDefinition('set2_011')));raw.id='test_human_set2_011';raw.set=null;raw.implementationStatus='test';if(!cardRegistry.has(raw.id))cardRegistry.register(new CardDefinition(raw));
    const make=(cardId,owner,i)=>new CardInstance({instanceId:'blind-human-'+i,cardId,ownerId:owner,controllerId:owner,zone:'FIELD',faceDown:false,currentHp:1400,baseHp:1400});
    s.player(id).field=[make(raw.id,id,1)];s.player(opp).field=[make('set1_003',opp,2),make('set1_003',opp,3)];s.player(opp).territory=[];s.pendingEffect=null;u.actionState={mode:'idle'};u.render();
   });
   await page.locator('#self-field-zone .battle-card').click();
   ok(await page.evaluate(()=>{const s=MushiBattle.ui.state;return s.pendingEffect?.selectionPurpose==='OPPONENT_ATTACK_TARGET'&&s.pendingEffect.playerId===s.opponentOf(s.activePlayerId); }),'Blind attack gives target choice to defending player');
   ok((await page.locator('#status-text').textContent()).includes('攻撃を受ける側'),'Hotseat identifies defending human instead of CPU');
   await page.locator('#opp-field-zone [data-instance-id="blind-human-3"]').click();
   ok(await page.evaluate(()=>{const s=MushiBattle.ui.state,p=s.player(s.opponentOf(s.activePlayerId));return !s.pendingEffect&&p.field[0].currentHp===1400&&p.field[1].currentHp===900;}),'Defender card tap resolves blind attack');
  }
  ok(errors.length===0,'No JavaScript errors: '+errors.join(';'));
  console.log('SET2 HUMAN PATH CHECKS PASSED: '+checks);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
