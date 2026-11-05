# Failed normal draw: equal territory is a draw

Confirmed 2026-11-05 from the official common Q&A:
https://mushijingi.jimdofree.com/q-a-よくある質問-1/ゲームのルールについて/

The 山札 question explicitly states that failed draw ends the game, territory majority wins, and equal territory is a draw. The prior stop for equal territory is therefore no longer an unresolved ruling for the required normal draw path.

- `resolveFailedDraw` now emits the existing GAME_OVER / FAILED_DRAW event, with `winner:null` and both territory counts, instead of throwing on equality.
- Unequal-territory results, first-turn draw skip, and empty-deck-without-attempt behavior remain covered.
- New tests first reproduced three failures before the fix. Manual/automatic failed draw, JSON result, UI labels/actions, and idempotent finished state are covered.
- Existing `FixDeckOut5`, mirror scenario, and room scenario were retained and updated against the newly confirmed rule. This is a specification correction, not deletion, skip, or unconditional success. The identical mirror path reaches the former blocked point after144 operations and finishes on operation145; both empty decks and territory1/1 are still asserted.
- Unknown Engine pending work still aborts as ENGINE_BLOCKED, verified separately at both gateway and room levels, without revealing private state.
- Chromium/WebKit CPU and 2-player+spectator online paths verify real Engine END → failed draw → visible draw; all online seats and watcher restore the same ended result after reload.
- This change targets the existing required-normal-draw handler. Additional draws inside card effects are a separate audit scope; do not infer that every draw/search effect has been audited here.
- Original held paid-cost attacker-loss failure, held five cards, and old hypothesis fixtures in protected worktrees were not edited. Public465/API/main/Pages remain unchanged.
