# SET1 Implementation Design

## Goal

Register all 106 Booster Set 1 cards and make every card whose rules are determinable playable on the current Battle Engine without card-name dispatch.

## Boundaries

- Preserve the Starter rules and single-screen Battle UI.
- Keep existing unrelated dirty and untracked files untouched.
- Do not commit or push.
- Treat the repository knowledge base as the primary card catalogue and the official Set 1 Q&A as the authority for timing and rulings.
- Mark only genuinely indeterminate behavior `BLOCKED`; never infer missing rules from generic TCG conventions.

## Architecture

`js/cards/set1-cards.js` owns the 106 immutable `CardDefinition` registrations. Stable IDs use `set1_NNN`, derived from the printed number, so names never become runtime dispatch keys.

Reusable behavior is represented by structured skill, passive, enhancement, and spell descriptors. Existing mechanics (`CONTINUOUS_ATTACK`, sacrifice, once-per-field-stay, `TERRITORY_DRAW`, stat modifiers, attachments, target rules, face-down, and destroy triggers) are reused. Small generic additions cover dynamic AP, attack prevention, zone selection/movement, temporary field entry, attachment transfer/destruction, territory replacement, and pending continuation.

All user choices enter `state.pendingEffect`. Human UI and `CpuAgent` call the same resolver. `CpuRunner` resumes through its existing pending loop. Card detail text is generated from descriptors or player-facing `description` fields; enum names are never rendered.

## Verification

Tests are grouped by registry/schema, simple cards, reusable mechanics, pending/CPU, territory/triggers, UI formatting, and deterministic full game. Each behavior change follows RED, GREEN, then regression verification. Final evidence is `node tests/run-all.js`, syntax checks for changed JavaScript, `git diff --check`, deterministic SET1 simulation, and `git status`.

## Phase 2 runtime contracts

`CARD_SELECTION` carries controller, legal options, min/max/exact counts, candidate zones, optional selection groups, purpose, and a serializable continuation. Human clicks and CPU choices both end in `resolveCardSelection`; optional ranges use the existing control bar as a compact confirmation action.

`batchMoveCards` validates every source and destination before applying a zone exchange. Attachment lookup is likewise generic. Destruction replacement runs before FIELD removal and before `DESTROY`; territory suppression and trigger suppression are descriptors evaluated at the moment territory selection is created. Attack resolution now exposes an `ATTACK_COMPLETED` event and a narrow deferred-destruction path for effects whose documented order requires it.
