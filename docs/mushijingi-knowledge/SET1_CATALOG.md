# 蟲神器 第1弾カード図鑑

> Version: v1.0 KNOWLEDGE-BASE
> 対象: ブースターパック第1弾 106種
> 用途: OpenCode / Qoder / Codex / ゲームUI が参照する実装用知識ベース

## 0. 運用原則

- 本書はスターター24種とは別に、第1弾ブースター106種のみを収録する。
- カード番号・基本値・技/効果・特性・生物分類を構造化して保持する。
- `＜○○＞` は `traits` として通常の技から分離する。
- 生物の『○○科』は後続カードから参照されるゲームデータなので `taxonomy.family` と `referencableTags` に必ず保持する。
- 生物解説は長文を転載せず、分類を中心に機械可読データとして保持する。
- 一般的TCG知識や一般的な昆虫知識からカード仕様を補完しない。
- カード本文の探索には非公式DBを補助利用するが、裁定は公式Q&Aを優先する。
- `rulings` は実装に直接影響する主要裁定の要約。公式Q&A全文の複製ではない。

## 1. 検証ステータス

```yaml
basicCardData: VERIFIED_SECONDARY
taxonomy: VERIFIED_SECONDARY
rulings: OFFICIAL_QA_SUMMARY_WHERE_LISTED
officialImageCrosscheck: PARTIAL
implementationRule: BLOCK_IF_CONFLICT_OR_UNKNOWN
```

## 2. 共通ソース

- 公式 第1弾Q&A: https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/
- カード探索補助（非公式）: https://mushijingi.com/

## 3. 収録検査

- Booster Set 1 unique cards: 106
- Starter slots are intentionally excluded.
- Card-number duplicate check: PASS
- Required booster-number coverage: PASS

---

## 1/130 ニセハナマオウカマキリ

```yaml
officialNumber: "1/130"
name: "ニセハナマオウカマキリ"
set: "BOOSTER_SET_1"
rarity: "LR"
type: "INSECT"
color: "RED"
cost: 6
baseHp: 1600
skills:
  - name: "神のカマ連撃"
    baseAp: 300
    effectSummary: "攻撃後に相手の場に虫がいれば、直後にもう1回だけこの技を使える。"
  - name: "共食い"
    baseAp: 2000
    effectSummary: "使用条件として、この虫以外の自分の虫1体を破壊する。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "ヨウカイカマキリ科"
  other: []
referencableTags:
  - "ヨウカイカマキリ科"
rulings:
  - "連続攻撃と共食いは別処理。対象・破壊原因・縄張り取得を混同しない。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/1/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 2/130 リオック

```yaml
officialNumber: "2/130"
name: "リオック"
set: "BOOSTER_SET_1"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 5
baseHp: 800
skills:
  - name: "かみちぎる"
    baseAp: 600
    effectSummary: null
traits:
  - name: "エサにする"
    effectSummary: "場に出す際、通常コストの代わりに自分の場の虫2体を破壊して出せる。"
effectSummary: null
taxonomy:
  order: null
  family: "クロギリス科"
  other: []
referencableTags:
  - "クロギリス科"
rulings:
  - "代替コストとしての破壊は、虫の攻撃による破壊ではない。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/2/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 3/130 メキシカンレッドニー

```yaml
officialNumber: "3/130"
name: "メキシカンレッドニー"
set: "BOOSTER_SET_1"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 5
baseHp: 1400
skills:
  - name: "かむ"
    baseAp: 700
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "オオツチグモ科"
  other: []
referencableTags:
  - "オオツチグモ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/3/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 4/130 オニヤンマ

```yaml
officialNumber: "4/130"
name: "オニヤンマ"
set: "BOOSTER_SET_1"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 5
baseHp: 1200
skills:
  - name: "とびかかる"
    baseAp: 900
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "オニヤンマ科"
  other: []
referencableTags:
  - "オニヤンマ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/4/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 5/130 トビズムカデ

```yaml
officialNumber: "5/130"
name: "トビズムカデ"
set: "BOOSTER_SET_1"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 5
baseHp: 1300
skills:
  - name: "キバ"
    baseAp: 700
    effectSummary: null
  - name: "毒のキバ"
    baseAp: 500
    effectSummary: "この技で与えたダメージは通常のターン終了回復をしない。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "オオムカデ科"
  other: []
referencableTags:
  - "オオムカデ科"
rulings:
  - "回復不能ダメージは空蝉の皮鎧などの破壊置換後も残り得る。"
  - "一時HP増加が切れてHP0以下になった場合、その時点で破壊される。攻撃終了後の破壊なら縄張り取得は発生しない。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/5/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 8/130 オオスズメバチ

```yaml
officialNumber: "8/130"
name: "オオスズメバチ"
set: "BOOSTER_SET_1"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 4
baseHp: 800
skills:
  - name: "かみきる"
    baseAp: 500
    effectSummary: null
  - name: "毒針"
    baseAp: 800
    effectSummary: "この個体が場にいる間、1回だけ使用できる。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "スズメバチ科"
  other: []
referencableTags:
  - "スズメバチ科"
rulings:
  - "1回制限は個体ごと。場を離れて再登場した個体は再度使用可能。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/8/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 9/130 ヤブキリ

```yaml
officialNumber: "9/130"
name: "ヤブキリ"
set: "BOOSTER_SET_1"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 4
baseHp: 600
skills:
  - name: "かみちぎる"
    baseAp: 400
    effectSummary: null
traits:
  - name: "とびだす"
    effectSummary: "縄張りから手札に加わる際、条件を満たせばコストを払わず場に出せる。"
effectSummary: null
taxonomy:
  order: null
  family: "キリギリス科"
  other: []
referencableTags:
  - "キリギリス科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/9/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 10/130 ミイデラゴミムシ

```yaml
officialNumber: "10/130"
name: "ミイデラゴミムシ"
set: "BOOSTER_SET_1"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 4
baseHp: 700
skills:
  - name: "かみつぶす"
    baseAp: 400
    effectSummary: null
traits:
  - name: "毒霧噴射"
    effectSummary: "虫の攻撃で破壊された時、その破壊元の虫を手札へ戻す。"
effectSummary: null
taxonomy:
  order: null
  family: "ホソクビゴミムシ科"
  other: []
referencableTags:
  - "ホソクビゴミムシ科"
rulings:
  - "攻撃以外の破壊では発動しない。破壊元がすでに場を離れていれば戻す対象がない。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/10/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 12/130 チョウセンカマキリ

```yaml
officialNumber: "12/130"
name: "チョウセンカマキリ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 4
baseHp: 800
skills:
  - name: "カマ斬撃"
    baseAp: 600
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "カマキリ科"
  other: []
referencableTags:
  - "カマキリ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/12/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 13/130 シオヤアブ

```yaml
officialNumber: "13/130"
name: "シオヤアブ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 4
baseHp: 800
skills:
  - name: "さす"
    baseAp: 500
    effectSummary: null
  - name: "吸血"
    baseAp: 200
    effectSummary: "次の相手ターン中、この虫のHPを200増やす。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "ムシヒキアブ科"
  other: []
