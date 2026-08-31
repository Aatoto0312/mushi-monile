'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();

function okamakiriDef() {
  return global.cardRegistry.get('okamakiri');
}

runner.test('Okamakiri1 CardDefinition基本確認', function () {
  var def = okamakiriDef();
  runner.assertEqual(def.officialNumber, '7/130', 'officialNumber=7/130');
  runner.assertEqual(def.color, global.Attributes.RED, 'color=RED');
  runner.assertEqual(def.cost, 4, 'cost=4');
  runner.assertEqual(def.baseHp, 800, 'baseHp=800');
  runner.assertEqual(def.rarity, 'SR', 'rarity=SR');
  runner.assertEqual(def.implementationStatus, global.CardStatus.TESTED, 'status=TESTED');
  
  var skillNames = def.skills.map(function(s) { return s.name; });
  runner.assert(skillNames.indexOf('共食い') !== -1, '技: 共食い');
  runner.assert(skillNames.indexOf('カマ連撃') !== -1, '技: カマ連撃');
  
  var tomogui = def.skills.find(function(s) { return s.id === 'tomogui'; });
  runner.assertEqual(tomogui.baseAp, 800, '共食い AP=800');
  runner.assertEqual(tomogui.additionalCost.length, 1, '追加コスト1つ');
  runner.assertEqual(tomogui.additionalCost[0].type, 'SACRIFICE_OWN_INSECT', 'コスト: 自虫破壊');
  
  var kamaRenshoku = def.skills.find(function(s) { return s.id === 'kama_renshoku'; });
  runner.assertEqual(kamaRenshoku.baseAp, 200, 'カマ連撃 AP=200');
  runner.assertEqual(kamaRenshoku.effects.length, 1, '効果1つ');
  runner.assertEqual(kamaRenshoku.effects[0].type, 'CONTINUOUS_ATTACK', '効果: 連続攻撃');
  runner.assertEqual(kamaRenshoku.effects[0].maxCount, 2, '最大2回');
  runner.assertEqual(kamaRenshoku.effects[0].requiresOpponentFieldInsect, true, '相手場に虫が必要');
});

runner.test('Okamakiri2 召喚可能', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  
  // エサ6枚
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  
  var okamakiri = h.addToHandRaw(state, 'P1', okamakiriDef());
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', okamakiri.instanceId);
  
  var field = state.player('P1').field;
  runner.assertEqual(field.length, 1, '場に1体');
  runner.assertEqual(field[0].cardId, 'okamakiri', 'オオカマキリが場に');
  runner.assertEqual(field[0].currentHp, 800, 'HP=800');
});

runner.test('Okamakiri3 共食い - 自虫破壊コストで攻撃', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var okamakiriDef = global.cardRegistry.get('okamakiri');
  
  // エサ6枚
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  
  // 自虫を2体場に出す
  var insect1 = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  var insect2 = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', insect1.instanceId);
  global.summonInsect(state, 'P1', insect2.instanceId);
  
  // オオカマキリ召喚
  var okamakiri = h.addToHandRaw(state, 'P1', okamakiriDef);
  global.summonInsect(state, 'P1', okamakiri.instanceId);
  
  // 相手に虫を出す (直接配置)
  var target = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 1000 });
  
  // 共食いを使用
  var okamakiriInst = state.player('P1').field.find(function(c) { return c.cardId === 'okamakiri'; });
  
  global.performAttack(state, okamakiriInst.instanceId, target.instanceId, 'INSECT', 'tomogui');
  
  // 自虫1体が破壊された (追加コスト)
  var p1Field = state.player('P1').field.filter(function(c) { return c.cardId !== 'okamakiri'; });
  runner.assertEqual(p1Field.length, 1, '自虫1体が破壊された (残り1体)');
  
  // 相手虫にダメージ
  runner.assert(target.currentHp < target.baseHp, '相手虫にダメージ');
});

