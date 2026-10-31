'use strict';
require('./engine-loader.js');
var h = require('./helpers.js');
var TestRunner = require('./lib.js');
var runner = new TestRunner();
runner.test('Captured dynamic AP insect counts its controller food, not its owner food', function () {
  var state = h.newGame({rng:h.firstPlayerRng});
  var captured = h.putInsectOnField(state, 'P2', 'set3_040');
  captured.ownerId = 'P1';
  state.player('P1').field = [];
  h.putInsectOnField(state, 'P1', 'set2_031');
  h.putInsectOnField(state, 'P1', 'set2_031');
  // SET3-40 counts green insects, including itself, under the controller.
  var skill = getCardDefinition(captured.cardId).skills[0];
  runner.assertEqual(getEffectiveAP(state, captured, skill.baseAp, skill), 300);
});
runner.test('Controller dynamic AP survives JSON restore and excludes facedown allies', function () {
  var state = h.newGame({rng:h.firstPlayerRng});
  var captured = h.putInsectOnField(state, 'P2', 'set3_040');
  captured.ownerId = 'P1';
  var hidden = h.putInsectOnField(state, 'P2', 'set2_031');
  hidden.faceDown = true;
  state.player('P1').field = [];
  var restored = Object.assign(new GameState(), JSON.parse(JSON.stringify(state)));
  var source = restored.player('P2').field[0];
  var skill = getCardDefinition(source.cardId).skills[0];
  runner.assertEqual(getEffectiveAP(restored, source, skill.baseAp, skill), 300);
});
module.exports = runner;
if (require.main === module) { runner.runAll(); }