referencableTags:
  - "ムシヒキアブ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/13/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 14/130 デスストーカー

```yaml
officialNumber: "14/130"
name: "デスストーカー"
set: "BOOSTER_SET_1"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 3
baseHp: 800
skills:
  - name: "きりきざむ"
    baseAp: 200
    effectSummary: null
  - name: "毒針"
    baseAp: 600
    effectSummary: "この個体が場にいる間、1回だけ使用できる。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "キョクトウサソリ科"
  other: []
referencableTags:
  - "キョクトウサソリ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/14/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 15/130 アリジゴク

```yaml
officialNumber: "15/130"
name: "アリジゴク"
set: "BOOSTER_SET_1"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 3
baseHp: 700
skills:
  - name: "はさみつく"
    baseAp: 300
    effectSummary: null
  - name: "アリ地獄"
    baseAp: 0
    effectSummary: "この技を受けた虫は、この虫が場にいる限り次のターン攻撃できない。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "ウスバカゲロウ科"
  other: []
referencableTags:
  - "ウスバカゲロウ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/15/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 16/130 キリギリス

```yaml
officialNumber: "16/130"
name: "キリギリス"
set: "BOOSTER_SET_1"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 3
baseHp: 800
skills:
  - name: "かみちぎる"
    baseAp: 100
    effectSummary: null
traits:
  - name: "鳴く"
    effectSummary: "相手は原則としてこの効果を持つ虫以外を攻撃できない。複数いればその中から選ぶ。"
effectSummary: null
taxonomy:
  order: null
  family: "キリギリス科"
  other: []
referencableTags:
  - "キリギリス科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/16/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 17/130 マイマイカブリ

```yaml
officialNumber: "17/130"
name: "マイマイカブリ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 3
baseHp: 400
skills:
  - name: "かみつぶす"
    baseAp: 300
    effectSummary: null
traits:
  - name: "とびだす"
    effectSummary: "縄張りから手札に加わる際、条件を満たせば場に出せる。"
effectSummary: null
taxonomy:
  order: null
  family: "オサムシ科"
  other: []
referencableTags:
  - "オサムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/17/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 18/130 コガネグモ

```yaml
officialNumber: "18/130"
name: "コガネグモ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 3
baseHp: 600
skills:
  - name: "かむ"
    baseAp: 400
    effectSummary: null
  - name: "蜘蛛の糸"
    baseAp: 0
    effectSummary: "この技を受けた虫は、この虫が場にいる限り次のターン攻撃できない。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "コガネグモ科"
  other: []
referencableTags:
  - "コガネグモ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/18/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 19/130 オニグモ

```yaml
officialNumber: "19/130"
name: "オニグモ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 3
baseHp: 700
skills:
  - name: "かむ"
    baseAp: 300
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "コガネグモ科"
  other: []
referencableTags:
  - "コガネグモ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/19/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 20/130 ハラビロカマキリ

```yaml
officialNumber: "20/130"
name: "ハラビロカマキリ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 3
baseHp: 600
skills:
  - name: "カマ斬撃"
    baseAp: 400
    effectSummary: null
  - name: "共食い"
    baseAp: 600
    effectSummary: "使用条件として、この虫以外の自分の虫1体を破壊する。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "カマキリ科"
  other: []
referencableTags:
  - "カマキリ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/20/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 21/130 ヒアリ

```yaml
officialNumber: "21/130"
name: "ヒアリ"
set: "BOOSTER_SET_1"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 400
skills:
  - name: "毒針"
    baseAp: "X"
    effectSummary: "自分の赤いエサの枚数×200を基礎APとして扱う。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "アリ科"
  other: []
referencableTags:
  - "アリ科"
rulings:
  - "X値をカード効果で決定した後にAP修正を加え、最後に属性倍率を適用する。裏向きのエサは色参照対象にならない。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/21/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 23/130 クロシデムシ

```yaml
officialNumber: "23/130"
name: "クロシデムシ"
set: "BOOSTER_SET_1"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 400
skills:
  - name: "死骸の山"
    baseAp: "X"
    effectSummary: "自分の捨て札枚数×100を基礎APとして扱う。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "シデムシ科"
  other: []
referencableTags:
  - "シデムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/23/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 25/130 シオカラトンボ

```yaml
officialNumber: "25/130"
name: "シオカラトンボ"
set: "BOOSTER_SET_1"
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
  []
effectSummary: null
taxonomy:
  order: null
  family: "トンボ科"
  other: []
referencableTags:
  - "トンボ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/25/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 26/130 ハンミョウ

```yaml
officialNumber: "26/130"
name: "ハンミョウ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 400
skills:
  - name: "かむ"
    baseAp: 300
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "ハンミョウ科"
  other: []
referencableTags:
  - "ハンミョウ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/26/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 27/130 ミツツボアリ

```yaml
officialNumber: "27/130"
name: "ミツツボアリ"
set: "BOOSTER_SET_1"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 1
baseHp: 200
skills:
  - name: "かみつく"
    baseAp: 100
    effectSummary: null
traits:
  - name: "蜜をためる"
    effectSummary: "場に出た時、手札から1枚をエサ場へ置いてもよい。その追加エサ分のコストはこのターン増えない。"
effectSummary: null
taxonomy:
  order: null
  family: "アリ科"
  other: []
referencableTags:
  - "アリ科"
rulings:
  - "カード効果で場に出た場合も『場に出た時』条件を満たす。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/27/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 28/130 ナナホシテントウ

```yaml
officialNumber: "28/130"
name: "ナナホシテントウ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 1
baseHp: 300
skills:
  - name: "かみつぶす"
    baseAp: 200
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "テントウムシ科"
  other: []
referencableTags:
  - "テントウムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/28/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 29/130 クロヤマアリ

```yaml
officialNumber: "29/130"
name: "クロヤマアリ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 1
baseHp: 300
skills:
  - name: "アリの大群"
    baseAp: "X"
    effectSummary: "自分の場の虫の数×100を基礎APとして扱う。この虫自身も数える。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "アリ科"
  other: []
referencableTags:
  - "アリ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/29/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 31/130 ハナグモ

```yaml
officialNumber: "31/130"
name: "ハナグモ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 1
baseHp: 200
skills:
  - name: "かむ"
    baseAp: 200
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "カニグモ科"
  other: []
referencableTags:
  - "カニグモ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/31/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 32/130 コカマキリ

```yaml
officialNumber: "32/130"
name: "コカマキリ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 1
baseHp: 200
skills:
  - name: "カマ斬撃"
    baseAp: 200
    effectSummary: null
  - name: "共食い"
    baseAp: 300
    effectSummary: "使用条件として、この虫以外の自分の虫1体を破壊する。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "カマキリ科"
  other: []
referencableTags:
  - "カマキリ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/32/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 33/130 クロオオアリ

