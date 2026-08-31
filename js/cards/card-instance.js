(function (global) {
  'use strict';

  var ZONES = {
    DECK: 'DECK',
    HAND: 'HAND',
    TERRITORY: 'TERRITORY',
    FOOD: 'FOOD',
    FIELD: 'FIELD',
    DISCARD: 'DISCARD',
    RESOLVING: 'RESOLVING'
  };

  var ZoneNames = Object.keys(ZONES).map(function (k) { return ZONES[k]; });

  function isZone(value) {
    return ZoneNames.indexOf(value) !== -1;
  }

  function CardInstance(opts) {
    opts = opts || {};
    this.instanceId = opts.instanceId;
    this.cardId = opts.cardId;
    this.ownerId = opts.ownerId;
    this.controllerId = opts.controllerId == null ? opts.ownerId : opts.controllerId;
    this.zone = opts.zone || ZONES.DECK;
    this.faceDown = opts.faceDown || false;

    this.currentHp = opts.currentHp;
    this.baseHp = opts.baseHp != null ? opts.baseHp : this.currentHp;
    this.attackedThisTurn = opts.attackedThisTurn || false;
    this.usedSkills = opts.usedSkills || [];
    this.modifiers = opts.modifiers || {};
    this.statModifiers = opts.statModifiers || [];
    this.attachments = opts.attachments || [];
    this.enteredFieldTurn = opts.enteredFieldTurn || null;
    this.runtimeFlags = opts.runtimeFlags || {};
  }

  CardInstance.ZONES = ZONES;
  CardInstance.isZone = isZone;

  global.ZONES = ZONES;
  global.CardInstance = CardInstance;
})(typeof window !== 'undefined' ? window : globalThis);
