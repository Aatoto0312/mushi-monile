# 21-card isolated release candidate and recovery (2026-11-02)

STATUS: RELEASED 2026-11-02. Public card release5d85350 /366 cards; prior publicmain505097f /345 cards retained for paired rollback. Card-development branch34ebf3a /388 is preserved separately. Candidate is exactly public345+21 previously certified reuse cards =366. No unreviewed whole-branch merge.

## Recovery and cause
Original recorded APIpid14280 is absent and127.0.0.1:8791 had no listener. ngrokpid6440, created2026-10-31T21:19:06JST, remains running with token-free endpoint.yml forwarding8791. This explains the502 transport failure. Original hidden Start-Process launcher persisted neither exit logs nor a supervisor; exact exit cause is unknown, not asserted to be a crash or reboot. No credentials/ACL/Windows/Tailscale/RDP changed.

Recovery uses immutable505097f code under C:/Users/aatot/.codex/tmp/mushi-public-recovery-20261102/api-505097f, existing ws8.22 dependency copied unchanged. APIpid4056 started with hidden window and new stdout/stderr logs; local/publichealth200, Pages contract exactly matched, real WSS allowed Origin succeeds and unauthorized Origin403. ngrok agent unchanged. Worktree file changes cannot mutate this running API's runtime sources.

## Why not388
Independent review reproduced RULING_REQUIRED in34ebf3a with only PLAYABLE SET4-39 and Starter Minomushi equipment:100HP host destroys its ownHP enhancement to pay second-skill additional cost, then dies before attack resumes. This is not isolated by PARTIAL SET5-52, not one of the accepted four timing hypotheses, and blocks whole388 release pending source-backed rule/containment. No guessed ruling implemented.

Candidate preserves9 Engine/AI/projection files equivalent after CRLF-to-LF normalization to505097f and unchanged SET5 definitions. Does not adopt14 earlier SET5 promotions, phase2 eight promotions, new filtered-discard handler, conditional-HP/paid-cost continuation changes or their provisional rules. tests/crossset-public-scope.test.js enforces that boundary. Existing published baseline behavior is preserved, not declared exhaustively correct.

Adopted21: SET6-9/23/29/34/39/40/45/48, SET7-3/39/43/47/50, SET8-2/9/10/12/20/25/35/46. Source-backed per-card basic evidence and64 focused checks in crossset suites. Donor SET5-28 metadata is reused without promoting that donor. One UI-only legacy confirm ownership guard preserves B Tobidasu choices and legacy fallback. New SCRIPTS registration and contract required for server; no WSS protocol alteration.

## Four research failures
Original four diagnostics and expectations remain untouched on battle-set5-complete (34ebf3a); they still execute in its full suite. This candidate starts from publishedmain and does not adopt their provisional Engine/cards/test dependency branch (including absent SET5-58). No test is deleted, skipped, or weakened to green that branch. Candidate full is published baseline1562 plus64 card/evidence checks plus3 release-scope checks =1629; separate broader-branch1792/4 receipt is retained. A safe subset is not a claim that the larger branch is green.

## Versioned assets and gates
Cache tag cards-366-v1, matched online/contract generated from candidate sources. Saved deck format/key unchanged; canonical PLAYABLE controls filters. Invalid/PARTIAL/unconnected deck entries remain rejected. All assets remain at existing GitHub Pages URL; ngrok onlyAPI.

Release workflow trigger adds only release/cards-366-20261102, with contents:read, official Jekyll build, exactmanifest/SHA verification and artifact upload; it has no deployment step. Legacy Pages stillmain:/, so verification branch push does not change public site. Final manifest is generated from explicit builder output; no .nojekyll or broad exclude removal.

## Operational gate before main/API cutover
Restored public345 API is now running. Rooms/sessions live only in its process. There is no proven lossless process migration, and disconnected seats may still be waiting to reconnect. A before-execution report and agreed maintenance window are required before replacing the now-running API. Do not use TCP connection counts alone as proof of no games. Do not stop old API or tunnel automatically from tests. Do not publish366 frontend against345 API.

