'use strict';
var TestRunner = require('./lib.js');
require('./engine-loader.js');
var runtime = require('../shared/deck-format/runtime.js');
var runner = new TestRunner();

function set1Deck() {
  var defs = global.cardRegistry.getBySet('BOOSTER_SET_1').slice(0, 10);
  return {
    formatVersion: 'mushijingi-deck/1.0', deckId: 'deck:toolbox:set1', deckName: 'SET1 user',
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
    cardDataVersion: 'card-registry/1', rulesetId: 'ruleset:standard:v1',
    cards: defs.map(function (def) { return { printingId: 'registry:' + def.id, canonicalCardId: def.id, quantity: 2 }; })
  };
}

runner.test('Saved SET1 user deck validates and expands to shared CardDefinitions', function () {
  var result = runtime.validateForBattle(set1Deck(), global.cardRegistry);
  runner.assert(result.valid, result.errors.join(', '));
  runner.assertEqual(result.definitions.length, 20, 'expanded size');
  runner.assert(result.definitions.every(function (def) { return def.set === 'BOOSTER_SET_1'; }), 'SET1 definitions');
});

runner.test('SET1 user deck starts a CPU-compatible Battle game', function () {
  var result = runtime.validateForBattle(set1Deck(), global.cardRegistry);
  var cpuDeck = global.expandStarterDeck(global.STARTER_DECK_RECIPES.OKAMAKIRI);
  var engine = new global.GameEngine();
  engine.newGame(result.definitions, cpuDeck, { rng: function () { return 0.25; } });
  var state = engine.getState();
  var player = state.players.P1;
  var ids = player.hand.concat(player.territory, player.deck).map(function (card) { return global.cardRegistry.get(card.cardId); });
  runner.assertEqual(player.hand.length, 4, 'initial hand');
  runner.assertEqual(player.territory.length, 6, 'territory');
  runner.assert(ids.every(function (def) { return def && def.set === 'BOOSTER_SET_1'; }), 'SET1 remains in zones');
});

runner.test('Invalid, unknown and unimplemented saved decks are rejected', function () {
  var deck = set1Deck(); deck.cards[0].canonicalCardId = 'missing';
  runner.assert(!runtime.validateForBattle(deck, global.cardRegistry).valid, 'unknown rejected');
  var blockedRegistry = { get: function () { return { name: 'blocked', isPlayable: function () { return false; } }; } };
  runner.assert(!runtime.validateForBattle(set1Deck(), blockedRegistry).valid, 'unimplemented rejected');
});

module.exports = runner;
