# Sequence batch certification — 2026-11-03

Base: safe388 checkpoint5c73a4f. Worktree C:/Users/aatot/mushi-crossset-dive, branch crossset-dive-20261103. Public366, frozen372e93b373 and frozen3885c73a4f are unchanged. This development batch contains nine additional individually reviewed cards; finalAUDITED remains false.

## Printed source and official rulings

All nine actual printed scans were downloaded outside Git and visually read. Secondary scan hosting is not labelled as an official publisher: images/card/377.jpg,381.jpg,384.jpg,408.jpg,434.jpg,435.jpg,498.jpg,560.jpg,398.jpg at https://mushijingi.com/ . Names, costs, colors, HP, every skill/trait/effect clause were compared to catalog and explicit mappings. No generated artwork or inferred effect clauses.

Official QA6 https://mushijingi.jimdofree.com/q-a-よくある質問-1/第６弾のカードについて/ checked2026-11-03: dive checks current blue food during its effective next-opponent-turn window; entry suppression does not suppress this ongoing trait. Repeat-damage spells may select the same surviving insect twice, may be used without a prior copy, and skip a later hit when no target remains. The printed SET7-61 RGB condition and SET8-59 additional2 repeat count are mapped separately; no unrelated provisional ruling is imported.

## Per-card evidence

Machine-readable individual records: scripts/sequence-battle-evidence.js. Full565 readiness and refreshed overlapping mechanic groups: sequence-progress.json. Human and WSS scenarios are actual card use/choice/resolution, not merely button presence.

- SET6-4/8/11/35: each paid CPU summon, exact cost/HP/AP, normal attack through Human CPU+online in Chromium/WebKit; live-blue protection, damage/destruction, losing/regaining food, effective color, hidden food identity guard, suppression, off-turn entry, reentry, current-holder food and JSON tests.
- SET6-61/62, SET7-61, SET8-59: exact printed damage/repeat counts/cost, CPU pending-choice completion, current target rebuild and rejection, same target allowed across separate choices, no-target skip, JSON restore per hit; Human CPU+online tests use two legal initial targets and select across each continuation, online reload during selection.
- SET6-25: existing CHOOSE_SELF_COLOR reused without adding a rule resolver. RED/GREEN/DECLINE, expiry at end turn, JSON, CPU paid summon/choice/attack; Human CPU+online selects GREEN and attacks with the resulting color.

## Generic changes

zone-engine stores nextOpponentTurnAfterEntry at field entry using current controller and active player (+1 normal / +2 opponent-turn entry). Existing unrelated entry-window effects keep their prior metadata and semantics. Live-food threshold is an optional condition on the existing opponent-spell damage/destruction prevention type.

Spell-target generation is shared between initial use and serial repeats. SERIAL_SPELL_DAMAGE rebuilds candidates after prior damage/destruction continuations finish; RESOLVE_SERIAL_SPELL_DAMAGE rechecks current legality; FINALIZE_COMMITTED_SPELL defers source discard until every hit/trigger resolves. No new card-name branches in Engine. No Engine attack/additional-cost/destruction tail from function performAttack onward changed; protected hash test remains intact.

Review caught premature RESOLVING→DISCARD while a repeat choice remained pending. Added a failing regression asserting source zone through every JSON checkpoint, then fixed finalization; reviewer independently rechecked early target death and normal completion. No remaining review finding reported.

## Test execution notes

Engine/shared/server final logs are outside Git under C:/Users/aatot/.codex/tmp/mushi-sequences-* . Original four timing-hypothesis failures and provisional additional-cost-source-loss handler stay in the oldunsafe branch and were neither imported nor edited/skipped. Safe baseline had0failures.

Trial browser failures are retained in logs: an initial HTML insertion duplicated existing script tags and was corrected; repeat UI fixture initially assumed a one-target spell asked for an initial choice, but Engine auto-selects its sole target. Final fixture has two initial targets and awaits state-version advancement. No production rule or test assertion was relaxed to accommodate those authoring errors.

Final source byte-freeze tests were updated only for reviewed new Engine delta and the explicit397 runtime count/cache tag. Existing gameplay expectations, original four hypotheses and attack-tail hash assertion were not weakened. The old SET8 UNAVAILABLE count was updated from55 to54 because SET8-59 is individually certified; static64-card catalog remains untouched.

## Release boundary

No main integration, deployment, public API/ngrok restart, auth change, Windows setting, Tailscale or RDP change. Live API PID23988 and ngrok PID6440 remain untouched. Match absence has not been established. These Engine/card changes require a new matched API contract; current public API cannot serve this candidate. No contract bypass.

A local Pages-shaped candidate is a preparation artifact, not evidence of a new Linux/Jekyll deployment. Existing safe388 Linux validation is not reused as proof for new397. iPhone physical testing remains unperformed.

## Final local gate receipts

- full:1746passed/0failed (mushi-sequences-full-final2.log).
- shared:73passed/0failed (mushi-sequences-shared-final2.log).
- server:81passed/0failed (mushi-sequences-server-final2.log).
- new card browser:12tests/0fail, 36 actual Human CPU/online scenarios across Chromium/WebKit (mushi-sequences-browser-final.log), re-run after deferred finalization fix.
- broad browser:12tests/0fail (mushi-sequences-flow.log): two CPU matches per engine, one online match per engine with spectator and reconnect; invalid saved decks, HTTPS→WSS selection, legacy UI and responsive geometry.
- Toolbox:16checks each Chromium/WebKit, mixed20-card saved deck contains all nine new cards (mushi-sequences-toolbox.log).
- Syntax:31JS/CJS files checked; diff whitespace clean. Private API/ngrok process identities and original stage hash rechecked unchanged.
- Local candidate:87 manifest entries /86 deployable assets,565catalog/397playable; every SHA256 and generated contract matched. Source engine contract c0ae38807278652de14bb6cd20792fcc270be90cded9d2f60f439a3c5ff5e5cc; card contract e44754c243d49e9d0f67c06c53edbe72a59d78fbc563ece186a554b95d8a42f3.
- Pages live configuration independently read: legacy build from main:/; validation branch workflow only reads/builds/uploads an artifact, has no Pages deployment permission or step.
