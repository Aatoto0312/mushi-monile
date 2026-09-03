(function (global) {
  'use strict';

  // ターンの進行を管理するドライバ。
  // ゲーム開始から各フェイズへの遷移を、battle-engine の基本操作を呼び出して行う。
  //
  // フェイズオーナー方式: ドロー不要/完了時のSET遷移はbattle-engineが行い、
  // SET以降は現在フェイズに応じた操作で明示的に進行する。

  function TurnEngine(state) {
    this.state = state;
  }

  // ターン開始。ドロー判定を含む(beginTurn)。
  TurnEngine.prototype.startTurn = function () {
    return beginTurn(this.state);
  };

  // セットフェイズへ。互換呼び出し用（自動遷移済みなら冪等）。
  TurnEngine.prototype.enterSetPhase = function () {
    return enterSetPhase(this.state);
  };

  // SET_PHASE でエサをセット。
  TurnEngine.prototype.setFood = function (playerId, handInstanceId) {
    return setFood(this.state, playerId, handInstanceId);
  };

  // メインフェイズ開始。コスト獲得。
  TurnEngine.prototype.enterMainPhase = function () {
    return enterMainPhase(this.state);
  };

  TurnEngine.prototype.isInMainPhase = function () {
    return this.state.phase === Phases.MAIN_PHASE;
  };

  TurnEngine.prototype.isInTurn = function () {
    return this.state.phase !== Phases.GAME_OVER;
  };

  // ターン終了 & 次ターン開始
  TurnEngine.prototype.endTurn = function () {
    return endTurn(this.state);
  };

  global.TurnEngine = TurnEngine;
})(typeof window !== 'undefined' ? window : globalThis);