For an approved controlled window: retain old immutable snapshot and contracts; prepare immutable366 API offline, verify it on an isolated port; announce match interruption; stop only verified owned4056 by PID+creation+executable; start paired366 at8791 without restarting ngrok; push validated main and verify Pages deployment/assets/contract; test public CPU/online/spectator/reconnect. On failure restore oldAPI and ordinary-revert frontend as a matched pair. No force/reset/clean.

Autostart/service registration remains outside this change. iPhone real device validation remains human-operated. Public API recovery is not a claim of24h supervision.

## Verified gate receipt (2026-11-02)
- Final full:1629 pass/0 fail; shared:73/0; server:54/0.
- Chromium and WebKit:21 CPU plus21 online card-specific paths per engine; both suites2/2. Flow gates8/8 plus candidate-validation4/4, including completed matches, spectator, reload/reconnect, invalid decks and legacy online UI.
- Toolbox candidate:16 checks in each browser, including saved mixed-set deck handoff. Public345 recovery:online2/2 and CPU2/2 with completed matches; physical iPhone not tested.
- Real Linux official Jekyll artifact:Actions run41381855534, source f2d743e;81 deployed files,82 manifest entries (build-only config excluded), all SHA256 matched. Receipt outside Git: C:/Users/aatot/.codex/tmp/mushi-public-recovery-20261102/linux-result.json.
- Immutable366 API snapshot prepared and tested on an ephemeral localhost port; health200 and candidate contract matched. It has NOT replaced restored public345 API.
- API maintenance approval requested because rooms and reconnect seats cannot migrate across processes. main and Pages remain505097f pending that decision; no new-card publication claimed.
- Existing online-beta staged diff hash remains45016f7bd80bb86e6f6ef50b3dcef5ac6d4e28f8.

## Release execution receipt (2026-11-02 22:18-22:22 JST)
User confirmed no matches and authorized cutover. Process4056 identity was verified and explicitly stopped; no claim of graceful room migration. Snapshot api-366-f2d743e started as PID23988 at8791. Existing ngrokPID6440, domain and authentication untouched. Local/publichealth200, exact contract match, actual WSS HELLO and unauthorized Origin403 confirmed. The small probe held its rejected socket open after assertions and was stopped by its exact test PID32556; publicAPI was not stopped.

Main fast-forwarded normally505097f ->5d85350 and normally pushed. Actual Pages build/deployment succeeded: https://github.com/Aatoto0312/mushi-monile/actions/runs/41451889073 . Public81 asset SHA256 values match manifest;5 forbidden representative paths404; published contract equals publicAPI. Public CPU:Chromium2 matches +WebKit2 matches completed,2/2 tests. Public online:Chromium1 +WebKit1 completed,2/2 tests with spectator, reload and disconnect/resume;111/65 actions and2570502/1175143 received WS payload bytes respectively (not billed tunnel traffic). Toolbox mixed saved-deck handoff:16 checks per engine. No application page errors, missing required assets or tested hidden-information leaks. Physical iPhone not operated.

Evidence outside Git: C:/Users/aatot/.codex/tmp/mushi-public-recovery-20261102/{public-366-assets.json,public-366-online.log,public-366-cpu.log,public-366-toolbox.log,api-366-process.json,api-366.stdout.log,api-366.stderr.log}. Exact snapshot node command: node server/public.cjs with cwd api-366-f2d743e. This is a manually started process, not a registered Windows service or automatic recovery guarantee.

For emergency stop, verify PID23988 and recorded creation time/executable against api-366-process.json before stopping only that API. It disconnects matches; obtain an operational window unless urgent safety requires stop. Existing tunnel then has no upstream. For restart, first verify8791 is free, then launch node server/public.cjs in the immutable366 snapshot with hidden window and new log names; keep ngrok unchanged. Never start from changing card-development worktrees.

Paired rollback: secure a maintenance window; restore old immutable api-505097f on8791; restore browser assets to505097f with ordinary reviewed revert commits (no reset or force), regenerate/reverify matching manifest and Pages build, and verify old contracts/HTTPS/WSS. Restoring only frontend or onlyAPI leaves a contract mismatch. The388 branch and paid-cost source-loss ruling remain excluded. Original four research failures remain unchanged on card-development branch.
