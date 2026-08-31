# 蟲神器カード図鑑 v0.1

> 目的: ゲーム実装・UI表示・裁定確認の共通データソース。
>
> 現在の収録: スターター24種。
>
> 次フェーズ: 第1弾ブースター106種を追加し、合計130種へ拡張。
>
> 重要: 虫カードの「解説」と「○○科」等はゲーム参照可能データとして扱う。`＜○○＞` は特性として独立管理する。

---

## 信頼度

- `VERIFIED_OFFICIAL`: 公式ルール・公式Q&A・公式カード資料で確認
- `VERIFIED_SECONDARY`: 非公式カードDB等でカード記載内容を確認。一次資料照合の余地あり
- `PROVISIONAL`: 仮仕様
- `BLOCKED`: 根拠不足

本v0.1では、スターターのカード本文・解説の転記元として非公式カードDB `mushijingi.com` を使用しているため、カード本文/解説の基本ステータスは原則 `VERIFIED_SECONDARY` とする。
重要裁定は公式Q&Aで上書き・補強する。

---

## データモデル上の重要ルール

1. `skills` と `traits` を混ぜない。
2. `＜○○＞` は `traits` に格納。
3. 虫カード下部の解説全文は `biologicalNote.rawText` に保持。
4. `○○科` 等を `taxonomy.family` と `referencableTags` に抽出。
5. 生物分類を一般知識で補完しない。
6. 術・強化カードの本文は `effectText` に格納。
7. 不明な裁定は `blocked` に入れ、推測実装しない。

---

# スターター24種

## 006/130 ギンヤンマ

```yaml
officialNumber: "006/130"
name: "ギンヤンマ"
set: "STARTER"
starterDeck: "カブトムシ"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 5
baseHp: 1100
skills:
  - name: "とびかかる"
    baseAp: 700
    effectText: null
traits:
  []
biologicalNote:
  rawText: "ヤンマ科。体長70ｍｍ前後。北海道から南西諸島に分布。池や沼などの水辺や、緩やかな小川の周辺で見られる。腹部の下あたりが銀白色をしていることから命名された。"
taxonomy:
  order: null
  family: "ヤンマ科"
  other: []
referencableTags:
  - "ヤンマ科"
sources:
  cardData: "mushijingi.com (非公式・カード記載内容の探索補助)"
  biologicalNote: "mushijingi.com (非公式・カード記載内容の探索補助)"
  rulings: "公式Q&Aを優先"
verification: "VERIFIED_SECONDARY"
implementationStatus: "TESTED"
blocked: []
```

## 007/130 オオカマキリ

```yaml
officialNumber: "007/130"
name: "オオカマキリ"
set: "STARTER"
starterDeck: "オオカマキリ"
rarity: "SR"
type: "INSECT"
color: "RED"
cost: 4
baseHp: 800
skills:
  - name: "カマ連撃"
    baseAp: 200
    effectText: "攻撃後、相手の場に虫がいれば、もう一度だけ使用できる。"
  - name: "共食い"
    baseAp: 800
    effectText: "この技を使うとき、この虫以外の自分の虫を１つ選び、破壊する。"
traits:
  []
biologicalNote:
  rawText: "カマキリ科。体長70～95ｍｍ。本州から南西諸島に分布。大型のカマキリ。林や草むらなどで見られ、バッタやチョウなどを捕食する。昆虫だけでなくカエルやトカゲまで捕食することがある。"
taxonomy:
  order: null
  family: "カマキリ科"
  other: []
referencableTags:
  - "カマキリ科"
sources:
  cardData: "mushijingi.com (非公式・カード記載内容の探索補助)"
  biologicalNote: "mushijingi.com (非公式・カード記載内容の探索補助)"
  rulings: "公式Q&Aを優先"
verification: "VERIFIED_SECONDARY"
implementationStatus: "TESTED"
blocked: []
```

## 011/130 コオニヤンマ

