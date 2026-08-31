# 蟲神器 第3弾カード図鑑

> Version: v1.0 KNOWLEDGE-BASE
> 対象: ブースターパック第3弾 60種
> 用途: ゲームUI・ルールエンジンが参照する実装用知識ベース

## 0. 運用原則

- カード表面情報と生物分類は非公式DBを探索補助として構造化し、裁定は公式Q&Aを優先する。
- `＜○○＞` は `traits` として通常技から分離する。
- 不明点や解析不能項目は推測せず `blocked` に残す。
- 効果・裁定はゲーム実装に必要な意味へ短く整理し、ページ全体を転載しない。

## 1. 共通ソースと検証状態

- 公式Q&A: https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/
- カード探索補助（非公式）: https://mushijingi.com/
- Raw取得時刻: 2026-08-30T17:18:47.5136001Z
- 基本値・分類: `VERIFIED_SECONDARY`（公式現物との全件画像突合は未実施）
- 裁定: `OFFICIAL_QA_SUMMARY`（一致カードのみ）

## 2. 収録検査

- Expected / actual: 60 / 60
- Card-number coverage: PASS
- Card-number duplicate check: PASS
- Type total check: PASS
- 虫 / 強化 / 術: 45 / 4 / 11
- BLOCKED: 0

---

## 1/60 オオエンマハンミョウ

```yaml
officialNumber: "1/60"
name: "オオエンマハンミョウ"
set: "BOOSTER_SET_3"
rarity: "LR"
type: "INSECT"
color: "RED"
cost: 6
baseHp: 1700
skills:
  - name: "神のアギト"
    baseAp: 1000
    effectSummary: null
  - name: "破壊のアギト"
    baseAp: 1400
    effectSummary: "この技は強化カードがついた虫にしか使えない。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "ハンミョウ科"
  other: []
referencableTags:
  - "ハンミョウ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/1/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 2/60 タガメ

```yaml
officialNumber: "2/60"
name: "タガメ"
set: "BOOSTER_SET_3"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 5
baseHp: 1100
skills:
  - name: "オオヅメバサミ"
    baseAp: 800
    effectSummary: null
traits:
  - name: "水生昆虫"
    effectSummary: "自分の青のエサ２つごとに、これのコストを１減らす。"
effectSummary: null
taxonomy:
  order: null
  family: "コオイムシ科"
  other: []
referencableTags:
  - "コオイムシ科"
  - "水生昆虫"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/2/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 3/60 オオジョロウグモ

```yaml
officialNumber: "3/60"
name: "オオジョロウグモ"
set: "BOOSTER_SET_3"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 4
baseHp: 1100
skills:
  - name: "かむ"
    baseAp: 400
    effectSummary: null
traits:
  - name: "円網"
    effectSummary: "これが場にいるとき、各プレイヤーが使用するコスト１以下の術カードのコストを１増やす。"
effectSummary: null
taxonomy:
  order: null
  family: "ジョロウグモ科"
  other: []
referencableTags:
  - "ジョロウグモ科"
  - "円網"
rulings:
  - "オオジョロウグモの＜円網＞の効果と、鬼蜘蛛の金縛りの効果を受けているとき、元のコストが1の術カード使用するために必要なコストはいくつに: その場合、3になります。コストを参照するカードや効果は、特別記載がない限りカードに書かれている元のコストを参照します。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/3/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 4/60 ミズカマキリ

```yaml
officialNumber: "4/60"
name: "ミズカマキリ"
set: "BOOSTER_SET_3"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 4
baseHp: 800
skills:
  - name: "ツメバサミ"
    baseAp: 500
    effectSummary: null
traits:
  - name: "水生昆虫"
    effectSummary: "自分の青のエサ２つごとに、これのコストを１減らす。"
effectSummary: null
taxonomy:
  order: null
  family: "タイコウチ科"
  other: []
referencableTags:
  - "タイコウチ科"
  - "水生昆虫"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/4/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 5/60 タイコウチ

```yaml
officialNumber: "5/60"
name: "タイコウチ"
set: "BOOSTER_SET_3"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 3
baseHp: 500
skills:
  - name: "ツメバサミ"
    baseAp: 400
    effectSummary: null
traits:
  - name: "水生昆虫"
    effectSummary: "自分の青のエサ２つごとに、これのコストを１減らす。"
effectSummary: null
taxonomy:
  order: null
  family: "タイコウチ科"
  other: []
referencableTags:
  - "タイコウチ科"
  - "水生昆虫"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/5/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 6/60 マダラサソリ

```yaml
officialNumber: "6/60"
name: "マダラサソリ"
set: "BOOSTER_SET_3"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 3
baseHp: 600
skills:
  - name: "きりきざむ"
    baseAp: 400
    effectSummary: null
  - name: "弱毒針"
    baseAp: 300
    effectSummary: "この技は１度だけ使用できる。相手のエサを１つ選び裏向きにしてもよい。 ※裏向きのエサのコストは発生するが、色を失い相手のカードの効果の対象に選べなくなる。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "ウシコロシサソリ科"
  other: []
referencableTags:
  - "ウシコロシサソリ科"
  - "裏向き"
  - "エサ操作"
  - "ダメージ変更"
  - "縄張り操作"
rulings:
  - "弱毒針の効果でエサを裏返すタイミングはいつですか？: 技を使用し、ダメージを与える前になります。"
  - "弱毒針は虫を破壊したり、縄張りを引かせなくても、効果でエサを裏返せますか？: はい。技を使用すれば相手のエサを裏返すことできます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/6/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 7/60 ヤエヤマサソリ

```yaml
officialNumber: "7/60"
name: "ヤエヤマサソリ"
set: "BOOSTER_SET_3"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 400
skills:
  - name: "きりきざむ"
    baseAp: 200
    effectSummary: null
  - name: "弱毒針"
    baseAp: 100
    effectSummary: "この技は１度だけ使用できる。相手のエサを１つ選び裏向きにしてもよい。 ※裏向きのエサのコストは発生するが、色を失い相手のカードの効果の対象に選べなくなる。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "オボソサソリ科"
  other: []
referencableTags:
  - "オボソサソリ科"
  - "裏向き"
  - "エサ操作"
  - "ダメージ変更"
  - "縄張り操作"
rulings:
  - "弱毒針の効果でエサを裏返すタイミングはいつですか？: 技を使用し、ダメージを与える前になります。"
  - "弱毒針は虫を破壊したり、縄張りを引かせなくても、効果でエサを裏返せますか？: はい。技を使用すれば相手のエサを裏返すことできます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/7/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 8/60 ハヤシノウマオイ

```yaml
officialNumber: "8/60"
name: "ハヤシノウマオイ"
set: "BOOSTER_SET_3"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 400
skills:
  - name: "かみちぎる"
    baseAp: 200
    effectSummary: null
  - name: "ウマオイコンボ"
    baseAp: 600
    effectSummary: "この技は自分の場にハタケノウマオイがいるときに使用できる。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "キリギリス科"
  other: []
