# 蟲神器 第6弾カード図鑑

> Version: v1.0 KNOWLEDGE-BASE
> 対象: ブースターパック第6弾 64種
> 用途: ゲームUI・ルールエンジンが参照する実装用知識ベース

## 0. 運用原則

- カード表面情報と生物分類は非公式DBを探索補助として構造化し、裁定は公式Q&Aを優先する。
- `＜○○＞` は `traits` として通常技から分離する。
- 不明点や解析不能項目は推測せず `blocked` に残す。
- 効果・裁定はゲーム実装に必要な意味へ短く整理し、ページ全体を転載しない。

## 1. 共通ソースと検証状態

- 公式Q&A: https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/
- カード探索補助（非公式）: https://mushijingi.com/
- Raw取得時刻: 2026-08-30T17:22:50.6037442Z
- 基本値・分類: `VERIFIED_SECONDARY`（公式現物との全件画像突合は未実施）
- 裁定: `OFFICIAL_QA_SUMMARY`（一致カードのみ）

## 2. 収録検査

- Expected / actual: 64 / 64
- Card-number coverage: PASS
- Card-number duplicate check: PASS
- Type total check: PASS
- 虫 / 強化 / 術: 48 / 7 / 9
- BLOCKED: 0

---

## 1/64 オオカレエダカマキリ

```yaml
officialNumber: "1/64"
name: "オオカレエダカマキリ"
set: "BOOSTER_SET_6"
rarity: "LR"
type: "INSECT"
color: "RED"
cost: 6
baseHp: 1700
skills:
  - name: "神のカマ斬撃"
    baseAp: 1000
    effectSummary: null
  - name: "ドラゴン蟷螂拳"
    baseAp: 700
    effectSummary: "この技は1度だけ使用できる。攻撃後、手札から強化カードか術カードを1つ選び、これに使用してもよい。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "カレエダカマキリ科"
  other: []
referencableTags:
  - "カレエダカマキリ科"
rulings:
  - "\"ドラゴン螳螂拳\"の効果で使用するカードは、コストを支払う必要はありますか？: いいえ、コストを支払う必要はありません。 \"ドラゴン螳螂拳\"の効果で使用するカードは、コストを支払わずに使用します。"
  - "\"ドラゴン螳螂拳\"による攻撃の間、＜毒霧噴射＞などで[オオカレエダカマキリ]が攻撃後より前に場を離れた場合、\"ドラゴン螳螂拳\"の効果は使えますか？: いいえ、使えません。 [オオカレエダカマキリ]が場を離れており、「これに使用する」ことができないため、カードを使用することはできません。"
  - "\"ドラゴン螳螂拳\"の効果で、使用する虫を選ばず複数の虫に効果がある [百足の狂乱]などの術を使用することは: いいえ、使用できません。 この効果で使用できる術カードは、\"ドラゴン螳螂拳\"を使った[オオカレエダカマキリ]を選んで使うものに限ります。"
  - "\"ドラゴン螳螂拳\"の効果で、[オオカレエダカマキリ]以外の虫を選び使用する[反逆の蛮勇]や[剣舞天翔の刹那]などの術を使用することは: はい、できます。 この場合\"ドラゴン螳螂拳\"を使った[オオカレエダカマキリ]を含めて選ぶ必要があります。"
  - "\"ドラゴン螳螂拳\"の効果で[草薙の紅剣]をつけた[オオカレエダカマキリ]は、その効果でもう1度だけ攻撃: いいえ、できません。 [草薙の紅剣]は「攻撃したとき」のタイミングで効果を発動する強化カードです。 \"ドラゴン蟷螂拳\"の効果で[草薙の紅剣]をつけた「攻撃後」は、「攻撃したとき」のタイミングよりも後のため「この虫は攻撃したとき、もう1度だけ攻撃できる。」は発動しません。"
  - "\"ドラゴン螳螂拳\"の効果で[蝦蛄の七芸]を使用することは: いいえ、できません。 [蝦蛄の七芸]は自分の場の強化カードを選んで使用するカードです。 \"ドラゴン蟷螂拳\"を使った[オオカレエダカマキリ]を選べないため、[蝦蛄の七芸]は\"ドラゴン蟷螂拳\"の効果で使用できません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/1/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 2/64 オソレハリアリ

```yaml
officialNumber: "2/64"
name: "オソレハリアリ"
set: "BOOSTER_SET_6"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 5
baseHp: 1200
skills:
  - name: "かみつく"
    baseAp: 800
    effectSummary: null
  - name: "超激痛針"
    baseAp: 0
    effectSummary: "この技は1度だけ使用できる。この技により、相手が縄張りを引いたとき、相手の手札が6枚以上あるなら、相手は手札を2枚選び捨て札に置く。 ※縄張りを引いた後に捨て札に置く。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "アリ科"
  other: []
referencableTags:
  - "アリ科"
  - "捨て札"
  - "手札操作"
  - "縄張り操作"
rulings:
  - "相手の手札が5枚のときに\"超激痛針\"で直接攻撃をしました。 相手が引いた縄張り[ミンミンゼミ]で、＜とびだす＞を使い場に出しました。 [ミンミンゼミ]を場に出したとこにより、相手の: いいえ、相手は手札を捨て札に置きません。 縄張りから引いた[ミンミンゼミ]が＜とびだす＞で場に出たことにより、相手の手札は5枚のままなので\"超激痛針\"は条件を満たすことができず、相手は手札を2枚選び捨て札に置くことはありません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/2/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 3/64 ウチワヤンマ

```yaml
officialNumber: "3/64"
name: "ウチワヤンマ"
set: "BOOSTER_SET_6"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 5
baseHp: 900
skills:
  - name: "とびかかる"
    baseAp: 700
    effectSummary: null
traits:
  - name: "軍配団扇"
    effectSummary: "これがコストを支払い場に出たとき、手札からコスト4以下の強化カードを1つ選び、自分の虫につけてもよい。"
effectSummary: null
taxonomy:
  order: null
  family: "サナエトンボ科"
  other: []
referencableTags:
  - "サナエトンボ科"
  - "軍配団扇"
  - "捨て札"
  - "登場時"
rulings:
  - "＜軍配団扇＞の効果で[口寄せの時蛹]や[白銀蜘蛛の糸]を自分の場の虫につけることは: いいえ、できません。 [口寄せの時蛹]と[白銀蜘蛛の糸]は、それぞれ手札や捨て札の虫を選んでつける強化カードです。 そのため、＜軍配団扇＞の効果で場の虫に[口寄せの時蛹]と[白銀蜘蛛の糸]をつけることはできません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/3/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 4/64 ナンベイオオタガメ

```yaml
officialNumber: "4/64"
name: "ナンベイオオタガメ"
set: "BOOSTER_SET_6"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 5
baseHp: 1200
skills:
  - name: "オオヅメバサミ"
    baseAp: 800
    effectSummary: null
traits:
  - name: "潜水"
    effectSummary: "これは場に出た次の相手のターン、自分のエサ場に青のエサが2つ以上あるかぎり、相手の術カードによりダメージを受けず破壊されない。"
effectSummary: null
taxonomy:
  order: null
  family: "コオイムシ科"
  other: []
referencableTags:
  - "コオイムシ科"
  - "潜水"
  - "エサ操作"
  - "遅延効果"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/4/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 5/64 アカウシアブ

```yaml
officialNumber: "5/64"
name: "アカウシアブ"
set: "BOOSTER_SET_6"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 3
baseHp: 700
skills:
  - name: "さす"
    baseAp: 600
    effectSummary: null
traits:
  - name: "血の取引"
    effectSummary: "これが場に出たとき、相手は縄張りを2枚引いてもよい。そうしたなら、この虫を破壊する。"
effectSummary: null
taxonomy:
  order: null
  family: "アブ科"
  other: []
referencableTags:
  - "アブ科"
  - "血の取引"
  - "登場時"
  - "縄張り操作"
rulings:
  - "[コロギス]が場にいるとき、＜血の取引＞の効果は使えますか？: いいえ。使うことができません。 ＜血の取引＞は「場に出たとき」と書かれている技なので使用できません。 相手は縄張りを2枚引くことを選べず、[アカウシアブ]が＜血の取引＞の効果で破壊されることもありません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/5/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 6/64 ツシマカブリモドキ

```yaml
officialNumber: "6/64"
name: "ツシマカブリモドキ"
set: "BOOSTER_SET_6"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 3
baseHp: 500
skills:
  - name: "かみつぶす"
    baseAp: 400
    effectSummary: null
  - name: "肉食"
    baseAp: 800
    effectSummary: "この技は自分の捨て札に虫が5つ以上あるとき使用できる。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "オサムシ科"
  other: []
referencableTags:
  - "オサムシ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/6/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 7/64 エゾオナガバチ

```yaml
officialNumber: "7/64"
name: "エゾオナガバチ"
set: "BOOSTER_SET_6"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 300
skills:
  - name: "かみきる"
    baseAp: 300
    effectSummary: null
  - name: "産みつける"
    baseAp: 200
    effectSummary: "この技で相手の虫を破壊したとき、自分の捨て札に～バチ科の虫があるなら、1つ選び手札に戻してもよい。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "ヒメバチ科"
  other: []
referencableTags:
  - "ヒメバチ科"
  - "捨て札"
  - "破壊時"
  - "手札操作"
rulings:
  - "[エゾオナガバチ]の\"産みつける\"攻撃で[キマダラドクバッタ]を破壊したとき、＜トウワタ毒＞で破壊された[エゾオナガバチ]を手札に戻すことは: いいえ、できません。 \"産みつける\"攻撃と＜トウワタ毒＞の効果は同じタイミングで発揮されますが、同時に発揮した効果が複数ある場合は現在ターンを進行しているプレイヤーの効果から先に処理する為、\"産みつける\"の効果は＜トウワタ毒＞で[エゾオナガバチ]が破壊される前に処理されます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/7/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 8/64 コオイムシ

```yaml
officialNumber: "8/64"
name: "コオイムシ"
set: "BOOSTER_SET_6"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 300
skills:
  - name: "ツメバサミ"
    baseAp: 300
    effectSummary: null
traits:
  - name: "潜水"
    effectSummary: "これは場に出た次の相手のターン、自分のエサ場に青のエサが2つ以上あるかぎり、相手の術カードによりダメージを受けず破壊されない。"
effectSummary: null
taxonomy:
  order: null
  family: "コオイムシ科"
  other: []
