(function (global) {
  'use strict';

  // 正式スターターカードDB。
  //
  // 注意: 現在このリポジトリ内には正式な数値・技・能力データが存在しないため、
  // いかなる数値も推測しない。カードの識別情報(名前・種別)と登録枠のみを定義し、
  // implementationStatus で「正式データ確認待ち」を明示する。
  // SPEC_COMPLETE 未満のカードはゲーム中で使用不可(isPlayable() === false)。
  //
  // 仮カード(TEST_CARDS等)は test-cards.js に分離してある。

  var SET = 'STARTER';

  // Wave A 候補として特定済みだが、正式数値(属性・コスト・HP・技名・AP)は未確認の虫
  var WAVE_A_CANDIDATES = [
    'ginyanma', 'kooniyanma', 'akiakane', 'namitentou', 'kanabun',
    'higurashi', 'tonosamabatta', 'nijuuyaahoshitentou', 'wataaburamushi'
  ];

  // 登録枠: [id, 名前, type, starterDeck]
  var STARTER_SLOTS = [
    // ---- 虫 ----
    ['ginyanma', 'ギンヤンマ', CardTypes.INSECT, 'KABUTOMUSHI'],
    ['okamakiri', 'オオカマキリ', CardTypes.INSECT, 'OKAMAKIRI'],
    ['kooniyanma', 'コオニヤンマ', CardTypes.INSECT, 'OKAMAKIRI'],
    ['seakakogegumo', 'セアカゴケグモ', CardTypes.INSECT, 'OKAMAKIRI'],
    ['akiakane', 'アキアカネ', CardTypes.INSECT, 'KABUTOMUSHI'],
    ['namitentou', 'ナミテントウ', CardTypes.INSECT, 'KABUTOMUSHI'],
    ['kabutomushi', 'カブトムシ', CardTypes.INSECT, 'KABUTOMUSHI'],
    ['namiageha', 'ナミアゲハ', CardTypes.INSECT, 'KABUTOMUSHI'],
    ['minminzemi', 'ミンミンゼミ', CardTypes.INSECT, 'OKAMAKIRI'],
    ['kanabun', 'カナブン', CardTypes.INSECT, 'KABUTOMUSHI'],
    ['higurashi', 'ヒグラシ', CardTypes.INSECT, 'OKAMAKIRI'],
    ['tonosamabatta', 'トノサマバッタ', CardTypes.INSECT, 'OKAMAKIRI'],
    ['namiageha_larva', 'ナミアゲハ（幼虫）', CardTypes.INSECT, 'KABUTOMUSHI'],
    ['nanafushimodoki', 'ナナフシモドキ', CardTypes.INSECT, 'OKAMAKIRI'],
    ['nijuuyaahoshitentou', 'ニジュウヤホシテントウ', CardTypes.INSECT, 'KABUTOMUSHI'],
    ['wataaburamushi', 'ワタアブラムシ', CardTypes.INSECT, 'OKAMAKIRI'],

    // ---- 術・強化 ----
    ['tamamushiiro_no_uka', '玉虫色の羽化', null, 'OKAMAKIRI'],
    ['hariganemushi_no_michizure', '針金虫の道連れ', null, 'OKAMAKIRI'],
    ['kamikiri_no_daigaku', '天牛の大顎', null, 'OKAMAKIRI'],
    ['minomushi_no_kakuremino', '蓑虫の隠れ蓑', null, 'KABUTOMUSHI'],
    ['niji_no_kakehashi', '虹の架け橋', null, 'OKAMAKIRI'],
    ['jinkaichu_no_bakunetsudan', '塵芥虫の爆熱弾', null, 'KABUTOMUSHI'],
    ['mushi_no_ibuki', '蟲の息吹', null, 'KABUTOMUSHI'],
    ['batta_no_kyousou', '飛蝗の凶相', null, 'KABUTOMUSHI']
  ];

  function registerStarterSlot(slot) {
    var id = slot[0];
    var isWaveACandidate = WAVE_A_CANDIDATES.indexOf(id) !== -1;
    var def = new CardDefinition({
      id: id,
      officialNumber: null, // 正式番号未確認。番号を独自作成しない。
      name: slot[1],
      set: SET,
      rarity: null,
      starterDeck: slot[3],
      type: slot[2],
      color: null,  // 未確認(null)
      cost: null,   // 未確認(null)
      baseHp: null, // 未確認(null)
      skills: [],                  // 技・能力は推測しない
      passiveAbilities: [],
      cardEffects: [],
      rulings: [],
      tags: ['starter'],
      implementationStatus: isWaveACandidate ? CardStatus.RESEARCHED : CardStatus.NOT_RESEARCHED,
      sourceLevel: SourceLevel.D,
      sourceRefs: [],
      verificationNotes: '正式データ未確認。数値・技・効果は推測しない(公式データ投入待ち)。'
    });
    cardRegistry.register(def);
    return def;
  }

  STARTER_SLOTS.forEach(registerStarterSlot);

  // ---- スターター基本虫9種の正式化(Wave C) ----
  // 系列・追加効果のない基本虫。color / cost / baseHp / skills[0].baseAp だけで
  // 既存の summonInsect / performAttack / getAttributeMultiplier により成立する。
  // カードごとの専用コードは持たない。
  var STARTER_BASIC_INSECTS = {
    ginyanma:            { officialNumber: '6/130',  color: Attributes.RED,   cost: 5, baseHp: 1100, skillId: 'tobikakaru',   skillName: 'とびかかる', ap: 700 },
    kooniyanma:          { officialNumber: '11/130', color: Attributes.RED,   cost: 4, baseHp: 800,  skillId: 'tobikakaru',   skillName: 'とびかかる', ap: 500 },
    akiakane:            { officialNumber: '24/130', color: Attributes.RED,   cost: 2, baseHp: 500,  skillId: 'tobikakaru',   skillName: 'とびかかる', ap: 200 },
    namitentou:          { officialNumber: '30/130', color: Attributes.RED,   cost: 1, baseHp: 300,  skillId: 'kamitsubusu',  skillName: 'かみつぶす', ap: 100 },
    kanabun:             { officialNumber: '63/130', color: Attributes.BLUE,  cost: 1, baseHp: 300,  skillId: 'taiatari',     skillName: 'たいあたり', ap: 100 },
    higurashi:           { officialNumber: '64/130', color: Attributes.BLUE,  cost: 2, baseHp: 200,  skillId: 'shiboritoru',  skillName: 'しぼりとる', ap: 200 },
    tonosamabatta:       { officialNumber: '71/130', color: Attributes.GREEN, cost: 5, baseHp: 1200, skillId: 'kuraitsuku',   skillName: 'くらいつく', ap: 700 },
    nijuuyaahoshitentou: { officialNumber: '91/130', color: Attributes.GREEN, cost: 2, baseHp: 300,  skillId: 'kamitsubusu',  skillName: 'かみつぶす', ap: 300 },
    wataaburamushi:      { officialNumber: '95/130', color: Attributes.GREEN, cost: 1, baseHp: 300,  skillId: 'suu',          skillName: 'すう', ap: 100 }
  };

  function formalizeStarterInsect(id, data, implementationStatus) {
    var def = cardRegistry.get(id);
    if (!def) {
      throw new Error('formalizeStarterInsect: 未登録のid: ' + id);
    }
    def.officialNumber = data.officialNumber;
    def.color = data.color;
    def.cost = data.cost;
    def.baseHp = data.baseHp;
    def.skills = [{
      id: data.skillId,
      name: data.skillName,
      baseAp: data.ap,
      additionalCost: [],
      effects: [],
      usageLimit: null,
      targetRule: null,
      timing: 'ATTACK'
    }];
    def.cardEffects = [];
    def.passiveAbilities = [];
    def.rulings = [];
    def.implementationStatus = implementationStatus;
    def.sourceLevel = SourceLevel.A;
    def.sourceRefs = ['公式スターターカードデータ'];
    def.verificationNotes = 'スターター基本虫。追加効果なし。';
    return def;
  }

  var BASIC_STATUS = CardStatus.TESTED;
  Object.keys(STARTER_BASIC_INSECTS).forEach(function (id) {
    formalizeStarterInsect(id, STARTER_BASIC_INSECTS[id], BASIC_STATUS);
  });
  global.STARTER_BASIC_INSECTS = STARTER_BASIC_INSECTS;

  // ---- ミンミンゼミ正式化(Wave D) ----
  // 公式データ: 47/130, BLUE, cost3, HP500, しぼりとる200, ＜とびだす＞
  // ＜とびだす＞: timing TERRITORY_DRAW, optional, コスト不要, 条件付き
  (function formalizeMinminzemi() {
    var def = cardRegistry.get('minminzemi');
    if (!def) { return; }
    def.officialNumber = '47/130';
    def.name = 'ミンミンゼミ';
    def.color = Attributes.BLUE;
    def.cost = 3;
    def.baseHp = 500;
    def.skills = [
      {
        id: 'shiboritoru',
        name: 'しぼりとる',
        baseAp: 200,
        additionalCost: [],
        effects: [],
        usageLimit: null,
        targetRule: null,
        timing: 'ATTACK'
      },
      {
        id: 'tobidasu',
        name: '＜とびだす＞',
        baseAp: null,
        optional: true,
        timing: 'TERRITORY_DRAW',
        effects: [
          {
            type: 'OFFER_SELF_TO_FIELD',
            condition: {
              type: 'NO_OWN_FIELD_SKILL',
              skillId: 'tobidasu'
            }
          }
        ]
      }
    ];
    def.cardEffects = [];
    def.passiveAbilities = [];
    def.rulings = [];
    def.implementationStatus = CardStatus.TESTED;
    def.sourceLevel = SourceLevel.A;
    def.sourceRefs = [
      '公式 遊び方: ＜とびだす＞は縄張りから引かれた時に発揮',
      '公式 ゲームルールQ&A: 裏返った虫は場にいない扱いなので＜とびだす＞可能',
      '公式 第1弾Q&A: 複数縄張りドローは1枚ずつ処理し、＜とびだす＞使用可否を毎回判断',
      '実カード／カードデータ照合: 47/130、青、cost3、HP500、しぼりとる200'
    ];
    def.verificationNotes = 'スターター基本虫。通常攻撃「しぼりとる」AP200。特殊技「＜とびだす＞」は縄張りドロー時に任意発動。コスト不要、自分の場に有効な＜とびだす＞持ちがいなければ使用可。';
    def.tags = ['starter', 'tobidasu'];
  })();

  // ---- セアカゴケグモ正式化(Wave F) ----
  // 公式データ: 22/130, RED, cost2, HP400, かむ100, 毒針400(1度きり)
  (function formalizeSeakakogegumo() {
    var def = cardRegistry.get('seakakogegumo');
    if (!def) { return; }
    def.officialNumber = '22/130';
    def.name = 'セアカゴケグモ';
    def.color = Attributes.RED;
    def.cost = 2;
    def.baseHp = 400;
    def.rarity = 'R';
    def.skills = [
      {
        id: 'kamu',
        name: 'かむ',
        baseAp: 100,
        additionalCost: [],
        effects: [],
        usageLimit: null,
        targetRule: null,
        timing: 'ATTACK'
      },
      {
        id: 'dokubari',
        name: '毒針',
        baseAp: 400,
        additionalCost: [],
        effects: [],
        usageLimit: 'ONCE_PER_FIELD_STAY',
        targetRule: null,
        timing: 'ATTACK'
      }
    ];
    def.cardEffects = [];
    def.passiveAbilities = [];
    def.rulings = [];
    def.implementationStatus = CardStatus.TESTED;
    def.sourceLevel = SourceLevel.A;
    def.sourceRefs = [
      '公式カードデータ: 22/130、赤、cost2、HP400、かむ100、毒針400'
    ];
    def.verificationNotes = 'スターター虫。通常攻撃「かむ」AP100。特殊攻撃「毒針」AP400は場にいる間1回のみ使用可。';
    def.tags = ['starter', 'usage-limit'];
  })();

  // ---- ナナフシモドキ正式化(Wave F) ----
  // 公式データ: 80/130, R, GREEN, cost3, HP400, かぶりつく400, ＜擬態＞
  (function formalizeNanafushimodoki() {
    var def = cardRegistry.get('nanafushimodoki');
    if (!def) { return; }
    def.officialNumber = '80/130';
    def.name = 'ナナフシモドキ';
    def.color = Attributes.GREEN;
    def.cost = 3;
    def.baseHp = 400;
    def.rarity = 'R';
    def.skills = [
      {
        id: 'kaburitsuku',
        name: 'かぶりつく',
        baseAp: 400,
        additionalCost: [],
        effects: [],
        usageLimit: null,
        targetRule: null,
        timing: 'ATTACK'
      },
      {
        id: 'gitai',
        name: '＜擬態＞',
        baseAp: null,
        additionalCost: [],
        effects: [],
        usageLimit: null,
        targetRule: null,
        timing: 'ENTER_FIELD',
        gitai: true
      }
    ];
    def.cardEffects = [];
    def.passiveAbilities = [];
    def.rulings = [];
    def.implementationStatus = CardStatus.TESTED;
    def.sourceLevel = SourceLevel.A;
    def.sourceRefs = [
      '実カード画像・カードデータ照合: 80/130、緑、cost3、HP400、かぶりつく400',
      '蟲神器公式Q&A: ＜擬態＞は場に出た次の相手のターンに攻撃を受けない',
      '2026年1月15日 公式裁定変更: 現在はカードテキスト通り「この虫から見て、場に出た次の相手のターン」に攻撃を受けない'
    ];
    def.verificationNotes = 'スターター虫。通常攻撃「かぶりつく」AP400。特殊能力「＜擬態＞」は場に出た次の相手のターンのみ攻撃対象にならず、他に攻撃対象とならない虫がいなければ直接攻撃を許す。';
    def.tags = ['starter', 'gitai'];
  })();

  // ---- ナミアゲハ正式化(Wave F) ----
  // 公式データ: 44/130, R, BLUE, cost4, HP1100, すいつくす300, ＜りんぷん＞
  (function formalizeNamiageha() {
    var def = cardRegistry.get('namiageha');
    if (!def) { return; }
    def.officialNumber = '44/130';
    def.name = 'ナミアゲハ';
    def.color = Attributes.BLUE;
    def.cost = 4;
    def.baseHp = 1100;
    def.rarity = 'R';
    def.skills = [
      {
        id: 'suitsukusu',
        name: 'すいつくす',
        baseAp: 300,
        additionalCost: [],
        effects: [],
        usageLimit: null,
        targetRule: null,
        timing: 'ATTACK'
      },
      {
        id: 'rinpun',
        name: '＜りんぷん＞',
        baseAp: null,
        additionalCost: [],
        effects: [],
        usageLimit: null,
        targetRule: 'FORCE_ATTACK_TO_SELF_GROUP',
        timing: 'PASSIVE'
      }
    ];
    def.cardEffects = [];
    def.passiveAbilities = [];
    def.rulings = [];
    def.implementationStatus = CardStatus.TESTED;
    def.sourceLevel = SourceLevel.A;
    def.sourceRefs = [
      '実カード画像照合: 44/130、青、cost4、HP1100、すいつくす300',
      '蟲神器公式 第1弾Q&A・公式Q&A: ＜りんぷん＞は相手の攻撃対象を自分(この虫)のみに限定する'
    ];
    def.verificationNotes = 'スターター虫。通常攻撃「すいつくす」AP300。特殊能力「＜りんぷん＞」は相手がこの虫以外を攻撃対象にできない。';
    def.tags = ['starter', 'force-attack-to-self'];
  })();

  // ---- ナミアゲハ（幼虫）正式化(Wave F) ----
  // 公式データ: 79/130, R, GREEN, cost3, HP700, かじる200, くさいツノ0(次のターンAP-400)
  (function formalizeNamiagehaLarva() {
    var def = cardRegistry.get('namiageha_larva');
    if (!def) { return; }
    def.officialNumber = '79/130';
    def.name = 'ナミアゲハ（幼虫）';
    def.color = Attributes.GREEN;
    def.cost = 3;
    def.baseHp = 700;
    def.rarity = 'R';
    def.skills = [
      {
        id: 'kajiru',
        name: 'かじる',
        baseAp: 200,
        additionalCost: [],
        effects: [],
        usageLimit: null,
        targetRule: null,
        timing: 'ATTACK'
      },
      {
        id: 'kusai_tsuno',
        name: 'くさいツノ',
        baseAp: 0,
        additionalCost: [],
        effects: [
          { type: 'APPLY_STAT_MODIFIER', id: 'kusai_tsuno_ap_down', stat: 'AP', amount: -400, startTurnOffset: 1, endTurnOffset: 1 }
        ],
        usageLimit: null,
        targetRule: null,
        timing: 'ATTACK'
      }
    ];
    def.cardEffects = [];
    def.passiveAbilities = [];
    def.rulings = [];
    def.implementationStatus = CardStatus.TESTED;
    def.sourceLevel = SourceLevel.A;
    def.sourceRefs = [
      '実カード画像照合: 79/130、緑、cost3、HP700、かじる200、くさいツノ0',
      '公式裁定: くさいツノは次のターン、対象虫の攻撃力を400下げる。対象が場を離れればmodifier消失'
    ];
    def.verificationNotes = 'スターター虫。通常攻撃「かじる」AP200。効果付き攻撃「くさいツノ」AP0、次のターン対象虫AP-400。擬態中の虫には不可。';
    def.tags = ['starter', 'stat-modifier', 'ap-reduction'];
  })();

  // ---- 《飛蝗の凶相》正式化(Wave F) ----
  // 公式データ: 129/130, N, SPELL, cost0
  // 効果: 使用時点で自分FIELDにいる全虫へAP+200(ターン終了まで)。使用後場へ出た虫は対象外。
  (function formalizeBattaNoKyousou() {
    var def = cardRegistry.get('batta_no_kyousou');
    if (!def) { return; }
    def.officialNumber = '129/130';
    def.name = '飛蝗の凶相';
    def.type = CardTypes.SPELL;
    def.cost = 0;
    def.color = null;
    def.baseHp = null;
    def.rarity = 'N';
    def.skills = [];
    def.cardEffects = [
      { type: 'APPLY_STAT_MODIFIER_TO_ALL_OWN_FIELD', id: 'batta_no_kyousou_ap_up', stat: 'AP', amount: 200 }
    ];
    def.passiveAbilities = [];
    def.rulings = [];
    def.implementationStatus = CardStatus.TESTED;
    def.sourceLevel = SourceLevel.A;
    def.sourceRefs = [
      '実カード画像照合: 129/130、術、cost0',
      '公式裁定: 使用時点で場にいる虫のみAP+200。ターン終了まで。使用後に場へ出た虫は対象外。'
    ];
    def.verificationNotes = 'スターター術カード。使用時点で自分FIELD全虫へAP+200(ターン終了まで)。スナップショット適用。';
    def.tags = ['starter', 'spell', 'stat-modifier', 'ap-buff'];
  })();

  // ---- 《蓑虫の隠れ蓑》正式化(Wave F) ----
  // 公式データ: 108/130, N, ENHANCEMENT, cost0
  // 効果: 自分の虫1体に装着。HP+500。虫が場を離れたら強化カードも破壊(捨て札へ)。
  (function formalizeMinomushiNoKakuremino() {
    var def = cardRegistry.get('minomushi_no_kakuremino');
    if (!def) { return; }
    def.officialNumber = '108/130';
    def.name = '蓑虫の隠れ蓑';
    def.type = CardTypes.ENHANCEMENT;
    def.cost = 0;
    def.color = null;
    def.baseHp = null;
    def.rarity = 'N';
    def.skills = [];
    def.cardEffects = [];
    def.enhancementEffects = [
      { stat: 'HP', amount: 500 }
    ];
    def.passiveAbilities = [];
    def.rulings = [];
    def.implementationStatus = CardStatus.TESTED;
    def.sourceLevel = SourceLevel.A;
    def.sourceRefs = [
      '実カード画像照合: 108/130、強化、cost0',
      '公式ルール: 強化は自分の虫のみ。複数装着可。装着虫が場を離れたら強化カードも破壊(捨て札へ)。'
    ];
    def.verificationNotes = 'スターター強化カード。自分の虫1体に装着。HP+500。装着虫離脱時DISCARD。【BLOCKED】装着時 currentHp 挙動は公式未確認。max増加のみ、currentHp変化なしで暫定実装。';
    def.tags = ['starter', 'enhancement', 'hp-buff', 'blocked-currenthp'];
  })();

  // ---- オオカマキリ正式化 ----
  // 公式データ: 7/130, SR, RED, cost4, HP800
  // 技: 共食い AP800(追加コスト:自虫破壊) / カマ連撃 AP200(攻撃後、相手場に虫がいればもう1度使用可)
  (function formalizeOkamakiri() {
    var def = cardRegistry.get('okamakiri');
    if (!def) { return; }
    def.officialNumber = '7/130';
    def.name = 'オオカマキリ';
    def.color = Attributes.RED;
    def.cost = 4;
    def.baseHp = 800;
    def.rarity = 'SR';
    def.skills = [
      {
        id: 'tomogui',
        name: '共食い',
        baseAp: 800,
        additionalCost: [
          { type: 'SACRIFICE_OWN_INSECT', amount: 1 }
        ],
        effects: [],
        usageLimit: null,
        targetRule: null,
        timing: 'ATTACK'
      },
      {
        id: 'kama_renshoku',
        name: 'カマ連撃',
        baseAp: 200,
        additionalCost: [],
        effects: [
          { type: 'CONTINUOUS_ATTACK', maxCount: 2, immediate: true, requiresOpponentFieldInsect: true }
        ],
        usageLimit: null,
        targetRule: null,
        timing: 'ATTACK'
      }
    ];
    def.cardEffects = [];
    def.passiveAbilities = [];
    def.rulings = [];
    def.implementationStatus = CardStatus.TESTED; // 専用テスト完了
    def.sourceLevel = SourceLevel.A;
    def.sourceRefs = [
      '公式カードデータ: 7/130、赤、cost4、HP800、共食い800、カマ連撃200',
      '公式Q&A: カマ連撃は攻撃後、相手場に虫がいればもう1度使用可能(最大2回)',
      '公式Q&A: 共食いは使用時にこの虫以外の自虫1体を選んで破壊'
    ];
    def.verificationNotes = 'スターター虫。通常攻撃「共食い」AP800(自虫1体破壊コスト)。「カマ連撃」AP200は攻撃後、相手場に虫がいれば連続攻撃最大2回。';
    def.tags = ['starter', 'continuous-attack', 'sacrifice-cost'];
  })();

  // ---- カブトムシ正式化 ----
  // 公式データ: 40/130, SR, BLUE, cost4, HP800
  // 技: ツノ突進 AP500 / すくい投げ AP0(相手虫1体をターン終了時まで裏返す)
  (function formalizeKabutomushi() {
    var def = cardRegistry.get('kabutomushi');
    if (!def) { return; }
    def.officialNumber = '40/130';
    def.name = 'カブトムシ';
    def.color = Attributes.BLUE;
    def.cost = 4;
    def.baseHp = 800;
    def.rarity = 'SR';
    def.skills = [
      {
        id: 'tsuno_tosshin',
        name: 'ツノ突進',
        baseAp: 500,
        additionalCost: [],
        effects: [],
        usageLimit: null,
        targetRule: null,
        timing: 'ATTACK'
      },
      {
        id: 'sukoinage',
        name: 'すくい投げ',
        baseAp: 0,
        additionalCost: [],
        effects: [
          { type: 'TURN_FACE_DOWN', target: 'DEFENDER', duration: 'UNTIL_END_OF_TURN' }
        ],
        usageLimit: null,
        targetRule: null,
        timing: 'ATTACK'
      }
    ];
    def.cardEffects = [];
    def.passiveAbilities = [];
    def.rulings = [];
    def.implementationStatus = CardStatus.TESTED; // 専用テスト完了
    def.sourceLevel = SourceLevel.A;
    def.sourceRefs = [
      '公式カードデータ: 40/130、青、cost4、HP800、ツノ突進500、すくい投げ0',
      '公式Q&A: すくい投げで裏返された虫は場にいない扱い、攻撃・効果対象不可、強化も裏返る、ターン終了時に表戻り'
    ];
    def.verificationNotes = 'スターター虫。通常攻撃「ツノ突進」AP500。「すくい投げ」AP0で相手虫1体をターン終了時まで裏返し。裏向き虫は場にいない扱い(攻撃・効果対象不可)、強化も裏返り、ターン終了時に表向きへ戻る。';
    def.tags = ['starter', 'face-down-effect'];
  })();

  // ---- 玉虫色の羽化正式化 ----
  // 公式データ: 101/130, R, ENHANCEMENT, cost2
  // 効果: この虫の色を赤か青か緑に変える(装着中持続)
  (function formalizeTamamushiiroNoUka() {
    var def = cardRegistry.get('tamamushiiro_no_uka');
    if (!def) { return; }
    def.officialNumber = '101/130';
    def.name = '玉虫色の羽化';
    def.type = CardTypes.ENHANCEMENT;
    def.rarity = 'R';
    def.cost = 2;
    def.color = null;
    def.baseHp = null;
    def.skills = [];
    def.cardEffects = [];
    def.enhancementEffects = [
      { type: 'COLOR_OVERRIDE', colors: [Attributes.RED, Attributes.BLUE, Attributes.GREEN] }
    ];
    def.passiveAbilities = [];
    def.rulings = [];
    def.implementationStatus = CardStatus.TESTED;
    def.sourceLevel = SourceLevel.A;
    def.sourceRefs = [
      '公式カードデータ: 101/130、強化、R、cost2',
      '公式カードデータ: 効果「この虫の色を赤か青か緑に変える。」'
    ];
    def.verificationNotes = 'スターター強化。装着虫の色を赤/青/緑から選択して変更。色変更は装着中持続。虫が場を離れれば強化カードもDISCARDへ行き色は戻る。エンジンはgetEffectiveColor()でattachmentのCOLOR_OVERRIDEを参照。';
    def.tags = ['starter', 'enhancement', 'color-override'];
  })();

  // ---- 針金虫の道連れ正式化 ----
  // 公式データ: 106/130, N, ENHANCEMENT, cost0
  // 効果: 装着虫が相手攻撃で破壊された時、相手虫を道連れ破壊
  (function formalizeHariganemushiNoMichizure() {
    var def = cardRegistry.get('hariganemushi_no_michizure');
    if (!def) { return; }
    def.officialNumber = '106/130';
    def.name = '針金虫の道連れ';
    def.type = CardTypes.ENHANCEMENT;
    def.rarity = 'N';
    def.cost = 0;
    def.color = null;
    def.baseHp = null;
    def.skills = [];
    def.cardEffects = [];
    def.enhancementEffects = [];
    def.passiveAbilities = [
      {
        id: 'michizure',
        name: '道連れ',
        effectText: 'この強化カードを付けた虫が相手の虫の攻撃によって破壊されたとき、その攻撃した虫も破壊する。',
        timing: 'ON_DESTROYED',
        condition: { type: 'DESTROYED_BY_OPPONENT_ATTACK' },
        effects: [
          { type: 'DESTROY_SOURCE' }
        ]
      }
    ];
    def.rulings = [];
    def.implementationStatus = CardStatus.TESTED;
    def.sourceLevel = SourceLevel.A;
    def.sourceRefs = [
      '公式カードデータ: 106/130、強化、cost0',
      '公式Q&A: 装着虫が相手虫の攻撃で破壊された時、死亡誘発として相手虫を破壊',
      '公式Q&A: 攻撃破壊と術/能力/共食い破壊を区別、同時死亡誘発はプレイヤー選択'
    ];
    def.verificationNotes = 'スターター強化。装着虫が相手攻撃で破壊された時、攻撃元の虫を道連れ破壊。destruction cause判定が必要。';
    def.tags = ['starter', 'enhancement', 'death-trigger'];
  })();

  // ---- 天牛の大顎正式化 ----
  // 公式データ: 107/130, N, ENHANCEMENT, cost0
  // 効果: 装着虫 AP+300
  (function formalizeKamikiriNoDaigaku() {
    var def = cardRegistry.get('kamikiri_no_daigaku');
    if (!def) { return; }
    def.officialNumber = '107/130';
    def.name = '天牛の大顎';
    def.type = CardTypes.ENHANCEMENT;
    def.rarity = 'N';
    def.cost = 0;
    def.color = null;
    def.baseHp = null;
    def.skills = [];
    def.cardEffects = [];
    def.enhancementEffects = [
      { stat: 'AP', amount: 300 }
    ];
    def.passiveAbilities = [];
    def.rulings = [];
    def.implementationStatus = CardStatus.TESTED;
    def.sourceLevel = SourceLevel.A;
    def.sourceRefs = [
      '公式カードデータ: 107/130、強化、cost0、AP+300',
      '公式Q&A: オオカマキリのカマ連撃では1回目・2回目とも+300適用'
    ];
    def.verificationNotes = 'スターター強化。装着虫のAP+300。attachment/enhancementEffects基盤で実装。カマ連撃の両回に適用。';
    def.tags = ['starter', 'enhancement', 'ap-buff'];
  })();

  // ---- 虹の架け橋正式化 ----
  // 公式データ: 118/130, R, SPELL, cost1
  // 効果: 自分の捨て札の虫を１つ選び、手札に加える
  (function formalizeNijiNoKakehashi() {
    var def = cardRegistry.get('niji_no_kakehashi');
    if (!def) { return; }
    def.officialNumber = '118/130';
    def.name = '虹の架け橋';
    def.type = CardTypes.SPELL;
    def.rarity = 'R';
    def.cost = 1;
    def.color = null;
    def.baseHp = null;
    def.skills = [];
    def.cardEffects = [
      { type: 'RETRIEVE_FROM_DISCARD', cardType: 'INSECT' }
    ];
    def.passiveAbilities = [];
    def.rulings = [];
    def.implementationStatus = CardStatus.TESTED;
    def.sourceLevel = SourceLevel.A;
    def.sourceRefs = [
      '公式カードデータ: 118/130、術、R、cost1',
      '公式カードデータ: 効果「自分の捨て札の虫を１つ選び、手札に加える。」'
    ];
    def.verificationNotes = 'スターター術。捨て札の虫1体を手札に加える。虫限定(術・強化は不可)。捨て札に虫がなければ使用可能だが効果は空振り。使用後自身はDISCARD。';
    def.tags = ['starter', 'spell', 'discard-recovery'];
  })();

  // ---- 塵芥虫の爆熱弾正式化 ----
  // 公式データ: 124/130, R, SPELL, cost1
  // 効果: 相手虫1体へ600ダメージ(色倍率なし)
  (function formalizeJinkaichuNoBakunetsudan() {
    var def = cardRegistry.get('jinkaichu_no_bakunetsudan');
    if (!def) { return; }
    def.officialNumber = '124/130';
    def.name = '塵芥虫の爆熱弾';
    def.type = CardTypes.SPELL;
    def.rarity = 'R';
    def.cost = 1;
    def.color = null;
    def.baseHp = null;
    def.skills = [];
    def.cardEffects = [
      {
        type: 'DEAL_DAMAGE_TO_TARGET',
        target: 'OPPONENT_FIELD_INSECT',
        amount: 600,
        ignoreAttributeMultiplier: true
      }
    ];
    def.passiveAbilities = [];
    def.rulings = [];
    def.implementationStatus = CardStatus.TESTED;
    def.sourceLevel = SourceLevel.A;
    def.sourceRefs = [
      '公式カードデータ: 124/130、術、cost1、相手虫1体600ダメージ',
      '公式Q&A: 色倍率なし。爆熱弾単体破壊では縄張りドローなし。攻撃最終ダメージで破壊なら縄張りドローあり',
      '公式Q&A: 相手場に虫がいなければ使用不可。擬態は術targetingまで禁止しない'
    ];
    def.verificationNotes = 'スターター術。相手虫1体へ600固定ダメージ(色倍率無視)。対象が擬態中でも術対象可。自力破壊なら縄張りドローなし、攻撃トドメならあり。';
    def.tags = ['starter', 'spell', 'fixed-damage'];
  })();

  // ---- スターターデッキレシピ(データ) ----
  // 各レシピは cardId -> 枚数 のマッピング。合計20枚。
  var STARTER_DECK_RECIPES = {
    KABUTOMUSHI: {
      id: 'KABUTOMUSHI',
      name: 'カブトムシデッキ',
      cardCounts: {
        ginyanma: 2,
        kabutomushi: 2,
        namiageha: 2,
        namiageha_larva: 2,
        nijuuyaahoshitentou: 2,
        akiakane: 2,
        namitentou: 2,
        kanabun: 2,
        minomushi_no_kakuremino: 1,
        jinkaichu_no_bakunetsudan: 1,
        mushi_no_ibuki: 1,
        batta_no_kyousou: 1
      }
    },
    OKAMAKIRI: {
      id: 'OKAMAKIRI',
      name: 'オオカマキリデッキ',
      cardCounts: {
        tonosamabatta: 2,
        okamakiri: 2,
        kooniyanma: 2,
        minminzemi: 2,
        nanafushimodoki: 2,
        seakakogegumo: 2,
        higurashi: 2,
        wataaburamushi: 2,
        hariganemushi_no_michizure: 1,
        kamikiri_no_daigaku: 1,
        tamamushiiro_no_uka: 1,
        niji_no_kakehashi: 1
      }
    }
  };

  // レシピ内のカードをCardDefinition参照の20枚配列へ展開するヘルパー
  function expandStarterDeck(recipe) {
    var deck = [];
    var counts = recipe.cardCounts;
    Object.keys(counts).forEach(function (cardId) {
      var def = cardRegistry.get(cardId);
      if (!def) {
        throw new Error('expandStarterDeck: 未登録のcardId: ' + cardId);
      }
      for (var i = 0; i < counts[cardId]; i++) {
        deck.push(def);
      }
    });
    return deck;
  }

  global.STARTER_SLOTS = STARTER_SLOTS;
  global.STARTER_DECK_RECIPES = STARTER_DECK_RECIPES;
  global.expandStarterDeck = expandStarterDeck;

  // ---- 《蟲の息吹》正式化(Wave B) ----
  // 公式Q&Aに基づき、この1枚だけ正式確定データで更新する。
  // 未確認項目(officialNumber / rarity / color / baseHp)はnullのまま。
  (function formalizeMushiNoIbuki() {
    var def = cardRegistry.get('mushi_no_ibuki');
    if (!def) { return; }
    def.type = CardTypes.SPELL;
    def.cost = 1;
    def.cardEffects = [
      { type: 'MOVE_SELF', from: 'HAND', to: 'FOOD' }
    ];
    def.implementationStatus = CardStatus.SPEC_COMPLETE;
    def.sourceLevel = SourceLevel.A;
    def.sourceRefs = [
      '公式Q&A: 蟲の息吹をエサ場に置いたとき、その分の1コストは使用できない'
    ];
    def.verificationNotes = '公式Q&Aに基づく。使用後エサ+1、コストは支払い分のみ減り再獲得されない。';
    def.tags = ['starter', 'spell'];
  })();

})(typeof window !== 'undefined' ? window : globalThis);
