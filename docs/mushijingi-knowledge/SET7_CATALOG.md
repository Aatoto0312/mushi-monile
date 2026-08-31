# 蟲神器 第7弾カード図鑑

> Version: v1.0 KNOWLEDGE-BASE
> 対象: ブースターパック第7弾 64種
> 用途: ゲームUI・ルールエンジンが参照する実装用知識ベース

## 0. 運用原則

- カード表面情報と生物分類は非公式DBを探索補助として構造化し、裁定は公式Q&Aを優先する。
- `＜○○＞` は `traits` として通常技から分離する。
- 不明点や解析不能項目は推測せず `blocked` に残す。
- 効果・裁定はゲーム実装に必要な意味へ短く整理し、ページ全体を転載しない。

## 1. 共通ソースと検証状態

- 公式Q&A: https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/
- カード探索補助（非公式）: https://mushijingi.com/
- Raw取得時刻: 2026-08-30T17:24:14.3714474Z
- 基本値・分類: `VERIFIED_SECONDARY`（公式現物との全件画像突合は未実施）
- 裁定: `OFFICIAL_QA_SUMMARY`（一致カードのみ）

## 2. 収録検査

- Expected / actual: 64 / 64
- Card-number coverage: PASS
- Card-number duplicate check: PASS
- Type total check: PASS
- 虫 / 強化 / 術: 50 / 6 / 8
- BLOCKED: 0

---

## 1/64 オオスズメバチ（女王）

```yaml
officialNumber: "1/64"
name: "オオスズメバチ（女王）"
set: "BOOSTER_SET_7"
rarity: "LR"
type: "INSECT"
color: "RED"
cost: 6
baseHp: 1700
skills:
  - name: "神の産卵"
    baseAp: 1000
    effectSummary: "攻撃後、自分のエサ場からコスト5以下の～バチ科の虫を1つ選び、裏向きで場に出してもよい。次の自分のターン開始時にそれを表向きにする。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "スズメバチ科"
  other: []
referencableTags:
  - "スズメバチ科"
  - "裏向き"
  - "エサ操作"
  - "破壊時"
  - "遅延効果"
  - "縄張り操作"
rulings:
  - "\"神の産卵\"で出すエサ場のコスト５以下の～バチ科の虫は 裏返しになっているものを選べますか？: いいえ、裏返しのエサは選ぶことができません。 エサ場で裏返しになっているコスト５以下の～バチ科の虫を選んで場に出せません。"
  - "4/17追記 [オオスズメバチ女王]で自分の[オオトモエ]が破壊されました。 相手のエサ場に[オオスズメバチ]があるとき、\"神の産卵\"で場に出る前に裏返すことは: はい、できます。 [オオトモエ]の＜巴紋＞は「破壊されたとき」に発動する効果です。破壊されたタイミングで処理され、縄張りをひき、攻撃が終了した際に[オオスズメバチ女王]の\"神の産卵\"による「攻撃後」が処理されるため、相手のエサ場に[オオスズメバチ]は\"神の産卵\"の対象になる前に裏返すことができます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/1/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 2/64 タランチュラホーク

```yaml
officialNumber: "2/64"
name: "タランチュラホーク"
set: "BOOSTER_SET_7"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 5
baseHp: 1200
skills:
  - name: "かみきる"
    baseAp: 600
    effectSummary: null
  - name: "ホークアイ"
    baseAp: 900
    effectSummary: "この技は＜＞の技を持つ虫にしか使用できない。この技を受けた虫は、ターン終了時まで「破壊されたとき」、「破壊されるとき」と書かれた＜＞の技を使用できない。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "クモバチ科"
  other: []
referencableTags:
  - "クモバチ科"
  - "破壊時"
  - "攻撃制限"
  - "遅延効果"
  - "縄張り操作"
rulings:
  - "[武勇の面頬]をつけたことにより＜とびだす＞を失っている相手の[ミンミンゼミ]に [タランチュラホーク]の\"ホークアイ\"で攻撃することは: いいえ、できません。 効果などで＜＞の技を失っている虫は、＜＞の技を持たない扱いとなるため、\"ホークアイ\"で攻撃することができません。"
  - "[針金虫の道連れ]がついた相手の虫を、\"ホークアイ\"で攻撃して破壊しました。 相手の[針金虫の道連れ]効果、「この虫が破壊されたとき、この虫を破壊した虫を破壊する。」で[タランチュ: はい、破壊されます。 \"ホークアイ\"で使用できないのは＜＞の技です。 [針金虫の道連れ]の効果は強化カードによるものなので影響はありません。"
  - "＜毒霧散布＞には「※この効果により虫が破壊されたとき、相手は縄張りを引かない。」と書かれていますが、＜毒霧散布＞を\"ホークアイ\"で使用できなくすることは: いいえ、できません。 ※で書かれた文章はルールや処理の補足をする文章のため、「破壊されたとき」と書かれたなどの指定がある効果で指定されていても、書かれていないものとして扱います。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/2/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 3/64 オオスズメバチ

```yaml
officialNumber: "3/64"
name: "オオスズメバチ"
set: "BOOSTER_SET_7"
rarity: "UR"
type: "INSECT"
color: "RED"
cost: 5
baseHp: 1300
skills:
  - name: "かみきる"
    baseAp: 700
    effectSummary: null
  - name: "毒針"
    baseAp: 900
    effectSummary: "この技は1度だけ使用できる。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "スズメバチ科"
  other: []
referencableTags:
  - "スズメバチ科"
  - "裏向き"
  - "エサ操作"
  - "破壊時"
  - "縄張り操作"
rulings:
  - "\"神の産卵\"で出すエサ場のコスト５以下の～バチ科の虫は 裏返しになっているものを選べますか？: いいえ、裏返しのエサは選ぶことができません。 エサ場で裏返しになっているコスト５以下の～バチ科の虫を選んで場に出せません。"
  - "4/17追記 [オオスズメバチ女王]で自分の[オオトモエ]が破壊されました。 相手のエサ場に[オオスズメバチ]があるとき、\"神の産卵\"で場に出る前に裏返すことは: はい、できます。 [オオトモエ]の＜巴紋＞は「破壊されたとき」に発動する効果です。破壊されたタイミングで処理され、縄張りをひき、攻撃が終了した際に[オオスズメバチ女王]の\"神の産卵\"による「攻撃後」が処理されるため、相手のエサ場に[オオスズメバチ]は\"神の産卵\"の対象になる前に裏返すことができます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/3/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 4/64 トビズムカデ

```yaml
officialNumber: "4/64"
name: "トビズムカデ"
set: "BOOSTER_SET_7"
rarity: "UR"
type: "INSECT"
color: "RED"
cost: 5
baseHp: 1100
skills:
  - name: "キバ"
    baseAp: 900
    effectSummary: null
  - name: "猛毒のキバ"
    baseAp: 0
    effectSummary: "この技を受けた虫は、次にダメージを受けたとき破壊される。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "オオムカデ科"
  other: []
referencableTags:
  - "オオムカデ科"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/4/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 5/64 ケンランカマキリ

```yaml
officialNumber: "5/64"
name: "ケンランカマキリ"
set: "BOOSTER_SET_7"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 3
baseHp: 400
skills:
  - name: "カマ斬撃"
    baseAp: 400
    effectSummary: null
traits:
  - name: "生きた化石"
    effectSummary: "自分の捨て札にある＜生きた化石＞を持つ虫1つにつき、これのコストを1減らす。"
effectSummary: null
taxonomy:
  order: null
  family: "ケンランカマキリ科"
  other: []
referencableTags:
  - "ケンランカマキリ科"
  - "生きた化石"
  - "捨て札"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/5/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 6/64 アオオサムシ

```yaml
officialNumber: "6/64"
name: "アオオサムシ"
set: "BOOSTER_SET_7"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 4
baseHp: 400
skills:
  - name: "かみきる"
    baseAp: 500
    effectSummary: null
traits:
  - name: "色彩の加護"
    effectSummary: "自分のエサ場の虫の色1種類につき、これのコストを1減らす。"
effectSummary: null
taxonomy:
  order: null
  family: "オサムシ科"
  other: []
referencableTags:
  - "オサムシ科"
  - "色彩の加護"
  - "エサ操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/6/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 7/64 ウスバカマキリ

