'use strict';

var fs = require('fs');
var path = require('path');
var TestRunner = require('./lib.js');
var runner = new TestRunner();

require('./engine-loader.js');
require(path.join(__dirname, '..', 'js', 'tutorial', 'tutorial-scenario.js'));
require(path.join(__dirname, '..', 'js', 'tutorial', 'tutorial-controller.js'));

function setup() {
  var engine = new global.GameEngine();
  var ui = { state: null, actionState: { mode: 'idle' }, render: function () {} };
  var controller = new global.TutorialController(engine, ui, global.TUTORIAL_SCENARIOS.basicV01);
  controller.start();
  ui.state = engine.state;
  return { engine: engine, state: engine.state, ui: ui, controller: controller };
}

function instance(state, id) {
  var found = global.findAnywhere(state, id);
  return found && found.instance;
}

function advance(x) { x.controller.observe(); }

runner.test('Tutorial1 scenario has structured identity, initialState and steps', function () {
  var s = global.TUTORIAL_SCENARIOS.basicV01;
  runner.assertEqual(s.id, 'basic-v01');
  runner.assertTrue(!!s.title && !!s.description && !!s.initialState);
  runner.assertTrue(s.steps.length >= 10);
});

runner.test('Tutorial2 every step uses structured allowedActions and completionCondition', function () {
  global.TUTORIAL_SCENARIOS.basicV01.steps.forEach(function (step) {
    runner.assertTrue(!!step.id && !!step.message);
    runner.assertTrue(Array.isArray(step.allowedActions));
    runner.assertTrue(!!step.completionCondition && !!step.completionCondition.type);
  });
});

runner.test('Tutorial3 starts in DRAW_PHASE without CpuRunner', function () {
  var x = setup();
  runner.assertEqual(x.state.phase, global.Phases.DRAW_PHASE);
  runner.assertEqual(x.state.activePlayerId, 'P1');
  runner.assertEqual(x.ui.cpuRunner, undefined);
});

runner.test('Tutorial4 fixed scenario uses normal GameState and standard zones', function () {
  var x = setup();
  runner.assertTrue(x.state instanceof global.GameState);
  runner.assertTrue(Array.isArray(x.state.player('P1').deck));
  runner.assertTrue(Array.isArray(x.state.player('P2').territory));
});

runner.test('Tutorial5 draw completion requires the specified card to move deck to hand', function () {
  var x = setup();
  var drawId = x.controller.refs.drawCardInstanceId;
  runner.assertEqual(x.controller.currentStep().id, 'draw');
  global.drawCardOnce(x.state, 'P1'); advance(x);
  runner.assertEqual(instance(x.state, drawId).zone, global.ZONES.HAND);
  runner.assertEqual(x.controller.currentStep().id, 'set-food');
});

runner.test('Tutorial6 wrong hand card is blocked and required food card is allowed', function () {
  var x = setup(); global.drawCardOnce(x.state, 'P1'); advance(x);
  runner.assertEqual(x.controller.allows('HAND_CARD', { instanceId: x.controller.refs.foodCardInstanceId }), true);
  runner.assertEqual(x.controller.allows('HAND_CARD', { instanceId: x.controller.refs.drawCardInstanceId }), false);
});

runner.test('Tutorial7 food step completes only after real HAND to FOOD movement', function () {
  var x = setup(); global.drawCardOnce(x.state, 'P1'); advance(x);
  global.setFood(x.state, 'P1', x.controller.refs.foodCardInstanceId); advance(x);
  runner.assertEqual(instance(x.state, x.controller.refs.foodCardInstanceId).zone, global.ZONES.FOOD);
  runner.assertEqual(x.controller.currentStep().id, 'enter-main');
});

runner.test('Tutorial8 main phase completion observes Engine phase', function () {
  var x = setup(); global.drawCardOnce(x.state, 'P1'); advance(x);
  global.setFood(x.state, 'P1', x.controller.refs.foodCardInstanceId); advance(x);
  global.enterMainPhase(x.state); advance(x);
  runner.assertEqual(x.state.phase, global.Phases.MAIN_PHASE);
  runner.assertEqual(x.controller.currentStep().id, 'summon');
});

runner.test('Tutorial9 summon completion requires specified instance on FIELD', function () {
  var x = setup(); global.drawCardOnce(x.state, 'P1'); advance(x);
  global.setFood(x.state, 'P1', x.controller.refs.foodCardInstanceId); advance(x);
  global.enterMainPhase(x.state); advance(x);
  global.summonInsect(x.state, 'P1', x.controller.refs.drawCardInstanceId); advance(x);
  runner.assertEqual(instance(x.state, x.controller.refs.drawCardInstanceId).zone, global.ZONES.FIELD);
  runner.assertEqual(x.controller.currentStep().id, 'weakness-attack');
});

function reachAttack(x) {
  global.drawCardOnce(x.state, 'P1'); advance(x);
  global.setFood(x.state, 'P1', x.controller.refs.foodCardInstanceId); advance(x);
  global.enterMainPhase(x.state); advance(x);
  global.summonInsect(x.state, 'P1', x.controller.refs.drawCardInstanceId); advance(x);
}

