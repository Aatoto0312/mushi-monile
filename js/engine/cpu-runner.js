(function (global) {
  'use strict';

  // CPUランナー: 非同期で CPU のターンを自動進行させる

  function CpuRunner(engine, ui, options) {
    this.engine = engine;
    this.ui = ui;
    this.cpuAgent = new global.CpuAgent('P2', options);
    this.isRunning = false;
    this.actionsThisTurn = 0;
    this.currentCpuTurn = -1;
    this.options = options || {};
    this.thinkDelay = this.options.thinkDelay || 300;
    this.maxActions = this.options.maxActionsPerTurn || 50;
    this.onActionLog = this.options.onActionLog || function () {};
  }

  // 1ターン分を非同期で自動実行
  CpuRunner.prototype.runTurn = function () {
    var self = this;
    return new Promise(function (resolve) {
      if (self.isRunning) { resolve(); return; }
      self.isRunning = true;
      self._runTurnStep(resolve);
    });
  };

  CpuRunner.prototype._runTurnStep = function (resolve) {
    var self = this;
    var state = self.engine.state;
    var pending = global.getPendingEffect(state);

    // CPUターン開始時だけカウンターをリセットする。
    // 各CPU行動後のrenderでリセットされることはない。
    if (state.activePlayerId === 'P2' && state.phase !== global.Phases.GAME_OVER &&
        self.currentCpuTurn !== state.turnNumber) {
      self.currentCpuTurn = state.turnNumber;
      self.actionsThisTurn = 0;
    }

    // P2 の pendingEffect があれば、人間(P1)のターン中でも自動解決する
    if (pending && pending.playerId === 'P2') {
      var pAction = self.cpuAgent.getPendingAction(state);
      if (pAction) {
        self.cpuAgent.executeAction(state, pAction);
        self.ui.render();
        self.actionsThisTurn++;
        setTimeout(function () { self._runTurnStep(resolve); }, 0);
        return;
      }
      // P2のpendingだが解決行動が得られない場合は停止する
      self.isRunning = false;
      resolve();
      return;
    }

    // 人間(P1)のpending中はCPUは完全停止する
    if (pending) {
      self.isRunning = false;
      resolve();
      return;
    }

    // CPUのターンでない(人間のターン)場合は停止する
    if (state.activePlayerId !== 'P2' || state.phase === global.Phases.GAME_OVER) {
      self.isRunning = false;
      resolve();
      return;
    }

    if (self.actionsThisTurn >= self.maxActions) {
      self.onActionLog('CPU: 行動上限到達、ターン終了処理へ');
      try {
        global.endTurn(state);
        self.ui.render();
      } catch (e) {
        self.onActionLog('CPU: ターン終了失敗: ' + e.message);
        // エラー時は強制状態遷移させず、安全に停止する
      }
      self.isRunning = false;
      resolve();
      return;
    }

    var action = self.cpuAgent.step(state);
    if (!action) {
      self.isRunning = false;
      resolve();
      return;
    }

    // 行動ログ
    var logMsg = self._formatActionLog(action);
    if (logMsg) { self.onActionLog(logMsg); }

    // 実行
    var executed = self.cpuAgent.executeAction(state, action);
    self.ui.render();

    if (!executed) {
      // 行動失敗時は次のアクションを試す (無限ループ防止)
      self.actionsThisTurn++;
      setTimeout(function () { self._runTurnStep(resolve); }, 0);
      return;
    }

    self.actionsThisTurn++;

    // 次のステップへ
    if (state.phase === global.Phases.GAME_OVER || state.activePlayerId !== 'P2' ||
        global.getPendingEffect(state)) {
      self.isRunning = false;
      resolve();
    } else {
      setTimeout(function () { self._runTurnStep(resolve); }, self.thinkDelay);
    }
  };

  CpuRunner.prototype._formatActionLog = function (action) {
    var def, targetDef;
    if (action.type === 'SET_FOOD') {
      def = global.getCardDefinition(global.findAnywhere(this.engine.state, action.instanceId).instance.cardId);
      return 'CPUは ' + (def ? def.name : 'カード') + ' をエサにした';
    }
    if (action.type === 'SUMMON') {
      def = global.getCardDefinition(global.findAnywhere(this.engine.state, action.instanceId).instance.cardId);
      return 'CPUは ' + (def ? def.name : '蟲') + ' を召喚した';
    }
    if (action.type === 'USE_SPELL') {
      def = global.getCardDefinition(global.findAnywhere(this.engine.state, action.instanceId).instance.cardId);
      return 'CPUは ' + (def ? def.name : '術') + ' を使った';
    }
    if (action.type === 'USE_ENHANCEMENT') {
      def = global.getCardDefinition(global.findAnywhere(this.engine.state, action.instanceId).instance.cardId);
      targetDef = global.getCardDefinition(global.findAnywhere(this.engine.state, action.targetInstanceId).instance.cardId);
      return 'CPUは ' + (def ? def.name : '強化') + ' を ' + (targetDef ? targetDef.name : '蟲') + ' に使った';
    }
    if (action.type === 'ATTACK') {
      var att = global.findAnywhere(this.engine.state, action.attackerInstanceId).instance;
      var atkDef = global.getCardDefinition(att.cardId);
      var tgtStr = action.targetType === 'LEADER' ? '相手本体' : '相手の ' + global.getCardDefinition(global.findAnywhere(this.engine.state, action.targetInstanceId).instance.cardId).name;
      return 'CPUは ' + (atkDef ? atkDef.name : '蟲') + ' で ' + tgtStr + ' を攻撃した';
    }
    if (action.type === 'RESOLVE_TERRITORY_SELECTION') {
      return 'CPUは縄張りから1枚を選択した';
    }
    if (action.type === 'RESOLVE_TERRITORY_CHOICE') {
      return 'CPUは <とびだす> 判定で ' + (action.choice === 'USE_TOBIDASU' ? '場へ出す' : '手札に加える') + ' を選択した';
    }
    if (action.type === 'END_TURN') {
      return 'CPUはターンを終了した';
    }
    return null;
  };

  CpuRunner.prototype.resetActionCounter = function () {
    this.actionsThisTurn = 0;
  };

  CpuRunner.prototype.start = function () {
    // カウンターのリセットは _runTurnStep 内のCPUターン開始検知に任せる。
    // 既に running の場合はカウンターをリセットしない。
    var self = this;
    return self.runTurn();
  };

  global.CpuRunner = CpuRunner;
})(typeof window !== 'undefined' ? window : globalThis);