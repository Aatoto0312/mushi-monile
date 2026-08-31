(function (global) {
  'use strict';

  // カード定義の中央レジストリ。
  // テストカード・スターター・将来の第1弾以降を同じAPIから取得できる。
  // 過剰設計は避け、必要最低限の操作のみ持つ。

  function CardRegistry() {
    this._byId = {};
    this._bySet = {};
    this._ids = [];
  }

  // CardDefinition を登録する。同じIDの二重登録は拒否。
  CardRegistry.prototype.register = function (definition) {
    if (!definition || !definition.id) {
      throw new Error('CardRegistry.register: id のない定義は登録できません');
    }
    if (this._byId[definition.id]) {
      throw new Error('CardRegistry.register: 重複するidです: ' + definition.id);
    }
    this._byId[definition.id] = definition;
    this._ids.push(definition.id);

    if (definition.set) {
      if (!this._bySet[definition.set]) {
        this._bySet[definition.set] = [];
      }
      this._bySet[definition.set].push(definition);
    }
    return definition;
  };

  CardRegistry.prototype.get = function (id) {
    return this._byId[id] || null;
  };

  CardRegistry.prototype.getAll = function () {
    var self = this;
    return this._ids.map(function (id) { return self._byId[id]; });
  };

  CardRegistry.prototype.getBySet = function (set) {
    return (this._bySet[set] || []).slice();
  };

  CardRegistry.prototype.has = function (id) {
    return !!this._byId[id];
  };

  CardRegistry.prototype.size = function () {
    return this._ids.length;
  };

  // シングルトン
  var defaultRegistry = new CardRegistry();
  CardRegistry.default = defaultRegistry;

  // 既存コード用の後方互換ヘルパー(レジストリへ委譲)
  global.getCardDefinition = function (id) {
    return defaultRegistry.get(id);
  };

  global.CardRegistry = CardRegistry;
  global.cardRegistry = defaultRegistry;
})(typeof window !== 'undefined' ? window : globalThis);