runner.test('Tutorial10 weakness step observes ATTACK and DAMAGE BattleEvents', function () {
  var x = setup(); reachAttack(x);
  global.performAttack(x.state, x.controller.refs.drawCardInstanceId, x.controller.refs.opponentInsectInstanceId, 'INSECT', 'tobikakaru'); advance(x);
  var types = x.state.battleEvents.map(function (e) { return e.type; });
  runner.assertTrue(types.indexOf('ATTACK') >= 0 && types.indexOf('DAMAGE') >= 0);
  runner.assertEqual(x.controller.currentStep().id, 'attack-territory-resolution');
});

runner.test('Tutorial11 weakness damage is the Engine calculated x2 value', function () {
  var x = setup(); reachAttack(x);
  global.performAttack(x.state, x.controller.refs.drawCardInstanceId, x.controller.refs.opponentInsectInstanceId, 'INSECT', 'tobikakaru'); advance(x);
  var damage = x.state.battleEvents.filter(function (e) { return e.type === 'DAMAGE'; }).pop();
  runner.assertEqual(damage.colorMultiplier, 2);
  runner.assertEqual(damage.damage, 400);
});

runner.test('Tutorial11b destruction territory pending is resolved before direct attack step', function () {
  var x = setup(); reachAttack(x);
  global.performAttack(x.state, x.controller.refs.drawCardInstanceId, x.controller.refs.opponentInsectInstanceId, 'INSECT', 'tobikakaru'); advance(x);
  runner.assertEqual(x.controller.currentStep().id, 'attack-territory-resolution');
  runner.assertEqual(x.state.pendingEffect.type, 'TERRITORY_DRAW_SELECTION');
  advance(x);
  runner.assertEqual(x.state.pendingEffect, null);
  runner.assertEqual(x.controller.currentStep().id, 'direct-attack');
});

function reachDirect(x) {
  reachAttack(x);
  global.performAttack(x.state, x.controller.refs.drawCardInstanceId, x.controller.refs.opponentInsectInstanceId, 'INSECT', 'tobikakaru'); advance(x);
  advance(x);
}

runner.test('Tutorial12 direct attack uses existing attack processing', function () {
  var x = setup(); reachDirect(x);
  global.performAttack(x.state, x.controller.refs.firstDirectAttackerInstanceId, null, 'LEADER', 'taiatari'); advance(x);
  runner.assertEqual(x.controller.currentStep().id, 'territory-to-hand');
});

runner.test('Tutorial13 opponent territory is resolved through pending API and reaches hand', function () {
  var x = setup(); reachDirect(x);
  global.performAttack(x.state, x.controller.refs.firstDirectAttackerInstanceId, null, 'LEADER', 'taiatari'); advance(x);
  advance(x);
  runner.assertEqual(x.state.pendingEffect, null);
  runner.assertEqual(instance(x.state, x.controller.refs.opponentTerritoryInstanceId).zone, global.ZONES.HAND);
  runner.assertEqual(x.controller.currentStep().id, 'use-spell');
});

runner.test('Tutorial14 spell completion requires the spell card to leave HAND by real effect', function () {
  var x = setup(); x.controller.seek('use-spell'); x.state.phase = global.Phases.MAIN_PHASE;
  x.state.player('P1').availableCost = 1;
  global.useSpell(x.state, 'P1', x.controller.refs.spellInstanceId); advance(x);
  runner.assertEqual(instance(x.state, x.controller.refs.spellInstanceId).zone, global.ZONES.FOOD);
  runner.assertEqual(x.controller.currentStep().id, 'use-enhancement');
});

runner.test('Tutorial15 enhancement completion requires a real attachment', function () {
  var x = setup(); x.controller.seek('use-enhancement'); x.state.phase = global.Phases.MAIN_PHASE;
  global.useEnhancement(x.state, 'P1', x.controller.refs.enhancementInstanceId, x.controller.refs.enhancementTargetInstanceId); advance(x);
  var target = instance(x.state, x.controller.refs.enhancementTargetInstanceId);
  runner.assertTrue(target.attachments.some(function (a) { return a.instanceId === x.controller.refs.enhancementInstanceId; }));
  runner.assertEqual(x.controller.currentStep().id, 'final-direct-attack');
});

runner.test('Tutorial16 final completion requires winner and GAME_OVER', function () {
  var x = setup(); x.controller.seek('final-direct-attack'); x.state.phase = global.Phases.MAIN_PHASE;
  x.state.player('P2').field = []; x.state.player('P2').territory = [];
  global.performAttack(x.state, x.controller.refs.finalDirectAttackerInstanceId, null, 'LEADER', 'taiatari'); advance(x);
  runner.assertEqual(x.state.winner, 'P1');
  runner.assertEqual(x.state.phase, global.Phases.GAME_OVER);
  runner.assertEqual(x.controller.isComplete(), true);
});

runner.test('Tutorial17 exit resets session and clears tutorial state', function () {
  var x = setup(); x.state.pendingEffect = { type: 'TEST', playerId: 'P1' };
  x.ui.actionState.mode = 'attackTarget';
  x.controller.exit();
  runner.assertEqual(x.engine.state.pendingEffect, null);
  runner.assertEqual(x.controller.active, false);
  runner.assertEqual(x.ui.actionState.mode, 'idle');
});

