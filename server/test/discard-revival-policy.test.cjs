'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createRuntime } = require('../lib/runtime.cjs');

test('discard-to-field guard follows visible attachments after state restoration', () => {
  const runtime = createRuntime();
  const c = runtime.context;
  let state = runtime.start(runtime.preset('KABUTOMUSHI'), runtime.preset('OKAMAKIRI'), () => 0);
  function card(id, playerId, zone) {
    const definition = c.getCardDefinition(id);
    return new c.CardInstance({ instanceId: state.nextInstanceId(), cardId: id,
      ownerId: playerId, controllerId: playerId, zone, baseHp: definition.baseHp });
  }
  const host = card('namitentou', 'P2', 'FIELD');
  const insect = card('namitentou', 'P1', 'DISCARD');
  host.attachments.push(card('set8_050', 'P2', 'ATTACHMENT'));
  state.player('P2').field.push(host);
  state.player('P1').discard.push(insect);
  state = runtime.restore(state);
  assert.equal(c.isDiscardRevivalBlocked(state), true);
  assert.throws(() => c.moveCard(state, insect.instanceId, 'DISCARD', 'FIELD'), /捨て札/);
  assert.equal(state.player('P1').discard.at(-1).instanceId, insect.instanceId);
  state.player('P2').field[0].faceDown = true;
  assert.equal(c.isDiscardRevivalBlocked(state), false);
  c.moveCard(state, insect.instanceId, 'DISCARD', 'FIELD');
  assert.equal(state.player('P1').field.at(-1).instanceId, insect.instanceId);
});
