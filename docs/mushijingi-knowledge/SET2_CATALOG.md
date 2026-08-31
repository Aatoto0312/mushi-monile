# 蟲神器 第2弾カード図鑑

> Version: v1.0 KNOWLEDGE-BASE
> 対象: ブースターパック第2弾 55種
> 用途: ゲームUI・ルールエンジンが参照する実装用知識ベース

## 0. 運用原則

- カード表面情報と生物分類は非公式DBを探索補助として構造化し、裁定は公式Q&Aを優先する。
- `＜○○＞` は `traits` として通常技から分離する。
- 不明点や解析不能項目は推測せず `blocked` に残す。
- 効果・裁定はゲーム実装に必要な意味へ短く整理し、ページ全体を転載しない。

## 1. 共通ソースと検証状態

- 公式Q&A: https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/
- カード探索補助（非公式）: https://mushijingi.com/
- Raw取得時刻: 2026-08-30T17:15:29.0482166Z
- 基本値・分類: `VERIFIED_SECONDARY`（公式現物との全件画像突合は未実施）
- 裁定: `OFFICIAL_QA_SUMMARY`（一致カードのみ）

## 2. 収録検査

- Expected / actual: 55 / 55
- Card-number coverage: PASS
- Card-number duplicate check: PASS
- Type total check: PASS
- 虫 / 強化 / 術: 45 / 5 / 5
- BLOCKED: 0

---

## 1/55 リュウジンオオムカデ

```yaml
officialNumber: "1/55"
name: "リュウジンオオムカデ"
set: "BOOSTER_SET_2"
rarity: "LR"
type: "INSECT"
color: "RED"
cost: 6
baseHp: 1800
skills:
  - name: "龍神の毒牙"
    baseAp: 700
    effectSummary: "このダメージは回復しない。"
traits:
  - name: "翡翠色"
    effectSummary: "これが場に出たとき青か緑の色を指定してもよい。そうしたなら、ターン終了時まで、これはその色になる。"
effectSummary: null
taxonomy:
  order: null
  family: "オオムカデ科"
  other: []
referencableTags:
  - "オオムカデ科"
  - "翡翠色"
  - "裏向き"
  - "色変更"
  - "登場時"
  - "遅延効果"
rulings:
  - "カブトムシの「すくいなげ」で裏返ったリュウジンオオムカデが表向きになると＜翡翠色＞は: いいえ。発動しません。裏返った虫は場を離れた扱いにはならず、表向きになったとき場に出たことになりません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/1/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 2/55 ハナカマキリ

```yaml
officialNumber: "2/55"
name: "ハナカマキリ"
set: "BOOSTER_SET_2"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 4
baseHp: 800
skills:
  - name: "カマ斬撃"
    baseAp: 600
    effectSummary: null
  - name: "擬態攻撃"
    baseAp: 500
    effectSummary: "この技は1度だけ使用できる。この技を使うとき自分の場に出ているほかの虫の色を指定してもよい。そうしたなら、ターン終了時まで、これはその色になる。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "ハナカマキリ科"
  other: []
referencableTags:
  - "ハナカマキリ科"
  - "色変更"
  - "遅延効果"
rulings:
  - "擬態攻撃について詳しく教えてください: 自分の場にハナカマキリ以外の虫がいる場合に使用できます。本来ハナカマキリは赤の虫ですが、擬態攻撃で指定した自分の場の虫の色（例：赤か青か緑か無色）での攻撃が可能です。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/2/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 3/55 ダイオウサソリ

```yaml
officialNumber: "3/55"
name: "ダイオウサソリ"
set: "BOOSTER_SET_2"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 5
baseHp: 1500
skills:
  - name: "きりきざむ"
    baseAp: 600
    effectSummary: null
  - name: "毒針"
    baseAp: 700
    effectSummary: "この技は1度だけ使用できる。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "コガネサソリ科"
  other: []
referencableTags:
  - "コガネサソリ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/3/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 4/55 ジョロウグモ

```yaml
officialNumber: "4/55"
name: "ジョロウグモ"
set: "BOOSTER_SET_2"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 3
baseHp: 400
skills:
  - name: "かむ"
    baseAp: 400
    effectSummary: null
  - name: "蜘蛛の巣"
    baseAp: 0
    effectSummary: "次の相手のターン、この虫が1度目に受けたダメージを0にする。※術によるダメージを含み、技の効果は無効にしない。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "ジョロウグモ科"
  other: []
referencableTags:
  - "ジョロウグモ科"
  - "遅延効果"
  - "ダメージ変更"
rulings:
  - "攻撃力0の技の攻撃のあと、800のダメージで破壊することは: はい。攻撃力0の技でも＜不死蝶の舞＞や蜘蛛の巣の効果は発揮され、次の攻撃を受けるようになります。"
  - "毒のダメージを＜不死蝶の舞＞や蜘蛛の巣の効果で0にしました。毒のダメージは蓄積しますか？: いいえ。0になった毒のダメージは蓄積しません。"
  - "退魔の蚊遣火の効果は無効に: いいえ。＜不死蝶の舞＞や蜘蛛の巣はダメージを0にする効果であるため、「破壊する」効果は無効になりません。"
  - "塵芥虫の爆熱弾のダメージは無効に: はい。＜不死蝶の舞＞や蜘蛛の巣は術カードによるダメージも0にすることができます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/4/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 5/55 キイロスズメバチ

```yaml
officialNumber: "5/55"
name: "キイロスズメバチ"
set: "BOOSTER_SET_2"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 4
baseHp: 700
skills:
  - name: "かみきる"
    baseAp: 500
    effectSummary: null
  - name: "毒針"
    baseAp: 700
    effectSummary: "この技は1度だけ使用できる。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "スズメバチ科"
  other: []
referencableTags:
  - "スズメバチ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/5/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 6/55 アシダカグモ

```yaml
officialNumber: "6/55"
name: "アシダカグモ"
set: "BOOSTER_SET_2"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 4
baseHp: 1000
skills:
  - name: "かむ"
    baseAp: 400
    effectSummary: null
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "アシダカグモ科"
  other: []
