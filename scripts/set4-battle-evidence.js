'use strict';
var playable=Array.from({length:64},function(_,index){return index+1;});
var focused={
  1:['tests/set4-cost-modifiers.test.js'],3:['tests/set4-cost-modifiers.test.js'],10:['tests/set4-cost-modifiers.test.js'],11:['tests/set4-cost-modifiers.test.js'],12:['tests/set4-cost-modifiers.test.js'],
  4:['tests/set4-kabau.test.js'],9:['tests/set4-kabau.test.js'],19:['tests/set4-kabau.test.js'],31:['tests/set4-kabau.test.js'],
  5:['tests/set4-entry-mechanics.test.js'],14:['tests/set4-entry-mechanics.test.js'],15:['tests/set4-entry-mechanics.test.js'],16:['tests/set4-entry-mechanics.test.js'],
  6:['tests/set4-army-link.test.js'],8:['tests/set4-army-link.test.js','tests/set4-attack-effects.test.js'],13:['tests/set4-army-link.test.js'],
  17:['tests/set4-attack-effects.test.js'],26:['tests/set4-targeting.test.js'],43:['tests/set4-kuchinashi.test.js'],
  46:['tests/set4-spell-core.test.js'],47:['tests/set4-spell-core.test.js'],48:['tests/set4-spell-core.test.js'],49:['tests/set4-spell-core.test.js'],50:['tests/set4-spell-core.test.js'],51:['tests/set4-targeting.test.js'],57:['tests/set4-spell-core.test.js'],61:['tests/set4-spell-core.test.js']
};
var evidence={};
for(var n=1;n<=64;n++){
  var id='set4_'+String(n).padStart(3,'0'),ready=playable.indexOf(n)!==-1;
  evidence[id]={status:ready?'PLAYABLE':'PARTIAL',metadata:['docs/mushijingi-knowledge/SET4_CATALOG.md','tests/set4-definitions.test.js'],engine:ready?['tests/set4-alpha-runtime.test.js'].concat(focused[n]||['tests/set4-completion-effects.test.js']):[],human:ready?['tests/set4-alpha-human-paths.cjs']:[],cpu:ready?['tests/set4-alpha-cpu-runtime.test.js']:[],regression:ready?['tests/run-all.js','tests/run-shared.js']:[],notes:ready?'Released after card-text, generic mechanic, Human/CPU reachability and regression audit.':'Wired but withheld pending complete card-specific effect/ruling evidence.'};
}
module.exports=evidence;
