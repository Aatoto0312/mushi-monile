'use strict';require('./engine-loader.js');const h=require('./helpers.js'),R=require('./lib.js'),r=new R();
for(const [id,damage] of [['set8_040',800],['set8_041',400],['set5_058',400],['set5_059',800]]){
for(const use of [true,false])r.test(id+' territory retaliation '+(use?'used':'declined'),()=>{const s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);const attacker=h.putInsectOnField(s,'P1','set2_001',{hp:9999});const card=h.addToTerritoryRaw(s,'P2',getCardDefinition(id));const initialHp=attacker.currentHp;triggerTerritoryDrawSelection(s,'P2',{attackSourceInstanceId:attacker.instanceId});resolveTerritoryDrawSelection(s,'P2',card.instanceId);r.assertEqual(s.pendingEffect.selectionPurpose,'TERRITORY_RETALIATION');resolveChoiceSelection(s,'P2',use?'USE':'DECLINE');r.assertEqual(card.zone,use?'DISCARD':'HAND');r.assertEqual(attacker.currentHp,initialHp-(use?damage:0));});
r.test(id+' non-attack territory draw does not trigger retaliation',()=>{const s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);const card=h.addToTerritoryRaw(s,'P2',getCardDefinition(id));triggerTerritoryDrawSelection(s,'P2',{});resolveTerritoryDrawSelection(s,'P2',card.instanceId);r.assertEqual(card.zone,'HAND');});
}
for(const id of ['set5_058','set5_059']) r.test(id+' interception counts as spell use before damage and costs nothing',()=>{
  let s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);
  const attacker=h.putInsectOnField(s,'P1','set5_037');
  const card=h.addToTerritoryRaw(s,'P2',getCardDefinition(id));
  s.player('P2').availableCost=0;
  triggerTerritoryDrawSelection(s,'P2',{attackSourceInstanceId:attacker.instanceId});
  resolveTerritoryDrawSelection(s,'P2',card.instanceId);
  s=Object.assign(new GameState(),JSON.parse(JSON.stringify(s)));
  require('../js/engine/cpu-agent');
  const cpu=new CpuAgent('P2',{rng:()=>0});
  r.assert(cpu.executeAction(s,cpu.getPendingAction(s)));
  r.assert(s.player('P1').discard.some(c=>c.instanceId===attacker.instanceId));
  r.assert(s.player('P2').discard.some(c=>c.instanceId===card.instanceId));
  r.assertEqual(s.player('P2').availableCost,0);
});
for(const [id,amount] of [['set5_058',400],['set5_059',800]]) r.test(id+' from hand spends printed cost and hits only the selected enemy',()=>{
  const s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);
  const target=h.putInsectOnField(s,'P2','kabutomushi',{hp:3000});
  const other=h.putInsectOnField(s,'P2','kabutomushi',{hp:3000});
  const spell=h.addToHandRaw(s,'P1',getCardDefinition(id));
  s.player('P1').availableCost=10;
  const hp=target.currentHp,otherHp=other.currentHp;
  useSpell(s,'P1',spell.instanceId,target.instanceId);
  r.assertEqual(target.currentHp,hp-amount);r.assertEqual(other.currentHp,otherHp);
  r.assertEqual(s.player('P1').availableCost,10-getCardDefinition(id).cost);
  r.assertEqual(spell.zone,'DISCARD');
});
for(const [source,eligible,ineligible] of [['set5_042','tonosamabatta','kabutomushi'],['set6_027','minminzemi','set5_028'],['set8_026','minminzemi','set5_028']]){
  for(const match of [true,false]) r.test(source+' family draw '+(match?'matches':'rejects unrelated family'),()=>{
    let s=h.newGame({rng:()=>0});h.toMainPhase(s);
    const attacker=h.putInsectOnField(s,'P1','kabutomushi');
    const host=h.putInsectOnField(s,'P2',source);
    h.putInsectOnField(s,'P2','minminzemi');
    const drawn=h.addToTerritoryRaw(s,'P2',getCardDefinition(match?eligible:ineligible));
    destroyInsect(s,host.instanceId,'ATTACK',attacker.instanceId,{});
    resolveTerritoryDrawSelection(s,'P2',drawn.instanceId);
    if(!match){r.assertEqual(drawn.zone,'HAND');return;}
    r.assertEqual(s.pendingEffect.selectionPurpose,'DESTRUCTION_DRAW_FAMILY');
    s=Object.assign(new GameState(),JSON.parse(JSON.stringify(s)));
    const cpu=new CpuAgent('P2',{rng:()=>0});r.assert(cpu.executeAction(s,cpu.getPendingAction(s)));
    r.assert(s.player('P2').field.some(c=>c.instanceId===drawn.instanceId));
  });
}
for(const id of ['set6_046','set8_027'])for(const use of [true,false])r.test(id+' optional territory effect '+use,()=>{
  let s=h.newGame({rng:()=>0});h.toMainPhase(s);
  const p='P2',attacker=h.putInsectOnField(s,'P1','kabutomushi');
  s.player(p).territory=[];
  const first=h.addToTerritoryRaw(s,p,getCardDefinition(id)),second=h.addToTerritoryRaw(s,p,getCardDefinition(id));
  triggerTerritoryDrawSelection(s,p,{attackSourceInstanceId:attacker.instanceId});
  resolveTerritoryDrawSelection(s,p,first.instanceId);
  s=Object.assign(new GameState(),JSON.parse(JSON.stringify(s)));
  if(use){const cpu=new CpuAgent(p,{rng:()=>0});r.assert(cpu.executeAction(s,cpu.getPendingAction(s)));}
  else resolveChoiceSelection(s,p,'DECLINE');
  const reveals=()=>s.battleEvents.filter(e=>e.type==='TERRITORY_CARD_REVEALED');
  if(!use){r.assertEqual(reveals().length,0);r.assertEqual(s.player(p).territory.length,1);r.assert(!s.pendingEffect);return;}
  if(id==='set8_027'){
    r.assertEqual(reveals().length,1);
    resolveTerritoryDrawSelection(s,p,second.instanceId);
    r.assertEqual(reveals().length,1);r.assert(!s.pendingEffect);
    r.assert(s.player(p).hand.some(c=>c.instanceId===second.instanceId));
  }else{
    r.assert(s.player(p).discard.some(c=>c.instanceId===first.instanceId));
    for(const choice of ['SKIP','DRAW']){
      triggerTerritoryDrawSelection(s,p);
      r.assertEqual(s.pendingEffect.selectionPurpose,'OPTIONAL_TERRITORY_DRAW');
      resolveChoiceSelection(s,p,choice);
      r.assertEqual(s.player(p).territory.length,1);
    }
    resolveTerritoryDrawSelection(s,p,second.instanceId);resolveChoiceSelection(s,p,'DECLINE');
    s.turnNumber++;h.addToTerritoryRaw(s,p,getCardDefinition(id));triggerTerritoryDrawSelection(s,p);
    r.assertEqual(s.pendingEffect.type,'TERRITORY_DRAW_SELECTION');
  }
});
r.test('Sapphire follows current host color and shares one prevention across attachments and damage sources',()=>{
  const s=h.newGame({rng:()=>0});h.toMainPhase(s);s.player('P1').availableCost=40;
  const host=h.putInsectOnField(s,'P1','kabutomushi',{hp:3000}),wrong=h.putInsectOnField(s,'P1','namitentou');
  const gem=()=>h.addToHandRaw(s,'P1',getCardDefinition('set5_051'));
  const first=gem();let rejected=false;try{useEnhancement(s,'P1',first.instanceId,wrong.instanceId);}catch{rejected=true;}
  r.assert(rejected);s.player('P1').hand=[first];
  const cpu=new CpuAgent('P1',{rng:()=>0}),action=cpu.decideMainPhaseAction(s);
  r.assertEqual(action.type,'USE_ENHANCEMENT');r.assertEqual(action.targetInstanceId,host.instanceId);r.assert(cpu.executeAction(s,action));
  const hit=(type)=>applyDamage(s,null,host,100,type,null,host.instanceId,{});
  const hp=host.currentHp;hit('SPELL');r.assertEqual(host.currentHp,hp);
  useEnhancement(s,'P1',gem().instanceId,host.instanceId);hit('ATTACK');r.assertEqual(host.currentHp,hp-100);
  s.turnNumber++;hit('ABILITY');r.assertEqual(host.currentHp,hp-100);hit('SPELL');r.assertEqual(host.currentHp,hp-200);
});
for(const outcome of ['paid','decline','moonlight','short'])r.test('Blood bargain '+outcome,()=>{
  let s=h.newGame({rng:()=>0});h.toMainPhase(s);const pid=s.activePlayerId,op=s.opponentOf(pid);
  s.player(pid).field=[];s.player(op).field=[];s.player(pid).availableCost=20;s.player(op).territory=[];
  const first=h.addToTerritoryRaw(s,op,getCardDefinition(outcome==='moonlight'?'set6_046':'kabutomushi'));
  const second=outcome==='short'?null:h.addToTerritoryRaw(s,op,getCardDefinition('namitentou'));
  const bug=h.addToHandRaw(s,pid,getCardDefinition('set6_005'));
  summonInsect(s,pid,bug.instanceId);
  if(outcome==='short'){r.assert(!s.pendingEffect);r.assertEqual(bug.zone,'FIELD');return;}
  r.assertEqual(s.pendingEffect.playerId,op);
  if(outcome==='decline'){resolveChoiceSelection(s,op,'DECLINE');r.assertEqual(bug.zone,'FIELD');return;}
  const cpu=new CpuAgent(op,{rng:()=>0});r.assert(cpu.executeAction(s,cpu.getPendingAction(s)));
  resolveTerritoryDrawSelection(s,op,first.instanceId);
  s=Object.assign(new GameState(),JSON.parse(JSON.stringify(s)));
  if(outcome==='moonlight'){
    resolveChoiceSelection(s,op,'USE');resolveChoiceSelection(s,op,'SKIP');
    r.assertEqual(s.player(op).territory.length,1);r.assert(s.player(pid).field.some(c=>c.instanceId===bug.instanceId));
  }else{
    resolveTerritoryDrawSelection(s,op,second.instanceId);
    r.assert(s.player(pid).discard.some(c=>c.instanceId===bug.instanceId));
  }
  r.assert(!s.pendingEffect);
});
for (const mode of ['use','decline','empty']) r.test('SET8-08 optional entry damage '+mode,()=>{
  let s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);
  const p=s.activePlayerId,op=s.opponentOf(p);
  s.player(op).field=[];s.player(p).availableCost=10;
  const hidden=h.putInsectOnField(s,op,'kabutomushi',{hp:400});hidden.faceDown=true;
  const enemy=mode==='empty'?null:h.putInsectOnField(s,op,'namitentou',{hp:100});
  const survivor=mode==='empty'?null:h.putInsectOnField(s,op,'kabutomushi',{hp:600});
  const territory=s.player(op).territory.length;
  const bug=h.addToHandRaw(s,p,getCardDefinition('set8_008'));summonInsect(s,p,bug.instanceId);
  if(mode==='empty'){r.assert(!s.pendingEffect);return;}
  s=Object.assign(new GameState(),JSON.parse(JSON.stringify(s)));
  if(mode==='use'){
    const cpu=new CpuAgent(p,{rng:()=>0});r.assert(cpu.executeAction(s,cpu.getPendingAction(s)));
  }else resolveChoiceSelection(s,p,'DECLINE');
  const field=s.player(op).field;
  r.assertEqual(field.some(x=>x.instanceId===enemy.instanceId),mode==='decline');
  r.assertEqual(field.find(x=>x.instanceId===survivor.instanceId).currentHp,mode==='use'?400:600);
  r.assertEqual(field.find(x=>x.instanceId===hidden.instanceId).currentHp,400);
  r.assertEqual(s.player(p).field.find(x=>x.instanceId===bug.instanceId).currentHp,getCardDefinition('set8_008').baseHp);
  r.assertEqual(s.player(op).territory.length,territory);r.assert(!s.pendingEffect);
});
r.test('SET7-45 repeated intrinsic growth excludes external bonuses and clears on leaving play',()=>{
  let s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);s.turnNumber=3;
  let host=h.putInsectOnField(s,'P1','set7_045'),enemy=h.putInsectOnField(s,'P2','kabutomushi',{hp:8000});
  const skill=getCardDefinition('set7_045').skills[0],ref=host.instanceId;
  for(const stat of ['HP','AP'])addStatModifier(s,host,{stat,amount:50,duration:'FIELD_STAY'});
  for(const expected of [200,400,800]){
    host.attackedThisTurn=false;
    s.player('P1').hand=[];
    const cpu=new CpuAgent('P1',{rng:()=>0}),action=cpu.decideMainPhaseAction(s);
    r.assertEqual(action.skillId,skill.id);r.assert(cpu.executeAction(s,action));
    s=Object.assign(new GameState(),JSON.parse(JSON.stringify(s)));host=s.player('P1').field.find(c=>c.instanceId===ref);
    r.assertEqual(host.currentHp,expected+50);r.assertEqual(getEffectiveAP(s,host,100,skill),expected+50);
    r.assertEqual(getEffectiveAP(s,host,100,{id:'other'}),150);
  }
  moveCard(s,ref,'FIELD','HAND',{playerId:'P1'});r.assertEqual(getEffectiveAP(s,host,100,skill),100);
});
for (const mode of ['exchange','decline','empty','hidden placement']) r.test('SET7-48 '+mode,()=>{
  let s=h.newGame({rng:h.firstPlayerRng});s.phase=Phases.SET_PHASE;const p=s.activePlayerId,player=s.player(p);
  player.discard=[];player.food=[];player.availableCost=0;
  const beetle=h.addToHandRaw(s,p,getCardDefinition('set7_048'));
  function discard(id,hidden){const c=h.addToHandRaw(s,p,getCardDefinition(id));moveCard(s,c.instanceId,'HAND','DISCARD',{playerId:p,faceDown:hidden});return c.instanceId;}
  const hidden=discard('kabutomushi',true),spell=discard('set6_057',false);
  const visible=mode==='empty'?null:discard('namitentou',false);
  if(mode==='hidden placement'){moveCard(s,beetle.instanceId,'HAND','FOOD',{playerId:p,faceDown:true});r.assert(!s.pendingEffect);return;}
  setFood(s,p,beetle.instanceId);
  if(mode==='empty'){r.assert(!s.pendingEffect);return;}
  r.assertEqual(s.pendingEffect.options.join(','),visible);
  s=Object.assign(new GameState(),JSON.parse(JSON.stringify(s)));
  if(mode==='decline')resolveCardSelection(s,p,[],true);
  else {const cpu=new CpuAgent(p,{rng:()=>0});r.assert(cpu.executeAction(s,cpu.getPendingAction(s)));}
  const after=s.player(p);r.assertEqual(after.food.length,1);r.assertEqual(after.food[0].instanceId,mode==='exchange'?visible:beetle.instanceId);
  r.assert(after.discard.some(c=>c.instanceId===hidden&&c.faceDown));r.assert(after.discard.some(c=>c.instanceId===spell));
  r.assertEqual(after.availableCost,0);r.assertEqual(gainCost(s,p),1);
});
for(const mode of ['return','capture','decline','spell','empty']) r.test('SET6-10 destruction before territory draw '+mode,()=>{
  let s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);
  const bug=h.putInsectOnField(s,'P2','set6_010'),attacker=h.putInsectOnField(s,'P1',mode==='capture'?'set2_001':'kabutomushi');
  s.player('P2').hand=[];const paid=mode==='empty'?null:h.addToHandRaw(s,'P2',getCardDefinition('namitentou'));
  const n=s.player('P2').territory.length;
  const skill=mode==='capture'?{effects:[{type:'CAPTURE_ATTACK_DESTROYED_TARGET'}]}:null;
  destroyInsect(s,bug.instanceId,mode==='spell'?'SPELL':'ATTACK',attacker.instanceId,{skill});
  if(mode==='spell'){r.assert(!s.pendingEffect);r.assertEqual(bug.zone,'DISCARD');return;}
  if(mode==='empty'){r.assertEqual(s.pendingEffect.type,'TERRITORY_DRAW_SELECTION');return;}
  r.assertEqual(s.pendingEffect.options.join(','),paid.instanceId);
  s=Object.assign(new GameState(),JSON.parse(JSON.stringify(s)));
  if(mode==='decline')resolveCardSelection(s,'P2',[],true);
  else {const cpu=new CpuAgent('P2',{rng:()=>0});r.assert(cpu.executeAction(s,cpu.getPendingAction(s)));}
  r.assertEqual(findAnywhere(s,bug.instanceId).zone,mode==='capture'?'FIELD':mode==='decline'?'DISCARD':'HAND');
  r.assertEqual(findAnywhere(s,paid.instanceId).zone,mode==='decline'?'HAND':'DISCARD');
  r.assertEqual(s.player('P2').territory.length,n);r.assertEqual(s.pendingEffect.type,'TERRITORY_DRAW_SELECTION');
});
for(const mode of ['hand','food','territory','five','suppressed','effect draw']) r.test('SET8-32 '+mode,()=>{
  let s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);
  const larva=h.putInsectOnField(s,'P1','set8_032');s.player('P1').food=[];
  for(let i=0;i<(mode==='five'?5:6);i++){
    const food=h.addToHandRaw(s,'P1',getCardDefinition('kabutomushi'));moveCard(s,food.instanceId,'HAND','FOOD',{playerId:'P1',faceDown:i%2===0});
  }
  const enemy=s.player('P2');enemy.territory=[];enemy.hand=[];enemy.food=[];
  const meal=h.addToTerritoryRaw(s,'P2',getCardDefinition('set6_046'));
  const drawn=h.addToTerritoryRaw(s,'P2',getCardDefinition('namitentou'));
  const fodder=h.addToHandRaw(s,'P2',getCardDefinition('kabutomushi'));moveCard(s,fodder.instanceId,'HAND','FOOD',{playerId:'P2',faceDown:true});
  if(mode==='suppressed')s.player('P1').keywordSuppressionUntilTurn=s.turnNumber;
  triggerTerritoryDrawSelection(s,'P2',mode==='effect draw'?{}:{attackSourceInstanceId:larva.instanceId});
  resolveTerritoryDrawSelection(s,'P2',drawn.instanceId);
  if(['five','suppressed','effect draw'].includes(mode)){r.assert(!s.pendingEffect);return;}
  r.assertEqual(s.pendingEffect.playerId,'P2');r.assertEqual(s.pendingEffect.options.length,3);
  s=Object.assign(new GameState(),JSON.parse(JSON.stringify(s)));
  const selected={food:fodder,territory:meal,hand:drawn}[mode];
  s.player('P2').optionalTerritoryDrawTurn=s.turnNumber;
  if(mode==='hand'){const cpu=new CpuAgent('P2',{rng:()=>0});r.assert(cpu.executeAction(s,cpu.getPendingAction(s)));}
  else resolveCardSelection(s,'P2',[selected.instanceId],true);
  r.assertEqual(findAnywhere(s,selected.instanceId).zone,'DISCARD');r.assert(!s.pendingEffect);
});
module.exports=r;if(require.main===module)r.runAll().then(x=>{if(x.failed)process.exitCode=1;});
