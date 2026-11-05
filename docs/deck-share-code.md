# デッキ共有コード（MJD1）

- デッキ管理の「共有コードを発行」→「コピー」。20枚・同名合計2枚を満たす構成のみ発行。
- 「コードから読み込む」→貼り付け→「内容を確認」→自分のデッキ名→「自分のデッキに保存」。確認するまで保存できない。
- 画像・カード名は既存図鑑から取得。対戦未対応カードも共有・保存できるが、対戦の既存制限は維持する。
- 未保存の編集中デッキは先に保存する。読み込み保存は最新の保存ストアに新規IDで追記し、他のデッキを置き換えない。保存エラー時はメモリ上の一覧も更新しない。
- 自動コピーが利用できない場合はコード欄を選択し、長押しコピーを案内する。

## 互換性のための形式仕様

`MJD1.` + パディングなしBase64url。デッキ名・画像・効果・時刻・デッキID・保存用printingIdは含まない。

バイナリ本体：種類数1byte、その後各エントリに前IDとの共通接頭辞長1byte、残りID長1byte、残りIDのASCII bytes、枚数1byte。IDはcanonicalCardIdを集約しASCII昇順で格納。数値のカタログ順序には依存しない。末尾に本体のCRC32（IEEE、多項式0xedb88320、初期値/最終XOR0xffffffff）をbig-endian4bytesで付加。

IDは英数字/underscore/colon/hyphenで1〜96文字。入力上限4096文字、復号byte数上限2048、種類数1〜20、各枚数1または2、合計20枚。同名再録も合計2枚まで。余分なデータ、ID重複/逆順、不正prefix、破損、未知ID、未対応バージョンを拒否。CRCは破損検出であり、作者認証ではない。形式の意味を変える場合はMJD2以降を使う。

## 検証と公開状態

独立作業ツリー C:\Users\aatot\mushi-deck-share、main基準779bf23。公開反映は行わない。
Unit7（全565IDの構成復元を含む）、Chromium/WebKitの共有UIと既存デッキ編集4、full2064、shared80、server+候補ビルド192が成功。クリップボード成功/失敗はAPIスタブで検証、実機クリップボードは未確認。保存容量不足と別タブ保存の保持も検証。
将来の公開前には既存のPages manifest再生成・実ビルド・キャッシュ更新と公開ゲートを行う。

変更ファイル：shared/deck-format/share-code.js、toolbox.html、toolbox/toolbox-v1-app.js、toolbox/toolbox.css、tests/deck-share-code.test.js、tests/run-all.js、tests/run-shared.js、server/browser/deck-share.cjs、本書。