referencableTags:
  - "キリギリス科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/8/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 9/60 ハタケノウマオイ

```yaml
officialNumber: "9/60"
name: "ハタケノウマオイ"
set: "BOOSTER_SET_3"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 400
skills:
  - name: "かみちぎる"
    baseAp: 200
    effectSummary: null
  - name: "ウマオイコンボ"
    baseAp: 600
    effectSummary: "この技は自分の場にハヤシノウマオイがいるときに使用できる。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "キリギリス科"
  other: []
referencableTags:
  - "キリギリス科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/9/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 10/60 ナミゲンゴロウ

```yaml
officialNumber: "10/60"
name: "ナミゲンゴロウ"
set: "BOOSTER_SET_3"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 3
baseHp: 400
skills:
  - name: "くらいつく"
    baseAp: 500
    effectSummary: null
traits:
  - name: "水生昆虫"
    effectSummary: "自分の青のエサ２つごとに、これのコストを１減らす。"
effectSummary: null
taxonomy:
  order: null
  family: "ゲンゴロウ科"
  other: []
referencableTags:
  - "ゲンゴロウ科"
  - "水生昆虫"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/10/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 11/60 サシハリアリ

```yaml
officialNumber: "11/60"
name: "サシハリアリ"
set: "BOOSTER_SET_3"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 4
baseHp: 800
skills:
  - name: "かみつく"
    baseAp: 500
    effectSummary: null
  - name: "激痛針"
    baseAp: 200
    effectSummary: "この技は１度だけ使用できる。この技により、相手が縄張りを引いたとき、相手は手札を１枚選び捨て札に置く。"
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
  - "手札を捨てるタイミングは縄張りを引く前ですか？後ですか？: 縄張りを引いた後になります"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/11/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 12/60 ツェツェバエ

```yaml
officialNumber: "12/60"
name: "ツェツェバエ"
set: "BOOSTER_SET_3"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 600
skills:
  - name: "さす"
    baseAp: 600
    effectSummary: null
traits:
  - name: "血の対価"
    effectSummary: "自分の縄張り1枚につき、これの体力と攻撃力を100減らす。"
effectSummary: null
taxonomy:
  order: null
  family: "ツェツェバエ科"
  other: []
referencableTags:
  - "ツェツェバエ科"
  - "血の対価"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/12/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 13/60 ナミアメンボ

```yaml
officialNumber: "13/60"
name: "ナミアメンボ"
set: "BOOSTER_SET_3"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 300
skills:
  - name: "すいとり針"
    baseAp: 200
    effectSummary: null
traits:
  - name: "水生昆虫"
    effectSummary: "自分の青のエサ２つごとに、これのコストを１減らす。"
effectSummary: null
taxonomy:
  order: null
  family: "アメンボ科"
  other: []
referencableTags:
  - "アメンボ科"
  - "水生昆虫"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/13/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 14/60 ハグロトンボ

```yaml
officialNumber: "14/60"
name: "ハグロトンボ"
set: "BOOSTER_SET_3"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 1
baseHp: 400
skills:
  - name: "とびかかる"
    baseAp: 100
    effectSummary: null
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "カワトンボ科"
  other: []
referencableTags:
  - "カワトンボ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/14/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 15/60 アダンソンハエトリ

```yaml
officialNumber: "15/60"
name: "アダンソンハエトリ"
set: "BOOSTER_SET_3"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 1
baseHp: 300
skills:
  - name: "かむ"
    baseAp: 100
    effectSummary: null
traits:
  - name: "蠅取り"
    effectSummary: "これが虫の攻撃により破壊されたとき、相手の手札が５枚以上あるなら、相手は手札を１枚選び、捨て札に置く。"
effectSummary: null
taxonomy:
  order: null
  family: "ハエトリグモ科"
  other: []
referencableTags:
  - "ハエトリグモ科"
  - "蠅取り"
  - "捨て札"
  - "破壊時"
  - "手札操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/15/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 16/60 パラワンオオヒラタクワガタ

```yaml
officialNumber: "16/60"
name: "パラワンオオヒラタクワガタ"
set: "BOOSTER_SET_3"
rarity: "LR"
type: "INSECT"
color: "BLUE"
cost: 6
baseHp: 1500
skills:
  - name: "神のオオアゴ"
    baseAp: 1000
    effectSummary: null
traits:
  - name: "樹液酒場"
    effectSummary: "自分の青のエサ２つごとに、これのコストを１減らす。"
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
  - "樹液酒場"
  - "エサ操作"
  - "手札操作"
rulings:
  - "〈樹液酒場〉によりコストが6から5になってる場合、繚乱の足掻きの効果で場のコスト5の虫と入れ替えが: できません。繚乱の足掻きなど、コストを参照するカードや効果は、特別記載がない限りカードに書かれている元のコストを参照します。"
  - "エサ場に青の虫が4枚あるときに、斑猫の手招きでエサ場から青の虫を手札に戻しました。この時、手札のパラワンオオヒラタクワガタはコストいくつで出せますか？: 5コストで出せます。＜樹上酒場＞の効果はパラワンオオヒラタクワガタを「その時場に出す時にある青の餌の数」により、効果を発揮します。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/16/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 17/60 サタンオオカブト

```yaml
officialNumber: "17/60"
name: "サタンオオカブト"
set: "BOOSTER_SET_3"
rarity: "SR"
type: "INSECT"
color: "BLUE"
cost: 5
baseHp: 800
skills:
  - name: "ツノ突破"
    baseAp: 800
    effectSummary: null
traits:
  - name: "魔王のツノ"
    effectSummary: "これか虫の攻撃により破壊されたとき、相手は手札を１枚選び捨て札に置く。"
effectSummary: null
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
  - "魔王のツノ"
  - "捨て札"
  - "破壊時"
  - "手札操作"
  - "縄張り操作"
rulings:
  - "手札を捨てるタイミングは縄張りを引く前ですか？後ですか？: 縄張りを引く前になります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/17/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 18/60 グランディスオオクワガタ

```yaml
officialNumber: "18/60"
name: "グランディスオオクワガタ"
set: "BOOSTER_SET_3"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 5
baseHp: 1200
skills:
  - name: "オオアゴバサミ"
    baseAp: 600
    effectSummary: null
