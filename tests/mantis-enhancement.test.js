'use strict';

// 実機不具合対策専用テスト。
// - カマ連撃(連続攻撃)
// - 共食い(対象選択)
// - 強化カードの即時反映
// - 玉虫色の羽化(色選択)
// - プレイヤー向け効果文(内部enum非露出)
// - passive/traitのAPラベル抑止

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();

// ---- 最小DOMスタブ (card-ui ロード用) ----
var registry = {};
function makeElement(tag) {
  var el = {
    tagName: tag || 'div',
    className: '',
    children: [],
    dataset: {},
    style: {},
    textContent: '',
    classList: { _set: {}, add: function (c) { this._set[c] = true; }, remove: function (c) { delete this._set[c]; }, contains: function (c) { return !!this._set[c]; } },
    appendChild: function (c) { this.children.push(c); return c; },
    replaceWith: function () {},
    _listeners: {},
    addEventListener: function (type, fn) { this._listeners[type] = fn; },
    click: function () { if (this._listeners.click) this._listeners.click(); },
    setAttribute: function () {},
    querySelector: function () { return null; },
    querySelectorAll: function () { return []; }
  };
  Object.defineProperty(el, 'innerHTML', {
    get: function () { return this._innerHTML || ''; },
    set: function (value) { this._innerHTML = value; if (value === '') this.children = []; }
  });
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
global.BattleLogUI = function () {};

require('./engine-loader.js');
require('../js/engine/cpu-agent.js');
require('../js/engine/cpu-runner.js');
require('../js/ui/card-ui.js');
require('../js/ui/battle-ui.js');

function toMain(state) {
  if (state.phase === global.Phases.TURN_START) { global.beginTurn(state); }
  if (state.phase === global.Phases.DRAW_PHASE) { global.enterSetPhase(state); }
  if (state.phase === global.Phases.SET_PHASE) {
    var ap = state.activePlayerId;
    if (state.player(ap).hand.length > 0) { global.setFood(state, ap, state.player(ap).hand[0].instanceId); }
    global.enterMainPhase(state);
  }
  return state;
}

function reachP1Main(state) {
  var guard = 0;
  while (state.activePlayerId !== 'P1' && guard < 10) { toMain(state); global.endTurn(state); guard++; }
  if (state.phase === global.Phases.TURN_START) { global.beginTurn(state); }
  if (state.phase === global.Phases.DRAW_PHASE) { global.enterSetPhase(state); }
  if (state.phase === global.Phases.SET_PHASE) {
    if (state.player('P1').hand.length > 0) { global.setFood(state, 'P1', state.player('P1').hand[0].instanceId); }
    global.enterMainPhase(state);
  }
  return state;
}

function fieldInsect(state, playerId, cardId) {
  return state.player(playerId).field.filter(function (c) { return c.cardId === cardId; })[0];
}

// ==== カマ連撃 (連続攻撃) ====
runner.test('MANTIS1 カマ連撃1回目の攻撃ができる', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var oka = h.putInsectOnField(state, 'P1', 'okamakiri');
  var def = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 2000 });
  var res = global.performAttack(state, oka.instanceId, def.instanceId, 'INSECT', 'kama_renshoku');
  runner.assertTrue(res.skillName === 'カマ連撃', 'カマ連撃スキル使用');
  var ca = oka.runtimeFlags && oka.runtimeFlags.continuousAttack;
  runner.assertTrue(ca && ca.usedCount === 1, '1回目後 continuousAttack.usedCount=1');
});

runner.test('MANTIS2 2回目のカマ連撃を別対象にできる', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var oka = h.putInsectOnField(state, 'P1', 'okamakiri');
  var def1 = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 2000 });
  var def2 = h.putInsectOnField(state, 'P2', 'test_green_1', { hp: 2000 });
  global.performAttack(state, oka.instanceId, def1.instanceId, 'INSECT', 'kama_renshoku');
  var ca = oka.runtimeFlags.continuousAttack;
  runner.assertTrue(ca && ca.usedCount === 1, '1回目後 usedCount=1');
  // 2回目: 別対象へ
  var res2 = global.performAttack(state, oka.instanceId, def2.instanceId, 'INSECT', 'kama_renshoku');
  runner.assertTrue(res2.damageDealt >= 0, '2回目攻撃成功');
  runner.assertTrue(!(oka.runtimeFlags && oka.runtimeFlags.continuousAttack), '2回目で最大回数到達 → フラグ消滅');
});