referencableTags:
  - "アシダカグモ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/6/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 7/55 エメラルドゴキブリバチ

```yaml
officialNumber: "7/55"
name: "エメラルドゴキブリバチ"
set: "BOOSTER_SET_2"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 200
skills:
  - name: "かみきる"
    baseAp: 200
    effectSummary: null
  - name: "操り針"
    baseAp: 100
    effectSummary: "この技で相手の虫を破壊したとき、それを自分の場に出す。ターン終了時にそれを破壊する。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "セナガアナバチ科"
  other: []
referencableTags:
  - "セナガアナバチ科"
  - "エサ操作"
  - "捨て札"
  - "破壊時"
  - "遅延効果"
  - "手札操作"
  - "縄張り操作"
  - "コントロール変更"
rulings:
  - "操り針で相手の虫を破壊し、自分の場に出した相手の虫は、破壊されたり手札に戻るとき、相手と自分どちらのもとにいきますか？: 相手の捨て札や手札にいきます。相手のカードが自分の手札、捨て札、エサ場、デッキに置かれることはありません。"
  - "キマダラドクバッタを操り針で破壊しました。その後カードは: 操り針で破壊できたため、キマダラドクバッタが自分の場に出ます。その後エメラルドゴキブリバチは＜トウワタ毒＞で破壊され捨て札に行きます。ターン終了時、キマダラドクバッタは破壊され、相手の捨て札に行きます。"
  - "操り針で破壊し、自分の場に出たミツツボアリは効果を使えますか？: 「場に出た時」の条件を満たすため、使えます。"
  - "操り針で破壊し、自分の場に出た虫に「反逆の蛮勇」や「繚乱の足掻き」を使うことは: はい。その場合入れ替えを行ったあと、相手のカードは相手の捨て札や手札に移動します。"
  - "操り針で破壊し、自分の場に出た虫に「空蝉の皮鎧」を使うことは: はい。その場合ターン終了時の破壊で空蝉の皮鎧が捨て札になり、虫は場に残ります。"
  - "操り針で破壊し、自分の場に出た（幼虫）の虫に「白夜の羽化」を使うことは: はい。自分の手札から（幼虫）と書かれていない同名の虫を場に出せればるなら、（幼虫）の虫は相手のエサ場にエサとして置かれます。その場合、操り針のターン終了時に破壊される効果は無効になります。"
  - "操り針でリュウジンオオムカデを破壊しました。＜翡翠色＞の色の指定は相手が縄張りを引く前ですか？後ですか？: ＜翡翠色＞の色の指定は相手が縄張りを引く前となります。虫の破壊の後に、縄張りを引くタイミングがあり、操り針は破壊したタイミングでに効果が発動するため、以下の順が正しい順番になります。 ①リュウジンオオムカデをこちらの場に出す。（＜翡翠色＞の効果発動） ②相手は縄張りを引く ③引いたカードが<飛び出す>の虫の場合<飛び出す>発動"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/7/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 8/55 オオルリオサムシ

```yaml
officialNumber: "8/55"
name: "オオルリオサムシ"
set: "BOOSTER_SET_2"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 400
skills:
  - name: "かむ"
    baseAp: 300
    effectSummary: null
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
  cardDetail: "https://mushijingi.com/card/MUSHI2/8/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 9/55 ジグモ

```yaml
officialNumber: "9/55"
name: "ジグモ"
set: "BOOSTER_SET_2"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 300
skills:
  - name: "かむ"
    baseAp: 300
    effectSummary: null
  - name: "かくれる"
    baseAp: 0
    effectSummary: "この技は1度だけ使用できる。攻撃後、次の相手のターン終了時までこの虫を裏返す。この虫は裏返しの間、いないものとして扱う。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "ジグモ科"
  other: []
referencableTags:
  - "ジグモ科"
  - "裏向き"
  - "捨て札"
  - "遅延効果"
  - "縄張り操作"
rulings:
  - "「かくれる」で攻撃した時、縄張りは引きますか？: はい。「かくれる」は攻撃後に自身を裏向きにする（いないものとする）効果ですので、縄張りを引かせた後に裏返ります。"
  - "飛蝗の凶相など、ターン終了時まで一時的に時に強化される効果を使った時にかくれるを使用しました。この場合は: ターン終了時に効果がなくなります。裏向きでいないことになっていますが、術の効果が消えるわけではないので効果が処理されます。"
  - "玉響の蠢きなど、ターン終了時に破壊される効果で場に出た時にかくれるを使用しました。この場合は: ターン終了時に破壊されます。裏向きでいないことになっていますが、術の効果が消えるわけではないので効果が処理されます。また、捨て札には表向きで置かれます。"
  - "玉響の蠢きなど、ターン終了時に破壊される効果で場に出た時に、空蝉の皮鎧をつけてからかくれるを使用しました。この場合は: ターン終了時に空蝉の皮鎧が破壊され、かくれるを使用した虫は破壊されません。強化カードはつけた虫と同時に裏向きになりますが、強化カードがついた虫への効果や修正値は無効になりません。鳳蝶の蠱惑や不滅の王台のような強化カードの効果が強化カードがついた虫以外に効果があるものは、裏向きになった際、無効となります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/9/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 10/55 ハラグロオオテントウ

```yaml
officialNumber: "10/55"
name: "ハラグロオオテントウ"
set: "BOOSTER_SET_2"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 300
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
  - "裏向き"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/10/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 11/55 オオナミザトウムシ

```yaml
officialNumber: "11/55"
name: "オオナミザトウムシ"
set: "BOOSTER_SET_2"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 3
baseHp: 500
skills:
  - name: "盲目攻撃"
    baseAp: 500
    effectSummary: "この技により虫を攻撃するとき、相手の場に虫が複数いるなら、攻撃先はその中から相手が選ぶ。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "カワザトウムシ科"
  other: []
referencableTags:
  - "カワザトウムシ科"
rulings:
  - "かくれるや＜擬態＞で選べなかったり、＜りんぷん＞などの効果が発揮されている虫が相手の場にいる場合、この虫の攻撃先はどのように選ばれますか？: その時選べる正しい対象を相手が選ぶ必要があります。＜擬態＞などで選べない虫だけが場にいる時は直接攻撃になり、＜りんぷん＞などをもつ虫がいる場合はその虫を選ばなければなりません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/11/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 12/55 キアシナガバチ

```yaml
officialNumber: "12/55"
name: "キアシナガバチ"
set: "BOOSTER_SET_2"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 300
skills:
  - name: "かみきる"
    baseAp: 200
    effectSummary: null
  - name: "毒針"
    baseAp: 400
    effectSummary: "この技は1度だけ使用できる。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "スズメバチ科"
  other: []
