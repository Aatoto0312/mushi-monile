# Toolbox v1 設計

## データフロー

`CardDefinition / CardRegistry` を唯一のカード正本とする。`shared/card-data/registry-catalog.js` は表示・検索用の派生view modelを作るだけで、カード値を複製保守しない。

CardRegistry → Registry Catalog Adapter → Toolbox

CardRegistry → Deck Runtime → Battle Engine

将来SET2〜7はカードscriptをloadしRegistryに登録すれば、一覧、動的filter候補、検索、Deck参照へ反映される。set名ごとのToolbox分岐は置かない。

## Deck Formatと保存

- 既存 `mushijingi-deck/1.0` と `{printingId, canonicalCardId, quantity}` を維持。Registry派生printing IDは `registry:<cardId>`。
- `canonicalCardId` はBattle Registryの `CardDefinition.id` と直結する。
- localStorage keyとstorageVersionを維持し、破損Deckだけを隔離して健全Deckを復元する。
- 保存は未完成Deckでも可。Battleは20枚、同名2枚以下、全ID存在、全カードplayableを別validatorで要求する。

## UIと規模

- 弾/type/color/cost/rarity/status候補をcatalogから生成。
- filter/search/sortは純粋関数で一度の絞込み後にDOMを一括更新する。500件mockで機能検証する。
- Toolbox→BattleはlocalStorageのDeck本体とsessionStorage/queryの小さなdeckIdだけを渡す。
- Battle→Toolboxは `toolbox.html?edit=<deckId>` で保存Deckを開く。
