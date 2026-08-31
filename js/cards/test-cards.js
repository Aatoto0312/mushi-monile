(function (global) {
  'use strict';

  // テスト専用カード。正式カードDB(starter-cards.js)とは分離する。
  // 基本召喚・通常攻撃を確認するためのみに使う。
  // これらは CardStatus.TEST として扱い、正式データとは混在させない。

  function makeTestInsect(defId, name, color, cost, hp, ap, index) {
    return new CardDefinition({
      id: defId,
      officialNumber: null,
      name: name,
      set: 'TEST',
      rarity: 'C',
      type: CardTypes.INSECT,
      color: color,
      cost: cost,
      baseHp: hp,
      skills: [
        {
          id: 'attack',
          name: 'こうげき',
          type: 'ATTACK',
          baseAp: ap,
          additionalCost: [],
          effects: [],
          usageLimit: null,
          targetRule: null,
          timing: 'ATTACK'
        }
      ],
      implementationStatus: CardStatus.TEST,
      sourceLevel: SourceLevel.D,
      sourceRefs: [],
      verificationNotes: 'ビルド1〜2の動作確認用テストカード。正式データではない。'
    });
  }

  var TEST_CARDS = [
    makeTestInsect('test_red_1', 'テスト赤虫1', Attributes.RED, 1, 800, 500, 1),
    makeTestInsect('test_red_2', 'テスト赤虫2', Attributes.RED, 2, 1000, 700, 2),
    makeTestInsect('test_blue_1', 'テスト青虫1', Attributes.BLUE, 1, 700, 500, 3),
    makeTestInsect('test_blue_2', 'テスト青虫2', Attributes.BLUE, 2, 900, 700, 4),
    makeTestInsect('test_green_1', 'テスト緑虫1', Attributes.GREEN, 1, 900, 400, 5),
    makeTestInsect('test_green_2', 'テスト緑虫2', Attributes.GREEN, 2, 1100, 600, 6)
  ];

  // 20枚構築: 各テストカードを複数枚払い出す
  function buildStarterTestDeck() {
    var deck = [];
    var counts = {
      test_red_1: 4,
      test_red_2: 3,
      test_blue_1: 4,
      test_blue_2: 3,
      test_green_1: 3,
      test_green_2: 3
    };
    TEST_CARDS.forEach(function (def) {
      var n = counts[def.id] || 2;
      for (var i = 0; i < n; i++) {
        deck.push(def);
      }
    });
    return deck;
  }

  // レジストリへ登録
  TEST_CARDS.forEach(function (def) {
    cardRegistry.register(def);
  });

  // ---- テスト用SPELL(術の汎用パイプライン確認用) ----
  // 正式カードDB(starter-cards.js)とは分離し、基本の術パイプライン
  // (HAND→RESOLVING→DISCARD)を確認するためのみに使う。
  // 公式データではないため CardStatus.TEST。
  var TEST_SPELL_CARDS = [
    new CardDefinition({
      id: 'test_spell_1',
      officialNumber: null,
      name: 'テスト術1',
      set: 'TEST',
      rarity: 'C',
      type: CardTypes.SPELL,
      color: null,
      cost: 1,
      baseHp: null,
      skills: [],
      passiveAbilities: [],
      cardEffects: [], // MOVE_SELFなし → 基本終了先DISCARD
      implementationStatus: CardStatus.TEST,
      sourceLevel: SourceLevel.D,
      sourceRefs: [],
      verificationNotes: '術パイプライン確認用テストカード。DISCARDへ捨てられる。'
    })
  ];

  TEST_SPELL_CARDS.forEach(function (def) {
    cardRegistry.register(def);
  });

  global.TEST_CARDS = TEST_CARDS;
  global.TEST_SPELL_CARDS = TEST_SPELL_CARDS;
  global.buildStarterTestDeck = buildStarterTestDeck;
})(typeof window !== 'undefined' ? window : globalThis);
