'use strict';
// Wave 2 preflight: verify the exact nine enhancement IDs before any registration.
// This test intentionally does not count unimplemented cards as PLAYABLE.
const assert = require('node:assert/strict');
require('./engine-loader.js');
const catalog = require('../js/cards/full-catalog-data.js');
const ids = [
  'set6_049', 'set6_051', 'set6_054',
  'set7_052', 'set7_053', 'set7_056',
  'set8_049', 'set8_050', 'set8_052'
];
assert.equal(new Set(ids).size, 9, 'Wave 2 ID list must be unique');
const expectedStats = {set6_049:[1000,1000],set6_051:[300,300],set6_054:[0,0],set7_052:[0,600],set7_053:[0,300],set7_056:[500,500],set8_049:[100,100],set8_050:[100,100],set8_052:[400,0]};
for (const id of ids) {
  const matches = catalog.filter(record => record.id === id);
  assert.equal(matches.length, 1, id + ': expected one catalog record');
  const record = matches[0];
  assert.equal(record.type, 'ENHANCEMENT', id + ': expected enhancement');
  const definition = global.getCardDefinition(id);
  // Explicit reporting prevents treating a registered but partial card as completed.
  const state = !definition ? 'NOT_REGISTERED'
    : definition.isPlayable() ? 'PLAYABLE'
    : definition.implementationStatus || 'PARTIAL';
  assert.ok(definition, id + ': should be registered');
  assert.equal(state, 'PARTIAL', id + ': unresolved effect must not be promoted');
  assert.equal(definition.id, id);
  assert.equal(definition.type, 'ENHANCEMENT');
  assert.ok(definition.implementationNotes.includes('NOT PLAYABLE'));
  const statEffects = definition.enhancementEffects.filter(effect => effect.type === 'STAT_MODIFIER');
  for (const effect of statEffects) {
    assert.ok(['HP','AP'].includes(effect.stat));
    assert.ok(Number.isFinite(effect.amount) && effect.amount > 0);
  }
  const totals = statEffects.reduce((acc,effect)=>{acc[effect.stat]+=effect.amount;return acc;},{HP:0,AP:0});
  assert.deepEqual([totals.HP,totals.AP],expectedStats[id],id+': exact printed stat bonuses');
  console.log('WAVE2_CARD ' + JSON.stringify({
    id, name: record.name, state,
    effectText: (record.enhancementEffects || []).map(effect => effect.effectText || '')
  }));
}
console.log('WAVE2_PREFLIGHT_OK 9 catalog entries verified; no PLAYABLE promotion');
// Seven-segment scroll must only target insects in the nanaphasmid family.
{
  const scroll=global.getCardDefinition('set6_054');
  assert.equal(scroll.attachmentHostFamilySuffix,'ナナフシ科');
  assert.deepEqual(scroll.enhancementEffects.find(effect=>effect.type==='COLOR_OVERRIDE')?.colors,['RED','BLUE','GREEN'],'scroll must offer exactly the three printed colors');
  const family=catalog.filter(card=>card.type==='INSECT'&&(card.tags||[]).some(tag=>tag.endsWith('ナナフシ科')));
  const outsiders=catalog.filter(card=>card.type==='INSECT'&&!(card.tags||[]).some(tag=>tag.endsWith('ナナフシ科')));
  assert.ok(family.length>0&&outsiders.length>0,'both host categories must exist');
  assert.ok(family.every(card=>(card.tags||[]).some(tag=>tag.endsWith(scroll.attachmentHostFamilySuffix))));
  assert.ok(outsiders.every(card=>!(card.tags||[]).some(tag=>tag.endsWith(scroll.attachmentHostFamilySuffix))));
  console.log('WAVE2_SEVEN_SEGMENT_FAMILY_GATE_OK');

// Both single-blade cards require hosts whose printed techniques have no effects.
for(const id of ['set7_052','set7_053']){
  const def=global.getCardDefinition(id);
  assert.equal(def.requiresEffectlessHostSkills,true,id+' must restrict hosts');
  const plain=catalog.filter(card=>card.type==='INSECT'&&(card.skills||[]).every(skill=>!String(skill.effectText||'').trim()));
  const effectful=catalog.filter(card=>card.type==='INSECT'&&(card.skills||[]).some(skill=>String(skill.effectText||'').trim()));
  assert.ok(plain.length>0&&effectful.length>0,'need both host classes');
}
console.log('WAVE2_SINGLE_BLADE_HOST_GATE_OK');

// Exercise the actual engine target selector, not just the printed metadata.
{
  const h=require('./helpers.js');
  const plain=catalog.find(card=>card.type==='INSECT'&&global.getCardDefinition(card.id)&&(card.skills||[]).length>0&&(card.skills||[]).every(skill=>!String(skill.effectText||'').trim()));
  const effectful=catalog.find(card=>card.type==='INSECT'&&global.getCardDefinition(card.id)&&(card.skills||[]).some(skill=>String(skill.effectText||'').trim()));
  assert.ok(plain&&effectful,'registered plain and effectful hosts required');
  for(const bladeId of ['set7_052','set7_053']){
    const state=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(state);
    const allowed=h.putInsectOnField(state,'P1',plain.id);
    const forbidden=h.putInsectOnField(state,'P1',effectful.id);
    const blade=h.addToHandRaw(state,'P1',h.defById(bladeId));
    const candidates=global.getEnhancementTargetCandidates(state,'P1',blade.instanceId).map(card=>card.instanceId);
    assert.ok(candidates.includes(allowed.instanceId),bladeId+' must allow an effectless host');
    assert.ok(!candidates.includes(forbidden.instanceId),bladeId+' must reject a host with skill effects');
  }
}
console.log('WAVE2_SINGLE_BLADE_ENGINE_TARGET_GATE_OK');

{
  const h=require('./helpers.js');
  const familyHost=catalog.find(card=>card.type==='INSECT'&&global.getCardDefinition(card.id)&&(card.tags||[]).some(tag=>tag.endsWith('ナナフシ科')));
  const otherHost=catalog.find(card=>card.type==='INSECT'&&global.getCardDefinition(card.id)&&!(card.tags||[]).some(tag=>tag.endsWith('ナナフシ科')));
  assert.ok(familyHost&&otherHost,'both family and nonfamily insects required');
  const state=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(state);
  const allowed=h.putInsectOnField(state,'P1',familyHost.id);
  const forbidden=h.putInsectOnField(state,'P1',otherHost.id);
  const scroll=h.addToHandRaw(state,'P1',h.defById('set6_054'));
  const candidates=global.getEnhancementTargetCandidates(state,'P1',scroll.instanceId).map(card=>card.instanceId);
  assert.ok(candidates.includes(allowed.instanceId),'seven-segment scroll must allow stick insects');
  assert.ok(!candidates.includes(forbidden.instanceId),'seven-segment scroll must reject other families');
  const restored=Object.assign(new global.GameState(),JSON.parse(JSON.stringify(state)));
  const afterRestore=global.getEnhancementTargetCandidates(restored,'P1',scroll.instanceId).map(card=>card.instanceId);
  assert.deepEqual(afterRestore,candidates,'seven-segment eligibility must survive JSON restore');
}
console.log('WAVE2_SEVEN_SEGMENT_ENGINE_TARGET_GATE_OK');

{
  const h=require('./helpers.js');
  const hostDef=catalog.find(card=>card.type==='INSECT'&&global.getCardDefinition(card.id)&&(card.tags||[]).some(tag=>tag.endsWith('ナナフシ科')));
  assert.ok(hostDef,'registered stick-insect host required');
  const state=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(state);
  const host=h.putInsectOnField(state,'P1',hostDef.id);
  const originalColor=global.getEffectiveColor(host);
  const scroll={instanceId:state.nextInstanceId(),cardId:'set6_054',ownerId:'P1',controllerId:'P1',zone:'FIELD'};
  host.attachments.push(scroll);
  for(const color of ['RED','BLUE','GREEN']){
    scroll.chosenColor=color;
    assert.equal(global.getEffectiveColor(host),color,'scroll must apply selected '+color);
    const restored=JSON.parse(JSON.stringify(host));
    assert.equal(global.getEffectiveColor(restored),color,'scroll color must survive serialization');
  }
  host.attachments.pop();
  assert.equal(global.getEffectiveColor(host),originalColor,'removing scroll must restore printed color');
}
console.log('WAVE2_SEVEN_SEGMENT_COLOR_ENGINE_OK');



}