traits:
  - name: "偉大な力"
    effectSummary: "これが場にいるとき、この虫に使用する強化カードのコストを１減らす。"
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
  - "偉大な力"
  - "捨て札"
rulings:
  - "グランディスオオクワガタやキンオニクワガタの効果は、白銀蜘蛛の糸や口寄せの時蛹のコストを下げて使うことが: 白銀蜘蛛の糸や口寄せの時蛹のコストは下がりません。グランディスオオクワガタとキンオニクワガタの効果は、自身が場にいるときのみ発揮するため、手札や捨て札からつけて場に出すカードのコストは下がりません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/18/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 19/60 ムクゲコノハ

```yaml
officialNumber: "19/60"
name: "ムクゲコノハ"
set: "BOOSTER_SET_3"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 5
baseHp: 1200
skills:
  - name: "すする"
    baseAp: 500
    effectSummary: null
traits:
  - name: "夜間飛行"
    effectSummary: "自分の場に虫がいなければ、この虫のコストを１減らす。"
effectSummary: null
taxonomy:
  order: null
  family: "ヤガ科"
  other: []
referencableTags:
  - "ヤガ科"
  - "夜間飛行"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/19/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 20/60 メタリフェルホソアカクワガタ

```yaml
officialNumber: "20/60"
name: "メタリフェルホソアカクワガタ"
set: "BOOSTER_SET_3"
rarity: "SR"
type: "INSECT"
color: "BLUE"
cost: 4
baseHp: 800
skills:
  - name: "はさむ"
    baseAp: 600
    effectSummary: null
traits:
  - name: "大太刀二刀流"
    effectSummary: "これは強化カードを１つしかつけられない。この虫に強化カードかついているとき、その修正値を2倍にする。"
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
  - "大太刀二刀流"
rulings:
  - "強化カードがついているメタリフェルホソアカクワガタに2枚目の強化カードを使用することは: いいえ。出来ません。メタリフェルホソアカクワガタには、強化カードがついていない時にのみ強化カードを使うことができます。"
  - "＜大太刀二刀流＞の効果は強化カードの能力が2倍になるのですか？ それとも強化カードが付いた虫の能力を2倍にしますか？: 体力や攻撃力に関係する強化カードの効果（修正値）が2倍になります。 例えば体力を800増やす児玉の加護なら、体力を1600増やす効果となります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/20/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 21/60 グラントシロカブト

```yaml
officialNumber: "21/60"
name: "グラントシロカブト"
set: "BOOSTER_SET_3"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 4
baseHp: 900
skills:
  - name: "ツノ突進"
    baseAp: 500
    effectSummary: null
traits:
  - name: "白色甲殼"
    effectSummary: "これは場に出た次の相手のターン、色による２倍のダメージを受けない。"
effectSummary: null
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
  - "白色甲殼"
  - "遅延効果"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/21/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 22/60 ヤンバルテナガコガネ

```yaml
officialNumber: "22/60"
name: "ヤンバルテナガコガネ"
set: "BOOSTER_SET_3"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 5
baseHp: 1300
skills:
  - name: "たいあたり"
    baseAp: 600
    effectSummary: null
traits:
  - name: "奇怪な両腕"
    effectSummary: "これが場にいるとき、各プレイヤーの虫が術カードの効果で場に出たなら、その虫は場に出たターン攻撃できない。"
effectSummary: null
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
  - "奇怪な両腕"
  - "攻撃制限"
rulings:
  - "術カードの効果により、場に出るとは、具体的にどのようなときに: 玉響の蠢き、蜉蝣の閃き、瀬戸際の虫時雨、女王蜂の匂い袋などの効果になります"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/22/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 23/60 ベニスズメ

```yaml
officialNumber: "23/60"
name: "ベニスズメ"
set: "BOOSTER_SET_3"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 400
skills:
  - name: "すする"
    baseAp: 500
    effectSummary: null
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "ススメガ科"
  other: []
referencableTags:
  - "ススメガ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/23/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 24/60 ニジイロクワガタ

```yaml
officialNumber: "24/60"
name: "ニジイロクワガタ"
set: "BOOSTER_SET_3"
rarity: "SR"
type: "INSECT"
color: "BLUE"
cost: 2
baseHp: 300
skills:
  - name: "はさむ"
    baseAp: 300
    effectSummary: null
traits:
  - name: "七色反射"
    effectSummary: "これが場に出たとき、ターン終了時まで自分のすべてのエサの色を赤か青か緑にしてもよい。※裏向きのエサは含まない。2024/08/01 カードの効果処理、裁定整備により変更"
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
  - "七色反射"
  - "裏向き"
  - "エサ操作"
  - "登場時"
  - "遅延効果"
  - "色変更"
rulings:
  - "エサ場で色が変わった虫を蜉蝣の閃きや瀬戸際の虫時雨で場に出した時、場に出たその虫の色は変わった状態になりますか？それとも元々の色に: 元々の色になります。エサ場で色が変わっても、その色は場に引き継がれません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/24/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 25/60 キンオニクワガタ

```yaml
officialNumber: "25/60"
name: "キンオニクワガタ"
set: "BOOSTER_SET_3"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 2
baseHp: 300
skills:
  - name: "はさむ"
    baseAp: 300
    effectSummary: null
traits:
  - name: "金色甲殻"
    effectSummary: "これが場にいるとき、この虫に使用する強化カードのコストを１減らす。"
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
  - "金色甲殻"
  - "捨て札"
rulings:
  - "グランディスオオクワガタやキンオニクワガタの効果は、白銀蜘蛛の糸や口寄せの時蛹のコストを下げて使うことが: 白銀蜘蛛の糸や口寄せの時蛹のコストは下がりません。グランディスオオクワガタとキンオニクワガタの効果は、自身が場にいるときのみ発揮するため、手札や捨て札からつけて場に出すカードのコストは下がりません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/25/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 26/60 イチモンジセセリ

```yaml
officialNumber: "26/60"
name: "イチモンジセセリ"
set: "BOOSTER_SET_3"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 2
baseHp: 400
skills:
  - name: "すする"
    baseAp: 300
    effectSummary: null
traits:
  - name: "一文字"
    effectSummary: "自分の場にいる虫がこれだけのとき、この虫の攻撃力を１００増やす。"
effectSummary: null
taxonomy:
  order: null
  family: "セセリチョウ科"
  other: []
referencableTags:
  - "セセリチョウ科"
  - "一文字"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/26/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 27/60 ギフチョウ

