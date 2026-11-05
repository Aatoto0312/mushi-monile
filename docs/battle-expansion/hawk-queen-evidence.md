# SET7 priority implementation: Queen and Tarantula Hawk

2026-11-06 JST. Isolated branch cards/hawk-queen-20261106 / C:\Users\aatot\mushi-hawk-queen, base775f665 (469). No public/main/API/ngrok changes or push.

| Card | ID | Printed stats | Implemented behavior |
|---|---|---|---|
| オオスズメバチ（女王） | set7_001 | RED / cost6 / HP1700 / 神の産卵1000 | Optional visible own FOOD insect, printed cost<=5, family endingバチ科, selected after destruction/territory work completes. Deploy face down, reveal at original acting player's next turn start. |
| タランチュラホーク | set7_002 | RED / cost5 / HP1200 / かみきる600, ホークアイ900 | Eye requires a current visible insect keyword (lost/suppressed keywords do not count), no leader fallback. Blocks host destruction keywords before damage through turn end. Attachments remain independent. |

## Evidence
- Printed scans visually checked: https://mushijingi.com/images/card/438.jpg and https://mushijingi.com/images/card/439.jpg (secondary host of printed cards; not described as official hosting).
- Primary official QA: https://mushijingi.jimdofree.com/q-a-よくある質問-1/第７弾のカードについて/ , confirmed2026-11-06, rows101–107. Queen cannot choose facedown food; 巴紋 and territory resolve first. Eye cannot target a masked ミンミンゼミ, does not suppress 針金虫の道連れ, and ignores ※footnotes when matching destructive wording.
- Existing catalog texts/stats match scans; no invented text, image or card-name switch added to Engine.

## Shared mechanics
- SELECT_AFTER_ATTACK schedules existing FIELD_ENTRY_EFFECT/SELECT_ON_ENTRY and current-candidate validation after attack continuations. Reuses FOOD filters, optional selection, JSON and server decisions.
- MOVE selection opt-in revealNextOwnTurn stores revealOnPlayerTurn {playerId,afterTurn}. beginTurn reveals before draw without treating flip as another entry; field leave clears marker. Original acting player retained across control changes.
- TARGET_HAS_KEYWORD_SKILL filters current target legality. SUPPRESS_TARGET_DESTRUCTION_KEYWORDS adds a turn-scoped host flag before lethal damage; destruction trigger/text classifier distinguishes host keywords from attachments, ignores ※notes, supports canonical timing metadata where runtime text is normalized.
- Existing paid-attacker-loss path unchanged. Protected safe372 attack-tail checksum expectation retained; exact new4 hook inversions added (not a changed baseline hash). Reviewed source hash guard updated only battle-engine/zone-engine.

## Tests and status
- tests/hawk-queen.test.js13/13: exact registration/stats, summon costs, selection bounds, stale candidates, decline/empty, true Tomoe ordering, delayed reveal, controller/owner/field leave, JSON, native CPU choices, keyword loss/hidden/no leader, attachment retaliation/replacement, suppression expiry.
- server/test/hawk-queen.test.cjs3/3: actual capability attacks, canonical20, resume mid-selection, replay, viewer/spectator hidden DTOs, turn reveal. Initial NEW fixture reused per-client request IDs on resume and correctly hit OPERATION_REUSED; fixed fixture counter to globally unique IDs, no product workaround.
- server/browser/hawk-queen-paths.cjs Chromium/WebKit CPU+online4/4 x2cards=8flows. Actual card→attack→skill→legal target; Queen selection/reload/hidden field/reveal, Hawk illegal-target exclusion and kill without Tomoe.
- Toolbox saved20 includes both cards:16checks in each browser. Full2118/0; shared73/0; server206/0. Logs C:\Users\aatot\.codex\tmp\hawk-queen-*.
- Earlier full1 failure was source-integrity allowlist needing exact new hook inversions; original protected checksum unchanged, final full0fail. No protected ruling test deleted/skipped/reworded.
- Declared PLAYABLE471/565, remaining94; SET5/6/7/8=48/40/42/32. AUDITED remains pending. No new unresolved ruling identified for these2; pre-existing held5/source-loss ruling remains isolated.
- This is the independent469-based card branch; public465 sharing/exit releases remain on main, not silently mixed into card development. Physical iPhone and publication not performed.
