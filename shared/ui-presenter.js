(function (global) {
  'use strict';

  var labels = {
    INSECT: '虫', SPELL: '術', ENHANCEMENT: '強化',
    RED: '赤', BLUE: '青', GREEN: '緑', COLORLESS: '無色',
    PLAYABLE: '対戦対応', PARTIAL: '一部対応', BLOCKED: '確認保留',
    UNAVAILABLE: '対戦未対応'
  };
  var playableStatuses = { TESTED: true, IMPLEMENTED: true, SPEC_COMPLETE: true };

  function setLabel(value) {
    if (value === 'STARTER') { return 'スターター'; }
    var match = /^(?:BOOSTER_)?SET_?(\d+)$/i.exec(String(value || ''));
    return match ? '第' + Number(match[1]) + '弾' : 'その他';
  }

  function statusGroup(value) {
    if (playableStatuses[value]) { return 'PLAYABLE'; }
    if (value === 'PARTIAL') { return 'PARTIAL'; }
    if (value === 'BLOCKED') { return 'BLOCKED'; }
    return 'UNAVAILABLE';
  }

  function label(value, kind) {
    if (kind === 'set') { return setLabel(value); }
    if (kind === 'implementationStatus') { return labels[statusGroup(value)]; }
    if (kind === 'rarity' || kind === 'cost') { return value === null || value === undefined || value === '' ? '未設定' : String(value); }
    return labels[value] || '未設定';
  }

  function safeEffectText(effect) {
    if (!effect || typeof effect !== 'object') { return '効果の説明はありません。'; }
    return effect.name || effect.effectText || effect.text || effect.description || '効果の説明はありません。';
  }

  function safeErrorMessage() {
    return '操作を完了できませんでした。画面を確認して、もう一度お試しください。';
  }

  function playerFacingRulings(rulings) {
    return (rulings || []).map(function (ruling) {
      return typeof ruling === 'string' ? ruling : (ruling && (ruling.text || ruling.description)) || '';
    }).filter(function (text) {
      return text && !/(本データを上書き|一般知識で補完|ローカル資料|公式カード画像\/現物と矛盾)/.test(text);
    });
  }

  function readableText(value) {
    return typeof value === 'string' && value.trim() ? value.trim() : '';
  }

  function effectText(effect, formatter, method) {
    var direct = readableText(effect && (effect.effectText || effect.description || effect.text));
    if (direct) { return direct; }
    if (formatter && typeof formatter[method] === 'function') {
      return readableText(formatter[method](effect));
    }
    return '';
  }

  function presentCardDetail(card, formatter) {
    card = card || {};
    var basics = [{ label: '種類', value: label(card.type) }];
    if (card.color != null) { basics.push({ label: '色', value: label(card.color) }); }
    if (card.cost != null) { basics.push({ label: 'コスト', value: String(card.cost) }); }
    if (card.type === 'INSECT' && card.baseHp != null) { basics.push({ label: 'HP', value: String(card.baseHp) }); }
    if (card.rarity != null && card.rarity !== '') { basics.push({ label: 'レアリティ', value: String(card.rarity) }); }
    basics.push({ label: '対戦対応', value: label(card.implementationStatus, 'implementationStatus') });

    var skills = (card.skills || []).map(function (skill) {
      var texts = [];
      var direct = effectText(skill, formatter, 'formatCardEffect');
      if (direct) { texts.push(direct); }
      (skill && skill.effects || []).forEach(function (effect) {
        var text = effectText(effect, formatter, 'formatCardEffect');
        if (text && texts.indexOf(text) === -1) { texts.push(text); }
      });
      return { name: readableText(skill && skill.name) || '名称不明の技', ap: skill && skill.baseAp != null ? skill.baseAp : null, text: texts.join(' ') };
    });
    var traits = (card.passiveAbilities || []).map(function (ability) {
      var texts = [];
      var direct = effectText(ability, formatter, 'formatCardEffect');
      if (direct) { texts.push(direct); }
      (ability && ability.effects || []).forEach(function (effect) {
        var text = effectText(effect, formatter, 'formatCardEffect');
        if (text && texts.indexOf(text) === -1) { texts.push(text); }
      });
      return { name: readableText(ability && ability.name) || '名称不明の特性', text: texts.join(' ') || '効果の説明はありません。' };
    });
    var effects = [];
    (card.cardEffects || []).forEach(function (effect) {
      var text = effectText(effect, formatter, 'formatCardEffect');
      if (text) { effects.push(text); }
    });
    (card.enhancementEffects || []).forEach(function (effect) {
      var text = effectText(effect, formatter, 'formatEnhancementEffect');
      if (text) { effects.push(text); }
    });
    if (!effects.length && ((card.cardEffects || []).length || (card.enhancementEffects || []).length)) {
      effects.push('効果の説明はありません。');
    }
    return { basics: basics, skills: skills, traits: traits, effects: effects, rulings: playerFacingRulings(card.rulings) };
  }

  var api = { label: label, setLabel: setLabel, statusGroup: statusGroup, safeEffectText: safeEffectText, safeErrorMessage: safeErrorMessage, playerFacingRulings: playerFacingRulings, presentCardDetail: presentCardDetail };
  global.MushijingiUiPresenter = api;
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
}(typeof globalThis !== 'undefined' ? globalThis : this));
