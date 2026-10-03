# SET8 Catalog Audit — 不滅の戦陣

Baseline: dddb4e767d0d12576c5ac3cba4ef4dd705989ccc. Reviewed 2026-10-03.

64 new catalog printings; total 565. All SET8 definitions remain RESEARCHED (catalog-only). Existing runtime playability stays 309. No SET8 effect handlers have been added.

## Source hierarchy and verification limits

- Publisher product overview: https://mushijingi.jimdofree.com/ — title, JAN 4550746086609, 64 types.
- DAISO single pack: https://jp.daisonet.com/products/4550746086609
- DAISO BOX: https://jp.daisonet.com/products/4550746087767
- Official SET8 Q&A dated 2026-09-15: https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F-1/
- Maintained fan databases: https://mushijingi.com/ and https://www.mushijingi-cardlist.com/mushijingi-8dan-card-list/

The fan database explicitly disclaims official status. Basic metadata, names, costs, HP, skill/trait names and texts, and all spell/enhancement texts were independently compared between the two databases with no differences. Artwork URLs are sourced from the same existing catalog image provider. Publisher card-text verification is UNKNOWN for all 64; this is not represented as VERIFIED_OFFICIAL. No missing basic values were inferred.

## Rarity conflict

CONFLICT: single-pack page gives LR5 / UR7 / SR14 / R17 / N21; BOX gives LR5 / UR8 / SR12 / R18 / N21. Both total 64. Independent per-card tally is LR5 / UR7 / SR14 / R17 / N21 and agrees with the single pack. BOX conflict remains recorded rather than silently replaced.

## Ruling classifications

OFFICIAL_RULING: 28 cards with applicable official Q&A summaries. Each summary links to the official source. USER_RULING: none. NEEDS_RULING: 36 cards have no card-specific official Q&A matched; this means no additional ruling was invented, not that ordinary text is missing. Each card has its own state in set8-audit.json.

All six Q&A sections were reviewed: new rules, red insects, blue insects, green insects, spells, enhancements. Cross-set references (Rainbow Bridge, death-pile counting, Kuchinashi, delayed destruction, armor targeting, attack prevention and enhancement transfer) are retained in the summaries. General rules are stored separately and do not masquerade as card-specific Q&A.

## Future Battle mechanics

| Mechanic | Catalog evidence / implementation caution |
|---|---|
| Face-down discard | Exclude from normal discard queries; Colony explicitly counts it. Preserve orientation across serialization. |
| Leaving the field | Zone movement only; flips inside the field do not fire leave triggers. |
| 奈落復活 | Fixed payment 6, discard activation, persistent granted destruction routing, summon prevention and simultaneous trigger order. |
| ファランクス | Paid hand entry only, original cost at most 5, serial entry; no effect-entry chain. |
| 転生羽化 / 転生強化 | Separate entry permission from granted AP/HP modifiers that survive later trait loss. |
| 相変異 | Continuous food color conversion; remove while source face-down and restore on reveal. |
| コロニー / 分解 | Explicit face-down discard counts, optional up-to-two flips, attack-after continuation after attacker loss. |
| 皇帝 | Food-zone continuous trait-effect suppression; leaving food restores restrictions, skill classification remains. |
| 成虫招き | Paid entry from hand only; effect entry cannot trigger it. |
| 影武者の魔鏡 | Two insects, choice of host, attack lure, original referenced information including taxonomy, latest information override wins. Reference identity survives transfer. Granted delayed/stat effects remain. Reference departure destroys only mirror. Gained entry traits do not trigger. Only use-effects (not attach-effects) can invoke the card. |
| 半死の道連れ | Player choices, floor half remaining, face-down exclusion, simultaneous destruction and turn-player-first triggers, replacement without reselection. |
| 傀儡の冬虫夏草 | Cost-limited revival, minus HP/AP, loss of skill effects, enhancement destruction links; zero HP destroys without territory. |

No Engine implementation is included in this change.

## Identity and decks

The existing registry printing convention is preserved: definition ID set8_NNN, printing registry:set8_NNN. Same-name versions retain their versioned rule definitions. The existing deck validator aggregates by normalized name across printings and still rejects a third same-name card; Battle readiness rejects every SET8 printing. Reprinted names are not used to inherit earlier Battle handlers or PLAYABLE status.