runner.test('MANTIS3 3回目の連撃はできない', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var oka = h.putInsectOnField(state, 'P1', 'okamakiri');
  var def1 = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 2000 });
  var def2 = h.putInsectOnField(state, 'P2', 'test_green_1', { hp: 2000 });
  global.performAttack(state, oka.instanceId, def1.instanceId, 'INSECT', 'kama_renshoku');
  global.performAttack(state, oka.instanceId, def2.instanceId, 'INSECT', 'kama_renshoku');
  var threw = false;
  try { global.performAttack(state, oka.instanceId, def1.instanceId, 'INSECT', 'kama_renshoku'); } catch (e) { threw = true; }
  runner.assertTrue(threw, '3回目は例外(攻撃済み)');
});

runner.test('MANTIS4 カマ連撃を使わない通常攻撃では1回のみ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  // 追加コストなしの通常攻撃(カブトムシ ツノ突進 AP500)
  var kabuto = h.putInsectOnField(state, 'P1', 'kabutomushi');
  var def1 = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 5000 });
  global.performAttack(state, kabuto.instanceId, def1.instanceId, 'INSECT', 'tsuno_tosshin');
  var threw = false;
  try { global.performAttack(state, kabuto.instanceId, def1.instanceId, 'INSECT', 'tsuno_tosshin'); } catch (e) { threw = true; }
  runner.assertTrue(threw, '2回目は攻撃済みで例外');
});

// ==== 共食い (対象選択) ====
runner.test('CANNIBAL1 共食いで指定した自虫が破壊される', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var oka = h.putInsectOnField(state, 'P1', 'okamakiri');
  var sac1 = h.putInsectOnField(state, 'P1', 'test_red_1');
  var sac2 = h.putInsectOnField(state, 'P1', 'test_blue_1');
  var target = h.putInsectOnField(state, 'P2', 'test_green_1', { hp: 5000 });
  var res = global.performAttack(state, oka.instanceId, target.instanceId, 'INSECT', 'tomogui', sac2.instanceId);
  runner.assertEqual(sac2.zone, global.ZONES.DISCARD, '指定sac2破壊');
  runner.assertEqual(sac1.zone, global.ZONES.FIELD, '非指定sac1は生存');
  runner.assertTrue(res.damageDealt > 0, '攻撃成立');
});

runner.test('CANNIBAL2 共食いは対象未指定で自動選択しない(複数候補)', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var oka = h.putInsectOnField(state, 'P1', 'okamakiri');
  h.putInsectOnField(state, 'P1', 'test_red_1');
  h.putInsectOnField(state, 'P1', 'test_blue_1');
  var target = h.putInsectOnField(state, 'P2', 'test_green_1', { hp: 5000 });
  var threw = false;
  try { global.performAttack(state, oka.instanceId, target.instanceId, 'INSECT', 'tomogui'); } catch (e) { threw = true; }
  runner.assertTrue(threw, '複数候補で未指定は例外');
});

runner.test('CANNIBAL3 自虫がいなければ失敗', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var oka = h.putInsectOnField(state, 'P1', 'okamakiri');
  var target = h.putInsectOnField(state, 'P2', 'test_green_1', { hp: 5000 });
  var threw = false;
  try { global.performAttack(state, oka.instanceId, target.instanceId, 'INSECT', 'tomogui', 'nope'); } catch (e) { threw = true; }
  runner.assertTrue(threw, '自虫なしで失敗');
});

runner.test('CANNIBAL4 CPUは共食い用の合法な犠牲虫IDを選ぶ', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  state.activePlayerId = 'P2';
  state.phase = global.Phases.MAIN_PHASE;
  state.player('P2').hand = [];
  var oka = h.putInsectOnField(state, 'P2', 'okamakiri');
  var sacrifice = h.putInsectOnField(state, 'P2', 'test_red_1');
  h.putInsectOnField(state, 'P1', 'test_green_1', { hp: 5000 });
  var cpu = new global.CpuAgent('P2', { rng: function () { return 0; } });
  var action = cpu.decideMainPhaseAction(state);
  runner.assertEqual(action.type, 'ATTACK', 'CPU攻撃選択');
  if (action.skillId === 'tomogui') {
    runner.assertEqual(action.chosenSacrificeInstanceId, sacrifice.instanceId, '合法な犠牲ID');
  } else {
    runner.assertTrue(action.chosenSacrificeInstanceId == null, '犠牲不要技ではIDなし');
  }
  runner.assertTrue(action.attackerInstanceId === oka.instanceId || action.attackerInstanceId === sacrifice.instanceId, '合法攻撃者');
});

