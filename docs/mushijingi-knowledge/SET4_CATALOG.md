# 蟲神器 第4弾カード図鑑

> Version: v1.0 KNOWLEDGE-BASE
> 対象: ブースターパック第4弾 64種
> 用途: ゲームUI・ルールエンジンが参照する実装用知識ベース

## 0. 運用原則

- カード表面情報と生物分類は非公式DBを探索補助として構造化し、裁定は公式Q&Aを優先する。
- `＜○○＞` は `traits` として通常技から分離する。
- 不明点や解析不能項目は推測せず `blocked` に残す。
- 効果・裁定はゲーム実装に必要な意味へ短く整理し、ページ全体を転載しない。

## 1. 共通ソースと検証状態

- 公式Q&A: https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/
- カード探索補助（非公式）: https://mushijingi.com/
- Raw取得時刻: 2026-08-30T17:19:55.6042818Z
- 基本値・分類: `VERIFIED_SECONDARY`（公式現物との全件画像突合は未実施）
- 裁定: `OFFICIAL_QA_SUMMARY`（一致カードのみ）

## 2. 収録検査

- Expected / actual: 64 / 64
- Card-number coverage: PASS
- Card-number duplicate check: PASS
- Type total check: PASS
- 虫 / 強化 / 術: 45 / 9 / 10
- BLOCKED: 0

---

## 1/64 テイオウムカシヤンマ

```yaml
officialNumber: "1/64"
name: "テイオウムカシヤンマ"
set: "BOOSTER_SET_4"
rarity: "LR"
type: "INSECT"
color: "RED"
cost: 6
baseHp: 1500
skills:
  - name: "神の襲撃"
    baseAp: 1100
    effectSummary: null
traits:
  - name: "生きた化石"
    effectSummary: "自分の捨て札にある＜生きた化石＞を持つ虫１つごとに、これのコストを１減らす。"
effectSummary: null
taxonomy:
  order: null
  family: "ムカシヤンマ科"
  other: []
referencableTags:
  - "ムカシヤンマ科"
  - "生きた化石"
  - "捨て札"
rulings:
  - "＜生きた化石＞の効果により手札にある6コストの[テイオウムカシヤンマ]を5コストで出すことができるとき、[繚乱の足掻き]を使用して、効果で場のコスト5の虫と交換することが: いいえ。できません。 [繚乱の足掻き]など、コストを参照するカードや効果は、特別記載がない限りカードに書かれている元のコストを参照します。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/1/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 2/64 コバルトブルータランチュラ

```yaml
officialNumber: "2/64"
name: "コバルトブルータランチュラ"
set: "BOOSTER_SET_4"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 5
baseHp: 1300
skills:
  - name: "かむ"
    baseAp: 600
    effectSummary: null
  - name: "神経毒"
    baseAp: 200
    effectSummary: "この技は１度だけ使用できる。この技により相手が縄張りを引いたとき、相手は手札を１枚選び捨て札に置く。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "オオツチグモ科"
  other: []
referencableTags:
  - "オオツチグモ科"
  - "捨て札"
  - "手札操作"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/2/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 3/64 ムカシヤンマ

```yaml
officialNumber: "3/64"
name: "ムカシヤンマ"
set: "BOOSTER_SET_4"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 4
baseHp: 600
skills:
  - name: "とびかかる"
    baseAp: 600
    effectSummary: null
traits:
  - name: "生きた化石"
    effectSummary: "自分の捨て札にある＜生きた化石＞を持つ虫１つごとに、これのコストを１減らす。"
effectSummary: null
taxonomy:
  order: null
  family: "ムカシヤンマ科"
  other: []
referencableTags:
  - "ムカシヤンマ科"
  - "生きた化石"
  - "捨て札"
rulings:
  - "＜生きた化石＞の効果により手札にある6コストの[テイオウムカシヤンマ]を5コストで出すことができるとき、[繚乱の足掻き]を使用して、効果で場のコスト5の虫と交換することが: いいえ。できません。 [繚乱の足掻き]など、コストを参照するカードや効果は、特別記載がない限りカードに書かれている元のコストを参照します。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/3/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 4/64 バイオリンムシ

```yaml
officialNumber: "4/64"
name: "バイオリンムシ"
set: "BOOSTER_SET_4"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 5
baseHp: 1500
skills:
  - name: "かみちぎる"
    baseAp: 500
    effectSummary: null
traits:
  - name: "かばう"
    effectSummary: "これを縄張りから引いたとき、場に出してもよい。そうしたなら、相手はこれ以外の虫を攻撃できない。ターン終了時にこれを手札に戻す。 ※この技を持つ虫が複数いるとき、相手はどれかを選んで攻撃する。"
effectSummary: null
taxonomy:
  order: null
  family: "オサムシ科"
  other: []
referencableTags:
  - "オサムシ科"
  - "かばう"
  - "攻撃制限"
  - "遅延効果"
  - "手札操作"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/4/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 5/64 コロギス

```yaml
officialNumber: "5/64"
name: "コロギス"
set: "BOOSTER_SET_4"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 3
baseHp: 700
skills:
  - name: "かみちぎる"
    baseAp: 300
    effectSummary: null
traits:
  - name: "危険察知"
    effectSummary: "自分と相手の虫は、「場に出たとき」と書かれた<>の技を使用できない。"
effectSummary: null
taxonomy:
  order: null
  family: "コロギス科"
  other: []
referencableTags:
  - "コロギス科"
  - "危険察知"
  - "登場時"
  - "攻撃制限"
rulings:
  - "自分の場に[コロギス]がいるとき、相手が＜擬態＞の技を持つ虫を場に出し、ターンを終了しました。 この場合、[コロギス]の＜危険察知＞によって相手の虫が＜擬態＞の技を使用できず、次の: いいえ。攻撃できません。 ＜擬態＞は、場に出た次のターンのタイミングで使用されるため、＜危険察知＞の影響をうけず使用することができます。"
  - "相手の場に[コロギス]がいるとき、自分の場に＜金色甲殻＞の技を持つ[キンオニクワガタ]を出しました。 その後、[キンオニクワガタ]に強化カードを付けるとき、＜金色甲殻＞の技を使用し: い。1減らすことができます。＜危険察知＞は場に出たときに使用したり、使用される＜＞の技が使用できなくなる効果のため、 ＜金色甲殻＞のような、場にいるときに使用される技は影響を受けません。"
  - "[ニジイロクワガタ]を場に出した後、[コロギス]を場に出しました。[ニジイロクワガタ]の技の効果はなく: いいえ。先に発動し、処理が終わった効果をさかのぼって無効にすることはありません。"
  - "[瀬戸際の虫時雨]で[コロギス]と[ミツツボアリ]を自分の場に出しました。 この場合、[コロギス]の＜危険察知＞と[ミツツボアリ]の＜蜜をためる＞の効果はどう処理すればいいですか？: [瀬戸際の虫時雨]の効果で2体の虫を場に出す場合、出す順番を選び、それぞれの虫を場に出します。 [コロギス]を1番目、[ミツツボアリ]を2番目に選んだ場合は先に出た[コロギス]の＜危険察知＞により、＜蜜をためる＞は使用できなくなります。 逆に[ミツツボアリ]を1番目に選んだ場合は、[コロギス]より先に場に出るため、＜蜜をためる＞の使用に影響はありません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/5/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 6/64 バーチェルグンタイアリ メジャー

```yaml
officialNumber: "6/64"
name: "バーチェルグンタイアリ メジャー"
set: "BOOSTER_SET_4"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 300
skills:
  - name: "蟻の蹂躙"
    baseAp: "X"
    effectSummary: "自分の場にいるアリ科の虫の数×200のダメージを与える。"
traits:
  - name: "軍隊連携"
    effectSummary: "この虫は自分の場にいる＜軍隊連携＞を持つ虫の技を使用できる。"
effectSummary: null
taxonomy:
  order: null
  family: "アリ科"
  other: []
referencableTags:
  - "アリ科"
  - "軍隊連携"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/6/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 7/64 タンザニアバンデットウデムシ