```yaml
officialNumber: "27/60"
name: "ギフチョウ"
set: "BOOSTER_SET_3"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 2
baseHp: 600
skills:
  - name: "すいとる"
    baseAp: 100
    effectSummary: null
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "アゲハチョウ科"
  other: []
referencableTags:
  - "アゲハチョウ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/27/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 28/60 トラツリアブ

```yaml
officialNumber: "28/60"
name: "トラツリアブ"
set: "BOOSTER_SET_3"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 0
baseHp: 100
skills: []
traits:
  - name: "ふわふわ"
    effectSummary: "これは攻撃できない。"
effectSummary: null
taxonomy:
  order: null
  family: "ツリアブ科"
  other: []
referencableTags:
  - "ツリアブ科"
  - "ふわふわ"
  - "攻撃制限"
rulings:
  - "白銀蜘蛛の糸でトラツリアブの＜ふわふわ＞を無効化した場合、トラツリアブは攻撃できるように: その場合、＜ふわふわ＞は無効化されますが、技がないため、攻撃できません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/28/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 29/60 イラガセイボウ

```yaml
officialNumber: "29/60"
name: "イラガセイボウ"
set: "BOOSTER_SET_3"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 1
baseHp: 200
skills:
  - name: "寄生攻撃"
    baseAp: 200
    effectSummary: null
traits:
  - name: "食い破る"
    effectSummary: "自分の場に（幼虫）の虫がいるとき、それを破壊し、コストを支払わずにこの虫を場に出してもよい。"
effectSummary: null
taxonomy:
  order: null
  family: "セイボウ科"
  other: []
referencableTags:
  - "セイボウ科"
  - "食い破る"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/29/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 30/60 クロカナブン

```yaml
officialNumber: "30/60"
name: "クロカナブン"
set: "BOOSTER_SET_3"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 1
baseHp: 400
skills:
  - name: "たいあたり"
    baseAp: 300
    effectSummary: null
traits:
  - name: "黒光り"
    effectSummary: "これに強化カードがついていないなら、ターン終了時にこれを破壊する。"
effectSummary: null
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
  - "黒光り"
  - "遅延効果"
rulings:
  - "玉響の蠢きで「クロカナブン」を出した時、空蝉の皮鎧をクロカナブンにつけた時そのターンの終了時にクロカナブンは破壊されますか？: 破壊されます。＜黒光り＞の効果は常に発動している効果のため、ターン終了時に玉響の効果で空蝉が破壊され、＜黒光り＞の効果により、クロカナブンが破壊となります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/30/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 31/60 サカダチコノハナナフシ

```yaml
officialNumber: "31/60"
name: "サカダチコノハナナフシ"
set: "BOOSTER_SET_3"
rarity: "LR"
type: "INSECT"
color: "GREEN"
cost: 6
baseHp: 1800
skills:
  - name: "神の逆鱗"
    baseAp: 1000
    effectSummary: null
  - name: "逆立ち返し"
    baseAp: 0
    effectSummary: "相手のエサ場にある虫を1つ選び、この技を受けた虫と入れかえる。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "サカダチコノハナナフシ科"
  other: []
referencableTags:
  - "サカダチコノハナナフシ科"
  - "裏向き"
  - "エサ操作"
  - "登場時"
  - "破壊時"
  - "ダメージ変更"
rulings:
  - "逆立ち返しに関して質問です。 相手のエサ場から新しく出した虫は、<>で書かれている場に出た時を条件とする効果がある技の場合、それはダメージを与える前に処理がされますか？: はい。＜セミの帝王＞や＜翡翠色＞、＜蜜をためる＞など場に出たときに効果を発動する＜＞の技を持つ虫が、逆立ち返しにより場に出た場合、逆立ち返しの技のダメージを与える前に、効果を発動します。"
  - "逆立ち返しにより、エサ場から＜擬態＞を持つ虫が場に出たとき、その虫は逆立ち返しのダメージを受けますか？: はい。＜擬態＞の効果は場に出た次のターンに発動するため、逆立ち返しのダメージは受けることなります。"
  - "逆立ち返しにより、虫が入れ替わったとき「虫の攻撃により破壊されたとき」に発動する効果は: いいえ。しません。虫の入れ替え効果は破壊として扱われません。"
  - "サカダチコノハナナフシの逆立ち返しに金色の顎門等で攻撃力をあげた場合、効果処理後に入れ替え先の虫にダメージを与えられますか？あるいは、ダメージを与えた後に入れ替えますか？: サカダチコノハナナフシの攻撃力が「金色の顎門」等上がっている場合、効果処理後に 入れ替え先の虫にダメージを与えることができます。"
  - "相手のエサ場にあるカードが術カードや強化カード、裏向きのカードのみの場合、相手の虫に逆立ち返しは使用: いいえ。使えません。逆立ち返しは相手の場の虫と相手のエサ場の虫をそれぞれ1つずつ選択できなければ使用することはできません。"
  - "逆立ち返しで攻撃し、相手のエサ場のテイオウゼミを場に出しました。 相手は<セミの帝王>によりエゾゼミを出しました。 この逆立ち返しによる攻撃処理に関してはエゾゼミの<鳴く>が影響し: はい。その場合ダメージはテイオウゼミに与えられます。エゾゼミの<鳴く>は、その後の虫の攻撃から影響します。"
  - "自分のターンに、エメラルドゴキブリバチの操り針で攻撃し、相手の蟲を自分の場にだしたあと、空蝉の皮鎧で破壊を防いで場に残しました。次のターンに、相手がサカダチコノハナナフシで、自分が: その場合、その虫は相手のエサ場に置かれます。相手の虫が自分のエサ場、手札、捨札に置かれる場合、代わりに相手のエサ場、手札、捨札に置かれます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/31/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 32/60 キョジンツユムシ

```yaml
officialNumber: "32/60"
name: "キョジンツユムシ"
set: "BOOSTER_SET_3"
rarity: "SR"
type: "INSECT"
color: "GREEN"
cost: 5
baseHp: 1300
skills:
  - name: "かみちぎる"
    baseAp: 1000
    effectSummary: null
traits:
  - name: "新緑の呪縛"
    effectSummary: "これは自分の緑のエサが３つ以上ないと、攻撃できない。"
effectSummary: null
taxonomy:
  order: null
  family: "キリギリス科"
  other: []
referencableTags:
  - "キリギリス科"
  - "新緑の呪縛"
  - "攻撃制限"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/32/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 33/60 トゲナナフシ

