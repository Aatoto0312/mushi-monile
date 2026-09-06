'use strict';

var fs = require('fs');
var path = require('path');
var TestRunner = require('./lib.js');
var h = require('./helpers.js');
var runner = new TestRunner();

require('./engine-loader.js');

var registry = {};
function makeElement(tag) {
  var el = {
    tagName: tag || 'div', children: [], dataset: {}, style: {}, textContent: '', className: '',
    _listeners: {}, disabled: false,
    appendChild: function (child) { this.children.push(child); return child; },
    addEventListener: function (type, fn) { this._listeners[type] = fn; },
    click: function () { if (this._listeners.click) this._listeners.click(); },
    setAttribute: function () {}, querySelector: function () { return null; }, querySelectorAll: function () { return []; },
    getBoundingClientRect: function () { return { top: 0, bottom: 100, height: 100 }; }
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
}
function setupInsect() {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var insect = h.putInsectOnField(state, 'P1', 'okamakiri');
  return { state: state, insect: insect };
}

/* ============================================================
   VP1  Battle viewport CSS contract
   ============================================================ */
runner.test('VP1 Battle viewport is fixed 100dvh overflow-hidden grid', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  runner.assert(/\.mobile-frame,\s*\.battle-viewport/.test(css), 'battle-viewport selector exists');
  runner.assert(/height:\s*100dvh/.test(css), 'height: 100dvh');
  runner.assert(/max-height:\s*100dvh/.test(css), 'max-height: 100dvh');
  runner.assert(/overflow:\s*hidden/.test(css), 'overflow hidden locks page');
  runner.assert(/display:\s*grid/.test(css), 'viewport uses CSS Grid');
  runner.assert(/grid-template-rows/.test(css), 'grid-template-rows budget defined');
});

/* ============================================================
   VP2  Portrait zone contract: grid, min-height:0, overflow hidden
   ============================================================ */
runner.test('VP2 Portrait zones are grid with overflow hidden and min-height:0', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  var portrait = css.slice(0, css.indexOf('@media'));
  runner.assert(/\.zone\s*\{[^}]*display:\s*grid/.test(portrait), 'zone uses grid in portrait');
  runner.assert(/\.zone\s*\{[^}]*min-height:\s*0/.test(portrait), 'zone min-height:0');
  runner.assert(/\.zone\s*\{[^}]*overflow:\s*hidden/.test(portrait), 'zone overflow hidden');
  runner.assert(/\.zone--cpu\s*\{/.test(portrait), 'zone--cpu portrait grid');
  runner.assert(/\.zone--human\s*\{/.test(portrait), 'zone--human portrait grid');
  runner.assert(/grid-template-areas/.test(portrait), 'grid-template-areas in portrait');
});

/* ============================================================
   VP3  Aux rail fixed height + aux zones max-height
   ============================================================ */
runner.test('VP3 Aux rail and sub-zones have bounded heights', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  runner.assert(/--aux-rail-h/.test(css), 'aux-rail-h variable defined');
  runner.assert(/\.aux-strip\s*\{[^}]*overflow-y:\s*hidden/.test(css), 'aux-strip overflow-y hidden');
  runner.assert(/\.aux-strip \.territory-zone\s*\{[^}]*max-height/.test(css), 'territory-zone max-height locked');
  runner.assert(/\.food-zone[^}]*max-height:\s*var\(--card-h-aux\)/.test(css), 'food-zone max-height locked');
  runner.assert(/\.discard-zone[^}]*max-height:\s*var\(--card-h-aux\)/.test(css), 'discard-zone max-height locked');
  runner.assert(/\.deck-zone[^}]*max-height:\s*var\(--card-h-deck-pile\)/.test(css), 'deck-zone max-height locked');
});

/* ============================================================
   VP4  Field / Hand do not grow with content
   ============================================================ */
