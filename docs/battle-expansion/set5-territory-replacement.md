# SET5-38 territory replacement evidence

2026-10-28. This is card-level basic playability, not a SET completion or final AUDITED certificate.

- Printed scan: https://mushijingi.com/images/card/347.jpg (nonofficial host; visually checked). Cost2 GREEN HP200, くいつく300, 毒霧防御.
- Official ruling: https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F-1/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/ ; オオキンカメムシ entries: independent of Tobidasu suppression, mandatory replacement of the next territory draw.
- Reused OPTIONAL_SELF_DRAW_DESTINATION for a face-up TERRITORY destination. The serialized decision carries the actual routing metadata. No card-name branch.
- Resolving the route installs a next-draw replacement and current end-turn discard. These already-resolved effects survive trait suppression. Leaving territory clears the flags.
- Replacement is applied before draw selection, so it does not reveal another card, fire onTerritoryDraw, or run attack effects contingent on an actual territory draw. Remaining attack continuation still completes.
- Territory return/removal preserves field HP deficits under continuous maximum HP changes. Expiry is integrated into serial end-turn processing, not a new turn loop.
- tests/set5-territory-replacement.test.js:14 tests (initial6 failures reproduced before implementation, plus canonical payment/attack/CPU, invalid value, last territory, JSON and attack continuation cases).
- tests/set5-territory-replacement-human.cjs:11 assertions per Chromium/WebKit; canonical summon/attack and actual attack→territory picker→destination choice→mandatory replacement, portrait and landscape without BODY vertical overflow.
- tests/set5-toolbox-handoff.cjs:9 certified SET5 cards plus starter cards form a legal20-card deck and start CPU Battle. PARTIAL36 and UNAVAILABLE19 are verified separately.
- No USER_RULING introduced. General ordering of unrelated simultaneous end-step effects is not certified by this isolated evidence. Physical iPhone Safari review and whole-project final audit remain pending.
