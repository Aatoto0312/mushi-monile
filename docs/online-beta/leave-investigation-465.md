# Release preparation (approved 2026-11-05)

User authorized publication to existing Pages URL after candidate verification. Baseline/rollback commit8d0af592ec24f508eff9b6e3bb5d39dfc62d1163. Client-only change; public API and ngrok are NOT restarted or modified. Local/public health both200 with unchanged engine5d9d32ad... and cards058c9160... contracts. Runtime remains465/565. Asset cache tag leave-465-v1 is rotated consistently in existing entrypoints/CSS imports and builder; matching tests keep their assertions. Candidate88files (same count as baseline); normalized source SHA256 matches all manifest entries.

Release validation workflow adds only fix/online-leave-465 to the existing isolated build trigger. Pages is legacy main/root: pushing this review branch does not deploy Pages. Official Jekyll build and exact output/hash/exclusion check must pass before main fast-forward/push. Non-public docs/tests/server/scripts remain excluded. Restore front end via ordinary revert of the release commit if needed; server contract is unchanged so no API rollback/restart required. No reset/force.

Local full2057/0, shared73/0, server+candidate192/0. Browser8-case final result recorded in external leave465-release-browser.log (check completion before commit). Final Actions/deploy IDs and public verification results will be reported on completion. No physical iPhone claim.

Earlier investigation sections below are chronological; their statements about publication approval/uncommitted status describe their earlier stage.

---

# Follow-up candidate: in-app leave confirmation

2026-11-05 JST. Reporter clarified: no confirmation appears after tapping Exit.

Changed only production file online/client.js: standard window.confirm is replaced for LEAVE by existing in-app overlay with explicit Exit/Back buttons. Lobby and menu exit share requestLeave. No change to RESIGN, Engine/cards, protocol, auth, RoomService, or server. Guard checks current room, connected/busy, and uses current version at submission; server ACK still controls clearing local seat. Closing/Back sends nothing. The click handler is bound in baseline and hit-test passes in tested browsers.

Causality limit: actual iPhone failure remains unobserved. Native-confirm suppression is a plausible cause, NOT a confirmed diagnosis of reporter device. New test deliberately overrides confirm to return false (explicit simulated unavailable native-dialog condition), observes RED in both browsers before implementation, and then GREEN using in-app confirmation without ever calling native confirm. This does not prove Safari suppressed a modal. If button is disabled due disconnect/busy or tap never reaches it, this candidate does not claim to solve that separate path.

Regression: server/browser/leave-confirmation.cjs adds2 cases; leave-room.cjs adapts previous lifecycle coverage to new explicit confirmation and includes lobby/menu exit for host/spectator. Native confirm cancel expectation was changed because that UI is intentionally replaced, not to hide a product failure. Final browser result6/6, exit0: both engines, B/legacy lifecycle and suppressed-native-confirm scenarios, including lobby/menu exit. Final logs leave465-fixed-browser-final.log. Original baseline failures/success logs retained externally. Full2057/0, shared73/0, server191/0 (including4 new leave tests); syntax/diff check pass. No Pages build required/performed at this unpublished source-only fix stage.

Public465/main/API/ngrok/auth and independent469 checkpoint775f665 unchanged. Candidate changes remain uncommitted in fix/online-leave-465. Release requires separate user permission. No card certification added in this focused investigation.

---

# Online leave investigation (465 baseline)

Verified 2026-11-05 JST. Base `8d0af592ec24f508eff9b6e3bb5d39dfc62d1163`.
Independent checkout `C:\Users\aatot\mushi-leave-465`, branch `fix/online-leave-465`.

## Initial baseline outcome (before the follow-up candidate)
Reported creator-immediate-leave failure is NOT reproduced. No production-code fix is justified yet. Do not describe this as fixed.
Live HTTPS GETs for `online-b.html` and `online/client.js` both returned 200 and matched baseline checkout after CRLF normalization. No live room/API/session was created or modified.
Local candidate used ephemeral loopback ports and the actual465 RoomService/WebSocket transport, not mocked ACKs. Public API/ngrok untouched; no publish/push/main change.

## Browser evidence
`server/browser/leave-room.cjs` runs both B and legacy online pages in Chromium (Edge) and WebKit at375x667 with touch/mobile context. Ordinary DOM clicks; no forced click, direct invocation of onclick, or injected LEAVE.
- Creator creates room, hit-tests leave center (no covering element), cancels native confirmation (no LEAVE), then accepts (one LEAVE, entrance restored, local seat erased).
- Reload after leave sends no RESUME; same connection can create a different room.
- P2 and spectator leave/rejoin, and other clients see slot/count changes.
- Real client WebSocket.close triggers automatic RESUME to same P2; offline reload followed by reconnect preserves P2; subsequent explicit leave clears saved credentials.
- Host exit closes room for P2 and spectator, displays HOST_LEFT explanation; both can explicitly leave closed room.
- Captures uncaught page errors; no such errors observed in completed baseline runs.

Initial expanded NEW test failed because its final rejoin omitted re-entering code after a page reload. Code input is intentionally not session state. Corrected only test setup to fill original code again; no product/assertion workaround.
Browser run with normal reload coverage:4/4. Final additional explicit WebSocket-close run:4/4, exit0, including both pages in both engines. No page errors. Syntax and git diff --check passed.
Logs: `C:\Users\aatot\.codex\tmp\leave465-browser-{final,ws}.log`.

## Server evidence
`server/test/leave-room.test.cjs`:4 new tests; with existing rooms suite13/13. Full server suite191/191. Logs `leave465-server.log`, `leave465-server-full.log` under same tmp directory.
Checks former host/guest/watcher token rejection, session unbinding, peer view consistency, slot reuse, and difference between network disconnect (reserved resumable seat) and explicit leave (revoked seat).
Closed room persists as terminal tombstone for5 minutes then sweep removes it; this is not an active or reconnect-waiting match. Test advances service clock, verifies room removed and remaining clients get ROOM_EXPIRED. No production timeout changed.

## Remaining evidence needed
`online/client.js` uses native `confirm('このルームを退出しますか？')` before sending LEAVE. Clicking Cancel intentionally does nothing. Whether reporter sees this prompt, accepts it, and then sees an error/connection change is unknown. No claim that Safari suppressed it is established. Asked user whether prompt appears; actual iPhone reproduction remains unverified.
If it recurs: capture screen after tap and connection status; record whether confirmation appears/OK chosen, creator vs participant role, and fresh page vs resumed seat. Inspect console/WS request TYPES and public error codes only; never expose seat tokens or raw SESSION frames.
Do not replace confirm/UI or modify server lifecycle on speculation.

## Protected work
Independent469 checkout remains at775f665 and clean. Main465 remains8d0af59. No card changes/held5/ruling hypothesis changes in this checkout. Only new investigation tests and this note; no commit performed. Card implementation can resume independently from existing queue.
