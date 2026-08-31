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

  // 場の虫カード1枚
  function renderFieldInsect(instance) {
    var def = getDef(instance) || {};
    var el = document.createElement('div');
    el.className = 'battle-card field-card ' + colorClass(def);
    el.dataset.instanceId = instance.instanceId;

    var name = document.createElement('div');
    name.className = 'card-name-full';
    name.textContent = def.name || '?';

    var hp = document.createElement('div');
    hp.className = 'card-hp';
    hp.textContent = 'HP ' + instance.currentHp;

    var costColor = document.createElement('div');
    costColor.className = 'card-cost-color';
    var cost = def.cost != null ? def.cost : '?';
    var clr = colorLabel(def);
    costColor.textContent = clr + ' / ' + cost;

    var atk = document.createElement('div');
    atk.className = 'card-atk';
    var ap = def.skills && def.skills[0] ? (def.skills[0].baseAp || 0) : 0;
    atk.textContent = 'AP ' + ap;

    el.appendChild(name);
    el.appendChild(hp);
    el.appendChild(costColor);
    el.appendChild(atk);

    return el;
  }

  // 手札の虫カード
  function renderHandInsect(instance) {
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
    var ap = def.skills && def.skills[0] ? (def.skills[0].baseAp || 0) : 0;
    atk.textContent = 'AP ' + ap;

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
  function renderCard(instance, zone) {
    var def = getDef(instance);
    if (!def) { return renderFaceDown(null, instance); }

    // 捨て場は表向きで表示
    if (zone === ZONES.DISCARD) {
      if (def.type === CardTypes.INSECT) { return renderHandInsect(instance); }
      return renderSpellOrEnhancement(instance);
    }

    if (def.type === CardTypes.INSECT) {
      if (zone === ZONES.HAND) { return renderHandInsect(instance); }
      if (zone === ZONES.FIELD) { return renderFieldInsect(instance); }
      if (zone === ZONES.FOOD) { return renderHandInsect(instance); } // エサは表向きで同じ見た目
      return renderFaceDown(null, instance);
    }
    if (def.type === CardTypes.SPELL || def.type === CardTypes.ENHANCEMENT) {
      return renderSpellOrEnhancement(instance);
    }
    return renderFaceDown(null, instance);
  }

  // 詳細モーダル用データ生成
  function getCardDetail(instance) {
    var def = getDef(instance);
    if (!def) { return null; }
    var detail = {
      name: def.name,
      type: typeLabel(def),
      color: colorLabel(def),
      colorRaw: def.color || '',
      cost: def.cost,
      baseHp: def.baseHp,
      currentHp: instance.currentHp != null ? instance.currentHp : def.baseHp,
      ap: (def.skills && def.skills[0]) ? (def.skills[0].baseAp || 0) : 0,
      skills: [],
      traits: [],
      biologicalNote: def.biologicalNote ? def.biologicalNote.rawText : '',
      passiveAbilities: [],
      rulings: [],
      cardEffects: [],
      enhancementEffects: []
    };
    if (def.skills) {
      def.skills.forEach(function(s) {
        detail.skills.push({
          name: s.name,
          baseAp: s.baseAp,
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
          id: pa.id,
          name: pa.name,
          timing: pa.timing,
          condition: pa.condition,
          effects: pa.effects
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
        detail.cardEffects.push({
          type: ce.type,
          description: ce.description || ce.effectText || ''
        });
      });
    }
    if (def.enhancementEffects) {
      def.enhancementEffects.forEach(function(ee) {
        detail.enhancementEffects.push({
          type: ee.type || '',
          stat: ee.stat || '',
          amount: ee.amount != null ? ee.amount : 0
        });
      });
    }
    if (def.sourceLevel) { detail.sourceLevel = def.sourceLevel; }
    if (def.verificationNotes) { detail.verificationNotes = def.verificationNotes; }
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
    colorClass: colorClass
  };
})(typeof window !== 'undefined' ? window : globalThis);