```yaml
officialNumber: "7/64"
name: "ウスバカマキリ"
set: "BOOSTER_SET_7"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 3
baseHp: 500
skills:
  - name: "カマ斬撃"
    baseAp: 500
    effectSummary: null
traits:
  - name: "無紋"
    effectSummary: "これが場に出たとき、自分のエサを2つまで選び、裏向きにしてもよい。そうしたなら、この虫の体力と攻撃力を100増やす。"
effectSummary: null
taxonomy:
  order: null
  family: "カマキリ科"
  other: []
referencableTags:
  - "カマキリ科"
  - "無紋"
  - "裏向き"
  - "エサ操作"
  - "登場時"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/7/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 8/64 ウスバキトンボ

```yaml
officialNumber: "8/64"
name: "ウスバキトンボ"
set: "BOOSTER_SET_7"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 300
skills:
  - name: "とびかかる"
    baseAp: 300
    effectSummary: null
  - name: "盆トンボ"
    baseAp: 0
    effectSummary: "相手の捨て札から虫を１つ選び、山札の１番下に置いてもよい。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "トンボ科"
  other: []
referencableTags:
  - "トンボ科"
  - "捨て札"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/8/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 9/64 オオシオカラトンボ

```yaml
officialNumber: "9/64"
name: "オオシオカラトンボ"
set: "BOOSTER_SET_7"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 3
baseHp: 500
skills:
  - name: "とびかかる"
    baseAp: 500
    effectSummary: null
traits:
  - name: "塩辛"
    effectSummary: "これが場に出たとき、これ以外の自分の～トンボ科、～ヤンマ科の虫を１つ選び、ターン終了時まで攻撃力を300増やしてもよい。"
effectSummary: null
taxonomy:
  order: null
  family: "トンボ科"
  other: []
referencableTags:
  - "トンボ科"
  - "塩辛"
  - "登場時"
  - "遅延効果"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/9/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 10/64 ナツアカネ

```yaml
officialNumber: "10/64"
name: "ナツアカネ"
set: "BOOSTER_SET_7"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 300
skills:
  - name: "とびかかる"
    baseAp: 300
    effectSummary: null
traits:
  - name: "赤とんぼ"
    effectSummary: "自分の場にアキアカネがいるなら、これのコストを１減らす。"
effectSummary: null
taxonomy:
  order: null
  family: "トンボ科"
  other: []
referencableTags:
  - "トンボ科"
  - "赤とんぼ"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/10/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 11/64 アカオニグモ

```yaml
officialNumber: "11/64"
name: "アカオニグモ"
set: "BOOSTER_SET_7"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 100
skills:
  - name: "かむ"
    baseAp: 300
    effectSummary: null
  - name: "赤鬼の巣"
    baseAp: 0
    effectSummary: "次の相手のターン、この虫が１度目に受けた虫の攻撃によるダメージを０にする。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "コガネグモ科"
  other: []
referencableTags:
  - "コガネグモ科"
  - "遅延効果"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/11/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 12/64 アオオニグモ

```yaml
officialNumber: "12/64"
name: "アオオニグモ"
set: "BOOSTER_SET_7"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 1
baseHp: 100
skills:
  - name: "かむ"
    baseAp: 200
    effectSummary: null
  - name: "青鬼の巣"
    baseAp: 0
    effectSummary: "次の相手のターン、この虫が１度目に受けた術カードによるダメージを０にする。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "コガネグモ科"
  other: []
referencableTags:
  - "コガネグモ科"
  - "遅延効果"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/12/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 13/64 オオヒラタシデムシ（幼虫）

```yaml
officialNumber: "13/64"
name: "オオヒラタシデムシ（幼虫）"
set: "BOOSTER_SET_7"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 1
baseHp: 200
skills:
  - name: "屍喰らい"
    baseAp: 200
    effectSummary: "この技により相手が縄張りを引いたとき、相手の捨て札から虫を１つ選び、山札の１番下に置いてもよい。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "シデムシ科"
  other: []
referencableTags:
  - "シデムシ科"
  - "捨て札"
  - "縄張り操作"
rulings:
  - "4/17追記 相手の場には[ヒグラシ]があります。この虫を\"屍喰らい\"で破壊した場合、[ヒグラシ]は\"屍喰らい\"の対象に: はい、できます。 攻撃によって破壊した後、相手は縄張りを引きます。[ヒグラシ]は縄張りを引く前に破壊されて捨て札にあるため、「縄張りを引いたとき」に発動できる\"屍喰らい\"の対象に選ぶことができます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/13/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 14/64 アリグモ

```yaml
officialNumber: "14/64"
name: "アリグモ"
set: "BOOSTER_SET_7"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 1
baseHp: 200
skills:
  - name: "かみつく"
    baseAp: 200
    effectSummary: null
traits:
  - name: "ベイツ型擬態"
    effectSummary: "自分の場に、ほかの虫がいるなら、この虫は攻撃を受けない。※この技を持つ虫だけが、複数いるとき、相手はどれかを選んで攻撃する。"
effectSummary: null
taxonomy:
  order: null
  family: "ハエトリグモ科"
  other: []
referencableTags:
  - "ハエトリグモ科"
  - "ベイツ型擬態"
  - "攻撃制限"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/14/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 15/64 キカマキリモドキ

```yaml
officialNumber: "15/64"
name: "キカマキリモドキ"
set: "BOOSTER_SET_7"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 1
baseHp: 100
skills:
  - name: "カマ斬撃"
    baseAp: 200
    effectSummary: null
  - name: "バグイーター"
    baseAp: 400
    effectSummary: "この技はコスト１以下の虫にしか使用できない。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "カマキリモドキ科"
  other: []
referencableTags:
  - "カマキリモドキ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/15/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 16/64 スマトラオオヒラタクワガタ

```yaml
officialNumber: "16/64"
name: "スマトラオオヒラタクワガタ"
set: "BOOSTER_SET_7"
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
  - name: "スマトラ大自然"
    effectSummary: "自分のエサ場に赤と青と緑のエサがあるとき、この虫の攻撃力を800増やす。"
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
  - "スマトラ大自然"
  - "エサ操作"
  - "ダメージ変更"
rulings:
  - "自分のエサ場に赤、青、緑以外に無色エサがあるときも ＜スマトラ大自然＞で攻撃力が800増えますか？: はい、攻撃力が800増えます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/16/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 17/64 マルスゾウカブト

```yaml
officialNumber: "17/64"
name: "マルスゾウカブト"
set: "BOOSTER_SET_7"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 5
baseHp: 1300
skills:
  - name: "ツノ突破"
    baseAp: 700
    effectSummary: null
  - name: "軍神"
    baseAp: 1400
    effectSummary: "この技は1度だけ使用できる。この技は無色の虫にしか使用できない。"
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
  cardDetail: "https://mushijingi.com/card/MUSHI7/17/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 18/64 アルキデスヒラタクワガタ

```yaml
officialNumber: "18/64"
name: "アルキデスヒラタクワガタ"
set: "BOOSTER_SET_7"
rarity: "SR"
type: "INSECT"
color: "BLUE"
cost: 5
baseHp: 1100
skills:
  - name: "オオアゴバサミ"
    baseAp: 800
    effectSummary: null
  - name: "万力バサミ"
    baseAp: 2000
    effectSummary: "この技は強化カードがついた虫にしか使用できない。"
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
  cardDetail: "https://mushijingi.com/card/MUSHI7/18/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 19/64 ニシキオオツバメガ

```yaml
officialNumber: "19/64"
name: "ニシキオオツバメガ"
set: "BOOSTER_SET_7"
rarity: "UR"
type: "INSECT"
color: "BLUE"
cost: 6
baseHp: 1000
skills:
  - name: "すいつくす"
    baseAp: 800
    effectSummary: null
traits:
  - name: "色彩の加護"
    effectSummary: "自分のエサ場の虫の色1種類につき、これのコストを1減らす。"
effectSummary: null
taxonomy:
  order: null
  family: "ツバメガ科"
  other: []
referencableTags:
  - "ツバメガ科"
  - "色彩の加護"
  - "エサ操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/19/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 20/64 カブトムシ

```yaml
officialNumber: "20/64"
name: "カブトムシ"
set: "BOOSTER_SET_7"
rarity: "UR"
type: "INSECT"
color: "BLUE"
cost: 4
baseHp: 800
skills:
  - name: "ツノ突進"
    baseAp: 500
    effectSummary: null
  - name: "王者のツノ"
    baseAp: 600
    effectSummary: "この技は1度だけ使用できる。この技はすべての虫に色による2倍のダメージを与える。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
  - "エサ操作"
  - "捨て札"
  - "遅延効果"
  - "ダメージ変更"
