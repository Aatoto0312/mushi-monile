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

  var api = { label: label, setLabel: setLabel, statusGroup: statusGroup, safeEffectText: safeEffectText, safeErrorMessage: safeErrorMessage, playerFacingRulings: playerFacingRulings };
  global.MushijingiUiPresenter = api;
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
}(typeof globalThis !== 'undefined' ? globalThis : this));
