'use strict';

// テスト用ヘルパー。エンジンの内部状態へ直接アクセスしてシナリオを用意する。

// 決定的rng: 常に0を返す → P1が先攻
function firstPlayerRng() {
  return 0.0;
}

// 0.9を返す → P2が先攻
function secondPlayerRng() {
  return 0.9;
}

function newGame(opts) {
  opts = opts || {};
  var deck = global.buildStarterTestDeck();
  var state = new global.GameState();
  global.startGame(state, deck, deck.slice(), opts.rng);
  return state;
}

function defById(id) {
  return global.getCardDefinition(id);
}

function firstHandInstance(state, playerId, cardId) {
  var player = state.player(playerId);
  for (var i = 0; i < player.hand.length; i++) {
    if (player.hand[i].cardId === cardId) {
      return player.hand[i];
    }
  }
  return null;
}

// 手札の最初の虫カードを取得
function firstHandInsect(state, playerId) {
  var player = state.player(playerId);
  for (var i = 0; i < player.hand.length; i++) {
    var def = global.getCardDefinition(player.hand[i].cardId);
    if (def && def.type === global.CardTypes.INSECT) {
      return player.hand[i];
    }
  }
  return null;
}

function addToHandRaw(state, playerId, cardDef) {
  var player = state.player(playerId);
  var inst = new global.CardInstance({
    instanceId: state.nextInstanceId(),
    cardId: cardDef.id,
    ownerId: playerId,
    zone: global.ZONES.HAND,
    currentHp: cardDef.baseHp,
    baseHp: cardDef.baseHp
  });
  player.hand.push(inst);
  return inst;
}

// 場へ直接配置(テスト用)
function putInsectOnField(state, playerId, cardId, opts) {
  opts = opts || {};
  var def = global.getCardDefinition(cardId);
  var inst = new global.CardInstance({
    instanceId: state.nextInstanceId(),
    cardId: def.id,
    ownerId: playerId,
    controllerId: playerId,
    zone: global.ZONES.FIELD,
    currentHp: opts.hp != null ? opts.hp : def.baseHp,
    baseHp: def.baseHp,
    attackedThisTurn: false
  });
  state.player(playerId).field.push(inst);
  return inst;
}

function addToFoodRaw(state, playerId, cardDef) {
  var player = state.player(playerId);
  var inst = new global.CardInstance({
    instanceId: state.nextInstanceId(),
    cardId: cardDef.id,
    ownerId: playerId,
    zone: global.ZONES.FOOD,
    faceDown: false,
    currentHp: cardDef.baseHp,
    baseHp: cardDef.baseHp
  });
  player.food.push(inst);
  return inst;
}

function setTerritoryEmpty(state, playerId) {
  state.player(playerId).territory = [];
}

function addToTerritoryRaw(state, playerId, cardDef) {
  var player = state.player(playerId);
  var inst = new global.CardInstance({
    instanceId: state.nextInstanceId(),
    cardId: cardDef.id,
    ownerId: playerId,
    zone: global.ZONES.TERRITORY,
    faceDown: true,
    currentHp: cardDef.baseHp,
    baseHp: cardDef.baseHp
  });
  // テスト用: 先頭に追加してすぐ引けるようにする
  player.territory.unshift(inst);
  return inst;
}

function toSetPhase(state) {
  global.beginTurn(state);
  if (state.phase !== global.Phases.GAME_OVER) {
    state.phase = global.Phases.SET_PHASE;
  }
  return state;
}

function toMainPhase(state) {
  toSetPhase(state);
  if (state.phase !== global.Phases.GAME_OVER) {
    global.enterMainPhase(state);
  }
  return state;
}

// 次の自分のターンのメインフェイズまで進める（ターン進行の完全シミュレート）
// 現在フェイズの如何を問わず、指定プレイヤーの次のメインフェイズへ遷移させる。
// endTurn は MAIN_PHASE でのみ呼べるため、各フェイズを明示的に通り抜ける。
function passFullTurnRefresh(state, playerId) {
  // 現在アクティブプレイヤーが MAIN_PHASE になるまで進める
  var ap = state.activePlayerId;
  if (state.phase === global.Phases.DRAW_PHASE) {
    global.enterSetPhase(state);
  }
  if (state.phase === global.Phases.SET_PHASE) {
    if (state.player(ap).hand.length > 0) {
      global.setFood(state, ap, state.player(ap).hand[0].instanceId);
    }
    global.enterMainPhase(state);
  }
  if (state.phase === global.Phases.TURN_START) {
    global.beginTurn(state);
  }
  if (state.phase !== global.Phases.MAIN_PHASE) {
    throw new Error('passFullTurnRefresh: メインフェイズへ進めない phase=' + state.phase);
  }
  // アクティブプレイヤーのターンを終了（相手の DRAW_PHASE へ）
  global.endTurn(state);
  // 相手を MAIN_PHASE まで進めてから終了する
  var nextAp = state.activePlayerId;
  if (state.phase === global.Phases.DRAW_PHASE) {
    global.enterSetPhase(state);
  }
  if (state.phase === global.Phases.SET_PHASE) {
    if (state.player(nextAp).hand.length > 0) {
      global.setFood(state, nextAp, state.player(nextAp).hand[0].instanceId);
    }
    global.enterMainPhase(state);
  }
  if (state.phase === global.Phases.TURN_START) {
    global.beginTurn(state);
  }
  if (state.phase !== global.Phases.MAIN_PHASE) {
    throw new Error('passFullTurnRefresh: 相手をメインフェイズへ進めない phase=' + state.phase);
  }
  // 相手のターン終了 → 自分の DRAW_PHASE
  global.endTurn(state);
  // 自分を MAIN_PHASE まで進める
  var myAp = state.activePlayerId;
  if (state.phase === global.Phases.TURN_START) {
    global.beginTurn(state);
  }
  if (state.phase === global.Phases.DRAW_PHASE) {
    global.enterSetPhase(state);
  }
  if (state.phase === global.Phases.SET_PHASE) {
    if (state.player(myAp).hand.length > 0) {
      global.setFood(state, myAp, state.player(myAp).hand[0].instanceId);
    }
    global.enterMainPhase(state);
  }
  return state;
}

// 指定コスト分のエサを追加してメインフェイズでコストを獲得させる
function ensureCost(state, playerId, cost) {
  var player = state.player(playerId);
  var needed = cost - player.availableCost;
  if (needed > 0) {
    for (var i = 0; i < needed; i++) {
      addToFoodRaw(state, playerId, defById('test_red_1'));
    }
    // メインフェイズ再実行でコスト再計算（簡易版：直接加算）
    player.availableCost += needed;
  }
  return state;
}

module.exports = {
  firstPlayerRng: firstPlayerRng,
  secondPlayerRng: secondPlayerRng,
  newGame: newGame,
  defById: defById,
  firstHandInstance: firstHandInstance,
  firstHandInsect: firstHandInsect,
  addToHandRaw: addToHandRaw,
  putInsectOnField: putInsectOnField,
  addToFoodRaw: addToFoodRaw,
  addToTerritoryRaw: addToTerritoryRaw,
  setTerritoryEmpty: setTerritoryEmpty,
  toSetPhase: toSetPhase,
  toMainPhase: toMainPhase,
  passFullTurnRefresh: passFullTurnRefresh,
  ensureCost: ensureCost,
  onEndTurn: global.endTurn
};
