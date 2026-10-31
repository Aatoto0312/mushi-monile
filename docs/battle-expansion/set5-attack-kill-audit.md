# SET5-31 and shared attacker kill-effect ordering

2026-10-28. Basic card certification, not a SET5 Complete or final all-card AUDITED claim.

## Sources
- Fan-hosted printed scan https://mushijingi.com/images/card/340.jpg visually checked: フィジーオオウスバカミキリ, cost5 GREEN HP1200, 力のキバ700, no passive. Confirmed opponent insect destruction by this attack adds200HP/AP until source leaves field.
- Official SET5 QA https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F-1/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/ : no growth if a destruction replacement saves the insect; destruction caused by the next-damage mark still qualifies when caused by this insect attack.
- Official general QA https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F-1/ and SET6/7 QA: simultaneous destruction effects prioritize the turn player's effects and same-controller resolution order is selectable. No USER_RULING introduced.

## Generic implementation
- GROW_ON_ATTACK_KILL is separate from SET5-29's after-entire-attack growth. It fires on confirmed opponent attack destruction, before defender death choices/territory followup; not on direct attacks, nonlethal damage or destruction replacement.
- Snapshot attacker skill/enhancement kill effects before target leaves field. Serialized ORDER_ATTACK_KILL_EFFECTS stores one shared event context and remaining descriptors. Choices execute one effect completely, including nested pending selection, before the next.
- Supported jobs: capture, growth, bottom-deck movement, opponent-chosen additional destruction. Candidate targets rebuild on resolution. Labels come from actual skill/enhancement metadata; no card ID/name switch.
- Existing CAPTURE_FIRST/BOTTOM_FIRST values and SIMULTANEOUS_EFFECT_ORDER remain compatible. Legacy saved contexts without the new queue retain their previous continuation handler.
- A confirmed target movement consumes the original destroyed object. Capture→entry→self-destruction no longer lets a later Banner job pick up the newly destroyed insect just because it has the same instance ID. An explicit failed-first regression covers the owner/controller outcome.
- Growth preserves damage deficit, stacks, survives loss of traits as an already-resolved modifier, clears on field leave, and checks field-entry serial when delayed behind another effect.

## Evidence
- tests/set5-attack-kill-growth.test.js:14 tests, including initial6 failed-before-fix growth/order cases; both growth/Scythe orders, nested target choice after JSON, stale source reentry, original capture/banner orders after JSON, destruction replacement, next-damage curse, captured reentry/self-destruction, canonical metadata and CPU summon/attack/payment.
- tests/set5-attack-kill-human.cjs:11 per Chromium/WebKit: canonical paid summon/attack/growth and both same-controller orders, JSON restore during opponent target selection, portrait/landscape no BODY overflow and no fatal error. Exactly-one target selection auto-completes; no extra Turn End action is issued by the test.
- Existing adversarial SET2–SET4 tests5/5 retained. Independent reviewer reran queue7/7, then consumed-target expansion10/10 and old adversarial5/5; no Important/Critical issue confirmed in those targeted reviews. This is not all-card certification.
- Full1465/0, shared73/0 after production changes. Toolbox/handoff13 per deck per browser uses two complementary legal20-card decks to cover all21 currently available SET5 cards;565 catalog,330 available,27 SET5 PARTIAL,16 unavailable.
- Physical iPhone Safari and all565 final audit remain unperformed. Main/origin/publication unchanged.

Broader browser regression on this snapshot: normal58, compact42, SET4 audit Human3, existing SET5 Human76 and end-turn Human10, each Chromium/WebKit. The exhaustive responsive matrix was not repeated for this internal Engine-only checkpoint; new Human cases explicitly verify portrait/landscape BODY overflow.
