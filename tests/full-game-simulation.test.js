'use strict';

var path = require('path');
var base = path.join(__dirname, '..', 'js');

// エンジンとカードをロード
require(path.join(base, 'cards', 'card-definition.js'));
require(path.join(base, 'cards', 'card-instance.js'));
require(path.join(base, 'cards', 'card-registry.js'));
require(path.join(base, 'cards', 'test-cards.js'));
require(path.join(base, 'cards', 'starter-cards.js'));
require(path.join(base, 'engine', 'game-state.js'));
require(path.join(base, 'engine', 'stat-modifier.js'));
require(path.join(base, 'engine', 'rules.js'));
require(path.join(base, 'engine', 'zone-engine.js'));
require(path.join(base, 'engine', 'battle-engine.js'));
require(path.join(base, 'engine', 'turn-engine.js'));
require(path.join(base, 'engine', 'game-engine.js'));

function runAll() {
  console.log('==== Full Game Simulation Test ====');
  var results = { passed: 0, failed: 0 };

  function assert(cond, msg) {
    if (cond) {
      results.passed++;
      console.log('  [PASS] ' + msg);
    } else {
      results.failed++;
      console.log('  [FAIL] ' + msg);
    }
  }

  function assertEquals(actual, expected, msg) {
    if (actual === expected) {
      results.passed++;
      console.log('  [PASS] ' + msg);
    } else {
      results.failed++;
      console.log('  [FAIL] ' + msg + '\n    expected: ' + expected + ', actual: ' + actual);
    }
  }

  // 公式スターターデッキレシピを展開
  var kabutoDeck = expandStarterDeck(STARTER_DECK_RECIPES.KABUTOMUSHI);
  var okamakiriDeck = expandStarterDeck(STARTER_DECK_RECIPES.OKAMAKIRI);

  assertEquals(kabutoDeck.length, 20, 'カブトムシデッキ 20枚');
  assertEquals(okamakiriDeck.length, 20, 'オオカマキリデッキ 20枚');

  // ゲーム開始 (決定的rngでP1を先攻に固定する)
  var state = new GameState();
  startGame(state, kabutoDeck, okamakiriDeck, function () { return 0; });

  var p1 = state.player('P1');
  var p2 = state.player('P2');

  assertEquals(p1.deck.length, 10, 'P1 山札 10枚');
  assertEquals(p1.hand.length, 4, 'P1 手札 4枚');
  assertEquals(p1.territory.length, 6, 'P1 縄張り 6枚');
  assertEquals(p2.deck.length, 10, 'P2 山札 10枚');
  assertEquals(p2.hand.length, 4, 'P2 手札 4枚');
  assertEquals(p2.territory.length, 6, 'P2 縄張り 6枚');

  // P1: 先攻1ターン目（ドローなし）
  assertEquals(state.activePlayerId, 'P1', 'P1 先攻');
  assertEquals(state.phase, Phases.DRAW_PHASE, 'ドローフェイズ');

  assertEquals(p1.hand.length, 4, 'P1 先攻1ターン目 ドローなし');

  // P1 セットフェイズ
  enterSetPhase(state);
  assertEquals(state.phase, Phases.SET_PHASE, 'セットフェイズ');
  // エサセット（最初のカード）
  setFood(state, 'P1', p1.hand[0].instanceId);
  assertEquals(p1.food.length, 1, 'P1 エサ 1枚');

  // P1 メインフェイズ
  enterMainPhase(state);
  assertEquals(state.phase, Phases.MAIN_PHASE, 'メインフェイズ');
  assertEquals(p1.availableCost, 1, 'P1 コスト 1');

  // P1 召喚可能な虫を探して召喚
  var playable = null;
  for (var i = 0; i < p1.hand.length; i++) {
    var inst = p1.hand[i];
    var def = getCardDefinition(inst.cardId);
    if (def && def.type === 'INSECT' && def.isPlayable() && p1.availableCost >= (def.cost || 0)) {
      playable = inst;
      break;
    }
  }
  if (playable) {
    summonInsect(state, 'P1', playable.instanceId);
    assertEquals(p1.field.length, 1, 'P1 召喚成功 FIELD=1');
    assertEquals(p1.hand.length, 3, 'P1 手札 3枚');
  }

  // P1 ターン終了
  endTurn(state);
  assertEquals(state.activePlayerId, 'P2', 'P2 のターン');
  assertEquals(state.turnNumber, 2, 'ターン 2');

  // P2: 後攻1ターン目（endTurnでドロー済み）
  assertEquals(p2.hand.length, 5, 'P2 ドロー後手札 5枚');

  // P2 セットフェイズ
  enterSetPhase(state);
  setFood(state, 'P2', p2.hand[0].instanceId);
  assertEquals(p2.food.length, 1, 'P2 エサ 1枚');

  // P2 メインフェイズ
  enterMainPhase(state);
  assertEquals(p2.availableCost, 1, 'P2 コスト 1');

  // P2 召喚
  var playable2 = null;
  for (var j = 0; j < p2.hand.length; j++) {
    var inst2 = p2.hand[j];
    var def2 = getCardDefinition(inst2.cardId);
    if (def2 && def2.type === 'INSECT' && def2.isPlayable() && p2.availableCost >= (def2.cost || 0)) {
      playable2 = inst2;
      break;
    }
  }
  if (playable2) {
    summonInsect(state, 'P2', playable2.instanceId);
    assertEquals(p2.field.length, 1, 'P2 召喚成功 FIELD=1');
  }

  // P2 ターン終了
  endTurn(state);
  assertEquals(state.activePlayerId, 'P1', 'P1 のターンに戻る');
  assertEquals(state.turnNumber, 3, 'ターン 3');

  // P1 2ターン目（endTurnでドロー済み）
  assertEquals(p1.hand.length, 4, 'P1 ドロー後手札 4枚');

  enterSetPhase(state);
  setFood(state, 'P1', p1.hand[0].instanceId);
  assertEquals(p1.food.length, 2, 'P1 エサ 2枚');

  enterMainPhase(state);
  assertEquals(p1.availableCost, 2, 'P1 コスト 2');

  // 2体目の召喚
  var playable3 = null;
  for (var k = 0; k < p1.hand.length; k++) {
    var inst3 = p1.hand[k];
    var def3 = getCardDefinition(inst3.cardId);
    if (def3 && def3.type === 'INSECT' && def3.isPlayable() && p1.availableCost >= (def3.cost || 0)) {
      playable3 = inst3;
      break;
    }
  }
  if (playable3) {
    summonInsect(state, 'P1', playable3.instanceId);
    assertEquals(p1.field.length, 1, 'P1 召喚 FIELD=1');
  }

  // P1 攻撃（相手の虫を攻撃）
  var p1Field = state.player('P1').field;
  var p2Field = state.player('P2').field;
  if (p1Field.length > 0 && p2Field.length > 0) {
    var attacker = p1Field[0];
    var targets = getLegalAttackTargets(state, attacker.instanceId);
    if (targets.length > 0) {
      var target = targets[0];
      var beforeHp = p2Field[0].currentHp;
      performAttack(state, attacker.instanceId, target.instance ? target.instance.instanceId : null, target.targetType, null);
      // 攻撃後の確認
      if (target.targetType === 'INSECT') {
        var defender = findInZone(state, 'P2', ZONES.FIELD, target.instance.instanceId);
        if (defender) {
          assert(defender.currentHp < beforeHp || defender.zone === ZONES.DISCARD, 'ダメージが通ったか破壊された');
        }
        // 縄張りドローが発生したか確認（破壊された場合）
        if (p2.territory.length < 6) {
          assertEquals(p2.territory.length, 5, '相手虫破壊で縄張り-1');
          assertEquals(p2.hand.length, 5, '相手手札+1');
        }
      }
    }
  }

  // P1 ターン終了
  endTurn(state);
  assertEquals(state.activePlayerId, 'P2', 'P2 のターン');

  // 以降は簡易的に数ターン回してエラーが出ないことを確認
  for (var turn = 0; turn < 4; turn++) {
    var active = state.activePlayerId;
    var player = state.player(active);
    
    enterSetPhase(state);
    if (player.hand.length > 0) {
      setFood(state, active, player.hand[0].instanceId);
    }
    enterMainPhase(state);
    
    // 召喚可能なら召喚
    for (var m = 0; m < player.hand.length; m++) {
      var instM = player.hand[m];
      var defM = getCardDefinition(instM.cardId);
      if (defM && defM.type === 'INSECT' && defM.isPlayable() && player.availableCost >= (defM.cost || 0)) {
        summonInsect(state, active, instM.instanceId);
        break;
      }
    }
    
    // 攻撃可能なら攻撃
    var myField = state.player(active).field;
    var oppId = state.opponentOf(active);
    var oppField = state.player(oppId).field;
    if (myField.length > 0) {
      var atk = myField[0];
      if (!atk.attackedThisTurn) {
        var targets = getLegalAttackTargets(state, atk.instanceId);
        if (targets.length > 0) {
          var t = targets[0];
          try {
            performAttack(state, atk.instanceId, t.instance ? t.instance.instanceId : null, t.targetType, null);
          } catch (e) {
            // 攻撃エラーは許容（コスト不足など）
          }
        }
      }
    }
    
    endTurn(state);
    
    // 勝利判定
    if (state.winner) {
      assertEquals(state.winner, state.activePlayerId === 'P1' ? 'P2' : 'P1', '勝利判定: ' + state.winner);
      assertEquals(state.phase, Phases.GAME_OVER, 'ゲーム終了状態');
      break;
    }
  }

  console.log('  Final state: turn=' + state.turnNumber + ', active=' + state.activePlayerId + ', winner=' + state.winner + ', P1 territory=' + state.player('P1').territory.length + ', P2 territory=' + state.player('P2').territory.length);

  console.log('==== RESULTS ====');
  console.log('Total: ' + (results.passed + results.failed) + '  Passed: ' + results.passed + '  Failed: ' + results.failed);
  return results;
}

if (require.main === module) {
  runAll();
}

module.exports = {
  runAll: runAll
};