runner.test('Okamakiri4 共食い - 自虫がいない場合は失敗', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var okamakiriDef = global.cardRegistry.get('okamakiri');
  
  // エサ6枚
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  
  // オオカマキリのみ召喚 (他の自虫なし)
  var okamakiri = h.addToHandRaw(state, 'P1', okamakiriDef);
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', okamakiri.instanceId);
  
  // 相手に虫を出す (直接配置)
  var target = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 1000 });
  
  var okamakiriInst = state.player('P1').field.find(function(c) { return c.cardId === 'okamakiri'; });
  
  var threw = false;
  try {
    global.performAttack(state, okamakiriInst.instanceId, target.instanceId, 'INSECT', 'tomogui');
  } catch (e) {
    threw = true;
  }
  runner.assert(threw, '自虫がいない場合は共食い失敗');
});

runner.test('Okamakiri5 カマ連撃 - 相手場に表向き虫がいれば連続攻撃可', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var okamakiriDef = global.cardRegistry.get('okamakiri');
  
  // エサ4枚
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  
  var okamakiri = h.addToHandRaw(state, 'P1', okamakiriDef);
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', okamakiri.instanceId);
  
  // 相手に虫を出す (直接配置)
  var target = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 1000 });
  
  var okamakiriInst = state.player('P1').field.find(function(c) { return c.cardId === 'okamakiri'; });
  
  var result = global.performAttack(state, okamakiriInst.instanceId, target.instanceId, 'INSECT', 'kama_renshoku');
  
  runner.assertEqual(result.continuousAttackAvailable, true, '連続攻撃可能フラグ');
  runner.assert(okamakiriInst.runtimeFlags && okamakiriInst.runtimeFlags.continuousAttack, '連続攻撃フラグ設定済み');
  runner.assertEqual(okamakiriInst.runtimeFlags.continuousAttack.maxCount, 2, '最大2回');
  runner.assertEqual(okamakiriInst.runtimeFlags.continuousAttack.usedCount, 1, '1回使用済み');
});

runner.test('Okamakiri6 カマ連撃 - 相手場に虫がいなければ連続攻撃不可', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var okamakiriDef = global.cardRegistry.get('okamakiri');
  
  // エサ6枚
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  
  var okamakiri = h.addToHandRaw(state, 'P1', okamakiriDef);
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', okamakiri.instanceId);
  
  // 相手に虫なし
  
  var okamakiriInst = state.player('P1').field.find(function(c) { return c.cardId === 'okamakiri'; });
  
  // 直接攻撃 (LEADER) - カマ連撃を使用
  var result = global.performAttack(state, okamakiriInst.instanceId, null, 'LEADER', 'kama_renshoku');
  
  // continuousAttackAvailable は設定されない(undefined) = 連続攻撃不可
  runner.assert(!result.continuousAttackAvailable, '相手虫なしで連続攻撃不可');
});

runner.test('Okamakiri7 カマ連撃 - 相手に裏向き虫のみなら連続攻撃不可', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var okamakiriDef = global.cardRegistry.get('okamakiri');
  var kabutomushiDef = global.cardRegistry.get('kabutomushi');
  
  // エサ6枚
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  
  var okamakiri = h.addToHandRaw(state, 'P1', okamakiriDef);
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', okamakiri.instanceId);
  
  // 相手にカブトムシを出し、すくい投げで裏返す (直接配置)
  var p2Kabuto = h.putInsectOnField(state, 'P2', 'kabutomushi', { hp: 800 });
  p2Kabuto.faceDown = true;
  p2Kabuto.runtimeFlags = { faceDownUntil: 'UNTIL_END_OF_TURN' };
  
  var okamakiriInst = state.player('P1').field.find(function(c) { return c.cardId === 'okamakiri'; });
  
  // カマ連撃で直接攻撃 (合法対象0) - カマ連撃を使用
  // 裏向き虫は isAttackTargetable=false なので、LEADERが合法対象になる
  var result = global.performAttack(state, okamakiriInst.instanceId, null, 'LEADER', 'kama_renshoku');
  
  // 裏向き虫は「場にいない扱い」なので連続攻撃不可
  runner.assert(!result.continuousAttackAvailable, '裏向き虫のみで連続攻撃不可');
});