referencableTags:
  - "スズメバチ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/12/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 13/55 ケラ

```yaml
officialNumber: "13/55"
name: "ケラ"
set: "BOOSTER_SET_2"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 300
skills:
  - name: "ひっかく"
    baseAp: 300
    effectSummary: null
  - name: "あなを掘る"
    baseAp: 0
    effectSummary: "次の自分のターンの間、この虫の攻撃力を300増やす。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "ケラ科"
  other: []
referencableTags:
  - "ケラ科"
  - "遅延効果"
  - "ダメージ変更"
rulings:
  - "ケラ、ディティールシカクワガタの「穴を掘る」「シカツノバサミ」を２ターン連続で使用したとき、効果は重複しますか？: いいえ。重複しません。効果は次の自分のターンのみを対象とするため、その場合は重複しません。"
  - "ケラ、ディティールシカクワガタの「穴を掘る」「シカツノバサミ」を、蟷螂の構えで１ターンに連続で使用したとき、効果は重複しますか？: はい、重複します。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/13/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 14/55 ヨコヅナサシガメ

```yaml
officialNumber: "14/55"
name: "ヨコヅナサシガメ"
set: "BOOSTER_SET_2"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 1
baseHp: 100
skills:
  - name: "吸血"
    baseAp: 100
    effectSummary: "この技により、相手が縄張りを引いたとき、この虫の攻撃力と体力を100増やす。※この効果はこれが場を離れるまで継続する。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "サシガメ科"
  other: []
referencableTags:
  - "サシガメ科"
  - "裏向き"
  - "縄張り操作"
rulings:
  - "ヘラクレスサン（幼虫）の大食漢やヨコヅナサシガメの吸血の効果は累積しますか？: はい、累積します。"
  - "大食漢の効果が累積したヘラクレスサン（幼虫）をカブトムシの「すくいなげ」で裏返すと累積した効果はなく: いいえ。なくなりません。"
  - "相手が縄張りを引いたとき、＜とびだす＞が発動した場合や蜜蝋の壁を引いた場合、大食漢の効果は累積しますか？: はい、累積します。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/14/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 15/55 ハマベハサミムシ

```yaml
officialNumber: "15/55"
name: "ハマベハサミムシ"
set: "BOOSTER_SET_2"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 1
baseHp: 200
skills:
  - name: "はさむ"
    baseAp: 100
    effectSummary: null
traits:
  - name: "とびだす"
    effectSummary: "これを縄張りから引いたとき、自分の場に＜とびだす＞の技を持つ虫がいなければ、これを場に出してもよい。"
effectSummary: null
taxonomy:
  order: null
  family: "マルムネハサミムシ科"
  other: []
referencableTags:
  - "マルムネハサミムシ科"
  - "とびだす"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/15/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 16/55 アレクサンドラトリバネアゲハ

```yaml
officialNumber: "16/55"
name: "アレクサンドラトリバネアゲハ"
set: "BOOSTER_SET_2"
rarity: "LR"
type: "INSECT"
color: "BLUE"
cost: 6
baseHp: 800
skills:
  - name: "※神の吸引"
    baseAp: 1000
    effectSummary: null
traits:
  - name: "不死蝶の舞"
    effectSummary: "毎ターン、この虫が1度目に受けたダメージを0にする。※術によるダメージを含み、技の効果は無効にしない。"
effectSummary: null
taxonomy:
  order: null
  family: "アゲハチョウ科"
  other: []
referencableTags:
  - "アゲハチョウ科"
  - "不死蝶の舞"
  - "ダメージ変更"
rulings:
  - "虫の攻撃で破壊され、代わりに空蝉の皮鎧を破壊しました。＜不死蝶の舞＞の効果は再度使えますか？: いいえ。空蝉の皮鎧は破壊を無効にする効果であるため、破壊される前の状態が継続します。"
  - "攻撃力0の技の攻撃のあと、800のダメージで破壊することは: はい。攻撃力0の技でも＜不死蝶の舞＞や蜘蛛の巣の効果は発揮され、次の攻撃を受けるようになります。"
  - "毒のダメージを＜不死蝶の舞＞や蜘蛛の巣の効果で0にしました。毒のダメージは蓄積しますか？: いいえ。0になった毒のダメージは蓄積しません。"
  - "退魔の蚊遣火の効果は無効に: いいえ。＜不死蝶の舞＞や蜘蛛の巣はダメージを0にする効果であるため、「破壊する」効果は無効になりません。"
  - "塵芥虫の爆熱弾のダメージは無効に: はい。＜不死蝶の舞＞や蜘蛛の巣は術カードによるダメージも0にすることができます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/16/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 17/55 アトラスオオカブト

