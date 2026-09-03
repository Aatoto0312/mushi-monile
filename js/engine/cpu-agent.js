(function (global) {
  'use strict';

  // 蟲神器 CPU対戦エージェント v0.1
  //
  // ルール違反・フリーズ・停止を起こさず、既存のゲームエンジンAPIのみを呼び出して
  // 1行動ずつ合法手を決定しターンを進行する。

  function CpuAgent(playerId, options) {
    this.playerId = playerId;
    this.options = options || {};
    this.rng = this.options.rng || Math.random;
    this.maxActionsPerTurn = this.options.maxActionsPerTurn || 50;
  }

  // pendingEffect (選択待ち) が発生しているか確認し、解決行動を返す
  CpuAgent.prototype.getPendingAction = function (state) {
    var pending = global.getPendingEffect(state);
    if (!pending || pending.playerId !== this.playerId) {
      return null;
    }

    if (pending.type === 'TERRITORY_DRAW_SELECTION') {
      if (!pending.options || pending.options.length === 0) return null;
      var idx = Math.floor(this.rng() * pending.options.length);
      var selectedInstanceId = pending.options[idx];
      return {
        type: 'RESOLVE_TERRITORY_SELECTION',
        instanceId: selectedInstanceId
      };
    }

    if (pending.type === 'TERRITORY_DRAW_CHOICE') {
      var choice = 'TAKE_TO_HAND';
      if (pending.options && pending.options.indexOf('USE_TOBIDASU') !== -1) {
        choice = 'USE_TOBIDASU';
      }
      return {
        type: 'RESOLVE_TERRITORY_CHOICE',
        choice: choice
      };
    }

    if (pending.type === 'DISCARD_INSECT_SELECTION') {
      if (!pending.options || pending.options.length === 0) return null;
      var discardIdx = Math.floor(this.rng() * pending.options.length);
      return { type: 'RESOLVE_DISCARD_INSECT_SELECTION', instanceId: pending.options[discardIdx] };
    }

    if (pending.type === 'SPELL_TARGET_SELECTION') {
      if (!pending.options || pending.options.length === 0) return null;
      var spellTargetIdx = Math.floor(this.rng() * pending.options.length);
      return { type: 'RESOLVE_SPELL_TARGET_SELECTION', instanceId: pending.options[spellTargetIdx] };
    }

    return null;
  };

  // メインフェイズ中に次に実行する1つの行動を決定する
  CpuAgent.prototype.decideMainPhaseAction = function (state) {
    var player = state.player(this.playerId);
    var self = this;

    // A. 召喚可能な虫を探す (availableCost 以下のコスト)
    var playableInsects = player.hand.filter(function (inst) {
      var def = global.getCardDefinition(inst.cardId);
      if (!def || def.type !== global.CardTypes.INSECT) return false;
      if (!def.isPlayable()) return false;
      return player.availableCost >= (def.cost != null ? def.cost : 0);
    });

    if (playableInsects.length > 0) {
      var chosenInsect = playableInsects[Math.floor(this.rng() * playableInsects.length)];
      return {
        type: 'SUMMON',
        instanceId: chosenInsect.instanceId
      };
    }

    // B. 使用可能な術を探す
    var playableSpells = player.hand.filter(function (inst) {
      var def = global.getCardDefinition(inst.cardId);
      if (!def || def.type !== global.CardTypes.SPELL) return false;
      if (!def.isPlayable()) return false;
      if (player.availableCost < (def.cost != null ? def.cost : 0)) return false;

      // 対象指定をCPUが安全に解決できないDEAL_DAMAGE_TO_TARGETは除外。
      // 各効果のtargetが OPPONENT_FIELD_INSECT で、かつ相手場に表向きの対象が
      // 存在する場合のみ使用可能とする(それ以外は必ず例外を起こすため候補から外す)。
      var effects = def.cardEffects || [];
      var dmgEffects = effects.filter(function (eff) {
        return eff && eff.type === 'DEAL_DAMAGE_TO_TARGET';
      });
      for (var di = 0; di < dmgEffects.length; di++) {
        var dmgEff = dmgEffects[di];
        if (dmgEff.target !== 'OPPONENT_FIELD_INSECT') return false;
        var oppId = state.opponentOf(self.playerId);
        var oppField = state.player(oppId).field.filter(function (c) { return !c.faceDown; });
        if (oppField.length === 0) return false;
      }
      return true;
    });

    if (playableSpells.length > 0) {
      var chosenSpell = playableSpells[Math.floor(this.rng() * playableSpells.length)];
      var spellTargets = global.getSpellTargetCandidates(state, self.playerId, chosenSpell.instanceId);
      return {
        type: 'USE_SPELL',
        instanceId: chosenSpell.instanceId,
        targetInstanceId: spellTargets.length ? spellTargets[Math.floor(this.rng() * spellTargets.length)].instanceId : null
      };
    }

    // C. 使用可能な強化カードを探す
    var playableEnhancements = player.hand.filter(function (inst) {
      var def = global.getCardDefinition(inst.cardId);
      if (!def || def.type !== global.CardTypes.ENHANCEMENT) return false;
      if (!def.isPlayable()) return false;
      if (player.availableCost < (def.cost != null ? def.cost : 0)) return false;
      // COLOR_OVERRIDE系はCPUが色選択を安全に行えないため除外
      var enhEffects = def.enhancementEffects || [];
      if (enhEffects.some(function (eff) { return eff && eff.type === 'COLOR_OVERRIDE'; })) {
        return false;
      }
      // 自分の場に表向きの虫がいるか
      var validTargets = player.field.filter(function (c) { return !c.faceDown; });
      return validTargets.length > 0;
    });

    if (playableEnhancements.length > 0) {
      var chosenEnh = playableEnhancements[Math.floor(this.rng() * playableEnhancements.length)];
      var validTargets = player.field.filter(function (c) { return !c.faceDown; });
      var targetInsect = validTargets[Math.floor(this.rng() * validTargets.length)];
      return {
        type: 'USE_ENHANCEMENT',
        instanceId: chosenEnh.instanceId,
        targetInstanceId: targetInsect.instanceId
      };
    }

    // D. 攻撃可能な自分の虫を探す
    var attackerCandidates = player.field.filter(function (inst) {
      if (inst.faceDown) return false;
      if (inst.attackedThisTurn) return false;
      var legalTargets = global.getLegalAttackTargets(state, inst.instanceId);
      if (legalTargets.length === 0) return false;
      var def = global.getCardDefinition(inst.cardId);
      var skills = (def && def.skills) ? def.skills.filter(function (skill) {
        if (skill.timing !== 'ATTACK') return false;
        return !global.skillRequiresSacrifice(skill) || global.getSacrificeCandidates(state, inst.instanceId).length > 0;
      }) : [];
      return skills.length > 0;
    });

    if (attackerCandidates.length > 0) {
      var chosenAttacker = attackerCandidates[Math.floor(this.rng() * attackerCandidates.length)];
      var targets = global.getLegalAttackTargets(state, chosenAttacker.instanceId);
      var chosenTarget = targets[Math.floor(this.rng() * targets.length)];
      var def = global.getCardDefinition(chosenAttacker.cardId);
      var attackSkills = (def && def.skills) ? def.skills.filter(function(s) {
        if (s.timing !== 'ATTACK') return false;
        return !global.skillRequiresSacrifice(s) || global.getSacrificeCandidates(state, chosenAttacker.instanceId).length > 0;
      }) : [];
      var skillId = (attackSkills.length > 0) ? attackSkills[0].id : null;
      var sacrificeId = null;
      if (attackSkills.length > 0 && global.skillRequiresSacrifice(attackSkills[0])) {
        var sacrificeCandidates = global.getSacrificeCandidates(state, chosenAttacker.instanceId);
        sacrificeId = sacrificeCandidates[0].instanceId;
      }

      return {
        type: 'ATTACK',
        attackerInstanceId: chosenAttacker.instanceId,
        targetInstanceId: chosenTarget.instance ? chosenTarget.instance.instanceId : null,
        targetType: chosenTarget.targetType,
        skillId: skillId,
        chosenSacrificeInstanceId: sacrificeId
      };
    }

    // E. 他に合法行動がなければターン終了
    return {
      type: 'END_TURN'
    };
  };

  // 次に取るべき行動(1手)を決定する
  CpuAgent.prototype.step = function (state) {
    if (state.phase === global.Phases.GAME_OVER) {
      return null;
    }

    // pendingEffect が存在する場合、通常CPU行動は行わない。
    // CPU自身(P2)のpendingは自動解決し、人間(P1)のpendingなら完全停止する。
    var pending = global.getPendingEffect(state);
    if (pending) {
      return this.getPendingAction(state);
    }

    // 自分のターンでない場合は何もしない
    if (state.activePlayerId !== this.playerId) {
      return null;
    }

    if (state.phase === global.Phases.DRAW_PHASE) {
      return { type: 'ENTER_SET_PHASE' };
    }

    if (state.phase === global.Phases.SET_PHASE) {
      var player = state.player(this.playerId);
      if (player.foodSetThisTurn === 0 && player.hand.length > 0) {
        var idx = Math.floor(this.rng() * player.hand.length);
        return {
          type: 'SET_FOOD',
          instanceId: player.hand[idx].instanceId
        };
      }
      return { type: 'ENTER_MAIN_PHASE' };
    }

    if (state.phase === global.Phases.MAIN_PHASE) {
      return this.decideMainPhaseAction(state);
    }

    return null;
  };

  // 1つの行動を安全に実行し、成功したかを返す
  CpuAgent.prototype.executeAction = function (state, action) {
    if (!action) return false;

    try {
      if (action.type === 'RESOLVE_TERRITORY_SELECTION') {
        global.resolveTerritoryDrawSelection(state, this.playerId, action.instanceId);
        return true;
      }
      if (action.type === 'RESOLVE_TERRITORY_CHOICE') {
        global.resolvePendingTerritoryChoice(state, action.choice);
        return true;
      }
      if (action.type === 'RESOLVE_DISCARD_INSECT_SELECTION') {
        global.resolveDiscardInsectSelection(state, this.playerId, action.instanceId);
        return true;
      }
      if (action.type === 'RESOLVE_SPELL_TARGET_SELECTION') {
        global.resolveSpellTargetSelection(state, this.playerId, action.instanceId);
        return true;
      }
      if (action.type === 'ENTER_SET_PHASE') {
        global.enterSetPhase(state);
        return true;
      }
      if (action.type === 'SET_FOOD') {
        global.setFood(state, this.playerId, action.instanceId);
        return true;
      }
      if (action.type === 'ENTER_MAIN_PHASE') {
        global.enterMainPhase(state);
        return true;
      }
      if (action.type === 'SUMMON') {
        global.summonInsect(state, this.playerId, action.instanceId);
        return true;
      }
      if (action.type === 'USE_SPELL') {
        global.useSpell(state, this.playerId, action.instanceId, action.targetInstanceId);
        return true;
      }
      if (action.type === 'USE_ENHANCEMENT') {
        global.useEnhancement(state, this.playerId, action.instanceId, action.targetInstanceId);
        return true;
      }
      if (action.type === 'ATTACK') {
        global.performAttack(state, action.attackerInstanceId, action.targetInstanceId, action.targetType, action.skillId, action.chosenSacrificeInstanceId);
        return true;
      }
      if (action.type === 'END_TURN') {
        global.endTurn(state);
        return true;
      }
    } catch (err) {
      console.warn('CPU action failed:', action.type, err.message);
      return false;
    }

    return false;
  };

  global.CpuAgent = CpuAgent;
})(typeof window !== 'undefined' ? window : globalThis);
