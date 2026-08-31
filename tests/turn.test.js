'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();
var Z = global.ZONES;

// Test 2/17: 先攻1ターン目はドローしない → Hand=4
runner.test('Test2 先攻1ターン目はHand=4のまま', function () {
  var state = h.newGame({ rng: h.firstPlayerRng }); // P1先攻
  runner.assertEqual(state.firstPlayerId, 'P1', '先攻はP1');
  runner.assertEqual(state.activePlayerId, 'P1', 'アクティブはP1');
  runner.assertEqual(state.player('P1').hand.length, 4, 'P1 Hand');
});

runner.test('Test17 先攻1ターン目はHand=4(通常ドローされない)', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  runner.assertEqual(state.player('P1').hand.length, 4, 'P1 Hand');
  runner.assertEqual(state.player('P2').hand.length, 4, 'P2 Hand(未ターン)');
});

// Test 3: 後攻1ターン目はドローしてHand=5
runner.test('Test3 後攻1ターン目はHand=5', function () {
  var state = h.newGame({ rng: h.firstPlayerRng }); // P1先攻
  h.toMainPhase(state); // P1のターン開始+メイン
  global.endTurn(state); // P2へ交代, turnNumber=2, P2がドロー
  runner.assertEqual(state.activePlayerId, 'P2', 'アクティブはP2');
  runner.assertEqual(state.player('P2').hand.length, 5, 'P2 Hand=5');
});

// Test 18: 通常ドローでは onTerritoryDraw が発火しない
runner.test('Test18 通常ドローでonTerritoryDrawは発火しない', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var fired = 0;
  state.onTerritoryDraw = function () { fired++; };
  global.drawCard(state, 'P1');
  runner.assertEqual(fired, 0, '通常ドローでは発火しない');
  global.drawTerritoryCard(state, 'P1');
  if (state.pendingEffect && state.pendingEffect.type === 'TERRITORY_DRAW_SELECTION') {
    var territoryInst = state.pendingEffect.options[0];
    global.resolveTerritoryDrawSelection(state, 'P1', territoryInst);
  }
  runner.assertEqual(fired, 1, '縄張りドローで発火する');
});

// Test 27: 非アクティブプレイヤーは不可
runner.test('Test27 非アクティブプレイヤーは操作不可', function () {
  var state = h.newGame({ rng: h.firstPlayerRng }); // P1アクティブ
  h.toMainPhase(state);
  var p2Hand = h.firstHandInsect(state, 'P2');
  var p1Summon = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  var p2Summon = h.addToHandRaw(state, 'P2', h.defById('test_red_1'));

  // 非アクティブ(P2)はエサセット不可
  state.phase = global.Phases.SET_PHASE;
  var threw = false;
  try { global.setFood(state, 'P2', p2Hand ? p2Hand.instanceId : null); } catch (e) { threw = true; }
  runner.assert(threw, '非アクティブはエサセット不可');

  // 非アクティブ(P2)は召喚不可
  state.phase = global.Phases.MAIN_PHASE;
  threw = false;
  try { global.summonInsect(state, 'P2', p2Summon.instanceId); } catch (e) { threw = true; }
  runner.assert(threw, '非アクティブは召喚不可');

  // 非アクティブ(P2)の虫は攻撃対象にならない(合法対象が空)
  var p2Attacker = h.putInsectOnField(state, 'P2', 'test_red_1');
  var targets = global.getLegalAttackTargets(state, p2Attacker.instanceId);
  runner.assertEqual(targets.length, 0, 'P2の虫は(アクティブでないので)対象なし');
});

// Test 29: MAIN_PHASE以外で召喚・攻撃不可
runner.test('Test29 MAIN_PHASE以外では召喚・攻撃不可', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var p1Summon = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));

  // SET_PHASEで召喚しようとすると拒否
  state.phase = global.Phases.SET_PHASE;
  var threw = false;
  try { global.summonInsect(state, 'P1', p1Summon.instanceId); } catch (e) { threw = true; }
  runner.assert(threw, 'SET_PHASEで召喚は拒否');

  // DRAW_PHASEで攻撃しようとすると拒否
  state.phase = global.Phases.DRAW_PHASE;
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');
  var defender = h.putInsectOnField(state, 'P2', 'test_blue_1');
  threw = false;
  try {
    global.performAttack(state, attacker.instanceId, defender.instanceId, 'INSECT', null);
  } catch (e) { threw = true; }
  runner.assert(threw, 'DRAW_PHASEで攻撃は拒否');
});

module.exports = runner;
