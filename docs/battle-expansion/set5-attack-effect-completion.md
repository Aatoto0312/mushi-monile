# SET5 attack-effect group basic completion

Printed scans visually checked2026-10-28 on nonofficial fan host `https://mushijingi.com/images/card/`:318 (9),321 (12),338 (29),342 (33). Official SET5 QA consulted: https://mushijingi.jimdofree.com/q-a-よくある質問-1/第５弾のカードについて/

| Card | Complete mapping | Card-specific evidence |
| --- | --- | --- |
| 9 ジバクアリ | RED2 HP100, かみつく300; 自爆粘液 marks the attack killer for next-damage destruction, including zero | next-damage tests cover nonattack exclusion, persistent resolved marker, leaving field, replacement consumption; attack-kill growth audit covers attack-origin destruction classification. Canonical Human attack/death/territory path retained |
| 12 ムツトゲイセキグモ | RED2 HP300, かむ200 / 投げ縄0, once per field stay; target prohibited next turn independently of source | both techniques, CPU first and second choice, zero damage, usage and restriction through full JSON, source leave, field-reentry reset and expiry |
| 29 リーガルモス（幼虫） | GREEN6 HP1400, 神の大喰らい1100; after completed attack +300HP/AP until field leave | damage uses original AP; preserves injury deficit, stacks without arbitrary cap, JSON, suppression, waits territory choice, rejects old field stay, CPU and canonical Human growth |
| 33 クサキリ | GREEN4 HP800, かみちぎる500 / 草切り900; sacrifice one own food for second technique | both attacks, no-food legality, visible/hidden food, generated cost unchanged, stale/invalid costs, JSON, CPU and actual Human food choice. Cross-set stale attack bug fixed separately in5db74ac |

## Quality evidence

- `tests/set5-attack-effect-completion.test.js`14 cases: printed metadata/all techniques, canonical CPU exact-cost summon→attack for each card, insufficient-cost unchanged state, every attack and shared pending decisions, canonical delayed growth and Lasso JSON.
- Related focused tests in `scripts/set5-battle-evidence.js`: next-damage5, Lasso3, growth4, food-cost4, attack-cost-stay8 and attack-kill cross-set14. Existing suites retained.
- `tests/set5-attack-effect-completion-human.cjs`30 checks per Chromium/WebKit: canonical summon, every technique, actual cost choice with hidden identity protection, full selection restore, exact damage/modifiers/usage/restriction and BODY fit in portrait/landscape. Initial harness incorrectly expected a technique picker when only the no-cost first technique was legal; it was corrected to exercise the existing automatic selection. Expected state outcomes were retained.
- `tests/set5-evidence-integrity.test.js`2 cases: runtime availability exactly matches individual evidence identities; channel files and source metadata exist/match. It detected and corrected one mistaken filename in the new draft evidence. This verifies links, not the correctness of the tests themselves or final AUDITED status.

## Status

SET5:33 PLAYABLE /17 PARTIAL /14 RESEARCHED without Battle definitions; total342/565 available locally. Individual records are separate in `scripts/set5-battle-evidence.js`; no blanket SET certification. SET5-7 remains PARTIAL with an explicit unanswered condition-timing ruling. No USER_RULING, SET Complete, final AUDITED, main merge/push or Pages update. SET6–8 still require implementation. Real iPhone Safari review remains outstanding.

Latest gate: full1553/0, shared73/0; new Human30 and existing Human76 each engine; Toolbox13 per deck each engine (offsets0/13 cover all33 SET5 available IDs); syntax/diff clean. Normal58/compact42 and responsive4368 each engine are documented at d12a855, with compact42 rerun at5db74ac; this checkpoint changes card status/evidence/tests only.
