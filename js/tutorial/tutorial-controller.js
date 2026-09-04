(function (global) {
  'use strict';
  function TutorialController(engine, ui, scenario) { this.engine = engine; this.ui = ui; this.scenario = scenario; this.active = false; this.stepIndex = 0; this.refs = {}; this._completed = false; }
  TutorialController.prototype._definitionDeck = function () { var ids = ['akiakane', 'namitentou', 'mushi_no_ibuki', 'kamikiri_no_daigaku', 'nijuuyaahoshitentou', 'kanabun']; var defs = []; for (var i = 0; i < 20; i++) defs.push(global.getCardDefinition(ids[i % ids.length])); return defs; };
  TutorialController.prototype._make = function (state, ownerId, cardId, zone, suffix) { var def = global.getCardDefinition(cardId); return new global.CardInstance({ instanceId: 'tutorial_' + suffix, cardId: cardId, ownerId: ownerId, controllerId: ownerId, zone: zone, faceDown: zone === global.ZONES.TERRITORY, currentHp: def && def.baseHp, baseHp: def && def.baseHp, attackedThisTurn: false }); };
  TutorialController.prototype._initializeState = function () {
    var c = this.scenario.initialState, deck = this._definitionDeck();
    this.engine.newGame(deck, deck.slice(), { rng: function () { return 0; } });
    var state = this.engine.state, p1 = state.player('P1'), p2 = state.player('P2'), self = this;
    ['deck', 'hand', 'territory', 'food', 'field', 'discard', 'resolving'].forEach(function (z) { p1[z] = []; p2[z] = []; });
    var food = this._make(state, 'P1', c.foodCardId, global.ZONES.HAND, 'food');
    var spell = this._make(state, 'P1', c.spellCardId, global.ZONES.HAND, 'spell');
    var enhancement = this._make(state, 'P1', c.enhancementCardId, global.ZONES.HAND, 'enhancement');
    var draw = this._make(state, 'P1', c.drawCardId, global.ZONES.DECK, 'draw');
    p1.hand.push(food, spell, enhancement); p1.deck.push(draw, this._make(state, 'P1', 'wataaburamushi', global.ZONES.DECK, 'deck_filler'));
    for (var f = 0; f < c.startingFood; f++) p1.food.push(this._make(state, 'P1', 'wataaburamushi', global.ZONES.FOOD, 'starting_food_' + f));
    var direct1 = this._make(state, 'P1', c.directAttackerCardId, global.ZONES.FIELD, 'direct_1');
    var direct2 = this._make(state, 'P1', c.directAttackerCardId, global.ZONES.FIELD, 'direct_2'); p1.field.push(direct1, direct2);
    p1.territory.push(this._make(state, 'P1', 'namitentou', global.ZONES.TERRITORY, 'p1_territory'));
    var opponent = this._make(state, 'P2', c.opponentInsectCardId, global.ZONES.FIELD, 'opponent_insect');
    var attackTerritory = this._make(state, 'P2', c.opponentTerritoryCardId, global.ZONES.TERRITORY, 'attack_territory');
    var territory = this._make(state, 'P2', c.opponentTerritoryCardId, global.ZONES.TERRITORY, 'opponent_territory'); p2.field.push(opponent); p2.territory.push(attackTerritory, territory); p2.deck.push(this._make(state, 'P2', 'namitentou', global.ZONES.DECK, 'p2_deck'));
    state.turnNumber = c.turnNumber; state.firstPlayerId = c.firstPlayerId; state.activePlayerId = c.activePlayerId; state.phase = global.Phases.DRAW_PHASE; state.manualDrawPlayers = ['P1']; state.drewThisTurn = false; state.pendingEffect = null; state.winner = null; state.battleEvents = []; state._battleEventCounter = 0; p1.availableCost = 0; p1.foodSetThisTurn = 0;
    this.refs = { drawCardInstanceId: draw.instanceId, foodCardInstanceId: food.instanceId, spellInstanceId: spell.instanceId, enhancementInstanceId: enhancement.instanceId, enhancementTargetInstanceId: direct2.instanceId, opponentInsectInstanceId: opponent.instanceId, firstDirectAttackerInstanceId: direct1.instanceId, finalDirectAttackerInstanceId: direct2.instanceId, attackTerritoryInstanceId: attackTerritory.instanceId, opponentTerritoryInstanceId: territory.instanceId };
    return state;
  };
  TutorialController.prototype.start = function () { this.active = true; this._completed = false; this.stepIndex = 0; this._initializeState(); if (this.ui) this.ui.state = this.engine.state; return this.engine.state; };
  TutorialController.prototype.restart = function () { return this.start(); };
  TutorialController.prototype.currentStep = function () { return this.scenario.steps[this.stepIndex] || null; };
  TutorialController.prototype.isComplete = function () { return this._completed; };
  TutorialController.prototype.seek = function (id) { for (var i = 0; i < this.scenario.steps.length; i++) if (this.scenario.steps[i].id === id) { this.stepIndex = i; this._completed = false; return; } throw new Error('Unknown tutorial step: ' + id); };
  TutorialController.prototype.allows = function (action, payload) { if (!this.active || this._completed) return !this._completed; var step = this.currentStep(); if (!step || step.allowedActions.indexOf(action) === -1) return false; payload = payload || {}; if (step.skillId && payload.skillId && payload.skillId !== step.skillId) return false; if (step.allowedRefs && payload.instanceId) { var ids = step.allowedRefs.map(function (ref) { return this.refs[ref]; }, this); return ids.indexOf(payload.instanceId) !== -1; } return true; };
  TutorialController.prototype.allowedInstanceIds = function () { var step = this.currentStep(); return !step || !step.allowedRefs ? [] : step.allowedRefs.map(function (ref) { return this.refs[ref]; }, this); };
  TutorialController.prototype._conditionMet = function (condition) {
    var state = this.engine.state, holder;
    if (condition.type === 'INSTANCE_IN_ZONE') { holder = global.findAnywhere(state, this.refs[condition.ref]); return !!holder && holder.zone === condition.zone; }
    if (condition.type === 'PHASE') return state.phase === global.Phases[condition.phase];
    if (condition.type === 'PENDING') return !!state.pendingEffect && state.pendingEffect.type === condition.pendingType && state.pendingEffect.playerId === condition.playerId;
    if (condition.type === 'DAMAGE_EVENT') { var source = this.refs[condition.sourceRef], target = this.refs[condition.targetRef]; var matched = state.battleEvents.some(function (e) { return e.type === 'DAMAGE' && e.sourceInstanceId === source && e.targetInstanceId === target && e.colorMultiplier === condition.multiplier; }); holder = global.findAnywhere(state, target); return matched && (!condition.destroyed || !holder || holder.zone === global.ZONES.DISCARD); }
    if (condition.type === 'ATTACHMENT') { holder = global.findAnywhere(state, this.refs[condition.targetRef]); var attachmentId = this.refs[condition.attachmentRef]; return !!holder && (holder.instance.attachments || []).some(function (a) { return a.instanceId === attachmentId; }); }
    if (condition.type === 'GAME_OVER') return state.phase === global.Phases.GAME_OVER && state.winner === condition.winner;
    return false;
  };
  TutorialController.prototype.observe = function () { if (!this.active || this._completed) return false; var step = this.currentStep(); if (!step) return false; if (step.autoResolve === 'OPPONENT_TERRITORY') { var pending = this.engine.state.pendingEffect; if (pending && pending.type === 'TERRITORY_DRAW_SELECTION' && pending.playerId === 'P2') global.resolveTerritoryDrawSelection(this.engine.state, 'P2', this.refs[step.autoResolveRef]); } if (!this._conditionMet(step.completionCondition)) return false; this.stepIndex++; if (this.stepIndex >= this.scenario.steps.length) this._completed = true; return true; };
  TutorialController.prototype.exit = function () { this.active = false; this._completed = false; this.stepIndex = 0; this.engine.resetSession(); if (this.ui) { this.ui.state = this.engine.state; this.ui.actionState.mode = 'idle'; } };
  global.TutorialController = TutorialController;
})(typeof window !== 'undefined' ? window : globalThis);
