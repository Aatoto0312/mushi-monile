# All 565 cards implementation plan

Goal: Starter and SET1–SET8 Battle support, using the current user instruction as specification.
Base: bec36b4595076cff48be84d6c1ae31db0c1f6dbc, branch battle-set5-set7. Existing in-place branch retained as expressly requested; no checkout or worktree migration.

## Constraints and decisions
- This plan supersedes the SET8 exclusion in set5-set7-plan.md; historical checkpoints are retained.
- Reuse shared Engine legality, serial continuations and attachment lifecycle. No card-name switches, UI rule mutation or large UI redesign.
- Basic Human reachability is required per mechanic; exhaustive device UI audit is deferred to final audit. Engine correctness and CPU legality remain required.
- Keep CATALOGED, IMPLEMENTED, PLAYABLE and AUDITED separate. Provisional wiring and declared runtime status do not imply final AUDITED certification.
- Preserve untracked screenshots, .ai-worker and knowledge base. Explicit staging only; no reset, clean, rebase, amend or force push.
- Unknown rulings remain NEEDS_RULING, never inferred. Main integration requires release tests and completion review, not intermediate progress.

## Tasks
- [x] Inspect branch/status/HEAD and declared runtime counts; rerun full baseline 1307/0.
- [x] Investigate SET4 discrepancy: 64 declared PLAYABLE, no partial status entries; known adversarial 5/5, supplemental 6/6 and CPU 64/64 rerun. This is not a new exhaustive ruling audit.
- [x] Generate reproducible all-card inventory distinguishing runtime wiring, availability and audited evidence (scripts/audit-all-card-readiness.js; card-readiness.md).
- [ ] Complete remaining SET5 mechanics in tested groups; progress already wired 40/64 at base.
- [ ] Card-level basic legality/Human/CPU/resolution evidence and honest SET5 gate/checkpoint.
- [ ] Repeat classification/implementation/card proof/gate for SET6, SET7, SET8 in order.
- [ ] Full cross-set suite, serialization, browser, compact/responsive, Toolbox/handoff and review.
- [ ] Review staged release; integrate/publish only verified state; separate human iPhone validation.

## Review focus
- Reattachment and copied/tracked enhancements across leave/reenter/capture and delayed destruction.
- Mandatory costs, effective vs printed cost and stale candidates after intervening triggers.
- Hidden information in Human/CPU selections and JSON restored pending state.
- Concurrent suppression and resolved independent delayed effects.
- Legacy status labels and audit evidence must not inflate playable/certified counts.

## Current execution ledger
- 2026-10-28: SET5 thirty-six basic PLAYABLE, total345. Fifty SET5 definitions connected;14 remain PARTIAL and14 are not connected. SET6/7/8:64 each without Battle definitions. No SET Complete claimed.
- SET4 shared Human attachment selection gap fixed in9a13bf1. Serial end-step and copy expiry fixes are documented in serial-end-turn-audit.md.
- New SET5 territory replacement and pre-spell event pipeline have card-level evidence; independent review found and fixed three invalid-selection/target-loss interactions before certification. See set5-territory-replacement.md and set5-pre-spell-audit.md.
- Shared Flee mapping certified individually for five cards; see set5-flee-completion.md. Latest full1496/0,shared73/0. Human browser evidence is not physical iPhone verification.
- Main/origin/main remain2ea76fa; no merge/push/publication. Whole565 final audit still pending.

- SET5-7 destruction watcher wired provisionally; one cross-card condition-timing NEEDS_RULING remains. Canonical status stays PARTIAL, with the question exposed by the all-card readiness report.

- SET5-30 activated field ability shares Engine legality, serial entry, CPU and basic Human paths; see set5-activated-field-ability-audit.md.
