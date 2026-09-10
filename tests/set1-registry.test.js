'use strict';

require('./engine-loader.js');
require('../js/ui/card-effect-formatter.js');
var TestRunner = require('./lib.js');
var h = require('./helpers.js');
var t = new TestRunner();

var cards = global.cardRegistry.getBySet('BOOSTER_SET_1');

t.test('SET1Registry1 106種すべてが登録される', function () {
  t.assertEqual(cards.length, 106);
});

t.test('SET1Registry2 idとofficialNumberが重複しない', function () {
  t.assertEqual(new Set(cards.map(function (c) { return c.id; })).size, 106);
  t.assertEqual(new Set(cards.map(function (c) { return c.officialNumber; })).size, 106);
});

t.test('SET1Registry3 必須schemaが整合する', function () {
  cards.forEach(function (card) {
    t.assert(/^set1_\d{3}$/.test(card.id), card.id);
    t.assert(/^\d+\/130$/.test(card.officialNumber), card.officialNumber);
    t.assert(card.name && card.name.length > 0, card.officialNumber);
    t.assert(['INSECT', 'SPELL', 'ENHANCEMENT'].indexOf(card.type) !== -1, card.officialNumber);
    t.assert(Number.isInteger(card.cost) && card.cost >= 0, card.officialNumber);
    if (card.type === 'INSECT') {
      t.assert(['RED', 'BLUE', 'GREEN'].indexOf(card.color) !== -1, card.officialNumber);
      t.assert(Number.isInteger(card.baseHp) && card.baseHp > 0, card.officialNumber);
      t.assert(card.skills.length > 0, card.officialNumber);
    }
  });
});

t.test('SET1Registry4 効果なし39種はTESTEDで一括PLAYABLE', function () {
  var simple = cards.filter(function (card) {
    return card.tags.indexOf('SET1_SIMPLE') !== -1;
  });
  t.assertEqual(simple.length, 39);
  simple.forEach(function (card) {
    t.assertEqual(card.implementationStatus, global.CardStatus.TESTED, card.officialNumber);
    t.assert(card.isPlayable(), card.officialNumber);
  });
});

t.test('SET1Simple1 効果なしカードを召喚して通常攻撃できる', function () {
  var state = h.newGame({ rng: h.firstPlayerRng });
  h.toMainPhase(state);
  var attacker = h.addToHandRaw(state, 'P1', global.getCardDefinition('set1_003'));
  var defender = h.putInsectOnField(state, 'P2', 'set1_028');
  h.ensureCost(state, 'P1', 5);
  global.summonInsect(state, 'P1', attacker.instanceId);
  var result = global.performAttack(state, attacker.instanceId, defender.instanceId, 'INSECT');
  t.assertEqual(result.baseAp, 700);
  t.assertEqual(result.damageDealt, 700);
});

t.test('SET1Coverage 理由なしUNIMPLEMENTEDが0', function () {
  cards.forEach(function (card) {
    t.assert(card.implementationStatus === global.CardStatus.TESTED || card.implementationStatus === global.CardStatus.PARTIAL || card.implementationStatus === global.CardStatus.BLOCKED, card.officialNumber);
    t.assert(card.implementationNotes && card.implementationNotes.length > 0, card.officialNumber);
  });
});

t.test('SET1FullGame 20枚SET1デッキで決定的に開始し通常ターンを進行できる', function () {
  var ids = ['set1_003','set1_004','set1_012','set1_019','set1_025','set1_026','set1_028','set1_031','set1_033','set1_036'];
  var deck = ids.concat(ids).map(function (id) { return global.getCardDefinition(id); });
  var state = new global.GameState();
  global.startGame(state, deck, deck.slice(), function () { return 0; });
  t.assertEqual(state.player('P1').deck.length, 10);
  t.assertEqual(state.player('P1').hand.length, 4);
  h.toMainPhase(state);
  t.assertEqual(state.phase, global.Phases.MAIN_PHASE);
});

t.test('SET1Detail 全カードに読める詳細があり内部enumを露出しない', function () {
  cards.forEach(function (card) {
    var lines = card.skills.map(function (skill) { return skill.name + (skill.effectText || '') + (skill.baseAp != null ? ' AP' + skill.baseAp : ''); })
      .concat(card.passiveAbilities.map(function (ability) { return ability.name + (ability.effectText || ''); }))
      .concat(global.CardEffectFormatter.formatCardEffects(card))
      .concat(global.CardEffectFormatter.formatEnhancementEffects(card));
    t.assert(lines.join('').length > 0, card.officialNumber);
    t.assert(!/DEAL_DAMAGE|MOVE_TARGET|APPLY_STAT_MODIFIER|RESET_ATTACK/.test(lines.join(' ')), card.officialNumber);
  });
});

module.exports = t;