referencableTags:
  - "コオイムシ科"
  - "潜水"
  - "エサ操作"
  - "遅延効果"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/8/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 9/64 デザートヘアリースコーピオン

```yaml
officialNumber: "9/64"
name: "デザートヘアリースコーピオン"
set: "BOOSTER_SET_6"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 5
baseHp: 1000
skills:
  - name: "きりきざむ"
    baseAp: 700
    effectSummary: null
  - name: "毒針"
    baseAp: 1000
    effectSummary: "この技は1度だけ使用できる。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "アツオサソリ科"
  other: []
referencableTags:
  - "アツオサソリ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/9/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 10/64 ボウレイカマキリ

```yaml
officialNumber: "10/64"
name: "ボウレイカマキリ"
set: "BOOSTER_SET_6"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 300
skills:
  - name: "カマ斬撃"
    baseAp: 300
    effectSummary: null
traits:
  - name: "亡霊送り"
    effectSummary: "これが虫の攻撃により破壊されたとき、手札から虫を1つ選び捨て札に置いてもよい。そうしたなら、これを手札に戻す。"
effectSummary: null
taxonomy:
  order: null
  family: "ハナカマキリ科"
  other: []
referencableTags:
  - "ハナカマキリ科"
  - "亡霊送り"
  - "捨て札"
  - "破壊時"
  - "ダメージ変更"
  - "手札操作"
  - "縄張り操作"
rulings:
  - "[ボウレイカマキリ]が相手の虫の攻撃で破壊されたとき、＜亡霊送り＞の効果で、縄張りから引いた虫カードを捨てることは: いいえ、できません。 ＜亡霊送り＞は[ボウレイカマキリ]が相手の虫の攻撃で破壊されたタイミングで発動する＜＞の技で、縄張りを引くより前のタイミングで発動します。"
  - "相手の[エメラルドゴキブリバチ]の\"操り針\"攻撃で、[ボウレイカマキリ]が破壊されたとき＜亡霊送り＞を使って破壊された[ボウレイカマキリ]を手札に戻すことは: いいえ、できません。 \"操り針\"攻撃と＜亡霊送り＞の効果は同じタイミングで発揮されますが、同時に発揮した効果が複数ある場合は現在ターンを進行しているプレイヤーの効果から先に処理する為、先に\"操り針\"の効果で[ボウレイカマキリ]が相手の場に出るため、＜亡霊送り＞の効果で手札に戻すことができません。 ただし、＜亡霊送り＞の「手札から虫を1つ選び捨て札に置いてもよい。」の効果により、手札の虫カードを捨て札に置くことはできます。"
  - "[軍配虫の大団扇]をつけた相手の虫の攻撃で、[ボウレイカマキリ]が破壊されたとき＜亡霊送り＞を使って破壊された[ボウレイカマキリ]を手札に戻すことは: いいえ、できません。 [軍配虫の大団扇]と＜亡霊送り＞の効果は同じタイミングで発揮されますが、同時に発揮した効果が複数ある場合は現在ターンを進行しているプレイヤーの効果から先に処理します。、先に[軍配虫の大団扇]の効果で[ボウレイカマキリ]を山札の一番下に置くため、＜亡霊送り＞の効果で手札に戻すことができません。 ただし、＜亡霊送り＞の「手札から虫を1つ選び捨て札に置いてもよい。」の効果により、手札の虫カードを捨て札に置くことはできます"
  - "[ヒジリタマオシコガネ]の\"フンコロガシ\"攻撃で[ボウレイカマキリ]が破壊された場合、＜亡霊送り＞の効果で捨て札に置いた虫カードを\"フンコロガシ\"の効果で山札の一番下に置くことは: いいえ、できません。 技の効果はタイミングの記載がない限り、ダメージを与える前に発動し、処理されるので、\"フンコロガシ\"の効果は技のダメージを与える前のタイミングで発動されます。 技のダメージにより[ボウレイカマキリ]が破壊されるより前のタイミングであるため、＜亡霊送り＞の効果で捨て札に置いた虫カードを\"フンコロガシ\"の効果で山札の一番下に置くことはできません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/10/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 11/64 マツモムシ

```yaml
officialNumber: "11/64"
name: "マツモムシ"
set: "BOOSTER_SET_6"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 1
baseHp: 200
skills:
  - name: "さす"
    baseAp: 200
    effectSummary: null
traits:
  - name: "潜水"
    effectSummary: "これは場に出た次の相手のターン、自分のエサ場に青のエサが2つ以上あるかぎり、相手の術カードによりダメージを受けず破壊されない。"
effectSummary: null
taxonomy:
  order: null
  family: "マツモムシ科"
  other: []
referencableTags:
  - "マツモムシ科"
  - "潜水"
  - "エサ操作"
  - "遅延効果"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/11/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 12/64 アカカミアリ

```yaml
officialNumber: "12/64"
name: "アカカミアリ"
set: "BOOSTER_SET_6"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 1
baseHp: 200
skills:
  - name: "赤咬み"
    baseAp: 200
    effectSummary: "この技により、相手が縄張りを引いたとき、自分の裏向きの赤のエサを最大2つまで選び、表向きにしてもよい。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "アリ科"
  other: []
referencableTags:
  - "アリ科"
  - "裏向き"
  - "エサ操作"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/12/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 13/64 ゴイシシジミ（幼虫）

```yaml
officialNumber: "13/64"
name: "ゴイシシジミ（幼虫）"
set: "BOOSTER_SET_6"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 1
baseHp: 100
skills:
  - name: "かじる"
    baseAp: 200
    effectSummary: null
traits:
  - name: "好物"
    effectSummary: "自分のエサ場にあるアブラムシ科の虫1つにつき、この虫の体力と攻撃力を100増やす。"
effectSummary: null
taxonomy:
  order: null
  family: "シジミチョウ科"
  other: []
referencableTags:
  - "シジミチョウ科"
  - "好物"
  - "裏向き"
  - "エサ操作"
  - "ダメージ変更"
  - "縄張り操作"
rulings:
  - "自分のエサ場にアブラムシ科の虫が1枚あり、 ＜好物＞によって体力200になった自分の[ゴイシシジミ（幼虫）]が100ダメージを受けている状態です。 このとき、相手の効果により自分の: はい、破壊されます。 エサ場のアブラムシ科の虫が裏向きになったことで、体力が100に下がり（元に戻り）、100ダメージを受けている[ゴイシシジミ（幼虫）]は体力以上のダメージを受けているため破壊されます。 虫の攻撃による破壊ではないため、このとき自分は縄張りを引きません。"
  - "自分のエサ場にアブラムシ科の虫が1枚あり、＜好物＞によって体力200になった自分の[ゴイシシジミ]が100ダメージを受けている状態です。 このとき、相手の効果により自分のエサ場のア: はい、破壊されます。 エサ場のアブラムシ科の虫が裏向きになったことで、体力が100に下がり（元に戻り）、100ダメージを受けている[ゴイシシジミ]は体力以上のダメージを受けているため破壊されます。 虫の攻撃による破壊ではないため、このとき自分は縄張りを引きません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/13/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 14/64 セミヤドリガ（幼虫）

```yaml
officialNumber: "14/64"
name: "セミヤドリガ（幼虫）"
set: "BOOSTER_SET_6"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 1
baseHp: 200
skills:
  - name: "すいつく"
    baseAp: 200
    effectSummary: null
traits:
  - name: "セミ宿り"
    effectSummary: "自分の場にセミ科の虫がいるとき、この虫の体力と攻撃力を100増やし、相手はこれ以外の虫を攻撃できない。 ※この技を持つ虫が複数いるとき、相手はどれかを選んで攻撃する。"
effectSummary: null
taxonomy:
  order: null
  family: "セミヤドリガ科"
  other: []
referencableTags:
  - "セミヤドリガ科"
  - "セミ宿り"
  - "攻撃制限"
  - "ダメージ変更"
  - "縄張り操作"
rulings:
  - "自分の場にセミ科の虫が1枚いて、場にある[セミヤドリガ（幼虫）]が200ダメージを受けている状態です。 このとき、自分の場のセミ科の虫カードが破壊され、場からいなくなりました。 こ: はい、破壊されます。 自分の場にセミ科の虫がいなくなったことで、体力が200に下がり（元に戻り）、200ダメージを受けている[セミヤドリガ（幼虫）]は体力以上のダメージを受けているため破壊されます。 虫の攻撃による破壊ではないため、このとき自分は縄張りを引きません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/14/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 15/64 アオバアリガタハネカクシ

```yaml
officialNumber: "15/64"
name: "アオバアリガタハネカクシ"
set: "BOOSTER_SET_6"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 1
baseHp: 100
skills:
  - name: "やけど虫"
    baseAp: "X"
    effectSummary: "自分の捨て札にある赤の虫の数×100のダメージを与える。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "ハネカクシ科"
  other: []
referencableTags:
  - "ハネカクシ科"
  - "捨て札"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/15/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 16/64 ゴクラクトリバネアゲハ

```yaml
officialNumber: "16/64"
name: "ゴクラクトリバネアゲハ"
set: "BOOSTER_SET_6"
rarity: "LR"
type: "INSECT"
color: "BLUE"
cost: 6
baseHp: 1800
skills:
  - name: "神の吸引"
    baseAp: 1000
    effectSummary: null
traits:
  - name: "極楽還り"
    effectSummary: "これがコストを支払い場に出たとき、自分の捨て札にゴクラクトリバネアゲハがあるなら、それを場に出してもよい。 ※(幼虫)は除く。"
effectSummary: null
taxonomy:
  order: null
  family: "アゲハチョウ科"
  other: []
referencableTags:
  - "アゲハチョウ科"
  - "極楽還り"
  - "捨て札"
  - "登場時"
  - "ダメージ変更"
  - "縄張り操作"
