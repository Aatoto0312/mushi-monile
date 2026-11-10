'use strict';
const assert = require('node:assert/strict');
require('./engine-loader.js');
const records = require('../js/cards/full-catalog-data.js');
const moduleApi = require('../js/cards/termite-cards.js');
const ids = ['set8_042','set8_043','set8_044'];
const stats = [[500,500],[300,300],[100,100]];
assert.deepEqual(moduleApi.playableIds, ids);
ids.forEach((id,i)=>{
  const record = records.find(c=>c.id===id);
  const def = global.getCardDefinition(id);
  assert.ok(record && def,id+': catalog and registry required');
  assert.equal(def.name,record.name);
  assert.equal(def.isPlayable(),true,id+': must be PLAYABLE');
  assert.equal(def.baseHp,stats[i][0]);
  assert.equal(def.skills[0].baseAp,stats[i][1]);
  assert.equal(def.skills[0].effects[0].type,'SELECT_AFTER_ATTACK');
  const selection=def.skills[0].effects[0].selection;
  assert.equal(selection.from,'DISCARD');
  assert.equal(selection.controller,'SELF');
  assert.equal(selection.faceDown,false);
  assert.equal(selection.maxSelections,2);
  assert.equal(selection.operation,'SET_FACE');
  assert.equal(selection.targetFaceDown,true);
  assert.equal(def.continuousStatModifiers[0].type,'OWN_FACE_DOWN_DISCARD_COUNT');
  assert.deepEqual(def.continuousStatModifiers[0].stats,['HP','AP']);
  assert.equal(def.continuousStatModifiers[0].multiplier,200);
  assert.equal(def.skills[0].effectText,record.skills[0].effectText);
  assert.equal(def.passiveAbilities[0].effectText,record.passiveAbilities[0].effectText);
});
console.log('TERMITE_PREFLIGHT_OK 3 cards, attack-after decomposition and colony stat scaling');

const h=require('./helpers.js');
function scenario(id){
  const state=h.newGame({rng:h.firstPlayerRng});
  h.toMainPhase(state);
  const host=h.putInsectOnField(state,'P1',id);
  state.player('P1').discard=[];
  return {state,host,def:global.getCardDefinition(id)};
}
ids.forEach(id=>{
  const {state,host,def}=scenario(id);
  const baseAp=def.skills[0].baseAp,baseHp=def.baseHp;
  assert.equal(global.getEffectiveAP(state,host,baseAp,def.skills[0]),baseAp);
  assert.equal(global.calculateMaxHp(host,state),baseHp);
  state.player('P1').discard.push({faceDown:false,cardId:'set1_003'});
  state.player('P1').discard.push({faceDown:true});
  state.player('P1').discard.push({faceDown:true});
  assert.equal(global.getEffectiveAP(state,host,baseAp,def.skills[0]),baseAp+400);
  assert.equal(global.calculateMaxHp(host,state),baseHp+400);
  state.player('P1').discard[0].faceDown=true;
  assert.equal(global.getEffectiveAP(state,host,baseAp,def.skills[0]),baseAp+600);
  assert.equal(global.calculateMaxHp(host,state),baseHp+600);
  state.player('P1').discard[1].faceDown=false;
  assert.equal(global.getEffectiveAP(state,host,baseAp,def.skills[0]),baseAp+400);
  assert.equal(global.calculateMaxHp(host,state),baseHp+400);
});
console.log('TERMITE_DYNAMIC_STATS_OK 3 cards, visible/hidden discard transitions');