```yaml
officialNumber: "33/130"
name: "クロオオアリ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 1
baseHp: 400
skills:
  - name: "かみつく"
    baseAp: 100
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "アリ科"
  other: []
referencableTags:
  - "アリ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/33/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 34/130 ヘラクレスオオカブト

```yaml
officialNumber: "34/130"
name: "ヘラクレスオオカブト"
set: "BOOSTER_SET_1"
rarity: "LR"
type: "INSECT"
color: "BLUE"
cost: 6
baseHp: 1600
skills:
  - name: "神のツノ突進"
    baseAp: 1000
    effectSummary: null
  - name: "ヘラクレス投げ"
    baseAp: 0
    effectSummary: "相手の虫1体を手札へ戻す。この個体が場にいる間1回だけ使用できる。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
rulings:
  - "虫が手札へ戻ると、その虫についていた強化カードは捨て札へ移る。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/34/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 35/130 コーカサスオオカブト

```yaml
officialNumber: "35/130"
name: "コーカサスオオカブト"
set: "BOOSTER_SET_1"
rarity: "SR"
type: "INSECT"
color: "BLUE"
cost: 5
baseHp: 1200
skills:
  - name: "ツノ突進"
    baseAp: 800
    effectSummary: null
  - name: "すくい投げ"
    baseAp: 0
    effectSummary: "相手の虫1体をターン終了時まで裏向きにする。裏向き中は『いないもの』として扱う。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/35/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 36/130 ミヤマクワガタ

```yaml
officialNumber: "36/130"
name: "ミヤマクワガタ"
set: "BOOSTER_SET_1"
rarity: "SR"
type: "INSECT"
color: "BLUE"
cost: 4
baseHp: 900
skills:
  - name: "オオアゴバサミ"
    baseAp: 700
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/36/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 37/130 ゴライアスオオツノハナムグリ

```yaml
officialNumber: "37/130"
name: "ゴライアスオオツノハナムグリ"
set: "BOOSTER_SET_1"
rarity: "SR"
type: "INSECT"
color: "BLUE"
cost: 5
baseHp: 800
skills:
  - name: "ふみつぶす"
    baseAp: 500
    effectSummary: null
traits:
  - name: "とびだす"
    effectSummary: "縄張りから手札に加わる際、条件を満たせば場に出せる。"
effectSummary: null
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/37/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 38/130 ギラファノコギリクワガタ

```yaml
officialNumber: "38/130"
name: "ギラファノコギリクワガタ"
set: "BOOSTER_SET_1"
rarity: "SR"
type: "INSECT"
color: "BLUE"
cost: 5
baseHp: 1200
skills:
  - name: "オオアゴバサミ"
    baseAp: 900
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/38/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 39/130 ニシキオオツバメガ

```yaml
officialNumber: "39/130"
name: "ニシキオオツバメガ"
set: "BOOSTER_SET_1"
rarity: "SR"
type: "INSECT"
color: "BLUE"
cost: 4
baseHp: 1000
skills:
  - name: "すする"
    baseAp: 300
    effectSummary: null
  - name: "虹色光沢"
    baseAp: 0
    effectSummary: "赤・青・緑から1色を選び、ターン終了時まで使用時点の相手の場の虫をすべてその色にする。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "ツバメガ科"
  other: []
referencableTags:
  - "ツバメガ科"
rulings:
  - "複数の相手虫へ別々の色は指定できない。使用後に場へ出た虫は影響を受けない。AP0でも合法な直接攻撃は成立する。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/39/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 41/130 オオクワガタ

```yaml
officialNumber: "41/130"
name: "オオクワガタ"
set: "BOOSTER_SET_1"
rarity: "SR"
type: "INSECT"
color: "BLUE"
cost: 5
baseHp: 1300
skills:
  - name: "オオアゴバサミ"
    baseAp: 800
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/41/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 42/130 オオムラサキ

```yaml
officialNumber: "42/130"
name: "オオムラサキ"
set: "BOOSTER_SET_1"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 4
baseHp: 1000
skills:
  - name: "すいとる"
    baseAp: 400
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "タテハチョウ科"
  other: []
referencableTags:
  - "タテハチョウ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/42/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 43/130 ヒラタクワガタ

```yaml
officialNumber: "43/130"
name: "ヒラタクワガタ"
set: "BOOSTER_SET_1"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 4
baseHp: 800
skills:
  - name: "はさむ"
    baseAp: 600
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/43/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 45/130 アオスジアゲハ

```yaml
officialNumber: "45/130"
name: "アオスジアゲハ"
set: "BOOSTER_SET_1"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 700
skills:
  - name: "すいつくす"
    baseAp: 300
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "アゲハチョウ科"
  other: []
referencableTags:
  - "アゲハチョウ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/45/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 46/130 ノコギリクワガタ

```yaml
officialNumber: "46/130"
name: "ノコギリクワガタ"
set: "BOOSTER_SET_1"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 600
skills:
  - name: "はさむ"
    baseAp: 400
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/46/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 48/130 クロアゲハ

```yaml
officialNumber: "48/130"
name: "クロアゲハ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 700
skills:
  - name: "すいつくす"
    baseAp: 200
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "アゲハチョウ科"
  other: []
referencableTags:
  - "アゲハチョウ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/48/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 49/130 オオゾウムシ

```yaml
officialNumber: "49/130"
name: "オオゾウムシ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 800
skills:
  - name: "なめる"
    baseAp: 200
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "オサゾウムシ科"
  other: []
referencableTags:
  - "オサゾウムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/49/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 50/130 オオスカシバ

```yaml
officialNumber: "50/130"
name: "オオスカシバ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 400
skills:
  - name: "すいつくす"
    baseAp: 500
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "スズメガ科"
  other: []
referencableTags:
  - "スズメガ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/50/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 51/130 ヤエヤママルバネクワガタ

```yaml
officialNumber: "51/130"
name: "ヤエヤママルバネクワガタ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 500
skills:
  - name: "はさむ"
    baseAp: 400
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/51/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 52/130 クマゼミ

```yaml
officialNumber: "52/130"
name: "クマゼミ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 700
skills:
  - name: "しぼりとる"
    baseAp: 300
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "セミ科"
  other: []
referencableTags:
  - "セミ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/52/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 53/130 セイヨウミツバチ

```yaml
officialNumber: "53/130"
name: "セイヨウミツバチ"
set: "BOOSTER_SET_1"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 2
baseHp: 500
skills:
  - name: "ハチダマアタック"
    baseAp: 200
    effectSummary: null
  - name: "決死の一撃"
    baseAp: 300
    effectSummary: "この技で攻撃を与えた後、この虫を破壊する。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "ミツバチ科"
  other: []
referencableTags:
  - "ミツバチ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/53/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 54/130 キムネクマバチ

```yaml
officialNumber: "54/130"
name: "キムネクマバチ"
set: "BOOSTER_SET_1"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 2
baseHp: 400
skills:
  - name: "かみきる"
    baseAp: 200
    effectSummary: null
  - name: "毒針"
    baseAp: 300
    effectSummary: "この個体が場にいる間、1回だけ使用できる。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "コシブトハナバチ科"
  other: []
referencableTags:
  - "コシブトハナバチ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/54/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 55/130 コクワガタ

```yaml
officialNumber: "55/130"
name: "コクワガタ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 2
baseHp: 400
skills:
  - name: "はさむ"
    baseAp: 300
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/55/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 56/130 アブラゼミ