```yaml
officialNumber: "17/55"
name: "アトラスオオカブト"
set: "BOOSTER_SET_2"
rarity: "SR"
type: "INSECT"
color: "BLUE"
cost: 5
baseHp: 1200
skills:
  - name: "ツノ突破"
    baseAp: 700
    effectSummary: null
  - name: "ツノ串刺し"
    baseAp: 0
    effectSummary: "この技は1度だけ使用できる。この技を受けた虫の体力が減っていたなら、それを破壊する。※このとき相手は縄張りを引く。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
  - "ダメージ変更"
  - "縄張り操作"
rulings:
  - "体力が増えてる虫も、ダメージを受けたら「減っている」ことに: はい。強化カードや虫の技の効果などで最大値が増えていても、そこからダメージを受けていれば「減っている」状態になります。"
  - "毒のダメージを受けた虫は、ツノ串刺しの対象に: はい。毒のダメージでも体力は最大値より減っているため、対象になります。"
  - "体力が減っていない虫に「ツノ串刺し」を使用し: はい。体力が減っていない虫に「ツノ串刺し」は使用可能です。その場合、虫を破壊する効果は発揮されません。"
  - "アトラスオオカブトの攻撃力を500増やして、相手の虫に「ツノ串刺し」を行った場合: 相手の虫の体力が攻撃前に減っていたならば破壊されます。技の効果はダメージを与える前に発揮されます（その時、別のタイミングを指定する場合もあります）。攻撃時に体力が最大の虫に使った場合、破壊効果は発揮されず、0+500の攻撃力でダメージを与えます。"
  - "攻撃力0の技の攻撃のあと、「ツノ串刺し」で破壊することは: いいえ。100以上のダメージを与えないと「ツノ串刺し」で虫を破壊することはできません。"
  - "対戦相手に直接「ツノ串刺し」を使用: いいえ。「ツノ串刺し」は虫を対象にする技のため、対戦相手への直接攻撃には使用できません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/17/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 18/55 レックスゾウカブト

```yaml
officialNumber: "18/55"
name: "レックスゾウカブト"
set: "BOOSTER_SET_2"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 5
baseHp: 1400
skills:
  - name: "ツノ突破"
    baseAp: 600
    effectSummary: null
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
  cardDetail: "https://mushijingi.com/card/MUSHI2/18/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 19/55 テイオウゼミ

```yaml
officialNumber: "19/55"
name: "テイオウゼミ"
set: "BOOSTER_SET_2"
rarity: "SR"
type: "INSECT"
color: "BLUE"
cost: 5
baseHp: 1000
skills:
  - name: "しぼりとる"
    baseAp: 600
    effectSummary: null
traits:
  - name: "セミの帝王"
    effectSummary: "これが場に出たとき、自分の捨て札からセミ科の虫を1つ選び、場に出してもよい。その虫はこのターン攻撃できない。"
effectSummary: null
taxonomy:
  order: null
  family: "セミ科"
  other: []
referencableTags:
  - "セミ科"
  - "セミの帝王"
  - "捨て札"
  - "登場時"
  - "攻撃制限"
rulings:
  - "テイオウゼミでテイオウゼミを場に出し、その後別のセミを出すことは出来ますか？: はい、可能です。場に出た効果は、手札以外から場に出されたときも発揮します。"
  - "捨て札のテイオウゼミと場のクマゼミを、反逆の蛮勇で交換しました。テイオウゼミの効果は: はい。反逆の蛮勇で場に出た場合も、場に出た時の効果は発動します。また、クマゼミは捨て札にいくため、テイオウゼミの効果で場に出せます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/19/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 20/55 エゾゼミ

```yaml
officialNumber: "20/55"
name: "エゾゼミ"
set: "BOOSTER_SET_2"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 4
baseHp: 700
skills:
  - name: "しぼりとる"
    baseAp: 600
    effectSummary: null
traits:
  - name: "鳴く"
    effectSummary: "相手はこれ以外の虫を攻撃できない。※この技を持つ虫が複数いるとき、相手はどれかを選んで攻撃する。"
effectSummary: null
taxonomy:
  order: null
  family: "セミ科"
  other: []
referencableTags:
  - "セミ科"
  - "鳴く"
  - "攻撃制限"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/20/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 21/55 パリーフタマタクワガタ

```yaml
officialNumber: "21/55"
name: "パリーフタマタクワガタ"
set: "BOOSTER_SET_2"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 500
skills:
  - name: "はさむ"
    baseAp: 400
    effectSummary: null
  - name: "フタマタバサミ"
    baseAp: 100
    effectSummary: "相手の虫を2つ選び、それぞれに攻撃する。※1つの虫や、相手本体には使用できない。"
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
  cardDetail: "https://mushijingi.com/card/MUSHI2/21/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 22/55 ディディエールシカクワガタ

```yaml
officialNumber: "22/55"
name: "ディディエールシカクワガタ"
set: "BOOSTER_SET_2"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 500
skills:
  - name: "はさむ"
    baseAp: 400
    effectSummary: null
  - name: "シカツンバサミ"
    baseAp: 0
    effectSummary: "次の自分のターンの間、この虫の攻撃力を400増やす。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
  - "遅延効果"
  - "ダメージ変更"
rulings:
  - "ケラ、ディティールシカクワガタの「穴を掘る」「シカツノバサミ」を２ターン連続で使用したとき、効果は重複しますか？: いいえ。重複しません。効果は次の自分のターンのみを対象とするため、その場合は重複しません。"
  - "ケラ、ディティールシカクワガタの「穴を掘る」「シカツノバサミ」を、蟷螂の構えで１ターンに連続で使用したとき、効果は重複しますか？: はい、重複します。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/22/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 23/55 キアゲハ

```yaml
officialNumber: "23/55"
name: "キアゲハ"
set: "BOOSTER_SET_2"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 5
baseHp: 1400
skills:
  - name: "すいつくす"
    baseAp: 500
    effectSummary: null
traits:
  - name: "りんぷん"
    effectSummary: "相手はこれ以外の虫を攻撃できない。※この技を持つ虫が複数いるとき、相手はどれかを選んで攻撃する。"
effectSummary: null
taxonomy:
  order: null
  family: "アゲハチョウ科"
  other: []
referencableTags:
  - "アゲハチョウ科"
  - "りんぷん"
  - "攻撃制限"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/23/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 24/55 オウゴンオニクワガタ

```yaml
officialNumber: "24/55"
name: "オウゴンオニクワガタ"
set: "BOOSTER_SET_2"
rarity: "SR"
type: "INSECT"
color: "BLUE"
cost: 2
baseHp: 300
skills:
  - name: "黄金バサミ"
    baseAp: 200
    effectSummary: "この技により、相手が縄張りを引いたとき、相手は＜とびだす＞を使用できない。"
  - name: "鬼バサミ"
    baseAp: 400
    effectSummary: "この技は1度だけ使用できる。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/24/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 25/55 クラウディーナミイロタテハ

