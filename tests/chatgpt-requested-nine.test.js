'use strict';
require('./engine-loader');
const h = require('./helpers');
const Runner = require('./lib');
const r = new Runner();

function setup() {
  const s = h.newGame({rng: () => 0});
  h.toMainPhase(s);
  s.turnNumber = 3;
  for (const p of s.playerOrder) {
    for (const z of ['field', 'hand', 'food', 'discard']) s.player(p)[z] = [];
  }
  s.player('P1').availableCost = 20;
  return s;
}
function put(s, id, zone) {
  const card = h.addToHandRaw(s, 'P1', getCardDefinition(id));
  if (zone !== 'HAND') {
    s.player('P1').hand.pop();
    card.zone = zone;
    s.player('P1')[zone.toLowerCase()].push(card);
  }
  card.faceDown = false;
  return card;
}
r.test('腐葉の沃土: two discard cards become hidden food with turn cost suppressed', () => {
  const s = setup();
  const spell = put(s, 'set5_057', 'HAND');
  const first = put(s, 'kabutomushi', 'DISCARD');
  const second = put(s, 'namitentou', 'DISCARD');
  useSpell(s, 'P1', spell.instanceId, [first.instanceId, second.instanceId]);
  r.assertEqual(s.player('P1').food.length, 2);
  r.assertEqual(s.player('P1').discard.length, 1);
  for (const card of s.player('P1').food) {
    r.assert(card.faceDown);
    r.assertEqual(card.runtimeFlags.foodCostSuppressedTurn, s.turnNumber);
  }
});
module.exports=r;
if(require.main===module)r.runAll().then(result=>{if(result.failed)process.exitCode=1;});
