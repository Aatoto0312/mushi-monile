# 蟲神器 第5弾カード図鑑

> Version: v1.0 KNOWLEDGE-BASE
> 対象: ブースターパック第5弾 64種
> 用途: ゲームUI・ルールエンジンが参照する実装用知識ベース

## 0. 運用原則

- カード表面情報と生物分類は非公式DBを探索補助として構造化し、裁定は公式Q&Aを優先する。
- `＜○○＞` は `traits` として通常技から分離する。
- 不明点や解析不能項目は推測せず `blocked` に残す。
- 効果・裁定はゲーム実装に必要な意味へ短く整理し、ページ全体を転載しない。

## 1. 共通ソースと検証状態

- 公式Q&A: https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/
- カード探索補助（非公式）: https://mushijingi.com/
- Raw取得時刻: 2026-08-30T17:21:36.3804288Z
- 基本値・分類: `VERIFIED_SECONDARY`（公式現物との全件画像突合は未実施）
- 裁定: `OFFICIAL_QA_SUMMARY`（一致カードのみ）

## 2. 収録検査

- Expected / actual: 64 / 64
- Card-number coverage: PASS
- Card-number duplicate check: PASS
- Type total check: PASS
- 虫 / 強化 / 術: 45 / 10 / 9
- BLOCKED: 0

---

## 1/64 ジャイアントテキサスキリギリス

```yaml
officialNumber: "1/64"
name: "ジャイアントテキサスキリギリス"
set: "BOOSTER_SET_5"
rarity: "LR"
type: "INSECT"
color: "RED"
cost: 6
baseHp: 1700
skills:
  - name: "神のオオキバ"
    baseAp: 1000
    effectSummary: null
  - name: "デビルアイ"
    baseAp: 1500
    effectSummary: "この技はこれに強化カードがついていないと使用できない。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "キリギリス科"
  other: []
referencableTags:
  - "キリギリス科"
  - "捨て札"
rulings:
  - "[白銀蜘蛛の糸]を使用して、捨て札の[ジャイアントテキサスキリギリス]と[マメコガネ]を選び、[マメコガネ]に[白銀蜘蛛の糸]をつけて場に出しました。 その後に、[白銀蜘蛛の糸]の: いいえ。できません。\"デビルアイ\"はジャイアントテキサスキリギリスに強化カードがついていなければ使用できません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/1/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 2/64 レッドクロウエンペラースコーピオン

```yaml
officialNumber: "2/64"
name: "レッドクロウエンペラースコーピオン"
set: "BOOSTER_SET_5"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 5
baseHp: 1300
skills:
  - name: "レッドクロー"
    baseAp: "X"
    effectSummary: "自分の赤のエサの数×300のダメージを与える。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "コガネサソリ科"
  other: []
referencableTags:
  - "コガネサソリ科"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/2/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 3/64 マエモンカマキリ

```yaml
officialNumber: "3/64"
name: "マエモンカマキリ"
set: "BOOSTER_SET_5"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 5
baseHp: 1300
skills:
  - name: "カマ斬撃"
    baseAp: 1000
    effectSummary: null
traits:
  - name: "供物"
    effectSummary: "これが場に出たとき、手札から虫を1つ選び 捨て札に置く。そうしなければ、この虫を 破壊する。"
effectSummary: null
taxonomy:
  order: null
  family: "カマキリ科"
  other: []
referencableTags:
  - "カマキリ科"
  - "供物"
  - "捨て札"
  - "登場時"
  - "手札操作"
rulings:
  - "[マエモンカマキリ]が1枚だけ手札にあるとき、[マエモンカマキリ]を場に出すことは: はい。できます。ただし場に出たときに手札から虫を1つ捨て札に置けないため、＜供物＞の効果で[マエモンカマキリ]が破壊されます。"
  - "[マエモンカマキリ]を場に出すとき、手札をかならず捨て札にしなければなりませんか？: いいえ。ただし場に出たときに手札から虫を1つ捨て札に置いていないため、＜供物＞の効果で[マエモンカマキリ]が破壊されます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/3/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 4/64 ヒノマルコロギス

```yaml
officialNumber: "4/64"
name: "ヒノマルコロギス"
set: "BOOSTER_SET_5"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 4
baseHp: 900
skills:
  - name: "かみちぎる"
    baseAp: 700
    effectSummary: null
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "コロギス科"
  other: []
referencableTags:
  - "コロギス科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/4/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 5/64 アオズムカデ

```yaml
officialNumber: "5/64"
name: "アオズムカデ"
set: "BOOSTER_SET_5"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 4
baseHp: 900
skills:
  - name: "毒のキバ"
    baseAp: 400
    effectSummary: "このダメージは回復しない。"
traits:
  - name: "青頭"
    effectSummary: "これが場に出たとき、ターン終了時までこの虫の色を青にしてもよい。"
effectSummary: null
taxonomy:
  order: null
  family: "オオムカデ科"
  other: []
referencableTags:
  - "オオムカデ科"
  - "青頭"
  - "登場時"
  - "遅延効果"
  - "色変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/5/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 6/64 オオヤマトンボ

```yaml
officialNumber: "6/64"
name: "オオヤマトンボ"
set: "BOOSTER_SET_5"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 3
baseHp: 500
skills:
  - name: "とびかかる"
    baseAp: 400
    effectSummary: null
traits:
  - name: "トンボ返り"
    effectSummary: "これが破壊されたとき、この虫に強化カードがついていたなら、この虫を手札に戻す。"
effectSummary: null
taxonomy:
  order: null
  family: "ヤマトンボ科"
  other: []
referencableTags:
  - "ヤマトンボ科"
  - "トンボ返り"
  - "破壊時"
  - "手札操作"
rulings:
  - "強化カードの付いたオオヤマトンボを軍配虫の大団扇を付けた虫の攻撃で破壊した場合、オオヤマトンボは＜トンボ返り＞で手札に戻りますか？: いいえ。その場合、先に山札にの一番下に置かれてしまい戻りません。"
  - "強化カードの付いたオオヤマトンボを逆立ち返しや、繚乱の足掻き、反逆の蛮勇などで入れ替えた場合、＜トンボ返り＞は: いいえ。発動しません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/6/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 7/64 アシナガグモ

```yaml
officialNumber: "7/64"
name: "アシナガグモ"
set: "BOOSTER_SET_5"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 3
baseHp: 500
skills:
  - name: "かむ"
    baseAp: 300
    effectSummary: null
traits:
  - name: "捕食"
    effectSummary: "これが場にいるとき、自分の場のこれ以外の虫が虫の攻撃により破壊されたなら、相手は縄張りを１枚引く。"
effectSummary: null
taxonomy:
  order: null
  family: "アシナガグモ科"
  other: []
referencableTags:
  - "アシナガグモ科"
  - "捕食"
  - "縄張り操作"
rulings:
  - "自分の場に[アシナガグモ]2体と[ナミアゲハ]がいるときに、相手の虫の攻撃によって[ナミアゲハ]が破壊されました。 このとき[アシナガグモ]2体それぞれの＜捕食＞で相手が引く縄張り: はい。合計2枚になります。 同じタイミングで[アシナガグモ]2体それぞれの＜捕食＞が発動し、「相手は縄張りを1枚引く。」により合計2枚引きます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/7/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 8/64 セスジアカムカデ

```yaml
officialNumber: "8/64"
name: "セスジアカムカデ"
set: "BOOSTER_SET_5"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 3
baseHp: 700
skills:
  - name: "毒のキバ"
    baseAp: 300
    effectSummary: "このダメージは回復しない。"
traits:
  - name: "襲来"
    effectSummary: "これが手札から、相手のカードの効果により捨て札に置かれるなら、かわりに場に出してもよい。"
effectSummary: null
taxonomy:
  order: null
  family: "アカムカデ科"
  other: []
referencableTags:
  - "アカムカデ科"
  - "襲来"
  - "捨て札"
rulings:
  - "自分が[四柱の間引き]を使用して、手札から[セスジアカムカデ]を捨て札に置いた場合、 ＜襲来＞の効果によって、かわりに場に出すことが: いいえ。できません。相手が使うカードの効果によって手札から捨て札に置かれたときのみ＜襲来＞は発動し、場に出すことができます。 そのため自分のカードの効果で捨て札に置いても＜襲来＞は発動しません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/8/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 9/64 ジバクアリ

