# SET8-47 linked attachment lifecycle — separate work item

Reviewed2026-11-03 against printed scan548 and current safe414+emergence development. No implementation/status change for this card.

Printed effect is a paid attachment entering play -> its controller chooses one opposing insect and turns it facedown -> reveal that same insect when the enhancement leaves play. This does not delegate selection to the opponent. Official QA8 defines leaving play as zone movement, not faceup/facedown change.

Reuse candidates and attachments helpers, but four lifecycle boundaries still need an explicit shared hook:
1. Normal useEnhancement commits payment and attaches. It needs an immutable NORMAL_ENHANCEMENT receipt, including paid0. Forced equip and free reattachment do not inherit a paid-use receipt.
2. attachExistingEnhancement/transferExistingEnhancement must distinguish entering FIELD from moving between hosts inside FIELD. Transfer inside FIELD is not zone departure; must not incorrectly release the linked insect or replay paid-entry concealment.
3. destroyAttachedEnhancement and host FIELD departure destroy/move attachments through different paths. All true source-zone departures need exactly one linked cleanup, including destruction replacement, host return and copy/tracking effects. Avoid hard-coded card IDs.
4. Linked target identity must include its field-entry serial. Target controller changes preserve the link; target departure/reentry must not reveal a new field object with a stale link. Persist link and pending choice via JSON; reject vanished targets atomically; server capability ownership remains enhancement controller.

Specific hidden-host/enhancement interaction remains to be established rather than generalized: whether the already-created linked release is an independent granted effect or a currently suppressed enhancement effect. Existing global enhancement-classification NEEDS_RULING is not resolved by this batch. No general rule invented and no PLAYABLE certification.

Suggested failing tests: paid0/paid normal/free attach; exactly one opposing target and mandatory no-target handling; transfer without departure; host FIELD->HAND/DISCARD; enhancement destruction/return; target controller change and field serial change; both source/target moving in one serial continuation; hidden host; copy-source changes; JSON pending and duplicate operation. Run these before adding the shared attachment-entry/leave hooks. Public API and the completed emergence-family work remain separate.
