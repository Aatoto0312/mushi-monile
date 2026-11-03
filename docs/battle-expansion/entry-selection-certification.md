# Entry-selection batch certification

Checked 2026-11-03. Base safe397 `0ac9db28e2b58ad7d4338191ac61a598acb363ee`; isolated branch `crossset-entry-20261103`. Development407/565 PLAYABLE (+10), remaining158. Public366 and protected372/388/397 candidates are separate and unchanged. PLAYABLE here is supported basic operation and automated evidence, not a claim of independent final AUDITED status.

## Card-by-card evidence
The ten individually enumerated records in `scripts/entry-selection-evidence.js` map printed text, source images, official rulings, direct Engine/CPU tests, room tests and Human browser scenarios. `entry-selection-progress.json` contains all565 statuses; its Markdown companion lists the ten names and remaining dependency groups. Definitions use explicit full-text guards, never a whole-set status promotion.

- SET7-049: own hidden food reveal; hidden identity is never needed to construct the choice.
- SET8-029: optional paid-entry concealment of an opponent's visible red/blue/green food.
- SET8-011: optional paid-entry destruction bounded by printed insect cost2.
- SET8-007: conditional entry600 damage requires a visible own discard CARD NAME containing 爆熱; technique/trait names do not qualify.
- SET8-005: optional paid-entry retrieval of a visible own discard enhancement whose CARD NAME contains 糸.
- SET8-015/016/018/022: optional paid-entry deployment of a Phalanx insect from own hand, bounded by the entering insect's PRINTED cost. Free entry does not chain the paid-entry trait.
- SET6-016: optional paid-entry revival of the exact printed adult name ゴクラクトリバネアゲハ. A different-name bearer of the effect still searches the fixed printed name. Revived adult can attack immediately; free revival does not chain its paid-entry trait.

## Sources
Official QA8: https://mushijingi.jimdofree.com/q-a-よくある質問-1/
Official QA6: https://mushijingi.jimdofree.com/q-a-よくある質問-1/第６弾のカードについて/
Official processing PDF linked from the Q&A: https://drive.google.com/file/d/1jPaT_zAKiF5J6hG9fiaSaJbfWco3934t/view
Printed card images were visually compared for all10; image IDs486,530,512,508,506,516,517,519,523,389 on mushijingi.com/images/card/ are supporting scans, not mislabeled official publisher hosting. Source URLs and card-level evidence are retained in the evidence module. Local knowledge is read-only and not committed.

## Generic changes and adversarial coverage
`getEntrySelectionCandidates` is shared by initial choices and resolution-time legality rechecks. Selectors cover face state, visible type/color/name, printed cost and required trait; identity-filtered hidden candidates fail closed. Resolution validates before mutation and supports face change, destruction and serial zone movement through existing entry lifecycle.

An immutable, JSON-safe entry receipt records normal summon/payment cause, field-entry serial and printed cost. Paid normal summon at zero still qualifies. Payment is committed before entry; declining a min0/max1 choice does not refund it. A source leaving the field does not erase its already-triggered independent choice. Free ability deployment records an ability cause and cannot qualify as paid entry. Future alternative-payment receipts are deliberately not generalized; none of these ten has its own alternative summon.

Entry dispatch is idempotent per genuine entry serial. A new red regression exposed face-down entry traits/watchers firing; the official processing PDF supports suppressing them. The serial is sealed before returning, so flipping face up does not fire a new entry. Actual reentry receives a new serial.

Tests cover stale/vanished targets, current suppression, hidden discard exclusion, printed versus modified cost, insufficient payment, decline, source departure, JSON with partially selected IDs, duplicate selections/actions, stale legal-operation IDs and actual reconnect during pending payment-related entry. Opponent/spectator projections contain no private pending candidates or hidden food identities. A test-authoring mismatch initially inspected an obsolete mutable state object; assertions now inspect authoritative room VIEW snapshots, matching the existing copy-on-action service.

## Fresh local gates
All following logs are outside Git under C:/Users/aatot/.codex/tmp/:
- `mushi-entry407-full-verified.log`:1794 passed/0 failed; previous1746 plus48 new tests. No existing test removed/skipped.
- `mushi-entry407-shared-final.log`:73/0.
- `mushi-entry407-server-deck-final.log`:92/0, including all10 authoritative two-player+spectator entry scenarios and mixed20-card new deck validation; PARTIAL rejection retained.
- `mushi-entry407-browser-after-guard.log`:4/0; Chromium/WebKit x CPU/online, ten card-specific flows each (40 total). Real use, legal candidate, selection, state result, details, attack and online pending reload/reconnect.
- `mushi-entry407-flow-final.log`:12/0; broad CPU/online completion, spectator/reconnect, saved decks, legacy fallback, configured WSS and responsive regression.
- `mushi-entry407-toolbox.log`:16 checks per engine, Chromium and WebKit; new ten cards included in a legal20-card deck, save and Battle handoff.

Browser WebKit is not physical iPhone verification. No physical device was operated. New-card tests48 comprise31 selector tests,10 Phalanx,4 Gokuraku and3 evidence-integrity tests; server/browser checks are additional.

## Isolation and release boundary
Original four provisional timing-hypothesis failures and the additional-cost-source-loss stop route remain isolated on the old unsafe branch. Their tests/expectations were not deleted, skipped or rewritten. The safe baseline full suite is green because those speculative paths were never imported. Protected attack resolver tail remains unchanged under a byte-hash regression test.

No main merge/push, public API restart, ngrok/config/authentication change or system setting change was performed. The407 frontend contract requires its matching API; do not mix it with public366. Match safety cannot be inferred from low usage. A later release must inspect active/reconnecting rooms and pair frontend/API safely.

## Follow-up priorities
See progress companion for refreshed overlapping dependency groups: paid deployment3, food/color11, entry effects16, attachment lifecycle25, destruction/replacement44. Prioritize SET5-44 existing growth trigger audit, SET8-45 form-relative adult deployment, SET6-3 legal enhancement+host selection, and SET7-9/SET6-33 entry stat effects. These are research candidates, not certified cards. Unproven rules remain pending rather than guessed.
