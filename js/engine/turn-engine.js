(function (global) {
  'use strict';

  // ターンの進行を管理するドライバ。
  // ゲーム開始から各フェイズへの遷移を、battle-engine の基本操作を呼び出して行う。
  //
  // フェイズオーナー方式: TURN_START / DRAW_PHASE / SET_PHASE は自動遷移せず、
  // 現在フェイズに応じた操作(ドロー判定・エサセット・メインフェイズ開始)を
  // 明示的に呼び出すことで進行する。

  function TurnEngine(state) {
    this.state = state;
  }

  // ターン開始。ドロー判定を含む(beginTurn)。
  TurnEngine.prototype.startTurn = function () {
    return beginTurn(this.state);
  };

  // セットフェイズへ。DRAW_PHASE 完了後、UI が呼ぶ。
  TurnEngine.prototype.enterSetPhase = function () {
    if (this.state.phase === Phases.GAME_OVER) {
      throw new Error('ゲームは終了しています');
    }
    if (this.state.phase !== Phases.DRAW_PHASE) {
      throw new Error('ドローフェイズからのみセットフェイズへ進めます');
    }
    this.state.phase = Phases.SET_PHASE;
    return this.state;
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
