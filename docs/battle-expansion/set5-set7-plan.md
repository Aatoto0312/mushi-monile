# SET5–SET7 Battle implementation plan

**Goal:** implement and independently substantiate 192 Battle definitions without changing SET8 or weakening the existing 309-card release.

**Architecture:** canonical catalog records supply metadata; set definition modules supply declarative mechanics. Engine legality, selection, attachment lifecycle, triggers and serial continuations remain shared by Human and CPU. Status changes require per-card evidence, never runtime registration alone.

**Baseline:** `2ea76fad5f419037122d7b24a71a784117fbe385`; branch `battle-set5-set7`.

**Sources:** official card information and official Q&A first; local knowledge base and stored catalog are secondary references. Record unresolved facts as UNKNOWN, NEEDS_RULING or CONFLICT. No invented rulings.

## Quality gates

- [x] Confirm working tree, branch, main and origin/main; preserve excluded files.
- [ ] SET5: classify all 64 records, verify official rulings, map existing handlers.
- [ ] SET5: implement mechanics with failing focused tests first.
- [ ] SET5: card-specific Human/CPU/serialization and adversarial evidence.
- [ ] SET5: full/shared/browser/compact/responsive gates and honest checkpoint.
- [ ] Repeat the same gates for SET6, then SET7 without approval waits.
- [ ] Audit catalog 565, canonical identities, reprint name limits and actual playable count.
- [ ] Review exact staged files, merge only verified release into main, rerun important tests, push normally and verify Pages.

## Release safeguards

No SET8 Battle work. No Engine card-name switch. No test deletion, skips or weakened expectations. Do not commit `.ai-worker/`, `docs/mushijingi-knowledge/` or screenshots. Do not merge partial work before the release gates. Preserve Astra portrait/landscape one-screen behavior.

## Evidence requirements per card

Text and ruling references; every skill/trait/effect; legal and illegal targets; costs and timing; Human decisions; CPU legal candidate selection; pending completion; save/restore when pending; owner/controller and cross-set interactions. A status of PLAYABLE requires these checks, not just a passing generic smoke.
