'use strict';

// Release evidence is intentionally separate from canonical card data. Every
// SET2 identity must pass the same five gates; mechanic-specific tests are
// attached below so an independent audit can trace each PLAYABLE decision.
var special = {
  1:['tests/set2-entry-color.test.js','tests/set2-damage-prevention.test.js'],
  2:['tests/set2-attack-color.test.js'],4:['tests/set2-damage-prevention.test.js'],
  7:['tests/set2-capture.test.js'],9:['tests/set2-hiding.test.js'],
  11:['tests/set2-opponent-target.test.js'],13:['tests/set2-modifier-lifetime.test.js'],
  14:['tests/set2-territory-growth.test.js'],16:['tests/set2-damage-prevention.test.js'],
  17:['tests/set2-wounded-execution.test.js'],19:['tests/set2-entry-revival.test.js','tests/field-entry-continuation.test.js'],
  21:['tests/multi-attack-continuation.test.js'],22:['tests/set2-modifier-lifetime.test.js'],
  24:['tests/set2-territory-suppression.test.js'],25:['tests/set2-hiding.test.js'],
  27:['tests/set2-delayed-vulnerability.test.js'],31:['tests/set2-retaliation.test.js'],
  34:['tests/set2-territory-growth.test.js'],40:['tests/set2-food-concealment.test.js'],
  41:['tests/set2-defensive-traits.test.js'],43:['tests/hp-modifier-damage.test.js'],
  45:['tests/set2-defensive-traits.test.js'],46:['tests/set2-defensive-traits.test.js'],
  47:['tests/set2-damage-prevention.test.js'],48:['tests/set2-existing-mechanics.test.js'],
  49:['tests/set2-existing-mechanics.test.js'],50:['tests/set2-summon-attachment.test.js'],
  51:['tests/set2-hatching.test.js'],52:['tests/set2-territory-suppression.test.js'],
  53:['tests/set2-runtime-smoke.test.js'],54:['tests/set2-targeted-spells.test.js'],
  55:['tests/set2-targeted-spells.test.js']
};

var evidence = {};
for (var number=1; number<=55; number++) {
  var id='set2_'+String(number).padStart(3,'0');
  evidence[id]={
    status:'PLAYABLE',
    metadata:['docs/mushijingi-knowledge/SET2_CATALOG.md','tests/set2-definitions.test.js'],
    engine:['tests/set2-runtime-smoke.test.js','tests/set2-all-attack-skills.test.js','tests/set2-existing-mechanics.test.js'].concat(special[number]||[]),
    human:['tests/set2-human-paths.cjs'],
    cpu:['tests/set2-cpu-runtime.test.js','tests/cpu-skill-legality.test.js'],
    regression:['tests/run-all.js','tests/run-shared.js']
  };
}
module.exports=evidence;
