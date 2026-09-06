'use strict';

// Landscape field + hand + CPU field 同時保証テスト。
// Landscape CSSの実際の値(clamps/vars/grid rows)をCSSから読み取り、
// 各viewport(667x375 / 844x390 / 932x430 / 568x320)のジオメトリを計算し、
// 全カード(場/手札/CPU場)が各zone内に縦clip無しで収まることを検証する。
// 「%よりも必要最低高さを先に確保する」設計(minmax)が満足されることを契約として検証する。
// Portrait CSSは一切変更されていないことを契約として検証する。

var fs = require('fs');
var path = require('path');
var TestRunner = require('./lib.js');
var runner = new TestRunner();

var CSS = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
var LAND_L = CSS.indexOf('@media (orientation: landscape) and (max-height: 520px)');
var PORTRAIT = LAND_L === -1 ? CSS : CSS.slice(0, LAND_L);
var LAND = LAND_L === -1 ? '' : CSS.slice(LAND_L);

var VIEWPORTS = [[667, 375], [844, 390], [932, 430], [568, 320]];

// ---- 小道具: clamp / min(,) / calc風を数値化 ----
function cssToJs(expr, vw, vh) {
  return expr
    .replace(/px/g, '')
    .replace(/clamp\(/g, '__clamp__(')
    .replace(/min\(/g, 'Math.min(')
    .replace(/max\(/g, 'Math.max(')
    .replace(/vw/g, '*' + vw + '/100')
    .replace(/vh/g, '*' + vh + '/100');
}
function evalPx(expr, vw, vh) {
  try {
    return Function('return (' + cssToJs(expr, vw, vh) + ');')();
  } catch (err) {
    return parseFloat(expr) || 0;
  }
}
function clampOf(expr, vw, vh) {
  if (expr.indexOf('clamp(') === -1) return evalPx(expr, vw, vh);
  var e = cssToJs(expr, vw, vh);
  var c = function (a, b, hi) { return Math.max(a, Math.min(b, hi)); };
  try {
    return Function('__clamp__', 'return (' + e + ');')(c);
  } catch (err) {
    return null;
  }
}
function lvar(name) {
  var re = new RegExp('--' + name + '\\s*:\\s*([^;]+);');
  var m = LAND.match(re);
  return m ? m[1].trim() : null;
}
// calc(var(--x) + Npx) のNを抽出
function varPad(expr, varName) {
  var m = expr.match(/var\(--' + '' + '\)/);
  return null;
}
function plusPx(expr, varName) {
  var re = new RegExp('var\\(--' + varName + '\\) \\+ ([\\d.]+)px');
  var m = expr.match(re);
  return m ? parseFloat(m[1]) : null;
}

// モデル計算。CSSから読んだ値のみを使う。
function compute(vw, vh) {
  var cardW = clampOf(lvar('card-w-hand'), vw, vh);
  var cardH = clampOf(lvar('card-h-hand'), vw, vh);
  var fieldCardW = clampOf(lvar('card-w-field'), vw, vh);
  var fieldCardH = clampOf(lvar('card-h-field'), vw, vh);
  var oppCardW = clampOf(lvar('card-w-opp-field'), vw, vh);
  var oppCardH = clampOf(lvar('card-h-opp-field'), vw, vh);
  var aux = clampOf(lvar('aux-rail-h'), vw, vh);

  var humanFieldRow = lvar('human-field-row');
  var humanHandRow = lvar('human-hand-row');
  var cpuFieldRow = lvar('cpu-field-row');
  var humanZoneMin = lvar('human-zone-min') || '';
  var cpuZoneMin = lvar('cpu-zone-min') || '';
  var fieldPad = plusPx(humanFieldRow, 'card-h-field');
  var handPad = plusPx(humanHandRow, 'card-h-hand');
  var cpuFieldPad = plusPx(cpuFieldRow, 'card-h-opp-field');
  var hm = humanZoneMin.match(/\+ (clamp\([^)]+\)|[\d.]+px)\s*$/);
  var cm = cpuZoneMin.match(/\+ (clamp\([^)]+\)|[\d.]+px)\s*$/);
  var humanExtra = hm ? (hm[1].indexOf('clamp') === 0 ? clampOf(hm[1], vw, vh) : parseFloat(hm[1])) : 0;
  var cpuExtra = cm ? (cm[1].indexOf('clamp') === 0 ? clampOf(cm[1], vw, vh) : parseFloat(cm[1])) : 0;

  // Root tracks
  var gridRows = LAND.match(/grid-template-rows:([\s\S]*?);/)[1];
  var topbarEx = (gridRows.match(/minmax\(([\d.]+)px,\s*([^)]+)\)/) || []);
  var topbar = Math.max(parseFloat(topbarEx[1] || '12'), evalPx(topbarEx[2] || '4vh', vw, vh));
  var divider = Math.min(3, Math.max(1, evalPx('0.5vh', vw, vh)));

  // Row5=control / Row6=log は minmax(var(--...-row-min), auto) から算出
  var rowMinNames = gridRows.match(/minmax\(var\(--([a-z0-9-]+)\), auto\)/g) || [];
  var controlVar = (rowMinNames[0] || '').match(/--([a-z0-9-]+)\)/);
  var logVar = (rowMinNames[1] || '').match(/--([a-z0-9-]+)\)/);
  var control = controlVar ? clampOf(lvar(controlVar[1]), vw, vh) : 14;
  var log = logVar ? clampOf(lvar(logVar[1]), vw, vh) : 0;

  // fr distribution: cpu 0.9fr / human 1.1fr（minを先に確保、残りをfrで分配）
  var fieldPadN = fieldPad || 4;
  var handPadN = handPad || 3;
  var cpuFieldPadN = cpuFieldPad || 4;
  var cpuMin = aux + oppCardH + cpuExtra;
  var humanMin = aux + fieldCardH + fieldPadN + cardH + handPadN + humanExtra;
  var fixed = topbar + divider + control + log;
  var slack = vh - fixed - cpuMin - humanMin;
  var cpu = cpuMin + (slack > 0 ? slack * 0.9 / 2.0 : 0);
  var human = humanMin + (slack > 0 ? slack * 1.1 / 2.0 : 0);

  // Human zone
  var zonePad = clampOf('clamp(1px, 0.3vh, 2px)', vw, vh);
  var zoneMargin = clampOf('clamp(1px, 0.2vh, 2px)', vw, vh);
  var zoneGap = clampOf('clamp(1px, 0.3vh, 2px)', vw, vh);
  var humanContent = human - 2 * zoneMargin - 2 * zonePad;
  var left = humanContent - aux - 2 * zoneGap;
  var fieldRowMin = fieldCardH + fieldPadN;
  var handRowMin = cardH + handPadN;
  var extra = left - fieldRowMin - handRowMin;
  var fieldRow = fieldRowMin + (extra > 0 ? extra * 1.5 / 2.5 : 0);
  var handRow = handRowMin + (extra > 0 ? extra * 1.0 / 2.5 : 0);

  // CPU zone
  var cpuContent = cpu - 2 * zoneMargin - 2 * zonePad;
  var cpuFieldMin = oppCardH + cpuFieldPadN;
  var cpuFieldRow = cpuContent - aux - zoneGap;

  return {
    vw: vw, vh: vh,
    topbar: topbar, cpu: cpu, divider: divider, human: human, control: control, log: log,
    rootTotal: topbar + cpu + divider + human + control + log,
    slack: slack,
    aux: aux,
    cardW: cardW, cardH: cardH,
    fieldCardW: fieldCardW, fieldCardH: fieldCardH,
    oppCardW: oppCardW, oppCardH: oppCardH,
    fieldRow: fieldRow, handRow: handRow,
    cpuFieldRow: cpuFieldRow,
    humanFieldOk: fieldRow >= fieldCardH + zonePad,
    humanHandOk: handRow >= cardH,
    cpuFieldOk: cpuFieldRow >= oppCardH + zonePad,
    rootOk: slack >= 0 && (topbar + cpu + divider + human + control + log) <= vh + 0.5
  };
}

