'use strict';

var TestRunner = require('./lib.js');
require('./engine-loader.js');
require('../js/engine/cpu-agent.js');
require('../js/ui/card-ui.js');
require('../js/ui/battle-ui.js');
var h = require('./helpers.js');
var runner = new TestRunner();
global.alert = global.alert || function () {};

function scenario(options) {
  options = options || {};
  var state = h.newGame({ rng: h.firstPlayerRng });
  state.activePlayerId = options.playerId || 'P1';
  state.phase = options.phase || Phases.MAIN_PHASE;
  state.pendingEffect = null;
  var player = state.player(state.activePlayerId);
  player.hand = [];
  player.field = [];
  player.availableCost = options.cost || 0;
  var field = [];
  for (var i = 0; i < (options.fieldCount || 0); i += 1) {
    field.push(h.putInsectOnField(state, state.activePlayerId, i % 2 ? 'set1_031' : 'set1_028'));
  }
  var riock = h.addToHandRaw(state, state.activePlayerId, global.getCardDefinition('set1_002'));
  return { state: state, playerId: state.activePlayerId, player: player, field: field, riock: riock };
}

function humanUi(fixture) {
  var actions = null;
  var ui = Object.create(global.BattleUI.prototype);
  ui.state = fixture.state;
  ui.cpuMode = false;
  ui.actionState = { mode: 'idle' };
  ui.showCardDetail = function (_card, suppliedActions) { actions = suppliedActions; };
  ui.hideCardDetail = function () {};
  ui.render = function () {};
  ui._tutorialAllows = function () { return true; };
  ui.onHandCardTap(fixture.playerId, fixture.riock);
  return { ui: ui, actions: function () { return actions || []; } };
}

function actionByText(actions, text) {
  return actions.filter(function (action) { return action.label.indexOf(text) !== -1; })[0] || null;
}

runner.test('Human UI offers alternative summon when cost is insufficient and two insects are available', function () {
  var f = scenario({ fieldCount: 2, cost: 0 });
  var view = humanUi(f);
  runner.assertEqual(view.actions().length, 1, 'only one available summon method');
  var alternative = actionByText(view.actions(), '虫2体');
  runner.assert(alternative, 'alternative summon action');
  alternative.onSelect();
  runner.assertEqual(f.state.pendingEffect.type, 'CARD_SELECTION', 'production UI starts shared selection pending');
  runner.assertEqual(f.state.pendingEffect.selectionPurpose, 'ALTERNATIVE_SUMMON_COST', 'pending purpose');
});

runner.test('Human UI offers both normal and alternative summon when both are legal', function () {
  var f = scenario({ fieldCount: 3, cost: 5 });
  var actions = humanUi(f).actions();
  runner.assertEqual(actions.length, 2, 'two summon methods');
  runner.assert(actionByText(actions, 'コスト 5'), 'normal summon remains available');
  runner.assert(actionByText(actions, '虫2体'), 'alternative summon is available');
});

runner.test('Human normal summon remains selectable and spends its normal cost', function () {
  var f = scenario({ fieldCount: 2, cost: 5 });
  var actions = humanUi(f).actions();
  actionByText(actions, 'コスト 5').onSelect();
  runner.assertEqual(f.riock.zone, ZONES.FIELD, 'normal summon succeeds');
  runner.assertEqual(f.player.availableCost, 0, 'normal cost is spent');
  runner.assertEqual(f.player.discard.length, 0, 'field insects are not sacrificed');
});

runner.test('Human alternative summon resolves through field taps without spending normal cost', function () {
  var f = scenario({ fieldCount: 3, cost: 0 });
  var view = humanUi(f);
  actionByText(view.actions(), '虫2体').onSelect();
  view.ui.onFieldCardTap(f.playerId, f.field[2], null);
  runner.assertEqual(f.riock.zone, ZONES.HAND, 'one choice does not summon');
  runner.assertEqual(f.state.pendingEffect.selectedIds.length, 1, 'one selected');
  view.ui.onFieldCardTap(f.playerId, f.field[0], null);
  runner.assertEqual(f.riock.zone, ZONES.FIELD, 'Riock summoned');
  runner.assertEqual(f.player.availableCost, 0, 'normal cost not spent');
  runner.assertEqual(f.player.discard.length, 2, 'selected insects sacrificed');
  runner.assertEqual(f.player.field.indexOf(f.field[1]) !== -1, true, 'unselected insect remains');
  runner.assertEqual(f.state.pendingEffect, null, 'pending completed');
});