// Cross-player global lock: only insect movement from DISCARD to FIELD is blocked.
{
  const h=require('./helpers.js');
  const s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);
  const host=h.putInsectOnField(s,'P1','set2_001');
  const att=global.createCardInstance?global.createCardInstance('set8_050','P1'):null;
  const fake=att||{instanceId:'wave2-pouch-test',cardId:'set8_050',ownerId:'P1',controllerId:'P1',zone:'ATTACHMENT'};
  host.attachments.push(fake);
  for(const pid of ['P1','P2']){
    const insect=h.putInsectOnField(s,pid,'set2_002');
    moveCard(s,insect.instanceId,'FIELD','DISCARD',{playerId:pid});
    assert.throws(()=>moveCard(s,insect.instanceId,'DISCARD','FIELD',{playerId:pid}),/幻惑の蛍袋/);
    assert.ok(s.player(pid).discard.some(c=>c.instanceId===insect.instanceId),'failed summon must leave card in discard');
  }
  // A face-down host cannot project its continuous attachment restriction.
  host.faceDown=true;
  const temporarilyAllowed=s.player('P1').discard.find(c=>c.cardId==='set2_002');
  moveCard(s,temporarilyAllowed.instanceId,'DISCARD','FIELD',{playerId:'P1',deferEntryEffects:true});
  host.faceDown=false;
  const resumed=h.putInsectOnField(s,'P2','set2_003');
  moveCard(s,resumed.instanceId,'FIELD','DISCARD',{playerId:'P2'});
  assert.throws(()=>moveCard(s,resumed.instanceId,'DISCARD','FIELD',{playerId:'P2'}),/幻惑の蛍袋/);
  host.attachments.pop();
  const insect=s.player('P2').discard.find(c=>c.cardId==='set2_002');
  moveCard(s,insect.instanceId,'DISCARD','FIELD',{playerId:'P2',deferEntryEffects:true});
  assert.ok(s.player('P2').field.some(c=>c.instanceId===insect.instanceId),'summon allowed after pouch removed');
  console.log('WAVE2_FIREFLY_LOCK_OK');
}