```yaml
officialNumber: "25/55"
name: "クラウディーナミイロタテハ"
set: "BOOSTER_SET_2"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 400
skills:
  - name: "すいとる"
    baseAp: 400
    effectSummary: null
  - name: "かくれる"
    baseAp: 0
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
  - "捨て札"
  - "遅延効果"
  - "縄張り操作"
rulings:
  - "「かくれる」で攻撃した時、縄張りは引きますか？: はい。「かくれる」は攻撃後に自身を裏向きにする（いないものとする）効果ですので、縄張りを引かせた後に裏返ります。"
  - "飛蝗の凶相など、ターン終了時まで一時的に時に強化される効果を使った時にかくれるを使用しました。この場合は: ターン終了時に効果がなくなります。裏向きでいないことになっていますが、術の効果が消えるわけではないので効果が処理されます。"
  - "玉響の蠢きなど、ターン終了時に破壊される効果で場に出た時にかくれるを使用しました。この場合は: ターン終了時に破壊されます。裏向きでいないことになっていますが、術の効果が消えるわけではないので効果が処理されます。また、捨て札には表向きで置かれます。"
  - "玉響の蠢きなど、ターン終了時に破壊される効果で場に出た時に、空蝉の皮鎧をつけてからかくれるを使用しました。この場合は: ターン終了時に空蝉の皮鎧が破壊され、かくれるを使用した虫は破壊されません。強化カードはつけた虫と同時に裏向きになりますが、強化カードがついた虫への効果や修正値は無効になりません。鳳蝶の蠱惑や不滅の王台のような強化カードの効果が強化カードがついた虫以外に効果があるものは、裏向きになった際、無効となります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/25/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 26/55 アサギマダラ

```yaml
officialNumber: "26/55"
name: "アサギマダラ"
set: "BOOSTER_SET_2"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 700
skills:
  - name: "すいとる"
    baseAp: 300
    effectSummary: null
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "タテハチョウ科"
  other: []
referencableTags:
  - "タテハチョウ科"
  - "ダメージ変更"
rulings:
  - "＜毒の体＞について詳しく教えてください: 毒針や毒のキバなど、技名称に「毒」が含まれる攻撃によるダメージを0にします。また、0になった毒のダメージは蓄積しません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/26/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 27/55 サツマニシキ

```yaml
officialNumber: "27/55"
name: "サツマニシキ"
set: "BOOSTER_SET_2"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 400
skills:
  - name: "すう"
    baseAp: 300
    effectSummary: null
traits:
  - name: "毒の泡"
    effectSummary: "\"この虫を破壊した虫は、次の自分のターン虫に攻撃されたとき、ダメージにかかわらず破壊される。 ※このとき相手は縄張りを引く。\""
effectSummary: null
taxonomy:
  order: null
  family: "マダラガ科"
  other: []
referencableTags:
  - "マダラガ科"
  - "毒の泡"
  - "エサ操作"
  - "破壊時"
  - "遅延効果"
  - "縄張り操作"
rulings:
  - "＜毒の泡＞を受けた虫に攻撃力0の技で攻撃すると破壊されますか？: はい。破壊されます。"
  - "＜毒の泡＞はリオックの＜エサにする＞で破壊したとき効果を発動: いいえ。できません。サツマニシキの〈毒の泡〉は虫の攻撃により、破壊されたときのみ効果を発揮します。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/27/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 28/55 ツクツクボウシ

```yaml
officialNumber: "28/55"
name: "ツクツクボウシ"
set: "BOOSTER_SET_2"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 2
baseHp: 300
skills:
  - name: "しぼりとる"
    baseAp: 300
    effectSummary: null
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "セミ科"
  other: []
referencableTags:
  - "セミ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/28/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 29/55 ベニシジミ

```yaml
officialNumber: "29/55"
name: "ベニシジミ"
set: "BOOSTER_SET_2"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 1
baseHp: 200
skills:
  - name: "すいとる"
    baseAp: 200
    effectSummary: null
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "シジミチョウ科"
  other: []
referencableTags:
  - "シジミチョウ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/29/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 30/55 チッチゼミ

```yaml
officialNumber: "30/55"
name: "チッチゼミ"
set: "BOOSTER_SET_2"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 1
baseHp: 100
skills:
  - name: "しぼりとる"
    baseAp: 200
    effectSummary: null
traits:
  - name: "とびだす"
    effectSummary: "これを縄張りから引いたとき、自分の場に＜とびだす＞の技を持つ虫がいなければ、これを場に出してもよい。"
effectSummary: null
taxonomy:
  order: null
  family: "セミ科"
  other: []
referencableTags:
  - "セミ科"
  - "とびだす"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/30/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 31/55 キマダラドクバッタ

```yaml
officialNumber: "31/55"
name: "キマダラドクバッタ"
set: "BOOSTER_SET_2"
rarity: "LR"
type: "INSECT"
color: "GREEN"
cost: 6
baseHp: 1200
skills:
  - name: "神の猛毒"
    baseAp: 1000
    effectSummary: null
traits:
  - name: "トウワタ毒"
    effectSummary: "虫の攻撃により、これが破壊されたときこの虫を破壊した虫を破壊する。"
effectSummary: null
taxonomy:
  order: null
  family: "バッタ科"
  other: []
referencableTags:
  - "バッタ科"
  - "トウワタ毒"
  - "破壊時"
  - "縄張り操作"
rulings:
  - "＜トウワタ毒＞で破壊された虫がいた場合、自分は縄張りを引きますか？: いいえ。虫の攻撃による破壊ではないため、縄張りを引きません"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/31/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 32/55 アレクサンドラトリバネアゲハ（幼虫）

```yaml
officialNumber: "32/55"
name: "アレクサンドラトリバネアゲハ（幼虫）"
set: "BOOSTER_SET_2"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 500
skills:
  - name: "かじる"
    baseAp: 400
    effectSummary: null
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "アゲハチョウ科"
  other: []
referencableTags:
  - "アゲハチョウ科"
  - "ダメージ変更"
