(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.MushijingiToolboxCore = api;
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var STATE_LABELS = Object.freeze({
    unknown: '未確認',
    researching: '調査中',
    blocked: '確認保留',
    not_applicable: '-'
  });

  var VERIFICATION_LABELS = Object.freeze({
    VERIFIED_OFFICIAL: '確認済み',
    VERIFIED_SECONDARY: '二次資料確認',
    UNVERIFIED: '未確認',
    BLOCKED: '確認保留',
    CONFLICTED: '競合あり'
  });

  var DECK_FORMAT_VERSION = 'mushijingi-deck/1.0';
  var DECK_STORAGE_VERSION = 1;
  var DECK_STORAGE_KEY = 'mushijingiToolboxDecksV1';
  var DEFAULT_DECK_NAME = '無題のデッキ';

  function buildToolboxCards(data) {
    if (!data || !Array.isArray(data.identities) || !Array.isArray(data.printings) || !Array.isArray(data.rules)) {
      throw new Error('Invalid common card DB');
    }
    var identities = Object.create(null);
    var rules = Object.create(null);
    data.identities.forEach(function (identity) { identities[identity.canonicalCardId] = identity; });
    data.rules.forEach(function (rule) { rules[rule.rulesId] = rule; });

    return data.printings.filter(function (printing) {
      return printing.setId === 'STARTER' && printing.canonicalCardId.indexOf('test_') !== 0;
    }).map(function (printing) {
      var identity = identities[printing.canonicalCardId];
      var rule = rules[printing.rulesId];
      if (!identity || !rule) {
        throw new Error('Unresolved common DB reference: ' + printing.printingId);
      }
      return {
        canonicalCardId: identity.canonicalCardId,
        canonicalName: identity.canonicalName,
        tags: Array.isArray(identity.tags) ? identity.tags.slice() : [],
        identity: identity,
        printing: printing,
        rules: rule,
        verifications: (data.verifications || []).filter(function (verification) {
          return verification.entityId === printing.printingId || verification.entityId === rule.rulesId || verification.entityId === identity.canonicalCardId;
        })
      };
    });
  }

  function collectorNumber(card) {
    var field = card && card.printing && card.printing.collectorNumber;
    return field && field.state === 'known' && field.value && Number.isFinite(field.value.number)
      ? field.value.number
      : Number.POSITIVE_INFINITY;
  }

  function sortCardsByOfficialNumber(cards) {
    return cards.slice().sort(function (left, right) {
      var difference = collectorNumber(left) - collectorNumber(right);
      if (difference !== 0) { return difference; }
      return left.canonicalCardId.localeCompare(right.canonicalCardId);
    });
  }

  function stateMatches(field, expected) {
    if (expected === 'unknown') {
      return field && (field.state === 'unknown' || field.state === 'researching' || field.state === 'blocked');
    }
    return field && field.state === 'known' && String(field.value) === String(expected);
  }

  function filterCards(cards, filters) {
    filters = filters || {};
    var query = String(filters.query || '').trim().toLocaleLowerCase('ja');
    return cards.filter(function (card) {
      if (query) {
        var searchable = (card.canonicalName + ' ' + card.canonicalCardId).toLocaleLowerCase('ja');
        if (searchable.indexOf(query) === -1) { return false; }
      }
      if (filters.type && !stateMatches(card.rules.type, filters.type)) { return false; }
      if (filters.color && !stateMatches(card.rules.color, filters.color)) { return false; }
      if (filters.cost !== undefined && filters.cost !== '' && !stateMatches(card.rules.cost, filters.cost)) { return false; }
      return true;
    });
  }

  function displayFieldState(field) {
    if (!field || !field.state) { return { text: '未確認', state: 'unknown' }; }
    if (field.state === 'known') {
      return { text: field.value === null || field.value === undefined ? '未確認' : String(field.value), state: 'known' };
    }
    return { text: STATE_LABELS[field.state] || '未確認', state: field.state };
  }

  function verificationLabel(status) {
    return VERIFICATION_LABELS[status] || '未確認';
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizedDeckName(value) {
    var name = typeof value === 'string' ? value.trim() : '';
    return name || DEFAULT_DECK_NAME;
  }

  function createDeck(options) {
    options = options || {};
    var now = options.now || new Date().toISOString();
    return {
      formatVersion: DECK_FORMAT_VERSION,
      deckId: options.deckId,
      deckName: normalizedDeckName(options.deckName),
      createdAt: now,
      updatedAt: now,
      cardDataVersion: options.cardDataVersion,
      rulesetId: options.rulesetId,
      cards: []
    };
  }

  function replaceCards(deck, cards) {
    var copy = clone(deck);
    copy.cards = cards;
    return copy;
  }

  function validCardRef(cardRef) {
    return cardRef && typeof cardRef.printingId === 'string' && cardRef.printingId &&
      typeof cardRef.canonicalCardId === 'string' && cardRef.canonicalCardId;
  }

  function addCard(deck, cardRef) {
    if (!validCardRef(cardRef)) { throw new Error('Invalid card reference'); }
    var found = false;
    var cards = deck.cards.map(function (entry) {
      if (entry.printingId !== cardRef.printingId) { return clone(entry); }
      if (entry.canonicalCardId !== cardRef.canonicalCardId) { throw new Error('Printing ID canonical mismatch'); }
      found = true;
      return { printingId: entry.printingId, canonicalCardId: entry.canonicalCardId, quantity: entry.quantity + 1 };
    });
    if (!found) {
      cards.push({ printingId: cardRef.printingId, canonicalCardId: cardRef.canonicalCardId, quantity: 1 });
    }
    return replaceCards(deck, cards);
  }

  function incrementCard(deck, printingId) {
    var entry = deck.cards.filter(function (item) { return item.printingId === printingId; })[0];
    return entry ? addCard(deck, entry) : clone(deck);
  }

  function removeCard(deck, printingId) {
    return replaceCards(deck, deck.cards.filter(function (entry) {
      return entry.printingId !== printingId;
    }).map(clone));
  }

  function decrementCard(deck, printingId) {
    var cards = [];
    deck.cards.forEach(function (entry) {
      if (entry.printingId !== printingId) { cards.push(clone(entry)); return; }
      if (entry.quantity > 1) {
        cards.push({ printingId: entry.printingId, canonicalCardId: entry.canonicalCardId, quantity: entry.quantity - 1 });
      }
    });
    return replaceCards(deck, cards);
  }

  function renameDeck(deck, name) {
    var copy = clone(deck);
    copy.deckName = normalizedDeckName(name);
    return copy;
  }

  function aggregateByCanonicalCardId(entries) {
    return (entries || []).reduce(function (totals, entry) {
      totals[entry.canonicalCardId] = (totals[entry.canonicalCardId] || 0) + entry.quantity;
      return totals;
    }, Object.create(null));
  }

  function calculateDeckStats(deck, toolboxCards) {
    var byPrinting = Object.create(null);
    toolboxCards.forEach(function (card) { byPrinting[card.printing.printingId] = card; });
    var stats = {
      total: 0,
      types: { INSECT: 0, SPELL: 0, ENHANCEMENT: 0 },
      colors: { RED: 0, BLUE: 0, GREEN: 0, unknown: 0 },
      costs: Object.create(null),
      unresolved: 0
    };
    deck.cards.forEach(function (entry) {
      var card = byPrinting[entry.printingId];
      stats.total += entry.quantity;
      if (!card) { stats.unresolved += entry.quantity; return; }
      var type = card.rules.type.state === 'known' ? card.rules.type.value : null;
      var color = card.rules.color.state === 'known' ? card.rules.color.value : 'unknown';
      var cost = card.rules.cost.state === 'known' ? String(card.rules.cost.value) : 'unknown';
      if (Object.prototype.hasOwnProperty.call(stats.types, type)) { stats.types[type] += entry.quantity; }
      if (!Object.prototype.hasOwnProperty.call(stats.colors, color)) { color = 'unknown'; }
      stats.colors[color] += entry.quantity;
      stats.costs[cost] = (stats.costs[cost] || 0) + entry.quantity;
    });
    return stats;
  }

  function buildDeckFormat(deck, options) {
    var result = clone(deck);
    result.formatVersion = DECK_FORMAT_VERSION;
    result.deckName = normalizedDeckName(result.deckName);
    result.updatedAt = options && options.now ? options.now : new Date().toISOString();
    result.cards = result.cards.map(function (entry) {
      return { printingId: entry.printingId, canonicalCardId: entry.canonicalCardId, quantity: entry.quantity };
    });
    return result;
  }

  function emptyDeckStore(warning) {
    return { storageVersion: DECK_STORAGE_VERSION, activeDeckId: null, decks: [], recoveryWarning: warning || '' };
  }

  function serializeDeckStore(store) {
    return JSON.stringify({
      storageVersion: DECK_STORAGE_VERSION,
      activeDeckId: store.activeDeckId || null,
      decks: (store.decks || []).map(clone)
    });
  }

  function parseDeckStore(serialized) {
    if (!serialized) { return emptyDeckStore(''); }
    try {
      var parsed = JSON.parse(serialized);
      if (!parsed || parsed.storageVersion !== DECK_STORAGE_VERSION || !Array.isArray(parsed.decks)) {
        return emptyDeckStore('保存データのバージョンまたは形式が不正です。');
      }
      var validDecks = parsed.decks.filter(function (deck) {
        return deck && deck.formatVersion === DECK_FORMAT_VERSION && typeof deck.deckId === 'string' &&
          Array.isArray(deck.cards) && deck.cards.every(function (entry) {
            return validCardRef(entry) && Number.isInteger(entry.quantity) && entry.quantity > 0;
          });
      });
      var warning = validDecks.length === parsed.decks.length ? '' : '不正なデッキを隔離し、読み込めるデッキだけ復元しました。';
      return {
        storageVersion: DECK_STORAGE_VERSION,
        activeDeckId: validDecks.some(function (deck) { return deck.deckId === parsed.activeDeckId; }) ? parsed.activeDeckId : (validDecks[0] ? validDecks[0].deckId : null),
        decks: validDecks.map(clone),
        recoveryWarning: warning
      };
    } catch (error) {
      return emptyDeckStore('保存データを読み込めないため、安全な空の状態で開始しました。');
    }
  }

  function containsUnverifiedState(value) {
    if (!value || typeof value !== 'object') { return false; }
    if (value.state && value.state !== 'known' && value.state !== 'not_applicable') { return true; }
    return Object.keys(value).some(function (key) { return containsUnverifiedState(value[key]); });
  }

  function cardHasDataWarning(card) {
    return containsUnverifiedState(card.printing) || containsUnverifiedState(card.rules) ||
      card.verifications.some(function (verification) {
        return verification.status === 'UNVERIFIED' || verification.status === 'BLOCKED' || verification.status === 'CONFLICTED';
      });
  }

  function catalogValue(card, key) {
    var value = card && card[key];
    return value === null || value === undefined ? '' : String(value);
  }

  function filterCatalog(cards, filters) {
    filters = filters || {};
    var query = String(filters.query || '').trim().toLocaleLowerCase('ja');
    var keys = ['set', 'type', 'color', 'cost', 'rarity', 'implementationStatus'];
    return (cards || []).filter(function (card) {
      var searchable = [card.name, card.officialNumber, card.cardId, (card.tags || []).join(' '), JSON.stringify(card.skills || []), JSON.stringify(card.cardEffects || [])].join(' ').toLocaleLowerCase('ja');
      if (query && searchable.indexOf(query) === -1) { return false; }
      return keys.every(function (key) {
        return filters[key] === undefined || filters[key] === '' || catalogValue(card, key) === String(filters[key]);
      });
    });
  }

  function compareNullable(left, right) {
    if (left === null || left === undefined || left === '') { return 1; }
    if (right === null || right === undefined || right === '') { return -1; }
    if (typeof left === 'number' && typeof right === 'number') { return left - right; }
    return String(left).localeCompare(String(right), 'ja', { numeric: true });
  }

  function sortCatalog(cards, key, direction) {
    var field = key === 'hp' ? 'baseHp' : (key || 'officialNumber');
    var multiplier = direction === 'desc' ? -1 : 1;
    return (cards || []).slice().sort(function (left, right) {
      var difference = compareNullable(left[field], right[field]);
      return (difference || compareNullable(left.cardId, right.cardId)) * multiplier;
    });
  }

  function deriveFilterOptions(cards) {
    var result = {};
    ['set', 'type', 'color', 'cost', 'rarity', 'implementationStatus'].forEach(function (key) {
      var seen = Object.create(null);
      result[key] = [];
      (cards || []).forEach(function (card) {
        var value = card[key];
        if (value === null || value === undefined || value === '' || seen[String(value)]) { return; }
        seen[String(value)] = true;
        result[key].push(String(value));
      });
      result[key].sort(function (a, b) { return a.localeCompare(b, 'ja', { numeric: true }); });
    });
    return result;
  }

  function addCatalogCard(deck, card) {
    return addCard(deck, { printingId: card.printingId, canonicalCardId: card.cardId });
  }

  function validateDeck(deck, cards, options) {
    options = options || {};
    var requiredSize = options.requiredSize || 20;
    var maxSameName = options.maxSameName || 2;
    var byId = Object.create(null), totalsByName = Object.create(null), errors = [], warnings = [];
    (cards || []).forEach(function (card) { byId[card.cardId] = card; });
    var total = 0;
    (deck && deck.cards || []).forEach(function (entry) {
      total += Number.isInteger(entry.quantity) ? entry.quantity : 0;
      var card = byId[entry.canonicalCardId];
      if (!card) { errors.push('不明なカード: ' + entry.canonicalCardId); return; }
      totalsByName[card.name] = (totalsByName[card.name] || 0) + entry.quantity;
      if (!card.playable) { warnings.push(card.name + 'は対戦未対応です。'); }
    });
    Object.keys(totalsByName).forEach(function (name) {
      if (totalsByName[name] > maxSameName) { errors.push(name + 'は同名合計' + maxSameName + '枚までです。'); }
    });
    if (total !== requiredSize) { warnings.push('デッキは' + requiredSize + '枚必要です（現在' + total + '枚）。'); }
    var storable = !!deck && Array.isArray(deck.cards) && errors.filter(function (x) { return x.indexOf('不明なカード') === 0; }).length === 0;
    return { valid: errors.length === 0 && warnings.length === 0, storable: storable, battleReady: errors.length === 0 && warnings.length === 0, totalCards: total, errors: errors, warnings: warnings };
  }

  function duplicateDeck(deck, options) {
    options = options || {};
    var copy = clone(deck);
    copy.deckId = options.deckId;
    copy.deckName = normalizedDeckName((deck.deckName || DEFAULT_DECK_NAME) + ' コピー');
    copy.createdAt = options.now || new Date().toISOString();
    copy.updatedAt = copy.createdAt;
    return copy;
  }

  return Object.freeze({
    buildToolboxCards: buildToolboxCards,
    sortCardsByOfficialNumber: sortCardsByOfficialNumber,
    filterCards: filterCards,
    displayFieldState: displayFieldState,
    verificationLabel: verificationLabel,
    createDeck: createDeck,
    addCard: addCard,
    incrementCard: incrementCard,
    decrementCard: decrementCard,
    removeCard: removeCard,
    renameDeck: renameDeck,
    aggregateByCanonicalCardId: aggregateByCanonicalCardId,
    calculateDeckStats: calculateDeckStats,
    buildDeckFormat: buildDeckFormat,
    serializeDeckStore: serializeDeckStore,
    parseDeckStore: parseDeckStore,
    cardHasDataWarning: cardHasDataWarning,
    filterCatalog: filterCatalog,
    sortCatalog: sortCatalog,
    deriveFilterOptions: deriveFilterOptions,
    addCatalogCard: addCatalogCard,
    validateDeck: validateDeck,
    duplicateDeck: duplicateDeck,
    DECK_FORMAT_VERSION: DECK_FORMAT_VERSION,
    DECK_STORAGE_VERSION: DECK_STORAGE_VERSION,
    DECK_STORAGE_KEY: DECK_STORAGE_KEY,
    DEFAULT_DECK_NAME: DEFAULT_DECK_NAME,
    STATE_LABELS: STATE_LABELS,
    VERIFICATION_LABELS: VERIFICATION_LABELS
  });
}));