```yaml
officialNumber: "56/130"
name: "アブラゼミ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 2
baseHp: 500
skills:
  - name: "しぼりとる"
    baseAp: 200
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "セミ科"
  other: []
referencableTags:
  - "セミ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/56/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 57/130 アカタテハ

```yaml
officialNumber: "57/130"
name: "アカタテハ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 2
baseHp: 400
skills:
  - name: "すいとる"
    baseAp: 200
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "タテハチョウ科"
  other: []
referencableTags:
  - "タテハチョウ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/57/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 58/130 アカアシクワガタ

```yaml
officialNumber: "58/130"
name: "アカアシクワガタ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 2
baseHp: 300
skills:
  - name: "はさむ"
    baseAp: 300
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/58/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 59/130 ヘビトンボ

```yaml
officialNumber: "59/130"
name: "ヘビトンボ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 2
baseHp: 500
skills:
  - name: "かむ"
    baseAp: 100
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "ヘビトンボ科"
  other: []
referencableTags:
  - "ヘビトンボ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/59/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 60/130 ニホンミツバチ

```yaml
officialNumber: "60/130"
name: "ニホンミツバチ"
set: "BOOSTER_SET_1"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 1
baseHp: 400
skills:
  - name: "ハチダマアタック"
    baseAp: 100
    effectSummary: null
  - name: "決死の一撃"
    baseAp: 200
    effectSummary: "この技で攻撃を与えた後、この虫を破壊する。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "ミツバチ科"
  other: []
referencableTags:
  - "ミツバチ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/60/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 61/130 モンシロチョウ

```yaml
officialNumber: "61/130"
name: "モンシロチョウ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 1
baseHp: 300
skills:
  - name: "すいとる"
    baseAp: 100
    effectSummary: null
traits:
  - name: "紋章"
    effectSummary: "自分の場にモンキチョウがいれば、この虫のAPを300増やす。"
effectSummary: null
taxonomy:
  order: null
  family: "シロチョウ科"
  other: []
referencableTags:
  - "シロチョウ科"
rulings:
  - "相方の枚数では累積しない。存在条件として扱う。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/61/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 62/130 モンキチョウ

```yaml
officialNumber: "62/130"
name: "モンキチョウ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 1
baseHp: 300
skills:
  - name: "すいとる"
    baseAp: 100
    effectSummary: null
traits:
  - name: "紋章"
    effectSummary: "自分の場にモンシロチョウがいれば、この虫のAPを300増やす。"
effectSummary: null
taxonomy:
  order: null
  family: "シロチョウ科"
  other: []
referencableTags:
  - "シロチョウ科"
rulings:
  - "相方の枚数では累積しない。存在条件として扱う。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/62/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 65/130 ネブトクワガタ

```yaml
officialNumber: "65/130"
name: "ネブトクワガタ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 1
baseHp: 400
skills:
  - name: "はさむ"
    baseAp: 100
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "クワガタムシ科"
  other: []
referencableTags:
  - "クワガタムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/65/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 66/130 アオカナブン

```yaml
officialNumber: "66/130"
name: "アオカナブン"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 1
baseHp: 300
skills:
  - name: "たいあたり"
    baseAp: 200
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/66/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 67/130 オオキバウスバカミキリ

```yaml
officialNumber: "67/130"
name: "オオキバウスバカミキリ"
set: "BOOSTER_SET_1"
rarity: "LR"
type: "INSECT"
color: "GREEN"
cost: 6
baseHp: 1700
skills:
  - name: "神のキバ無双"
    baseAp: 1200
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "カミキリムシ科"
  other: []
referencableTags:
  - "カミキリムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/67/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 68/130 テナガカミキリ

```yaml
officialNumber: "68/130"
name: "テナガカミキリ"
set: "BOOSTER_SET_1"
rarity: "SR"
type: "INSECT"
color: "GREEN"
cost: 5
baseHp: 1200
skills:
  - name: "キバ無双"
    baseAp: 800
    effectSummary: null
  - name: "テナガ攻撃"
    baseAp: 300
    effectSummary: "相手の虫2体を先に選び、各1体へ順番に攻撃する。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "カミキリムシ科"
  other: []
referencableTags:
  - "カミキリムシ科"
rulings:
  - "同じ虫を2回選べず、相手本体にも使えない。対象は使用時に2体とも確定する。1体目の処理で攻撃虫が場を離れた場合、2体目へのダメージは行わない。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/68/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 69/130 ジャイアントウェタ

```yaml
officialNumber: "69/130"
name: "ジャイアントウェタ"
set: "BOOSTER_SET_1"
rarity: "SR"
type: "INSECT"
color: "GREEN"
cost: 5
baseHp: 1300
skills:
  - name: "くらいつく"
    baseAp: 800
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "クロギリス科"
  other: []
referencableTags:
  - "クロギリス科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/69/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 70/130 シロスジカミキリ

```yaml
officialNumber: "70/130"
name: "シロスジカミキリ"
set: "BOOSTER_SET_1"
rarity: "SR"
type: "INSECT"
color: "GREEN"
cost: 5
baseHp: 1300
skills:
  - name: "くいちぎる"
    baseAp: 700
    effectSummary: null
  - name: "首を鳴らす"
    baseAp: 300
    effectSummary: "次の相手ターン中、この虫のHPを300増やす。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "カミキリムシ科"
  other: []
referencableTags:
  - "カミキリムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/70/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 72/130 オオコノハムシ

```yaml
officialNumber: "72/130"
name: "オオコノハムシ"
set: "BOOSTER_SET_1"
rarity: "SR"
type: "INSECT"
color: "GREEN"
cost: 4
baseHp: 800
skills:
  - name: "かぶりつく"
    baseAp: 600
    effectSummary: null
traits:
  - name: "擬態"
    effectSummary: "場に出た次の相手ターン中、虫の攻撃対象にならない。他に合法対象がいなければ直接攻撃になる。"
effectSummary: null
taxonomy:
  order: null
  family: "コノハムシ科"
  other: []
referencableTags:
  - "コノハムシ科"
rulings:
  - "術カードの対象制限とは別。擬態中でも『場に虫がいる』条件そのものは満たす場合がある。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/72/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 73/130 サバクトビバッタ

```yaml
officialNumber: "73/130"
name: "サバクトビバッタ"
set: "BOOSTER_SET_1"
rarity: "SR"
type: "INSECT"
color: "GREEN"
cost: 4
baseHp: 1000
skills:
  - name: "くらいつくす"
    baseAp: 400
    effectSummary: "相手へ直接攻撃が通った時、相手は自分のエサ1枚を選び手札へ戻す。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "バッタ科"
  other: []
referencableTags:
  - "バッタ科"
rulings:
  - "エサを戻す処理は縄張り取得より先。裏向きで参照不能なエサは選択対象にできない。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/73/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 74/130 ゴマダラカミキリ

```yaml
officialNumber: "74/130"
name: "ゴマダラカミキリ"
set: "BOOSTER_SET_1"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 4
baseHp: 700
skills:
  - name: "くいちぎる"
    baseAp: 300
    effectSummary: null