rulings:
  - "虫の攻撃で破壊され、代わりに空蝉の皮鎧を破壊しました。＜不死蝶の舞＞の効果は再度使えますか？: いいえ。空蝉の皮鎧は破壊を無効にする効果であるため、破壊される前の状態が継続します。"
  - "攻撃力0の技の攻撃のあと、800のダメージで破壊することは: はい。攻撃力0の技でも＜不死蝶の舞＞や蜘蛛の巣の効果は発揮され、次の攻撃を受けるようになります。"
  - "毒のダメージを＜不死蝶の舞＞や蜘蛛の巣の効果で0にしました。毒のダメージは蓄積しますか？: いいえ。0になった毒のダメージは蓄積しません。"
  - "退魔の蚊遣火の効果は無効に: いいえ。＜不死蝶の舞＞や蜘蛛の巣はダメージを0にする効果であるため、「破壊する」効果は無効になりません。"
  - "塵芥虫の爆熱弾のダメージは無効に: はい。＜不死蝶の舞＞や蜘蛛の巣は術カードによるダメージも0にすることができます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/32/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 33/55 ロードハウナナフシ

```yaml
officialNumber: "33/55"
name: "ロードハウナナフシ"
set: "BOOSTER_SET_2"
rarity: "SR"
type: "INSECT"
color: "GREEN"
cost: 5
baseHp: 1200
skills:
  - name: "かぶりつく"
    baseAp: 800
    effectSummary: null
traits:
  - name: "擬態"
    effectSummary: "これは場に出た次の相手のターンに攻撃を受けない。※これ以外に虫がいないとき、直接攻撃を受ける。"
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
  cardDetail: "https://mushijingi.com/card/MUSHI2/33/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 34/55 ヘラクレスサン（幼虫）

```yaml
officialNumber: "34/55"
name: "ヘラクレスサン（幼虫）"
set: "BOOSTER_SET_2"
rarity: "SR"
type: "INSECT"
color: "GREEN"
cost: 5
baseHp: 1300
skills:
  - name: "大食漢"
    baseAp: 600
    effectSummary: "この技により、相手が縄張りを引いたとき、この虫の攻撃力と体力を200増やす。※この効果はこれが場を離れるまで継続する。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "ヤママユガ科"
  other: []
referencableTags:
  - "ヤママユガ科"
  - "裏向き"
  - "縄張り操作"
rulings:
  - "ヘラクレスサン（幼虫）の大食漢やヨコヅナサシガメの吸血の効果は累積しますか？: はい、累積します。"
  - "大食漢の効果が累積したヘラクレスサン（幼虫）をカブトムシの「すくいなげ」で裏返すと累積した効果はなく: いいえ。なくなりません。"
  - "相手が縄張りを引いたとき、＜とびだす＞が発動した場合や蜜蝋の壁を引いた場合、大食漢の効果は累積しますか？: はい、累積します。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/34/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 35/55 ヤママユ（幼虫）

```yaml
officialNumber: "35/55"
name: "ヤママユ（幼虫）"
set: "BOOSTER_SET_2"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 4
baseHp: 800
skills:
  - name: "かじる"
    baseAp: 700
    effectSummary: null
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "ヤママユガ科"
  other: []
referencableTags:
  - "ヤママユガ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/35/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 36/55 ウスバカミキリ

```yaml
officialNumber: "36/55"
name: "ウスバカミキリ"
set: "BOOSTER_SET_2"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 4
baseHp: 700
skills:
  - name: "キバ無双"
    baseAp: 600
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
  cardDetail: "https://mushijingi.com/card/MUSHI2/36/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 37/55 クルマバッタ

```yaml
officialNumber: "37/55"
name: "クルマバッタ"
set: "BOOSTER_SET_2"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 4
baseHp: 400
skills:
  - name: "とびはねる"
    baseAp: 500
    effectSummary: null
traits:
  - name: "とびだす"
    effectSummary: "これを縄張りから引いたとき、自分の場に＜とびだす＞の技を持つ虫がいなければ、これを場に出してもよい。"
effectSummary: null
taxonomy:
  order: null
  family: "バッタ科"
  other: []
referencableTags:
  - "バッタ科"
  - "とびだす"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/37/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 38/55 クビアカツヤカミキリ

```yaml
officialNumber: "38/55"
name: "クビアカツヤカミキリ"
set: "BOOSTER_SET_2"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 4
baseHp: 800
skills:
  - name: "くいちぎ"
    baseAp: 500
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
  cardDetail: "https://mushijingi.com/card/MUSHI2/38/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 39/55 ルリボシカミキリ

```yaml
officialNumber: "39/55"
name: "ルリボシカミキリ"
set: "BOOSTER_SET_2"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 400
skills:
  - name: "くいちぎる"
    baseAp: 500
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
  cardDetail: "https://mushijingi.com/card/MUSHI2/39/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 40/55 プラチナコガネ

```yaml
officialNumber: "40/55"
name: "プラチナコガネ"
set: "BOOSTER_SET_2"
rarity: "SR"
type: "INSECT"
color: "GREEN"
cost: 1
baseHp: 200
skills:
  - name: "シロガネタックル"
    baseAp: 200
    effectSummary: "この技により相手が縄張りを引いたとき、相手のエサを1つ選び裏返してもよい。※裏向きのエサはコストを発生するが、色を失い虫の技やカードの効果の対象に選べなくなる。"
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
  - "縄張り操作"
rulings:
  - "シロガネタックルで裏返ったエサはどのようなカードに影響がありますか？: 瀬戸際の蟲時雨、蜻蛉の閃き、斑猫の手招きなどの術カードや、サバクトビバッタの技の効果の対象に選べなくなります。 また、ヒアリなどの色のあるエサを参照するカードで参照されなくなります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/40/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 41/55 アサギマダラ（幼虫）

