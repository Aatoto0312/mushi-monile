'use strict';

// エンジンの各ファイルを依存順に読み込み、global に展開する。
// 各ファイルは IIFE で globalThis(= Node では global) にメンバを生やす。

var path = require('path');
var base = path.join(__dirname, '..', 'js');

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

module.exports = {
  testDeck: global.buildStarterTestDeck()
};
