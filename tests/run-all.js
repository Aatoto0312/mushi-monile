'use strict';

// 全エンジンテストを実行する。

var engine = require('./engine-loader.js');

function requireAll() {
  return [
    require('./game-start.test.js'),
    require('./turn.test.js'),
    require('./food-cost.test.js'),
    require('./summon.test.js'),
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
    require('./direct-attack.test.js'),
    require('./battle-foundation.test.js'),
    require('./experience.test.js')
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