```yaml
officialNumber: "011/130"
name: "コオニヤンマ"
set: "STARTER"
starterDeck: "オオカマキリ"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 4
baseHp: 800
skills:
  - name: "とびかかる"
    baseAp: 500
    effectText: null
traits:
  []
biologicalNote:
  rawText: "サナエトンボ科。体長85ｍｍ前後。北海道から九州、種子島に分布。小型のオニヤンマに見えるが、オニヤンマと比べて、頭が小さく、目が離れている。ヤンマ科でもオニヤンマ科でもない。"
taxonomy:
  order: null
  family: "サナエトンボ科"
  other: []
referencableTags:
  - "サナエトンボ科"
sources:
  cardData: "mushijingi.com (非公式・カード記載内容の探索補助)"
  biologicalNote: "mushijingi.com (非公式・カード記載内容の探索補助)"
  rulings: "公式Q&Aを優先"
verification: "VERIFIED_SECONDARY"
implementationStatus: "TESTED"
blocked: []
```

## 022/130 セアカゴケグモ

```yaml
officialNumber: "022/130"
name: "セアカゴケグモ"
set: "STARTER"
starterDeck: "オオカマキリ"
rarity: "R"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 400
skills:
  - name: "かむ"
    baseAp: 100
    effectText: null
  - name: "毒針"
    baseAp: 400
    effectText: "この技は１度だけ使用できる。"
traits:
  []
biologicalNote:
  rawText: "ヒメグモ科。体長3～10ｍｍ。本州から九州に分布。有毒の小型のクモ。背中にひし形が並んだような赤い模様がある。1995年に大阪府で見つかり、危険な特定外来生物とされた。"
taxonomy:
  order: null
  family: "ヒメグモ科"
  other: []
referencableTags:
  - "ヒメグモ科"
sources:
  cardData: "mushijingi.com (非公式・カード記載内容の探索補助)"
  biologicalNote: "mushijingi.com (非公式・カード記載内容の探索補助)"
  rulings: "公式Q&Aを優先"
verification: "VERIFIED_SECONDARY"
implementationStatus: "TESTED"
blocked: []
```

## 024/130 アキアカネ

```yaml
officialNumber: "024/130"
name: "アキアカネ"
set: "STARTER"
starterDeck: "カブトムシ"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 2
baseHp: 500
skills:
  - name: "とびかかる"
    baseAp: 200
    effectText: null
traits:
  []
biologicalNote:
  rawText: "トンボ科。体長40ｍｍ前後。北海道から九州に分布。赤とんぼとして知られるトンボ。池や沼、水田で見られる。羽化後、山や高原で夏を過ごし、秋に低地に戻り産卵する。"
taxonomy:
  order: null
  family: "トンボ科"
  other: []
referencableTags:
  - "トンボ科"
sources:
  cardData: "mushijingi.com (非公式・カード記載内容の探索補助)"
  biologicalNote: "mushijingi.com (非公式・カード記載内容の探索補助)"
  rulings: "公式Q&Aを優先"
verification: "VERIFIED_SECONDARY"
implementationStatus: "TESTED"
blocked: []
```

## 030/130 ナミテントウ

```yaml
officialNumber: "030/130"
name: "ナミテントウ"
set: "STARTER"
starterDeck: "カブトムシ"
rarity: "N"
type: "INSECT"
color: "RED"
cost: 1
baseHp: 300
skills:
  - name: "かみつぶす"
    baseAp: 100
    effectText: null
traits:
  []
biologicalNote:
  rawText: "テントウムシ科。体長5～8ｍｍ。北海道から九州に分布。アブラムシ類を食べる。黒い翅に赤い模様がある個体が多くみられるが、個体により模様は様々。"
taxonomy:
  order: null
  family: "テントウムシ科"
  other: []
referencableTags:
  - "テントウムシ科"
sources:
  cardData: "mushijingi.com (非公式・カード記載内容の探索補助)"
  biologicalNote: "mushijingi.com (非公式・カード記載内容の探索補助)"
  rulings: "公式Q&Aを優先"
verification: "VERIFIED_SECONDARY"
implementationStatus: "TESTED"
blocked: []
```

## 040/130 カブトムシ

