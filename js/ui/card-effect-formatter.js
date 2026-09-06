(function (global) {
  'use strict';

  // 術・強化カードの効果をプレイヤー向け自然な日本語に変換する。
  // 内部enum文字列をそのまま画面に出さない。
  // SET1〜SET7まで共通して使える汎用フォーマッタ。

  var TARGET_LABELS = {
    OPPONENT_FIELD_INSECT: '相手の虫1体',
    ALL_OPPONENT_FIELD_INSECTS: '相手のすべての虫',
    OWN_FIELD_INSECT: '自分の虫1体',
    ALL_OWN_FIELD_INSECTS: '自分のすべての虫',
    SELF: '自分',
    DEFENDER: '対象の虫',
    ATTACKER: 'この虫'
  };

  var DURATION_LABELS = {
    UNTIL_END_OF_TURN: 'ターン終了時まで',
    PERMANENT: '持続',
    UNTIL_OPPONENT_NEXT_TURN: '相手の次のターン終了時まで'
  };

  var STAT_LABELS = {
    AP: '攻撃力',
    HP: 'HP'
  };

  function formatTarget(effect) {
    if (!effect) return '';
    if (effect.target && TARGET_LABELS[effect.target]) {
      return TARGET_LABELS[effect.target];
    }
    if (effect.targetType === 'OPPONENT_FIELD_INSECT') return '相手の虫1体';
    if (effect.targetType === 'ALL_OPPONENT_FIELD_INSECTS') return '相手のすべての虫';
    if (effect.targetType === 'OWN_FIELD_INSECT') return '自分の虫1体';
    if (effect.targetType === 'ALL_OWN_FIELD_INSECTS') return '自分のすべての虫';
    return '';
  }

  function formatDuration(effect) {
    if (!effect) return '';
    if (effect.duration && DURATION_LABELS[effect.duration]) {
      return DURATION_LABELS[effect.duration];
    }
    return '';
  }

  function formatStat(effect) {
    if (!effect || !effect.stat) return '';
    return STAT_LABELS[effect.stat] || effect.stat;
  }

  function formatAmount(effect) {
    if (!effect || effect.amount == null) return '';
    var n = effect.amount;
    // 全角数字に変換する必要はないが、可読性のため桁区切りなしでそのまま
    return String(n);
  }

  // 単一のcardEffectを日本語テキストに変換
  function formatCardEffect(effect) {
    if (!effect) return '';

    // 既存のplayer-facing説明があれば最優先
    if (effect.description) return effect.description;
    if (effect.effectText) return effect.effectText;

    var type = effect.type || effect.id || '';

    switch (type) {
      case 'DEAL_DAMAGE_TO_TARGET':
      case 'DEAL_DAMAGE': {
        var target = formatTarget(effect);
        var amount = formatAmount(effect);
        if (!target || !amount) return '';
        var base = '対象に' + amount + 'ダメージを与える。';
        // targetが相手虫なら明記
        if (effect.target === 'OPPONENT_FIELD_INSECT' || effect.targetType === 'OPPONENT_FIELD_INSECT') {
          base = '相手の虫1体に' + amount + 'ダメージを与える。';
        }
        return base;
      }

      case 'APPLY_STAT_MODIFIER': {
        var stat = formatStat(effect);
        var amount = formatAmount(effect);
        var dur = formatDuration(effect);
        if (!stat || !amount) return '';
        var sign = effect.amount >= 0 ? '増やす' : '減らす';
        var absAmount = String(Math.abs(effect.amount));
        var text = (dur ? dur + '、' : '') + '対象の' + stat + 'を' + absAmount + sign + '。';
        return text;
      }

      case 'APPLY_STAT_MODIFIER_TO_ALL_OWN_FIELD': {
        var stat = formatStat(effect);
        var amount = formatAmount(effect);
        var dur = formatDuration(effect);
        if (!stat || !amount) return '';
        var sign = effect.amount >= 0 ? '増やす' : '減らす';
        var absAmount = String(Math.abs(effect.amount));
        var text = (dur ? dur + '、' : '') + '自分のすべての虫の' + stat + 'を' + absAmount + sign + '。';
        return text;
      }

      case 'TURN_FACE_DOWN': {
        var dur = formatDuration(effect);
        return (dur ? dur + '、' : '') + '対象を裏向きにする。';
      }

      case 'RETRIEVE_FROM_DISCARD': {
        return '捨て場からカードを回収する。';
      }

      case 'COLOR_OVERRIDE': {
        return 'この虫の色を変更する。';
      }

      case 'SACRIFICE_OWN_INSECT': {
        return '自分の虫1体を破壊する。';
      }

      case 'MOVE_SELF': {
        if (effect.from === 'HAND' && effect.to === 'FOOD') {
          return '手札からエサにする。';
        }
        return 'カードを移動する。';
      }

      case 'CONTINUOUS_ATTACK': {
        var max = effect.maxCount || 2;
        return '攻撃後、相手場に虫がいればもう' + (max - 1) + '度使用可能。';
      }

      case 'OFFER_SELF_TO_FIELD': {
        return '場に出ることができる。';
      }

      case 'DESTROY_SOURCE': {
        return 'このカードを破壊する。';
      }

      default:
        return '';
    }
  }

  // 強化効果を日本語テキストに変換
  function formatEnhancementEffect(effect) {
    if (!effect) return '';

    if (effect.description) return effect.description;

    var type = effect.type || '';

    if (type === 'COLOR_OVERRIDE') {
      var colorNames = [];
      if (effect.colors) {
        effect.colors.forEach(function (c) {
          if (c === 'RED') colorNames.push('赤');
          else if (c === 'BLUE') colorNames.push('青');
          else if (c === 'GREEN') colorNames.push('緑');
          else colorNames.push(c);
        });
      }
      if (colorNames.length) {
        return 'この虫の色を' + colorNames.join('か') + 'に変える。';
      }
      return 'この虫の色を変更する。';
    }

    if (effect.stat) {
      var statLabel = STAT_LABELS[effect.stat] || effect.stat;
      var amount = effect.amount;
      if (amount == null) return '';
      var sign = amount >= 0 ? '+' : '';
      return statLabel + ' ' + sign + amount + '。';
    }

    return '';
  }

  // カード定義の全cardEffectsを結合テキストに変換
  function formatCardEffects(cardDef) {
    if (!cardDef || !cardDef.cardEffects) return [];
    return cardDef.cardEffects.map(function (ce) {
      return formatCardEffect(ce);
    }).filter(function (t) { return t.length > 0; });
  }

  // カード定義の全enhancementEffectsを結合テキストに変換
  function formatEnhancementEffects(cardDef) {
    if (!cardDef || !cardDef.enhancementEffects) return [];
    return cardDef.enhancementEffects.map(function (ee) {
      return formatEnhancementEffect(ee);
    }).filter(function (t) { return t.length > 0; });
  }

  global.CardEffectFormatter = {
    formatCardEffect: formatCardEffect,
    formatEnhancementEffect: formatEnhancementEffect,
    formatCardEffects: formatCardEffects,
    formatEnhancementEffects: formatEnhancementEffects,
    formatTarget: formatTarget,
    formatDuration: formatDuration,
    formatStat: formatStat,
    formatAmount: formatAmount,
    TARGET_LABELS: TARGET_LABELS,
    DURATION_LABELS: DURATION_LABELS,
    STAT_LABELS: STAT_LABELS
  };
})(typeof window !== 'undefined' ? window : globalThis);