runner.test('Okamakiri8 カマ連撃 - 擬態虫がいても相手場に虫がいれば連続攻撃可', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var okamakiriDef = global.cardRegistry.get('okamakiri');
  var nanafushiDef = global.cardRegistry.get('nanafushimodoki');
  
  // エサ6枚
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  
  var okamakiri = h.addToHandRaw(state, 'P1', okamakiriDef);
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', okamakiri.instanceId);
  
  // 相手FIELDに2体配置:
  // 1. 擬態保護中のナナフシモドキ (次の相手ターンで保護: gitaiProtectedTurn = state.turnNumber + 1)
  // 2. 攻撃可能な別の虫
  var nanafushi = h.putInsectOnField(state, 'P2', 'nanafushimodoki', { hp: 400 });
  nanafushi.runtimeFlags = { gitaiProtectedTurn: state.turnNumber + 1 }; // 次の相手ターンで保護
  
  var target = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 1000 }); // 攻撃可能な虫
  
  var okamakiriInst = state.player('P1').field.find(function(c) { return c.cardId === 'okamakiri'; });
  
  // 事前確認: 現在のターンでは擬態未発動なのでナナフシは攻撃可能
  runner.assertEqual(global.isAttackTargetable(state, nanafushi), true, '現在ターンでは擬態未発動で攻撃可能');
  runner.assertEqual(global.isAttackTargetable(state, target), true, '別の虫は攻撃可能');
  
  // カマ連撃で攻撃可能な虫(target)を攻撃
  // ナナフシはfaceDownではないため「場にいる」扱いでカマ連撃条件を満たす
  var result = global.performAttack(state, okamakiriInst.instanceId, target.instanceId, 'INSECT', 'kama_renshoku');
  
  // 1回目でtargetが残っているため連続攻撃可 (ナナフシも面向きで場にいる)
  runner.assertEqual(result.continuousAttackAvailable, true, '擬態虫が残っていれば連続攻撃可');
  
  // 次の相手ターン(P2のターン)に進めると擬態が発動し攻撃不可になる
  // turnNumber を次の相手ターンの値に合わせる
  // 現在 turnNumber=1 (P1ターン)。次の相手ターンは turnNumber=2
  state.turnNumber = state.turnNumber + 1; // turnNumber=2 (P2のターン相当)
  
  var threw = false;
  try {
    global.performAttack(state, okamakiriInst.instanceId, nanafushi.instanceId, 'INSECT', 'kama_renshoku');
  } catch (e) {
    threw = true;
  }
  runner.assert(threw, '次の相手ターンでは擬態虫は攻撃対象外');
  
  // さらに次のP1ターンでは擬態が解除されて再び攻撃可能
  state.turnNumber = state.turnNumber + 1; // turnNumber=3 (次のP1ターン相当)
  
  threw = false;
  try {
    global.performAttack(state, okamakiriInst.instanceId, nanafushi.instanceId, 'INSECT', 'kama_renshoku');
  } catch (e) {
    threw = true;
  }
  runner.assert(!threw, '擬態終了後は再び攻撃可能');
});

