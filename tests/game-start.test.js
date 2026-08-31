'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();
var Z = global.ZONES;

// Test 1: 初期状態
runner.test('Test1 初期状態が仕様どおり', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  ['P1', 'P2'].forEach(function (pid) {
    var p = state.player(pid);
    runner.assertEqual(p.deck.length, 10, pid + ' Deck');
    runner.assertEqual(p.hand.length, 4, pid + ' Hand');
    runner.assertEqual(p.territory.length, 6, pid + ' Territory');
    runner.assertEqual(p.food.length, 0, pid + ' Food');
    runner.assertEqual(p.field.length, 0, pid + ' Field');
    runner.assertEqual(p.availableCost, 0, pid + ' availableCost');
  });
});

// Test 16: デッキは20枚、初期配置後 Deck=10/Hand=4/Territory=6
runner.test('Test16 デッキ20枚で開始し初期配置が成立', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  ['P1', 'P2'].forEach(function (pid) {
    var p = state.player(pid);
    runner.assertEqual(p.deck.length + p.hand.length + p.territory.length, 20, pid + ' 合計20枚');
    runner.assertEqual(p.deck.length, 10, pid + ' Deck');
    runner.assertEqual(p.hand.length, 4, pid + ' Hand');
    runner.assertEqual(p.territory.length, 6, pid + ' Territory');
  });
});

// デッキ枚数検証: 19枚ならエラー
runner.test('Test16b 20枚以外のデッキは拒否される', function () {
  var bad = h.defById('test_red_1');
  var deck19 = [];
  for (var i = 0; i < 19; i++) { deck19.push(bad); }
  var state = new global.GameState();
  var threw = false;
  try {
    global.startGame(state, deck19, deck19.slice(), h.firstPlayerRng);
  } catch (e) {
    threw = true;
  }
  runner.assert(threw, '19枚デッキは拒否されるべき');
});

module.exports = runner;
