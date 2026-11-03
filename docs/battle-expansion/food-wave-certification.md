# Food / enhancement-origin emergence — development421

Started2026-11-03, verification continues2026-11-04. Base safe418 checkpoint1fc3e19cbea84d12cd8553692c5a32a566beba31. Worktree C:/Users/aatot/mushi-food-wave, branch crossset-food-wave-20261103. Public366/main/API/ngrok/auth and original stage are protected. PLAYABLE basic support is distinct from final independent AUDITED.

## Individually verified PLAYABLE cards
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
|6-17|PLAYABLE|Full tests and actual paths below; no known missing effect.|
|6-41|Unconnected|Pre-damage self-destruction -> resolve replacement/triggers -> exact adult from discard -> entry -> continue attack only if original attacker survives. Must preserve the official 空蝉 exception, no-adult mandatory destruction, discard deployment suppression, actual controller and serial snapshots. Does not reuse the old isolated additional-cost-source-loss handler.|
|6-12|Unconnected|After actual opponent territory acquisition, reveal up to2 own hidden RED food; actual draw receipt needed, no trigger when draw suppressed.|
|6-56|Unconnected|Mandatory printed-cost additional spell payment, revalidation and serial FOOD->FIELD entry -> spell itself hidden FOOD. Paid spell cost must not be misrepresented as paid summon.|
|6-60|Unconnected|Self spell FOOD movement +6 generated cost -> optional discard selection -> hidden FOOD with no same-turn generated cost. No-discard still legal.|
|7-1|Unconnected|After attack fully resolves, eligible visible wasp food->hidden FIELD -> scheduled reveal on next own turn. No hidden food identity eligibility and no early after-attack processing.|
|7-34|PARTIAL, explicitly not PLAYABLE|Continuous hidden-food HP/AP count and damage-preserving current-HP reconciliation on flips, movement, suppression, capture and lethal stat reduction. Engineering work, not an invented ruling. Retained failing audit below.|
|7-35|PLAYABLE|Shared optional color-group selection implemented.|
|7-51|Unconnected|Use-time optional food flipping and reduction before cost commit; preserve flips on counter; distinguish USE from forced ATTACH; no target/unpayable operation cannot flip food only.|
|7-57|PLAYABLE|Shared face-only count damage implemented.|
|7-58|Unconnected|Commit opponent target -> choose arbitrary own faceup food including0 -> flip -> damage from actual flipped count; stale target/food must not partially pay.|
|8-52|Unconnected|Optional own FOOD spell-target reaction with armor-name host condition, hidden flip as response, and distinction between targeted insect and targeted attachment.|

SET8-47 remains unchanged/unregistered: paid attachment entry vs in-field transfer and one-time linked leave cleanup, plus hidden enhancement suppression ruling. Refer to kanzashi-dependency-review.md. No speculative general enhancement rule.

## Evidence and deliberately incomplete audit
scripts/food-wave-evidence.js links each certified card to tests. tests/food-wave.test.js has14 passing Engine/CPU tests; server/test/food-wave-rooms.test.cjs covers three real two-player+spectator paths, duplicate actions, private choice and resume, plus PARTIAL rejection. server/browser/food-wave-paths.cjs exercises actual B UI choices/targets/reload and HP/AP/damage in Chromium/WebKit x CPU/online.

tests/pending-food-hp-audit.test.js retains the original strict failing expectation for7-34: expected maxHP1400 with2 hidden food, actual1200. This new unfinished-feature audit is explicitly separate from the safe runtime regression runner; it was not deleted, skipped or changed to pass. It is NOT one of the old four ruling hypotheses and NOT a regression in a previously PLAYABLE card. The card is PARTIAL and is rejected in online decks. Do not describe all repository test files as green.

Final fresh regression: full1865/0 (safe418 baseline1851 +14 new direct tests); shared73/0; server112/0 (108 +4 new). New actual-card browser tests4/4,12 card paths, including golden attack and private color-group selection, all passed in Chromium/WebKit x CPU/online. Existing entry regressions16/16,84 actual paths. Broad UI12/12 including17 viewport sizes, two CPU matches per browser, real online match per browser with spectator/reconnect, Pages configuration and selection ownership. Toolbox16 checks per browser passed with the new cards at the front of the mixed20-card saved-deck pool. Physical iPhone remains untested.

All565 re-searched after additions:421 PLAYABLE,14 PARTIAL,130 unconnected,remaining144. SET5=37/13/14;SET6=26/0/38;SET7=26/1/37;SET8=23/0/41. STARTER throughSET4 remain309. Remaining overlapping dependency groups:paid-entry1,food/color8,entry5,attachment24,destruction/replacement41. Shared mechanics did not justify additional speculative promotions. Detailed full-card status in entry-selection-progress.json and card-readiness.md.

Next efficient delivery candidates:6-60 self-to-food spell/optional food grant;6-12 post-territory food reveal;7-58 selected-face payment/damage. Re-search all remaining cards after each shared handler. Continuous HP, pre-damage destruction/replacement and attachment lifecycle remain separate, larger work units.

## Final checkpoint evidence
Functional commit2627192; fixture whitespace normalization9fa6a1480009e45bf08964847abdc7b58db2d324; exact candidate manifestb36cdb2a4e2d9bcd72748289bd76eb0707cd4790. Only validation branch crossset-food-wave-20261103 pushed. GitHub Pages remains legacy main:/ and the validation workflow has contents:read with no deployment step.

