# SET1 Implementation Audit

## Coverage

- Total: 106
- PLAYABLE (TESTED): 106
- PARTIAL: 0
- BLOCKED: 0
- UNIMPLEMENTED without reason: 0

## Phase 2 completion audit

The 21 former PARTIAL entries are now descriptor-driven and `TESTED`. The older per-card matrix below records the phase-1 snapshot; this phase-2 table is the authoritative final disposition.

| Cards | Final mechanic |
|---|---|
| 2 | exact-2 selection and alternative summon cost |
| 5 | damage that does not heal at turn end |
| 27 | optional on-entry hand-to-food move without cost gain |
| 39, 78 | color choice and opponent-field snapshot override |
| 53, 60 | self-destruction after damage and before target destruction |
| 68 | ordered two-target attack |
| 73 | opponent food return before territory selection |
| 84 | food-zone sacrifice cost |
| 93, 104 | attachment selection and transfer preserving ownership |
| 102 | pre-destruction replacement, attachment consumption, max-HP heal |
| 105 | face-up special territory and discard destination |
| 110 | territory-draw suppression while the attachment host remains |
| 111 | attack-source territory-trigger suppression |
| 116 | same-color 1–2 selection and ordered food-to-field move |
| 119 | top-deck reveal/type routing and delayed destruction |
| 120, 126 | validated atomic two-zone exchange |
| 128 | opponent attachment targeting/destruction |

Final machine count: PLAYABLE 106 / PARTIAL 0 / BLOCKED 0 / UNIMPLEMENTED 0.

## Classification

- A: 39 effect-free insects; registered and verified through the normal summon/attack path.
- B: Existing continuous attack, sacrifice, once-per-field-stay, tobidasu, targeting, face-down, stat modifiers, attachments, spell damage, and all-field modifier cards.
- C implemented: dynamic AP, attack restriction, attack-source return, attack-target return, attachment target rule, zone-target spell movement, reset attack, and delayed destruction.
- C remaining PARTIAL: mechanics listed per card below. Card data and player-facing text are present, but the unresolved runtime branch is not advertised as playable.
- D: none. The local catalogue and the current official Set 1 Q&A did not leave a contradictory ruling among the inspected cards.

## Web research

Source: official Set 1 Q&A, https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F/%E7%AC%AC%EF%BC%91%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/ (official, HIGH confidence).

Confirmed points include: continuous attacks are immediate and capped at two; Honey-Wax Wall counts as territory; the defender chooses face-up versus face-down territory before any attack-side selection variant; direct-attack food return precedes territory draw; Long-Armed Attack preselects two targets and resolves them in attacker-chosen order; Edge-of-Death Insect Shower resolves field-entry triggers sequentially; Cicada-Shell Armor replaces one destruction and heals to modified maximum HP; Immortal Throne suppresses territory draw while its host remains but not when that host itself is destroyed; and Core-Cutting Scissors stops suppressing tobidasu if its host leaves before territory draw.

## Card matrix