```yaml
officialNumber: "9/64"
name: "ジバクアリ"
set: "BOOSTER_SET_5"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 100
skills:
  - name: "かみつく"
    baseAp: 300
    effectSummary: null
traits:
  - name: "自爆粘液"
    effectSummary: "この虫を破壊した虫は、次にダメージを受けたとき破壊される。※０のダメージもダメージとして扱う。"
effectSummary: null
taxonomy:
  order: null
  family: "アリ科"
  other: []
referencableTags:
  - "アリ科"
  - "自爆粘液"
  - "エサ操作"
  - "破壊時"
  - "ダメージ変更"
  - "手札操作"
rulings:
  - "＜自爆粘液＞によって[ジバクアリ]を破壊した虫を虫の攻撃で破壊しました。この時縄張りは引きますか？: はい、引きます。＜自爆粘液＞の効果は次に受けたダメージによって破壊されるものなので、その場合虫の攻撃によるダメージで破壊された扱いになります。"
  - "＜自爆粘液＞によって[ジバクアリ]を破壊した虫に与えた効果はいつまで続きますか？: 次にダメージを受けるか、破壊や手札に戻る効果などによって場を離れるまで続きます。"
  - "＜自爆粘液＞の効果を受けている相手の[リュウジンオオムカデ]に、自分の[フィジーオオウスバカミキリ]の\"力のキバ\"を使い攻撃しました。 このとき、\"力のキバ\"の効果は: はい、発動します。\"力のキバ\"攻撃によるダメージで相手の虫を破壊したとき、攻撃力と体力が増えますが、＜自爆粘液＞の効果は次に受けたダメージによって破壊されるものなので、\"力のキバ\"の攻撃によるダメージで破壊された扱いになります。"
  - "＜自爆粘液＞の効果を受けている相手の[マメコガネ]に、自分の[サカダチコノハナナフシ]の\"逆立ち返し\"を使い攻撃しました。 このとき、＜自爆粘液＞の効果で相手の[マメコガネ]は破壊: どちらの虫も＜自爆粘液＞の効果では破壊されません。\"逆立ち返し\"で相手の虫を攻撃したとき、攻撃のダメージ判定の前に技の効果が発揮され＜自爆粘液＞の 効果を受けた[マメコガネ]と相手のエサ場の虫の入れ替わります。このとき[マメコガネ]はエサ場に行き、場を離れるため＜自爆粘液＞で受けた効果はなくなります。"
  - "相手の場の[ジバクアリ]を破壊した虫に[空蝉の皮鎧]をつけました。相手のターンに攻撃を受けて[空蝉の皮鎧]が代わりに破壊されたとき、＜自爆粘液＞の効果は無く: はい、なくなります。[空蝉の皮鎧]により破壊を免れると、次にダメージを受けたことになるため＜自爆粘液＞の効果はなくなります。"
  - "「オオカマキリ」の「共食い」を使用し、ジバクアリを破壊したとき、〈自爆粘液〉の効果は「オオカマキリ」に適用されますか？: いいえ。適応されません。ジバクアリの＜自爆粘液＞は虫の攻撃により、破壊されたときのみ効果を発揮します。サツマニシキの〈毒の泡〉も同様となります。"
  - "ベニツチカメムシの〈毒霧散布〉でジバクアリ〈自爆粘液〉を破壊したとき、ベニツチカメムシは〈自爆粘液〉の効果を受けますか: いいえ。受けません。ジバクアリの〈自爆粘液〉はジバクアリを攻撃で破壊した虫に対して発動となります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/9/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 10/64 カメノコテントウ

```yaml
officialNumber: "10/64"
name: "カメノコテントウ"
set: "BOOSTER_SET_5"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 3
baseHp: 800
skills:
  - name: "かみつぶす"
    baseAp: 300
    effectSummary: null
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "テントウムシ科"
  other: []
referencableTags:
  - "テントウムシ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/10/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 11/64 モンスズメバチ

```yaml
officialNumber: "11/64"
name: "モンスズメバチ"
set: "BOOSTER_SET_5"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 400
skills:
  - name: "かみきる"
    baseAp: 400
    effectSummary: null
traits:
  - name: "にげる"
    effectSummary: "他の虫が自分の場に出たとき、これを破壊する。"
effectSummary: null
taxonomy:
  order: null
  family: "スズメバチ科"
  other: []
referencableTags:
  - "スズメバチ科"
  - "にげる"
  - "裏向き"
  - "登場時"
  - "縄張り操作"
rulings:
  - "自分の場が[モンスズメバチ]だけのときに、＜危険察知＞の技を持つ[コロギス]を自分の場に出しました。 このとき[モンスズメバチ]は＜にげる＞の効果によって破壊されますか？それとも＜: ＜危険察知＞によって＜にげる＞が使用できなくなり、場に残ります。 条件により発動する技(「場にでたとき」の＜にげる＞など)と、持続的に効果を発動する技(「場にいるとき」の＜危険察知＞など)が同時に発動する場合、持続的に効果を発動する技の効果が先に優先され発動します。"
  - "[瀬戸際の虫時雨]で[モンスズメバチ]と[ナナホシテントウ]を場に出します。 [モンスズメバチ]は＜にげる＞の効果で破壊されますか？: [モンスズメバチ]を後から出せば破壊されません。[瀬戸際の虫時雨]は選んだ虫を順番に出す効果なので、順番によって結果が変わります。"
  - "自分の場に[モンスズメバチ]がいるときに、相手の攻撃によって別の虫が破壊され、縄張りを引きました。引いたカードが[ヤブキリ]だったとき、＜とびだす＞の効果で場に出します。[モンスズ: はい、破壊されます。自分、相手のターンに関わらず、自分の場に新たに虫が出たとき、＜にげる＞によって虫は破壊されます。"
  - "自分の場の[ジグモ]が\"かくれる\"で攻撃し、裏返りました。その後[モンスズメバチ]を出して自分のターンが終わり、そのままの状態でジグモが表に戻ります。このとき[モンスズメバチ]は＜: いいえ、破壊されません。裏返った虫はいないものとして扱われていますが、新たに場に出るわけではないので＜にげる＞の効果は発動しません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/11/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 12/64 ムツトゲイセキグモ

```yaml
officialNumber: "12/64"
name: "ムツトゲイセキグモ"
set: "BOOSTER_SET_5"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 300
skills:
  - name: "かむ"
    baseAp: 200
    effectSummary: null
  - name: "投げ縄"
    baseAp: 0
    effectSummary: "この技は１度だけ使用できる。この技を受けた虫は、次のターン攻撃できない。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "コガネグモ科"
  other: []
referencableTags:
  - "コガネグモ科"
  - "攻撃制限"
rulings:
  - "相手の[マメコガネ]に[ムツドゲイセキグモ]の\"投げ縄\"で攻撃して、自分のターンを終了しました。 次のターンに相手が[塵芥虫の爆熱弾]を使い、自分の[ムツトゲイセキグモ]を破壊しま: いいえ。できません。 ”投げ縄”で相手の[マメコガネ]に与えられた「次のターン攻撃できない。」の効果は[ムツトゲイセキグモ]が破壊されてもなくなりません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/12/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 13/64 クロスズメバチ

```yaml
officialNumber: "13/64"
name: "クロスズメバチ"
set: "BOOSTER_SET_5"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 1
baseHp: 100
skills:
  - name: "かみきる"
    baseAp: 200
    effectSummary: null
traits:
  - name: "地蜂の巣"
    effectSummary: "これが虫の攻撃により破壊されたとき、この虫に強化カードがついているなら、それを１つ選び手札に戻してもよい。"
effectSummary: null
taxonomy:
  order: null
  family: "スズメバチ科"
  other: []
referencableTags:
  - "スズメバチ科"
  - "地蜂の巣"
  - "捨て札"
  - "破壊時"
  - "ダメージ変更"
  - "手札操作"
rulings:
  - "自分の場に、【[天牛の大顎]がついた[クロスズメバチ]】と【[蠱術の贋作]がついた[マメコガネ]】がいます。 [蠱術の贋作]は、つけるときに[天牛の大顎]を選びました。相手の虫の攻: いいえ。破壊されません。[蠱術の贋作]をつけるときに選んだ強化カードが、手札に戻るなど破壊以外の方法で場を離れた場合[蠱術の贋作]は破壊されず、 [蠱術の贋作]が効果によって[マメコガネ]に与えている修正値(つけるときに選んだ[天牛の大顎]の修正値、攻撃力を300増やす。)への影響もありません。"
  - "[白銀蜘蛛の糸]を使い、捨て札の[カブトムシ]と[ナミアゲハ]を選び、[白銀蜘蛛の糸]を[カブトムシ]に付けて場に出しました。 その後に[クロスズメバチ]を場に出し、[螻蛄の七芸]: いいえ。破壊されません。 手札に戻るなど破壊以外の方法で[白銀蜘蛛の糸]が場を離れた場合、「これが破壊されたとき、それらの虫を破壊する。」の効果は発揮されません。"
  - "針金の道連れをつけたクロスズメバチが相手の虫の攻撃により倒された場合 、針金の道連れと＜地蜂の巣＞が誘発しますが: その場合、針金虫の効果で相手の虫を破壊後、＜地蜂の巣＞の効果で針金虫の道連れを手札に戻す。となります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/13/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 14/64 トウキョウヒメハンミョウ

```yaml
officialNumber: "14/64"
name: "トウキョウヒメハンミョウ"
set: "BOOSTER_SET_5"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 1
baseHp: 400
skills:
  - name: "かむ"
    baseAp: 200
    effectSummary: null