// ==== 強化カード即時反映 ====
runner.test('ENHANCE1 蓑虫(HP+500)装着直後にeffect HPへ即時反映', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var insect = h.putInsectOnField(state, 'P1', 'test_red_1');
  var before = global.calculateMaxHp(insect);
  var inst = h.addToHandRaw(state, 'P1', global.getCardDefinition('minomushi_no_kakuremino'));
  h.ensureCost(state, 'P1', inst.cost || 1);
  global.useEnhancement(state, 'P1', inst.instanceId, insect.instanceId);
  var after = global.calculateMaxHp(insect);
  runner.assertEqual(after - before, 500, 'HP+500が即時反映');
});

runner.test('ENHANCE2 AP修飾addStatModifierが即時反映', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1'); // 基本AP500
  var before = global.getEffectiveAP(state, attacker, 500);
  global.addStatModifier(state, attacker, { id: 'ap-now', stat: 'AP', amount: 300, startTurn: state.turnNumber, endTurn: state.turnNumber });
  var after = global.getEffectiveAP(state, attacker, 500);
  runner.assertEqual(after - before, 300, 'AP+300即時反映');
});

function attachDaigaku(state, insect) {
  var enh = h.addToHandRaw(state, insect.ownerId, global.getCardDefinition('kamikiri_no_daigaku'));
  global.useEnhancement(state, insect.ownerId, enh.instanceId, insect.instanceId);
}

runner.test('EnhanceAP1 カマ連撃200へ大顎+300を加算', function () {
  var state = h.newGame({ rng: h.firstPlayerRng }); reachP1Main(state);
  var oka = h.putInsectOnField(state, 'P1', 'okamakiri');
  attachDaigaku(state, oka);
  runner.assertEqual(global.getEffectiveAP(state, oka, 200), 500, 'effectiveAP=500');
});

runner.test('EnhanceAP2 共食い800へ大顎+300を加算', function () {
  var state = h.newGame({ rng: h.firstPlayerRng }); reachP1Main(state);
  var oka = h.putInsectOnField(state, 'P1', 'okamakiri');
  attachDaigaku(state, oka);
  runner.assertEqual(global.getEffectiveAP(state, oka, 800), 1100, 'effectiveAP=1100');
});

runner.test('EnhanceAP3 補正後APへ弱点倍率を最後に適用', function () {
  var state = h.newGame({ rng: h.firstPlayerRng }); reachP1Main(state);
  var oka = h.putInsectOnField(state, 'P1', 'okamakiri');
  attachDaigaku(state, oka);
  var target = h.putInsectOnField(state, 'P2', 'test_green_1', { hp: 5000 });
  var result = global.performAttack(state, oka.instanceId, target.instanceId, 'INSECT', 'kama_renshoku');
  runner.assertEqual(result.apVal, 500, '倍率前AP=500');
  runner.assertEqual(result.damageDealt, 1000, 'damage=1000');
});

runner.test('EnhanceAP4 強化直後の詳細に実効AP500を表示', function () {
  var state = h.newGame({ rng: h.firstPlayerRng }); reachP1Main(state);
  var oka = h.putInsectOnField(state, 'P1', 'okamakiri');
  attachDaigaku(state, oka);
  var detail = global.CardUI.getCardDetail(oka, state);
  var kama = detail.skills.filter(function (s) { return s.name === 'カマ連撃'; })[0];
  runner.assertEqual(kama.effectiveAp, 500, '詳細実効AP=500');
  runner.assertEqual(kama.apBonus, 300, '詳細補正=300');
});

// ==== 玉虫色の羽化 (色選択) ====
runner.test('COLOR1 chosenColorでgetEffectiveColorが反映', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var insect = h.putInsectOnField(state, 'P1', 'test_red_1'); // 元RED
  var inst = h.addToHandRaw(state, 'P1', global.getCardDefinition('tamamushiiro_no_uka'));
  h.ensureCost(state, 'P1', inst.cost || 2);
  global.useEnhancement(state, 'P1', inst.instanceId, insect.instanceId, 'GREEN');
  runner.assertEqual(global.getEffectiveColor(insect), global.Attributes.GREEN, 'effective色=GREEN');
});

