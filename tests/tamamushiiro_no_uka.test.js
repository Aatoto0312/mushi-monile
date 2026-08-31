'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();

function tamamushiDef() {
  return global.cardRegistry.get('tamamushiiro_no_uka');
}

// Tamamushi1: 正式CardDefinition確認
runner.test('Tamamushi1 玉虫色の羽化CardDefinition', function () {
  var def = tamamushiDef();
  runner.assert(def, 'tamamushiiro_no_ukaが登録されている');
  runner.assertEqual(def.officialNumber, '101/130', 'officialNumber=101/130');
  runner.assertEqual(def.rarity, 'R', 'rarity=R');
  runner.assertEqual(def.type, global.CardTypes.ENHANCEMENT, 'type=ENHANCEMENT');
  runner.assertEqual(def.cost, 2, 'cost=2');
  runner.assertEqual(def.enhancementEffects.length, 1, 'enhancementEffects.length=1');
  runner.assertEqual(def.enhancementEffects[0].type, 'COLOR_OVERRIDE', 'effect type=COLOR_OVERRIDE');
  runner.assertEqual(def.enhancementEffects[0].colors.length, 3, 'colors.length=3');
  runner.assertEqual(def.enhancementEffects[0].colors.indexOf(global.Attributes.RED), 0, 'colors includes RED');
  runner.assertEqual(def.enhancementEffects[0].colors.indexOf(global.Attributes.BLUE), 1, 'colors includes BLUE');
  runner.assertEqual(def.enhancementEffects[0].colors.indexOf(global.Attributes.GREEN), 2, 'colors includes GREEN');
  runner.assertEqual(def.isPlayable(), true, 'isPlayable=true');
  runner.assertEqual(def.implementationStatus, global.CardStatus.TESTED, 'status=TESTED');
});

// Tamamushi2: 基本装着(cost2支払い)
runner.test('Tamamushi2 基本装着 cost2支払い', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var insect = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', insect.instanceId);

  var tamamushi = h.addToHandRaw(state, 'P1', tamamushiDef());
  runner.assertEqual(state.player('P1').availableCost, 2, 'cost=2 after summon(cost1)');
  global.useEnhancement(state, 'P1', tamamushi.instanceId, insect.instanceId, global.Attributes.RED);
  runner.assertEqual(state.player('P1').availableCost, 0, 'cost=0 after(cost2)');
  runner.assertEqual(insect.attachments.length, 1, 'attachment付与');
});

// Tamamushi3: 色変更が属性相性に影響する
runner.test('Tamamushi3 色変更が属性相性に影響 RED→RED(元GREEN)', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var greenInsect = h.putInsectOnField(state, 'P1', 'tonosamabatta');
  h.toMainPhase(state);

  var tamamushi = h.addToHandRaw(state, 'P1', tamamushiDef());
  global.useEnhancement(state, 'P1', tamamushi.instanceId, greenInsect.instanceId, global.Attributes.RED);

  // P1ターン終了 → P2ターンへ
  global.endTurn(state);
  global.enterSetPhase(state);
  global.enterMainPhase(state);
  // P2のメインフェイズ: P2のginyanma(RED)でP1の色変更虫を攻撃
  var attacker = h.putInsectOnField(state, 'P2', 'ginyanma'); // RED
  var res = global.performAttack(state, attacker.instanceId, greenInsect.instanceId, 'INSECT', 'tobikakaru');
  runner.assertEqual(res.multiplier, 1, 'RED vs RED(元GREEN)=等倍');
  runner.assertEqual(res.damageDealt, 700, '色変更で等倍ダメージ');
});