runner.test('Tutorial18 mode selection and guide markup are loaded', function () {
  var html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  runner.assert(/id="btn-tutorial"/.test(html));
  runner.assert(/蟲神器が初めての方へ/.test(html));
  runner.assert(/id="tutorial-guide"/.test(html));
});

runner.test('Tutorial19 guide is responsive in portrait and landscape', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  runner.assert(/\.tutorial-guide/.test(css));
  runner.assert(/orientation:\s*landscape[\s\S]*\.tutorial-guide/.test(css));
});

runner.test('Tutorial20 allowed targets have a dedicated visible highlight', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  runner.assert(/\.tutorial-allowed/.test(css));
  runner.assert(/\.tutorial-blocked/.test(css));
});

runner.test('Tutorial20b guide does not intercept board taps and portrait has clearance', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  runner.assert(/\.tutorial-guide\s*\{[^}]*pointer-events:\s*none/.test(css));
  runner.assert(/\.tutorial-guide__head button[^}]*pointer-events:\s*auto/.test(css));
  runner.assert(/\.tutorial-active \.mobile-frame[^}]*padding-bottom/.test(css));
});

runner.test('Tutorial21 scenario text is not used as a completion condition', function () {
  global.TUTORIAL_SCENARIOS.basicV01.steps.forEach(function (step) {
    runner.assertTrue(step.completionCondition.type !== 'TEXT');
  });
});

runner.test('Tutorial22 replay creates a fresh deterministic state', function () {
  var x = setup(); var old = x.state;
  x.controller.restart();
  runner.assertTrue(x.engine.state !== old);
  runner.assertEqual(x.controller.currentStep().id, 'draw');
  runner.assertEqual(x.engine.state.phase, global.Phases.DRAW_PHASE);
});

runner.test('Tutorial23 full scenario completes through real Engine APIs', function () {
  var x = setup();
  global.drawCardOnce(x.state, 'P1'); advance(x);
  global.setFood(x.state, 'P1', x.controller.refs.foodCardInstanceId); advance(x);
  global.enterMainPhase(x.state); advance(x);
  global.summonInsect(x.state, 'P1', x.controller.refs.drawCardInstanceId); advance(x);
  global.performAttack(x.state, x.controller.refs.drawCardInstanceId, x.controller.refs.opponentInsectInstanceId, 'INSECT', 'tobikakaru'); advance(x); advance(x);
  global.performAttack(x.state, x.controller.refs.firstDirectAttackerInstanceId, null, 'LEADER', 'taiatari'); advance(x); advance(x);
  global.useSpell(x.state, 'P1', x.controller.refs.spellInstanceId); advance(x);
  global.useEnhancement(x.state, 'P1', x.controller.refs.enhancementInstanceId, x.controller.refs.enhancementTargetInstanceId); advance(x);
  global.performAttack(x.state, x.controller.refs.finalDirectAttackerInstanceId, null, 'LEADER', 'taiatari'); advance(x);
  runner.assertEqual(x.controller.isComplete(), true);
  runner.assertEqual(x.state.phase, global.Phases.GAME_OVER);
  runner.assertEqual(x.state.winner, 'P1');
  runner.assertEqual(x.state.pendingEffect, null);
});

runner.test('Tutorial24 landscape keeps opponent above human and controls beside human hand', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  var landscape = css.slice(css.indexOf('@media (orientation: landscape) and (max-height: 520px)'));
  runner.assert(/\.zone-top\s*\{\s*order:\s*1/.test(landscape), 'opponent remains above');
  runner.assert(/\.zone-bottom\s*\{\s*order:\s*2/.test(landscape), 'human board follows opponent');
  runner.assert(/\.control-bar\s*\{\s*order:\s*3/.test(landscape), 'controls stay beside the human hand');
});

runner.test('Tutorial25 landscape hand has one scroll owner and fixed non-overlapping cards', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  var landscape = css.slice(css.indexOf('@media (orientation: landscape) and (max-height: 520px)'));
  runner.assert(/\.zone-bottom \.hand-zone\s*\{[^}]*overflow-x:\s*auto/.test(landscape), 'outer tray scrolls');
  runner.assert(/\.zone-bottom \.hand-zone \.card-row\s*\{[^}]*overflow-x:\s*visible[^}]*width:\s*max-content/.test(landscape), 'inner row does not create nested scroll');
  runner.assert(/\.zone-bottom \.hand-zone \.battle-card\s*\{[^}]*flex:\s*0 0 62px[^}]*min-width:\s*62px[^}]*max-width:\s*62px/.test(landscape), 'cards remain 62px');
  runner.assert(/\.zone-bottom \.hand-zone \.card-row\s*\{[^}]*gap:\s*[5-9]px/.test(landscape), 'cards do not overlap');
});

async function runAll() { console.log('==== Tutorial v0.1 Test ===='); return runner.runAll(); }
if (require.main === module) runAll();
module.exports = { runAll: runAll };