rulings:
  - "自分の場に[ユカタンビワハゴロモ]があるときに、相手が０コストの術カード[宿命の影写し]を使用しました。[宿命の影写し]の効果」でエサ場の４コストの虫[カブトムシ]を選んで支払う４: いいえ、支払いません。その場合、相手は[宿命の影写し]の０コストを支払い使用し、術カードの効果が発揮される前に ＜超神通力＞が発揮され、相手が使用した[宿命の影写し]が打ち消されるため、「その虫と同数のコストを支払い、選んだ虫を場に出す。」効果は発揮されないため、[カブトムシ]の４コストは支払いません。"
  - "攻撃力600の\"王者のツノ\"で赤の虫に攻撃した場合、 \"王者のツノ\"の効果と色による２倍ダメージを合わせて４倍の2400ダメージに: いいえ、４倍にはなりません。 \"王者のツノ\"の効果は攻撃する虫と攻撃を受ける虫の色にかかわらず、色による２倍のダメージを与える効果になります。攻撃力が600であるなら、どの色の虫にも1200ダメージを与えます。"
  - "攻撃力600の\"王者のツノ\"で攻撃された虫が、色による２倍のダメージを受けない[無欠の息吹]をつけていた場合、\"王者のツノ\"攻撃で与えるダメージは２倍に: いいえ、２倍になりません。 [無欠の息吹]の「色による２倍のダメージを受けない。」が優先されます。 複数の効果により「与える(できる)」「受けない(できない)」が同時にある場合、「受けない(できない)」効果が優先されます。"
  - "[玉響の蠢き]で場に[カブトムシ]を出し、相手に攻撃した後に[拝虫の豪斬剣]を使用して、捨て札の[空蝉の皮鎧]を[カブトムシ]につけ、もう１度攻撃してターンを終了しました。 ターン: はい、残ります。 蟲神器では同時に発揮された効果はターンプレイヤー、非ターンプレイヤーの順で処理し、その処理順は自由に決めることが可能です。 今回のようにターン終了時に破壊される効果を受けた[カブトムシ]と[空蝉の皮鎧]が場にある状態で、[カブトムシ]の破壊を[空蝉の皮鎧]の効果で処理した場合、破壊される効果を受けた[空蝉の皮鎧]はすでに場を離れているため、処理は行われずにターンが終了します。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/20/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 21/64 オオムラサキ

```yaml
officialNumber: "21/64"
name: "オオムラサキ"
set: "BOOSTER_SET_7"
rarity: "UR"
type: "INSECT"
color: "BLUE"
cost: 5
baseHp: 1200
skills:
  - name: "すいつくす"
    baseAp: 800
    effectSummary: null
traits:
  - name: "ヤマト紫"
    effectSummary: "自分の裏向きのエサ2つにつき、これのコストを1減らす。"
effectSummary: null
taxonomy:
  order: null
  family: "タテハチョウ科"
  other: []
referencableTags:
  - "タテハチョウ科"
  - "ヤマト紫"
  - "裏向き"
  - "エサ操作"
rulings:
  - "4/17追記 自分のエサ場に[オオムラサキ（幼虫）]があるときに[花蝶の幻舞]を使用しました。その直後に[供物の封印]を使用してでエサ場の[オオムラサキ（幼虫）]を裏返した場合、手: いいえ、減りません。 [花蝶の幻舞]は「自分のエサ場に（幼虫）と書かれた虫がいるなら」効果を発揮するカードです。使用後にエサ場から（幼虫）と書かれた虫がいなくなったり、参照できなくなった場合には条件を達成できません。また、使用後にエサ場に増えた（幼虫）と書かれた虫でも条件を達することができます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/21/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 22/64 マレーテナガコガネ

```yaml
officialNumber: "22/64"
name: "マレーテナガコガネ"
set: "BOOSTER_SET_7"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 5
baseHp: 1200
skills:
  - name: "たいあたり"
    baseAp: 800
    effectSummary: null
  - name: "テナガ強撃"
    baseAp: 1000
    effectSummary: "この技は相手の場に虫が2つ以上いないと使用できない。"
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
  cardDetail: "https://mushijingi.com/card/MUSHI7/22/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 23/64 ユカタンビワハゴロモ

```yaml
officialNumber: "23/64"
name: "ユカタンビワハゴロモ"
set: "BOOSTER_SET_7"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 4
baseHp: 900
skills:
  - name: "しぼりとる"
    baseAp: 500
    effectSummary: null
traits:
  - name: "超神通力"
    effectSummary: "相手が術カードを使用したとき、これを破壊する。その後、その術カードを打ち消す。※使用したカードのコストは支払われるが、効果は発揮されず捨て札に置かれる。"
effectSummary: null
taxonomy:
  order: null
  family: "ビワハゴロモ科"
  other: []
referencableTags:
  - "ビワハゴロモ科"
  - "超神通力"
  - "エサ操作"
  - "捨て札"
  - "縄張り操作"
rulings:
  - "自分の場に[ユカタンビワハゴロモ]があるときに、相手がコスト0の[息吹の解放]を使用し、「好きな数のコストを支払う。」効果で3コスト支払おうとしました。この場合、[息吹の解放]の効: いいえ、支払いません。 その場合、相手は[息吹の解放]の０コストを支払い使用し、術カードの効果が発揮される前に＜超神通力＞が発揮され、相手が使用した[息吹の解放]が打ち消されます。「好きな数のコストを支払う。」効果は発揮されないため、支払おうとした3コストは支払いません。"
  - "自分の場に[ユカタンビワハゴロモ]があるときに、相手が０コストの術カード[宿命の影写し]を使用しました。[宿命の影写し]の効果」でエサ場の４コストの虫[カブトムシ]を選んで支払う４: いいえ、支払いません。その場合、相手は[宿命の影写し]の０コストを支払い使用し、術カードの効果が発揮される前に ＜超神通力＞が発揮され、相手が使用した[宿命の影写し]が打ち消されるため、「その虫と同数のコストを支払い、選んだ虫を場に出す。」効果は発揮されないため、[カブトムシ]の４コストは支払いません。"
  - "自分の場に[ユカタンビワハゴロモ]があるときに、相手が「このカードのコストを支払う代わりに、自分の縄張りを2枚選び、捨て札に置いてもよい。」の効果でコストの支払を自分の縄張りを２枚: 相手が[刺蠅の血盟]のコストのかわりに捨て札に置いた縄張り２枚はそのままになります。「打ち消す」効果で打ち消されたカードを使用するときに支払われたコストや、[刺蠅の血盟]の効果のように、コストの支払いの代わりに行った効果の処理はそのままになります。"
  - "ユカタンビワハゴロモに空蝉の皮鎧をつけている状態で相手が術を使用した場合、〈超神通力〉の効果で虫を破壊するかわりに空蝉を破壊して使用された術を打ち消すことは可能でしょうか: はい、可能です。、〈超神通力〉の効果で虫を破壊するかわりに空蝉を破壊して使用された術を打ち消すことができます。"
  - "4/17追記 自分の場に[ユカタンビワハゴロモ]があるときに、相手が[玉響の蠢き]を使用しました。[玉響の蠢き]は打ち消されますが、相手は[玉響の蠢き]で出す予定だった虫カードを見: はい。 カードの効果を使用するとき、対象を指定する必要がある場合は正しい対象がなければ使用することができません。[玉響の蠢き]は「場に出したい虫カード」を手札から指定し、相手に見せる必要があります。その後にカードの使用が確定するため、[玉響の蠢き]は打ち消され、見せた虫は場に出ることなく手札に残ります。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/23/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 24/64 ベニモンアゲハ

```yaml
officialNumber: "24/64"
name: "ベニモンアゲハ"
set: "BOOSTER_SET_7"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 500
skills:
  - name: "黒毒蝶"
    baseAp: "X"
    effectSummary: "自分の捨て札にある毒と書かれた技を持つ虫の数×300のダメージを与える。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "アゲハチョウ科"
  other: []
referencableTags:
  - "アゲハチョウ科"
  - "捨て札"
  - "ダメージ変更"