```yaml
officialNumber: "040/130"
name: "カブトムシ"
set: "STARTER"
starterDeck: "カブトムシ"
rarity: "SR"
type: "INSECT"
color: "BLUE"
cost: 4
baseHp: 800
skills:
  - name: "ツノ突進"
    baseAp: 500
    effectText: null
  - name: "すくい投げ"
    baseAp: 0
    effectText: "相手の虫を１つ選び、ターン終了時まで裏返す。その虫は裏返しの間、いないものとして扱う。"
traits:
  []
biologicalNote:
  rawText: "コガネムシ科。体長32～53ｍｍ。北海道から九州に分布。クヌギ、コナラなどの樹液に集まる、昆虫の王様とも呼ばれ人気が高い。角の形が日本の兜の形に見えることから命名された。"
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
sources:
  cardData: "mushijingi.com (非公式・カード記載内容の探索補助)"
  biologicalNote: "mushijingi.com (非公式・カード記載内容の探索補助)"
  rulings: "公式Q&Aを優先"
verification: "VERIFIED_SECONDARY"
implementationStatus: "TESTED"
blocked: []
```

## 044/130 ナミアゲハ

```yaml
officialNumber: "044/130"
name: "ナミアゲハ"
set: "STARTER"
starterDeck: "カブトムシ"
rarity: "R"
type: "INSECT"
color: "BLUE"
cost: 4
baseHp: 1100
skills:
  - name: "すいつくす"
    baseAp: 300
    effectText: null
traits:
  - name: "りんぷん"
    rawText: "相手はこれ以外の虫を攻撃できない。※この技を持つ虫が複数いるとき、相手はどれかを選んで攻撃する。"
    verification: "VERIFIED_SECONDARY"
biologicalNote:
  rawText: "アゲハチョウ科。前翅長40～60ｍｍ。北海道から南西諸島に分布。一般的にアゲハチョウと呼ばれる。春に発生する個体と夏に発生する個体がおり、春に発生する個体の方が小さい。"
taxonomy:
  order: null
  family: "アゲハチョウ科"
  other: []
referencableTags:
  - "アゲハチョウ科"
sources:
  cardData: "mushijingi.com (非公式・カード記載内容の探索補助)"
  biologicalNote: "mushijingi.com (非公式・カード記載内容の探索補助)"
  rulings: "公式Q&Aを優先"
verification: "VERIFIED_SECONDARY"
implementationStatus: "TESTED"
blocked: []
```

## 047/130 ミンミンゼミ

```yaml
officialNumber: "047/130"
name: "ミンミンゼミ"
set: "STARTER"
starterDeck: "オオカマキリ"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 3
baseHp: 500
skills:
  - name: "しぼりとる"
    baseAp: 200
    effectText: null
traits:
  - name: "とびだす"
    rawText: "これを縄張りから引いた時、自分の場に＜とびだす＞の技を持つ虫がいなければ、これを場に出してもよい。"
    verification: "VERIFIED_SECONDARY"
biologicalNote:
  rawText: "セミ科。体長33～36ｍｍ。北海道南部～九州に分布。元々森林にすむセミだが、街路樹が増えたことにより、東京などの都市部でも見られるようになった。"
taxonomy:
  order: null
  family: "セミ科"
  other: []
referencableTags:
  - "セミ科"
sources:
  cardData: "mushijingi.com (非公式・カード記載内容の探索補助)"
  biologicalNote: "mushijingi.com (非公式・カード記載内容の探索補助)"
  rulings: "公式Q&Aを優先"
verification: "VERIFIED_SECONDARY"
implementationStatus: "TESTED"
blocked: []
```

## 063/130 カナブン

```yaml
officialNumber: "063/130"
name: "カナブン"
set: "STARTER"
starterDeck: "カブトムシ"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 1
baseHp: 300
skills:
  - name: "たいあたり"
    baseAp: 100
    effectText: null
traits:
  []
biologicalNote:
  rawText: "コガネムシ科。体長22～30ｍｍ。本州から九州に分布。クヌギなどの樹液、腐った果物などに集まる。緑、黄、茶、赤、青などの色彩変異がある。"
taxonomy:
  order: null
  family: "コガネムシ科"
  other: []
referencableTags:
  - "コガネムシ科"
sources:
  cardData: "mushijingi.com (非公式・カード記載内容の探索補助)"
  biologicalNote: "mushijingi.com (非公式・カード記載内容の探索補助)"
  rulings: "公式Q&Aを優先"
verification: "VERIFIED_SECONDARY"
implementationStatus: "TESTED"
blocked: []
```

## 064/130 ヒグラシ