// Tamamushi4: 装着虫が場を離れると色戻る
runner.test('Tamamushi4 装着虫破壊で色戻る', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var greenInsect = h.putInsectOnField(state, 'P1', 'tonosamabatta');
  h.toMainPhase(state);

  var tamamushi = h.addToHandRaw(state, 'P1', tamamushiDef());
  global.useEnhancement(state, 'P1', tamamushi.instanceId, greenInsect.instanceId, global.Attributes.RED);

  var effColor = global.getEffectiveColor(greenInsect);
  runner.assertEqual(effColor, global.Attributes.RED, '装着中はRED');

  // 場を離れる(moveCard FIELD→DISCARD)でattachment消失
  global.moveCard(state, greenInsect.instanceId, global.ZONES.FIELD, global.ZONES.DISCARD, { playerId: 'P1' });

  runner.assertEqual(greenInsect.zone, global.ZONES.DISCARD, 'DISCARDへ');
  runner.assertEqual(greenInsect.attachments.length, 0, 'attachments消滅');
  runner.assertEqual(global.getEffectiveColor(greenInsect), global.Attributes.GREEN, '色はGREENに戻る');
});

// Tamamushi5: コスト不足で装着不可
runner.test('Tamamushi5 コスト不足で装着不可', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  var insect = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  h.toMainPhase(state); // cost=0

  var tamamushi = h.addToHandRaw(state, 'P1', tamamushiDef());
  var threw = false;
  try {
    global.useEnhancement(state, 'P1', tamamushi.instanceId, insect.instanceId, global.Attributes.RED);
  } catch (e) {
    threw = true;
  }
  runner.assert(threw, 'コスト不足で拒否');
});

// Tamamushi6: 虫が場にいないと装着不可
runner.test('Tamamushi6 虫が場にいないと装着不可', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.toMainPhase(state);

  var tamamushi = h.addToHandRaw(state, 'P1', tamamushiDef());
  var threw = false;
  try {
    global.useEnhancement(state, 'P1', tamamushi.instanceId, 'nonexistent');
  } catch (e) {
    threw = true;
  }
  runner.assert(threw, '対象不在で拒否');
});

// Tamamushi7: getEffectiveColorがCOLOR_OVERRIDEを参照
runner.test('Tamamushi7 getEffectiveColorがCOLOR_OVERRIDEを返す', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var blueInsect = h.putInsectOnField(state, 'P1', 'kanabun'); // BLUE
  h.toMainPhase(state);

  // 装着前はBLUE
  runner.assertEqual(global.getEffectiveColor(blueInsect), global.Attributes.BLUE, '装着前はBLUE');

  var tamamushi = h.addToHandRaw(state, 'P1', tamamushiDef());
  global.useEnhancement(state, 'P1', tamamushi.instanceId, blueInsect.instanceId, global.Attributes.RED);

  // 装着後はRED
  runner.assertEqual(global.getEffectiveColor(blueInsect), global.Attributes.RED, '装着後はRED');
});

// Tamamushi8: 強化カード自身はDISCARDへ
runner.test('Tamamushi8 使用後強化カードはHANDに残らない', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var insect = h.addToHandRaw(state, 'P1', h.defById('test_red_1'));
  h.toMainPhase(state);
  global.summonInsect(state, 'P1', insect.instanceId);

  var tamamushi = h.addToHandRaw(state, 'P1', tamamushiDef());
  global.useEnhancement(state, 'P1', tamamushi.instanceId, insect.instanceId, global.Attributes.RED);

  runner.assertEqual(tamamushi.zone, global.ZONES.FIELD, 'FIELD(attachment)');
  runner.assert(insect.attachments.indexOf(tamamushi) !== -1, 'insectのattachmentに存在');
});

// Tamamushi9: BLUEを選択して色変更
runner.test('Tamamushi9 BLUEを選択して色変更', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var greenInsect = h.putInsectOnField(state, 'P1', 'tonosamabatta'); // GREEN
  h.toMainPhase(state);

  var tamamushi = h.addToHandRaw(state, 'P1', tamamushiDef());
  global.useEnhancement(state, 'P1', tamamushi.instanceId, greenInsect.instanceId, global.Attributes.BLUE);

  var effColor = global.getEffectiveColor(greenInsect);
  runner.assertEqual(effColor, global.Attributes.BLUE, 'BLUEに変更される');

  // P1ターン終了 → P2ターンへ
  global.endTurn(state);
  global.enterSetPhase(state);
  global.enterMainPhase(state);
  // P2のginyanma(RED)で攻撃: RED vs BLUE = 1倍(不利なし)
  var attacker = h.putInsectOnField(state, 'P2', 'ginyanma'); // RED
  var res = global.performAttack(state, attacker.instanceId, greenInsect.instanceId, 'INSECT', 'tobikakaru');
  runner.assertEqual(res.multiplier, 1, 'RED vs BLUE=1倍(不利なし)');
  runner.assertEqual(res.damageDealt, 700, '等倍ダメージ');
});