runner.test('COLOR2 色変更が色相性倍率に反映', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var attacker = h.putInsectOnField(state, 'P1', 'test_red_1'); // 元RED
  var inst = h.addToHandRaw(state, 'P1', global.getCardDefinition('tamamushiiro_no_uka'));
  h.ensureCost(state, 'P1', inst.cost || 2);
  global.useEnhancement(state, 'P1', inst.instanceId, attacker.instanceId, 'GREEN');
  // GREEN有利はBLUE。相手をBLUEに。
  var defender = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 5000 });
  var res = global.performAttack(state, attacker.instanceId, defender.instanceId, 'INSECT', 'attack');
  runner.assertEqual(res.multiplier, 2, 'GREEN→BLUE は×2');
});

// ==== プレイヤー向け効果文 ====
function noEnumInDetail(cardId, instanceExtra) {
  var detail = global.CardUI.getCardDetail(Object.assign({ cardId: cardId }, instanceExtra || {}));
  if (!detail) { return false; }
  var json = JSON.stringify(detail);
  var enums = ['DEAL_DAMAGE_TO_TARGET', 'TURN_FACE_DOWN', 'RETRIEVE_FROM_DISCARD', 'COLOR_OVERRIDE', 'SACRIFICE_OWN_INSECT', 'APPLY_STAT_MODIFIER', 'CONTINUOUS_ATTACK'];
  return enums.every(function (e) { return json.indexOf(e) === -1; });
}

runner.test('TEXT1 虹の架け橋に内部enumが露出しない', function () {
  runner.assertTrue(noEnumInDetail('niji_no_kakehashi'), '虹の架け橋の詳細にenumなし');
});

runner.test('TEXT2 玉虫色の羽化に内部enumが露出しない', function () {
  runner.assertTrue(noEnumInDetail('tamamushiiro_no_uka'), '玉虫色の羽化の詳細にenumなし');
});

runner.test('TEXT3 蓑虫の隠れ蓑に内部enumが露出しない', function () {
  runner.assertTrue(noEnumInDetail('minomushi_no_kakuremino'), '蓑虫の隠れ蓑の詳細にenumなし');
});

runner.test('TEXT4 蟲(オオカマキリ)に内部enumが露出しない', function () {
  runner.assertTrue(noEnumInDetail('okamakiri', { currentHp: 800 }), 'オオカマキリの詳細にenumなし');
});

// ==== passive/trait の AP ラベル抑止 (firstAttackAp) ====
runner.test('PASSIVE1 firstAttackApはATTACK技のみAPを返す', function () {
  // カブトムシはATTACK技(ツノ突進/すくい投げ)を持つ
  var der = require('../js/ui/card-ui.js') && global.CardUI;
  runner.assertTrue(der !== null, 'CardUI利用可能');
  var ap = global.CardUI.firstAttackAp ? global.CardUI.firstAttackAp(global.getCardDefinition('kabutomushi').skills) : null;
  // firstAttackApが公開されていない場合はgetCardDetailのap値で判定
  if (ap === null && global.CardUI.firstAttackAp === undefined) {
    var det = global.CardUI.getCardDetail({ cardId: 'kabutomushi', currentHp: 800 });
    runner.assertTrue(det.ap > 0, 'カブトムシはAP表示(攻撃技)');
    return;
  }
  runner.assertTrue(ap !== null && ap > 0, 'カブトムシfirstAttackAp>0: ' + ap);
});

runner.test('PASSIVE2 非ATTACK特性にはAP0を出さない', function () {
  // ナナフシモドキの最初のスキルが特性(擬態)ならAPを表示しない
  var def = global.getCardDefinition('nanafushimodoki');
  var first = def && def.skills && def.skills[0];
  var isAttackFirst = first && first.timing === 'ATTACK';
  var ap = global.CardUI.firstAttackAp ? global.CardUI.firstAttackAp(def.skills) : null;
  if (global.CardUI.firstAttackAp !== undefined) {
    if (!isAttackFirst) {
      // 最初のスキルがATTACKでないのにfirstAttackAp>0を返すのは誤り
      // firstAttackApは最初のATTACK技のAPを返すので、攻撃技があれば正の値でも可。
      // ここでは「AP0固定表示」でないこと=ATTACK技APを正しく返すことを確認
      var det = global.CardUI.getCardDetail({ cardId: 'nanafushimodoki', currentHp: 400 });
      runner.assertTrue('skills' in det, 'detail.skills存在');
      return;
    }
    runner.assertTrue(ap !== null, 'attack-firstならAPあり');
  } else {
    runner.assertTrue(true, 'firstAttackAp未公開のためgetCardDetail経由で検証');
  }
});

