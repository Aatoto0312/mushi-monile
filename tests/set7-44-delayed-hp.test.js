'use strict';
require('./engine-loader');
const assert = require('node:assert/strict');
const Runner = require('./lib'), runner = new Runner(), h = require('./helpers');
function fixture(){
  const s=h.newGame({rng:()=>0});h.toMainPhase(s);s.turnNumber=3;
  for(const p of s.playerOrder)for(const z of ['field','hand','food','discard','territory'])s.player(p)[z]=[];
  const a=h.putInsectOnField(s,'P1','set7_044');
  const target=h.putInsectOnField(s,'P2','set1_003',{hp:10000});
  return {s,a,target,skill:getCardDefinition('set7_044').skills[1]};
}
function next(s){endTurn(s);h.toMainPhase(s);}
runner.test('SET7-44 exact attack effect and once-per-field-stay registration',()=>{
  const d=getCardDefinition('set7_044');
  assert.equal(d.baseHp,300);assert.equal(d.skills[1].baseAp,600);
  assert.equal(d.skills[1].effectText,'この技は1度だけ使用できる。次の相手のターン、この虫の体力を500増やす。');
  assert.equal(d.skills[1].usageLimit,'ONCE_PER_FIELD_STAY');
  assert.deepEqual(d.skills[1].effects,[{type:'APPLY_STAT_MODIFIER',target:'SELF',stat:'HP',amount:500,startTurnOffset:1,endTurnOffset:1}]);
});
runner.test('SET7-44 600 damage then HP+500 only on next opponent turn, expires',()=>{
  const f=fixture(),hp=calculateMaxHp(f.a,f.s);
  performAttack(f.s,f.a.instanceId,f.target.instanceId,'INSECT',f.skill.id);
  assert.equal(calculateMaxHp(f.a,f.s),hp,'no early own-turn HP bonus');
  assert.equal(f.a.usedSkills.includes(f.skill.id),true);
  next(f.s);assert.equal(calculateMaxHp(f.a,f.s),hp+500,'next opponent turn');
  next(f.s);assert.equal(calculateMaxHp(f.a,f.s),hp,'expiry');
});
runner.test('SET7-44 delayed modifier survives JSON and does not apply to a new field stay',()=>{
  const f=fixture();performAttack(f.s,f.a.instanceId,f.target.instanceId,'INSECT',f.skill.id);
  const s=Object.assign(new GameState(),JSON.parse(JSON.stringify(f.s)));
  const a=s.player('P1').field.find(x=>x.instanceId===f.a.instanceId);
  next(s);assert.equal(calculateMaxHp(a,s),800);
  moveCard(s,a.instanceId,'FIELD','HAND',{playerId:'P1'});
  moveCard(s,a.instanceId,'HAND','FIELD',{playerId:'P1',deferEntryEffects:true});
  assert.equal(calculateMaxHp(a,s),300,'old modifier must not leak after reentry');
});
module.exports=runner;
if(require.main===module)runner.runAll().then(x=>{if(x.failed)process.exitCode=1;});
