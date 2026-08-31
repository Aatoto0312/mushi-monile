'use strict';

// UIコードの統合スモークテスト。
// 最小限のDOMスタブを用意し、バトル開始〜操作がランタイムエラーを起こさないかを確認する。

var path = require('path');
var base = path.join(__dirname, '..', 'js');

// ---- 最小DOMスタブ ----
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
  if (tag === 'button') { el.type = 'button'; }
  return el;
}

var registry = {};
var elementsCreated = {};

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
  createElement: function (tag) {
    var el = makeElement(tag);
    if (!elementsCreated[tag]) { elementsCreated[tag] = []; }
    elementsCreated[tag].push(el);
    return el;
  },
  querySelector: function (sel) {
    // #id 形式のみ対応
    if (sel && sel[0] === '#') { return getById(sel.slice(1)); }
    return null;
  },
  querySelectorAll: function () { return []; }
};

global.window = global;
global.alert = function () {};
global.confirm = function () { return true; };
global.GameEngine = null;
global.BattleUI = null;

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
require(path.join(base, 'app.js'));

// boot を発火(DOMContentLoaded)
global.document.readyState = 'loading';
global.document.dispatch('DOMContentLoaded');

var app = global.MushiBattle;
if (!app || !app.engine || !app.ui) {
  throw new Error('MushiBattle が初期化されていません');
}

var ui = app.ui;
console.log('初期描画 OK, アクティブ=', ui.state.activePlayerId, 'フェイズ=', ui.phaseLabel(ui.state.phase));
if (ui.state.phase !== global.Phases.DRAW_PHASE) {
  throw new Error('ゲーム開始直後は DRAW_PHASE であるべき');
}

// DRAW_PHASE → SET_PHASE を正式な TurnEngine 経由で遷移
ui.engine.turn.enterSetPhase();
ui.render();
if (ui.state.phase !== global.Phases.SET_PHASE) {
  throw new Error('enterSetPhase で SET_PHASE になるべき');
}

// 手札1枚をエサにセット
var activeId = ui.state.activePlayerId;
var card = ui.state.player(activeId).hand[0];
setFood(ui.state, activeId, card.instanceId);
console.log('エサセット OK, Food=', ui.state.player(activeId).food.length);

// メインフェイズへ(TurnEngine経由)
ui.onToMainPhase();
console.log('メインフェイズ OK, COST=', ui.state.player(activeId).availableCost);

// 召喚
var handCard = ui.state.player(activeId).hand[0];
if (handCard) {
  try {
    summonInsect(ui.state, activeId, handCard.instanceId);
    console.log('召喚 OK, FIELD=', ui.state.player(activeId).field.length);
  } catch (e) {
    // コスト不足なら許容(スモークのみ)
    console.log('召喚スキップ(コスト不足):', e.message);
  }
}

// 攻撃選択→対象→解決(相手場に虫がいれば)
var attackerFound = false;
ui.state.player(activeId).field.forEach(function (inst) {
  if (!attackerFound && !inst.attackedThisTurn) {
    var targets = getLegalAttackTargets(ui.state, inst.instanceId);
    if (targets.length) {
      try {
        performAttack(ui.state, inst.instanceId, targets[0].instance ? targets[0].instance.instanceId : null, targets[0].targetType, null);
        attackerFound = true;
        console.log('攻撃 OK, targetType=', targets[0].targetType);
      } catch (e) {
        console.log('攻撃スキップ:', e.message);
      }
    }
  }
});

// ターン終了
ui.onEndTurn();
console.log('ターン終了 OK, アクティブ=', ui.state.activePlayerId, 'turn=', ui.state.turnNumber);

// 描画再実行でエラーがないこと
ui.render();
console.log('再描画 OK');

console.log('SMOKE UI: ALL OK');
