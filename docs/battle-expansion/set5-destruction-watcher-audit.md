# SET5-07 destruction watcher: provisional implementation

2026-10-28. Canonical card remains PARTIAL. This document is not PLAYABLE or AUDITED certification.

## Confirmed specification
- Printed scan https://mushijingi.com/images/card/316.jpg (fan host) visually checked: アシナガグモ, cost3 RED HP500, かむ300, 捕食. Another insect on its controller's field being destroyed by an insect attack makes the opponent draw one territory.
- Official SET5 QA https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F-1/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/ explicitly confirms two watchers cause two opposing territory draws. Shared official simultaneous-effect rules permit same-controller ordering.

## Generic implementation / verified behavior
- ON_OTHER_OWN_INSECT_DESTROYED + DESTROYED_BY_ATTACK + DRAW_OPPONENT_TERRITORY, without card-ID/name Engine branching.
- Snapshot current-controller visible/unsuppressed watchers before confirmed field leave, after destruction replacement. Self/hidden/effect destruction does not create this attack-only watcher event.
- Watcher effects remain queued if the source later leaves. A separate field watcher is not cancelled by moving the defeated corpse to deck and suppressing its own death effect.
- Resolve attacker-side kill work first, then order the defender's host/attachment/watcher work. Each opposing territory draw completely resolves its choice/Tobidasu/continuations before the next, then the original defeated player's territory followup runs.
- Optional generic trigger dependencies prevent AFTER_ATTACHMENT_TRIGGERS host recovery from running before attachment death work. Dependency eligibility is checked when displaying and resolving order choices. Legacy queues without dependencies retain previous behavior.
- tests/set5-destruction-watchers.test.js:14 tests. Initial8/10 failures preceded implementation. Covers one/two watchers, JSON/Tobidasu, ownership/controller, suppression/replacement, independent queued work, host territory suppression, Banner interaction, dependency order/Hariganemushi/Dragonfly, CPU completion, canonical printed mapping and explicit non-PLAYABLE gating.
- tests/all-card-readiness.test.js adds a failed-first check that unresolved questions are visible and provisional wiring does not become certification.
- tests/set5-destruction-watchers-human.cjs:10 assertions each Chromium/WebKit in explicit provisional field fixtures. Actual attack→order choice→two serialized own territory choices→opponent territory, optional territory suppression, JSON, no hidden opponent hand face text, no BODY overflow/fatal error. This does not claim ordinary-deck deployment for the gated canonical card.
- Independent read-only reviewer reran watcher11/11 and nested territory suppression3/3; no Important/Critical implementation issue confirmed. Reviewer explicitly declined to settle the unresolved ruling.

## Unresolved condition timing
scripts/set5-ruling-questions.json records SET5-WATCHER-CONDITION-TIMING-001. With opponent hand4, Adansonhaetori destruction and Predation are simultaneous. Whether Predation's draw to5 can enable Flycatcher depends on when the threshold condition is tested. Official SET3/SET5/general/rule QA, local KB and maintained fan sources searched did not establish this exact rule. Existing generic code rechecks when resolving; that is provisional behavior, not a ruling.

No guessed expected-result test was added for that disputed case. SET5-7 remains PARTIAL; CPU/deck availability is explicitly rejected. Follow later SET rulings and revisit in Final Audit. No USER_RULING exists.

## Gate / remaining work
Full1496/0, shared73/0, provisional Human10 per engine; all-card report exposes the open question. Catalog565, declared playable334; SET5 PLAYABLE25 /PARTIAL24 /unconnected15. No SET5 Complete, main integration, push or Pages update. Physical iPhone Safari remains unverified.
