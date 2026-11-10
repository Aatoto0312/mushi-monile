'use strict';
require('./engine-loader.js');
const assert=require('node:assert/strict');
const h=require('./helpers.js');
for(const [larvaId,adultId] of [['set8_036','set8_019'],['set8_038','set8_021']]){
  const state=h.newGame({rng:h.firstPlayerRng});
  h.toMainPhase(state);
  const larva=h.putInsectOnField(state,'P1',larvaId);
  const attacker=h.putInsectOnField(state,'P2','set1_003');
  const adult=h.addToHandRaw(state,'P1',global.getCardDefinition(adultId));
  global.destroyInsect(state,larva.instanceId,'ATTACK',attacker.instanceId);
  assert.ok(state.pendingEffect,'転生羽化選択待ち');
  assert.equal(state.pendingEffect.type,'CARD_SELECTION');
  assert.equal(state.pendingEffect.playerId,'P1');
  assert.equal(state.pendingEffect.minSelections,0);
  assert.equal(state.pendingEffect.maxSelections,1);
  assert.ok(state.pendingEffect.options.includes(adult.instanceId));
  global.selectPendingCard(state,'P1',adult.instanceId);
  assert.equal(state.pendingEffect,null,'タップ1回で選択完了');
  assert.equal(adult.zone,'FIELD','成虫が場に出る');
  assert.ok(state.player('P1').field.some(c=>c.instanceId===adult.instanceId));
  assert.equal(larva.zone,'DISCARD');
}
console.log('REINCARNATION_EMERGENCE_TAP_OK 2 larvae -> adult field');