## Card list

| No. | Name | Type | Color | Rarity | Cost | HP | Ruling |
|---|---|---|---|---|---|---|---|
| 1/64 | ペルビアンジャイアントオオムカデ | INSECT | RED | LR | 6 | 1700 | OFFICIAL_RULING |
| 2/64 | オオルリボシヤンマ | INSECT | RED | N | 5 | 1100 | NEEDS_RULING |
| 3/64 | トゲアクマツユムシ | INSECT | RED | SR | 5 | 800 | OFFICIAL_RULING |
| 4/64 | ハナカマキリ | INSECT | RED | UR | 3 | 900 | OFFICIAL_RULING |
| 5/64 | キララシロカネグモ | INSECT | RED | SR | 2 | 400 | OFFICIAL_RULING |
| 6/64 | ギガスオオアリ | INSECT | RED | SR | 5 | 1100 | NEEDS_RULING |
| 7/64 | ミナミミイデラゴミムシ | INSECT | RED | R | 4 | 900 | OFFICIAL_RULING |
| 8/64 | ミイデラゴミムシ | INSECT | RED | UR | 4 | 800 | NEEDS_RULING |
| 9/64 | コガタスズメバチ | INSECT | RED | N | 4 | 400 | NEEDS_RULING |
| 10/64 | キバハリアリ | INSECT | RED | N | 3 | 500 | NEEDS_RULING |
| 11/64 | イエロージャイアントヒヨケムシ | INSECT | RED | SR | 5 | 1100 | NEEDS_RULING |
| 12/64 | ツメジムカデ | INSECT | RED | N | 2 | 500 | NEEDS_RULING |
| 13/64 | アリヅカコオロギ | INSECT | RED | R | 2 | 400 | NEEDS_RULING |
| 14/64 | ニホンカワトンボ | INSECT | RED | N | 1 | 200 | NEEDS_RULING |
| 15/64 | コーカサスオオカブト | INSECT | BLUE | LR | 6 | 1800 | OFFICIAL_RULING |
| 16/64 | アトラスオオカブト | INSECT | BLUE | UR | 5 | 1300 | OFFICIAL_RULING |
| 17/64 | インペラトールホソアカクワガタ | INSECT | BLUE | SR | 4 | 500 | NEEDS_RULING |
| 18/64 | モーレンカンプオオカブト | INSECT | BLUE | R | 4 | 900 | OFFICIAL_RULING |
| 19/64 | アカボシゴマダラ | INSECT | BLUE | SR | 4 | 800 | OFFICIAL_RULING |
| 20/64 | ケンタウルスオオカブト | INSECT | BLUE | SR | 4 | 900 | NEEDS_RULING |
| 21/64 | ミカドアゲハ | INSECT | BLUE | R | 3 | 500 | NEEDS_RULING |
| 22/64 | エンガノオオカブト | INSECT | BLUE | N | 3 | 600 | OFFICIAL_RULING |
| 23/64 | オオハキリバチ | INSECT | BLUE | R | 3 | 600 | OFFICIAL_RULING |
| 24/64 | ヤマトハキリバチ | INSECT | BLUE | R | 2 | 300 | NEEDS_RULING |
| 25/64 | アカエゾゼミ | INSECT | BLUE | N | 4 | 900 | NEEDS_RULING |
| 26/64 | ジュウサンネンゼミ | INSECT | BLUE | R | 2 | 300 | NEEDS_RULING |
| 27/64 | ミドリシジミ | INSECT | BLUE | SR | 2 | 400 | OFFICIAL_RULING |
| 28/64 | ヒメカブト | INSECT | BLUE | N | 2 | 300 | OFFICIAL_RULING |
| 29/64 | ヒメウラナミジャノメ | INSECT | BLUE | N | 1 | 100 | NEEDS_RULING |
| 30/64 | パンダアリバチ | INSECT | BLUE | N | 2 | 300 | NEEDS_RULING |
| 31/64 | サルオガセツユムシ | INSECT | GREEN | LR | 6 | 1600 | OFFICIAL_RULING |
| 32/64 | ヨナグニサン（幼虫） | INSECT | GREEN | UR | 6 | 1600 | OFFICIAL_RULING |
| 33/64 | トノサマバッタ | INSECT | GREEN | UR | 5 | 1100 | OFFICIAL_RULING |
| 34/64 | カツオゾウムシ | INSECT | GREEN | N | 2 | 300 | OFFICIAL_RULING |
| 35/64 | オウサマミツギリゾウムシ | INSECT | GREEN | R | 5 | 1500 | NEEDS_RULING |
| 36/64 | アカボシゴマダラ（幼虫） | INSECT | GREEN | R | 3 | 500 | OFFICIAL_RULING |
| 37/64 | クロカタゾウムシ | INSECT | GREEN | UR | 3 | 800 | NEEDS_RULING |
| 38/64 | ミカドアゲハ（幼虫） | INSECT | GREEN | N | 2 | 300 | NEEDS_RULING |
| 39/64 | コウテイブローチハムシ | INSECT | GREEN | R | 1 | 100 | OFFICIAL_RULING |
| 40/64 | ハサミツノカメムシ | INSECT | GREEN | R | 3 | 400 | NEEDS_RULING |
| 41/64 | クサギカメムシ | INSECT | GREEN | N | 2 | 300 | NEEDS_RULING |
| 42/64 | ヤマトシロアリソルジャー | INSECT | GREEN | SR | 3 | 500 | OFFICIAL_RULING |
| 43/64 | ヤマトシロアリワーカー | INSECT | GREEN | N | 2 | 300 | OFFICIAL_RULING |
| 44/64 | ヤマトシロアリニンフ | INSECT | GREEN | R | 1 | 100 | OFFICIAL_RULING |
| 45/64 | アレクサンドラトリバネアゲハ（幼虫） | INSECT | GREEN | UR | 3 | 400 | OFFICIAL_RULING |
| 46/64 | モモアカアブラムシ | INSECT | GREEN | N | 1 | 400 | NEEDS_RULING |
| 47/64 | 鬼蜻蜓の簪 | ENHANCEMENT | — | SR | 3 | — | NEEDS_RULING |
| 48/64 | 百足の具足 | ENHANCEMENT | — | R | 0 | — | NEEDS_RULING |
| 49/64 | 黄金虫の六文銭 | ENHANCEMENT | — | R | 0 | — | NEEDS_RULING |
| 50/64 | 幻惑の蛍袋 | ENHANCEMENT | — | N | 0 | — | NEEDS_RULING |
| 51/64 | 影武者の魔鏡 | ENHANCEMENT | — | LR | 1 | — | OFFICIAL_RULING |
| 52/64 | 亀虫の盾甲冑 | ENHANCEMENT | — | SR | 0 | — | OFFICIAL_RULING |
| 53/64 | 傀儡の冬虫夏草 | ENHANCEMENT | — | SR | 1 | — | OFFICIAL_RULING |
| 54/64 | 玉虫の色真似巻 | ENHANCEMENT | — | N | 0 | — | NEEDS_RULING |
| 55/64 | 蟲術の息吹 | SPELL | — | R | 0 | — | NEEDS_RULING |
| 56/64 | 半死の道連れ | SPELL | — | SR | 3 | — | OFFICIAL_RULING |
| 57/64 | 水月の激流 | SPELL | — | N | 3 | — | NEEDS_RULING |
| 58/64 | 神楽の烈風 | SPELL | — | R | 4 | — | NEEDS_RULING |
| 59/64 | 火花の嵐 | SPELL | — | N | 0 | — | NEEDS_RULING |
| 60/64 | 蛹の冬籠り | SPELL | — | N | 0 | — | NEEDS_RULING |
| 61/64 | 断界の虫送り | SPELL | — | SR | 4 | — | NEEDS_RULING |
| 62/64 | 冥府の導き | SPELL | — | LR | 2 | — | NEEDS_RULING |
| 63/64 | 蚕の口封じ | SPELL | — | N | 2 | — | OFFICIAL_RULING |
| 64/64 | 金色の腕 | SPELL | — | R | 0 | — | NEEDS_RULING |

## Verification

Run tests/set8-catalog.test.js, tests/set8-toolbox-browser.cjs with Chromium and WebKit, tests/run-all.js, tests/run-shared.js, tests/astra-browser.cjs for both browsers, syntax checks and git diff --check. Final exact results and deployment are recorded in set8-verification.md.