// Warrior engraving affects only its controller's insects while its host is face up.
{
  const h=require('./helpers.js');
  const s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);
  const p1=h.putInsectOnField(s,'P1','set2_001');
  const p2=h.putInsectOnField(s,'P2','set2_002');
  assert.equal(global.areInsectKeywordSkillsSuppressed(s,p1),false);
  const engraving={instanceId:'wave2-engraving-test',cardId:'set6_051',ownerId:'P1',controllerId:'P1',zone:'ATTACHMENT'};
  p1.attachments.push(engraving);
  assert.equal(global.areInsectKeywordSkillsSuppressed(s,p1),true,'own insect suppressed');
  assert.equal(global.areInsectKeywordSkillsSuppressed(s,p2),false,'opponent insect must remain unaffected');
  p1.faceDown=true;
  assert.equal(global.areInsectKeywordSkillsSuppressed(s,p2),false,'face-down host stops global effect');
  p1.faceDown=false;
  p1.attachments.pop();
  assert.equal(global.areInsectKeywordSkillsSuppressed(s,p2),false,'removing engraving stops global effect');
  // The same rule applies when the opponent equips their own engraving.
  const opponentEngraving={instanceId:'wave2-engraving-p2',cardId:'set6_051',ownerId:'P2',controllerId:'P2',zone:'ATTACHMENT'};
  p2.attachments.push(opponentEngraving);
  assert.equal(global.areInsectKeywordSkillsSuppressed(s,p2),true,'P2 engraving suppresses P2 insects');
  assert.equal(global.areInsectKeywordSkillsSuppressed(s,p1),false,'P2 engraving does not suppress P1 insects');
  p2.attachments.pop();
  // Cost and color evaluations may use a temporary insect without owner metadata.
  const transient={cardId:'set2_001'};
  assert.equal(global.areInsectKeywordSkillsSuppressed(s,transient),false,'ownerless temporary insect must not crash');
  console.log('WAVE2_WARRIOR_KEYWORD_LOCK_OK');
}