rulings:
  - "＜極楽還り＞の効果で出た[ゴクラクトリバネアゲハ]は、そのターン攻撃することが: はい、できます。"
  - "[蜉蝣の閃き]の効果で出した[ゴクラクトリバネアゲハ]はコストを支払って出したことに: いいえ、[蜉蝣の閃き]のコストを支払ったことになります。 ＜極楽還り＞が発動するのは、[ゴクラクトリバネアゲハ]自身のコストを支払って場に出した場合のみです。"
  - "[花蝶の幻舞]の効果でコストが3下がった[ゴクラクトリバネアゲハ]を出した場合、＜極楽還り＞は使用: はい、使用できます。 [花蝶の幻舞]の効果で[ゴクラクトリバネアゲハ]のコストが3に変動していますが、[ゴクラクトリバネアゲハ]のコストを3コスト支払っているので、＜極楽還り＞は有効です。"
  - "[花蝶の幻舞]を2回使ってコストが6下がったゴクラクトリバネアゲハを出した場合、＜極楽還り＞は使用: はい、使用できます。 [花蝶の幻舞]の効果で[ゴクラクトリバネアゲハ]のコストが0に変動していますが、[ゴクラクトリバネアゲハ]のコストを0コスト支払っているので、＜極楽還り＞は有効です。 特別記載がない限り、コスト0のカードを使用するときのコストは0コスト支払ったことになります。"
  - "場に[ネプチューンオオカブト]がいて、＜威圧の大角＞が有効な状態です。 花蝶の幻舞を2回使ってコストが6下がった[ゴクラクトリバネアゲハ]を1コスト支払って出した場合、＜極楽還り＞: はい、使用できます。"
  - "コロギスが場にいるとき、ゴクラクトリバネアゲハの＜極楽羽化＞は使用: いいえ、使用できません。ゴクラクトリバネアゲハの＜極楽羽化＞は「コストを支払い場に出たとき」発動する効果なので、コロギスが場にいるとき、＜危険察知＞の効果で使用できなくなります。"
  - "\"極楽羽化\"を使い、相手の虫にダメ―ジを与えたり、相手を直接攻撃して縄張りを引かせることは: いいえ、できません。 「極楽羽化」はダメージを与える前に[ゴクラクトリバネアゲハ（幼虫）]を破壊するため、ダメージを与えたり、相手への直接攻撃により縄張りを引かせることはできません。"
  - "\"極楽羽化\"を使った場合、捨て札に[ゴクラクトリバネアゲハ]がいなくても、技を使った[ゴクラクトリバネアゲハ（幼虫）]を破壊しなければなりませんか？: はい、破壊されます。 「極楽羽化」を使った場合、[ゴクラクトリバネアゲハ（幼虫）]は必ず破壊されます。"
  - "[空蝉の皮鎧]をつけた[ゴクラクトリバネアゲハ（幼虫）]が\"極楽羽化\"で直接攻撃をした場合、 [ゴクラクトリバネアゲハ（幼虫）]を破壊せずに[ゴクラクトリバネアゲハ]を出すことはで: はい、出すことができます。 \"極楽羽化\"の直接攻撃も有効です。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/16/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 17/64 オオゴマダラ

```yaml
officialNumber: "17/64"
name: "オオゴマダラ"
set: "BOOSTER_SET_6"
rarity: "SR"
type: "INSECT"
color: "BLUE"
cost: 5
baseHp: 1300
skills:
  - name: "すいつくす"
    baseAp: 700
    effectSummary: null
traits:
  - name: "黄金羽化"
    effectSummary: "これが口寄せの時蛹により場に出たとき、その口寄せの時蛹を破壊し、この虫の体力を700、攻撃力を300増やす。"
effectSummary: null
taxonomy:
  order: null
  family: "タテハチョウ科"
  other: []
referencableTags:
  - "タテハチョウ科"
  - "黄金羽化"
  - "登場時"
  - "ダメージ変更"
rulings:
  - "＜黄金羽化＞を使用した後に[カイコ]が場に出て、＜くちなし＞の効果で＜黄金羽化＞が失われました。 この場合、＜黄金羽化＞の効果で増えた[オオゴマダラ]の体力と攻撃力は: ＜黄金羽化＞で増えた[オオゴマダラ]の体力と攻撃力はそのままになります。 ＜黄金羽化＞効果の発動と処理はすでに完了しており、＜くちなし＞により＜黄金羽化＞が失われたとしても、すでに処理された効果は失われません。"
  - "コロギスが場にいるとき、オオゴマダラの＜黄金羽化＞は使用: いいえ、使用できません。オオゴマダラの＜黄金羽化＞は「口寄せの時蛹により場に出たとき」発動する効果なので、コロギスが場にいるとき、＜危険察知＞の効果で使用できなくなります。"
  - "「黄金蛹」の効果で[口寄せの時蛹]を使用する場合、コストは支払う必要はありますか？: いいえ、コストを支払う必要はありません。 \"黄金蛹\"の効果で使用する[口寄せの時蛹]は、コストを支払わずに使用します。"
  - "「黄金蛹」で攻撃し、破壊などで攻撃後より前にこの虫が場を離れた場合、攻撃後に[口寄せの時蛹]を使用: はい、できます。 効果の処理の前に[オオゴマダラ幼虫]が場を離れているものの、手札に[口寄せの時蛹]があるなら効果を実行できるので、手札から[口寄せの時蛹]を使用することができます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/17/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 18/64 フェイスタメルシワバネクワガタ

```yaml
officialNumber: "18/64"
name: "フェイスタメルシワバネクワガタ"
set: "BOOSTER_SET_6"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 400
skills:
  - name: "はさむ"
    baseAp: 400
    effectSummary: null
  - name: "ギロチンバサミ"
    baseAp: 700
    effectSummary: "この技はコスト5以上の虫にしか使用できない。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
  - "捨て札"
rulings:
  - "相手の捨て札に＜生きた化石＞を持つ虫が2つあり、相手の場にあるコスト6の[テイオウムカシヤンマ]が＜生きた化石＞の効果でコストが2つ減っています。 このとき、\"ギロチンバサミ\"を[: はい、使用できます。 コストを参照するカードや効果は、特別記載がない限りカードに書かれている元のコストを参照します。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/18/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 19/64 エラフスホソアカクワガタ

```yaml
officialNumber: "19/64"
name: "エラフスホソアカクワガタ"
set: "BOOSTER_SET_6"
rarity: "SR"
type: "INSECT"
color: "BLUE"
cost: 4
baseHp: 700
skills:
  - name: "オオアコバサミ"
    baseAp: 700
    effectSummary: null
  - name: "大顎二刀"
    baseAp: 0
    effectSummary: "この技はこれに強化カードがついていないと使用できない。この技により相手が縄張りを引いたとき、相手はもう1枚縄張りを引く。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
  - "縄張り操作"
rulings:
  - "\"大顎二刀\"攻撃で合計2枚の縄張りを相手に引かせるとき、その縄張りは同時に引きますか？: いいえ、1枚ずつ引きます。 相手は\"大顎二刀\"による攻撃で縄張りを1枚引いた後、\"大顎二刀\"の効果で縄張りを1枚引くことになります。"
  - "強化カードをつけた[エラフスホソアカクワガタ]が\"大顎二刀\"で直接攻撃しました。 直接攻撃により相手が縄張りを引いた後、\"大顎二刀\"の効果で相手が引いた縄張りが＜迎撃＞をもつ[稲妻: いいえ、できません。 ＜迎撃＞は、虫の攻撃によって縄張りを引いた場合にのみ使用できます。 \"大顎二刀\"の効果で引いた縄張りは、虫の攻撃で引いた縄張りではありません。"
  - "強化カードをつけた[エラフスホソアカクワガタ]が\"大顎二刀\"攻撃で[ノミバッタ]を破壊し、相手は攻撃によって[ノミバッタ]が破壊されたため縄張りを引きました。その後、\"大顎二刀\"の: いいえ、できません。 ＜とびでる＞は、相手の虫の攻撃で破壊されたことで引いた縄張りにのみ効果があります。 \"大顎二刀\"の効果で引く縄張りは、ノミバッタを攻撃で破壊したことによるものではありません。"
  - "強化カードをつけた[エラフスホソアカクワガタ]が\"大顎二刀\"攻撃で[チャドクガ（幼虫）]を破壊しました。 相手が＜毒蛾の毛針＞によって、虫の破壊による縄張りを引かないことを選んだ場: いいえ、できません。 縄張りを引いていないため\"大顎二刀\"の効果は発揮されません。"
  - "\"大顎二刀\"の、縄張りをもう1枚引かせる効果で相手に縄張りを引かせたとき、その効果でさらにもう1枚縄張りを引かせることは: この効果は、\"大顎二刀\"を使った攻撃による相手の虫の破壊、直接攻撃にで縄張りを引かせたときに、もう1枚だけ縄張りを追加で引かせる効果です。 \"大顎二刀\"の効果で縄張りを引いた時に発動される効果ではありません。"
  - "強化カードが1枚だけついた、攻撃済みの[エラフスホソアカクワガタ]に[閻魔虫の斬砕剣]を使用しました。 この場合\"大顎二刀\"を使用して攻撃: いいえ、できません。 [閻魔虫の斬砕剣]は、強化カードを破壊した後で攻撃をすることができる効果です。 攻撃する時点で強化カードがないため\"大顎二刀\"を使用できません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/19/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 20/64 ヘレナモルフォ

```yaml
officialNumber: "20/64"
name: "ヘレナモルフォ"
set: "BOOSTER_SET_6"
rarity: "SR"
type: "INSECT"
color: "BLUE"
cost: 4
baseHp: 800
skills:
  - name: "すいつくす"
    baseAp: 500
    effectSummary: null
traits:
  - name: "極美蝶"
    effectSummary: "これは強化カードを1つしかつけられない。これが場にいるとき、この虫に使用する強化カードのコストを4減らす。"
effectSummary: null
taxonomy:
  order: null
  family: "タテハチョウ科"
  other: []
referencableTags:
  - "タテハチョウ科"
  - "極美蝶"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/20/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 21/64 チリクワガタ

```yaml
officialNumber: "21/64"
name: "チリクワガタ"
set: "BOOSTER_SET_6"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 4
baseHp: 800
skills:
  - name: "はさむ"
    baseAp: 500
    effectSummary: null
  - name: "もう1つのアゴ"
    baseAp: 1000
    effectSummary: "この技は体力が減っている虫にしか使用できない。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
  - "ダメージ変更"
rulings:
  - "他の虫の技などで0ダメージを受けた相手の虫を、「体力が減っている虫」として\"もう1つのアゴ\"で攻撃することは: いいえ、できません。 ダメージは0でも与えたことになりますが、体力が減ったとはみなしません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/21/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 22/64 フローレンシスニセヒメカブト

```yaml
officialNumber: "22/64"
name: "フローレンシスニセヒメカブト"
set: "BOOSTER_SET_6"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 400
skills:
  - name: "ツノ突進"
    baseAp: 400
    effectSummary: null
  - name: "ヒメカブト投げ"
    baseAp: 0
    effectSummary: "この技を受けた虫についている強化カードを1つ選び破壊する。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
  - "ダメージ変更"
