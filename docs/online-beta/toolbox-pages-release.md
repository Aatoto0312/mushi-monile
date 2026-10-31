# Toolbox統合B案β 公開候補・反映手順

確認日：2026-10-31。今回は準備とローカル検証。commit / push / merge / ngrok開始 / Pages更新 / Windows設定変更は実施していない。

## 現在の候補

- 作業：`ui-common-prototype` / `944c2faf7427e01b9e9823cb17dec7b2f23775b2`（未commit変更あり）
- main / origin/main / 実リモートmain：`2ea76fad5f419037122d7b24a71a784117fbe385`。`git ls-remote`で確認。
- 最終フォルダー：`C:\Users\aatot\.codex\tmp\mushi-toolbox-online-candidate-20261031-final`
- `site/`：76ブラウザ資産＋Pagesビルド用`_config.yml`、計77ファイル。
- `manifest.json`：パス、サイズ、SHA256、mainとの差分、Engine/card契約、565 catalog / 345 playable、cache tag `online-beta-b1`。
- PC確認URL： http://127.0.0.1:65222/mushi-monile/ （起動中のローカル確認用。再起動時はCLIが表示するURLを使用）

このローカルURLはiPhone公開用ではない。既存公開サイトとはOriginが異なるため、公開サイトに保存したデッキをローカルURLへ自動移動しない。本公開では既存のHTTPS Originと保存キーをそのまま利用する。

## デッキ連携

- 保存キー：`mushijingiToolboxDecksV1`、`storageVersion:1`。
- デッキ：`mushijingi-deck/1.0`、`cardDataVersion:card-registry/1`、`ruleset:standard:v1`。
- Toolboxが保存する`printingId / canonicalCardId / quantity`を既存オンラインAPIが受理するため変換不要。
- 新ボタンは既存のsave処理を通し、`online-b.html?deck=<deckId>`へ移動。カード一覧やデッキ本文はURLに入れない。既存CPU用handoff keyを変更しない。
- ロビーは同じlocalStorageから該当デッキを選ぶ。別デッキへの変更も可能。20枚・同名2枚・形式・PLAYABLE・サーバー対応IDを確認し、サーバーが最終判定。
- 不足・PARTIAL・未知形式・壊れた項目・存在しないdeckIdは理由を表示。保存データを削除／上書きして修復しない。
- 参加・観戦だけならToolboxの「ルーム参加・観戦へ」リンクを使える。観戦者はデッキをサーバーへ渡さない。
- 進行中の席がある場合は既存対戦へ復帰する。別デッキで新しい試合を始めるときは、そのルームを退出して作り直す。

## 配信と通信

最終入口は既存 `https://aatoto0312.github.io/mushi-monile/`。Home→オンライン、Toolbox→保存デッキ→オンラインを追加。フロントエンドとカードデータ・背景はPages、実カード画像は既存公式画像ソース。ngrokにはWebSocket APIだけを流す。

フロント接続先は`online/config.json`に集約。候補版は`productionEnabled:true`と既存固定 `wss://banked-outgrow-parakeet.ngrok-free.dev/ws`。作業ソースのproductionEnabledはfalseを維持し、ビルダーが候補フォルダーにだけ有効な設定を生成する。URLやlocalStorageから接続先を変更できない。運用用`server/ngrok-plan.json`との整合性もビルダーで検証。

`online/contract.json`は同じEngineから生成。既存127.0.0.1:8787のhealth契約との一致を確認済み。異なるカード／Engine版では接続・デッキを拒否する。サーバーは既存のPages Originを許可し、他Originを拒否。プレイヤー認証token、操作ID、version検証、非公開DTOを再利用する。6桁ルーム番号は席の認証tokenではない。

`server/`・`docs/`・`tests/`・`scripts/`・`.ai-worker/`・C案試作等はsiteフォルダーに含めない。通常のmain / legacy Pages構成でもこれらが配信されないよう`_config.yml`のexcludeを候補に含める。`.nojekyll`は生成しない。公式根拠：https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll （確認日同上）。GitHub側の実ビルドは承認後に確認する。

既存キャッシュと混在しないよう、生成するHTML/CSSのローカル資産URLを同じ`v=online-beta-b1`へ揃える。次回公開ではこの番号を更新する。原本のprototype-bデザインファイルは変更していない。

## 検証

- `server/browser/toolbox-online-candidate.cjs`：実サーバー＋Pages同等のサブパス。Toolbox UIから20枚作成・保存→ID引継ぎ→2席・観戦→127操作で完走→再接続。Chromium / WebKit各成功。別の既存保存デッキも保持。
- `server/browser/candidate-validation.cjs`：両ブラウザのPARTIAL・版違い・19枚・存在しないID・壊れた項目の拒否とデータ保持、旧オンラインUIの操作・再読込復帰。
- `server/browser/pages-configuration.cjs`：HTTPS Pages URLをローカルで再現し、固定WSSの選択、URLによる接続先差替えの拒否。実ngrok通信はmockであり外部接続の成功証拠ではない。
- 上記合計8 tests / 0 failed。最終候補の配信用76資産は、このテスト対象v4とbyte一致。差分はPagesビルド設定（`.nojekyll`を除き`_config.yml`にする）のみ。
- server / presentation / candidate build：51 tests / 0 failed（下記の既知中断を再現するfail-closedテストを含む）。
- full：1562 / 0、shared：73 / 0。
- 既存Astraの通常58、compact42、responsive4369を両ブラウザで最終候補に対して検証。ログはGit外`C:\Users\aatot\.codex\tmp\mushi-toolbox-final-*.log`。
- 同一cache番号を確認する既存テストはリリース番号のみ更新。responsiveテストのCSS差替えはURL pathnameで判定し、cache query付きCSSの捕捉を保証する確認を1件追加した。既存のsafe-area期待値は維持し、削除・skipはしていない。

