'use strict';

var TestRunner = require('./lib.js');
require('./engine-loader.js');
var loader = require('../js/cards/catalog-card-loader.js');
var data = require('../js/cards/full-catalog-data.js');
var catalog = require('../shared/card-data/registry-catalog.js');
var core = require('../toolbox/toolbox-core.js');
var presenter = require('../shared/ui-presenter.js');
var audit = require('../scripts/audit-full-catalog.js');
var runner = new TestRunner();

function buildRegistry() {
  var registry = new global.CardRegistry();
  global.cardRegistry.getAll().forEach(function (definition) { registry.register(definition); });
  loader.registerCatalogDefinitions(registry, data);
  return registry;
}

runner.test('Full catalog registers every Knowledge Base card without hard-coded total', function () {
  var registry = buildRegistry();
  var expectedBySet = data.reduce(function (totals, record) {
    totals[record.set] = (totals[record.set] || 0) + 1;
    return totals;
  }, Object.create(null));
  var actual = catalog.fromRegistry(registry);
  Object.keys(expectedBySet).forEach(function (set) {
    runner.assertEqual(actual.filter(function (card) { return card.set === set; }).length, expectedBySet[set], set + ' count');
  });
  var expectedIds = new Set(catalog.fromRegistry(global.cardRegistry).map(function (card) { return card.cardId; }).concat(data.map(function (card) { return card.id; })));
  runner.assertEqual(actual.length, expectedIds.size, 'registered total follows unique source identities');
  runner.assertEqual(new Set(actual.map(function (card) { return card.cardId; })).size, actual.length, 'card IDs unique');
});

runner.test('Full catalog passes mechanical schema and number coverage audit', function () {
  var result = audit(data);
  runner.assertEqual(result.issues.length, 0, 'catalog audit: ' + result.issues.join(', '));
});

runner.test('SET2 through SET7 become dynamic filters and are searchable', function () {
  var cards = catalog.fromRegistry(buildRegistry());
  var options = core.deriveFilterOptions(cards);
  data.reduce(function (seen, record) {
    if (!seen[record.set]) {
      seen[record.set] = record;
      runner.assert(options.set.indexOf(record.set) !== -1, record.set + ' filter');
      runner.assertEqual(core.filterCatalog(cards, { query: record.name }).length >= 1, true, record.set + ' name search');
      runner.assertEqual(core.filterCatalog(cards, { query: record.officialNumber, set: record.set }).length >= 1, true, record.set + ' number search');
    }
    return seen;
  }, Object.create(null));
});

runner.test('Production catalog view keeps every set boundary and card number monotonic', function () {
  var cards = catalog.fromRegistry(buildRegistry());
  var sorted = core.buildCatalogView(cards, {}, 'officialNumber');
  var firstSystem = sorted.slice(0, 130);
  runner.assertEqual(firstSystem.every(function (card) { return card.set === 'STARTER' || card.set === 'BOOSTER_SET_1'; }), true, 'Starter and SET1 form one numbering system');
  runner.assertEqual(firstSystem.some(function (card, index) { return index > 0 && card.set !== firstSystem[index - 1].set; }), true, 'Starter and SET1 are interleaved');
  runner.assertEqual(firstSystem.map(function (card) {
    return Number(card.officialNumber.split('/')[0]);
  }).join(','), Array.from({ length: 130 }, function (_, index) { return index + 1; }).join(','), 'first numbering system is continuous 1 through 130');

  runner.assertEqual(firstSystem.slice(21, 24).map(function (card) { return card.officialNumber; }).join(','), '22/130,23/130,24/130', '22 through 24 ignore set membership');
  runner.assertEqual(firstSystem[126].name, '蟲の息吹', 'Mushi no Ibuki occupies official number 127');
  runner.assertEqual(firstSystem[126].officialNumber, '127/130', 'Mushi no Ibuki official number is confirmed');
  runner.assertEqual(firstSystem[126].set, 'STARTER', 'Mushi no Ibuki remains a Starter card');
  runner.assertEqual(firstSystem.slice(128, 130).map(function (card) { return card.officialNumber; }).join(','), '129/130,130/130', 'first numbering system ends at 130');
  runner.assertEqual(sorted[130].officialNumber, '1/55', 'SET2 follows the shared 130-card system');

  var expectedSets = ['BOOSTER_SET_1', 'BOOSTER_SET_2', 'BOOSTER_SET_3', 'BOOSTER_SET_4', 'BOOSTER_SET_5', 'BOOSTER_SET_6', 'BOOSTER_SET_7'];
  expectedSets.forEach(function (set, index) {
    var group = sorted.filter(function (card) { return card.set === set; });
    runner.assertEqual(Number(group[0].officialNumber.split('/')[0]), 1, set + ' starts at 1');
    if (index < expectedSets.length - 1) {
      var next = expectedSets[index + 1];
      runner.assert(sorted.indexOf(group[group.length - 1]) < sorted.findIndex(function (card) { return card.set === next; }), set + ' ends before ' + next);
    }
  });

  var set2 = sorted.filter(function (card) { return card.set === 'BOOSTER_SET_2'; });
  runner.assertEqual(set2.slice(0, 10).map(function (card) { return card.officialNumber.split('/')[0]; }).join(','), '1,2,3,4,5,6,7,8,9,10', 'numbers sort numerically');

  function numberingSystem(set) {
    if (set === 'STARTER' || set === 'BOOSTER_SET_1') { return 1; }
    var match = String(set).match(/(\d+)$/);
    return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
  }
  for (var i = 1; i < sorted.length; i += 1) {
    var previous = sorted[i - 1], current = sorted[i];
    var previousSystem = numberingSystem(previous.set), currentSystem = numberingSystem(current.set);
    runner.assert(previousSystem <= currentSystem, 'numbering system never reverses at index ' + i);
    if (previousSystem === currentSystem) {
      var previousNumber = Number(previous.officialNumber.split('/')[0]);
      var currentNumber = Number(current.officialNumber.split('/')[0]);
      runner.assert(previousNumber <= currentNumber, 'card number never reverses at index ' + i);
    }
  }
});