```yaml
officialNumber: "7/64"
name: "タンザニアバンデットウデムシ"
set: "BOOSTER_SET_4"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 3
baseHp: 500
skills:
  - name: "きりきざむ"
    baseAp: 400
    effectSummary: null
  - name: "盗賊の大腕"
    baseAp: 300
    effectSummary: "この技は１度だけ使用できる。この技を使うとき、相手の手札からカードを１枚見ないで選ぶ。それが虫なら相手の場に出す。それが術か強化ならエサ場に置く。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "ウデムシ科"
  other: []
referencableTags:
  - "ウデムシ科"
  - "エサ操作"
  - "捨て札"
  - "ダメージ変更"
rulings:
  - "自分の[タンザニアバンデットウデムシ]の\"盗賊の大腕\"で攻撃をしたとき、術カードが選ばれました。これが置かれるエサ場を選ぶことは: いいえ。できません。 エサ場や手札、デッキや捨て札には、相手のカードを含めることはできません。その術カードは\"盗賊の大腕\"を受けた相手のエサ場に置かれます。"
  - "相手の手札が0枚のとき、自分の[タンザニアバンデットウデムシ]の\"盗賊の大腕\"で攻撃をすることは: いいえ。できません。 相手の手札がない場合、\"盗賊の大腕\"を使用して攻撃することはできません。"
  - "\"盗賊の大腕\"で[マメコガネ]を攻撃したとき、相手の手札から場に[ナミアゲハ]が出ました。ダメージはどの虫が受けますか？: [マメコガネ]がダメージを受けます。\"盗賊の大腕\"を使用する段階で攻撃対象を選択しているため、＜りんぷん＞などをもつ虫が場に出ても攻撃対象を変更することはありません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/7/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 8/64 バーチェルグンタイアリ メディア

```yaml
officialNumber: "8/64"
name: "バーチェルグンタイアリ メディア"
set: "BOOSTER_SET_4"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 1
baseHp: 100
skills:
  - name: "毒針"
    baseAp: 200
    effectSummary: "攻撃後、ターン終了時まで攻撃した虫の色を緑にする。"
traits:
  - name: "軍隊連携"
    effectSummary: "この虫は自分の場にいる＜軍隊連携＞を持つ虫の技を使用できる。"
effectSummary: null
taxonomy:
  order: null
  family: "アリ科"
  other: []
referencableTags:
  - "アリ科"
  - "軍隊連携"
  - "遅延効果"
  - "色変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/8/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 9/64 チョウトンボ

```yaml
officialNumber: "9/64"
name: "チョウトンボ"
set: "BOOSTER_SET_4"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 600
skills:
  - name: "とびかかる"
    baseAp: 100
    effectSummary: null
traits:
  - name: "かばう"
    effectSummary: "これを縄張りから引いたとき、場に出してもよい。そうしたなら、相手はこれ以外の虫を攻撃できない。ターン終了時にこれを手札に戻す。 ※この技を持つ虫が複数いるとき、相手はどれかを選んで攻撃する。"
effectSummary: null
taxonomy:
  order: null
  family: "トンボ科"
  other: []
referencableTags:
  - "トンボ科"
  - "かばう"
  - "攻撃制限"
  - "遅延効果"
  - "手札操作"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/9/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 10/64 ムカシトンボ

```yaml
officialNumber: "10/64"
name: "ムカシトンボ"
set: "BOOSTER_SET_4"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 300
skills:
  - name: "とびかかる"
    baseAp: 300
    effectSummary: null
traits:
  - name: "生きた化石"
    effectSummary: "自分の捨て札にある＜生きた化石＞を持つ虫１つごとに、これのコストを１減らす。"
effectSummary: null
taxonomy:
  order: null
  family: "ムカシトンボ科"
  other: []
referencableTags:
  - "ムカシトンボ科"
  - "生きた化石"
  - "捨て札"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/10/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 11/64 オニヤンマ（幼虫）

```yaml
officialNumber: "11/64"
name: "オニヤンマ（幼虫）"
set: "BOOSTER_SET_4"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 3
baseHp: 400
skills:
  - name: "下アゴバサミ"
    baseAp: 500
    effectSummary: null
traits:
  - name: "水生幼虫"
    effectSummary: "相手の青のエサ３つごとに、これのコストを１減らす。"
effectSummary: null
taxonomy:
  order: null
  family: "オニヤンマ科"
  other: []
referencableTags:
  - "オニヤンマ科"
  - "水生幼虫"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/11/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 12/64 ギンヤンマ（幼虫）

```yaml
officialNumber: "12/64"
name: "ギンヤンマ（幼虫）"
set: "BOOSTER_SET_4"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 300
skills:
  - name: "下アゴバサミ"
    baseAp: 200
    effectSummary: null
traits:
  - name: "水生幼虫"
    effectSummary: "相手の青のエサ３つごとに、これのコストを１減らす。"
effectSummary: null
taxonomy:
  order: null
  family: "ヤンマ科"
  other: []
referencableTags:
  - "ヤンマ科"
  - "水生幼虫"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/12/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 13/64 バーチェルグンタイアリ マイナー

```yaml
officialNumber: "13/64"
name: "バーチェルグンタイアリ マイナー"
set: "BOOSTER_SET_4"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 1
baseHp: 300
skills:
  - name: "橋渡し"
    baseAp: 100
    effectSummary: "次のターン相手はこれ以外の虫を攻撃できない。 ※この技を持つ虫が複数いるとき、相手はどれかを選んで攻撃する。"
traits:
  - name: "軍隊連携"
    effectSummary: "この虫は自分の場にいる＜軍隊連携＞を持つ虫の技を使用できる。"
effectSummary: null
taxonomy:
  order: null
  family: "アリ科"
  other: []
referencableTags:
  - "アリ科"
  - "軍隊連携"
  - "攻撃制限"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/13/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 14/64 コカブトムシ

```yaml
officialNumber: "14/64"
name: "コカブトムシ"
set: "BOOSTER_SET_4"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 1
baseHp: 200
skills:
  - name: "くいやぶる"
    baseAp: 200
    effectSummary: null
traits:
  - name: "死骸あさり"
    effectSummary: "自分の捨て札に赤と青と緑の虫があるなら、この虫の体力と攻撃力を200増やす。"
effectSummary: null
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
  - "死骸あさり"
  - "捨て札"
  - "ダメージ変更"
rulings:
  - "自分の捨て札にそれぞれ2枚ずつ、赤と青の緑の虫がある場合、＜死骸あさり＞で増える[コカブトムシ]の体力と攻撃力は400に: いいえ。増える修正値は200だけです。それぞれ2枚以上、赤と青と緑の虫があっても効果は重複しません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/14/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 15/64 ネプチューンオオカブト

```yaml
officialNumber: "15/64"
name: "ネプチューンオオカブト"
set: "BOOSTER_SET_4"
rarity: "LR"
type: "INSECT"
color: "BLUE"
cost: 6
baseHp: 1600
skills:
  - name: "神のツノ突進"
    baseAp: 1000
    effectSummary: null
traits:
  - name: "威圧の大角"
    effectSummary: "これが場にいるとき、各プレイヤーの技を２つ以上持つ虫のコストを１増やす。 ※＜＞の技を含む。"
effectSummary: null
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
  - "威圧の大角"
  - "エサ操作"
  - "捨て札"
  - "縄張り操作"
rulings:
  - "相手の場にいる[ネプチューンオオカブト]の＜威圧の大角＞によって技を2つ以上持つ虫のコストが1増えています。 この状態で、＜くちなし＞の技を持つ4コストの[カイコ]を場に出すときに: 5です。[カイコ]の＜くちなし＞は場に出ていないと効果を発揮しません。 コストを払い、場に出すタイミングでは＜くちなし＞の効果が発揮されていない為、＜威圧の大角＞によってコストが1増えます。"
  - "[ネプチューンオオカブト]が場に2体いるとき、＜威圧の大角＞によって技を2つ以上持つ虫のコストは2増えますか？: はい。2増えます。＜威圧の大角＞のコストを増やす効果は重複し、場にいる＜威圧の大角＞を持つ虫の数だけ増えます。"
  - "＜威圧の大角＞の効果は、[リオック]の＜エサにする＞や[玉響の蠢き]のような術カードにも影響しますか？: いいえ。それらのカードはコストを支払わず場に出す効果であるため、＜威圧の大角＞の影響を受けません。"
  - "相手の場に＜威圧の大角＞の技を持つ[ネプチューンオオカブト]が1体います、 自分の捨て札に＜生きた化石＞の技を持つカードが3枚あるとき、[ムカシトンボ]を場に出す場合、支払うコスト: 0になります。コストを増減させる効果が複数ある場合、増減させる値同士を先に合わせて計算し、その合計を元のコストに計算します。 この場合、＜威圧の大角＞で1コスト増加(+1)と＜生きた化石＞で3コスト減少(-3)を計算し(+1)+(-3)=(-2)、その後、ムカシトンボの元のコスト、2に(-2)して0コスト になります。"
  - "相手の場に＜威圧の大角＞の技を持つ[ネプチューンオオカブト]が1体います、 自分が[飛蝗の待ち伏せ]を使用した後、技が1つのバッタ科の5コスト虫[トノサマバッタ]を出す場合、コスト: はい。コストは増えます。 [飛蝗の待ち伏せ]の効果により、[トノサマバッタ]は\"くらいつく\"と＜とびだす＞合わせて2つの技を持つため、コストは増えて6になります。 また、縄張りから[トノサマバッタ]を引いた場合は[飛蝗の待ち伏せ]によって得た＜とびだす＞が使用できるため、その場合はコストを使わず場に出すことができます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/15/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 16/64 マンディブラリスフタマタクワガタ

```yaml
officialNumber: "16/64"
name: "マンディブラリスフタマタクワガタ"
set: "BOOSTER_SET_4"
rarity: "SR"
type: "INSECT"
color: "BLUE"
cost: 5
baseHp: 1400
skills:
  - name: "オオアゴバサミ"
    baseAp: 1000
    effectSummary: null
