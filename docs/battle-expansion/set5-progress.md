# SET5 foundation progress — not a completion certificate

Baseline: `2ea76fad5f419037122d7b24a71a784117fbe385`.
Work branch: `battle-set5-set7`. Main and origin/main remain at baseline.

## Status

- SET5 pre-implementation classification: 64 records (A4 / B31 / C25 / D4).
- Definitions connected: 50 (1,2,3,4,5,6,7,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,35,36,37,38,39,40,41,43,44,45,46,47,56,57,60,62,63,64).
- SET5: PLAYABLE 36, PARTIAL 14, remaining 14 catalog RESEARCHED.
- Open ruling: SET5-WATCHER-CONDITION-TIMING-001 (SET5-7 remains PARTIAL); see scripts/set5-ruling-questions.json.
- No SET5 completion certification, no SET6/7 implementation, no SET8 Battle change.
- Released playable count remains 309 / 565.

The machine-readable planning matrix is `set5-mechanic-matrix.json`. Its classifications are provisional engineering estimates. They do not establish correct rules or release readiness.

## Implemented mechanisms and evidence

| Mechanism / cards | Focused evidence | Outstanding release evidence |
|---|---|---|
| Vanilla 4,10,20,36 | `tests/set5-definitions.test.js` | card-specific summon/attack Human/CPU completion audit |
| Source attachment requirement / 1 | `set5-attack-legality.test.js`, `set5-cpu-legality.test.js` | Human action selection, copied skills and cross-set interactions |
| Red food dynamic AP / 2 | `set5-count-mechanics.test.js` | complete card Human/CPU audit |
| Entry offering / 3 | `set5-entry-offering.test.js`, `set5-human-paths.cjs` | serial-entry and destruction interactions, complete source verification |
| Optional blue entry + poison / 5 | `set5-blue-head.test.js`, `set5-human-paths.cjs` | whole-card summon audit and further attachment interactions |
| Next-damage destruction / 9 | `set5-next-damage.test.js`, `set5-human-paths.cjs` | damage prevention distinctions and full CPU attack audit |
| Once-per-stay lasso / 12 | `set5-lasso.test.js` | card-specific Human skill selection and complete ruling review |
| Entry-turn continuous restriction / 15 | `set5-king.test.js`, `set5-cpu-legality.test.js` | real summon/controller-change Human path |
| Hidden opponent food cost reduction / 17,19 | `set5-count-mechanics.test.js` | card-specific summon cost and Human/CPU evidence |
| Exactly two attack targets / 21 | `set5-attack-legality.test.js` | complete two-hit Human/CPU, target loss and restore |
| Reciprocal continuous AP / 22,23 | `set5-partner.test.js` | full Human/CPU paths and continuous HP/AP interaction audit |
| Spell target immunity / 28 | `set5-attack-legality.test.js` | full spell-use rejection and cross-zone audit |
| Food additional attack cost / 33 | `set5-food-cost.test.js`, `set5-human-paths.cjs` | full summon/attack card evidence, SET1 shared-food-cost Human audit |
| Printed zero-cost enhancement entry recovery / 35 | `set5-entry-retrieval.test.js` | Human summon/recovery and exchange/discard lifecycle interaction |
| Territory-after-acquisition cost / 25 | `set5-territory-food.test.js` | complete card Human/CPU decision evidence |
| Optional visible blue food concealment / 27 | `set5-territory-food.test.js` | two-target Human path and cross-set territory/jump-out effects |
| Optional hidden food reveal / 45 | `set5-territory-food.test.js`, `set5-human-paths.cjs` | complete card summon/CPU attack evidence |
| Other-own-enter self destruction / 11,14,24,26,41 | `set5-flee.test.js`, `set5-human-paths.cjs` | all five canonical cards' complete summon/attack Human/CPU paths; broader suppression and reattachment interactions |
| Persistent after-attack growth / 29 | `set5-after-attack-growth.test.js`, `set5-human-paths.cjs` | complete canonical-card turn path and immediate extra-attack interactions |

