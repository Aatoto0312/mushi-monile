# Sequence batch progress

Checked2026-11-03. Catalog565; development PLAYABLE397; pending168. Public366, protected372 and protected388 unchanged. This safe397 is distinct from oldunsafe388.

|SET|PLAYABLE|PARTIAL|Unconnected|
|---|---:|---:|---:|
|STARTER|24|0|0|
|BOOSTER_SET_1|106|0|0|
|BOOSTER_SET_2|55|0|0|
|BOOSTER_SET_3|60|0|0|
|BOOSTER_SET_4|64|0|0|
|BOOSTER_SET_5|36|14|14|
|BOOSTER_SET_6|21|0|43|
|BOOSTER_SET_7|21|0|43|
|BOOSTER_SET_8|10|0|54|

## Newly certified per-card evidence

- set6_004 ナンベイオオタガメ: scripts/sequence-battle-evidence.js; tests/crossset-dive-cards.test.js, server/browser/dive-paths.cjs
- set6_008 コオイムシ: scripts/sequence-battle-evidence.js; tests/crossset-dive-cards.test.js, server/browser/dive-paths.cjs
- set6_011 マツモムシ: scripts/sequence-battle-evidence.js; tests/crossset-dive-cards.test.js, server/browser/dive-paths.cjs
- set6_035 ガムシ: scripts/sequence-battle-evidence.js; tests/crossset-dive-cards.test.js, server/browser/dive-paths.cjs
- set6_061 稲妻の嵐: scripts/sequence-battle-evidence.js; tests/crossset-repeat-cards.test.js, server/browser/repeat-paths.cjs
- set6_062 爆熱の嵐: scripts/sequence-battle-evidence.js; tests/crossset-repeat-cards.test.js, server/browser/repeat-paths.cjs
- set7_061 五色の解放: scripts/sequence-battle-evidence.js; tests/crossset-repeat-cards.test.js, server/browser/repeat-paths.cjs
- set8_059 火花の嵐: scripts/sequence-battle-evidence.js; tests/crossset-repeat-cards.test.js, server/browser/repeat-paths.cjs
- set6_025 パプアキンイロクワガタ: scripts/sequence-battle-evidence.js; tests/crossset-entry-reuse.test.js, server/browser/entry-paths.cjs

## Dependency rediscovery after common mechanics
All565 cards are rechecked; remaining groups overlap and are research candidates, not implementation promises.
- Conditional entry/selection: 26; set5_044, set6_003, set6_005, set6_016, set6_017, set6_024, set6_033, set7_007, set7_009, set7_035, set7_049, set7_054, set7_055, set8_005, set8_007, set8_008, set8_011, set8_015, set8_016, set8_018, set8_019, set8_021, set8_022, set8_029, set8_045, set8_047
- Food face/color selection: 13; set6_012, set6_056, set6_060, set7_001, set7_007, set7_034, set7_035, set7_049, set7_051, set7_057, set7_058, set8_029, set8_052
- Continuous stats or cost: 5; set6_058, set7_051, set7_057, set7_058, set8_033
- Attachment lifecycle: 26; set5_006, set5_013, set5_062, set6_001, set6_003, set6_019, set6_020, set6_022, set6_026, set6_049, set6_050, set6_058, set7_036, set7_037, set7_038, set7_041, set7_059, set7_064, set8_003, set8_004, set8_005, set8_028, set8_048, set8_051, set8_052, set8_054
- Destruction/replacement: 45; set5_006, set5_007, set5_013, set5_042, set5_048, set5_049, set5_054, set5_055, set6_005, set6_007, set6_010, set6_017, set6_022, set6_027, set6_031, set6_036, set6_037, set6_041, set6_042, set6_049, set6_054, set6_055, set7_002, set7_004, set7_023, set7_027, set7_052, set7_053, set7_056, set7_062, set7_064, set8_001, set8_003, set8_008, set8_011, set8_023, set8_024, set8_026, set8_030, set8_036, set8_038, set8_049, set8_051, set8_053, set8_056
- Serial spell damage: 0; none

## Next safe work
- SET7-49 Heikehotaru: small optional own hidden-food reveal entry selector. Check owner-visible/observer-hidden candidates.
- SET8-29 Himeuranamijanome: paid entry plus optional opponent RGB food flip. Shares face/color selection primitive, but payment method coverage still needs review.
- SET8-11 Yellow Giant: paid-entry printedcost<=2 optional destruction; must preserve destruction continuations and not reuse unsafe paid attack costs.
- SET8-7 Minami: existing entry damage plus visible own-discard name substring condition; confirm suppression, no-target and exact damage ruling.
- SET7-20 Kabutomushi: existing forced attribute multiplier + once-per-field-stay; confirm immunity priority from official QA.

## Explicit holds
Original four hypotheses and paid-cost source-loss route remain isolated on olddevelopment branch. No edits or skips to those tests. No API/ngrok restart, no main push, no public deployment. FinalAUDITED is not inferred from PLAYABLE.