// Jewel beetle crown: both accepting and declining the optional recovery.
for(const accept of [true,false]){
  const h=require('./helpers.js');
  const s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);
  const host=h.putInsectOnField(s,'P1','set2_001');
  const crown={instanceId:s.nextInstanceId(),cardId:'set7_056',ownerId:'P1',controllerId:'P1',zone:'ATTACHMENT'};
  host.attachments.push(crown);
  global.destroyInsect(s,host.instanceId,'EFFECT',null,null,{skipTerritoryDraw:true});
  assert.equal(s.pendingEffect&&s.pendingEffect.selectionPurpose,'WAVE2_CROWN_RECOVERY','destruction must offer crown choice');
  global.resolveChoiceSelection(s,'P1',accept?'USE':'DECLINE');
  const zone=accept?'food':'discard';
  assert.ok(s.player('P1')[zone].some(c=>c.instanceId===crown.instanceId),'crown should remain in selected destination');
  assert.notEqual(s.pendingEffect&&s.pendingEffect.selectionPurpose,'WAVE2_CROWN_RECOVERY','no duplicate recovery prompt');
}
console.log('WAVE2_CROWN_RECOVERY_OK');

// Both single-blade enhancements: optional payment of one face-up food.
for(const cardId of ['set7_052','set7_053'])for(const accept of [true,false]){
  const h=require('./helpers.js');
  const s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);
  const host=h.putInsectOnField(s,'P1','set2_001');
  const food=h.addToFoodRaw(s,'P1',h.defById('test_red_1'));
  const blade={instanceId:s.nextInstanceId(),cardId,ownerId:'P1',controllerId:'P1',zone:'ATTACHMENT'};
  host.attachments.push(blade);
  global.destroyInsect(s,host.instanceId,'EFFECT',null,null,{skipTerritoryDraw:true});
  assert.equal(s.pendingEffect&&s.pendingEffect.selectionPurpose,'WAVE2_BLADE_RECOVERY',cardId+' must offer recovery');
  const foodId=s.player('P1').food.find(c=>!c.faceDown).instanceId;
  global.resolveChoiceSelection(s,'P1',accept?foodId:'DECLINE');
  assert.ok(s.player('P1')[accept?'hand':'discard'].some(c=>c.instanceId===blade.instanceId),cardId+' destination');
  assert.equal(s.player('P1').food.find(c=>c.instanceId===foodId).faceDown,accept,cardId+' food flip');
  assert.notEqual(s.pendingEffect&&s.pendingEffect.selectionPurpose,'WAVE2_BLADE_RECOVERY','no duplicate blade prompt');
}
console.log('WAVE2_BLADE_RECOVERY_OK');

// Six-mon coin: only attack destruction offers bottom-deck-and-draw choice.
for(const attack of [true,false])for(const accept of [true,false]){
  const h=require('./helpers.js');const s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);
  const host=h.putInsectOnField(s,'P1','set2_001');
  const coin={instanceId:s.nextInstanceId(),cardId:'set8_049',ownerId:'P1',controllerId:'P1',zone:'ATTACHMENT'};
  host.attachments.push(coin);
  const initialHand=s.player('P1').hand.length;
  const originalDeckTop=s.player('P1').deck[0]&&s.player('P1').deck[0].instanceId;
  global.destroyInsect(s,host.instanceId,attack?'ATTACK':'EFFECT',null,null,{skipTerritoryDraw:true});
  if(!attack){assert.notEqual(s.pendingEffect&&s.pendingEffect.selectionPurpose,'WAVE2_COIN_RECOVERY');continue;}
  assert.equal(s.pendingEffect&&s.pendingEffect.selectionPurpose,'WAVE2_COIN_RECOVERY');
  global.resolveChoiceSelection(s,'P1',accept?'USE':'DECLINE');
  assert.ok(s.player('P1')[accept?'deck':'discard'].some(c=>c.instanceId===coin.instanceId));
  if(accept){assert.equal(s.player('P1').deck.at(-1).instanceId,coin.instanceId,'coin at deck bottom');assert.equal(s.player('P1').hand.length,initialHand+1,'draw exactly one');assert.ok(s.player('P1').hand.some(card=>card.instanceId===originalDeckTop),'draw the original top card, not the recovered coin');assert.ok(!s.player('P1').hand.some(card=>card.instanceId===coin.instanceId),'recovered coin must remain in deck');}
  else assert.equal(s.player('P1').hand.length,initialHand,'decline does not draw');
}
console.log('WAVE2_COIN_RECOVERY_OK');


