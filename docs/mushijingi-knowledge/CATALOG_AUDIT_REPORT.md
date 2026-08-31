# 蟲神器 SET1〜SET7 横断クリーニング監査

## 結論

- 高確度で機械修正できる項目を修正済み。
- SET2〜SET7 の術カード型を `SPELL` に統一。
- 明白な誤字・重複・family不一致を修正。
- `色変更` タグを「実際にカード/エサの色状態を変更する効果」に限定して高確度範囲で整理。
- 公式現物との全件画像突合は未実施。基本カードデータの `VERIFIED_SECONDARY` は維持。
- Q&A由来の文章には原文側の表記揺れが含まれる可能性があるため、意味が変わり得る箇所は今回一括修正していない。

## 修正一覧

- **SET2_CATALOG.md**: 術カードのtypeがTECHNIQUE → SPELLへ統一 （5件 / confidence: HIGH）
- **SET3_CATALOG.md**: 術カードのtypeがTECHNIQUE → SPELLへ統一 （11件 / confidence: HIGH）
- **SET4_CATALOG.md**: 術カードのtypeがTECHNIQUE → SPELLへ統一 （10件 / confidence: HIGH）
- **SET5_CATALOG.md**: 術カードのtypeがTECHNIQUE → SPELLへ統一 （9件 / confidence: HIGH）
- **SET6_CATALOG.md**: 術カードのtypeがTECHNIQUE → SPELLへ統一 （9件 / confidence: HIGH）
- **SET7_CATALOG.md**: 術カードのtypeがTECHNIQUE → SPELLへ統一 （8件 / confidence: HIGH）
- **SET3_CATALOG.md**: 明白な文字崩れを修正 → 文字列修正 （1件 / confidence: HIGH）
- **SET4_CATALOG.md**: カード名の不自然な空白を修正 → 文字列修正 （2件 / confidence: HIGH）
- **SET6_CATALOG.md**: 効果文の重複文字列を修正 → 文字列修正 （1件 / confidence: HIGH）
- **SET6_CATALOG.md**: 表記揺れを修正 → 文字列修正 （1件 / confidence: HIGH）
- **SET6_CATALOG.md**: 明白な誤字を修正 → 文字列修正 （1件 / confidence: HIGH）
- **SET7_CATALOG.md**: 同名カード・既知分類とのfamily不一致を修正 → 文字列修正 （3件 / confidence: HIGH）
- **SET3_CATALOG.md**: 24/60 ニジイロクワガタ: 実際に色を変更するが色変更タグ欠落 → referencableTagsへ"色変更"追加 （1件 / confidence: HIGH）
- **SET4_CATALOG.md**: 8/64 バーチェルグンタイアリ メディア: 実際に色を変更するが色変更タグ欠落 → referencableTagsへ"色変更"追加 （1件 / confidence: HIGH）
- **SET5_CATALOG.md**: 5/64 アオズムカデ: 実際に色を変更するが色変更タグ欠落 → referencableTagsへ"色変更"追加 （1件 / confidence: HIGH）
- **SET4_CATALOG.md**: 43/64 カイコ: 効果は色変更ではないのに色変更タグあり → referencableTagsから"色変更"削除 （1件 / confidence: HIGH）
- **SET5_CATALOG.md**: 4/64 ヒノマルコロギス: 効果は色変更ではないのに色変更タグあり → referencableTagsから"色変更"削除 （1件 / confidence: HIGH）
- **SET5_CATALOG.md**: 32/64 サザンフランネルモス（幼虫）: 効果は色変更ではないのに色変更タグあり → referencableTagsから"色変更"削除 （1件 / confidence: HIGH）
- **SET5_CATALOG.md**: 39/64 カラスアゲハ（幼虫）: 効果は色変更ではないのに色変更タグあり → referencableTagsから"色変更"削除 （1件 / confidence: HIGH）
- **SET7_CATALOG.md**: 9/64 オオシオカラトンボ: 効果は色変更ではないのに色変更タグあり → referencableTagsから"色変更"削除 （1件 / confidence: HIGH）
- **SET7_CATALOG.md**: 16/64 スマトラオオヒラタクワガタ: 効果は色変更ではないのに色変更タグあり → referencableTagsから"色変更"削除 （1件 / confidence: HIGH）
- **SET7_CATALOG.md**: 17/64 マルスゾウカブト: 効果は色変更ではないのに色変更タグあり → referencableTagsから"色変更"削除 （1件 / confidence: HIGH）
- **SET7_CATALOG.md**: 35/64 ヤマトタマムシ: 効果は色変更ではないのに色変更タグあり → referencableTagsから"色変更"削除 （1件 / confidence: HIGH）

## 機械監査結果

- SET1_CATALOG.md: `TECHNIQUE=0` / `SPELL=14` / `オオムカテ科=0`
- SET2_CATALOG.md: `TECHNIQUE=0` / `SPELL=5` / `オオムカテ科=0`
- SET3_CATALOG.md: `TECHNIQUE=0` / `SPELL=11` / `オオムカテ科=0`
- SET4_CATALOG.md: `TECHNIQUE=0` / `SPELL=10` / `オオムカテ科=0`
- SET5_CATALOG.md: `TECHNIQUE=0` / `SPELL=9` / `オオムカテ科=0`
- SET6_CATALOG.md: `TECHNIQUE=0` / `SPELL=9` / `オオムカテ科=0`
- SET7_CATALOG.md: `TECHNIQUE=0` / `SPELL=8` / `オオムカテ科=0`
- 同名カードのfamily競合: 0件

## 今回あえて自動修正しなかった項目

- `referencableTags` のうち、Q&A上の相互作用まで含めたタグか、カード自身の直接効果だけを表すタグか判定できないもの。
- 公式Q&A要約内の助詞欠落・表記揺れで、原文由来か取得時崩れか断定できないもの。
- `BLOCKED: 0` / `implementationStatus: READY_FOR_ENGINE_REVIEW` の妥当性。公式画像全件照合が未実施なので、最終確定ステータスには引き上げていない。
- `biologicalNote` 欠落。現状は `taxonomy.family` をゲーム参照用の主データとして保持しているため、今回は図鑑スキーマ拡張を行っていない。

## 次の推奨工程

1. このclean版を実装用の基準ファイルにする。
2. 公式画像/現物照合を行う際は差分だけ追記する。
3. OpenCode側では `TECHNIQUE` を受理せず `SPELL` のみを術カード型として扱う。
4. カード実装前に `verification.basicCardData` と `rulings` を参照し、不明点を一般TCG知識で補完しない。