runner.test('Okamakiri12 カマ連撃 - 相手最後の1体を1回目で破壊した場合2回目不可', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var okamakiriDef = global.cardRegistry.get('okamakiri');
  
  // エサ4枚
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  
  var okamakiri = h.addToHandRaw(state, 'P1', okamakiriDef);
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', okamakiri.instanceId);
  
  // 相手に虫1体のみ (カマ連撃で破壊可能なHP)
  // test_green_1: HP900, GREEN. RED→GREEN=x2. カマ連撃AP200→400ダメージ
  // HP900には足りないので test_red_1 (HP800) を使う
  // RED→RED=x1. AP200では破壊できない
  // 代わりに test_blue_1 (HP700, BLUE). RED→BLUE=x0.5. AP200→100ダメージ
  // これでは無理
  // 高HPの虫を直接配置する: HP200以下の虫を作る
  var target = h.putInsectOnField(state, 'P2', 'test_green_1', { hp: 300 }); // HP300
  // カマ連撃AP200、RED→GREEN=x2 → 400ダメージで破壊
  
  var okamakiriInst = state.player('P1').field.find(function(c) { return c.cardId === 'okamakiri'; });
  
  // 1回目のカマ連撃で最後の1体を破壊
  var result = global.performAttack(state, okamakiriInst.instanceId, target.instanceId, 'INSECT', 'kama_renshoku');
  
  // 破壊されたことを確認
  runner.assertEqual(target.currentHp, -100, '1回目で破壊される'); // 300 - 400 = -100
  
  // 相手FIELDが空になったため連続攻撃不可
  runner.assert(!result.continuousAttackAvailable, '相手場が空なら連続攻撃不可');
  
  // continuousAttackフラグも削除されている
  runner.assertEqual(okamakiriInst.runtimeFlags.continuousAttack, undefined, 'フラグ削除済み');
});

runner.test('Okamakiri9 カマ連撃 - 2回目の攻撃実行', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var okamakiriDef = global.cardRegistry.get('okamakiri');
  
  // エサ6枚 (カマ連撃2回分)
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  
  var okamakiri = h.addToHandRaw(state, 'P1', okamakiriDef);
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', okamakiri.instanceId);
  
  // 相手に虫2体 (直接配置)
  var target1 = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 1000 });
  var target2 = h.putInsectOnField(state, 'P2', 'test_blue_2', { hp: 1000 });
  
  var okamakiriInst = state.player('P1').field.find(function(c) { return c.cardId === 'okamakiri'; });
  
  // 1回目のカマ連撃
  var result1 = global.performAttack(state, okamakiriInst.instanceId, target1.instanceId, 'INSECT', 'kama_renshoku');
  
  runner.assertEqual(result1.continuousAttackAvailable, true, '1回目後は連続攻撃可');
  runner.assertEqual(okamakiriInst.attackedThisTurn, true, '攻撃済みフラグON');
  
  // 2回目の攻撃実行 - continuousAttackフラグがあるため攻撃済みでも許可される
  // このテストでは、2回目を実際に実行できるかを確認
  // attackedThisTurnがtrueでも、continuousAttack中なら許可される実装が必要
  runner.assert(okamakiriInst.runtimeFlags.continuousAttack.usedCount === 1, '1回使用済み');
  runner.assert(okamakiriInst.runtimeFlags.continuousAttack.immediate === true, '即時連続攻撃');
  
  // 実装確認: 2回目のperformAttackが成功するか
  // (この時点では attackedThisTurn=true なので通常はエラー)
  // continuousAttackフラグをチェックして許可する実装が必要
  var threw = false;
  var errorMsg = '';
  try {
    global.performAttack(state, okamakiriInst.instanceId, target2.instanceId, 'INSECT', 'kama_renshoku');
  } catch (e) {
    threw = true;
    errorMsg = e.message;
  }
  if (threw) {
    console.log('Error on 2nd attack:', errorMsg);
  }
  runner.assert(!threw, '2回目の攻撃は実行可能');
  
  // 2回目後: usedCount=2, continuousAttackフラグ削除済み
  runner.assertEqual(okamakiriInst.runtimeFlags.continuousAttack, undefined, '2回目後に連続攻撃フラグ削除');
});

