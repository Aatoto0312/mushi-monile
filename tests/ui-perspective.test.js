'use strict';

var path = require('path');
var base = path.join(__dirname, '..', 'js');

// 最小DOMスタブ
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
    type: 'button'
  };
  return el;
}

var registry = {};
function getById(id) {
  if (!registry[id]) { registry[id] = makeElement('div'); }
  return registry[id];
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

require(path.join(base, 'cards', 'card-definition.js'));
require(path.join(base, 'cards', 'card-instance.js'));
require(path.join(base, 'cards', 'card-registry.js'));
require(path.join(base, 'cards', 'test-cards.js'));
require(path.join(base, 'cards', 'starter-cards.js'));
require(path.join(base, 'engine', 'game-state.js'));
require(path.join(base, 'engine', 'stat-modifier.js'));
require(path.join(base, 'engine', 'rules.js'));
require(path.join(base, 'engine', 'zone-engine.js'));
require(path.join(base, 'engine', 'battle-engine.js'));
require(path.join(base, 'engine', 'turn-engine.js'));
require(path.join(base, 'engine', 'game-engine.js'));
require(path.join(base, 'ui', 'battle-log-ui.js'));
require(path.join(base, 'ui', 'card-ui.js'));
require(path.join(base, 'ui', 'battle-ui.js'));

function runAll() {
  console.log('==== UI Hotseat Perspective Test ====');
  var results = { passed: 0, failed: 0 };

  // テストごとにglobal/DOM状態を自前で初期化する。
  // run-all で先行テスト(require cacheや他モジュールのglobal.document)の影響を受けないよう、
  // 書き込み側(document.getElementById)と読み出し側(getById)が同一のregistryを参照する。
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
  global.window = global;

  function assert(cond, msg) {
    if (cond) {
      results.passed++;
      console.log('  [PASS] ' + msg);
    } else {
      results.failed++;
      console.log('  [FAIL] ' + msg);
    }
  }

  try {
    var engine = new global.GameEngine();
    var ui = new global.BattleUI(engine);
    ui.attach();
    ui.newGame();

    // 1. ターン開始時の視点チェック
    var firstActive = ui.state.activePlayerId;
    ui.render();
    assert(getById('self-player-label').textContent.indexOf(firstActive) !== -1, '下側表示が ' + firstActive);

    // activeId でセットフェイズを操作
    ui.engine.turn.enterSetPhase();
    var activeHand0 = ui.state.player(firstActive).hand[0];
    global.setFood(ui.state, firstActive, activeHand0.instanceId);
    ui.engine.turn.enterMainPhase();

    // ターン終了 -> 交代
    ui.onEndTurn();
    var secondActive = ui.state.activePlayerId;
    assert(secondActive !== firstActive, 'ターン交代成功: ' + secondActive);

    // 2. 交代後の動的視点切替チェック
    ui.render();
    assert(getById('self-player-label').textContent.indexOf(secondActive) !== -1, '動的切替: 下側表示が ' + secondActive);
    assert(getById('opp-player-label').textContent.indexOf(firstActive) !== -1, '動的切替: 上側表示が ' + firstActive);

    // 交代後のプレイヤーの手札操作性テスト
    ui.engine.turn.enterSetPhase();
    var p2Hand0 = ui.state.player(secondActive).hand[0];
    global.setFood(ui.state, secondActive, p2Hand0.instanceId);
    assert(ui.state.player(secondActive).food.length === 1, '交代後手札からエサセット成功');

    ui.engine.turn.enterMainPhase();
    assert(ui.state.player(secondActive).availableCost === 1, '交代後コスト獲得成功');

    console.log('==== RESULTS ====');
    console.log('Total: ' + (results.passed + results.failed) + '  Passed: ' + results.passed + '  Failed: ' + results.failed);
    return results;
  } catch (e) {
    console.error('UI Perspective Test Error:', e);
    assert(false, 'UI Perspective Test Error: ' + e.message);
    return results;
  }
}

if (require.main === module) {
  runAll();
}

module.exports = { runAll: runAll };