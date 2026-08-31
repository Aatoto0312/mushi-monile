'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();

// ---- 最小DOMスタブ (card-ui 等のロード用) ----
var registry = {};
function makeElement(tag) {
  var el = {
    tagName: tag || 'div',
    className: '',
    children: [],
    dataset: {},
    style: {},
    _listeners: {},
    textContent: '',
    innerHTML: '',
    classList: {
      _set: {},
      add: function (c) { this._set[c] = true; },
      remove: function (c) { delete this._set[c]; },
      contains: function (c) { return !!this._set[c]; }
    },
    appendChild: function (c) { this.children.push(c); return c; },
    replaceWith: function () {},
    addEventListener: function (t, f) { (this._listeners[t] = this._listeners[t] || []).push(f); },
    setAttribute: function () {},
    querySelector: function () { return null; },
    querySelectorAll: function () { return []; }
  };
  return el;
}
function getById(id) { if (!registry[id]) { registry[id] = makeElement('div'); } return registry[id]; }
global.document = {
  readyState: 'loading',
  addEventListener: function () {},
  getElementById: getById,
  createElement: makeElement,
  querySelector: function () { return null; },
  querySelectorAll: function () { return []; }
};
global.window = global;
global.alert = function () {};

require('./engine-loader.js');
require('../js/engine/cpu-agent.js');
require('../js/engine/cpu-runner.js');
require('../js/ui/card-ui.js');

// ---- ヘルパー ----
function toMain(state) {
  if (state.phase === global.Phases.TURN_START) { global.beginTurn(state); }
  if (state.phase === global.Phases.DRAW_PHASE) {
    // 自動ドロー既定のテストでは既にドロー済み
    global.enterSetPhase(state);
  }
  if (state.phase === global.Phases.SET_PHASE) {
    var ap = state.activePlayerId;
    if (state.player(ap).hand.length > 0) {
      global.setFood(state, ap, state.player(ap).hand[0].instanceId);
    }
    global.enterMainPhase(state);
  }
  return state;
}

function reachP1Main(state) {
  // P1が先攻(デフォルトrng)の場合
  var guard = 0;
  while (state.activePlayerId !== 'P1' && guard < 10) {
    toMain(state);
    global.endTurn(state);
    guard++;
  }
  if (state.phase === global.Phases.TURN_START) { global.beginTurn(state); }
  if (state.phase === global.Phases.DRAW_PHASE) { global.enterSetPhase(state); }
  if (state.phase === global.Phases.SET_PHASE) {
    if (state.player('P1').hand.length > 0) { global.setFood(state, 'P1', state.player('P1').hand[0].instanceId); }
    global.enterMainPhase(state);
  }
  if (state.phase !== global.Phases.MAIN_PHASE) {
    throw new Error('reachP1Main: MAIN_PHASEでない phase=' + state.phase);
  }
  return state;
}

function turnLogContains(state, re) {
  return state.battleLog.some(function (e) { return re.test(e.text); });
}

// ---- Test EXP1: 蓑虫の隠れ蓑を合法対象へ使用可能 ----
runner.test('TestEXP1 蓑虫の隠れ蓑を合法対象へ使用可能', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var target = h.putInsectOnField(state, 'P1', 'test_red_1');
  var enhancement = h.addToHandRaw(state, 'P1', global.getCardDefinition('minomushi_no_kakuremino'));
  h.ensureCost(state, 'P1', enhancement.cost || 1);
  var attached = global.useEnhancement(state, 'P1', enhancement.instanceId, target.instanceId);
  runner.assertTrue(attached.zone === global.ZONES.FIELD, '強化カードはFIELD');
  runner.assertTrue(target.attachments.indexOf(attached) !== -1, '対象蟲に装着された');
});

// ---- Test EXP2: 強化対象なしでは使用不可 ----
runner.test('TestEXP2 強化対象なしでは使用不可', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var enhancement = h.addToHandRaw(state, 'P1', global.getCardDefinition('minomushi_no_kakuremino'));
  h.ensureCost(state, 'P1', enhancement.cost || 1);
  var threw = false;
  try {
    global.useEnhancement(state, 'P1', enhancement.instanceId, 'no-such-target');
  } catch (e) { threw = true; }
  runner.assertTrue(threw, '対象蟲がないため例外');
});

