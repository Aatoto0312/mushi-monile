'use strict';

// 軽量テストフレームワーク(Node実行用)

function TestRunner() {
  this.tests = [];
  this.current = null;
}

TestRunner.prototype.test = function (name, fn) {
  this.tests.push({ name: name, fn: fn });
};

TestRunner.prototype.assert = function (cond, message) {
  if (!cond) {
    throw new Error(message || 'assertion failed');
  }
};

TestRunner.prototype.assertTrue = function (cond, message) {
  if (!cond) {
    throw new Error(message || 'assertion failed');
  }
};

TestRunner.prototype.assertEqual = function (actual, expected, message) {
  if (actual !== expected) {
    throw new Error(
      (message ? message + ': ' : '') +
      'expected ' + JSON.stringify(expected) + ' but got ' + JSON.stringify(actual)
    );
  }
};

// 1テストの fn をちょうど1回だけ実行し、結果を1回だけ報告する。
// fn が同期的に throw しても非同期 Promise が reject しても、Promise に正規化して処理する。
TestRunner.prototype._runOne = function (t) {
  var self = this;
  return Promise.resolve()
    .then(function () { return t.fn(); })
    .then(
      function () { console.log('  [PASS] ' + t.name); },
      function (err) {
        console.log('  [FAIL] ' + t.name + ' -> ' + (err && err.message ? err.message : err));
        throw err;
      }
    );
};

TestRunner.prototype.runAll = function () {
  var self = this;
  var passed = 0;
  var failed = 0;
  var failures = [];

  return Promise.all(this.tests.map(function (t) {
    return self._runOne(t).then(
      function () { passed++; },
      function (err) {
        failed++;
        failures.push({ name: t.name, error: err });
      }
    );
  })).then(function () {
    console.log('\n=====RESULTS=====');
    console.log('Total: ' + (passed + failed) + '  Passed: ' + passed + '  Failed: ' + failed);
    if (failures.length) {
      console.log('\nFailures:');
      failures.forEach(function (f) {
        console.log('  - ' + f.name);
        if (f.error && f.error.stack) {
          console.log('    ' + f.error.stack.split('\n').slice(0, 4).join('\n    '));
        }
      });
      process.exitCode = 1;
    }
    return { passed: passed, failed: failed };
  });
};

module.exports = TestRunner;
