'use strict';
require('./engine-loader');
require('../js/engine/cpu-agent');
const h = require('./helpers'),
  Runner = require('./lib'),
  runner = new Runner();
for (const n of [48, 49])
  runner.test(
    'Canonical spear ' +
      n +
      ' rejects effectful attacks and traits, accepts lost traits and destroys on granted trait',
    () => {
      const d = getCardDefinition('set5_' + String(n).padStart(3, '0'));
      runner.assert(!!d, 'canonical spear must be connected');
      runner.assert(d.isPlayable());
      {
        const s = h.newGame({ rng: h.firstPlayerRng });
        h.toMainPhase(s);
        s.player('P1').field = [];
        s.player('P1').hand = [];
        s.player('P1').availableCost = 20;
        const plain = h.putInsectOnField(s, 'P1', 'set1_003'),
          trait = h.putInsectOnField(s, 'P1', 'set5_013'),
          effect = h.putInsectOnField(s, 'P1', 'set5_005'),
          card = h.addToHandRaw(s, 'P1', d);
        let ids = getEnhancementTargetCandidates(s, 'P1', card.instanceId).map(
          (x) => x.instanceId,
        );
        runner.assert(ids.includes(plain.instanceId));
        runner.assert(!ids.includes(trait.instanceId));
        runner.assert(!ids.includes(effect.instanceId));
        trait.runtimeFlags.suppressKeywordSkills = true;
        runner.assert(
          getEnhancementTargetCandidates(s, 'P1', card.instanceId).some(
            (x) => x.instanceId === trait.instanceId,
          ),
        );
        const hopper = cardRegistry
            .getAll()
            .find((x) => x.name === 'トノサマバッタ'),
          host = h.putInsectOnField(s, 'P1', hopper.id);
        const max = calculateMaxHp(host, s);
        useEnhancement(s, 'P1', card.instanceId, host.instanceId);
        runner.assertEqual(
          calculateMaxHp(host, s),
          max + (n === 48 ? 400 : 800),
        );
        const spell = h.addToHandRaw(s, 'P1', getCardDefinition('set3_060'));
        useSpell(s, 'P1', spell.instanceId);
        runner.assertEqual(card.zone, 'DISCARD');
      }
    },
  );
for (const n of [48, 49])
  for (const take of [false, true])
    runner.test(
      'Canonical spear ' +
        n +
        ' optional retrieval ' +
        take +
        ' after restored attack destruction',
      () => {
        const d = getCardDefinition('set5_' + String(n).padStart(3, '0'));
        runner.assert(d.isPlayable());
        {
          const s = h.newGame({ rng: h.firstPlayerRng });
          h.toMainPhase(s);
          s.player('P1').field = [];
          s.player('P1').hand = [];
          s.player('P1').territory = [];
          s.player('P1').availableCost = 10;
          const host = h.putInsectOnField(s, 'P1', 'set1_003'),
            card = h.addToHandRaw(s, 'P1', d),
            enemy = h.putInsectOnField(s, 'P2', 'set1_003');
          useEnhancement(s, 'P1', card.instanceId, host.instanceId);
          runner.assertEqual(
            s.player('P1').availableCost,
            10 - (n === 48 ? 1 : 2),
          );
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
          );
          runner.assertEqual(
            copy.pendingEffect.options.join(','),
            card.instanceId,
          );
          resolveCardSelection(copy, 'P1', take ? [card.instanceId] : [], true);
          runner.assertEqual(
            findAnywhere(copy, card.instanceId).zone,
            take ? 'HAND' : 'DISCARD',
          );
          runner.assertEqual(copy.pendingEffect, null);
        }
      },
    );
for (const mode of ['SPELL', 'MOVE'])
  runner.test(
    'Spear revalidates when global trait suppressor leaves by ' + mode,
    () => {
      const d = getCardDefinition('set5_049');
      runner.assert(d.isPlayable());
      {
        const s = h.newGame({ rng: h.firstPlayerRng });
        h.toMainPhase(s);
        s.player('P1').field = [];
        s.player('P1').hand = [];
        s.player('P1').availableCost = 10;
        const host = h.putInsectOnField(s, 'P1', 'set5_013'),
          kaiko = h.putInsectOnField(s, 'P1', 'set4_043'),
          card = h.addToHandRaw(s, 'P1', d);
        useEnhancement(s, 'P1', card.instanceId, host.instanceId);
        if (mode === 'SPELL')
          destroyInsect(s, kaiko.instanceId, 'SPELL', null, null, {
            skipTerritoryDraw: true,
          });
        else moveCard(s, kaiko.instanceId, 'FIELD', 'HAND', { playerId: 'P1' });
        runner.assertEqual(card.zone, 'DISCARD');
        runner.assertEqual(s.pendingEffect, null);
      }
    },
  );
