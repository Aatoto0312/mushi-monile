# Serial end-step and nested territory regression audit

Base:6eb55ca. This is a targeted shared-engine regression audit, not a SET or all565 completion certificate.

## Reproduced failures
- Delayed destruction opened a choice but healing and the next turn proceeded before it resolved.
- Two delayed destructions moved both cards before the first selection completed.
- Attachment expiry skipped destruction lifecycle, leaving a copied enhancement attached.
- SET3-43 suppression failed when SET5-29 attack-growth work wrapped the territory follow-up in SEQUENCE.
- After initial fix, stat-expiry selection still changed Hotseat perspective/passed device too early (found by independent reviewer).

## Changes
- End-step returns, destruction and attachment expiry use plain serializable typed continuations. FINISH_END_TURN and BEGIN_TURN_AFTER_END run only after dependent selections finish. Field-stay identity/current due flags are rechecked.
- Existing return/destruction/attachment/healing/numeric-stat-expiry ordering is retained. Active-player transition now occurs at final begin step, after expiry-induced selections. This does not claim a new universal ruling about simultaneous end-step effect ordering.
- Expiring enhancements invoke normal destruction/copy tracking and HP recalculation.
- Suppression carries destroyed instance/field-stay identity and locates that matching follow-up under nested serial work. Legacy choices without those fields retain first-follow-up compatibility.
- UI records end-turn intent locally and shows pass overlay only after actor change; it never mutates GameState. Both early delayed destruction and late stat-expiry paths are covered.

## Evidence
- tests/end-turn-selection-continuation.test.js:5/5 (serial destruction, JSON restoration, CPU completion, copy expiry, next draw gating).
- tests/territory-suppression-nested-continuation.test.js:3/3 (suppress, JSON, allow/growth path).
- tests/end-turn-human-paths.cjs:10/10 each Chromium/WebKit.
- Full1371/0; shared72/0. Existing browser58, compact42 and responsive4368 each Chromium/WebKit. SET5 Human76, attachment Human10 each; Toolbox20-card handoff13 each.
- Read-only independent review requested changes for late stat-expiry handoff; new failing browser reproduction added, actor switch deferred, reviewer retested two consecutive expiry choices plus JSON and confirmed no remaining Important issue in that targeted fix.
- Reviewer explicitly did not certify all card rulings or unspecified simultaneous-effect ordering. Future end-step entrants/duration interactions, capture return destinations and new SET6–8 mechanics remain final-audit focus.

No main merge/push, no KB/worker/screenshot staging. Physical iPhone Safari remains unverified.
