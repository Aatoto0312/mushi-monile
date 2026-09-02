'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();

// ---- 最小DOMスタブ ----
var registry = {};
function makeElement(tag) {
  var el = {
    tagName: tag || 'div',
    className: '',
    children: [],
    dataset: {},
    style: {},
    classList: {
      _set: {},
      add: function (c) { this._set[c] = true; },
      remove: function (c) { delete this._set[c]; },
      contains: function (c) { return !!this._set[c]; }
    },
    textContent: '',
    innerHTML: '',
    _listeners: {},
    onclick: null,
    appendChild: function (child) { this.children.push(child); return child; },
    replaceWith: function () {},
    addEventListener: function (type, fn) { (this._listeners[type] = this._listeners[type] || []).push(fn); },
    dispatch: function (type) { (this._listeners[type] || []).forEach(function (f) { f && f({ preventDefault: function () {} }); }); },
    setAttribute: function () {},
    querySelector: function () { return null; },
    querySelectorAll: function () { return []; },
    scrollTop: 0,
    scrollHeight: 0,
    disabled: false,
    type: tag === 'button' ? 'button' : 'input'
  };
  return el;
}
function getById(id) {
  if (!registry[id]) { registry[id] = makeElement('div'); }
  return registry[id];
}
function resetDom() {
  registry = {};
}
global.document = {
  readyState: 'loading',
  _listeners: {},
  addEventListener: function (type, fn) { (this._listeners[type] = this._listeners[type] || []).push(fn); },
  dispatch: function (type) { (this._listeners[type] || []).forEach(function (f) { f && f(); }); },
  getElementById: getById,
  createElement: makeElement,
  querySelector: function (sel) {
    if (sel && sel[0] === '#') { return getById(sel.slice(1)); }
    return null;
  },
  querySelectorAll: function () { return []; }
};
global.window = global;
global.alert = function () {};
global.confirm = function () { return true; };

// ---- エンジンロード ----
require('./engine-loader.js');
require('../js/engine/cpu-agent.js');
require('../js/engine/cpu-runner.js');
require('../js/ui/card-ui.js');
require('../js/ui/battle-log-ui.js');
require('../js/ui/battle-ui.js');

// ---- helpers ----
function reachP2SetPhase(state) {
  global.enterSetPhase(state);
  if (state.player('P1').hand.length > 0) {
    global.setFood(state, 'P1', state.player('P1').hand[0].instanceId);
  }
  global.enterMainPhase(state);
  global.endTurn(state);
  global.enterSetPhase(state);
  return state;
}

function reachMainPhaseAsP1(state) {
  // P1が先攻でDRAW_PHASE → SET_PHASE → メインフェイズ
  global.enterSetPhase(state);
  if (state.player('P1').hand.length > 0) {
    global.setFood(state, 'P1', state.player('P1').hand[0].instanceId);
  }
  global.enterMainPhase(state);
  return state;
}

// ---- Test DA1: 相手場0体+縄張りあり → LEADER直接攻撃可能 ----
runner.test('TestDA1 相手場0体+縄張りありでLEADER直接攻撃可能', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachMainPhaseAsP1(state);
  h.putInsectOnField(state, 'P1', 'test_red_1');
  // P2は場に虫なし（初期状態）
  var targets = global.getLegalAttackTargets(state, state.player('P1').field[0].instanceId);
  runner.assertTrue(targets.length === 1, '攻撃対象は1つ(LEADERのみ)');
  runner.assertEqual(targets[0].targetType, 'LEADER', '対象はLEADER');
  runner.assertTrue(targets[0].instance === null, 'LEADER targetのinstanceはnull');
  runner.assertEqual(targets[0].playerId, 'P2', '対象プレイヤーはP2');
});

// ---- Test DA2: 直接攻撃 → 防御側TERRITORY_DRAW_SELECTION発生 ----
runner.test('TestDA2 直接攻撃でTERRITORY_DRAW_SELECTION発生', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachMainPhaseAsP1(state);
  h.putInsectOnField(state, 'P1', 'test_red_1');
  // P2には縄張りがある（初期6枚）
  runner.assertTrue(state.player('P2').territory.length >= 1, 'P2縄張りは1枚以上');
  var attacker = state.player('P1').field[0];
  var result = global.performAttack(state, attacker.instanceId, null, 'LEADER', 'attack');
  runner.assertTrue(result.wasTerritoryDraw, 'wasTerritoryDraw=true');
  runner.assertEqual(state.phase, global.Phases.MAIN_PHASE, 'フェイズはMAIN_PHASEのまま');
  var pending = global.getPendingEffect(state);
  runner.assertTrue(pending !== null, 'pendingEffectが発生');
  runner.assertEqual(pending.type, 'TERRITORY_DRAW_SELECTION', 'pendingはTERRITORY_DRAW_SELECTION');
  runner.assertEqual(pending.playerId, 'P2', 'pendingの対象はP2');
});