for(const attack of [true,false])for(const accept of [true,false]){
  const h=require('./helpers.js');
  const state=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(state);
  const host=h.putInsectOnField(state,'P1','set2_001');
  const scroll={instanceId:state.nextInstanceId(),cardId:'set6_054',ownerId:'P1',controllerId:'P1',zone:'ATTACHMENT',chosenColor:'BLUE'};
  host.attachments.push(scroll);
  global.destroyInsect(state,host.instanceId,attack?'ATTACK':'EFFECT',null,null,{skipTerritoryDraw:true});
  if(attack){
    assert.equal(state.pendingEffect&&state.pendingEffect.selectionPurpose,'WAVE2_SCROLL_RECOVERY','attack destruction must offer scroll recovery');
    global.resolveChoiceSelection(state,'P1',accept?'USE':'DECLINE');
  }else assert.notEqual(state.pendingEffect&&state.pendingEffect.selectionPurpose,'WAVE2_SCROLL_RECOVERY','non-attack destruction must not offer scroll recovery');
  const expectedZone=attack&&accept?'hand':'discard';
  assert.ok(state.player('P1')[expectedZone].some(c=>c.instanceId===scroll.instanceId),'scroll destination '+expectedZone);
  assert.notEqual(state.pendingEffect&&state.pendingEffect.selectionPurpose,'WAVE2_SCROLL_RECOVERY','scroll recovery must not prompt twice');
}
console.log('WAVE2_SCROLL_RECOVERY_OK');


{
  // Two scrolls on one destroyed host must resolve independently, including a
  // declined first recovery followed by an accepted second recovery.
  const h=require('./helpers.js');
  const state=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(state);
  const host=h.putInsectOnField(state,'P1','set2_001');
  const first={instanceId:state.nextInstanceId(),cardId:'set6_054',ownerId:'P1',controllerId:'P1',zone:'ATTACHMENT',chosenColor:'RED'};
  const second={instanceId:state.nextInstanceId(),cardId:'set6_054',ownerId:'P1',controllerId:'P1',zone:'ATTACHMENT',chosenColor:'GREEN'};
  host.attachments.push(first,second);
  global.destroyInsect(state,host.instanceId,'ATTACK',null,null,{skipTerritoryDraw:true});
  assert.equal(state.pendingEffect?.selectionPurpose,'WAVE2_SCROLL_RECOVERY');
  global.resolveChoiceSelection(state,'P1','DECLINE');
  assert.equal(state.pendingEffect?.selectionPurpose,'WAVE2_SCROLL_RECOVERY','second scroll should get its own choice');
  global.resolveChoiceSelection(state,'P1','USE');
  assert.ok(state.player('P1').discard.some(card=>card.instanceId===first.instanceId),'declined scroll stays discarded');
  assert.ok(state.player('P1').hand.some(card=>card.instanceId===second.instanceId),'accepted second scroll returns');
  assert.notEqual(state.pendingEffect?.selectionPurpose,'WAVE2_SCROLL_RECOVERY','both scrolls must finish');
}
console.log('WAVE2_SCROLL_MULTI_ATTACHMENT_OK');


{
  // A scroll and crown can share one host. Recovery must advance through
  // both optional effects without losing the pending continuation.
  const h=require('./helpers.js');
  const state=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(state);
  const host=h.putInsectOnField(state,'P1','set2_001');
  const scroll={instanceId:state.nextInstanceId(),cardId:'set6_054',ownerId:'P1',controllerId:'P1',zone:'ATTACHMENT',chosenColor:'GREEN'};
  const crown={instanceId:state.nextInstanceId(),cardId:'set7_056',ownerId:'P1',controllerId:'P1',zone:'ATTACHMENT'};
  host.attachments.push(scroll,crown);
  global.destroyInsect(state,host.instanceId,'ATTACK',null,null,{skipTerritoryDraw:true});
  assert.equal(state.pendingEffect?.selectionPurpose,'WAVE2_SCROLL_RECOVERY');
  global.resolveChoiceSelection(state,'P1','USE');
  assert.equal(state.pendingEffect?.selectionPurpose,'WAVE2_CROWN_RECOVERY','crown choice must follow scroll');
  global.resolveChoiceSelection(state,'P1','USE');
  assert.ok(state.player('P1').hand.some(card=>card.instanceId===scroll.instanceId));
  assert.ok(state.player('P1').food.some(card=>card.instanceId===crown.instanceId));
  assert.notEqual(state.pendingEffect?.selectionPurpose,'WAVE2_SCROLL_RECOVERY');
  assert.notEqual(state.pendingEffect?.selectionPurpose,'WAVE2_CROWN_RECOVERY');
}
console.log('WAVE2_SCROLL_CROWN_CHAIN_OK');


