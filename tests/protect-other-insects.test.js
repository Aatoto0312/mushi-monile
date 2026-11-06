'use strict';require('./engine-loader.js');const h=require('./helpers.js'),R=require('./lib.js'),r=new R();
const ids=['set6_028','set7_014','set7_030'];
function game(){const s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);s.turnNumber=3;const a=h.putInsectOnField(s,'P1','set2_001');return {s,a};}
function legal(s,a){return getLegalAttackTargets(s,a.instanceId,getCardDefinition(a.cardId).skills[0].id).filter(t=>t.targetType==='INSECT').map(t=>t.instance.instanceId);}
r.test('All three protection traits are registered and match printed behavior',()=>{for(const id of ids){const d=getCardDefinition(id);r.assert(d.isPlayable(),id);r.assert(d.passiveAbilities[0].effects.some(e=>e.type==='PROTECT_IF_OTHER_INSECT'));}});
r.test('Each protected insect is attackable alone but not beside ordinary insects',()=>{for(const id of ids){const {s,a}=game(),p=h.putInsectOnField(s,'P2',id);r.assert(legal(s,a).includes(p.instanceId),id+' alone');const ordinary=h.putInsectOnField(s,'P2','set2_016');const options=legal(s,a);r.assert(!options.includes(p.instanceId),id+' protected');r.assert(options.includes(ordinary.instanceId),id+' ordinary');}});
r.test('Two different protected insects can both be attacked when no ordinary insect remains',()=>{const {s,a}=game(),p=h.putInsectOnField(s,'P2','set7_014'),q=h.putInsectOnField(s,'P2','set7_030');const options=legal(s,a);r.assert(options.includes(p.instanceId));r.assert(options.includes(q.instanceId));});
module.exports=r;if(require.main===module)r.runAll().then(x=>{if(x.failed)process.exitCode=1;});