rulings:
  - "\"ヒメカブト投げ\"で強化カードを破壊するのはダメージを与える前ですか？後ですか？: ダメージを与える前に強化カードを破壊します。 技の効果はタイミングの記載がない限り、ダメージを与える前に発動し、処理されるので、\"ヒメカブト投げ\"で強化カードを破壊するのはダメージを与える前となります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/22/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 23/64 コノハチョウ

```yaml
officialNumber: "23/64"
name: "コノハチョウ"
set: "BOOSTER_SET_6"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 600
skills:
  - name: "すいつくす"
    baseAp: 300
    effectSummary: null
  - name: "かくれる"
    baseAp: 100
    effectSummary: "この技は1度だけ使用できる。攻撃後、次の相手のターン終了時までこの虫を裏返す。この虫は裏返しの間、いないものとして扱う。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "タテハチョウ科"
  other: []
referencableTags:
  - "タテハチョウ科"
  - "裏向き"
  - "遅延効果"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/23/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 24/64 ハルゼミ

```yaml
officialNumber: "24/64"
name: "ハルゼミ"
set: "BOOSTER_SET_6"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 1
baseHp: 200
skills:
  - name: "しぼりとる"
    baseAp: 200
    effectSummary: null
traits:
  - name: "春風"
    effectSummary: "これが場に出たときこれが場に出たとき、相手のエサが自分のエサより2つ以上多いなら、自分の手札からエサを最大2つまで選び、エサ場に置いてもよい。 ※このエサのコストはこのターン発生しない。"
effectSummary: null
taxonomy:
  order: null
  family: "セミ科"
  other: []
referencableTags:
  - "セミ科"
  - "春風"
  - "エサ操作"
  - "登場時"
rulings:
  - "＜春風＞の効果でエサ場に置くカードは表側ですか？裏側ですか？: 表側でエサ場に置きます。 特別記載がない限り、エサ場に置かれるカードは表向きで置かれます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/24/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 25/64 パプアキンイロクワガタ

```yaml
officialNumber: "25/64"
name: "パプアキンイロクワガタ"
set: "BOOSTER_SET_6"
rarity: "SR"
type: "INSECT"
color: "BLUE"
cost: 2
baseHp: 300
skills:
  - name: "はさむ"
    baseAp: 200
    effectSummary: null
traits:
  - name: "色彩変化"
    effectSummary: "これが場に出たとき、赤か緑の色を指定してもよい。そうしたなら、ターン終了時まで、これはその色になる。"
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
  - "色彩変化"
  - "色変更"
  - "登場時"
  - "遅延効果"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/25/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 26/64 ツマジロスカシマダラ

```yaml
officialNumber: "26/64"
name: "ツマジロスカシマダラ"
set: "BOOSTER_SET_6"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 2
baseHp: 300
skills:
  - name: "すいとる"
    baseAp: 300
    effectSummary: null
traits:
  - name: "スケスケの翅"
    effectSummary: "これに強化カードがついているなら、この虫は術カードの対象にならない。 ※＜迎撃＞の効果は受ける。"
effectSummary: null
taxonomy:
  order: null
  family: "タテハチョウ科"
  other: []
referencableTags:
  - "タテハチョウ科"
  - "スケスケの翅"
  - "エサ操作"
rulings:
  - "強化カードがついていて攻撃済みの[ツマジロスカシマダラ]に[閻魔虫の斬砕剣]を使用することは: いいえ、できません。 [閻魔虫の斬砕剣]は「強化カードがついている攻撃済みの虫を1つ選び」使用する、虫を対象にする術カードのため、＜スケスケの翅＞の効果で「術カードの対象にならない。」効果が発動している[ツマジロスカシマダラ]に[閻魔虫の斬砕剣]を使用することはできません。"
  - "4/17追記 自分の場の[ツマジロスカシマダラ]とエサ場の強化カード2枚を対象に[剣舞天翔の刹那]を使用しました。強化カードが1枚ついた時点で＜スケスケの翅＞の効果が発揮されますが: 2枚です。 [剣舞天翔の刹那]の効果で[ツマジロスカシマダラ]に1枚目の強化カードがつき、術の対象にならない効果の＜スケスケの翅＞が有効になりますが、＜スケスケの翅＞が有効になる前に対象に選ばれ、効果を処理しているものには影響はありません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/26/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 27/64 ジュウシチネンゼミ

```yaml
officialNumber: "27/64"
name: "ジュウシチネンゼミ"
set: "BOOSTER_SET_6"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 500
skills:
  - name: "しぼりとる"
    baseAp: 400
    effectSummary: null
traits:
  - name: "とびでる"
    effectSummary: "この虫が虫の攻撃により破壊されたとき、引いた縄張りがセミ科ならそれを場に出してもよい。 ※＜とびだす＞を持つ虫が場にいるとき、＜とびだす＞を持つ虫を引いても場に出せる。"
effectSummary: null
taxonomy:
  order: null
  family: "セミ科"
  other: []
referencableTags:
  - "セミ科"
  - "とびでる"
  - "破壊時"
rulings:
  - "＜とびでる＞の効果で[ヨツコブツノゼミ]や[セミヤドリガ(幼虫)]を出せますか？: いいえ、できません。 [ヨツコブツノゼミ]はツノゼミ科、[セミヤドリガ(幼虫)]はセミヤドリガ科でそれぞれセミ科ではないので、＜とびでる＞の効果に当てはまりません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/27/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 28/64 シマハナアブ

```yaml
officialNumber: "28/64"
name: "シマハナアブ"
set: "BOOSTER_SET_6"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 2
baseHp: 300
skills:
  - name: "たいあたり"
    baseAp: 300
    effectSummary: null
traits:
  - name: "ベイツ型擬態"
    effectSummary: "自分の場に、ほかの虫がいるなら、この虫は攻撃を受けない。 ※この技を持つ虫だけが複数いるとき、相手はどれかを選んで攻撃する。"
effectSummary: null
taxonomy:
  order: null
  family: "ハナアブ科"
  other: []
referencableTags:
  - "ハナアブ科"
  - "ベイツ型擬態"
  - "攻撃制限"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/28/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 29/64 コルリクワガタ

```yaml
officialNumber: "29/64"
name: "コルリクワガタ"
set: "BOOSTER_SET_6"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 1
baseHp: 500
skills:
  - name: "はさむ"
    baseAp: 0
    effectSummary: null
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/29/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 30/64 ゴイシシジミ

```yaml
officialNumber: "30/64"
name: "ゴイシシジミ"
set: "BOOSTER_SET_6"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 1
baseHp: 100
skills:
  - name: "すいとる"
    baseAp: 200
    effectSummary: null
traits:
  - name: "好物"
    effectSummary: "自分のエサ場にあるアブラムシ科の虫1つにつき、この虫の体力と攻撃力を100増やす。"
effectSummary: null
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "好物"
  - "裏向き"
  - "エサ操作"
  - "ダメージ変更"
  - "縄張り操作"
rulings:
  - "自分のエサ場にアブラムシ科の虫が1枚あり、 ＜好物＞によって体力200になった自分の[ゴイシシジミ（幼虫）]が100ダメージを受けている状態です。 このとき、相手の効果により自分の: はい、破壊されます。 エサ場のアブラムシ科の虫が裏向きになったことで、体力が100に下がり（元に戻り）、100ダメージを受けている[ゴイシシジミ（幼虫）]は体力以上のダメージを受けているため破壊されます。 虫の攻撃による破壊ではないため、このとき自分は縄張りを引きません。"
  - "自分のエサ場にアブラムシ科の虫が1枚あり、＜好物＞によって体力200になった自分の[ゴイシシジミ]が100ダメージを受けている状態です。 このとき、相手の効果により自分のエサ場のア: はい、破壊されます。 エサ場のアブラムシ科の虫が裏向きになったことで、体力が100に下がり（元に戻り）、100ダメージを受けている[ゴイシシジミ]は体力以上のダメージを受けているため破壊されます。 虫の攻撃による破壊ではないため、このとき自分は縄張りを引きません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/30/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "BLOCKED"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 31/64 ユウレイヒレアシナナフシ