```yaml
officialNumber: "33/60"
name: "トゲナナフシ"
set: "BOOSTER_SET_3"
rarity: "SR"
type: "INSECT"
color: "GREEN"
cost: 5
baseHp: 1100
skills:
  - name: "かぶりつく"
    baseAp: 700
    effectSummary: null
traits:
  - name: "トゲ擬態"
    effectSummary: "これは場に出た次の相手のターンに攻撃を受けない。相手のターンの間、自分が縄張りを引くたび、この虫の攻撃力を３００増やす。 ※これ以外に虫がいないとき、直接攻撃を受ける。"
effectSummary: null
taxonomy:
  order: null
  family: "ナナフシ科"
  other: []
referencableTags:
  - "ナナフシ科"
  - "トゲ擬態"
  - "攻撃制限"
  - "遅延効果"
  - "ダメージ変更"
  - "縄張り操作"
rulings:
  - "トゲナナフシ〈トゲ擬態〉が擬態を終えた後に「七節の秘伝書」を付けて「攻撃を受けない状態」にします。 虫の破壊などで自分の縄張りを引いた時、攻撃力の増加はありますか？: はい。その場合も攻撃力の増加はあります。トゲナナフシ〈トゲ擬態〉の攻撃力が増える効果は攻撃を受けなくなる効果がなくなった後も継続します。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/33/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 34/60 エダナナフシ

```yaml
officialNumber: "34/60"
name: "エダナナフシ"
set: "BOOSTER_SET_3"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 200
skills:
  - name: "かぶりつく"
    baseAp: 500
    effectSummary: null
traits:
  - name: "擬態"
    effectSummary: "これは場に出た次の相手のターンに攻撃を受けない。 ※これ以外に虫がいないとき、直接攻撃を受ける。"
effectSummary: null
taxonomy:
  order: null
  family: "ナナフシ科"
  other: []
referencableTags:
  - "ナナフシ科"
  - "擬態"
  - "攻撃制限"
  - "遅延効果"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/34/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 35/60 クツワムシ

```yaml
officialNumber: "35/60"
name: "クツワムシ"
set: "BOOSTER_SET_3"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 4
baseHp: 900
skills:
  - name: "かみちぎる"
    baseAp: 700
    effectSummary: null
traits:
  - name: "新緑の呪い"
    effectSummary: "これは自分の緑のエサが２つ以上ないと、攻撃できない。"
effectSummary: null
taxonomy:
  order: null
  family: "キリギリス科"
  other: []
referencableTags:
  - "キリギリス科"
  - "新緑の呪い"
  - "攻撃制限"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/35/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 36/60 マダラバッタ

```yaml
officialNumber: "36/60"
name: "マダラバッタ"
set: "BOOSTER_SET_3"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 600
skills:
  - name: "とびはねる"
    baseAp: 400
    effectSummary: null
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "バッタ科"
  other: []
referencableTags:
  - "バッタ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/36/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 37/60 グンジョウオオコブハムシ

```yaml
officialNumber: "37/60"
name: "グンジョウオオコブハムシ"
set: "BOOSTER_SET_3"
rarity: "SR"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 300
skills:
  - name: "くいあさる"
    baseAp: 200
    effectSummary: null
traits:
  - name: "宝石昆虫"
    effectSummary: "これが虫の攻撃により破壊されたとき、この虫をエサ場に置く。"
effectSummary: null
taxonomy:
  order: null
  family: "ハムシ科"
  other: []
referencableTags:
  - "ハムシ科"
  - "宝石昆虫"
  - "エサ操作"
  - "破壊時"
rulings:
  - "エメラルドゴキブリバチの操り針攻撃によって、グンジョウオオコブハムシが破壊された場合、そのグンジョウオオコブハムシは相手の場に出ますか？それとも、エサに行くので操り針の効果は不発に: その場合、ターンプレイヤーであるエメラルドゴキブリバチの効果が優先され、グンジョウオオコブハムシが相手の場に出ます。優先された効果によりエサ場ではなく相手の場に出たため、＜宝石昆虫＞の効果は不発となります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/37/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 38/60 アオマダラタマムシ

```yaml
officialNumber: "38/60"
name: "アオマダラタマムシ"
set: "BOOSTER_SET_3"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 600
skills:
  - name: "くいあらす"
    baseAp: 200
    effectSummary: null
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "タマムシ科"
  other: []
referencableTags:
  - "タマムシ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/38/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 39/60 アカスジキンカメムシ

```yaml
officialNumber: "39/60"
name: "アカスジキンカメムシ"
set: "BOOSTER_SET_3"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 300
skills:
  - name: "くいつく"
    baseAp: 300
    effectSummary: null
traits:
  - name: "毒霧散布"
    effectSummary: "これが場に出たとき、相手の虫を１つ選び３００のダメージを与えてもよい。 ※このダメージは色による影響を受けない。 ※この効果により虫か破壊されたとき、相手は縄張りを引かない。"
effectSummary: null
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "毒霧散布"
  - "登場時"
  - "破壊時"
  - "ダメージ変更"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/39/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "BLOCKED"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 40/60 モモブトオオルリハムシ

```yaml
officialNumber: "40/60"
name: "モモブトオオルリハムシ"
set: "BOOSTER_SET_3"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 500
skills:
  - name: "モモブト蹴り"
    baseAp: "X"
    effectSummary: "自分の場の緑の虫の数×３００のダメージを与える。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "ハムシ科"
  other: []
referencableTags:
  - "ハムシ科"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/40/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 41/60 オオルリハムシ

```yaml
officialNumber: "41/60"
name: "オオルリハムシ"
set: "BOOSTER_SET_3"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 500
skills:
  - name: "くいあさる"
    baseAp: 100
    effectSummary: null
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "ハムシ科"
  other: []
referencableTags:
  - "ハムシ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/41/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 42/60 ナナホシキンカメムシ

```yaml
officialNumber: "42/60"
name: "ナナホシキンカメムシ"
set: "BOOSTER_SET_3"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 300
skills:
  - name: "くいつく"
    baseAp: 200
    effectSummary: null
traits:
  - name: "毒霧散布"
    effectSummary: "これが場に出たとき、相手の虫を１つ選び２００のダメージを与えてもよい。 ※このダメージは色による影響を受けない。 ※この効果により虫が破壊されたとき、相手は縄張りを引かない。"
effectSummary: null
taxonomy:
  order: null
  family: "キンカメムシ科"
  other: []
referencableTags:
  - "キンカメムシ科"
  - "毒霧散布"
  - "登場時"
  - "破壊時"
  - "ダメージ変更"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/42/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 43/60 チャドクガ（幼虫）

```yaml
officialNumber: "43/60"
name: "チャドクガ（幼虫）"
set: "BOOSTER_SET_3"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 200
skills:
  - name: "かじる"
    baseAp: 200
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
  cardDetail: "https://mushijingi.com/card/MUSHI3/43/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 44/60 ナキイナゴ

```yaml
officialNumber: "44/60"
name: "ナキイナゴ"
set: "BOOSTER_SET_3"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 1
baseHp: 300
skills:
  - name: "はねる"
    baseAp: 100
    effectSummary: null