traits:
  - name: "にげる"
    effectSummary: "他の虫が自分の場に出たとき、これを破壊する。"
effectSummary: null
taxonomy:
  order: null
  family: "オサムシ科"
  other: []
referencableTags:
  - "オサムシ科"
  - "にげる"
  - "登場時"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/14/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 15/64 レギウスオオツノハナムグリ

```yaml
officialNumber: "15/64"
name: "レギウスオオツノハナムグリ"
set: "BOOSTER_SET_5"
rarity: "LR"
type: "INSECT"
color: "BLUE"
cost: 6
baseHp: 2000
skills:
  - name: "神の蹂躙"
    baseAp: 1400
    effectSummary: null
traits:
  - name: "王様"
    effectSummary: "これは場に出たターン攻撃できない。"
effectSummary: null
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
  - "王様"
  - "登場時"
  - "攻撃制限"
rulings:
  - "[コロギス]が場にいるとき、＜王様＞を持つ[レギウスオオツノハナムグリ]は場に出たターンに攻撃: いいえ。[コロギス]の＜危険察知＞は「場に出たとき」と書かれた技にのみ効果があります。＜王様＞は「場に出たターン」とは書かれているため、＜危険察知＞の効果は受けません。"
  - "[カイコ]や[武勇の面頬]の効果で、このターン場に出した[レギウスオオツノハナムグリ]が＜王様＞を失いました。[レギウスオオツノハナムグリ]はすぐに攻撃が: はい、可能です。もし攻撃前に何らかの理由で＜王様＞を再度持った状態になった場合、[レギウスオオツノハナムグリ]は攻撃できなくなります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/15/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 16/64 ヨーロッパミヤマクワガタ

```yaml
officialNumber: "16/64"
name: "ヨーロッパミヤマクワガタ"
set: "BOOSTER_SET_5"
rarity: "SR"
type: "INSECT"
color: "BLUE"
cost: 5
baseHp: 1000
skills:
  - name: "オオアゴバサミ"
    baseAp: 600
    effectSummary: null
traits:
  - name: "強化甲殼"
    effectSummary: "これがコストを支払い場に出たとき、自分の捨て札にあるコスト３以下の強化カードを１つ選び、この虫につけてもよい。"
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
  - "強化甲殼"
  - "エサ操作"
  - "捨て札"
  - "登場時"
rulings:
  - "1コスト支払い[蜉蝣の閃き]を使用してエサ場の[ヨーロッパミヤマクワガタ]を場に出したとき、＜強化甲殻＞を使用して捨て札にある3コスト以下の強化カードを[ヨーロッパミヤマクワガタ]: いいえ。できません。[蜉蝣の閃き]の効果によって[ヨーロッパミヤマクワガタ]が場に出ているため、＜強化甲殻＞の効果は発動しません。 ＜強化甲殻＞の効果が指している「コストを支払い」とは、[ヨーロッパミヤマクワガタ]のコストを支払って場に出たときを示します。 [蜉蝣の閃き]の場合は「術カードの1コストを支払い、コストを払わず虫を出す」行為をしているため、効果は発動しません。"
  - "コストを支払い[ヨーロッパミヤマクワガタ]を場に出したとき、＜強化甲殻＞を使用して[武勇の面頬]を[ヨーロッパミヤマクワガタ]につけました。 そのあと[武勇の面頬]の効果によって＜: [ヨーロッパミヤマクワガタ]についたままになります。[武勇の面頬]の効果によって＜強化甲殻＞の技を失いますが、処理が終了しているため影響はありません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/16/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 17/64 タランドゥス オオツヤクワガタ

```yaml
officialNumber: "17/64"
name: "タランドゥス オオツヤクワガタ"
set: "BOOSTER_SET_5"
rarity: "SR"
type: "INSECT"
color: "BLUE"
cost: 5
baseHp: 1100
skills:
  - name: "オオアゴバサミ"
    baseAp: 800
    effectSummary: null
traits:
  - name: "漆塗り"
    effectSummary: "相手の裏向きのエサ２つにつき、この虫のコストを１下げる。"
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
  - "漆塗り"
  - "裏向き"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/17/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 18/64 クロテイオウゼミ

```yaml
officialNumber: "18/64"
name: "クロテイオウゼミ"
set: "BOOSTER_SET_5"
rarity: "SR"
type: "INSECT"
color: "BLUE"
cost: 5
baseHp: 1300
skills:
  - name: "樹液吸収"
    baseAp: 700
    effectSummary: "この技により相手か縄張りを引いたとき、相手のエサ場にある虫を１つ選び裏返してもよい。それが青なら、もう１つ青のエサを選び裏返してもよい。"
  - name: "合唱"
    baseAp: 900
    effectSummary: "この技は自分の場にセミ科の虫が２つ以上いないと使用できない。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "セミ科"
  other: []
referencableTags:
  - "セミ科"
  - "裏向き"
  - "エサ操作"
  - "縄張り操作"
rulings:
  - "\"合唱\"を使用する際、[クロテイオウゼミ]の他に必要なセミ科の虫は何匹ですか？: クロテイオウゼミと他のセミ科の虫が１ついれば使用可能になります。使用の際に「場にセミ科が2つ以上いるか」を確認しますので、クロテイオウゼミも含んで考えます。"
  - "自分の場に[クロテイオウゼミ]と[ヨツコブツノゼミ]のみがいるとき、[クロテイオウゼミ]は\"合唱\"を使用することは: いいえ。できません。[ヨツコブツノゼミ]はツノゼミ科のため、\"合唱\"を使用する条件を満たすことができません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/18/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 19/64 カラスアゲハ

```yaml
officialNumber: "19/64"
name: "カラスアゲハ"
set: "BOOSTER_SET_5"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 4
baseHp: 800
skills:
  - name: "すいつくす"
    baseAp: 500
    effectSummary: null
traits:
  - name: "鴉塗り"
    effectSummary: "相手の裏向きのエサ２つにつき、この虫のコストを１下げる。"
effectSummary: null
taxonomy:
  order: null
  family: "アゲハチョウ科"
  other: []
referencableTags:
  - "アゲハチョウ科"
  - "鴉塗り"
  - "裏向き"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/19/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 20/64 セイヨウオオマルハナバチ

```yaml
officialNumber: "20/64"
name: "セイヨウオオマルハナバチ"
set: "BOOSTER_SET_5"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 800
skills:
  - name: "すう"
    baseAp: 300
    effectSummary: null
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "ミツバチ科"
  other: []
referencableTags:
  - "ミツバチ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/20/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 21/64 オオテナガカナブン

```yaml
officialNumber: "21/64"
name: "オオテナガカナブン"
set: "BOOSTER_SET_5"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 600
skills:
  - name: "たいあたり"
    baseAp: 300
    effectSummary: null
  - name: "テナガ攻撃"
    baseAp: 100
    effectSummary: "相手の虫を２つ選び、それぞれに攻撃する。※１つの虫や、相手に直接攻撃はできない"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/21/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 22/64 ベニシタバ

```yaml
officialNumber: "22/64"
name: "ベニシタバ"
set: "BOOSTER_SET_5"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 600
skills:
  - name: "すする"
    baseAp: 300
    effectSummary: null
traits:
  - name: "紅翅"
    effectSummary: "自分の場にキシタバがいるとき、この虫の攻撃力を600増やす。"
effectSummary: null
taxonomy:
  order: null
  family: "ヤガ科"
  other: []
referencableTags:
  - "ヤガ科"
  - "紅翅"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/22/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 23/64 キシタバ

```yaml
officialNumber: "23/64"
name: "キシタバ"
set: "BOOSTER_SET_5"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 600
skills:
  - name: "すする"
    baseAp: 300
    effectSummary: null
traits:
  - name: "黄翅"
    effectSummary: "自分の場にベニシタバがいるとき、この虫の攻撃力を600増やす。"
effectSummary: null
taxonomy:
  order: null
  family: "ヤガ科"
  other: []
referencableTags:
  - "ヤガ科"
  - "黄翅"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/23/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 24/64 ヒメオオクワガタ

```yaml
officialNumber: "24/64"
name: "ヒメオオクワガタ"
set: "BOOSTER_SET_5"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 2
baseHp: 400
skills:
  - name: "はさむ"
    baseAp: 400
    effectSummary: null