runner.test('VP4 Field and hand use flex-fill inside fixed rows', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  runner.assert(/\.field-zone\s*\{[^}]*flex:\s*1\s+1\s+auto/.test(css), 'field-zone flex-fill');
  runner.assert(/\.hand-zone\s*\{[^}]*flex:\s*1\s+1\s+auto/.test(css), 'hand-zone flex-fill');
  runner.assert(/\.zone-group--field\s*\{[^}]*min-height:\s*0/.test(css), 'field group min-height:0');
  runner.assert(/\.zone-group--hand[^}]*min-height:\s*0/.test(css), 'hand group min-height:0');
  runner.assert(/\.hand-zone\s*\{[^}]*overflow-x:\s*auto/.test(css), 'hand scrolls horizontally');
  runner.assert(/\.field-zone\s*\{[^}]*overflow-x:\s*auto/.test(css), 'field scrolls horizontally');
});

/* ============================================================
   VP5  Territory compact default (max 2 backs) + expanded pending
   ============================================================ */
runner.test('VP5 Territory compact default renders max 2 backs and expands on pending', function () {
  installDom();
  require(path.join(__dirname, '..', 'js', 'ui', 'card-ui.js'));
  require(path.join(__dirname, '..', 'js', 'ui', 'battle-ui.js'));
  var setup = setupInsect();
  setup.state.player('P1').territory = [];
  var territory = [];
  for (var i = 0; i < 6; i++) {
    territory.push(h.addToTerritoryRaw(setup.state, 'P1', global.getCardDefinition('okamakiri')));
  }
  var ui = Object.create(global.BattleUI.prototype);
  ui.state = setup.state;
  ui.cpuMode = false;
  ui.logUI = { clear: function () {} };
  ui.actionState = { mode: 'idle' };

  // 通常時: コンパクトスタック → 最大2枚
  ui.renderZoneTerritory('self-territory-zone', territory);
  var container = getById('self-territory-zone');
  var compactRow = container.children[0];
  runner.assertEqual(compactRow.className, 'card-row card-row--compact', 'compact row class');
  runner.assertTrue(compactRow.children.length <= 2, 'compact max 2 cards');

  // pending 時: ゾーンはコンパクトのまま(伸ばさない)。選択UIは専用ピッカーに表示
  ui.state.pendingEffect = { type: 'TERRITORY_DRAW_SELECTION', playerId: 'P1', options: territory.map(function (t) { return t.instanceId; }) };
  ui.renderZoneTerritory('self-territory-zone', territory);
  var compactAfterPending = container.children[0];
  runner.assertEqual(compactAfterPending.className, 'card-row card-row--compact', 'zone stays compact during pending');
  runner.assertTrue(compactAfterPending.children.length <= 2, 'zone stays compact (max 2) during pending');

  ui.renderPendingEffect(ui.state);
  var picker = getById('territory-picker');
  var cardsEl = getById('territory-picker-cards');
  runner.assertEqual(picker.style.display, 'flex', 'picker visible during pending');
  runner.assertEqual(cardsEl.children.length, 6, 'picker holds all 6 territory cards');
});

/* ============================================================
   VP6  CPU hand max 3 backs (compact) in aux
   ============================================================ */
runner.test('VP6 CPU hand renders at most 3 face-down backs', function () {
  installDom();
  require(path.join(__dirname, '..', 'js', 'ui', 'card-ui.js'));
  require(path.join(__dirname, '..', 'js', 'ui', 'battle-ui.js'));
  var setup = setupInsect();
  for (var i = 0; i < 12; i++) h.addToHandRaw(setup.state, 'P2', global.getCardDefinition('okamakiri'));
  var ui = Object.create(global.BattleUI.prototype);
  ui.state = setup.state;
  ui.cpuMode = false;
  ui.logUI = { clear: function () {} };
  ui.actionState = { mode: 'idle' };

  ui.renderZoneHand('opp-hand-zone', 12, false, null, 'P2');
  var zone = getById('opp-hand-zone');
  var row = zone.children[0];
  runner.assertTrue(row.children.length === 3, 'CPU hand capped at 3 backs');
  var countBadge = getById('opp-hand-count');
  runner.assertTrue(countBadge && countBadge.textContent == '12', 'count badge shows real count 12');
});

