(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) { module.exports = api; }
  else { root.MushijingiDeckRuntime = api; }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  var STORAGE_KEY = 'mushijingiToolboxDecksV1';
  var HANDOFF_KEY = 'mushijingiSelectedDeckV1';

  function parseStore(serialized) {
    if (!serialized) { return { storageVersion: 1, activeDeckId: null, decks: [] }; }
    try {
      var value = JSON.parse(serialized);
      if (!value || value.storageVersion !== 1 || !Array.isArray(value.decks)) { return { storageVersion: 1, activeDeckId: null, decks: [] }; }
      return { storageVersion: 1, activeDeckId: value.activeDeckId || null, decks: value.decks.filter(function (deck) { return deck && typeof deck.deckId === 'string' && Array.isArray(deck.cards); }) };
    } catch (error) { return { storageVersion: 1, activeDeckId: null, decks: [] }; }
  }

  function validateForBattle(deck, registry) {
    var errors = [], total = 0, names = Object.create(null), definitions = [];
    if (!deck || !Array.isArray(deck.cards)) { return { valid: false, errors: ['デッキ形式が不正です。'], definitions: [] }; }
    deck.cards.forEach(function (entry) {
      var def = registry && registry.get(entry.canonicalCardId);
      if (!def) { errors.push('不明なカード: ' + entry.canonicalCardId); return; }
      if (!Number.isInteger(entry.quantity) || entry.quantity <= 0) { errors.push('枚数が不正: ' + entry.canonicalCardId); return; }
      total += entry.quantity;
      names[def.name] = (names[def.name] || 0) + entry.quantity;
      if (!def.isPlayable()) { errors.push('対戦未対応: ' + def.name); }
      for (var i = 0; i < entry.quantity; i += 1) { definitions.push(def); }
    });
    Object.keys(names).forEach(function (name) { if (names[name] > 2) { errors.push('同名2枚超過: ' + name); } });
    if (total !== 20) { errors.push('デッキは20枚必要です（' + total + '枚）。'); }
    return { valid: errors.length === 0, errors: errors, definitions: errors.length ? [] : definitions };
  }

  function findDeck(store, deckId) { return (store.decks || []).filter(function (deck) { return deck.deckId === deckId; })[0] || null; }
  return Object.freeze({ STORAGE_KEY: STORAGE_KEY, HANDOFF_KEY: HANDOFF_KEY, parseStore: parseStore, findDeck: findDeck, validateForBattle: validateForBattle });
}));
