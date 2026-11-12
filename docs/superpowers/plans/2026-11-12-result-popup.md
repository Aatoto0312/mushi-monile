# Battle result popup implementation plan

Goal: show the authoritative result once in CPU/online, legacy/A v2, while retaining the final board.

Architecture: a shared dialog and bounded per-tab presentation ledger; small CPU and online UI adapters. No Engine, protocol, room or deck changes. Online rematch is unsupported: the button explains this and enters the existing confirmed LEAVE flow, after which users create/join a new room. Spectators cannot request a rematch.

Alternatives: four mode-specific dialogs duplicate lifecycle bugs; a new rematch protocol exceeds scope. Use one presentation component, retaining existing replay/menu transitions.

- [ ] Add failing unit tests for viewer-relative labels, unknown results and per-match deduplication, including JSON/session restoration and unavailable storage.
- [ ] Implement `battle-ui/result-popup.js` and `.css`, with board/reopen/replay/menu actions, focus handling and reduced motion.
- [ ] Integrate CPU via `cpu-result.js`; preserve tutorials, reset identity on each new game, suppress the old CPU overlay only when the shared UI owns the result.
- [ ] Integrate online/client.js using only ENDED + room.result; preserve final state, explicit LEAVE confirmation and reconnect/session deduplication.
- [ ] Browser tests: real CPU completion plus controlled authoritative end fixtures for win/loss/draw; online two seats + spectator, resign/reconnect/JSON/no actions, both UIs, SE3, board/details/scroll/reopen/replay/menu.
- [ ] Run full/shared/server regression and Chromium/WebKit; capture screenshots, update the candidate manifest, create a draft PR only.

Review focus: missing winner is not a fabricated win; result dismissal survives rerenders/reconnect/UI switch; new games get a new identity; ended board remains inspectable but read-only; disconnect does not block board inspection or cause duplicate requests.