Linux Jekyll run:https://github.com/Aatoto0312/mushi-monile/actions/runs/41661176542 succeeded. Downloaded artifact into C:/Users/aatot/.codex/tmp/food-wave-421-linux; independently verified exact86 browser files, every SHA256 and Engine/cards/frontend contract. Manifest87th entry is the build config. Exact-list equality excludes server/tests/docs/development HTML. Candidate entries match committed Git blobs, not Windows checkout newline assumptions. Receipt:C:/Users/aatot/.codex/tmp/food-wave-linux-result.json. Engine b42eb8e0a2095ffc471399b0e07ef83126aaa5605eb60a27f100c0964591f1f4;cards4f63ce7cd84b6acc7d2e5432b2d4e5813d5e5b437534408d8bc375c217c6f204.

Logs outside Git:food-wave-full-gate.log,food-wave-shared.log,food-wave-server-gate.log,food-wave-browser-gate.log,food-wave-wide.log,food-wave-entry-regression.log,food-wave-toolbox-verified.log. They are under C:/Users/aatot/.codex/tmp. Separate intentionally red food-wave-hp-pending.log reports0/1 for incomplete7-34. No all-tests-green claim includes that audit.

An initial full test detected the new exported selector in the frozen attack tail; the guard now reverses exactly that one export as well as the prior five reviewed edits, and still asserts its original SHA. Initial browser harness incorrectly assumed the cocoon uses a board target and a single-target spell always opens selection. Corrected tests follow the actual cocoon hand-selection UI and provide two legitimate spell targets to test selection/reconnect; no Engine behavior was changed to match the harness. One deck coverage test exceeded20 after22 certified entry cards existed; it now covers every card across two legal20-card decks, asserts exact union coverage and PARTIAL rejection for each. No original assertion was weakened to accept oversized decks.

Independent read-only review found no concrete blocker in the three certified mappings, separately ran13 direct tests and4 room tests, checked hidden identities and live validation. Subsequent14th direct test and golden browser attack passed in the final run. This is not final565-card independent AUDITED certification. Syntax27 changed JS/CJS files and final git diff --check passed after whitespace normalization.

Local/remote main remain988e4f765c3faea90551de673946e9f8945d899e. Original staged binary patch Git hash45016f7bd80bb86e6f6ef50b3dcef5ac6d4e28f8 unchanged. Frozen418/414/412/407/397/388/372 trees clean. No API/ngrok/auth/Windows configuration change and no restart, no main merge/push/public deployment. Matching421 frontend/API contract is prepared for a later approved maintenance; not silently deployed over public366.

## Incremental economy batch — 2026-11-04 /426
From protected c12368f421; isolated mushi-economy /crossset-economy-20261104. Five new PLAYABLE:SET6-02オソレハリアリ,6-12アカカミアリ,6-60神木の息吹,SET7-13オオヒラタシデムシ（幼虫）,7-58供物の封印. Printed scans375/385/433/450/495 at mushijingi.com/images/card visually checked; official QA6/7 URLs above reconfirmed (hand threshold after draw, newly destroyed discard candidate, no-discard Breath, optional0 offering). Full text guards:expansion-economy-cards.js.
Shared small additions:typed post-territory discard selection, owner-private hidden-red food reveal, self-to-food cost grant with optional serialized discard-food continuation, selected-food damage retaining spell in RESOLVING until completion. Mandatory multi-hand discard now validates all cards before moving any; new failing regression reproduced partial mutation before fix. Protected attack tail unchanged from421. No AI/UI/protocol redesign.
Tests:tests/economy-batch.test.js13/13,server/test/economy-batch.test.cjs6/6; final full1878/0,shared73/0,server118/0. Scoped Chromium/WebKit x CPU/online4/4 =20 actual card paths; private owner choices, reload/resume and results checked. Last atomic-discard validation change was checked by fresh Node regressions; identical successful browser routes were not rerun solely for that prevalidation. Toolbox16 checks each browser with all5 new IDs in mixed20 saved-deck pool. Physical iPhone not tested. Success logs summarized, initial failures fixed; no deleted/skipped tests.
Final logs:C:/Users/aatot/.codex/tmp/economy-full-gate.log,economy-shared.log,economy-server-gate.log,economy-browser-gate.log,economy-toolbox.log. Source/engine syntax and diff checked. Status426/565; remaining139=14PARTIAL+125unconnected. SET5=37/13/14;SET6=29/0/35;SET7=28/1/35;SET8=23/0/41. Inventory updated by these5 IDs only; no whole-catalog reclassification. Queue:implementation-queue.md.
Pages build/deployment NOT run in this local-only batch. release-manifest.json remains historical verified421 evidence, not a426 release manifest. Local426 online/contract.json regenerated; scoped candidate tests build a matching local frontend/API. No push/main/publicAPI/ngrok/auth/Windows change. Protected421 clean; main988e4f765c3faea90551de673946e9f8945d899e and original staged binary Git hash45016f7bd80bb86e6f6ef50b3dcef5ac6d4e28f8 unchanged. Old4 ruling hypotheses, old cost-source-loss stop,7-34/6-41/8-47 stay isolated.
