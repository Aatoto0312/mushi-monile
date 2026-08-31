'use strict';

var TestRunner = require('./lib.js');
var h = require('./helpers.js');

var runner = new TestRunner();

// ---- Card Registry Tests ----

// Registry Test 1: テストカードと正式カードを同じRegistryから取得できる
runner.test('Registry1 テストカードと正式カードを同じRegistryから取得', function () {
  var reg = global.cardRegistry;
  var testCard = reg.get('test_red_1');
  var official = reg.get('ginyanma');
  runner.assert(testCard, 'テストカードを取得できる');
  runner.assert(official, '正式カードを取得できる');
  runner.assertEqual(testCard.set, 'TEST', 'テストカードは set=TEST');
  runner.assertEqual(official.set, 'STARTER', '正式カードは set=STARTER');
});

// Registry Test 2: 同じIDの二重登録を拒否
runner.test('Registry2 同じIDの二重登録は拒否', function () {
  var reg = new global.CardRegistry();
  var def = new global.CardDefinition({
    id: 'dup_test', name: '重複テスト', set: 'T', type: global.CardTypes.INSECT
  });
  reg.register(def);
  var dup = new global.CardDefinition({
    id: 'dup_test', name: '重複テスト2', set: 'T', type: global.CardTypes.INSECT
  });
  var threw = false;
  try {
    reg.register(dup);
  } catch (e) {
    threw = true;
  }
  runner.assert(threw, '二重登録は拒否される');
});

// Registry Test 3: 定義を取得して書き換えても他CardInstanceのruntime状態へ影響しない
// 共有シングルトンのdefault registryを汚染しないよう、テスト専用レジストリと定義を使う。
runner.test('Registry3 CardDefinition改変はCardInstanceのruntime状態へ影響しない', function () {
  var reg = new global.CardRegistry();
  var def = new global.CardDefinition({
    id: 'iso_1',
    name: '分離テスト',
    set: 'X',
    type: global.CardTypes.INSECT,
    color: global.Attributes.RED,
    cost: 1,
    baseHp: 800,
    implementationStatus: global.CardStatus.SPEC_COMPLETE
  });
  reg.register(def);
  var originalBaseHp = def.baseHp;

  // 同じ定義から2体のCardInstanceを生成
  var s = h.newGame({ rng: h.firstPlayerRng }); // P1/P2 プレイヤーを持たせる
  function makeInst() {
    var inst = new global.CardInstance({
      instanceId: s.nextInstanceId(),
      cardId: def.id,
      ownerId: 'P1',
      zone: global.ZONES.FIELD,
      currentHp: def.baseHp,
      baseHp: def.baseHp
    });
    s.player('P1').field.push(inst);
    return inst;
  }
  var a = makeInst();
  var b = makeInst();
  a.currentHp = 400; // 片方にだけダメージ

  // 定義を書き換え(DB側だけ変更)
  def.baseHp = 999999;

  runner.assertEqual(a.currentHp, 400, 'aのHPはダメージ後のまま');
  runner.assertEqual(b.currentHp, originalBaseHp, 'bのHPは生成時のbaseHpのまま');
  runner.assert(b.currentHp !== 999999, 'bのHPは定義の新値に引きずられない');
  runner.assert(def.baseHp === 999999, '定義自体の改変は反映される');

  // このテストで改変したのはテスト専用レジストリのみ。
  // default registryのtest_red_1は影響を受けていない(別テストで確認)。
});

// ---- Starter DB Tests ----

// Starter DB Test 1: スターター24種の登録枠が存在
runner.test('StarterDB1 スターター24種の登録枠が存在', function () {
  var reg = global.cardRegistry;
  var starter = reg.getBySet('STARTER');
  runner.assertEqual(starter.length, 24, 'STARTER setは24枚');
  runner.assertEqual(global.STARTER_SLOTS.length, 24, 'STARTER_SLOTSは24');
});

// Starter DB Test 2: 24種すべてのimplementationStatusを取得できる
runner.test('StarterDB2 24種すべてのimplementationStatusを取得', function () {
  var reg = global.cardRegistry;
  var starter = reg.getBySet('STARTER');
  var statuses = {};
  starter.forEach(function (def) {
    runner.assert(def.implementationStatus, 'statusが空でない: ' + def.id);
    runner.assert(statuses[def.id] === undefined, 'id重複なし: ' + def.id);
    statuses[def.id] = def.implementationStatus;
  });
});

// Starter DB Test 3: 未確認カードをゲームで勝手に使用可能にしない
runner.test('StarterDB3 未確認カードは使用不可', function () {
  var reg = global.cardRegistry;
  // 正式化されたカードはisPlayable=true
  var formalized = reg.get('tamamushiiro_no_uka'); // 正式化済みの強化カード
  runner.assertEqual(formalized.isPlayable(), true, 'TESTEDは使用可能');

  // 術/強化カードは召喚できない(虫ではない)
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1')); // food=1
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  h.addToFoodRaw(state, 'P1', h.defById('test_red_1'));
  var spellCard = h.addToHandRaw(state, 'P1', formalized);
  h.toMainPhase(state);
  var threw = false;
  try {
    global.summonInsect(state, 'P1', spellCard.instanceId);
  } catch (e) {
    threw = true;
  }
  runner.assert(threw, '強化カードの召喚は拒否(虫ではない)');

  // 対照: TESTカードは使用可能
  runner.assertEqual(global.cardRegistry.get('test_red_1').isPlayable(), true, 'テストカードは使用可');
});

