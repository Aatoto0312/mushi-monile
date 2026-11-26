'use strict';
require('./engine-loader');
const h=require('./helpers'),Runner=require('./lib'),r=new Runner();
require('../js/engine/cpu-agent');
const def=getCardDefinition('set5_057');
function fixture(){const s=h.newGame({rng:()=>0});h.toMainPhase(s);s.turnNumber=3;for(const p of s.playerOrder)for(const z of ['hand','field','food','discard'])s.player(p)[z]=[];s.player('P1').availableCost=20;return s;}
function put(s,id,zone='DISCARD',pid='P1',down=false){const c=h.addToHandRaw(s,pid,getCardDefinition(id));if(zone!=='HAND')moveCard(s,c.instanceId,'HAND',zone,{playerId:pid,faceDown:down});return c;}
function rejectsUnchanged(s,fn){const before=JSON.stringify(s);let rejected=false;try{fn();}catch{rejected=true;}r.assert(rejected);r.assertEqual(JSON.stringify(s),before);}
r.test('Canonical soil explicitly identifies its provisional ruling',()=>{r.assert(def.isPlayable());r.assertEqual(def.rulingStatus,'PROVISIONAL');r.assertEqual(cardRegistry.getAll().filter(d=>d.id==='set5_057').length,1);});
r.test('Provisional own-discard transfer preserves exact-two movement, hidden food and current-turn cost',()=>{const s=fixture(),spell=put(s,def.id,'HAND'),a=put(s,'kabutomushi'),b=put(s,'namitentou');useSpell(s,'P1',spell.instanceId,[a.instanceId,b.instanceId]);r.assertEqual(s.player('P1').availableCost,16);r.assertEqual(s.player('P1').food.length,2);r.assertEqual(s.player('P1').discard.length,1);for(const c of s.player('P1').food){r.assert(c.faceDown);r.assertEqual(c.runtimeFlags.foodCostSuppressedTurn,3);}s.turnNumber+=2;gainCost(s,'P1');r.assertEqual(s.player('P1').availableCost,2);});
r.test('Too few, duplicate, too many, hidden and opponent discard choices reject without paying or moving',()=>{for(const variant of ['few','duplicate','many','hidden','opponent']){const s=fixture(),spell=put(s,def.id,'HAND'),a=put(s,'kabutomushi'),b=put(s,'namitentou'),other=put(s,'set1_003');if(variant==='hidden')b.faceDown=true;if(variant==='opponent'){s.player('P1').discard.splice(s.player('P1').discard.indexOf(b),1);b.ownerId='P2';s.player('P2').discard.push(b);}const ids=variant==='few'?[a.instanceId]:variant==='duplicate'?[a.instanceId,a.instanceId]:variant==='many'?[a.instanceId,b.instanceId,other.instanceId]:[a.instanceId,b.instanceId];rejectsUnchanged(s,()=>useSpell(s,'P1',spell.instanceId,ids));}});
r.test('Pending selection supports cancel, JSON restore, permission checks and prevents second application',()=>{let s=fixture();const spell=put(s,def.id,'HAND'),a=put(s,'kabutomushi'),b=put(s,'namitentou');useSpell(s,'P1',spell.instanceId);cancelPendingCardUse(s,'P1');r.assertEqual(s.player('P1').availableCost,20);r.assertEqual(spell.zone,'HAND');useSpell(s,'P1',spell.instanceId);s=Object.assign(new GameState(),JSON.parse(JSON.stringify(s)));rejectsUnchanged(s,()=>resolveCardSelection(s,'P2',[a.instanceId,b.instanceId],true));resolveCardSelection(s,'P1',[a.instanceId,b.instanceId],true);r.assertEqual(s.player('P1').food.length,2);rejectsUnchanged(s,()=>resolveCardSelection(s,'P1',[a.instanceId,b.instanceId],true));});
r.test('CPU completes the pending soil choice using two distinct visible cards',()=>{
  const s=fixture(), spell=put(s,def.id,'HAND');
  put(s,'namitentou');put(s,'kabutomushi');put(s,'set1_003','DISCARD','P1',true);
  useSpell(s,'P1',spell.instanceId);
  const cpu=new CpuAgent('P1',{rng:()=>0});
  r.assert(cpu.executeAction(s,cpu.getPendingAction(s)));
  r.assertEqual(s.player('P1').food.length,2);
  r.assert(!s.pendingEffect);
});
module.exports=r;if(require.main===module)r.runAll().then(result=>{if(result.failed)process.exitCode=1;});
