'use strict';

var TestRunner = require('./lib.js');
var data = require('../shared/card-data/starter-v1.js');
var deckFormat = require('../shared/deck-format');
var runner = new TestRunner();

function loadToolboxCore() {
  try {
    return require('../toolbox/toolbox-core.js');
  } catch (err) {
    throw new Error('Toolbox core must be implemented: ' + err.message);
  }
}

function cards() {
  return loadToolboxCore().buildToolboxCards(data);
}

runner.test('Toolbox reads exactly 24 STARTER cards from common DB', function () {
  runner.assertEqual(cards().length, 24, 'card count');
});

runner.test('Toolbox common DB view contains zero TEST cards', function () {
  runner.assertEqual(cards().some(function (card) {
    return card.printing.setId === 'TEST' || card.canonicalCardId.indexOf('test_') === 0;
  }), false, 'no TEST cards');
});

runner.test('Toolbox sorts by structured collector number', function () {
  var sorted = loadToolboxCore().sortCardsByOfficialNumber(cards());
  var knownNumbers = sorted.filter(function (card) {
    return card.printing.collectorNumber.state === 'known';
  }).map(function (card) {
    return card.printing.collectorNumber.value.number;
  });
  runner.assertEqual(knownNumbers.join(','), knownNumbers.slice().sort(function (a, b) { return a - b; }).join(','), 'numeric order');
});

runner.test('Toolbox puts unresolved official number last', function () {
  var sorted = loadToolboxCore().sortCardsByOfficialNumber(cards());
  runner.assertEqual(sorted[sorted.length - 1].canonicalCardId, 'mushi_no_ibuki', 'blocked number last');
});

runner.test('Toolbox searches Japanese card names by partial match', function () {
  var result = loadToolboxCore().filterCards(cards(), { query: 'アゲハ' });
  runner.assertEqual(result.length, 2, 'Japanese partial-name result');
});

runner.test('Toolbox searches canonicalCardId by partial match', function () {
  var result = loadToolboxCore().filterCards(cards(), { query: 'ginyan' });
  runner.assertEqual(result.length, 1, 'canonical ID result');
  runner.assertEqual(result[0].canonicalCardId, 'ginyanma', 'canonical ID match');
});

runner.test('Toolbox filters card type', function () {
  runner.assertEqual(loadToolboxCore().filterCards(cards(), { type: 'SPELL' }).length, 4, 'SPELL count');
});

runner.test('Toolbox filters known and unknown colors', function () {
  var core = loadToolboxCore();
  runner.assertEqual(core.filterCards(cards(), { color: 'RED' }).length, 6, 'RED count');
  runner.assertEqual(core.filterCards(cards(), { color: 'unknown' }).length, 8, 'unknown color count');
});

runner.test('Toolbox filters cost as a number', function () {
  runner.assertEqual(loadToolboxCore().filterCards(cards(), { cost: '5' }).length, 2, 'cost 5 count');
});

runner.test('Toolbox combines search and all filters', function () {
  var result = loadToolboxCore().filterCards(cards(), {
    query: 'no_',
    type: 'SPELL',
    color: 'unknown',
    cost: '1'
  });
  runner.assertEqual(result.length, 3, 'combined result');
  runner.assertEqual(result.map(function (card) { return card.canonicalCardId; }).sort().join(','), 'jinkaichu_no_bakunetsudan,mushi_no_ibuki,niji_no_kakehashi', 'combined IDs');
});

runner.test('Toolbox renders every FieldState without guessing', function () {
  var display = loadToolboxCore().displayFieldState;
  runner.assertEqual(display({ state: 'known', value: 0 }).text, '0', 'known zero');
  runner.assertEqual(display({ state: 'unknown' }).text, '未確認', 'unknown');
  runner.assertEqual(display({ state: 'researching' }).text, '調査中', 'researching');
  runner.assertEqual(display({ state: 'blocked', blockedReason: 'conflict' }).text, '確認保留', 'blocked');
  runner.assertEqual(display({ state: 'not_applicable', reason: 'none' }).text, '-', 'not applicable');
});

