# SET4 current-state investigation

Base: bec36b4; declared SET4 status 64 PLAYABLE / 0 PARTIAL. Previous 5 independent findings are fixed in this repository (rerun 5/5 plus supplemental6/6). CPU action initiation/continuation64/64 passes. These checks alone do not certify every rule.

## Newly reproduced: Human attachment choices unavailable

- HIGH, shared Human reachability: SET4-53 copy source, SET4-64 attachment destruction, SET1-104 attachment/host transfer and copy reselection, plus later effects using ATTACHMENT candidates.
- Engine creates legal CARD_SELECTION with ATTACHMENT candidates, but the UI has no buttons for attached card instances. Field detail only lists their names; field/hand/discard click routes cannot select them.
- Failed-first production UI test reaches COPY_ENHANCEMENT_SOURCE and then times out locating a usable attachment choice.
- Fix: modal renders only Engine options when an attachment-containing selection is pending. Mixed host/attachment choices are supported; hidden cards are masked; selection and confirmation call the shared Engine. No GameState mutation or duplicated card rules in UI.
- Chromium/WebKit actual paths: normal copy source, transfer pair, reselect source, existing SET4-64 destruction/optional damage, new SET5-63/64 choices. Portrait to landscape also checks no document overflow.
- Test: tests/attachment-selection-human-paths.cjs. Engine regression remains tests/adversarial-set2-set4-audit.test.js, tests/set4-independent-audit-fixes.test.js and full suite.
- Existing declared SET4 availability retained after local fix. No final AUDITED assertion; iPhone hardware check remains necessary.

## Independent review focus

Mixed selection groups, nested dialogs/focus, stale attachment candidates, CPU versus Human control, and copied/reattached enhancements. Extensive prior Human smoke tested attack labels/hand actions, not every attachment choice; do not treat that as full-path proof.