```yaml
officialNumber: "064/130"
name: "ヒグラシ"
set: "STARTER"
starterDeck: "オオカマキリ"
rarity: "N"
type: "INSECT"
color: "BLUE"
cost: 2
baseHp: 200
skills:
  - name: "しぼりとる"
    baseAp: 200
    effectText: null
traits:
  []
biologicalNote:
  rawText: "セミ科。体長29～38ｍｍ。北海道南部から奄美大島以北の南西諸島に分布。朝夕に「カナカナカナ…」といった甲高い鳴き声で泣く。夕方の日暮れ時になくことから名づけられた。"
taxonomy:
  order: null
  family: "セミ科"
  other: []
referencableTags:
  - "セミ科"
sources:
  cardData: "mushijingi.com (非公式・カード記載内容の探索補助)"
  biologicalNote: "mushijingi.com (非公式・カード記載内容の探索補助)"
  rulings: "公式Q&Aを優先"
verification: "VERIFIED_SECONDARY"
implementationStatus: "TESTED"
blocked: []
```

## 071/130 トノサマバッタ

```yaml
officialNumber: "071/130"
name: "トノサマバッタ"
set: "STARTER"
starterDeck: "オオカマキリ"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 5
baseHp: 1200
skills:
  - name: "くらいつく"
    baseAp: 700
    effectText: null
traits:
  []
biologicalNote:
  rawText: "バッタ科。体長35～65ｍｍ。北海道から南西諸島に分布。広い草むらや河原、荒れ地で見られる。エノコログサ、オヒシバ、ススキなどのイネ科植物の葉を食べる。"
taxonomy:
  order: null
  family: "バッタ科"
  other: []
referencableTags:
  - "バッタ科"
sources:
  cardData: "mushijingi.com (非公式・カード記載内容の探索補助)"
  biologicalNote: "mushijingi.com (非公式・カード記載内容の探索補助)"
  rulings: "公式Q&Aを優先"
verification: "VERIFIED_SECONDARY"
implementationStatus: "TESTED"
blocked: []
```

## 079/130 ナミアゲハ（幼虫）

```yaml
officialNumber: "079/130"
name: "ナミアゲハ（幼虫）"
set: "STARTER"
starterDeck: "カブトムシ"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 700
skills:
  - name: "かじる"
    baseAp: 200
    effectText: null
  - name: "くさいツノ"
    baseAp: 0
    effectText: "相手の虫を１つ選ぶ。次のターンその虫の攻撃力を４００下げる。"
traits:
  []
biologicalNote:
  rawText: "アゲハチョウ科。体長45ｍｍ前後。北海道から南西諸島に分布。ミカン科の植物を食べる。敵から攻撃を受けると「臭角」と呼ばれるくさいツノを出し、相手を威嚇する。"
taxonomy:
  order: null
  family: "アゲハチョウ科"
  other: []
referencableTags:
  - "アゲハチョウ科"
sources:
  cardData: "mushijingi.com (非公式・カード記載内容の探索補助)"
  biologicalNote: "mushijingi.com (非公式・カード記載内容の探索補助)"
  rulings: "公式Q&Aを優先"
verification: "VERIFIED_SECONDARY"
implementationStatus: "TESTED"
blocked: []
```

## 080/130 ナナフシモドキ

```yaml
officialNumber: "080/130"
name: "ナナフシモドキ"
set: "STARTER"
starterDeck: "オオカマキリ"
rarity: "R"
type: "INSECT"
color: "GREEN"
cost: 3
baseHp: 400
skills:
  - name: "かぶりつく"
    baseAp: 400
    effectText: null
traits:
  - name: "擬態"
    rawText: "これは場に出た次の相手のターンに攻撃を受けない。※これ以外に虫がいないとき、直接攻撃を受ける。"
    verification: "VERIFIED_SECONDARY"
biologicalNote:
  rawText: "ナナフシ科。体長57～100ｍｍ。本州から九州に分布。植物の葉を食べる。七節とは枝のたくさんあることを意味し、それに似ている虫であるため、ナナフシモドキと名付けられた。"
taxonomy:
  order: null
  family: "ナナフシ科"
  other: []
referencableTags:
  - "ナナフシ科"
sources:
  cardData: "mushijingi.com (非公式・カード記載内容の探索補助)"
  biologicalNote: "mushijingi.com (非公式・カード記載内容の探索補助)"
  rulings: "公式Q&Aを優先"
verification: "VERIFIED_SECONDARY"
implementationStatus: "TESTED"
blocked: []
```

