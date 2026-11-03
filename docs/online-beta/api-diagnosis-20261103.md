# Public API read-only diagnosis — 2026-11-03

No public process, configuration, authentication, Windows setting or automatic restart was changed. Card development is isolated from this diagnosis.

## Measurements
- API PID23988 and ngrok PID6440 retain original start times (2026-11-02 22:18 and2026-10-31 21:19JST).
- Direct GET127.0.0.1:8791/health:200; public ngrok /health:200; same boot identity and protocol/Engine/cards contract.
- Published Pages online/contract.json equals API contract; public WSS HELLO reports366 PLAYABLE. HELLO-only connection closed without creating/joining a room.
- GitHub Pages Origin allowed; a deliberately unapproved Origin rejected403. No seat or private state requested.
- Windows CIM socket listing initially reported Closed/no LISTEN even though subsequent direct health/WSS succeeded. That listing alone is not proof of server exit. No current outage reproduced, no basis to claim a historical root cause.
- ngrok local inspection4040 ECONNREFUSED. Existing tunnel serves the same API boot/contract over HTTPS/WSS, proving effective routing to that running instance; agent's local inspection endpoint is unavailable. No agent credential file was printed or copied.
- Existing api-366.stdout.log is31bytes, unchanged since startup, contains readiness marker. stderr is0bytes, unchanged. Direct public.cjs does not wire structured room/exit logs; no historical crash receipt exists in these files.

## Next safe maintenance
Prepared server/public-observer.cjs + public-worker.cjs use private child IPC, aggregate room/connection state, private status.json, rotated allowlisted logs and STOP_IF_IDLE. Busy lobby, playing room or reconnect wait refuses stop; stop gates new joins before yielding. No public management route or token logging. Existing tests exercise busy/reconnecting refusal, idle exit and disk failure. Re-run these tests in the development gate; do not install observer into the running process.

Current direct public.cjs process cannot expose in-memory room state without a process replacement. HTTPS health/HELLO are not idle evidence. Introducing the observer requires a later explicitly safe maintenance window after match/reconnect absence is established. Use the corresponding immutable frontend/API contract. Keep automaticRestart:false; do not substitute server/supervisor.cjs (that separate development mechanism restarts children). No Windows service/task registered.

The prior missing-listener observation is now classified as NOT_REPRODUCED, not a confirmed shutdown. Future observer exitCode/exitSignal and timestamped state-unavailable receipts will distinguish real exits from telemetry failures. Public366 availability is currently verified; development card compatibility still requires a later paired release.
