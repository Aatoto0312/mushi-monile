'use strict';require('./engine-loader.js');var h=require('./helpers.js');var TestRunner=require('./lib.js');var runner=new TestRunner();
runner.test('Army link exposes every distinct attack skill from visible linked allies',function(){
 var s=h.newGame({rng:h.firstPlayerRng}),major=h.putInsectOnField(s,'P1','set4_006',{hp:1000}),media=h.putInsectOnField(s,'P1','set4_008',{hp:1000}),minor=h.putInsectOnField(s,'P1','set4_013',{hp:1000});
 var names=getEffectiveAttackSkills(s,major).map(function(skill){return skill.name;});
 ['蟻の蹂躙','毒針','橋渡し'].forEach(function(name){runner.assert(names.indexOf(name)!==-1,name);});
 runner.assertEqual(new Set(names).size,names.length);runner.assert(media.zone===ZONES.FIELD&&minor.zone===ZONES.FIELD);
});
runner.test('Army link ignores face-down allies and disappears while keyword skills are suppressed',function(){
 var s=h.newGame({rng:h.firstPlayerRng}),major=h.putInsectOnField(s,'P1','set4_006',{hp:1000}),media=h.putInsectOnField(s,'P1','set4_008',{hp:1000});media.faceDown=true;
 runner.assert(getEffectiveAttackSkills(s,major).every(function(skill){return skill.name!=='毒針';}));major.runtimeFlags={suppressKeywordSkills:true};
 runner.assertEqual(getEffectiveAttackSkills(s,major).length,1);
});
module.exports=runner;if(require.main===module)runner.runAll();
