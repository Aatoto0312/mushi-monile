'use strict';
require('./engine-loader');
const Runner = require('./lib');
const h = require('./helpers');
const runner = new Runner();

runner.test('Silkworm seals only opponent keywords across zones through the next opponent turn, including after restore', () => {
  const state = h.newGame({rng: h.firstPlayerRng});
  h.toMainPhase(state);
  state.turnNumber = 3;
  const spell = h.addToHandRaw(state, 'P1', getCardDefinition('set8_063'));
  h.ensureCost(state, 'P1', 2);
  useSpell(state, 'P1', spell.instanceId);
  runner.assertEqual(spell.zone, 'DISCARD');
  const restored = Object.assign(new GameState(), JSON.parse(JSON.stringify(state)));
  for (const turn of [3, 4, 5]) {
    restored.turnNumber = turn;
    for (const pid of ['P1', 'P2']) {
      for (const zone of ['HAND','DECK','TERRITORY','FOOD','DISCARD','FIELD']) {
        const card = {cardId:'set3_043', ownerId:pid, controllerId:pid, zone};
        runner.assertEqual(areInsectKeywordSkillsSuppressed(restored, card), pid==='P2' && turn<=4);
      }
    }
  }
});
runner.test('Underworld Guide restores a visible discard and schedules a face-down discard for that field stay only', () => {
  for (const reenter of [false, true]) {
    const state = h.newGame({rng:h.firstPlayerRng});
    h.toMainPhase(state);
    h.ensureCost(state,'P1',2);
    const target = h.addToHandRaw(state,'P1',getCardDefinition('test_red_1'));
    const hidden = h.addToHandRaw(state,'P1',getCardDefinition('test_blue_1'));
    const spell = h.addToHandRaw(state,'P1',getCardDefinition('set8_062'));
    for (const card of [target,hidden]) moveCard(state,card.instanceId,ZONES.HAND,ZONES.DISCARD,{playerId:'P1',faceDown:card===hidden});
    const candidates = getSpellTargetCandidates(state,'P1',spell.instanceId);
    runner.assert(candidates.some(c=>c.instanceId===target.instanceId));
    runner.assert(!candidates.some(c=>c.instanceId===hidden.instanceId));
    useSpell(state,'P1',spell.instanceId,target.instanceId);
    runner.assertEqual(target.zone,ZONES.FIELD);
    if (reenter) {
      moveCard(state,target.instanceId,ZONES.FIELD,ZONES.HAND,{playerId:'P1'});
      moveCard(state,target.instanceId,ZONES.HAND,ZONES.FIELD,{playerId:'P1'});
    }
    const restored=Object.assign(new GameState(),JSON.parse(JSON.stringify(state)));
    endTurn(restored);
    const destination=reenter?restored.player('P1').field:restored.player('P1').discard;
    const after=destination.find(c=>c.instanceId===target.instanceId);
    runner.assert(after);
    runner.assertEqual(after.faceDown,!reenter);
  }
});
require('../js/engine/cpu-agent');
for (const id of ['set8_062','set8_063']) {
  runner.test(id + ' CPU plays the spell and resolves its legal target', () => {
    const state=h.newGame({rng:h.firstPlayerRng});
    h.toMainPhase(state);
    state.player('P1').hand=[];
    h.ensureCost(state,'P1',2);
    const target=h.addToHandRaw(state,'P1',getCardDefinition('test_red_1'));
    moveCard(state,target.instanceId,ZONES.HAND,ZONES.DISCARD,{playerId:'P1'});
    const spell=h.addToHandRaw(state,'P1',getCardDefinition(id));
    const cpu=new CpuAgent('P1',{rng:()=>0});
    const action=cpu.decideMainPhaseAction(state);
    runner.assertEqual(action.instanceId,spell.instanceId);
    runner.assert(cpu.executeAction(state,action));
    runner.assertEqual(spell.zone,ZONES.DISCARD);
    if (id==='set8_062') runner.assertEqual(target.zone,ZONES.FIELD);
    else runner.assertEqual(state.player('P2').keywordSuppressionUntilTurn,state.turnNumber+1);
  });
}
runner.test('Ordinary discard retrieval ignores a face-down insect without revealing its identity', () => {
  const state=h.newGame({rng:h.firstPlayerRng});
  h.toMainPhase(state);
  h.ensureCost(state,'P1',2);
  const hidden=h.addToHandRaw(state,'P1',getCardDefinition('test_red_1'));
  moveCard(state,hidden.instanceId,ZONES.HAND,ZONES.DISCARD,{playerId:'P1',faceDown:true});
  const bridge=h.addToHandRaw(state,'P1',getCardDefinition('niji_no_kakehashi'));
  useSpell(state,'P1',bridge.instanceId);
  runner.assertEqual(hidden.zone,ZONES.DISCARD);
  runner.assertEqual(hidden.faceDown,true);
  runner.assertEqual(state.pendingEffect,null);
});
module.exports = runner;
if (require.main === module) runner.runAll();