```yaml
officialNumber: "31/64"
name: "ユウレイヒレアシナナフシ"
set: "BOOSTER_SET_6"
rarity: "LR"
type: "INSECT"
color: "GREEN"
cost: 6
baseHp: 1600
skills:
  - name: "神のヒレ脚"
    baseAp: 1000
    effectSummary: null
traits:
  - name: "霊体"
    effectSummary: "この虫が虫の攻撃により破壊されるとき、かわりに、縄張りを2枚引いてもよい。そうしたなら、この虫の体力を元の値まで回復する。"
effectSummary: null
taxonomy:
  order: null
  family: "ナナフシ科"
  other: []
referencableTags:
  - "ナナフシ科"
  - "霊体"
  - "捨て札"
  - "ダメージ変更"
  - "縄張り操作"
rulings:
  - "＜霊体＞の効果で、自分の縄張りを2枚引くとき、その縄張りは同時に引きますか？: いいえ、引く縄張りは1枚ずつ順番に引きます。"
  - "強化カードをつけた[エラフスホソアカクワガタ]が\"大顎ニ刀\"攻撃で相手の[ユウレイヒレアシナナフシ]を破壊しました。 相手が＜霊体＞を使用して[ユウレイヒレアシナナフシ]が破壊され: いいえ、できません。 相手が引いた2枚の縄張りは＜霊体＞の効果によるもので、\"大顎ニ刀\"攻撃による虫の破壊によるものではありません。 そのため、相手は\"大顎ニ刀\"の効果で縄張りを引きません。"
  - "自分の縄張りが0枚か1枚のとき、＜霊体＞を使うことは: いいえ、使うことができません。 ＜霊体＞を使うためにはかならず2枚以上の縄張りが必要です。"
  - "＜霊体＞の効果で、自分の縄張りにある表向きの[蜜蝋の壁]を引くことは: はい、できます。 この場合でも、ユウレイヒレアシナナフシは破壊されず、体力を元の値まで回復します。 縄張りから引いた「蜜蝋の壁]はその効果により捨て札に置かれます。"
  - "＜霊体＞の効果で、＜とびだす＞や＜かばう＞、＜装着＞や＜毒霧防御＞を使うことは: はい、使うことができます。"
  - "＜霊体＞の効果を使うとき、自分の縄張りの中に＜毒霧防御＞の効果で 表向きで置かれた[オオキンカメムシ]がある場合、どうすればよいですか？: ＜毒霧防御＞の効果により、1枚目に引く縄張りを引くかわりに表向きで置かれた[オオキンカメムシ]を捨札に置き、その後2枚目の縄張りを引きます。"
  - "＜霊体＞の効果を1ターンに2回以上使うことは: はい、使うことができます。"
  - "[空蝉の皮鎧]がつけられた[ユウレイヒレアシナナフシ]が、虫の攻撃により破壊される場合、[空蝉の皮鎧]の効果と＜霊体＞と、どちらの効果を使うことが: 発動タイミングが同じであるため、[ユウレイヒレアシナナフシ]の持ち主がどちらを使うか決めることができます。 [空蝉の皮鎧]の効果を先に使う場合、[空蝉の皮鎧]が破壊され、 [ユウレイヒレアシナナフシ]が破壊されなくなるため、＜霊体＞は使えません。 ＜霊体＞を先に使う場合、縄張りを2枚引き[ユウレイヒレアシナナフシ]が破壊されなくなるため、[空蝉の皮鎧]はそのまま残ります。"
  - "[不滅の王台]や[オオミズアオ]の＜月光＞が発動しているとき、[ユウレイヒレアシナナフシ]が、虫の攻撃により破壊される場合、[ユウレイヒレアシナナフシ]は＜霊体＞の効果で縄張りを引: いいえ。回復しません。 [ユウレイヒレアシナナフシ]の＜霊体＞は縄張りを2枚引かなくては発動しないため、縄張りを引かない、または1枚しか引けない場合、[ユウレイヒレアシナナフシ]は破壊されます。"
  - "＜霊体＞の効果で縄張りを引いたとき、そのカードが＜迎撃＞だった場合に使用することは: いいえ、使用できません。 その場合＜迎撃＞のカードは＜霊体＞の効果で引いているため、引かせた虫がおらず対象を選ぶことができません。"
  - "[金色の顎門]を使用した、相手[トビズムカデ]の\"毒のキバ\"で、[ユウレイヒレアシナナフシ]が2000の回復しないダメージを受けて破壊されたため、＜霊体＞を使用し、破壊されるかわり: はい、使用することができます。 攻撃ダメージで虫が破壊されるとき、＜霊体＞などの効果により破壊がされなかった後も、受けているダメージで虫が破壊されるかの確認をします。 この確認で、受けているダメージにより虫が破壊される場合、それは虫の攻撃により破壊されたとして扱うため、＜霊体＞の効果は使用が可能です。 また、＜霊体＞を使用しなかった場合は通常の攻撃破壊が行われているため、縄張りがあれば1枚引きます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/31/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 32/64 ヨツモンヒラタツユムシ

```yaml
officialNumber: "32/64"
name: "ヨツモンヒラタツユムシ"
set: "BOOSTER_SET_6"
rarity: "SR"
type: "INSECT"
color: "GREEN"
cost: 5
baseHp: 1100
skills:
  - name: "とびはねる"
    baseAp: 800
    effectSummary: null
traits:
  - name: "露の恵み"
    effectSummary: "自分の捨て札にある強化カート1つにつき、この虫のコストを1減らす。"
effectSummary: null
taxonomy:
  order: null
  family: "キリギリス科"
  other: []
referencableTags:
  - "キリギリス科"
  - "露の恵み"
  - "捨て札"
rulings:
  - "手札にある5コストの[ヨツモンヒラタツユムシ]が＜露の恵み＞の効果によりコストが1減っているとき、[繚乱の足掻き]を使用して、効果で場のコスト4の虫と交換することが: いいえ。できません。 [繚乱の足掻き]などのコストを参照するカードや効果は、特別記載がない限りカードに書かれている元のコストを参照します。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/32/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 33/64 ウスリーオオカミキリ

```yaml
officialNumber: "33/64"
name: "ウスリーオオカミキリ"
set: "BOOSTER_SET_6"
rarity: "SR"
type: "INSECT"
color: "GREEN"
cost: 5
baseHp: 1000
skills:
  - name: "キバ無双"
    baseAp: 700
    effectSummary: null
traits:
  - name: "獰猛化緑"
    effectSummary: "これが場に出たとき、ターン終了時まで、これを含む自分のすべての緑の虫の攻撃力を200増やす。"
effectSummary: null
taxonomy:
  order: null
  family: "カミキリムシ科"
  other: []
referencableTags:
  - "カミキリムシ科"
  - "獰猛化緑"
  - "登場時"
  - "遅延効果"
  - "ダメージ変更"
rulings:
  - "＜獰猛化緑＞の効果を使用した後に場に出した自分の緑の虫は、＜獰猛化緑＞の効果で攻撃力が200増えますか？: いいえ、攻撃力は増えません。 ＜獰猛化緑＞は、使用したとき自分の場にいる緑の虫にのみ攻撃力を増やす効果をあたえます。"
  - "[パプアキンイロクワガタ]が＜色彩変化＞の効果で緑色になっているときにこのカードを出し、＜獰猛化緑＞の効果で[パプアキンイロクワガタ]の攻撃力を200増やしました。その後同じターン: いいえ、元に戻りません。＜獰猛化緑＞は、使用したときに自分の場にいる虫のうち、そのとき色が緑であるものに効果を与えます。その後色が緑でなくなったとしても、攻撃力はターン終了時まで200増えたままです。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/33/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 34/64 コブナナフシ

```yaml
officialNumber: "34/64"
name: "コブナナフシ"
set: "BOOSTER_SET_6"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 4
baseHp: 800
skills:
  - name: "くいちぎる"
    baseAp: 600
    effectSummary: null
  - name: "かくれる"
    baseAp: 200
    effectSummary: "この技は1度だけ使用できる。攻撃後、次の相手のターン終了時までこの虫を裏返す。この虫は裏返しの間、いないものとして扱う。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "コブナナフシ科"
  other: []
referencableTags:
  - "コブナナフシ科"
  - "裏向き"
  - "遅延効果"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/34/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 35/64 ガムシ

```yaml
officialNumber: "35/64"
name: "ガムシ"
set: "BOOSTER_SET_6"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 400
skills:
  - name: "かじりつく"
    baseAp: 500
    effectSummary: null
traits:
  - name: "潜水"
    effectSummary: "これは場に出た次の相手のターン、自分のエサ場に青のエサが2つ以上あるかぎり、相手の術カードによりダメージを受けず破壊されない。"
effectSummary: null
taxonomy:
  order: null
  family: "ガムシ科"
  other: []
referencableTags:
  - "ガムシ科"
  - "潜水"
  - "エサ操作"
  - "遅延効果"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/35/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 36/64 オオミズアオ（幼虫）

```yaml
officialNumber: "36/64"
name: "オオミズアオ（幼虫）"
set: "BOOSTER_SET_6"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 4
baseHp: 1200
skills:
  - name: "かじる"
    baseAp: 700
    effectSummary: null
traits:
  - name: "未熟"
    effectSummary: "相手が術カードを使用したとき、この虫を破壊する。"
effectSummary: null
taxonomy:
  order: null
  family: "ヤママユガ科"
  other: []
referencableTags:
  - "ヤママユガ科"
  - "未熟"
  - "縄張り操作"
rulings:
  - "＜月光＞を使ったターン、自分の縄張りが0枚のときに相手の虫が直接攻撃してきた場合、＜月光＞の効果で負けないことは: いいえ、できません。 ＜月光＞は縄張りを引かないことを選べる効果で、 自分の縄張りが0枚のときに直接攻撃をされても敗北しない効果ではありません。"
  - "＜月光＞を使ったターン、相手の虫の攻撃でさらに縄張りを引くタイミングがきました。 「このターン縄張りを引かなくてもよい」は、攻撃ごとに選ぶことが: はい、選べます。 「このターン縄張りを引かなくてもよい」はターン中の縄張りを引くタイミングごとに、引くか引かないかを選ぶことができます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/36/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 37/64 キマダラカメムシ

```yaml
officialNumber: "37/64"
name: "キマダラカメムシ"
set: "BOOSTER_SET_6"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 4
baseHp: 800
skills:
  - name: "くいつく"
    baseAp: 500
    effectSummary: null
  - name: "毒霧爆弾"
    baseAp: 500
    effectSummary: "攻撃後、この虫を破壊する。その後、相手の虫を1つ選び、500のタメージを与える。 ※この効果により、虫が破壊されたとき、相手は縄張りを引かない。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "カメムシ科"
  other: []
referencableTags:
  - "カメムシ科"
  - "破壊時"
  - "ダメージ変更"
  - "縄張り操作"
rulings:
  - "相手の場に虫がいないとき、「毒霧爆弾」で攻撃することは: はい、できます。 その場合相手の虫がいないため、[キマダラカメムシ]の「攻撃後、この虫を破壊する」を実行したあと、「相手の虫を1つ選び、200のダメージを与える。」は実行できず終了します。"
  - "「毒霧爆弾」で攻撃し、相手の縄張りを引かせたところ、[稲妻の迎撃]の＜迎撃＞でこのカードが破壊されました。「攻撃後、この虫を破壊する。その後、相手の虫を1つ選び、200のダメージを: いいえ、できません。 縄張りを引いた後、先に[キマダラカメムシ]が破壊されているため、「攻撃後、この虫を破壊する」が実行できず、効果の処理は行われません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/37/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 38/64 ツユムシ

```yaml
officialNumber: "38/64"
name: "ツユムシ"
set: "BOOSTER_SET_6"
rarity: "SR"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 400
skills:
  - name: "かみちぎる"
    baseAp: 400
    effectSummary: null
traits:
  - name: "露の恵み"
    effectSummary: "自分の捨て札にある強化カード1つにつき、この虫のコストを1減らす。"
effectSummary: null
taxonomy:
  order: null
  family: "キリギリス科"
  other: []
referencableTags:
  - "キリギリス科"
  - "露の恵み"
  - "捨て札"
rulings:
  - "手札にある5コストの[ヨツモンヒラタツユムシ]が＜露の恵み＞の効果によりコストが1減っているとき、[繚乱の足掻き]を使用して、効果で場のコスト4の虫と交換することが: いいえ。できません。 [繚乱の足掻き]などのコストを参照するカードや効果は、特別記載がない限りカードに書かれている元のコストを参照します。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/38/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 39/64 ボウバッタ