traits:
  - name: "鳴く"
    effectSummary: "相手はこれ以外の虫を攻撃できない。 ※この技を持つ虫が複数いるとき、相手はどれかを選んで攻撃する。"
effectSummary: null
taxonomy:
  order: null
  family: "バッタ科"
  other: []
referencableTags:
  - "バッタ科"
  - "鳴く"
  - "攻撃制限"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/44/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 45/60 ベニツチカメムシ

```yaml
officialNumber: "45/60"
name: "ベニツチカメムシ"
set: "BOOSTER_SET_3"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 1
baseHp: 200
skills:
  - name: "くいつく"
    baseAp: 100
    effectSummary: null
traits:
  - name: "毒霧散布"
    effectSummary: "これが場に出たとき、相手の虫を１つ選び１００のダメージを与えてもよい。 ※このダメージは色による影響を受けない。 ※この効果により虫が破壊されたとき、相手は縄張りを引かない。"
effectSummary: null
taxonomy:
  order: null
  family: "ツチカメムシ科"
  other: []
referencableTags:
  - "ツチカメムシ科"
  - "毒霧散布"
  - "登場時"
  - "破壊時"
  - "ダメージ変更"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/45/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 46/60 鍬形虫の甲冑

```yaml
officialNumber: "46/60"
name: "鍬形虫の甲冑"
set: "BOOSTER_SET_3"
rarity: "SR"
type: "ENHANCEMENT"
color: null
cost: 3
baseHp: null
skills: []
traits: []
effectSummary: "この虫の体力と攻撃力を７００増やす。 ＜装着＞これを縄張りから引いたとき、自分の場に虫がいるなら、これをつけてもよい。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "裏向き"
  - "ダメージ変更"
  - "縄張り操作"
rulings:
  - "＜装着＞の強化カードが自分の虫についているとき、＜装着＞は: はい。発動します。"
  - "カマ連撃の1回目の攻撃で虫が破壊され、＜装着＞が発動した場合のどのように: 1回目のカマ連撃後、虫が破壊された後、縄張りを引き、それが＜装着＞だった場合、＜装着＞をつけた後、2回目のカマ連撃が使用できます。"
  - "かくれる(クラウディーナミイロタテハ)や、相手のすくい投げ(カブトムシ)により裏返った自分の虫のみが場にいる場合に縄張りから<装着>を引いた場合、裏向きの虫につけれませんか？: はい。裏向きの虫に＜装着＞で強化カードはつけられません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/46/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 47/60 黄金虫の甲冑

```yaml
officialNumber: "47/60"
name: "黄金虫の甲冑"
set: "BOOSTER_SET_3"
rarity: "N"
type: "ENHANCEMENT"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectSummary: "この虫の体力と攻撃力を２００増やす。 <装着>これを縄張りから引いたとき、自分の場に虫がいるなら、これをつけてもよい。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "裏向き"
  - "ダメージ変更"
  - "縄張り操作"
rulings:
  - "＜装着＞の強化カードが自分の虫についているとき、＜装着＞は: はい。発動します。"
  - "カマ連撃の1回目の攻撃で虫が破壊され、＜装着＞が発動した場合のどのように: 1回目のカマ連撃後、虫が破壊された後、縄張りを引き、それが＜装着＞だった場合、＜装着＞をつけた後、2回目のカマ連撃が使用できます。"
  - "かくれる(クラウディーナミイロタテハ)や、相手のすくい投げ(カブトムシ)により裏返った自分の虫のみが場にいる場合に縄張りから<装着>を引いた場合、裏向きの虫につけれませんか？: はい。裏向きの虫に＜装着＞で強化カードはつけられません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/47/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 48/60 白銀蜘蛛の糸

```yaml
officialNumber: "48/60"
name: "白銀蜘蛛の糸"
set: "BOOSTER_SET_3"
rarity: "LR"
type: "ENHANCEMENT"
color: null
cost: 6
baseHp: null
skills: []
traits: []
effectSummary: "自分の捨て札にある虫を２つ選び、どちらかにこれをつけて場に出す。この効果により場に出た虫は＜＞の技の効果を失う。これが破壊されたとき、それらの虫を破壊する。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "捨て札"
  - "破壊時"
  - "手札操作"
  - "縄張り操作"
rulings:
  - "白銀蜘蛛の糸で場に出した<りんぷん>を持つ虫と、普通に場に出した<りんぷん>を持つ虫が場にいる場合、白銀蜘蛛の糸で場に出した虫は<>技は効果を発揮していませんが、持ってはいるためも: いいえ。白銀蜘蛛の糸のテキストにある「＜＞の技の効果を失う」は技自体（＜＞の技の効果と技自体（キーワード））を失わせます。白銀蜘蛛の糸にて場に出た<鳴く>または<りんぷん>を持つ虫は、<りんぷん>を持つ虫)が場にいる場合、攻撃対象にできません。"
  - "2体の虫を白銀蜘蛛の糸で場に出しました。白銀蜘蛛の糸を付けた虫にヘラクレス投げを使用された時: 白銀蜘蛛の糸をつけていた虫が手札に戻り、ついていない虫は破壊されます。 虫が手札に戻ったことで強化カードである白銀蜘蛛の糸を破壊されるため、もう1体の虫は破壊されますが、手札に戻った虫は場を離れているため、白銀蜘蛛の糸による破壊効果は対象がなくなり無効となります。"
  - "白銀蜘蛛の糸でモンシロチョウとモンキチョウを場に出しました。その後手札からモンシロチョウを出した時、それぞれの攻撃力は: 手札から出したモンシロチョウは場にモンキチョウがいるため、＜紋章＞の効果で攻撃力が上がります。白銀蜘蛛の糸で場に出た2枚は＜＞を失っているため、攻撃力は変わりません。"
  - "白銀蜘蛛の糸で出した虫2体のうち、このカードがついていない方の虫を繚乱の足掻きの効果で入れ替えました。その後白銀蜘蛛の糸が破壊された場合、それぞれの虫は: 白銀蜘蛛の糸が付いていた虫のみが破壊され、繚乱の足掻きによって手札に戻った虫と新たに場に出た虫は破壊されません。札に戻った虫は場を離れているため、白銀蜘蛛の糸による破壊効果は対象がなくなり無効となります。"
  - "通常の方法で場に出したキマダラドクバッタが、白銀蜘蛛の糸が付いた状態で虫の攻撃によって破壊された時に縄張りを引く処理と、白銀蜘蛛の糸の破壊された時の処理、キマダラドクバッタが破壊さ: その場合、 ①キマダラドクバッタが、白銀蜘蛛の糸をつけた相手の虫の攻撃により破壊される ②＜トウワタ毒＞の効果でキマダラドクバッタを攻撃した相手の虫が破壊される ③白銀蜘蛛の糸が破壊される ④白銀蜘蛛の糸の効果で場に出ていた虫が破壊される ⑤キマダラドクバッタを破壊されたプレイヤーは縄張りを引く となります"
  - "白銀蜘蛛の糸を「螻蛄の七芸」で他の虫に付け替えた場合は: 他の虫に付け替えられた白銀蜘蛛が破壊されたとき、白銀蜘蛛の効果で場に出た虫が両方破壊されます。"
  - "自分の場に[白銀蜘蛛の糸]の効果で場に出した、[ナミアゲハA＆(白銀蜘蛛の糸)][ナミアゲハB]と[マメコガネ]がいます。 [螻蛄の七芸]で[ナミアゲハA]についている[白銀蜘蛛の: いいえ、[ナミアゲハA][ナミアゲハB]の＜りんぷん＞は失ったままになります。 [白銀蜘蛛の糸]の「この効果により場に出た虫は<>の技と効果を失う。」「これが破壊されたとき、それらの虫を破壊する。」はいずれも[白銀蜘蛛の糸]で場に出した虫に効果を与えるため、別の虫につけかえても[ナミアゲハA][ナミアゲハB]に効果を与え、＜りんぷん＞を失ったままになります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/48/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 49/60 七節の秘伝書

