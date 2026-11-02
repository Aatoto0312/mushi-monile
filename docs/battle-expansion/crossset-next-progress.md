# Cross-set next batch

Catalog565; public366, frozen372e93b373, currentdevelopment388. This is separate from oldunsafe388 branch.

|SET|PLAYABLE|PARTIAL|Unconnected|
|---|---:|---:|---:|
|STARTER|24|0|0|
|BOOSTER_SET_1|106|0|0|
|BOOSTER_SET_2|55|0|0|
|BOOSTER_SET_3|60|0|0|
|BOOSTER_SET_4|64|0|0|
|BOOSTER_SET_5|36|14|14|
|BOOSTER_SET_6|14|0|50|
|BOOSTER_SET_7|20|0|44|
|BOOSTER_SET_8|9|0|55|

## This batch
|ID|Card|Status|
|---|---|---|
|set7_031|ニホンミツバチ|PLAYABLE|
|set6_006|ツシマカブリモドキ|PLAYABLE|
|set6_018|フェイスタメルシワバネクワガタ|PLAYABLE|
|set6_021|チリクワガタ|PLAYABLE|
|set7_015|キカマキリモドキ|PLAYABLE|
|set7_017|マルスゾウカブト|PLAYABLE|
|set7_018|アルキデスヒラタクワガタ|PLAYABLE|
|set7_028|オキピタリスノコギリクワガタ|PLAYABLE|
|set7_042|クビキリギス|PLAYABLE|
|set7_006|アオオサムシ|PLAYABLE|
|set7_019|ニシキオオツバメガ|PLAYABLE|
|set7_033|オオルリタマムシ|PLAYABLE|
|set7_021|オオムラサキ|PLAYABLE|
|set7_029|コムラサキ|PLAYABLE|
|set7_010|ナツアカネ|PLAYABLE|
|set8_014|ニホンカワトンボ|PLAYABLE|

Pending177; counts{"LOCAL22":16,"C":155,"D":6,"UNASSESSED":0}. Prior C classification is advisory, not a certification gate. All565 statusrows, dependencies and refreshed search candidates in crossset-next-progress.json.

## Newly available primitives and next research
Printed-cost target bounds / damaged target / current color; visible discard minimum; distinct faceup insectfood colors / hiddenfoodper2 / visible namedally / opponentbluefood singlethreshold. Existing family AP and hand-return compose into SET7-31 without a newresolver. Re-search matches are not complete mappings: every remaining printed clause, source and CPU/WSS/restore decision still requires proof.

|Remaining mechanic group|Primary|Dependent|
|---|---:|---:|
|zone-serial-and-exchange|10|76|
|destruction-and-replacement|5|44|
|selection-and-candidates|67|71|
|hidden-info-and-face-down|2|44|
|territory-and-combat-order|1|22|
|usage-and-additional-cost|13|36|
|attachment-lifecycle|11|40|
|attack-and-payment-sequence|1|53|
|entry-and-duration|16|57|
|global-trait-and-grants|1|12|
|continuous-hp-ap|7|13|
|target-legality|16|16|
|filtered-discard|0|0|
|new-composition-research|5|5|
- set6_059 小蠅の落とし子: TARGET_PRINTED_COST; remaining target-legality, selection-and-candidates, zone-serial-and-exchange
- set7_063 常闇の繭籠もり: FOOD_COLOR_COST; remaining selection-and-candidates, zone-serial-and-exchange
- set8_003 トゲアクマツユムシ: TARGET_HAS_ATTACHMENT; remaining selection-and-candidates, usage-and-additional-cost, attachment-lifecycle, zone-serial-and-exchange, destruction-and-replacement, attack-and-payment-sequence
- set8_011 イエロージャイアントヒヨケムシ: TARGET_PRINTED_COST; remaining selection-and-candidates, usage-and-additional-cost, entry-and-duration, zone-serial-and-exchange, destruction-and-replacement, attack-and-payment-sequence
- set8_030 パンダアリバチ: TARGET_DAMAGED, TARGET_COLOR; remaining target-legality, destruction-and-replacement, territory-and-combat-order, attack-and-payment-sequence
- set8_053 傀儡の冬虫夏草: TARGET_PRINTED_COST; remaining selection-and-candidates, entry-and-duration, attachment-lifecycle, zone-serial-and-exchange, destruction-and-replacement, global-trait-and-grants

## Explicit holds
SET7-22 field-count interaction was not independently verified in this batch, remains unconnected. Original4 timing hypotheses and paid-cost source-loss path remain on olddevelopment branch and are not imported. PublicAPI/ngrok/main unchanged; live match absence not assumed.