```yaml
officialNumber: "41/55"
name: "アサギマダラ（幼虫）"
set: "BOOSTER_SET_2"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 400
skills:
  - name: "かじる"
    baseAp: 300
    effectSummary: null
traits:
  - name: "毒の体"
    effectSummary: "これが受ける相手の虫の毒とつく技のダメージを0にする。"
effectSummary: null
taxonomy:
  order: null
  family: "タテハチョウ科"
  other: []
referencableTags:
  - "タテハチョウ科"
  - "毒の体"
  - "ダメージ変更"
rulings:
  - "＜毒の体＞について詳しく教えてください: 毒針や毒のキバなど、技名称に「毒」が含まれる攻撃によるダメージを0にします。また、0になった毒のダメージは蓄積しません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/41/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 42/55 カレハバッタ

```yaml
officialNumber: "42/55"
name: "カレハバッタ"
set: "BOOSTER_SET_2"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 200
skills:
  - name: "はねる"
    baseAp: 300
    effectSummary: null
traits:
  - name: "擬態"
    effectSummary: "これは場に出た次の相手のターンに攻撃を受けない。※これ以外に虫がいないとき、直接攻撃を受ける。"
effectSummary: null
taxonomy:
  order: null
  family: "バッタ科"
  other: []
referencableTags:
  - "バッタ科"
  - "擬態"
  - "攻撃制限"
  - "遅延効果"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/42/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 43/55 クロカミキリ

```yaml
officialNumber: "43/55"
name: "クロカミキリ"
set: "BOOSTER_SET_2"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 400
skills:
  - name: "くいちぎる"
    baseAp: 200
    effectSummary: null
  - name: "首を鳴らす"
    baseAp: 100
    effectSummary: "次の相手のターンの間、この虫の体力を100増やす。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "カミキリムシ科"
  other: []
referencableTags:
  - "カミキリムシ科"
  - "遅延効果"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/43/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 44/55 トビイロウンカ

```yaml
officialNumber: "44/55"
name: "トビイロウンカ"
set: "BOOSTER_SET_2"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 1
baseHp: 200
skills:
  - name: "すう"
    baseAp: 100
    effectSummary: null
traits:
  - name: "とびだす"
    effectSummary: "これを縄張りから引いたとき、自分の場に＜とびだす＞の技を持つ虫がいなければ、これを場に出してもよい。"
effectSummary: null
taxonomy:
  order: null
  family: "ウンカ科"
  other: []
referencableTags:
  - "ウンカ科"
  - "とびだす"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/44/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 45/55 シロオビアワフキ（幼虫）

```yaml
officialNumber: "45/55"
name: "シロオビアワフキ（幼虫）"
set: "BOOSTER_SET_2"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 1
baseHp: 500
skills: []
traits:
  - name: "泡のまもり"
    effectSummary: "これは攻撃できない。これは相手の術カードの対象にならない。"
effectSummary: null
taxonomy:
  order: null
  family: "アワフキムシ科"
  other: []
referencableTags:
  - "アワフキムシ科"
  - "泡のまもり"
  - "攻撃制限"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/45/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 46/55 無欠の息吹

```yaml
officialNumber: "46/55"
name: "無欠の息吹"
set: "BOOSTER_SET_2"
rarity: "R"
type: "ENHANCEMENT"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectSummary: "この虫は、色による2倍のダメージを受けない。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/46/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 47/55 蚰蜒の足切り

```yaml
officialNumber: "47/55"
name: "蚰蜒の足切り"
set: "BOOSTER_SET_2"
rarity: "N"
type: "ENHANCEMENT"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "この虫が虫の攻撃を受けたとき、受けたダメージを0にし、これを破壊する。※技の効果は無効にしない。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "遅延効果"
  - "ダメージ変更"
rulings:
  - "塵芥虫の爆熱弾のダメージは無効に: いいえ。蚰蜒の足切りは虫の攻撃によるダメージのみを0にすることができます。"
  - "蚰蜒の足切りをアレクサンドラトリバネアゲハにつけると＜不死蝶の舞＞と蚰蜒の足切りの効果で虫の攻撃によるダメージをを2回、0に出来ますか？: いいえ。1回の攻撃で＜不死蝶の舞＞の効果は無効になり、蚰蜒の足切りは破壊されます。＜不死蝶の舞＞がダメージを０にしたのち、そのダメージを蚰蜒の足切り0にし、蚰蜒の足切りが破壊となります。"
  - "蚰蜒の足切りを2枚付けた虫が攻撃を受けた場合: 蚰蜒の足切りが2枚付いていても、虫の攻撃によるダメージを0に出来るのは1回となります。片方の蚰蜒の足切りの効果に0になったダメージにより、もう片方の蚰蜒の足切りの効果も発動し破壊されます。"
  - "蚰蜒の足切りをつけたアサギマダラに「毒針」で攻撃すると蚰蜒の足切りは破壊されますか？: はい。破壊されます。＜毒の体＞がダメージを０にしたのち、そのダメージを蚰蜒の足切りが０にし、蚰蜒の足切りが破壊となります。"
  - "蚰蜒の足切りがついた虫が＜毒の泡＞の効果を受け、攻撃をうけると: 蚰蜒の足切りの効果でダメージは0になりますが、攻撃を受けた虫は０のダメージを受ける為、ダメージに関わらず破壊となります。"
  - "蚰蜒の足切りをつけたジョロウグモで蜘蛛の巣を使用しました。このジョロウグモは次の相手のターン、虫の攻撃によるダメージを2回、0に出来ますか？: いいえ。次の相手ターン、虫の攻撃によるダメージを0に出来るのは1回となります。この場合、詳細には蚰蜒の足切りの効果と蜘蛛の巣の効果のどちらを先に使うか選択となりますが、どちらを選択しても、0になったダメージにより、効果を使わなかったほうの効果も発動となります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/47/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 48/55 金蚉の甲冑

```yaml
officialNumber: "48/55"
name: "金蚉の甲冑"
set: "BOOSTER_SET_2"
rarity: "R"
type: "ENHANCEMENT"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectSummary: "この虫の体力と攻撃力を300増やす。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/48/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 49/55 兜虫の甲冑

