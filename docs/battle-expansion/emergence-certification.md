# Emergence family development418 — 2026-11-03

Base414 checkpoint40be3855d88aab7bc752e6c58a0cce05d910cd7e. Dedicated worktree C:/Users/aatot/mushi-emergence, branch crossset-emergence-20261103. Public366/main/API/ngrok and frozen candidates remain separate. PLAYABLE is supported basic operation, not final independent AUDITED.

## Individually evidenced four cards
|ID|Card|Mechanic|
|---|---|---|
|SET8-19|アカボシゴマダラ|Mandatory400HP/AP granted on entry from a named 羽化 spell or technique; ordinary summon does not qualify.|
|SET8-21|ミカドアゲハ|Same named-effect growth with its own printed500HP/400AP.|
|SET8-36|アカボシゴマダラ（幼虫）|Opponent-caused destruction -> optional exact adult from the dying controller's hand -> free entry -> full adult entry effect.|
|SET8-38|ミカドアゲハ（幼虫）|Same shared destruction/form selection with its own printed stats and exact adult identity.|

All four printed scans520/522/537/539 visually compared. Secondary-host images are correctly identified as supporting printed scans, not official hosting. Official QA8 confirms resolved400 growth survives later trait loss. Official processing PDF from the QA page supplies turn-player priority, target revalidation, hidden-field and card/effect resolution rules. Sources: https://mushijingi.jimdofree.com/q-a-よくある質問-1/ and https://drive.google.com/file/d/1jPaT_zAKiF5J6hG9fiaSaJbfWco3934t/view . No USER_RULING introduced.

## Shared Engine additions
Destruction snapshot records an immutable actor controller; ordinary attacks stamp their declaration controller, and destroyed-source retaliation/damage preserve their activation snapshot controller. This fixes captured-source ownership being mistaken for acting controller after the source returned to its owner's discard. New form deployment uses the dying controller (not physical owner), exact printed adult name and existing optional selection/entry continuation. It never transfers parent damage/modifiers/attachments/used state to the adult.

Field-entry provenance distinguishes SPELL card name from TRAIT/SKILL name; the larva's actual 転生羽化 receipt drives adult growth. Current source location is not consulted to recover a lost technique name. Granted growth is field-stay scoped, idempotent per genuine entry serial, survives later suppression/capture and clears on leave. Own destruction, non-destructive movement, replacement and hidden/suppressed larval sources do not activate.

An existing cross-set issue was reproduced: 大団扇 moved the dead larva to the deck and blanket-suppressed every victim death effect. Official general rules cancel effects when the specified TARGET disappears; this larval effect targets the adult in hand, while the larva is its source/name reference. Removing the blanket suppression preserves this independent target; effects moving the destroyed insect itself still validate its live expected zone. This is an explicitly documented inference from the official general rule, not a specific 大団扇+転生羽化 Q&A. Independent review read that general rule and agreed with the distinction. Legacy saved-context guard remains readable; no old speculative timing rule was imported.

## Protection of the existing resolver
No paid attack-cost-source-loss code or four unresolved conditional-timing hypotheses were imported/changed. The former whole-tail freeze test still compares to its ORIGINAL safe372 SHA256 after reversing exactly five individually checked, reviewed edits: attack actor field, snapshot stamping call, snapshot damage actor, snapshot retaliation actor, and removal of blanket victim-trigger suppression. Every substitution must occur exactly once; all other tail bytes must match the old hash. New effect handlers live before performAttack. No CPU AI, protocol, authentication, zone or deck-format implementation changed.

## Executable evidence
scripts/emergence-evidence.js maps each card to source and tests.
- tests/emergence-family.test.js:20 tests, actual opponent attack/spell and own destruction distinction, both emergence exchange spells, optional decline, exact-name/no-target/duplicate/stale rejection, JSON, captured parent/controller/retaliation, no inherited state, replacement, hidden source, suppression, granted effect persistence, CPU defender choice and both larval attacks. All printed fields/components explicitly checked.
- server/test/emergence-rooms.test.cjs:four two-player+spectator authoritative scenarios, operation retry idempotence, decision privacy, reconnect during pending, resulting HP/AP and mixed20 deck validation accepting all4/rejecting PARTIAL.
- server/browser/emergence-paths.cjs:Chromium/WebKit xCPU/online x4=16 actual card paths. Adults use real daytime/nighttime exchanges; larvae receive real opponent attack, defend with owned selection, reload/resume and synchronize grown adult. Printed attack damage and detail rendering checked.
- All previous17 entry cards are rerun with the new family:combined16 browser tests/84 card paths. Physical iPhone not operated.

Fresh full1851/0 (baseline1831+20),shared73/0,server108/0. No test removed/skipped/weakened. A deck test initially added starter filler after entry-card count reached exactly20; corrected filler termination without changing deck expectations. An initial Toolbox test-script concat typo was fixed before its final run. These were harness errors, not product rule changes.

## Cross-set search and remaining work
All565 refreshed:418 PLAYABLE,13 PARTIAL,134 unconnected,remaining147. SET5=37/13/14;SET6=25/0/39;SET7=24/0/40;SET8=23/0/41. Starter throughSET4 remain309. Overlapping pending groups:paid entry1,food/color10,entry7,attachments24,destruction/replacement42.
The same emergence scan found SET6-17 黄金羽化 (attachment-origin growth plus enhancement destruction) and SET6-41 極楽羽化 (pre-damage self destruction plus discard deployment); neither is falsely certified from the new hand-deployment handler. SET8-47 separate lifecycle review:kanzashi-dependency-review.md, including its hidden-enhancement ruling question. No speculative global enhancement rule introduced.

Public API/ngrok/authentication/main and original staged changes were not altered. No automatic restart or observer installation. Development418 requires a matching API/frontend pair; no main deployment claimed.

## Browser transport diagnosis
Initial broad runs recorded load/screenshot timeouts (9/12 then10/12); local HTML and fonts were ready while six actual external JPEG requests remained pending. Test-only server/tools/browser-actual-art.cjs fetches the same allowlisted real JPEG bytes through Node, validates format and SHA256 receipts, and single-flights duplicate requests. No generated/fallback card art, runtime image URL change, assertion removal or timeout increase. Its two unit tests verify exact byte preservation and fail-closed HTTP/non-image handling. Broad validation remains separately reported until a complete run succeeds.

Final responsive rerun:4/4 (Chromium/WebKit x CPU/online),17 viewport sizes x2 hand states per mode. SE3 normal HUD32px; status-to-toggle8px gap, action rail611px in667px viewport. New-card paths16/16 and combined entry84 paths passed. Broader CPU completion/Toolbox/online regression is logged independently. Earlier interrupted broad-art run is not counted as a pass.