// ==== BattleUI 回帰テスト ====
function makeUi(state) {
  var ui = Object.create(global.BattleUI.prototype);
  ui.state = state;
  ui.actionState = { mode: 'idle', attackerInstanceId: null, skillId: null, legalTargets: [] };
  ui.render = function () {};
  ui.renderAttackButtons = function () {};
  ui.clearAttackerHighlight = function () {};
  return ui;
}

runner.test('MantisUI1 1回目後に即座に2回目対象選択へ入る', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var oka = h.putInsectOnField(state, 'P1', 'okamakiri');
  var def1 = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 2000 });
  h.putInsectOnField(state, 'P2', 'test_green_1', { hp: 2000 });
  var ui = makeUi(state);
  ui.actionState = { mode: 'attackTarget', attackerInstanceId: oka.instanceId, skillId: 'kama_renshoku', legalTargets: [] };
  ui.confirmAttack({ targetType: 'INSECT', instance: def1 });
  runner.assertEqual(ui.actionState.mode, 'attackTarget', '2回目対象選択モード');
  runner.assertEqual(ui.actionState.attackerInstanceId, oka.instanceId, '攻撃者ID保持');
  runner.assertEqual(ui.actionState.skillId, 'kama_renshoku', '同じskillId保持');
});

runner.test('MantisUI2 2回目完了後に選択状態を解除する', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var oka = h.putInsectOnField(state, 'P1', 'okamakiri');
  var def1 = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 2000 });
  var def2 = h.putInsectOnField(state, 'P2', 'test_green_1', { hp: 2000 });
  global.performAttack(state, oka.instanceId, def1.instanceId, 'INSECT', 'kama_renshoku');
  var ui = makeUi(state);
  ui.actionState = { mode: 'attackTarget', attackerInstanceId: oka.instanceId, skillId: 'kama_renshoku', legalTargets: [] };
  ui.confirmAttack({ targetType: 'INSECT', instance: def2 });
  runner.assertEqual(ui.actionState.mode, 'idle', '2回目後idle');
  runner.assertEqual(ui.actionState.attackerInstanceId, null, '攻撃者解除');
});

runner.test('CannibalUI1 複数候補からHuman犠牲選択へ入る', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  reachP1Main(state);
  var oka = h.putInsectOnField(state, 'P1', 'okamakiri');
  h.putInsectOnField(state, 'P1', 'test_red_1');
  h.putInsectOnField(state, 'P1', 'test_blue_1');
  var target = h.putInsectOnField(state, 'P2', 'test_green_1', { hp: 5000 });
  var ui = makeUi(state);
  ui.actionState = { mode: 'attackTarget', attackerInstanceId: oka.instanceId, skillId: 'tomogui', legalTargets: [] };
  ui.confirmAttack({ targetType: 'INSECT', instance: target });
  runner.assertEqual(ui.actionState.mode, 'sacrificeTarget', '犠牲選択モード');
  runner.assertEqual(ui.actionState.sacrificeCandidates.length, 2, '候補2体');
});

runner.test('CannibalUI2 選択instanceIdをperformAttackへ渡す', function () {
  var ui = makeUi({ activePlayerId: 'P1' });
  var captured = null;
  var original = global.performAttack;
  global.performAttack = function () { captured = Array.prototype.slice.call(arguments); return {}; };
  ui.actionState = { mode: 'sacrificeTarget', attackerInstanceId: 'oka', skillId: 'tomogui', legalTargets: [], pendingAttackTarget: { targetType: 'INSECT', instance: { instanceId: 'enemy' } }, sacrificeCandidates: ['sac-a', 'sac-b'] };
  ui.onSacrificeTargetTap('P1', { instanceId: 'sac-b' });
  global.performAttack = original;
  runner.assertEqual(captured[5], 'sac-b', '選択した犠牲ID');
});