rulings:
  - "4/17追記 場に[カイコ]がいます。自分の捨て札に[オオスズメバチ][アカスジキンカメムシ][ナガメ][サソリカミキリ]の4枚があるとき、[ベニモンアゲハ]の\"黒毒蝶\"で与えられ: 600です。 捨て札にあるのはいずれも技名に「毒」と書かれた虫カードですが、[アカスジカメムシ][サソリカミキリ]の2枚は[カイコ]によって＜＞の技を失っています。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/24/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 25/64 メルポメネドクチョウ

```yaml
officialNumber: "25/64"
name: "メルポメネドクチョウ"
set: "BOOSTER_SET_7"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 2
baseHp: 300
skills:
  - name: "毒蝶"
    baseAp: "X"
    effectSummary: "自分の捨て札にある毒と書かれた技を持つ虫の数×200のダメージを与える。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "タテハチョウ科"
  other: []
referencableTags:
  - "タテハチョウ科"
  - "捨て札"
  - "ダメージ変更"
rulings:
  - "4/17追記 場に[カイコ]がいます。自分の捨て札に[オオスズメバチ][アカスジキンカメムシ][ナガメ][サソリカミキリ]の4枚があるとき、[ベニモンアゲハ]の\"黒毒蝶\"で与えられ: 600です。 捨て札にあるのはいずれも技名に「毒」と書かれた虫カードですが、[アカスジカメムシ][サソリカミキリ]の2枚は[カイコ]によって＜＞の技を失っています。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/25/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 26/64 オオルリアゲハ

```yaml
officialNumber: "26/64"
name: "オオルリアゲハ"
set: "BOOSTER_SET_7"
rarity: "SR"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 600
skills:
  - name: "すいとる"
    baseAp: 400
    effectSummary: null
  - name: "魅惑の翅"
    baseAp: 0
    effectSummary: "この技は1度だけ使用できる。攻撃後、自分は縄張りを1枚引く。その後、このターンを終了する。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "アゲハチョウ科"
  other: []
referencableTags:
  - "アゲハチョウ科"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/26/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 27/64 テングビワハゴロモ

```yaml
officialNumber: "27/64"
name: "テングビワハゴロモ"
set: "BOOSTER_SET_7"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 600
skills:
  - name: "しぼりとる"
    baseAp: 400
    effectSummary: null
traits:
  - name: "神通力"
    effectSummary: "相手が1コスト以下の術カードを使用したとき、これを破壊する。その後、その術カードを打ち消す。※使用したカードのコストは支払われるが、効果は発揮されず捨て札に置かれる。"
effectSummary: null
taxonomy:
  order: null
  family: "ビワハゴロモ科"
  other: []
referencableTags:
  - "ビワハゴロモ科"
  - "神通力"
  - "捨て札"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/27/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 28/64 オキピタリスノコギリクワガタ

```yaml
officialNumber: "28/64"
name: "オキピタリスノコギリクワガタ"
set: "BOOSTER_SET_7"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 4
baseHp: 800
skills:
  - name: "はさむ"
    baseAp: 600
    effectSummary: null
  - name: "万力バサミ"
    baseAp: 1000
    effectSummary: "この技は強化カードがついた虫にしか使用できない。"
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
  cardDetail: "https://mushijingi.com/card/MUSHI7/28/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 29/64 コムラサキ

```yaml
officialNumber: "29/64"
name: "コムラサキ"
set: "BOOSTER_SET_7"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 500
skills:
  - name: "すいとる"
    baseAp: 500
    effectSummary: null
traits:
  - name: "ヤマト紫"
    effectSummary: "自分の裏向きのエサ2つにつき、これのコストを1減らす。"
effectSummary: null
taxonomy:
  order: null
  family: "タテハチョウ科"
  other: []
referencableTags:
  - "タテハチョウ科"
  - "ヤマト紫"
  - "裏向き"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/29/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 30/64 ナミハナアブ

```yaml
officialNumber: "30/64"
name: "ナミハナアブ"
set: "BOOSTER_SET_7"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 1
baseHp: 200
skills:
  - name: "すする"
    baseAp: 200
    effectSummary: null
traits:
  - name: "ベイツ型擬態"
    effectSummary: "自分の場に、ほかの虫がいるなら、この虫は攻撃を受けない。※この技を持つ虫だけが、複数いるとき、相手はどれかを選んで攻撃する。"
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
  cardDetail: "https://mushijingi.com/card/MUSHI7/30/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 31/64 ニホンミツバチ

```yaml
officialNumber: "31/64"
name: "ニホンミツバチ"
set: "BOOSTER_SET_7"
rarity: "UR"
type: "INSECT"
color: "BLUE"
cost: 1
baseHp: 300
skills:
  - name: "熱殺蜂球"
    baseAp: "X"
    effectSummary: "自分の場の～バチ科の虫の数×100のダメージを与える。"
  - name: "ウイング・スラッピング"
    baseAp: 0
    effectSummary: "この技は相手のコスト1以下の虫にしか使用できない。この技を受けた虫を手札に戻す。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "ミツバチ科"
  other: []
referencableTags:
  - "ミツバチ科"
  - "ダメージ変更"
  - "手札操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/31/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 32/64 テナガカミキリ

```yaml
officialNumber: "32/64"
name: "テナガカミキリ"
set: "BOOSTER_SET_7"
rarity: "LR"
type: "INSECT"
color: "GREEN"
cost: 6
baseHp: 1700
skills:
  - name: "神のキバ無双"
    baseAp: 1000
    effectSummary: null
  - name: "テナガ無双"
    baseAp: 400
    effectSummary: "同じ色の相手の虫を2つ選び、それぞれに攻撃する。それらが同名なら、この技の攻撃力を500増やす。※1つの虫や、相手に直接攻撃はできない。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "カミキリムシ科"
  other: []
referencableTags:
  - "カミキリムシ科"
  - "ダメージ変更"
rulings:
  - "\"テナガ無双\"で相手の[ギンヤンマ][ギンヤンマ（幼虫）]を選び攻撃した場合、テナガ無双の攻撃力は500増えますか？: いいえ、攻撃力は増えません。 [ギンヤンマ]と[ギンヤンマ（幼虫）]は同名の虫ではありません。"
  - "\"テナガ無双\"で相手のSRの[カブトムシ]とURの[カブトムシ]を選び攻撃した場合、テナガ無双の攻撃力は500増えますか？: はい、攻撃力が500増えます。 レアリティが異なっていても同名の虫として扱われます。"
  - "\"テナガ無双\"で相手の青の[カナブン]と、[玉虫色の羽化]で色を赤に変えた[カナブン]を選び攻撃することは: いいえ、攻撃できません。 同名の虫であってもそれぞれ違う色のため\"テナガ無双\"で攻撃することはできません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/32/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 33/64 オオルリタマムシ

```yaml
officialNumber: "33/64"
name: "オオルリタマムシ"
set: "BOOSTER_SET_7"
rarity: "SR"
type: "INSECT"
color: "GREEN"
cost: 5
baseHp: 700
skills:
  - name: "くいあらす"
    baseAp: 600
    effectSummary: null
traits:
  - name: "色彩の加護"
    effectSummary: "自分のエサ場の虫の色1種類につき、これのコストを1減らす。"
effectSummary: null
taxonomy:
  order: null
  family: "タマムシ科"
  other: []
referencableTags:
  - "タマムシ科"
  - "色彩の加護"
  - "エサ操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/33/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 34/64 シロスジカミキリ

```yaml
officialNumber: "34/64"
name: "シロスジカミキリ"
set: "BOOSTER_SET_7"
rarity: "UR"
type: "INSECT"
color: "GREEN"
cost: 5
baseHp: 1200
skills:
  - name: "くいちぎる"
    baseAp: 700
    effectSummary: null
traits:
  - name: "白筋模様"
    effectSummary: "自分の裏向きのエサ1つにつき、この虫の体力と攻撃力を100増やす。"
effectSummary: null
taxonomy:
  order: null
  family: "カミキリムシ科"
  other: []
referencableTags:
  - "カミキリムシ科"
  - "白筋模様"
  - "裏向き"
  - "エサ操作"
  - "ダメージ変更"
  - "縄張り操作"
