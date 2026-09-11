'use strict';
var TestRunner = require('./lib.js');
require('./engine-loader.js');
require('../js/ui/battle-ui.js');
var runtime = require('../shared/deck-format/runtime.js');
var runner = new TestRunner();

function savedDeck(id, valid) {
  var defs = global.cardRegistry.getBySet('BOOSTER_SET_1').slice(0, 10);
  return {
    formatVersion: 'mushijingi-deck/1.0', deckId: id, deckName: valid ? 'Browser SET1' : 'Invalid deck',
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
    cardDataVersion: 'card-registry/1', rulesetId: 'ruleset:standard:v1',
    cards: valid
      ? defs.map(function (def) { return { printingId: 'registry:' + def.id, canonicalCardId: def.id, quantity: 2 }; })
      : [{ printingId: 'registry:missing', canonicalCardId: 'missing', quantity: 20 }]
  };
}

function withBrowserGlobals(decks, handoff, callback) {
  var previous = {
    document: global.document, localStorage: global.localStorage, sessionStorage: global.sessionStorage,
    location: global.location, runtime: global.MushijingiDeckRuntime
  };
  var elements = {
    'user-deck-p1': { innerHTML: '', value: '' }, 'user-deck-p2': { innerHTML: '', value: '' },
    'btn-user-deck-p1': { disabled: false }, 'btn-user-deck-p2': { disabled: false },
    'battle-to-toolbox': { href: '' }, 'deck-select-overlay': { style: {} },
    'deck-select-title': { textContent: '' }, 'deck-p1-label': { textContent: '' }, 'deck-p2-label': { textContent: '' }
  };
  global.document = { getElementById: function (id) { return elements[id] || null; } };
  global.localStorage = { getItem: function (key) { return key === runtime.STORAGE_KEY ? JSON.stringify({ storageVersion: 1, activeDeckId: handoff, decks: decks }) : null; } };
  global.sessionStorage = { getItem: function (key) { return key === runtime.HANDOFF_KEY ? handoff : null; } };
  global.location = { search: '?deck=' + encodeURIComponent(handoff || '') };
  global.MushijingiDeckRuntime = runtime;
  try { callback(elements); }
  finally {
    global.document = previous.document; global.localStorage = previous.localStorage;
    global.sessionStorage = previous.sessionStorage; global.location = previous.location;
    global.MushijingiDeckRuntime = previous.runtime;
  }
}

runner.test('Initial CPU deck selection loads saved decks before opening the select UI', function () {
  var deck = savedDeck('deck:toolbox:browser', true);
  withBrowserGlobals([deck], deck.deckId, function (elements) {
    var ui = Object.create(global.BattleUI.prototype);
    ui._deactivateTutorial = function () {};
    ui.cpuMode = false;
    ui.startVsCpu();
    runner.assert(elements['user-deck-p1'].innerHTML.indexOf('Browser SET1') !== -1, 'saved deck option generated');
    runner.assertEqual(elements['user-deck-p1'].value, deck.deckId, 'handoff deck selected');
    runner.assertEqual(elements['deck-select-overlay'].style.display, 'flex', 'select UI opened');
  });
});

runner.test('Invalid saved deck remains visible but cannot be started', function () {
  var deck = savedDeck('deck:toolbox:invalid', false);
  withBrowserGlobals([deck], deck.deckId, function (elements) {
    var ui = Object.create(global.BattleUI.prototype);
    ui._loadUserDecks();
    runner.assert(elements['user-deck-p1'].innerHTML.indexOf('Invalid deck（対戦不可）') !== -1, 'invalid deck shown');
    runner.assert(elements['user-deck-p1'].innerHTML.indexOf(' disabled') !== -1, 'invalid option disabled');
    runner.assertEqual(elements['btn-user-deck-p1'].disabled, true, 'start button disabled');
  });
});

module.exports = runner;
