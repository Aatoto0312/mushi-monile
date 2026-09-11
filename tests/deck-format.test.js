'use strict';

var TestRunner = require('./lib.js');
var runner = new TestRunner();

function loadDeckFormat() {
  try {
    return require('../shared/deck-format');
  } catch (err) {
    throw new Error('shared/deck-format boundary must be implemented: ' + err.message);
  }
}

function validDeck() {
  return {
    formatVersion: 'mushijingi-deck/1.0',
    deckId: 'deck:local:starter-okamakiri',
    deckName: 'オオカマキリデッキ',
    createdAt: '2026-09-01T10:00:00+09:00',
    updatedAt: '2026-09-01T10:00:00+09:00',
    cardDataVersion: '2026.09.01',
    rulesetId: 'mushijingi:standard',
    cards: [
      {
        printingId: 'printing:set1:007:standard',
        canonicalCardId: 'okamakiri',
        quantity: 2
      }
    ]
  };
}

runner.test('Deck Format v1 accepts a valid deck', function () {
  runner.assertEqual(loadDeckFormat().validateDeckFormat(validDeck()).valid, true, 'valid deck');
});

runner.test('Deck Format v1 rejects quantity zero', function () {
  var deck = validDeck();
  deck.cards[0].quantity = 0;
  runner.assertEqual(loadDeckFormat().validateDeckFormat(deck).valid, false, 'quantity zero');
});

runner.test('Deck Format v1 rejects a missing required field', function () {
  var deck = validDeck();
  delete deck.deckName;
  runner.assertEqual(loadDeckFormat().validateDeckFormat(deck).valid, false, 'missing deckName');
});

runner.test('Deck Format v1 rejects an unsupported formatVersion', function () {
  var deck = validDeck();
  deck.formatVersion = 'mushijingi-deck/2.0';
  runner.assertEqual(loadDeckFormat().validateDeckFormat(deck).valid, false, 'unsupported version');
});

runner.test('Deck Format v1 rejects duplicate printing entries', function () {
  var deck = validDeck();
  deck.cards.push({
    printingId: 'printing:set1:007:standard',
    canonicalCardId: 'okamakiri',
    quantity: 1
  });
  runner.assertEqual(loadDeckFormat().validateDeckFormat(deck).valid, false, 'duplicate printingId');
});

runner.test('Deck Format v1 rejects malformed card IDs', function () {
  var deck = validDeck();
  deck.cards[0].canonicalCardId = 'オオカマキリ';
  runner.assertEqual(loadDeckFormat().validateDeckFormat(deck).valid, false, 'malformed canonicalCardId');
});

module.exports = runner;
