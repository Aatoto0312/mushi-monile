# SET2 Battle audit / mechanic matrix

Status: audit in progress; no SET2 card is promoted to PLAYABLE by this document.
Baseline: `170c2b36fe994b1fd597dac67e3e0b4ad816380b`. Branch: `battle-all-501`.

## Data authority

Read `docs/mushijingi-knowledge/SET2_CATALOG.md` and the official SET2 Q&A.
The Knowledge Base identifies metadata as secondary-source verified, not fully
matched against official card images. The existing `js/cards/full-catalog-data.js`
remains the single catalog source. Audit code must read it, not maintain another
copy of card metadata. Official Q&A takes precedence over catalog summaries.

Official Q&A: https://mushijingi.jimdofree.com/q-a-よくある質問-1/第２弾のカードについて/

## Initial classification (official card number /55)

| Classification | Numbers | Required verification |
| --- | --- | --- |
| Vanilla | 6, 8, 10, 18, 26, 28, 29, 32, 35, 36, 38, 39 | Official metadata, normal summon/attack/cost/illegal action |
| Existing mechanic or combination | 3, 5, 12, 15, 20, 21, 23, 24, 30, 33, 37, 42, 43, 44, 48, 49, 53, 54 | Definition wiring, timing, Human and CPU paths |
| Extend or new generic mechanic | 1, 2, 4, 7, 9, 11, 13, 14, 16, 17, 19, 22, 25, 27, 31, 34, 40, 41, 45, 46, 47, 50, 51, 52, 55 | Matrix below; effect-specific boundary tests |