| No. | Card | Status | Mechanic / remaining branch |
|---|---|---|---|
| 1/130 | ニセハナマオウカマキリ | PLAYABLE | 既存CONTINUOUS_ATTACK + SACRIFICE_OWN_INSECT。 |
| 2/130 | リオック | PLAYABLE | exact-2代替召喚。 |
| 3/130 | メキシカンレッドニー | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 4/130 | オニヤンマ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 5/130 | トビズムカデ | PLAYABLE | 回復不能ダメージ。 |
| 8/130 | オオスズメバチ | PLAYABLE | 既存ONCE_PER_FIELD_STAY。 |
| 9/130 | ヤブキリ | PLAYABLE | 既存TERRITORY_DRAW/<とびだす>。 |
| 10/130 | ミイデラゴミムシ | PLAYABLE | 汎用ON_DESTROYED + RETURN_ATTACK_SOURCE_TO_HAND。 |
| 12/130 | チョウセンカマキリ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 13/130 | シオヤアブ | PLAYABLE | 汎用APPLY_STAT_MODIFIER(HP)。 |
| 14/130 | デスストーカー | PLAYABLE | 既存ONCE_PER_FIELD_STAY。 |
| 15/130 | アリジゴク | PLAYABLE | 汎用APPLY_ATTACK_RESTRICTION。 |
| 16/130 | キリギリス | PLAYABLE | 既存FORCE_ATTACK_TO_SELF_GROUP。 |
| 17/130 | マイマイカブリ | PLAYABLE | 既存TERRITORY_DRAW/<とびだす>。 |
| 18/130 | コガネグモ | PLAYABLE | 汎用APPLY_ATTACK_RESTRICTION。 |
| 19/130 | オニグモ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 20/130 | ハラビロカマキリ | PLAYABLE | 既存SACRIFICE_OWN_INSECT。 |
| 21/130 | ヒアリ | PLAYABLE | 汎用dynamicAp count/presence evaluator。 |
| 23/130 | クロシデムシ | PLAYABLE | 汎用dynamicAp count/presence evaluator。 |
| 25/130 | シオカラトンボ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 26/130 | ハンミョウ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 27/130 | ミツツボアリ | PLAYABLE | 場出し時任意エサ追加。 |
| 28/130 | ナナホシテントウ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 29/130 | クロヤマアリ | PLAYABLE | 汎用dynamicAp count/presence evaluator。 |
| 31/130 | ハナグモ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 32/130 | コカマキリ | PLAYABLE | 既存SACRIFICE_OWN_INSECT。 |
| 33/130 | クロオオアリ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 34/130 | ヘラクレスオオカブト | PLAYABLE | 汎用MOVE_ATTACK_TARGET_TO_HAND + ONCE_PER_FIELD_STAY。 |
| 35/130 | コーカサスオオカブト | PLAYABLE | 既存TURN_FACE_DOWN。 |
| 36/130 | ミヤマクワガタ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 37/130 | ゴライアスオオツノハナムグリ | PLAYABLE | 既存TERRITORY_DRAW/<とびだす>。 |
| 38/130 | ギラファノコギリクワガタ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 39/130 | ニシキオオツバメガ | PLAYABLE | 色選択・場全体色変更。 |
| 41/130 | オオクワガタ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 42/130 | オオムラサキ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 43/130 | ヒラタクワガタ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 45/130 | アオスジアゲハ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 46/130 | ノコギリクワガタ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 48/130 | クロアゲハ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 49/130 | オオゾウムシ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 50/130 | オオスカシバ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 51/130 | ヤエヤママルバネクワガタ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 52/130 | クマゼミ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 53/130 | セイヨウミツバチ | PLAYABLE | damage後self-destroy timing。 |
| 54/130 | キムネクマバチ | PLAYABLE | 既存ONCE_PER_FIELD_STAY。 |
| 55/130 | コクワガタ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 56/130 | アブラゼミ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 57/130 | アカタテハ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 58/130 | アカアシクワガタ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 59/130 | ヘビトンボ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 60/130 | ニホンミツバチ | PLAYABLE | damage後self-destroy timing。 |
| 61/130 | モンシロチョウ | PLAYABLE | 汎用dynamicAp count/presence evaluator。 |
| 62/130 | モンキチョウ | PLAYABLE | 汎用dynamicAp count/presence evaluator。 |
| 65/130 | ネブトクワガタ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 66/130 | アオカナブン | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 67/130 | オオキバウスバカミキリ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 68/130 | テナガカミキリ | PLAYABLE | ordered multi-target attack。 |
| 69/130 | ジャイアントウェタ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 70/130 | シロスジカミキリ | PLAYABLE | 汎用APPLY_STAT_MODIFIER(HP)。 |
| 72/130 | オオコノハムシ | PLAYABLE | 既存<擬態> field-entry protection。 |
| 73/130 | サバクトビバッタ | PLAYABLE | direct attack continuation。 |
| 74/130 | ゴマダラカミキリ | PLAYABLE | 既存TERRITORY_DRAW/<とびだす>。 |
| 75/130 | クワカミキリ | PLAYABLE | 汎用APPLY_STAT_MODIFIER(HP)。 |
| 76/130 | キアゲハ（幼虫） | PLAYABLE | 既存APPLY_STAT_MODIFIER。 |
| 77/130 | ショウリョウバッタ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 78/130 | ヤマトタマムシ | PLAYABLE | 色選択・場全体色変更。 |
| 81/130 | クロカタゾウムシ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 82/130 | オオムラサキ（幼虫） | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 83/130 | イボバッタ | PLAYABLE | 既存TERRITORY_DRAW/<とびだす>。 |
| 84/130 | コバネイナゴ | PLAYABLE | food-zone sacrifice。 |
| 85/130 | アオクサカメムシ | PLAYABLE | 汎用ON_DESTROYED + RETURN_ATTACK_SOURCE_TO_HAND。 |
| 86/130 | オトシブミ | PLAYABLE | 汎用APPLY_STAT_MODIFIER(HP)。 |
| 87/130 | ゴマダラオトシブミ | PLAYABLE | 汎用APPLY_STAT_MODIFIER(HP)。 |
| 88/130 | イラガ（幼虫） | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 89/130 | コガネムシ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 90/130 | ウバタマムシ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 92/130 | チャバネアオカメムシ | PLAYABLE | 汎用ON_DESTROYED + RETURN_ATTACK_SOURCE_TO_HAND。 |
| 93/130 | オンブバッタ | PLAYABLE | attachment transfer。 |
| 94/130 | カイコ（幼虫） | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 96/130 | マメコガネ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 97/130 | ハラヒシバッタ | PLAYABLE | 既存<擬態> field-entry protection。 |
| 98/130 | ツマグロオオヨコバイ | PLAYABLE | 効果なし。基本攻撃処理で検証済み。 |
| 99/130 | オオミノガ（幼虫） | PLAYABLE | 汎用APPLY_STAT_MODIFIER(HP)。 |
| 100/130 | 雀蜂の毒針 | PLAYABLE | 既存attachment AP modifier。 |
| 102/130 | 空蝉の皮鎧 | PLAYABLE | destruction replacement。 |
| 103/130 | 蚕玉の加護 | PLAYABLE | 既存attachment HP modifier。 |
| 104/130 | 螻蛄の七芸 | PLAYABLE | attachment transfer spell。 |
| 105/130 | 蜜蝋の壁 | PLAYABLE | face-up special territory。 |
| 109/130 | 鳳蝶の蟲惑 | PLAYABLE | 既存FORCE_ATTACK_TO_SELF_GROUPをattachmentへ一般化。 |
| 110/130 | 不滅の王台 | PLAYABLE | territory draw suppression。 |
| 111/130 | 鋏虫の芯切り鋏 | PLAYABLE | territory trigger suppression。 |
| 112/130 | 剣の息吹 | PLAYABLE | 既存attachment COLOR_OVERRIDE。 |
| 113/130 | 勾玉の息吹 | PLAYABLE | 既存attachment COLOR_OVERRIDE。 |
| 114/130 | 鏡の息吹 | PLAYABLE | 既存attachment COLOR_OVERRIDE。 |
| 115/130 | 蟷螂の構え | PLAYABLE | 汎用zone target + RESET_ATTACK。 |
| 116/130 | 瀬戸際の虫時雨 | PLAYABLE | same-color ordered multi-move。 |
| 117/130 | 退魔の蚊遣り火 | PLAYABLE | 既存spell target/destroy pipeline。 |
| 119/130 | 蠱毒の因果 | PLAYABLE | top-deck type routing。 |
| 120/130 | 叛逆の蛮勇 | PLAYABLE | atomic discard/field exchange。 |
| 121/130 | 斑猫の手招き | PLAYABLE | 汎用zone target + MOVE_TARGET。 |
| 122/130 | 百足の狂乱 | PLAYABLE | 既存all-field AP modifier。 |
| 123/130 | 蜉蝣の閃き | PLAYABLE | 汎用zone target + temporary field entry。 |
| 125/130 | 玉響の蠢き | PLAYABLE | 汎用zone target + temporary field entry。 |
| 126/130 | 繚乱の足掻き | PLAYABLE | atomic same-cost hand/field exchange。 |
| 128/130 | 埋葬虫の野辺送り | PLAYABLE | opponent attachment destruction。 |
| 130/130 | 蟲封じの蛍袋 | PLAYABLE | 汎用zone target + APPLY_ATTACK_RESTRICTION。 |

## Integrity

The pre-existing modified starter snapshot and the pre-existing .ai-worker, docs, shared, toolbox, and shared-test workstreams were not reset or deleted. This audit adds new SET1 files and only edits the engine, UI routing, loaders, and test runner required by SET1.
