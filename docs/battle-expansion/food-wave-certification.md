# Food / enhancement-origin emergence — development421

Started2026-11-03, verification continues2026-11-04. Base safe418 checkpoint1fc3e19cbea84d12cd8553692c5a32a566beba31. Worktree C:/Users/aatot/mushi-food-wave, branch crossset-food-wave-20261103. Public366/main/API/ngrok/auth and original stage are protected. PLAYABLE basic support is distinct from final independent AUDITED.

## Individually implemented candidates
|ID|Name|Complete effect and interactions|
|---|---|---|
|SET6-17|オオゴマダラ|Printed cost5 BLUE HP1300/AP700. Exact actual summoning enhancement receipt -> destroy that attached 口寄せの時蛹 -> grant HP700/AP300. Ordinary entry/transfer does not qualify. Entry suppression stops it; resolved growth survives later suppression/capture and clears on leave. Actual attack becomes usable after cocoon consumption.|
|SET7-35|ヤマトタマムシ|Printed cost2 GREEN HP300/AP300. Optional own hidden FOOD insects, at most one each RED/BLUE/GREEN/COLORLESS. No spells, faceup food or opposing food. Decline legal; owner receives private candidate identities; others receive masked food and no decision. Current candidates/colors rechecked before any reveal.|
|SET7-57|封印の怨念|Printed cost0 spell. Requires a legitimate opponent insect target even at0 damage. Counts own hidden food without reading those identities; x100 damage. No opposing/faceup food contribution. Existing targeting, suppression/resistance and server capability pipeline reused.|

Supporting printed scans on secondary host visually compared: https://mushijingi.com/images/card/390.jpg ,472.jpg ,494.jpg. Original full strings are checked by definition constructors; unrecognized additional skill/trait/effect clauses fail closed. No generated card text/images or USER_RULING.

Official QA6: https://mushijingi.jimdofree.com/q-a-よくある質問-1/第６弾のカードについて/ (黄金羽化 resolved grant survives trait loss; コロギス suppresses entry; 極楽羽化 destroys before damage even with no adult and has an explicit 空蝉 replacement exception).
Official QA7: https://mushijingi.jimdofree.com/q-a-よくある質問-1/第７弾のカードについて/ (きらめき includes COLORLESS; 地獄の番人 prevents compulsory discard deployment). Confirmed on2026-11-03. Rulings are not inferred from existing green tests.

## Shared mechanics
- ENHANCEMENT field-entry provenance is stamped before entry effects, recording actual enhancement instance/card/player. Golden growth validates exact origin attachment, current host and entry serial. No card-ID switch in Engine. Existing enhancement discard and field-stay modifiers do actual resolution.
- Optional at-most-one selection groups (compact four color groups, not exponentially enumerated combinations). Engine completion rejects duplicate groups atomically. Current entry constraints rebuild eligible options and color groups without mutating the state. CPU and B UI consume the same constraints. Partially selected stale combinations may exist in legacy selection state, but completion rejects them before mutation; decline/reselection remains available.
- Owner-only inspection applies solely to the authorized pending own-FOOD choice. Base projections stay masked even to the owner; no new general visibility permission. Opponent/spectator never receive the private decision/identities. Authentication/protocol/rooms logic unchanged.
- Damage metadata can count controller's hidden FOOD at resolution without inspecting card identity. Existing spell resolution used by CPU/online alike.
- Existing protected attack tail SHA stays ORIGINAL after reversing the same prior five reviewed edits plus exactly one new global selector-export line. No old speculative timing or paid-cost-source-loss path imported.

