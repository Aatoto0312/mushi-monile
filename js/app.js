(function (global) {
  'use strict';

  // 起動処理。スクリプト読み込み順(array)に応じてエンジンとUIを接続する。
  function boot() {
    var engine = new GameEngine();
    var ui = new BattleUI(engine);
    ui.attach();
    // 初期描画
    ui.newGame();
    global.MushiBattle = {
      engine: engine,
      ui: ui
    };
  }

  if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