Entry watchers use a reusable `ORDER_TRIGGER_CONTINUATIONS` work queue, not a card-name branch. The player chooses among simultaneous triggers belonging to their controller; active-player controller work has priority. A chosen trigger fully resolves its nested selection before the queue advances. The dispatcher currently serves the entry-watcher event; it does not claim to replace every older destruction-trigger path.

`runtimeFlags.fieldEntrySerial` records a new field stay while preserving compatibility with older instances (missing value is zero). Deferred self-destruction/growth records the stay in which it originated, so it cannot act on the same instance after it left and re-entered. The value survives JSON restoration through existing runtimeFlags serialization.

## Independently reproduced existing defects

1. Captured dynamic AP insect used the owner's zones, not its current controller's zones. `dynamic-ap-controller.test.js` failed before the generic field-controller fix; both scenarios now pass, including JSON restoration.
2. Food-count dynamic AP used printed color, ignoring a current color override. The SET5 count test failed before the effective-color fix.
3. Intrinsic cost-reduction traits kept applying under global keyword suppression. The cross-set test failed on SET3-2; explicit `requiresKeywordTrait` metadata and the shared cost evaluator now cover SET3, SET4 and SET5 discounts.
4. Mandatory food attack cost had no selection initiation when Human/CPU called the attack without an explicit food ID. The engine now opens a shared cost selection before payment/damage. Existing generated available cost is preserved when food moves to discard. A two-food boundary regression also verifies that the shared selection consumes every selected food, rather than only the first ID.
5. The food inspector and food click handler unconditionally blocked facedown cards, even when Engine selection explicitly allowed them. Both UI layers now allow Engine-whitelisted IDs while retaining anonymous backs and suppressing detail access. The production Human regression first failed on the disabled facedown cost button, then passed after the fix.

These fixes do not certify all previous cards independently. They add narrowly scoped regression evidence.

## Rule references

