# SET5 territory route and armour basic completion

Printed scans349/352/354 on nonofficial fan host visually checked2026-10-28. Canonical source data remains the catalog; evidence is not a second runtime card catalog. Official SET5 QA: https://mushijingi.jimdofree.com/q-a-よくある質問-1/第５弾のカードについて/

| Card | Full printed mapping | Evidence |
| --- | --- | --- |
| 40 キマワリ | GREEN2 HP200, くいつく300, 木回り optional drawn territory→food | Own choice HAND/FOOD, not Tobidasu, current generated cost unchanged; trait suppression prevents route. Resolves before attack food-flip continuation |
| 43 メガボール | COLORLESS6 HP1200, 神の進撃1200; next entry-turn opponent spell damage/destruction protection | Target remains legal, movement/exchange remains legal; entry/later turns, own spells, attacks, suppression, controller change and JSON covered by related armour tests |
| 45 ゲンジボタル | COLORLESS2 HP400, 発光200; after opponent draws from this attack optionally reveal one own hidden food | Only hidden own food, optional decline, stale legality rejection, CPU and nested territory-route ordering/JSON |

`tests/set5-territory-armour-completion.test.js`9 cases verify all printed data/effects, canonical CPU summon→attack, real opposing damage and exchange, both optional route outcomes, and complete canonical40×45 chain through separate controllers and multiple full JSON restores. Existing `set5-next-turn-armour.test.js`6 and `set5-territory-food.test.js`5 retained.

Human: `set5-attack-effect-completion-human.cjs`expanded to42 checks per engine including all3 canonical summons/attacks. Existing `set5-human-paths.cjs`76 includes actual canonical40 route→45 selection and protected43 spell use. Basic path certification remains distinct from final AUDITED and physical iPhone Safari confirmation.

Status: SET5 36 PLAYABLE /14 PARTIAL /14 unconnected RESEARCHED. Total345/565 available locally. SET5-7 unresolved watcher question persists. No whole-SET Complete, SET6–8 implementation, main merge, push or Pages publication claimed. Per-card evidence in `scripts/set5-battle-evidence.js`, full565 inventory in `card-readiness.md`.

Latest gate: full1562/0, shared73/0, Human42 each engine plus existing Human76 at8b37a60, Toolbox13 per complementary deck each engine (offsets0/16 cover36 IDs), evidence integrity2/2, syntax/diff clean. Previous normal58/compact42/responsive4368 scopes remain separately documented; no fresh exhaustive UI gate inferred from this data/status-only change.
