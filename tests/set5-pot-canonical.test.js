'use strict';
require('./engine-loader');
require('../js/engine/cpu-agent');
const h = require('./helpers'),
  Runner = require('./lib'),
  runner = new Runner();
function fixture(fn) {
  const d = getCardDefinition('set5_055');
  runner.assert(!!d, 'canonical Pot must be connected');
  runner.assert(d.isPlayable());
  {
    const s = h.newGame({ rng: h.firstPlayerRng });
    h.toMainPhase(s);
    s.player('P1').field = [];
    s.player('P1').hand = [];
    s.player('P1').territory = [];
    s.player('P1').availableCost = 10;
    const host = h.putInsectOnField(s, 'P1', 'namiageha_larva'),
      card = h.addToHandRaw(s, 'P1', d);
    fn(s, host, card);
  }
}
runner.test(
  'Canonical Pot accepts larva only and applies printed zero cost plus400HP/AP',
  () =>
    fixture((s, host, card) => {
      const adult = h.putInsectOnField(s, 'P1', 'namiageha');
      runner.assertEqual(
        getEnhancementTargetCandidates(s, 'P1', card.instanceId)
          .map((x) => x.instanceId)
          .join(','),
        host.instanceId,
      );
      const before = JSON.stringify(s);
      let rejected = false;
      try {
        useEnhancement(s, 'P1', card.instanceId, adult.instanceId);
      } catch (e) {
        rejected = true;
      }
      runner.assert(rejected);
      runner.assertEqual(JSON.stringify(s), before);
      const max = calculateMaxHp(host, s);
      useEnhancement(s, 'P1', card.instanceId, host.instanceId);
      runner.assertEqual(calculateMaxHp(host, s), max + 400);
      runner.assertEqual(s.player('P1').availableCost, 10);
    }),
);
for (const take of [true, false])
  runner.test(
    'Canonical Pot optional return ' +
      take +
      ' survives JSON and precedes territory',
    () =>
      fixture((s, host, card) => {
        useEnhancement(s, 'P1', card.instanceId, host.instanceId);
        const enemy = h.putInsectOnField(s, 'P2', 'set1_003');
        addStatModifier(s, enemy, {
          stat: 'AP',
          amount: 5000,
          duration: 'FIELD_STAY',
        });
        s.activePlayerId = 'P2';
        performAttack(
          s,
          enemy.instanceId,
          host.instanceId,
          'INSECT',
          getCardDefinition(enemy.cardId).skills[0].id,
        );
        runner.assertEqual(
          s.pendingEffect.selectionPurpose,
          'RETURN_DESTROYED_HOST_ATTACHMENT',
        );
        const copy = Object.assign(
          new GameState(),
          JSON.parse(JSON.stringify(s)),
        );
        resolveCardSelection(copy, 'P1', take ? [card.instanceId] : [], true);
        runner.assertEqual(
          findAnywhere(copy, card.instanceId).zone,
          take ? 'HAND' : 'DISCARD',
        );
        runner.assertEqual(copy.pendingEffect, null);
      }),
  );
runner.test(
  'Canonical Pot spell destruction never offers attack-only recovery',
  () =>
    fixture((s, host, card) => {
      useEnhancement(s, 'P1', card.instanceId, host.instanceId);
      destroyInsect(s, host.instanceId, 'SPELL', null, null, {
        skipTerritoryDraw: true,
      });
      runner.assertEqual(card.zone, 'DISCARD');
      runner.assertEqual(s.pendingEffect, null);
    }),
);
runner.test(
  'Canonical Pot independent copies choose separately and CPU completes both after JSON',
  () =>
    fixture((s, host, card) => {
      useEnhancement(s, 'P1', card.instanceId, host.instanceId);
      const second = h.addToHandRaw(s, 'P1', getCardDefinition('set5_055'));
      useEnhancement(s, 'P1', second.instanceId, host.instanceId);
      const enemy = h.putInsectOnField(s, 'P2', 'set1_003');
      addStatModifier(s, enemy, {
        stat: 'AP',
        amount: 5000,
        duration: 'FIELD_STAY',
      });
      s.activePlayerId = 'P2';
      performAttack(
        s,
        enemy.instanceId,
        host.instanceId,
        'INSECT',
        getCardDefinition(enemy.cardId).skills[0].id,
      );
      const copy = Object.assign(
          new GameState(),
          JSON.parse(JSON.stringify(s)),
        ),
        cpu = new CpuAgent('P1', { rng: () => 0 });
      runner.assertEqual(copy.pendingEffect.options.length, 1);
      runner.assert(cpu.executeAction(copy, cpu.getPendingAction(copy)));
      runner.assertEqual(copy.pendingEffect.options.length, 1);
      runner.assert(cpu.executeAction(copy, cpu.getPendingAction(copy)));
      runner.assertEqual(copy.pendingEffect, null);
      runner.assertEqual(findAnywhere(copy, card.instanceId).zone, 'HAND');
      runner.assertEqual(findAnywhere(copy, second.instanceId).zone, 'HAND');
    }),
);
runner.test(
  'Canonical Pot ignores host trait suppression but does not retrieve on ordinary leave',
  () =>
    fixture((s, host, card) => {
      useEnhancement(s, 'P1', card.instanceId, host.instanceId);
      host.runtimeFlags.suppressKeywordSkills = true;
      moveCard(s, host.instanceId, 'FIELD', 'HAND', { playerId: 'P1' });
      runner.assertEqual(card.zone, 'DISCARD');
      runner.assertEqual(s.pendingEffect, null);
    }),
);
runner.test(
  'Canonical Pot CPU uses only a larval host and attack AP includes printed400',
  () =>
    fixture((s, host, card) => {
      h.putInsectOnField(s, 'P1', 'namiageha');
      const skill = getCardDefinition(host.cardId).skills[0],
        before = getEffectiveAP(s, host, skill.baseAp, skill),
        cpu = new CpuAgent('P1', { rng: () => 0 }),
        action = cpu.decideMainPhaseAction(s);
      runner.assertEqual(action.type, 'USE_ENHANCEMENT');
      runner.assertEqual(action.targetInstanceId, host.instanceId);
      runner.assert(cpu.executeAction(s, action));
      runner.assertEqual(
        getEffectiveAP(s, host, skill.baseAp, skill),
        before + 400,
      );
    }),
);
runner.test(
  'Canonical Pot recovery survives host trait loss and sends captured enhancement to its owner',
  () =>
    fixture((s, host, card) => {
      useEnhancement(s, 'P1', card.instanceId, host.instanceId);
      card.ownerId = 'P2';
      host.runtimeFlags.suppressKeywordSkills = true;
      const enemy = h.putInsectOnField(s, 'P2', 'set1_003');
      addStatModifier(s, enemy, {
        stat: 'AP',
        amount: 5000,
        duration: 'FIELD_STAY',
      });
      s.activePlayerId = 'P2';
      performAttack(
        s,
        enemy.instanceId,
        host.instanceId,
        'INSECT',
        getCardDefinition(enemy.cardId).skills[0].id,
      );
      runner.assertEqual(s.pendingEffect.playerId, 'P1');
      resolveCardSelection(s, 'P1', [card.instanceId], true);
      runner.assertEqual(findAnywhere(s, card.instanceId).playerId, 'P2');
      runner.assertEqual(card.zone, 'HAND');
      runner.assertEqual(s.pendingEffect, null);
    }),
);
module.exports = runner;
if (require.main === module)
  runner.runAll().then((r) => {
    if (r.failed) process.exitCode = 1;
  });