実行例：

```powershell
$env:MUSHI_PLAYWRIGHT_PATH='C:\Users\aatot\.codex\tmp\mushi-ui-check\node_modules\playwright'
$env:MUSHI_CANDIDATE_DIRECTORY='C:\Users\aatot\.codex\tmp\mushi-toolbox-online-candidate-20261031-final'
node --test server/browser/toolbox-online-candidate.cjs server/browser/candidate-validation.cjs server/browser/pages-configuration.cjs
node --test server/test/*.test.cjs battle-ui/presentation.test.cjs scripts/online-candidate.test.cjs
node tests/run-all.js
node tests/run-shared.js
```

`scripts/build-online-candidate.cjs --out NEW_DIRECTORY`で再生成。既存フォルダーの上書き、repo内への出力、symlink資産を拒否する。`server/tools/candidate-server.cjs CANDIDATE_DIRECTORY`は既存APIをloopback専用の一時ポートで使うローカル確認専用。既存8787の運用サーバーは停止していない。

## 既知制約・承認前に確認する点

1. **NEEDS_RULING：山札切れ時の縄張り同数。** 同じKABUTOMUSHI同士＋固定乱数＋既定合法手順では144操作後、両者山札0・縄張り1となり`ENGINE_BLOCKED`で中断。`js/engine/battle-engine.js`が同数の公式裁定未確認として停止する既存仕様。推測で勝敗を決めていない。`server/test/known-mirror-deckout.test.cjs`で再現。このテストの成功は試合完走を意味しない。
2. 候補は565図鑑 / 345対応。main未統合のSET5分・既存Engine修正が含まれる。UIだけの差分ではない。manifestのmain差分に加え、対応するサーバー・テスト・過去のカードcheckpointもレビューして承認する必要がある。
3. iPhone Safari実機、実インターネットWSS、ngrok Freeの実利用量、GitHub Pages実ビルドは未実施。WebKit自動テストと区別する。

## 承認後の公開手順（まだ実行しない）

1. 上記の既知裁定制約と、main未統合のカード／Engineを含む差分を確認し、β版への採用範囲を承認する。
2. 既存作業ツリーをそのまま残し、別のリリース用作業ディレクトリを使う。対応する実装・テストを明示的に選び、77候補ファイルを反映する。丸ごとのgit addやbranchの無確認mergeを行わない。Knowledge Base、worker、認証、一時画像はstageしない。
3. リリース状態でfull/shared/server/browser/差分/contractを再確認。公開設定true、_config除外、サーバー版の一致を確認してから、承認範囲のcommit・通常pushを行う。legacy Pages main / の実build完了とdeployment commitを確認する。
4. 母艦APIがlocalhost:8787で稼働し、同じ契約であることを確認。ngrok既存プロセスがあれば勝手に置き換えない。既存の安全なauth設定とtoken-free endpoint設定で、**API8787だけ**へ固定ドメインを接続する。authtoken再入力やチャットへの表示は不要。
5. 既存Pages URLからiPhone SafariでHome→Toolbox保存デッキ→B案→6桁ルーム作成／参加、PC相手との試合、3人目の観戦、通信切替・再読込を確認。静的資産404、fatal error、手札漏洩、契約違いを確認。
6. 試験公開の時間・停止方法は開始前に合意する。停止時はその試験が所有するngrokプロセスだけを終了。必要なら所有するAPIも終了する。公開側から接続不能を確認し、CPU対戦・Toolboxが使えることも確認。
7. 問題時の履歴復旧は通常のrevert等をレビューして行う。reset / force操作はしない。Windows自動起動・電源・Tailscale・RDPは別承認であり今回変更しない。

現時点で本人に必要なのは、採用差分・既知制約と、main/Pages反映およびAPI外部公開の承認。ngrokアカウント操作やtokenの再提供は不要。

## 公開ブロッカー修正（2026-10-31）
公開専用起動は node server/public.cjs。開発用server/dev.cjsと分離し、許可Originはhttps://aatoto0312.github.ioのみ。既存8787はローカルOrigin専用のままであり、無停止で公開可能になったという意味ではない。承認後、所有プロセスを確認して開発APIを正常停止し、公開APIを起動する。Originは本人認証ではなく、席token・合法操作ID検証は引き続き必須。
契約ハッシュはCRLF→LF正規化を実施。候補は C:/Users/aatot/.codex/tmp/mushi-online-release-fixed-20261031。77ファイルのSHA256および候補ソースからのEngine/card再計算一致を確認。
ロールバック：公開前にフロント候補manifest、APIのGit revisionと未commit差分、contract、秘密を含まない設定を対で保管。障害時は先にトンネルを停止して試合中断を通知し、通常のrevertでフロントを戻す。対応する旧APIを別の保存作業領域から起動し、healthと旧contract一致を確認してから接続再開。現在の345枚候補と公開main309枚版を混在させない。保存デッキは消去しない。
Pages確認は最終releaseツリーでJekyllビルド後の出力一覧をmanifestと照合し、server/docs/tests/scripts/prototype等のURLが404になることを確認する。_config.ymlだけでは77ファイル限定の配信を証明しない。実ビルド・外部WSS・iPhone実機は公開承認後の検証事項。

修正後品質ゲート：full1562/0、shared73/0、server/presentation/build53/0。ブラウザ結果はGit外 release-fixed-browser.log参照。既存stage内容のgit hash-objectは45016f7bd80bb86e6f6ef50b3dcef5ac6d4e28f8で維持。commit/push/外部公開未実施。
