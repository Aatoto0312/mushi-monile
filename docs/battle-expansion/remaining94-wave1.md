# Remaining 94 cards: wave 1 (isolated research and test-first checkpoint)

Baseline: ae5d604 (471/565). This branch must not be merged or deployed until tests, rulings and paired API contracts are verified. The public main and API are untouched.

## Inventory and preliminary difficulty

Source: docs/battle-expansion/card-readiness.md cross-referenced with js/cards/full-catalog-data.js. Exactly 94 cards marked non-PLAYABLE in sets 5–8; all 94 have catalog definitions.

- 36 preliminary low/medium candidates: no obvious multi-target selection or exceptional lifecycle in a simple text heuristic. **Not** yet certified easy; some (e.g. damage prevention) need engine work.
- 30 multi-step candidates: explicit selections, attack-after-effects or destruction sequences.
- 28 higher-risk candidates: enhancement lifecycle, cost/use counters, replacement, territory or rulings interactions.

These buckets are *triage only*, based on Japanese effect-text patterns, not a semantic correctness proof. Recheck each individual card before implementation. No card should be marked PLAYABLE on the strength of this heuristic.

## First proposed card: SET7-44 ツマグロヒョウモン（幼虫）

Catalog: GREEN / cost 3 / HP 300; かじる 400; つよがる 600: 「この技は1度だけ使用できる。次の相手のターン、この虫の体力を500増やす。」

Existing battle-engine enforces ONCE_PER_FIELD_STAY usageLimit; stat-modifier engine supports startTurn/endTurn windows. However the current generic APPLY_STAT_MODIFIER path found in battle-engine is for spell targets, not necessarily attack skill effects. Do not wire the card by copying the spell effect into a skill without checking the attack-resolution path.

Before marking PLAYABLE:
1. Verify printed image/official QA and exact text (prior queue says image 481 was downloaded but not visually verified).
2. Add a failing focused unit test: 600 attack, no HP buff on own turn, +500 HP only next opponent turn, expiry after that turn, once per field stay, reset on leaving/reentering field, JSON restore.
3. Implement generic attack-triggered self-stat modifier in the correct continuation timing, avoiding card-ID-specific engine branches and unintended early effects on attack cancellation.
4. Test CPU, server/reconnect/observer hidden data, and both browser engines; run full/shared/server suites and readiness audit. Keep protected paid-attacker-loss ruling untouched.
5. Update readiness and contract only after green verification. Do not deploy or change main without explicit release approval.

## Other investigation targets

- SET7-59 蟲装の演舞: enhancement counter must run before attachment and preserve payment; higher-risk.
- SET7-64: forced discard/extra-attack and expiry; higher-risk.
- SET7-11/12: next-turn shields require zero-damage consumption timing ruling.

Status: research checkpoint only; **0 additional cards implemented, 0 tests executed** in this commit. Next step is an isolated test-first implementation of SET7-44.
