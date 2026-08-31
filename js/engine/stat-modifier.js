(function (global) {
  'use strict';

  // 汎用ステータス修飾(AP/HP 一時修飾)と 強化カード(attachment)基盤。
  //
  // カード名分岐はせず、スキル/効果の metadata と修飾オブジェクトから汎用的に判断する。
  //
  // ## statModifier (一時的な AP/HP 修飾)
  //   形: { id, sourceInstanceId, stat:'AP'|'HP', amount, createdTurn, startTurn, endTurn }
  //   - 有効条件: startTurn <= state.turnNumber <= endTurn
  //   - expiresAt を文字列でなく startTurn/endTurn のターン窓で表すことで、
  //     「今ターン限り」(飛蝗の凶相)も「次のターン」(くさいツノ)も区別できる。
  //
  // ## attachment (強化カード)
  //   - 強化カードの CardInstance を対象虫.attachments に保持する。
  //   - 対象虫が FIELD を離れたら、紐付く強化カードを所有者の DISCARD へ移動する。

  // 有効な statModifier の量(stat === 'AP'|'HP')を合算する。
  function getStatModifierTotal(state, instance, stat) {
    var arr = instance.statModifiers || [];
    var total = 0;
    for (var i = 0; i < arr.length; i++) {
      var m = arr[i];
      if (m.stat !== stat) { continue; }
      if (!isStatModifierActive(state, m)) { continue; }
      total += (m.amount || 0);
    }
    return total;
  }

  function isStatModifierActive(state, m) {
    if (m.startTurn != null && state.turnNumber < m.startTurn) { return false; }
    if (m.endTurn != null && state.turnNumber > m.endTurn) { return false; }
    return true;
  }

  // 有効な AP 修飾を合算した総AP量を返す。
  // baseAp は通常、技の baseAp。攻撃のたびに再計算される。
  function getEffectiveAP(state, instance, baseAp) {
    return (baseAp || 0) + getStatModifierTotal(state, instance, 'AP');
  }

  // 虫の現在の最大HPを返す。
  // baseHp + 既存 hpBonus 修飾 + 紐付く強化カードの HP 修飾 を合算する。
  function calculateMaxHp(instance) {
    var base = instance.baseHp != null ? instance.baseHp : 0;
    var hpBonus = (instance.modifiers && instance.modifiers.hpBonus) || 0;
    var sum = base + hpBonus;
    // 紐付く強化カードの HP 修飾
    var attachments = instance.attachments || [];
    for (var i = 0; i < attachments.length; i++) {
      var att = attachments[i];
      var def = global.getCardDefinition ? global.getCardDefinition(att.cardId) : null;
      if (!def || !def.enhancementEffects) { continue; }
      for (var j = 0; j < def.enhancementEffects.length; j++) {
        var e = def.enhancementEffects[j];
        if (e && e.stat === 'HP') {
          sum += (e.amount || 0);
        }
      }
    }
    return sum;
  }

  // statModifier を追加する。turnNumber から startTurn/endTurn を解決。
  // options: { startOffset, endOffset } ターン番号からの相対オフセット。
  function addStatModifier(state, instance, mod) {
    mod = mod || {};
    var startTurn = mod.startTurn;
    var endTurn = mod.endTurn;
    if (startTurn == null) { startTurn = state.turnNumber + (mod.startOffset || 0); }
    if (endTurn == null) {
      endTurn = (mod.endOffset != null)
        ? state.turnNumber + mod.endOffset
        : startTurn;
    }
    var entry = {
      id: mod.id != null ? mod.id : ('statmod-' + (instance.statModifiers ? instance.statModifiers.length : 0)),
      sourceInstanceId: mod.sourceInstanceId || null,
      stat: mod.stat,
      amount: mod.amount,
      createdTurn: state.turnNumber,
      startTurn: startTurn,
      endTurn: endTurn
    };
    if (!instance.statModifiers) { instance.statModifiers = []; }
    instance.statModifiers.push(entry);
    return entry;
  }

  // 期限切れ・無効な statModifier を掃除し、場を離れて不要になった修飾を除去する。
  // clearAll: true なら全 statModifier を消す(場を離れた時用)。
  function pruneStatModifiers(state, instance, clearAll) {
    if (!instance.statModifiers) { return; }
    instance.statModifiers = instance.statModifiers.filter(function (m) {
      if (clearAll) { return false; }
      return isStatModifierActive(state, m);
    });
  }

  // 対象虫に紐付く強化カードをすべて所有者の DISCARD へ移動する。
  // 対象虫が FIELD を離れる際に呼ばれる。
  function discardAllAttachments(state, instance) {
    var attachments = instance.attachments || [];
    instance.attachments = [];
    for (var i = 0; i < attachments.length; i++) {
      var att = attachments[i];
      att.zone = global.ZONES.DISCARD;
      var owner = null;
      for (var p = 0; p < state.playerOrder.length; p++) {
        var pid = state.playerOrder[p];
        if (pid === att.ownerId) { owner = state.player(pid); break; }
      }
      if (owner) {
        owner.discard.push(att);
      }
    }
  }

  global.getStatModifierTotal = getStatModifierTotal;
  global.getEffectiveAP = getEffectiveAP;
  global.calculateMaxHp = calculateMaxHp;
  global.addStatModifier = addStatModifier;
  global.pruneStatModifiers = pruneStatModifiers;
  global.discardAllAttachments = discardAllAttachments;

})(typeof window !== 'undefined' ? window : globalThis);
