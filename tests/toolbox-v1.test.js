'use strict';

var TestRunner = require('./lib.js');
require('./engine-loader.js');
var catalog = require('../shared/card-data/registry-catalog.js');
var core = require('../toolbox/toolbox-core.js');
var runner = new TestRunner();

function futureCard(id, overrides) {
  var data = Object.assign({
    id: id, officialNumber: '001/100', name: '未来虫', set: 'SET9', rarity: 'R',
    type: 'INSECT', color: 'RED', cost: 2, baseHp: 700, skills: [], passiveAbilities: [],
    cardEffects: [], enhancementEffects: [], tags: ['future'], implementationStatus: 'TESTED'
  }, overrides || {});
  data.isPlayable = function () { return data.implementationStatus === 'TESTED'; };
  return data;
}

runner.test('Registry catalog automatically includes Starter, SET1 and a future set', function () {
  var defs = global.cardRegistry.getAll().concat([futureCard('future_set9')]);
  var cards = catalog.fromDefinitions(defs);
  runner.assert(cards.some(function (x) { return x.set === 'STARTER'; }), 'Starter present');
  runner.assert(cards.some(function (x) { return x.set === 'BOOSTER_SET_1'; }), 'SET1 present');
  runner.assert(cards.some(function (x) { return x.set === 'SET9'; }), 'future set present');
  runner.assertEqual(cards.filter(function (x) { return x.set === 'BOOSTER_SET_1'; }).length, 106, 'SET1 count');
});

runner.test('Search, combined filters and dynamic options use registry-derived fields', function () {
  var cards = catalog.fromDefinitions([
    futureCard('future_red', { name: '赤虫', officialNumber: '009/100', rarity: 'SR' }),
    futureCard('future_blue', { name: '青虫', officialNumber: '010/100', color: 'BLUE', cost: 3 })
  ]);
  runner.assertEqual(core.filterCatalog(cards, { query: '009/100' }).length, 1, 'official number search');
  runner.assertEqual(core.filterCatalog(cards, { query: '青虫' }).length, 1, 'name search');
  runner.assertEqual(core.filterCatalog(cards, { set: 'SET9', type: 'INSECT', color: 'RED', cost: '2', rarity: 'SR', implementationStatus: 'TESTED' }).length, 1, 'combined');
  var options = core.deriveFilterOptions(cards);
  runner.assert(options.set.indexOf('SET9') !== -1, 'future set option');
  runner.assert(options.rarity.indexOf('SR') !== -1, 'rarity option');
});

runner.test('Catalog sort supports official number, name, cost and HP', function () {
  var cards = catalog.fromDefinitions([
    futureCard('b', { name: 'B', officialNumber: '020/100', cost: 1, baseHp: 900 }),
    futureCard('a', { name: 'A', officialNumber: '003/100', cost: 4, baseHp: 300 })
  ]);
  runner.assertEqual(core.sortCatalog(cards, 'officialNumber')[0].cardId, 'a', 'number');
  runner.assertEqual(core.sortCatalog(cards, 'name')[0].cardId, 'a', 'name');
  runner.assertEqual(core.sortCatalog(cards, 'cost')[0].cardId, 'b', 'cost');
  runner.assertEqual(core.sortCatalog(cards, 'hp')[0].cardId, 'a', 'hp');
});

runner.test('Deck validation enforces 20 cards, same-name limit and Battle playability', function () {
  var cards = catalog.fromDefinitions([
    futureCard('playable_a', { name: '同名' }),
    futureCard('playable_b', { name: '同名', officialNumber: '002/100' }),
    futureCard('blocked', { implementationStatus: 'BLOCKED', name: '保留' })
  ]);
  var deck = core.createDeck({ deckId: 'deck:toolbox:test', deckName: 'test', cardDataVersion: 'registry/1', rulesetId: 'ruleset:standard:v1' });
  deck.cards = [{ printingId: 'registry:playable_a', canonicalCardId: 'playable_a', quantity: 20 }];
  runner.assert(!core.validateDeck(deck, cards).valid, 'same-name max two');
  deck.cards = [{ printingId: 'registry:blocked', canonicalCardId: 'blocked', quantity: 2 }];
  var validation = core.validateDeck(deck, cards);
  runner.assert(validation.storable, 'incomplete deck remains storable');
  runner.assert(!validation.battleReady, 'blocked card cannot battle');
});

runner.test('Deck store supports duplicate and safely isolates corrupted decks', function () {
  var deck = core.createDeck({ deckId: 'deck:toolbox:one', deckName: 'one', cardDataVersion: 'registry/1', rulesetId: 'ruleset:standard:v1' });
  var copy = core.duplicateDeck(deck, { deckId: 'deck:toolbox:two', now: '2026-01-01T00:00:00.000Z' });
  runner.assertEqual(copy.deckId, 'deck:toolbox:two', 'new ID');
  runner.assert(copy.deckName.indexOf('コピー') !== -1, 'copy name');
  var parsed = core.parseDeckStore(JSON.stringify({ storageVersion: 1, activeDeckId: deck.deckId, decks: [deck, { broken: true }] }));
  runner.assertEqual(parsed.decks.length, 1, 'valid deck retained');
  runner.assert(parsed.recoveryWarning, 'corruption warning');
});

runner.test('500-card catalog remains searchable, filterable, sortable and deckable', function () {
  var defs = [];
  for (var i = 0; i < 500; i += 1) {
    defs.push(futureCard('mock_' + i, { name: '模擬虫' + i, set: 'SET' + (2 + (i % 6)), officialNumber: String(i + 1).padStart(3, '0') + '/500', cost: i % 6, baseHp: 100 + i }));
  }
  var cards = catalog.fromDefinitions(defs);
  runner.assertEqual(cards.length, 500, 'catalog size');
  runner.assertEqual(core.filterCatalog(cards, { query: '模擬虫499', set: 'SET3' }).length, 1, 'combined search');
  runner.assertEqual(core.sortCatalog(cards, 'hp')[0].baseHp, 100, 'sort');
  var deck = core.createDeck({ deckId: 'deck:toolbox:scale', cardDataVersion: 'registry/1', rulesetId: 'ruleset:standard:v1' });
  deck = core.addCatalogCard(deck, cards[0]);
  runner.assertEqual(deck.cards[0].canonicalCardId, 'mock_0', 'deck selection');
});

module.exports = runner;