```yaml
officialNumber: "49/55"
name: "兜虫の甲冑"
set: "BOOSTER_SET_2"
rarity: "LR"
type: "ENHANCEMENT"
color: null
cost: 2
baseHp: null
skills: []
traits: []
effectSummary: "この虫の体力と攻撃力を500増やす。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/49/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 50/55 口寄せの時蛹

```yaml
officialNumber: "50/55"
name: "口寄せの時蛹"
set: "BOOSTER_SET_2"
rarity: "SR"
type: "ENHANCEMENT"
color: null
cost: 4
baseHp: null
skills: []
traits: []
effectSummary: "手札から虫カードを1つ選び、これをつけて場に出す。この虫はこれがついている限り、攻撃できない。次の相手のターン終了時にこれを破壊する。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "攻撃制限"
  - "遅延効果"
rulings:
  - "使用後、螻蛄の七芸で口寄せの時蛹を別の虫に移動させた時、どのように: 口寄せの時蛹をつけていた虫が攻撃可能になります。なお、改めて口寄せの時蛹をつけた虫は攻撃が出来なくなりますが、攻撃済みの虫を選択しても大丈夫です。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/50/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 51/55 白夜の羽化

```yaml
officialNumber: "51/55"
name: "白夜の羽化"
set: "BOOSTER_SET_2"
rarity: "R"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "自分の場に出ている（幼虫）と書かれた虫を1つ選んでエサ場に置き、その虫と同名の（幼虫）と書かれていない虫を手札から場に出す。※このエサのコストはこのターン発生しない。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "エサ操作"
  - "遅延効果"
rulings:
  - "（幼虫）と書かれたカードのみが手札にある時、このカードは使えますか？: いいえ。（幼虫）のカードと（幼虫）と書かれていない同名のカードが揃っていない限り、このカードは使用できません。"
  - "攻撃後の（幼虫）をエサ場に移動させた後、成虫による攻撃は可能ですか？: はい、可能です。"
  - "玉響の蠢きなど、術カードの効果で場に出た（幼虫）に使用できますか？使用できる場合、エサ場に置いた（幼虫）はターン終了時に破壊されますか？: はい、可能です。エサ場に置いた幼虫はターン終了時に破壊されません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/51/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 52/55 蟲祓いの煙幕

```yaml
officialNumber: "52/55"
name: "蟲祓いの煙幕"
set: "BOOSTER_SET_2"
rarity: "N"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "ターン終了時まで、相手が縄張りを引いたとき＜とびだす＞は使用できない。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "遅延効果"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/52/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 53/55 電気虫の稲妻

```yaml
officialNumber: "53/55"
name: "電気虫の稲妻"
set: "BOOSTER_SET_2"
rarity: "R"
type: "SPELL"
color: null
cost: 2
baseHp: null
skills: []
traits: []
effectSummary: "相手の虫を1つ選ぶ。その虫に1000のダメージを与える。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/53/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 54/55 金色の顎門

```yaml
officialNumber: "54/55"
name: "金色の顎門"
set: "BOOSTER_SET_2"
rarity: "R"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "自分の虫を1つ選ぶ。ターン終了時まで、その虫の攻撃力を500増やす。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "遅延効果"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/54/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 55/55 蟻の収穫

```yaml
officialNumber: "55/55"
name: "蟻の収穫"
set: "BOOSTER_SET_2"
rarity: "N"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "自分のエサ場にある強化カードか術カードを1つ選び、手札に戻す。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "エサ操作"
  - "手札操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI2/55/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%92%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 分類インデックス

- `アゲハチョウ科`: アレクサンドラトリバネアゲハ, キアゲハ, アレクサンドラトリバネアゲハ（幼虫）
- `アシダカグモ科`: アシダカグモ
- `アワフキムシ科`: シロオビアワフキ（幼虫）
- `ウンカ科`: トビイロウンカ
- `オオムカデ科`: リュウジンオオムカデ
- `オサムシ科`: オオルリオサムシ
- `カミキリムシ科`: ウスバカミキリ, クビアカツヤカミキリ, ルリボシカミキリ, クロカミキリ
- `カワザトウムシ科`: オオナミザトウムシ
- `クワガタムシ科`: パリーフタマタクワガタ, ディディエールシカクワガタ, オウゴンオニクワガタ
- `ケラ科`: ケラ
- `コガネサソリ科`: ダイオウサソリ
- `コガネムシ科`: アトラスオオカブト, レックスゾウカブト, プラチナコガネ
- `サシガメ科`: ヨコヅナサシガメ
- `シジミチョウ科`: ベニシジミ
- `ジグモ科`: ジグモ
- `ジョロウグモ科`: ジョロウグモ
- `スズメバチ科`: キイロスズメバチ, キアシナガバチ
- `セナガアナバチ科`: エメラルドゴキブリバチ
- `セミ科`: テイオウゼミ, エゾゼミ, ツクツクボウシ, チッチゼミ
- `タテハチョウ科`: クラウディーナミイロタテハ, アサギマダラ, アサギマダラ（幼虫）
- `テントウムシ科`: ハラグロオオテントウ
- `ナナフシ科`: ロードハウナナフシ
- `ハナカマキリ科`: ハナカマキリ
- `バッタ科`: キマダラドクバッタ, クルマバッタ, カレハバッタ
- `マダラガ科`: サツマニシキ
- `マルムネハサミムシ科`: ハマベハサミムシ
- `ヤママユガ科`: ヘラクレスサン（幼虫）, ヤママユ（幼虫）

## 特性インデックス

- `＜とびだす＞`: ハマベハサミムシ, チッチゼミ, クルマバッタ, トビイロウンカ
- `＜りんぷん＞`: キアゲハ
- `＜セミの帝王＞`: テイオウゼミ
- `＜トウワタ毒＞`: キマダラドクバッタ
- `＜不死蝶の舞＞`: アレクサンドラトリバネアゲハ
- `＜擬態＞`: ロードハウナナフシ, カレハバッタ
- `＜毒の体＞`: アサギマダラ（幼虫）
- `＜毒の泡＞`: サツマニシキ
- `＜泡のまもり＞`: シロオビアワフキ（幼虫）
- `＜翡翠色＞`: リュウジンオオムカデ
- `＜鳴く＞`: エゾゼミ

## BLOCKED一覧

- なし