traits:
  - name: "とびだす"
    effectSummary: "縄張りから手札に加わる際、条件を満たせば場に出せる。"
effectSummary: null
taxonomy:
  order: null
  family: "カミキリムシ科"
  other: []
referencableTags:
  - "カミキリムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/74/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 75/130 クワカミキリ

```yaml
officialNumber: "75/130"
name: "クワカミキリ"
set: "BOOSTER_SET_1"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 4
baseHp: 800
skills:
  - name: "くいちぎる"
    baseAp: 600
    effectSummary: null
  - name: "首を鳴らす"
    baseAp: 200
    effectSummary: "次の相手ターン中、この虫のHPを200増やす。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "カミキリムシ科"
  other: []
referencableTags:
  - "カミキリムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/75/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 76/130 キアゲハ（幼虫）

```yaml
officialNumber: "76/130"
name: "キアゲハ（幼虫）"
set: "BOOSTER_SET_1"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 4
baseHp: 900
skills:
  - name: "かじる"
    baseAp: 400
    effectSummary: null
  - name: "くさいツノ"
    baseAp: 0
    effectSummary: "相手の虫1体を選び、その虫の次のターンのAPを600下げる。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "アゲハチョウ科"
  other: []
referencableTags:
  - "アゲハチョウ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/76/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 77/130 ショウリョウバッタ

```yaml
officialNumber: "77/130"
name: "ショウリョウバッタ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 4
baseHp: 900
skills:
  - name: "とびはねる"
    baseAp: 500
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "バッタ科"
  other: []
referencableTags:
  - "バッタ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/77/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 78/130 ヤマトタマムシ

```yaml
officialNumber: "78/130"
name: "ヤマトタマムシ"
set: "BOOSTER_SET_1"
rarity: "SR"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 600
skills:
  - name: "くいあらす"
    baseAp: 200
    effectSummary: null
  - name: "虹色光沢"
    baseAp: 0
    effectSummary: "赤・青・緑から1色を選び、ターン終了時まで使用時点の相手の場の虫をすべてその色にする。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "タマムシ科"
  other: []
referencableTags:
  - "タマムシ科"
rulings:
  - "使用後に場へ出た虫は元の色のまま。相手虫ごとに別色は指定できない。AP0でも直接攻撃は成立し得る。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/78/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 81/130 クロカタゾウムシ

```yaml
officialNumber: "81/130"
name: "クロカタゾウムシ"
set: "BOOSTER_SET_1"
rarity: "SR"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 1000
skills:
  - name: "くいあさる"
    baseAp: 200
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "ゾウムシ科"
  other: []
referencableTags:
  - "ゾウムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/81/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 82/130 オオムラサキ（幼虫）

```yaml
officialNumber: "82/130"
name: "オオムラサキ（幼虫）"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 700
skills:
  - name: "かじる"
    baseAp: 300
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "タテハチョウ科"
  other: []
referencableTags:
  - "タテハチョウ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/82/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 83/130 イボバッタ

```yaml
officialNumber: "83/130"
name: "イボバッタ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 400
skills:
  - name: "はねる"
    baseAp: 300
    effectSummary: null
traits:
  - name: "とびだす"
    effectSummary: "縄張りから手札に加わる際、条件を満たせば場に出せる。"
effectSummary: null
taxonomy:
  order: null
  family: "バッタ科"
  other: []
referencableTags:
  - "バッタ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/83/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 84/130 コバネイナゴ

```yaml
officialNumber: "84/130"
name: "コバネイナゴ"
set: "BOOSTER_SET_1"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 400
skills:
  - name: "はねる"
    baseAp: 200
    effectSummary: null
  - name: "イナゴの大群"
    baseAp: 400
    effectSummary: "使用条件として、自分のエサ1枚を破壊する。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "イナゴ科"
  other: []
referencableTags:
  - "イナゴ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/84/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 85/130 アオクサカメムシ

```yaml
officialNumber: "85/130"
name: "アオクサカメムシ"
set: "BOOSTER_SET_1"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 400
skills:
  - name: "くいつく"
    baseAp: 200
    effectSummary: null
traits:
  - name: "毒霧噴射"
    effectSummary: "虫の攻撃で破壊された時、その破壊元の虫を手札へ戻す。"
effectSummary: null
taxonomy:
  order: null
  family: "カメムシ科"
  other: []
referencableTags:
  - "カメムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/85/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 86/130 オトシブミ

```yaml
officialNumber: "86/130"
name: "オトシブミ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 600
skills:
  - name: "くいつく"
    baseAp: 100
    effectSummary: null
  - name: "ゆりかご"
    baseAp: 0
    effectSummary: "次の相手ターン中、この虫のHPを200増やす。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "オトシブミ科"
  other: []
referencableTags:
  - "オトシブミ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/86/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 87/130 ゴマダラオトシブミ

```yaml
officialNumber: "87/130"
name: "ゴマダラオトシブミ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 500
skills:
  - name: "くいつく"
    baseAp: 200
    effectSummary: null
  - name: "ゆりかご"
    baseAp: 0
    effectSummary: "次の相手ターン中、この虫のHPを200増やす。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "オトシブミ科"
  other: []
referencableTags:
  - "オトシブミ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/87/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 88/130 イラガ（幼虫）

```yaml
officialNumber: "88/130"
name: "イラガ（幼虫）"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 400
skills:
  - name: "さす"
    baseAp: 300
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "イラガ科"
  other: []
referencableTags:
  - "イラガ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/88/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 89/130 コガネムシ

```yaml
officialNumber: "89/130"
name: "コガネムシ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 500
skills:
  - name: "かじりつく"
    baseAp: 200
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/89/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 90/130 ウバタマムシ

```yaml
officialNumber: "90/130"
name: "ウバタマムシ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 600
skills:
  - name: "くいあらす"
    baseAp: 100
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "タマムシ科"
  other: []
referencableTags:
  - "タマムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/90/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 92/130 チャバネアオカメムシ

```yaml
officialNumber: "92/130"
name: "チャバネアオカメムシ"
set: "BOOSTER_SET_1"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 1
baseHp: 200
skills:
  - name: "くいつく"
    baseAp: 100
    effectSummary: null
traits:
  - name: "毒霧噴射"
    effectSummary: "虫の攻撃で破壊された時、その破壊元の虫を手札へ戻す。"
effectSummary: null
taxonomy:
  order: null
  family: "カメムシ科"
  other: []
referencableTags:
  - "カメムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/92/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 93/130 オンブバッタ

```yaml
officialNumber: "93/130"
name: "オンブバッタ"
set: "BOOSTER_SET_1"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 1
baseHp: 300
skills:
  - name: "はねる"
    baseAp: 100
    effectSummary: null
  - name: "おんぶ"
    baseAp: 0
    effectSummary: "この虫についている強化カード1枚を、自分の別の虫へ付け替える。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "オンブバッタ科"
  other: []
referencableTags:
  - "オンブバッタ科"