traits:
  - name: "にげる"
    effectSummary: "他の虫が自分の場に出たとき、これを破壊する。"
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
  - "にげる"
  - "登場時"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/24/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 25/64 プリモスマルガタクワガタ

```yaml
officialNumber: "25/64"
name: "プリモスマルガタクワガタ"
set: "BOOSTER_SET_5"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 2
baseHp: 300
skills:
  - name: "はさむ"
    baseAp: 300
    effectSummary: null
  - name: "耳バサミ"
    baseAp: 200
    effectSummary: "この技により相手が縄張りを引いたとき、相手の縄張りが５枚以上あるなら、コストを１発生させる。"
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
  - "相手の縄張りが5枚あるとき\"耳バサミ\"で相手を直接攻撃したとき、効果でコストを1発生しますか？: いいえ。発生しません。\"耳バサミ\"の効果は縄張りを引いたときに発動します。縄張りを引いたとき、縄張りの枚数が5枚から4枚になるため、コストは発生しません。引いた後の縄張りの枚数を数えます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/25/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 26/64 チビクワガタ

```yaml
officialNumber: "26/64"
name: "チビクワガタ"
set: "BOOSTER_SET_5"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 1
baseHp: 400
skills:
  - name: "はさむ"
    baseAp: 200
    effectSummary: null
traits:
  - name: "にげる"
    effectSummary: "他の虫が自分の場に出たとき、これを破壊する。"
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
  - "にげる"
  - "登場時"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/26/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 27/64 ニイニイゼミ

```yaml
officialNumber: "27/64"
name: "ニイニイゼミ"
set: "BOOSTER_SET_5"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 1
baseHp: 200
skills:
  - name: "樹液吸収"
    baseAp: 200
    effectSummary: "この技により相手が縄張りを引いたとき、相手のエサ場にある青の虫を最大２つ選び裏返してもよい。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "セミ科"
  other: []
referencableTags:
  - "セミ科"
  - "裏向き"
  - "エサ操作"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/27/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 28/64 ヨツコブツノゼミ

```yaml
officialNumber: "28/64"
name: "ヨツコブツノゼミ"
set: "BOOSTER_SET_5"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 1
baseHp: 300
skills:
  - name: "しぼりとる"
    baseAp: 100
    effectSummary: null
traits:
  - name: "魔よけの鈴"
    effectSummary: "これは術カードの対象にならない。"
effectSummary: null
taxonomy:
  order: null
  family: "ツノゼミ科"
  other: []
referencableTags:
  - "ツノゼミ科"
  - "魔よけの鈴"
  - "エサ操作"
  - "捨て札"
rulings:
  - "[テイオウゼミ]の＜セミの帝王＞の効果で[ヨツコブツノゼミ]を捨て札から場に出すことは: いいえ。できません。[ヨツコブツノゼミ]はツノゼミ科のため＜セミの帝王＞の効果で選び、場に出すことはできません。"
  - "[玉響の蠢き]で自分の手札にある[ヨツコブツノゼミ]を選び、場に出すことが: はい。できます。＜魔よけの鈴＞の効果は、手札やエサ場、捨て札にあるときには効果を発動しません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/28/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 29/64 リーガルモス（幼虫）

```yaml
officialNumber: "29/64"
name: "リーガルモス（幼虫）"
set: "BOOSTER_SET_5"
rarity: "LR"
type: "INSECT"
color: "GREEN"
cost: 6
baseHp: 1400
skills:
  - name: "神の大喰らい"
    baseAp: 1100
    effectSummary: "攻撃後、この虫の攻撃力と体力を300増やす。※この効果はこれが場を離れるまで継続する。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "ヤママユガ科"
  other: []
referencableTags:
  - "ヤママユガ科"
rulings:
  - "\"神の大喰らい\"による上昇値は最大いくつに: \"神の大喰らい\"による上昇値に上限はありません。[リーガルモス（幼虫）]が場にいる限りいくらでも加算されていきます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/29/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 30/64 ヤエヤマツダナナフシ

```yaml
officialNumber: "30/64"
name: "ヤエヤマツダナナフシ"
set: "BOOSTER_SET_5"
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
  - name: "単為生殖"
    effectSummary: "これが場にいるとき、自分の手札にヤエヤマツダナナフシがあるなら、それを場に出して もよい。その虫はこのターン攻撃できない。"
effectSummary: null
taxonomy:
  order: null
  family: "ナナフシ科"
  other: []
referencableTags:
  - "ナナフシ科"
  - "単為生殖"
  - "攻撃制限"
rulings:
  - "＜単為生殖＞の効果は相手のターンでも使用: いいえ、できません。＜単為生殖＞は手札のツダナナフシを、コストを支払わず場に出すことができる効果なので、自分のターンにしか使用することはできません。"
  - "場に出した[ヤエヤマツダナナフシ]Aの＜単為生殖＞によって[ヤエヤマツダナナフシ]Bを場に出しました。[ヤエヤマツダナナフシ]Aの＜単為生殖＞を[カイコ]などによって失わせた時、[: いいえ、[ヤエヤマツダナナフシ]Bは＜単為生殖＞の効果で、このターン攻撃できない状態で場に出るため、[ヤエヤマツダナナフシ]Aの＜単為生殖＞が失われていても攻撃できるようにはなりません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/30/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 31/64 フィジーオオウスバカミキリ

```yaml
officialNumber: "31/64"
name: "フィジーオオウスバカミキリ"
set: "BOOSTER_SET_5"
rarity: "SR"
type: "INSECT"
color: "GREEN"
cost: 5
baseHp: 1200
skills:
  - name: "力のキバ"
    baseAp: 700
    effectSummary: "この技により、相手の虫を破壊したとき、この虫の攻撃力と体力を200増やす。※この効果はこれが場を離れるまで継続する。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "カミキリムシ科"
  other: []
referencableTags:
  - "カミキリムシ科"
  - "破壊時"
rulings:
  - "\"力のキバ\"で攻撃しました。相手の虫に[空蝉の皮鎧]がついていて、虫のかわりに[空蝉の皮鎧]が破壊されたとき、\"力のキバ\"の効果は: いいえ。\"力のキバ\"は虫を破壊した時に効果を発動する技ですが、[空蝉の皮鎧]は虫のかわりに破壊されるカードなので、結果虫は破壊されておらず、\"力のキバ\"は効果を発動しません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/31/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 32/64 サザンフランネルモス（幼虫）

```yaml
officialNumber: "32/64"
name: "サザンフランネルモス（幼虫）"
set: "BOOSTER_SET_5"
rarity: "SR"
type: "INSECT"
color: "GREEN"
cost: 4
baseHp: 900
skills:
  - name: "かじる"
    baseAp: 600
    effectSummary: null
traits:
  - name: "モフモフ"
    effectSummary: "これが場に出たとき、赤か青か緑か無色の色を指定する。自分と相手のエサ場にあるその色と同じ虫をすべて裏返す。"
effectSummary: null
taxonomy:
  order: null
  family: "メガロピギア科"
  other: []
referencableTags:
  - "メガロピギア科"
  - "モフモフ"
  - "裏向き"
  - "エサ操作"
  - "登場時"
rulings:
  - "自分のエサ場にエサが6枚あります。元々の色が全て緑だったところ、[ニジイロクワガタ]を出して、色をすべて青に変えました。 その後、[サザンフランネルモス（幼虫）]を出して、青を指定: はい。青になった自分のエサ場にある虫は全て裏返ります。[ニジイロクワガタ]によってエサ場の色が全て青に変わっているため、エサ場にある虫は全て裏返ります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/32/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 33/64 クサキリ

```yaml
officialNumber: "33/64"
name: "クサキリ"
set: "BOOSTER_SET_5"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 4
baseHp: 800
skills:
  - name: "かみちぎる"
    baseAp: 500
    effectSummary: null
  - name: "草切り"
    baseAp: 900
    effectSummary: "この技を使うとき、自分のエサを１つ選び破壊する。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "キリギリス科"
  other: []
referencableTags:
  - "キリギリス科"
  - "エサ操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/33/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 34/64 サソリカミキリ

```yaml
officialNumber: "34/64"
name: "サソリカミキリ"
set: "BOOSTER_SET_5"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 500
skills:
  - name: "くいちぎる"
    baseAp: 400
    effectSummary: null
traits:
  - name: "毒触角"
    effectSummary: "このカードが相手のカードの効果により、手札から捨て札に置かれたとき、相手は手札を１つ選び捨て札に置く。"
effectSummary: null
taxonomy:
  order: null
  family: "カミキリムシ科"
  other: []
referencableTags:
  - "カミキリムシ科"
  - "毒触角"
  - "捨て札"
  - "手札操作"
