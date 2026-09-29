'use strict';

// 全エンジンテストを実行する。

var engine = require('./engine-loader.js');

function requireAll() {
  return [
    require('./game-start.test.js'),
    require('./turn.test.js'),
    require('./food-cost.test.js'),
    require('./summon.test.js'),
    require('./field-entry-continuation.test.js'),
    require('./set2-entry-color.test.js'),
    require('./set2-entry-revival.test.js'),
    require('./set2-hatching.test.js'),
    require('./set2-attack-color.test.js'),
    require('./set2-summon-attachment.test.js'),
    require('./set2-capture.test.js'),
    require('./battle.test.js'),
    require('./victory.test.js'),
    require('./card-db.test.js'),
    require('./ibuki.test.js'),
    require('./spell-rollback.test.js'),
    require('./basic-starter.test.js'),
    require('./tobidasu.test.js'),
    require('./starter-deck-battle.test.js'),
    require('./seakakogegumo.test.js'),
    require('./nanafushimodoki.test.js'),
    require('./namiageha.test.js'),
    require('./namiageha_larva.test.js'),
    require('./batta_no_kyousou.test.js'),
    require('./minomushi_no_kakuremino.test.js'),
    require('./okamakiri.test.js'),
    require('./kabutomushi.test.js'),
    require('./hariganemushi_no_michizure.test.js'),
    require('./tamamushiiro_no_uka.test.js'),
    require('./niji_no_kakehashi.test.js'),
    require('./browser-load-order.test.js'),
    require('./ui-perspective.test.js'),
    require('./cpu.test.js'),
    require('./cpu-rainbow-pending.test.js'),
    require('./direct-attack.test.js'),
    require('./battle-foundation.test.js'),
    require('./phase1a-fix-batch.test.js'),
    require('./phase1b-ui.test.js'),
    require('./tutorial-v01.test.js'),
    require('./single-screen-battle.test.js'),
    require('./battle-viewport.test.js'),
    require('./territory-picker.test.js'),
    require('./landscape-field-hand.test.js'),
    require('./landscape-control-bar.test.js'),
    require('./cpu-toast.test.js'),
    require('./experience.test.js')
    ,require('./set1-registry.test.js')
    ,require('./set1-core-mechanics.test.js')
    ,require('./set1-zone-spells.test.js')
    ,require('./set1-phase2-mechanics.test.js')
    ,require('./toolbox-v1.test.js')
    ,require('./toolbox-battle-integration.test.js')
    ,require('./battle-user-deck-ui.test.js')
    ,require('./product-audit-ui.test.js')
    ,require('./full-catalog-v1.test.js')
    ,require('./human-test-fix-01.test.js')
    ,require('./set2-modifier-lifetime.test.js')
    ,require('./set2-audit.test.js')
    ,require('./set2-damage-prevention.test.js')
    ,require('./set2-definitions.test.js')
    ,require('./set2-runtime-smoke.test.js')
    ,require('./set2-targeted-spells.test.js')
    ,require('./multi-attack-continuation.test.js')
    ,require('./set2-defensive-traits.test.js')
    ,require('./set2-territory-suppression.test.js')
    ,require('./set2-hiding.test.js')
    ,require('./set2-retaliation.test.js')
    ,require('./set2-delayed-vulnerability.test.js')
    ,require('./set2-wounded-execution.test.js')
    ,require('./cpu-skill-legality.test.js')
    ,require('./set2-cpu-runtime.test.js')
    ,require('./set2-food-concealment.test.js')
    ,require('./hp-modifier-damage.test.js')
    ,require('./set2-territory-growth.test.js')
    ,require('./set2-opponent-target.test.js')
    ,require('./set2-all-attack-skills.test.js')
    ,require('./set2-existing-mechanics.test.js')
    ,require('./set3-cost-modifiers.test.js')
    ,require('./set3-attack-legality.test.js')
    ,require('./set3-definitions.test.js')
    ,require('./set3-pre-attack-food.test.js')
    ,require('./set3-entry-damage.test.js')
    ,require('./set3-alternative-summon.test.js')
    ,require('./set3-end-turn-condition.test.js')
    ,require('./set3-destruction-routing.test.js')
    ,require('./set3-discard-order.test.js')
    ,require('./set3-continuous-stats.test.js')
    ,require('./set3-attachment-rules.test.js')
    ,require('./set3-food-reveal.test.js')
    ,require('./set3-hide-spell.test.js')
    ,require('./set3-bee-summon.test.js')
    ,require('./set3-hand-trim.test.js')
    ,require('./set3-territory-spell.test.js')
    ,require('./set3-temporary-cost.test.js')
    ,require('./set3-controller-entry.test.js')
    ,require('./set3-territory-decline.test.js')
    ,require('./set3-variable-cost.test.js')
    ,require('./set3-defender-exchange.test.js')
    ,require('./set3-advanced-cards.test.js')
    ,require('./set3-all-attack-skills.test.js')
    ,require('./set3-runtime-smoke.test.js')
    ,require('./set3-cpu-runtime.test.js')
    ,require('./set4-definitions.test.js')
    ,require('./set4-cost-modifiers.test.js')
    ,require('./set4-entry-mechanics.test.js')
    ,require('./set4-kabau.test.js')
    ,require('./set4-targeting.test.js')
    ,require('./set4-attack-effects.test.js')
    ,require('./set4-completion-definitions.test.js')
    ,require('./set4-completion-effects.test.js')
    ,require('./set4-army-link.test.js')
    ,require('./set4-kuchinashi.test.js')
    ,require('./set4-spell-core.test.js')
    ,require('./set4-alpha-status.test.js')
    ,require('./set4-alpha-runtime.test.js')
    ,require('./set4-alpha-cpu-runtime.test.js')
    ,require('./adversarial-set2-set4-audit.test.js')
    ,require('./set4-independent-audit-fixes.test.js')
  ];
}

var total = { passed: 0, failed: 0 };
var all = requireAll();
Promise.all(all.map(function (runMod) {
  // runAll は sync/async どちらでも Promise に正規化して処理する。
  // runAll が同期的に throw しても、ここで Promise 側へ落として全体を止めない。
  return Promise.resolve()
    .then(function () { return runMod.runAll(); })
    .then(function (r) {
      total.passed += (r && r.passed) || 0;
      total.failed += (r && r.failed) || 0;
      console.log('');
      return r;
    })
    .catch(function (err) {
      total.failed += 1;
      console.log('  [RUN-ALL-ERROR] ' + (err && err.message ? err.message : err));
    });
})).then(function () {
  console.log('====================');
  console.log('TOTAL passed=' + total.passed + ' failed=' + total.failed);
  if (total.failed > 0) {
    process.exitCode = 1;
  }
});
