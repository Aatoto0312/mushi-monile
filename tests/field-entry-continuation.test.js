'use strict';
require('./engine-loader.js');
var h = require('./helpers.js'), Runner = require('./lib.js'), runner = new Runner();
function fixture() {
  var state = h.newGame({ rng: h.firstPlayerRng }); h.toMainPhase(state);
  var def = global.cardRegistry.getAll().find(function(d) {
    return (d.passiveAbilities || []).some(function(a) { return a.timing === 'ON_ENTER_FIELD'; });
  });
  return { state: state, def: def };
}
runner.test('Discard revival runs the same optional entry selection as normal summon', function() {
  var f = fixture(), card = h.addToHandRaw(f.state, 'P1', f.def);
  global.moveCard(f.state, card.instanceId, 'HAND', 'DISCARD');
  global.moveCard(f.state, card.instanceId, 'DISCARD', 'FIELD');
  runner.assertEqual(f.state.pendingEffect.selectionPurpose, 'ON_ENTER_FIELD_MOVE');
  var cost = f.state.player('P1').availableCost;
  global.resolveCardSelection(f.state, 'P1', [f.state.pendingEffect.options[0]], true);
  runner.assertEqual(f.state.pendingEffect, null);
  runner.assertEqual(f.state.player('P1').availableCost, cost);
});
runner.test('Two simultaneous entries preserve both serializable optional selections', function() {
  var f = fixture(), first = h.addToHandRaw(f.state, 'P1', f.def), second = h.addToHandRaw(f.state, 'P1', f.def);
  global.batchMoveCards(f.state, [first, second].map(function(card) {
    return { instanceId: card.instanceId, from: 'HAND', to: 'FIELD', playerId: 'P1' };
  }));
  runner.assert(f.state.pendingEffect);
  runner.assert(f.state.pendingEffect.options.indexOf(second.instanceId) === -1, 'all moves commit before choices');
  f.state.pendingEffect = JSON.parse(JSON.stringify(f.state.pendingEffect));
  global.resolveCardSelection(f.state, 'P1', [], true);
  runner.assertEqual(f.state.pendingEffect.selectionPurpose, 'ON_ENTER_FIELD_MOVE');
  global.resolveCardSelection(f.state, 'P1', [], true);
  runner.assertEqual(f.state.pendingEffect, null);
});
module.exports = runner;
if (require.main === module) runner.runAll().then(function(r) { if (r.failed) process.exitCode = 1; });
