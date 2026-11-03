# Entry selection batch progress

Checked2026-11-03. Catalog565; developmentPLAYABLE407; remaining158. Public366 and protected372/388/397 unchanged.

|SET|PLAYABLE|PARTIAL|Unconnected|
|---|---:|---:|---:|
|STARTER|24|0|0|
|BOOSTER_SET_1|106|0|0|
|BOOSTER_SET_2|55|0|0|
|BOOSTER_SET_3|60|0|0|
|BOOSTER_SET_4|64|0|0|
|BOOSTER_SET_5|36|14|14|
|BOOSTER_SET_6|22|0|42|
|BOOSTER_SET_7|22|0|42|
|BOOSTER_SET_8|18|0|46|

## Newly certified per-card evidence
- set6_016 ゴクラクトリバネアゲハ: scripts/entry-selection-evidence.js; tests/crossset-gokuraku.test.js; server/browser/paid-entry-paths.cjs
- set7_049 ヘイケボタル: scripts/entry-selection-evidence.js; tests/crossset-entry-selectors.test.js; server/browser/paid-entry-paths.cjs
- set8_029 ヒメウラナミジャノメ: scripts/entry-selection-evidence.js; tests/crossset-entry-selectors.test.js; server/browser/paid-entry-paths.cjs
- set8_011 イエロージャイアントヒヨケムシ: scripts/entry-selection-evidence.js; tests/crossset-entry-selectors.test.js; server/browser/paid-entry-paths.cjs
- set8_007 ミナミミイデラゴミムシ: scripts/entry-selection-evidence.js; tests/crossset-entry-selectors.test.js; server/browser/paid-entry-paths.cjs
- set8_005 キララシロカネグモ: scripts/entry-selection-evidence.js; tests/crossset-entry-selectors.test.js; server/browser/paid-entry-paths.cjs
- set8_015 コーカサスオオカブト: scripts/entry-selection-evidence.js; tests/crossset-phalanx.test.js; server/browser/paid-entry-paths.cjs
- set8_016 アトラスオオカブト: scripts/entry-selection-evidence.js; tests/crossset-phalanx.test.js; server/browser/paid-entry-paths.cjs
- set8_018 モーレンカンプオオカブト: scripts/entry-selection-evidence.js; tests/crossset-phalanx.test.js; server/browser/paid-entry-paths.cjs
- set8_022 エンガノオオカブト: scripts/entry-selection-evidence.js; tests/crossset-phalanx.test.js; server/browser/paid-entry-paths.cjs

## Dependency rediscovery
Groups overlap; classifications are research priorities, not automatically certified implementations.
- Paid entry and free deployment: 3; set6_003, set8_045, set8_047
- Food face/color decisions: 11; set6_012, set6_056, set6_060, set7_001, set7_007, set7_034, set7_035, set7_051, set7_057, set7_058, set8_052
- Entry effects: 16; set5_044, set6_003, set6_005, set6_017, set6_024, set6_033, set7_007, set7_009, set7_035, set7_054, set7_055, set8_008, set8_019, set8_021, set8_045, set8_047
- Attachment lifecycle: 25; set5_006, set5_013, set5_062, set6_001, set6_003, set6_019, set6_020, set6_022, set6_026, set6_049, set6_050, set6_058, set7_036, set7_037, set7_038, set7_041, set7_059, set7_064, set8_003, set8_004, set8_028, set8_048, set8_051, set8_052, set8_054
- Destruction and replacement: 44; set5_006, set5_007, set5_013, set5_042, set5_048, set5_049, set5_054, set5_055, set6_005, set6_007, set6_010, set6_017, set6_022, set6_027, set6_031, set6_036, set6_037, set6_041, set6_042, set6_049, set6_054, set6_055, set7_002, set7_004, set7_023, set7_027, set7_052, set7_053, set7_056, set7_062, set7_064, set8_001, set8_003, set8_008, set8_023, set8_024, set8_026, set8_030, set8_036, set8_038, set8_049, set8_051, set8_053, set8_056

## Next priorities
- SET5-44 Hercules Sun: compare existing GROW_SELF_IF_ENTRY_CARD_NAME against every actual 羽化 route; validate original printed card name rather than a technique name.
- SET8-45 Alexandra larva: paid own-hand form deployment; reuse selector after verifying canonical adult/larval form matching (the wording is source-relative, unlike literal Gokuraku name).
- SET6-3 Uchiwayanma: paid hand-enhancement selection plus legal host choice; reuse attach lifecycle and recheck all enhancement conditions, including copy-source choices.
- SET7-9 Ooshiokaratonbo / SET6-33 Ussuri: current family/color stat modifiers on entry. Snapshot vs continuous scopes and expiry must be proven.
- SET7-7 / SET7-35: multi-food and hidden-color decisions require further selection constraints and hidden-information review; do not use visible-only generic filters to peek at concealed identities.

## Explicit holds
Original four timing hypotheses and additional-cost-source-loss stop route stay isolated on oldunsafe development branch. New official processing PDF is available as a future audit source, but those assertions/paths were not altered or imported. No main/publicAPI/ngrok changes. AUDITED is not implied by PLAYABLE.
