# 対戦結果ポップアップ（開発版）

基準: main `f135e78a0d060a6337c433eb492ff1892a188e9d`。2026-11-12。

## 仕様・変更範囲

- `battle-ui/result-popup.js` / `.css`: 確定結果だけを表示する共通dialog。自分視点の勝利・敗北・引き分け、観戦者の中立表示、盤面閲覧、結果の再表示、低減モーション。
- `battle-ui/cpu-result.js`: CPU新旧UI共通のライフサイクル接続。新規試合ごとに表示IDを更新。既存 `newGame`、`returnToDeckSelect`、`showModeSelect` を利用。
- `online/client.js`: サーバーの `ENDED` + `room.result` を利用。ルームの公開matchIdと閲覧者IDを使い、再描画・再接続・新旧UI間移動で自動表示を繰り返さない。
- 表示済みIDだけをsessionStorageの独立キーに最大32件保存する。席トークン・カード情報・デッキは保存しない。保存拒否時も同一ページ内の重複を抑止する。
- 旧CPU UIは終了時、CPUターンでもカード詳細のみ開ける。新旧オンラインUIも終了後は切断中の詳細閲覧を許可する。合法操作や勝敗判定は変更しない。
- 教習とローカルHuman対戦は既存終了画面を維持。

## オンライン再戦の制約

現行サーバーに再戦の合意・新試合開始プロトコルはない。今回は追加しない。
「もう一度対戦」は新しいルームで相手と相談して再戦する案内と既存のLEAVE確認へ進む。確認するまで退出要求を送らず、終了盤面を維持する。「メニューへ」も既存の退出確認を使う。観戦者の再戦ボタンは無効。
同室再戦を追加する場合は、両者の同意、新matchId、席と観戦者の扱いを別仕様として設計する必要がある。

## 検証

- full: 2,132成功 / 0失敗、shared: 80成功 / 0失敗。
- 新規結果単体3件を含むUI/candidate単体: 7成功 / 0失敗。
- server全体: 210件中200成功 / 10失敗。変更前mainと同一tree `87ca916035e48fbae8329608e97e4bb8c56fd6ad` で失敗した10ファイルを再実行し、40件中30成功 / 同じ10失敗を確認。
- 既存失敗: after-attack-attach、attachchain、destroyed-host-return、economy-batch、economy2、entryarms、keyword-enhancements、pre-damage-attachment、spell-target-immunity、target-attachment。全件、現在PLAYABLEの `set7_034` のデッキ検証がDECK_INVALIDを投げるという古い期待。変更・skipしていない。
- `server/browser/result-popup.cjs`: 旧新UI、375×667と375×560、CPU/オンラインの実END→山札切れ判定で勝利・敗北・引き分け、両席・観戦、盤面/HP/装着/公開状態の維持、詳細閲覧、横スクロール、重複抑止、JSON再配信、切断/再接続、新旧UI移動、CPU再戦、確認付き退出を検証する。試験用初期盤面を使い、勝敗そのものはEngineが確定する。
- 既存UIリリースE2Eは通常のCPU戦・オンライン戦完走、投了、Toolbox保存デッキ、観戦と再接続も維持する。
- iPhone実機は未確認。公開API、ngrok、main、Pagesへの反映はしない。

## 実行

`node --test tests/result-popup.test.cjs`

`node scripts/build-online-candidate.cjs --out <新規のリポジトリ外ディレクトリ>`

`MUSHI_CANDIDATE_DIRECTORY` に上記ディレクトリ、`MUSHI_PLAYWRIGHT_PATH` に既存Playwrightを指定し、`node --test --test-concurrency=1 server/browser/result-popup.cjs`。

GitHub ActionsのNew UI release gateは公式Jekyll成果物の正確な配信ファイル/ハッシュと、Chromium/WebKitの全12 E2Eを検証し、`new-ui-screenshots` に画像を保存する。ドラフトPRのチェックと成果物を参照。mainへマージするまで公開されない。