/* ============================================================
   VP7  Landscape viewport locked and grid-template-areas preserved
   ============================================================ */
runner.test('VP7 Landscape viewport uses fixed height grid with preserved areas', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  var landscape = css.slice(css.indexOf('@media (orientation: landscape) and (max-height: 520px)'));
  runner.assert(/\.mobile-frame,\s*\.battle-viewport/.test(landscape), 'landscape viewport selector');
  runner.assert(/height:\s*100dvh/.test(landscape), 'landscape 100dvh height');
  runner.assert(/overflow:\s*hidden/.test(landscape), 'landscape overflow hidden');
  runner.assert(/grid-template-rows/.test(landscape), 'landscape grid budget');
  runner.assert(/\.zone--cpu\s*\{[^}]*"info aux"/.test(landscape), 'cpu landscape areas');
  runner.assert(/\.zone--human\s*\{[^}]*"hand\s+hand"/.test(landscape), 'human landscape hand row');
  runner.assert(/\.zone--human\s*\{[^}]*"field field"/.test(landscape), 'human landscape field row');
});

/* ============================================================
   VP8  Full mid-game scenario: field 5 + hand 7 + food 3 + discard 3 + territory 6
       — render completes without error, counts match, root stays bounded
   ============================================================ */
runner.test('VP8 Full mid-game scenario renders without error', function () {
  installDom();
  require(path.join(__dirname, '..', 'js', 'ui', 'card-ui.js'));
  require(path.join(__dirname, '..', 'js', 'ui', 'battle-ui.js'));
  var state = h.newGame({ rng: h.firstPlayerRng });
  var self = state.player('P1');
  var opp = state.player('P2');

  // field 5 (P1)
  self.field = [];
  for (var i = 0; i < 5; i++) h.putInsectOnField(state, 'P1', 'okamakiri');
  // hand 7 (P1)
  self.hand = [];
  for (var j = 0; j < 7; j++) h.addToHandRaw(state, 'P1', global.getCardDefinition('okamakiri'));
  // food 3
  self.food = [];
  for (var f = 0; f < 3; f++) h.addToFoodRaw(state, 'P1', global.getCardDefinition('okamakiri'));
  // discard 3
  self.discard = [];
  for (var d = 0; d < 3; d++) {
    var discardInst = new global.CardInstance({
      instanceId: state.nextInstanceId(),
      cardId: 'okamakiri',
      ownerId: 'P1',
      zone: global.ZONES.DISCARD,
      currentHp: 600,
      baseHp: 600
    });
    self.discard.push(discardInst);
  }
  // territory 6
  self.territory = [];
  for (var t = 0; t < 6; t++) h.addToTerritoryRaw(state, 'P1', global.getCardDefinition('okamakiri'));
  // opp: field 2, hand 5, food 2, discard 1, territory 4
  opp.field = [];
  for (var i2 = 0; i2 < 2; i2++) h.putInsectOnField(state, 'P2', 'okamakiri');
  opp.hand = [];
  for (var j2 = 0; j2 < 5; j2++) h.addToHandRaw(state, 'P2', global.getCardDefinition('okamakiri'));
  opp.food = [];
  for (var f2 = 0; f2 < 2; f2++) h.addToFoodRaw(state, 'P2', global.getCardDefinition('okamakiri'));
  opp.discard = [];
  for (var d2 = 0; d2 < 1; d2++) h.addToHandRaw(state, 'P2', global.getCardDefinition('okamakiri'));
  opp.territory = [];
  for (var t2 = 0; t2 < 4; t2++) h.addToTerritoryRaw(state, 'P2', global.getCardDefinition('okamakiri'));

  var ui = Object.create(global.BattleUI.prototype);
  ui.state = state;
  ui.cpuMode = false;
  ui.logUI = { clear: function () {}, render: function () {} };
  ui.actionState = { mode: 'idle' };
  ui._detailInstanceId = null;
  ui.tutorialController = null;

  // render should not throw
  ui.renderOpponent(opp, 'P2');
  ui.renderSelf(self, 'P1');

  // verify cardinalities
  runner.assertTrue(getById('opp-field-zone').children[0].children.length === 2, 'opp field 2');
  runner.assertTrue(getById('self-field-zone').children[0].children.length === 5, 'self field 5');
  runner.assertTrue(getById('self-hand-zone').children[0].children.length === 7, 'self hand 7');
  runner.assertTrue(getById('self-food-zone').children[0].children.length === 3, 'self food 3');
  runner.assertTrue(getById('self-discard-zone').children[0].children.length === 3, 'self discard 3');
  runner.assertTrue(getById('opp-deck-zone').children.length > 0, 'opp deck present');
  runner.assertTrue(getById('self-deck-zone').children.length > 0, 'self deck present');

  // territory compact: max 2
  runner.assertTrue(getById('self-territory-zone').children[0].children.length <= 2, 'self territory compact');

  // measureLayout returns ok-like structure
  var metrics = ui.measureLayout();
  runner.assertTrue(metrics && typeof metrics === 'object', 'measureLayout returns object');
  runner.assertTrue(typeof metrics.summary === 'string', 'summary is string');
  runner.assertTrue(typeof metrics.ok === 'boolean', 'ok is boolean');
});

