# Toolbox v1 現状監査

## 開始時

- HEAD / origin/main: `f6b007d14a129abcf42cadae50dc26879ba51012`
- Starter 24種、SET1 106種は `CardRegistry.default` へ登録済み。
- `toolbox.html` / `toolbox/` / `shared/` / shared系testsは既存のuntracked作業であり、削除・resetせず拡張対象とした。
- unrelated dirtyの `tests/fixtures/starter-card-registry.snapshot.v1.json`、`.ai-worker/`、`docs/mushijingi-knowledge/` は変更しない。

## 既存Toolbox

- Starter専用 `shared/card-data/starter-v1.json` の24種だけをfetchしていた。SET1や将来setは自動表示されなかった。
- 検索、type/color/cost filter、詳細、デッキ追加・削除、localStorage保存の骨格は存在した。
- filter候補はHTML固定、件数は24固定、sort・複製・20枚判定・同名2枚制限・Battle導線が未完成だった。
- 保存形式は `mushijingi-deck/1.0`、storage version 1。複数Deckと破損JSON回復の骨格があった。

## Battle接続

- Battle開始は2つのStarter recipe固定で、保存Deckの読込はなかった。
- Engine自体は20個の `CardDefinition` 配列を受け取れるため、Engineの再設計は不要だった。

## ルール根拠

`docs/mushijingi-knowledge/MUSHI_MANUAL.md` の20枚、`ENGINE_REQUIREMENTS.md` / `REFERENCE_DIFFS.md` の公式第7弾Q&A根拠による `canonicalName`同名合計2枚上限を採用した。
