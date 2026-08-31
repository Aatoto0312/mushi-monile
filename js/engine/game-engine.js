(function (global) {
  'use strict';

  // エンジン全体のファサード。UI やテストはこれを介して操作する。
  // 実際のロジックは battle-engine / turn-engine / zone-engine に分離。
  function GameEngine() {
    this.state = new GameState();
    this.turn = new TurnEngine(this.state);
  }

  GameEngine.prototype.newGame = function (p1Defs, p2Defs, opts) {
    opts = opts || {};
    this.state = new GameState();
    this.turn = new TurnEngine(this.state);
    startGame(this.state, p1Defs, p2Defs, opts.rng);
    return this.state;
  };

  GameEngine.prototype.getState = function () {
    return this.state;
  };

  // アクティブプレイヤー
  GameEngine.prototype.activePlayerId = function () {
    return this.state.activePlayerId;
  };

  // デッキ構築用ヘルパー: デッキ定義配列から <def> の参照リストを受け取る
  GameEngine.prototype.buildTestDeck = function () {
    return buildStarterTestDeck();
  };

  // デバッグ/テスト用: 任意にデッキを組む
  GameEngine.prototype.buildDeckFromDefinitions = function (defs) {
    // defs は CardDefinition の配列。そのまま複製せず使用。
    var deck = [];
    defs.forEach(function (d) { deck.push(d); });
    return deck;
  };

  global.GameEngine = GameEngine;
})(typeof window !== 'undefined' ? window : globalThis);
