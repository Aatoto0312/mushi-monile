(function (global) {
  'use strict';

  var RULES = {
    DECK_SIZE: 20,
    INITIAL_HAND: 4,
    INITIAL_TERRITORY: 6,
    DRAW_PER_TURN: 1,
    MAX_FOOD_PER_SET: 1
  };

  function getAttributeMultiplier(attackerColor, defenderColor) {
    if (attackerColor === Attributes.COLORLESS || defenderColor === Attributes.COLORLESS) {
      return 1;
    }
    var favorable = {};
    favorable[Attributes.RED] = Attributes.GREEN;
    favorable[Attributes.GREEN] = Attributes.BLUE;
    favorable[Attributes.BLUE] = Attributes.RED;

    if (favorable[attackerColor] === defenderColor) {
      return 2;
    }
    return 1;
  }

  function computeDamage(ap, attackerColor, defenderColor) {
    return ap * getAttributeMultiplier(attackerColor, defenderColor);
  }

  // 虫の現在の最大HPを計算する。将来HP強化カードの実装余地のため独立関数にしている。
  // instance.baseHp は召喚時の初期HP。modifiers による補正を加算する設計。
  // stat-modifier.js の calculateMaxHp も利用可能ならそれを優先(attachment HP 含む)。
  function calculateCurrentMaxHp(instance) {
    if (typeof global.calculateMaxHp === 'function') {
      return global.calculateMaxHp(instance);
    }
    var base = instance.baseHp != null ? instance.baseHp : 0;
    var modifier = (instance.modifiers && instance.modifiers.hpBonus) || 0;
    return base + modifier;
  }

  global.RULES = RULES;
  global.getAttributeMultiplier = getAttributeMultiplier;
  global.computeDamage = computeDamage;
  global.calculateCurrentMaxHp = calculateCurrentMaxHp;
})(typeof window !== 'undefined' ? window : globalThis);
