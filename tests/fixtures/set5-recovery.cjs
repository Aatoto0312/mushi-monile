'use strict';
function setup(c, s, number) {
  const id = 'set5_' + String(number).padStart(3, '0');
  s.phase = 'MAIN_PHASE';
  s.turnNumber = 3;
  s.activePlayerId = 'P1';
  s.pendingEffect = null;
  function make(cardId, zone, ownerId) {
    const d = c.getCardDefinition(cardId);
    return new c.CardInstance({
      instanceId: s.nextInstanceId(),
      cardId,
      ownerId,
      controllerId: ownerId,
      zone,
      baseHp: d.baseHp,
      currentHp: d.baseHp,
    });
  }
  const p = s.player('P1'),
    enemy = s.player('P2');
  p.field = [
    make(number === 55 ? 'namiageha_larva' : 'set1_003', 'FIELD', 'P1'),
  ];
  p.hand = [make(id, 'HAND', 'P1')];
  p.territory = [];
  p.availableCost = 10;
  enemy.hand = [];
  enemy.field = [make('set1_003', 'FIELD', 'P2')];
  c.addStatModifier(s, enemy.field[0], {
    stat: 'AP',
    amount: 5000,
    duration: 'FIELD_STAY',
  });
}
module.exports = { setup };
