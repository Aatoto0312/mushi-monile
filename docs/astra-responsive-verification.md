# iPhoneレイアウト修正（2026-09-19）

作業ブランチ: `astra-ui-redesign`。深緑・生成り・金のデザインを維持。
ユーザー添付の写真1・2（ホーム縦横のナビ重なり）、写真3（場のカードがHPのみになる）を確認した。

## 原因と修正

- ホーム: スクロールする、backdrop-filter付きオーバーレイの内側にfixedナビがあった。本文とナビを独立したフロー領域に分割。本文だけをスクロールさせ、ナビは下端の領域を占有する。横画面ではアイコンと文字を横並びにしてコンパクト化。
- Battle: `minmax(0,1fr)` の行に `max-height:100%` のカードを置いていたため、カード本体が縮小。修正前は390×560でカード高さ約30pxを再現した。場106px以上・手札106px以上を別々に確保し、広い縦画面では114px・123pxにする。カード枚数は横スクロールで対応し、画面高不足は盤面の縦スクロールで対応する。
- 横画面の手札: fixed座標を撤去し、自分の場・補助情報・手札のグリッド内に配置。
- 追加発見: WebKitでは操作欄のauto行が内容より小さくなり、チュートリアルが手札に重なった。操作欄の行をmax-contentにし、内容の高さを確保。
- viewport: `100vh → 100svh → 100dvh` のフォールバックと、上下左右のsafe areaを使用。JSによる端末別高さ補正は追加していない。

## 変更ファイル

- `index.html`: ホーム本文のスクロール領域を追加。
- `css/astra-battle.css`: ホーム・Battleのレスポンシブレイアウト。
- `tests/astra-responsive.cjs`: 今回の不具合を防ぐブラウザ検査。
- `tests/astra-browser.cjs`: WebKit実行対応、短い画面の操作到達性検査。フォーカス復帰はSafariのタッチクリックに依存せずキーボード操作で検査。
- 本記録と `astra-responsive/` の代表画像。

Engine・ゲームルール・カードデータ・カード挙動は変更なし。

## 確認結果

| 対象 | 結果 |
| --- | --- |
| Home縦 | ナビは使用可能領域の下端。CPU・ふたり対戦・チュートリアルの各ボタンは本文をスクロールして重ならず操作可能 |
| Home横 | コンパクトな下部ナビ。568×320、667×375、844×300/390でも主要ボタンを覆わない |
| Battle縦 | 場・手札・操作欄の必要高さを保持。低い画面は縦スクロールで操作可能 |
| Battle横 | 場・補助情報・手札をグリッドに配置。固定手札との重なりなし。低い画面は縦スクロール |
| 場0体 | 空の場も領域を維持 |
| 場1体 | カード名・識別画像領域・HPを保持、名前とHPの重なりなし |
| 場複数体 | 8体でもカードサイズ不変、最後のカードまで横スクロール可能 |
| 手札 | 1枚・12枚を各場枚数と組み合わせて確認。カードサイズ不変 |
| 高さ・向き変更 | 同じページで390×560→844×300→568×320→667×375→360×640→844×390→430×932→390×664を切替 |
| safe area疑似条件 | CSS env値を上20/下21/左右44pxに置換して667×375でナビと場の到達性を確認 |

## テスト

- `node tests/run-all.js`: 464 passed / 0 failed
- `node tests/run-shared.js`: 72 passed / 0 failed
- `node tests/astra-ui.test.js`: 7 assertions passed
- `node tests/astra-browser.cjs`: Chromium 58、WebKit 58 passed
- `node tests/astra-responsive.cjs`: Chromium 702、WebKit 702 passed
- 総合フロー: 図鑑501枚、検索、カード詳細、デッキ保存/再読込/複製/削除/20枚制限、CPUのターン完了、ふたり対戦の受け渡し、チュートリアル完走/再開/終了、捨て札詳細、エサ選択overlay、画像取得失敗、reduced-motion。
- 修正前の新テストは両ブラウザでHomeボタンとナビの重なりに失敗。修正後は成功。
- Pythonローカルサーバーでは一部JSの読み込み失敗が発生したため、Nodeの静的配信で切り分け、総合フローを完走。アプリ側JSエラーなし。

実行にはローカルHTTPサーバーとPlaywrightが必要。`MUSHI_PLAYWRIGHT_PATH`で外部インストール先、`MUSHI_URL`でサーバー、`MUSHI_BROWSER=webkit`でWebKitを指定できる。総合テスト画像の出力先は`MUSHI_SCREENSHOTS`で変更可能。

## 残る制約

- 実際のiPhone上でのURLバー展開・収納、回転アニメーションの再確認は未実施。デスクトップWebKitとviewport切替は実機Safariそのものではなく、safe area検査も疑似条件。
- 高さが小さい端末では盤面全体の縦スクロールが必要。カードを潰して一画面に収める方法は採用していない。
- 外部カード画像の読み込み速度・可用性は既存の依存として残る。取得失敗時もカード名と操作を保持する。

代表画像: [Home縦](astra-responsive/webkit-home-390x560.png)、[Home横](astra-responsive/webkit-home-844x300.png)、[Battle縦](astra-responsive/webkit-battle-390x560.png)、[Battle横](astra-responsive/webkit-battle-568x320.png)、[safe area疑似条件](astra-responsive/webkit-safe-area.png)。