## Requested twelve-card dependency reassessment
|ID|State|Remaining shared dependency|
|---|---|---|
|6-17|Candidate PLAYABLE|Full tests and actual paths below; no known missing effect.|
|6-41|Unconnected|Pre-damage self-destruction -> resolve replacement/triggers -> exact adult from discard -> entry -> continue attack only if original attacker survives. Must preserve the official 空蝉 exception, no-adult mandatory destruction, discard deployment suppression, actual controller and serial snapshots. Does not reuse the old isolated additional-cost-source-loss handler.|
|6-12|Unconnected|After actual opponent territory acquisition, reveal up to2 own hidden RED food; actual draw receipt needed, no trigger when draw suppressed.|
|6-56|Unconnected|Mandatory printed-cost additional spell payment, revalidation and serial FOOD->FIELD entry -> spell itself hidden FOOD. Paid spell cost must not be misrepresented as paid summon.|
|6-60|Unconnected|Self spell FOOD movement +6 generated cost -> optional discard selection -> hidden FOOD with no same-turn generated cost. No-discard still legal.|
|7-1|Unconnected|After attack fully resolves, eligible visible wasp food->hidden FIELD -> scheduled reveal on next own turn. No hidden food identity eligibility and no early after-attack processing.|
|7-34|PARTIAL, explicitly not PLAYABLE|Continuous hidden-food HP/AP count and damage-preserving current-HP reconciliation on flips, movement, suppression, capture and lethal stat reduction. Engineering work, not an invented ruling. Retained failing audit below.|
|7-35|Candidate PLAYABLE|Shared optional color-group selection implemented.|
|7-51|Unconnected|Use-time optional food flipping and reduction before cost commit; preserve flips on counter; distinguish USE from forced ATTACH; no target/unpayable operation cannot flip food only.|
|7-57|Candidate PLAYABLE|Shared face-only count damage implemented.|
|7-58|Unconnected|Commit opponent target -> choose arbitrary own faceup food including0 -> flip -> damage from actual flipped count; stale target/food must not partially pay.|
|8-52|Unconnected|Optional own FOOD spell-target reaction with armor-name host condition, hidden flip as response, and distinction between targeted insect and targeted attachment.|

SET8-47 remains unchanged/unregistered: paid attachment entry vs in-field transfer and one-time linked leave cleanup, plus hidden enhancement suppression ruling. Refer to kanzashi-dependency-review.md. No speculative general enhancement rule.

## Evidence and deliberately incomplete audit
scripts/food-wave-evidence.js links each certified card to tests. tests/food-wave.test.js has14 passing Engine/CPU tests; server/test/food-wave-rooms.test.cjs covers three real two-player+spectator paths, duplicate actions, private choice and resume, plus PARTIAL rejection. server/browser/food-wave-paths.cjs exercises actual B UI choices/targets/reload and HP/AP/damage in Chromium/WebKit x CPU/online.

tests/pending-food-hp-audit.test.js retains the original strict failing expectation for7-34: expected maxHP1400 with2 hidden food, actual1200. This new unfinished-feature audit is explicitly separate from the safe runtime regression runner; it was not deleted, skipped or changed to pass. It is NOT one of the old four ruling hypotheses and NOT a regression in a previously PLAYABLE card. The card is PARTIAL and is rejected in online decks. Do not describe all repository test files as green.

Fresh regression results at initial gate: full1864/0 before the extra actual golden-attack test; shared73/0; server112/0. Latest full expected1865 after that additional test must be verified and recorded. New browser four tests/12 card paths passed before extra golden attack; final rerun and broad regressions still in progress. No physical iPhone test claimed.

All565 re-searched after additions:421 PLAYABLE,14 PARTIAL,130 unconnected,remaining144. SET5=37/13/14;SET6=26/0/38;SET7=26/1/37;SET8=23/0/41. STARTER throughSET4 remain309. Remaining overlapping dependency groups:paid-entry1,food/color8,entry5,attachment24,destruction/replacement41. Shared mechanics did not justify additional speculative promotions. Detailed full-card status in entry-selection-progress.json and card-readiness.md.

Next efficient delivery candidates:6-60 self-to-food spell/optional food grant;6-12 post-territory food reveal;7-58 selected-face payment/damage. Re-search all remaining cards after each shared handler. Continuous HP, pre-damage destruction/replacement and attachment lifecycle remain separate, larger work units.
