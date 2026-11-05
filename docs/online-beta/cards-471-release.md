# 471-card paired release preparation — 2026-11-06

Status: LOCAL CANDIDATE; PUBLIC CUTOVER HELD until active/reconnecting matches are confirmed absent. No public/main push or API stop/restart performed.

## Integration
- Public baseline02e6231 (465) includes deck sharing and in-app room exit. Development0a65562 (471), common ancestor1471cb2. Dedicated C:\Users\aatot\mushi-release-471, release/cards-471-20261106.
- Added6: set7_023ユカタンビワハゴロモ, set7_027テングビワハゴロモ, set7_060蟲術の演舞, set8_064金色の腕, set7_001オオスズメバチ（女王）, set7_002タランチュラホーク.
- Preserved public Toolbox/share-code codec/UI/styles and online/client.js byte-for-byte. Conflicting entrypoint bodies kept public versions, only cache tag changed to cards-471-v1. Combined run-all suites without duplicates; share tests retained. Engine/cards/engine-view exactly match tested development0a65562. No held5/unknown source-loss rule imported.
- Official failed-normal-draw equality fix from development retained with source/test evidence failed-draw-ruling.md. Genuine unknown pending-state fail-closed test retained.

## Contracts
Protocol mushi-online/1 unchanged; frontend/runtime471 Engine45a652f826db2c67d150af44a4dd0b3b505ef87e37f674b71112f7a5df70908c, cardsdb8af7019ac6d3a112012edbdd4ce9a9df0a79b0b06d0d701bbad6778991bfe2.
Current public465 API Engine5d9d32ad821b916466c06401b75825cd8ed944d136bdb461147610416c68c459, cards058c9160d5b36786f4e275d13426d7174f9d3839733195df4c088d89c58c6d69.
These are incompatible at HELLO; do not disable checks or publish471 Pages against465 API.

## Operational diagnosis
- Direct/public health both200, same bootd92b8351-99c8-432c-8f8a-c28d85b3f125. Actual process21724 is direct node server/public.cjs (relative command), parent22076, started2026-11-05 14:44:56; ngrok6440 unchanged.
- Direct public.cjs has no IPC/management room-status route, no observer status file. operationalStatus exists inside service only. Health and TCP connections cannot prove room/reconnect idleness. No debug attach/injection, stop, restart, ngrok/auth/Windows setting changes attempted.
- Await user confirmation all debugger matches and reconnect waits have ended. No lack-of-users assumption.

## Prepared immutable API pair (outsideGit)
C:\Users\aatot\.codex\tmp\mushi-api-pair-471-20261106\api-465 and api-471, corresponding manifests with SHA256 and exact contracts. Only runtime-required tracked sources copied; existing ws8.22.0 public dependency copied with license. No credentials copied, no npm install, no external registration/system changes.
Each snapshot factory tested on its OWN ephemeral localhost port: health200, HELLO465/471 respectively, exact contract, Pages Origin accepted, unapproved Origin403. Those ephemeral servers stopped; live8791 never touched. Receipts release471-api-probes.json in .codex/tmp.
Start-471-API.cjs and Start-465-API.cjs verify source/dependency SHA and contract before start. Refuse if8791 has a listener, never stop another process. Foreground startup only, no auto-restart/service/task.

## Safe cutover plan — not executed
1. Notify debuggers of maintenance; confirm all matches and reconnect waits ended. Current API cannot supply authoritative aggregate confirmation.
2. Finish Pages real-build gate on isolated verification branch, inspect exact88asset output/manifest/contract, prepare main465 rollback. Do not cut API before frontend build gate succeeds.
3. Stop old foreground API with Ctrl+C in its existing PowerShell window after confirmation. Do not kill an unknown process or change ngrok; tunnel remains on127.0.0.1:8791.
4. In a foreground PowerShell, run node C:\Users\aatot\.codex\tmp\mushi-api-pair-471-20261106\Start-471-API.cjs. Launchers not executed yet. Expect PUBLIC_API_LOOPBACK_READY_8791_CARDS_471; keep console open. If permission/execution review rejects, stop and report; no bypass.
5. Verify local/public health+WSS and471HELLO/Origin/contracts, then fast-forward tested main and ordinary push, wait Pages, verify actual88assets/SHA and CPU/online/watch/resume/exit/share flows. Maintenance has a temporary old-client/new-API incompatibility until Pages propagates; do not advertise availability during it.
6. If pre-Pages validation fails, foreground Ctrl+C on NEW API and use Start-465-API.cjs, verify old contract; main remains02e6231. If post-publication rollback needed, protect matches first and ordinary-revert the release merge with correct first-parent baseline, restore465 API+client together. Never force/reset; saved decks unchanged.

## Verification
Full2125/0; shared80/0; server+candidate211/0. Sharing/edit/leave/priority-card Chromium/WebKit14/0. Broad CPU/online/new6 effects/failed-draw browser suite20/0 (CPU each2 completed matches, online each127 actions, six new-card paths and restore) succeeded; final log release471-battles.log. Candidate manifest89 entries (88site + build-only_config), cachecards-471-v1. Real GitHub Pages build and public471 post-deploy checks pending; no verification-branch push while operational gate is unresolved.
Protected source0a65562,469tree775f665, shared feature42ff9fc, current publicmain02e6231 and original stage remain separate.
