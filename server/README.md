# Local online beta development

Node24+ is required. This branch is not deployed. Production endpoint is disabled in `online/config.json`. No tunnel or Windows task is installed by these commands.

## Browser development

Inspect listening ports8787/8788 before starting. From the repository root:

```powershell
npm run dev --prefix server
```

It serves the local frontend at `http://127.0.0.1:8788/online.html` and loopback WS at `ws://127.0.0.1:8787/ws`. A conflict fails instead of choosing an undocumented port or stopping other software. Public assets only; the API never serves repository files. Use two tabs, create/join a code, choose different starter decks, ready. Existing Toolbox saved decks are read using its existing storage key on the same origin. Server validates every deck again.

## Local API supervision

Stop the development server first so its API port does not conflict. In a dedicated terminal:

```powershell
node server/supervisor.cjs
```

The supervisor owns and restarts only its API child. It does not start an external tunnel. Default API8787; management8789, both loopback. Child failures get capped exponential restart delays. Supervisor failure recovery requires the future approved Windows boot task; no task is registered here.

```powershell
node server/operations.cjs status
node server/operations.cjs logs
node server/operations.cjs stop
```

Local operations credentials and rotating redacted logs are stored under `%LOCALAPPDATA%\MushijingiOnlineBeta`, outside Git. Never send `operations.local.json` to a debugger or publish it. The management port must never be tunneled. File mode0600 is not a Windows ACL guarantee: approved deployment must verify/restrict Windows file permissions before exposure. Stop is an authenticated local HTTP request; no process-name or global PID killing. The foreground supervisor can also be stopped with Ctrl+C. Stop waits for its own child, with a5-second timeout. API and supervisor have separate writer directories to avoid cross-process rotation races: `logs/api` and `logs/supervisor`, at most five1MiB files each,10MiB total; newest file in each is `online.0.jsonl`.

## Tests

```powershell
npm test --prefix server
node tests/run-all.js
node tests/run-shared.js
$env:MUSHI_PLAYWRIGHT_PATH = 'absolute path to an existing Playwright installation'
npm run test:browser --prefix server
```

Browser test dependencies are external/test-only, consistent with existing repository browser scripts. Browser tests own and close their test servers on8787/8788; do not run alongside a development server. Unit/WS tests use ephemeral ports. Optional `MUSHI_ONLINE_SHOTS` saves screenshots outside the checkout. Chromium uses installed Edge; WebKit uses the installed Playwright WebKit runtime.

After any Engine/card source change, regenerate `online/contract.json` with `npm run contract --prefix server`; browser and server versions must match exactly. Static public configuration accepts only an exact WSS host in production. Query strings/storage cannot override the backend.

## Unattended installation / public use

See `../docs/online-beta/windows-unattended.md` and hosting-research.md. Boot before sign-in is required, but Windows task/credential/ACL/tunnel/system changes still need separate approval. Tailscale, Remote Desktop and power settings must remain unchanged. Physical iPhone/Android, external WSS and genuine no-sign-in reboot tests are not implied by browser tests. Server restart aborts old matches; it does not restore an in-flight game.