rulings:
  - "付け替え先がなければ使用不可。AP0でも合法な直接攻撃は成立する。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/93/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 94/130 カイコ（幼虫）

```yaml
officialNumber: "94/130"
name: "カイコ（幼虫）"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 1
baseHp: 400
skills:
  - name: "かじる"
    baseAp: 100
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "カイコガ科"
  other: []
referencableTags:
  - "カイコガ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/94/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 96/130 マメコガネ

```yaml
officialNumber: "96/130"
name: "マメコガネ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 1
baseHp: 300
skills:
  - name: "かじりつく"
    baseAp: 200
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/96/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 97/130 ハラヒシバッタ

```yaml
officialNumber: "97/130"
name: "ハラヒシバッタ"
set: "BOOSTER_SET_1"
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
  - name: "擬態"
    effectSummary: "場に出た次の相手ターン中、虫の攻撃対象にならない。他に合法対象がいなければ直接攻撃になる。"
effectSummary: null
taxonomy:
  order: null
  family: "ヒシバッタ科"
  other: []
referencableTags:
  - "ヒシバッタ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/97/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 98/130 ツマグロオオヨコバイ

```yaml
officialNumber: "98/130"
name: "ツマグロオオヨコバイ"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 1
baseHp: 200
skills:
  - name: "すう"
    baseAp: 200
    effectSummary: null
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "オオヨコバイ科"
  other: []
referencableTags:
  - "オオヨコバイ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/98/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 99/130 オオミノガ（幼虫）

```yaml
officialNumber: "99/130"
name: "オオミノガ（幼虫）"
set: "BOOSTER_SET_1"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 1
baseHp: 300
skills:
  - name: "くいつく"
    baseAp: 100
    effectSummary: null
  - name: "ミノにこもる"
    baseAp: 0
    effectSummary: "次の相手ターン中、この虫のHPを200増やす。"
traits:
  []
effectSummary: null
taxonomy:
  order: null
  family: "ミノガ科"
  other: []
referencableTags:
  - "ミノガ科"
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/99/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: "VERIFIED_SECONDARY"
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 100/130 雀蜂の毒針

```yaml
officialNumber: "100/130"
name: "雀蜂の毒針"
set: "BOOSTER_SET_1"
rarity: "R"
type: "ENHANCEMENT"
color: null
cost: 1
baseHp: null
skills:
  []
traits:
  []
effectSummary: "装着した虫のAPを500増やす。"
taxonomy:
  null
referencableTags: []
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/100/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: null
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 102/130 空蝉の皮鎧

```yaml
officialNumber: "102/130"
name: "空蝉の皮鎧"
set: "BOOSTER_SET_1"
rarity: "SR"
type: "ENHANCEMENT"
color: null
cost: 2
baseHp: null
skills:
  []
traits:
  []
effectSummary: "装着虫が破壊される時、この強化を代わりに破壊し、装着虫のHPを元の値まで回復する。その置換では縄張りを取らない。"
taxonomy:
  null
referencableTags: []
rulings:
  - "回復不能ダメージなどが残る場合、置換直後に再びHP0以下となって破壊され得る。"
  - "複数装着時も同時に全部を消費せず、必要な1枚で置換する。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/102/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: null
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 103/130 蚕玉の加護

```yaml
officialNumber: "103/130"
name: "蚕玉の加護"
set: "BOOSTER_SET_1"
rarity: "R"
type: "ENHANCEMENT"
color: null
cost: 1
baseHp: null
skills:
  []
traits:
  []
effectSummary: "装着した虫のHPを800増やす。"
taxonomy:
  null
referencableTags: []
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/103/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: null
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 104/130 螻蛄の七芸

```yaml
officialNumber: "104/130"
name: "螻蛄の七芸"
set: "BOOSTER_SET_1"
rarity: "N"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills:
  []
traits:
  []
effectSummary: "自分の場の強化カード1枚を選び、自分の別の虫へ付け替える。"
taxonomy:
  null
referencableTags: []
rulings:
  - "『付け替える』は強化カードを新たに場へ出す処理ではない。登場時効果は再発動しない。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/104/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: null
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 105/130 蜜蝋の壁

```yaml
officialNumber: "105/130"
name: "蜜蝋の壁"
set: "BOOSTER_SET_1"
rarity: "R"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills:
  []
traits:
  []
effectSummary: "このカード自身を表向きの縄張りとして追加する。縄張りから取られた場合は手札ではなく捨て札へ送る。"
taxonomy:
  null
referencableTags: []
rulings:
  - "山札切れ時の縄張り枚数比較では通常の縄張り同様に数える。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/105/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: null
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 109/130 鳳蝶の蟲惑

```yaml
officialNumber: "109/130"
name: "鳳蝶の蟲惑"
set: "BOOSTER_SET_1"
rarity: "N"
type: "ENHANCEMENT"
color: null
cost: 0
baseHp: null
skills:
  []
traits:
  []
effectSummary: "装着虫が有効な間、相手は原則その虫以外を攻撃できない。同種の攻撃誘導効果が複数あれば、その中から合法対象を選ぶ。"
taxonomy:
  null
referencableTags: []
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/109/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: null
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 110/130 不滅の王台

```yaml
officialNumber: "110/130"
name: "不滅の王台"
set: "BOOSTER_SET_1"
rarity: "N"
type: "ENHANCEMENT"
color: null
cost: 0
baseHp: null
skills:
  []
traits:
  []
effectSummary: "装着虫が自分の場にいる間、自分は縄張りを取らない。ただし装着虫自身が虫の攻撃で破壊された時は通常どおり縄張りを取る。"
taxonomy:
  null
referencableTags: []
rulings:
  - "縄張り0枚で直接攻撃を受ければ、縄張り取得を防いでも敗北条件は成立する。"
  - "装着虫が裏向きになりカード外へ及ぼす継続効果が無効になる場合がある。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/110/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: null
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 111/130 鋏虫の芯切り鋏

```yaml
officialNumber: "111/130"
name: "鋏虫の芯切り鋏"
set: "BOOSTER_SET_1"
rarity: "N"
type: "ENHANCEMENT"
color: null
cost: 0
baseHp: null
skills:
  []
traits:
  []
effectSummary: "装着虫の攻撃によって相手が縄張りを取る時、その縄張りカードの＜とびだす＞を使用できなくする。"
taxonomy:
  null
referencableTags: []
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/111/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: null
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 112/130 剣の息吹

```yaml
officialNumber: "112/130"
name: "剣の息吹"
set: "BOOSTER_SET_1"
rarity: "N"
type: "ENHANCEMENT"
color: null
cost: 0
baseHp: null
skills:
  []
traits:
  []
effectSummary: "装着した虫の色を赤にする。"
taxonomy:
  null
referencableTags: []
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/112/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: null
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 113/130 勾玉の息吹

