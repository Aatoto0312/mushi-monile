# SET4 Battle completion audit

Source baseline: the 64-card catalog and official SET4 Q&A recorded by the local knowledge base. This file records implementation evidence only; it does not replace those sources.

## Status

- Definitions wired: 64/64
- PLAYABLE: 36
- PARTIAL: 28
- BLOCKED: 0
- Release state: alpha integration; full SET4 completion is not claimed

The alpha boundary is machine checked by `scripts/audit-set4-battle.js`. Per-card evidence is in `scripts/set4-battle-evidence.js`. Cards 2, 7, 13, 18, 20, 21, 24, 25, 27, 28, 33, 36, 37, 39, 40, 44, 45, 52-56, 58-60, and 62-64 remain PARTIAL and cannot enter a Battle-ready deck.

## Mechanic matrix

| Cards | Mechanic | State | Evidence |
|---|---|---|---|
| 1, 3, 10 | discard trait cost reduction (`生きた化石`) | implemented | `set4-cost-modifiers.test.js` |
| 11, 12 | opposing visible blue food cost reduction | implemented | `set4-cost-modifiers.test.js` |
| 5 | suppress later on-entry traits | implemented | `set4-entry-mechanics.test.js` |
| 14 | three-color discard continuous AP/HP | implemented | `set4-cost-modifiers.test.js` |
| 15 | global printed multi-skill insect tax | implemented | `set4-cost-modifiers.test.js` |
| 16 | entry food destruction or self destruction | implemented | `set4-entry-mechanics.test.js` |
| 2, 13, 18, 20, 21, 24, 25, 27, 28, 33, 36, 37, 39, 40, 44, 45 | existing mechanic mapping | connected; card evidence pending | focused tests still required |
| 4, 9, 19, 31 | `かばう` territory entry, lure, delayed return | implemented | `set4-kabau.test.js` |
| 6, 8, 13 | `軍隊連携`, shared skills, delayed lure | 6 and 8 alpha-audited; 13 pending | `set4-army-link.test.js` |
| 7, 17, 26, 28, 30, 35, 39, 40, 42, 43, 45 | attack/trait special rules | audit and implementation pending | pending |
| 26, 51 | opponent spell-target lure | implemented | `set4-targeting.test.js` |
| 8, 17, 28 | attack color change, next-turn spell tax, once-per-stay | implemented | `set4-attack-effects.test.js` |
| 43 | `くちなし` global insect keyword suppression | alpha-audited | `set4-kuchinashi.test.js` |
| 46-50 | territory attachment and printed stat modifiers | alpha-audited | `set4-targeting.test.js`, alpha runtime/Human/CPU suites |
| 52-54 | advanced attachment behavior | audit and implementation pending | pending |
| 57, 61 | matching-form exchange and delayed spell immunity | implemented | `set4-spell-core.test.js` |
| 55, 56, 58-60, 62-64 | remaining spell selections, mass destruction, attachment distribution | audit and implementation pending | pending |

Only the 36 cards listed as PLAYABLE by the audit are released for Battle. The remaining wiring stays present for continued development, but Toolbox validation rejects it as PARTIAL.
