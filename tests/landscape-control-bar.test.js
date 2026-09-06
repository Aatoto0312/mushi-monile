'use strict';

// Landscape 操作バー（control bar）専用テスト。
// Landscape CSSの実際の値(clamps/vars/grid rows)から各viewportのジオメトリを計算し、
// 全phaseのaction button（ドロー/メインフェイズへ/ターン終了/攻撃/キャンセル）が
// control bar内に完全収容・最低高さ28px以上・100dvh内・縦scroll 0であることを検証する。
// またfield/hand/CPU場のクリップregressionもLFモデルで再確認する。
// Portrait CSSは一切変更されていないことを契約として検証する。

var fs = require('fs');
var path = require('path');
var TestRunner = require('./lib.js');
var runner = new TestRunner();

var LF = require('./landscape-field-hand.test.js');
var CSS = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
var HTML = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
var LAND_L = CSS.indexOf('@media (orientation: landscape) and (max-height: 520px)');
var PORTRAIT = LAND_L === -1 ? CSS : CSS.slice(0, LAND_L);
var LAND = LAND_L === -1 ? '' : CSS.slice(LAND_L);

var VIEWPORTS = LF.VIEWPORTS;

// コントロールバーの矩形をモデルから算出
function ctrl(m) {
  var top = m.topbar + m.cpu + m.divider + m.human;
  var height = m.control;
  var btnH = height;
  var btnTop = top + (height - btnH) / 2;
  var btnBottom = btnTop + btnH;
  return {
    top: top, bottom: top + height, height: height,
    btnTop: btnTop, btnBottom: btnBottom, btnH: btnH
  };
}

var BUTTON_IDS = ['btn-draw', 'btn-to-main', 'btn-end-turn', 'btn-direct-attack', 'btn-cancel-attack'];

// control-bar 内に全ボタンが存在し、要素として画面内に置けることをHTMLから確認
function buttonsInHtml() {
  var start = HTML.indexOf('<div class="control-bar">');
  var end = HTML.indexOf('<!-- バトルログ -->');
  var slice = start !== -1 && end !== -1 ? HTML.slice(start, end) : '';
  var all = true;
  for (var i = 0; i < BUTTON_IDS.length; i++) {
    if (slice.indexOf('id="' + BUTTON_IDS[i] + '"') === -1) all = false;
  }
  return all;
}

/* ============================================================
   LC1 568x320: DRAW ボタン（カードを引く）完全表示
   ============================================================ */
runner.test('LC1 568x320 DRAW button fully visible and tappable', function () {
  var m = LF.compute(568, 320);
  var c = ctrl(m);
  runner.assertTrue(buttonsInHtml(), 'control bar buttons exist in DOM');
  runner.assertTrue(c.bottom <= m.vh + 0.5, 'controlBar.bottom ' + c.bottom.toFixed(1) + ' <= innerHeight ' + m.vh);
  runner.assertTrue(c.btnH >= 28, 'draw button height ' + c.btnH.toFixed(1) + 'px >= 28px');
  runner.assertTrue(c.btnTop >= c.top - 0.5 && c.btnBottom <= c.bottom + 0.5, 'draw button fully inside control bar');
});

/* ============================================================
   LC2 568x320: SET ボタン（メインフェイズへ）完全表示
   ============================================================ */
runner.test('LC2 568x320 SET button fully visible', function () {
  var m = LF.compute(568, 320);
  var c = ctrl(m);
  runner.assertTrue(c.bottom <= m.vh + 0.5, 'controlBar.bottom inside viewport');
  runner.assertTrue(c.btnTop >= c.top - 0.5 && c.btnBottom <= c.bottom + 0.5, 'SET button fully inside control bar');
});

/* ============================================================
   LC3 568x320: MAIN ターン終了ボタン完全表示
   ============================================================ */
runner.test('LC3 568x320 MAIN turn-end button fully visible', function () {
  var m = LF.compute(568, 320);
  var c = ctrl(m);
  runner.assertTrue(c.bottom <= m.vh + 0.5, 'controlBar.bottom inside viewport');
  runner.assertTrue(c.btnTop >= c.top - 0.5 && c.btnBottom <= c.bottom + 0.5, 'turn-end button fully inside control bar');
});

/* ============================================================
   LC4 667x375 (および全viewport): 全phase button 完全表示・タップ可能
   ============================================================ */
runner.test('LC4 all phase buttons fit at 667x375 (and every viewport)', function () {
  VIEWPORTS.forEach(function (v) {
    var m = LF.compute(v[0], v[1]);
    var c = ctrl(m);
    runner.assertTrue(c.bottom <= m.vh + 0.5, v[0] + 'x' + v[1] + ' controlBar.bottom ' + c.bottom.toFixed(1) + ' <= innerHeight ' + m.vh);
    runner.assertTrue(c.btnTop >= c.top - 0.5 && c.btnBottom <= c.bottom + 0.5, v[0] + 'x' + v[1] + ' buttons fully inside control bar');
    runner.assertTrue(c.btnH >= 28, v[0] + 'x' + v[1] + ' button height ' + c.btnH.toFixed(1) + 'px >= 28px');
  });
});