// Tamamushi10: GREENを選択して色変更
runner.test('Tamamushi10 GREENを選択して色変更', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var redInsect = h.putInsectOnField(state, 'P1', 'ginyanma'); // RED
  h.toMainPhase(state);

  var tamamushi = h.addToHandRaw(state, 'P1', tamamushiDef());
  global.useEnhancement(state, 'P1', tamamushi.instanceId, redInsect.instanceId, global.Attributes.GREEN);

  var effColor = global.getEffectiveColor(redInsect);
  runner.assertEqual(effColor, global.Attributes.GREEN, 'GREENに変更される');

  // P1ターン終了 → P2ターンへ
  global.endTurn(state);
  global.enterSetPhase(state);
  global.enterMainPhase(state);
  // P2のtonosamabatta(GREEN)で攻撃: GREEN vs GREEN = 等倍
  var attacker = h.putInsectOnField(state, 'P2', 'tonosamabatta'); // GREEN
  var res = global.performAttack(state, attacker.instanceId, redInsect.instanceId, 'INSECT', 'kuraitsuku');
  runner.assertEqual(res.multiplier, 1, 'GREEN vs GREEN=等倍');
  runner.assertEqual(res.damageDealt, 700, '等倍ダメージ');
});

// Tamamushi11: 無効な色指定で拒否
runner.test('Tamamushi11 無効な色指定で拒否', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var insect = h.putInsectOnField(state, 'P1', 'ginyanma');
  h.toMainPhase(state);

  var tamamushi = h.addToHandRaw(state, 'P1', tamamushiDef());
  var threw = false;
  try {
    global.useEnhancement(state, 'P1', tamamushi.instanceId, insect.instanceId, 'YELLOW');
  } catch (e) {
    threw = true;
    runner.assertEqual(e.message, '無効な色です: YELLOW (有効: RED, BLUE, GREEN)', '適切なエラーメッセージ');
  }
  runner.assert(threw, '無効な色で拒否');

  // 色指定なしでも拒否
  threw = false;
  try {
    global.useEnhancement(state, 'P1', tamamushi.instanceId, insect.instanceId);
  } catch (e) {
    threw = true;
    runner.assertEqual(e.message, '色を選択してください: RED, BLUE, GREEN', '色指定なしで拒否');
  }
  runner.assert(threw, '色指定なしで拒否');
});

