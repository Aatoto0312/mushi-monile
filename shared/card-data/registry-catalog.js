(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) { module.exports = api; }
  else { root.MushijingiRegistryCatalog = api; }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function clone(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }
  function playable(definition) {
    if (definition && typeof definition.isPlayable === 'function') { return definition.isPlayable(); }
    return ['SPEC_COMPLETE', 'IMPLEMENTED', 'TESTED', 'test'].indexOf(definition && definition.implementationStatus) !== -1;
  }
  function fromDefinition(definition) {
    return {
      cardId: definition.id,
      canonicalCardId: definition.id,
      printingId: 'registry:' + definition.id,
      name: definition.name,
      canonicalName: definition.name,
      officialNumber: definition.officialNumber,
      set: definition.set,
      type: definition.type,
      color: definition.color,
      cost: definition.cost,
      baseHp: definition.baseHp,
      rarity: definition.rarity,
      implementationStatus: definition.implementationStatus,
      playable: playable(definition),
      skills: clone(definition.skills || []),
      passiveAbilities: clone(definition.passiveAbilities || []),
      cardEffects: clone(definition.cardEffects || []),
      enhancementEffects: clone(definition.enhancementEffects || []),
      rulings: clone(definition.rulings || []),
      tags: clone(definition.tags || []),
      sourceRefs: clone(definition.sourceRefs || []),
      verificationNotes: definition.verificationNotes || null
    };
  }
  function fromDefinitions(definitions) {
    return (definitions || []).filter(function (definition) {
      return definition && definition.id && definition.implementationStatus !== 'test' && definition.set;
    }).map(fromDefinition);
  }
  function fromRegistry(registry) {
    if (!registry || typeof registry.getAll !== 'function') { throw new Error('CardRegistry is required'); }
    return fromDefinitions(registry.getAll());
  }
  return Object.freeze({ fromDefinition: fromDefinition, fromDefinitions: fromDefinitions, fromRegistry: fromRegistry });
}));
