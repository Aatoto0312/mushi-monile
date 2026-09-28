'use strict';
require('./engine-loader.js');
var h=require('./helpers.js'),Runner=require('./lib.js'),runner=new Runner();

function copy(source,id){var raw=JSON.parse(JSON.stringify(getCardDefinition(source)));raw.id=id;raw.implementationStatus='test';var d=new CardDefinition(raw);Object.keys(raw).forEach(function(k){d[k]=raw[k];});cardRegistry.register(d);return d;}
function attach(state,playerId,host,cardId){var card=h.addToHandRaw(state,playerId,getCardDefinition(cardId));moveCard(state,card.instanceId,'HAND','FIELD',{playerId:playerId});state.player(playerId).field.splice(state.player(playerId).field.indexOf(card),1);card.zone='ATTACHMENT';host.attachments.push(card);return card;}

runner.test('blind-route attack resolves one hidden opponent hand card before damage',function(){
 var d=copy('set4_007','test_set4_blind_route'),s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);var a=h.putInsectOnField(s,'P1',d.id,{hp:2000}),target=h.putInsectOnField(s,'P2','set1_003',{hp:5000});s.player('P2').hand=[];
 var routed=h.addToHandRaw(s,'P2',getCardDefinition('set1_004')),before=s.player('P2').hand.length;
 performAttack(s,a.instanceId,target.instanceId,'INSECT',d.skills[1].id);
 runner.assertEqual(s.player('P2').hand.length,before-1);runner.assert(s.player('P2').field.some(function(c){return c.instanceId===routed.instanceId;}));runner.assertEqual(s.pendingEffect,null);
});

runner.test('destroy-attachment attack cost uses shared selection and destroys selected attachment',function(){
 var d=copy('set4_039','test_set4_attachment_cost'),s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);var a=h.putInsectOnField(s,'P1',d.id,{hp:2000}),target=h.putInsectOnField(s,'P2','set1_003',{hp:5000}),cost=attach(s,'P1',a,'set4_046');
 performAttack(s,a.instanceId,target.instanceId,'INSECT',d.skills[1].id);
 runner.assertEqual(s.pendingEffect.selectionPurpose,'ATTACK_ADDITIONAL_COST_ATTACHMENT');resolveCardSelection(s,'P1',[cost.instanceId],true);
 runner.assertEqual(a.attachments.length,0);runner.assert(s.player('P1').discard.some(function(c){return c.instanceId===cost.instanceId;}));runner.assertEqual(s.pendingEffect,null);
});

runner.test('attack optional discard return can be declined and completes',function(){
 var d=copy('set4_045','test_set4_optional_discard'),s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);var a=h.putInsectOnField(s,'P1',d.id,{hp:2000}),target=h.putInsectOnField(s,'P2','set1_003',{hp:5000}),discard=h.addToHandRaw(s,'P2',getCardDefinition('set1_004'));moveCard(s,discard.instanceId,'HAND','DISCARD',{playerId:'P2'});
 performAttack(s,a.instanceId,target.instanceId,'INSECT',d.skills[0].id);runner.assertEqual(s.pendingEffect.selectionPurpose,'OPTIONAL_BOTTOM_DECK_DISCARD');resolveCardSelection(s,'P1',[],true);
 runner.assertEqual(discard.zone,'DISCARD');runner.assertEqual(s.pendingEffect,null);
});
runner.test('destroyed retrieval insect offers an optional own discarded enhancement',function(){
 var d=copy('set4_040','test_set4_retrieve_enhancement'),s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);var victim=h.putInsectOnField(s,'P2',d.id,{hp:100}),att=h.addToHandRaw(s,'P2',getCardDefinition('set4_046'));moveCard(s,att.instanceId,'HAND','DISCARD',{playerId:'P2'});var a=h.putInsectOnField(s,'P1','set1_003',{hp:2000});performAttack(s,a.instanceId,victim.instanceId,'INSECT',getCardDefinition(a.cardId).skills[0].id);runner.assertEqual(s.pendingEffect.selectionPurpose,'RETURN_OWN_DISCARD_ENHANCEMENT');resolveCardSelection(s,'P2',[att.instanceId],true);runner.assertEqual(att.zone,'HAND');
});

