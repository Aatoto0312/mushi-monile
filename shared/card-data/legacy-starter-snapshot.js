'use strict';

var SNAPSHOT_VERSION = 'legacy-starter-card-registry/1.0';
var SNAPSHOT_FIELDS = Object.freeze([
  'id', 'officialNumber', 'name', 'set', 'rarity', 'starterDeck', 'type',
  'color', 'cost', 'baseHp', 'skills', 'passiveAbilities', 'cardEffects',
  'enhancementEffects', 'tags', 'implementationStatus', 'sourceLevel',
  'sourceRefs', 'verificationNotes'
]);

function cloneJsonValue(value) {
  return value === undefined ? null : JSON.parse(JSON.stringify(value));
}

function projectCard(definition) {
  var projected = {};
  SNAPSHOT_FIELDS.forEach(function (field) {
    projected[field] = cloneJsonValue(definition[field]);
  });
  return projected;
}

function createStarterCardSnapshot(registry) {
  if (!registry || typeof registry.getBySet !== 'function') {
    throw new Error('createStarterCardSnapshot: CardRegistry is required');
  }
  var cards = registry.getBySet('STARTER').map(projectCard);
  return { snapshotVersion: SNAPSHOT_VERSION, cardCount: cards.length, cards: cards };
}

function serializeStarterCardSnapshot(snapshot) {
  return JSON.stringify(snapshot, null, 2) + '\n';
}

module.exports = {
  SNAPSHOT_VERSION: SNAPSHOT_VERSION,
  SNAPSHOT_FIELDS: SNAPSHOT_FIELDS,
  createStarterCardSnapshot: createStarterCardSnapshot,
  serializeStarterCardSnapshot: serializeStarterCardSnapshot
};
