(function (global) {
  'use strict';

  var CardTypes = {
    INSECT: 'INSECT',
    SPELL: 'SPELL',
    ENHANCEMENT: 'ENHANCEMENT'
  };

  var Attributes = {
    RED: 'RED',
    BLUE: 'BLUE',
    GREEN: 'GREEN',
    COLORLESS: 'COLORLESS'
  };

  // 実装ステータス。SPEC_COMPLETE 以上でなければゲーム中で使用可能と見なさない。
  var CardStatus = {
    NOT_RESEARCHED: 'NOT_RESEARCHED',
    RESEARCHED: 'RESEARCHED',
    SPEC_COMPLETE: 'SPEC_COMPLETE',
    IMPLEMENTED: 'IMPLEMENTED',
    TESTED: 'TESTED',
    // テスト専用データ用(既存の test_* カード)
    TEST: 'test'
  };

  // 情報源の信頼度
  var SourceLevel = {
    A: 'A', // 公式HP・公式Q&A・公式ルール・公式ガイド
    B: 'B', // 公式商品情報
    C: 'C', // 非公式検索サイト・Wiki
    D: 'D'  // SNS・動画・プレイヤー投稿
  };

  function CardDefinition(opts) {
    opts = opts || {};
    this.id = opts.id;
    this.officialNumber = opts.officialNumber || null;
    this.name = opts.name;
    this.set = opts.set || null;
    this.rarity = opts.rarity || null;
    this.starterDeck = opts.starterDeck || null;

    this.type = opts.type != null ? opts.type : null;
    // color/cost/baseHp は「正式に無色・0・0」「未確認null」を区別するため、
    // null を 0 や COLORLESS に置き換えない。
    this.color = opts.color != null ? opts.color : null;
    this.cost = opts.cost != null ? opts.cost : null;
    this.baseHp = opts.baseHp != null ? opts.baseHp : null;

    this.skills = opts.skills || [];
    this.passiveAbilities = opts.passiveAbilities || [];
    this.cardEffects = opts.cardEffects || [];

    this.rulings = opts.rulings || [];
    this.tags = opts.tags || [];

    this.implementationStatus = opts.implementationStatus || CardStatus.NOT_RESEARCHED;

    this.sourceLevel = opts.sourceLevel || SourceLevel.D;
    this.sourceRefs = opts.sourceRefs || [];
    this.verificationNotes = opts.verificationNotes || null;
  }

  // ゲーム中で使用可能か。SPEC_COMPLETE 以上。
  CardDefinition.prototype.isPlayable = function () {
    var order = {
      NOT_RESEARCHED: 0,
      RESEARCHED: 1,
      SPEC_COMPLETE: 2,
      IMPLEMENTED: 3,
      TESTED: 4
    };
    var current = this.implementationStatus;
    var threshold = 2; // SPEC_COMPLETE
    var isTest = current === CardStatus.TEST; // テストカードは特別に使用可能
    return isTest || (order[current] != null && order[current] >= threshold);
  };

  CardDefinition.CardTypes = CardTypes;
  CardDefinition.Attributes = Attributes;
  CardDefinition.CardStatus = CardStatus;
  CardDefinition.SourceLevel = SourceLevel;

  global.CardTypes = CardTypes;
  global.Attributes = Attributes;
  global.CardStatus = CardStatus;
  global.SourceLevel = SourceLevel;
  global.CardDefinition = CardDefinition;
})(typeof window !== 'undefined' ? window : globalThis);