Resolved transcription flags: inspected card images hosted by the maintained
fan database, rather than relying on its text transcription. Card 16 reads
`神の吸引` (https://mushijingi.com/images/card/146.jpg), card 22 reads
`シカツノバサミ` (https://mushijingi.com/images/card/152.jpg), and card 38 reads
`くいちぎる` (https://mushijingi.com/images/card/168.jpg). Corrected the canonical
catalog. Hosting is unofficial; these are card-image observations, not a claim
that all metadata has been verified against official-hosted materials.
No unresolved ruling is silently replaced with a conventional TCG assumption.

## Mechanic matrix

| Mechanic | Category | Cards | Important boundary |
| --- | --- | --- | --- |
| Normal attacks, once per field stay, jump-out, lure, mimic protection | Existing | See existing group | All entry routes and first-turn restrictions |
| Ordered two-target attacks, territory trigger suppression | Existing | 21,24 | Target count and deferred territory selection |
| Temporary HP and AP, direct spell damage, attachment stats | Existing | 43,48,49,53,54 | Expiry and invalid targets |
| Optional entry color selection | Extend entry resolver | 1 | Face-up return is not entry; all actual entry routes |
| Copy another own insect's color for turn | Extend color choice | 2 | Requires another insect; colorless supported |
| Damage prevention by turn / next opponent turn | New | 4,16 | AP0 consumes prevention; damage versus destruction |
| Capture defeated insect and delayed destruction | New | 7 | Owner/controller separation, entry-before-territory ordering |
| Self hiding after territory acquisition | Extend attack continuation | 9,25 | End-turn processing remains active while face-down |
| Opponent chooses legal attack target | Extend selection | 11 | Lure/protection filtering, CPU selection controller |
| Next own-turn AP modifier | Extend modifier durations | 13,22 | Repeated attacks stack within same turn |
| Growth after caused territory acquisition | New event effect | 14,34 | Jump-out and special territory still count |
| Destroy a pre-wounded target | New attack effect | 17 | No direct attack; evaluate before bonus damage |
| Optional family-filtered revival on entry | Extend entry selection | 19 | Chained entries and attack restriction |
| Retaliation on attack destruction | Extend destruction effects | 27,31 | No territory for retaliatory destruction |
| Flip opposing food after territory acquisition | Extend continuation | 40 | Optional selection, no color from face-down food |
| Damage immunity by attack-name predicate | New declarative predicate | 41 | Zero damage does not cause persistent poison |
| Cannot attack / opposing spell target immunity | Extend legality | 45 | Consistent Human, CPU and resolver validation |
| Suppress weakness multiplier | Extend damage computation | 46 | Other modifiers still apply |
| Consume attachment to prevent insect attack damage | New replacement | 47 | Skill effects remain; spell damage excluded |
| Summon with temporary attack-blocking attachment | Extend enhancement use | 50 | Attachment expires at next opponent turn end |
| Larva-to-food / corresponding adult summon | Extend grouped selection | 51 | Name relationship, no immediate food cost grant |
| Turn-scoped opponent jump-out suppression | Extend trigger scope | 52 | Expiry and later territory acquisitions |
| Retrieve typed food to hand | Extend zone targeting | 55 | Face-down food cannot satisfy type predicate |

## Implementation and verification gates

1. Resolve metadata research flags and record per-card provenance.
2. Add executable audit joining catalog records to implementation evidence.
3. Implement mechanics with serializable continuations and declarative definitions.
4. Test usage, legality, costs, effect ordering, expiry and completion per card.
5. Exercise each new pending/action shape through Human UI and CPU.
6. Run full/shared/syntax/diff checks and Chromium/WebKit integration including
   the accepted one-screen portrait/landscape matrix.
7. Only then promote verified cards and create the SET2 complete checkpoint.
   Continue immediately through SET3–SET7 and the final 501-card audit without
   waiting for human approval between sets. If exhaustive research leaves genuine
   ruling blockers, record them with sources and proceed with other cards/sets;
   do not label an incomplete checkpoint Complete. Revisit blockers in final audit.

No main integration or publication is authorized during expansion. Neither the
Knowledge Base nor `.ai-worker/` belongs in a commit.

## Working progress (not a complete checkpoint)

- `node scripts/audit-set2-battle.js` emits the per-card audit from the catalog;
  `--summary` emits counts only. Current SET2 status: 49 PARTIAL, 6 RESEARCHED,
  0 PLAYABLE. Status follows executable definitions, not catalog existence.
- Future stat modifiers previously disappeared at the intervening turn cleanup.
  Cleanup now removes expired modifiers, retaining scheduled future modifiers.
- `APPLY_STAT_MODIFIER` accepts `target: SELF` for attack-source modifiers on
  both insect and direct attacks. No card identity branches are needed.
- Five mechanic tests cover intervening turns, expiry, stacking, leaving field,
  insect attacks and direct attacks. No SET2 definition has been promoted yet.
- Human/CPU browser paths and full SET2 completion remain outstanding.
- Damage-prevention foundation added: `PREVENT_DAMAGE` passive/attachment effects,
  first-per-turn consumption, and `GRANT_DAMAGE_SHIELD` attack effects with explicit
  turn windows. AP0 consumes shields; multiple shields consume on the same event.
  Field re-entry resets shield state. Ten dedicated tests exercise these paths.
- SET1 destruction spell now uses `DESTROY_TARGET` rather than a sentinel damage
  amount, so damage prevention cannot incorrectly block destruction. CPU excludes
  targeted spells without candidates. Tests cover both target availability states.
- Existing Astra browser flows passed 58 checks in Chromium and 58 in WebKit during
  this increment. These are baseline regressions, not proof of SET2 Human coverage.
- `set2-cards.js` now loads all 55 definitions in Battle and Toolbox from the
  existing catalog. Thirty-four have mechanic wiring; no production status gate
  has been relaxed. Runtime smoke tests cover basic actions and continuation for
  all 34 through test copies (release-status bypass only). This does not establish
  every skill, Human UI path, CPU path, or metadata release gate.
- Runtime traits duplicated as passive skills are presented once in card details.
- User permits reading later SET catalogs now to identify reusable mechanics;
  implementation and checkpoint boundaries remain per SET.
- Targeted own-field stat modification and typed face-up food retrieval are
  connected to SET2 54/55. Selection and expiry tests pass. Canonical effect text
  remains attached to executable spell/enhancement effects for card details.
- Latest full suite: 520 passed; shared suite: 72 passed. After runtime loading,
  Astra baseline browser suite passed 58 checks in each of Chromium and WebKit.
- `set2-human-paths.cjs` exercises card tap, action, own-field target selection and
  resolution using a test-only copy of SET2 54 in portrait/landscape. Both browsers
  passed 11 checks, including no body/board vertical overflow. Corrected the
  misleading opponent-only target prompt exposed by this flow. Remaining SET2
  Human/CPU/effect gates are not implied by this one path.
- Shield/poison interaction exposed the old all-damage-nonhealing boolean bug.
  New poison records actual unhealable damage only; ordinary damage heals and
  zeroed poison adds no persistent damage. Field exit clears it. Two added tests
  cover zeroed poison and mixed ordinary/poison damage. The legacy boolean is
  still read for compatibility with existing state, but no new effect writes it.
- Multi-target attack integration fixed for both existing SET1 and SET2 mechanics:
  Human skill selection now creates Engine-owned CARD_SELECTION; opponent card
  taps use the selecting player rather than the target's owner. CPU execution
  routes multi-target skills through the same selection API. Single-target API
  rejects multi-target skills instead of silently using them on one target.
- Ordered hits now suspend on territory acquisition and optional jump-out choices
  using serializable `afterResolution` continuations. Returning the attacker to
  hand cancels remaining hits. Five dedicated continuation tests pass.
- Latest full suite: 527 passed; shared: 72 passed. SET2 incremental Human path:
  Chromium 15 checks / WebKit 15 checks (own-target spell and two-target attack,
  portrait/landscape). Production release status is still PARTIAL/RESEARCHED.

## Resumed implementation checkpoint (still incomplete)

The connected definitions are now all SET2 cards except 1, 2, 7, 19, 50 and 51.
All connected cards remain PARTIAL. No Complete checkpoint or PLAYABLE promotion
is justified by connection smoke alone.

Added and verified incrementally:

- Poison-name damage immunity, opponent-only spell immunity, cannot-attack
  passive and weakness-multiplier protection (41, 45, 46).
- Attack-scoped and turn-scoped jump-out suppression (24, 52).
- Post-territory hiding with next-opponent-turn duration (9, 25).
- Retaliatory attacker destruction and scheduled attack vulnerability (31, 27).
- Pre-damage wounded-target execution, with insect-only targeting (17).
- Optional opponent food concealment after territory acquisition (40).
- Self HP modifiers with activation/expiry and permanent field-stay growth
  on actual territory acquisition (43, 14, 34).
- Defender-controlled attack-target selection (11), including Human hotseat,
  CPU pending resolution and legal-target filtering.
- Serializable continuation sequences preserve acquisition effects and later
  attacks instead of overwriting a previous suspended continuation.

Existing-rule corrections found during integration:

- Poison damage is recorded before destruction replacement. Shell replacement
  cannot heal persistent poison; lethal poison still destroys and draws territory.
- SET1 self HP skills now modify their source rather than their attack target.
  HP calculation includes active stat modifiers, and expiry can destroy without
  drawing territory. Attachment HP changes preserve damage already received.
- Hidden food still supplies cost but is excluded from color counts and targeting.
- CPU excludes consumed one-use skills, missing insect-only targets and
  insufficient multi-target candidates. Pending attacks cannot be overwritten by
  another ordinary attack. An old direct-attack test now finishes its first
  territory acquisition before attempting another attack.

Rule evidence: official SET1 Q&A (poison/shell and temporary HP expiry), official
SET2 Q&A (hiding, execution, retaliation, growth and face-down food), and official
SET6 Q&A (HP modifiers change the HP threshold while received damage remains).
The earlier Minomushi tests explicitly encoded an unverified assumption that
current HP did not increase with maximum HP. They now assert preserved damage.

- https://mushijingi.jimdofree.com/q-a-よくある質問-1/第１弾のカードについて/
- https://mushijingi.jimdofree.com/q-a-よくある質問-1/第２弾のカードについて/
- https://mushijingi.jimdofree.com/q-a-よくある質問-1/第６弾のカードについて/

New CPU connection smoke uses each connected definition (test copies bypass the
release gate only), lets the CPU choose/use the card, resolves pending actions,
and requires a completed turn or terminal result. Effect-specific tests remain
separate. Human paths now cover own-target spells, multi-target attack, targetless
suppression, hiding, optional food selection through the drawer and defender
target selection in both orientations.

Remaining work: unify all field-entry routes and chained optional effects;
implement the six remaining definitions; finish metadata and every effect/action
gate; audit hidden-card presentation and controller-dependent selections in CPU
mode; revisit attachment transfer timing and all existing effects before release.
Do not interpret successful basic summon/attack smoke as proof of all skills.

Verification at this partial checkpoint (2026-09-21): full 628 passed, shared 72
passed; Chromium and WebKit each passed baseline flows 58, compact actions 42,
responsive checks 4,368 and incremental SET2 Human paths 29. The runtime and CPU
connection smoke cover all 49 PARTIAL definitions. Main/origin/main remain
`170c2b36fe994b1fd597dac67e3e0b4ad816380b`; no publication is performed.