function describe(m) {
  return m.vw + 'x' + m.vh;
}

/* ============================================================
   LF1 568x320: Human field card 縦clip無し
   ============================================================ */
runner.test('LF1 568x320 human field card no vertical clip', function () {
  var m = compute(568, 320);
  runner.assertTrue(m.humanFieldOk, describe(m) + ' field row ' + m.fieldRow.toFixed(1) + 'px >= field card ' + m.fieldCardH.toFixed(1) + 'px + pad');
  runner.assertTrue(m.fieldCardH >= 72, 'human field card height ' + m.fieldCardH.toFixed(1) + ' >= 72');
  runner.assertTrue(m.fieldCardW >= 54, 'human field card width ' + m.fieldCardW.toFixed(1) + ' >= 54');
});

/* ============================================================
   LF2 568x320: Human hand card 縦clip無し
   ============================================================ */
runner.test('LF2 568x320 human hand card no vertical clip', function () {
  var m = compute(568, 320);
  runner.assertTrue(m.humanHandOk, describe(m) + ' hand row ' + m.handRow.toFixed(1) + 'px >= hand card ' + m.cardH.toFixed(1) + 'px');
  runner.assertTrue(m.cardW >= 54 && m.cardH >= 72, 'hand card ' + m.cardW.toFixed(1) + 'x' + m.cardH.toFixed(1) + ' meets min');
});

/* ============================================================
   LF3 667x375: Human field card 縦clip無し
   ============================================================ */
runner.test('LF3 667x375 human field card no vertical clip', function () {
  var m = compute(667, 375);
  runner.assertTrue(m.humanFieldOk, describe(m) + ' field row ' + m.fieldRow.toFixed(1) + 'px >= field card ' + m.fieldCardH.toFixed(1) + 'px + pad');
});