rulings:
  - "攻撃力600の\"触角の鞭\"で体力1100の相手の[ギンヤンマ]を攻撃し、\"触角の鞭\"の効果でエサ場から[電気虫の金砕棒]を選び、[ウォーレスシロスジカミキリ]につけました。 [電気: いいえ、相手は縄張りを引きません。 相手の[ギンヤンマ]は\"触角の鞭\"攻撃によるダメージではなく、強化カード[電気虫の金砕棒]の効果によるダメージにより破壊されたため、相手は縄張りは引きません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/34/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 35/64 ヤマトタマムシ

```yaml
officialNumber: "35/64"
name: "ヤマトタマムシ"
set: "BOOSTER_SET_7"
rarity: "UR"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 300
skills:
  - name: "くいあらす"
    baseAp: 300
    effectSummary: null
traits:
  - name: "きらめき"
    effectSummary: "これが場に出たとき、自分の裏向きのエサから虫を各色1つまで選び、表向きにしてもよい。"
effectSummary: null
taxonomy:
  order: null
  family: "タマムシ科"
  other: []
referencableTags:
  - "タマムシ科"
  - "きらめき"
  - "裏向き"
  - "登場時"
rulings:
  - "＜きらめき＞で選ぶ虫の色、各色とは赤と青と緑と無色ですか？それとも赤と青と緑ですか？: 赤と青と緑と無色です。 無色も色の1つとして扱います。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/35/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 36/64 ウォーレスシロスジカミキリ

```yaml
officialNumber: "36/64"
name: "ウォーレスシロスジカミキリ"
set: "BOOSTER_SET_7"
rarity: "SR"
type: "INSECT"
color: "GREEN"
cost: 5
baseHp: 1100
skills:
  - name: "くいちぎる"
    baseAp: 700
    effectSummary: null
  - name: "触角の鞭"
    baseAp: 600
    effectSummary: "この技は1度だけ使用できる。攻撃後、自分のエサ場にあるコスト3以下の強化カードを1つ選び、この虫につけてもよい。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "カミキリムシ科"
  other: []
referencableTags:
  - "カミキリムシ科"
  - "エサ操作"
  - "縄張り操作"
rulings:
  - "攻撃力600の\"触角の鞭\"で体力1100の相手の[ギンヤンマ]を攻撃し、\"触角の鞭\"の効果でエサ場から[電気虫の金砕棒]を選び、[ウォーレスシロスジカミキリ]につけました。 [電気: いいえ、相手は縄張りを引きません。 相手の[ギンヤンマ]は\"触角の鞭\"攻撃によるダメージではなく、強化カード[電気虫の金砕棒]の効果によるダメージにより破壊されたため、相手は縄張りは引きません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/36/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 37/64 ジンメンカメムシ

```yaml
officialNumber: "37/64"
name: "ジンメンカメムシ"
set: "BOOSTER_SET_7"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 300
skills:
  - name: "くいつく"
    baseAp: 300
    effectSummary: null
traits:
  - name: "デビルフェイス"
    effectSummary: "この虫に強化カードをつけたとき、相手の虫を1つ選び、300のダメージを与えてもよい。"
effectSummary: null
taxonomy:
  order: null
  family: "カメムシ科"
  other: []
referencableTags:
  - "カメムシ科"
  - "デビルフェイス"
  - "ダメージ変更"
rulings:
  - "4/17追記 [ジンメンカメムシ]に[電気虫の金砕棒]をつけました。それぞれの効果によるダメージはどのように処理しますか？: それぞれの効果は同時に発揮します。同時に発揮した効果はターンプレイヤーを優先して、好きな順番で処理できるため、どちらからでも処理できます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/37/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 38/64 ヒゲナガカミキリ

```yaml
officialNumber: "38/64"
name: "ヒゲナガカミキリ"
set: "BOOSTER_SET_7"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 4
baseHp: 700
skills:
  - name: "くいちぎる"
    baseAp: 600
    effectSummary: null
  - name: "触角の鞭"
    baseAp: 400
    effectSummary: "この技は1度だけ使用できる。攻撃後、自分のエサ場にあるコスト3以下の強化カードを1つ選び、この虫につけてもよい。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "カミキリムシ科"
  other: []
referencableTags:
  - "カミキリムシ科"
  - "エサ操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/38/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 39/64 ラミーカミキリ

```yaml
officialNumber: "39/64"
name: "ラミーカミキリ"
set: "BOOSTER_SET_7"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 200
skills:
  - name: "くいちぎる"
    baseAp: 300
    effectSummary: null
traits:
  - name: "とびだす"
    effectSummary: "これを縄張りから引いたとき、自分の場に＜とびだす＞の技を持つ虫がいなければ、これを場に出してもよい。"
effectSummary: null
taxonomy:
  order: null
  family: "カミキリムシ科"
  other: []
referencableTags:
  - "カミキリムシ科"
  - "とびだす"
  - "縄張り操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/39/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 40/64 シャチホコガ（幼虫）

```yaml
officialNumber: "40/64"
name: "シャチホコガ（幼虫）"
set: "BOOSTER_SET_7"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 400
skills:
  - name: "かじる"
    baseAp: 400
    effectSummary: null
  - name: "シャチホコ威嚇"
    baseAp: 0
    effectSummary: "この技は1度だけ使用できる。次の相手のターン、相手が最初に使用する術カードのコストを2増やす。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "シャチホコガ科"
  other: []
referencableTags:
  - "シャチホコガ科"
  - "遅延効果"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/40/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 41/64 アカスジカメムシ

```yaml
officialNumber: "41/64"
name: "アカスジカメムシ"
set: "BOOSTER_SET_7"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 1
baseHp: 200
skills:
  - name: "くいつく"
    baseAp: 200
    effectSummary: null
traits:
  - name: "デビルストライプ"
    effectSummary: "この虫に強化カードをつけたとき、相手の虫を1つ選び、200のダメージを与えてもよい。"
effectSummary: null
taxonomy:
  order: null
  family: "カメムシ科"
  other: []
referencableTags:
  - "カメムシ科"
  - "デビルストライプ"
  - "ダメージ変更"
rulings:
  - "4/17追記 [ジンメンカメムシ]に[電気虫の金砕棒]をつけました。それぞれの効果によるダメージはどのように処理しますか？: それぞれの効果は同時に発揮します。同時に発揮した効果はターンプレイヤーを優先して、好きな順番で処理できるため、どちらからでも処理できます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/41/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 42/64 クビキリギス

```yaml
officialNumber: "42/64"
name: "クビキリギス"
set: "BOOSTER_SET_7"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 500
skills:
  - name: "くいちぎる"
    baseAp: 400
    effectSummary: null
  - name: "首切り"
    baseAp: 800
    effectSummary: "この技は体力が減っている虫にしか使用できない。"
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
  cardDetail: "https://mushijingi.com/card/MUSHI7/42/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 43/64 ヤマトフキバッタ

```yaml
officialNumber: "43/64"
name: "ヤマトフキバッタ"
set: "BOOSTER_SET_7"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 500
skills:
  - name: "はねる"
    baseAp: 500
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
  cardDetail: "https://mushijingi.com/card/MUSHI7/43/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 44/64 ツマグロヒョウモン（幼虫）

```yaml
officialNumber: "44/64"
name: "ツマグロヒョウモン（幼虫）"
set: "BOOSTER_SET_7"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 300
skills:
  - name: "かじる"
    baseAp: 400
    effectSummary: null
  - name: "つよがる"
    baseAp: 600
    effectSummary: "この技は1度だけ使用できる。次の相手のターン、この虫の体力を500増やす。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "タテハチョウ科"
  other: []
referencableTags:
  - "タテハチョウ科"
  - "遅延効果"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/44/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 45/64 キスジコヤガ（幼虫）

```yaml
officialNumber: "45/64"
name: "キスジコヤガ（幼虫）"
set: "BOOSTER_SET_7"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 1
baseHp: 100
skills:
  - name: "コケまとい"
    baseAp: 100
    effectSummary: "攻撃後、この虫の体力とこの技の攻撃力を2倍にする。※この技以外の修正値を除く。"
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "ヤガ科"
  other: []
referencableTags:
  - "ヤガ科"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/45/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 46/64 エンマコオロギ

```yaml
officialNumber: "46/64"
name: "エンマコオロギ"
set: "BOOSTER_SET_7"
rarity: "SR"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 500
skills:
  - name: "鈴の音"
    baseAp: 500
    effectSummary: null
traits:
  - name: "地獄の番人"
    effectSummary: "これが場にいるとき、自分と相手は捨て札から虫を場に出せない。"
