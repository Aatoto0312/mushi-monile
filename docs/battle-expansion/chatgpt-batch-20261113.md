# ChatGPT batch handoff — 2026-11-13

Base: PR #16 checkpoint `adcb587` (505/565 PLAYABLE). This branch is **not** a release branch. No cards are certified by this document. Main/public API/ngrok untouched.

## Objective
Prepare a **single integration and regression pass** rather than repeating full tests per card. Work in focused mechanic groups, add focused tests as each mechanic lands, run full/shared/server/browser once after the batch stabilizes. Do not claim 15 PLAYABLE merely because 15 cards are listed.

## Candidate group A: attachment host eligibility, stat lifecycle and recovery
- `set5_048` 蛮虫の一本槍: attach only to insect whose skills have no effects; HP/AP +400; optional return attachment to hand when host is destroyed by insect attack.
- `set5_049` 蟲神の一本槍: same lifecycle; HP/AP +800.
- `set5_055` 幼虫の胡坐鍋: host name includes （幼虫）; HP/AP +400; same optional return.
- `set5_052` 蜜絶の翠鏡: green host only; dynamic +400 HP/AP with own food <=5; +800 with >=6. Recompute on food changes, controller changes, serialization, and attachment leave.
- `set5_050` 草薙の紅剣: red host only; one additional attack and opponent draws no territory from that insect's attacks. Clarify and test interaction with existing extra-attack flags and victory.
- `set5_051` 肉祓いの蒼玉: blue host only; first damage event per turn becomes 0 (including spell damage); effects of attacks still execute. Reset once each turn.
- `set6_055` 命燃の鬼火: +700 HP/AP; immunity to opponent spell damage/destruction; destroy host at end of next opponent turn (with leave/return interactions).

## Candidate group B: continuous field constraints
- `set7_046` エンマコオロギ: while face-up on field, neither player may deploy insects from discard. Must apply to all entry paths (spell, skill, enhancement, optional effects) before committing costs or zone moves; suppression/leave/controller/JSON/CPU/online.
- `set6_014` セミヤドリガ（幼虫）: with own cicada-family insect, +100 HP/AP and opponent must choose an eligible guardian to attack; handle multiple guardians and attacks not targeting insects.
- `set6_019` エラフスホソアカクワガタ: attack requires attachment; if opponent draws territory due to that attack, opponent draws one additional territory. Distinguish normal draw from interception/cancel.
- `set6_057` 砂鉄の砂嵐: next opponent turn, each insect attack requires 1 cost; check insufficient food, cancellations, multiple attacks and expiry.

## Candidate group C: simultaneous damage and turn-end sequencing
- `set8_008` ミイデラゴミムシ: optional on-entry 200 damage to each opposing insect; no color weakness; destroyed insects cause no territory draws.
- `set8_057` 水月の激流: deal 300 damage to all insects on both sides and end current turn.
- `set8_058` 神楽の烈風: same, 1200 damage.
- `set5_061` 蠱毒の祟り: target opponent insect with unhealable damage; deal that exact amount to all insects on both sides and end turn.

## Implementation requirements
1. Recheck exact printed scans and existing mappings before editing; catalog transcriptions are hints, not sufficient evidence for certification. Resolve timing/ruling ambiguity rather than guessing.
2. Prefer shared opt-in effects; avoid card-ID switches in Engine. Register exact-text-guarded mappings only when complete.
3. Write focused RED→GREEN tests for damage order, simultaneous death, no-territory effects, next-turn expiry, optional/cancelled choices, legal targets, JSON/resume, CPU and online authority.
4. Preserve PR #16's already green 2145 full / 80 shared / 214 server and browser 18/18 as **baseline**, not as claims for this branch.
5. After batch: run full/shared/server, Chromium+WebKit CPU/online/old+new UI, contract+Jekyll/SHA gates, report exact PASS/FAIL and completed card IDs. If a mechanic remains uncertain, leave those cards NOT_REGISTERED/PARTIAL.
6. Never merge/publish or touch public API/ngrok without explicit user permission.

## Division of labor
ChatGPT prepares effect specifications and proposed code changes. Codex integrates, runs actual environment tests, fixes defects and creates draft PR. This file is the initial handoff and **does not yet contain implemented product code**.