## 091/130 ニジュウヤホシテントウ

```yaml
officialNumber: "091/130"
name: "ニジュウヤホシテントウ"
set: "STARTER"
starterDeck: "カブトムシ"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 2
baseHp: 300
skills:
  - name: "かみつぶす"
    baseAp: 300
    effectText: null
traits:
  []
biologicalNote:
  rawText: "テントウムシ科。体長5～7ｍｍ。本州から南西諸島に分布。草食性のテントウムシでジャガイモやナス科の植物の葉を食べる。前翅に合計28個の黒い模様がある。"
taxonomy:
  order: null
  family: "テントウムシ科"
  other: []
referencableTags:
  - "テントウムシ科"
sources:
  cardData: "mushijingi.com (非公式・カード記載内容の探索補助)"
  biologicalNote: "mushijingi.com (非公式・カード記載内容の探索補助)"
  rulings: "公式Q&Aを優先"
verification: "VERIFIED_SECONDARY"
implementationStatus: "TESTED"
blocked: []
```

## 095/130 ワタアブラムシ

```yaml
officialNumber: "095/130"
name: "ワタアブラムシ"
set: "STARTER"
starterDeck: "オオカマキリ"
rarity: "N"
type: "INSECT"
color: "GREEN"
cost: 1
baseHp: 300
skills:
  - name: "すう"
    baseAp: 100
    effectText: null
traits:
  []
biologicalNote:
  rawText: "アブラムシ科。体長1.5ｍｍ前後。北海道から南西諸島に分布。よく見かけるアブラムシ。植物に口針を刺して汁を吸う。寄生する植物により黄色や緑など体色が変化する。"
taxonomy:
  order: null
  family: "アブラムシ科"
  other: []
referencableTags:
  - "アブラムシ科"
sources:
  cardData: "mushijingi.com (非公式・カード記載内容の探索補助)"
  biologicalNote: "mushijingi.com (非公式・カード記載内容の探索補助)"
  rulings: "公式Q&Aを優先"
verification: "VERIFIED_SECONDARY"
implementationStatus: "TESTED"
blocked: []
```

## 101/130 玉虫色の羽化

```yaml
officialNumber: "101/130"
name: "玉虫色の羽化"
set: "STARTER"
starterDeck: "オオカマキリ"
rarity: "R"
type: "ENHANCEMENT"
color: null
cost: 2
baseHp: null
skills: []
traits: []
effectText: "この虫の色を赤か青か緑に変える。"
biologicalNote: null
taxonomy: null
referencableTags: []
sources:
  cardData: "mushijingi.com (非公式・カード記載内容の探索補助)"
  rulings: "公式Q&Aを優先"
verification: "VERIFIED_SECONDARY"
implementationStatus: "TESTED"
blocked: []
```

## 106/130 針金虫の道連れ

```yaml
officialNumber: "106/130"
name: "針金虫の道連れ"
set: "STARTER"
starterDeck: "オオカマキリ"
rarity: "N"
type: "ENHANCEMENT"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectText: "虫の攻撃によって、この虫が破壊されたとき、この虫を破壊した虫を破壊する。"
biologicalNote: null
taxonomy: null
referencableTags: []
sources:
  cardData: "mushijingi.com (非公式・カード記載内容の探索補助)"
  rulings: "公式Q&Aを優先"
verification: "VERIFIED_SECONDARY"
implementationStatus: "TESTED"
blocked: []
```

## 107/130 天牛の大顎

```yaml
officialNumber: "107/130"
name: "天牛の大顎"
set: "STARTER"
starterDeck: "オオカマキリ"
rarity: "N"
type: "ENHANCEMENT"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectText: "この虫の攻撃力を３００増やす。"
biologicalNote: null
taxonomy: null
referencableTags: []
sources:
  cardData: "mushijingi.com (非公式・カード記載内容の探索補助)"
  rulings: "公式Q&Aを優先"
verification: "VERIFIED_SECONDARY"
implementationStatus: "TESTED"
blocked: []
```

## 108/130 蓑虫の隠れ蓑