```yaml
officialNumber: "39/64"
name: "ボウバッタ"
set: "BOOSTER_SET_6"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 5
baseHp: 1100
skills:
  - name: "はねる"
    baseAp: 800
    effectSummary: null
  - name: "かくれる"
    baseAp: 300
    effectSummary: "この技は1度だけ使用できる。攻撃後、次の相手のターン終了時までこの虫を裏返す。この虫は裏返しの間、いないものとして扱う。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "ボウバッタ科"
  other: []
referencableTags:
  - "ボウバッタ科"
  - "裏向き"
  - "遅延効果"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/39/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 40/64 トビナナフシ

```yaml
officialNumber: "40/64"
name: "トビナナフシ"
set: "BOOSTER_SET_6"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 900
skills:
  - name: "かぶりつく"
    baseAp: 600
    effectSummary: null
traits:
  - name: "にげる"
    effectSummary: "他の虫が自分の場に出たとき、これを破壊する。"
effectSummary: null
taxonomy:
  order: null
  family: "ナナフシ科"
  other: []
referencableTags:
  - "ナナフシ科"
  - "にげる"
  - "登場時"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/40/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 41/64 ゴクラクトリバネアゲハ（幼虫）

```yaml
officialNumber: "41/64"
name: "ゴクラクトリバネアゲハ（幼虫）"
set: "BOOSTER_SET_6"
rarity: "SR"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 300
skills:
  - name: "かじる"
    baseAp: 300
    effectSummary: null
  - name: "極楽羽化"
    baseAp: 0
    effectSummary: "これを破壊し、自分の捨て札からこれと同名の(幼虫)と書かれていない虫を場に出す。 ※タメージを与える前に破壊する。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "捨て札"
  - "登場時"
  - "ダメージ変更"
  - "縄張り操作"
rulings:
  - "＜極楽還り＞の効果で出た[ゴクラクトリバネアゲハ]は、そのターン攻撃することが: はい、できます。"
  - "[蜉蝣の閃き]の効果で出した[ゴクラクトリバネアゲハ]はコストを支払って出したことに: いいえ、[蜉蝣の閃き]のコストを支払ったことになります。 ＜極楽還り＞が発動するのは、[ゴクラクトリバネアゲハ]自身のコストを支払って場に出した場合のみです。"
  - "[花蝶の幻舞]の効果でコストが3下がった[ゴクラクトリバネアゲハ]を出した場合、＜極楽還り＞は使用: はい、使用できます。 [花蝶の幻舞]の効果で[ゴクラクトリバネアゲハ]のコストが3に変動していますが、[ゴクラクトリバネアゲハ]のコストを3コスト支払っているので、＜極楽還り＞は有効です。"
  - "[花蝶の幻舞]を2回使ってコストが6下がったゴクラクトリバネアゲハを出した場合、＜極楽還り＞は使用: はい、使用できます。 [花蝶の幻舞]の効果で[ゴクラクトリバネアゲハ]のコストが0に変動していますが、[ゴクラクトリバネアゲハ]のコストを0コスト支払っているので、＜極楽還り＞は有効です。 特別記載がない限り、コスト0のカードを使用するときのコストは0コスト支払ったことになります。"
  - "場に[ネプチューンオオカブト]がいて、＜威圧の大角＞が有効な状態です。 花蝶の幻舞を2回使ってコストが6下がった[ゴクラクトリバネアゲハ]を1コスト支払って出した場合、＜極楽還り＞: はい、使用できます。"
  - "コロギスが場にいるとき、ゴクラクトリバネアゲハの＜極楽羽化＞は使用: いいえ、使用できません。ゴクラクトリバネアゲハの＜極楽羽化＞は「コストを支払い場に出たとき」発動する効果なので、コロギスが場にいるとき、＜危険察知＞の効果で使用できなくなります。"
  - "\"極楽羽化\"を使い、相手の虫にダメ―ジを与えたり、相手を直接攻撃して縄張りを引かせることは: いいえ、できません。 「極楽羽化」はダメージを与える前に[ゴクラクトリバネアゲハ（幼虫）]を破壊するため、ダメージを与えたり、相手への直接攻撃により縄張りを引かせることはできません。"
  - "\"極楽羽化\"を使った場合、捨て札に[ゴクラクトリバネアゲハ]がいなくても、技を使った[ゴクラクトリバネアゲハ（幼虫）]を破壊しなければなりませんか？: はい、破壊されます。 「極楽羽化」を使った場合、[ゴクラクトリバネアゲハ（幼虫）]は必ず破壊されます。"
  - "[空蝉の皮鎧]をつけた[ゴクラクトリバネアゲハ（幼虫）]が\"極楽羽化\"で直接攻撃をした場合、 [ゴクラクトリバネアゲハ（幼虫）]を破壊せずに[ゴクラクトリバネアゲハ]を出すことはで: はい、出すことができます。 \"極楽羽化\"の直接攻撃も有効です。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/41/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "BLOCKED"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 42/64 ナガメ

```yaml
officialNumber: "42/64"
name: "ナガメ"
set: "BOOSTER_SET_6"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 200
skills:
  - name: "くいつく"
    baseAp: 200
    effectSummary: null
  - name: "毒霧爆弾"
    baseAp: 200
    effectSummary: "攻撃後、この虫を破壊する。その後、相手の虫を1つ選び、200のダメージを与える。 ※この効果により、虫が破壊されたとき、相手は縄張りを引かない。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "カメムシ科"
  other: []
referencableTags:
  - "カメムシ科"
  - "破壊時"
  - "ダメージ変更"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/42/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 43/64 オオゴマダラ（幼虫）

```yaml
officialNumber: "43/64"
name: "オオゴマダラ（幼虫）"
set: "BOOSTER_SET_6"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 400
skills:
  - name: "かじる"
    baseAp: 400
    effectSummary: null
  - name: "黄金蛹"
    baseAp: 100
    effectSummary: "攻撃後、手札から口寄せの時蛹を1つ選び、使用してもよい。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "タテハチョウ科"
  other: []
referencableTags:
  - "タテハチョウ科"
  - "登場時"
rulings:
  - "＜黄金羽化＞を使用した後に[カイコ]が場に出て、＜くちなし＞の効果で＜黄金羽化＞が失われました。 この場合、＜黄金羽化＞の効果で増えた[オオゴマダラ]の体力と攻撃力は: ＜黄金羽化＞で増えた[オオゴマダラ]の体力と攻撃力はそのままになります。 ＜黄金羽化＞効果の発動と処理はすでに完了しており、＜くちなし＞により＜黄金羽化＞が失われたとしても、すでに処理された効果は失われません。"
  - "コロギスが場にいるとき、オオゴマダラの＜黄金羽化＞は使用: いいえ、使用できません。オオゴマダラの＜黄金羽化＞は「口寄せの時蛹により場に出たとき」発動する効果なので、コロギスが場にいるとき、＜危険察知＞の効果で使用できなくなります。"
  - "「黄金蛹」の効果で[口寄せの時蛹]を使用する場合、コストは支払う必要はありますか？: いいえ、コストを支払う必要はありません。 \"黄金蛹\"の効果で使用する[口寄せの時蛹]は、コストを支払わずに使用します。"
  - "「黄金蛹」で攻撃し、破壊などで攻撃後より前にこの虫が場を離れた場合、攻撃後に[口寄せの時蛹]を使用: はい、できます。 効果の処理の前に[オオゴマダラ幼虫]が場を離れているものの、手札に[口寄せの時蛹]があるなら効果を実行できるので、手札から[口寄せの時蛹]を使用することができます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/43/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 44/64 ホソヘリカメムシ

```yaml
officialNumber: "44/64"
name: "ホソヘリカメムシ"
set: "BOOSTER_SET_6"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 300
skills:
  - name: "くいつく"
    baseAp: 300
    effectSummary: null
traits:
  - name: "耐性"
    effectSummary: "これは自分か相手の捨て札にある術と同じ術のこれは自分が相手のダメージを受けない。"
effectSummary: null
taxonomy:
  order: null
  family: "カメムシ科"
  other: []
referencableTags:
  - "カメムシ科"
  - "耐性"
  - "捨て札"
  - "ダメージ変更"
rulings:
  - "自分の捨て札に[塵芥虫の爆熱弾]があり、相手の捨て札にない状態です。相手は[塵芥虫の爆熱弾]を使用して、この虫に600のダメージを与えることは: いいえ、できません。 ＜耐性＞の効果「これは自分か相手の捨て札にある術と同じ術のダメージを受けない。」により[塵芥虫の爆熱弾]の600のダメージを受けません。 相手が使う術カードと、それと同じ術カードがある捨て札の持ち主が異なっていても、＜耐性＞は有効です。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/44/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 45/64 ササコナフキツノアブラムシ

```yaml
officialNumber: "45/64"
name: "ササコナフキツノアブラムシ"
set: "BOOSTER_SET_6"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 1
baseHp: 200
skills:
  - name: "すう"
    baseAp: 200
    effectSummary: null
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "アブラムシ科"
  other: []
referencableTags:
  - "アブラムシ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/45/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 46/64 オオミズアオ

```yaml
officialNumber: "46/64"
name: "オオミズアオ"
set: "BOOSTER_SET_6"
rarity: "LR"
type: "INSECT"
color: "COLORLESS"
cost: 5
baseHp: 1200
skills:
  - name: "はばたく"
    baseAp: 800
    effectSummary: null
traits:
  - name: "月光"
    effectSummary: "これを縄張りから引いたとき、この虫を捨て札に置いてもよい。そうしたなら、ターン終了時まで自分は縄張りを引かなくてもよい。"
effectSummary: null
taxonomy:
  order: null
  family: "ヤママユガ科"
  other: []
referencableTags:
  - "ヤママユガ科"
  - "月光"
  - "捨て札"
  - "遅延効果"
  - "縄張り操作"
rulings:
  - "＜月光＞を使ったターン、自分の縄張りが0枚のときに相手の虫が直接攻撃してきた場合、＜月光＞の効果で負けないことは: いいえ、できません。 ＜月光＞は縄張りを引かないことを選べる効果で、 自分の縄張りが0枚のときに直接攻撃をされても敗北しない効果ではありません。"
  - "＜月光＞を使ったターン、相手の虫の攻撃でさらに縄張りを引くタイミングがきました。 「このターン縄張りを引かなくてもよい」は、攻撃ごとに選ぶことが: はい、選べます。 「このターン縄張りを引かなくてもよい」はターン中の縄張りを引くタイミングごとに、引くか引かないかを選ぶことができます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/46/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 47/64 ダイコクコガネ

