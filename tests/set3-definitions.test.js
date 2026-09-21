'use strict';
require('./engine-loader.js');
var TestRunner=require('./lib.js'); var runner=new TestRunner();
var records=require('../js/cards/full-catalog-data.js').filter(function(c){return c.set==='BOOSTER_SET_3';});

runner.test('SET3 runtime preserves all 60 canonical identities and remains unreleased during audit',function(){
  runner.assertEqual(records.length,60);
  records.forEach(function(record,index){
    var def=global.getCardDefinition(record.id); runner.assert(def,record.id);
    runner.assertEqual(def.officialNumber,(index+1)+'/60');
    ['name','type','color','cost','baseHp'].forEach(function(key){runner.assertEqual(def[key],record[key],record.id+' '+key);});
    runner.assertEqual(def.implementationStatus,'PARTIAL'); runner.assertEqual(def.isPlayable(),false);
  });
});

runner.test('SET3 existing lure, mimic, cannot-attack, armor and field buff mechanics are declarative',function(){
  runner.assert(global.getCardDefinition('set3_034').skills.some(function(s){return s.gitai;}));
  runner.assert(global.getCardDefinition('set3_044').skills.some(function(s){return s.targetRule==='FORCE_ATTACK_TO_SELF_GROUP';}));
  runner.assertEqual(global.getCardDefinition('set3_028').passiveAbilities[0].effects[0].type,'CANNOT_ATTACK');
  [46,47].forEach(function(n){var effects=global.getCardDefinition('set3_0'+n).enhancementEffects; runner.assert(effects.some(function(e){return e.stat==='HP';})); runner.assert(effects.some(function(e){return e.stat==='AP';}));});
  runner.assertEqual(global.getCardDefinition('set3_055').cardEffects[0].type,'APPLY_STAT_MODIFIER_TO_ALL_OWN_FIELD');
});

module.exports=runner; if(require.main===module){runner.runAll();}
