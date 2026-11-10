'use strict';
require('./engine-loader.js');
const assert=require('node:assert/strict');
const h=require('./helpers.js');
const spellDef=global.getCardDefinition('set2_051');
assert.ok(spellDef&&spellDef.isPlayable(),'実カード白夜の羽化は使用可能');
assert.equal(spellDef.cardEffects[0].type,'EXCHANGE_MATCHING_FORM');
for(const [larvaId,adultId] of [['namiageha_larva','namiageha'],['set8_038','set8_021'],['set2_032','set2_016']]){
 const state=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(state);state.turnNumber=3;
 const player=state.player('P1');player.hand=[];player.field=[];state.player('P2').field=[];
 const spell=h.addToHandRaw(state,'P1',spellDef);
 const larva=h.putInsectOnField(state,'P1',larvaId);
 const adult=h.addToHandRaw(state,'P1',global.getCardDefinition(adultId));
 // 縄張りから手札に移った際に裏向きフラグが残る既知の状態を再現する。
 if(larvaId==='set8_038')adult.faceDown=true;
 const cost=player.availableCost;
 global.useSpell(state,'P1',spell.instanceId);
 assert.equal(state.pendingEffect?.type,'CARD_SELECTION');
 assert.equal(state.pendingEffect?.selectionPurpose,'EXCHANGE_MATCHING_FORM');
 assert.equal(state.pendingEffect?.exactSelections,2);
 assert.ok(state.pendingEffect.options.includes(larva.instanceId));
 assert.ok(state.pendingEffect.options.includes(adult.instanceId));
 global.selectPendingCard(state,'P1',larva.instanceId);
 assert.deepEqual(state.pendingEffect.selectedIds,[larva.instanceId]);
 global.selectPendingCard(state,'P1',adult.instanceId);
 assert.equal(state.pendingEffect,null);
 assert.equal(larva.zone,'FOOD');
 assert.equal(adult.zone,'FIELD');
 assert.equal(spell.zone,'DISCARD');
 assert.equal(player.availableCost,cost);
}
console.log('WHITE_NIGHT_REAL_CARD_OK 3 official/starter pairs, two taps, no food cost');

const online=require('../battle-ui/engine-view.js');
{
 const state=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(state);state.turnNumber=3;
 state.player('P1').hand=[];state.player('P1').field=[];state.player('P2').field=[];
 const spell=h.addToHandRaw(state,'P1',spellDef);
 const larva=h.putInsectOnField(state,'P1','set8_038');
 const adult=h.addToHandRaw(state,'P1',global.getCardDefinition('set8_021'));
 adult.faceDown=true;
 const runtime={context:global,restore:s=>Object.assign(new global.GameState(),JSON.parse(JSON.stringify(s)))};
 const first=online.prepareView(runtime,state,'P1');
 const spellAction=first.view.actions.find(a=>a.kind==='SPELL'&&a.sourceRef===first.view.players.P1.hand.find(x=>x.cardId==='set2_051').ref);
 assert.ok(spellAction,'オンラインの術使用アクション');
 const pendingState=online.applyCapability(runtime,state,first.capabilities,spellAction.id);
 const second=online.prepareView(runtime,pendingState,'P1');
 assert.equal(second.view.decision?.exact,2);
 const opts=second.view.decision.options;
 const l=opts.find(x=>x.cardId==='set8_038'),a=opts.find(x=>x.cardId==='set8_021');
 assert.ok(l&&a,'幼虫と成虫がオンライン選択画面に表示される');
 const done=online.applyCapability(runtime,pendingState,second.capabilities,second.view.decision.actionId,[l.ref,a.ref]);
 assert.equal(done.player('P1').field.find(x=>x.instanceId===adult.instanceId)?.zone,'FIELD');
 assert.equal(done.player('P1').food.find(x=>x.instanceId===larva.instanceId)?.zone,'FOOD');
 console.log('WHITE_NIGHT_ONLINE_OK real spell, two visible candidates, confirmed');
}