traits:
  - name: "狂暴化"
    effectSummary: "これが場に出たとき、自分のエサを１つ選び、破壊する。そうしなければ、この虫を破壊する。"
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
  - "狂暴化"
  - "裏向き"
  - "エサ操作"
  - "捨て札"
  - "登場時"
rulings:
  - "自分のエサがすべて裏向きのとき、[マンディブラリスフタマタクワガタ]を場に出すことは: はい。場に出すことができます。 ただし裏向きのエサは選ぶことができないため、＜狂暴化＞の効果で破壊することができず[マンディブラリスフタマタクワガタ]が破壊されます。"
  - "[玉響の蠢き]で[マンディブラリスフタマタクワガタ]を場に出たときも、＜狂暴化＞の効果は発揮されますか？: はい。術カードなどの効果で場に出たときも、＜狂暴化＞の効果は発揮されます。"
  - "自分のエサ場のカードが6枚の状態でセットフェイズを終えました。[マンディブラリスフタマタクワガタ]を場に出して＜狂暴化＞の効果でエサ場のカードが5枚になりますが、使えるコストも減り: いいえ、減りません。コストはセットフェイズが終わり、メインフェイズ開始時のエサ場のカード枚数と同じだけ使えるようになるため、この場合ならあと1コスト使用できます。"
  - "（2024/12/17追記） [マンディブラリスフタマタクワガタ]を場に出すとき、エサ場のカードをかならず捨て札にしなければなりませんか？: いいえ。ただし場に出たときにエサ場からカードを1つ捨て札に置いていないため、＜狂暴化＞の効果で[マンディブラリスフタマタクワガタ]が破壊されます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/16/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 17/64 ゴマダラチョウ

```yaml
officialNumber: "17/64"
name: "ゴマダラチョウ"
set: "BOOSTER_SET_4"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 4
baseHp: 1000
skills:
  - name: "すいつくす"
    baseAp: 400
    effectSummary: null
  - name: "あおぐ"
    baseAp: 0
    effectSummary: "次のターン、相手が使用する術カードのコストを１増やす。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "タテハチョウ科"
  other: []
referencableTags:
  - "タテハチョウ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/17/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 18/64 ゴホンヅノカブト

```yaml
officialNumber: "18/64"
name: "ゴホンヅノカブト"
set: "BOOSTER_SET_4"
rarity: "SR"
type: "INSECT"
color: "BLUE"
cost: 5
baseHp: 1300
skills:
  - name: "ツノ突進"
    baseAp: 700
    effectSummary: null
  - name: "みだれ突き"
    baseAp: 300
    effectSummary: "相手の虫を２つ選び、それぞれに攻撃する。 ※１つの虫や、相手に直接攻撃はできない。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
  - "破壊時"
  - "縄張り操作"
rulings:
  - "自分のターン、[ゴホンヅノカブト]の\"みだれ突き\"で相手の虫を2つ選び、攻撃しました。1つ目の虫を破壊して縄張りを引かせた時、＜かばう＞を持つ虫が場に出た場合、2つ目の虫に攻撃は: はい、できます。\"みだれ突き\"を使用する時点で攻撃対象を選んでいるため、＜かばう＞を持つ虫が場に出ても攻撃対象を変更する事はありません。"
  - "[ゴホンヅノカブト]に[蟷螂の大鎌]を1つ付けて、\"みだれ突き\"で相手の虫に2つに攻撃しました。この時、破壊できる最大枚数は何枚ですか？: 最大枚数は4枚ですが、相手の選択によっては1枚になります。\"みだれ突き\"による攻撃で相手の虫を破壊したとき、[蟷螂の大鎌]の効果で相手は虫を1つ破壊します。この時相手が\"みだれ突き\"ですでに選ばれている虫を破壊した場合、\"みだれ突き\"を受ける虫はすでにいないため、攻撃はそこで終了します。相手がそうしなかった場合、同様に破壊できれば[蟷螂の大鎌]の効果を使用できます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/18/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 19/64 アントアンカブトハナムグリ

```yaml
officialNumber: "19/64"
name: "アントアンカブトハナムグリ"
set: "BOOSTER_SET_4"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 700
skills:
  - name: "ツノ突進"
    baseAp: 300
    effectSummary: null
traits:
  - name: "かばう"
    effectSummary: "これを縄張りから引いたとき、場に出してもよい。そうしたなら、相手はこれ以外の虫を攻撃できない。ターン終了時にこれを手札に戻す。 ※この技を持つ虫が複数いるとき、相手はどれかを選んで攻撃する。"
effectSummary: null
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
  - "かばう"
  - "攻撃制限"
  - "遅延効果"
  - "手札操作"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/19/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 20/64 ジャコウアゲハ

```yaml
officialNumber: "20/64"
name: "ジャコウアゲハ"
set: "BOOSTER_SET_4"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 4
baseHp: 700
skills:
  - name: "すいつくす"
    baseAp: 600
    effectSummary: null
traits:
  - name: "毒の体"
    effectSummary: "これが受ける相手の虫の毒とつく技のダメージを０にする。"
effectSummary: null
taxonomy:
  order: null
  family: "アゲハチョウ科"
  other: []
referencableTags:
  - "アゲハチョウ科"
  - "毒の体"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/20/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 21/64 オオトモエ

```yaml
officialNumber: "21/64"
name: "オオトモエ"
set: "BOOSTER_SET_4"
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
  - name: "巴紋"
    effectSummary: "これが虫の攻撃により破壊されたとき、相手のエサを最大２つ選び裏向きにしてもよい。 ※裏向きのエサのコストは発生するか、色を失い虫の技やカードの効果の対象に選べなくなる。"
effectSummary: null
taxonomy:
  order: null
  family: "ヤガ科"
  other: []
referencableTags:
  - "ヤガ科"
  - "巴紋"
  - "裏向き"
  - "エサ操作"
  - "破壊時"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/21/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 22/64 キタテハ

```yaml
officialNumber: "22/64"
name: "キタテハ"
set: "BOOSTER_SET_4"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 500
skills:
  - name: "すいとる"
    baseAp: 400
    effectSummary: null
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "タテハチョウ科"
  other: []
referencableTags:
  - "タテハチョウ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/22/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 23/64 イチモンジチョウ

```yaml
officialNumber: "23/64"
name: "イチモンジチョウ"
set: "BOOSTER_SET_4"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 500
skills:
  - name: "すう"
    baseAp: 300
    effectSummary: null
traits:
  - name: "一文字"
    effectSummary: "自分の場にいる虫がこれだけのとき、この虫の攻撃力を200増やす。"
effectSummary: null
taxonomy:
  order: null
  family: "タテハチョウ科"
  other: []
referencableTags:
  - "タテハチョウ科"
  - "一文字"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/23/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 24/64 シロテンハナムグリ

```yaml
officialNumber: "24/64"
name: "シロテンハナムグリ"
set: "BOOSTER_SET_4"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 2
baseHp: 300
skills:
  - name: "たいあたり"
    baseAp: 300
    effectSummary: null
  - name: "花粉食い"
    baseAp: 0
    effectSummary: "この技は１度だけ使用できる。相手のエサを１つ選び裏向きにしてもよい。 ※裏向きのエサのコストは発生するが、色を失い虫の技やカードの効果の対象に選べなくなる。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
  - "裏向き"
  - "エサ操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/24/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 25/64 アオハナムグリ