effectSummary: null
taxonomy:
  order: null
  family: "コオロギ科"
  other: []
referencableTags:
  - "コオロギ科"
  - "地獄の番人"
  - "捨て札"
  - "コントロール変更"
rulings:
  - "場に<地獄の番人>を持つ[エンマコオロギ]がいるとき、使用できなくなるカードや効果を教えてください: ①[ゴクラクトリバネアゲハ]の＜極楽還り＞などの捨て札の虫を場に出す＜＞の技 ②[ゴクラクトリバネアゲハ（幼虫）]の\"極楽羽化\"などの捨て札の虫を必ず場に出す必要がある技 ③[白銀蜘蛛の糸]などの捨て札の虫を選び、つけて場に出す強化カード ④[極夜の羽化][叛逆の蛮勇]などの場と捨て札の虫を交換し、捨て札の虫を場に出す術カード などの効果やカードが使用できなくなります。"
  - "場に<地獄の番人>を持つ[エンマコオロギ]がいるとき、 相手の虫を[エメラルドゴキブリバチ]の\"操り針\"攻撃で破壊しました。 このとき\"操り針\"の効果で破壊した相手の虫を自分の場に: はい、<地獄の番人>を持つ虫がいても場に出せます。 \"操り針\"で破壊された相手の虫は、その時点では捨て札に置かれず、\"操り針\"の効果によって相手の場から自分の場に出ます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/46/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 47/64 スズムシ

```yaml
officialNumber: "47/64"
name: "スズムシ"
set: "BOOSTER_SET_7"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 1
baseHp: 200
skills:
  - name: "鈴の音"
    baseAp: 200
    effectSummary: null
traits:
  - name: "鳴く"
    effectSummary: "相手はこれ以外の虫を攻撃できない。※この技を持つ虫が複数いるとき、相手はどれかを選んで攻撃する。"
effectSummary: null
taxonomy:
  order: null
  family: "スズムシ科"
  other: []
referencableTags:
  - "スズムシ科"
  - "鳴く"
  - "攻撃制限"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/47/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 48/64 オオセンチコガネ

```yaml
officialNumber: "48/64"
name: "オオセンチコガネ"
set: "BOOSTER_SET_7"
rarity: "R"
type: "INSECT"
color: "COLORLESS"
cost: 2
baseHp: 300
skills:
  - name: "かじりつく"
    baseAp: 300
    effectSummary: null
traits:
  - name: "黄金虫"
    effectSummary: "これを手札からエサ場に置いたとき、自分の捨て札から虫を1つ選び、これと交換してもよい。"
effectSummary: null
taxonomy:
  order: null
  family: "センチコガネ科"
  other: []
referencableTags:
  - "センチコガネ科"
  - "黄金虫"
  - "エサ操作"
  - "捨て札"
rulings:
  - "＜黄金虫＞の効果で交換する虫はどこに置きますか？: 自分のエサ場に置きます。 エサ場に置いて＜黄金虫＞を使用した\"オオセンチコガネ\"を捨て札に、効果で選んだ捨て札の虫をエサ場に置いて交換します。"
  - "セットフェイズ中に＜黄金虫＞効果で捨て札の虫とエサ場の[オオセンチコガネ]を交換しました。 交換したエサのコストはセットフェイズ後に発生しますか？: はい、発生します。 コストは通常メインフェイズ開始時に、エサ場に置かれているエサの数と同じ数発生します。 ＜黄金虫＞の効果ではコストは発生しませんが、セットフェイズ中にエサ場に置かれたカードからは発生します。"
  - "自分の捨て札に虫がないとき＜黄金虫＞を使用することは: いいえ、できません。 選ぶことができる自分の捨て札の虫がないため、＜黄金虫＞を使用できません。"
  - "場に＜地獄の番人＞をもつ[エンマコオロギ]がいるとき、 ＜黄金虫＞を使用することは: はい、できます。 ＜地獄の番人＞は「捨て札の虫を場に出せない。」効果のため、捨て札の虫をエサ場に置く(交換する)効果の＜黄金虫＞には影響はありません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/48/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 49/64 ヘイケボタル

```yaml
officialNumber: "49/64"
name: "ヘイケボタル"
set: "BOOSTER_SET_7"
rarity: "SR"
type: "INSECT"
color: "COLORLESS"
cost: 1
baseHp: 200
skills:
  - name: "発光"
    baseAp: 200
    effectSummary: null
traits:
  - name: "光る"
    effectSummary: "これが場に出たとき、自分の裏向きのエサを1つ選び、表向きにしてもよい。"
effectSummary: null
taxonomy:
  order: null
  family: "ホタル科"
  other: []
referencableTags:
  - "ホタル科"
  - "光る"
  - "裏向き"
  - "エサ操作"
  - "登場時"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/49/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 50/64 ワラジムシ

```yaml
officialNumber: "50/64"
name: "ワラジムシ"
set: "BOOSTER_SET_7"
rarity: "N"
type: "INSECT"
color: "COLORLESS"
cost: 1
baseHp: 300
skills:
  - name: "たいあたり"
    baseAp: 100
    effectSummary: null
traits: []
effectSummary: null
taxonomy:
  order: null
  family: "ワラジムシ科"
  other: []
referencableTags:
  - "ワラジムシ科"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/50/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 51/64 怨念の陣羽織

```yaml
officialNumber: "51/64"
name: "怨念の陣羽織"
set: "BOOSTER_SET_7"
rarity: "LR"
type: "ENHANCEMENT"
color: null
cost: 5
baseHp: null
skills: []
traits: []
effectSummary: "これを使用するとき、自分のエサを好きな数選び裏向きにしてもよい。そうしたなら、これのコストを裏返したエサの数と同数減らす。この虫の体力と攻撃力を1000増やす。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "裏向き"
  - "エサ操作"
  - "遅延効果"
  - "ダメージ変更"
rulings:
  - "自分ターンで[蟲装の演舞]を使用し、次の相手のターンで相手が[怨念の陣羽織]を「これを使用するとき、自分のエサを好きな数選び裏向きにしてもよい。そうしたなら、これのコストを裏返した: 相手が[怨念の陣羽織]で裏返したエサは裏向きのままになります。「打ち消す。」効果で打ち消されたカードを使用するときに支払われたコストや、[怨念の陣羽織]の効果のように、コストを支払う時に行った効果の処理はそのままになります。"
  - "[供物の封印]や[怨念の陣羽織]は、術を使用する/強化カードをつける対象がない状態で使用して、自分のエサを裏返す効果を使えますか？: いいえ、できません。[供物の封印]であればカードで指定されている対象に選ぶことができる「相手の虫を１つ」が、[怨念の陣羽織]であれば強化カードをつけることができる自分の虫がいる必要があります。エサを裏返す効果だけを使用することはできません。"
  - "[供物の封印]や[怨念の陣羽織]の「自分のエサを好きな枚数選んで裏向きにする。」で、０枚を選ぶことは: はい、０枚を選ぶことができます。[供物の封印]なら０枚を選んだ場合は、裏向きにしたエサの数が０になるため、０ダメージを選んだ虫に与えます。[怨念の陣羽織]なら減らすコストの数は０になり、5コストを支払って使用することになります。"
  - "コスト５の[怨念の陣羽織]を使用して虫につけるとき、自分のエサを６枚以上、裏向きにすることは: はい、裏向きにする自分のエサの数に上限はありません。 ただし、６枚以上エサを裏向きにして[怨念の陣羽織]のコストを６以上減らしても、コストは０より少ない数になりません。"
  - "メインフェイズ中に表のエサが３枚、コストが３あるとき[怨念の陣羽織]の効果でエサを3枚裏返し、[怨念の陣羽織]のコストを２にして使用し、自分の虫につけることが: はい、できます。 [怨念の陣羽織]を使用するとき、自分の表のエサを裏返して減った状態になった[怨念の陣羽織]のコストを支払う事ができれば可能です。"
  - "つけることができる虫が自分の場に１つもないときや、コストを支払うことができないとき[怨念の陣羽織]の「これを使用するとき、自分のエサを好きな数選び裏向きにしてもよい。」効果のみを使: いいえ、できません。 つけることができる虫や、コストを支払うことができない場合[怨念の陣羽織]を使用できません。"
  - "[オオカレエダカマキリ]の\"ドラゴン蟷螂拳\"で攻撃をし、その効果で手札の[怨念の陣羽織]を使用しました。 このとき「これを使用するとき、自分のエサを好きな数選び裏向きにしてもよい: はい、できます。 [怨念の陣羽織]を使用しているため、エサを好きな数裏返すことができます。 \"ドラゴン蟷螂拳\"の効果で使用されるカードのコストは支払わないため、[怨念の陣羽織]のコストが減っても、そのターン自分が使用できるコストの数に影響はありません。"
  - "[剣舞天翔の刹那]を使用し、エサ場の[怨念の陣羽織]を自分の虫につけました。 このとき「これを使用するとき、自分のエサを好きな数選び裏向きにしてもよい。」効果を使用することは: いいえ、できません。 [剣舞天翔の刹那]はエサ場の強化カードを「つける。」という効果のため、[怨念の陣羽織]の「使用するとき」の効果は使用できません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/51/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 52/64 勝虫の一本刀

```yaml
officialNumber: "52/64"
name: "勝虫の一本刀"
set: "BOOSTER_SET_7"
rarity: "R"
type: "ENHANCEMENT"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectSummary: "これは技の効果を持たない虫にしかつけられない。この虫の攻撃力を600増やす。これがついた虫が破壊されたとき、自分のエサを1つ選び裏返してもよい。そうしたなら、これを手札に戻す。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "裏向き"
  - "エサ操作"
  - "破壊時"
  - "ダメージ変更"
  - "手札操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/52/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 53/64 吉兆虫の一本刀

