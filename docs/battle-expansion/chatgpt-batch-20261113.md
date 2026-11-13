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