```yaml
officialNumber: "25/64"
name: "アオハナムグリ"
set: "BOOSTER_SET_4"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 1
baseHp: 200
skills:
  - name: "たいあたり"
    baseAp: 100
    effectSummary: null
  - name: "花粉食い"
    baseAp: 0
    effectSummary: "この技は１度だけ使用できる。相手のエサを１つ選び裏向きにしてもよい。 ※裏向きのエサのコストは発生するが、色を失い虫の技やカードの効果の対象に選べなくなる。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
  - "裏向き"
  - "エサ操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/25/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 26/64 メンガタクワガタ

```yaml
officialNumber: "26/64"
name: "メンガタクワガタ"
set: "BOOSTER_SET_4"
rarity: "SR"
type: "INSECT"
color: "BLUE"
cost: 2
baseHp: 400
skills:
  - name: "はさむ"
    baseAp: 400
    effectSummary: null
traits:
  - name: "威嚇の面"
    effectSummary: "相手が自分の虫に術カードを使用するとき、これ以外の虫に使用できない。 ※この技を持つ虫が複数いるとき、相手はどれかを選んで使用する。"
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
  - "威嚇の面"
rulings:
  - "相手の場が「[術弾きの結界]を使用された[メンガタクワガタ]」と[マメコガネ]の2つだけのとき、自分が[塵芥虫の爆熱弾]を使用する場合、選べる虫はどれに: [マメコガネ]のみ、選ぶことができます。[メンガタクワガタ]に使用した[術弾きの結界]の、「相手はこの虫に術カードを使用できない。」効果が優先され、＜威嚇の面＞が効果を発揮していても、[メンガタクワガタ]を選ぶことはできません。"
  - "相手の場に[蚕玉の加護]をつけた[メンガタクワガタ]と、[蚕玉の加護]を付けた[マメコガネ]がいます。 このとき、[埋葬虫の野辺送り]で[マメコガネ]に付けた[蚕玉の加護]を選び: はい。できます。 [埋葬虫の野辺送り]は虫を選ぶのでなく、強化カードを選び破壊する効果のため、[マメコガネ]に付けた[蚕玉の加護]を選び、破壊できます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/26/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 27/64 スジクワガタ

```yaml
officialNumber: "27/64"
name: "スジクワガタ"
set: "BOOSTER_SET_4"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 1
baseHp: 300
skills:
  - name: "オノバサミ"
    baseAp: 100
    effectSummary: "強化カードがついた虫に攻撃するとき、この技の攻撃力を300増やす。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/27/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 28/64 オニクワガタ

```yaml
officialNumber: "28/64"
name: "オニクワガタ"
set: "BOOSTER_SET_4"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 1
baseHp: 400
skills:
  - name: "はさむ"
    baseAp: 0
    effectSummary: null
  - name: "オニバサミ"
    baseAp: 200
    effectSummary: "この技は１度だけ使用できる。"
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
  cardDetail: "https://mushijingi.com/card/MUSHI4/28/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 29/64 タイタンオオキバウスバカミキリ

```yaml
officialNumber: "29/64"
name: "タイタンオオキバウスバカミキリ"
set: "BOOSTER_SET_4"
rarity: "LR"
type: "INSECT"
color: "GREEN"
cost: 6
baseHp: 1500
skills:
  - name: "神のキバ無双"
    baseAp: 1000
    effectSummary: null
traits:
  - name: "巨大甲虫"
    effectSummary: "自分のエサが８つ以上あるとき、この虫の攻撃力と体力を1000増やす。"
effectSummary: null
taxonomy:
  order: null
  family: "カミキリムシ科"
  other: []
referencableTags:
  - "カミキリムシ科"
  - "巨大甲虫"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/29/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 30/64 シタベニオオバッタ

```yaml
officialNumber: "30/64"
name: "シタベニオオバッタ"
set: "BOOSTER_SET_4"
rarity: "SR"
type: "INSECT"
color: "GREEN"
cost: 5
baseHp: 1200
skills:
  - name: "はねる"
    baseAp: 900
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
  cardDetail: "https://mushijingi.com/card/MUSHI4/30/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 31/64 カヤキリ

```yaml
officialNumber: "31/64"
name: "カヤキリ"
set: "BOOSTER_SET_4"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 4
baseHp: 1100
skills:
  - name: "かみちぎる"
    baseAp: 300
    effectSummary: null
traits:
  - name: "かばう"
    effectSummary: "これを縄張りから引いたとき、場に出してもよい。そうしたなら、相手はこれ以外の虫を攻撃できない。ターン終了時にこれを手札に戻す。 ※この技を持つ虫が複数いるとき、相手はどれかを選んで攻撃する。"
effectSummary: null
taxonomy:
  order: null
  family: "キリギリス科"
  other: []
referencableTags:
  - "キリギリス科"
  - "かばう"
  - "捨て札"
  - "攻撃制限"
  - "遅延効果"
  - "手札操作"
  - "縄張り操作"
  - "コントロール変更"
rulings:
  - "自分の場に＜かばう＞の技を持つ虫がいるときでも、 縄張りから＜かばう＞の技を持つ[カヤキリ]を引いたら、場に出すことが: はい。既に自分の場に＜かばう＞の技を持つ虫がいても[カヤキリ]を場に出すことができます。"
  - "＜かばう＞の効果ではなく、自分のターンにコストを払って[カヤキリ]を場に出した場合、 その[カヤキリ]は「ターン終了時にこれを手札に戻す。」の効果でターン終了時に、自分の手札に戻り: いいえ。手札に戻りません。「ターン終了時にこれを手札に戻す。」の効果は＜かばう＞によって縄張りから[カヤキリ]が場に出た時のみ、発揮します。"
  - "＜かばう＞によって場に出た[カヤキリ]が、出たターン中に相手によって破壊されました。 捨て札にある[カヤキリ]は、「ターン終了時にこれを手札に戻す。」の効果によってターン終了時に手: いいえ。手札に戻りません。＜かばう＞で与えられた「ターン終了時にこれを手札に戻す。」効果は、[カヤキリ]が破壊され、場から離れているため処理されず、ターン終了時に手札に戻りません。虫に与えられた効果は、場を離れる(捨て札・相手の場に移動するなど)となくなります。"
  - "＜かばう＞によって相手の場に出た[カヤキリ]を、自分の[エメラルドゴキブリバチ]の\"操り針\"攻撃で破壊し、\"操り針\"の効果で、破壊した相手の[カヤキリ]を自分の場に出しました。この: いいえ。相手の手札に戻らず、\"操り針\"の効果で破壊され、相手の捨て札に行きます。 \"操り針\"の効果で相手の場から離れ、自分の場に出たため別の虫として扱い、＜かばう＞で[カヤキリ]に与えられた効果はなくなります。"
  - "＜かばう＞によって場に出た[カヤキリ]と、＜りんぷん＞をもつ[ナミアゲハ]、この2つの虫のみ、相手の場にいます。 この場合、どちらの虫に攻撃をすることが: [カヤキリ]か[ナミアゲハ]どちらかの虫を選び、攻撃することができます。 注釈テキストの「※この技を持つ虫が複数いるとき、相手はどれかを選んで攻撃する。」は「相手はこれ以外の虫を攻撃できない。」 の効果を持つ虫が該当します。(＜鳴く＞、＜りんぷん＞、＜かばう＞、[鳳蝶の蟲惑]、\"橋渡し\"などが該当します。)"
  - "[藪蚊の密約]を使用したとき、引いた縄張りが＜かばう＞を持つ[カヤキリ]でした。 ＜かばう＞の効果で[カヤキリ]を自分の場に出すことは: はい。自分の場に出すことができます。 「＜とびだす＞は使用できない。」と、テキスト指定されている＜とびだす＞ではないので、＜かばう＞で場に出すことができます。"
  - "自分のターンに＜かばう＞で相手の場に[カヤキリ]が出た後、[カイコ]を出しました。＜かばう＞を失った[カヤキリ]は場に残りますか？手札に戻りますか？: [カヤキリ]は手札に戻ります。＜くちなし＞は発揮中やこれから発動する効果を無効にしますが、発動後の効果は無効にしません。 そのため、＜かばう＞の「ターン終了時に手札に戻る」という状態は無効にならず、手札に戻ります。また、「この虫以外攻撃できない」という状態も無効にはなりません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/31/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 32/64 アシナガオオコノハギス

```yaml
officialNumber: "32/64"
name: "アシナガオオコノハギス"
set: "BOOSTER_SET_4"
rarity: "SR"
type: "INSECT"
color: "GREEN"
cost: 5
baseHp: 1300
skills:
  - name: "かみちぎる"
    baseAp: 700
    effectSummary: null
