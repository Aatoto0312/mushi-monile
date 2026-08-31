'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();

// ---- エンジンロード ----
// engine-loader.js は run-all.js と共有される(Nodeのrequireキャッシュにより二重実行されない)
require('./engine-loader.js');
require('../js/engine/cpu-agent.js');
require('../js/engine/cpu-runner.js');

// ---- UIテスト用の最小DOMスタブ ----
var registry = {};
function makeElement(tag) {
  var el = {
    tagName: tag || 'div',
    children: [],
    dataset: {},
    style: {},
    classList: {
      _set: {},
      add: function (c) { this._set[c] = true; },
      remove: function (c) { delete this._set[c]; },
      contains: function (c) { return !!this._set[c]; }
    },
    textContent: '',
    innerHTML: '',
    _listeners: {},
    onclick: null,
    appendChild: function (child) { this.children.push(child); return child; },
    replaceWith: function () {},
    addEventListener: function (type, fn) { (this._listeners[type] = this._listeners[type] || []).push(fn); },
    dispatch: function (type) { (this._listeners[type] || []).forEach(function (f) { f && f({ preventDefault: function () {} }); }); },
    setAttribute: function () {},
    querySelector: function () { return null; },
    querySelectorAll: function () { return []; },
    scrollTop: 0,
    scrollHeight: 0,
    disabled: false,
    type: tag === 'button' ? 'button' : 'input'
  };
  return el;
}
function getById(id) {
  if (!registry[id]) { registry[id] = makeElement('div'); }
  return registry[id];
}

// テストごとにglobal/DOM状態を自前で初期化・後始末する。
// run-all で先行テスト(require cacheや他モジュールのglobal.document)の影響を受けないよう、
// 書き込み側(document.getElementById)と読み出し側(getById)が同一のregistryを参照する。
function resetDom() {
  registry = {};
  global.document = {
    readyState: 'loading',
    _listeners: {},
    addEventListener: function (type, fn) { (this._listeners[type] = this._listeners[type] || []).push(fn); },
    dispatch: function (type) { (this._listeners[type] || []).forEach(function (f) { f && f(); }); },
    getElementById: getById,
    createElement: makeElement,
    querySelector: function (sel) {
      if (sel && sel[0] === '#') { return getById(sel.slice(1)); }
      return null;
    },
    querySelectorAll: function () { return []; }
  };
}
global.document = {
  readyState: 'loading',
  _listeners: {},
  addEventListener: function (type, fn) { (this._listeners[type] = this._listeners[type] || []).push(fn); },
  dispatch: function (type) { (this._listeners[type] || []).forEach(function (f) { f && f(); }); },
  getElementById: getById,
  createElement: makeElement,
  querySelector: function (sel) {
    if (sel && sel[0] === '#') { return getById(sel.slice(1)); }
    return null;
  },
  querySelectorAll: function () { return []; }
};
global.window = global;
global.alert = function () {};
global.confirm = function () { return true; };

require('../js/ui/card-ui.js');
require('../js/ui/battle-log-ui.js');
require('../js/ui/battle-ui.js');

// ---- シナリオヘルパー ----

// P1の1ターンを通り抜け、P2の SET_PHASE へ到達する（stateは新規ゲーム想定）
function reachP2SetPhase(state) {
  global.enterSetPhase(state);
  if (state.player('P1').hand.length > 0) {
    global.setFood(state, 'P1', state.player('P1').hand[0].instanceId);
  }
  global.enterMainPhase(state);
  global.endTurn(state); // -> P2 DRAW_PHASE (endTurn内でドロー)
  global.enterSetPhase(state); // -> P2 SET_PHASE
  return state;
}

// 自分の場に虫を並べる（attackerCount体）。相手には減らない高HP虫を1体置く
function placeAttackers(state, playerId, attackerCount) {
  var oppId = state.opponentOf(playerId);
  h.putInsectOnField(state, oppId, 'test_red_1', { hp: 999999 }); // 破壊されない相手
  for (var i = 0; i < attackerCount; i++) {
    h.putInsectOnField(state, playerId, 'test_red_1');
  }
}

// ---- Test C1: エサ ----
runner.test('TestC1 CPUはエサをセットできる(SET_FOOD)', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP2SetPhase(state);
  var cpu = new global.CpuAgent('P2', { rng: function () { return 0; } });
  var action = cpu.step(state);
  runner.assertEqual(action.type, 'SET_FOOD', 'SET_FOODを選択');
});

