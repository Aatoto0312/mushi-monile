'use strict';

var fs = require('fs');
var path = require('path');
var TestRunner = require('./lib.js');
var presenter = require('../shared/ui-presenter.js');
require('./engine-loader.js');
require('../js/ui/card-effect-formatter.js');
var catalog = require('../shared/card-data/registry-catalog.js');
var runner = new TestRunner();

function source(relativePath) {
  return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

runner.test('Toolbox user-facing copy does not expose registry field names', function () {
  var html = source('toolbox.html');
  var app = source('toolbox/toolbox-v1-app.js');
  runner.assert(html.indexOf('Card Registry') === -1, 'Card Registry is hidden');
  runner.assert(html.indexOf('>officialNumber<') === -1, 'officialNumber label is hidden');
  runner.assert(html.indexOf('・officialNumberで検索') === -1, 'officialNumber placeholder is hidden');
  runner.assert(app.indexOf('<span>Cost ') === -1, 'Cost label is localized');
  runner.assert(app.indexOf('JSON.stringify(x)') === -1, 'raw effect JSON is never rendered');
});

runner.test('Battle production UI omits development diagnostics', function () {
  var html = source('index.html');
  var ui = source('js/ui/battle-ui.js');
  runner.assert(html.indexOf('TEST BUILD') === -1, 'test-build badge removed');
  runner.assert(html.indexOf('layout-metrics') === -1, 'viewport diagnostics removed');
  runner.assert(html.indexOf('プロトタイプ') === -1, 'prototype label removed');
  runner.assert(html.indexOf('>NEW<') === -1, 'developer-style NEW label removed');
  runner.assert(ui.indexOf("'TURN '") === -1, 'turn label is localized');
  runner.assert(ui.indexOf("'STEP '") === -1 && ui.indexOf("'COMPLETE'") === -1, 'tutorial progress is localized');
  runner.assert(ui.indexOf("'P1 のターン'") === -1 && ui.indexOf("'P2 のターン'") === -1, 'player turn spacing is natural');
});

runner.test('Battle does not display raw exception messages', function () {
  var ui = source('js/ui/battle-ui.js');
  runner.assert(ui.indexOf('alert(e.message)') === -1, 'raw exception alerts removed');
  runner.assert(ui.indexOf("label + ' です。端末を渡してください。'") === -1, 'turn handoff Japanese is natural');
});

runner.test('Unknown deck cards never expose internal card identity', function () {
  var app = source('toolbox/toolbox-v1-app.js');
  var core = source('toolbox/toolbox-core.js');
  runner.assert(app.indexOf("c?c.name:x.canonicalCardId") === -1, 'deck row hides canonicalCardId');
  runner.assert(core.indexOf("'不明なカード: ' + entry.canonicalCardId") === -1, 'validation hides canonicalCardId');
});

runner.test('Shared presenter formats future sets and groups equivalent statuses', function () {
  runner.assertEqual(presenter.setLabel('STARTER'), 'スターター', 'Starter label');
  runner.assertEqual(presenter.setLabel('BOOSTER_SET_1'), '第1弾', 'SET1 label');
  runner.assertEqual(presenter.setLabel('SET12'), '第12弾', 'future set label');
  runner.assertEqual(presenter.statusGroup('TESTED'), 'PLAYABLE', 'tested status');
  runner.assertEqual(presenter.statusGroup('IMPLEMENTED'), 'PLAYABLE', 'implemented status');
  runner.assertEqual(presenter.statusGroup('SPEC_COMPLETE'), 'PLAYABLE', 'spec-complete status');
  runner.assertEqual(presenter.label('BLOCKED', 'implementationStatus'), '確認保留', 'blocked label');
  runner.assertEqual(presenter.label('SR', 'rarity'), 'SR', 'rarity remains readable');
});

runner.test('Shared presenter returns safe text for unknown effects and errors', function () {
  var internal = { type: 'INTERNAL_MECHANIC', debugPayload: { cardId: 'secret_card' } };
  runner.assertEqual(presenter.safeEffectText(internal), '効果の説明はありません。', 'unknown effect fallback');
  runner.assert(presenter.safeErrorMessage(new Error('C:\\private\\engine.js cardId=secret')).indexOf('private') === -1, 'error details hidden');
});

runner.test('Shared presenter removes internal audit notes from player rulings', function () {
  var rulings = ['攻撃以外の破壊では発動しない。', '公式カード画像/現物と矛盾した場合は本データを上書きし、一般知識で補完しない。'];
  runner.assertEqual(presenter.playerFacingRulings(rulings).length, 1, 'internal note removed');
  runner.assertEqual(presenter.playerFacingRulings(rulings)[0], rulings[0], 'game ruling retained');
});

runner.test('Toolbox detail separates insect attacks from traits and shows attack AP', function () {
  var card = catalog.fromDefinition(global.cardRegistry.get('set1_027'));
  var detail = presenter.presentCardDetail(card, global.CardEffectFormatter);
  runner.assertEqual(detail.skills.length, 1, 'one attack');
  runner.assertEqual(detail.skills[0].name, 'かみつく', 'attack name');
  runner.assertEqual(detail.skills[0].ap, 100, 'attack AP');
  runner.assertEqual(detail.traits.length, 1, 'one trait');
  runner.assertEqual(detail.traits[0].name, '蜜をためる', 'trait name');
  runner.assert(detail.traits[0].text.indexOf('手札から1枚をエサ場へ置いてもよい') !== -1, 'trait text');
  var riock = presenter.presentCardDetail(catalog.fromDefinition(global.cardRegistry.get('set1_002')), global.CardEffectFormatter);
  runner.assertEqual(riock.skills[0].ap, 600, 'Riock attack AP');
});

runner.test('Toolbox detail uses existing structured spell and enhancement effect text', function () {
  var spell = catalog.fromDefinition(global.cardRegistry.get('jinkaichu_no_bakunetsudan'));
  var spellDetail = presenter.presentCardDetail(spell, global.CardEffectFormatter);
  runner.assertEqual(spellDetail.effects[0], '相手の虫1体に600ダメージを与える。', 'spell effect');
  runner.assert(spellDetail.effects.indexOf('効果の説明はありません。') === -1, 'spell has no false fallback');
  var enhancement = catalog.fromDefinition(global.cardRegistry.get('tamamushiiro_no_uka'));
  var detail = presenter.presentCardDetail(enhancement, global.CardEffectFormatter);
  runner.assertEqual(detail.effects[0], 'この虫の色を赤か青か緑に変える。', 'enhancement effect');
  runner.assert(detail.effects.indexOf('効果の説明はありません。') === -1, 'no false fallback');
  runner.assertEqual(detail.basics.some(function (item) { return item.label === '色'; }), false, 'non-applicable color hidden');
  runner.assertEqual(detail.basics.some(function (item) { return item.label === 'HP'; }), false, 'non-applicable HP hidden');
});

runner.test('Toolbox detail fails safe without leaking internal values', function () {
  var detail = presenter.presentCardDetail({
    type: 'SPELL', color: null, cost: 0, baseHp: null,
    implementationStatus: 'TESTED', skills: [], passiveAbilities: [],
    cardEffects: [{ type: 'INTERNAL_ONLY', payload: { canonicalCardId: 'secret' } }],
    enhancementEffects: [], rulings: [null, { implementation: { debug: true } }]
  }, global.CardEffectFormatter);
  var visible = JSON.stringify(detail);
  ['canonicalCardId', 'undefined', '[object Object]', 'INTERNAL_ONLY'].forEach(function (secret) {
    runner.assert(visible.indexOf(secret) === -1, secret + ' hidden');
  });
});

module.exports = runner;