traits:
  - name: "巨大昆虫"
    effectSummary: "自分のエサが８つ以上あるとき、この虫の攻撃力と体力を500増やす。"
effectSummary: null
taxonomy:
  order: null
  family: "キリギリス科"
  other: []
referencableTags:
  - "キリギリス科"
  - "巨大昆虫"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/32/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 33/64 ヨナグニサン（幼虫）

```yaml
officialNumber: "33/64"
name: "ヨナグニサン（幼虫）"
set: "BOOSTER_SET_4"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 4
baseHp: 900
skills:
  - name: "大食漢"
    baseAp: 300
    effectSummary: "この技により、相手が縄張りを引いたとき、この虫の攻撃力と体力を200増やす。 ※この効果はこれが場を離れるまで継続する。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "ヤママユガ科"
  other: []
referencableTags:
  - "ヤママユガ科"
  - "エサ操作"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/33/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 34/64 ホウセキゾウムシ

```yaml
officialNumber: "34/64"
name: "ホウセキゾウムシ"
set: "BOOSTER_SET_4"
rarity: "SR"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 700
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
  family: "ゾウムシ科"
  other: []
referencableTags:
  - "ゾウムシ科"
  - "宝石昆虫"
  - "エサ操作"
  - "破壊時"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/34/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 35/64 アオタマムシ

```yaml
officialNumber: "35/64"
name: "アオタマムシ"
set: "BOOSTER_SET_4"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 800
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
  cardDetail: "https://mushijingi.com/card/MUSHI4/35/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 36/64 ジャコウアゲハ（幼虫）

```yaml
officialNumber: "36/64"
name: "ジャコウアゲハ（幼虫）"
set: "BOOSTER_SET_4"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 600
skills:
  - name: "かじる"
    baseAp: 400
    effectSummary: null
  - name: "共食い"
    baseAp: 600
    effectSummary: "この技を使うとき、この虫以外の自分の虫を１つ選び、破壊する。"
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
  cardDetail: "https://mushijingi.com/card/MUSHI4/36/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 37/64 オオトモエ（幼虫）

```yaml
officialNumber: "37/64"
name: "オオトモエ（幼虫）"
set: "BOOSTER_SET_4"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 1
baseHp: 300
skills:
  - name: "かじる"
    baseAp: 100
    effectSummary: null
traits:
  - name: "眼状紋"
    effectSummary: "これが虫の攻撃により破壊されたとき、相手のエサを１つ選び、裏向きにしてもよい。 ※裏向きのエサのコストは発生するが、色を失い虫の技やカードの効果の対象に選べなくなる。"
effectSummary: null
taxonomy:
  order: null
  family: "ヤガ科"
  other: []
referencableTags:
  - "ヤガ科"
  - "眼状紋"
  - "裏向き"
  - "エサ操作"
  - "破壊時"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/37/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 38/64 トラカミキリ

```yaml
officialNumber: "38/64"
name: "トラカミキリ"
set: "BOOSTER_SET_4"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 1
baseHp: 200
skills:
  - name: "くいちぎる"
    baseAp: 200
    effectSummary: null
traits:
  - name: "ベイツ型擬態"
    effectSummary: "自分の場に、ほかの虫かいるなら、この虫は攻撃を受けない。 ※この技を持つ虫だけが、複数いるとき、相手はどれかを選んで攻撃する。"
effectSummary: null
taxonomy:
  order: null
  family: "カミキリムシ科"
  other: []
referencableTags:
  - "カミキリムシ科"
  - "ベイツ型擬態"
  - "裏向き"
  - "エサ操作"
  - "攻撃制限"
  - "ダメージ変更"
rulings:
  - "相手の場が[トラカミキリ]と＜擬態＞を持つ虫の2つだけのとき、自分の虫の攻撃は直接攻撃に: はい。いずれの虫も攻撃を受けない条件を満たしているため、相手プレイヤーへの直接攻撃になります。"
  - "相手の場が[トラカミキリ]と\"かくれる\"の技で裏返した[ジグモ]の2つだけのとき、自分の虫の攻撃は直接攻撃に: いいえ。\"かくれる\"の技で裏返した虫は場にいないものと扱うため、＜ベイツ型擬態＞の効果は発揮されず[トラカミキリ]が攻撃対象になります。"
  - "相手の場が[鳳蝶の蠱惑]をつけた[トラカミキリ]と<擬態>\"を持つ虫の2つだけのとき、自分の虫の攻撃は直接攻撃に: はい。相手プレイヤーへの直接攻撃になります。この場合＜ベイツ型擬態＞の攻撃を受けない効果が優先され、[鳳蝶の蠱惑]をつけていても＜ベイツ型擬態＞の効果を発揮している[トラカミキリ]を攻撃先に選ぶことはできません。"
  - "相手の場に2体[マメコガネ]がいるとき、[天牛の大顎]で攻撃力を300増やした自分の[サカダチコノハナナフシ]\"逆立ち返し\"攻撃で、 片方の[マメコガネ]に攻撃し、技の効果でエサ場: はい。ダメージを与えることができます。入れ替えた[トラカミキリ]の＜ベイツ型擬態＞の効果で、攻撃先に選択できなくなりますが、”逆立ち返し”で攻撃先に選択された[マメコガネ]と入れ替えた場合は、すでに選択されているため300ダメージを受けます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/38/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 39/64 ドロハマキチョッキリ

```yaml
officialNumber: "39/64"
name: "ドロハマキチョッキリ"
set: "BOOSTER_SET_4"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 500
skills:
  - name: "かじる"
    baseAp: 100
    effectSummary: null
  - name: "ゆりかご落とし"
    baseAp: 500
    effectSummary: "この技を使うとき、自分の強化カードを１つ選び破壊する。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "オトシブミ科"
  other: []
referencableTags:
  - "オトシブミ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/39/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 40/64 ヨモギエダシャク（幼虫）

```yaml
officialNumber: "40/64"
name: "ヨモギエダシャク（幼虫）"
set: "BOOSTER_SET_4"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 1
baseHp: 200
skills:
  - name: "かじる"
    baseAp: 100
    effectSummary: null
traits:
  - name: "尺取り"
    effectSummary: "これが虫の攻撃により破壊されたとき、自分の捨て札にある強化カートを１つ選び、手札に戻してもよい。"
effectSummary: null
taxonomy:
  order: null
  family: "シャクガ科"
  other: []
referencableTags:
  - "シャクガ科"
  - "尺取り"
  - "捨て札"
  - "破壊時"
  - "手札操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/40/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 41/64 ヒメオビオオキノコ

```yaml
officialNumber: "41/64"
name: "ヒメオビオオキノコ"
set: "BOOSTER_SET_4"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 1
baseHp: 200
skills:
  - name: "くいあらす"
    baseAp: 200
    effectSummary: null
traits:
  - name: "キノコパワー"
    effectSummary: "この虫に強化カードかついているなら、この虫の体力と攻撃力を100増やす。"
effectSummary: null
taxonomy:
  order: null
  family: "オオキノコムシ科"
  other: []
referencableTags:
  - "オオキノコムシ科"
  - "キノコパワー"
  - "ダメージ変更"
rulings:
  - "[ヒメオビオオキノコ]に強化カードが2枚ついています。 このとき＜キノコパワー＞の効果で増やす体力と攻撃力は200に: いいえ。強化カードが何枚ついていても＜キノコパワー＞で増やす体力と攻撃力は100になります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/41/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 42/64 ニシキオオツバメガ（幼虫）

```yaml
officialNumber: "42/64"
name: "ニシキオオツバメガ（幼虫）"
set: "BOOSTER_SET_4"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 1
baseHp: 300
skills:
  - name: "かじる"
    baseAp: 100
    effectSummary: null
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "ツバメガ科"
  other: []
referencableTags:
  - "ツバメガ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/42/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 43/64 カイコ