```yaml
officialNumber: "53/64"
name: "吉兆虫の一本刀"
set: "BOOSTER_SET_7"
rarity: "N"
type: "ENHANCEMENT"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "これは技の効果を持たない虫にしかつけられない。この虫の攻撃力を300増やす。これがついた虫が破壊されたとき、自分のエサを1つ選び裏返してもよい。そうしたなら、これを手札に戻す。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "裏向き"
  - "エサ操作"
  - "破壊時"
  - "ダメージ変更"
  - "手札操作"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/53/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 54/64 電気虫の金砕棒

```yaml
officialNumber: "54/64"
name: "電気虫の金砕棒"
set: "BOOSTER_SET_7"
rarity: "SR"
type: "ENHANCEMENT"
color: null
cost: 3
baseHp: null
skills: []
traits: []
effectSummary: "これが場に出たとき、相手の虫を1つ選び、1000のダメージを与えてもよい。この虫の体力と攻撃力を500増やす。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "登場時"
  - "ダメージ変更"
rulings:
  - "[螻蛄の七芸]で自分の[カナブン]についている[電気虫の金砕棒]を選び、[ヒグラシ]を選んでつけかえました。このとき、[電気虫の金砕棒]の「これ場に出たとき、相手の虫を１つ選び、1: いいえ、発揮しません。 [螻蛄の七芸]などの「つけかえる」効果は、すでに自分の場に出ている強化カードを別の虫につけかえる効果であり、強化カードが新たに場に出たわけではないため、[電気虫の金砕棒]のダメージを与える効果は発揮されません。"
  - "4/17追記 [電気虫の金砕棒]を対象に[蠱術の贋作]を使用しました。このとき、[電気虫の金砕棒]の「これ場に出たとき、相手の虫を１つ選び、1000のダメージを与えてもよい。」効果: いいえ、発揮しません。 [蠱術の贋作]は他の強化カードの修正値を、つけた虫に与える効果を持ちます。修正値以外は効果の対象になりません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/54/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 55/64 塵芥虫の爆熱棍

```yaml
officialNumber: "55/64"
name: "塵芥虫の爆熱棍"
set: "BOOSTER_SET_7"
rarity: "R"
type: "ENHANCEMENT"
color: null
cost: 2
baseHp: null
skills: []
traits: []
effectSummary: "これが場に出たとき、相手の虫を1つ選び、600のダメージを与えてもよい。この虫の体力と攻撃力を300増やす。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "登場時"
  - "ダメージ変更"
rulings:
  - "[螻蛄の七芸]で自分の[カナブン]についている[電気虫の金砕棒]を選び、[ヒグラシ]を選んでつけかえました。このとき、[電気虫の金砕棒]の「これ場に出たとき、相手の虫を１つ選び、1: いいえ、発揮しません。 [螻蛄の七芸]などの「つけかえる」効果は、すでに自分の場に出ている強化カードを別の虫につけかえる効果であり、強化カードが新たに場に出たわけではないため、[電気虫の金砕棒]のダメージを与える効果は発揮されません。"
  - "4/17追記 [電気虫の金砕棒]を対象に[蠱術の贋作]を使用しました。このとき、[電気虫の金砕棒]の「これ場に出たとき、相手の虫を１つ選び、1000のダメージを与えてもよい。」効果: いいえ、発揮しません。 [蠱術の贋作]は他の強化カードの修正値を、つけた虫に与える効果を持ちます。修正値以外は効果の対象になりません。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/55/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 56/64 宝石虫の冠

```yaml
officialNumber: "56/64"
name: "宝石虫の冠"
set: "BOOSTER_SET_7"
rarity: "SR"
type: "ENHANCEMENT"
color: null
cost: 3
baseHp: null
skills: []
traits: []
effectSummary: "この虫の体力と攻撃力を500増やす。これがついた虫が破壊されたとき、これをエサ場に置いてもよい。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "エサ操作"
  - "捨て札"
  - "破壊時"
  - "ダメージ変更"
  - "手札操作"
rulings:
  - "[宝石虫の冠]がついている虫が[塵芥虫の爆熱弾]で破壊されました。 この場合、破壊された虫についていた[宝石虫の冠]をエサ場に置くことが: はい、できます。 [宝石虫の冠]をエサ場に置く効果の使用条件は「これがついた虫が破壊されたとき」という指定のため、ついた虫が術カードなどで破壊されても[宝石虫の冠]をエサ場に置くことができます。"
  - "[宝石虫の冠]がついている虫を[オオカマキリ]の\"共食い\"で破壊しました。 この場合、破壊された虫についていた[宝石虫の冠]をエサ場に置くことが: はい、できます。 [宝石虫の冠]をエサ場に置く効果の使用条件は「これがついた虫が破壊されたとき」という指定のため、ついた虫が自分の虫による技の効果などで破壊されても[宝石虫の冠]をエサ場に置くことができます。"
  - "[宝石虫の冠]がついている虫を[チャバネカメムシ]の＜毒霧噴射＞の効果で手札に戻しました。 この場合、手札に戻した虫についていた[宝石虫の冠]をエサ場に置くことが: いいえ、できません。 [宝石虫の冠]がついた虫が破壊されていないため、効果は発揮されません。 ＜毒霧噴射＞の効果を受けた虫が手札に戻った後、つけている虫がいなくなった[宝石虫の冠]は破壊され、捨て札に置かれます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/56/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 57/64 封印の怨念

```yaml
officialNumber: "57/64"
name: "封印の怨念"
set: "BOOSTER_SET_7"
rarity: "R"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectSummary: "相手の虫を1つ選び、自分の裏向きのエサの数×100のダメージを与える。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "裏向き"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/57/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 58/64 供物の封印

```yaml
officialNumber: "58/64"
name: "供物の封印"
set: "BOOSTER_SET_7"
rarity: "SR"
type: "SPELL"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectSummary: "相手の虫を1つ選び、自分のエサを好きな数選んで裏向きにする。選んだ虫に裏向きにしたエサの数×200のダメージを与える。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "裏向き"
  - "エサ操作"
  - "ダメージ変更"
rulings:
  - "[供物の封印]や[怨念の陣羽織]は、術を使用する/強化カードをつける対象がない状態で使用して、自分のエサを裏返す効果を使えますか？: いいえ、できません。[供物の封印]であればカードで指定されている対象に選ぶことができる「相手の虫を１つ」が、[怨念の陣羽織]であれば強化カードをつけることができる自分の虫がいる必要があります。エサを裏返す効果だけを使用することはできません。"
  - "[供物の封印]や[怨念の陣羽織]の「自分のエサを好きな枚数選んで裏向きにする。」で、０枚を選ぶことは: はい、０枚を選ぶことができます。[供物の封印]なら０枚を選んだ場合は、裏向きにしたエサの数が０になるため、０ダメージを選んだ虫に与えます。[怨念の陣羽織]なら減らすコストの数は０になり、5コストを支払って使用することになります。"
  - "4/17追記 自分のエサ場に[オオムラサキ（幼虫）]があるときに[花蝶の幻舞]を使用しました。その直後に[供物の封印]を使用してでエサ場の[オオムラサキ（幼虫）]を裏返した場合、手: いいえ、減りません。 [花蝶の幻舞]は「自分のエサ場に（幼虫）と書かれた虫がいるなら」効果を発揮するカードです。使用後にエサ場から（幼虫）と書かれた虫がいなくなったり、参照できなくなった場合には条件を達成できません。また、使用後にエサ場に増えた（幼虫）と書かれた虫でも条件を達することができます。"
  - "[供物の封印]の「自分のエサを好きな枚数選んで裏向きにする。」で、０枚を選ぶことは: はい、０枚を選ぶことができます。 ０枚を選んだ場合は、裏向きにしたエサの数が0になるため、選んだ虫に０ダメージを与えます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/58/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 59/64 蟲装の演舞

