'use strict';

// CPU行動通知 Toast 専用テスト。
// 全幅グレーバナーを廃止し、小型フローティングToastへ変更したこと、
// 一定時間で自動消滅（複数CPU行動でも最終的に消える）こと、
// 既存UI（Damage Vector / GAME_OVER / Portrait / Landscape 100dvh）を壊さないことを検証する。

var fs = require('fs');
var path = require('path');
var TestRunner = require('./lib.js');
var runner = new TestRunner();

require('../js/ui/cpu-toast.js');

var CSS = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
var HTML = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
var BUI = fs.readFileSync(path.join(__dirname, '..', 'js', 'ui', 'battle-ui.js'), 'utf8');

var LAND_L = CSS.indexOf('@media (orientation: landscape) and (max-height: 520px)');
var PORTRAIT = LAND_L === -1 ? CSS : CSS.slice(0, LAND_L);
var LAND = LAND_L === -1 ? '' : CSS.slice(LAND_L);

var toastCssMatch = CSS.match(/\.cpu-toast\s*\{[^}]*\}/);
var toastCss = toastCssMatch ? toastCssMatch[0] : '';
var elHtml = HTML.match(/<div id="cpu-action-log"[\s\S]*?<\/div>/);

function fakeEl() {
  var cls = {};
  return {
    textContent: '',
    style: {},
    list: cls,
    classList: {
      add: function (c) { cls[c] = true; },
      remove: function (c) { delete cls[c]; },
      contains: function (c) { return !!cls[c]; }
    }
  };
}

/* ============================================================
   T1 CPU action toast は全幅禁止
   ============================================================ */
runner.test('T1 CPU action toast is not full-width', function () {
  runner.assertTrue(elHtml !== null, '#cpu-action-log exists');
  runner.assertTrue(/width:\s*fit-content/.test(toastCss), 'toast uses width:fit-content');
  runner.assertTrue(!/width:\s*100%/i.test(toastCss), 'base toast CSS has no width:100%');
  runner.assertTrue(!/width:\s*100%/i.test(elHtml[0]), 'no width:100% inline on #cpu-action-log');
});

/* ============================================================
   T2 max-width 設定
   ============================================================ */
runner.test('T2 toast max-width is set (portrait 85vw / landscape 60vw)', function () {
  runner.assertTrue(/max-width:\s*85vw/.test(toastCss), 'portrait max-width 85vw');
  runner.assertTrue(/max-width:\s*60vw/.test(LAND), 'landscape max-width 60vw');
  runner.assert(LAND_L !== -1, 'landscape media query present');
});

/* ============================================================
   T3 pointer-events: none（操作を妨害しない）
   ============================================================ */
runner.test('T3 toast has pointer-events none', function () {
  runner.assertTrue(/pointer-events:\s*none/.test(toastCss), 'pointer-events none');
});

/* ============================================================
   T4 一定時間後に非表示（フェードアウト）
   ============================================================ */
runner.test('T4 toast hides automatically after HIDE_DELAY', function () {
  var f = fakeEl();
  var oldSet = global.setTimeout, oldClear = global.clearTimeout;
  var cb = null;
  global.setTimeout = function (fn) { cb = fn; return 7; };
  global.clearTimeout = function () {};
  try {
    global.CpuToast.show(f, 'CPU：ターン終了');
    runner.assert(f.classList.contains('is-visible'), 'toast visible right after show');
    runner.assertEqual(f.textContent, 'CPU：ターン終了', 'toast text is set');
    runner.assertEqual(global.CpuToast.HIDE_DELAY, 1000, 'HIDE_DELAY within 800-1400ms range');
    cb();
    runner.assertTrue(!f.classList.contains('is-visible'), 'toast hidden after delay');
  } finally {
    global.setTimeout = oldSet;
    global.clearTimeout = oldClear;
  }
});

/* ============================================================
   T5 複数CPU行動でも最終的に消える
   ============================================================ */
runner.test('T5 multiple CPU actions still end hidden', function () {
  var f = fakeEl();
  var oldSet = global.setTimeout, oldClear = global.clearTimeout;
  var cbs = [];
  global.setTimeout = function (fn) { cbs.push(fn); return cbs.length; };
  global.clearTimeout = function () {};
  try {
    global.CpuToast.show(f, 'CPU：ワタアブで攻撃');
    global.CpuToast.show(f, 'CPU：虹の架け橋を使用');
    global.CpuToast.show(f, 'CPU：ターン終了');
    runner.assertTrue(f.classList.contains('is-visible'), 'visible during CPU burst');
    cbs[cbs.length - 1]();
    runner.assertTrue(!f.classList.contains('is-visible'), 'hidden after last action + delay');
  } finally {
    global.setTimeout = oldSet;
    global.clearTimeout = oldClear;
  }
});

/* ============================================================
   T6 Damage Vector は変更しない
   ============================================================ */
runner.test('T6 Damage Vector UI untouched', function () {
  runner.assertTrue(/\.damage-vector\s*\{/.test(CSS), '.damage-vector CSS exists');
  runner.assertTrue(/id="damage-vector"/.test(HTML), '#damage-vector element exists');
  runner.assertTrue(BUI.indexOf('damage-vector') !== -1, 'battle-ui still manages damage-vector');
});

/* ============================================================
   T7 GAME_OVER は変更しない
   ============================================================ */
runner.test('T7 GAME_OVER UI untouched', function () {
  runner.assertTrue(/id="game-over"[\s\S]*?class="overlay"/.test(HTML), 'game-over element exists');
  runner.assertTrue(/\.overlay\s*\{/.test(CSS), '.overlay CSS exists');
  runner.assertTrue(BUI.indexOf('game-over') !== -1, 'battle-ui still manages game-over');
});

/* ============================================================
   T8 Portrait 契約不変
   ============================================================ */
runner.test('T8 portrait CSS contract unchanged', function () {
  runner.assertTrue(/--human-field-row:\s*minmax\(0,\s*42%\)/.test(PORTRAIT), 'portrait --human-field-row untouched');
  runner.assertTrue(/--human-hand-row:\s*minmax\(0,\s*1fr\)/.test(PORTRAIT), 'portrait --human-hand-row untouched');
});

/* ============================================================
   T9 Landscape 100dvh 契約不変
   ============================================================ */
runner.test('T9 landscape 100dvh / control bar contract unchanged', function () {
  runner.assertTrue(LAND.indexOf('height: 100dvh') !== -1, 'landscape height:100dvh');
  runner.assertTrue(LAND.indexOf('overflow: hidden') !== -1, 'landscape overflow hidden');
  runner.assertTrue(LAND.indexOf('minmax(var(--control-row-min), auto)') !== -1, 'control row min intact');
  runner.assertTrue(LAND.indexOf('--card-h-field') !== -1 && LAND.indexOf('--card-h-hand') !== -1, 'card budgets intact');
});

function runAll() { console.log('==== CPU Toast Test ===='); return runner.runAll(); }
if (require.main === module) runAll();
module.exports = { runAll: runAll };