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
- Added pre-damage optional food concealment for 6/7 as a serializable Human/CPU
  card selection, including decline and once-per-field-stay legality.
- Added optional entry damage for 39/42/45 with visible-opponent targeting and
  no territory acquisition on effect destruction.
- Added filtered alternative summon cost for 29; only an own visible larva is a
  legal sacrifice and normal available cost remains unchanged.
- Added conditional end-turn self-destruction for 30 and attack/spell destruction
  routing to owner food for 37, preserving the later territory continuation.
- Added controller-aware hand discard continuations for 11/15/17. Official order
  is covered: 17 discards before territory, while 11 discards after acquisition.
  Captured cards use their current controller to identify the opponent.
- Added continuous controller territory/sole-field stat rules for 12/26 and the
  one-attachment/doubled-stat rules for 20. A SET2 capture regression exposed a
  reduced turn-state compatibility bug; the shared stat resolver now handles the
  real controller state during delayed end-turn cleanup.
- Added optional up-to-three hidden-food reveal for 57 and next-opponent-turn-end
  hiding for 53. The latter exposed that a face-down source could still request
  legal attack targets; shared attack legality now rejects hidden attackers and
  SET2 hiding regressions remain green.
- Added serial hand-to-field summoning for 50, serial per-player hand trimming
  for 56, trigger-suppressed own territory acquisition for 52, and turn-windowed
  cost modifiers for 58/59. All pending shapes are JSON-safe continuations.
- Captured mimic entry exposed an owner/controller bug in shared field-entry
  protection scheduling. Protection now follows the current controller's next
  opponent turn; Starter/SET1 mimic and SET2 capture regressions remain covered.
- Added controller-owned optional territory suppression for 43. The choice is
  suspended inside destruction processing and mutates only the serialized
  destruction follow-up before it resumes.
- Added target-then-payment continuation for variable-cost damage on 54. Printed
  cost remains zero, generated available cost caps the selectable payment, and
  CPU chooses through the same serializable choice shape.