rulings:
  - "相手の[サソリカミキリ]の＜毒触角＞により、自分の手札にある[サソリカミキリ]が捨て札に置かれたとき、＜毒触角＞を使うことは: はい。できます。相手のカードの効果により手札から[サソリカミキリ]が捨て札に置かれているので、＜毒触角＞が使う条件を満たし、発動します。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/34/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 35/64 ハネナガイナゴ

```yaml
officialNumber: "35/64"
name: "ハネナガイナゴ"
set: "BOOSTER_SET_5"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 400
skills:
  - name: "はねる"
    baseAp: 100
    effectSummary: null
traits:
  - name: "イナゴの収穫"
    effectSummary: "これが場に出たとき、捨て札にあるコスト０の強化カードを１つ選び、手札に加えてもよい。"
effectSummary: null
taxonomy:
  order: null
  family: "バッタ科"
  other: []
referencableTags:
  - "バッタ科"
  - "イナゴの収穫"
  - "エサ操作"
  - "捨て札"
  - "登場時"
  - "手札操作"
rulings:
  - "強化カードがついた虫が逆立ち返しされ、エサ場のハネナガイナゴ と入れ替えたとき、その虫についていた強化カードは＜イナゴの収穫＞で回収: はい。可能です。その場合、強化カードが破壊後捨て札に置かれてから、ハネナガイナゴが場にでて＜イナゴの収穫＞が発動となります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/35/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 36/64 ツヤハダゴマダラカミキリ

```yaml
officialNumber: "36/64"
name: "ツヤハダゴマダラカミキリ"
set: "BOOSTER_SET_5"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 800
skills:
  - name: "くいちぎる"
    baseAp: 300
    effectSummary: null
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "カミキリムシ科"
  other: []
referencableTags:
  - "カミキリムシ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/36/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 37/64 イシガケチョウ（幼虫）

```yaml
officialNumber: "37/64"
name: "イシガケチョウ（幼虫）"
set: "BOOSTER_SET_5"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 500
skills:
  - name: "かじる"
    baseAp: 400
    effectSummary: null
traits:
  - name: "未熟"
    effectSummary: "相手が術カードを使用したとき、これを破壊する。"
effectSummary: null
taxonomy:
  order: null
  family: "タテハチョウ科"
  other: []
referencableTags:
  - "タテハチョウ科"
  - "未熟"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/37/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 38/64 オオキンカメムシ

```yaml
officialNumber: "38/64"
name: "オオキンカメムシ"
set: "BOOSTER_SET_5"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 200
skills:
  - name: "くいつく"
    baseAp: 300
    effectSummary: null
traits:
  - name: "毒霧防御"
    effectSummary: "これを縄張りから引いたとき、これを表向きで縄張りに置いてもよい。そうしたなら、次に縄張りを引くかわりに、これを捨て札に置く。ターン終了時にこれを捨て札に置く。"
effectSummary: null
taxonomy:
  order: null
  family: "キンカメムシ科"
  other: []
referencableTags:
  - "キンカメムシ科"
  - "毒霧防御"
  - "捨て札"
  - "遅延効果"
  - "縄張り操作"
rulings:
  - "[藪蚊の密約]を使ったとき、縄張りの[オオキンカメムシ]を引きました。このとき＜毒霧防御＞を使う事は: はい。＜とびだす＞の技ではないため、[藪蚊の密約]で引いた[オオキンカメムシ]は＜毒霧防御＞を使う事ができます。その後ターン終了時に捨て札に置かれます。"
  - "縄張りの[オオキンカメムシ]を引いたとき＜毒霧防御＞を使い表向きで縄張りに[オオキンカメムシ]を置きました。 この状態で相手の攻撃によってを縄張りを引くとき、縄張りを引くかオオキン: 選べません。＜毒霧防御＞の効果により、縄張りを引く代わりに表向きで縄張りにある[オオキンカメムシ]を捨て札に置かなければなりません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/38/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 39/64 カラスアゲハ（幼虫）

```yaml
officialNumber: "39/64"
name: "カラスアゲハ（幼虫）"
set: "BOOSTER_SET_5"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 700
skills:
  - name: "かじる"
    baseAp: 200
    effectSummary: null
traits:
  - name: "未熟"
    effectSummary: "相手が術カードを使用したとき、これを破壊する。"
effectSummary: null
taxonomy:
  order: null
  family: "アゲハチョウ科"
  other: []
referencableTags:
  - "アゲハチョウ科"
  - "未熟"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/39/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 40/64 キマワリ

```yaml
officialNumber: "40/64"
name: "キマワリ"
set: "BOOSTER_SET_5"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 200
skills:
  - name: "くいつく"
    baseAp: 300
    effectSummary: null
traits:
  - name: "木回り"
    effectSummary: "これを縄張りから引いたとき、エサ場に置いてもよい。"
effectSummary: null
taxonomy:
  order: null
  family: "ゴミムシダマシ科"
  other: []
referencableTags:
  - "ゴミムシダマシ科"
  - "木回り"
  - "裏向き"
  - "エサ操作"
  - "縄張り操作"
rulings:
  - "プラチナコガネの攻撃で相手が引いた縄張りから「キマワリ」の＜木回り＞を使用するとき 、シロガネタックル効果で相手のエサを裏返すのが先か、その前にキマワリがエサに置かれるのが先か、ど: その場合、キマワリがエサに置かれるのが先になります。シロガネタックルの効果で＜木回り＞の効果でエサ場に置かれたキマワリを裏返すことができます。 激痛針を使用したときに＜とびだす＞が発動した場合と同じ処理順となります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/40/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 41/64 ヒメコガネ

```yaml
officialNumber: "41/64"
name: "ヒメコガネ"
set: "BOOSTER_SET_5"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 1
baseHp: 400
skills:
  - name: "かじりつく"
    baseAp: 200
    effectSummary: null
traits:
  - name: "にげる"
    effectSummary: "他の虫が自分の場に出たとき、これを破壊する。"
effectSummary: null
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
  - "にげる"
  - "登場時"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/41/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 42/64 ノミバッタ

```yaml
officialNumber: "42/64"
name: "ノミバッタ"
set: "BOOSTER_SET_5"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 1
baseHp: 100
skills:
  - name: "はねる"
    baseAp: 200
    effectSummary: null
traits:
  - name: "とびでる"
    effectSummary: "この虫が虫の攻撃により破壊されたとき、引いた縄張りが〜バッタ科、〜イナゴ科ならそれを場に出してもよい。※＜とびだす＞を持つ虫が場にいるとき、＜とびだす＞を持つ虫を引いても場に出せる。"
effectSummary: null
taxonomy:
  order: null
  family: "ノミバッタ科"
  other: []
referencableTags:
  - "ノミバッタ科"
  - "とびでる"
  - "破壊時"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/42/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 43/64 メガボール

```yaml
officialNumber: "43/64"
name: "メガボール"
set: "BOOSTER_SET_5"
rarity: "LR"
type: "INSECT"
color: "COLORLESS"
cost: 6
baseHp: 1200
skills:
  - name: "神の進撃"
    baseAp: 1200
    effectSummary: null
traits:
  - name: "メガ装甲"
    effectSummary: "これは場に出た次のターン、相手の術カードによりダメージを受けず破壊されない。"
effectSummary: null
taxonomy:
  order: null
  family: "アースロファエリダエ科"
  other: []
referencableTags:
  - "アースロファエリダエ科"
  - "メガ装甲"
  - "エサ操作"
  - "ダメージ変更"
  - "縄張り操作"
rulings:
  - "メガボールで攻撃したとき、相手の縄張りから発動した「燻煙の迎撃」の〈迎撃〉のダメージは受けますか: はい。自分のターン中は＜メガ装甲＞効果がないため＜迎撃＞のダメージを受けます。"
  - "相手の[メガボール]に[怨霊の虫送り]を使い、相手の[メガボール]と相手のエサ場の虫を入れかえることは: はい。できます。 ＜メガ装甲＞の効果は、相手の術カードによるダメージと破壊を受けない効果です。それ以外の効果はうけます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/43/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 44/64 ヘラクレスサン

```yaml
officialNumber: "44/64"
name: "ヘラクレスサン"
set: "BOOSTER_SET_5"
rarity: "SR"
type: "INSECT"
color: "COLORLESS"
cost: 6
baseHp: 1000
skills:
  - name: "はばたく"
    baseAp: 1100
    effectSummary: null
traits:
  - name: "伝承羽化"
    effectSummary: "これがカード名に羽化と書かれたカードの効果により場に出たとき、この虫の体力と攻撃力を500増やす。"
effectSummary: null
taxonomy:
  order: null
  family: "ヤママユガ科"
  other: []
referencableTags:
  - "ヤママユガ科"
  - "伝承羽化"
  - "登場時"
  - "ダメージ変更"