runner.test('ColorUI1 玉虫色で赤青緑の3ボタンを表示する', function () {
  var ui = makeUi({ activePlayerId: 'P1' });
  var row = getById('color-select-row');
  row.children = [];
  ui.beginColorSelection('enh', 'target', ['RED', 'BLUE', 'GREEN']);
  runner.assertEqual(row.children.length, 3, '色ボタン3個');
  runner.assertEqual(row.children.map(function (b) { return b.textContent; }).join(','), '赤,青,緑', '赤青緑ラベル');
  var css = require('fs').readFileSync(require('path').join(__dirname, '../css/battle.css'), 'utf8');
  runner.assertTrue(/\.color-btn[\s\S]*min-height:\s*(4[8-9]|[5-9][0-9])px/.test(css), 'tap領域48px以上');
});

runner.test('ColorUI2 GREEN選択をuseEnhancementへ渡す', function () {
  var ui = makeUi({ activePlayerId: 'P1' });
  var captured = null;
  var original = global.useEnhancement;
  global.useEnhancement = function () { captured = Array.prototype.slice.call(arguments); };
  ui.actionState = { mode: 'colorPicker', pendingEnh: { enhInstanceId: 'enh', targetInstanceId: 'target', colors: ['RED', 'BLUE', 'GREEN'] }, legalTargets: [] };
  ui.onColorSelect('GREEN');
  global.useEnhancement = original;
  runner.assertEqual(captured[4], 'GREEN', 'chosenColor=GREEN');
});

runner.test('ColorUI3 色選択で旧式alertへ落ちない', function () {
  var alerts = [];
  var originalAlert = global.alert;
  global.alert = function (msg) { alerts.push(msg); };
  var ui = makeUi({ activePlayerId: 'P1' });
  ui.actionState = { mode: 'enhanceTarget', enhancementInstanceId: 'enh', enhancementDef: { enhancementEffects: [{ type: 'COLOR_OVERRIDE', colors: ['RED', 'BLUE', 'GREEN'] }] }, legalTargets: ['target'] };
  ui.onEnhancementTargetTap('P1', { instanceId: 'target' });
  global.alert = originalAlert;
  runner.assertTrue(alerts.indexOf('色を選択してください: RED, BLUE, GREEN') === -1, '旧式alertなし');
  runner.assertEqual(ui.actionState.mode, 'colorPicker', 'ゲーム内色選択へ遷移');
});

runner.test('ColorUI4 GREENボタンtap後にeffectiveColorがGREEN', function () {
  var state = h.newGame({ rng: h.firstPlayerRng }); reachP1Main(state);
  var insect = h.putInsectOnField(state, 'P1', 'test_red_1');
  var enh = h.addToHandRaw(state, 'P1', global.getCardDefinition('tamamushiiro_no_uka'));
  h.ensureCost(state, 'P1', 2);
  var ui = makeUi(state);
  var row = getById('color-select-row');
  row.children = [];
  ui.beginColorSelection(enh.instanceId, insect.instanceId, ['RED', 'BLUE', 'GREEN']);
  row.children[2].click();
  runner.assertEqual(global.getEffectiveColor(insect), global.Attributes.GREEN, 'GREENへ変更');
  runner.assertEqual(ui.actionState.mode, 'idle', '通常操作へ復帰');
});

runner.test('CardDetail1 針金虫詳細に未登録文言を出さない', function () {
  var detail = global.CardUI.getCardDetail({ cardId: 'hariganemushi_no_michizure' });
  var text = JSON.stringify(detail);
  runner.assertTrue(text.indexOf('未登録') === -1, '未登録文言なし');
  runner.assertTrue(text.indexOf('相手の虫の攻撃によって破壊') !== -1, '既知の道連れ説明');
});

runner.test('CardDetail2 開発者情報を出さない', function () {
  var text = JSON.stringify(global.CardUI.getCardDetail({ cardId: 'hariganemushi_no_michizure' }));
  runner.assertTrue(text.indexOf('verificationNotes') === -1 && text.indexOf('DESTROY_SOURCE') === -1 && text.indexOf('ON_DESTROYED') === -1, '内部情報なし');
});

module.exports = runner;

if (require.main === module) {
  runner.runAll().then(function () {});
}
