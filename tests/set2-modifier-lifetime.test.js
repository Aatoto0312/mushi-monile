'use strict';

require('./engine-loader.js');
var TestRunner = require('./lib.js');
var h = require('./helpers.js');
var runner = new TestRunner();

function fixture() {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.toMainPhase(state);
  return { state: state, card: h.putInsectOnField(state, 'P1', 'set1_003') };
}

runner.test('Scheduled AP survives intervening turn and expires after its active turn', function () {
  var f = fixture(), state = f.state, card = f.card;
  var start = state.turnNumber;
  global.addStatModifier(state, card, { stat: 'AP', amount: 300, startOffset: 2, endOffset: 2 });
  runner.assertEqual(global.getEffectiveAP(state, card, 100), 100);
  global.endTurn(state);
  runner.assertEqual(state.turnNumber, start + 1);
  runner.assertEqual(global.getEffectiveAP(state, card, 100), 100);
  runner.assertEqual(card.statModifiers.length, 1, 'future modifier remains scheduled');
  h.toMainPhase(state);
  global.endTurn(state);
  runner.assertEqual(state.turnNumber, start + 2);
  runner.assertEqual(global.getEffectiveAP(state, card, 100), 400);
  h.toMainPhase(state);
  global.endTurn(state);
  runner.assertEqual(global.getEffectiveAP(state, card, 100), 100);
  runner.assertEqual(card.statModifiers.length, 0);
});

runner.test('Multiple next-own-turn modifiers stack only within their declared turn window', function () {
  var f = fixture(), state = f.state, card = f.card;
  var start = state.turnNumber;
  for (var i = 0; i < 2; i++) {
    global.addStatModifier(state, card, { stat: 'AP', amount: 300, startOffset: 2, endOffset: 2 });
  }
  state.turnNumber = start + 1;
  global.pruneStatModifiers(state, card, false);
  state.turnNumber = start + 2;
  runner.assertEqual(global.getEffectiveAP(state, card, 100), 700);
  global.addStatModifier(state, card, { stat: 'AP', amount: 300, startOffset: 2, endOffset: 2 });
  state.turnNumber = start + 3;
  global.pruneStatModifiers(state, card, false);
  runner.assertEqual(global.getEffectiveAP(state, card, 100), 100);
  state.turnNumber = start + 4;
  runner.assertEqual(global.getEffectiveAP(state, card, 100), 400);
});

runner.test('Leaving the field cancels a future scheduled modifier', function () {
  var f = fixture();
  global.addStatModifier(f.state, f.card, { stat: 'AP', amount: 300, startOffset: 2, endOffset: 2 });
  global.moveCard(f.state, f.card.instanceId, global.ZONES.FIELD, global.ZONES.HAND);
  runner.assertEqual(f.card.statModifiers.length, 0);
});

[false, true].forEach(function (direct) {
  runner.test('Scheduled self AP applies after ' + (direct ? 'direct' : 'insect') + ' attack without boosting that attack', function () {
    var f = fixture(), state = f.state;
    var id = 'test_scheduled_self_' + direct;
    global.cardRegistry.register(new global.CardDefinition({
      id: id, name: 'Scheduled modifier test', type: global.CardTypes.INSECT,
      color: global.Attributes.RED, cost: 0, baseHp: 1000,
      implementationStatus: global.CardStatus.TEST,
      skills: [{ id: id + '_attack', name: 'Reserve AP', timing: 'ATTACK', baseAp: 100, effects: [{
        type: 'APPLY_STAT_MODIFIER', target: 'SELF', stat: 'AP', amount: 300,
        startTurnOffset: 2, endTurnOffset: 2
      }] }]
    }));
    state.turnNumber = 3;
    state.player('P2').field = [];
    var source = h.putInsectOnField(state, 'P1', id);
    var target = direct ? null : h.putInsectOnField(state, 'P2', 'set1_003', { hp: 3000 });
    var result = global.performAttack(state, source.instanceId, target && target.instanceId, direct ? 'LEADER' : 'INSECT');
    runner.assertEqual(result.apVal, 100, 'current attack is not boosted');
    runner.assertEqual(source.statModifiers.length, 1, 'modifier applies to attack source');
    if (target) { runner.assertEqual(target.statModifiers.length, 0, 'target is not boosted'); }
    state.turnNumber = 4;
    global.pruneStatModifiers(state, source, false);
    runner.assertEqual(global.getEffectiveAP(state, source, 100), 100);
    state.turnNumber = 5;
    runner.assertEqual(global.getEffectiveAP(state, source, 100), 400);
  });
});

module.exports = runner;
if (require.main === module) { runner.runAll(); }
