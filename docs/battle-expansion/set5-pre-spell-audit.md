# SET5-37 / 39 pre-spell event audit

2026-10-28. Current-runtime basic PLAYABLE evidence, not a SET Complete or final AUDITED certificate.

## Sources
- Official SET5 Q&A: https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F-1/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/ ; 未熟 entries require destruction before spell damage, no target reselection, and triggering on targetless spells. Intercept spells also count.
- Fan-hosted printed scans346.jpg /348.jpg at https://mushijingi.com/images/card/ ; visually checked. Both cost2 GREEN. SET5-37 HP500/AP400; SET5-39 HP700/AP200. Only passive 未熟; ordinary attack かじる.
- No USER_RULING introduced.

## Shared Engine changes
- Spell validation and all chosen combination constraints precede payment and spell-use events. Payment→HAND/RESOLVING→ordered self-destruction triggers→committed spell resolution/finalization.
- Existing serializable ORDER_TRIGGER_CONTINUATIONS carries multiple same-controller events. A nested pending choice delays subsequent destruction and the paid spell. Controller/face-down/keyword suppression checked when the spell-use event happens.
- Committed targets include zone/controller/field-entry identity. Attachments include host identity. Departed/re-entered or lost atomic exchange/attachment targets fizzle; no new target is chosen and no payment refund occurs.
- Printed-color partitions and same-printed-cost pairs are Engine selection metadata. Human confirmation and CPU consume those legal combinations; CPU's old transfer-specific host override was removed.
- Shared transfer legality now excludes current host, foreign/face-down/full-limit hosts and copy enhancements with no source. Selection candidates and transfer execution use the same helper.

## Adversarial review and corrections
Independent read-only review reproduced three Important errors despite earlier passing focused tests:
1. Mixed-color SET1-116 choices caused free larva destruction before a late error/refund.
2. SET1-128 attached targets were absent from committed snapshots, causing a late error/refund after self-destruction.
3. SET1-104 attachment/current-host pair passed group checks then errored after self-destruction.

Each reproduction was added before its fix. Same-cost invalid exchange was independently checked too. Reviewer reran the transfer reproduction and found no further confirmed Important/Critical issue in the targeted review; this is not release certification.

## Evidence
- tests/set5-pre-spell-triggers.test.js:19 tests covering damage order/cause, targetless spells, paid fizzle, suppression/hidden/controller, order selection JSON restore, CPU resolution, destruction replacement, field/food exchange fizzle, invalid pairs, same-color partitions and canonical metadata/summon/attack/CPU.
- tests/set5-pre-spell-human.cjs:13 assertions in each Chromium/WebKit, canonical spell targeting and same-controller trigger order plus both canonical summons/attacks. Portrait/landscape overflow and fatal JS checks included.
- Attachment Human regression10 per browser; SET5 Toolbox handoff13 per browser, legal20-card deck containing all11 newly available SET5 cards. Full1404/0 and shared72/0 after production changes.

## Remaining audit scope
- Physical iPhone Safari testing is unperformed. Whole565 final audit remains pending.
- SET5 territory-intercept spells are not wired yet. Their eventual invocation must enter this same spell-use pipeline; that future interaction is not claimed as implemented today.
- Expiry of unrelated independent effects, future restrictions and all possible multi-effect stale-target combinations remain broader cross-card audit scope. This focused work does not certify all SET5 cards.