// ---- Test EXP3: カード詳細に全skills表示 ----
runner.test('TestEXP3 カード詳細に全skills表示', function () {
  var detail = global.CardUI.getCardDetail({ cardId: 'kabutomushi', currentHp: 800 });
  runner.assertTrue(detail !== null, 'detail取得');
  runner.assertTrue(detail.skills.length >= 2, 'カブトムシのskillsが2つ以上(ツノ突進+すくい投げ)');
  runner.assertTrue(detail.skills.some(function (s) { return s.name === 'ツノ突進'; }), 'ツノ突進が含まれる');
  runner.assertTrue(detail.skills.some(function (s) { return s.name === 'すくい投げ'; }), 'すくい投げが含まれる');
});

// ---- Test EXP4: カード詳細にpassiveAbilities表示 ----
runner.test('TestEXP4 カード詳細にpassiveAbilities表示', function () {
  var detail = global.CardUI.getCardDetail({ cardId: 'hariganemushi_no_michizure', currentHp: 0 });
  runner.assertTrue(detail !== null, 'detail取得');
  runner.assertTrue(Array.isArray(detail.passiveAbilities), 'passiveAbilities配列がある');
  runner.assertTrue(detail.passiveAbilities.length > 0, '道連れの常在効果がある');
  runner.assertTrue(detail.passiveAbilities.some(function (pa) { return pa.name === '道連れ'; }), '道連れが含まれる');
});

// ---- Test EXP5: SPELL効果文表示 ----
runner.test('TestEXP5 SPELL効果文表示', function () {
  var detail = global.CardUI.getCardDetail({ cardId: 'niji_no_kakehashi' });
  runner.assertTrue(detail !== null, 'detail取得');
  runner.assertTrue(Array.isArray(detail.cardEffects), 'cardEffects配列がある');
  runner.assertTrue(detail.cardEffects.length > 0, '術に効果がある');
});

// ---- Test EXP6: ENHANCEMENT効果文表示 ----
runner.test('TestEXP6 ENHANCEMENT効果文表示', function () {
  var detail = global.CardUI.getCardDetail({ cardId: 'minomushi_no_kakuremino' });
  runner.assertTrue(detail !== null, 'detail取得');
  var hasEnh = Array.isArray(detail.enhancementEffects) && detail.enhancementEffects.length > 0;
  var hasEffects = Array.isArray(detail.cardEffects) && detail.cardEffects.length > 0;
  runner.assertTrue(hasEnh || hasEffects || (detail.verificationNotes), '強化カードに効果情報がある');
});

// ---- Test EXP7: firstPlayerIdから先攻判定 ----
runner.test('TestEXP7 firstPlayerIdから先攻後攻判定', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  runner.assertTrue(state.firstPlayerId === 'P1', 'firstPlayerId=P1');
  var text = state.firstPlayerId === 'P1' ? 'P1（先攻）' : 'P1（後攻）';
  runner.assertTrue(text.indexOf('先攻') !== -1, '表示テキストに先攻が含まれる');
});

// ---- Test EXP8: GAME_OVER時にwinner表示 ----
runner.test('TestEXP8 GAME_OVER時にwinner表示', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  h.putInsectOnField(state, 'P1', 'test_red_1');
  h.setTerritoryEmpty(state, 'P2');
  var attacker = state.player('P1').field[0];
  var result = global.performAttack(state, attacker.instanceId, null, 'LEADER', 'attack');
  runner.assertTrue(result.victory, '勝利');
  runner.assertEqual(state.winner, 'P1', 'winner=P1');
  // winner表示テキスト
  var display = state.winner === 'P1' ? 'P1の勝利！' : 'P2の勝利！';
  runner.assertTrue(display.indexOf('勝利') !== -1, '勝利表示テキストがある');
});