```yaml
officialNumber: "49/60"
name: "七節の秘伝書"
set: "BOOSTER_SET_3"
rarity: "R"
type: "ENHANCEMENT"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectSummary: "この虫はこれをつけた次の相手のターンに攻撃を受けない。これがついた虫が虫の攻撃により破壊されたとき、このカードを手札に戻す。 ※これ以外に虫がいないとき、直接攻撃を受ける。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "破壊時"
  - "攻撃制限"
  - "遅延効果"
  - "手札操作"
rulings:
  - "逆立ち返しや、ヘラクレス投げにより虫が入れ替わることで、このカードが破壊されたとき、このカードは手札に戻りますか？: いいえ。逆立ち返しや、ヘラクレス投げは虫の攻撃による虫の破壊ではないため、戻りません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/49/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 50/60 女王蜂の匂い袋

```yaml
officialNumber: "50/60"
name: "女王蜂の匂い袋"
set: "BOOSTER_SET_3"
rarity: "R"
type: "SPELL"
color: null
cost: 3
baseHp: null
skills: []
traits: []
effectSummary: "手札から〜バチ科の虫を最大２枚まで選び、場に出す。ターン終了時にそれらを破壊する。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "遅延効果"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/50/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 51/60 刺蠅の血盟

```yaml
officialNumber: "51/60"
name: "刺蠅の血盟"
set: "BOOSTER_SET_3"
rarity: "R"
type: "SPELL"
color: null
cost: 4
baseHp: null
skills: []
traits: []
effectSummary: "このカードのコストを支払う代わりに、自分の縄張りを２枚選び、捨て札に置いてもよい。相手の虫を１つ選ぶ。その虫を破壊する。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "捨て札"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/51/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 52/60 藪蚊の密約

```yaml
officialNumber: "52/60"
name: "藪蚊の密約"
set: "BOOSTER_SET_3"
rarity: "N"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "自分は縄張りを１枚引く。この効果により、縄張りを引いたとき＜とびだす＞は使用できない。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/52/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 53/60 楠葉の護符

```yaml
officialNumber: "53/60"
name: "楠葉の護符"
set: "BOOSTER_SET_3"
rarity: "R"
type: "SPELL"
color: null
cost: 2
baseHp: null
skills: []
traits: []
effectSummary: "自分の虫を１つ選び、次の相手のターン終了時まで裏返す。この虫は裏返しの間、いないものとして扱う。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "裏向き"
  - "遅延効果"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/53/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 54/60 息吹の解放

```yaml
officialNumber: "54/60"
name: "息吹の解放"
set: "BOOSTER_SET_3"
rarity: "R"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "相手の虫を１つ選び、好きな数のコストを支払う。その虫に支払ったコスト×３００のダメージを与える。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "ダメージ変更"
rulings:
  - "0コストで使用することは: はい。可能です。その場合、0ダメージを与えることになります。"
  - "0コストで使用した場合、アレクサンドラトリバネアゲハの＜不死蝶の舞＞やジョロウグモの＜蜘蛛の巣＞の効果を無効に: はい。可能です。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/54/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 55/60 軍隊蟻の蹂躙

```yaml
officialNumber: "55/60"
name: "軍隊蟻の蹂躙"
set: "BOOSTER_SET_3"
rarity: "SR"
type: "SPELL"
color: null
cost: 2
baseHp: null
skills: []
traits: []
effectSummary: "ターン終了時まで、自分のすべての虫の攻撃力を５００増やす。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "遅延効果"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/55/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 56/60 四柱の間引き

```yaml
officialNumber: "56/60"
name: "四柱の間引き"
set: "BOOSTER_SET_3"
rarity: "R"
type: "SPELL"
color: null
cost: 3
baseHp: null
skills: []
traits: []
effectSummary: "手札が５枚以上あるプレイヤーは、４枚になるように手札からカードを選び、捨て札に置く。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "捨て札"
  - "手札操作"
rulings:
  - "手札を捨てるタイミングは自分と相手どちらが先ですか？: お互い同時になります。お互いに捨てる手札を選び、手札が4枚であるか枚数を確認して捨て札にします。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/56/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 57/60 衣蛾の虫喰み

```yaml
officialNumber: "57/60"
name: "衣蛾の虫喰み"
set: "BOOSTER_SET_3"
rarity: "N"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "自分の裏向きのエサを最大３つ選び、表向きにする。 ※この効果は、裏向きのエサを選べる。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "裏向き"
  - "エサ操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/57/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 58/60 土蜘蛛の地固め

```yaml
officialNumber: "58/60"
name: "土蜘蛛の地固め"
set: "BOOSTER_SET_3"
rarity: "N"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "ターン終了時まで、次に使う強化カードのコストを１減らす。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "遅延効果"
rulings:
  - "土蜘蛛の地固めを2枚使用すると、強化カードは2コスト軽減されますか？: はい。土蜘蛛の地固めを連続で使用した場合、合計2コスト軽減されます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/58/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 59/60 鬼蜘蛛の金縛り