runner.test('Okamakiri10 カマ連撃 - 3回目は禁止される', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var okamakiriDef = global.cardRegistry.get('okamakiri');
  
  // エサ8枚 (カマ連撃3回分)
  for (var i = 0; i < 8; i++) {
    h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  }
  
  var okamakiri = h.addToHandRaw(state, 'P1', okamakiriDef);
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', okamakiri.instanceId);
  
  // 相手に虫3体 (test_blue_1, test_blue_2, test_red_1 を再利用)
  var target1 = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 1000 });
  var target2 = h.putInsectOnField(state, 'P2', 'test_blue_2', { hp: 1000 });
  var target3 = h.putInsectOnField(state, 'P2', 'test_red_1', { hp: 1000 });
  
  var okamakiriInst = state.player('P1').field.find(function(c) { return c.cardId === 'okamakiri'; });
  
  // 1回目のカマ連撃
  var result1 = global.performAttack(state, okamakiriInst.instanceId, target1.instanceId, 'INSECT', 'kama_renshoku');
  runner.assertEqual(result1.continuousAttackAvailable, true, '1回目後は連続攻撃可');
  runner.assertEqual(okamakiriInst.runtimeFlags.continuousAttack.usedCount, 1, '1回使用済み');
  
  // 2回目のカマ連撃
  var result2 = global.performAttack(state, okamakiriInst.instanceId, target2.instanceId, 'INSECT', 'kama_renshoku');
  runner.assertEqual(result2.continuousAttackAvailable, false, '2回目後は連続攻撃不可');
  runner.assertEqual(okamakiriInst.runtimeFlags.continuousAttack, undefined, '2回目後にフラグ削除');
  runner.assertEqual(okamakiriInst.attackedThisTurn, true, '攻撃済みフラグON');
  
  // 3回目を試行 - 必ず例外 (attackedThisTurn=trueでcontinuousAttackもない)
  var threw = false;
  try {
    global.performAttack(state, okamakiriInst.instanceId, target3.instanceId, 'INSECT', 'kama_renshoku');
  } catch (e) {
    threw = true;
  }
  runner.assert(threw, '3回目は禁止される');
});

runner.test('Okamakiri11 カマ連撃 - 2回目に別スキル使用不可', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var okamakiriDef = global.cardRegistry.get('okamakiri');
  
  // エサ8枚
  for (var i = 0; i < 8; i++) {
    h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  }
  
  var okamakiri = h.addToHandRaw(state, 'P1', okamakiriDef);
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', okamakiri.instanceId);
  
  // 相手に虫2体 + 自虫1体 (共食い用)
  var target1 = h.putInsectOnField(state, 'P2', 'test_blue_1', { hp: 1000 });
  var target2 = h.putInsectOnField(state, 'P2', 'test_blue_2', { hp: 1000 });
  var sacrificeInsect = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  global.summonInsect(state, 'P1', sacrificeInsect.instanceId);
  
  var okamakiriInst = state.player('P1').field.find(function(c) { return c.cardId === 'okamakiri'; });
  
  // 1回目のカマ連撃
  var result1 = global.performAttack(state, okamakiriInst.instanceId, target1.instanceId, 'INSECT', 'kama_renshoku');
  runner.assertEqual(result1.continuousAttackAvailable, true, '1回目後は連続攻撃可');
  
  // 2回目に共食いを使おうとする → 禁止 (skillId不一致)
  var threw = false;
  try {
    global.performAttack(state, okamakiriInst.instanceId, target2.instanceId, 'INSECT', 'tomogui');
  } catch (e) {
    threw = true;
  }
  runner.assert(threw, 'カマ連撃中に別スキル使用不可');
  
  // continuousAttackフラグは残っている (kama_renshoku専用)
  runner.assert(okamakiriInst.runtimeFlags.continuousAttack, '連続攻撃フラグ残存');
  runner.assertEqual(okamakiriInst.runtimeFlags.continuousAttack.skillId, 'kama_renshoku', 'スキルIDはkama_renshoku');
});

module.exports = runner;