runner.test('Unknown official numbers sort last without inferring a missing slot', function () {
  var cards = [
    { cardId: 'known-1', set: 'BOOSTER_SET_8', officialNumber: '1/3', name: 'A' },
    { cardId: 'unknown', set: 'BOOSTER_SET_8', officialNumber: null, name: 'B' },
    { cardId: 'known-3', set: 'BOOSTER_SET_8', officialNumber: '3/3', name: 'C' }
  ];
  var sorted = core.buildCatalogView(cards, {}, 'officialNumber');
  runner.assertEqual(sorted.map(function (card) { return card.cardId; }).join(','), 'known-1,known-3,unknown', 'missing number is not inferred from the gap');
});

runner.test('Full catalog search includes tags and player-facing effect text', function () {
  var cards = catalog.fromRegistry(buildRegistry());
  var tagged = data.filter(function (record) { return record.tags && record.tags.length; })[0];
  var described = data.filter(function (record) {
    return record.cardEffects.length || record.enhancementEffects.length || record.skills.some(function (skill) { return skill.effectText; });
  })[0];
  runner.assert(core.filterCatalog(cards, { query: tagged.tags[0] }).some(function (card) { return card.cardId === tagged.id; }), 'tag search');
  var text = described.cardEffects[0] && described.cardEffects[0].effectText || described.enhancementEffects[0] && described.enhancementEffects[0].effectText || described.skills.filter(function (skill) { return skill.effectText; })[0].effectText;
  runner.assert(core.filterCatalog(cards, { query: text.slice(0, 8) }).some(function (card) { return card.cardId === described.id; }), 'effect search');
});

runner.test('Every future set has safe Card Detail data and no internal leaks', function () {
  var cards = catalog.fromRegistry(buildRegistry());
  var leaks = ['READY_FOR_ENGINE_REVIEW', 'canonicalCardId', '[object Object]', 'undefined', 'null'];
  data.forEach(function (record) {
    var detail = presenter.presentCardDetail(cards.filter(function (card) { return card.cardId === record.id; })[0], global.CardEffectFormatter);
    var visible = JSON.stringify(detail);
    leaks.forEach(function (leak) { runner.assert(visible.indexOf(leak) === -1, record.id + ' hides ' + leak); });
  });
});

runner.test('Audited SET2 is Battle-ready while SET3-SET7 remain safely unavailable', function () {
  var cards = catalog.fromRegistry(buildRegistry());
  var set2 = cards.filter(function (card) { return card.set === 'BOOSTER_SET_2'; });
  var future = cards.filter(function (card) { return /^BOOSTER_SET_[3-7]$/.test(card.set); });
  var deck = core.createDeck({ deckId: 'deck:set2-playable', deckName: '第2弾', cardDataVersion: 'card-registry/1', rulesetId: 'ruleset:standard:v1' });
  for (var i = 0; i < 10; i += 1) {
    deck = core.addCatalogCard(deck, set2[i]);
    deck = core.addCatalogCard(deck, set2[i]);
  }
  var validation = core.validateDeck(deck, cards);
  runner.assert(validation.battleReady, 'SET2 deck can battle');
  var futureDeck = core.createDeck({ deckId: 'deck:future', deckName: '未実装弾', cardDataVersion: 'card-registry/1', rulesetId: 'ruleset:standard:v1' });
  for (var j = 0; j < 10; j += 1) {
    futureDeck = core.addCatalogCard(futureDeck, future[j]);
    futureDeck = core.addCatalogCard(futureDeck, future[j]);
  }
  validation = core.validateDeck(futureDeck, cards);
  runner.assert(validation.storable, 'future deck saves');
  runner.assert(!validation.battleReady, 'future deck cannot battle');
  runner.assert(validation.warnings.some(function (warning) { return warning.indexOf('対戦未対応') !== -1; }), 'natural reason');
});

runner.test('Same-name reprints share the two-card deck limit', function () {
  var cards = catalog.fromRegistry(buildRegistry());
  var byName = cards.reduce(function (groups, card) {
    (groups[card.name] || (groups[card.name] = [])).push(card);
    return groups;
  }, Object.create(null));
  var reprints = Object.keys(byName).map(function (name) { return byName[name]; }).filter(function (group) {
    return group.length > 1 && new Set(group.map(function (card) { return card.set; })).size > 1;
  })[0];
  runner.assert(reprints, 'catalog contains a cross-set reprint');
  var deck = core.createDeck({ deckId: 'deck:reprint', cardDataVersion: 'card-registry/1', rulesetId: 'ruleset:standard:v1' });
  deck = core.addCatalogCard(deck, reprints[0]);
  deck = core.addCatalogCard(deck, reprints[0]);
  deck = core.addCatalogCard(deck, reprints[1]);
  runner.assert(core.validateDeck(deck, cards).errors.some(function (error) { return error.indexOf('同名合計2枚まで') !== -1; }), 'reprint limit');
});

module.exports = runner;
