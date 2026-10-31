# Five SET5 Flee cards: basic completion evidence

2026-10-28. SET5-11 モンスズメバチ,14 トウキョウヒメハンミョウ,24 ヒメオオクワガタ,26 チビクワガタ,41 ヒメコガネ.

- All five printed scans visually checked: https://mushijingi.com/images/card/320.jpg ,323.jpg,333.jpg,335.jpg,350.jpg. These are fan-hosted scans, not official-hosted sources.
- Official SET5 QA: https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F-1/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/ ; にげる entries clarify continuous suppression takes priority, order-sensitive serial entry, opposing-turn Tobidasu entry, and face-up restoration is not a new entry.
- No new mechanic needed. All five definitions map their only passive to ON_OTHER_OWN_INSECT_ENTER / DESTROY_SELF. Each only has one ordinary attack with no additional effect.
- tests/set5-flee-completion.test.js:20 explicit card-level checks: fixed printed metadata/all skill and passive mappings, cost/payment/attack, later entry destruction, unaffordable rejection, suppression and canonical CPU summon/attack/next entry.
- Existing tests/set5-flee.test.js:10 adversarial shared cases including source/controller, captured-owner discard, hidden watcher, continuous suppression, simultaneous nested selection, JSON and serial SET1-116 entry ordering.
- tests/set5-flee-human.cjs:21 assertions per Chromium/WebKit; each canonical card summoned, attacked with printed AP, destroyed on a later own summon. Portrait/landscape BODY overflow and fatal JS checks included.
- Toolbox filters/handoff:13 per browser at325 total playable;20-card deck includes all16 newly available SET5 cards, with name limit respected. Full1424/0, shared72/0.
- Basic PLAYABLE certification is card-specific. No SET5 Complete or final AUDITED claim. Physical iPhone Safari verification remains unperformed. No USER_RULING or unresolved ruling introduced by these five cards.
