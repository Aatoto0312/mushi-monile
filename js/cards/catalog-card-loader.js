(function (root, factory) {
  'use strict';
  var api = factory(root);
  if (typeof module === 'object' && module.exports) { module.exports = api; }
  else { root.MushijingiCatalogCardLoader = api; }
}(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  function definitionFromRecord(record) {
    if (!root.CardDefinition) { throw new Error('CardDefinition is required'); }
    return new root.CardDefinition(record);
  }

  function registerCatalogDefinitions(registry, records) {
    if (!registry || typeof registry.register !== 'function') { throw new Error('CardRegistry is required'); }
    (records || []).forEach(function (record) {
      if (!registry.has(record.id)) { registry.register(definitionFromRecord(record)); }
    });
    return registry;
  }

  return Object.freeze({ definitionFromRecord: definitionFromRecord, registerCatalogDefinitions: registerCatalogDefinitions });
}));