rulings:
  - "＜伝承羽化＞により、体力と攻撃力が増えた後に、＜くちなし＞などの効果で＜伝承羽化＞を失った場合、増えた修正値はなく: いいえ。なくなりません。＜伝承羽化＞で与えられた修正値は、与えられた効果となり、技を失っても修正値は消えません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/44/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 45/64 ゲンジボタル

```yaml
officialNumber: "45/64"
name: "ゲンジボタル"
set: "BOOSTER_SET_5"
rarity: "SR"
type: "INSECT"
color: "COLORLESS"
cost: 2
baseHp: 400
skills:
  - name: "発光"
    baseAp: 200
    effectSummary: "この技により相手が縄張りを引いたとき、自分のエサを１つ選び表向きにしてもよい。※この効果は、裏向きのエサを選べる。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "ホタル科"
  other: []
referencableTags:
  - "ホタル科"
  - "裏向き"
  - "エサ操作"
  - "縄張り操作"
rulings:
  - "\"発光\"の効果で選ぶエサは表向きのエサも選べますか？: いいえ。できません。 既に表向きのエサを表向きにすることはできないため、選べません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/45/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 46/64 禁域の注連縄

```yaml
officialNumber: "46/64"
name: "禁域の注連縄"
set: "BOOSTER_SET_5"
rarity: "N"
type: "ENHANCEMENT"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "この虫の体力と攻撃力を100増やす。これがついた虫が場にいるとき、相手の虫が術カードの効果により場に出たなら、その虫は場に出たターン攻撃できない。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "攻撃制限"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/46/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 47/64 武勇の面頬

```yaml
officialNumber: "47/64"
name: "武勇の面頬"
set: "BOOSTER_SET_5"
rarity: "N"
type: "ENHANCEMENT"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectSummary: "この虫は＜＞の技を失う。この虫の体力と攻撃力を300増やす。＜装着＞これを縄張りから引いたとき、自分の場に虫がいるなら、これをつけてもよい。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "ダメージ変更"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/47/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 48/64 蛮虫の一本槍

```yaml
officialNumber: "48/64"
name: "蛮虫の一本槍"
set: "BOOSTER_SET_5"
rarity: "R"
type: "ENHANCEMENT"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectSummary: "これは技の効果を持たない虫にしかつけられない。この虫の体力と攻撃力を400増やす。これがついた虫が虫の攻撃により破壊されたとき、これを手札に戻してもよい。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "捨て札"
  - "破壊時"
  - "ダメージ変更"
  - "手札操作"
  - "縄張り操作"
rulings:
  - "[トノサマバッタ]に[蟲神の一本槍]がついているとき、[飛蝗の待ち伏せ]を使いました。 効果によって、[トノサマバッタ]が効果をもつ＜とびだす＞を持った場合、ついている[蟲神の一本: 「これは技の効果を持たない虫にしかつけられない。」の条件をみたせなくなり、＜とびだす＞を持った[トノサマバッタ]についていた[蟲神の一本槍]は破壊されます。 「にしかつけられない。」の効果を持つ強化カードは、つけた後にその条件を満たせなくなった場合破壊されます。"
  - "[蟲神の一本槍]をもった虫が[サシハリアリ]の\"激痛針\"で破壊されました。[蟲神の一本槍]を捨てることは: できます。\"激痛針\"は縄張りを引いたときに効果を発揮する技です。仮に手札が1枚もないとき、破壊されたことで[蟲神の一本槍]は手札に戻り、その後縄張りを引きます。ここで\"激痛針\"が効果を発揮するため、捨てる対象は引いた縄張りか[蟲神の一本槍]のどちらかとなります。"
  - "＜＞の技を持つ虫につけることは: いいえ。つけられません。＜＞の技はすべて効果があるため、「技の効果を持たない虫」ではなく、＜＞を持つ虫につけることはできません。"
  - "[カイコ]や[武勇の面頬]などの効果で＜＞の技を失っている虫が場にいるとき、その虫に蟲神の一本槍をつけることは: はい、つけられます。＜＞の技を失ったあと、持っている＜＞でない技に効果が無い場合、つけることができます。"
  - "[カイコ]の効果で＜＞の技を失っている虫に蟲神の一本槍をつけました。その後[カイコ]が破壊された場合、蟲神の一本槍は: 蟲神の一本槍は破壊され、捨て札になります。強化カードは正しい対象につけられていない場合、破壊されて捨て札になります。虫の攻撃で破壊されていないため、手札には戻りません。"
  - "虫Aにつけた一本槍をの修正値を贋作でコピーして、贋作を虫Bにつけたたとき、虫Aが破壊されて一本槍が手札に戻ると、一本槍破壊されていないため、贋作はそのまま残りますか？: はい。その場合、贋作は破壊されず場に残ります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/48/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 49/64 蟲神の一本槍

```yaml
officialNumber: "49/64"
name: "蟲神の一本槍"
set: "BOOSTER_SET_5"
rarity: "SR"
type: "ENHANCEMENT"
color: null
cost: 2
baseHp: null
skills: []
traits: []
effectSummary: "これは技の効果を持たない虫にしかつけられない。この虫の体力と攻撃力を800増やす。これがついた虫が虫の攻撃により破壊されたとき、これを手札に戻してもよい。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "捨て札"
  - "破壊時"
  - "ダメージ変更"
  - "手札操作"
  - "縄張り操作"
rulings:
  - "[トノサマバッタ]に[蟲神の一本槍]がついているとき、[飛蝗の待ち伏せ]を使いました。 効果によって、[トノサマバッタ]が効果をもつ＜とびだす＞を持った場合、ついている[蟲神の一本: 「これは技の効果を持たない虫にしかつけられない。」の条件をみたせなくなり、＜とびだす＞を持った[トノサマバッタ]についていた[蟲神の一本槍]は破壊されます。 「にしかつけられない。」の効果を持つ強化カードは、つけた後にその条件を満たせなくなった場合破壊されます。"
  - "[蟲神の一本槍]をもった虫が[サシハリアリ]の\"激痛針\"で破壊されました。[蟲神の一本槍]を捨てることは: できます。\"激痛針\"は縄張りを引いたときに効果を発揮する技です。仮に手札が1枚もないとき、破壊されたことで[蟲神の一本槍]は手札に戻り、その後縄張りを引きます。ここで\"激痛針\"が効果を発揮するため、捨てる対象は引いた縄張りか[蟲神の一本槍]のどちらかとなります。"
  - "＜＞の技を持つ虫につけることは: いいえ。つけられません。＜＞の技はすべて効果があるため、「技の効果を持たない虫」ではなく、＜＞を持つ虫につけることはできません。"
  - "[カイコ]や[武勇の面頬]などの効果で＜＞の技を失っている虫が場にいるとき、その虫に蟲神の一本槍をつけることは: はい、つけられます。＜＞の技を失ったあと、持っている＜＞でない技に効果が無い場合、つけることができます。"
  - "[カイコ]の効果で＜＞の技を失っている虫に蟲神の一本槍をつけました。その後[カイコ]が破壊された場合、蟲神の一本槍は: 蟲神の一本槍は破壊され、捨て札になります。強化カードは正しい対象につけられていない場合、破壊されて捨て札になります。虫の攻撃で破壊されていないため、手札には戻りません。"
  - "虫Aにつけた一本槍をの修正値を贋作でコピーして、贋作を虫Bにつけたたとき、虫Aが破壊されて一本槍が手札に戻ると、一本槍破壊されていないため、贋作はそのまま残りますか？: はい。その場合、贋作は破壊されず場に残ります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/49/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 50/64 草薙の紅剣

```yaml
officialNumber: "50/64"
name: "草薙の紅剣"
set: "BOOSTER_SET_5"
rarity: "SR"
type: "ENHANCEMENT"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectSummary: "これは赤の虫にしかつけられない。この虫は攻撃したとき、もう１度だけ攻撃できる。この虫の攻撃により、相手は縄張りを引かない。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "裏向き"
  - "捨て札"
  - "ダメージ変更"
  - "縄張り操作"