// ---- Deck Recipe Tests ----

// Deck Recipe Test: 各デッキレシピが合計20枚
runner.test('DeckRecipe 両スターターデッキが合計20枚', function () {
  var recipes = global.STARTER_DECK_RECIPES;
  ['KABUTOMUSHI', 'OKAMAKIRI'].forEach(function (key) {
    var recipe = recipes[key];
    runner.assert(recipe, 'レシピ存在: ' + key);
    var counts = recipe.cardCounts;
    var total = Object.keys(counts).reduce(function (sum, cid) { return sum + counts[cid]; }, 0);
    runner.assertEqual(total, 20, recipe.name + ' は20枚');

    // 展開しても20枚
    var deck = global.expandStarterDeck(recipe);
    runner.assertEqual(deck.length, 20, recipe.name + ' 展開後20枚');
  });
});

// ---- Data Quality Tests (A.1) ----

// A.1-1: 正式化カードのcost/baseHp/color確認
runner.test('DataQuality1 正式化カードのcost/baseHp/color確認', function () {
  var def = global.cardRegistry.get('niji_no_kakehashi'); // 正式化済みの術
  runner.assertEqual(def.cost, 1, 'cost=1');
  runner.assertEqual(def.baseHp, null, 'baseHp=null(術にHPなし)');
  runner.assertEqual(def.color, null, 'color=null(術は無色)');
});

// A.1-1: 正式なcost=0は0のまま保持される(nullと区別)
runner.test('DataQuality2 正式なcost=0は0のまま保持', function () {
  var def = new global.CardDefinition({
    id: 'dq_zero', name: 'ゼロテスト', set: 'X', type: global.CardTypes.INSECT,
    color: global.Attributes.RED, cost: 0, baseHp: 0,
    implementationStatus: global.CardStatus.SPEC_COMPLETE
  });
  runner.assertEqual(def.cost, 0, 'costは0のまま');
  runner.assertEqual(def.baseHp, 0, 'baseHpは0のまま');
  runner.assert(def.cost !== null, 'costはnullではない');
  runner.assert(def.baseHp !== null, 'baseHpはnullではない');
});

// A.1-2: 術・強化カードのtype確認(全8種正式化済み)
runner.test('DataQuality3 術・強化カードtype確認', function () {
  // 全8種が正式確定
  runner.assertEqual(global.cardRegistry.get('tamamushiiro_no_uka').type, global.CardTypes.ENHANCEMENT, '玉虫色の羽化 type=ENHANCEMENT');
  runner.assertEqual(global.cardRegistry.get('niji_no_kakehashi').type, global.CardTypes.SPELL, '虹の架け橋 type=SPELL');
  // 《蟲の息吹》は正式確定しSPELL
  runner.assertEqual(global.cardRegistry.get('mushi_no_ibuki').type, global.CardTypes.SPELL, '蟲の息吹 type=SPELL');
  // 《飛蝗の凶相》は正式確定しSPELL
  runner.assertEqual(global.cardRegistry.get('batta_no_kyousou').type, global.CardTypes.SPELL, '飛蝗の凶相 type=SPELL');
  // 《蓑虫の隠れ蓑》は正式確定しENHANCEMENT
  runner.assertEqual(global.cardRegistry.get('minomushi_no_kakuremino').type, global.CardTypes.ENHANCEMENT, '蓑虫の隠れ蓑 type=ENHANCEMENT');
  // 《針金虫の道連れ》ENHANCEMENT確定
  runner.assertEqual(global.cardRegistry.get('hariganemushi_no_michizure').type, global.CardTypes.ENHANCEMENT, '針金虫の道連れ type=ENHANCEMENT');
  // 《天牛の大顎》ENHANCEMENT確定
  runner.assertEqual(global.cardRegistry.get('kamikiri_no_daigaku').type, global.CardTypes.ENHANCEMENT, '天牛の大顎 type=ENHANCEMENT');
  // 《塵芥虫の爆熱弾》SPELL確定
  runner.assertEqual(global.cardRegistry.get('jinkaichu_no_bakunetsudan').type, global.CardTypes.SPELL, '塵芥虫の爆熱弾 type=SPELL');
  // 対照: 虫16種はINSECTのまま
  runner.assertEqual(global.cardRegistry.get('ginyanma').type, global.CardTypes.INSECT, '虫はINSECT');
});

// A.1-3: default registryのtest_red_1が改変されていない(Registry3は分離済み)
runner.test('DataQuality4 default registryのtest_red_1は改変されていない', function () {
  var def = global.cardRegistry.get('test_red_1');
  runner.assertEqual(def.baseHp, 800, 'test_red_1.baseHpは800のまま');
  runner.assertEqual(def.name, 'テスト赤虫1', 'test_red_1.nameは不変');
});

module.exports = runner;
