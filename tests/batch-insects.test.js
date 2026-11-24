'use strict';
require('./engine-loader');
try { require('../js/cards/batch-insect-cards'); } catch(e) { if(e.code!=='MODULE_NOT_FOUND')throw e; }
const R=require('./lib'),r=new R(),h=require('./helpers');
require('../js/engine/cpu-agent');
function state(){const s=h.newGame({rng:()=>0});h.toMainPhase(s);s.turnNumber=3;for(const p of s.playerOrder)for(const z of ['field','hand','food','discard','territory'])s.player(p)[z]=[];s.player('P1').availableCost=20;return s;}
function put(s,id,z='FIELD',p='P1'){const d=getCardDefinition(id);r.assert(d,id);const c=h.addToHandRaw(s,p,d);if(z!=='HAND'){s.player(p).hand.pop();c.zone=z;s.player(p)[z.toLowerCase()].push(c);}return c;}
r.test('UR centipede has ordinary bite and next-damage mark, not first-edition poison',()=>{const d=getCardDefinition('set7_004');r.assert(d&&d.isPlayable());r.assertEqual(d.skills[0].effects.length,0);const s=state(),a=put(s,d.id),b=put(s,'set6_016','FIELD','P2');b.currentHp=2000;performAttack(s,a.instanceId,b.instanceId,'INSECT',d.skills[1].id);r.assert(b.runtimeFlags.destroyOnNextDamage);r.assertEqual(b.currentHp,2000);a.attackedThisTurn=false;performAttack(s,a.instanceId,b.instanceId,'INSECT',d.skills[0].id);r.assertEqual(b.zone,'DISCARD');});
r.test('Devil summon selects only attached own visible insect and pays no cost',()=>{const s=state(),a=put(s,'set8_003','HAND'),b=put(s,'set6_016'),c=put(s,'set6_016');b.attachments=[{instanceId:'fake',cardId:'set7_054'}];summonInsect(s,'P1',a.instanceId,{alternative:true});r.assertEqual(s.pendingEffect.options.join(','),b.instanceId);resolveCardSelection(s,'P1',[b.instanceId],true);r.assertEqual(b.zone,'DISCARD');r.assertEqual(a.zone,'FIELD');r.assertEqual(s.player('P1').availableCost,20);});
r.test('Devil summon revalidates attachment before committing payment',()=>{const s=state(),a=put(s,'set8_003','HAND'),b=put(s,'set6_016');b.attachments=[{instanceId:'fake',cardId:'set7_054'}];summonInsect(s,'P1',a.instanceId,{alternative:true});b.attachments=[];let failed=false;try{resolveCardSelection(s,'P1',[b.instanceId],true);}catch(e){failed=true;}r.assert(failed);r.assertEqual(a.zone,'HAND');r.assertEqual(b.zone,'FIELD');});
r.test('Ant mimic borrows visible own printed low-cost ant ordinary skills dynamically',()=>{const s=state(),a=put(s,'set8_013');const donor=new CardDefinition({id:'batch_ant_fixture',name:'ant',type:'INSECT',color:'RED',cost:2,baseHp:800,tags:['アリ科'],skills:[{id:'ant_bite',name:'bite',baseAp:300,timing:'ATTACK',usageLimit:'ONCE_PER_FIELD_STAY',effects:[]}],implementationStatus:'TESTED'});cardRegistry.register(donor);const b=put(s,donor.id);let borrowed=getEffectiveAttackSkills(s,a).find(x=>x.name==='bite');r.assert(borrowed);r.assert(borrowed.id!=='ant_bite');const target=put(s,'set6_016','FIELD','P2');target.currentHp=2000;performAttack(s,a.instanceId,target.instanceId,'INSECT',borrowed.id);r.assertEqual(target.currentHp,1700);r.assert(!(b.usedSkills||[]).length);a.attackedThisTurn=false;r.assertEqual(getLegalAttackTargets(s,a.instanceId,borrowed.id).length,0);b.faceDown=true;r.assert(!getEffectiveAttackSkills(s,a).some(x=>x.name==='bite'));});
r.test('CPU uses attached sacrifice only when normal summon cannot be paid',()=>{for(const cost of [0,20]){const s=state(),a=put(s,'set8_003','HAND'),b=put(s,'set6_016');b.attachments=[{instanceId:'fake',cardId:'set7_054'}];s.player('P1').availableCost=cost;const cpu=new CpuAgent('P1',{rng:()=>0}),action=cpu.decideMainPhaseAction(s);r.assertEqual(action.type,'SUMMON');r.assertEqual(!!action.alternative,cost===0);r.assert(cpu.executeAction(s,action));if(s.pendingEffect)r.assert(cpu.executeAction(s,cpu.getPendingAction(s)));r.assertEqual(a.zone,'FIELD');r.assertEqual(b.zone,cost===0?'DISCARD':'FIELD');}});
r.test('Mimic excludes enemy hidden expensive and non-ant donors, honors own keyword suppression',()=>{const s=state(),a=put(s,'set8_013');for(const [id,cost,tags,p,hidden] of [['high',3,['アリ科'],'P1',false],['other',1,['アリヅカコオロギ科'],'P1',false],['enemy',1,['アリ科'],'P2',false],['hidden',1,['アリ科'],'P1',true]]){cardRegistry.register(new CardDefinition({id:id,name:id,type:'INSECT',color:'RED',cost:cost,baseHp:800,tags:tags,skills:[{id:'bite',name:id,timing:'ATTACK',baseAp:900}],implementationStatus:'TESTED'}));put(s,id,'FIELD',p).faceDown=hidden;}r.assertEqual(getEffectiveAttackSkills(s,a).length,1);a.runtimeFlags.suppressKeywordSkills=true;r.assertEqual(getEffectiveAttackSkills(s,a).length,1);});
r.test('Devil summon allows destruction replacement while still summoning',()=>{const s=state(),a=put(s,'set8_003','HAND'),b=put(s,'set6_016'),armor=put(s,'set1_102','HAND');r.assert(getCardDefinition(armor.cardId));s.player('P1').hand=s.player('P1').hand.filter(x=>x!==armor);armor.zone='ATTACHMENT';b.attachments=[armor];summonInsect(s,'P1',a.instanceId,{alternative:true,selectedIds:[b.instanceId]});r.assertEqual(a.zone,'FIELD');r.assertEqual(b.zone,'FIELD');r.assertEqual(armor.zone,'DISCARD');r.assertEqual(s.player('P1').availableCost,20);});
r.test('Dragonmantis offers enhancement after attack and uses it on itself for free',()=>{const s=state(),a=put(s,'set6_001'),target=put(s,'set6_016','FIELD','P2'),e=put(s,'set7_054','HAND');target.currentHp=3000;const skill=getCardDefinition(a.cardId).skills[1];performAttack(s,a.instanceId,target.instanceId,'INSECT',skill.id);r.assert(s.pendingEffect);r.assertEqual(s.pendingEffect.selectionPurpose,'FREE_CARD_AFTER_ATTACK');r.assert(s.pendingEffect.options.includes(e.instanceId));s.player('P1').availableCost=0;s.pendingEffect=JSON.parse(JSON.stringify(s.pendingEffect));resolveCardSelection(s,'P1',[e.instanceId],true);r.assertEqual(s.pendingEffect.selectionPurpose,'FREE_ENHANCEMENT_TARGET');resolveCardSelection(s,'P1',[a.instanceId],true);r.assertEqual(a.attachments[0].instanceId,e.instanceId);r.assertEqual(s.player('P1').availableCost,0);r.assert(a.usedSkills.includes(skill.id));});
r.test('Dragonmantis only offers spells selecting source and once-only survives decline',()=>{const s=state(),a=put(s,'set6_001'),target=put(s,'set6_016','FIELD','P2'),buff=put(s,'set2_054','HAND'),globalSpell=put(s,'test_spell_1','HAND'),enemySpell=put(s,'jinkaichu_no_bakunetsudan','HAND');target.currentHp=3000;const skill=getCardDefinition(a.cardId).skills[1];performAttack(s,a.instanceId,target.instanceId,'INSECT',skill.id);r.assert(s.pendingEffect.options.includes(buff.instanceId));r.assert(!s.pendingEffect.options.includes(globalSpell.instanceId));r.assert(!s.pendingEffect.options.includes(enemySpell.instanceId));resolveCardSelection(s,'P1',[],true);a.attackedThisTurn=false;r.assertEqual(getLegalAttackTargets(s,a.instanceId,skill.id).length,0);});
r.test('Dragonmantis spell resolves on source after JSON restore without base cost',()=>{let s=state();const a=put(s,'set6_001'),target=put(s,'set6_016','FIELD','P2'),buff=put(s,'set2_054','HAND');target.currentHp=3000;performAttack(s,a.instanceId,target.instanceId,'INSECT',getCardDefinition(a.cardId).skills[1].id);s=Object.assign(new GameState(),JSON.parse(JSON.stringify(s)));s.player('P1').availableCost=0;resolveCardSelection(s,'P1',[buff.instanceId],true);if(s.pendingEffect)resolveSpellTargetSelection(s,'P1',a.instanceId);r.assertEqual(s.pendingEffect,null);r.assertEqual(s.player('P1').availableCost,0);r.assertEqual(s.player('P1').discard[0].instanceId,buff.instanceId);});
r.test('Dragonmantis bounced during attack cannot use postattack card',()=>{const s=state(),a=put(s,'set6_001'),target=put(s,'set1_010','FIELD','P2');put(s,'set2_054','HAND');target.currentHp=100;performAttack(s,a.instanceId,target.instanceId,'INSECT',getCardDefinition(a.cardId).skills[1].id);r.assertEqual(a.zone,'HAND');r.assertEqual(s.pendingEffect,null);});
r.test('CPU resolves stale optional free-use and invalidated sacrifice without a loop after JSON',()=>{for(const kind of ['dragon','devil']){let s=state();const a=put(s,kind==='dragon'?'set6_001':'set8_003',kind==='dragon'?'FIELD':'HAND'),b=put(s,'set6_016',kind==='dragon'?'FIELD':'FIELD',kind==='dragon'?'P2':'P1');if(kind==='dragon'){put(s,'set2_054','HAND');b.currentHp=3000;performAttack(s,a.instanceId,b.instanceId,'INSECT',getCardDefinition(a.cardId).skills[1].id);moveCard(s,a.instanceId,'FIELD','HAND',{playerId:'P1'});}else{b.attachments=[{instanceId:'fake',cardId:'set7_054'}];summonInsect(s,'P1',a.instanceId,{alternative:true});b.attachments=[];}s=Object.assign(new GameState(),JSON.parse(JSON.stringify(s)));const cpu=new CpuAgent('P1',{rng:()=>0});r.assert(cpu.executeAction(s,cpu.getPendingAction(s)));r.assertEqual(s.pendingEffect,null);}});
r.test('Dragonmantis official multi-target attachment spell requires source as later host',()=>{const s=state(),a=put(s,'set6_001'),other=put(s,'set6_016'),target=put(s,'set6_016','FIELD','P2'),spell=put(s,'set4_062','HAND'),e=put(s,'minomushi_no_kakuremino','FOOD');target.currentHp=3000;performAttack(s,a.instanceId,target.instanceId,'INSECT',getCardDefinition(a.cardId).skills[1].id);r.assert(s.pendingEffect.options.includes(spell.instanceId));resolveCardSelection(s,'P1',[spell.instanceId],true);resolveCardSelection(s,'P1',[e.instanceId],true);let failed=false;try{resolveCardSelection(s,'P1',[other.instanceId],true);}catch(e){failed=true;}r.assert(failed);resolveCardSelection(s,'P1',[a.instanceId],true);r.assertEqual(a.attachments[0].instanceId,e.instanceId);r.assertEqual(s.pendingEffect,null);});
r.test('CPU uses revalidated batch enhancement candidates and generic cancellation receipt',()=>{const s=state(),cpu=new CpuAgent('P1'),oldStatus=global.getPendingBatchEnhancementStatus,oldCancel=global.cancelPendingCardUse;s.pendingEffect={type:'CARD_SELECTION',playerId:'P1',options:['stale','legal'],minSelections:2,maxSelections:2,exactSelections:2};try{global.getPendingBatchEnhancementStatus=()=>({canContinue:true,candidateIds:['legal','second'],allowedCombinations:[['legal','second']]});r.assertEqual(cpu.getPendingAction(s).instanceIds.join(','),'legal,second');global.getPendingBatchEnhancementStatus=()=>({canContinue:false});const action=cpu.getPendingAction(s);r.assertEqual(action.type,'CANCEL_CARD_USE');global.cancelPendingCardUse=(x,p)=>{r.assertEqual(p,'P1');x.pendingEffect=null;};r.assert(cpu.executeAction(s,action));r.assertEqual(s.pendingEffect,null);}finally{global.getPendingBatchEnhancementStatus=oldStatus;global.cancelPendingCardUse=oldCancel;}});
r.test('Golden pupa survives source removal, filters held cards and summons without cost after reconnect',()=>{
 let s=state();const larva=put(s,'set6_043'),enemy=put(s,'set1_010','FIELD','P2');
 const held=put(s,'set2_050','HAND'),adult=put(s,'set6_017','HAND');put(s,'set7_054','HAND');
 enemy.currentHp=1;s.player('P1').availableCost=0;
 performAttack(s,larva.instanceId,enemy.instanceId,'INSECT',getCardDefinition(larva.cardId).skills[1].id);
 r.assertEqual(larva.zone,'HAND');r.assertEqual(s.pendingEffect.options.join(','),held.instanceId);
 s=Object.assign(new GameState(),JSON.parse(JSON.stringify(s)));
 resolveCardSelection(s,'P1',[held.instanceId],true);resolveCardSelection(s,'P1',[adult.instanceId],true);
 r.assert(s.player('P1').field.some(c=>c.instanceId===adult.instanceId));r.assertEqual(s.player('P1').availableCost,0);
});
r.test('Cricket blocks both players before paying for revival or sacrificing a larva',()=>{
 const s=state(),cricket=put(s,'set7_046','FIELD','P2'),larva=put(s,'set6_041'),adult=put(s,'set6_016','DISCARD');
 const silk=put(s,'set3_048','HAND');put(s,'set6_016','DISCARD');
 const skill=getCardDefinition(larva.cardId).skills[1];
 r.assert(isDiscardRevivalBlocked(s));r.assertEqual(getLegalAttackTargets(s,larva.instanceId,skill.id).length,0);
 r.assertEqual(getEnhancementTargetCandidates(s,'P1',silk.instanceId).length,0);
 let denied=false;try{useEnhancement(s,'P1',silk.instanceId,adult.instanceId);}catch(e){denied=true;}r.assert(denied);
 r.assertEqual(s.player('P1').availableCost,20);r.assertEqual(silk.zone,'HAND');r.assertEqual(s.pendingEffect,null);
 cricket.faceDown=true;r.assert(!isDiscardRevivalBlocked(s));cricket.faceDown=false;
 cricket.runtimeFlags.suppressKeywordSkills=true;r.assert(!isDiscardRevivalBlocked(s));
});
r.test('Ulysses draws its own territory before ending turn; CPU resumes after restore',()=>{
 for(const territory of [true,false]){
  let s=state();const source=put(s,'set7_026'),target=put(s,'set6_016','FIELD','P2');
  const card=territory&&put(s,'set6_016','TERRITORY');const skill=getCardDefinition(source.cardId).skills[1];
  performAttack(s,source.instanceId,target.instanceId,'INSECT',skill.id);r.assert(source.usedSkills.includes(skill.id));
  if(territory){
   r.assertEqual(s.activePlayerId,'P1');r.assertEqual(s.pendingEffect.type,'TERRITORY_DRAW_SELECTION');
   s=Object.assign(new GameState(),JSON.parse(JSON.stringify(s)));const cpu=new CpuAgent('P1',{rng:()=>0});
   r.assert(cpu.executeAction(s,cpu.getPendingAction(s)));r.assert(s.player('P1').hand.some(x=>x.instanceId===card.instanceId));
  }
  r.assertEqual(s.activePlayerId,'P2');r.assertEqual(s.pendingEffect,null);
 }
});
r.test('Golden pupa and cricket choices are revalidated for CPU',()=>{
 let s=state();const larva=put(s,'set6_043'),target=put(s,'set6_016','FIELD','P2');
 const pupa=put(s,'set2_050','HAND'),adult=put(s,'set6_017','HAND');
 performAttack(s,larva.instanceId,target.instanceId,'INSECT',getCardDefinition(larva.cardId).skills[1].id);
 s=Object.assign(new GameState(),JSON.parse(JSON.stringify(s)));const cpu=new CpuAgent('P1',{rng:()=>0});
 r.assert(cpu.executeAction(s,cpu.getPendingAction(s)));
 if(s.pendingEffect)r.assert(cpu.executeAction(s,cpu.getPendingAction(s)));
 r.assertEqual(s.pendingEffect,null);
 const blocked=put(s,'set6_041'),cricket=put(s,'set7_046','FIELD','P2');
 const formSkill=getCardDefinition(blocked.cardId).skills[1];
 r.assertEqual(getLegalAttackTargets(s,blocked.instanceId,formSkill.id).length,0);
 moveCard(s,cricket.instanceId,'FIELD','HAND',{playerId:'P2'});
 r.assert(getLegalAttackTargets(s,blocked.instanceId,formSkill.id).length>0);
});
r.test('Cricket suppresses optional entry and prevents paid exchanges before a zone move',()=>{
 const s=state(),cricket=put(s,'set7_046','FIELD','P2'),adult=put(s,'set6_016','DISCARD');
 const host=put(s,'set6_016','HAND');summonInsect(s,'P1',host.instanceId);
 r.assertEqual(s.pendingEffect,null);r.assertEqual(adult.zone,'DISCARD');
 const exchange=put(s,'set4_057','HAND');put(s,'set6_041');
 const cost=s.player('P1').availableCost;
 try{useSpell(s,'P1',exchange.instanceId);}catch(e){}
 r.assertEqual(exchange.zone,'HAND');r.assertEqual(s.pendingEffect,null);r.assertEqual(s.player('P1').availableCost,cost);
});
r.test('Two mandibles requires a current attachment and draws one extra territory by effect after an attack draw',()=>{
 for(const direct of [true,false]){
  let s=state();const source=put(s,'set6_019'),skill=getCardDefinition(source.cardId).skills[1];
  const target=direct?null:put(s,'set6_016','FIELD','P2');
  const three=[0,1,2].map(()=>put(s,'set6_016','TERRITORY','P2'));
  r.assertEqual(getLegalAttackTargets(s,source.instanceId,skill.id).length,0);
  source.attachments=[{cardId:'set7_054',instanceId:'dual-blade',runtimeFlags:{}}];
  if(target)target.currentHp=1;
  r.assert(getLegalAttackTargets(s,source.instanceId,skill.id).length>0);
  performAttack(s,source.instanceId,target&&target.instanceId,direct?'LEADER':'INSECT',skill.id);
  r.assertEqual(s.pendingEffect.type,'TERRITORY_DRAW_SELECTION');r.assert(s.pendingEffect.context.attackSourceInstanceId);
  s=Object.assign(new GameState(),JSON.parse(JSON.stringify(s)));
  resolveTerritoryDrawSelection(s,'P2',three[0].instanceId);
  r.assertEqual(s.pendingEffect.type,'TERRITORY_DRAW_SELECTION');r.assert(!s.pendingEffect.context?.attackSourceInstanceId);
  const cpu=new CpuAgent('P2',{rng:()=>0});r.assert(cpu.executeAction(s,cpu.getPendingAction(s)));
  r.assertEqual(s.player('P2').territory.length,1);r.assertEqual(s.pendingEffect,null);
 }
});
r.test('Two mandibles cannot trigger on a replaced draw or after its last enhancement is removed',()=>{
 const s=state(),source=put(s,'set6_019'),victim=put(s,'set3_043','FIELD','P2');
 const skill=getCardDefinition(source.cardId).skills[1],enh={instanceId:'mandible-enh',cardId:'set7_054',runtimeFlags:{}};
 source.attachments=[enh];r.assert(getLegalAttackTargets(s,source.instanceId,skill.id).length>0);
 source.attachments=[];r.assertEqual(getLegalAttackTargets(s,source.instanceId,skill.id).length,0);
 source.attachments=[enh];victim.currentHp=1;put(s,'set6_016','TERRITORY','P2');
 performAttack(s,source.instanceId,victim.instanceId,'INSECT',skill.id);
 resolveChoiceSelection(s,'P2','SUPPRESS');r.assertEqual(s.pendingEffect,null);r.assertEqual(s.player('P2').territory.length,1);
});
module.exports=r;if(require.main===module)r.runAll().then(x=>{if(x.failed)process.exitCode=1});
