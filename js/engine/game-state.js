(function (global) {
  'use strict';

  var PHASES = {
    TURN_START: 'TURN_START',
    DRAW_PHASE: 'DRAW_PHASE',
    SET_PHASE: 'SET_PHASE',
    MAIN_PHASE: 'MAIN_PHASE',
    TURN_END: 'TURN_END',
    GAME_OVER: 'GAME_OVER'
  };

  function createPlayerZoneSet(ownerId, controllerId) {
    return {
      ownerId: ownerId,
      controllerId: controllerId == null ? ownerId : controllerId,
      deck: [],
      hand: [],
      territory: [],
      food: [],
      field: [],
      discard: [],
      resolving: [],
      availableCost: 0,
      foodSetThisTurn: 0
    };
  }

  function GameState() {
    this.turnNumber = 1;
    this.firstPlayerId = null;
    this.activePlayerId = null;
    this.phase = PHASES.TURN_START;
    this.players = {};
    this.playerOrder = [];
    this.pendingEffect = null;
    this.battleLog = [];
    // UI・ログ・将来のリプレイが同じ事実を参照できる軽量イベント列。
    // UIはイベントを削除せず、idカーソルで未表示分だけを読む。
    this.battleEvents = [];
    this._battleEventCounter = 0;
    this.winner = null;
    this._instanceCounter = 0;
    // ドロー制御: manualDrawPlayers に含まれるプレイヤーは
    // ターン開始ドローを自動ではなくUI操作(手動)で行う。
    // null = 全員自動。drewThisTurn はそのプレイヤーのターンで
    // ドローが完了したかを表す(先攻1ターン目の未ドローも含む)。
    this.manualDrawPlayers = null;
    this.drewThisTurn = false;
  }

  GameState.PHASES = PHASES;

  GameState.prototype.player = function (playerId) {
    return this.players[playerId];
  };

  GameState.prototype.opponentOf = function (playerId) {
    if (this.playerOrder.length < 2) { return null; }
    return this.playerOrder[0] === playerId ? this.playerOrder[1] : this.playerOrder[0];
  };

  GameState.prototype.nextInstanceId = function () {
    this._instanceCounter += 1;
    return 'inst_' + this._instanceCounter;
  };

  GameState.prototype.other = GameState.prototype.opponentOf;

  global.Phases = PHASES;
  global.GameState = GameState;
  global.createPlayerZoneSet = createPlayerZoneSet;
})(typeof window !== 'undefined' ? window : globalThis);