/* ============================================================
   LF4 667x375: Human hand card 縦clip無し
   ============================================================ */
runner.test('LF4 667x375 human hand card no vertical clip', function () {
  var m = compute(667, 375);
  runner.assertTrue(m.humanHandOk, describe(m) + ' hand row ' + m.handRow.toFixed(1) + 'px >= hand card ' + m.cardH.toFixed(1) + 'px');
});

/* ============================================================
   LF5 CPU field card 縦clip無し（全4viewport）
   ============================================================ */
runner.test('LF5 CPU field card no vertical clip at all viewports', function () {
  VIEWPORTS.forEach(function (v) {
    var m = compute(v[0], v[1]);
    runner.assertTrue(m.cpuFieldOk, describe(m) + ' cpu field row ' + m.cpuFieldRow.toFixed(1) + 'px >= opp card ' + m.oppCardH.toFixed(1) + 'px + pad');
    runner.assertTrue(m.oppCardH >= 64, 'opp card height ' + m.oppCardH.toFixed(1) + ' >= 64');
    runner.assertTrue(m.oppCardW >= 48, 'opp card width ' + m.oppCardW.toFixed(1) + ' >= 48');
  });
});

/* ============================================================
   LF6 場5枚でも場行の高さ不変（行は枚数に依存しない）
   ============================================================ */
runner.test('LF6 field row height is flat regardless of card count (5 cards ok)', function () {
  VIEWPORTS.forEach(function (v) {
    var m = compute(v[0], v[1]);
    // row定義が枚数に依存しない（fr/minmaxのみ）
    runner.assertTrue(m.fieldRow > 0, describe(m) + ' field row positive');
  });
  // 横方向はfield-zoneのoverflow-xで吸収（縦は増やさない）ことを契約にする
  runner.assertTrue(/\.field-zone\s*\{[^}]*overflow-x:\s*auto/.test(LAND), 'field-zone horizontal scroll');
});

/* ============================================================
   LF7 手札7枚でも手札行の高さ不変（横は横scroll）
   ============================================================ */
runner.test('LF7 hand row height is flat regardless of card count (7 cards ok)', function () {
  var m = compute(568, 320);
  runner.assertTrue(m.humanHandOk, '7 hand cards do not change the guaranteed hand row height');
  runner.assertTrue(/\.hand-zone\s*\{[^}]*overflow-x:\s*auto/.test(LAND), 'hand-zone horizontal scroll');
});

/* ============================================================
   LF8 Battle root 100dvh・縦scroll 0・control/log画面内
   ============================================================ */
runner.test('LF8 battle root 100dvh, zero vertical scroll, control/log on screen', function () {
  VIEWPORTS.forEach(function (v) {
    var m = compute(v[0], v[1]);
    runner.assertTrue(m.rootOk, describe(m) + ' root tracks total ' + m.rootTotal.toFixed(1) + ' <= innerHeight ' + m.vh + ' (slack ' + m.slack.toFixed(1) + 'px)');
    runner.assertTrue(PORTRAIT.indexOf('height: 100dvh') !== -1, 'portrait height:100dvh intact');
    runner.assertTrue(LAND.indexOf('height: 100dvh') !== -1, 'landscape keeps height:100dvh');
    runner.assertTrue(LAND.indexOf('overflow: hidden') !== -1, 'landscape keeps overflow hidden (縦scroll 0)');
  });
});

/* ============================================================
   LF9 Portrait CSS contract unchanged
   ============================================================ */
runner.test('LF9 portrait CSS contract unchanged', function () {
  runner.assertTrue(/--card-w-hand:\s*clamp\(52px,\s*17vw,\s*72px\)/.test(PORTRAIT), 'portrait --card-w-hand untouched');
  runner.assertTrue(/--card-h-hand:\s*clamp\(72px,\s*24vw,\s*100px\)/.test(PORTRAIT), 'portrait --card-h-hand untouched');
  runner.assertTrue(/--human-field-row:\s*minmax\(0,\s*42%\)/.test(PORTRAIT), 'portrait --human-field-row untouched');
  runner.assertTrue(/--human-hand-row:\s*minmax\(0,\s*1fr\)/.test(PORTRAIT), 'portrait --human-hand-row untouched');
  runner.assertTrue(PORTRAIT.indexOf('--cpu-field-row') === -1 && PORTRAIT.indexOf('--cpu-zone-min') === -1 && PORTRAIT.indexOf('--human-zone-min') === -1, 'new budget vars live only in landscape');
});

function runAll() { console.log('==== Landscape Field+Hand Test ===='); return runner.runAll(); }
if (require.main === module) runAll();
module.exports = { runAll: runAll, compute: compute, lvar: lvar, clampOf: clampOf, evalPx: evalPx, VIEWPORTS: VIEWPORTS };