rulings:
  - "〇色の虫にしかつけられない強化カードは、色を変えた虫につけることは可能ですか？また、色が元に戻る、相手によって変えられるなど、つけている状態で色が変わったら: はい、色を変えた結果、条件を満たすことができるなら付けることができます。また、つけている状態で色が変わった場合、破壊されて捨て札になります。強化カードは正しい対象につけられていない場合、破壊されて捨て札になります。"
  - "攻撃済みの虫に[草薙の紅剣]をつけました。その虫はもう一度攻撃: いいえ、できません。[草薙の紅剣]はつけている状態で攻撃しなければ効果を発動しないため、攻撃前につけておく必要があります。"
  - "[草薙の紅剣]をつけた虫で攻撃しました。もう一度攻撃する前に他の虫で攻撃し、その後[草薙の紅剣]をつけた虫で攻撃: いいえ、できません。[草薙の紅剣]の「もう1度だけ攻撃できる」効果は攻撃後すぐに使用するか選ぶため、他の行動はできません。"
  - "[草薙の紅剣]を赤の虫に2枚つけて攻撃した場合、その虫は[草薙の紅剣]の効果２つによって追加で2回攻撃: いいえ。できません。どちらかの[草薙の紅剣]による効果でもう1度だけ攻撃できます。"
  - "[草薙の紅剣]をつけた[オオカマキリ]で\"カマ連撃\"を使った場合、何回攻撃: 2回攻撃になります。 ①カマ連撃 → カマ連撃 ②カマ連撃 → 共食い ③共食い → カマ連撃 いずれかの順番の連続攻撃になります。 複数の「もう1度だけ攻撃できる。」「もう1度だけ使用できる。」効果が発揮している場合、そのうちの1つを選ぶと他の「もう1度だけ攻撃できる。」「もう1度だけ使用できる。」の効果は不発となります。 また、「もう1度だけ攻撃できる。」「もう1度だけ使用できる。」の効果による連続攻撃中は「もう1度だけ攻撃できる。"
  - "[草薙の紅剣]をつけた虫で2回攻撃した後、[蟷螂の構え]を使うことは: はい。可能です。その場合[蟷螂の構え]による攻撃は、[草薙の紅剣]による「もう1度だけ攻撃できる。」の効果も発動します。"
  - "[テナガカミキリ]の色を赤に変え、[草薙の紅剣]をつけました。\"テナガ攻撃\"を使用した時、ダメージは最大何回与えられますか？: 最大4回与えられます。\"テナガ攻撃\"によって相手の虫を2体選び、攻撃をしたあと、[草薙の紅剣]の効果が発動しもう一度だけ攻撃できるようになります。その後相手の虫を2体選べるのであれば\"テナガ攻撃\"で2回、選べないのであれば\"キバ無双\"で1回ダメージを与えることができます。"
  - "[ヨコヅナサシガメ]に[草薙の紅剣]をつけました。相手の縄張りに直接攻撃をしたとき、[ヨコヅナサシガメ]の体力と攻撃力は上昇しますか？: いいえ、しません。[草薙の紅剣]により[ヨコヅナサシガメ]の攻撃では縄張りを引かないため、「縄張りを引いたとき」に発動する効果は発動しません。"
  - "草薙の紅剣のついたジグモの「かくれる」で虫を攻撃後、裏返ったままもう一度攻撃: いいえ。できません。裏返った虫は表になるまで攻撃できません。"
  - "[草薙の紅剣]をつけた[オオカレエダカマキリ]で、\"ドラゴン蟷螂拳\"を使い攻撃しました。 [草薙の紅剣]の効果で、[オオカレエダカマキリ]に「もう1度だけ攻撃できる。」効果が与えら: いいえ、[草薙の紅剣]が与えた効果でもう1度だけ攻撃することはできません。 強化カードがつけている虫に与えた効果は、破壊やつけかえる効果などにより、効果を与えている強化カードがつけている虫から離れた場合なくなります。 そのため[オオカレエダカマキリ]は、[閻魔虫の斬砕剣]の効果でのみ攻撃が可能になります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/50/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 51/64 肉祓いの蒼玉

```yaml
officialNumber: "51/64"
name: "肉祓いの蒼玉"
set: "BOOSTER_SET_5"
rarity: "SR"
type: "ENHANCEMENT"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectSummary: "これは青の虫にしかつけられない。毎ターン、この虫が１度目に受けたダメージを０にする。※術によるダメージを含み、技の効果は無効にしない。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "捨て札"
  - "ダメージ変更"
rulings:
  - "〇色の虫にしかつけられない強化カードは、色を変えた虫につけることは可能ですか？また、色が元に戻る、相手によって変えられるなど、つけている状態で色が変わったら: はい、色を変えた結果、条件を満たすことができるなら付けることができます。また、つけている状態で色が変わった場合、破壊されて捨て札になります。強化カードは正しい対象につけられていない場合、破壊されて捨て札になります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/51/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 52/64 蜜絶の翠鏡

```yaml
officialNumber: "52/64"
name: "蜜絶の翠鏡"
set: "BOOSTER_SET_5"
rarity: "SR"
type: "ENHANCEMENT"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectSummary: "これは緑の虫にしかつけられない。自分のエサが５つ以下のとき、この虫の攻撃力と体力を400増やす。自分のエサが６つ以上あるとき、この虫の攻撃力と体力を800増やす。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "エサ操作"
  - "捨て札"
rulings:
  - "〇色の虫にしかつけられない強化カードは、色を変えた虫につけることは可能ですか？また、色が元に戻る、相手によって変えられるなど、つけている状態で色が変わったら: はい、色を変えた結果、条件を満たすことができるなら付けることができます。また、つけている状態で色が変わった場合、破壊されて捨て札になります。強化カードは正しい対象につけられていない場合、破壊されて捨て札になります。"
  - "[密絶の翠鏡]を自分の虫につけました。自分のエサ場が6つの時、5つ以下の時の効果と合算しますか？: いいえ、しません。[密絶の翠鏡]は5つ以下の時に400、6つ以上の時に800増やす効果なので、どちらか一方しか発動しません。"
  - "エサが5つの状態で、[蠱術の贋作]を[マメコガネ]につけるとき、[蜜絶の翠鏡](攻撃力と体力を400増やす。)を選びました。 その後、[蟲の息吹]でエサを6つにして[蜜絶の翠鏡]の: 「攻撃力と体力を400増やす。」になります。[蠱術の贋作]をつける時に選んだ時点の強化カードがもつ修正値をつけた虫に与えます。 [蠱術の贋作]をつけたあと、選んだ強化カードの修正値が変化しても[蠱術の贋作]が効果で与える修正値には影響はありません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/52/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 53/64 雀蜂の鬼鎧

```yaml
officialNumber: "53/64"
name: "雀蜂の鬼鎧"
set: "BOOSTER_SET_5"
rarity: "R"
type: "ENHANCEMENT"
color: null
cost: 2
baseHp: null
skills: []
traits: []
effectSummary: "これは〜バチ科の虫にしかつけられない。この虫の攻撃力と体力を800増やす。＜装着＞これを縄張りから引いたとき、自分の場に虫がいるなら、これをつけてもよい。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/53/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 54/64 黒銀蜘蛛の糸

```yaml
officialNumber: "54/64"
name: "黒銀蜘蛛の糸"
set: "BOOSTER_SET_5"
rarity: "SR"
type: "ENHANCEMENT"
color: null
cost: 5
baseHp: null
skills: []
traits: []
effectSummary: "自分の捨て札にある虫を１つ選び、これをつけて場に出す。この効果により場に出た虫は＜＞の技を失う。＜特殊装着＞これを縄張りから引いたとき、これを使用してもよい。そうしたなら、これがついた虫をターン終了時に破壊する。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "捨て札"
  - "遅延効果"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/54/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 55/64 幼虫の胡坐鍋

```yaml
officialNumber: "55/64"
name: "幼虫の胡坐鍋"
set: "BOOSTER_SET_5"
rarity: "N"
type: "ENHANCEMENT"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "これは（幼虫）と書かれた虫にしかつけられない。この虫の攻撃力と体力を400増やす。これがついた虫が虫の攻撃により破壊されたとき、これを手札に戻してもよい。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "破壊時"
  - "手札操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/55/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 56/64 花蝶の幻舞

```yaml
officialNumber: "56/64"
name: "花蝶の幻舞"
set: "BOOSTER_SET_5"
rarity: "SR"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "自分のエサ場に（幼虫）と書かれた虫がいるなら、次に使うそれと同名の（幼虫）と書かれていない虫のコストをターン終了時まで３下げる。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "エサ操作"
  - "遅延効果"
rulings:
  - "[花蝶の幻舞]を2枚使い、コストを6下げる事は: はい、できます。[花蝶の幻舞]はターン終了時まで、条件を満たした、次に使う虫のコストを下げる効果をもつため、条件を満たした虫を使うまで効果は持続、重複します。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/56/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 57/64 腐葉の沃土

```yaml
officialNumber: "57/64"
name: "腐葉の沃土"
set: "BOOSTER_SET_5"
rarity: "R"
type: "SPELL"
color: null
cost: 4
baseHp: null
skills: []
traits: []
effectSummary: "捨て札からカードを２つ選び、裏向きでエサ場に置く。※このエサのコストはこのターン発生しない。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "裏向き"
  - "エサ操作"
  - "捨て札"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/57/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 58/64 燻煙の迎撃

```yaml
officialNumber: "58/64"
name: "燻煙の迎撃"
set: "BOOSTER_SET_5"
rarity: "N"
type: "SPELL"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectSummary: "相手の虫を１つ選び、400のダメージを与える。＜迎撃＞これを縄張りから引いたとき、この縄張りを引かせた虫に、この効果を使用してもよい。そうしたなら、これを捨て札に置く。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "捨て札"
  - "ダメージ変更"
  - "縄張り操作"
