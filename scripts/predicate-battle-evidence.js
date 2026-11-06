'use strict';
module.exports={
  "set8_006":{"id":"set8_006","name":"ギガスオオアリ","status":"PLAYABLE","audited":false,"source":{"verification":"CATALOG_TEXT_MATCH_PENDING_IMAGE_AUDIT","provenance":"Catalog text mapping; printed scan and specific UI/WSS paths not independently audited."},"officialRulings":[],"engine":["tests/set8-006-gigas-slash.test.js"],"cpu":["tests/set8-006-gigas-slash.test.js"],"human":["server/browser/predicate-paths.cjs"],"online":["server/test/predicate-capabilities.test.cjs"],"serialization":["tests/set8-006-gigas-slash.test.js"],"unresolvedRulings":[],"userRulings":[],"notes":"Next own turn restriction uses turn+2, not next opponent turn. Individual integration audit pending."},

  "set7_011": {
    "id":"set7_011","name":"アカオニグモ","status":"PLAYABLE","audited":false,
    "source":{"verification":"CATALOG_TEXT_MATCH_PENDING_IMAGE_AUDIT","provenance":"Canonical catalog text compared against metadata; printed scan not independently audited."},
    "officialRulings":[],"engine":["tests/set7-oni-spider-shields.test.js"],"cpu":["tests/set7-oni-spider-shields.test.js"],"human":["server/browser/predicate-paths.cjs"],"online":["server/test/predicate-capabilities.test.cjs"],"serialization":["tests/set7-oni-spider-shields.test.js"],"unresolvedRulings":[],"userRulings":[],"notes":"Next-turn first attack hit shield; independent image, CPU/UI and WSS card-specific audit pending."
  },
  "set7_012": {
    "id":"set7_012","name":"アオオニグモ","status":"PLAYABLE","audited":false,
    "source":{"verification":"CATALOG_TEXT_MATCH_PENDING_IMAGE_AUDIT","provenance":"Canonical catalog text compared against metadata; printed scan not independently audited."},
    "officialRulings":[],"engine":["tests/set7-oni-spider-shields.test.js"],"cpu":["tests/set7-oni-spider-shields.test.js"],"human":["server/browser/predicate-paths.cjs"],"online":["server/test/predicate-capabilities.test.cjs"],"serialization":["tests/set7-oni-spider-shields.test.js"],"unresolvedRulings":[],"userRulings":[],"notes":"Next-turn first spell hit shield; independent image, CPU/UI and WSS card-specific audit pending."
  },

  "set7_031": {
    "id": "set7_031",
    "name": "ニホンミツバチ",
    "status": "PLAYABLE",
    "audited": false,
    "source": {
      "image": "https://mushijingi.com/images/card/468.jpg",
      "verification": "PRINTED_SCAN_VISUALLY_CHECKED_2026-11-03",
      "provenance": "Secondary host of printed card scan; exact current catalog stats/name/color/effect checked visually. Official generic QA used separately."
    },
    "officialRulings": [
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/第７弾のカードについて/",
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/ゲームのルールについて/"
    ],
    "engine": [
      "tests/crossset-predicates.test.js"
    ],
    "cpu": [
      "tests/crossset-predicates.test.js",
      "server/browser/predicate-paths.cjs"
    ],
    "human": [
      "server/browser/predicate-paths.cjs"
    ],
    "online": [
      "server/test/predicate-capabilities.test.cjs",
      "server/browser/predicate-paths.cjs"
    ],
    "serialization": [
      "tests/crossset-predicates.test.js"
    ],
    "unresolvedRulings": [],
    "userRulings": [],
    "printedComponents": {
      "skills": [
        {
          "name": "熱殺蜂球",
          "baseAp": "X",
          "effectText": "自分の場の～バチ科の虫の数×100のダメージを与える。"
        },
        {
          "name": "ウイング・スラッピング",
          "baseAp": 0,
          "effectText": "この技は相手のコスト1以下の虫にしか使用できない。この技を受けた虫を手札に戻す。"
        }
      ],
      "traits": []
    },
    "notes": "58 direct Engine/CPU tests,17 currentcapability scenarios, Chromium/WebKit CPU+authenticatedWSS68 actualUI paths4/4. All16 printed scans checked. No provisional attack continuation copied. FinalAUDITED pending."
  },
  "set6_006": {
    "id": "set6_006",
    "name": "ツシマカブリモドキ",
    "status": "PLAYABLE",
    "audited": false,
    "source": {
      "image": "https://mushijingi.com/images/card/379.jpg",
      "verification": "PRINTED_SCAN_VISUALLY_CHECKED_2026-11-03",
      "provenance": "Secondary host of printed card scan; exact current catalog stats/name/color/effect checked visually. Official generic QA used separately."
    },
    "officialRulings": [
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/第７弾のカードについて/",
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/ゲームのルールについて/"
    ],
    "engine": [
      "tests/crossset-predicates.test.js"
    ],
    "cpu": [
      "tests/crossset-predicates.test.js",
      "server/browser/predicate-paths.cjs"
    ],
    "human": [
      "server/browser/predicate-paths.cjs"
    ],
    "online": [
      "server/test/predicate-capabilities.test.cjs",
      "server/browser/predicate-paths.cjs"
    ],
    "serialization": [
      "tests/crossset-predicates.test.js"
    ],
    "unresolvedRulings": [],
    "userRulings": [],
    "printedComponents": {
      "skills": [
        {
          "name": "かみつぶす",
          "baseAp": 400,
          "effectText": null
        },
        {
          "name": "肉食",
          "baseAp": 800,
          "effectText": "この技は自分の捨て札に虫が5つ以上あるとき使用できる。"
        }
      ],
      "traits": []
    },
    "notes": "58 direct Engine/CPU tests,17 currentcapability scenarios, Chromium/WebKit CPU+authenticatedWSS68 actualUI paths4/4. All16 printed scans checked. No provisional attack continuation copied. FinalAUDITED pending."
  },
  "set6_018": {
    "id": "set6_018",
    "name": "フェイスタメルシワバネクワガタ",
    "status": "PLAYABLE",
    "audited": false,
    "source": {
      "image": "https://mushijingi.com/images/card/391.jpg",
      "verification": "PRINTED_SCAN_VISUALLY_CHECKED_2026-11-03",
      "provenance": "Secondary host of printed card scan; exact current catalog stats/name/color/effect checked visually. Official generic QA used separately."
    },
    "officialRulings": [
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/第７弾のカードについて/",
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/ゲームのルールについて/"
    ],
    "engine": [
      "tests/crossset-predicates.test.js"
    ],
    "cpu": [
      "tests/crossset-predicates.test.js",
      "server/browser/predicate-paths.cjs"
    ],
    "human": [
      "server/browser/predicate-paths.cjs"
    ],
    "online": [
      "server/test/predicate-capabilities.test.cjs",
      "server/browser/predicate-paths.cjs"
    ],
    "serialization": [
      "tests/crossset-predicates.test.js"
    ],
    "unresolvedRulings": [],
    "userRulings": [],
    "printedComponents": {
      "skills": [
        {
          "name": "はさむ",
          "baseAp": 400,
          "effectText": null
        },
        {
          "name": "ギロチンバサミ",
          "baseAp": 700,
          "effectText": "この技はコスト5以上の虫にしか使用できない。"
        }
      ],
      "traits": []
    },
    "notes": "58 direct Engine/CPU tests,17 currentcapability scenarios, Chromium/WebKit CPU+authenticatedWSS68 actualUI paths4/4. All16 printed scans checked. No provisional attack continuation copied. FinalAUDITED pending."
  },
  "set6_021": {
    "id": "set6_021",
    "name": "チリクワガタ",
    "status": "PLAYABLE",
    "audited": false,
    "source": {
      "image": "https://mushijingi.com/images/card/394.jpg",
      "verification": "PRINTED_SCAN_VISUALLY_CHECKED_2026-11-03",
      "provenance": "Secondary host of printed card scan; exact current catalog stats/name/color/effect checked visually. Official generic QA used separately."
    },
    "officialRulings": [
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/第７弾のカードについて/",
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/ゲームのルールについて/"
    ],
    "engine": [
      "tests/crossset-predicates.test.js"
    ],
    "cpu": [
      "tests/crossset-predicates.test.js",
      "server/browser/predicate-paths.cjs"
    ],
    "human": [
      "server/browser/predicate-paths.cjs"
    ],
    "online": [
      "server/test/predicate-capabilities.test.cjs",
      "server/browser/predicate-paths.cjs"
    ],
    "serialization": [
      "tests/crossset-predicates.test.js"
    ],
    "unresolvedRulings": [],
    "userRulings": [],
    "printedComponents": {
      "skills": [
        {
          "name": "はさむ",
          "baseAp": 500,
          "effectText": null
        },
        {
          "name": "もう1つのアゴ",
          "baseAp": 1000,
          "effectText": "この技は体力が減っている虫にしか使用できない。"
        }
      ],
      "traits": []
    },
    "notes": "58 direct Engine/CPU tests,17 currentcapability scenarios, Chromium/WebKit CPU+authenticatedWSS68 actualUI paths4/4. All16 printed scans checked. No provisional attack continuation copied. FinalAUDITED pending."
  },
  "set7_015": {
    "id": "set7_015",
    "name": "キカマキリモドキ",
    "status": "PLAYABLE",
    "audited": false,
    "source": {
      "image": "https://mushijingi.com/images/card/452.jpg",
      "verification": "PRINTED_SCAN_VISUALLY_CHECKED_2026-11-03",
      "provenance": "Secondary host of printed card scan; exact current catalog stats/name/color/effect checked visually. Official generic QA used separately."
    },
    "officialRulings": [
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/第７弾のカードについて/",
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/ゲームのルールについて/"
    ],
    "engine": [
      "tests/crossset-predicates.test.js"
    ],
    "cpu": [
      "tests/crossset-predicates.test.js",
      "server/browser/predicate-paths.cjs"
    ],
    "human": [
      "server/browser/predicate-paths.cjs"
    ],
    "online": [
      "server/test/predicate-capabilities.test.cjs",
      "server/browser/predicate-paths.cjs"
    ],
    "serialization": [
      "tests/crossset-predicates.test.js"
    ],
    "unresolvedRulings": [],
    "userRulings": [],
    "printedComponents": {
      "skills": [
        {
          "name": "カマ斬撃",
          "baseAp": 200,
          "effectText": null
        },
        {
          "name": "バグイーター",
          "baseAp": 400,
          "effectText": "この技はコスト１以下の虫にしか使用できない。"
        }
      ],
      "traits": []
    },
    "notes": "58 direct Engine/CPU tests,17 currentcapability scenarios, Chromium/WebKit CPU+authenticatedWSS68 actualUI paths4/4. All16 printed scans checked. No provisional attack continuation copied. FinalAUDITED pending."
  },
  "set7_017": {
    "id": "set7_017",
    "name": "マルスゾウカブト",
    "status": "PLAYABLE",
    "audited": false,
    "source": {
      "image": "https://mushijingi.com/images/card/454.jpg",
      "verification": "PRINTED_SCAN_VISUALLY_CHECKED_2026-11-03",
      "provenance": "Secondary host of printed card scan; exact current catalog stats/name/color/effect checked visually. Official generic QA used separately."
    },
    "officialRulings": [
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/第７弾のカードについて/",
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/ゲームのルールについて/"
    ],
    "engine": [
      "tests/crossset-predicates.test.js"
    ],
    "cpu": [
      "tests/crossset-predicates.test.js",
      "server/browser/predicate-paths.cjs"
    ],
    "human": [
      "server/browser/predicate-paths.cjs"
    ],
    "online": [
      "server/test/predicate-capabilities.test.cjs",
      "server/browser/predicate-paths.cjs"
    ],
    "serialization": [
      "tests/crossset-predicates.test.js"
    ],
    "unresolvedRulings": [],
    "userRulings": [],
    "printedComponents": {
      "skills": [
        {
          "name": "ツノ突破",
          "baseAp": 700,
          "effectText": null
        },
        {
          "name": "軍神",
          "baseAp": 1400,
          "effectText": "この技は1度だけ使用できる。この技は無色の虫にしか使用できない。"
        }
      ],
      "traits": []
    },
    "notes": "58 direct Engine/CPU tests,17 currentcapability scenarios, Chromium/WebKit CPU+authenticatedWSS68 actualUI paths4/4. All16 printed scans checked. No provisional attack continuation copied. FinalAUDITED pending."
  },
  "set7_018": {
    "id": "set7_018",
    "name": "アルキデスヒラタクワガタ",
    "status": "PLAYABLE",
    "audited": false,
    "source": {
      "image": "https://mushijingi.com/images/card/455.jpg",
      "verification": "PRINTED_SCAN_VISUALLY_CHECKED_2026-11-03",
      "provenance": "Secondary host of printed card scan; exact current catalog stats/name/color/effect checked visually. Official generic QA used separately."
    },
    "officialRulings": [
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/第７弾のカードについて/",
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/ゲームのルールについて/"
    ],
    "engine": [
      "tests/crossset-predicates.test.js"
    ],
    "cpu": [
      "tests/crossset-predicates.test.js",
      "server/browser/predicate-paths.cjs"
    ],
    "human": [
      "server/browser/predicate-paths.cjs"
    ],
    "online": [
      "server/test/predicate-capabilities.test.cjs",
      "server/browser/predicate-paths.cjs"
    ],
    "serialization": [
      "tests/crossset-predicates.test.js"
    ],
    "unresolvedRulings": [],
    "userRulings": [],
    "printedComponents": {
      "skills": [
        {
          "name": "オオアゴバサミ",
          "baseAp": 800,
          "effectText": null
        },
        {
          "name": "万力バサミ",
          "baseAp": 2000,
          "effectText": "この技は強化カードがついた虫にしか使用できない。"
        }
      ],
      "traits": []
    },
    "notes": "58 direct Engine/CPU tests,17 currentcapability scenarios, Chromium/WebKit CPU+authenticatedWSS68 actualUI paths4/4. All16 printed scans checked. No provisional attack continuation copied. FinalAUDITED pending."
  },
  "set7_028": {
    "id": "set7_028",
    "name": "オキピタリスノコギリクワガタ",
    "status": "PLAYABLE",
    "audited": false,
    "source": {
      "image": "https://mushijingi.com/images/card/465.jpg",
      "verification": "PRINTED_SCAN_VISUALLY_CHECKED_2026-11-03",
      "provenance": "Secondary host of printed card scan; exact current catalog stats/name/color/effect checked visually. Official generic QA used separately."
    },
    "officialRulings": [
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/第７弾のカードについて/",
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/ゲームのルールについて/"
    ],
    "engine": [
      "tests/crossset-predicates.test.js"
    ],
    "cpu": [
      "tests/crossset-predicates.test.js",
      "server/browser/predicate-paths.cjs"
    ],
    "human": [
      "server/browser/predicate-paths.cjs"
    ],
    "online": [
      "server/test/predicate-capabilities.test.cjs",
      "server/browser/predicate-paths.cjs"
    ],
    "serialization": [
      "tests/crossset-predicates.test.js"
    ],
    "unresolvedRulings": [],
    "userRulings": [],
    "printedComponents": {
      "skills": [
        {
          "name": "はさむ",
          "baseAp": 600,
          "effectText": null
        },
        {
          "name": "万力バサミ",
          "baseAp": 1000,
          "effectText": "この技は強化カードがついた虫にしか使用できない。"
        }
      ],
      "traits": []
    },
    "notes": "58 direct Engine/CPU tests,17 currentcapability scenarios, Chromium/WebKit CPU+authenticatedWSS68 actualUI paths4/4. All16 printed scans checked. No provisional attack continuation copied. FinalAUDITED pending."
  },
  "set7_042": {
    "id": "set7_042",
    "name": "クビキリギス",
    "status": "PLAYABLE",
    "audited": false,
    "source": {
      "image": "https://mushijingi.com/images/card/479.jpg",
      "verification": "PRINTED_SCAN_VISUALLY_CHECKED_2026-11-03",
      "provenance": "Secondary host of printed card scan; exact current catalog stats/name/color/effect checked visually. Official generic QA used separately."
    },
    "officialRulings": [
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/第７弾のカードについて/",
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/ゲームのルールについて/"
    ],
    "engine": [
      "tests/crossset-predicates.test.js"
    ],
    "cpu": [
      "tests/crossset-predicates.test.js",
      "server/browser/predicate-paths.cjs"
    ],
    "human": [
      "server/browser/predicate-paths.cjs"
    ],
    "online": [
      "server/test/predicate-capabilities.test.cjs",
      "server/browser/predicate-paths.cjs"
    ],
    "serialization": [
      "tests/crossset-predicates.test.js"
    ],
    "unresolvedRulings": [],
    "userRulings": [],
    "printedComponents": {
      "skills": [
        {
          "name": "くいちぎる",
          "baseAp": 400,
          "effectText": null
        },
        {
          "name": "首切り",
          "baseAp": 800,
          "effectText": "この技は体力が減っている虫にしか使用できない。"
        }
      ],
      "traits": []
    },
    "notes": "58 direct Engine/CPU tests,17 currentcapability scenarios, Chromium/WebKit CPU+authenticatedWSS68 actualUI paths4/4. All16 printed scans checked. No provisional attack continuation copied. FinalAUDITED pending."
  },
  "set7_006": {
    "id": "set7_006",
    "name": "アオオサムシ",
    "status": "PLAYABLE",
    "audited": false,
    "source": {
      "image": "https://mushijingi.com/images/card/443.jpg",
      "verification": "PRINTED_SCAN_VISUALLY_CHECKED_2026-11-03",
      "provenance": "Secondary host of printed card scan; exact current catalog stats/name/color/effect checked visually. Official generic QA used separately."
    },
    "officialRulings": [
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/第７弾のカードについて/",
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/ゲームのルールについて/"
    ],
    "engine": [
      "tests/crossset-predicates.test.js"
    ],
    "cpu": [
      "tests/crossset-predicates.test.js",
      "server/browser/predicate-paths.cjs"
    ],
    "human": [
      "server/browser/predicate-paths.cjs"
    ],
    "online": [
      "server/test/predicate-capabilities.test.cjs",
      "server/browser/predicate-paths.cjs"
    ],
    "serialization": [
      "tests/crossset-predicates.test.js"
    ],
    "unresolvedRulings": [],
    "userRulings": [],
    "printedComponents": {
      "skills": [
        {
          "name": "かみきる",
          "baseAp": 500,
          "effectText": null
        }
      ],
      "traits": [
        {
          "name": "色彩の加護",
          "effectText": "自分のエサ場の虫の色1種類につき、これのコストを1減らす。"
        }
      ]
    },
    "notes": "58 direct Engine/CPU tests,17 currentcapability scenarios, Chromium/WebKit CPU+authenticatedWSS68 actualUI paths4/4. All16 printed scans checked. No provisional attack continuation copied. FinalAUDITED pending."
  },
  "set7_019": {
    "id": "set7_019",
    "name": "ニシキオオツバメガ",
    "status": "PLAYABLE",
    "audited": false,
    "source": {
      "image": "https://mushijingi.com/images/card/456.jpg",
      "verification": "PRINTED_SCAN_VISUALLY_CHECKED_2026-11-03",
      "provenance": "Secondary host of printed card scan; exact current catalog stats/name/color/effect checked visually. Official generic QA used separately."
    },
    "officialRulings": [
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/第７弾のカードについて/",
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/ゲームのルールについて/"
    ],
    "engine": [
      "tests/crossset-predicates.test.js"
    ],
    "cpu": [
      "tests/crossset-predicates.test.js",
      "server/browser/predicate-paths.cjs"
    ],
    "human": [
      "server/browser/predicate-paths.cjs"
    ],
    "online": [
      "server/test/predicate-capabilities.test.cjs",
      "server/browser/predicate-paths.cjs"
    ],
    "serialization": [
      "tests/crossset-predicates.test.js"
    ],
    "unresolvedRulings": [],
    "userRulings": [],
    "printedComponents": {
      "skills": [
        {
          "name": "すいつくす",
          "baseAp": 800,
          "effectText": null
        }
      ],
      "traits": [
        {
          "name": "色彩の加護",
          "effectText": "自分のエサ場の虫の色1種類につき、これのコストを1減らす。"
        }
      ]
    },
    "notes": "58 direct Engine/CPU tests,17 currentcapability scenarios, Chromium/WebKit CPU+authenticatedWSS68 actualUI paths4/4. All16 printed scans checked. No provisional attack continuation copied. FinalAUDITED pending."
  },
  "set7_033": {
    "id": "set7_033",
    "name": "オオルリタマムシ",
    "status": "PLAYABLE",
    "audited": false,
    "source": {
      "image": "https://mushijingi.com/images/card/470.jpg",
      "verification": "PRINTED_SCAN_VISUALLY_CHECKED_2026-11-03",
      "provenance": "Secondary host of printed card scan; exact current catalog stats/name/color/effect checked visually. Official generic QA used separately."
    },
    "officialRulings": [
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/第７弾のカードについて/",
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/ゲームのルールについて/"
    ],
    "engine": [
      "tests/crossset-predicates.test.js"
    ],
    "cpu": [
      "tests/crossset-predicates.test.js",
      "server/browser/predicate-paths.cjs"
    ],
    "human": [
      "server/browser/predicate-paths.cjs"
    ],
    "online": [
      "server/test/predicate-capabilities.test.cjs",
      "server/browser/predicate-paths.cjs"
    ],
    "serialization": [
      "tests/crossset-predicates.test.js"
    ],
    "unresolvedRulings": [],
    "userRulings": [],
    "printedComponents": {
      "skills": [
        {
          "name": "くいあらす",
          "baseAp": 600,
          "effectText": null
        }
      ],
      "traits": [
        {
          "name": "色彩の加護",
          "effectText": "自分のエサ場の虫の色1種類につき、これのコストを1減らす。"
        }
      ]
    },
    "notes": "58 direct Engine/CPU tests,17 currentcapability scenarios, Chromium/WebKit CPU+authenticatedWSS68 actualUI paths4/4. All16 printed scans checked. No provisional attack continuation copied. FinalAUDITED pending."
  },
  "set7_021": {
    "id": "set7_021",
    "name": "オオムラサキ",
    "status": "PLAYABLE",
    "audited": false,
    "source": {
      "image": "https://mushijingi.com/images/card/458.jpg",
      "verification": "PRINTED_SCAN_VISUALLY_CHECKED_2026-11-03",
      "provenance": "Secondary host of printed card scan; exact current catalog stats/name/color/effect checked visually. Official generic QA used separately."
    },
    "officialRulings": [
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/第７弾のカードについて/",
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/ゲームのルールについて/"
    ],
    "engine": [
      "tests/crossset-predicates.test.js"
    ],
    "cpu": [
      "tests/crossset-predicates.test.js",
      "server/browser/predicate-paths.cjs"
    ],
    "human": [
      "server/browser/predicate-paths.cjs"
    ],
    "online": [
      "server/test/predicate-capabilities.test.cjs",
      "server/browser/predicate-paths.cjs"
    ],
    "serialization": [
      "tests/crossset-predicates.test.js"
    ],
    "unresolvedRulings": [],
    "userRulings": [],
    "printedComponents": {
      "skills": [
        {
          "name": "すいつくす",
          "baseAp": 800,
          "effectText": null
        }
      ],
      "traits": [
        {
          "name": "ヤマト紫",
          "effectText": "自分の裏向きのエサ2つにつき、これのコストを1減らす。"
        }
      ]
    },
    "notes": "58 direct Engine/CPU tests,17 currentcapability scenarios, Chromium/WebKit CPU+authenticatedWSS68 actualUI paths4/4. All16 printed scans checked. No provisional attack continuation copied. FinalAUDITED pending."
  },
  "set7_029": {
    "id": "set7_029",
    "name": "コムラサキ",
    "status": "PLAYABLE",
    "audited": false,
    "source": {
      "image": "https://mushijingi.com/images/card/466.jpg",
      "verification": "PRINTED_SCAN_VISUALLY_CHECKED_2026-11-03",
      "provenance": "Secondary host of printed card scan; exact current catalog stats/name/color/effect checked visually. Official generic QA used separately."
    },
    "officialRulings": [
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/第７弾のカードについて/",
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/ゲームのルールについて/"
    ],
    "engine": [
      "tests/crossset-predicates.test.js"
    ],
    "cpu": [
      "tests/crossset-predicates.test.js",
      "server/browser/predicate-paths.cjs"
    ],
    "human": [
      "server/browser/predicate-paths.cjs"
    ],
    "online": [
      "server/test/predicate-capabilities.test.cjs",
      "server/browser/predicate-paths.cjs"
    ],
    "serialization": [
      "tests/crossset-predicates.test.js"
    ],
    "unresolvedRulings": [],
    "userRulings": [],
    "printedComponents": {
      "skills": [
        {
          "name": "すいとる",
          "baseAp": 500,
          "effectText": null
        }
      ],
      "traits": [
        {
          "name": "ヤマト紫",
          "effectText": "自分の裏向きのエサ2つにつき、これのコストを1減らす。"
        }
      ]
    },
    "notes": "58 direct Engine/CPU tests,17 currentcapability scenarios, Chromium/WebKit CPU+authenticatedWSS68 actualUI paths4/4. All16 printed scans checked. No provisional attack continuation copied. FinalAUDITED pending."
  },
  "set7_010": {
    "id": "set7_010",
    "name": "ナツアカネ",
    "status": "PLAYABLE",
    "audited": false,
    "source": {
      "image": "https://mushijingi.com/images/card/447.jpg",
      "verification": "PRINTED_SCAN_VISUALLY_CHECKED_2026-11-03",
      "provenance": "Secondary host of printed card scan; exact current catalog stats/name/color/effect checked visually. Official generic QA used separately."
    },
    "officialRulings": [
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/第７弾のカードについて/",
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/ゲームのルールについて/"
    ],
    "engine": [
      "tests/crossset-predicates.test.js"
    ],
    "cpu": [
      "tests/crossset-predicates.test.js",
      "server/browser/predicate-paths.cjs"
    ],
    "human": [
      "server/browser/predicate-paths.cjs"
    ],
    "online": [
      "server/test/predicate-capabilities.test.cjs",
      "server/browser/predicate-paths.cjs"
    ],
    "serialization": [
      "tests/crossset-predicates.test.js"
    ],
    "unresolvedRulings": [],
    "userRulings": [],
    "printedComponents": {
      "skills": [
        {
          "name": "とびかかる",
          "baseAp": 300,
          "effectText": null
        }
      ],
      "traits": [
        {
          "name": "赤とんぼ",
          "effectText": "自分の場にアキアカネがいるなら、これのコストを１減らす。"
        }
      ]
    },
    "notes": "58 direct Engine/CPU tests,17 currentcapability scenarios, Chromium/WebKit CPU+authenticatedWSS68 actualUI paths4/4. All16 printed scans checked. No provisional attack continuation copied. FinalAUDITED pending."
  },
  "set8_014": {
    "id": "set8_014",
    "name": "ニホンカワトンボ",
    "status": "PLAYABLE",
    "audited": false,
    "source": {
      "image": "https://mushijingi.com/images/card/515.jpg",
      "verification": "PRINTED_SCAN_VISUALLY_CHECKED_2026-11-03",
      "provenance": "Secondary host of printed card scan; exact current catalog stats/name/color/effect checked visually. Official generic QA used separately."
    },
    "officialRulings": [
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/第７弾のカードについて/",
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/ゲームのルールについて/"
    ],
    "engine": [
      "tests/crossset-predicates.test.js"
    ],
    "cpu": [
      "tests/crossset-predicates.test.js",
      "server/browser/predicate-paths.cjs"
    ],
    "human": [
      "server/browser/predicate-paths.cjs"
    ],
    "online": [
      "server/test/predicate-capabilities.test.cjs",
      "server/browser/predicate-paths.cjs"
    ],
    "serialization": [
      "tests/crossset-predicates.test.js"
    ],
    "unresolvedRulings": [],
    "userRulings": [],
    "printedComponents": {
      "skills": [
        {
          "name": "とびかかる",
          "baseAp": 200,
          "effectText": ""
        }
      ],
      "traits": [
        {
          "name": "川渡り",
          "effectText": "相手の青のエサが3つ以上あるとき、この虫のコストを1減らす。"
        }
      ]
    },
    "notes": "58 direct Engine/CPU tests,17 currentcapability scenarios, Chromium/WebKit CPU+authenticatedWSS68 actualUI paths4/4. All16 printed scans checked. No provisional attack continuation copied. FinalAUDITED pending."
  },
  "set7_022": {
    "id": "set7_022",
    "name": "マレーテナガコガネ",
    "status": "PLAYABLE",
    "audited": false,
    "source": {
      "image": "https://mushijingi.com/images/card/459.jpg",
      "verification": "PRINTED_SCAN_VISUALLY_CHECKED_2026-11-04"
    },
    "officialRulings": [
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/"
    ],
    "engine": [
      "tests/independent-attack.test.js"
    ],
    "cpu": [
      "tests/independent-attack.test.js"
    ],
    "human": [
      "server/browser/independent-paths.cjs"
    ],
    "online": [
      "server/test/independent.test.cjs",
      "server/browser/independent-paths.cjs"
    ],
    "serialization": [
      "tests/independent-attack.test.js",
      "server/test/independent.test.cjs"
    ],
    "unresolvedRulings": [],
    "userRulings": [],
    "printedComponents": {
      "skills": [
        {
          "name": "たいあたり",
          "baseAp": 800,
          "effectText": null
        },
        {
          "name": "テナガ強撃",
          "baseAp": 1000,
          "effectText": "この技は相手の場に虫が2つ以上いないと使用できない。"
        }
      ],
      "traits": []
    },
    "notes": "Independent of unconfirmed additional-cost source-loss path."
  },
  "set8_004": {
    "id": "set8_004",
    "name": "ハナカマキリ",
    "status": "PLAYABLE",
    "audited": false,
    "source": {
      "image": "https://mushijingi.com/images/card/505.jpg",
      "verification": "PRINTED_SCAN_VISUALLY_CHECKED_2026-11-04"
    },
    "officialRulings": [
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/"
    ],
    "engine": [
      "tests/independent-attack.test.js"
    ],
    "cpu": [
      "tests/independent-attack.test.js"
    ],
    "human": [
      "server/browser/independent-paths.cjs"
    ],
    "online": [
      "server/test/independent.test.cjs",
      "server/browser/independent-paths.cjs"
    ],
    "serialization": [
      "tests/independent-attack.test.js",
      "server/test/independent.test.cjs"
    ],
    "unresolvedRulings": [],
    "userRulings": [],
    "printedComponents": {
      "skills": [
        {
          "name": "カマ斬撃",
          "baseAp": 200,
          "effectText": ""
        },
        {
          "name": "蟷螂蘭舞",
          "baseAp": 400,
          "effectText": "この技はこれに強化カードがついていないと使用できない。攻撃後、相手の場に虫がいれば、もう1度だけ使用できる。"
        }
      ],
      "traits": []
    },
    "notes": "Independent of unconfirmed additional-cost source-loss path."
  },
  "set8_030": {
    "id": "set8_030",
    "name": "パンダアリバチ",
    "status": "PLAYABLE",
    "audited": false,
    "source": {
      "image": "https://mushijingi.com/images/card/531.jpg",
      "verification": "PRINTED_SCAN_VISUALLY_CHECKED_2026-11-04"
    },
    "officialRulings": [
      "https://mushijingi.jimdofree.com/q-a-よくある質問-1/ゲームのルールについて/"
    ],
    "engine": [
      "tests/monochrome.test.js"
    ],
    "cpu": [
      "tests/monochrome.test.js"
    ],
    "human": [
      "server/browser/monochrome-paths.cjs"
    ],
    "online": [
      "server/test/monochrome.test.cjs",
      "server/browser/monochrome-paths.cjs"
    ],
    "serialization": [
      "tests/monochrome.test.js",
      "server/test/monochrome.test.cjs"
    ],
    "unresolvedRulings": [],
    "userRulings": [],
    "printedComponents": {
      "skills": [
        {
          "name": "かみきる",
          "baseAp": 300,
          "effectText": ""
        },
        {
          "name": "モノクロ針",
          "baseAp": 0,
          "effectText": "この技は無色の虫にしか使用できない。この技を受けた虫の体力が減っていたなら、それを破壊する。※このとき相手は縄張りを引く。"
        }
      ],
      "traits": []
    },
    "notes": "Only existing Engine metadata composition; no attack-tail or cost-handling change."
  }
};
