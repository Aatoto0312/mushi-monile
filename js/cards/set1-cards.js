(function (global) {
  'use strict';

  // Booster Set 1 (106 cards). Generated from the repository knowledge base,
  // then enriched with structured mechanics below. Runtime dispatch never uses card names.
  var CATALOGUE = [
    {
      "number": 1,
      "officialNumber": "1/130",
      "name": "ニセハナマオウカマキリ",
      "rarity": "LR",
      "type": "INSECT",
      "color": "RED",
      "cost": 6,
      "baseHp": 1600,
      "skills": [
        {
          "name": "神のカマ連撃",
          "baseAp": 300,
          "effectSummary": "攻撃後に相手の場に虫がいれば、直後にもう1回だけこの技を使える。"
        },
        {
          "name": "共食い",
          "baseAp": 2000,
          "effectSummary": "使用条件として、この虫以外の自分の虫1体を破壊する。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "ヨウカイカマキリ科",
        "連続攻撃と共食いは別処理。対象・破壊原因・縄張り取得を混同しない。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 2,
      "officialNumber": "2/130",
      "name": "リオック",
      "rarity": "SR",
      "type": "INSECT",
      "color": "RED",
      "cost": 5,
      "baseHp": 800,
      "skills": [
        {
          "name": "かみちぎる",
          "baseAp": 600,
          "effectSummary": null
        }
      ],
      "traits": [
        {
          "name": "エサにする",
          "baseAp": null,
          "effectSummary": "場に出す際、通常コストの代わりに自分の場の虫2体を破壊して出せる。"
        }
      ],
      "effectSummary": null,
      "rulings": [
        "クロギリス科",
        "代替コストとしての破壊は、虫の攻撃による破壊ではない。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 3,
      "officialNumber": "3/130",
      "name": "メキシカンレッドニー",
      "rarity": "SR",
      "type": "INSECT",
      "color": "RED",
      "cost": 5,
      "baseHp": 1400,
      "skills": [
        {
          "name": "かむ",
          "baseAp": 700,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "オオツチグモ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 4,
      "officialNumber": "4/130",
      "name": "オニヤンマ",
      "rarity": "SR",
      "type": "INSECT",
      "color": "RED",
      "cost": 5,
      "baseHp": 1200,
      "skills": [
        {
          "name": "とびかかる",
          "baseAp": 900,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "オニヤンマ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 5,
      "officialNumber": "5/130",
      "name": "トビズムカデ",
      "rarity": "SR",
      "type": "INSECT",
      "color": "RED",
      "cost": 5,
      "baseHp": 1300,
      "skills": [
        {
          "name": "キバ",
          "baseAp": 700,
          "effectSummary": null
        },
        {
          "name": "毒のキバ",
          "baseAp": 500,
          "effectSummary": "この技で与えたダメージは通常のターン終了回復をしない。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "オオムカデ科",
        "回復不能ダメージは空蝉の皮鎧などの破壊置換後も残り得る。",
        "一時HP増加が切れてHP0以下になった場合、その時点で破壊される。攻撃終了後の破壊なら縄張り取得は発生しない。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 8,
      "officialNumber": "8/130",
      "name": "オオスズメバチ",
      "rarity": "SR",
      "type": "INSECT",
      "color": "RED",
      "cost": 4,
      "baseHp": 800,
      "skills": [
        {
          "name": "かみきる",
          "baseAp": 500,
          "effectSummary": null
        },
        {
          "name": "毒針",
          "baseAp": 800,
          "effectSummary": "この個体が場にいる間、1回だけ使用できる。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "スズメバチ科",
        "1回制限は個体ごと。場を離れて再登場した個体は再度使用可能。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 9,
      "officialNumber": "9/130",
      "name": "ヤブキリ",
      "rarity": "R",
      "type": "INSECT",
      "color": "RED",
      "cost": 4,
      "baseHp": 600,
      "skills": [
        {
          "name": "かみちぎる",
          "baseAp": 400,
          "effectSummary": null
        }
      ],
      "traits": [
        {
          "name": "とびだす",
          "baseAp": null,
          "effectSummary": "縄張りから手札に加わる際、条件を満たせばコストを払わず場に出せる。"
        }
      ],
      "effectSummary": null,
      "rulings": [
        "キリギリス科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 10,
      "officialNumber": "10/130",
      "name": "ミイデラゴミムシ",
      "rarity": "R",
      "type": "INSECT",
      "color": "RED",
      "cost": 4,
      "baseHp": 700,
      "skills": [
        {
          "name": "かみつぶす",
          "baseAp": 400,
          "effectSummary": null
        }
      ],
      "traits": [
        {
          "name": "毒霧噴射",
          "baseAp": null,
          "effectSummary": "虫の攻撃で破壊された時、その破壊元の虫を手札へ戻す。"
        }
      ],
      "effectSummary": null,
      "rulings": [
        "ホソクビゴミムシ科",
        "攻撃以外の破壊では発動しない。破壊元がすでに場を離れていれば戻す対象がない。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 12,
      "officialNumber": "12/130",
      "name": "チョウセンカマキリ",
      "rarity": "N",
      "type": "INSECT",
      "color": "RED",
      "cost": 4,
      "baseHp": 800,
      "skills": [
        {
          "name": "カマ斬撃",
          "baseAp": 600,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "カマキリ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 13,
      "officialNumber": "13/130",
      "name": "シオヤアブ",
      "rarity": "N",
      "type": "INSECT",
      "color": "RED",
      "cost": 4,
      "baseHp": 800,
      "skills": [
        {
          "name": "さす",
          "baseAp": 500,
          "effectSummary": null
        },
        {
          "name": "吸血",
          "baseAp": 200,
          "effectSummary": "次の相手ターン中、この虫のHPを200増やす。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "ムシヒキアブ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 14,
      "officialNumber": "14/130",
      "name": "デスストーカー",
      "rarity": "SR",
      "type": "INSECT",
      "color": "RED",
      "cost": 3,
      "baseHp": 800,
      "skills": [
        {
          "name": "きりきざむ",
          "baseAp": 200,
          "effectSummary": null
        },
        {
          "name": "毒針",
          "baseAp": 600,
          "effectSummary": "この個体が場にいる間、1回だけ使用できる。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "キョクトウサソリ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 15,
      "officialNumber": "15/130",
      "name": "アリジゴク",
      "rarity": "R",
      "type": "INSECT",
      "color": "RED",
      "cost": 3,
      "baseHp": 700,
      "skills": [
        {
          "name": "はさみつく",
          "baseAp": 300,
          "effectSummary": null
        },
        {
          "name": "アリ地獄",
          "baseAp": 0,
          "effectSummary": "この技を受けた虫は、この虫が場にいる限り次のターン攻撃できない。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "ウスバカゲロウ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 16,
      "officialNumber": "16/130",
      "name": "キリギリス",
      "rarity": "R",
      "type": "INSECT",
      "color": "RED",
      "cost": 3,
      "baseHp": 800,
      "skills": [
        {
          "name": "かみちぎる",
          "baseAp": 100,
          "effectSummary": null
        }
      ],
      "traits": [
        {
          "name": "鳴く",
          "baseAp": null,
          "effectSummary": "相手は原則としてこの効果を持つ虫以外を攻撃できない。複数いればその中から選ぶ。"
        }
      ],
      "effectSummary": null,
      "rulings": [
        "キリギリス科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 17,
      "officialNumber": "17/130",
      "name": "マイマイカブリ",
      "rarity": "N",
      "type": "INSECT",
      "color": "RED",
      "cost": 3,
      "baseHp": 400,
      "skills": [
        {
          "name": "かみつぶす",
          "baseAp": 300,
          "effectSummary": null
        }
      ],
      "traits": [
        {
          "name": "とびだす",
          "baseAp": null,
          "effectSummary": "縄張りから手札に加わる際、条件を満たせば場に出せる。"
        }
      ],
      "effectSummary": null,
      "rulings": [
        "オサムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 18,
      "officialNumber": "18/130",
      "name": "コガネグモ",
      "rarity": "N",
      "type": "INSECT",
      "color": "RED",
      "cost": 3,
      "baseHp": 600,
      "skills": [
        {
          "name": "かむ",
          "baseAp": 400,
          "effectSummary": null
        },
        {
          "name": "蜘蛛の糸",
          "baseAp": 0,
          "effectSummary": "この技を受けた虫は、この虫が場にいる限り次のターン攻撃できない。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "コガネグモ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 19,
      "officialNumber": "19/130",
      "name": "オニグモ",
      "rarity": "N",
      "type": "INSECT",
      "color": "RED",
      "cost": 3,
      "baseHp": 700,
      "skills": [
        {
          "name": "かむ",
          "baseAp": 300,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "コガネグモ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 20,
      "officialNumber": "20/130",
      "name": "ハラビロカマキリ",
      "rarity": "N",
      "type": "INSECT",
      "color": "RED",
      "cost": 3,
      "baseHp": 600,
      "skills": [
        {
          "name": "カマ斬撃",
          "baseAp": 400,
          "effectSummary": null
        },
        {
          "name": "共食い",
          "baseAp": 600,
          "effectSummary": "使用条件として、この虫以外の自分の虫1体を破壊する。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "カマキリ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 21,
      "officialNumber": "21/130",
      "name": "ヒアリ",
      "rarity": "R",
      "type": "INSECT",
      "color": "RED",
      "cost": 2,
      "baseHp": 400,
      "skills": [
        {
          "name": "毒針",
          "baseAp": null,
          "effectSummary": "自分の赤いエサの枚数×200を基礎APとして扱う。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "アリ科",
        "X値をカード効果で決定した後にAP修正を加え、最後に属性倍率を適用する。裏向きのエサは色参照対象にならない。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 23,
      "officialNumber": "23/130",
      "name": "クロシデムシ",
      "rarity": "R",
      "type": "INSECT",
      "color": "RED",
      "cost": 2,
      "baseHp": 400,
      "skills": [
        {
          "name": "死骸の山",
          "baseAp": null,
          "effectSummary": "自分の捨て札枚数×100を基礎APとして扱う。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "シデムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 25,
      "officialNumber": "25/130",
      "name": "シオカラトンボ",
      "rarity": "N",
      "type": "INSECT",
      "color": "RED",
      "cost": 2,
      "baseHp": 300,
      "skills": [
        {
          "name": "とびかかる",
          "baseAp": 300,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "トンボ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 26,
      "officialNumber": "26/130",
      "name": "ハンミョウ",
      "rarity": "N",
      "type": "INSECT",
      "color": "RED",
      "cost": 2,
      "baseHp": 400,
      "skills": [
        {
          "name": "かむ",
          "baseAp": 300,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "ハンミョウ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 27,
      "officialNumber": "27/130",
      "name": "ミツツボアリ",
      "rarity": "SR",
      "type": "INSECT",
      "color": "RED",
      "cost": 1,
      "baseHp": 200,
      "skills": [
        {
          "name": "かみつく",
          "baseAp": 100,
          "effectSummary": null
        }
      ],
      "traits": [
        {
          "name": "蜜をためる",
          "baseAp": null,
          "effectSummary": "場に出た時、手札から1枚をエサ場へ置いてもよい。その追加エサ分のコストはこのターン増えない。"
        }
      ],
      "effectSummary": null,
      "rulings": [
        "アリ科",
        "カード効果で場に出た場合も『場に出た時』条件を満たす。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 28,
      "officialNumber": "28/130",
      "name": "ナナホシテントウ",
      "rarity": "N",
      "type": "INSECT",
      "color": "RED",
      "cost": 1,
      "baseHp": 300,
      "skills": [
        {
          "name": "かみつぶす",
          "baseAp": 200,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "テントウムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 29,
      "officialNumber": "29/130",
      "name": "クロヤマアリ",
      "rarity": "N",
      "type": "INSECT",
      "color": "RED",
      "cost": 1,
      "baseHp": 300,
      "skills": [
        {
          "name": "アリの大群",
          "baseAp": null,
          "effectSummary": "自分の場の虫の数×100を基礎APとして扱う。この虫自身も数える。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "アリ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 31,
      "officialNumber": "31/130",
      "name": "ハナグモ",
      "rarity": "N",
      "type": "INSECT",
      "color": "RED",
      "cost": 1,
      "baseHp": 200,
      "skills": [
        {
          "name": "かむ",
          "baseAp": 200,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "カニグモ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 32,
      "officialNumber": "32/130",
      "name": "コカマキリ",
      "rarity": "N",
      "type": "INSECT",
      "color": "RED",
      "cost": 1,
      "baseHp": 200,
      "skills": [
        {
          "name": "カマ斬撃",
          "baseAp": 200,
          "effectSummary": null
        },
        {
          "name": "共食い",
          "baseAp": 300,
          "effectSummary": "使用条件として、この虫以外の自分の虫1体を破壊する。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "カマキリ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 33,
      "officialNumber": "33/130",
      "name": "クロオオアリ",
      "rarity": "N",
      "type": "INSECT",
      "color": "RED",
      "cost": 1,
      "baseHp": 400,
      "skills": [
        {
          "name": "かみつく",
          "baseAp": 100,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "アリ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 34,
      "officialNumber": "34/130",
      "name": "ヘラクレスオオカブト",
      "rarity": "LR",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 6,
      "baseHp": 1600,
      "skills": [
        {
          "name": "神のツノ突進",
          "baseAp": 1000,
          "effectSummary": null
        },
        {
          "name": "ヘラクレス投げ",
          "baseAp": 0,
          "effectSummary": "相手の虫1体を手札へ戻す。この個体が場にいる間1回だけ使用できる。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "コガネムシ科",
        "虫が手札へ戻ると、その虫についていた強化カードは捨て札へ移る。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 35,
      "officialNumber": "35/130",
      "name": "コーカサスオオカブト",
      "rarity": "SR",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 5,
      "baseHp": 1200,
      "skills": [
        {
          "name": "ツノ突進",
          "baseAp": 800,
          "effectSummary": null
        },
        {
          "name": "すくい投げ",
          "baseAp": 0,
          "effectSummary": "相手の虫1体をターン終了時まで裏向きにする。裏向き中は『いないもの』として扱う。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "コガネムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 36,
      "officialNumber": "36/130",
      "name": "ミヤマクワガタ",
      "rarity": "SR",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 4,
      "baseHp": 900,
      "skills": [
        {
          "name": "オオアゴバサミ",
          "baseAp": 700,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "クワガタムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 37,
      "officialNumber": "37/130",
      "name": "ゴライアスオオツノハナムグリ",
      "rarity": "SR",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 5,
      "baseHp": 800,
      "skills": [
        {
          "name": "ふみつぶす",
          "baseAp": 500,
          "effectSummary": null
        }
      ],
      "traits": [
        {
          "name": "とびだす",
          "baseAp": null,
          "effectSummary": "縄張りから手札に加わる際、条件を満たせば場に出せる。"
        }
      ],
      "effectSummary": null,
      "rulings": [
        "コガネムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 38,
      "officialNumber": "38/130",
      "name": "ギラファノコギリクワガタ",
      "rarity": "SR",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 5,
      "baseHp": 1200,
      "skills": [
        {
          "name": "オオアゴバサミ",
          "baseAp": 900,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "クワガタムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 39,
      "officialNumber": "39/130",
      "name": "ニシキオオツバメガ",
      "rarity": "SR",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 4,
      "baseHp": 1000,
      "skills": [
        {
          "name": "すする",
          "baseAp": 300,
          "effectSummary": null
        },
        {
          "name": "虹色光沢",
          "baseAp": 0,
          "effectSummary": "赤・青・緑から1色を選び、ターン終了時まで使用時点の相手の場の虫をすべてその色にする。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "ツバメガ科",
        "複数の相手虫へ別々の色は指定できない。使用後に場へ出た虫は影響を受けない。AP0でも合法な直接攻撃は成立する。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 41,
      "officialNumber": "41/130",
      "name": "オオクワガタ",
      "rarity": "SR",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 5,
      "baseHp": 1300,
      "skills": [
        {
          "name": "オオアゴバサミ",
          "baseAp": 800,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "クワガタムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 42,
      "officialNumber": "42/130",
      "name": "オオムラサキ",
      "rarity": "R",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 4,
      "baseHp": 1000,
      "skills": [
        {
          "name": "すいとる",
          "baseAp": 400,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "タテハチョウ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 43,
      "officialNumber": "43/130",
      "name": "ヒラタクワガタ",
      "rarity": "R",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 4,
      "baseHp": 800,
      "skills": [
        {
          "name": "はさむ",
          "baseAp": 600,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "クワガタムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 45,
      "officialNumber": "45/130",
      "name": "アオスジアゲハ",
      "rarity": "R",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 3,
      "baseHp": 700,
      "skills": [
        {
          "name": "すいつくす",
          "baseAp": 300,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "アゲハチョウ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 46,
      "officialNumber": "46/130",
      "name": "ノコギリクワガタ",
      "rarity": "R",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 3,
      "baseHp": 600,
      "skills": [
        {
          "name": "はさむ",
          "baseAp": 400,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "クワガタムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 48,
      "officialNumber": "48/130",
      "name": "クロアゲハ",
      "rarity": "N",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 3,
      "baseHp": 700,
      "skills": [
        {
          "name": "すいつくす",
          "baseAp": 200,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "アゲハチョウ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 49,
      "officialNumber": "49/130",
      "name": "オオゾウムシ",
      "rarity": "N",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 3,
      "baseHp": 800,
      "skills": [
        {
          "name": "なめる",
          "baseAp": 200,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "オサゾウムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 50,
      "officialNumber": "50/130",
      "name": "オオスカシバ",
      "rarity": "N",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 3,
      "baseHp": 400,
      "skills": [
        {
          "name": "すいつくす",
          "baseAp": 500,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "スズメガ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 51,
      "officialNumber": "51/130",
      "name": "ヤエヤママルバネクワガタ",
      "rarity": "N",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 3,
      "baseHp": 500,
      "skills": [
        {
          "name": "はさむ",
          "baseAp": 400,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "クワガタムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 52,
      "officialNumber": "52/130",
      "name": "クマゼミ",
      "rarity": "N",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 3,
      "baseHp": 700,
      "skills": [
        {
          "name": "しぼりとる",
          "baseAp": 300,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "セミ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 53,
      "officialNumber": "53/130",
      "name": "セイヨウミツバチ",
      "rarity": "R",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 2,
      "baseHp": 500,
      "skills": [
        {
          "name": "ハチダマアタック",
          "baseAp": 200,
          "effectSummary": null
        },
        {
          "name": "決死の一撃",
          "baseAp": 300,
          "effectSummary": "この技で攻撃を与えた後、この虫を破壊する。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "ミツバチ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 54,
      "officialNumber": "54/130",
      "name": "キムネクマバチ",
      "rarity": "R",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 2,
      "baseHp": 400,
      "skills": [
        {
          "name": "かみきる",
          "baseAp": 200,
          "effectSummary": null
        },
        {
          "name": "毒針",
          "baseAp": 300,
          "effectSummary": "この個体が場にいる間、1回だけ使用できる。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "コシブトハナバチ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 55,
      "officialNumber": "55/130",
      "name": "コクワガタ",
      "rarity": "N",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 2,
      "baseHp": 400,
      "skills": [
        {
          "name": "はさむ",
          "baseAp": 300,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "クワガタムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 56,
      "officialNumber": "56/130",
      "name": "アブラゼミ",
      "rarity": "N",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 2,
      "baseHp": 500,
      "skills": [
        {
          "name": "しぼりとる",
          "baseAp": 200,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "セミ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 57,
      "officialNumber": "57/130",
      "name": "アカタテハ",
      "rarity": "N",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 2,
      "baseHp": 400,
      "skills": [
        {
          "name": "すいとる",
          "baseAp": 200,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "タテハチョウ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 58,
      "officialNumber": "58/130",
      "name": "アカアシクワガタ",
      "rarity": "N",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 2,
      "baseHp": 300,
      "skills": [
        {
          "name": "はさむ",
          "baseAp": 300,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "クワガタムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 59,
      "officialNumber": "59/130",
      "name": "ヘビトンボ",
      "rarity": "N",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 2,
      "baseHp": 500,
      "skills": [
        {
          "name": "かむ",
          "baseAp": 100,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "ヘビトンボ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 60,
      "officialNumber": "60/130",
      "name": "ニホンミツバチ",
      "rarity": "R",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 1,
      "baseHp": 400,
      "skills": [
        {
          "name": "ハチダマアタック",
          "baseAp": 100,
          "effectSummary": null
        },
        {
          "name": "決死の一撃",
          "baseAp": 200,
          "effectSummary": "この技で攻撃を与えた後、この虫を破壊する。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "ミツバチ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 61,
      "officialNumber": "61/130",
      "name": "モンシロチョウ",
      "rarity": "N",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 1,
      "baseHp": 300,
      "skills": [
        {
          "name": "すいとる",
          "baseAp": 100,
          "effectSummary": null
        }
      ],
      "traits": [
        {
          "name": "紋章",
          "baseAp": null,
          "effectSummary": "自分の場にモンキチョウがいれば、この虫のAPを300増やす。"
        }
      ],
      "effectSummary": null,
      "rulings": [
        "シロチョウ科",
        "相方の枚数では累積しない。存在条件として扱う。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 62,
      "officialNumber": "62/130",
      "name": "モンキチョウ",
      "rarity": "N",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 1,
      "baseHp": 300,
      "skills": [
        {
          "name": "すいとる",
          "baseAp": 100,
          "effectSummary": null
        }
      ],
      "traits": [
        {
          "name": "紋章",
          "baseAp": null,
          "effectSummary": "自分の場にモンシロチョウがいれば、この虫のAPを300増やす。"
        }
      ],
      "effectSummary": null,
      "rulings": [
        "シロチョウ科",
        "相方の枚数では累積しない。存在条件として扱う。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 65,
      "officialNumber": "65/130",
      "name": "ネブトクワガタ",
      "rarity": "N",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 1,
      "baseHp": 400,
      "skills": [
        {
          "name": "はさむ",
          "baseAp": 100,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "クワガタムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 66,
      "officialNumber": "66/130",
      "name": "アオカナブン",
      "rarity": "N",
      "type": "INSECT",
      "color": "BLUE",
      "cost": 1,
      "baseHp": 300,
      "skills": [
        {
          "name": "たいあたり",
          "baseAp": 200,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "コガネムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 67,
      "officialNumber": "67/130",
      "name": "オオキバウスバカミキリ",
      "rarity": "LR",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 6,
      "baseHp": 1700,
      "skills": [
        {
          "name": "神のキバ無双",
          "baseAp": 1200,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "カミキリムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 68,
      "officialNumber": "68/130",
      "name": "テナガカミキリ",
      "rarity": "SR",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 5,
      "baseHp": 1200,
      "skills": [
        {
          "name": "キバ無双",
          "baseAp": 800,
          "effectSummary": null
        },
        {
          "name": "テナガ攻撃",
          "baseAp": 300,
          "effectSummary": "相手の虫2体を先に選び、各1体へ順番に攻撃する。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "カミキリムシ科",
        "同じ虫を2回選べず、相手本体にも使えない。対象は使用時に2体とも確定する。1体目の処理で攻撃虫が場を離れた場合、2体目へのダメージは行わない。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 69,
      "officialNumber": "69/130",
      "name": "ジャイアントウェタ",
      "rarity": "SR",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 5,
      "baseHp": 1300,
      "skills": [
        {
          "name": "くらいつく",
          "baseAp": 800,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "クロギリス科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 70,
      "officialNumber": "70/130",
      "name": "シロスジカミキリ",
      "rarity": "SR",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 5,
      "baseHp": 1300,
      "skills": [
        {
          "name": "くいちぎる",
          "baseAp": 700,
          "effectSummary": null
        },
        {
          "name": "首を鳴らす",
          "baseAp": 300,
          "effectSummary": "次の相手ターン中、この虫のHPを300増やす。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "カミキリムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 72,
      "officialNumber": "72/130",
      "name": "オオコノハムシ",
      "rarity": "SR",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 4,
      "baseHp": 800,
      "skills": [
        {
          "name": "かぶりつく",
          "baseAp": 600,
          "effectSummary": null
        }
      ],
      "traits": [
        {
          "name": "擬態",
          "baseAp": null,
          "effectSummary": "場に出た次の相手ターン中、虫の攻撃対象にならない。他に合法対象がいなければ直接攻撃になる。"
        }
      ],
      "effectSummary": null,
      "rulings": [
        "コノハムシ科",
        "術カードの対象制限とは別。擬態中でも『場に虫がいる』条件そのものは満たす場合がある。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 73,
      "officialNumber": "73/130",
      "name": "サバクトビバッタ",
      "rarity": "SR",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 4,
      "baseHp": 1000,
      "skills": [
        {
          "name": "くらいつくす",
          "baseAp": 400,
          "effectSummary": "相手へ直接攻撃が通った時、相手は自分のエサ1枚を選び手札へ戻す。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "バッタ科",
        "エサを戻す処理は縄張り取得より先。裏向きで参照不能なエサは選択対象にできない。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 74,
      "officialNumber": "74/130",
      "name": "ゴマダラカミキリ",
      "rarity": "R",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 4,
      "baseHp": 700,
      "skills": [
        {
          "name": "くいちぎる",
          "baseAp": 300,
          "effectSummary": null
        }
      ],
      "traits": [
        {
          "name": "とびだす",
          "baseAp": null,
          "effectSummary": "縄張りから手札に加わる際、条件を満たせば場に出せる。"
        }
      ],
      "effectSummary": null,
      "rulings": [
        "カミキリムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 75,
      "officialNumber": "75/130",
      "name": "クワカミキリ",
      "rarity": "R",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 4,
      "baseHp": 800,
      "skills": [
        {
          "name": "くいちぎる",
          "baseAp": 600,
          "effectSummary": null
        },
        {
          "name": "首を鳴らす",
          "baseAp": 200,
          "effectSummary": "次の相手ターン中、この虫のHPを200増やす。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "カミキリムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 76,
      "officialNumber": "76/130",
      "name": "キアゲハ（幼虫）",
      "rarity": "R",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 4,
      "baseHp": 900,
      "skills": [
        {
          "name": "かじる",
          "baseAp": 400,
          "effectSummary": null
        },
        {
          "name": "くさいツノ",
          "baseAp": 0,
          "effectSummary": "相手の虫1体を選び、その虫の次のターンのAPを600下げる。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "アゲハチョウ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 77,
      "officialNumber": "77/130",
      "name": "ショウリョウバッタ",
      "rarity": "N",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 4,
      "baseHp": 900,
      "skills": [
        {
          "name": "とびはねる",
          "baseAp": 500,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "バッタ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 78,
      "officialNumber": "78/130",
      "name": "ヤマトタマムシ",
      "rarity": "SR",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 3,
      "baseHp": 600,
      "skills": [
        {
          "name": "くいあらす",
          "baseAp": 200,
          "effectSummary": null
        },
        {
          "name": "虹色光沢",
          "baseAp": 0,
          "effectSummary": "赤・青・緑から1色を選び、ターン終了時まで使用時点の相手の場の虫をすべてその色にする。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "タマムシ科",
        "使用後に場へ出た虫は元の色のまま。相手虫ごとに別色は指定できない。AP0でも直接攻撃は成立し得る。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 81,
      "officialNumber": "81/130",
      "name": "クロカタゾウムシ",
      "rarity": "SR",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 3,
      "baseHp": 1000,
      "skills": [
        {
          "name": "くいあさる",
          "baseAp": 200,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "ゾウムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 82,
      "officialNumber": "82/130",
      "name": "オオムラサキ（幼虫）",
      "rarity": "N",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 3,
      "baseHp": 700,
      "skills": [
        {
          "name": "かじる",
          "baseAp": 300,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "タテハチョウ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 83,
      "officialNumber": "83/130",
      "name": "イボバッタ",
      "rarity": "N",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 3,
      "baseHp": 400,
      "skills": [
        {
          "name": "はねる",
          "baseAp": 300,
          "effectSummary": null
        }
      ],
      "traits": [
        {
          "name": "とびだす",
          "baseAp": null,
          "effectSummary": "縄張りから手札に加わる際、条件を満たせば場に出せる。"
        }
      ],
      "effectSummary": null,
      "rulings": [
        "バッタ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 84,
      "officialNumber": "84/130",
      "name": "コバネイナゴ",
      "rarity": "R",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 2,
      "baseHp": 400,
      "skills": [
        {
          "name": "はねる",
          "baseAp": 200,
          "effectSummary": null
        },
        {
          "name": "イナゴの大群",
          "baseAp": 400,
          "effectSummary": "使用条件として、自分のエサ1枚を破壊する。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "イナゴ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 85,
      "officialNumber": "85/130",
      "name": "アオクサカメムシ",
      "rarity": "R",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 2,
      "baseHp": 400,
      "skills": [
        {
          "name": "くいつく",
          "baseAp": 200,
          "effectSummary": null
        }
      ],
      "traits": [
        {
          "name": "毒霧噴射",
          "baseAp": null,
          "effectSummary": "虫の攻撃で破壊された時、その破壊元の虫を手札へ戻す。"
        }
      ],
      "effectSummary": null,
      "rulings": [
        "カメムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 86,
      "officialNumber": "86/130",
      "name": "オトシブミ",
      "rarity": "N",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 2,
      "baseHp": 600,
      "skills": [
        {
          "name": "くいつく",
          "baseAp": 100,
          "effectSummary": null
        },
        {
          "name": "ゆりかご",
          "baseAp": 0,
          "effectSummary": "次の相手ターン中、この虫のHPを200増やす。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "オトシブミ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 87,
      "officialNumber": "87/130",
      "name": "ゴマダラオトシブミ",
      "rarity": "N",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 2,
      "baseHp": 500,
      "skills": [
        {
          "name": "くいつく",
          "baseAp": 200,
          "effectSummary": null
        },
        {
          "name": "ゆりかご",
          "baseAp": 0,
          "effectSummary": "次の相手ターン中、この虫のHPを200増やす。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "オトシブミ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 88,
      "officialNumber": "88/130",
      "name": "イラガ（幼虫）",
      "rarity": "N",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 2,
      "baseHp": 400,
      "skills": [
        {
          "name": "さす",
          "baseAp": 300,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "イラガ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 89,
      "officialNumber": "89/130",
      "name": "コガネムシ",
      "rarity": "N",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 2,
      "baseHp": 500,
      "skills": [
        {
          "name": "かじりつく",
          "baseAp": 200,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "コガネムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 90,
      "officialNumber": "90/130",
      "name": "ウバタマムシ",
      "rarity": "N",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 2,
      "baseHp": 600,
      "skills": [
        {
          "name": "くいあらす",
          "baseAp": 100,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "タマムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 92,
      "officialNumber": "92/130",
      "name": "チャバネアオカメムシ",
      "rarity": "R",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 1,
      "baseHp": 200,
      "skills": [
        {
          "name": "くいつく",
          "baseAp": 100,
          "effectSummary": null
        }
      ],
      "traits": [
        {
          "name": "毒霧噴射",
          "baseAp": null,
          "effectSummary": "虫の攻撃で破壊された時、その破壊元の虫を手札へ戻す。"
        }
      ],
      "effectSummary": null,
      "rulings": [
        "カメムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 93,
      "officialNumber": "93/130",
      "name": "オンブバッタ",
      "rarity": "R",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 1,
      "baseHp": 300,
      "skills": [
        {
          "name": "はねる",
          "baseAp": 100,
          "effectSummary": null
        },
        {
          "name": "おんぶ",
          "baseAp": 0,
          "effectSummary": "この虫についている強化カード1枚を、自分の別の虫へ付け替える。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "オンブバッタ科",
        "付け替え先がなければ使用不可。AP0でも合法な直接攻撃は成立する。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 94,
      "officialNumber": "94/130",
      "name": "カイコ（幼虫）",
      "rarity": "N",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 1,
      "baseHp": 400,
      "skills": [
        {
          "name": "かじる",
          "baseAp": 100,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "カイコガ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 96,
      "officialNumber": "96/130",
      "name": "マメコガネ",
      "rarity": "N",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 1,
      "baseHp": 300,
      "skills": [
        {
          "name": "かじりつく",
          "baseAp": 200,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "コガネムシ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 97,
      "officialNumber": "97/130",
      "name": "ハラヒシバッタ",
      "rarity": "N",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 1,
      "baseHp": 300,
      "skills": [
        {
          "name": "はねる",
          "baseAp": 100,
          "effectSummary": null
        }
      ],
      "traits": [
        {
          "name": "擬態",
          "baseAp": null,
          "effectSummary": "場に出た次の相手ターン中、虫の攻撃対象にならない。他に合法対象がいなければ直接攻撃になる。"
        }
      ],
      "effectSummary": null,
      "rulings": [
        "ヒシバッタ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 98,
      "officialNumber": "98/130",
      "name": "ツマグロオオヨコバイ",
      "rarity": "N",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 1,
      "baseHp": 200,
      "skills": [
        {
          "name": "すう",
          "baseAp": 200,
          "effectSummary": null
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "オオヨコバイ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 99,
      "officialNumber": "99/130",
      "name": "オオミノガ（幼虫）",
      "rarity": "N",
      "type": "INSECT",
      "color": "GREEN",
      "cost": 1,
      "baseHp": 300,
      "skills": [
        {
          "name": "くいつく",
          "baseAp": 100,
          "effectSummary": null
        },
        {
          "name": "ミノにこもる",
          "baseAp": 0,
          "effectSummary": "次の相手ターン中、この虫のHPを200増やす。"
        }
      ],
      "traits": [],
      "effectSummary": null,
      "rulings": [
        "ミノガ科",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 100,
      "officialNumber": "100/130",
      "name": "雀蜂の毒針",
      "rarity": "R",
      "type": "ENHANCEMENT",
      "color": null,
      "cost": 1,
      "baseHp": null,
      "skills": [],
      "traits": [],
      "effectSummary": "装着した虫のAPを500増やす。",
      "rulings": [
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 102,
      "officialNumber": "102/130",
      "name": "空蝉の皮鎧",
      "rarity": "SR",
      "type": "ENHANCEMENT",
      "color": null,
      "cost": 2,
      "baseHp": null,
      "skills": [],
      "traits": [],
      "effectSummary": "装着虫が破壊される時、この強化を代わりに破壊し、装着虫のHPを元の値まで回復する。その置換では縄張りを取らない。",
      "rulings": [
        "回復不能ダメージなどが残る場合、置換直後に再びHP0以下となって破壊され得る。",
        "複数装着時も同時に全部を消費せず、必要な1枚で置換する。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 103,
      "officialNumber": "103/130",
      "name": "蚕玉の加護",
      "rarity": "R",
      "type": "ENHANCEMENT",
      "color": null,
      "cost": 1,
      "baseHp": null,
      "skills": [],
      "traits": [],
      "effectSummary": "装着した虫のHPを800増やす。",
      "rulings": [
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 104,
      "officialNumber": "104/130",
      "name": "螻蛄の七芸",
      "rarity": "N",
      "type": "SPELL",
      "color": null,
      "cost": 0,
      "baseHp": null,
      "skills": [],
      "traits": [],
      "effectSummary": "自分の場の強化カード1枚を選び、自分の別の虫へ付け替える。",
      "rulings": [
        "『付け替える』は強化カードを新たに場へ出す処理ではない。登場時効果は再発動しない。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 105,
      "officialNumber": "105/130",
      "name": "蜜蝋の壁",
      "rarity": "R",
      "type": "SPELL",
      "color": null,
      "cost": 0,
      "baseHp": null,
      "skills": [],
      "traits": [],
      "effectSummary": "このカード自身を表向きの縄張りとして追加する。縄張りから取られた場合は手札ではなく捨て札へ送る。",
      "rulings": [
        "山札切れ時の縄張り枚数比較では通常の縄張り同様に数える。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 109,
      "officialNumber": "109/130",
      "name": "鳳蝶の蟲惑",
      "rarity": "N",
      "type": "ENHANCEMENT",
      "color": null,
      "cost": 0,
      "baseHp": null,
      "skills": [],
      "traits": [],
      "effectSummary": "装着虫が有効な間、相手は原則その虫以外を攻撃できない。同種の攻撃誘導効果が複数あれば、その中から合法対象を選ぶ。",
      "rulings": [
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 110,
      "officialNumber": "110/130",
      "name": "不滅の王台",
      "rarity": "N",
      "type": "ENHANCEMENT",
      "color": null,
      "cost": 0,
      "baseHp": null,
      "skills": [],
      "traits": [],
      "effectSummary": "装着虫が自分の場にいる間、自分は縄張りを取らない。ただし装着虫自身が虫の攻撃で破壊された時は通常どおり縄張りを取る。",
      "rulings": [
        "縄張り0枚で直接攻撃を受ければ、縄張り取得を防いでも敗北条件は成立する。",
        "装着虫が裏向きになりカード外へ及ぼす継続効果が無効になる場合がある。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 111,
      "officialNumber": "111/130",
      "name": "鋏虫の芯切り鋏",
      "rarity": "N",
      "type": "ENHANCEMENT",
      "color": null,
      "cost": 0,
      "baseHp": null,
      "skills": [],
      "traits": [],
      "effectSummary": "装着虫の攻撃によって相手が縄張りを取る時、その縄張りカードの＜とびだす＞を使用できなくする。",
      "rulings": [
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 112,
      "officialNumber": "112/130",
      "name": "剣の息吹",
      "rarity": "N",
      "type": "ENHANCEMENT",
      "color": null,
      "cost": 0,
      "baseHp": null,
      "skills": [],
      "traits": [],
      "effectSummary": "装着した虫の色を赤にする。",
      "rulings": [
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 113,
      "officialNumber": "113/130",
      "name": "勾玉の息吹",
      "rarity": "N",
      "type": "ENHANCEMENT",
      "color": null,
      "cost": 0,
      "baseHp": null,
      "skills": [],
      "traits": [],
      "effectSummary": "装着した虫の色を青にする。",
      "rulings": [
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 114,
      "officialNumber": "114/130",
      "name": "鏡の息吹",
      "rarity": "N",
      "type": "ENHANCEMENT",
      "color": null,
      "cost": 0,
      "baseHp": null,
      "skills": [],
      "traits": [],
      "effectSummary": "装着した虫の色を緑にする。",
      "rulings": [
        "複数の色変更が重なった場合は、現在有効な中で後から適用された変更を優先する裁定を要確認・実装テストする。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 115,
      "officialNumber": "115/130",
      "name": "蟷螂の構え",
      "rarity": "LR",
      "type": "SPELL",
      "color": null,
      "cost": 3,
      "baseHp": null,
      "skills": [],
      "traits": [],
      "effectSummary": "自分の攻撃済みの虫1体を選び、その虫をもう1回攻撃可能にする。",
      "rulings": [
        "複数回使用可能。攻撃禁止状態そのものを解除する効果ではない。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 116,
      "officialNumber": "116/130",
      "name": "瀬戸際の虫時雨",
      "rarity": "LR",
      "type": "SPELL",
      "color": null,
      "cost": 4,
      "baseHp": null,
      "skills": [],
      "traits": [],
      "effectSummary": "自分のエサ場にある同じ色の虫を最大2体まで選び、順番に場へ出す。ターン終了時に、それらを破壊する。",
      "rulings": [
        "2体は順番に場へ出し、登場時効果もその順番で処理する。",
        "その後に場を離れた虫には、元の遅延破壊は追跡して適用しない。",
        "空蝉の皮鎧でターン終了時破壊を置換できる。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 117,
      "officialNumber": "117/130",
      "name": "退魔の蚊遣り火",
      "rarity": "SR",
      "type": "SPELL",
      "color": null,
      "cost": 3,
      "baseHp": null,
      "skills": [],
      "traits": [],
      "effectSummary": "相手の虫1体を選び、破壊する。",
      "rulings": [
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 119,
      "officialNumber": "119/130",
      "name": "蠱毒の因果",
      "rarity": "R",
      "type": "SPELL",
      "color": null,
      "cost": 2,
      "baseHp": null,
      "skills": [],
      "traits": [],
      "effectSummary": "山札上から1枚を表向きに引く。虫なら場へ出してターン終了時に破壊し、虫以外なら手札へ加える。",
      "rulings": [
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 120,
      "officialNumber": "120/130",
      "name": "叛逆の蛮勇",
      "rarity": "R",
      "type": "SPELL",
      "color": null,
      "cost": 1,
      "baseHp": null,
      "skills": [],
      "traits": [],
      "effectSummary": "自分の捨て札の虫1体と、自分の場の虫1体を交換する。これで場へ出た虫はそのターン攻撃できない。",
      "rulings": [
        "交換は破壊ではないため、破壊時効果や空蝉の皮鎧の置換条件を満たさない。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 121,
      "officialNumber": "121/130",
      "name": "斑猫の手招き",
      "rarity": "R",
      "type": "SPELL",
      "color": null,
      "cost": 0,
      "baseHp": null,
      "skills": [],
      "traits": [],
      "effectSummary": "自分のエサ場にある虫1枚を手札へ戻す。",
      "rulings": [
        "メインフェイズ中にエサが減っても、すでに発生したavailableCostは減らない。裏向きエサは通常の色・虫参照対象から外れる。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 122,
      "officialNumber": "122/130",
      "name": "百足の狂乱",
      "rarity": "SR",
      "type": "SPELL",
      "color": null,
      "cost": 1,
      "baseHp": null,
      "skills": [],
      "traits": [],
      "effectSummary": "使用時点で自分の場にいるすべての虫のAPを、ターン終了時まで300増やす。",
      "rulings": [
        "使用後に場へ出た虫はこの修正を受けない。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 123,
      "officialNumber": "123/130",
      "name": "蜉蝣の閃き",
      "rarity": "R",
      "type": "SPELL",
      "color": null,
      "cost": 1,
      "baseHp": null,
      "skills": [],
      "traits": [],
      "effectSummary": "自分のエサ場にある虫1体を選び場へ出す。ターン終了時にその虫を破壊する。",
      "rulings": [
        "術に支払ったコストの元になったエサも、適切な対象なら選択できる。",
        "場を離れた場合、元のターン終了時破壊は追跡しない。",
        "エサ場で受けていた色変更は、場へ移動した際に引き継がない。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 125,
      "officialNumber": "125/130",
      "name": "玉響の蠢き",
      "rarity": "R",
      "type": "SPELL",
      "color": null,
      "cost": 0,
      "baseHp": null,
      "skills": [],
      "traits": [],
      "effectSummary": "手札の虫1体を選び、場へ出す。ターン終了時にその虫を破壊する。",
      "rulings": [
        "虫がその後裏向きになっても、同じ場の個体である限りターン終了時破壊は処理される。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 126,
      "officialNumber": "126/130",
      "name": "繚乱の足掻き",
      "rarity": "N",
      "type": "SPELL",
      "color": null,
      "cost": 0,
      "baseHp": null,
      "skills": [],
      "traits": [],
      "effectSummary": "同じ印刷コストの、自分の手札の虫1体と自分の場の虫1体を交換する。これで場へ出た虫はそのターン攻撃できない。",
      "rulings": [
        "コスト参照は特記がなければカードに印刷された元コストを使う。",
        "交換で場を離れた虫に付いていた遅延効果は新しい虫へ引き継がない。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 128,
      "officialNumber": "128/130",
      "name": "埋葬虫の野辺送り",
      "rarity": "N",
      "type": "SPELL",
      "color": null,
      "cost": 0,
      "baseHp": null,
      "skills": [],
      "traits": [],
      "effectSummary": "相手の場の強化カード1枚を選び、破壊する。",
      "rulings": [
        "虫ではなく強化カードそのものを対象として選ぶ。",
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    },
    {
      "number": 130,
      "officialNumber": "130/130",
      "name": "蟲封じの蛍袋",
      "rarity": "N",
      "type": "SPELL",
      "color": null,
      "cost": 0,
      "baseHp": null,
      "skills": [],
      "traits": [],
      "effectSummary": "相手の虫1体を選ぶ。その虫は次のターン攻撃できない。",
      "rulings": [
        "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
      ]
    }
  ];

  function skillId(number, index) { return 'set1_' + String(number).padStart(3, '0') + '_skill_' + (index + 1); }
  function attackSkill(def, name) {
    return def.skills.filter(function (skill) { return !name || skill.name === name; })[0];
  }
  function markTested(def, mechanic) {
    def.implementationStatus = global.CardStatus.TESTED;
    def.implementationNotes = mechanic;
  }
  function configureDefinition(raw, def) {
    var number = raw.number;
    var skill;
    if (number === 1) {
      attackSkill(def, '神のカマ連撃').effects = [{ type: 'CONTINUOUS_ATTACK', maxCount: 2, immediate: true, requiresOpponentFieldInsect: true }];
      skill = attackSkill(def, '共食い');
      skill.additionalCost = [{ type: 'SACRIFICE_OWN_INSECT', amount: 1 }];
      markTested(def, '既存CONTINUOUS_ATTACK + SACRIFICE_OWN_INSECT。');
    }
    [20, 32].forEach(function (n) {
      if (number !== n) return;
      skill = def.skills.filter(function (s) { return s.effectText && s.effectText.indexOf('使用条件') !== -1; })[0];
      skill.additionalCost = [{ type: 'SACRIFICE_OWN_INSECT', amount: 1 }];
      markTested(def, '既存SACRIFICE_OWN_INSECT。');
    });
    [8, 14, 54].forEach(function (n) {
      if (number !== n) return;
      skill = def.skills.filter(function (s) { return s.effectText && s.effectText.indexOf('1回だけ') !== -1; })[0];
      skill.usageLimit = 'ONCE_PER_FIELD_STAY';
      markTested(def, '既存ONCE_PER_FIELD_STAY。');
    });
    [9, 17, 37, 74, 83].forEach(function (n) {
      if (number !== n) return;
      def.skills.push({ id: 'tobidasu', name: 'とびだす', baseAp: null, timing: 'TERRITORY_DRAW', optional: true, effects: [{ type: 'OFFER_SELF_TO_FIELD' }], targetRule: null });
      markTested(def, '既存TERRITORY_DRAW/<とびだす>。');
    });
    if (number === 16) {
      def.skills.push({ id: 'naku', name: '鳴く', baseAp: null, timing: 'PASSIVE', effects: [], targetRule: 'FORCE_ATTACK_TO_SELF_GROUP' });
      markTested(def, '既存FORCE_ATTACK_TO_SELF_GROUP。');
    }
    if (number === 35) {
      skill = def.skills.filter(function (s) { return s.effectText && s.effectText.indexOf('裏向き') !== -1; })[0];
      skill.effects = [{ type: 'TURN_FACE_DOWN', duration: 'UNTIL_END_OF_TURN' }];
      markTested(def, '既存TURN_FACE_DOWN。');
    }
    if (number === 34) {
      skill = def.skills.filter(function (s) { return s.effectText && s.effectText.indexOf('手札へ戻す') !== -1; })[0];
      skill.effects = [{ type: 'MOVE_ATTACK_TARGET_TO_HAND' }];
      skill.usageLimit = 'ONCE_PER_FIELD_STAY';
      markTested(def, '汎用MOVE_ATTACK_TARGET_TO_HAND + ONCE_PER_FIELD_STAY。');
    }
    [72, 97].forEach(function (n) {
      if (number !== n) return;
      def.skills.push({ id: 'gitai', name: '擬態', baseAp: null, timing: 'PASSIVE', effects: [], gitai: true, targetRule: null });
      markTested(def, '既存<擬態> field-entry protection。');
    });
    if (number === 76) {
      skill = def.skills.filter(function (s) { return s.effectText && s.effectText.indexOf('APを600') !== -1; })[0];
      skill.effects = [{ type: 'APPLY_STAT_MODIFIER', id: 'set1_076_ap_down', stat: 'AP', amount: -600, startTurnOffset: 1, endTurnOffset: 1 }];
      markTested(def, '既存APPLY_STAT_MODIFIER。');
    }
    var dynamicRules = {21:{type:'FOOD_COLOR_COUNT',color:'RED',multiplier:200},23:{type:'DISCARD_COUNT',multiplier:100},29:{type:'OWN_FIELD_COUNT',multiplier:100},61:{type:'PARTNER_PRESENT',cardId:'set1_062',bonus:300,base:100},62:{type:'PARTNER_PRESENT',cardId:'set1_061',bonus:300,base:100}};
    if (dynamicRules[number]) {
      def.skills[0].dynamicAp = dynamicRules[number];
      markTested(def, '汎用dynamicAp count/presence evaluator。');
    }
    if (number === 15 || number === 18) {
      skill = def.skills.filter(function (s) { return s.effectText && s.effectText.indexOf('攻撃できない') !== -1; })[0];
      skill.effects = [{ type: 'APPLY_ATTACK_RESTRICTION', startTurnOffset: 1, endTurnOffset: 1, whileSourceOnField: true }];
      markTested(def, '汎用APPLY_ATTACK_RESTRICTION。');
    }
    if (number === 10 || number === 85 || number === 92) {
      def.passiveAbilities = [{ id: 'poison_mist', name: '毒霧噴射', timing: 'ON_DESTROYED', condition: { type: 'DESTROYED_BY_OPPONENT_ATTACK' }, effects: [{ type: 'RETURN_ATTACK_SOURCE_TO_HAND' }], effectText: '虫の攻撃で破壊された時、その破壊元の虫を手札へ戻す。' }];
      markTested(def, '汎用ON_DESTROYED + RETURN_ATTACK_SOURCE_TO_HAND。');
    }
    var hpRules = {13:200,70:300,75:200,86:200,87:200,99:200};
    if (hpRules[number]) {
      skill = def.skills.filter(function (s) { return s.effectText && s.effectText.indexOf('HPを') !== -1; })[0];
      skill.effects = [{ type: 'APPLY_STAT_MODIFIER', id: 'set1_hp_up_' + number, stat: 'HP', amount: hpRules[number], startTurnOffset: 1, endTurnOffset: 1 }];
      markTested(def, '汎用APPLY_STAT_MODIFIER(HP)。');
    }
    if (number === 100) {
      def.enhancementEffects = [{ type: 'STAT_MODIFIER', stat: 'AP', amount: 500, description: '装着した虫の攻撃力を500増やす。' }];
      markTested(def, '既存attachment AP modifier。');
    }
    if (number === 103) {
      def.enhancementEffects = [{ type: 'STAT_MODIFIER', stat: 'HP', amount: 800, description: '装着した虫のHPを800増やす。' }];
      markTested(def, '既存attachment HP modifier。');
    }
    ({112:'RED',113:'BLUE',114:'GREEN'})[number] && (function (color) {
      def.enhancementEffects = [{ type: 'COLOR_OVERRIDE', color: color, description: '装着した虫の色を' + ({RED:'赤',BLUE:'青',GREEN:'緑'})[color] + 'にする。' }];
      markTested(def, '既存attachment COLOR_OVERRIDE。');
    })(({112:'RED',113:'BLUE',114:'GREEN'})[number]);
    if (number === 117) {
      def.cardEffects = [{ type: 'DEAL_DAMAGE_TO_TARGET', target: 'OPPONENT_FIELD_INSECT', amount: 999999999, ignoreAttributeMultiplier: true, description: '相手の虫1体を破壊する。' }];
      markTested(def, '既存spell target/destroy pipeline。');
    }
    if (number === 122) {
      def.cardEffects = [{ type: 'APPLY_STAT_MODIFIER_TO_ALL_OWN_FIELD', id: 'set1_122_ap_up', stat: 'AP', amount: 300, duration: 'UNTIL_END_OF_TURN', description: '使用時点の自分のすべての虫の攻撃力をターン終了時まで300増やす。' }];
      markTested(def, '既存all-field AP modifier。');
    }
    if (number === 115) {
      def.cardEffects = [{ type: 'RESET_ATTACK', target: 'OWN_ATTACKED_FIELD_INSECT', requiresTarget: true, description: '自分の攻撃済みの虫1体を、もう1回攻撃可能にする。' }];
      markTested(def, '汎用zone target + RESET_ATTACK。');
    }
    if (number === 121) {
      def.cardEffects = [{ type: 'MOVE_TARGET', target: 'OWN_FOOD_INSECT', requiresTarget: true, from: 'FOOD', to: 'HAND', description: '自分のエサ場の虫1枚を手札へ戻す。' }];
      markTested(def, '汎用zone target + MOVE_TARGET。');
    }
    if (number === 123) {
      def.cardEffects = [{ type: 'MOVE_TARGET', target: 'OWN_FOOD_INSECT', requiresTarget: true, from: 'FOOD', to: 'FIELD', destroyAtEndTurn: true, description: 'エサ場の虫1体を場へ出し、ターン終了時に破壊する。' }];
      markTested(def, '汎用zone target + temporary field entry。');
    }
    if (number === 125) {
      def.cardEffects = [{ type: 'MOVE_TARGET', target: 'OWN_HAND_INSECT', requiresTarget: true, from: 'HAND', to: 'FIELD', destroyAtEndTurn: true, excludeSource: true, description: '手札の虫1体を場へ出し、ターン終了時に破壊する。' }];
      markTested(def, '汎用zone target + temporary field entry。');
    }
    if (number === 130) {
      def.cardEffects = [{ type: 'APPLY_ATTACK_RESTRICTION', target: 'OPPONENT_FIELD_INSECT', requiresTarget: true, startTurnOffset: 1, endTurnOffset: 1, description: '相手の虫1体は次のターン攻撃できない。' }];
      markTested(def, '汎用zone target + APPLY_ATTACK_RESTRICTION。');
    }
    if (number === 109) {
      def.enhancementEffects = [{ type: 'ATTACK_TARGET_RULE', targetRule: 'FORCE_ATTACK_TO_SELF_GROUP', description: '相手は原則として装着した虫以外を攻撃できない。' }];
      markTested(def, '既存FORCE_ATTACK_TO_SELF_GROUPをattachmentへ一般化。');
    }
    if (number === 2) {
      def.summonAlternatives = [{ type: 'SACRIFICE_OWN_FIELD', count: 2 }];
      markTested(def, '汎用multi-selection + alternative summon cost。');
    }
    if (number === 5) {
      attackSkill(def, '毒のキバ').effects = [{ type: 'DAMAGE_DOES_NOT_HEAL' }];
      markTested(def, '汎用persistent damage。');
    }
    if (number === 27) {
      def.passiveAbilities[0].timing = 'ON_ENTER_FIELD';
      def.passiveAbilities[0].optional = true;
      def.passiveAbilities[0].effects = [{ type: 'MOVE_SELECTED', from: 'HAND', to: 'FOOD', count: 1, grantCost: false }];
      markTested(def, '汎用ON_ENTER_FIELD optional zone move。');
    }
    [39, 78].forEach(function (n) {
      if (number !== n) return;
      attackSkill(def, '虹色光沢').effects = [{ type: 'CHOOSE_COLOR_FOR_ALL_OPPONENT_FIELD', duration: 'UNTIL_END_OF_TURN' }];
      markTested(def, '汎用color selection + field snapshot modifier。');
    });
    [53, 60].forEach(function (n) {
      if (number !== n) return;
      attackSkill(def, '決死の一撃').effects = [{ type: 'SELF_DESTRUCT_AFTER_DAMAGE_BEFORE_TARGET_DESTRUCTION' }];
      markTested(def, '汎用attack timing hook。');
    });
    if (number === 68) {
      attackSkill(def, 'テナガ攻撃').effects = [{ type: 'ATTACK_MULTIPLE_TARGETS', exactSelections: 2, ordered: true }];
      markTested(def, '汎用ordered multi-target attack。');
    }
    if (number === 73) {
      def.skills[0].effects = [{ type: 'ON_DIRECT_ATTACK_MOVE_OPPONENT_FOOD_TO_HAND', count: 1, beforeTerritoryDraw: true }];
      markTested(def, '汎用direct-attack pre-territory continuation。');
    }
    if (number === 84) {
      attackSkill(def, 'イナゴの大群').additionalCost = [{ type: 'SACRIFICE_OWN_FOOD', amount: 1 }];
      markTested(def, '汎用zone sacrifice cost。');
    }
    if (number === 93) {
      attackSkill(def, 'おんぶ').effects = [{ type: 'TRANSFER_OWN_ATTACHMENT', source: 'SELF', destination: 'OTHER_OWN_INSECT' }];
      markTested(def, '汎用attachment transfer。');
    }
    if (number === 102) {
      def.cardEffects = [];
      def.enhancementEffects = [{ type: 'DESTRUCTION_REPLACEMENT', consumeSelf: true, healToMax: true, description: '破壊される代わりにこの強化を捨て、HPを最大まで回復する。' }];
      markTested(def, '汎用pre-destruction replacement。');
    }
    if (number === 104) {
      def.cardEffects = [{ type: 'TRANSFER_OWN_ATTACHMENT', requiresTarget: true, description: '自分の強化カード1枚を別の自分の虫へ付け替える。' }];
      markTested(def, '汎用attachment selection/transfer。');
    }
    if (number === 105) {
      def.cardEffects = [{ type: 'ADD_SELF_AS_FACE_UP_TERRITORY', drawDestination: 'DISCARD', description: '自身を表向きの縄張りとして追加し、取られた時は捨て札へ送る。' }];
      markTested(def, '汎用special territory lifecycle。');
    }
    if (number === 110) {
      def.cardEffects = [];
      def.enhancementEffects = [{ type: 'SUPPRESS_TERRITORY_DRAW_WHILE_ATTACHED', description: '装着虫が場にいる間、自分の縄張り取得を抑止する。' }];
      markTested(def, '汎用territory draw suppression。');
    }
    if (number === 111) {
      def.cardEffects = [];
      def.enhancementEffects = [{ type: 'SUPPRESS_TERRITORY_TRIGGER_FOR_ATTACK', trigger: 'TERRITORY_DRAW', description: '装着虫の攻撃で取る縄張りの誘発を無効にする。' }];
      markTested(def, '汎用attack-source territory trigger suppression。');
    }
    if (number === 116) {
      def.cardEffects = [{ type: 'MOVE_MATCHING_COLOR_INSECTS', from: 'FOOD', to: 'FIELD', minSelections: 1, maxSelections: 2, ordered: true, destroyAtEndTurn: true, description: '同色の虫を最大2体、エサ場から順番に場へ出しターン終了時に破壊する。' }];
      markTested(def, '汎用multi-selection + ordered batch zone move。');
    }
    if (number === 119) {
      def.cardEffects = [{ type: 'REVEAL_TOP_AND_ROUTE', insectTo: 'FIELD', otherTo: 'HAND', destroyInsectAtEndTurn: true, description: '山札上を公開し、虫なら場へ、それ以外なら手札へ移す。' }];
      markTested(def, '汎用top-deck type routing。');
    }
    if (number === 120) {
      def.cardEffects = [{ type: 'EXCHANGE_INSECTS', firstZone: 'DISCARD', secondZone: 'FIELD', enteringCannotAttackThisTurn: true, description: '捨て札の虫と場の虫を交換する。' }];
      markTested(def, '汎用validated atomic zone exchange。');
    }
    if (number === 126) {
      def.cardEffects = [{ type: 'EXCHANGE_INSECTS', firstZone: 'HAND', secondZone: 'FIELD', requireSameCost: true, enteringCannotAttackThisTurn: true, description: '同じコストの手札の虫と場の虫を交換する。' }];
      markTested(def, '汎用validated atomic zone exchange。');
    }
    if (number === 128) {
      def.cardEffects = [{ type: 'DESTROY_OPPONENT_ATTACHMENT', requiresTarget: true, description: '相手の場の強化カード1枚を破壊する。' }];
      markTested(def, '汎用attachment targeting/destruction。');
    }
  }
  function makeDefinition(raw) {
    var isSimple = [3,4,12,19,25,26,28,31,33,36,38,41,42,43,45,46,48,49,50,51,52,55,56,57,58,59,65,66,67,69,77,81,82,88,89,90,94,96,98].indexOf(raw.number) !== -1;
    var skills = raw.skills.map(function (skill, index) {
      return {
        id: skillId(raw.number, index),
        name: skill.name,
        baseAp: skill.baseAp,
        effectText: skill.effectSummary,
        effects: [],
        additionalCost: [],
        usageLimit: null,
        timing: 'ATTACK',
        optional: false,
        targetRule: null
      };
    });
    var passiveAbilities = raw.traits.map(function (trait, index) {
      return {
        id: 'set1_' + String(raw.number).padStart(3, '0') + '_trait_' + (index + 1),
        name: trait.name,
        effectText: trait.effectSummary,
        effects: []
      };
    });
    var def = new global.CardDefinition({
      id: 'set1_' + String(raw.number).padStart(3, '0'),
      officialNumber: raw.officialNumber,
      name: raw.name,
      set: 'BOOSTER_SET_1',
      starterDeck: null,
      rarity: raw.rarity,
      type: global.CardTypes[raw.type],
      color: raw.color ? global.Attributes[raw.color] : null,
      cost: raw.cost,
      baseHp: raw.baseHp,
      skills: skills,
      passiveAbilities: passiveAbilities,
      cardEffects: raw.effectSummary ? [{ type: 'RULE_TEXT', description: raw.effectSummary }] : [],
      rulings: raw.rulings,
      tags: isSimple ? ['SET1', 'SET1_SIMPLE'] : ['SET1', 'SET1_EFFECTFUL'],
      implementationStatus: isSimple ? global.CardStatus.TESTED : global.CardStatus.PARTIAL,
      implementationNotes: isSimple ? '効果なし。基本攻撃処理で検証済み。' : 'カードデータ登録済み。特殊Mechanicは未完了。',
      sourceLevel: global.SourceLevel.C,
      sourceRefs: ['docs/mushijingi-knowledge/SET1_CATALOG.md']
    });
    configureDefinition(raw, def);
    return def;
  }

  CATALOGUE.forEach(function (raw) { global.cardRegistry.register(makeDefinition(raw)); });
  global.SET1_CATALOGUE = CATALOGUE;
})(typeof window !== 'undefined' ? window : globalThis);