/* ============================================================
   VP9  Layout budget percentages sum to <= 100%
   ============================================================ */
runner.test('VP9 Portrait row budget sums to at most 100%', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  var portrait = css.slice(0, css.indexOf('@media'));
  // Extract % from minmax(...) in :root budget variables (portrait only)
  var budgetVars = portrait.match(/--row-[^:]+:\s*minmax\([^)]+\)/g) || [];
  var percentTotal = 0;
  for (var i = 0; i < budgetVars.length; i++) {
    var m = budgetVars[i].match(/([\d.]+)%/g) || [];
    for (var j = 0; j < m.length; j++) percentTotal += parseFloat(m[j]);
  }
  // Also include clamp(...) percentage args from --row-action
  var clampVars = portrait.match(/--row-[^:]+:\s*clamp\([^)]+\)/g) || [];
  for (var c = 0; c < clampVars.length; c++) {
    var pm = clampVars[c].match(/([\d.]+)%/g) || [];
    for (var j2 = 0; j2 < pm.length; j2++) percentTotal += parseFloat(pm[j2]);
  }
  runner.assertTrue(percentTotal <= 100, 'portrait budget total ' + percentTotal + '% <= 100%');
  runner.assertTrue(percentTotal >= 10 && percentTotal <= 100, 'portrait budget sensible range (actual ' + percentTotal + '%)');
});

runner.test('VP10 Landscape viewport budget sums to at most 100%', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  var landscape = css.slice(css.indexOf('@media (orientation: landscape) and (max-height: 520px)'));
  var gpMatch = landscape.match(/grid-template-rows\s*:\s*([^;]+);/);
  runner.assert(gpMatch, 'landscape grid-template-rows present');
  var rows = gpMatch[1];
  var percentTotal = 0;
  var percents = rows.match(/([\d.]+)%/g) || [];
  for (var i = 0; i < percents.length; i++) percentTotal += parseFloat(percents[i]);
  runner.assertTrue(percentTotal <= 100, 'landscape budget total ' + percentTotal + '% <= 100%');
});

async function runAll() { console.log('==== Battle Viewport Test ===='); return runner.runAll(); }
if (require.main === module) runAll();
module.exports = { runAll: runAll };
