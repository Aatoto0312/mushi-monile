# SET4 Battle completion audit

Source baseline: the 64-card catalog and official SET4 Q&A recorded by the local knowledge base. This file records implementation evidence only; it does not replace those sources.

## Status

- Definitions wired: 64/64
- PLAYABLE: 0
- PARTIAL: 64
- BLOCKED: 0
- Completion checkpoint: not yet eligible

## Mechanic matrix

| Cards | Mechanic | State | Evidence |
|---|---|---|---|
| 1, 3, 10 | discard trait cost reduction (`生きた化石`) | implemented | `set4-cost-modifiers.test.js` |
| 11, 12 | opposing visible blue food cost reduction | implemented | `set4-cost-modifiers.test.js` |
| 5 | suppress later on-entry traits | implemented | `set4-entry-mechanics.test.js` |
| 14 | three-color discard continuous AP/HP | implemented | `set4-cost-modifiers.test.js` |
| 15 | global printed multi-skill insect tax | implemented | `set4-cost-modifiers.test.js` |
| 16 | entry food destruction or self destruction | implemented | `set4-entry-mechanics.test.js` |
| 2, 13, 18, 20, 21, 23-25, 27, 29, 32-34, 36-38, 41, 44, 46-50 | existing mechanic mapping | connected; card evidence pending | focused tests still required |
| 4, 9, 19, 31 | `かばう` territory entry, lure, delayed return | implemented | `set4-kabau.test.js` |
| 6, 8, 13 | `軍隊連携`, shared skills, delayed lure | new generic mechanic required | pending |
| 7, 17, 26, 28, 30, 35, 39, 40, 42, 43, 45 | attack/trait special rules | audit and implementation pending | pending |
| 26, 51 | opponent spell-target lure | implemented | `set4-targeting.test.js` |
| 46-50 | territory attachment and printed stat modifiers | implemented; card evidence pending | `set4-targeting.test.js` |
| 52-54 | advanced attachment behavior | audit and implementation pending | pending |
| 55-64 | spell selections, exchanges, mass destruction, attachment distribution | audit and implementation pending | pending |

No card is promoted from PARTIAL until its text, all actions, Human path, CPU path, continuation, serialization, and cross-set regression evidence pass.
