'use strict';

// 縄張り選択ピッカー（固定オーバーレイUI）のテスト
// - TERRITORY_DRAW_SELECTION で専用ピッカーを表示
// - 可変枚数 (0/1/2/6/8/10+)/表向き縄張りに対応
// - タップ → 既存resolveTerritoryDrawSelection 経由で解決
// - Battle viewport の grid サイズ/縦位置には一切影響しない

var fs = require('fs');
var path = require('path');
var TestRunner = require('./lib.js');
var h = require('./helpers.js');
var runner = new TestRunner();

require('./engine-loader.js');

// ---- DOMスタブ (battle-viewport.test.js と同方式) ----
var registry = {};
function makeElement(tag) {
  var el = {
    tagName: tag || 'div', children: [], dataset: {}, style: {}, textContent: '', className: '',
    _listeners: {}, disabled: false,
    appendChild: function (child) { this.children.push(child); return child; },
    addEventListener: function (type, fn) { (this._listeners[type] = this._listeners[type] || []).push(fn); },
    click: function () { (this._listeners.click || []).forEach(function (f) { f && f({ preventDefault: function () {} }); }); },
    setAttribute: function () {}, querySelector: function () { return null; }, querySelectorAll: function () { return []; },
    getBoundingClientRect: function () { return { top: 0, bottom: 100, height: 100, width: 60 }; }
  };
  el.classList = {
    add: function (c) { if ((' ' + el.className + ' ').indexOf(' ' + c + ' ') < 0) el.className += (el.className ? ' ' : '') + c; },
    remove: function (c) { el.className = el.className.split(/\s+/).filter(function (x) { return x && x !== c; }).join(' '); },
    contains: function (c) { return (' ' + el.className + ' ').indexOf(' ' + c + ' ') >= 0; }
  };
  Object.defineProperty(el, 'innerHTML', { get: function () { return ''; }, set: function () { this.children = []; } });
  return el;
}
function getById(id) { if (!registry[id]) registry[id] = makeElement('div'); return registry[id]; }
function installDom() {
  registry = {};
  global.document = {
    createElement: makeElement, getElementById: getById,
    querySelector: function (sel) { return getById(sel.replace(/^#/, '') || 'battle-viewport'); },
    querySelectorAll: function () { return []; },
    documentElement: { scrollHeight: 844 },
    body: { scrollHeight: 844 }
  };
  global.window = global;
}

// UIインスタンス生成 (this.render はテスト用スタブ)
function freshUi(state, opts) {
  opts = opts || {};
  var ui = Object.create(global.BattleUI.prototype);
  ui.state = state;
  ui.cpuMode = !!opts.cpuMode;
  ui.logUI = { clear: function () {}, render: function () {} };
  ui.actionState = { mode: 'idle' };
  ui._detailInstanceId = null;
  ui.tutorialController = null;
  ui.__renderCalled = 0;
  if (opts.render) ui.render = opts.render;
  else ui.render = function () { ui.__renderCalled++; };
  return ui;
}

function requireUi() {
  require(path.join(__dirname, '..', 'js', 'ui', 'card-ui.js'));
  require(path.join(__dirname, '..', 'js', 'ui', 'battle-ui.js'));
}

function pickerCards() { return getById('territory-picker-cards').children; }
function pickerVisible() { return getById('territory-picker').style.display === 'flex'; }

function addTerritoryInst(state, playerId, cardId, faceDown, suffix) {
  var def = global.getCardDefinition(cardId);
  var inst = new global.CardInstance({
    instanceId: 'tp_' + playerId + '_' + suffix,
    cardId: cardId,
    ownerId: playerId,
    controllerId: playerId,
    zone: global.ZONES.TERRITORY,
    faceDown: faceDown,
    currentHp: def && def.baseHp,
    baseHp: def && def.baseHp
  });
  state.player(playerId).territory.push(inst);
  return inst;
}

/* ============================================================
   TP1  TERRITORY_DRAW_SELECTION でピッカー表示（6枚すべて選択肢）
   ============================================================ */
runner.test('TP1 picker shows on TERRITORY_DRAW_SELECTION with all 6 cards', function () {
  installDom();
  requireUi();
  var state = h.newGame({ rng: h.firstPlayerRng });
  state.player('P1').territory = [];
  var terr = [];
  for (var i = 0; i < 6; i++) terr.push(h.addToTerritoryRaw(state, 'P1', global.getCardDefinition('okamakiri')));
  global.triggerTerritoryDrawSelection(state, 'P1');

  var ui = freshUi(state, { cpuMode: true });
  ui.renderPendingEffect(state);

  runner.assertTrue(pickerVisible(), 'picker visible during TERRITORY_DRAW_SELECTION');
  runner.assertEqual(pickerCards().length, 6, 'all 6 territory cards are selectable');
});

/* ============================================================
   TP2  1枚タップ → 既存resolve経由でpending解除 → ピッカー消滅
   ============================================================ */
runner.test('TP2 tapping a card resolves via existing path and closes picker', function () {
  installDom();
  requireUi();
  var state = h.newGame({ rng: h.firstPlayerRng });
  state.player('P1').territory = [];
  var terr = [];
  for (var i = 0; i < 6; i++) terr.push(addTerritoryInst(state, 'P1', 'test_red_1', true, 'a' + i));
  global.triggerTerritoryDrawSelection(state, 'P1');

  var ui = freshUi(state, { cpuMode: true });
  ui.__renderCalled = 0;
  ui.renderPendingEffect(state);

  var target = terr[2];
  var cards = pickerCards();
  var targetCard = null;
  for (var c = 0; c < cards.length; c++) {
    if (cards[c].dataset.instanceId === target.instanceId) { targetCard = cards[c]; break; }
  }
  runner.assertTrue(!!targetCard, 'target card found in picker');
  targetCard.click();

  runner.assertEqual(state.pendingEffect, null, 'pendingEffect cleared via resolveTerritoryDrawSelection');
  runner.assertEqual(ui.__renderCalled, 1, 'render triggered after resolve (existing route)');
  // # re-sync: pending消失 → ピッカーが閉じる
  ui.renderPendingEffect(state);
  runner.assertTrue(!pickerVisible(), 'picker closes after pending cleared');
});

/* ============================================================
   TP3  8枚でも全選択肢を表示（可変枚数）
   ============================================================ */
runner.test('TP3 territory 8 cards are all selectable in picker', function () {
  installDom();
  requireUi();
  var state = h.newGame({ rng: h.firstPlayerRng });
  state.player('P1').territory = [];
  for (var i = 0; i < 8; i++) addTerritoryInst(state, 'P1', 'test_red_1', true, 'n' + i);
  global.triggerTerritoryDrawSelection(state, 'P1');
  runner.assertEqual(state.pendingEffect.options.length, 8, 'pending options cover 8 cards');

  var ui = freshUi(state, { cpuMode: true });
  ui.renderPendingEffect(state);
  runner.assertEqual(pickerCards().length, 8, 'picker shows all 8 cards');
});

/* ============================================================
   TP4  10枚でも全選択可 + 通常ゾーンはコンパクトのまま(Battle root不変)
   ============================================================ */
runner.test('TP4 territory 10 keeps compact zone and selectable picker (root unchanged)', function () {
  installDom();
  requireUi();
  var state = h.newGame({ rng: h.firstPlayerRng });
  state.player('P1').territory = [];
  for (var i = 0; i < 10; i++) addTerritoryInst(state, 'P1', 'test_red_1', true, 'x' + i);

  // 通常表示: ゾーンはコンパクト（最大2枚）・枚数バッジがauthoritative
  var ui = freshUi(state, { cpuMode: true });
  ui.renderZoneTerritory('self-territory-zone', state.player('P1').territory);
  var zone = getById('self-territory-zone');
  runner.assertEqual(zone.children[0].className, 'card-row card-row--compact', 'compact row');
  runner.assertTrue(zone.children[0].children.length <= 2, 'compact stack max 2 cards even with 10');
  runner.assertTrue(getById('self-territory-count').textContent == 10, 'count badge authoritative = 10');

  // 選択中: ピッカーは全10枚を保持。viewport/gridは変更しない（fixed overlay + モバイル外配置）
  global.triggerTerritoryDrawSelection(state, 'P1');
  ui.renderPendingEffect(state);
  runner.assertEqual(pickerCards().length, 10, 'picker shows all 10 cards');
  var before = getById('battle-viewport').children.length;
  // renderOpponent/renderSelf は zone の内部にしか描画しない。viewport直下の行数は不変。
  ui.renderOpponent(state.player('P2'), 'P2');
  ui.renderSelf(state.player('P1'), 'P1');
  runner.assertEqual(getById('battle-viewport').children.length, before, 'viewport grid rows unchanged while picker active');
  runner.assertEqual(getById('territory-picker').style.display, 'flex', 'picker still visible after re-render');

  // CSS: ピッカーは fixed overlay で100dvh gridに影響しない
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  runner.assert(/\.modal-overlay\s*\{[^}]*position:\s*fixed/.test(css), 'picker uses fixed positioning');
  runner.assert(/#territory-picker\.territory-picker\s*\{[^}]*z-index/.test(css), 'picker above viewport');
  var html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  var vpOpen = html.indexOf('mobile-frame battle-viewport');
  var pickerIdx = html.indexOf('id="territory-picker"');
  var lastDivBefore = html.lastIndexOf('</div>', pickerIdx);
  runner.assertTrue(vpOpen !== -1 && pickerIdx > vpOpen && lastDivBefore < pickerIdx, 'territory-picker declared outside battle-viewport');
});

/* ============================================================
   TP5  表向き縄張りをface-up表示可能（将来の《蜜蝋の壁》等）
   ============================================================ */
runner.test('TP5 face-up territory renders face-up in compact zone and picker', function () {
  installDom();
  requireUi();
  var state = h.newGame({ rng: h.firstPlayerRng });
  state.player('P1').territory = [];
  addTerritoryInst(state, 'P1', 'test_red_1', true, 'hidden');
  var exposed = addTerritoryInst(state, 'P1', 'okamakiri', false, 'exposed');
  global.triggerTerritoryDrawSelection(state, 'P1');

  var ui = freshUi(state, { cpuMode: true });

  // 通常表示: 表向き縄張りは小型faceupチップ
  ui.renderZoneTerritory('self-territory-zone', state.player('P1').territory);
  var chips = getById('self-territory-zone').children[0].children;
  var faceUpChip = null;
  for (var i = 0; i < chips.length; i++) {
    if (chips[i].className.indexOf('territory-faceup--mini') !== -1) faceUpChip = chips[i];
  }
  runner.assertTrue(!!faceUpChip, 'compact zone renders a face-up mini chip for exposed territory');

  // ピッカー: face-upカードは name 付きで識別可能
  ui.renderPendingEffect(state);
  var cards = pickerCards();
  runner.assertEqual(cards.length, 2, 'picker holds 2 cards');
  var upCard = null;
  for (var j = 0; j < cards.length; j++) {
    if (cards[j].className.indexOf('territory-picker__card--up') !== -1) upCard = cards[j];
  }
  runner.assertTrue(!!upCard, 'exposed territory is face-up in picker');
  var upName = upCard.children[0] ? upCard.children[0].textContent : '';
  runner.assertTrue(upName.indexOf('オオカマキリ') !== -1, 'face-up picker card shows card name (got "' + upName + '")');
  // face-upカードのタップも解決経路
  upCard.click();
  runner.assertEqual(state.pendingEffect, null, 'face-up territory resolves via existing path');
});

/* ============================================================
   TP6  hotseat (cpuMode=false): P2の防御pendingもピッカーで解決可能
   ============================================================ */
runner.test('TP6 hotseat defender (P2) pending is resolvable via picker', function () {
  installDom();
  requireUi();
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.toMainPhase(state);
  h.putInsectOnField(state, 'P1', 'test_red_1');
  state.player('P2').territory = [];
  addTerritoryInst(state, 'P2', 'test_red_1', true, 'd1');
  addTerritoryInst(state, 'P2', 'test_red_1', true, 'd2');
  var attacker = state.player('P1').field[0];
  var result = global.performAttack(state, attacker.instanceId, null, 'LEADER', 'attack');
  runner.assertTrue(result.wasTerritoryDraw, 'direct attack caused territory draw');

  var ui = freshUi(state, { cpuMode: false });
  ui.renderPendingEffect(state);
  runner.assertTrue(pickerVisible(), 'picker shows for hotseat defender');
  runner.assertEqual(pickerCards().length, 2, 'defender territory cards in picker');
  var beforeHand = state.player('P2').hand.length;
  pickerCards()[0].click();
  runner.assertEqual(state.pendingEffect, null, 'defender resolved');
  runner.assertEqual(state.player('P2').hand.length, beforeHand + 1, 'picked territory moved to hand');
  ui.renderPendingEffect(state);
  runner.assertTrue(!pickerVisible(), 'picker closed after hotseat resolve');
});

/* ============================================================
   TP7  CPU battle: P1(人間)の防御pendingはピッカー表示・解決。P2(pending)はCPUが処理するため非表示
   ============================================================ */
runner.test('TP7 CPU mode shows picker for P1 but never for P2', function () {
  installDom();
  requireUi();
  // P1 defense
  var s = h.newGame({ rng: h.firstPlayerRng });
  s.player('P1').territory = [];
  addTerritoryInst(s, 'P1', 'test_red_1', true, 'p1a');
  global.triggerTerritoryDrawSelection(s, 'P1');
  var ui = freshUi(s, { cpuMode: true });
  ui.renderPendingEffect(s);
  runner.assertTrue(pickerVisible(), 'P1 pending shows picker in CPU mode');
  pickerCards()[0].click();
  runner.assertEqual(s.pendingEffect, null, 'P1 pick resolves in CPU mode');

  // P2 pending (CPU処理対象) → ピッカー非表示
  var s2 = h.newGame({ rng: h.firstPlayerRng });
  s2.player('P2').territory = [];
  addTerritoryInst(s2, 'P2', 'test_red_1', true, 'p2a');
  global.triggerTerritoryDrawSelection(s2, 'P2');
  var ui2 = freshUi(s2, { cpuMode: true });
  ui2.renderPendingEffect(s2);
  runner.assertTrue(!pickerVisible(), 'P2 pending hides picker in CPU mode (CPU auto-resolves)');
});

/* ============================================================
   TP8  Tutorial の縄張りステップ（direct-attack→territory-to-hand）が完走する
   ============================================================ */
runner.test('TP8 tutorial territory steps complete (direct attack + territory to hand)', function () {
  require(path.join(__dirname, '..', 'js', 'tutorial', 'tutorial-scenario.js'));
  require(path.join(__dirname, '..', 'js', 'tutorial', 'tutorial-controller.js'));
  var engine = new global.GameEngine();
  var ui = { state: null, actionState: { mode: 'idle' }, render: function () {} };
  var controller = new global.TutorialController(engine, ui, global.TUTORIAL_SCENARIOS.basicV01);
  controller.start();
  ui.state = engine.state;

  // 直接攻撃ステップから。カナブンでLEADER直接攻撃 → P2の縄張り選択pending
  controller.seek('direct-attack');
  controller.engine.state.phase = global.Phases.MAIN_PHASE;
  controller.engine.state.player('P2').field = []; // 先の手順で相手虫は壊されている前提
  global.performAttack(controller.engine.state, controller.refs.firstDirectAttackerInstanceId, null, 'LEADER', 'taiatari');
  var pending = global.getPendingEffect(controller.engine.state);
  runner.assertTrue(pending && pending.type === 'TERRITORY_DRAW_SELECTION' && pending.playerId === 'P2', 'tutorial direct attack raises P2 territory selection');

  // observe() が direct-attack ステップ完了を判定して次ステップへ
  controller.observe();
  runner.assertEqual(controller.currentStep().id, 'territory-to-hand', 'advanced to territory-to-hand step');

  // territory-to-hand の autoResolve が縄張りを手札へ移して完了
  controller.observe();
  var moved = global.findAnywhere(controller.engine.state, controller.refs.opponentTerritoryInstanceId);
  runner.assertTrue(!!moved && (moved.zone === 'HAND' || moved.zone === 'RESOLVING'), 'auto-resolved territory moved out of TERRITORY');
  runner.assertEqual(global.getPendingEffect(controller.engine.state), null, 'pending cleared after auto resolve');
  runner.assertEqual(controller.currentStep().id, 'use-spell', 'tutorial territory step completed');
});

/* ============================================================
   TP9  Direct attack regression: DA2同等 + resolve既存ルートで手札+1
   ============================================================ */
runner.test('TP9 direct attack territory draw resolves through picker regression', function () {
  installDom();
  requireUi();
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.toMainPhase(state);
  h.putInsectOnField(state, 'P1', 'test_red_1');
  var attacker = state.player('P1').field[0];
  var result = global.performAttack(state, attacker.instanceId, null, 'LEADER', 'attack');
  runner.assertTrue(result.wasTerritoryDraw === true, 'direct attack triggers territory draw');
  runner.assertEqual(result.targetType, 'LEADER', 'attack targeted leader');
  var pending = global.getPendingEffect(state);
  runner.assertEqual(pending.type, 'TERRITORY_DRAW_SELECTION', 'pending type correct');

  // hotseat: 防御側P2をピッカーで解決
  var ui = freshUi(state, { cpuMode: false });
  ui.renderPendingEffect(state);
  runner.assertTrue(pickerVisible(), 'picker visible for defender');
  var beforeHand = state.player('P2').hand.length;
  pickerCards()[0].click();
  runner.assertEqual(state.pendingEffect, null, 'pending after resolve');
  runner.assertEqual(state.player('P2').hand.length, beforeHand + 1, 'territory drawn to hand');
});

/* ============================================================
   TP10 ライフサイクル: resetSession/newGame回帰・消滅系
   ============================================================ */
runner.test('TP10 picker closes on pending clear / GAME_OVER / resetSession', function () {
  installDom();
  requireUi();
  var state = h.newGame({ rng: h.firstPlayerRng });
  addTerritoryInst(state, 'P1', 'test_red_1', true, 'z');
  global.triggerTerritoryDrawSelection(state, 'P1');
  var ui = freshUi(state, { cpuMode: true });
  ui.renderPendingEffect(state);
  runner.assertTrue(pickerVisible(), 'picker open');

  // GAME_OVER: pendingなしレンダーで閉じる
  state.pendingEffect = null;
  ui.renderPendingEffect(state);
  runner.assertTrue(!pickerVisible(), 'picker closed after pending cleared');

  // resetSession系 (returnToDeckSelect) で非表示リストに含まれる
  var hiddenIds = ui.returnToDeckSelect.toString();
  runner.assertTrue(hiddenIds.indexOf('territory-picker') !== -1, 'returnToDeckSelect hides territory-picker');
});

/* ============================================================
   TP11 デバイスジオメトリ: 375x667 / 667x375 でピッカーカード&ボックスがviewport内
   ============================================================ */
runner.test('TP11 picker geometry fits 375x667 and 667x375 viewports', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');

  function clampValue(expr, vw, vh) {
    var m = expr.match(/clamp\(\s*([\d.]+)px\s*,\s*([\d.]+)vw\s*,\s*([\d.]+)px\s*\)/);
    if (!m) return null;
    var min = parseFloat(m[1]), mid = parseFloat(m[2]) * vw / 100, max = parseFloat(m[3]);
    return Math.max(min, Math.min(mid, max));
  }

  var cardW = css.match(/\.territory-picker__card\s*\{[^}]*width:\s*(clamp\([^)]+\))/);
  var cardH = css.match(/\.territory-picker__card\s*\{[^}]*height:\s*(clamp\([^)]+\))/);
  var boxW = css.match(/\.territory-picker__box\s*\{[^}]*max-width:\s*(clamp\([^)]+\))/);
  runner.assertTrue(!!cardW && !!cardH && !!boxW, 'picker uses clamp sizing');

  [[375, 667], [667, 375]].forEach(function (v) {
    var vw = v[0], vh = v[1];
    var w = clampValue(cardW[1], vw, vh);
    var h = clampValue(cardH[1], vw, vh);
    var bw = clampValue(boxW[1], vw, vh);
    runner.assertTrue(w >= 48 && w <= 64, 'card width in tap range at ' + vw + 'x' + vh + ' (got ' + w + ')');
    runner.assertTrue(h >= 68 && h <= 90, 'card height in tap range at ' + vw + 'x' + vh + ' (got ' + h + ')');
    runner.assertTrue(bw <= vw, 'picker box within viewport width at ' + vw + 'x' + vh + ' (got ' + bw + ')');
    // 88dvh上限で縦も収まる（vh/dvh同一視の検証）
    runner.assertTrue(88 * vh / 100 > h, 'picker vertical budget above card height at ' + vw + 'x' + vh);
  });
});

function runAll() { console.log('==== Territory Picker Test ===='); return runner.runAll(); }
if (require.main === module) runAll();
module.exports = { runAll: runAll };