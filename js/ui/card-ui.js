(function (global) {
  'use strict';

  // カードの見た目を DOM として生成・操作する。

  var COLOR_CLASS = {
    RED: 'color-red',
    BLUE: 'color-blue',
    GREEN: 'color-green',
    COLORLESS: 'color-colorless'
  };

  var TRUNC = {
    'テスト赤虫1': '赤虫1',
    'テスト赤虫2': '赤虫2',
    'テスト青虫1': '青虫1',
    'テスト青虫2': '青虫2',
    'テスト緑虫1': '緑虫1',
    'テスト緑虫2': '緑虫2'
  };

  function shortName(def) {
    if (def && TRUNC[def.name]) {
      return TRUNC[def.name];
    }
    return def ? def.name : '?';
  }

  function getDef(instance) {
    return global.getCardDefinition ? getCardDefinition(instance.cardId) : null;
  }

  function colorClass(def) {
    return def ? (COLOR_CLASS[def.color] || COLOR_CLASS.COLORLESS) : COLOR_CLASS.COLORLESS;
  }

  function typeLabel(def) {
    if (!def) { return '?'; }
    var map = {};
    map[CardTypes.INSECT] = '蟲';
    map[CardTypes.SPELL] = '術';
    map[CardTypes.ENHANCEMENT] = '強化';
    return map[def.type] || '?';
  }

  function colorLabel(def) {
    if (!def || !def.color) { return ''; }
    var map = {};
    map[Attributes.RED] = '赤';
    map[Attributes.BLUE] = '青';
    map[Attributes.GREEN] = '緑';
    map[Attributes.COLORLESS] = '無';
    return map[def.color] || '';
  }

  function colorValueLabel(color) {
    return colorLabel({ color: color });
  }

  function getEffectiveColorValue(instance, def) {
    return typeof global.getEffectiveColor === 'function' ? global.getEffectiveColor(instance) : def.color;
  }

  function modifierSummary(instance, state) {
    var def = getDef(instance) || {};
    var baseHp = instance.baseHp != null ? instance.baseHp : (def.baseHp || 0);
    var maxHp = typeof global.calculateMaxHp === 'function' ? global.calculateMaxHp(instance) : baseHp;
    var baseAp = firstAttackAp(def.skills);
    var currentAp = baseAp == null ? null : effectiveAp(instance, state);
    var originalColor = def.color;
    var currentColor = getEffectiveColorValue(instance, def);
    return {
      baseHp: baseHp,
      maxHp: maxHp,
      hpDelta: maxHp - baseHp,
      baseAp: baseAp,
      currentAp: currentAp,
      apDelta: currentAp == null ? 0 : currentAp - baseAp,
      originalColor: originalColor,
      currentColor: currentColor,
      attachmentCount: (instance.attachments || []).length
    };
  }

  function addBadge(container, className, text) {
    var badge = document.createElement('span');
    badge.className = 'card-state-badge ' + className;
    badge.textContent = text;
    container.appendChild(badge);
  }

  function firstAttackAp(skills) {
    if (!skills) return null;
    for (var i = 0; i < skills.length; i++) {
      if (skills[i] && skills[i].timing === 'ATTACK') {
        return skills[i].baseAp != null ? skills[i].baseAp : 0;
      }
    }
    return null;
  }

  var EFFECT_JA = {
    DEAL_DAMAGE_TO_TARGET: '対象にダメージを与える', DEAL_DAMAGE: '対象にダメージを与える',
    TURN_FACE_DOWN: '対象を裏向きにする', RETRIEVE_FROM_DISCARD: '捨て場からカードを回収する',
    COLOR_OVERRIDE: 'この虫の色を変更する', SACRIFICE_OWN_INSECT: '自分の虫1体を破壊する',
    APPLY_STAT_MODIFIER: '能力値を変更する', APPLY_STAT_MODIFIER_TO_ALL_OWN_FIELD: '自分の場の全虫の能力値を変更する',
    CONTINUOUS_ATTACK: '連続攻撃'
  };

  function effectToJa(effect) {
    if (!effect) return '';
    return effect.description || effect.effectText || EFFECT_JA[effect.type || effect.id] || '';
  }

  function enhancementToJa(effect) {
    if (!effect) return '';
    if (effect.description) return effect.description;
    if (effect.type === 'COLOR_OVERRIDE') return 'この虫の色を赤・青・緑から選んで変更する';
    if (effect.stat) return effect.stat + (effect.amount >= 0 ? ' +' : ' ') + effect.amount;
    return effectToJa(effect);
  }

  function effectiveAp(instance, state) {
    var base = firstAttackAp((getDef(instance) || {}).skills);
    if (base == null) return null;
    return state && typeof global.getEffectiveAP === 'function' ? global.getEffectiveAP(state, instance, base) : base;
  }

  // 場の虫カード1枚
  function renderFieldInsect(instance, state) {
    var def = getDef(instance) || {};
    var summary = modifierSummary(instance, state);
    var el = document.createElement('div');
    var effectiveColorClass = COLOR_CLASS[summary.currentColor] || COLOR_CLASS.COLORLESS;
    el.className = 'battle-card field-card ' + effectiveColorClass;
    if (instance.attackedThisTurn) { el.classList.add('is-attacked'); }
    el.dataset.instanceId = instance.instanceId;

    var name = document.createElement('div');
    name.className = 'card-name-full';
    name.textContent = def.name || '?';

    var hp = document.createElement('div');
    hp.className = 'card-hp';
    var maxHp = summary.maxHp;
    hp.textContent = 'HP ' + instance.currentHp + (maxHp != null ? '/' + maxHp : '');

    var costColor = document.createElement('div');
    costColor.className = 'card-cost-color';
    var cost = def.cost != null ? def.cost : '?';
    var clr = colorLabel(def);
    costColor.textContent = clr + ' / ' + cost;

    var atk = document.createElement('div');
    atk.className = 'card-atk';
    var ap = effectiveAp(instance, state);
    if (ap == null) atk.style.display = 'none';
    else atk.textContent = 'AP ' + ap;

    el.appendChild(name);
    el.appendChild(hp);
    el.appendChild(costColor);
    el.appendChild(atk);

    var badges = document.createElement('div');
    badges.className = 'card-state-badges';
    if (instance.attackedThisTurn) addBadge(badges, 'state-attacked', '攻撃済');
    if (summary.originalColor !== summary.currentColor) {
      addBadge(badges, 'state-color', colorValueLabel(summary.originalColor) + '→' + colorValueLabel(summary.currentColor));
    }
    if (summary.apDelta) addBadge(badges, 'state-ap', 'AP ' + (summary.apDelta > 0 ? '+' : '') + summary.apDelta);
    if (summary.hpDelta) addBadge(badges, 'state-hp', 'HP ' + (summary.hpDelta > 0 ? '+' : '') + summary.hpDelta);
    if (summary.attachmentCount) addBadge(badges, 'state-attachments', '強化 ' + summary.attachmentCount);
    if (badges.children.length) el.appendChild(badges);

    return el;
  }

  // 手札の虫カード
  function renderHandInsect(instance, state) {
    var def = getDef(instance) || {};
    var el = document.createElement('button');
    el.type = 'button';
    el.className = 'battle-card hand-card ' + colorClass(def);
    el.dataset.instanceId = instance.instanceId;

    var name = document.createElement('div');
    name.className = 'card-name-full';
    name.textContent = def.name || '?';

    var hp = document.createElement('div');
    hp.className = 'card-hp';
    hp.textContent = 'HP ' + (def.baseHp || '?');

    var costColor = document.createElement('div');
    costColor.className = 'card-cost-color';
    var cost = def.cost != null ? def.cost : '?';
    var clr = colorLabel(def);
    costColor.textContent = clr + ' / ' + cost;

    var atk = document.createElement('div');
    atk.className = 'card-atk';
    var ap = effectiveAp(instance, state);
    if (ap == null) atk.style.display = 'none';
    else atk.textContent = 'AP ' + ap;

    el.appendChild(name);
    el.appendChild(hp);
    el.appendChild(costColor);
    el.appendChild(atk);

    return el;
  }

  // 術・強化カード（手札・場）
  function renderSpellOrEnhancement(instance) {
    var def = getDef(instance) || {};
    var el = document.createElement('button');
    el.type = 'button';
    el.className = 'battle-card spell-card ' + colorClass(def);
    el.dataset.instanceId = instance.instanceId;

    var name = document.createElement('div');
    name.className = 'card-name-full';
    name.textContent = def.name || '?';

    var type = document.createElement('div');
    type.className = 'card-type';
    type.textContent = typeLabel(def);

    var costColor = document.createElement('div');
    costColor.className = 'card-cost-color';
    var cost = def.cost != null ? def.cost : '?';
    var clr = colorLabel(def);
    costColor.textContent = clr + ' / ' + cost;

    el.appendChild(name);
    el.appendChild(type);
    el.appendChild(costColor);

    return el;
  }

  // 裏向きカード(縄張り)
  function renderFaceDown(onTap, instance) {
    var el = document.createElement('button');
    el.type = 'button';
    el.className = 'battle-card face-down';
    if (instance) {
      el.dataset.instanceId = instance.instanceId;
    }
    var inner = document.createElement('span');
    inner.textContent = '裏';
    el.appendChild(inner);

    if (onTap) {
      el.addEventListener('click', function () {
        onTap(instance, el);
      });
    }
    return el;
  }

  // 山札（裏向きカード束）
  function renderDeck(count) {
    var el = document.createElement('div');
    el.className = 'deck-pile';
    // 3枚重ねて見せる
    for (var i = 0; i < 3; i++) {
      var card = document.createElement('div');
      card.className = 'deck-card';
      card.style.transform = 'translateY(' + (i * 3) + 'px) rotate(' + (i * 2 - 2) + 'deg)';
      el.appendChild(card);
    }
    var label = document.createElement('div');
    label.className = 'deck-count';
    label.textContent = '山札 ' + count;
    el.appendChild(label);
    return el;
  }

  // 汎用レンダラ（カード種別に応じて分岐）
  function renderCard(instance, zone, state) {
    var def = getDef(instance);
    if (!def) { return renderFaceDown(null, instance); }

    // 捨て場は表向きで表示
    if (zone === ZONES.DISCARD) {
      if (def.type === CardTypes.INSECT) { return renderHandInsect(instance, state); }
      return renderSpellOrEnhancement(instance);
    }

    if (def.type === CardTypes.INSECT) {
      if (zone === ZONES.HAND) { return renderHandInsect(instance, state); }
      if (zone === ZONES.FIELD) { return renderFieldInsect(instance, state); }
      if (zone === ZONES.FOOD) { return renderHandInsect(instance, state); } // エサは表向きで同じ見た目
      return renderFaceDown(null, instance);
    }
    if (def.type === CardTypes.SPELL || def.type === CardTypes.ENHANCEMENT) {
      return renderSpellOrEnhancement(instance);
    }
    return renderFaceDown(null, instance);
  }

  // 詳細モーダル用データ生成
  function getCardDetail(instance, state) {
    var def = getDef(instance);
    if (!def) { return null; }
    var summary = modifierSummary(instance, state);
    var attachments = instance.attachments || [];
    var detail = {
      name: def.name,
      type: typeLabel(def),
      color: colorLabel(def),
      colorRaw: def.color || '',
      cost: def.cost,
      baseHp: def.baseHp,
      currentHp: instance.currentHp != null ? instance.currentHp : def.baseHp,
      effectiveMaxHp: summary.maxHp,
      hpBonus: summary.hpDelta,
      effectiveColor: colorValueLabel(summary.currentColor),
      colorChanged: summary.originalColor !== summary.currentColor,
      ap: firstAttackAp(def.skills),
      skills: [],
      traits: [],
      biologicalNote: def.biologicalNote ? def.biologicalNote.rawText : '',
      passiveAbilities: [],
      rulings: [],
      cardEffects: [],
      enhancementEffects: [],
      attachments: [],
      apModifierSources: [],
      hpModifierSources: []
    };
    attachments.forEach(function (att) {
      var attDef = getDef(att) || {};
      var attName = attDef.name || att.cardId;
      detail.attachments.push(attName);
      (attDef.enhancementEffects || []).forEach(function (effect) {
        if (effect.stat === 'AP' && effect.amount) detail.apModifierSources.push(attName + ' ' + (effect.amount > 0 ? '+' : '') + effect.amount);
        if (effect.stat === 'HP' && effect.amount) detail.hpModifierSources.push(attName + ' ' + (effect.amount > 0 ? '+' : '') + effect.amount);
      });
    });
    (instance.statModifiers || []).forEach(function (mod) {
      if (state && ((mod.startTurn != null && state.turnNumber < mod.startTurn) || (mod.endTurn != null && state.turnNumber > mod.endTurn))) return;
      var label = '一時効果 ' + (mod.amount > 0 ? '+' : '') + mod.amount;
      if (mod.stat === 'AP') detail.apModifierSources.push(label);
    });
    if (def.skills) {
      def.skills.forEach(function(s) {
        var effective = s.timing === 'ATTACK' && typeof global.getEffectiveAP === 'function'
          ? global.getEffectiveAP(state, instance, s.baseAp || 0)
          : null;
        detail.skills.push({
          name: s.name,
          baseAp: s.baseAp,
          effectiveAp: effective,
          apBonus: effective == null ? null : effective - (s.baseAp || 0),
          effectText: s.effectText,
          timing: s.timing,
          optional: s.optional
        });
      });
    }
    if (def.traits) {
      def.traits.forEach(function(t) {
        detail.traits.push({
          name: t.name,
          effectText: t.effectText
        });
      });
    }
    if (def.passiveAbilities) {
      def.passiveAbilities.forEach(function(pa) {
        detail.passiveAbilities.push({
          name: pa.name,
          effectText: pa.effectText || (pa.effects || []).map(effectToJa).join('、')
        });
      });
    }
    if (def.rulings) {
      def.rulings.forEach(function(r) {
        detail.rulings.push(typeof r === 'string' ? r : (r.text || r.description || String(r)));
      });
    }
    if (def.cardEffects) {
      def.cardEffects.forEach(function(ce) {
        detail.cardEffects.push({ text: effectToJa(ce) });
      });
    }
    if (def.enhancementEffects) {
      def.enhancementEffects.forEach(function(ee) {
        detail.enhancementEffects.push({ text: enhancementToJa(ee) });
      });
    }
    if (def.sourceLevel) { detail.sourceLevel = def.sourceLevel; }
    return detail;
  }

  global.CardUI = {
    renderCard: renderCard,
    renderFaceDown: renderFaceDown,
    renderDeck: renderDeck,
    renderFieldInsect: renderFieldInsect,
    renderHandInsect: renderHandInsect,
    renderSpellOrEnhancement: renderSpellOrEnhancement,
    getCardDetail: getCardDetail,
    getDef: getDef,
    shortName: shortName,
    colorClass: colorClass,
    firstAttackAp: firstAttackAp,
    effectToJa: effectToJa,
    enhancementToJa: enhancementToJa
  };
})(typeof window !== 'undefined' ? window : globalThis);