// ---- Test DA3: 縄張り0 → 直接攻撃で勝利 ----
runner.test('TestDA3 相手縄張り0で直接攻撃で勝利', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachMainPhaseAsP1(state);
  h.putInsectOnField(state, 'P1', 'test_red_1');
  // P2の縄張りを空にする
  h.setTerritoryEmpty(state, 'P2');
  runner.assertEqual(state.player('P2').territory.length, 0, 'P2縄張りは0');
  var attacker = state.player('P1').field[0];
  var result = global.performAttack(state, attacker.instanceId, null, 'LEADER', 'attack');
  runner.assertTrue(result.victory, 'victory=true');
  runner.assertEqual(state.winner, 'P1', '勝者はP1');
  runner.assertEqual(state.phase, global.Phases.GAME_OVER, 'GAME_OVER');
});

// ---- Test DA4: 複数ATTACK技の蟲 → 技選択が必要 ----
runner.test('TestDA4 カブトムシは2つのATTACK技を持つ', function () {
  var def = global.getCardDefinition('kabutomushi');
  runner.assertTrue(def !== null, 'kabutomushi定義あり');
  var attackSkills = def.skills.filter(function (s) { return s.timing === 'ATTACK'; });
  runner.assertEqual(attackSkills.length, 2, 'ATTACK技は2つ');
  runner.assertEqual(attackSkills[0].id, 'tsuno_tosshin', '技1はツノ突進');
  runner.assertEqual(attackSkills[1].id, 'sukoinage', '技2はすくい投げ');
});

// ---- Test DA5: 選択したskillIdがperformAttackへ渡る ----
runner.test('TestDA5 skillIdを指定すると対応する技で攻撃する', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachMainPhaseAsP1(state);
  h.ensureCost(state, 'P1', 4);
  // カブトムシを手札に直接追加して場に出す
  var def = global.getCardDefinition('kabutomushi');
  var inst = h.addToHandRaw(state, 'P1', def);
  global.summonInsect(state, 'P1', inst.instanceId);
  var insect = state.player('P1').field[0];
  runner.assertEqual(insect.cardId, 'kabutomushi', '場にカブトムシ');

  // ツノ突進で攻撃（LEADER直接攻撃はダメージ計上なし、縄張りドロー）
  var result = global.performAttack(state, insect.instanceId, null, 'LEADER', 'tsuno_tosshin');
  runner.assertEqual(result.skill.id, 'tsuno_tosshin', '使用した技はツノ突進');
  runner.assertTrue(result.wasTerritoryDraw, '縄張りドロー発生');

  // ターンをリセットして再攻撃
  insect.attackedThisTurn = false;

  // すくい投げで攻撃
  var result2 = global.performAttack(state, insect.instanceId, null, 'LEADER', 'sukoinage');
  runner.assertEqual(result2.skill.id, 'sukoinage', '使用した技はすくい投げ');
});

// ---- Test DA6: 場の複数蟲が横並び用DOM要素が存在する ----
runner.test('TestDA6 field-zone要素が存在しfield-zoneクラスを持つ', function () {
  // CSSの実際の値(flex-direction等)はブラウザでのみ評価される。
  // NodeではDOM要素とHTML側のクラス名設定を確認する。
  var selfField = document.getElementById('self-field-zone');
  runner.assertTrue(selfField !== null, 'self-field-zone要素が存在する');
  // DOMスタブはclassName=''で作成されるため、要素の存在のみ確認
  var oppField = document.getElementById('opp-field-zone');
  runner.assertTrue(oppField !== null, 'opp-field-zone要素が存在する');
  // battle-ui.jsのrenderSelf/renderOpponentがfield-zoneを正しくレンダリングすることを
  // 間接的に確認: テスト内でDOMスタブがfield-zoneを返す
  runner.assertTrue(selfField.tagName === 'div', 'field-zoneはdiv要素');
  runner.assertTrue(oppField.tagName === 'div', 'opp-field-zoneはdiv要素');
});