```yaml
officialNumber: "43/64"
name: "カイコ"
set: "BOOSTER_SET_4"
rarity: "LR"
type: "INSECT"
color: "COLORLESS"
cost: 4
baseHp: 900
skills:
  - name: "はばたく"
    baseAp: 300
    effectSummary: null
traits:
  - name: "くちなし"
    effectSummary: "これが場にいるとき、自分と相手の虫は＜くちなし＞以外の＜＞の技を失う。"
effectSummary: null
taxonomy:
  order: null
  family: "カイコガ科"
  other: []
referencableTags:
  - "カイコガ科"
  - "くちなし"
  - "エサ操作"
  - "捨て札"
  - "破壊時"
  - "攻撃制限"
  - "遅延効果"
  - "手札操作"
  - "縄張り操作"
rulings:
  - "自分のターンに＜かばう＞で相手の場に[カヤキリ]が出た後、[カイコ]を出しました。＜かばう＞を失った[カヤキリ]は場に残りますか？手札に戻りますか？: [カヤキリ]は手札に戻ります。＜くちなし＞は発揮中やこれから発動する効果を無効にしますが、発動後の効果は無効にしません。 そのため、＜かばう＞の「ターン終了時に手札に戻る」という状態は無効にならず、手札に戻ります。また、「この虫以外攻撃できない」という状態も無効にはなりません。"
  - "[カイコ]の＜くちなし＞の効果「各プレイヤーの虫は＜くちなし＞以外の＜＞の技を失う。」は手札にある虫も含まれますか？: はい。含まれます。各プレイヤーの場、手札、エサ、縄張り、捨て札にある虫に効果があります。"
  - "相手の＜毒の泡＞の技を持つ[サツマニシキ]を自分の[マメコガネ]の攻撃で破壊し、＜毒の泡＞によって[マメコガネ]に効果が与えられました。 その後に、＜くちなし＞の技を持つ[カイコ]: いいえ。すでに＜毒の泡＞の効果は発動し終わっているため、[サツマニシキ]が場にいなくとも、[マメコガネ]に与えられた効果は無くなりません。 [カイコ]が場にいるときに[サツマニシキ]が破壊された場合は、技を失っているため[マメコガネ]は効果を受けません。"
  - "相手の場にいる[ネプチューンオオカブト]の＜威圧の大角＞によって技を2つ以上持つ虫のコストが1増えています。 この状態で、＜くちなし＞の技を持つ4コストの[カイコ]を場に出すときに: 5です。[カイコ]の＜くちなし＞は場に出ていないと効果を発揮しません。 コストを払い、場に出すタイミングでは＜くちなし＞の効果が発揮されていない為、＜威圧の大角＞によってコストが1増えます。"
  - "[死神蟲の蛮刀]の＜装着＞は[カイコ]の＜くちなし＞によって技を失いますか？: いいえ。[死神蟲の蛮刀]は強化カードであり、虫ではないため＜装着＞を失いません。"
  - "自分の場に[リュウジンオオムカデ]を出し、\"<翡翠色>\"で色を緑に指定しました。 その後に、\"<くちなし>\"の技を持つ[カイコ]を自分の場に出した場合、[リュウジンオオムカデ]の色: はい。＜翡翠色＞によって[リュウジンオオムカデ]は「ターン終了時まで、これはその色になる」という状態になっているため、ターン終了時まで緑色のままです。 [カイコ]が場にいるときに[リュウジンオオムカデ]が場に出た場合は、技を失っているため＜翡翠色＞は使用できません。"
  - "＜擬態＞効果が発揮中の、攻撃を受けない[オオコノハムシ]が相手の場にいます。 このとき、＜くちなし＞の技を持つ[カイコ]を自分の場に出した場合、＜擬態＞を失った[オオコノハムシ]に: はい。＜くちなし＞によって＜擬態＞を失い、[オオコノハムシ]に攻撃することができます。 ＜擬態＞は「場に出た次の相手のターン」を指定して発揮し続ける効果を持つため、＜くちなし＞によって失われたとき、「攻撃を受けない」状態ではなくなります。"
  - "相手のエサ場に、＜宝石昆虫＞の効果によって置かれた[グンジョウオオコブハムシ]があります。 このとき、自分の場に＜くちなし＞の技を持つ[カイコ]を場に出した場合、相手のエサ場の[グ: エサ場に残り続けます。既に効果が発揮され、処理が終了した＜宝石昆虫＞によってエサ場に置かれているため、相手のエサ場の[グンジョウオオコブハムシ]に影響はありません。"
  - "自分の縄張りが6枚あるとき、[カイコ]と[ツェツェバエ]を場に出しました。相手の虫の攻撃で[カイコ]が破壊されたとき、[ツェツェバエ]の＜血の対価＞はどのように: まず[カイコ]が虫の攻撃で破壊されます。この時何もなければ縄張りを引きますが、＜くちなし＞の効果が無くなるため[ツェツェバエ]の＜血の対価＞が先に戻ります。縄張りは減っておらず、6枚あるため、[ツェツェバエ]の体力は0まで下がり、破壊されます。"
  - "[飛蝗の待ち伏せ]を使用しました。[カイコ]が場にいるとき、自分のバッタ科、イナゴ科の虫を縄張りから引いたなら、それは場に出してもよいですか？: いいえ、出せません。[飛蝗の待ち伏せ]によってバッタ科、イナゴ科の虫は＜とびだす＞を持った状態になりますが、＜くちなし＞によって＜＞の技を失っているため、縄張りから引いても場に出すことは出来ません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/43/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 44/64 オカダンゴムシ

```yaml
officialNumber: "44/64"
name: "オカダンゴムシ"
set: "BOOSTER_SET_4"
rarity: "R"
type: "INSECT"
color: "COLORLESS"
cost: 1
baseHp: 200
skills:
  - name: "たいあたり"
    baseAp: 100
    effectSummary: null
  - name: "まるまる"
    baseAp: 0
    effectSummary: "次の相手のターンの間、この虫の体力を200増やす。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "オカダンゴムシ科"
  other: []
referencableTags:
  - "オカダンゴムシ科"
  - "遅延効果"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/44/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 45/64 ヒジリタマオシコガネ

```yaml
officialNumber: "45/64"
name: "ヒジリタマオシコガネ"
set: "BOOSTER_SET_4"
rarity: "SR"
type: "INSECT"
color: "COLORLESS"
cost: 2
baseHp: 400
skills:
  - name: "フンコロガシ"
    baseAp: 200
    effectSummary: "相手の捨て札からカードを１枚選び、裏向きで山札の一番下に置いてもよい。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
  - "裏向き"
  - "エサ操作"
  - "捨て札"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/45/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 46/64 天与の大顎

```yaml
officialNumber: "46/64"
name: "天与の大顎"
set: "BOOSTER_SET_4"
rarity: "N"
type: "ENHANCEMENT"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectSummary: "この虫の攻撃力を400増やす。 ＜装着＞これを縄張りから引いたとき、自分の場に虫がいるなら、これをつけてもよい。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "ダメージ変更"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/46/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 47/64 天与の毒針

```yaml
officialNumber: "47/64"
name: "天与の毒針"
set: "BOOSTER_SET_4"
rarity: "N"
type: "ENHANCEMENT"
color: null
cost: 2
baseHp: null
skills: []
traits: []
effectSummary: "この虫の攻撃力を700増やす。 ＜装着＞これを縄張りから引いたとき、自分の場に虫がいるなら、これをつけてもよい。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "ダメージ変更"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/47/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 48/64 天与の甲殻

```yaml
officialNumber: "48/64"
name: "天与の甲殻"
set: "BOOSTER_SET_4"
rarity: "R"
type: "ENHANCEMENT"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectSummary: "この虫の体力を600増やす。 ＜装着＞これを縄張りから引いたとき、自分の場に虫がいるなら、これをつけてもよい。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/48/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 49/64 天与の巨躯

```yaml
officialNumber: "49/64"
name: "天与の巨躯"
set: "BOOSTER_SET_4"
rarity: "R"
type: "ENHANCEMENT"
color: null
cost: 2
baseHp: null
skills: []
traits: []
effectSummary: "この虫の体力を1000増やす。 ＜装着＞これを縄張りから引いたとき、自分の場に虫がいるなら、これをつけてもよい。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/49/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 50/64 死神蟲の蛮刀

```yaml
officialNumber: "50/64"
name: "死神蟲の蛮刀"
set: "BOOSTER_SET_4"
rarity: "SR"
type: "ENHANCEMENT"
color: null
cost: 3
baseHp: null
skills: []
traits: []
effectSummary: "この虫の攻撃力を1000増やす。 ＜装着＞これを縄張りから引いたとき、自分の場に虫がいるなら、これをつけてもよい。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "ダメージ変更"
  - "縄張り操作"
rulings:
  - "[死神蟲の蛮刀]の＜装着＞は[カイコ]の＜くちなし＞によって技を失いますか？: いいえ。[死神蟲の蛮刀]は強化カードであり、虫ではないため＜装着＞を失いません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/50/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 51/64 術招きの鱗粉