```yaml
officialNumber: "59/64"
name: "蟲装の演舞"
set: "BOOSTER_SET_7"
rarity: "N"
type: "SPELL"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectSummary: "次の相手のターン、相手が最初に使用した強化カードを打ち消す。※使用したカードのコストは支払われるが、効果は発揮されず虫に付ける前に捨て札に置かれる。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "裏向き"
  - "エサ操作"
  - "捨て札"
  - "遅延効果"
  - "縄張り操作"
rulings:
  - "自分ターンで[蟲装の演舞]を使用し、次の相手のターンで相手が[怨念の陣羽織]を「これを使用するとき、自分のエサを好きな数選び裏向きにしてもよい。そうしたなら、これのコストを裏返した: 相手が[怨念の陣羽織]で裏返したエサは裏向きのままになります。「打ち消す。」効果で打ち消されたカードを使用するときに支払われたコストや、[怨念の陣羽織]の効果のように、コストを支払う時に行った効果の処理はそのままになります。"
  - "4/17追記 相手が[蟲装の演舞]を使用しました。次のターン[藪蚊の密約]を使用して縄張りから[鍬形虫の甲冑]を引きました。このとき、[鍬形虫の甲冑]の＜装着＞を発揮して、自分の虫: いいえ、つけられません。[蟲装の演舞]により「最初に使用した強化カード」を打ち消す状態になっています。縄張りから引いてた[鍬形虫の甲冑]を＜装着＞で使用するとき、条件を満たすため[鍬形虫の甲冑]は打ち消されます。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/59/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 60/64 蟲術の演舞

```yaml
officialNumber: "60/64"
name: "蟲術の演舞"
set: "BOOSTER_SET_7"
rarity: "N"
type: "SPELL"
color: null
cost: 2
baseHp: null
skills: []
traits: []
effectSummary: "次の相手のターン、相手が最初に使用した術カードを打ち消す。※カードのコストは支払われるが、効果は発揮されず捨て札に置かれる。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "捨て札"
  - "遅延効果"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/60/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 61/64 五色の解放

```yaml
officialNumber: "61/64"
name: "五色の解放"
set: "BOOSTER_SET_7"
rarity: "R"
type: "SPELL"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectSummary: "相手の虫を1つ選び、400のダメージを与える。自分のエサ場に赤と青と緑のエサがあるならもう1度相手の虫を1つ選び、400のダメージを与える。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "エサ操作"
  - "ダメージ変更"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/61/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 62/64 宝石虫の置き土産

```yaml
officialNumber: "62/64"
name: "宝石虫の置き土産"
set: "BOOSTER_SET_7"
rarity: "N"
type: "SPELL"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectSummary: "次の相手のターン、虫の攻撃により破壊された自分の虫をエサ場に置いてもよい。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "エサ操作"
  - "遅延効果"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/62/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 63/64 常闇の繭籠もり

```yaml
officialNumber: "63/64"
name: "常闇の繭籠もり"
set: "BOOSTER_SET_7"
rarity: "SR"
type: "SPELL"
color: null
cost: 6
baseHp: null
skills: []
traits: []
effectSummary: "自分の赤/青/緑のエサの色1種類につき、これのコストを1減らす。相手の虫を1つ選び、相手の山札の1番下に置く。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags: []
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/63/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 64/64 拝虫の豪新剣

```yaml
officialNumber: "64/64"
name: "拝虫の豪新剣"
set: "BOOSTER_SET_7"
rarity: "LR"
type: "SPELL"
color: null
cost: 3
baseHp: null
skills: []
traits: []
effectSummary: "自分の攻撃済みの虫を1つ選び、その虫に捨て札からコスト3以下の強化カードを1つ選んでつける。その虫はもう1度攻撃できる。ターン終了時にその強化カードを破壊する。"
taxonomy:
  order: null
  family: null
  other: []
referencableTags:
  - "捨て札"
  - "遅延効果"
rulings: []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI7/64/"
  officialSetQA: "https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "NOT_APPLICABLE"
  rulings: "NO_OFFICIAL_QA_MATCH"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked: []
```

## 分類インデックス

- `アゲハチョウ科`: ベニモンアゲハ, オオルリアゲハ
- `オオムカデ科`: トビズムカデ
- `オサムシ科`: アオオサムシ
- `カマキリモドキ科`: キカマキリモドキ
- `カマキリ科`: ウスバカマキリ
- `カミキリムシ科`: テナガカミキリ, シロスジカミキリ, ウォーレスシロスジカミキリ, ヒゲナガカミキリ, ラミーカミキリ
- `カメムシ科`: ジンメンカメムシ, アカスジカメムシ
- `キリギリス科`: クビキリギス
- `クモバチ科`: タランチュラホーク
- `クワガタムシ科`: スマトラオオヒラタクワガタ, アルキデスヒラタクワガタ, オキピタリスノコギリクワガタ
- `ケンランカマキリ科`: ケンランカマキリ
- `コオロギ科`: エンマコオロギ
- `コガネグモ科`: アカオニグモ, アオオニグモ
- `コガネムシ科`: マルスゾウカブト, カブトムシ, マレーテナガコガネ
- `シデムシ科`: オオヒラタシデムシ（幼虫）
- `シャチホコガ科`: シャチホコガ（幼虫）
- `スズムシ科`: スズムシ
- `スズメバチ科`: オオスズメバチ（女王）, オオスズメバチ
- `センチコガネ科`: オオセンチコガネ
- `タテハチョウ科`: オオムラサキ, メルポメネドクチョウ, コムラサキ, ツマグロヒョウモン（幼虫）
- `タマムシ科`: オオルリタマムシ, ヤマトタマムシ
- `ツバメガ科`: ニシキオオツバメガ
- `トンボ科`: ウスバキトンボ, オオシオカラトンボ, ナツアカネ
- `ハエトリグモ科`: アリグモ
- `ハナアブ科`: ナミハナアブ
- `バッタ科`: ヤマトフキバッタ
- `ビワハゴロモ科`: ユカタンビワハゴロモ, テングビワハゴロモ
- `ホタル科`: ヘイケボタル
- `ミツバチ科`: ニホンミツバチ
- `ヤガ科`: キスジコヤガ（幼虫）
- `ワラジムシ科`: ワラジムシ

## 特性インデックス

- `＜きらめき＞`: ヤマトタマムシ
- `＜とびだす＞`: ラミーカミキリ
- `＜スマトラ大自然＞`: スマトラオオヒラタクワガタ
- `＜デビルストライプ＞`: アカスジカメムシ
- `＜デビルフェイス＞`: ジンメンカメムシ
- `＜ベイツ型擬態＞`: アリグモ, ナミハナアブ
- `＜ヤマト紫＞`: オオムラサキ, コムラサキ
- `＜光る＞`: ヘイケボタル
- `＜地獄の番人＞`: エンマコオロギ
- `＜塩辛＞`: オオシオカラトンボ
- `＜無紋＞`: ウスバカマキリ
- `＜生きた化石＞`: ケンランカマキリ
- `＜白筋模様＞`: シロスジカミキリ
- `＜神通力＞`: テングビワハゴロモ
- `＜色彩の加護＞`: アオオサムシ, ニシキオオツバメガ, オオルリタマムシ
- `＜赤とんぼ＞`: ナツアカネ
- `＜超神通力＞`: ユカタンビワハゴロモ
- `＜鳴く＞`: スズムシ
- `＜黄金虫＞`: オオセンチコガネ

## BLOCKED一覧

- なし
