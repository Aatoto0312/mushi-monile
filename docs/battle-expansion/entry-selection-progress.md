# Entry selection batch progress

Checked2026-11-04. Catalog565; developmentPLAYABLE426; remaining139. Public366 and protected372/388/397/407/412/414/418/421 unchanged.

|SET|PLAYABLE|PARTIAL|Unconnected|
|---|---:|---:|---:|
|STARTER|24|0|0|
|BOOSTER_SET_1|106|0|0|
|BOOSTER_SET_2|55|0|0|
|BOOSTER_SET_3|60|0|0|
|BOOSTER_SET_4|64|0|0|
|BOOSTER_SET_5|37|13|14|
|BOOSTER_SET_6|29|0|35|
|BOOSTER_SET_7|28|1|35|
|BOOSTER_SET_8|23|0|41|

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
- set6_003 ウチワヤンマ: scripts/entry-selection-evidence.js; tests/crossset-growth-entry.test.js; server/browser/growth-entry-paths.cjs
- set6_033 ウスリーオオカミキリ: scripts/entry-selection-evidence.js; tests/crossset-growth-entry.test.js; server/browser/growth-entry-paths.cjs
- set7_009 オオシオカラトンボ: scripts/entry-selection-evidence.js; tests/crossset-growth-entry.test.js; server/browser/growth-entry-paths.cjs
- set8_045 アレクサンドラトリバネアゲハ（幼虫）: scripts/entry-selection-evidence.js; tests/crossset-growth-entry.test.js; server/browser/growth-entry-paths.cjs
- set6_024 ハルゼミ: scripts/entry-selection-evidence.js; tests/wave3-food-entry.test.js; server/browser/wave3-paths.cjs
- set7_007 ウスバカマキリ: scripts/entry-selection-evidence.js; tests/wave3-food-entry.test.js; server/browser/wave3-paths.cjs
- set8_019 アカボシゴマダラ: scripts/entry-selection-evidence.js; tests/emergence-family.test.js; server/browser/emergence-paths.cjs
- set8_021 ミカドアゲハ: scripts/entry-selection-evidence.js; tests/emergence-family.test.js; server/browser/emergence-paths.cjs
- set8_036 アカボシゴマダラ（幼虫）: scripts/entry-selection-evidence.js; tests/emergence-family.test.js; server/browser/emergence-paths.cjs
- set8_038 ミカドアゲハ（幼虫）: scripts/entry-selection-evidence.js; tests/emergence-family.test.js; server/browser/emergence-paths.cjs
- set6_017 オオゴマダラ: scripts/entry-selection-evidence.js; tests/food-wave.test.js; server/browser/food-wave-paths.cjs
- set7_035 ヤマトタマムシ: scripts/entry-selection-evidence.js; tests/food-wave.test.js; server/browser/food-wave-paths.cjs
- set5_044 ヘラクレスサン: scripts/entry-selection-evidence.js; tests/crossset-growth-entry.test.js, tests/set5-entry-provenance.test.js; server/browser/growth-entry-paths.cjs
- set7_057 封印の怨念: scripts/entry-selection-evidence.js; tests/food-wave.test.js; server/browser/food-wave-paths.cjs

## Dependency rediscovery
Groups overlap; classifications are research priorities, not automatically certified implementations.
- Paid entry and free deployment: 1; set8_047
- Food face/color decisions: 8; set7_034, set6_012, set6_056, set6_060, set7_001, set7_051, set7_058, set8_052
- Entry effects: 5; set6_005, set7_054, set7_055, set8_008, set8_047
- Attachment lifecycle: 24; set5_006, set5_013, set5_062, set6_001, set6_019, set6_020, set6_022, set6_026, set6_049, set6_050, set6_058, set7_036, set7_037, set7_038, set7_041, set7_059, set7_064, set8_003, set8_004, set8_028, set8_048, set8_051, set8_052, set8_054
- Destruction and replacement: 41; set5_006, set5_007, set5_013, set5_042, set5_048, set5_049, set5_054, set5_055, set6_005, set6_007, set6_010, set6_022, set6_027, set6_031, set6_036, set6_037, set6_041, set6_042, set6_049, set6_054, set6_055, set7_002, set7_004, set7_023, set7_027, set7_052, set7_053, set7_056, set7_062, set7_064, set8_001, set8_003, set8_008, set8_023, set8_024, set8_026, set8_030, set8_049, set8_051, set8_053, set8_056

## Next priorities
- SET6-41: pre-damage self-destruction, replacement survival and discard adult deployment.
- SET8-47: paid attachment entry and linked leave cleanup; hidden-enhancement ruling stays open.
- SET6-60/12 and SET7-58: serial food movement, post-territory reveal and committed selected-food damage; SET7-34 continuous HP remains PARTIAL.

## Explicit holds
Original four timing hypotheses and additional-cost-source-loss stop route stay isolated on oldunsafe development branch. New official processing PDF is available as a future audit source, but those assertions/paths were not altered or imported. No main/publicAPI/ngrok changes. AUDITED is not implied by PLAYABLE.

2026-11-04 incremental economy batch: SET6-02/12/60, SET7-13/58; tests/economy-batch.test.js, server/test/economy-batch.test.cjs, server/browser/economy-paths.cjs. Queue:implementation-queue.md. No whole-catalog reclassification.

- SET5-25/27: territory followups; tests/territory-followups.test.js, server/test/territory-followups.test.cjs, server/browser/territory-followups-paths.cjs.

- SET6-41: dedicated pre-damage self destruction and matching adult deployment; QA6 replacement exception; evidence scripts/entry-selection-evidence.js.

- SET8-23/24: printed skill self-destruction/cost lifecycle; scripts/material-collection-evidence.js.

- SET5-56: officialQA7 dynamic food references resolves priorhold; existingEngine only; scripts/set5-battle-evidence.js.

- SET5-60: unrestricted attacked poison-skill insect, current-controller scope; once-used skills remain consumed. scripts/set5-battle-evidence.js.
