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
r.test('Battle board opens color choices automatically and explains two-card selection',()=>{
 const board=fs.readFileSync('battle-ui/board.js','utf8');assert(board.includes('function showChoice()'));assert(board.includes("else if(vm.actions.some(a=>a.kind==='CHOICE'||a.kind==='TERRITORY_CHOICE'))showChoice()"));assert(board.includes('2枚とも選んでから'));
});
module.exports=r;if(require.main===module)r.runAll().then(x=>{if(x.failed)process.exitCode=1;});