```yaml
officialNumber: "108/130"
name: "蓑虫の隠れ蓑"
set: "STARTER"
starterDeck: "カブトムシ"
rarity: "N"
type: "ENHANCEMENT"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectText: "この虫の体力を５００増やす。"
biologicalNote: null
taxonomy: null
referencableTags: []
sources:
  cardData: "mushijingi.com (非公式・カード記載内容の探索補助)"
  rulings: "公式Q&Aを優先"
verification: "VERIFIED_SECONDARY"
implementationStatus: "TESTED"
blocked:
  - "ダメージを受けている虫へHP+500を装着した際のcurrentHp表現は、実装上の仮仕様と公式ルールを分離して管理する。"
```

## 118/130 虹の架け橋

```yaml
officialNumber: "118/130"
name: "虹の架け橋"
set: "STARTER"
starterDeck: "オオカマキリ"
rarity: "R"
type: "SPELL"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectText: "自分の捨て札の虫を１つ選び、手札に加える。"
biologicalNote: null
taxonomy: null
referencableTags: []
sources:
  cardData: "mushijingi.com (非公式・カード記載内容の探索補助)"
  rulings: "公式Q&Aを優先"
verification: "VERIFIED_SECONDARY"
implementationStatus: "TESTED"
blocked: []
```

## 124/130 塵芥虫の爆熱弾

```yaml
officialNumber: "124/130"
name: "塵芥虫の爆熱弾"
set: "STARTER"
starterDeck: "カブトムシ"
rarity: "R"
type: "SPELL"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectText: "相手の虫を１つ選び、６００のダメージを与える。"
biologicalNote: null
taxonomy: null
referencableTags: []
sources:
  cardData: "mushijingi.com (非公式・カード記載内容の探索補助)"
  rulings: "公式Q&Aを優先"
verification: "VERIFIED_SECONDARY"
implementationStatus: "TESTED"
blocked: []
```

## 127/130 蟲の息吹

```yaml
officialNumber: "127/130"
name: "蟲の息吹"
set: "STARTER"
starterDeck: "カブトムシ"
rarity: "N"
type: "SPELL"
color: null
cost: 1
baseHp: null
skills: []
traits: []
effectText: "これを自分のエサ場に置く。※このエサのコストはこのターン発生しない。"
biologicalNote: null
taxonomy: null
referencableTags: []
sources:
  cardData: "mushijingi.com (非公式・カード記載内容の探索補助)"
  rulings: "公式Q&Aを優先"
verification: "VERIFIED_SECONDARY"
implementationStatus: "TESTED"
blocked: []
```

## 129/130 飛蝗の凶相

```yaml
officialNumber: "129/130"
name: "飛蝗の凶相"
set: "STARTER"
starterDeck: "カブトムシ"
rarity: "N"
type: "SPELL"
color: null
cost: 0
baseHp: null
skills: []
traits: []
effectText: "ターン終了時まで、自分のすべての虫の攻撃力を２００増やす。"
biologicalNote: null
taxonomy: null
referencableTags: []
sources:
  cardData: "mushijingi.com (非公式・カード記載内容の探索補助)"
  rulings: "公式Q&Aを優先"
verification: "VERIFIED_SECONDARY"
implementationStatus: "TESTED"
blocked: []
```

---

# スターターデッキ構成

## カブトムシデッキ

- ギンヤンマ ×2
- カブトムシ ×2
- ナミアゲハ ×2
- ナミアゲハ（幼虫） ×2
- ニジュウヤホシテントウ ×2
- アキアカネ ×2
- ナミテントウ ×2
- カナブン ×2
- 蓑虫の隠れ蓑 ×1
- 塵芥虫の爆熱弾 ×1
- 蟲の息吹 ×1
- 飛蝗の凶相 ×1

合計20枚。

## オオカマキリデッキ

- トノサマバッタ ×2
- オオカマキリ ×2
- コオニヤンマ ×2
- ミンミンゼミ ×2
- ナナフシモドキ ×2
- セアカゴケグモ ×2
- ヒグラシ ×2
- ワタアブラムシ ×2
- 針金虫の道連れ ×1
- 天牛の大顎 ×1
- 玉虫色の羽化 ×1
- 虹の架け橋 ×1

合計20枚。

---

# スターターで既に重要になる参照タグ

