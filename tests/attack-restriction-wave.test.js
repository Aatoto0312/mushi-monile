'use strict';
require('./engine-loader');
const h=require('./helpers.js'),R=require('./lib.js'),r=new R();
function setup(id){const s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);s.turnNumber=3;const a=h.putInsectOnField(s,'P1',id);return {s,a,skill:getCardDefinition(id).skills[1]};}
r.test('Five restriction-only attack skills are fully wired without phantom effects',()=>{
 for(const id of ['set7_003','set7_015','set7_017','set7_018','set7_028']){const d=getCardDefinition(id);r.assert(d.isPlayable(),id);r.assertEqual(d.skills[1].effects.length,0);r.assertEqual(d.skills[1].timing,'ATTACK');}
 for(const id of ['set7_003','set7_017'])r.assertEqual(getCardDefinition(id).skills[1].usageLimit,'ONCE_PER_FIELD_STAY');
});
r.test('Cost-limited and colorless-only skills reject invalid targets',()=>{
 for(const [id,valid,invalid] of [['set7_015','set7_049','set6_016'],['set7_017','set7_049','set2_001']]){
  const {s,a,skill}=setup(id);const yes=h.putInsectOnField(s,'P2',valid,{hp:9999}),no=h.putInsectOnField(s,'P2',invalid,{hp:9999});
  const targets=getLegalAttackTargets(s,a.instanceId,skill.id).filter(t=>t.targetType==='INSECT').map(t=>t.instance.instanceId);
  r.assert(targets.includes(yes.instanceId),id+' valid');r.assert(!targets.includes(no.instanceId),id+' invalid');
 }
});
r.test('Attachment-only attacks exclude bare insects and accept attached targets',()=>{
 for(const id of ['set7_018','set7_028']){const {s,a,skill}=setup(id),bare=h.putInsectOnField(s,'P2','set2_001',{hp:9999}),host=h.putInsectOnField(s,'P2','set2_016',{hp:9999});host.attachments.push({instanceId:'mock-enhance',cardId:'set6_050'});
 const targets=getLegalAttackTargets(s,a.instanceId,skill.id).filter(t=>t.targetType==='INSECT').map(t=>t.instance.instanceId);
 r.assert(targets.includes(host.instanceId));r.assert(!targets.includes(bare.instanceId));}
});
module.exports=r;if(require.main===module)r.runAll().then(x=>{if(x.failed)process.exitCode=1;});