runner.test('Toolbox never displays blocked official-number candidate as confirmed', function () {
  var card = cards().filter(function (item) { return item.canonicalCardId === 'mushi_no_ibuki'; })[0];
  var shown = loadToolboxCore().displayFieldState(card.printing.officialNumberDisplay);
  runner.assertEqual(shown.text, '確認保留', 'blocked display');
  runner.assertEqual(shown.text.indexOf('127/130'), -1, 'candidate is not displayed');
});

function deckOptions(id, name) {
  return {
    deckId: id || 'deck:toolbox:test',
    deckName: name,
    now: '2026-09-03T00:00:00.000Z',
    cardDataVersion: data.dataVersion,
    rulesetId: 'ruleset:starter:v1'
  };
}

function ginyanmaRef() {
  var card = cards().filter(function (item) { return item.canonicalCardId === 'ginyanma'; })[0];
  return { printingId: card.printing.printingId, canonicalCardId: card.canonicalCardId };
}

runner.test('Toolbox creates an empty Deck Format compatible draft', function () {
  var deck = loadToolboxCore().createDeck(deckOptions());
  runner.assertEqual(deck.cards.length, 0, 'empty cards');
  runner.assertEqual(deck.deckName, '無題のデッキ', 'fallback name');
});

runner.test('Toolbox adds a printing reference without copying card data', function () {
  var deck = loadToolboxCore().addCard(loadToolboxCore().createDeck(deckOptions()), ginyanmaRef());
  runner.assertEqual(deck.cards.length, 1, 'one row');
  runner.assertEqual(deck.cards[0].quantity, 1, 'quantity one');
  runner.assertEqual(Object.keys(deck.cards[0]).sort().join(','), 'canonicalCardId,printingId,quantity', 'reference only');
});

runner.test('Toolbox increments an existing printing instead of duplicating rows', function () {
  var core = loadToolboxCore();
  var deck = core.addCard(core.addCard(core.createDeck(deckOptions()), ginyanmaRef()), ginyanmaRef());
  runner.assertEqual(deck.cards.length, 1, 'one row');
  runner.assertEqual(deck.cards[0].quantity, 2, 'quantity two');
});

runner.test('Toolbox decrements and removes a printing at zero', function () {
  var core = loadToolboxCore();
  var deck = core.addCard(core.createDeck(deckOptions()), ginyanmaRef());
  deck = core.incrementCard(deck, ginyanmaRef().printingId);
  deck = core.decrementCard(deck, ginyanmaRef().printingId);
  runner.assertEqual(deck.cards[0].quantity, 1, 'decremented');
  deck = core.decrementCard(deck, ginyanmaRef().printingId);
  runner.assertEqual(deck.cards.length, 0, 'removed at zero');
});

runner.test('Toolbox explicitly removes a printing', function () {
  var core = loadToolboxCore();
  var deck = core.removeCard(core.addCard(core.createDeck(deckOptions()), ginyanmaRef()), ginyanmaRef().printingId);
  runner.assertEqual(deck.cards.length, 0, 'removed');
});

runner.test('Toolbox aggregates alternate printings by canonicalCardId', function () {
  var grouped = loadToolboxCore().aggregateByCanonicalCardId([
    { printingId: 'printing:starter:006:standard', canonicalCardId: 'ginyanma', quantity: 2 },
    { printingId: 'printing:starter:006:alternate', canonicalCardId: 'ginyanma', quantity: 1 }
  ]);
  runner.assertEqual(grouped.ginyanma, 3, 'canonical total');
});