```yaml
officialNumber: "113/130"
name: "勾玉の息吹"
set: "BOOSTER_SET_1"
rarity: "N"
type: "ENHANCEMENT"
color: null
cost: 0
baseHp: null
skills:
  []
traits:
  []
effectSummary: "装着した虫の色を青にする。"
taxonomy:
  null
referencableTags: []
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/113/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: null
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 114/130 鏡の息吹

```yaml
officialNumber: "114/130"
name: "鏡の息吹"
set: "BOOSTER_SET_1"
rarity: "N"
type: "ENHANCEMENT"
color: null
cost: 0
baseHp: null
skills:
  []
traits:
  []
effectSummary: "装着した虫の色を緑にする。"
taxonomy:
  null
referencableTags: []
rulings:
  - "複数の色変更が重なった場合は、現在有効な中で後から適用された変更を優先する裁定を要確認・実装テストする。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/114/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: null
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 115/130 蟷螂の構え

```yaml
officialNumber: "115/130"
name: "蟷螂の構え"
set: "BOOSTER_SET_1"
rarity: "LR"
type: "SPELL"
color: null
cost: 3
baseHp: null
skills:
  []
traits:
  []
effectSummary: "自分の攻撃済みの虫1体を選び、その虫をもう1回攻撃可能にする。"
taxonomy:
  null
referencableTags: []
rulings:
  - "複数回使用可能。攻撃禁止状態そのものを解除する効果ではない。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/115/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: null
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 116/130 瀬戸際の虫時雨

```yaml
officialNumber: "116/130"
name: "瀬戸際の虫時雨"
set: "BOOSTER_SET_1"
rarity: "LR"
type: "SPELL"
color: null
cost: 4
baseHp: null
skills:
  []
traits:
  []
effectSummary: "自分のエサ場にある同じ色の虫を最大2体まで選び、順番に場へ出す。ターン終了時に、それらを破壊する。"
taxonomy:
  null
referencableTags: []
rulings:
  - "2体は順番に場へ出し、登場時効果もその順番で処理する。"
  - "その後に場を離れた虫には、元の遅延破壊は追跡して適用しない。"
  - "空蝉の皮鎧でターン終了時破壊を置換できる。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/116/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: null
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 117/130 退魔の蚊遣り火

```yaml
officialNumber: "117/130"
name: "退魔の蚊遣り火"
set: "BOOSTER_SET_1"
rarity: "SR"
type: "SPELL"
color: null
cost: 3
baseHp: null
skills:
  []
traits:
  []
effectSummary: "相手の虫1体を選び、破壊する。"
taxonomy:
  null
referencableTags: []
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/117/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: null
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 119/130 蠱毒の因果

```yaml
officialNumber: "119/130"
name: "蠱毒の因果"
set: "BOOSTER_SET_1"
rarity: "R"
type: "SPELL"
color: null
cost: 2
baseHp: null
skills:
  []
traits:
  []
effectSummary: "山札上から1枚を表向きに引く。虫なら場へ出してターン終了時に破壊し、虫以外なら手札へ加える。"
taxonomy:
  null
referencableTags: []
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/119/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: null
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 120/130 叛逆の蛮勇

```yaml
officialNumber: "120/130"
name: "叛逆の蛮勇"
set: "BOOSTER_SET_1"
rarity: "R"
type: "SPELL"
color: null
cost: 1
baseHp: null
skills:
  []
traits:
  []
effectSummary: "自分の捨て札の虫1体と、自分の場の虫1体を交換する。これで場へ出た虫はそのターン攻撃できない。"
taxonomy:
  null
referencableTags: []
rulings:
  - "交換は破壊ではないため、破壊時効果や空蝉の皮鎧の置換条件を満たさない。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/120/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: null
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 121/130 斑猫の手招き

```yaml
officialNumber: "121/130"
name: "斑猫の手招き"
set: "BOOSTER_SET_1"
rarity: "R"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills:
  []
traits:
  []
effectSummary: "自分のエサ場にある虫1枚を手札へ戻す。"
taxonomy:
  null
referencableTags: []
rulings:
  - "メインフェイズ中にエサが減っても、すでに発生したavailableCostは減らない。裏向きエサは通常の色・虫参照対象から外れる。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/121/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: null
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 122/130 百足の狂乱

```yaml
officialNumber: "122/130"
name: "百足の狂乱"
set: "BOOSTER_SET_1"
rarity: "SR"
type: "SPELL"
color: null
cost: 1
baseHp: null
skills:
  []
traits:
  []
effectSummary: "使用時点で自分の場にいるすべての虫のAPを、ターン終了時まで300増やす。"
taxonomy:
  null
referencableTags: []
rulings:
  - "使用後に場へ出た虫はこの修正を受けない。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/122/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: null
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 123/130 蜉蝣の閃き

```yaml
officialNumber: "123/130"
name: "蜉蝣の閃き"
set: "BOOSTER_SET_1"
rarity: "R"
type: "SPELL"
color: null
cost: 1
baseHp: null
skills:
  []
traits:
  []
effectSummary: "自分のエサ場にある虫1体を選び場へ出す。ターン終了時にその虫を破壊する。"
taxonomy:
  null
referencableTags: []
rulings:
  - "術に支払ったコストの元になったエサも、適切な対象なら選択できる。"
  - "場を離れた場合、元のターン終了時破壊は追跡しない。"
  - "エサ場で受けていた色変更は、場へ移動した際に引き継がない。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/123/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: null
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 125/130 玉響の蠢き

```yaml
officialNumber: "125/130"
name: "玉響の蠢き"
set: "BOOSTER_SET_1"
rarity: "R"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills:
  []
traits:
  []
effectSummary: "手札の虫1体を選び、場へ出す。ターン終了時にその虫を破壊する。"
taxonomy:
  null
referencableTags: []
rulings:
  - "虫がその後裏向きになっても、同じ場の個体である限りターン終了時破壊は処理される。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/125/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: null
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 126/130 繚乱の足掻き

```yaml
officialNumber: "126/130"
name: "繚乱の足掻き"
set: "BOOSTER_SET_1"
rarity: "N"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills:
  []
traits:
  []
effectSummary: "同じ印刷コストの、自分の手札の虫1体と自分の場の虫1体を交換する。これで場へ出た虫はそのターン攻撃できない。"
taxonomy:
  null
referencableTags: []
rulings:
  - "コスト参照は特記がなければカードに印刷された元コストを使う。"
  - "交換で場を離れた虫に付いていた遅延効果は新しい虫へ引き継がない。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/126/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: null
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 128/130 埋葬虫の野辺送り

```yaml
officialNumber: "128/130"
name: "埋葬虫の野辺送り"
set: "BOOSTER_SET_1"
rarity: "N"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills:
  []
traits:
  []
effectSummary: "相手の場の強化カード1枚を選び、破壊する。"
taxonomy:
  null
referencableTags: []
rulings:
  - "虫ではなく強化カードそのものを対象として選ぶ。"
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/128/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: null
  rulings: "OFFICIAL_QA_SUMMARY"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

## 130/130 蟲封じの蛍袋

```yaml
officialNumber: "130/130"
name: "蟲封じの蛍袋"
set: "BOOSTER_SET_1"
rarity: "N"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills:
  []
traits:
  []
effectSummary: "相手の虫1体を選ぶ。その虫は次のターン攻撃できない。"
taxonomy:
  null
