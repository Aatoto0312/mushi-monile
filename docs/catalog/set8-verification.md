# SET8 Catalog Integration verification

Baseline: dddb4e767d0d12576c5ac3cba4ef4dd705989ccc.

- Catalog: 565; SET8: 64; number coverage 1–64 unique; insects 46, enhancements 8, spells 10.
- Battle-ready: 309, unchanged. SET8: RESEARCHED 64; playable 0.
- Rarity: LR 5, UR 7, SR 14, R 17, N 21, independently tallied.
- Source comparison: both maintained databases agree on names, rarity, costs, HP, all skills/traits and text, spell/enhancement text. Primary publisher card-text verification remains UNKNOWN for all 64. Official Q&A summaries are identified separately; no user rulings supplied.
- Full: 1158 passed / 0 failed (fresh final run).
- Shared: 72 passed / 0 failed.
- SET8 focused: 7 passed / 0 failed, including each of the 64 printings in a storable 20-card deck that remains Battle-ineligible, cross-printing same-name limit, description/ruling presentation.
- SET8 Toolbox Chromium: 214 checks, 0 page errors, 0 asset 404.
- SET8 Toolbox WebKit: 214 checks, 0 page errors, 0 asset 404.
- Existing normal browser flow: Chromium 58 / WebKit 58; includes CPU, Tutorial and Toolbox-to-Battle.
- Phone portrait 390×664 / landscape 844×390: no page horizontal overflow; detail sheet opens/closes; all 64 details accessible. WebKit screenshot inspected after transition, detail occupies available viewport.
- Astra presentation checks: 7 passed.
- Syntax and git diff --check: passed.
- No BattleEngine, CPU, effects, or SET1–SET4 definitions changed. CardDefinition adds only optional display description.
- Cache URLs updated together; the existing cache-version test retains its same-version requirement for SET8.
- Exclusions: .ai-worker/, docs/mushijingi-knowledge/, all untracked screenshots, downloaded HTML and temporary scraped data.

Release process: commit on set8-catalog-integration, fast-forward main only if unchanged, rerun important checks on main, normal push, verify existing legacy Pages deployment on main / and run the same catalog/browser checks against the public URL. Post-release deployment identity is reported in the task response rather than predicting a commit hash here.
