# SET5-30 activated field ability

Printed source: https://mushijingi.com/images/card/339.jpg (nonofficial host, visual check2026-10-28). GREEN5 HP1100, かぶりつく700, 単為生殖: deploy a same-name own hand insect while source is in field; incoming insect cannot attack this turn.

Official source: https://mushijingi.jimdofree.com/q-a-よくある質問-1/第５弾のカードについて/ (green insects). Own turn only; ordinary card cost is not paid. The resolved entry-turn restriction remains after source loses its trait. No user ruling or extrapolated unknown ruling used.

## Generic implementation

- `ACTIVATED_FIELD` + `DEPLOY_MATCHING_HAND_INSECT` data. No card-name/id branch in Engine, UI or CPU.
- Engine action query checks active MAIN player, current source field membership, visible and unsuppressed trait, runtime availability and matching playable own-hand insects. Already attacked sources can activate.
- Optional0..1 `CARD_SELECTION` retains source field-entry identity, turn, ability index and player. Completion checks live legality before any move. Invalid source/target rejects without movement; decline is always available. CPU rebuilds live candidate IDs and declines an impossible stale optional choice.
- Existing `SERIAL_ZONE_MOVES` installs independent current-turn prohibition before field-entry triggers. Normal entry effects, Flee and nested decisions are shared, not recreated by UI.
- UI only adds an ability/attack detail menu when Engine returns actions. Existing cards keep ordinary field tap behavior. CPU queries identical legality and prefers the free action before spending cost on an ordinary same-name summon.

## Evidence

`tests/set5-activated-field-ability.test.js`:13 cases, failed-first API/CPU tests0/10 before implementation. Covers own/opponent hand separation, zero cost, decline, wrong phase/player, owner/controller, hidden/suppressed source, attacked source, serial Flee, source reentry/controller loss, stale target, duplicate rejection, selected-card JSON restore, nested entry-choice restore, independent restriction after source departure/keyword loss and later-turn availability. Canonical full metadata, ordinary CPU summon, free deployment and actual700 attack also tested.

`tests/set5-activated-field-ability-human.cjs`:15 checks per Chromium/WebKit. Real canonical summon→source tap→ability menu→legal own-hand candidate→optional cancel/use→JSON restoration→state. Attack-menu branch and ability after attacking, child prohibited even after trait loss, portrait/landscape no BODY overflow.

Independent read-only reviewer reran the11-case earlier suite and inspected live legality, source stay, serial entry, CPU and UI routing; no Important/Critical issue confirmed. Two additional serialization/nested-entry cases and menu-attack Human checks were added afterward and run locally.

## Status boundary

SET5-30 has individual basic PLAYABLE evidence; final AUDITED remains pending. SET5 now29 PLAYABLE /21 PARTIAL /14 unconnected. One unresolved separate watcher ruling remains for SET5-7. SET6–8 untouched. Existing published main remains2ea76fa; no SET5 Complete or public release claim. Physical iPhone Safari confirmation remains necessary.

Final checkpoint gate: full1529/0, shared73/0, normal58/compact42 per engine, responsive4368 per engine, Human15 per engine, Toolbox13 per complementary deck per engine (offsets0/9 cover29 IDs), syntax/diff clean. Chromium responsive first run hit a local server ECONNREFUSED during intercepted CSS fetch; server was still listening. Rerun against a separate loopback server127.0.0.1:8768 with128 request backlog passed unchanged test/code. Exact transient cause is not proven; no product failure or test weakening inferred.