```yaml
families:
  ヤンマ科:
    - ギンヤンマ
  カマキリ科:
    - オオカマキリ
  サナエトンボ科:
    - コオニヤンマ
  ヒメグモ科:
    - セアカゴケグモ
  トンボ科:
    - アキアカネ
  テントウムシ科:
    - ナミテントウ
    - ニジュウヤホシテントウ
  コガネムシ科:
    - カブトムシ
    - カナブン
  アゲハチョウ科:
    - ナミアゲハ
    - ナミアゲハ（幼虫）
  セミ科:
    - ミンミンゼミ
    - ヒグラシ
  バッタ科:
    - トノサマバッタ
  ナナフシ科:
    - ナナフシモドキ
  アブラムシ科:
    - ワタアブラムシ
```

この一覧はカード記載の「○○科」を抽出したもの。
後発カードが `セミ科`、`バッタ科` 等を参照する際のゲームロジックに利用できる。

---

# スターター特性インデックス

```yaml
traits:
  りんぷん:
    cards:
      - ナミアゲハ
  とびだす:
    cards:
      - ミンミンゼミ
  擬態:
    cards:
      - ナナフシモドキ
```

`＜○○＞` の効果を名前だけで共通化しない。
個々の `rawText` と公式裁定を参照する。

---

# 重要裁定メモ

## オオカマキリ / カマ連撃

公式Q&Aで確認済み:

- 最大2回
- 天牛の大顎の+300は両攻撃に適用
- 2回目は1回目の攻撃直後
- 裏向きで「いないもの」とされる虫だけなら継続しない
- 1回目の後に＜とびだす＞で相手虫が出れば、条件を満たして2回目を使用できる

## ナナフシモドキ / ＜擬態＞

公式Q&Aで確認済み:

- 発動中は虫の攻撃対象に選べない
- 擬態虫以外に攻撃可能な虫がいなければ直接攻撃
- 術カードは擬態の影響を受けない

## ナミアゲハ / ＜りんぷん＞

公式Q&Aで確認済み:

- 攻撃先をナミアゲハへ制限
- 複数いる場合はその中から選択
- 術カードの対象制限とは別
- 擬態などで合法対象が存在しない場合は直接攻撃になる

## ナミアゲハ（幼虫） / くさいツノ

公式Q&Aで確認済み:

- 数値上APはマイナスになりうる
- マイナスAPで攻撃したダメージは0
- 場を離れると修正は消える
- すくい投げで裏向きになっただけでは場を離れていないため修正は残る

## セアカゴケグモ / 毒針

公式Q&Aで確認済み:

- 「1度だけ使用できる」は場を離れるまでの1回
- 別個体へは共有しない
- 場を離れて再登場すれば再使用可能

## 針金虫の道連れ

公式Q&Aで確認済み:

- 虫の攻撃で装着先が破壊された時に、破壊した虫を破壊
- 強化カード自身の効果であり、虫の＜＞特性ではない
- 破壊を身代わり等で防いだ場合、条件を満たさない

## 天牛の大顎

公式Q&Aで確認済み:

- 攻撃力+300
- カマ連撃2回とも修正
- AP0のすくい投げで対象が効果により裏向きになり「いないもの」になった場合、その後のダメージ対象がなくなる

## 蟲の息吹

公式Q&Aで確認済み:

- 効果でエサ場に置いたカード分のコストは、そのターンには追加発生しない

## 飛蝗の凶相

公式Q&Aで確認済み:

- 使用時点で自分の場にいる虫が対象
- 使用後に場へ出た虫にはAP+200が適用されない

---

# 参照資料

## 公式

- https://mushijingi.jimdofree.com/
- https://mushijingi.jimdofree.com/%E9%81%8A%E3%81%B3%E6%96%B9/
- https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E3%82%B2%E3%83%BC%E3%83%A0%E3%81%AE%E3%83%AB%E3%83%BC%E3%83%AB%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/
- https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%91%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/

## 非公式カードDB（探索補助）

- https://mushijingi.com/

---

# 次フェーズ: 第1弾106種

第1弾追加時は、各カードで必ず以下を取得する。

- カード番号
- 名前
- 種類
- 色
- コスト
- HP
- 技名
- AP
- 技効果
- `＜○○＞` 特性
- 特性効果
- 解説全文
- ○○科等の分類
- 参照可能タグ
- 公式Q&A
- verification
- implementationStatus
- BLOCKED

特に第1弾以降で同じ「科」に属するカードを横断検索できるようにする。