// ---- Test C2: メイン移行 ----
runner.test('TestC2 CPUはメインフェイズへ移行する(ENTER_MAIN_PHASE)', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP2SetPhase(state);
  global.setFood(state, 'P2', state.player('P2').hand[0].instanceId); // エサ済み
  var cpu = new global.CpuAgent('P2', { rng: function () { return 0; } });
  var action = cpu.step(state);
  runner.assertEqual(action.type, 'ENTER_MAIN_PHASE', 'ENTER_MAIN_PHASEを選択');
});

// ---- Test C3: 召喚 ----
runner.test('TestC3 CPUは合法に虫を召喚できる(SUMMON)', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP2SetPhase(state);
  global.setFood(state, 'P2', state.player('P2').hand[0].instanceId);
  global.enterMainPhase(state);
  h.ensureCost(state, 'P2', 2);
  var cpu = new global.CpuAgent('P2', { rng: function () { return 0; } });
  var action = cpu.step(state);
  runner.assertEqual(action.type, 'SUMMON', 'SUMMONを選択');
});

// ---- Test C4: 攻撃 ----
runner.test('TestC4 CPUは合法に攻撃できる(ATTACK)', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP2SetPhase(state);
  global.setFood(state, 'P2', state.player('P2').hand[0].instanceId);
  global.enterMainPhase(state);
  state.player('P2').hand = []; // 召喚候補をなくすため
  h.putInsectOnField(state, 'P2', 'test_red_1');
  h.putInsectOnField(state, 'P1', 'test_red_1', { hp: 999999 }); // 合法対象
  var cpu = new global.CpuAgent('P2', { rng: function () { return 0; } });
  var action = cpu.step(state);
  runner.assertEqual(action.type, 'ATTACK', 'ATTACKを選択');
});

// ---- Test C5: 再攻撃禁止 ----
runner.test('TestC5 CPUは攻撃済み虫で再攻撃しない(END_TURN)', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP2SetPhase(state);
  global.setFood(state, 'P2', state.player('P2').hand[0].instanceId);
  global.enterMainPhase(state);
  state.player('P2').hand = [];
  var attacker = h.putInsectOnField(state, 'P2', 'test_red_1');
  h.putInsectOnField(state, 'P1', 'test_red_1', { hp: 999999 });
  attacker.attackedThisTurn = true; // 既に攻撃済み
  var cpu = new global.CpuAgent('P2', { rng: function () { return 0; } });
  var action = cpu.step(state);
  runner.assertEqual(action.type, 'END_TURN', '攻撃済みのためEND_TURNを選択');
});

// ---- Test C6: 人間(P1)のpendingで停止 ----
runner.test('TestC6 CPUは人間(P1)のpending中は停止する', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToTerritoryRaw(state, 'P1', h.defById('test_red_1'));
  global.triggerTerritoryDrawSelection(state, 'P1');
  var cpu = new global.CpuAgent('P2', { rng: function () { return 0; } });
  var action = cpu.step(state);
  runner.assertEqual(action, null, 'P1 pending中はCPUがnullを返す');
});

// ---- Test C7: CPU(P2)のpendingを自動解決 ----
runner.test('TestC7 CPUは自分(P2)の縄張りpendingを解決できる', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToTerritoryRaw(state, 'P2', h.defById('test_red_1'));
  global.triggerTerritoryDrawSelection(state, 'P2');
  var cpu = new global.CpuAgent('P2', { rng: function () { return 0; } });
  var action = cpu.step(state);
  runner.assertEqual(action.type, 'RESOLVE_TERRITORY_SELECTION', 'RESOLVE_TERRITORY_SELECTIONを選択');
});

// ---- Test C8: pending後CPU再開とP2 pendingのP1ターン中自動解決 ----
runner.test('TestC8 runnerはP2 pendingを解決しturnを再開する', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP2SetPhase(state);
  h.addToTerritoryRaw(state, 'P2', h.defById('test_red_1'));
  global.triggerTerritoryDrawSelection(state, 'P2'); // P2のpending
  // 相手(P1)に破壊されない高HP虫を置き、CPUの追加行動(攻撃→P1縄張りドロー)が
  // 新たなP1 pendingを発生させないようにしておく(reachP2SetPhase直後はP1の場が空)。
  h.putInsectOnField(state, 'P1', 'test_red_1', { hp: 999999 });
  var uiStub = { render: function () {} };
  var runner2 = new global.CpuRunner({ state: state }, uiStub, { thinkDelay: 0, maxActionsPerTurn: 50 });
  return runner2.runTurn().then(function () {
    runner.assertEqual(global.getPendingEffect(state), null, 'P2 pendingが解決された');
    runner.assertTrue(state.player('P2').food.length > 0, 'pending解決後もturnが再開されエサをセットした');
  });
});