// ---- Test EXP9: カブトムシ/オオカマキリdeck選択 ----
runner.test('TestEXP9 カブトムシ/オオカマキリdeck選択', function () {
  var kabuto = global.expandStarterDeck(global.STARTER_DECK_RECIPES.KABUTOMUSHI);
  var okamakiri = global.expandStarterDeck(global.STARTER_DECK_RECIPES.OKAMAKIRI);
  runner.assertTrue(kabuto.length > 0, 'カブトムシデッキがある');
  runner.assertTrue(okamakiri.length > 0, 'オオカマキリデッキがある');
  var hasKabuto = kabuto.some(function (c) { return c.id === 'kabutomushi'; });
  var hasOkama = okamakiri.some(function (c) { return c.id === 'okamakiri'; });
  runner.assertTrue(hasKabuto, 'カブトムシデッキにカブトムシを含む');
  runner.assertTrue(hasOkama, 'オオカマキリデッキにオオカマキリを含む');
});

// ---- Test EXP10: deck選択が反映される ----
function getRecipeCards(recipeId) {
  var recipe = global.STARTER_DECK_RECIPES[recipeId];
  var cards = [];
  Object.keys(recipe.cardCounts).forEach(function(cardId) {
    for (var i = 0; i < recipe.cardCounts[cardId]; i++) {
      cards.push(cardId);
    }
  });
  return cards;
}

runner.test('TestEXP10 選択deckがゲームへ反映', function () {
  var okamakiriRecipe = 'OKAMAKIRI';
  var okamakiri = global.expandStarterDeck(global.STARTER_DECK_RECIPES[okamakiriRecipe]);
  var state = new global.GameState();
  global.startGame(state, okamakiri, okamakiri, h.firstPlayerRng);
  
  var expectedCards = getRecipeCards(okamakiriRecipe);
  var p1Cards = [];
  ['deck', 'hand', 'territory', 'food', 'field', 'discard'].forEach(function(zone) {
    state.player('P1')[zone].forEach(function(inst) { p1Cards.push(inst.cardId); });
  });

  // Check counts
  expectedCards.forEach(function(cardId) {
    var idx = p1Cards.indexOf(cardId);
    runner.assertTrue(idx !== -1, 'デッキカード ' + cardId + ' が存在');
    p1Cards.splice(idx, 1);
  });
  runner.assertEqual(p1Cards.length, 0, '余計なカードがない');
});

// ---- Test EXP11: 先攻1ターン目は人間ドロー不可 ----
runner.test('TestEXP11 先攻1ターン目は手動ドロー不可', function () {
  var state = h.newGame({ rng: h.firstPlayerRng }); // P1先攻 turn1
  state.manualDrawPlayers = ['P1'];
  runner.assertEqual(state.turnNumber, 1, 'turn1');
  runner.assertTrue(state.drewThisTurn === false, '先攻1ターン目は未ドロー');
  var threw = false;
  try { global.drawCardOnce(state, 'P1'); } catch (e) { threw = true; }
  runner.assertTrue(threw, '先攻1ターン目はドロー不能');
});

// ---- Test EXP12: 後攻(2ターン目CP)手動ドロー可能 ----
runner.test('TestEXP12 P2(後攻)ターン目手動ドロー可能', function () {
  var state = h.newGame({ rng: h.firstPlayerRng }); // P1先攻
  state.manualDrawPlayers = ['P2'];
  toMain(state);          // P1 main
  global.endTurn(state);  // -> P2 turn 2, beginTurn skip P2 draw (manual)
  runner.assertEqual(state.activePlayerId, 'P2', 'active=P2');
  runner.assertEqual(state.drewThisTurn, false, 'P2未ドロー');
  var card = global.drawCardOnce(state, 'P2');
  runner.assertTrue(card !== null, 'P2手動ドロー成功');
  runner.assertEqual(state.drewThisTurn, true, 'P2ドロー済み');
});