```yaml
officialNumber: "59/60"
name: "鬼蜘蛛の金縛り"
set: "BOOSTER_SET_3"
rarity: "N"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "次の相手のターンの間、相手が使用する術カードのコストを１増やす。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "遅延効果"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/59/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 60/60 飛蝗の待ち伏せ

```yaml
officialNumber: "60/60"
name: "飛蝗の待ち伏せ"
set: "BOOSTER_SET_3"
rarity: "R"
type: "SPELL"
color: null
cost: 3
baseHp: null
skills: []
traits: []
effectSummary: "このゲーム中、自分の縄張りがなくなるまで、自分の～バッタ科、～イナゴ科の虫は＜とびだす＞を持つ。2024/08/01 カードの効果処理、裁定整備により変更"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "縄張り操作"
rulings:
  - "2回使うと: 1回目で効果が適応されているため、特に効果はありません。"
  - "このゲーム中とはいつまでですか？: どちらかのプレイヤーが直接攻撃を受けるか、カードを引く時に山札が無く、この対戦が終了するまでを指します。"
  - "「自分の縄張りがなくなるまで」との事ですが、蜜蠟の壁を使用した場合効果は延長されますか？: はい。たとえば縄張りが残り1枚の時に使用した場合、蜜蠟の壁を含む縄張りが全てなくなるまで効果は延長されます。なお、縄張りがなくなった後に蜜蠟の壁を使用しても効果が復帰することはありません。"
  - "飛蝗の待ち伏せを使った後、白銀蜘蛛の糸でバッタ科の虫を場に出しました。この場合＜とびだす＞の効果は消えますか？ それとも元々持たない場合は＜とびだす＞が上書きされますか？: 飛蝗の待ち伏せを使用した場合、自分のバッタ科･イナゴ科の虫は＜とびだす＞を持ちます。そのため白銀蜘蛛の糸で場に出した場合、どちらのカードが先であっても白銀蜘蛛の糸の効果によって＜とびだす＞は失われます。"
  - "自身のエメラルドゴキブリバチの操り針で相手のカレハバッタを倒した時、場に出るカレハバッタは＜とびだす＞を持ちますか: はい。バッタの待ち伏せを使用したプレイヤーが、エメラルドゴキブリバチの操り針で相手のカレハバッタを倒した時に場に出るカレハバッタは＜とびだす＞を持ちます。"
  - "飛蝗の待ち伏せを使用したあと、鋏虫の芯切狭やオウゴンオニクワガタの能力で攻撃されたとき、縄張りから引いたバッタ科の虫を場に出すことは出来ますか？: いいえ。バッタ科・イナゴ科の虫は＜とびだす＞を持った結果、縄張りから出てくるようになるので、オウゴンオニクワガタなどの効果の影響を受けます。"
  - "「飛蝗の待ち伏せ」のとびだすを付与させる対象は バッタ科 イナゴ科 と書かれていますが。 ヒシバッタ科のハラヒシバッタ、オンブバッタ科のオンブバッタにはとびだすは付与されませんか？: テキストの変更により～バッタ科とななったため、ヒシバッタ科のハラヒシバッタ、オンブバッタ科のオンブバッタ、ノミバッタ科のノミバッタも＜とびだす＞をもちます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI3/60/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 分類インデックス

- `アゲハチョウ科`: ギフチョウ
- `アメンボ科`: ナミアメンボ
- `アリ科`: サシハリアリ
- `ウシコロシサソリ科`: マダラサソリ
- `オボソサソリ科`: ヤエヤマサソリ
- `カワトンボ科`: ハグロトンボ
- `キリギリス科`: ハヤシノウマオイ, ハタケノウマオイ, キョジンツユムシ, クツワムシ
- `キンカメムシ科`: ナナホシキンカメムシ
- `クワガタムシ科`: パラワンオオヒラタクワガタ, グランディスオオクワガタ, メタリフェルホソアカクワガタ, ニジイロクワガタ, キンオニクワガタ
- `ゲンゴロウ科`: ナミゲンゴロウ
- `コオイムシ科`: タガメ
- `コガネムシ科`: サタンオオカブト, グラントシロカブト, ヤンバルテナガコガネ, クロカナブン
- `サカダチコノハナナフシ科`: サカダチコノハナナフシ
- `ジョロウグモ科`: オオジョロウグモ
- `ススメガ科`: ベニスズメ
- `セイボウ科`: イラガセイボウ
- `セセリチョウ科`: イチモンジセセリ
- `タイコウチ科`: ミズカマキリ, タイコウチ
- `タマムシ科`: アオマダラタマムシ
- `ツェツェバエ科`: ツェツェバエ
- `ツチカメムシ科`: ベニツチカメムシ
- `ツリアブ科`: トラツリアブ
- `ドクガ科`: チャドクガ（幼虫）
- `ナナフシ科`: トゲナナフシ, エダナナフシ
- `ハエトリグモ科`: アダンソンハエトリ
- `ハムシ科`: グンジョウオオコブハムシ, モモブトオオルリハムシ, オオルリハムシ
- `ハンミョウ科`: オオエンマハンミョウ
- `バッタ科`: マダラバッタ, ナキイナゴ
- `ヤガ科`: ムクゲコノハ

## 特性インデックス

- `＜ふわふわ＞`: トラツリアブ
- `＜トゲ擬態＞`: トゲナナフシ
- `＜一文字＞`: イチモンジセセリ
- `＜七色反射＞`: ニジイロクワガタ
- `＜偉大な力＞`: グランディスオオクワガタ
- `＜円網＞`: オオジョロウグモ
- `＜夜間飛行＞`: ムクゲコノハ
- `＜大太刀二刀流＞`: メタリフェルホソアカクワガタ
- `＜奇怪な両腕＞`: ヤンバルテナガコガネ
- `＜宝石昆虫＞`: グンジョウオオコブハムシ
- `＜擬態＞`: エダナナフシ
- `＜新緑の呪い＞`: クツワムシ
- `＜新緑の呪縛＞`: キョジンツユムシ
- `＜樹液酒場＞`: パラワンオオヒラタクワガタ
- `＜毒蛾の毛針＞`: チャドクガ（幼虫）
- `＜毒霧散布＞`: アカスジキンカメムシ, ナナホシキンカメムシ, ベニツチカメムシ
- `＜水生昆虫＞`: タガメ, ミズカマキリ, タイコウチ, ナミゲンゴロウ, ナミアメンボ
- `＜白色甲殼＞`: グラントシロカブト
- `＜蠅取り＞`: アダンソンハエトリ
- `＜血の対価＞`: ツェツェバエ
- `＜金色甲殻＞`: キンオニクワガタ
- `＜食い破る＞`: イラガセイボウ
- `＜魔王のツノ＞`: サタンオオカブト
- `＜鳴く＞`: ナキイナゴ
- `＜黒光り＞`: クロカナブン

## BLOCKED一覧

- なし