// ---- Test C9: maxActionsで停止 ----
runner.test('TestC9 maxActionsPerTurnでCPU行動が止まる', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP2SetPhase(state);
  global.setFood(state, 'P2', state.player('P2').hand[0].instanceId);
  global.enterMainPhase(state);
  state.player('P2').hand = [];
  placeAttackers(state, 'P2', 60); // 60体の攻撃候補 + 破壊されない相手
  var attacks = 0;
  var uiStub = { render: function () {} };
  var runner2 = new global.CpuRunner({ state: state }, uiStub, {
    thinkDelay: 0,
    maxActionsPerTurn: 50,
    onActionLog: function (m) { if (m && m.indexOf('攻撃') !== -1) { attacks++; } }
  });
  runner.assertEqual(runner2.maxActions, 50, 'maxActions=50になる');
  return runner2.runTurn().then(function () {
    runner.assertTrue(attacks <= 50, '攻撃回数が上限50を超えない(実際=' + attacks + ')');
    runner.assertEqual(attacks, 50, 'ちょうど50で強制ターン終了する(実際=' + attacks + ')');
    runner.assertTrue(state.activePlayerId !== 'P2' || state.phase === global.Phases.GAME_OVER, '上限到達でCPUターンが終了する');
  });
});

// ---- Test C10: runTurn多重起動なし ----
runner.test('TestC10 runTurn多重起動で重複実行されない', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP2SetPhase(state);
  global.setFood(state, 'P2', state.player('P2').hand[0].instanceId);
  global.enterMainPhase(state);
  state.player('P2').hand = [];
  placeAttackers(state, 'P2', 10); // 10体 → 10回攻撃後 END_TURN
  var totalLogs = 0;
  var uiStub = { render: function () {} };
  var runner2 = new global.CpuRunner({ state: state }, uiStub, {
    thinkDelay: 0,
    maxActionsPerTurn: 50,
    onActionLog: function () { totalLogs++; }
  });
  var first = runner2.runTurn();
  runner.assertTrue(runner2.isRunning, '最初のrunTurn実行中はisRunning=true');
  var second = runner2.runTurn(); // 実行中なので即解決・再起動しない
  return Promise.resolve(second).then(function () {
    runner.assertTrue(true, '多重呼び出しがエラーなく解決する');
  }).then(function () {
    return first;
  }).then(function () {
    // 10回攻撃 + 1回 END_TURN = 11ログ（二重実行なら増える）
    runner.assertEqual(totalLogs, 11, '単一シーケンスのみ実行(重複実行なし, logs=' + totalLogs + ')');
  });
});

// ---- Test C11: CPU戦でP1下/P2上固定 ----
runner.test('TestC11 CPU戦はP1を下(あなた)、P2を上(CPU)に固定する', function () {
  resetDom();
  var engine = new global.GameEngine();
  var ui = new global.BattleUI(engine);
  ui.cpuMode = true;
  ui.cpuRunner = null; // 自動CPU再生を止めて視点のみ検証
  var deck = global.buildStarterTestDeck();
  engine.newGame(deck, deck.slice(), h.firstPlayerRng);
  ui.state = engine.state;
  ui.state.activePlayerId = 'P2';
  ui.state.phase = global.Phases.MAIN_PHASE;
  ui.render();
  runner.assertTrue(getById('self-player-label').textContent.indexOf('P1') !== -1, 'CPU戦: 下はP1(あなた)');
  runner.assertTrue(getById('opp-player-label').textContent.indexOf('P2') !== -1, 'CPU戦: 上はP2(CPU)');

  // アクティブがP1に変わっても固定のまま
  ui.state.activePlayerId = 'P1';
  ui.render();
  runner.assertTrue(getById('self-player-label').textContent.indexOf('P1') !== -1, 'P1ターンでも下はP1固定');
  runner.assertTrue(getById('opp-player-label').textContent.indexOf('P2') !== -1, 'P1ターンでも上はP2固定');
});

