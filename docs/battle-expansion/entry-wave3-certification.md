# Multi-food entry wave3 — development414

Base safe412 checkpoint7ed84fa246ad40a9bdd99ab4fb90306c1a32ebda. Dedicated worktree C:/Users/aatot/mushi-entry-wave3, branch crossset-entry-wave3-20261103. Two individually certified cards; no whole-set/AUDITED claim. Public366 and protected372/388/397/407/412 remain separate.

## Cards and printed-source corrections
- SET6-24 ハルゼミ: entry condition compares both players' food counts (hidden food counts too); optional own-hand0..2 cards move faceup to food in selected order and generate no cost this turn. Existing payment stays committed. Printed scan397 and official QA6 support faceup placement. Removed duplicated entry clause from catalog text.
- SET7-7 ウスバカマキリ: printed trait is 黒紋 and selects exactly2 food, optionally declining entirely. Catalog had incorrect 無紋 and upto2. Printed scan444 was visually checked and trait/text/tag corrected. Ordinary effects cannot select already-hidden food per official processing PDF. After successful pair concealment, grant100HP/AP once for that field stay, not once per food.

Supporting scans on mushijingi.com/images/card/ are actual printed images on secondary hosting, not official publisher hosting. Official sources used: https://mushijingi.jimdofree.com/q-a-よくある質問-1/第６弾のカードについて/ and the processing PDF linked from https://mushijingi.jimdofree.com/q-a-よくある質問-1/ . A legacy bareCR at the SET7/8 catalog seam was normalized while editing; no other card data at that seam changed.

## Shared mechanics / regressions
SELECT_ON_ENTRY now carries max selection count, optional exact-two combinations, explicit food face state, suppressed current-turn food cost and conditional post-selection self growth. Build eligible targets at entry; recheck every selected target before any movement/flip so a stale second card cannot partially apply the first. Duplicate IDs are rejected by the existing resolver. Successful grants follow an already-triggered source across controller change, but require the original field-entry serial; leaving/reentering cannot receive the old grant. Decline does not refund the already paid summon.

The common B board respects server/Engine combinations when enabling confirm. Red browser test proved that one selected food previously left confirm enabled; now0 or2 can confirm and1 cannot. CPU uses the same first legal pair and resolver. Server-issued capabilities/decision ownership are unchanged.

Independent review found a returned-hidden-food issue: FOOD->HAND retains an old faceDown flag. Haruzemi wrongly excluded it. A red regression was added, then shared entry selection derives visibility from SELF HAND zone rather than stale flags. Opposing zones and food/field/discard restrictions remain intact. Prior adult invitation also has a regression for this hand return route. No arbitrary hidden identity access was added.

Direct suite14 tests covers source data correction,0/1/2 food availability, target order, duplicate/single selection rejection, optional decline, source departure/reentry/capture, JSON restore, CPU, stale-card atomicity and previous adult invitation. Two room scenarios cover real players+spectator, wrong-owner rejection, duplicate operation, pending reconnect and resulting stats; a third test accepts a20-card deck containing both cards and rejects PARTIAL. New card browser flow uses actual selection UI in Chromium/WebKit for CPU and online; exact-pair confirm is asserted at1 and2 choices, online pending reload and exact attack damage are checked. No physical iPhone operated.

## Priority candidates not falsely certified
- SET8-19 アカボシゴマダラ / SET8-21 ミカドアゲハ: printed growth includes a technique name as well as spell name. Need shared technique provenance and actual matching larval routes (SET8-36/38 are unconnected). A synthetic entry receipt alone is not complete actual-flow evidence. Remain unconnected.
- SET8-47 鬼蜻蜓の簪: printed controller chooses an opposing insect, not an opponent-owned selection. Requires paid attachment-entry dispatch and linked reveal on source departure across transfer/controller/host/zone/JSON lifecycle. Remains unconnected; no invented opponent decision.
- SET7-35 ヤマトタマムシ: per-color hidden-insect food selection requires an explicit owner-private inspection projection. Current generic hidden-food selection must not leak identities or pretend blind selection fulfills color choices. Remains unconnected.

After shared extension all565 were re-inventoried:414 PLAYABLE,13 PARTIAL,138 unconnected. SET5=37/13/14;SET6=25/0/39;SET7=24/0/40;SET8=19/0/45. Remaining151. Overlapping pending groups:paid entry1,food/color10,entry9,attachment24,destruction/replacement44. No further cards automatically promoted from regex classification. Original4 timing hypotheses and paid attack-cost source-loss stop route remain isolated and unmodified.

## Local verification
Fresh full1831/0 (baseline1817+14),shared73/0,server101/0. Broad browser12/0 includes CPU complete matches/replay, online complete matches with spectator/reconnect, old UI fallback, WSS configuration and responsive geometry. Toolbox16 checks per browser engine,565 catalog and414 filter, canonical saved20-card deck and handoff. Syntax/diff checks pass. No test removed/skipped/weakened. Separate final entry browser and Linux artifact receipts are recorded below after completion.

Public API/ngrok/authentication/main were not stopped, restarted, updated or deployed. Automatic restart remains disabled. No protected knowledge, worker or screenshots/temp files belong to this commit.


## Final receipts
- Functional checkpoint5b4d41e2af8812ce6e7774618070f4d1d8c26e44; manifest checkpoint7cae507 (full identity in Git history).
- Final entry browser gate:12/0 across17 cards/68 flows, including previous15 entry cards and both new multi-food cards. Log C:/Users/aatot/.codex/tmp/wave3-entry-final.log. Full final log:wave3-full-verified.log; server:wave3-server.log; shared:wave3-shared.log; broad browser:wave3-flow-final.log; Toolbox:wave3-toolbox.log.
- A partial exact-pair selection was serialized with one selected ID, restored, completed with the second ID, and granted growth once; this final additional test changed no runtime assets.
- Linux Jekyll verification-only Actions succeeded: https://github.com/Aatoto0312/mushi-monile/actions/runs/41620241070 . Downloaded artifact independently checked:exact86 deployable files, every SHA256 and Engine/cards/contract match.87th manifest entry is build-only _config.yml; server/tests/docs/private roots excluded. Receipt:C:/Users/aatot/.codex/tmp/wave3-linux-result.json.
- Pages source remains legacy main:/; branch workflow has read-only contents permission and no deployment. No main merge/push.
- Protected412/407/397/388/372 checkouts remain clean. Original online-beta staged binary diff hash remains45016f7bd80bb86e6f6ef50b3dcef5ac6d4e28f8. Local main,origin/main,remote main remain988e4f765c3faea90551de673946e9f8945d899e.
- Efficient next dependent group:SET8-19/21 adults plus SET8-36/38 larvae (four cards) share opponent-caused destruction -> optional exact adult deployment -> named-technique provenance -> entry growth. This needs a reviewed new destruction continuation, not import of the isolated old provisional resolver. SET8-47 remains a separate linked attachment lifecycle group.