```yaml
officialNumber: "47/64"
name: "ダイコクコガネ"
set: "BOOSTER_SET_6"
rarity: "SR"
type: "INSECT"
color: "COLORLESS"
cost: 2
baseHp: 300
skills:
  - name: "たいあたり"
    baseAp: 300
    effectSummary: null
traits:
  - name: "糞食"
    effectSummary: "これが場にでたとき、相手の捨て札から虫を1つ選び山札の1番下に置いてもよい。"
effectSummary: null
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
  - "糞食"
  - "裏向き"
  - "捨て札"
rulings:
  - "山札の1番下に置くカードは表側ですか？裏側ですか？: 裏側で山札の1番下に置きます。 特別記載がない限り、山札に置かれるカードは裏向きで置かれます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/47/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 48/64 チャドクガ

```yaml
officialNumber: "48/64"
name: "チャドクガ"
set: "BOOSTER_SET_6"
rarity: "SR"
type: "INSECT"
color: "COLORLESS"
cost: 2
baseHp: 300
skills:
  - name: "はばたく"
    baseAp: 300
    effectSummary: null
traits:
  - name: "毒蛾の毛針"
    effectSummary: "これが破壊されたとき、自分は縄張りを引かなくてもよい。"
effectSummary: null
taxonomy:
  order: null
  family: "ドクガ科"
  other: []
referencableTags:
  - "ドクガ科"
  - "毒蛾の毛針"
  - "破壊時"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/48/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 49/64 花潜の甲冑

```yaml
officialNumber: "49/64"
name: "花潜の甲冑"
set: "BOOSTER_SET_6"
rarity: "SR"
type: "ENHANCEMENT"
color: null
cost: 4
baseHp: null
skills: []
traits: []
effectSummary: "この虫の体力と攻撃力を1000増やす。これが表向きでエサ場にあるとき、甲冑と書かれた強化カードがついた自分の虫は、相手の術カードによりダメージを受けず破壊されない。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "エサ操作"
  - "ダメージ変更"
rulings:
  - "このカードが自分のエサ場にあるとき、自分の甲冑と書かれた強化カードがついた虫は、相手の術ではないカードの効果や、虫の攻撃で破壊されませんか？: いいえ、破壊されます。 [花潜の甲冑]の効果は、自分の甲冑と書かれた強化カードがついた虫が、相手の術カードによってダメージを受けず、相手の術カードの効果で破壊されなくなる効果です。 虫の攻撃や虫の技の効果などでは破壊されます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/49/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 50/64 小兜虫の甲冑

```yaml
officialNumber: "50/64"
name: "小兜虫の甲冑"
set: "BOOSTER_SET_6"
rarity: "N"
type: "ENHANCEMENT"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "この虫の体力と攻撃力を200増やす。これが表向きでエサ場にあるとき、自分の甲冑と書かれた強化カードのコストを2減らす。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "エサ操作"
  - "ダメージ変更"
rulings:
  - "このカードが自分のエサ場に2枚あるとき、自分の甲冑と書かれた強化カードのコストは4減りますか？: はい、それぞれの効果により合計コストが4減ります。"
  - "このカードが自分のエサ場にあるとき、相手の甲冑と書かれた強化カードのコストは減りますか？: いいえ、減りません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/50/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 51/64 武勇の刻印

```yaml
officialNumber: "51/64"
name: "武勇の刻印"
set: "BOOSTER_SET_6"
rarity: "N"
type: "ENHANCEMENT"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "この虫の体力と攻撃力を300増やす。自分の虫は＜＞の技を失う。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "捨て札"
  - "ダメージ変更"
rulings:
  - "このカードを[ヘレナモルフォ]につけることで＜極美蝶＞を失わせ、2枚目の強化カードをつけることは: はい、つけることができます。 この場合、[武勇の刻印]を含めて[ヘレナモルフォ]に3枚以上の強化カードがついているとき、[武勇の刻印]が破壊されるなどして場を離れると、＜極美蝶＞が再度有効になるため、[ヘレナモルフォ]につけられている強化カードが1枚になるように強化カードを破壊しなければなりません。"
  - "[武勇の刻印]を自分の[カイコ]につけました。[カイコ]は＜くちなし＞を失うため、自分の[テイオウムカシヤンマ]は＜生きた化石＞でコストを減らして場に出せますか？: いいえ。 [武勇の刻印]は「自分の虫」すべてを対象とするため、[カイコ]を含んだ自分の場、手札、エサ、縄張り、捨て札にある虫に効果があります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/51/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 52/64 天牛の錦顎

```yaml
officialNumber: "52/64"
name: "天牛の錦顎"
set: "BOOSTER_SET_6"
rarity: "R"
type: "ENHANCEMENT"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "これはカミキリムシ科の虫にしかつけられない。この虫の攻撃力と体力を300増やす。この虫は色による2倍のダメージを受けない。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/52/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 53/64 古の蜻蛉切

```yaml
officialNumber: "53/64"
name: "古の蜻蛉切"
set: "BOOSTER_SET_6"
rarity: "R"
type: "ENHANCEMENT"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "これは〜トンボ科、〜ヤンマ科の虫にしかつけられない。この虫の体力と攻撃力を300増やす。これが捨て札にあるとき、自分のムカシトンボ科、ムカシヤンマ科の虫のコストを1減らす。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "捨て札"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/53/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 54/64 七節の変化巻

```yaml
officialNumber: "54/64"
name: "七節の変化巻"
set: "BOOSTER_SET_6"
rarity: "N"
type: "ENHANCEMENT"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "これは〜ナナフシ科の虫にしかつけられない。この虫の色を赤か青か緑に変える。これがついた虫が虫の攻撃により破壊されたとき、これを手札に戻してもよい。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "色変更"
  - "破壊時"
  - "手札操作"
rulings:
  - "[七節の変化巻]をつけた虫の色を無色に変えることは: いいえ、できません。 [七節の変化巻]で変える事ができる虫の色は赤か青か緑のいずれかです。"
  - "[七節の変化巻]をつけた虫の色は、[七節の変化巻]がついている間、好きな時に変えることは: いいえ、できません。 [七節の変化巻]をつけるときに赤か青か緑を選び、[七節の変化巻]が付いているあいだは選んだ色として扱います。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/54/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 55/64 命燃の鬼火

```yaml
officialNumber: "55/64"
name: "命燃の鬼火"
set: "BOOSTER_SET_6"
rarity: "R"
type: "ENHANCEMENT"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectSummary: "この虫の体力と攻撃力を700増やす。この虫は相手の術カードにより、ダメージを受けず破壊されない。次の相手のターン終了時にこの虫を破壊する。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "遅延効果"
  - "ダメージ変更"
rulings:
  - "[空蝉の皮鎧]がついている自分の虫に[命燃の鬼火]をつけました。 次の相手のターン終了時、[命燃の鬼火]の効果でつけた虫が破壊される効果を[空蝉の皮鎧]の効果で防ぎました。 これ以: いいえ、発動しません。 この効果は、[命燃の鬼火]をつけた次の相手のターン終了時に1回だけ発動し、つけた虫が破壊されなかった場合は、他の強化カードと同じように虫につけられたまま場に残ります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/55/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 56/64 宿命の影写し

```yaml
officialNumber: "56/64"
name: "宿命の影写し"
set: "BOOSTER_SET_6"
rarity: "LR"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "自分のエサ場から虫を1つ選ぶ。その虫と同数のコストを支払い、選んだ虫を場に出す。その後、これを裏向きでエサ場に置く。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "裏向き"
  - "エサ操作"
  - "捨て札"
rulings:
  - "[宿命の影写し]で、今発生しているコストより多いコストを持つエサ場の虫を選ぶことは: いいえ、できません。 自分のエサ場に、今発生しているコストよりも多いコストを持つ虫しかいない場合、[宿命の影写し]を使用することはできません。"
  - "[宿命の影写し]で選んだ虫を、コストを支払わないことで出さず、このカードを裏向きでエサ場に置くことは: いいえ、できません。 選んだ虫はコストを必ず支払い、場に出す必要があります。"
  - "捨て札に2枚＜生きた化石＞をもつカードがあるとき[宿命の影写し]で、[テイオウムカシヤンマ]を選びました。 ＜生きた化石＞の効果によって、このカードで支払うコストを2減らすことは: いいえ、できません。 カードの効果でカードのコストを参照する場合、それはカードに書かれた元々のコストを参照します。"
  - "[宿命の影写し]で[ゴクラクトリバネアゲハ]を選び、同数の6コストを支払い場に出しました。 このとき、場に出た[ゴクラクトリバネアゲハ]の＜極楽還り＞は使えますか？: いいえ、使えません。 「その虫と同数のコストを支払い」は[宿命の影写し]の追加コストを払ったことになります。 [ゴクラクトリバネアゲハ]自身のコストは支払われずに、効果で場にでるため＜極楽還り＞を使うことができません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/56/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 57/64 砂鉄の砂嵐

```yaml
officialNumber: "57/64"
name: "砂鉄の砂嵐"
set: "BOOSTER_SET_6"
rarity: "N"
type: "SPELL"
color: null
cost: 2
baseHp: null
skills: []
traits: []
effectSummary: "次の相手のターン、相手は虫で攻撃するとき、1回の攻撃につき1コスト支払わなければ攻撃できない。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "攻撃制限"
  - "遅延効果"
rulings:
  - "[砂鉄の砂嵐]を1ターンに2枚使用した場合、 次の相手のターン、相手が虫で攻撃するときに支払うコストは1回につき2に: はい、2になります。 次の相手のターン、相手は虫で攻撃する場合、[砂鉄の砂嵐]2枚それぞれの効果により合計2コスト支払う必要があります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/57/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 58/64 怒濤の黒山

```yaml
officialNumber: "58/64"
name: "怒濤の黒山"
set: "BOOSTER_SET_6"
rarity: "R"
type: "SPELL"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectSummary: "ターン終了時まで、自分のすべての虫の攻撃力を、自分の場の虫と強化カードの数×100増やす。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "遅延効果"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/58/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 59/64 小蠅の落とし子

```yaml
officialNumber: "59/64"
name: "小蠅の落とし子"
set: "BOOSTER_SET_6"
rarity: "N"
type: "SPELL"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectSummary: "自分の捨て札からコスト1以下の虫を最大2つまで選び、場に出す。それらの虫はこのターン攻撃できない。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "捨て札"
  - "攻撃制限"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/59/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 60/64 神木の息吹

```yaml
officialNumber: "60/64"
name: "神木の息吹"
set: "BOOSTER_SET_6"
rarity: "R"
type: "SPELL"
color: null
cost: 6
baseHp: null
skills: []
traits: []
effectSummary: "これをエサ場に置き、コストを6発生させる。その後、自分の捨て札から1枚カードを選び、裏向きでエサ場に置いてもよい。 ※このエサのコストはこのターン発生しない。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "裏向き"
  - "エサ操作"
  - "捨て札"