## Requested nine-card integration — 2026-11-16

Base5acc064 preserves ChatGPT changes; initial load reproduced duplicate set5_057 registration and invalid test runner r.run(). Repaired in7d5b710, keeping one canonical PARTIAL definition.

Plan: (1) isolated deck reveal/free-use continuations for6-63/64; (2) borrowed skills, attached sacrifice and next-damage marker for7-04/8-03/6-01/8-13; (3) revival/suppression/territory attachment and discard-attachment reattack for5-54/7-64; (4) integrate once, current-candidate/cancel/CPU/WSS/JSON tests, full/shared/server and Chromium/WebKit old/new UI, exact Pages output. No main/public operations.

Root regression: host color constraint must use current getEffectiveColor, not printed color; larva/hidden/unrestricted cases tested. Add safe uncommitted-card cancellation through owner-only Engine capabilities and both UI renderers; paid mandatory effects cannot be undone. The helper prototype remains unwired and is not certification evidence.

Soil5-57: requested real-card test still fails because canonical card is PARTIAL. Current official SET5 QA has no match resolving source-owner ambiguity; test-only copy exercises provisional own-discard movement, exact2, hidden/opponent rejection, payment, cancellation, JSON, duplicate prevention without promoting the actual card. Keep original real-card assertion intact until a source confirms the scope.

## Requested nine-card verification checkpoint — 2026-11-17

Candidate: 513/565 PLAYABLE (+8 against inherited505); PARTIAL3, not registered49. SET5/6/7/8=49/53/57/45. Existing public main remains359fb61 (501); no release, API or tunnel operations.

Completed: set6_064蠱毒の輪廻 (public reveal, mandatory insect entry, legal free-use/food/hand); set7_004トビズムカデUR (ordinary900 and next-damage destruction); set8_003トゲアクマツユムシ (attached-insect alternative sacrifice); set6_001オオカレエダカマキリ (optional after-attack free use on source); set6_063贄虫の転生 (own-owned insect to bottom and reveal-until-insect); set5_054黒銀蜘蛛の糸 (discard revival with entry-time suppression and territory option); set7_064拝虫の豪斬剣 (legal discard attachment, reattack, end-turn destruction); set8_013アリヅカコオロギ (borrow ordinary printed skills from eligible visible own ants).

Held: set5_057腐葉の沃土 remains PARTIAL. Printed text does not explicitly settle whose discard can be selected. Official SET5 Q&A reviewed without finding a card-specific answer. Original Engine test is retained unchanged in expectation and fails1 with "このカードはまだ使用可能になっていません". Prototype helper tests do not establish product support. No speculative certification.

Shared changes: serialized free-use continuations and owner-only precommit cancellation; current effective-color attachment eligibility; public reveal-only log; shared entry/leave/expiry attachment hooks; borrowed-skill UI lookup; CPU/current-candidate revalidation. No card-ID switch added to Engine. Unwired proposed helper excluded from Pages assets.

Local verification: full2202/0, shared80/0, server226/0. Requested card units deck20 + insects14 + enhancements11; integration/free-use2, host3, mapping3 included in full. Chromium actual clicks passed3 groups (newCPU, legacyCPU, online), each8 cards=24 flows; server requested tests8/8 include observer privacy, pending disconnect/resume, duplicate rejection and authoritative effects. Soil provisional mechanics4/4 are not certification. Standalone proposed helper passes, but remains unwired. Original soil test separately1 failure. iPhone physical device untested. Final Linux WebKit/Chromium/Pages CI result pending at this checkpoint.

Candidate builder emitted99 manifest entries (98 public assets plus_config.yml), new contract regenerated from trusted branch sources. Historical protected Engine golden retained through an exact reversible reviewed delta; no behavioral test removed/skipped. New cache key requested-batch-513-v1. Actual Pages artifact validation is CI-gated, not inferred from configuration.

Official Q&A: https://mushijingi.jimdofree.com/q-a-よくある質問-1/第６弾のカードについて/ and https://mushijingi.jimdofree.com/q-a-よくある質問-1/第７弾のカードについて/ . Printed catalog/scans and individual tests supply the remaining evidence. Main merge/publication requires user approval and paired API/client contract rollout.