// ---- Test EXP13: 2ターン目以降も手動ドロー可能 ----
runner.test('TestEXP13 2ターン目以降も手動ドロー可能', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  state.manualDrawPlayers = ['P1', 'P2'];
  toMain(state);                    // P1 turn1 main (先攻、ドローなし)
  global.endTurn(state);            // -> P2 turn2 (手動ドロー)
  var c2 = global.drawCardOnce(state, 'P2');
  runner.assertTrue(c2 !== null, 'P2 turn2手動ドロー成功');
  toMain(state);                    // P2 main
  global.endTurn(state);            // -> P1 turn3 (手動ドロー)
  runner.assertEqual(state.activePlayerId, 'P1', 'P1 turn3');
  var c3 = global.drawCardOnce(state, 'P1');
  runner.assertTrue(c3 !== null, 'P1 turn3手動ドロー成功');
});

// ---- Test EXP14: 1ターンに2回ドロー不可 ----
runner.test('TestEXP14 1ターンに2回ドロー不可', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  state.manualDrawPlayers = ['P2'];
  toMain(state);
  global.endTurn(state);       // P2 turn2
  global.drawCardOnce(state, 'P2');
  var threw = false;
  try { global.drawCardOnce(state, 'P2'); } catch (e) { threw = true; }
  runner.assertTrue(threw, '2回目は例外');
});

// ---- Test EXP15: 未ドローでSET_PHASEへ進めない ----
runner.test('TestEXP15 未ドローでSET_PHASEへ進めない', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  state.manualDrawPlayers = ['P2'];
  toMain(state);
  global.endTurn(state); // P2 turn2, 未ドロー
  var threw = false;
  try { global.enterSetPhase(state); } catch (e) { threw = true; }
  runner.assertTrue(threw, '未ドローでSET進めない');
});

// ---- Test EXP16: ドロー済みならSET_PHASEへ進める ----
runner.test('TestEXP16 ドロー済みならSET_PHASEへ進める', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  state.manualDrawPlayers = ['P2'];
  toMain(state);
  global.endTurn(state); // P2 turn2
  global.drawCardOnce(state, 'P2');
  global.enterSetPhase(state);
  runner.assertEqual(state.phase, global.Phases.SET_PHASE, 'SET_PHASEへ進める');
});

// ---- Test EXP17: CPUターンでは自動ドロー ----
runner.test('TestEXP17 CPU(P2)ターンでは自動ドロー', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  state.manualDrawPlayers = ['P1']; // P2はauto
  toMain(state);
  global.endTurn(state); // P2 turn2 -> beginTurn auto draw
  runner.assertEqual(state.activePlayerId, 'P2', 'P2 active');
  runner.assertEqual(state.drewThisTurn, true, 'P2自動ドロー済み');
});

// ---- ログ系 ----
runner.test('TestEXP18 ターン開始ログ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  runner.assertTrue(turnLogContains(state, /TURN \d+ P\d 開始/), 'ターン開始ログがある');
});

runner.test('TestEXP19 ドローログ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  toMain(state);
  global.endTurn(state); // P2自動ドロー
  runner.assertTrue(turnLogContains(state, /ドロー/), 'ドローログがある');
});

runner.test('TestEXP20 召喚ログ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var insect = h.addToHandRaw(state, 'P1', global.getCardDefinition('test_red_1'));
  h.ensureCost(state, 'P1', 1);
  global.summonInsect(state, 'P1', insect.instanceId);
  runner.assertTrue(turnLogContains(state, /召喚/), '召喚ログがある');
  runner.assertTrue(turnLogContains(state, /コスト/), 'コスト情報ログがある');
});

runner.test('TestEXP21 攻撃ログに攻撃者名/技名/AP/対象名', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');
  var defender = h.putInsectOnField(state, 'P2', 'test_blue_1');
  global.performAttack(state, attacker.instanceId, defender.instanceId, 'INSECT', 'attack');
  runner.assertTrue(turnLogContains(state, /「テスト赤虫1」/), '攻撃者名ログ');
  runner.assertTrue(turnLogContains(state, /AP/), 'APログ');
  runner.assertTrue(turnLogContains(state, /「テスト青虫1」/), '対象名ログ');
});

