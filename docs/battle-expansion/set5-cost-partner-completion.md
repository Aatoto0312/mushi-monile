# SET5-17 /19 /22 /23 basic completion evidence

2026-10-28. Per-card basic PLAYABLE certification; final AUDITED and SET5 Complete remain pending.

- SET5-17 タランドゥス オオツヤクワガタ: cost5 BLUE HP1100, オオアゴバサミ800, 漆塗り reduces cost once per2 opposing hidden food.
- SET5-19 カラスアゲハ: cost4 BLUE HP800, すいつくす500, 鴉塗り has the same cost mechanic.
- SET5-22 ベニシタバ /23 キシタバ: each cost3 BLUE HP600, すする300. 紅翅/黄翅 grants600AP while the named opposite partner is visibly on the current controller's field; additional copies do not stack the condition.
- Printed scans326.jpg,328.jpg,331.jpg,332.jpg on https://mushijingi.com/images/card/ were visually checked; fan-hosted provenance is explicit. No additional printed skills/effects omitted.
- tests/set5-cost-partner-completion.test.js:16 card-specific tests for fixed metadata and complete mappings, canonical CPU summon/attack/payment, insufficient generated cost despite plentiful food, printed cost immutability, discount floor/pair boundaries, no hidden identity access, suppression, partner visibility and capture/controller after JSON restore.
- Shared regressions include tests/set5-count-mechanics.test.js, tests/set5-partner.test.js and tests/cost-modifier-aggregation.test.js. The last suite exposed and fixed actual SET3/SET4/Starter cross-regressions; see cost-and-granted-skill-audit.md for official sources and failed-first evidence.
- tests/set5-cost-partner-human.cjs:17 assertions each Chromium/WebKit, four canonical summons, cost payment, attacks using current AP, portrait/landscape overflow and fatal error checks.
- Toolbox/handoff13 per browser verifies all20 certified SET5 cards form a legal20-card deck and start CPU Battle. Catalog565, available329, SET5 PLAYABLE20 /PARTIAL27 /UNAVAILABLE17.
- Full1451/0 and shared73/0 after changes. No USER_RULING or new unresolved ruling. Physical iPhone Safari remains unverified; no main merge, push or Pages change.
