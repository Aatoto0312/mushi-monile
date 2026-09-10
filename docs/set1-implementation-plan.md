# SET1 Implementation Plan

**Goal:** Deliver auditable Starter + SET1 play on the current engine.

**Architecture:** A dedicated data registry feeds small descriptor-driven mechanics. Selection is centralized in generic pending state and shared resolvers.

**Tech Stack:** Browser JavaScript, Node.js test harness, repository Markdown knowledge base.

**Spec:** `docs/set1-implementation-design.md`

## Global Constraints

- No commit or push.
- No unrelated dirty/untracked edits.
- No card-name dispatch.
- No inferred rulings.
- Preserve Starter and Battle UI behavior.

### Task 1: Catalogue and audit

- [x] Parse and cross-check all 106 local catalogue entries.
- [ ] Classify each entry A/B/C/D by required mechanic.
- [ ] Record official Q&A findings and any BLOCKED branches.

### Task 2: Registry and simple cards

- [x] Add a failing registry/schema/simple-stat test for all 106 entries and the 39 effect-free cards.
- [x] Add `set1-cards.js` and loader entries.
- [x] Run the focused test and make it pass.

### Task 3: Existing-mechanic cards

- [ ] Add failing tests for reused continuous attack, sacrifice, once-per-field-stay, tobidasu, stat modifier, targeting, face-down, self-destroy, attachment stat/color, and destroy-trigger descriptors.
- [ ] Register those descriptors in mechanic-sized groups.
- [ ] Run focused tests and Starter regressions.

### Task 4: Generic runtime mechanics

- [ ] Add failing tests for dynamic AP, attack restriction, on-entry effects, destruction replacement, and delayed destruction.
- [ ] Implement descriptor interpreters without name checks.
- [ ] Run focused tests and regressions.

### Task 5: Pending, CPU, and zone effects

- [ ] Add failing Human and CPU continuation tests for card, color, field, food, discard, attachment, and multi-card selections.
- [x] Implement generic selection descriptors and one resolver entry point.
- [x] Extend CPU selection and UI picker routing through that resolver.
- [ ] Verify the runner never freezes after resolution.

### Task 6: Territory and timing-sensitive cards

- [ ] Add failing tests for face-up added territory, special territory destination, territory suppression, tobidasu suppression, ordered multi-attack, and official timing interactions.
- [x] Implement only rulings supported by local or official sources.
- [ ] Mark unresolved branches BLOCKED with reasons.

### Task 7: Detail, coverage, and full verification

- [ ] Add failing formatter/detail tests for every SET1 spell, enhancement, passive, and non-basic skill.
- [x] Add deterministic SET1 full-game coverage.
- [ ] Generate the numeric coverage report and per-card matrix.
- [ ] Run the complete suite, syntax checks, `git diff --check`, and final status audit.