runner.test(
  'Spear rejects a usage-limit technique and CPU equips only an effectless host',
  () => {
    const d = getCardDefinition('set5_048');
    runner.assert(d.isPlayable());
    {
      const s = h.newGame({ rng: h.firstPlayerRng });
      h.toMainPhase(s);
      s.player('P1').field = [];
      s.player('P1').hand = [];
      s.player('P1').availableCost = 10;
      const bad = h.putInsectOnField(s, 'P1', 'seakakogegumo'),
        good = h.putInsectOnField(s, 'P1', 'set1_003'),
        card = h.addToHandRaw(s, 'P1', d);
      runner.assert(
        !getEnhancementTargetCandidates(s, 'P1', card.instanceId).some(
          (c) => c.instanceId === bad.instanceId,
        ),
      );
      const cpu = new CpuAgent('P1', { rng: () => 0 }),
        action = cpu.decideMainPhaseAction(s);
      runner.assertEqual(action.type, 'USE_ENHANCEMENT');
      runner.assertEqual(action.targetInstanceId, good.instanceId);
      runner.assert(cpu.executeAction(s, action));
      runner.assertEqual(card.zone, 'FIELD');
    }
  },
);
for (const id of ['namiageha', 'minminzemi', 'nanafushimodoki'])
  runner.test(
    'Spear rejects active legacy keyword skill ' +
      id +
      ' and accepts after suppression',
    () => {
      const d = getCardDefinition('set5_048');
      runner.assert(d.isPlayable());
      {
        const s = h.newGame({ rng: h.firstPlayerRng });
        h.toMainPhase(s);
        s.player('P1').field = [];
        s.player('P1').hand = [];
        s.player('P1').availableCost = 10;
        const host = h.putInsectOnField(s, 'P1', id),
          card = h.addToHandRaw(s, 'P1', d);
        runner.assert(
          !getEnhancementTargetCandidates(s, 'P1', card.instanceId).some(
            (c) => c.instanceId === host.instanceId,
          ),
        );
        host.runtimeFlags.suppressKeywordSkills = true;
        runner.assert(
          getEnhancementTargetCandidates(s, 'P1', card.instanceId).some(
            (c) => c.instanceId === host.instanceId,
          ),
        );
      }
    },
  );
for (const equipment of ['set5_048', 'set5_049', 'set7_052', 'set7_053']) {
  runner.test(
    equipment +
      ' accepts a king whose only skill effect is disabled by emperor food',
    () => {
      const s = h.newGame({ rng: h.firstPlayerRng });
      h.toMainPhase(s);
      const host = h.putInsectOnField(s, 'P1', 'set5_015');
      const card = h.addToHandRaw(s, 'P1', getCardDefinition(equipment));
      const emperor = h.addToHandRaw(s, 'P1', getCardDefinition('set8_039'));
      const isCandidate = () =>
        getEnhancementTargetCandidates(s, 'P1', card.instanceId).some(
          (x) => x.instanceId === host.instanceId,
        );
      runner.assert(!isCandidate());
      moveCard(s, emperor.instanceId, 'HAND', 'FOOD', {
        playerId: 'P1',
        faceDown: false,
      });
      runner.assert(isCandidate());
      s.player('P1').availableCost = 10;
      useEnhancement(s, 'P1', card.instanceId, host.instanceId);
      moveCard(s, emperor.instanceId, 'FOOD', 'HAND', { playerId: 'P1' });
      runner.assertEqual(card.zone, 'DISCARD');
    },
  );
}
for (const recover of [true, false]) {
  runner.test(
    'SET5 spear recovery precedes territory draw and linked-copy destruction: ' +
      recover,
    () => {
      const s = h.newGame({ rng: h.firstPlayerRng });
      h.toMainPhase(s);
      const player = s.player('P1');
      player.availableCost = 10;
      const host = h.putInsectOnField(s, 'P1', 'set1_003'),
        other = h.putInsectOnField(s, 'P1', 'set1_004');
      const attacker = h.putInsectOnField(s, 'P2', 'set1_003');
      const spear = h.addToHandRaw(s, 'P1', getCardDefinition('set5_049'));
      useEnhancement(s, 'P1', spear.instanceId, host.instanceId);
      const copy = new CardInstance({
        instanceId: s.nextInstanceId(),
        cardId: 'set4_053',
        ownerId: 'P1',
        controllerId: 'P1',
        zone: 'FIELD',
        runtimeFlags: {
          copiedEnhancementSourceId: spear.instanceId,
          copiedStatEffects: [{ stat: 'AP', amount: 800 }],
        },
      });
      other.attachments.push(copy);
      const before = player.territory.length;
      runner.assert(before > 0);
      destroyInsect(s, host.instanceId, 'ATTACK', attacker.instanceId, {
        skill: getCardDefinition(attacker.cardId).skills[0],
      });
      runner.assertEqual(player.territory.length, before);
      runner.assertEqual(
        s.pendingEffect.selectionPurpose,
        'RETURN_DESTROYED_HOST_ATTACHMENT',
      );
      runner.assertEqual(copy.zone, 'FIELD');
      resolveCardSelection(s, 'P1', recover ? [spear.instanceId] : [], true);
      runner.assertEqual(spear.zone, recover ? 'HAND' : 'DISCARD');
      runner.assertEqual(copy.zone, recover ? 'FIELD' : 'DISCARD');
      runner.assertEqual(s.pendingEffect.type, 'TERRITORY_DRAW_SELECTION');
    },
  );
}
runner.test('Removing mask and invalid spear preserves existing host damage exactly once',()=>{
  const s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);
  s.player('P1').availableCost=10;
  const host=h.putInsectOnField(s,'P1','set5_015');
  const initialHp=host.currentHp-100;host.currentHp=initialHp;
  const mask=h.addToHandRaw(s,'P1',getCardDefinition('set5_047'));
  const spear=h.addToHandRaw(s,'P1',getCardDefinition('set5_049'));
  useEnhancement(s,'P1',mask.instanceId,host.instanceId);
  useEnhancement(s,'P1',spear.instanceId,host.instanceId);
  const spell=h.addToHandRaw(s,'P1',getCardDefinition('set5_064'));
  host.attackedThisTurn=true;
  useSpell(s,'P1',spell.instanceId,[host.instanceId]);
  resolveCardSelection(s,'P1',[mask.instanceId],true);
  runner.assertEqual(mask.zone,'DISCARD');
  runner.assertEqual(spear.zone,'DISCARD');
  runner.assertEqual(host.currentHp,initialHp);
});
module.exports = runner;
if (require.main === module)
  runner.runAll().then((r) => {
    if (r.failed) process.exitCode = 1;
  });
