# B v2 shared responsive release (2026-10-31 JST)

Baseline: main/origin/main 9e45092f012b966d223bc81bbe71ff259b557862. Worktree: C:/Users/aatot/mushi-b-responsive, branch b-responsive-20261031. Public API8791 and ngrok are reused without restarting or configuration changes.

## Reproduced defects and changes
The new physical SE3 screenshot was not supplied in this request; the reported symptoms were independently reproduced with the real shared board at 375x667. Before: HUD40px; self status bottom550.984375 and hand toggle top537.984375 (13px overlap). Existing prototype styles made the toggle absolutely positioned at top:-17px, expanded hand an overlay, and supplied portrait minimum card heights that overflowed short viewports.

Shared board.js separates turn, instruction and phase in one HUD row, with target controls in a separate row only during target selection. board.css assigns explicit grid areas to both modes, places hand toggle and cards in a normal-flow grid, removes inherited card-container minimum height, and budgets hand/fields by available board container height. Short landscape screens place fields side by side. Shell dvh/svh, safe-area padding and container queries respond to available dimensions, not device names. Empty hands collapse. CPU shell and online shell share battle-shell; CPU-only old minimum560px fallback is removed. No Engine, AI, transport, authorization, deck storage or contract changes.

## Evidence and reproduction
Run with external Playwright dependency via MUSHI_PLAYWRIGHT_PATH:
- node --test --test-concurrency=1 server/browser/b-responsive.cjs
- node --test --test-concurrency=1 server/browser/cpu-b.cjs server/browser/cpu-b-effects.cjs
- node --test --test-concurrency=1 server/browser/toolbox-online-candidate.cjs server/browser/candidate-validation.cjs server/browser/pages-configuration.cjs
- node tests/run-all.js; node tests/run-shared.js
- node --test server/test/*.test.cjs battle-ui/presentation.test.cjs scripts/online-candidate.test.cjs tests/cpu-b-adapter.test.cjs
- Legacy Astra browser, compact and responsive suites target an isolated candidate server and explicitly retain battleUi=legacy.

New geometry regression checks 17 viewports (all eight requested phones, 768x1024,1280x800,667x375,844x390,568x320, plus375x520/560/600/620). Both folded/expanded hand states, both modes and both engines:136 geometry rows. It checks actual elementFromPoint hit tests for all12 stat values and end action, HUD line/height, status/toggle/rail intersections, art height, viewport/body overflow; also DRAW/SET/CPU turn,10field/14hand, details, skill/target/back/cancel/end and synthetic top47/bottom34 safe insets. Stable fixture tests do not constitute transport/game-completion proof; separate unmocked two-seat and CPU E2E cover those. Geometry screenshots use exact JPEG bytes fetched from the official card URL to avoid pending third-party image loads; no image or card data is generated or changed.

Final local geometry:4/4 passed. SE3 HUD32px (20% reduction); self status to toggle gap8px in both modes, both hand states and both browsers. Rail top611/bottom661 in667px viewport. Representative CPU collapsed status bottom520.453125/toggle528.453125; expanded409.5/417.5. Online collapsed520.71875/528.71875; expanded410.5/418.5. No status/control interception at any tested size, including375x520. Browser tests are not physical iPhone/Android certification.

Results/logs/screenshots outside Git: C:/Users/aatot/.codex/tmp/b-responsive-verified and b-responsive-*.log. Full1562/0, shared73/0, server53/0; CPU browser4/0 including four completed matches. Online/legacy final receipts and actual Linux Pages result must be recorded before main release.

## Release and rollback
Browser allowlist remains81 manifest entries (80 published assets and build-only_config.yml). All local HTML/CSS dependencies receive b-responsive-v1 cache version. Only query versions change in prototype-b; its design/data remains intact. Workflow release-build-check.yml verifies this branch without deploying; official Jekyll output must exactly match every public SHA256 and unchanged Engine/card contract. Main remains Pages legacy main/root.

Before main push: recheck remote main9e45092, clean release worktree, source/staged ownership, exact manifest, all required suites and successful Linux artifact gate. Fast-forward only from the verified branch, rerun important tests in main and normal push. Verify actual Pages build commit and all80 public asset hashes, excluded404, live CPU/online games and unchanged API/ngrok process IDs.

Rollback uses an ordinary reviewed git revert of this release commit on main followed by normal push and Pages verification. API contract is unchanged, so UI rollback does not require restarting the running API. ENGINE_BLOCKED tied deck-out remains NEEDS_RULING. Physical SE3 Safari: user should verify bars shown/hidden, portrait/landscape, status values, hand fold/unfold, detail close, skill/target/cancel/end.

Local gate receipts (2026-10-31 JST): b-responsive-full.log1562/0; shared73/0; server53/0; cpu4/0 (two matches per browser); online8/0 (127actions per browser with spectator/reconnect). Geometry4/0 (136 dimension/state/mode/engine rows). Existing Chromium Astra normal58,compact42,responsive4369; corresponding WebKit run must also finish before main push. All artifacts are outsideGit under C:/Users/aatot/.codex/tmp. Reproduced-before fixtures deliberately failed; their assertions were kept and expanded, not weakened.
