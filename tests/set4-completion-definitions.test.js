'use strict';require('./engine-loader.js');var Runner=require('./lib.js'),runner=new Runner();
function has(number,type){var d=getCardDefinition('set4_'+String(number).padStart(3,'0'));return (d.cardEffects||[]).concat(d.enhancementEffects||[]).some(function(e){return e.type===type;});}
[
 [52,'DESTROY_OPPONENT_CHOICE_AFTER_HOST_ATTACK_KILL'],[53,'COPY_ENHANCEMENT_STATS_TRACK_SOURCE'],[54,'BOTTOM_DECK_HOST_ATTACK_KILL'],
 [55,'REVIVE_MATCHING_LARVA'],[56,'EXCHANGE_OPPONENT_FIELD_FOOD'],[58,'DESTROY_ALL_VISIBLE_INSECTS_END_TURN'],
 [59,'RETURN_OWN_FOOD_CARDS'],[60,'RETURN_OWN_FOOD_AND_SELF_TO_FOOD'],[62,'ATTACH_OWN_FOOD_ENHANCEMENTS'],
 [63,'DAMAGE_AND_CHAIN_SAME_NAME'],[64,'DESTROY_OWN_ATTACHMENT_OPTIONAL_DAMAGE']
].forEach(function(entry){runner.test('SET4 '+entry[0]+' exposes generic '+entry[1],function(){runner.assert(has(entry[0],entry[1]));});});
module.exports=runner;if(require.main===module)runner.runAll();
