# デッキ共有コード公開手順（2026-11-05）

公開前main/rollback基準：779bf231204716965d0cbdab1ebe47aed84f38f3。
機能checkpoint：42ff9fc。基準mainの直後に機能変更9ファイルのみがあるため、競合・他開発ブランチ取り込みなし。
リリース用：C:\Users\aatot\mushi-deck-share-release / release/deck-share-20261105。

- 実装：共有コードcodec、Toolbox HTML/JS/CSS、関連テスト、仕様書。カードEngine・ルール・online/client.js・API/ngrok設定は変更しない。
- 公開準備：既存資産のキャッシュ番号をshare-465-v1へ統一。manifestは89ファイル（配信資産88＋Jekyll設定）。同じ既存公式Jekyllビルドとexact manifest/SHA256/contract検証を隔離Actionsで実行し、成功後のみmainへfast-forward/通常push。
- Pages設定：legacy main/root。検証用release/deck-share-20261105ブランチを既存verifyワークフローの対象に追加。検証用push自体では公開サイトを変えない。
- Engine/cards/protocol契約は旧公開465種と同一。ローカル8791と公開HTTPS health200・契約一致を確認。API/ngrokの停止・再起動・更新は不要、実施しない。
- full2064/0、shared80/0、server＋候補ビルド192/0。ブラウザ共有/編集/退出10/0、CPU/オンライン対戦4/0（CPU各2試合、オンライン各127操作、観戦/再接続）が成功。最終ログはC:\Users\aatot\.codex\tmp\share-release-{ui,battles}.log。すべて完了・成功を確認済み。
- ビルド資産をダウンロードしてSHAを再検証。公開後は実配信資産、共有コード発行/内容確認/新規保存/編集/削除と既存デッキ保持、実WSS退出を確認。
- 実機iPhone・端末間クリップボードは未確認。WebKitと実機は区別する。
- 障害時は通常revertで公開準備commit、42ff9fcを逆順で戻す。強制push/reset不要。共有機能は保存形式を変えず通常デッキへ新規追加するため既存データを消さない。旧APIは同じ契約なので再起動・切替しない。

main、公開API、ngrok、認証情報、469種開発checkpoint775f665、保護stageは本件の目的外で変更しない（承認されたフロント公開のみmainに反映）。
