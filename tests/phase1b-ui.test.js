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
    setAttribute: function () {}, querySelector: function () { return null; }, querySelectorAll: function () { return []; }
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
  global.document = { createElement: makeElement, getElementById: getById, querySelectorAll: function () { return []; } };
}
installDom();
global.window = global;
require(path.join(__dirname, '..', 'js', 'ui', 'card-ui.js'));
require(path.join(__dirname, '..', 'js', 'ui', 'battle-ui.js'));

function allText(el) { return [el.textContent || ''].concat((el.children || []).map(allText)).join(' '); }
function setupInsect() {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var insect = h.putInsectOnField(state, 'P1', 'okamakiri');
  return { state: state, insect: insect };
}

runner.test('Phase1B1 responsive landscape grid and portrait-safe hand scroll contracts exist', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  var html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  runner.assert(/orientation:\s*landscape/.test(css), 'landscape media query');
  runner.assert(/grid-template-areas/.test(css), 'landscape grid');
  runner.assert(/\.hand-zone[\s\S]*overflow-x:\s*auto/.test(css), 'hand horizontal scroll');
  runner.assert(/\.hand-zone[\s\S]*min-width/.test(css), 'hand practical minimum width');
  runner.assert(/zone-group--field/.test(html), 'semantic field zone class');
});

runner.test('Phase1B2 many hand cards remain individual elements and selected card is marked', function () {
  installDom();
  var setup = setupInsect();
  var hand = [];
  for (var i = 0; i < 12; i++) hand.push(h.addToHandRaw(setup.state, 'P1', global.getCardDefinition('okamakiri')));
  var ui = Object.create(global.BattleUI.prototype);
  ui.state = setup.state; ui.actionState = { mode: 'idle' }; ui.cpuMode = false;
  ui.onHandCardTap = function (pid, inst) { this._detailInstanceId = inst.instanceId; };
  ui.renderZoneHand('self-hand-zone', hand.length, true, hand, 'P1');
  var row = getById('self-hand-zone').children[0];
  runner.assertEqual(row.children.length, 12, 'all hand cards preserved');
  row.children[7].click();
  runner.assertTrue(row.children[7].classList.contains('selected-hand-card'), 'selected hand card marked');
});

runner.test('Phase1B3 field card shows attacked, AP, HP, color and attachment state', function () {
  installDom();
  var x = setupInsect();
  x.insect.attackedThisTurn = true;
  var jaw = h.addToHandRaw(x.state, 'P1', global.getCardDefinition('kamikiri_no_daigaku'));
  var cloak = h.addToHandRaw(x.state, 'P1', global.getCardDefinition('minomushi_no_kakuremino'));
  var color = h.addToHandRaw(x.state, 'P1', global.getCardDefinition('tamamushiiro_no_uka'));
  x.insect.attachments = [jaw, cloak, color]; color.chosenColor = global.Attributes.BLUE;
  var el = global.CardUI.renderFieldInsect(x.insect, x.state);
  var text = allText(el);
  runner.assertTrue(el.classList.contains('is-attacked'), 'attacked class');
  runner.assert(/攻撃済/.test(text), 'attacked badge');
  runner.assert(/AP\s*\+300/.test(text), 'AP delta');
  runner.assert(/HP\s*\+500/.test(text), 'HP delta');
  runner.assert(/赤.*青/.test(text), 'effective color change');
  runner.assert(/強化\s*3/.test(text), 'attachment count');
});