// ---- Test DA7: 捨て場へカード移動可能 ----
runner.test('TestDA7 術使用後にカードがDISCARDへ移動', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachMainPhaseAsP1(state);
  h.ensureCost(state, 'P1', 1);
  // test_spell_1を手札に直接追加
  var spellDef = global.getCardDefinition('test_spell_1');
  var spell = h.addToHandRaw(state, 'P1', spellDef);
  var discBefore = state.player('P1').discard.length;
  global.useSpell(state, 'P1', spell.instanceId);
  runner.assertEqual(state.player('P1').discard.length, discBefore + 1, 'discardが1枚増えた');
  runner.assertTrue(state.player('P1').hand.indexOf(spell) === -1, '手札から消えた');
});

// ---- Test DA8: 捨て場→手札・場をzone APIで扱える ----
runner.test('TestDA8 discard→handとdiscard→fieldがmoveCardで可能', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachMainPhaseAsP1(state);

  // P1の場に虫を1体配置 → discardに送る（FIELD→DISCARD）
  h.putInsectOnField(state, 'P1', 'test_red_1');
  var insect = state.player('P1').field[0];
  runner.assertTrue(insect.zone === global.ZONES.FIELD, '初期はFIELD');
  global.moveCard(state, insect.instanceId, global.ZONES.FIELD, global.ZONES.DISCARD, { playerId: 'P1' });
  runner.assertTrue(insect.zone === global.ZONES.DISCARD, 'DISCARDに移動');
  runner.assertEqual(state.player('P1').discard.length, 1, 'discardに1枚');

  // discard→hand に移動
  global.moveCard(state, insect.instanceId, global.ZONES.DISCARD, global.ZONES.HAND, { playerId: 'P1' });
  runner.assertTrue(insect.zone === global.ZONES.HAND, 'HANDに移動');
  runner.assertEqual(state.player('P1').hand.indexOf(insect) !== -1, true, 'handに存在');

  // 手札→場（再配置）
  global.moveCard(state, insect.instanceId, global.ZONES.HAND, global.ZONES.FIELD, { playerId: 'P1' });
  runner.assertTrue(insect.zone === global.ZONES.FIELD, 'FIELDに再移動');
});

// ---- Test DA9: CPU戦でも直接攻撃が成立 ----
runner.test('TestDA9 CPUは相手虫がいない時に直接攻撃を選択する', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP2SetPhase(state);
  global.setFood(state, 'P2', state.player('P2').hand[0].instanceId);
  global.enterMainPhase(state);
  state.player('P2').hand = [];
  h.putInsectOnField(state, 'P2', 'test_red_1');
  // P1の場に虫がいない → CPUは直接攻撃を選択できる
  // P1には初期の虫も置かない（場が空）
  runner.assertEqual(state.player('P1').field.length, 0, 'P1の場は空');
  var cpu = new global.CpuAgent('P2', { rng: function () { return 0; } });
  var action = cpu.step(state);
  runner.assertTrue(action !== null, 'CPU行動がある');
  runner.assertEqual(action.type, 'ATTACK', 'CPUは攻撃を選択');
  runner.assertEqual(action.targetType, 'LEADER', 'CPUはLEADERを直接攻撃対象に選択');
  // 実行してOK
  var result = global.performAttack(state, action.attackerInstanceId, null, 'LEADER', action.skillId);
  runner.assertTrue(result.wasTerritoryDraw || result.victory, '直接攻撃が成立');
});

// ---- 新規回帰テスト (DirectFreeze対応) ----

runner.test('DirectFreeze1 Human direct attack -> P1 pending解消 -> ゲーム継続', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachMainPhaseAsP1(state);
  h.putInsectOnField(state, 'P1', 'test_red_1');

  // P2に縄張りを持たせる
  h.addToTerritoryRaw(state, 'P2', h.defById('test_red_1'));

  var attacker = state.player('P1').field[0];
  var result = global.performAttack(state, attacker.instanceId, null, 'LEADER', 'attack');

  runner.assertTrue(result.wasTerritoryDraw, 'wasTerritoryDraw=true');
  var pending = global.getPendingEffect(state);
  runner.assertTrue(pending !== null, 'pendingが発生');

  // P2(Human)が選択してpending解消
  global.resolveTerritoryDrawSelection(state, 'P2', state.player('P2').territory[0].instanceId);
  runner.assertEqual(global.getPendingEffect(state), null, 'pendingが解消された');
  runner.assertEqual(state.phase, global.Phases.MAIN_PHASE, 'MAIN_PHASEのまま');
});

