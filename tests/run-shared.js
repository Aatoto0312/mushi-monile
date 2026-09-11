'use strict';

require('./engine-loader.js');

var suites = [
  require('./shared-card-data.test.js'),
  require('./deck-format.test.js'),
  require('./starter-card-data-v1.test.js'),
  require('./battle-adapter.test.js'),
  require('./shadow-comparison.test.js'),
  require('./toolbox.test.js')
];

Promise.all(suites.map(function (suite) { return suite.runAll(); })).then(function (results) {
  var passed = results.reduce(function (sum, result) { return sum + result.passed; }, 0);
  var failed = results.reduce(function (sum, result) { return sum + result.failed; }, 0);
  console.log('====================');
  console.log('SHARED TOTAL passed=' + passed + ' failed=' + failed);
  if (failed > 0) { process.exitCode = 1; }
});