runner.test('attack-kill sickle lets defender destroy another insect without territory',function(){
 var s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);var a=h.putInsectOnField(s,'P1','set1_003',{hp:2000});attach(s,'P1',a,'set4_052');var victim=h.putInsectOnField(s,'P2','set1_003',{hp:100}),other=h.putInsectOnField(s,'P2','set1_004',{hp:2000}),territory=s.player('P2').territory.length;performAttack(s,a.instanceId,victim.instanceId,'INSECT',getCardDefinition(a.cardId).skills[0].id);runner.assertEqual(s.pendingEffect.selectionPurpose,'ATTACK_KILL_ENHANCEMENT_DESTROY');resolveCardSelection(s,'P2',[other.instanceId],true);runner.assertEqual(other.zone,'DISCARD');resolveTerritoryDrawSelection(s,'P2',s.pendingEffect.options[0]);runner.assertEqual(s.player('P2').territory.length,territory-1);
});

runner.test('attack-kill fan bottoms the destroyed target face-down and still draws territory',function(){
 var s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);var a=h.putInsectOnField(s,'P1','set1_003',{hp:2000});attach(s,'P1',a,'set4_054');var victim=h.putInsectOnField(s,'P2','set1_003',{hp:100}),territory=s.player('P2').territory.length;performAttack(s,a.instanceId,victim.instanceId,'INSECT',getCardDefinition(a.cardId).skills[0].id);runner.assertEqual(victim.zone,'DECK');runner.assert(victim.faceDown);resolveTerritoryDrawSelection(s,'P2',s.pendingEffect.options[0]);runner.assertEqual(s.player('P2').territory.length,territory-1);
});

runner.test('copied enhancement tracks printed stats and is destroyed with its source',function(){
 var d=copy('set4_053','test_set4_copy_enhancement'),s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);h.ensureCost(s,'P1',20);var host=h.putInsectOnField(s,'P1','set1_003',{hp:1000}),source=attach(s,'P1',host,'set4_046'),held=h.addToHandRaw(s,'P1',d);
 useEnhancement(s,'P1',held.instanceId,host.instanceId);runner.assertEqual(s.pendingEffect.selectionPurpose,'COPY_ENHANCEMENT_SOURCE');resolveCardSelection(s,'P1',[source.instanceId],true);
 runner.assertEqual(host.attachments.length,2);runner.assertEqual(calculateMaxHp(host,s),getCardDefinition(host.cardId).baseHp);var copied=host.attachments.filter(function(c){return c.instanceId===held.instanceId;})[0];runner.assert(copied.runtimeFlags.copiedStatEffects.length>0);
 host.attachments.splice(host.attachments.indexOf(source),1);source.zone='DISCARD';s.player('P1').discard.push(source);resolveAttachmentDiscarded(s,source);runner.assertEqual(copied.zone,'DISCARD');
});

runner.test('matching larva revival enters serially and cannot attack that turn',function(){
 var d=copy('set4_055','test_set4_larva_revive'),s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);h.ensureCost(s,'P1',20);var adult=h.putInsectOnField(s,'P1','set1_004'),larva=h.addToHandRaw(s,'P1',getCardDefinition('set4_011'));moveCard(s,larva.instanceId,'HAND','DISCARD',{playerId:'P1'});var held=h.addToHandRaw(s,'P1',d);
 useSpell(s,'P1',held.instanceId);resolveCardSelection(s,'P1',[larva.instanceId],true);runner.assertEqual(larva.zone,'FIELD');runner.assert(larva.runtimeFlags.attackRestrictions.length===1);runner.assert(adult.zone==='FIELD');
});

runner.test('opponent field and food insects exchange without changing ownership',function(){
 var d=copy('set4_056','test_set4_exchange'),s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);h.ensureCost(s,'P1',20);var field=h.putInsectOnField(s,'P2','set1_003'),food=h.addToFoodRaw(s,'P2',getCardDefinition('set1_004')),held=h.addToHandRaw(s,'P1',d);
 useSpell(s,'P1',held.instanceId);resolveCardSelection(s,'P1',[field.instanceId,food.instanceId],true);runner.assertEqual(field.zone,'FOOD');runner.assertEqual(food.zone,'FIELD');runner.assertEqual(food.ownerId,'P2');
});

