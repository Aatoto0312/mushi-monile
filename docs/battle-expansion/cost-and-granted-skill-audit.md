# SET3 / SET4 / SET5 cost and granted-skill regression

2026-10-28. A newly reproduced cross-set correction, not a renewed all-card AUDITED certificate.

## Official evidence
- SET4 QA: https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F-1/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/ ; ネプチューンオオカブト entries specify that increases and reductions are summed first, then applied to printed cost. A cost2 ムカシトンボ with3 生きた化石 and1 威圧の大角 costs0. Engine previously returned1.
- The same official QA specifies that a printed cost5 トノサマバッタ granted とびだす by 飛蝗の待ち伏せ has two techniques and costs6 under 威圧の大角. Engine previously returned5.
- SET3 QA: https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F-1/%E7%AC%AC%EF%BC%93%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/ ; 飛蝗の待ち伏せ lasts until own territory is empty; replenishment after depletion does not restore it.
- Printed starter71/130 scan https://mushijingi.com/images/card/71.jpg (fan host, visually checked) confirms バッタ科 and existing printed cost5/HP1200/AP700. Added only the missing family metadata through the existing starter family field.

## Root causes / generic fixes
1. Individual cost modifier loops prematurely clamped negative intermediate values. Removed those intermediate floors; a single final floor0 remains after all intrinsic/global/runtime/next-use adjustments. Printed costs and generated availableCost are not overwritten.
2. Neptune used printed skill count only. Its metadata now explicitly requests minimumEffectiveSkills. The separate minimumPrintedSkills property retains its literal meaning for other definitions.
3. Granted territory skills were only recognized in drawn-card handling. Shared getGrantedTerritorySkillId now feeds drawn triggers, current technique count and field hasEffectiveSkill checks. Field visibility and keyword suppression guards remain in place.
4. Territory depletion through non-draw zone movement did not end the grant. The last territory leaving its zone now deactivates it through shared zone lifecycle; later replenishment cannot reactivate it. Cost queries remain read-only.

## Tests / review
- tests/cost-modifier-aggregation.test.js:11 tests. Initial5/6 failed for aggregation; additional granted technique/metadata3 failed and field-grant/depletion2 failed before their fixes. Includes canonical CPU zero-cost summon, hidden-food SET5 reductions with stacked increases, late runtime increases, suppression, JSON, printed cost immutability, actual granted starter entry and expired grant.
- tests/cost-modifier-human.cjs:10 per Chromium/WebKit. Portrait/landscape zero-cost canonical summon; actual Human use of SET3-60 then starter summon at6 cost under Neptune; already-granted field insect blocks another Tobidasu entry. No BODY overflow or fatal page error in these cases.
- Full1435/0 after changes. Independent read-only reviewer reran11 tests and independently checked read-only cost queries and grant restoration/depletion; no Important/Critical regression confirmed in the targeted diff.
- No USER_RULING or new unresolved ruling. SET5-17/19 remain PARTIAL until their individual basic path evidence is finished. Physical iPhone Safari and the whole565 final audit remain pending. Main/publication not changed.

## Shared metadata gate correction
- The initial cost checkpoint d0b0787 was created before its shared73 gate was inspected: the actual result then was69/3, not GREEN. It is an intermediate checkpoint, not a release candidate.
- The fixed historical fixture remains untouched. Runtime family metadata is now synchronized with shared starter-v1 identity metadata. A narrowly scoped OFFICIAL_METADATA_CORRECTION record describes only tonosamabatta/tags, exact old and new arrays, with the source. Snapshot comparisons still check every field of all24 cards; other card/field/family/additional-tag changes are not exempted.
- New negative tests check the exception boundary. Shadow runtime/common comparison still matches all24 with the original13 intentional display/catalog differences. After correction, freshly rerun full1435/0 and shared73/0. Independent reviewer reran shared73/0 and confirmed the exact exception does not mask unrelated differences.

Later card-level evidence for SET5-17/19 is now complete in set5-cost-partner-completion.md; their status changed from PARTIAL only after those additional tests/Human paths passed.
