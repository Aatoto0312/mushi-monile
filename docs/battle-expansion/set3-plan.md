# SET3 Battle audit / mechanic matrix

Status: implementation audit in progress. No SET3 card is PLAYABLE yet.
Authority: `docs/mushijingi-knowledge/SET3_CATALOG.md`, official SET3 Q&A,
and `docs/mushijingi-knowledge/ENGINE_REQUIREMENTS.md`. Canonical metadata stays
in `js/cards/full-catalog-data.js`.

## Initial mechanic matrix

| Mechanic | Cards | Plan |
| --- | --- | --- |
| Conditional attacks / attack effects | 1, 6-9, 11, 31, 32, 35, 40 | Extend shared attack legality and pre/post-damage continuations |
| Runtime card costs | 2-5, 10, 13, 16, 18, 19, 25, 58, 59 | One printed-cost-preserving effective-cost resolver for Human, CPU and Engine |
| Destruction and territory ordering | 15, 17, 37, 43, 49 | Serializable destruction follow-ups; preserve official before/after-territory order |
| Continuous stats and protection | 12, 20, 21, 22, 26, 33-35, 55 | Declarative field/turn modifiers and restrictions |
| Entry selections | 24, 39, 42, 45 | Existing entry continuation extended for color/target selection |
| Alternative summon | 29 | Generic filtered sacrifice alternative |
| Delayed / hidden state | 30, 53 | Existing scheduled destruction and hiding lifecycle |
| Territory attachment | 46, 47 | Optional attachment continuation from territory draw |
| Multi-card spells | 48, 50, 56, 57 | Generic grouped/serial selection, tracked instances and completion |
| Alternative spell cost | 51, 54 | Explicit payment selection before resolution; paid cost remains spent |
| Territory and global grants | 52, 60 | Trigger suppression and game-duration declarative grant |

## Current increment

- All 60 definitions load as PARTIAL; this is wiring only.
- Added shared `getEffectiveCardCost`, preserving printed cost while composing
  own-card discounts and continuous field taxes.
- First tests cover aquatic face-up blue-food discounts, stacking low-cost spell
  tax, empty-field discount and enhancement-to-host discount.
- CPU and Human labels/actions must use the same resolver. No status promotion is
  allowed until per-card metadata, Engine, Human, CPU and regression evidence is recorded.
