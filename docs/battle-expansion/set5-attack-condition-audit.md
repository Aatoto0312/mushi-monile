# SET5 attack conditions and spell immunity followup

## Individual basic PLAYABLE evidence (not final AUDITED)

| Card | Printed scan | Engine / CPU | Human |
| --- | --- | --- | --- |
| 1 ジャイアントテキサスキリギリス | fan-hosted card310.jpg, visually checked 2026-10-28: RED6 HP1700, AP1000/1500 | Both skills, source-only enhancement requirement, defender-only rejection, suppression does not remove attack text, exact payment, CPU first/second technique | Actual summon; first technique; ordinary enhancement use then Devil Eye |
| 2 レッドクロウエンペラースコーピオン | fan-hosted card311.jpg: RED5 HP1300, X=visible red food×300 | 0/1/4 food, current controller rather than owner, effective food color, hidden food ignored, JSON restore, CPU summon/attack | Actual summon, food-count damage |
| 15 レギウスオオツノハナムグリ | fan-hosted card324.jpg: BLUE6 HP2000, AP1400, 王様 | Entry-turn restriction, suppression and restoration, later turn, JSON, exact summon payment, CPU legally declines entry-turn attack | Actual summon, blocked entry-turn attack, suppression permits attack |

Official SET5 QA consulted: https://mushijingi.jimdofree.com/q-a-よくある質問-1/第５弾のカードについて/
It expressly distinguishes Devil Eye's attachment condition from the attachment that grants its skill, and continuous King restriction from enter-field trigger suppression. No USER_RULING was used.

Tests: `tests/set5-attack-condition-completion.test.js`12/12, plus prior attack-legality, count-mechanics, King and CPU-legality regressions. `tests/set5-attack-condition-human.cjs`19 checks each Chromium/WebKit, portrait/landscape. All three cards are individually linked in `scripts/set5-battle-evidence.js`. Whole-project final AUDITED status remains pending.

## Discovered bug: card28 spell targeting

Printed card337.jpg says it cannot be the target of a spell, without restricting the caster. Prior mapping incorrectly used the opponent-only immunity also used by SET2-45. A failing regression proved own-targeted buffs and CPU actions bypassed it.

New generic `SPELL_TARGET_IMMUNITY` is distinct from `OPPONENT_SPELL_TARGET_IMMUNITY`. Shared field-target legality filters ordinary and complex spell selections. It is zone-scoped: hand/discard cards and independently selected attachments do not inherit a host's field targeting immunity. Suppression permits targeting again. No card-name branch was added.

Independent review caught an additional regression in the first wrapper: when filtering the last matching-cost pair, remaining orphan hand cards were treated as unrestricted targets. A new failed-first test reproduced impossible pending and pre-spell Immature destruction. Candidate pruning now keeps only surviving legal combinations. Reviewer reran the original reproduction and confirmed unchanged-state rejection; surviving legal exchange passes JSON restoration.

`tests/set5-all-spell-immunity.test.js`8/8; `tests/set5-all-spell-immunity-human.cjs`7 checks each engine. The Human harness initially assumed the existing UI disables illegal spell buttons; code inspection showed it rejects on use with an alert. The harness now exercises that real path and asserts no pending, no spent cost and retained spell, rather than inventing a button contract. Card28 remains PARTIAL pending the rest of its card/cross-path audit.

## Scope / release limits

SET5 PLAYABLE28 /PARTIAL21 /unconnected15; total337/565 available locally. SET6–8 untouched. Toolbox two complementary20-card decks cover all28 certified SET5 IDs in Chromium/WebKit. No physical iPhone Safari verification, exhaustive responsive rerun, SET5 Complete, main merge, push or Pages publication is implied.

Latest gate: full1516/0, shared73/0, syntax/diff clean. Toolbox handoff13 checks for each of offsets0/8 in each engine. Initial parallel Chromium run timed out awaiting catalog; sequential rerun passed both decks without product change. This transient is recorded, not treated as proof of a diagnosed browser defect.