{
  const armor=global.getCardDefinition('set6_049');
  assert.ok(armor.enhancementEffects.some(e=>e.type==='PROTECT_OWN_ARMORED_INSECTS_FROM_OPPONENT_SPELL_DAMAGE_AND_DESTRUCTION_WHILE_FACEUP_FOOD'),'floral armor must declare food protection');
  const h=require('./helpers.js');
  for(const foodFaceDown of [false,true])for(const hasArmorAttachment of [false,true]){
    const state=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(state);
    const host=h.putInsectOnField(state,'P1','set2_001');
    const originalHp=host.currentHp;
    if(hasArmorAttachment)host.attachments.push({instanceId:state.nextInstanceId(),cardId:'set8_052',ownerId:'P1',controllerId:'P1',zone:'ATTACHMENT'});
    const food=h.addToFoodRaw(state,'P1',h.defById('set6_049'));
    food.faceDown=foodFaceDown;
    const spell=h.addToHandRaw(state,'P2',h.defById('set2_001'));
    const protectedNow=!foodFaceDown&&hasArmorAttachment;
    global.applyDamage(state,spell,host,100,'SPELL',spell.instanceId,host.instanceId,{},{deferDestruction:true});
    assert.equal(host.currentHp,originalHp-(protectedNow?0:100),'floral armor food spell damage gate');
  }
}
console.log('WAVE2_FLORAL_ARMOR_FOOD_DAMAGE_GATE_OK');


{
  // Direct spell destruction is prevented only with face-up floral armor food
  // and a matching armor-named enhancement on the threatened insect.
  const h=require('./helpers.js');
  for(const sourceType of ['SPELL','ATTACK','EFFECT'])for(const foodFaceDown of [false,true])for(const hasArmorAttachment of [false,true]){
    const state=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(state);
    const host=h.putInsectOnField(state,'P1','set2_001');
    if(hasArmorAttachment)host.attachments.push({instanceId:state.nextInstanceId(),cardId:'set8_052',ownerId:'P1',controllerId:'P1',zone:'ATTACHMENT'});
    const food=h.addToFoodRaw(state,'P1',h.defById('set6_049'));
    food.faceDown=foodFaceDown;
    const source=h.addToHandRaw(state,'P2',h.defById('set2_001'));
    const protectedNow=sourceType==='SPELL'&&!foodFaceDown&&hasArmorAttachment;
    global.destroyInsect(state,host.instanceId,sourceType,source.instanceId,null,{skipTerritoryDraw:true});
    const remains=state.player('P1').field.some(card=>card.instanceId===host.instanceId);
    assert.equal(remains,protectedNow,'floral armor direct destruction gate '+[sourceType,foodFaceDown,hasArmorAttachment].join('/'));
  }
}
console.log('WAVE2_FLORAL_ARMOR_DIRECT_DESTRUCTION_GATE_OK');


{
  const shield=global.getCardDefinition('set8_052');
  const guard=shield.enhancementEffects.find(e=>e.type==='OPTIONAL_FLIP_SELF_FOOD_TO_PREVENT_OPPONENT_TARGETED_SPELL_ON_ARMORED_INSECT');
  assert.ok(guard,'shield armor must declare optional target protection');
  assert.equal(guard.requiresFaceUpFood,true);
  assert.equal(guard.requiresOwnArmoredTarget,true);
  assert.equal(shield.isPlayable(),false,'metadata alone must never promote shield armor');
}
console.log('WAVE2_SHIELD_ARMOR_EFFECT_CONTRACT_OK');


