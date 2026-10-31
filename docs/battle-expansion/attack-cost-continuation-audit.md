# Attack additional-cost field-stay regression

Discovered while auditing SET5-33, also reproduces on SET4-39. Original source or target can leave field and reenter with the same instance ID while food/enhancement cost selection is pending. The old continuation then attacks the new field stay and spends the cost. Failed-first four cases cover source/target for both cards across full JSON restore; SET4 payment is on an unrelated ally so disappearing payment cannot mask the source identity defect.

## Generic fix

`ATTACK_WITH_ADDITIONAL_COST` snapshots declaring turn and source/target field-entry serial, target controller. Completion validates identities before invoking the ordinary attack/payment resolver. No card name or ID special case, no change to costs or effects.

`getPendingAttackCostStatus` exposes live legality and currently remaining payment candidates. CPU uses those candidates, or cancels an impossible attack through `cancelPendingAttackCost`. The Engine permits cancellation only when the original attack/payment is no longer possible. Valid required costs cannot be bypassed by this API. Cancellation keeps turn, cards and generated cost unchanged, then resumes any outer continuation.

Human main selection button exposes the same Engine-gated cancellation. Failed-first Human test found an attachment modal blocking that button. The picker now closes when this specific attack is impossible; normal valid attachment choices retain their modal.

## Evidence

- `tests/attack-cost-field-stay.test.js`:8/8, including original4 failures, valid cancellation rejection, CPU cancellation for both costs and CPU dropping a stale food candidate while using a remaining legal one.
- `tests/attack-cost-field-stay-human.cjs`:21 checks per Chromium/WebKit. Actual attack/technique/target selection, source/target reentry, JSON restore, Engine-gated cancel, no cost/HP/turn mutation and portrait/landscape BODY fit.
- Existing food-cost4/4 and adversarial SET2–4 audit5/5 retained.
- Independent read-only reviewer reran8 cases, found no Important/Critical issue in source/target checks, cost filtering and cancellation. Browser modal issue was subsequently found and fixed locally, then re-reviewed separately.

## Backward-save boundary

Old serialized pending cost continuations have no field-entry snapshots. Their original field identity cannot be reconstructed. Compatibility retains old completion behavior for that missing information; new pending continuations always have snapshots. This is an explicit residual limit for pre-fix saves, not proof that an old stale attack was repaired. No save migration or invented identity applied.

No card status promotion is inferred from this fix. SET5 remains29 PLAYABLE /21 PARTIAL /14 unconnected, total338/565. No release or final AUDITED claim.

Checkpoint gate: full1537/0, shared73/0, new Human21 and existing attachment Human10 per engine, compact42 per engine, syntax/diff clean. Exhaustive responsive4368 per engine was at prior d12a855; this fix adds no CSS/layout changes and dedicated Human tests recheck portrait/landscape. Modal guard was re-reviewed with no Important issue confirmed.