```yaml
officialNumber: "51/64"
name: "術招きの鱗粉"
set: "BOOSTER_SET_4"
rarity: "N"
type: "ENHANCEMENT"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "相手が自分の虫に術カードを使用するとき、これ以外の虫に使用できない。 ※この技を持つ虫が複数いるとき、相手はどれかを選んで使用する。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags: []
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/51/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 52/64 螳螂の大鎌

```yaml
officialNumber: "52/64"
name: "螳螂の大鎌"
set: "BOOSTER_SET_4"
rarity: "SR"
type: "ENHANCEMENT"
color: null
cost: 3
baseHp: null
skills: []
traits: []
effectSummary: "この虫の攻撃により、相手の虫が破壊されたとき、相手の場に虫がいるなら、相手は虫を１つ選び破壊する。 ※この効果で虫が破壊されたとき、相手は縄張りを引かない。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "破壊時"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/52/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 53/64 蠱術の贋作

```yaml
officialNumber: "53/64"
name: "蠱術の贋作"
set: "BOOSTER_SET_4"
rarity: "SR"
type: "ENHANCEMENT"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "これを虫につけるとき、これ以外の自分の強化カードを１つ選ぶ。これがついた虫に、その強化カードと同じ修正値を与える。選んだ強化カードが破壊されたとき、これを破壊する。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "破壊時"
rulings:
  - "自分の場に強化カードが1枚もないとき、このカードを虫につけることは: いいえ。選ぶ対象の強化カードがない場合は、[蠱術の贋作]を虫につける事ができません。"
  - "[螳螂の大鎌]のように、修正値の記述がない強化カードを選び、虫に付けることは: はい。できます。ただし、修正値の記述がないカードは修正値が0扱いとなる為、[蠱術の贋作]が虫に与える修正値は0です。 また、修正値でないため[螳螂の大鎌]が持つ効果と同じ効果を[蠱術の贋作]によって虫に与える事はできません。"
  - "既に場の虫についている[死神蟲の蛮刀]の修正値と同じ修正値を与えている[蠱術の贋作]を選んで、 [蠱術の贋作]を虫につけた場合、修正値は: [蠱術の贋作]は修正値の記述がない強化カードのため、0になります。 他の強化カードと同じ修正値を与える効果を持ちますが、[蠱術の贋作]自体には修正値がありません。"
  - "[マメコガネ]についている[蠱術の贋作]を[螻蛄の七芸]で[アオカナブン]につけかえるとき、[蠱術の贋作]の「これを虫につけるとき、これ以外の自分の強化カードを1つ選ぶ。」効果で選: はい。違う強化カードを選ぶことができます。"
  - "[マメコガネ]についている[死神蟲の蛮刀]を[螻蛄の七芸]で[アオカナブン]につけかえるとき、その[死神蟲の蛮刀]を選択していた[蠱術の贋作]は破壊されますか？: いいえ。[死神蟲の蛮刀]は破壊されず場に残っているため、[蠱術の贋作]の破壊条件を満たしません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/53/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 54/64 軍配虫の大団扇

```yaml
officialNumber: "54/64"
name: "軍配虫の大団扇"
set: "BOOSTER_SET_4"
rarity: "N"
type: "ENHANCEMENT"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "この虫の攻撃により、相手の虫が破壊されたとき、その虫を裏向きで相手の山札の一番下に置く。 ※このとき相手は縄張りを引く。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "裏向き"
  - "破壊時"
  - "縄張り操作"
rulings:
  - "自分の[軍配虫の大団扇]を付けた[エメラルドゴキブリバチ]が\"操り針\"攻撃で相手の虫を破壊しました。 このとき[軍配虫の大団扇]と\"操り針\"の効果が同じタイミングで発揮されますが: 同じタイミングで発揮され、いずれも自分の虫と強化カードの効果のため、[軍配虫の大団扇]と\"操り針\"の処理順は自分の好きな順番で選ぶことができます。 [軍配虫の大団扇]から処理をする場合は、効果で相手の虫が山札に移動するため、操り針\"の効果は処理ができなくなり不発となります。 \"操り針\"から処理をする場合は、効果で相手の虫が自分の場に移動するため、[軍配虫の大団扇]の効果は処理ができなくなり不発となります。"
  - "自分の[軍配虫の大団扇]を付けた虫の攻撃で、相手の＜宝石昆虫＞の技をもつ[グンジョウオオコブハムシ]が破壊されました。 このとき[軍配虫の大団扇]と＜宝石昆虫＞の効果が同じタイミン: その場合、ターンプレイヤーの強化カードである[軍配虫の大団扇]の効果から処理が優先され、[グンジョウオオコブハムシ]は、裏向きで相手の山札の一番下に置かれます。その後＜宝石昆虫＞の効果処理を行いますが、[軍配虫の大団扇]の効果によって[グンジョウオオコブハムシ]が相手の山札の一番下に置かれ、場にいないため、＜宝石昆虫＞の効果は処理ができなくなり不発となります。"
  - "[軍配虫の大団扇]と[螳螂の大鎌]を付けた自分の虫が、相手の虫Aを攻撃で破壊し、[螳螂の大鎌]の効果で相手の虫Bを破壊しました。 この場合、[軍配虫の大団扇]の効果で相手の虫AとB: いいえ。相手の虫Ａだけ山札の一番下に置きます。 虫Ｂの破壊は[螳螂の大鎌]の効果によるもののため、虫Bに[軍配虫の大団扇]の効果は発揮しません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/54/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 55/64 若虫の転生

```yaml
officialNumber: "55/64"
name: "若虫の転生"
set: "BOOSTER_SET_4"
rarity: "N"
type: "SPELL"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectSummary: "自分の場の（幼虫）と書かれていない虫と同名の（幼虫）と書かれている虫を、捨て札から１つ選び場に出す。これにより場に出た虫は、このターン攻撃できない。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "捨て札"
  - "攻撃制限"
rulings:
  - "[若虫の転生]で出した[ナミアゲハ(幼虫)]に[蟷螂の構え]を使い、攻撃をすることは: いいえ。できません。[蟷螂の構え]は攻撃済みの虫が、もう一度攻撃ができる効果なので、カードの効果などで攻撃をすることができない状態の虫が攻撃できるようにはなりません。また、[蟷螂の構え]は攻撃済みでない虫を選んで使うことはできません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/55/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 56/64 怨霊の虫送り

```yaml
officialNumber: "56/64"
name: "怨霊の虫送り"
set: "BOOSTER_SET_4"
rarity: "R"
type: "SPELL"
color: null
cost: 3
baseHp: null
skills: []
traits: []
effectSummary: "相手の場とエサ場にある虫をそれぞれ１つ選び、入れかえる。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "エサ操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/56/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 57/64 極夜の羽化

```yaml
officialNumber: "57/64"
name: "極夜の羽化"
set: "BOOSTER_SET_4"
rarity: "R"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "自分の捨て札の（幼虫）と書かれていない虫と、それと同名の自分の場の（幼虫）と書かれている虫をそれぞれ1つ選び、交換する。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "捨て札"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/57/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 58/64 草薙の劫火

```yaml
officialNumber: "58/64"
name: "草薙の劫火"
set: "BOOSTER_SET_4"
rarity: "SR"
type: "SPELL"
color: null
cost: 5
baseHp: null
skills: []
traits: []
effectSummary: "自分と相手のすべての虫を破壊し、このターンを終了する。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "裏向き"
rulings:
  - "自分の場の[ジグモ]が\"かくれる\"攻撃の効果で裏返しになっているとき、[草薙の劫火]を使いました。 その場合、裏返した[ジグモ]は破壊されますか？: いいえ。破壊されません。裏返しの状態の虫は、いないものとして扱い、他のカードの効果を受けません。 ※裏返しになる前に受けていた効果や状態は、裏返しになった後も引き継がれます。"
  - "前のターンに[術弾きの結界]を使用された[マメコガネ]が、相手の場にいます。 この状態で、自分が[草薙の劫火]を使った場合、相手の[マメコガネ]は破壊されますか？: はい。破壊されます。 [草薙の劫火]は虫を選んで破壊する効果でなく、場のすべての虫を破壊する効果のため破壊されます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/58/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 59/64 白蟻の収穫