{
  const h=require('./helpers.js');
  for(const faceDown of [false,true])for(const hasArmor of [false,true])for(const ownSpell of [false,true]){
    const state=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(state);
    const host=h.putInsectOnField(state,'P1','set2_001');
    if(hasArmor)host.attachments.push({instanceId:state.nextInstanceId(),cardId:'set8_052',ownerId:'P1',controllerId:'P1',zone:'ATTACHMENT'});
    const food=h.addToFoodRaw(state,'P1',h.defById('set8_052'));
    food.faceDown=faceDown;
    const candidates=global.getShieldArmorFoodCandidates(state,ownSpell?'P1':'P2',host.instanceId);
    assert.equal(candidates.length,(!faceDown&&hasArmor&&!ownSpell)?1:0,'shield food eligibility '+[faceDown,hasArmor,ownSpell].join('/'));
    if(candidates.length)assert.equal(candidates[0].instanceId,food.instanceId);
  }
}
console.log('WAVE2_SHIELD_ARMOR_ELIGIBILITY_OK');


{
  // End-to-end committed spell: the defender decides after the spell is paid,
  // and accepting protection flips exactly one shield food.
  const h=require('./helpers.js');
  const base=JSON.parse(JSON.stringify(global.getCardDefinition('set2_054')));
  base.id='test_wave2_shield_target_spell';
  base.implementationStatus='test';
  base.cost=0;
  base.cardEffects=[{type:'DEAL_DAMAGE_TO_TARGET',target:'OPPONENT_FIELD_INSECT',requiresTarget:true,amount:100,ignoreAttributeMultiplier:true}];
  global.cardRegistry.register(new global.CardDefinition(base));
  const spellDef=global.getCardDefinition(base.id);
  for(const decision of ['DECLINE','USE']){
    const state=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(state);
    state.activePlayerId='P2';
    const host=h.putInsectOnField(state,'P1','set2_001');
    host.attachments.push({instanceId:state.nextInstanceId(),cardId:'set8_052',ownerId:'P1',controllerId:'P1',zone:'ATTACHMENT'});
    const shield=h.addToFoodRaw(state,'P1',h.defById('set8_052'));
    const spell=h.addToHandRaw(state,'P2',spellDef);
    const originalHp=host.currentHp;
    global.useSpell(state,'P2',spell.instanceId,host.instanceId);
    assert.equal(state.pendingEffect?.selectionPurpose,'WAVE2_SHIELD_ARMOR_PROTECTION','defender must get choice');
    assert.equal(state.pendingEffect.playerId,'P1');
    global.resolveChoiceSelection(state,'P1',decision==='USE'?shield.instanceId:'DECLINE');
    assert.equal(shield.faceDown,decision==='USE','food flip only on acceptance');
    assert.equal(host.currentHp,originalHp-(decision==='USE'?0:100),'targeted damage prevented only on acceptance');
    assert.ok(state.player('P2').discard.some(card=>card.instanceId===spell.instanceId),'spell must finalize');
    assert.notEqual(state.pendingEffect?.selectionPurpose,'WAVE2_SHIELD_ARMOR_PROTECTION');
  }
}
console.log('WAVE2_SHIELD_ARMOR_COMMITTED_SPELL_OK');


{
  // A targeted spell with two sequential effects must not leak either effect
  // through an accepted shield, but declining must allow both.
  const h=require('./helpers.js');
  const raw=JSON.parse(JSON.stringify(global.getCardDefinition('set2_054')));
  raw.id='test_wave2_shield_double_spell';
  raw.implementationStatus='test';raw.cost=0;
  raw.cardEffects=[
    {type:'DEAL_DAMAGE_TO_TARGET',target:'OPPONENT_FIELD_INSECT',requiresTarget:true,amount:100,ignoreAttributeMultiplier:true},
    {type:'DEAL_DAMAGE_TO_TARGET',target:'OPPONENT_FIELD_INSECT',requiresTarget:true,amount:200,ignoreAttributeMultiplier:true}
  ];
  global.cardRegistry.register(new global.CardDefinition(raw));
  for(const defend of [true,false]){
    const state=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(state);state.activePlayerId='P2';
    const target=h.putInsectOnField(state,'P1','set2_001');
    target.attachments.push({instanceId:state.nextInstanceId(),cardId:'set8_052',ownerId:'P1',controllerId:'P1',zone:'ATTACHMENT'});
    const shield=h.addToFoodRaw(state,'P1',h.defById('set8_052'));
    const spell=h.addToHandRaw(state,'P2',global.getCardDefinition(raw.id));
    const hp=target.currentHp;
    global.useSpell(state,'P2',spell.instanceId,target.instanceId);
    assert.equal(state.pendingEffect?.selectionPurpose,'WAVE2_SHIELD_ARMOR_PROTECTION');
    global.resolveChoiceSelection(state,'P1',defend?shield.instanceId:'DECLINE');
    assert.equal(target.currentHp,hp-(defend?0:300),'both spell effects must respect shield choice');
    assert.equal(shield.faceDown,defend);
    assert.ok(state.player('P2').discard.some(card=>card.instanceId===spell.instanceId));
  }
}
console.log('WAVE2_SHIELD_ARMOR_MULTI_EFFECT_OK');