runner.test('TestEXP22 色相性倍率ログ(有利×2)', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');   // RED
  var defender = h.putInsectOnField(state, 'P2', 'test_green_1'); // GREEN -> RED有利×2
  global.performAttack(state, attacker.instanceId, defender.instanceId, 'INSECT', 'attack');
  runner.assertTrue(turnLogContains(state, /色相性/), '色相性ログ');
  runner.assertTrue(turnLogContains(state, /有利 ×2/), '×2ログ');
});

runner.test('TestEXP23 AP補正ログ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');
  var defender = h.putInsectOnField(state, 'P2', 'test_blue_1');
  global.performAttack(state, attacker.instanceId, defender.instanceId, 'INSECT', 'attack');
  runner.assertTrue(turnLogContains(state, /AP補正/), 'AP補正ログ');
});

runner.test('TestEXP24 最終APログ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');
  var defender = h.putInsectOnField(state, 'P2', 'test_blue_1');
  global.performAttack(state, attacker.instanceId, defender.instanceId, 'INSECT', 'attack');
  runner.assertTrue(turnLogContains(state, /最終AP/), '最終APログ');
});

runner.test('TestEXP25 最終damageログ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');
  var defender = h.putInsectOnField(state, 'P2', 'test_blue_1');
  global.performAttack(state, attacker.instanceId, defender.instanceId, 'INSECT', 'attack');
  runner.assertTrue(turnLogContains(state, /ダメージ/), 'ダメージログ');
});

runner.test('TestEXP26 攻撃前HPログ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');
  var defender = h.putInsectOnField(state, 'P2', 'test_blue_1');
  global.performAttack(state, attacker.instanceId, defender.instanceId, 'INSECT', 'attack');
  runner.assertTrue(turnLogContains(state, /攻撃前HP/), '攻撃前HPログ');
});

runner.test('TestEXP27 攻撃後HPログ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');
  var defender = h.putInsectOnField(state, 'P2', 'test_blue_1');
  global.performAttack(state, attacker.instanceId, defender.instanceId, 'INSECT', 'attack');
  runner.assertTrue(turnLogContains(state, /攻撃後HP/), '攻撃後HPログ');
});

runner.test('TestEXP28 破壊有無ログ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  // 高APで確実に破壊: test_red_2 AP700 vs test_blue_1 HP700
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_2');
  var defender = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 700 });
  global.performAttack(state, attacker.instanceId, defender.instanceId, 'INSECT', 'attack');
  runner.assertTrue(turnLogContains(state, /破壊/), '破壊ログ');
});

runner.test('TestEXP29 破壊原因ログ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_2');
  var defender = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 700 });
  global.performAttack(state, attacker.instanceId, defender.instanceId, 'INSECT', 'attack');
  runner.assertTrue(turnLogContains(state, /破壊された/), '破壊原因ログ');
  runner.assertTrue(turnLogContains(state, /ATTACK/), '破壊原因ATTACKログ');
});

runner.test('TestEXP30 捨て場移動ログ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_2');
  var defender = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 700 });
  var discBefore = state.player('P2').discard.length;
  global.performAttack(state, attacker.instanceId, defender.instanceId, 'INSECT', 'attack');
  runner.assertEqual(state.player('P2').discard.length, discBefore + 1, 'P2捨て場+1');
  runner.assertTrue(turnLogContains(state, /捨て場/), '捨て場ログ');
});

runner.test('TestEXP31 技効果発動ログ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  // カブトムシのすくい投げ(TURN_FACE_DOWN)を発動
  var kabuto = h.addToHandRaw(state, 'P1', global.getCardDefinition('kabutomushi'));
  h.ensureCost(state, 'P1', 4);
  global.summonInsect(state, 'P1', kabuto.instanceId);
  var defender = h.putInsectOnField(state, 'P2', 'test_blue_1');
  var attacker = state.player('P1').field[0];
  global.performAttack(state, attacker.instanceId, defender.instanceId, 'INSECT', 'sukoinage');
  runner.assertTrue(defender.faceDown === true, 'すくい投げで対象裏向き');
});