// ---- Test C12: CPU手札非公開 ----
runner.test('TestC12 CPU(P2)の手札は裏向きで非公開', function () {
  resetDom();
  var engine = new global.GameEngine();
  var ui = new global.BattleUI(engine);
  ui.cpuMode = true;
  ui.cpuRunner = null;
  var deck = global.buildStarterTestDeck();
  engine.newGame(deck, deck.slice(), h.firstPlayerRng);
  ui.state = engine.state;
  ui.state.activePlayerId = 'P2';
  ui.state.phase = global.Phases.MAIN_PHASE;
  var p2HandCount = ui.state.player('P2').hand.length;
  ui.render();
  var zone = getById('opp-hand-zone');
  var cardRow = zone.children[0];
  var cards = cardRow ? cardRow.children : [];
  runner.assertTrue(cards.length === Math.min(p2HandCount, 7), 'P2手札の枚数分だけ裏向きカードが描画される');
  var allHidden = cards.every(function (c) {
    if (c.className.indexOf('face-down') === -1) { return false; }
    var revealed = c.children.some(function (ch) { return ch.className && ch.className.indexOf('card-name-full') !== -1; });
    return !revealed;
  });
  runner.assertTrue(allHidden, 'P2手札が裏向きでカード名が公開されない');
});

// ---- Test C13: P1ターン中のP2 pendingを自動解決 ----
runner.test('TestC13 P1ターン中のP2 pendingをCPUが自動解決する', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  // newGame直後は P1 の通常ターン(DRAW_PHASE)が進行中のまま
  runner.assertEqual(state.activePlayerId, 'P1', '前提: P1のターン');
  runner.assertEqual(state.phase, global.Phases.DRAW_PHASE, '前提: P1はDRAW_PHASE');

  h.addToTerritoryRaw(state, 'P2', h.defById('test_red_1'));
  global.triggerTerritoryDrawSelection(state, 'P2'); // P2のpendingを発生させる
  var p2HandBefore = state.player('P2').hand.length;

  var uiStub = { render: function () {} };
  var runner2 = new global.CpuRunner({ state: state }, uiStub, { thinkDelay: 0, maxActionsPerTurn: 50 });

  return runner2.runTurn().then(function () {
    runner.assertEqual(global.getPendingEffect(state), null, 'P2 pendingが自動解決された');
    runner.assertEqual(state.player('P2').hand.length, p2HandBefore + 1, '縄張りから1枚を手札へ引いた');
    // P1の通常ターンは進めない
    runner.assertEqual(state.activePlayerId, 'P1', 'P1のターンは進めない(アクティブはP1のまま)');
    runner.assertEqual(state.phase, global.Phases.DRAW_PHASE, 'P1のフェイズは進めない(DRAW_PHASEのまま)');
  });
});

// ---- Test C14: P2 CPUターン中のP1 pendingで停止 ----
runner.test('TestC14 P2 CPUターン中にP1 pendingが発生したらCpuRunnerが停止する', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP2SetPhase(state); // P2のCPUターンへ
  runner.assertEqual(state.activePlayerId, 'P2', '前提: P2のCPUターン');

  h.addToTerritoryRaw(state, 'P1', h.defById('test_red_1'));
  global.triggerTerritoryDrawSelection(state, 'P1'); // P1のpendingを発生させる
  var p2FoodBefore = state.player('P2').food.length;

  var uiStub = { render: function () {} };
  var runner2 = new global.CpuRunner({ state: state }, uiStub, { thinkDelay: 0, maxActionsPerTurn: 50 });

  return runner2.runTurn().then(function () {
    // P1 pendingを勝手に解決しない
    var pend = global.getPendingEffect(state);
    runner.assertTrue(pend !== null && pend.playerId === 'P1', 'P1 pendingは残ったまま(自動解決しない)');
    // 追加のCPU行動も行わない
    runner.assertTrue(runner2.actionsThisTurn === 0, '追加CPU行動は行われない(actions=' + runner2.actionsThisTurn + ')');
    runner.assertEqual(state.player('P2').food.length, p2FoodBefore, 'エサセット等のCPU行動は行われない');
    // CpuRunnerは停止する
    runner.assertTrue(runner2.isRunning === false, 'CpuRunnerが停止する');
  });
});

module.exports = runner;

if (require.main === module) {
  runner.runAll().then(function () {});
}
