'use strict';
const test = require('node:test'),
  assert = require('node:assert/strict');
const rt = require('../lib/runtime.cjs'),
  make = rt.createRuntime,
  { setup } = require('../../tests/fixtures/set5-recovery.cjs');
let number, state;
rt.createRuntime = () => {
  const r = make(),
    start = r.start,
    c = r.context;
  r.start = (...args) => {
    const s = start(...args);
    setup(c, s, number);
    const defender = s.player('P1'),
      host = defender.field[0],
      card = defender.hand[0];
    c.useEnhancement(s, 'P1', card.instanceId, host.instanceId);
    s.activePlayerId = 'P2';
    const attacker = s.player('P2').field[0];
    c.performAttack(
      s,
      attacker.instanceId,
      host.instanceId,
      'INSECT',
      c.getCardDefinition(attacker.cardId).skills[0].id,
    );
    return (state = s);
  };
  return r;
};
const gateway = require('../lib/gateway.cjs'),
  apply = gateway.applyCapability;
gateway.applyCapability = (...args) => {
  state = apply(...args);
  return state;
};
const { createRoomService } = require('../lib/rooms.cjs');
function client(service) {
  const messages = [],
    session = service.connect((m) => messages.push(m));
  let n = 0;
  return {
    session,
    last: (t) => messages.filter((m) => m.type === t).at(-1),
    send(type, data = {}) {
      service.receive(session, {
        type,
        requestId: 'batch_' + String(++n).padStart(8, '0'),
        versions: rt.VERSIONS,
        ...data,
      });
    },
  };
}
for (const item of [48, 49, 55])
  for (const take of [true, false])
    test('SET5 ' + item + ' room recovery ' + take + ' after reconnect', () => {
      number = item;
      const service = createRoomService({ rng: () => 0 });
      try {
        let a = client(service),
          b = client(service);
        const watcher = client(service);
        a.send('CREATE');
        const auth = { P1: a.last('SESSION') };
        b.send('JOIN', { code: auth.P1.roomCode });
        auth.P2 = b.last('SESSION');
        watcher.send('WATCH', { code: auth.P1.roomCode });
        for (const p of [a, b])
          p.send('DECK', {
            version: p.last('VIEW').room.version,
            preset: 'KABUTOMUSHI',
          });
        for (const p of [a, b])
          p.send('READY', {
            version: p.last('VIEW').room.version,
            ready: true,
          });
        let n = 0;
        function act(p, id, refs = []) {
          const message = {
            type: 'ACTION',
            requestId: 'batch_op_' + String(++n).padStart(8, '0'),
            versions: rt.VERSIONS,
            version: p.last('VIEW').room.version,
            actionId: id,
            selectedRefs: refs,
          };
          service.receive(p.session, message);
          assert(!p.last('ERROR'), JSON.stringify(p.last('ERROR')));
          const version = p.last('VIEW').room.version;
          service.receive(p.session, message);
          assert.equal(p.last('VIEW').room.version, version);
          assert.equal(p.last('ACK').duplicate, true);
        }
        const id = 'set5_' + String(number).padStart(3, '0');
        const choice = a.last('VIEW').battle.decision;
        assert.equal(choice.options.length, 1);
        for (const observer of [b, watcher])
          assert.equal(observer.last('VIEW').battle.decision, null);
        service.disconnect(a.session);
        a = client(service);
        a.send('RESUME', { code: auth.P1.roomCode, token: auth.P1.token });
        const restored = a.last('VIEW').battle.decision;
        assert.equal(restored.options.length, 1);
        act(a, restored.actionId, take ? [restored.options[0].ref] : []);
        assert.equal(state.pendingEffect, null);
        assert(
          state
            .player('P1')
            [take ? 'hand' : 'discard'].some((x) => x.cardId === id),
        );
        for (const observer of [b, watcher]) {
          const view = observer.last('VIEW').battle;
          assert.equal(view.decision, null);
          if (take)
            assert(view.players.P1.hand.every((x) => x.hidden && !x.cardId));
        }
      } finally {
        service.close();
      }
    });