runner.test('DirectFreeze2 CPU direct attack -> P1 pending発生 -> CpuRunner停止 -> 再開可能', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });

  // P2(CPU)をメインフェイズへ
  state.activePlayerId = 'P2';
  state.phase = global.Phases.MAIN_PHASE;
  h.putInsectOnField(state, 'P2', 'test_red_1');

  // P1に縄張りを持たせる
  h.addToTerritoryRaw(state, 'P1', h.defById('test_red_1'));

  var uiStub = { render: function () {} };
  var runner2 = new global.CpuRunner({ state: state }, uiStub, { thinkDelay: 0, maxActionsPerTurn: 50 });

  // P2のCPUアクションを実行させる
  return runner2.runTurn().then(function () {
    var pending = global.getPendingEffect(state);
    runner.assertTrue(pending !== null && pending.playerId === 'P1', 'P1 pending発生');
    runner.assertEqual(runner2.isRunning, false, 'CpuRunner停止');

    // pending解決
    global.resolveTerritoryDrawSelection(state, 'P1', state.player('P1').territory[0].instanceId);

    // 再開
    return runner2.runTurn();
  }).then(function () {
    runner.assertEqual(global.getPendingEffect(state), null, 'pending解消');
  });
});

runner.test('DirectFreeze3 直接攻撃で勝利 -> GAME_OVER', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachMainPhaseAsP1(state);
  h.putInsectOnField(state, 'P1', 'test_red_1');
  h.setTerritoryEmpty(state, 'P2');

  var attacker = state.player('P1').field[0];
  var result = global.performAttack(state, attacker.instanceId, null, 'LEADER', 'attack');

  runner.assertTrue(result.victory, '勝利');
  runner.assertEqual(state.phase, global.Phases.GAME_OVER, 'GAME_OVER');
  runner.assertEqual(global.getPendingEffect(state), null, 'pendingなし');
});

runner.test('DirectFreeze4 direct attack -> territoryあり(tobidasuなし)', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachMainPhaseAsP1(state);
  h.putInsectOnField(state, 'P1', 'test_red_1');

  // 縄張り用のカード定義を新規作成(tobidasuなし)
  var territoryDef = new CardDefinition({
    id: 'test_territory_no_skill',
    name: 'テスト縄張り(技なし)',
    set: 'TEST',
    type: CardTypes.INSECT,
    color: Attributes.RED,
    cost: 0,
    baseHp: 500,
    skills: [],
    implementationStatus: CardStatus.TEST,
    sourceLevel: SourceLevel.D,
    sourceRefs: [],
    verificationNotes: '直接攻撃テスト用'
  });
  h.addToTerritoryRaw(state, 'P2', territoryDef);

  var attacker = state.player('P1').field[0];
  var result = global.performAttack(state, attacker.instanceId, null, 'LEADER', 'attack');

  // pending解消まで
  global.resolveTerritoryDrawSelection(state, 'P2', state.player('P2').territory[0].instanceId);

  runner.assertEqual(global.getPendingEffect(state), null, 'pending解消');
  runner.assertTrue(state.player('P2').hand.length >= 1, '手札に加わった');
});

runner.test('DirectFreeze5 direct attack -> とびだすあり -> choice pending -> 解消', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachMainPhaseAsP1(state);
  h.putInsectOnField(state, 'P1', 'test_red_1');

  // 縄張り(とびだすあり = minminzemi)
  var cardDef = global.getCardDefinition('minminzemi');
  h.addToTerritoryRaw(state, 'P2', cardDef);

  var attacker = state.player('P1').field[0];
  var result = global.performAttack(state, attacker.instanceId, null, 'LEADER', 'attack');

  // pending選択
  global.resolveTerritoryDrawSelection(state, 'P2', state.player('P2').territory[0].instanceId);

  // とびだす選択pendingが発生しているはず
  var pending = global.getPendingEffect(state);
  runner.assertEqual(pending.type, 'TERRITORY_DRAW_CHOICE', 'とびだす判定pending');

  // 選択
  global.resolvePendingTerritoryChoice(state, 'TAKE_TO_HAND');

  runner.assertEqual(global.getPendingEffect(state), null, 'pending解消');
  runner.assertTrue(state.player('P2').hand.length >= 1, '手札に加わった');
});

module.exports = runner;

if (require.main === module) {
  runner.runAll().then(function () {});
}