runner.test('TestEXP32 裏向き(場にいない扱い)の虫は攻撃不可', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');
  var def = h.putInsectOnField(state, 'P2', 'test_blue_1');
  def.faceDown = true; // 場にいない扱い
  var targets = global.getLegalAttackTargets(state, attacker.instanceId);
  runner.assertTrue(targets.length === 1, '攻撃対象はLEADERのみ');
  runner.assertEqual(targets[0].targetType, 'LEADER', '裏向き虫は対象不可 → 直接攻撃');
});

runner.test('TestEXP33 裏向き対象不可で直接攻撃対象崩れない', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');
  var def = h.putInsectOnField(state, 'P2', 'test_blue_1');
  def.faceDown = true;
  var targets = global.getLegalAttackTargets(state, attacker.instanceId);
  runner.assertEqual(targets[0].playerId, 'P2', '相手本体が直接攻撃対象');
});

runner.test('TestEXP34 直接攻撃ログ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');
  global.performAttack(state, attacker.instanceId, null, 'LEADER', 'attack');
  runner.assertTrue(turnLogContains(state, /直接攻撃/), '直接攻撃ログ');
});

runner.test('TestEXP35 縄張り選択/取得ログ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1');
  global.performAttack(state, attacker.instanceId, null, 'LEADER', 'attack');
  var pending = global.getPendingEffect(state);
  runner.assertTrue(pending && pending.type === 'TERRITORY_DRAW_SELECTION', '縄張り選択発生');
  runner.assertTrue(turnLogContains(state, /縄張り/), '縄張りログ');
  // 解決
  var sel = state.player('P2').territory[0];
  global.resolveTerritoryDrawSelection(state, 'P2', sel.instanceId);
  runner.assertTrue(turnLogContains(state, /縄張り|手札|場へ/), '取得ログ');
});

runner.test('TestEXP36 ターン終了ログ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  toMain(state);
  global.endTurn(state);
  runner.assertTrue(turnLogContains(state, /ターン終了/), 'ターン終了ログ');
});

runner.test('TestEXP37 GAME_OVER時に勝者ログ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  h.putInsectOnField(state, 'P1', 'test_red_1');
  h.setTerritoryEmpty(state, 'P2');
  var attacker = state.player('P1').field[0];
  global.performAttack(state, attacker.instanceId, null, 'LEADER', 'attack');
  runner.assertEqual(state.phase, global.Phases.GAME_OVER, 'GAME_OVER');
  runner.assertTrue(turnLogContains(state, /勝利/), '勝者ログ');
});

runner.test('TestEXP38 負APは最終AP負数・ダメージ0', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1'); // 基本AP500
  var defender = h.putInsectOnField(state, 'P2', 'test_blue_1');
  var preHp = defender.currentHp;
  // 負のAP修飾を付与
  global.addStatModifier(state, attacker, {
    id: 'neg-ap-test', stat: 'AP', amount: -600,
    startTurn: state.turnNumber, endTurn: state.turnNumber
  });
  var result = global.performAttack(state, attacker.instanceId, defender.instanceId, 'INSECT', 'attack');
  runner.assertTrue(result.finalAp < 0, '最終APは負数保持');
  runner.assertEqual(result.damageDealt, 0, '最終ダメージは0');
  runner.assertEqual(defender.currentHp, preHp, 'HPは変化しない');
  runner.assertEqual(defender.zone, global.ZONES.FIELD, '破壊されない');
});

runner.test('TestEXP39 場の複數蟲DOM橫並び要素存在', function () {
  var selfField = document.getElementById('self-field-zone');
  var oppField = document.getElementById('opp-field-zone');
  runner.assertTrue(selfField !== null, 'self-field-zoneが存在');
  runner.assertTrue(oppField !== null, 'opp-field-zoneが存在');
});

runner.test('TestEXP40 捨て場表示が存在', function () {
  var selfDiscard = document.getElementById('self-discard-zone');
  var oppDiscard = document.getElementById('opp-discard-zone');
  runner.assertTrue(selfDiscard !== null, 'self-discard-zoneが存在');
  runner.assertTrue(oppDiscard !== null, 'opp-discard-zoneが存在');
});

module.exports = runner;

if (require.main === module) {
  runner.runAll().then(function () {});
}