runner.test('Phase1B4 detail exposes effective values and modifier sources without mutating base stats', function () {
  installDom();
  var x = setupInsect();
  var baseHp = x.insect.baseHp;
  var jaw = h.addToHandRaw(x.state, 'P1', global.getCardDefinition('kamikiri_no_daigaku'));
  var cloak = h.addToHandRaw(x.state, 'P1', global.getCardDefinition('minomushi_no_kakuremino'));
  var color = h.addToHandRaw(x.state, 'P1', global.getCardDefinition('tamamushiiro_no_uka'));
  x.insect.attachments = [jaw, cloak, color]; color.chosenColor = global.Attributes.GREEN;
  var detail = global.CardUI.getCardDetail(x.insect, x.state);
  runner.assertEqual(detail.effectiveColor, '緑');
  runner.assertEqual(detail.effectiveMaxHp, baseHp + 500);
  runner.assertEqual(detail.skills[0].effectiveAp, detail.skills[0].baseAp + 300);
  runner.assertEqual(detail.attachments.length, 3);
  runner.assertTrue(detail.apModifierSources.join(' ').indexOf('天牛の大顎') >= 0);
  runner.assertTrue(detail.hpModifierSources.join(' ').indexOf('蓑虫の隠れ蓑') >= 0);
  runner.assertEqual(x.insect.baseHp, baseHp, 'base HP remains immutable');
});

runner.test('Phase1B5 existing GAME_OVER and pending overlays remain fixed and above board', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  runner.assert(/\.overlay\s*\{[\s\S]*position:\s*fixed[\s\S]*z-index:\s*200/.test(css));
  runner.assert(/\.damage-vector\s*\{[\s\S]*position:\s*fixed/.test(css));
  runner.assert(/\.field-card\.legal-target/.test(css));
});

runner.test('Phase1B6 NEW clears the old match and waits for fresh deck selection', function () {
  installDom();
  var engine = new global.GameEngine();
  var deck = global.buildStarterTestDeck();
  engine.newGame(deck, deck.slice(), { rng: h.firstPlayerRng });
  engine.state.pendingEffect = { type: 'TEST_PENDING', playerId: 'P1' };
  var oldState = engine.state;
  var ui = Object.create(global.BattleUI.prototype);
  ui.engine = engine; ui.state = oldState; ui.cpuMode = true;
  ui.logUI = { clear: function () {} };
  ui.cpuRunner = { isRunning: true };
  ui.selectedDecks = { P1: 'KABUTOMUSHI', P2: 'OKAMAKIRI' };
  ui._deckSelectDone = { P1: true, P2: true };
  ui._detailInstanceId = 'old-selected-card';
  ui.actionState = { mode: 'attackTarget', attackerInstanceId: 'old-attacker', legalTargets: ['old-target'] };
  ui.returnToDeckSelect();
  runner.assertTrue(ui.state !== oldState, 'old GameState replaced');
  runner.assertEqual(ui.state.pendingEffect, null, 'pending cleared');
  runner.assertEqual(ui._detailInstanceId, null, 'selected detail cleared');
  runner.assertEqual(ui.actionState.mode, 'idle', 'selection mode cleared');
  runner.assertEqual(ui.selectedDecks.P1, null, 'P1 deck not preselected');
  runner.assertEqual(ui.selectedDecks.P2, null, 'P2 deck not preselected');
  runner.assertEqual(ui._deckSelectDone.P1, false);
  runner.assertEqual(ui._deckSelectDone.P2, false);
  runner.assertEqual(getById('deck-select-overlay').style.display, 'flex', 'deck selection shown');
  runner.assertEqual(ui.cpuRunner, null, 'old CPU runner detached');
});

runner.test('Phase1B7 landscape prioritizes self field, full-width hand tray and controls without changing portrait', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  runner.assert(/\.zone-bottom\s*\{\s*order:\s*1/.test(css), 'self board appears first in landscape');
  runner.assert(/\.zone-bottom[\s\S]*grid-template-areas:[\s\S]*"hand hand hand hand"/.test(css), 'self hand spans landscape tray');
  runner.assert(/\.control-bar\s*\{[\s\S]*position:\s*sticky[\s\S]*bottom:\s*0/.test(css), 'controls stay accessible');
  runner.assert(/@media\s*\(orientation:\s*landscape\)/.test(css), 'layout remains landscape-scoped');
});

async function runAll() { console.log('==== Phase 1-B UI Test ===='); return runner.runAll(); }
if (require.main === module) runAll();
module.exports = { runAll: runAll };