rulings:
  - "自分の捨て札にカードが1枚もないときに、[神木の息吹]を使用することは: はい。使用することができます。 その場合[神木の息吹]のみをエサ場に置き、コストを6発生させます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/60/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 61/64 稲妻の嵐

```yaml
officialNumber: "61/64"
name: "稲妻の嵐"
set: "BOOSTER_SET_6"
rarity: "R"
type: "SPELL"
color: null
cost: 3
baseHp: null
skills: []
traits: []
effectSummary: "相手の虫を1つ選び、1000のダメージを与える。自分の捨て札に稲妻の嵐があるなら、もう1度相手の虫を1つ選び、1000のダメージを与える。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "捨て札"
  - "ダメージ変更"
rulings:
  - "もう一枚の稲妻の嵐が捨て札にあるとき、ダメージを与える効果で、2回とも同じ虫を選ぶことは: はい、できます。"
  - "自分の捨て札に[稲妻の嵐]があり、相手の場に体力が1000以下の虫が1体だけいるとき、手札の[稲妻の嵐]を使用することは: はい、できます。 この場合、1回目の1000ダメージで虫が破壊され、2回目は選ぶことができる相手の虫がいないため何も起こりません。"
  - "自分の捨て札にカードが1枚もないときに、[稲妻の嵐]を使用することは: はい。使用することができます。 その場合、ダメージを与える虫を1体だけ選びます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/61/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 62/64 爆熱の嵐

```yaml
officialNumber: "62/64"
name: "爆熱の嵐"
set: "BOOSTER_SET_6"
rarity: "N"
type: "SPELL"
color: null
cost: 2
baseHp: null
skills: []
traits: []
effectSummary: "相手の虫を1つ選び、600のダメージを与える。自分の捨て札に爆熱の嵐があるなら、もう1度相手の虫を1つ選び、600のダメージを与える。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "捨て札"
  - "ダメージ変更"
rulings:
  - "もう一枚の稲妻の嵐が捨て札にあるとき、ダメージを与える効果で、2回とも同じ虫を選ぶことは: はい、できます。"
  - "自分の捨て札に[稲妻の嵐]があり、相手の場に体力が1000以下の虫が1体だけいるとき、手札の[稲妻の嵐]を使用することは: はい、できます。 この場合、1回目の1000ダメージで虫が破壊され、2回目は選ぶことができる相手の虫がいないため何も起こりません。"
  - "自分の捨て札にカードが1枚もないときに、[稲妻の嵐]を使用することは: はい。使用することができます。 その場合、ダメージを与える虫を1体だけ選びます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/62/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 63/64 贄虫の転生

```yaml
officialNumber: "63/64"
name: "贄虫の転生"
set: "BOOSTER_SET_6"
rarity: "SR"
type: "SPELL"
color: null
cost: 3
baseHp: null
skills: []
traits: []
effectSummary: "自分の虫を1つ選び、山札の1番下に置く。山札の上からカードを1枚公開し、それが虫なら場に出す。虫でないなら山札の1番下に置き、虫が出るまで繰り返す。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "捨て札"
  - "手札操作"
rulings:
  - "自分の山札が0枚の時に、[贄虫の転生]は使用: はい。使用することができます。"
  - "\"操り針\"で自分の場に出した相手の虫を選び、[贄虫の転生]を使用することは: いいえ、できません。相手の虫は「自分の山札の一番下に置く」ことができないため、[贄虫の転生]で選べません。"
  - "[空蝉の皮鎧]をつけた自分の虫を選んで[贄虫の転生]を使用した場合、選ばれた虫は場に残りますか？: いいえ、山札の1番下に置かれます。[贄虫の転生]で選んだ虫は山札の1番下に置くため、破壊されません。そのため「この虫が破壊されるとき」に発揮する[空蝉の皮鎧]の効果を使えません。"
  - "コスト0の強化カード[蓑虫の隠れ蓑]がついている[マメコガネ]を選び[贄虫の転生]を使用して自分の山札の一番下に置き、効果で[ハネナガイナゴ]が場に出た場合、＜イナゴの収穫＞の効果: はい、できます。 [贄虫の転生]を使用された[マメコガネ]が自分の山札の一番下に置かれ、つけている虫がいなくなった[蓑虫の隠れ蓑]は破壊され、捨て札に置かれた後、「山札の上からカードを公開し、それが虫なら場に出す。」で[ハネナガイナゴ]が場に出るため＜イナゴの収穫＞で[マメコガネ]についていた[蓑虫の隠れ蓑]を手札に加える事ができます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/63/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 64/64 蠱毒の輪廻

```yaml
officialNumber: "64/64"
name: "蠱毒の輪廻"
set: "BOOSTER_SET_6"
rarity: "SR"
type: "SPELL"
color: null
cost: 4
baseHp: null
skills: []
traits: []
effectSummary: "これを山札の1番下に置く。山札からカードを1枚引き、それが虫なら場に出す。それが蠱毒の輪廻以外の術か強化なら、使用するか、エサ場に置くか、手札に加える。それが蠱毒の輪廻ならエサ場に置く。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "裏向き"
  - "エサ操作"
  - "手札操作"
rulings:
  - "[蠱毒の輪廻]の効果で引くカードは相手に見せますか？: はい、見せます。 引いたカードは公開して処理を進めます。"
  - "[蠱毒の輪廻]を使い、虫を引きました。 これを場に出さず、エサ場に置いたり、手札に加えたままにすることは: いいえ、できません。 虫を引いた場合、必ず場に出さなければなりません。"
  - "[蠱毒の輪廻]を使い、[塵芥虫の爆熱弾]を引きました。 相手の場に虫がいない場合、[塵芥虫の爆熱弾]を使用することを選ぶことは: いいえ、できません。 この場合、[塵芥虫の爆熱弾]は相手の虫を選べないため使用できず、エサ場に置くか、手札に加えるかのどちらかを選びます。"
  - "[蠱毒の輪廻]を使い、[兜虫の甲冑]を引きました。 自分の場に虫がいない場合、[兜虫の甲冑]を使用することを選ぶことは: いいえ、できません。 この場合、[兜虫の甲冑]は自分の虫を選べないため使用できず、エサ場に置くか、手札に加えるかのどちらかを選びます。"
  - "自分の山札が0枚のときに[蠱毒の輪廻]を使用することは: はい、できます。 この場合、山札に[蠱毒の輪廻]を裏向きで置き、山札をから引いた[蠱毒の輪廻]を「それが蠱毒の輪廻ならエサ場に置く。」効果によりエサ場に置くことになります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI6/64/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%96%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 分類インデックス

- `アゲハチョウ科`: ゴクラクトリバネアゲハ
- `アツオサソリ科`: デザートヘアリースコーピオン
- `アブラムシ科`: ササコナフキツノアブラムシ
- `アブ科`: アカウシアブ
- `アリ科`: オソレハリアリ, アカカミアリ
- `オサムシ科`: ツシマカブリモドキ
- `カミキリムシ科`: ウスリーオオカミキリ
- `カメムシ科`: キマダラカメムシ, ナガメ, ホソヘリカメムシ
- `カレエダカマキリ科`: オオカレエダカマキリ
- `ガムシ科`: ガムシ
- `キリギリス科`: ヨツモンヒラタツユムシ, ツユムシ
- `クワガタムシ科`: フェイスタメルシワバネクワガタ, エラフスホソアカクワガタ, チリクワガタ, パプアキンイロクワガタ, コルリクワガタ
- `コオイムシ科`: ナンベイオオタガメ, コオイムシ
- `コガネムシ科`: フローレンシスニセヒメカブト, ダイコクコガネ
- `コブナナフシ科`: コブナナフシ
- `サナエトンボ科`: ウチワヤンマ
- `シジミチョウ科`: ゴイシシジミ（幼虫）
- `セミヤドリガ科`: セミヤドリガ（幼虫）
- `セミ科`: ハルゼミ, ジュウシチネンゼミ
- `タテハチョウ科`: オオゴマダラ, ヘレナモルフォ, コノハチョウ, ツマジロスカシマダラ, オオゴマダラ（幼虫）
- `ドクガ科`: チャドクガ
- `ナナフシ科`: ユウレイヒレアシナナフシ, トビナナフシ
- `ハナアブ科`: シマハナアブ
- `ハナカマキリ科`: ボウレイカマキリ
- `ハネカクシ科`: アオバアリガタハネカクシ
- `ヒメバチ科`: エゾオナガバチ
- `ボウバッタ科`: ボウバッタ
- `マツモムシ科`: マツモムシ
- `ヤママユガ科`: オオミズアオ（幼虫）, オオミズアオ

## 特性インデックス

- `＜とびでる＞`: ジュウシチネンゼミ
- `＜にげる＞`: トビナナフシ
- `＜スケスケの翅＞`: ツマジロスカシマダラ
- `＜セミ宿り＞`: セミヤドリガ（幼虫）
- `＜ベイツ型擬態＞`: シマハナアブ
- `＜亡霊送り＞`: ボウレイカマキリ
- `＜好物＞`: ゴイシシジミ（幼虫）, ゴイシシジミ
- `＜春風＞`: ハルゼミ
- `＜月光＞`: オオミズアオ
- `＜未熟＞`: オオミズアオ（幼虫）
- `＜極楽還り＞`: ゴクラクトリバネアゲハ
- `＜極美蝶＞`: ヘレナモルフォ
- `＜毒蛾の毛針＞`: チャドクガ
- `＜潜水＞`: ナンベイオオタガメ, コオイムシ, マツモムシ, ガムシ
- `＜獰猛化緑＞`: ウスリーオオカミキリ
- `＜糞食＞`: ダイコクコガネ
- `＜耐性＞`: ホソヘリカメムシ
- `＜色彩変化＞`: パプアキンイロクワガタ
- `＜血の取引＞`: アカウシアブ
- `＜軍配団扇＞`: ウチワヤンマ
- `＜霊体＞`: ユウレイヒレアシナナフシ
- `＜露の恵み＞`: ヨツモンヒラタツユムシ, ツユムシ
- `＜黄金羽化＞`: オオゴマダラ

## BLOCKED一覧

- なし