{
  // A shield decision must not be offered for an untargeted area spell.
  const h=require('./helpers.js');
  const raw=JSON.parse(JSON.stringify(global.getCardDefinition('set2_054')));
  raw.id='test_wave2_shield_untargeted_spell';
  raw.implementationStatus='test';raw.cost=0;
  raw.cardEffects=[{type:'NEXT_OPPONENT_CARD_COUNTER',cardType:'SPELL'}];
  global.cardRegistry.register(new global.CardDefinition(raw));
  const state=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(state);state.activePlayerId='P2';
  const target=h.putInsectOnField(state,'P1','set2_001');
  target.attachments.push({instanceId:state.nextInstanceId(),cardId:'set8_052',ownerId:'P1',controllerId:'P1',zone:'ATTACHMENT'});
  const shield=h.addToFoodRaw(state,'P1',h.defById('set8_052'));
  const spell=h.addToHandRaw(state,'P2',global.getCardDefinition(raw.id));
  global.useSpell(state,'P2',spell.instanceId);
  assert.notEqual(state.pendingEffect?.selectionPurpose,'WAVE2_SHIELD_ARMOR_PROTECTION','untargeted spell must not trigger shield');
  assert.equal(shield.faceDown,false);
  assert.ok(state.player('P2').discard.some(card=>card.instanceId===spell.instanceId));
}
console.log('WAVE2_SHIELD_ARMOR_UNTARGETED_SPELL_OK');


{
  // Two face-up shields: the defender chooses exactly one to consume.
  const h=require('./helpers.js');
  const raw=JSON.parse(JSON.stringify(global.getCardDefinition('set2_054')));
  raw.id='test_wave2_shield_two_food_choices';raw.implementationStatus='test';raw.cost=0;
  raw.cardEffects=[{type:'DEAL_DAMAGE_TO_TARGET',target:'OPPONENT_FIELD_INSECT',requiresTarget:true,amount:100,ignoreAttributeMultiplier:true}];
  global.cardRegistry.register(new global.CardDefinition(raw));
  const state=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(state);state.activePlayerId='P2';
  const target=h.putInsectOnField(state,'P1','set2_001');
  target.attachments.push({instanceId:state.nextInstanceId(),cardId:'set8_052',ownerId:'P1',controllerId:'P1',zone:'ATTACHMENT'});
  const first=h.addToFoodRaw(state,'P1',h.defById('set8_052'));
  const second=h.addToFoodRaw(state,'P1',h.defById('set8_052'));
  const spell=h.addToHandRaw(state,'P2',global.getCardDefinition(raw.id));
  const hp=target.currentHp;
  global.useSpell(state,'P2',spell.instanceId,target.instanceId);
  assert.deepEqual(state.pendingEffect.options.map(x=>x.value),['DECLINE',first.instanceId,second.instanceId]);
  global.resolveChoiceSelection(state,'P1',second.instanceId);
  assert.equal(first.faceDown,false,'unselected food stays face up');
  assert.equal(second.faceDown,true,'selected food flips');
  assert.equal(target.currentHp,hp,'damage prevented');
  assert.ok(state.player('P2').discard.some(card=>card.instanceId===spell.instanceId));
}
console.log('WAVE2_SHIELD_ARMOR_MULTIPLE_FOOD_CHOICES_OK');