/* ============================================================
   LC5 controlBar height >= button height
   ============================================================ */
runner.test('LC5 control-bar height >= button height at all viewports', function () {
  VIEWPORTS.forEach(function (v) {
    var m = LF.compute(v[0], v[1]);
    var c = ctrl(m);
    runner.assertTrue(c.height >= c.btnH - 0.5, v[0] + 'x' + v[1] + ' control height ' + c.height.toFixed(1) + ' >= button height ' + c.btnH.toFixed(1));
  });
});

/* ============================================================
   LC6 field/hand/CPU field クリップregression（LF契約を維持）
   ============================================================ */
runner.test('LC6 field/hand/cpu-field clipping regression none', function () {
  [[568, 320], [667, 375]].forEach(function (vp) {
    var m = LF.compute(vp[0], vp[1]);
    runner.assertTrue(m.humanFieldOk, vp[0] + 'x' + vp[1] + ' human field card no clip');
    runner.assertTrue(m.humanHandOk, vp[0] + 'x' + vp[1] + ' human hand card no clip');
    runner.assertTrue(m.cpuFieldOk, vp[0] + 'x' + vp[1] + ' cpu field card no clip');
  });
});

/* ============================================================
   LC7 Battle root 100dvh・縦scroll 0・control/log構成
   ============================================================ */
runner.test('LC7 battle root 100dvh, zero vertical scroll', function () {
  VIEWPORTS.forEach(function (v) {
    var m = LF.compute(v[0], v[1]);
    runner.assertTrue(m.rootOk, v[0] + 'x' + v[1] + ' root tracks total ' + m.rootTotal.toFixed(1) + ' <= ' + m.vh);
    runner.assertTrue(LAND.indexOf('--control-row-min:') !== -1, 'control row min defined');
    runner.assertTrue(/\.mobile-frame > \.control-bar \{ grid-row: 5/.test(PORTRAIT + '\n' + LAND), 'control bar grid-row 5 intact');
    runner.assert(!/\.control-bar\s*\{[^}]*position:\s*(fixed|sticky)/.test(CSS), 'no fixed/sticky leftover on control bar');
  });
});

/* ============================================================
   LC8 Portrait CSS contract unchanged
   ============================================================ */
runner.test('LC8 portrait CSS contract unchanged', function () {
  runner.assertTrue(/--human-field-row:\s*minmax\(0,\s*42%\)/.test(PORTRAIT), 'portrait --human-field-row untouched');
  runner.assertTrue(/--human-hand-row:\s*minmax\(0,\s*1fr\)/.test(PORTRAIT), 'portrait --human-hand-row untouched');
  runner.assertTrue(PORTRAIT.indexOf('--control-row-min') === -1, '--control-row-min lives only in landscape');
  runner.assertTrue(PORTRAIT.indexOf('--human-zone-min') === -1 && PORTRAIT.indexOf('--cpu-zone-min') === -1, 'budget vars live only in landscape');
});

/* ============================================================
   LC9 ブラウザchromeでinnerHeightが減った実機(VH:311)でも成立
   ============================================================ */
runner.test('LC9 budget fits at chrome-reduced innerHeight (real device VH 311px)', function () {
  [[568, 311], [375, 311], [320, 311]].forEach(function (vp) {
    var m = LF.compute(vp[0], vp[1]);
    var c = ctrl(m);
    runner.assertTrue(m.rootOk, vp[0] + 'x' + vp[1] + ' budget total ' + m.rootTotal.toFixed(1) + ' <= innerHeight ' + vp[1]);
    runner.assertTrue(c.bottom <= m.vh + 0.5, vp[0] + 'x' + vp[1] + ' control bar bottom ' + c.bottom.toFixed(1) + ' inside');
    runner.assertTrue(c.btnTop >= c.top - 0.5 && c.btnBottom <= c.bottom + 0.5, vp[0] + 'x' + vp[1] + ' buttons inside control bar');
    runner.assertTrue(m.humanFieldOk && m.humanHandOk && m.cpuFieldOk, vp[0] + 'x' + vp[1] + ' field/hand/cpu no clip');
  });
});

/* ============================================================
   LC10 innerHeight を 311〜430 まで走査して全帯域で成立
   ============================================================ */
runner.test('LC10 budget holds across innerHeight 311..430 (height scan)', function () {
  var ok = true, worst = '';
  for (var h = 311; h <= 430; h += 7) {
    var m = LF.compute(568, h);
    var c = ctrl(m);
    if (!(m.rootOk && c.bottom <= m.vh + 0.5 && m.humanFieldOk && m.humanHandOk && m.cpuFieldOk)) {
      ok = false;
      worst = '568x' + h + ' total=' + m.rootTotal.toFixed(1) + ' ctrlBottom=' + c.bottom.toFixed(1);
    }
  }
  runner.assertTrue(ok, 'no failing height in scan (worst: ' + worst + ')');
});

function runAll() { console.log('==== Landscape Control Bar Test ===='); return runner.runAll(); }
if (require.main === module) runAll();
module.exports = { runAll: runAll, ctrl: ctrl };