'use strict';
require('./engine-loader.js');
const fs=require('node:fs'),assert=require('node:assert/strict'),h=require('./helpers.js'),Runner=require('./lib.js'),r=new Runner();
function game(){const s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);s.turnNumber=3;s.player('P1').availableCost=20;return s;}
function hand(s,id){return h.addToHandRaw(s,'P1',getCardDefinition(id));}
r.test('Ryujin entry color BLUE/GREEN/decline is offered and expires',()=>{
  for(const value of ['BLUE','GREEN','DECLINE']){const s=game(),c=hand(s,'set2_001');summonInsect(s,'P1',c.instanceId);assert.equal(s.pendingEffect.type,'CHOICE_SELECTION');assert.deepEqual(s.pendingEffect.options.map(o=>o.value),['BLUE','GREEN','DECLINE']);resolveChoiceSelection(s,'P1',value);assert.equal(getEffectiveColor(c),value==='DECLINE'?'RED':value);endTurn(s);assert.equal(getEffectiveColor(c),'RED');}
});
r.test('Queen bee bag allows two eligible hand wasps in one selection and destroys both at end turn',()=>{
  const s=game(),a=hand(s,'set2_007'),b=hand(s,'set2_007'),spell=hand(s,'set3_050');
  useSpell(s,'P1',spell.instanceId);
  assert.equal(s.pendingEffect.type,'CARD_SELECTION');assert.equal(s.pendingEffect.maxSelections,2);
  assert(s.pendingEffect.options.includes(a.instanceId));assert(s.pendingEffect.options.includes(b.instanceId));
  resolveCardSelection(s,'P1',[a.instanceId,b.instanceId],true);
  assert.equal(a.zone,'FIELD');assert.equal(b.zone,'FIELD');
  assert.equal(s.pendingEffect,null);endTurn(s);
  assert.equal(a.zone,'DISCARD');assert.equal(b.zone,'DISCARD');
});
r.test('Queen bee bag follows printed hand / wasp family / up to two / end-turn destroy text',()=>{
 const d=getCardDefinition('set3_050'),e=d.cardEffects[0];assert.equal(d.name,'女王蜂の匂い袋');assert.equal(e.type,'SUMMON_HAND_BY_FAMILY_SUFFIX');assert.equal(e.familySuffix,'バチ科');assert.equal(e.minSelections,0);assert.equal(e.maxSelections,2);assert.equal(e.destroyAtEndTurn,true);
 assert(d.cardEffects[0]);
});
r.test('Queen bee bag selects two different wasp families and excludes non-wasps',()=>{
 const s=game(),a=hand(s,'set2_005'),b=hand(s,'set5_020'),notWasp=hand(s,'set2_001'),spell=hand(s,'set3_050');useSpell(s,'P1',spell.instanceId);
 assert(s.pendingEffect.options.includes(a.instanceId));assert(s.pendingEffect.options.includes(b.instanceId));assert(!s.pendingEffect.options.includes(notWasp.instanceId));
 resolveCardSelection(s,'P1',[a.instanceId,b.instanceId],true);assert.equal(a.zone,'FIELD');assert.equal(b.zone,'FIELD');endTurn(s);assert.equal(a.zone,'DISCARD');assert.equal(b.zone,'DISCARD');
});
r.test('Battle board opens color choices automatically and explains two-card selection',()=>{
 const board=fs.readFileSync('battle-ui/board.js','utf8');assert(board.includes('function showChoice()'));assert(board.includes("else if(vm.actions.some(a=>a.kind==='CHOICE'||a.kind==='TERRITORY_CHOICE'))showChoice()"));assert(board.includes('2枚とも選んでから'));assert(board.includes("選択中：'+chosen.length"));assert(board.includes("選択を決定（'+chosen.length"));
});
module.exports=r;if(require.main===module)r.runAll().then(x=>{if(x.failed)process.exitCode=1;});