// Tamamushi12: 属性相性が反映される (RED有利GREEN, GREEN有利BLUE, BLUE有利RED)
runner.test('Tamamushi12 属性相性が反映される', function () {
  // 防御側の色変更: 元GREENの虫をREDに変更
  // P2のBLUEで攻撃 → BLUE有利RED = 2倍
  // P2のGREENで攻撃 → GREEN vs RED = 1倍(不利なし。REDはGREENに有利だが、GREENはREDに不利ではない)
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var greenInsect = h.putInsectOnField(state, 'P1', 'tonosamabatta');
  h.toMainPhase(state);

  var tamamushi = h.addToHandRaw(state, 'P1', tamamushiDef());
  global.useEnhancement(state, 'P1', tamamushi.instanceId, greenInsect.instanceId, global.Attributes.RED);

  // P1ターン終了 → P2ターン
  global.endTurn(state);
  global.enterSetPhase(state);
  global.enterMainPhase(state);

  // P2のBLUEで攻撃: BLUE vs RED = 2倍(BLUE有利RED)
  var attackerBlue = h.putInsectOnField(state, 'P2', 'kanabun'); // BLUE
  var resBlue = global.performAttack(state, attackerBlue.instanceId, greenInsect.instanceId, 'INSECT', 'taiatari');
  runner.assertEqual(resBlue.multiplier, 2, 'BLUE vs RED(元GREEN)=2倍(BLUE有利RED)');
  runner.assertEqual(resBlue.damageDealt, 200, '2倍ダメージ');

  // P2のターンでGREEN虫を出して攻撃: GREEN vs RED = 1倍(不利なし。有利関係は一方向のみ)
  var attackerGreen = h.putInsectOnField(state, 'P2', 'tonosamabatta'); // GREEN
  var resGreen = global.performAttack(state, attackerGreen.instanceId, greenInsect.instanceId, 'INSECT', 'kuraitsuku');
  runner.assertEqual(resGreen.multiplier, 1, 'GREEN vs RED(元GREEN)=1倍(不利なし)');
  runner.assertEqual(resGreen.damageDealt, 700, '等倍ダメージ');

  // 攻撃側の色変更: 元REDの虫をBLUEに変更 → GREEN相手に有利(2倍)
  var state2 = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state2, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state2, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state2, 'P1', h.defById('test_red_1'));
  var redInsect2 = h.putInsectOnField(state2, 'P1', 'ginyanma'); // RED
  h.toMainPhase(state2);

  var tamamushi2 = h.addToHandRaw(state2, 'P1', tamamushiDef());
  global.useEnhancement(state2, 'P1', tamamushi2.instanceId, redInsect2.instanceId, global.Attributes.BLUE);

  // P2のターンでGREEN虫を出す
  global.endTurn(state2);
  global.enterSetPhase(state2);
  global.enterMainPhase(state2);
  var greenInsect2 = h.putInsectOnField(state2, 'P2', 'tonosamabatta'); // GREEN
  global.endTurn(state2);
  global.enterSetPhase(state2);
  global.enterMainPhase(state2);
  // P1のBLUE(元RED)でP2のGREENを攻撃: BLUE vs GREEN = 1倍(不利なし。BLUEはREDに有利)
  var resGreen2 = global.performAttack(state2, redInsect2.instanceId, greenInsect2.instanceId, 'INSECT', 'tobikakaru');
  runner.assertEqual(resGreen2.multiplier, 1, 'BLUE(元RED) vs GREEN=1倍(不利なし)');
  runner.assertEqual(resGreen2.damageDealt, 700, '等倍ダメージ');
});

// Tamamushi13: FIELD離脱で色が戻る
runner.test('Tamamushi13 FIELD離脱で色が戻る', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var greenInsect = h.putInsectOnField(state, 'P1', 'tonosamabatta'); // GREEN
  h.toMainPhase(state);

  var tamamushi = h.addToHandRaw(state, 'P1', tamamushiDef());
  global.useEnhancement(state, 'P1', tamamushi.instanceId, greenInsect.instanceId, global.Attributes.BLUE);

  runner.assertEqual(global.getEffectiveColor(greenInsect), global.Attributes.BLUE, '装着中はBLUE');

  // HANDへ移動 (バウンス等)
  global.moveCard(state, greenInsect.instanceId, global.ZONES.FIELD, global.ZONES.HAND, { playerId: 'P1' });
  runner.assertEqual(greenInsect.zone, global.ZONES.HAND, 'HANDへ');
  runner.assertEqual(greenInsect.attachments.length, 0, 'attachments消滅');
  runner.assertEqual(global.getEffectiveColor(greenInsect), global.Attributes.GREEN, '色はGREENに戻る');

  // DECKへ移動
  global.moveCard(state, greenInsect.instanceId, global.ZONES.HAND, global.ZONES.DECK, { playerId: 'P1' });
  runner.assertEqual(global.getEffectiveColor(greenInsect), global.Attributes.GREEN, 'DECKでもGREEN');

  // 再度場に出す
  global.moveCard(state, greenInsect.instanceId, global.ZONES.DECK, global.ZONES.FIELD, { playerId: 'P1' });
  runner.assertEqual(global.getEffectiveColor(greenInsect), global.Attributes.GREEN, '再召喚でもGREEN');
});

module.exports = runner;
