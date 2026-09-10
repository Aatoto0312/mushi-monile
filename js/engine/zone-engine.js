(function (global) {
  'use strict';

  function getPlayerZoneArray(state, playerId, zone) {
    var player = state.player(playerId);
    if (!player) { return null; }
    if (!CardInstance.isZone(zone)) { return null; }
    return player[zone.toLowerCase()] || null;
  }

  // 指定プレイヤーの特定ゾーンから instanceId を持つカードを探す
  function findInZone(state, playerId, zone, instanceId) {
    var arr = getPlayerZoneArray(state, playerId, zone);
    if (!arr) { return null; }
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].instanceId === instanceId) {
        return arr[i];
      }
    }
    return null;
  }

  // 全プレイヤー・全ゾーンを横断して instanceId で探す
  function findAnywhere(state, instanceId) {
    var zones = [
      ZONES.DECK, ZONES.HAND, ZONES.TERRITORY,
      ZONES.FOOD, ZONES.FIELD, ZONES.DISCARD, ZONES.RESOLVING
    ];
    for (var p = 0; p < state.playerOrder.length; p++) {
      var playerId = state.playerOrder[p];
      for (var z = 0; z < zones.length; z++) {
        var inst = findInZone(state, playerId, zones[z], instanceId);
        if (inst) { return { playerId: playerId, zone: zones[z], instance: inst }; }
      }
    }
    return null;
  }

  function findAttachment(state, instanceId) {
    for (var p = 0; p < state.playerOrder.length; p++) {
      var playerId = state.playerOrder[p];
      var field = state.player(playerId).field;
      for (var f = 0; f < field.length; f++) {
        var attachments = field[f].attachments || [];
        for (var a = 0; a < attachments.length; a++) {
          if (attachments[a].instanceId === instanceId) {
            return { playerId: playerId, host: field[f], instance: attachments[a], index: a };
          }
        }
      }
    }
    return null;
  }

  // 全移動を先に検証し、妥当な場合だけ適用する。交換途中の部分状態を作らない。
  function batchMoveCards(state, moves) {
    var seen = {};
    var prepared = (moves || []).map(function (move) {
      if (!move || seen[move.instanceId]) { throw new Error('batchMoveCards: duplicate or invalid move'); }
      seen[move.instanceId] = true;
      var holder = findAnywhere(state, move.instanceId);
      if (!holder || holder.zone !== move.from) { throw new Error('batchMoveCards: source mismatch'); }
      if (!getPlayerZoneArray(state, move.playerId || holder.playerId, move.to)) { throw new Error('batchMoveCards: invalid destination'); }
      return { move: move, holder: holder };
    });
    return prepared.map(function (entry) {
      var move = entry.move;
      return moveCard(state, move.instanceId, move.from, move.to, { playerId: move.playerId || entry.holder.playerId, faceDown: move.faceDown });
    });
  }

  // カードを移動させる。fromZone/toZone は対象プレイヤーのゾーン。
  // デフォルトではカードの現在の保持者(holder.playerId)のゾーン間で移動する。
  // opts.playerId を指定すると、移動先ゾーンをそのプレイヤーのゾーンにする。
  // カードがFIELDに入る際の共通初期化。
  // どの経路(通常召喚・誘発効果・将来のカード効果)でも統一して適用する。
  // ＜擬態＞(gitai)持ちは「場に出た次の相手ターン」の保護ターンを予約する。
  // 相手ターン中に場へ出た場合は、その相手ターンでは有効化せず、もう1手後の
  // 相手ターンで有効化する(2026年1月15日の公式裁定に準拠)。
  function setupFieldEntry(state, card, fromZone) {
    card.enteredFieldTurn = state.turnNumber;
    var def = global.getCardDefinition ? global.getCardDefinition(card.cardId) : null;
    if (!def || !def.skills) { return; }
    var gitai = def.skills.find(function (s) { return s.gitai === true; });
    if (!gitai) { return; }
    // 保護が予約される「次の相手ターン」のターン番号を計算。
    // 場へ出た瞬間のアクティブプレイヤーが所有者(自分のターン)なら +1、
    // 相手(相手ターン)なら +2(自分のターンを1手挟む)。
    var ownerId = card.ownerId;
    if (!card.runtimeFlags) { card.runtimeFlags = {}; }
    if (state.activePlayerId === ownerId) {
      card.runtimeFlags.gitaiProtectedTurn = state.turnNumber + 1;
    } else {
      card.runtimeFlags.gitaiProtectedTurn = state.turnNumber + 2;
    }
    card.runtimeFlags.isGitaiProtected = true;
  }

  // 攻撃対象にできる虫かを汎用的に判定する(将来の対象制限に対応可能な拡張点)。
  // faceDown の虫は場にいない扱い。＜擬態＞有効中(gitaiProtectedTurn === 現在ターン)は
  // 虫・効果付き攻撃の対象にできない。術カードの対象は別システムであり影響しない。
  function isAttackTargetable(state, instance) {
    if (!instance) { return false; }
    if (instance.faceDown) { return false; }
    var flags = instance.runtimeFlags;
    if (flags && flags.gitaiProtectedTurn === state.turnNumber) {
      return false;
    }
    return true;
  }

  function moveCard(state, instanceId, fromZone, toZone, opts) {
    opts = opts || {};
    var holder = findAnywhere(state, instanceId);
    if (!holder) {
      throw new Error('moveCard: instance not found ' + instanceId);
    }

    var sourcePlayerId = holder.playerId;
    var destPlayerId = opts.playerId || sourcePlayerId;

    var fromArr = getPlayerZoneArray(state, sourcePlayerId, fromZone);
    var toArr = getPlayerZoneArray(state, destPlayerId, toZone);
    if (!fromArr || !toArr) {
      throw new Error('moveCard: invalid zone transition ' + fromZone + ' -> ' + toZone);
    }

    var idx = -1;
    for (var i = 0; i < fromArr.length; i++) {
      if (fromArr[i].instanceId === instanceId) {
        idx = i;
        break;
      }
    }
    if (idx === -1) {
      throw new Error('moveCard: instance not in fromZone ' + instanceId + ' ' + fromZone);
    }

    var card = fromArr.splice(idx, 1)[0];

    // 場を離れる場合の共通処理
    if (fromZone === ZONES.FIELD) {
      // ONCE_PER_FIELD_STAY の使用履歴のみリセット
      if (card.usedSkills && card.usedSkills.length > 0) {
        var def = global.getCardDefinition ? global.getCardDefinition(card.cardId) : null;
        if (def && def.skills) {
          var fieldStaySkills = def.skills.filter(function (s) {
            return s.usageLimit === 'ONCE_PER_FIELD_STAY';
          }).map(function (s) { return s.id; });
          if (fieldStaySkills.length > 0) {
            card.usedSkills = card.usedSkills.filter(function (skillId) {
              return fieldStaySkills.indexOf(skillId) === -1;
            });
          }
        }
      }
      // 一時的な statModifier を全消去 (場を離れたら消える)
      pruneStatModifiers(state, card, true);
      // 紐付く強化カード(attachment)を所有者の DISCARD へ移動
      discardAllAttachments(state, card);
    }

    card.zone = toZone;

    if (card.zone === ZONES.FIELD) {
      card.faceDown = false;
      setupFieldEntry(state, card, fromZone);
    }

    if (opts.faceDown != null) {
      card.faceDown = opts.faceDown;
    }

    // ゾーン変化時の駆け込み処理
    if (opts.onMove) {
      opts.onMove(state, card, fromZone, toZone);
    }

    toArr.push(card);
    return card;
  }

  global.getPlayerZoneArray = getPlayerZoneArray;
  global.findInZone = findInZone;
  global.findAnywhere = findAnywhere;
  global.findAttachment = findAttachment;
  global.batchMoveCards = batchMoveCards;
  global.isAttackTargetable = isAttackTargetable;
  global.moveCard = moveCard;
})(typeof window !== 'undefined' ? window : globalThis);