```yaml
officialNumber: "59/64"
name: "白蟻の収穫"
set: "BOOSTER_SET_4"
rarity: "N"
type: "SPELL"
color: null
cost: 3
baseHp: null
skills: []
traits: []
effectSummary: "自分のエサ場にある強化カードを最大２つまで選び、手札に戻す。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "エサ操作"
  - "手札操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/59/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 60/64 葉切蟻の野良仕事

```yaml
officialNumber: "60/64"
name: "葉切蟻の野良仕事"
set: "BOOSTER_SET_4"
rarity: "R"
type: "SPELL"
color: null
cost: 3
baseHp: null
skills: []
traits: []
effectSummary: "自分のエサ場にあるカードを１つ選び、手札に戻す。これをエサ場に置く。 ※このエサのコストはこのターン発生しない。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "エサ操作"
  - "手札操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/60/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 61/64 術弾きの結界

```yaml
officialNumber: "61/64"
name: "術弾きの結界"
set: "BOOSTER_SET_4"
rarity: "N"
type: "SPELL"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectSummary: "自分の虫を１つ選ぶ。次のターン終了時まで、この虫は相手の術カードの対象にならない。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "遅延効果"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/61/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 62/64 剣舞天翔の刹那

```yaml
officialNumber: "62/64"
name: "剣舞天翔の刹那"
set: "BOOSTER_SET_4"
rarity: "LR"
type: "SPELL"
color: null
cost: 2
baseHp: null
skills: []
traits: []
effectSummary: "自分の場の虫とエサ場の強化カードを、それぞれ最大２つまで選ぶ。それらの虫にそれらの強化カードを選んでつける。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "エサ操作"
  - "捨て札"
rulings:
  - "[剣舞天翔の刹那]を使った時の処理を詳しく教えてください: 自分の場の虫を最大2つ、自分のエサ場の強化カードを最大2つ選びます。その後強化カードを1枚ずつ、先ほど選んだ自分の場の虫につけます。この時、虫や強化カードに使用条件がある場合、正しい対象でなければつけることができず、1枚もつけられないのなら[剣舞天翔の刹那]は使用できません。"
  - "[剣舞天翔の刹那]を使い、自分の[マメコガネ]に、自分のエサ場の[口寄せの時蛹]と[白銀蜘蛛の糸]をつけようとしました。 その場合: [口寄せの時蛹]と[白銀蜘蛛の糸]は、それぞれ手札や捨て札の虫を選んでつけなければ使用できません。 そのため、[剣舞天翔の刹那]の効果で場の虫を対象に[口寄せの時蛹]と[白銀蜘蛛の糸]を選ぶことはできません。"
  - "自分の場に[マメコガネ]が1つあり、強化カードはありません。[剣舞天翔の刹那]を使い、自分の[マメコガネ]に、エサ場の[蠱術の贋作]と[死神蟲の蛮刀]をつけようとしました。 このと: 1番目に[死神蟲の蛮刀]、2番目に[蠱術の贋作]を選んだ場合は、[蠱術の贋作]の効果で既に場にある[死神蟲の蛮刀]を選ぶことができます。[蠱術の贋作]を使用するためには自分の場に1枚以上強化カードがあり、それを選べなければならないため、1番目に[蠱術の贋作]を選ぶことはできません。"
  - "強化カードが1枚ついた[メタリフェルホソアカクワガタ]に[剣舞天翔の刹那]を使い、強化カードを2枚付けることは: いいえ。できません。強化カードが付いている[メタリフェルホソアカクワガタ]は＜大太刀二刀流＞の効果で、これ以上強化カードを付けることができない状態になっているため、[剣舞天翔の刹那]で選ぶことができません。"
  - "[剣舞天翔の刹那]を使い、自分の[マメコガネ]に、虫の色を赤にかえる[剣の息吹]と虫の色を緑にかえる[鏡の息吹]を付けました この場合、[マメコガネ]の色は何色に: 1番目に[剣の息吹]、2番目に[鏡の息吹]を選んだ場合は、後につけた[鏡の息吹]の効果により緑色になります。 赤色にしたい場合は、1番目に[鏡の息吹]、2番目に[剣の息吹]を選ぶと、後につけた[鏡の息吹]の効果により赤色になります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/62/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 63/64 伏魔の蟲噛み

```yaml
officialNumber: "63/64"
name: "伏魔の蟲噛み"
set: "BOOSTER_SET_4"
rarity: "R"
type: "SPELL"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectSummary: "相手の虫を１つ選び、500のダメージを与える。相手の場にそれと同名の虫が他にいるなら、追加でその虫を １つ選び、500のダメージを与える。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/63/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 64/64 捨て身の兜投げ

```yaml
officialNumber: "64/64"
name: "捨て身の兜投げ"
set: "BOOSTER_SET_4"
rarity: "N"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "自分の強化カードを１つ選び破壊する。そうしたなら、相手の虫を１つ選び、その虫に700のダメージを与えてもよい。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "ダメージ変更"
rulings:
  - "相手の場に虫がいないとき、自分の虫についた強化カードを破壊することは: はい。できます。[捨て身の兜投げ]自分の場の強化カードを破壊する効果を持っています。破壊した場合、相手の場に虫がいるなら、700ダメージを与えてもよい、という効果なので、相手の場に虫がいない、あるいは対象にできない虫だけがいる場合でも、破壊する効果だけを使用することができます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI4/64/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 分類インデックス

- `アゲハチョウ科`: ジャコウアゲハ, ジャコウアゲハ（幼虫）
- `アリ科`: バーチェルグンタイアリ メジャー, バーチェルグンタイアリ メディア, バーチェルグンタイアリ マイナー
- `ウデムシ科`: タンザニアバンデットウデムシ
- `オオキノコムシ科`: ヒメオビオオキノコ
- `オオツチグモ科`: コバルトブルータランチュラ
- `オカダンゴムシ科`: オカダンゴムシ
- `オサムシ科`: バイオリンムシ
- `オトシブミ科`: ドロハマキチョッキリ
- `オニヤンマ科`: オニヤンマ（幼虫）
- `カイコガ科`: カイコ
- `カミキリムシ科`: タイタンオオキバウスバカミキリ, トラカミキリ
- `キリギリス科`: カヤキリ, アシナガオオコノハギス
- `クワガタムシ科`: マンディブラリスフタマタクワガタ, メンガタクワガタ, スジクワガタ, オニクワガタ
- `コガネムシ科`: コカブトムシ, ネプチューンオオカブト, ゴホンヅノカブト, アントアンカブトハナムグリ, シロテンハナムグリ, アオハナムグリ, ヒジリタマオシコガネ
- `コロギス科`: コロギス
- `シャクガ科`: ヨモギエダシャク（幼虫）
- `ゾウムシ科`: ホウセキゾウムシ
- `タテハチョウ科`: ゴマダラチョウ, キタテハ, イチモンジチョウ
- `タマムシ科`: アオタマムシ
- `ツバメガ科`: ニシキオオツバメガ（幼虫）
- `トンボ科`: チョウトンボ
- `バッタ科`: シタベニオオバッタ
- `ムカシトンボ科`: ムカシトンボ
- `ムカシヤンマ科`: テイオウムカシヤンマ, ムカシヤンマ
- `ヤガ科`: オオトモエ, オオトモエ（幼虫）
- `ヤママユガ科`: ヨナグニサン（幼虫）
- `ヤンマ科`: ギンヤンマ（幼虫）

## 特性インデックス

- `＜かばう＞`: バイオリンムシ, チョウトンボ, アントアンカブトハナムグリ, カヤキリ
- `＜くちなし＞`: カイコ
- `＜キノコパワー＞`: ヒメオビオオキノコ
- `＜ベイツ型擬態＞`: トラカミキリ
- `＜一文字＞`: イチモンジチョウ
- `＜危険察知＞`: コロギス
- `＜威嚇の面＞`: メンガタクワガタ
- `＜威圧の大角＞`: ネプチューンオオカブト
- `＜宝石昆虫＞`: ホウセキゾウムシ
- `＜尺取り＞`: ヨモギエダシャク（幼虫）
- `＜巨大昆虫＞`: アシナガオオコノハギス
- `＜巨大甲虫＞`: タイタンオオキバウスバカミキリ
- `＜巴紋＞`: オオトモエ
- `＜死骸あさり＞`: コカブトムシ
- `＜毒の体＞`: ジャコウアゲハ
- `＜水生幼虫＞`: オニヤンマ（幼虫）, ギンヤンマ（幼虫）
- `＜狂暴化＞`: マンディブラリスフタマタクワガタ
- `＜生きた化石＞`: テイオウムカシヤンマ, ムカシヤンマ, ムカシトンボ
- `＜眼状紋＞`: オオトモエ（幼虫）
- `＜軍隊連携＞`: バーチェルグンタイアリ メジャー, バーチェルグンタイアリ メディア, バーチェルグンタイアリ マイナー

## BLOCKED一覧

- なし