- [Official SET5 Q&A](https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F-1/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/): offering may be declined with self destruction; King is continuous and stops when its trait is lost; copied Devil Eye still requires an attachment.
- [Official SET4 Q&A](https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F-1/%E7%AC%AC%EF%BC%94%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/): Kuchinashi applies to insects in hand and other zones; resolved delayed effects persist.
- [DAISO advance card images](https://www.daiso-syuppan.com/public/mushijingi_5th_cards/): located for additional primary-text verification; full image crosscheck remains pending.
- [Official SET7 Q&A](https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F-1/%E7%AC%AC%EF%BC%97%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/): general simultaneous-effect priority is active player then other player, with each player's order selectable. Used as a general-rule source; no SET7 card implementation has begun.
- Local SET5 knowledge base and canonical catalog used for the planning metadata, with secondary-source limitations retained.

No USER_RULING was introduced. No NEEDS_RULING/UNKNOWN/CONFLICT was silently converted to PLAYABLE.

## Verified development gates

- Initial baseline full 1158/0, shared 72/0.
- Current focused tests added: 121 tests; latest development full 1279/0, shared 72/0.
- Offering, blue-head attack, explosion/territory continuation, facedown food cost, Genji reveal, simultaneous entry ordering and growth Human UI: Chromium 57/57, WebKit 57/57 (controlled fixtures; canonical status remains PARTIAL). Entry-order dialog and growth are exercised in landscape, with document-height assertions.
- Normal browser flows: Chromium 58/58, WebKit 58/58; no page errors.
- The offering UI check also measures portrait document height for one-screen overflow.
- SET completion compact/responsive/whole-card Human/CPU gates have NOT been completed.
- One Chromium startup attempt timed out before deck selection; unchanged rerun passed. The fixture now explicitly awaits `MushiBattle.ui` initialization. No assertion was skipped or weakened; investigate recurrence during the final browser gates.
- A later initialization timeout recurred; the following invocation found the local server unavailable (connection refused). Restarting the server restored Chromium/WebKit 19/19. Startup failure diagnostics now report page errors and failed requests. This does not retroactively establish the exact cause of the earlier timeout.
- One full regression caught an unintended change to SET2's selectionPurpose. Production now preserves `FLIP_OPPONENT_FOOD` for the existing concealment path; the unchanged regression passed on the latest full run.
- Startup diagnostics captured `ERR_CONNECTION_REFUSED` on required local assets and the resulting `GameState is not defined` while two browser launches ran concurrently. The local server subsequently answered successful requests. Sequential Chromium/WebKit runs passed without retries or skipped assertions; continue running browser gates sequentially and retain diagnostics rather than treating concurrent-server failures as application GREEN.
- Focused flee regressions additionally reproduced (and fixed) loss of the already-triggered event when its entrant departed, ignoring individual keyword suppression, and destruction of a watcher after a new field stay. SET1 insect-shower order dependency is tested in both directions.

Foundation checkpoint: `2302c7f99034ffb7b1169369b3c9f0e15a088946`.
Food/territory progress checkpoint: `d52aece82294a247751b0270a5dab01170027d0a`.

## Next work

Finish primary card-text/source verification and the remaining SET5 mechanics, with serial entry, before-spell triggers, discard replacement, territory retaliation and constrained attachment maintenance prioritized. Run complete per-card decision tests and the full SET5 release gates before promotion. Continue through SET6 and SET7 under the same evidence criteria. This document is a resumable progress checkpoint, not a request for approval or a claim of completion.

## Latest development evidence

- SET5-32 mandatory color choice conceals visible insect food using its current color, for both controllers. Existing facedown food is not inspected; generated cost is unchanged. Five focused cases cover invalid choices, suppression, CPU and JSON continuation restoration. Production Human color selection passes in both browsers.
- Direct Engine use of SET3-54 rejected neither excessive nor fractional additional payment. New failing-first regressions now validate the shared API before mutation, without changing printed cost or generated available-cost semantics. Existing variable-payment tests remain unchanged and pass.
- Latest full 1229/0 and shared 72/0; syntax and diff checks pass. These are development gates, not SET5 completion certification.

## Shared spell legality / discard selection progress

- SET5-60 uses current effective attack names plus active keyword names. Official SET5 QA confirms keyword techniques count. Nine focused tests cover own attacked visible candidates, individual/global suppression, army borrowed poison attacks, captured holder, API rejection, JSON target restore and CPU resolution. Human selects the poison keyword insect through production UI.
- SET5-57 / 62 use shared zone-card selection and serial movement: exact two arbitrary own discard cards to facedown food; up to two named armour/copy enhancements to hand. Counts, duplicates, stale zones and definition conditions are validated before payment/movement. Seven focused cases include CPU, JSON restoration, zero optional candidates and rejected stale selection.
- Generic CPU optional min=0 was incorrectly treated as min=1. The engine candidate structure now drives the actual minimum without truthiness fallback. Invalid completion also restores the previous selected-ID list rather than mutating it on rejection. Full existing regressions remain unchanged.
- Latest full 1245/0, shared 72/0; Chromium and WebKit Human effects 40/40 each, including both discard inspectors and one-screen assertions. Syntax / diff checks pass. No PLAYABLE promotion or release integration.
- Progress checkpoint before this phase: cdc946a.

## Conditional next-use cost / territory route evidence

- SET5-56 stores a serializable next-use modifier, dynamically reevaluates current visible food names, combines stacked increases/decreases before zero clamp, consumes all qualifying tokens only on the matching insect use, and expires at the turn boundary. Eight tests include CPU, invalid summon, JSON, later-added/hidden/removed food and multiple adult species.
- A provisional test initially assumed snapshot reference. Before production implementation, independent official research found the SET7 Q&A's explicit SET5-56 ruling: removed or concealed larvae cease to qualify, and later-added larvae qualify. The new test was corrected to this official specification; no existing assertion was weakened to obtain GREEN. No SET7 card was implemented.
- SET5-40 uses optional territory self-routing to food through shared CHOICE_SELECTION. Six focused cases include decline, CPU, restore, invalid destination, Tobidasu-only suppression and nested attacker follow-up after routing. Existing Tobidasu incorrectly ignored global Kuchinashi on the drawn card; its shared eligibility now checks the same global suppression as the new trait.
- Latest development full 1259/0, shared 72/0; Human Chromium/WebKit 48/48 each. New Human flows actually cast discount then summon the adult, and route opposing territory to food before the attacker resumes food reveal. One-screen assertions pass.
- Previous progress checkpoint: 213cdd7. No PLAYABLE promotion or main changes.

## Entry-window protection progress

- SET5-43 uses a generic passive protection window defined relative to the current field entry. Opposing spell damage is zero and spell destruction is rejected only in the next turn; target selection and non-destruction movement remain legal. Current zone holders determine the opposing controller, not ownership. Active keyword suppression disables this continuing trait.
- Six focused tests cover entry/later turns, own spell, attack damage, individual/global suppression, capture, JSON, actual SET4 exchange and CPU damage-spell completion. Human explicitly selects the protected insect and the paid spell resolves for zero damage.
- Latest full 1265/0, shared 72/0, Human Chromium/WebKit 51/51 each; syntax and diff checks pass. Remaining per-card formal certification / completion browser gates are not done. No PLAYABLE claim, no SET6/7/8 implementation, no main integration.
- Previous progress checkpoint: 7781644.

## Entry provenance progress

- SET5-44 resolves conditional entry growth against serialized card-effect provenance, recorded before arrival triggers. Spell direct movement, deck routing, serial hand/food movement and exchanges pass source identity; batch movement now forwards runtime flags before entry. Field leave clears that field-stay origin. Source movement to discard does not erase the already-resolved bonus.
- Six failing-first focused regressions cover actual SET2 white-night / SET4 polar-night emergence, ordinary summon, actual different spell, suppression, captured controller, JSON selection restoration, CPU and field leave. Official SET5 QA explicitly says resolved emergence modifiers persist after loss of the technique.
- Human chooses the larva in field and adult in discard through the actual SET4 spell, then verifies HP/AP growth. Latest full 1271/0, shared 72/0 and Chromium/WebKit Human 54/54 each; syntax / diff checks pass.
- Existing SET1–SET4 release status remains 309. SET5 definitions remain PARTIAL pending whole-card completion evidence. Previous progress checkpoint b1dfee6.

## Enhancement entry watcher progress

- SET5-46 grants +100 HP/AP and observes opposing spell entry at its actual arrival event. The shared ordering continuation carries a field-stay-safe prohibition independently of the later location of the enhancement or host. It does not affect normal summons, own spell entry or earlier arrivals. Insect-trait entry suppression does not suppress an enhancement effect.
- Eight focused cases cover real direct and exchange spell paths, late attachment, host departure, capture/current controller, keyword suppression, CPU end-turn continuation, JSON order selection and stale entrant re-entry. Human actually attaches the enhancement and then uses the opposing entry spell; legal attacks are empty and normal Battle continues.
- Latest full 1279/0, shared 72/0, Chromium/WebKit Human 57/57 each; syntax/diff checks pass. No completion claim or PLAYABLE promotion. Previous progress checkpoint cb9d3a8.

## Host keyword suppression and cross-set fixes

- SET5-47 connected as PARTIAL: +300 HP/AP, host keyword loss, optional territory attachment. No PLAYABLE promotion.
- Shared predicate now recognizes attachment-based host keyword loss, disables lost global suppressors, and excludes suppressed army-link donors.
- Entry suppression checks the active trait rather than raw definition metadata. Passive damage prevention now respects keyword loss; attachment prevention and already-resolved shields remain independent.
- Destruction records host keyword eligibility before field departure, carries it in the serializable follow-up, and separately resolves attachment destruction effects.
- Reproduction first: 7 failing / 1 passing tests before fix. Final focused 10/10, including CPU and territory selection JSON restore. New production Human attachment path checks lost shared attacks and retained enhancement HP.
- Latest full 1289/0, shared 72/0; Chromium/WebKit Human 60/60 each. Syntax/diff checks required before checkpoint. These are development gates, not whole-SET completion evidence.
- Official SET5 Q&A confirms loss of King and completed attachment effects remaining; SET4 Kuchinashi ruling applies to insect keywords, not enhancements. No generalized face-down enhancement rule introduced.
- Independently audit global suppressor removal, pre-destruction eligibility, and restored nested follow-up. Remaining card-level official text / boundary / Human / CPU audit continues.

## Attached-host destruction return

- SET5-06 connected as PARTIAL using a generic destruction snapshot attachment condition and existing zone movement. No release or completion claim.
- Failed-first tests exposed unconditional return when no attachment and stale-zone movement throwing. Generic movement now rechecks current source zone.
- A further SET3/SET1 interaction reproduced an attack-death enhancement returning despite successful destruction replacement. Return handling now follows destruction replacement rather than preceding it.
- Focused 9/9 includes official fan-bottom precedence, non-destruction zone movement, suppression, CPU attack, and nested selection JSON restoration. Full 1298/0 and shared 72/0. Latest production Human 60/60 each engine is from the preceding checkpoint; no new card-06 Human certification claimed.
- SET5 official Q&A: fan-bottom precedence and exchange not triggering dragonfly return. Original card text remains secondary catalog provenance, requiring final source/card audit.
- SET5-13 next failed-first audit identifies premature linked-copy destruction before optional enhancement return; work is not yet complete.

## Optional destruction attachment return and serial follow-up

- SET5-13 connected as PARTIAL. Official SET5 Q&A lines 108-110: a returned copy source does not destroy its copy, returned tracked-revival enhancement does not destroy revived insects, and Hariganemushi resolves before host return selection.
- Failed-first: 6 failures / 1 pass. Shared destruction ability continuations now serialize effects and explicitly support an after-attachment-trigger phase. Existing default ordering remains host then attachment.
- For eligible optional return, attachment destruction follow-ups are deferred until the return choice completes. Returned attachments skip destruction effects; discarded attachments complete their follow-ups before territory acquisition. No card-name branch added.
- Selection is 0..1, scoped to the destroyed host's snapshot attachments still in discard. Duplicate, over-count, and vanished target rejection preserves state. Pending choice and deferred discard queue survive JSON restore; CPU completes the common selection.
- Focused 9/9; full 1307/0; shared 72/0; production Human Chromium/WebKit 63/63 each. Human operates discard inspector and the shared confirmation action, with final hand/discard assertions.
- Browser fixture corrections: selected enhancement name was Golden Beetle Armor, not the initially written Mayfly label; optional selection requires explicit confirmation. Assertions were not removed or weakened.
- Remaining completion scope: captured-controller attachment ownership, multiple simultaneous optional abilities, all new-SET source verification, and whole-SET browser/CPU/card audit. No PLAYABLE promotion and no SET Complete checkpoint.

## Normal-summon entry attachment

- SET5-16 wired as PARTIAL. Normal/alternative summon origin is recorded before arrival. The effect requires normal card-cost payment, not payment of a spell bringing an insect into play (official SET5 Q&A, European stag beetle).
- Shared entry selection filters printed enhancement cost <=3 and actual forced-use legality, excluding tracked revival, hand-entry and source-less copy. Current candidates and field-stay serial are revalidated before attachment.
- Shared existing-enhancement attachment now supports discard/resolving sources, copy-source selection with JSON continuation and current/max HP adjustment preserving damage. Territory attachment uses the same lifecycle and host limit check.
- Failed-first tests: six missing-path/HP failures. New fixture initially overstated Golden Beetle Armor as +400; card text and canonical definition specify +200, so that new fixture was corrected to the actual source before certification. No existing test weakened.
- Focused 10/10, full 1320/0, shared 72/0, Human Chromium/WebKit 65/65. Human summons then chooses the discarded armor and confirms, verifying HP1200 and remaining cost15.
- New readiness inventory counts 565 canonical printing entries and 309 declared available. No final AUDITED certificates inferred. SET4 discrepancy check reran known audit 5/5, supplementary fixes 6/6, CPU64/64; no status-level partial entries found, not an exhaustive new rules audit.
- Scope now includes SET8 under all-565-plan.md. Historical SET8 exclusion is superseded; no SET8 definition added yet.

## First four basic cards certified

- SET5-04,10,20,36 promoted individually after visually checking all printed metadata and absence of extra effects against card scans (fan-hosted printed images 313/319/329/345). Source level remains C; do not relabel a fan-hosted source as an official publication.
- Each has explicit fixed-value metadata, real canonical summon/payment, attack resolution, unaffordable/foreign-controller rejection and CPU summon/attack tests (16 new cases). Human uses the canonical card, summons, taps attacker/target and verifies damage for each.
- Runtime availability now 313/565; SET5 4 PLAYABLE, 37 PARTIAL, 23 RESEARCHED. Final AUDITED remains separate and pending.
- Full 1336/0, shared72/0, Chromium/WebKit Human73/73. Chromium normal flow58/58 and SET8 Toolbox214/214 (including unchanged catalog565 and updated availability313) checked. Existing partial-only assertions and release-count snapshots were updated to reflect these four intentional promotions; no effect assertions removed.
- Source/effect/Human/CPU evidence: scripts/set5-battle-evidence.js. No SET5 Complete claim. Main and Pages are not updated by this intermediate checkpoint.

## Shared Human attachment selections and attachment spells

- Renewed SET4 investigation found a real basic Human access gap despite declared64/64: Engine ATTACHMENT candidates had no tap UI. New failed-first browser reproduction and fix cover actual SET4-53 copy source, SET1-104 transfer plus reselection, and SET4-64 destruction/optional target. Details: set4-independent-audit-addendum.md.
- Shared modal displays Engine options (including mixed attachment/host groups), masks hidden identities, dispatches select/confirm back to Engine and clears obsolete contents. It does not alter GameState or duplicate card legality.
- SET5-63/64 implemented with exact one-attachment legality and current candidate rebuilding. Reset waits for destruction follow-ups, preserves once-per-field usage, and does not reset a departed/reentered host. Enemy ownership, spell immunity, vanished candidate, insufficient count and host death boundaries are covered.
- Card63 final food does not generate current-turn cost. Card64 requires attacked/attached visible host, including an enhancement added after the attack (official SET5 QA).
- Printed scans325/372/373 visually checked; canonical16/63/64 use actual Engine and Human paths, not status-only or alias-only evidence. Corrected trait glyph 強化甲殻 against scan/officialQA.
- These three promoted to basic PLAYABLE, not final AUDITED: SET5=7/64; cumulative316/565. Other36 wired definitions remain PARTIAL;21 lack Battle definitions.
- Latest full1353/0, shared72/0. Human attachment-specific10 and SET5 suite73 each Chromium/WebKit; compact42 each. Normal flow58 each; SET8 Toolbox214 each, with no fatal error/404 (Chromium Toolbox prior availability313; latest WebKit availability316).
- No USER_RULING introduced. Cross-set final audit and iPhone hardware remain pending. New source files are selected explicitly; screenshots/KB/worker remain excluded.

- Source references for this checkpoint: official SET5 Q&A at https://mushijingi.jimdofree.com/q-a-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F-1/%E7%AC%AC%EF%BC%95%E5%BC%BE%E3%81%AE%E3%82%AB%E3%83%BC%E3%83%89%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/ (paid entry and attacked-host eligibility). Printed scans are fan-hosted, as explicitly labeled in evidence.

## Conditional food chain and exact-family technique

- SET5-18 certified basic PLAYABLE after scan327 metadata/all skills check and official SET5 QA exact Cicadidae condition (source counts, Membracidae excluded).
- Reused territory food-selection continuation with conditional second selection. First requires a visible insect; a current blue first target opens a freshly rebuilt optional blue-food choice. Hidden cards are excluded without inspecting their identity. Color-changed/stale candidates and JSON restore are covered.
- Chorus uses exact visible tag count under the current controller. CPU test deliberately selects the second legal technique using controlled RNG; CPU is not required to maximize AP. Both techniques are used in actual Human UI paths.
- Fixed catalog typo 相手か to printed 相手が. Test/effect references: set5-conditional-food-chain.test.js (10 cases), set5-human-paths.cjs (76 checks each engine). Full1363/0, shared72/0.
- Actual Toolbox filter/handoff smoke builds20 cards with two copies of all eight newly playable cards plus starter cards and starts CPU Battle. Existing UI has separate PARTIAL and UNAVAILABLE filters: SET5 counts are8/36/20, not8/0/56. The test checks all three rather than changing that UI convention.
- CPU may legitimately pause for Human territory selection; smoke explicitly resolves that UI decision before demanding return of control. This is test orchestration, not a production CPU workaround.
- Next adversarial audit has reproduced four delayed end-turn continuation/lifecycle failures; tests/end-turn-selection-continuation.test.js is not yet in the completed suite and no fix is claimed yet.

## End-step continuation cross-set regression

- Fixed delayed end-step selections advancing/healing too soon, expiry not propagating enhancement destruction, and nested territory-suppression loss under an attack-growth continuation.
- Failed-first 4 end-turn +2 nested suppression reproductions; final focused5+3 pass. A fresh reviewer found the late stat-expiry Hotseat case; failed browser regression added and fixed, with independent re-review.
- Latest full1371/0, shared72/0; end-turn Human10 each. Other browser gates and exact scope/remaining audit caveats are in serial-end-turn-audit.md.
- SET5 remains8 PLAYABLE /36 PARTIAL /20 RESEARCHED. SET6–8 are still unimplemented. No all565 completion or main publication claim.

- 2026-10-28: Cards1/2/15 certified individually by printed scans,12 card-specific Engine/CPU tests and19 Human checks per engine; see set5-attack-condition-audit.md. Card28 remains PARTIAL after fixing all-spell immunity; no blanket completion claim.

## Latest activated-field checkpoint (supersedes historical counts above)

- SET5-30 basic PLAYABLE evidence:13 Engine/CPU cases and15 Human checks each engine; see set5-activated-field-ability-audit.md. Current SET5:29 PLAYABLE /21 PARTIAL /14 RESEARCHED, total338/565. No SET Complete or final AUDITED claim.

- Cross-set attack-cost field-stay bug fixed for generic food/attachment selections; failed-first4 cases, final8, Human21 each and existing attachment10 each. See attack-cost-continuation-audit.md for old-save identity limit. No card status promotion inferred.

- Latest attack-effect group:9/12/29/33 individually certified. Current33 PLAYABLE /17 PARTIAL /14 RESEARCHED, total342/565; audit in set5-attack-effect-completion.md. Source/target field-stay bug found during33 audit was fixed in5db74ac, not hidden by status change.

- Latest territory/armour group:40/43/45 individually certified, including canonical CPU and restored chained decisions. Current36 PLAYABLE /14 PARTIAL /14 RESEARCHED, total345/565. See set5-territory-armour-completion.md.
