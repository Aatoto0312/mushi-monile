# Issue18: Dragonmantis follow-up — 2026-11-19

Base: published main8a3418e2e9042175112e673e3ffe2d71d809d270,513/565 PLAYABLE. Branch fix/dragonmantis-after-attack-20261119. No main/public API/ngrok changes authorized or performed.

## Evidence and diagnosis
- 瀬戸際の虫時雨: set1_116, SET1 116/130, SPELL, cost4, TESTED/isPlayable. Select up to two same-color insects from own FOOD, deploy and destroy at end turn.
- 蜉蝣の閃き: set1_123, SET1 123/130, SPELL, cost1, TESTED/isPlayable. Select one own FOOD insect, deploy and destroy at end turn.
- Both printed scans visually checked: https://mushijingi.com/images/card/116.jpg and https://mushijingi.com/images/card/123.jpg (reproduced card images; these are not a new ruling authority). Current SET1 definitions are in the registry, not the later-expansion full-catalog array.
- Official QA6: https://mushijingi.jimdofree.com/q-a-よくある質問-1/第６弾のカードについて/ : Dragonmantis free use has no normal card cost; source must remain in play; only spells selecting the attacking Dragonmantis qualify; multi-target spells must include it. Global/nonselecting spells and enhancement-targeting spells do not qualify.
- Thus neither reported FOOD-target spell can select this FIELD insect. set1_116 is rejected by complex-selection required-host membership; set1_123 is rejected by the FOOD-target candidates filter. The suggested untargeted `!requiredTargetId` branch is not the root cause for these two cards, and is unchanged.
- Actual CPU old/new UI clicks reproduced attack completion with no pending choice and no explanation. This is missing feedback, not evidence to expand legal spell targets. Regression RED captures the missing explanation in both CPU UIs.

## Minimal fix
No Engine/card/AI/legality changes. Shared engine-view.getPostAttackNotice derives an owner-only explanation from the committed ATTACK_COMPLETED event and existing getFreeCardUseOptions. Does not reveal hand IDs/names to opponents/spectators or public log. New UI shows `追加使用なし（詳細）`, tap/keyboard opens explanation; old CPU and online UIs display the reason in existing status areas. Notice is recomputed, not latched: pending choices, different action, changed control, source leaving, game end or turn change do not retain an obsolete reason. JSON restoration/reconnect retains current valid explanation.

Normal legal self-target spell/enhancement choices, free card cost, target selection and cancellation remain in the existing Engine. Both reported spells are tested through their normal paid FOOD selection and still work.

## Verification
Focused8/8; full2202/0, shared80/0; server234/0; Linux Chromium/WebKit receipt will be recorded in PR after completion. Local Chromium new/old CPU and new/old online passed4/4. Browser fixtures use the real3 card definitions, eligible FOOD cards, no playable follow-up, actual skill and target clicks at375x667. Existing requested-batch/free-use/cancel suites remain enabled. Final CI also rechecks real Jekyll98 public assets/SHA/contracts and broad CPU/online/spectator/reconnect regressions. Physical iPhone untested.

513 count unchanged. Corrupt/unfinished cards and original held soil test remain isolated; no attempt to certify soil. Source pin updates only the reviewed engine-view change; protected Engine hashes/delta and behavior assertions retained. Asset cache key dragon-notice-513-v1 and manifest regenerated. Engine/cards/protocol contracts remain byte-equivalent. A later release should include the updated server engine-view module for online explanations even though rule contracts are unchanged; this task does not update the live API or publish Pages.