runner.test('Alternative summon rejects insufficient, opponent, duplicate and stale targets safely', function () {
  var one = scenario({ fieldCount: 1, cost: 0 });
  runner.assertEqual(actionByText(humanUi(one).actions(), '虫2体'), null, 'one own insect is insufficient');

  var f = scenario({ fieldCount: 2, cost: 0 });
  var opponent = h.putInsectOnField(f.state, 'P2', 'set1_028');
  var view = humanUi(f);
  actionByText(view.actions(), '虫2体').onSelect();
  view.ui.onFieldCardTap('P2', opponent, null);
  runner.assertEqual(f.state.pendingEffect.selectedIds.length, 0, 'opponent insect cannot be selected');
  view.ui.onFieldCardTap(f.playerId, f.field[0], null);
  view.ui.onFieldCardTap(f.playerId, f.field[0], null);
  runner.assertEqual(f.state.pendingEffect.selectedIds.length, 0, 'second tap toggles rather than duplicates');
  view.ui.onFieldCardTap(f.playerId, f.field[0], null);
  global.moveCard(f.state, f.field[0].instanceId, ZONES.FIELD, ZONES.HAND, { playerId: f.playerId });
  var oldConsoleError = console.error;
  console.error = function () {};
  view.ui.onFieldCardTap(f.playerId, f.field[1], null);
  console.error = oldConsoleError;
  runner.assertEqual(f.riock.zone, ZONES.HAND, 'stale selection does not summon');
  runner.assertEqual(f.state.pendingEffect.type, 'CARD_SELECTION', 'pending restored for safe recovery');
});

runner.test('Human pending UI explains alternative summon selection progress', function () {
  var f = scenario({ fieldCount: 2, cost: 0 });
  global.summonInsect(f.state, f.playerId, f.riock.instanceId, { alternative: true });
  var status = { textContent: '' };
  var oldDocument = global.document;
  global.document = { getElementById: function (id) { return id === 'status-text' ? status : null; } };
  var ui = Object.create(global.BattleUI.prototype);
  ui.state = f.state;
  ui.cpuMode = false;
  ui.renderPendingEffect(f.state);
  global.document = oldDocument;
  runner.assertEqual(status.textContent, '代替召喚のため、自分の虫を2体選んでください（0/2）', 'selection guidance');
});

runner.test('Summon method query enforces phase, hand, owner and normal-card rules', function () {
  runner.assertEqual(typeof global.getAvailableSummonMethods, 'function', 'generic summon method query exists');
  var f = scenario({ fieldCount: 2, cost: 0 });
  runner.assertEqual(global.getAvailableSummonMethods(f.state, f.playerId, f.riock.instanceId).map(function (x) { return x.type; }).join(','), 'ALTERNATIVE', 'alternative only');
  f.state.phase = Phases.SET_PHASE;
  runner.assertEqual(global.getAvailableSummonMethods(f.state, f.playerId, f.riock.instanceId).length, 0, 'main phase only');
  f.state.phase = Phases.MAIN_PHASE;
  var normal = h.addToHandRaw(f.state, f.playerId, global.getCardDefinition('set1_028'));
  f.player.availableCost = global.getCardDefinition(normal.cardId).cost;
  runner.assertEqual(global.getAvailableSummonMethods(f.state, f.playerId, normal.instanceId).map(function (x) { return x.type; }).join(','), 'NORMAL', 'normal cards unchanged');
  runner.assertEqual(global.getAvailableSummonMethods(f.state, 'P2', f.riock.instanceId).length, 0, 'wrong player cannot summon hand card');
});

runner.test('CPU shared pending resolver and Hotseat P2 keep owner/controller correct', function () {
  var cpuFixture = scenario({ playerId: 'P2', fieldCount: 2, cost: 0 });
  global.summonInsect(cpuFixture.state, 'P2', cpuFixture.riock.instanceId, { alternative: true });
  var cpu = new global.CpuAgent('P2', { rng: function () { return 0; } });
  var action = cpu.getPendingAction(cpuFixture.state);
  runner.assertEqual(action.type, 'RESOLVE_CARD_SELECTION', 'CPU uses shared resolver');
  runner.assert(cpu.executeAction(cpuFixture.state, action), 'CPU resolves alternative summon pending');
  runner.assertEqual(cpuFixture.riock.zone, ZONES.FIELD, 'CPU Riock summoned');

  var hotseat = scenario({ playerId: 'P2', fieldCount: 2, cost: 0 });
  var view = humanUi(hotseat);
  actionByText(view.actions(), '虫2体').onSelect();
  view.ui.onFieldCardTap('P2', hotseat.field[0], null);
  view.ui.onFieldCardTap('P2', hotseat.field[1], null);
  runner.assertEqual(hotseat.riock.ownerId, 'P2', 'owner retained');
  runner.assertEqual(hotseat.riock.controllerId, 'P2', 'controller retained');
});

if (require.main === module) runner.runAll();
module.exports = runner;