referencableTags: []
rulings:
  []
sources:
  cardDetail: "https://mushijingi.com/card/MUSHI/130/"
  officialSet1QA: "https://mushijingi.jimdofree.com/q-a-よくある質問/第１弾のカードについて/"
verification:
  basicCardData: "VERIFIED_SECONDARY"
  taxonomy: null
  rulings: "NO_CARD_SPECIFIC_RULING_RECORDED"
implementationStatus: "READY_FOR_ENGINE_REVIEW"
blocked:
  - "公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。"
```

---

# 4. 生物分類インデックス

> 後続カードの『○○科』参照を高速に判定するための索引。

```yaml
families:
  "アゲハチョウ科":
    - "アオスジアゲハ"
    - "クロアゲハ"
    - "キアゲハ（幼虫）"
  "アリ科":
    - "ヒアリ"
    - "ミツツボアリ"
    - "クロヤマアリ"
    - "クロオオアリ"
  "イナゴ科":
    - "コバネイナゴ"
  "イラガ科":
    - "イラガ（幼虫）"
  "ウスバカゲロウ科":
    - "アリジゴク"
  "オオツチグモ科":
    - "メキシカンレッドニー"
  "オオムカデ科":
    - "トビズムカデ"
  "オオヨコバイ科":
    - "ツマグロオオヨコバイ"
  "オサゾウムシ科":
    - "オオゾウムシ"
  "オサムシ科":
    - "マイマイカブリ"
  "オトシブミ科":
    - "オトシブミ"
    - "ゴマダラオトシブミ"
  "オニヤンマ科":
    - "オニヤンマ"
  "オンブバッタ科":
    - "オンブバッタ"
  "カイコガ科":
    - "カイコ（幼虫）"
  "カニグモ科":
    - "ハナグモ"
  "カマキリ科":
    - "チョウセンカマキリ"
    - "ハラビロカマキリ"
    - "コカマキリ"
  "カミキリムシ科":
    - "オオキバウスバカミキリ"
    - "テナガカミキリ"
    - "シロスジカミキリ"
    - "ゴマダラカミキリ"
    - "クワカミキリ"
  "カメムシ科":
    - "アオクサカメムシ"
    - "チャバネアオカメムシ"
  "キョクトウサソリ科":
    - "デスストーカー"
  "キリギリス科":
    - "ヤブキリ"
    - "キリギリス"
  "クロギリス科":
    - "リオック"
    - "ジャイアントウェタ"
  "クワガタムシ科":
    - "ミヤマクワガタ"
    - "ギラファノコギリクワガタ"
    - "オオクワガタ"
    - "ヒラタクワガタ"
    - "ノコギリクワガタ"
    - "ヤエヤママルバネクワガタ"
    - "コクワガタ"
    - "アカアシクワガタ"
    - "ネブトクワガタ"
  "コガネグモ科":
    - "コガネグモ"
    - "オニグモ"
  "コガネムシ科":
    - "ヘラクレスオオカブト"
    - "コーカサスオオカブト"
    - "ゴライアスオオツノハナムグリ"
    - "アオカナブン"
    - "コガネムシ"
    - "マメコガネ"
  "コシブトハナバチ科":
    - "キムネクマバチ"
  "コノハムシ科":
    - "オオコノハムシ"
  "シデムシ科":
    - "クロシデムシ"
  "シロチョウ科":
    - "モンシロチョウ"
    - "モンキチョウ"
  "スズメガ科":
    - "オオスカシバ"
  "スズメバチ科":
    - "オオスズメバチ"
  "セミ科":
    - "クマゼミ"
    - "アブラゼミ"
  "ゾウムシ科":
    - "クロカタゾウムシ"
  "タテハチョウ科":
    - "オオムラサキ"
    - "アカタテハ"
    - "オオムラサキ（幼虫）"
  "タマムシ科":
    - "ヤマトタマムシ"
    - "ウバタマムシ"
  "ツバメガ科":
    - "ニシキオオツバメガ"
  "テントウムシ科":
    - "ナナホシテントウ"
  "トンボ科":
    - "シオカラトンボ"
  "ハンミョウ科":
    - "ハンミョウ"
  "バッタ科":
    - "サバクトビバッタ"
    - "ショウリョウバッタ"
    - "イボバッタ"
  "ヒシバッタ科":
    - "ハラヒシバッタ"
  "ヘビトンボ科":
    - "ヘビトンボ"
  "ホソクビゴミムシ科":
    - "ミイデラゴミムシ"
  "ミツバチ科":
    - "セイヨウミツバチ"
    - "ニホンミツバチ"
  "ミノガ科":
    - "オオミノガ（幼虫）"
  "ムシヒキアブ科":
    - "シオヤアブ"
  "ヨウカイカマキリ科":
    - "ニセハナマオウカマキリ"
```

# 5. 特性インデックス

```yaml
traits:
  "とびだす":
    - "ヤブキリ"
    - "マイマイカブリ"
    - "ゴライアスオオツノハナムグリ"
    - "ゴマダラカミキリ"
    - "イボバッタ"
  "エサにする":
    - "リオック"
  "擬態":
    - "オオコノハムシ"
    - "ハラヒシバッタ"
  "毒霧噴射":
    - "ミイデラゴミムシ"
    - "アオクサカメムシ"
    - "チャバネアオカメムシ"
  "紋章":
    - "モンシロチョウ"
    - "モンキチョウ"
  "蜜をためる":
    - "ミツツボアリ"
  "鳴く":
    - "キリギリス"
```

# 6. 実装AIへの必須指示

```text
このファイルと MUSHI_MANUAL.md を、蟲神器実装の基準資料として最初に読むこと。

1. 一般的なTCG知識からルールを推測しない。
2. 技・技効果・＜○○＞特性・特性効果・○○科を別データとして扱う。
3. taxonomy.family はゲーム効果から参照可能なデータであり、フレーバー扱いしない。
4. effectSummary / rulings と既存コードが矛盾する場合、既存コードを黙って優先せず差分を報告する。
5. 公式Q&Aと本書が矛盾した場合は公式Q&Aを優先する。
6. 不明点は BLOCKED とし、似たカードや他TCGから類推実装しない。
7. 新カードを実装するときは、カード番号・技・特性・分類・裁定の5項目を確認してからコードを書く。
```

# 7. QAチェック結果

- Total booster cards: **106**
- Insects: **83**
- Enhancements: **9**
- Spells: **14**
- Cards with structured family: **83**
- Cards with `＜○○＞` traits: **15**
- Unique families: **46**
- Unique traits: **7**
- Number coverage: **PASS**
- Duplicate officialNumber: **PASS**

## Remaining verification policy

このv1.0は、106種を実装用の単一ファイルへ統合した版。基本カードデータと分類は非公式カードDBを探索補助として整理し、主要な複雑カードには公式Q&A由来の裁定要約を付与している。
ただし、全106枚のカード画像を1枚ずつ公式一次資料と突合したことを意味しない。実装時に公式画像または公式Q&Aと差分が見つかった場合は、公式を正として更新する。