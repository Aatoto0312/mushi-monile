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
module.exports=r;if(require.main===module)r.runAll().then(x=>{if(x.failed)process.exitCode=1;});