runner.test('mass destruction preserves hidden insects and ends the active turn',function(){
 var d=copy('set4_058','test_set4_mass_destroy'),s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);h.ensureCost(s,'P1',20);var own=h.putInsectOnField(s,'P1','set1_003'),enemy=h.putInsectOnField(s,'P2','set1_004'),hidden=h.putInsectOnField(s,'P2','set1_003');hidden.faceDown=true;var held=h.addToHandRaw(s,'P1',d);
 useSpell(s,'P1',held.instanceId);runner.assertEqual(own.zone,'DISCARD');runner.assertEqual(enemy.zone,'DISCARD');runner.assertEqual(hidden.zone,'FIELD');runner.assertEqual(s.activePlayerId,'P2');
});

runner.test('return-food spell selects up to two enhancements and supports zero',function(){
 var d=copy('set4_059','test_set4_return_food'),s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);h.ensureCost(s,'P1',20);var one=h.addToFoodRaw(s,'P1',getCardDefinition('set4_046')),two=h.addToFoodRaw(s,'P1',getCardDefinition('set4_047')),held=h.addToHandRaw(s,'P1',d);
 useSpell(s,'P1',held.instanceId);resolveCardSelection(s,'P1',[one.instanceId,two.instanceId],true);runner.assertEqual(one.zone,'HAND');runner.assertEqual(two.zone,'HAND');runner.assertEqual(s.pendingEffect,null);
});

runner.test('food-work returns one food and places itself as non-generating food this turn',function(){
 var d=copy('set4_060','test_set4_food_work'),s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);h.ensureCost(s,'P1',20);var food=h.addToFoodRaw(s,'P1',getCardDefinition('set1_003')),held=h.addToHandRaw(s,'P1',d);useSpell(s,'P1',held.instanceId,food.instanceId);runner.assertEqual(food.zone,'HAND');runner.assertEqual(held.zone,'FOOD');runner.assertEqual(held.runtimeFlags.foodCostSuppressedTurn,s.turnNumber);
});

runner.test('food enhancements attach sequentially to chosen legal hosts',function(){
 var d=copy('set4_062','test_set4_attach_food'),s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);h.ensureCost(s,'P1',20);var host=h.putInsectOnField(s,'P1','set1_003'),one=h.addToFoodRaw(s,'P1',getCardDefinition('set4_046')),two=h.addToFoodRaw(s,'P1',getCardDefinition('set4_047')),held=h.addToHandRaw(s,'P1',d);
 useSpell(s,'P1',held.instanceId);resolveCardSelection(s,'P1',[one.instanceId,two.instanceId],true);resolveCardSelection(s,'P1',[host.instanceId],true);resolveCardSelection(s,'P1',[host.instanceId],true);runner.assertEqual(host.attachments.length,2);runner.assertEqual(s.pendingEffect,null);
});

runner.test('same-name damage offers at most one second matching target',function(){
 var d=copy('set4_063','test_set4_chain_damage'),s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);h.ensureCost(s,'P1',20);var first=h.putInsectOnField(s,'P2','set1_003',{hp:2000}),second=h.putInsectOnField(s,'P2','set1_003',{hp:2000}),held=h.addToHandRaw(s,'P1',d);useSpell(s,'P1',held.instanceId,first.instanceId);runner.assertEqual(s.pendingEffect.selectionPurpose,'CHAIN_SAME_NAME_DAMAGE');resolveCardSelection(s,'P1',[second.instanceId],true);runner.assertEqual(first.currentHp,1500);runner.assertEqual(second.currentHp,1500);
});

runner.test('sacrificial enhancement spell can deal optional damage and completes',function(){
 var d=copy('set4_064','test_set4_sacrifice_damage'),s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);h.ensureCost(s,'P1',20);var host=h.putInsectOnField(s,'P1','set1_003'),att=attach(s,'P1',host,'set4_046'),enemy=h.putInsectOnField(s,'P2','set1_004',{hp:2000}),held=h.addToHandRaw(s,'P1',d);useSpell(s,'P1',held.instanceId);resolveCardSelection(s,'P1',[att.instanceId],true);resolveCardSelection(s,'P1',[enemy.instanceId],true);runner.assertEqual(att.zone,'DISCARD');runner.assertEqual(enemy.currentHp,1300);runner.assertEqual(s.pendingEffect,null);
});

module.exports=runner;if(require.main===module)runner.runAll();