rulings:
  - "相手が縄張りを引き＜迎撃＞の効果で[燻煙の迎撃]を使用したとき、 自分の場にいる＜未熟＞を持つ[イシガケチョウ(幼虫)]は＜未熟＞の効果を発揮して破壊されますか？: はい。破壊されます。＜迎撃＞の効果により術カードが使用されるため、＜未熟＞の効果が発動し破壊されます。"
  - "メガボールで攻撃したとき、相手の縄張りから発動した「燻煙の迎撃」の〈迎撃〉のダメージは受けますか: はい。自分のターン中は＜メガ装甲＞効果がないため＜迎撃＞のダメージを受けます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/58/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 59/64 稲妻の迎撃

```yaml
officialNumber: "59/64"
name: "稲妻の迎撃"
set: "BOOSTER_SET_5"
rarity: "R"
type: "SPELL"
color: null
cost: 2
baseHp: null
skills: []
traits: []
effectSummary: "相手の虫を１つ選び、800のダメージを与える。＜迎撃＞これを縄張りから引いたとき、この縄張りを引かせた虫に、この効果を使用してもよい。そうしたなら、これを捨て札に置く。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "捨て札"
  - "ダメージ変更"
  - "縄張り操作"
rulings:
  - "自分のターンに受けた稲妻の迎撃や蠱毒の祟りのダメージは、アレクサンドラトリバネアゲハの＜不死蝶の舞＞の効果で0にすることは: はい。アレクサンドラトリバネアゲハの＜不死蝶の舞＞は自分のターンに受けた迎撃や蠱毒の祟りのダメージも0にします。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/59/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 60/64 毒の追い打ち

```yaml
officialNumber: "60/64"
name: "毒の追い打ち"
set: "BOOSTER_SET_5"
rarity: "N"
type: "SPELL"
color: null
cost: 2
baseHp: null
skills: []
traits: []
effectSummary: "毒とつく技を持つ、攻撃済みの虫を１つ選ぶ。その虫はもう１度攻撃できる。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags: []
rulings:
  - "＜毒霧噴射＞など、＜＞の技に「毒とつく」虫に[毒の追い打ち]を使うことは: はい。できます。＜＞の技も技として扱います。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/60/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 61/64 蠱毒の祟り

```yaml
officialNumber: "61/64"
name: "蠱毒の祟り"
set: "BOOSTER_SET_5"
rarity: "N"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "回復しないダメージを受けている相手の虫を１つ選ぶ。その虫の回復しないダメージと同数のダメージを、自分と相手のすべての虫に与え、このターンを終了する。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "ダメージ変更"
rulings:
  - "自分のターンに受けた稲妻の迎撃や蠱毒の祟りのダメージは、アレクサンドラトリバネアゲハの＜不死蝶の舞＞の効果で0にすることは: はい。アレクサンドラトリバネアゲハの＜不死蝶の舞＞は自分のターンに受けた迎撃や蠱毒の祟りのダメージも0にします。"
  - "500の回復しないダメージを2回受けた、体力1800の虫に[蠱毒の祟り]を使った場合1000ダメージを、自分と相手のすべての虫に与えますか？: はい。1000ダメージを自分と相手のすべての虫に与えます。 回復しないダメージは合計されます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/61/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 62/64 甲冑の鍛冶

```yaml
officialNumber: "62/64"
name: "甲冑の鍛冶"
set: "BOOSTER_SET_5"
rarity: "R"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "自分の捨て札にある甲冑または贋作と書かれた強化カードを最大２つ選び手札に戻す。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "捨て札"
  - "手札操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/62/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 63/64 鉦叩の歌念仏

```yaml
officialNumber: "63/64"
name: "鉦叩の歌念仏"
set: "BOOSTER_SET_5"
rarity: "N"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "自分の強化カードを１つ破壊し、これを自分のエサ場に置く。※このエサのコストはこのターン発生しない。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "エサ操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/63/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 64/64 閻魔虫の斬砕剣

```yaml
officialNumber: "64/64"
name: "閻魔虫の斬砕剣"
set: "BOOSTER_SET_5"
rarity: "LR"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "強化カードがついている攻撃済みの虫を１つ選び、その虫の強化カードを１つ破壊する。その虫はもう１度攻撃できる。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags: []
rulings:
  - "攻撃をまだ行っていない自分の虫に[閻魔虫の斬砕剣]を使い、ついている強化カードだけを破壊することは: いいえ。できません。「攻撃済みの虫」でないため、[閻魔虫の斬砕剣]で選ぶことができません。"
  - "攻撃の済みの虫に、強化カードをつけてから、閻魔虫の斬砕剣は使用: はい。閻魔虫の斬砕剣は攻撃後の強化カードがついていない虫に、強化カードをつけた場合も使用可能です。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI5/64/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 分類インデックス

- `アカムカデ科`: セスジアカムカデ
- `アゲハチョウ科`: カラスアゲハ, カラスアゲハ（幼虫）
- `アシナガグモ科`: アシナガグモ
- `アリ科`: ジバクアリ
- `アースロファエリダエ科`: メガボール
- `オオムカデ科`: アオズムカデ
- `オサムシ科`: トウキョウヒメハンミョウ
- `カマキリ科`: マエモンカマキリ
- `カミキリムシ科`: フィジーオオウスバカミキリ, サソリカミキリ, ツヤハダゴマダラカミキリ
- `キリギリス科`: ジャイアントテキサスキリギリス, クサキリ
- `キンカメムシ科`: オオキンカメムシ
- `クワガタムシ科`: ヨーロッパミヤマクワガタ, タランドゥス オオツヤクワガタ, ヒメオオクワガタ, プリモスマルガタクワガタ, チビクワガタ
- `コガネグモ科`: ムツトゲイセキグモ
- `コガネサソリ科`: レッドクロウエンペラースコーピオン
- `コガネムシ科`: レギウスオオツノハナムグリ, オオテナガカナブン, ヒメコガネ
- `コロギス科`: ヒノマルコロギス
- `ゴミムシダマシ科`: キマワリ
- `スズメバチ科`: モンスズメバチ, クロスズメバチ
- `セミ科`: クロテイオウゼミ, ニイニイゼミ
- `タテハチョウ科`: イシガケチョウ（幼虫）
- `ツノゼミ科`: ヨツコブツノゼミ
- `テントウムシ科`: カメノコテントウ
- `ナナフシ科`: ヤエヤマツダナナフシ
- `ノミバッタ科`: ノミバッタ
- `バッタ科`: ハネナガイナゴ
- `ホタル科`: ゲンジボタル
- `ミツバチ科`: セイヨウオオマルハナバチ
- `メガロピギア科`: サザンフランネルモス（幼虫）
- `ヤガ科`: ベニシタバ, キシタバ
- `ヤマトンボ科`: オオヤマトンボ
- `ヤママユガ科`: リーガルモス（幼虫）, ヘラクレスサン

## 特性インデックス

- `＜とびでる＞`: ノミバッタ
- `＜にげる＞`: モンスズメバチ, トウキョウヒメハンミョウ, ヒメオオクワガタ, チビクワガタ, ヒメコガネ
- `＜イナゴの収穫＞`: ハネナガイナゴ
- `＜トンボ返り＞`: オオヤマトンボ
- `＜メガ装甲＞`: メガボール
- `＜モフモフ＞`: サザンフランネルモス（幼虫）
- `＜伝承羽化＞`: ヘラクレスサン
- `＜供物＞`: マエモンカマキリ
- `＜単為生殖＞`: ヤエヤマツダナナフシ
- `＜地蜂の巣＞`: クロスズメバチ
- `＜強化甲殼＞`: ヨーロッパミヤマクワガタ
- `＜捕食＞`: アシナガグモ
- `＜木回り＞`: キマワリ
- `＜未熟＞`: イシガケチョウ（幼虫）, カラスアゲハ（幼虫）
- `＜毒触角＞`: サソリカミキリ
- `＜毒霧防御＞`: オオキンカメムシ
- `＜漆塗り＞`: タランドゥス オオツヤクワガタ
- `＜王様＞`: レギウスオオツノハナムグリ
- `＜紅翅＞`: ベニシタバ
- `＜自爆粘液＞`: ジバクアリ
- `＜襲来＞`: セスジアカムカデ
- `＜青頭＞`: アオズムカデ
- `＜魔よけの鈴＞`: ヨツコブツノゼミ
- `＜鴉塗り＞`: カラスアゲハ
- `＜黄翅＞`: キシタバ

## BLOCKED一覧

- なし
