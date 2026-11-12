# A案v2 正式UIの公開

公開前mainは `c916fefcfc00211a1520956481d725c8c32687b8`。PR #12の表示部分を新UIへ統合する。CPUの旧UIと `online.html` は従来の表示を維持し、新UIは既存の `online-b.html` とCPUの切り替えから利用する。公開上の選択肢は旧UI・新UIの2つ。旧asset URL・内部DOM IDはキャッシュおよび既存操作との互換性のため維持する。

現行mainには専用のUI保存キーがない。新設した `mushijingiBattleUiV1` に `legacy` / `new` を保存し、CPUの明示的な `battleUi` クエリを優先する。既存デッキと再接続席の保存キーは別で維持する。オンラインの切り替えは共有済みの席トークンを既存client.jsが復元する。

Engine・カード定義・通信契約を変更しない。engine `7381fd45ee9c9a1347fc4e50edb11eaf47e59488d7196717e3796271f0aab8c1`、cards `5dec092152c0fbf3e5ce1eaa4b12b41ae64e9cce215f8631458810d5d0d92259`。

公開前にAPI 8791の停止を確認し、同じ契約のserver/public.cjsを既存ポートで復旧した。ngrok起動は実行ポリシーに拒否されたため、本人操作による既存ドメインの接続後に公開HTTPS/WSSゲートを確認する。

Pagesは既存のmainルート・Jekyll方式。release-manifest.jsonと実Jekyll成果物の全ファイル・SHA256・Engine契約を照合し、その成果物でCPU・オンラインをブラウザ検証する。公開後はPagesの実配信とWSSを再確認する。

ロールバックは公開マージコミットに対する通常の `git revert -m 1 <merge-commit>` と通常pushで行う。旧mainと新UI版のEngine/API契約は同じなので、UIロールバックにAPIの停止・更新は不要。UI設定キーは旧版が無視し、保存デッキは保持される。