runner.test('Toolbox calculates type color and cost deck statistics', function () {
  var core = loadToolboxCore();
  var cardList = cards();
  var deck = core.createDeck(deckOptions());
  ['ginyanma', 'niji_no_kakehashi', 'mushi_no_ibuki'].forEach(function (id) {
    var card = cardList.filter(function (item) { return item.canonicalCardId === id; })[0];
    deck = core.addCard(deck, { printingId: card.printing.printingId, canonicalCardId: id });
  });
  deck = core.incrementCard(deck, cardList.filter(function (x) { return x.canonicalCardId === 'ginyanma'; })[0].printing.printingId);
  var stats = core.calculateDeckStats(deck, cardList);
  runner.assertEqual(stats.total, 4, 'total');
  runner.assertEqual(stats.types.INSECT, 2, 'insects');
  runner.assertEqual(stats.types.SPELL, 2, 'spells');
  runner.assertEqual(stats.colors.RED, 2, 'red');
  runner.assertEqual(stats.colors.unknown, 2, 'unknown color');
  runner.assertEqual(stats.costs['1'], 2, 'cost one');
});

runner.test('Toolbox builds Deck Format v1 accepted by the shared validator', function () {
  var core = loadToolboxCore();
  var deck = core.addCard(core.createDeck(deckOptions()), ginyanmaRef());
  var exported = core.buildDeckFormat(deck, { now: '2026-09-03T01:00:00.000Z' });
  runner.assertEqual(exported.formatVersion, deckFormat.DECK_FORMAT_VERSION, 'format version');
  runner.assertEqual(exported.updatedAt, '2026-09-03T01:00:00.000Z', 'updated time');
  runner.assertEqual(deckFormat.validateDeckFormat(exported).valid, true, 'shared validator');
});

runner.test('Toolbox serializes and restores multiple versioned decks', function () {
  var core = loadToolboxCore();
  var first = core.createDeck(deckOptions('deck:toolbox:first', 'First'));
  var second = core.createDeck(deckOptions('deck:toolbox:second', 'Second'));
  var serialized = core.serializeDeckStore({ activeDeckId: second.deckId, decks: [first, second] });
  var restored = core.parseDeckStore(serialized);
  runner.assertEqual(restored.decks.length, 2, 'two decks');
  runner.assertEqual(restored.activeDeckId, second.deckId, 'active deck');
  runner.assertEqual(restored.storageVersion, 1, 'storage version');
});

runner.test('Toolbox storage parser fails safe for damaged or invalid data', function () {
  var core = loadToolboxCore();
  var broken = core.parseDeckStore('{broken');
  runner.assertEqual(broken.decks.length, 0, 'broken JSON gives empty store');
  runner.assertEqual(broken.recoveryWarning.length > 0, true, 'warning retained');
  var wrongVersion = core.parseDeckStore(JSON.stringify({ storageVersion: 99, decks: [] }));
  runner.assertEqual(wrongVersion.decks.length, 0, 'unsupported version gives empty store');
});

runner.test('Toolbox normalizes empty deck names without changing IDs', function () {
  var core = loadToolboxCore();
  var deck = core.createDeck(deckOptions('deck:toolbox:name', 'Named'));
  var renamed = core.renameDeck(deck, '   ');
  runner.assertEqual(renamed.deckName, '無題のデッキ', 'fallback');
  runner.assertEqual(renamed.deckId, deck.deckId, 'same ID');
});

runner.test('Toolbox keeps unknown and blocked cards addable and marks warnings', function () {
  var core = loadToolboxCore();
  var cardList = cards();
  var ibuki = cardList.filter(function (x) { return x.canonicalCardId === 'mushi_no_ibuki'; })[0];
  var deck = core.addCard(core.createDeck(deckOptions()), {
    printingId: ibuki.printing.printingId,
    canonicalCardId: ibuki.canonicalCardId
  });
  runner.assertEqual(deck.cards.length, 1, 'blocked card retained');
  runner.assertEqual(core.cardHasDataWarning(ibuki), true, 'warning marked');
});

module.exports = runner;
