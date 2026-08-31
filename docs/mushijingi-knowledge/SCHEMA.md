# 蟲神器カード知識庫 共通スキーマ

各カードは見出しの直後にYAMLコードブロックとして保存する。値が確認できない場合は `null` を使い、`blocked` に不足理由を記録する。

```yaml
officialNumber: "1/55"
name: "カード名"
set: "BOOSTER_SET_2"
rarity: "UR|LR|SR|R|N"
type: "INSECT|ENHANCEMENT|TECHNIQUE"
color: "RED|BLUE|GREEN|COLORLESS|null"
cost: 0
baseHp: 0
skills:
  - name: "技名"
    baseAp: 0 # または "X"
    effectSummary: null
traits:
  - name: "特性名（山括弧を除く）"
    effectSummary: "実装に必要な短い意味要約"
effectSummary: null
taxonomy:
  order: null
  family: null
  other: []
referencableTags: []
rulings: []
sources:
  cardDetail: "URL"
  officialSetQA: "URL"
verification:
  basicCardData: "VERIFIED_SECONDARY|BLOCKED"
  taxonomy: "VERIFIED_SECONDARY|NOT_APPLICABLE|BLOCKED"
  rulings: "OFFICIAL_QA_SUMMARY|NO_OFFICIAL_QA_MATCH|BLOCKED"
implementationStatus: "READY_FOR_ENGINE_REVIEW|BLOCKED"
blocked: []
```

## 正規化規則

- `type` は虫カード=`INSECT`、強化カード=`ENHANCEMENT`、術カード=`TECHNIQUE`。
- `color` と `baseHp` は虫カード以外では `null`。
- `skills` は虫カードの通常技だけを格納する。`＜○○＞` は `traits` へ分離する。
- 術・強化カードの本文は `effectSummary` に格納する。
- `taxonomy.family` はカード解説中の「○○科」を探索補助資料から抽出する。
- `rulings` は公式Q&Aの実装上重要な意味を要約し、質問回答の長文転載はしない。
- 公式Q&Aがないことはカード表面情報の不備ではない。`NO_OFFICIAL_QA_MATCH` とする。
- ソース間矛盾、解析不能、欠落は推測で埋めず `BLOCKED` とする。

## 弾ごとの完成条件

1. 期待番号がすべて一度だけ存在する。
2. 全カードに必須キーが存在する。
3. `INSECT + ENHANCEMENT + TECHNIQUE` が期待枚数と一致する。
4. 虫カードの `color`、`cost`、`baseHp`、最低1件の `skills` が確認済み、または不足理由が `blocked` に明記される。
5. 非虫カードの `effectSummary` が確認済み、または不足理由が `blocked` に明記される。
6. 分類・特性インデックス、BLOCKED一覧、監査結果がカタログ末尾にある。
