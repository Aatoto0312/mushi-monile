'use strict';

var fs = require('fs');
var path = require('path');
var TestRunner = require('./lib.js');
var h = require('./helpers.js');
var runner = new TestRunner();

require('./engine-loader.js');

var registry = {};
function makeElement(tag) {
  var el = {
    tagName: tag || 'div', children: [], dataset: {}, style: {}, textContent: '', className: '',
    _listeners: {}, disabled: false,
    appendChild: function (child) { this.children.push(child); return child; },
    addEventListener: function (type, fn) { this._listeners[type] = fn; },
    click: function () { if (this._listeners.click) this._listeners.click(); },
    setAttribute: function () {}, querySelector: function () { return null; }, querySelectorAll: function () { return []; }
  };
  el.classList = {
    add: function (c) { if ((' ' + el.className + ' ').indexOf(' ' + c + ' ') < 0) el.className += (el.className ? ' ' : '') + c; },
    remove: function (c) { el.className = el.className.split(/\s+/).filter(function (x) { return x && x !== c; }).join(' '); },
    contains: function (c) { return (' ' + el.className + ' ').indexOf(' ' + c + ' ') >= 0; }
  };
  Object.defineProperty(el, 'innerHTML', { get: function () { return ''; }, set: function () { this.children = []; } });
  return el;
}
function getById(id) { if (!registry[id]) registry[id] = makeElement('div'); return registry[id]; }
function installDom() {
  registry = {};
  global.document = { createElement: makeElement, getElementById: getById, querySelectorAll: function () { return []; } };
}

// ============================================================
// 1. Portrait responsive rules exist and preserve battle UI
// ============================================================
runner.test('SSB1 Portrait responsive rules exist and preserve battle UI elements', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  runner.assert(/--card-w-hand/.test(css), 'role-based card size custom properties defined');
  runner.assert(/--card-w-field/.test(css), 'field card size variable exists');
  runner.assert(/--card-w-opp-field/.test(css), 'opponent field card size variable exists');
  runner.assert(/--card-w-aux/.test(css), 'auxiliary card size variable exists');
  runner.assert(/\.hand-zone[\s\S]*var\(--card-w-hand\)/.test(css), 'hand zone uses role-based sizing');
  runner.assert(/\.field-card[\s\S]*var\(--card-w-field\)/.test(css), 'field card uses role-based sizing');
});

// ============================================================
// 2. Landscape responsive rules exist
// ============================================================
runner.test('SSB2 Landscape responsive rules exist with grid layout', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  runner.assert(/@media\s*\(orientation:\s*landscape\)\s*and\s*\(max-height:\s*520px\)/.test(css), 'landscape media query exists');
  runner.assert(/grid-template-areas/.test(css), 'landscape grid layout exists');
  runner.assert(/\.zone--cpu\s*\{[^}]*order:\s*1/.test(css), 'opponent stays above in landscape');
  runner.assert(/\.zone--human\s*\{[^}]*order:\s*3/.test(css), 'self stays below opponent in landscape');
  runner.assert(/\.control-bar\s*\{[^}]*order:\s*5/.test(css), 'controls stay at fixed bottom in landscape');
});

// ============================================================
// 3. CPU top / Human bottom facing layout
// ============================================================
runner.test('SSB3 CPU top / Human bottom facing layout in landscape', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  var landscape = css.slice(css.indexOf('@media (orientation: landscape) and (max-height: 520px)'));
  runner.assert(/\.zone--cpu\s*\{[^}]*"info aux"/.test(landscape), 'opponent row has info+aux compact rail');
  runner.assert(/\.zone--cpu\s*\{[^}]*"field field"/.test(landscape), 'opponent field is full width below');
  runner.assert(/\.zone--human\s*\{[^}]*"info aux"/.test(landscape), 'human row has info+aux compact rail');
  runner.assert(/\.zone--human\s*\{[^}]*"hand\s+hand"/.test(landscape), 'human hand spans full width at bottom');
});

// ============================================================
// 4. Role-based card sizing: hand > field > aux
// ============================================================
runner.test('SSB4 Hand cards are larger than field cards which are larger than aux cards', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  // Extract CSS custom property values from :root — use clamp max values for ordering
  var rootMatch = css.match(/:root\s*\{([^}]+--card-w-hand[^}]+)\}/);
  runner.assert(rootMatch, 'root contains card size variables');
  var root = rootMatch[1];

  function maxVal(decl) {
    // clamp(min, mid, max) -> return max
    var m = decl.match(/clamp\([^,]+,[^,]+,([^)]+)\)/);
    return m ? parseInt(m[1], 10) : parseInt(decl, 10);
  }
  var handMax = maxVal(root.match(/--card-w-hand:\s*([^;]+)/)[1]);
  var fieldMax = maxVal(root.match(/--card-w-field:\s*([^;]+)/)[1]);
  var oppFieldMax = maxVal(root.match(/--card-w-opp-field:\s*([^;]+)/)[1]);
  var auxMax = maxVal(root.match(/--card-w-aux:\s*([^;]+)/)[1]);
  runner.assert(handMax > fieldMax, 'hand max ' + handMax + ' > field max ' + fieldMax);
  runner.assert(fieldMax > oppFieldMax, 'field max ' + fieldMax + ' > opp field max ' + oppFieldMax);
  runner.assert(oppFieldMax > auxMax, 'opp field max ' + oppFieldMax + ' > aux max ' + auxMax);
});

// ============================================================
// 5. Landscape battle log is compact
// ============================================================
runner.test('SSB5 Landscape battle log is compact', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  var landscape = css.slice(css.indexOf('@media (orientation: landscape) and (max-height: 520px)'));
  runner.assert(/\.log-section\s*\{[^}]*max-height:\s*(clamp\(|\d+px)/.test(landscape), 'log has height constraint in landscape');
  runner.assert(/\.log-section\s*\{[^}]*order:\s*4/.test(landscape), 'log sits above fixed control bar');
});

// ============================================================
// 6. Operation controls visible in landscape
// ============================================================
runner.test('SSB6 Operation controls visible in landscape', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  var landscape = css.slice(css.indexOf('@media (orientation: landscape) and (max-height: 520px)'));
  runner.assert(/\.control-bar\s*\{/.test(landscape), 'control bar styled in landscape');
  runner.assert(/\.action-btn-wide\s*\{[^}]*min-height/.test(landscape), 'action buttons have min-height in landscape');
  runner.assert(!/\.btn-row\s*\{[^}]*display:\s*none/.test(landscape), 'button row is not hidden in landscape');
});

// ============================================================
// 7. Operation controls visible in portrait
// ============================================================
runner.test('SSB7 Operation controls visible in portrait (not display:none)', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  // The btn-row and action-btn-wide should not be hidden by default
  var portraitSection = css.slice(0, css.indexOf('@media'));
  runner.assert(/\.btn-row\s*\{[^}]*display:\s*flex/.test(portraitSection), 'btn-row uses flex display in portrait');
  runner.assert(!/\.action-btn-wide\s*\{[^}]*display:\s*none/.test(portraitSection), 'action buttons not hidden by default');
});

// ============================================================
// 8. Card detail modal has viewport constraints
// ============================================================
runner.test('SSB8 Card detail modal has viewport constraints', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  runner.assert(/\.modal-content\s*\{[^}]*max-height:\s*8[5-9]vh/.test(css), 'modal has vh max-height');
  runner.assert(/\.modal-body\s*\{[^}]*overflow-y:\s*auto/.test(css), 'modal body is scrollable');
  runner.assert(/\.modal-content\s*\{[^}]*max-width:\s*9[0-9]vw/.test(css), 'modal has vw max-width');
});

// ============================================================
// 9. Effect formatter: 爆熱弾 shows 600
// ============================================================
runner.test('SSB9 Effect formatter: 爆熱弾 shows 600 damage', function () {
  installDom();
  require(path.join(__dirname, '..', 'js', 'ui', 'card-effect-formatter.js'));
  var bakunetsu = global.getCardDefinition('jinkaichu_no_bakunetsudan');
  runner.assert(bakunetsu, 'bakunetsu card exists');
  var effects = global.CardEffectFormatter.formatCardEffects(bakunetsu);
  runner.assert(effects.length > 0, 'bakunetsu has formatted effects');
  var combined = effects.join(' ');
  runner.assert(combined.indexOf('600') !== -1, 'bakunetsu effect contains 600: ' + combined);
});

// ============================================================
// 10. Effect formatter: 爆熱弾 shows opponent insect target
// ============================================================
runner.test('SSB10 Effect formatter: 爆熱弾 shows opponent insect target', function () {
  installDom();
  var bakunetsu = global.getCardDefinition('jinkaichu_no_bakunetsudan');
  var effects = global.CardEffectFormatter.formatCardEffects(bakunetsu);
  var combined = effects.join(' ');
  runner.assert(combined.indexOf('相手') !== -1, 'bakunetsu effect mentions opponent: ' + combined);
  runner.assert(combined.indexOf('虫') !== -1, 'bakunetsu effect mentions insect: ' + combined);
});

// ============================================================
// 11. Effect formatter: 飛蝗の凶相 shows 200
// ============================================================
runner.test('SSB11 Effect formatter: 飛蝗の凶相 shows 200', function () {
  installDom();
  var batta = global.getCardDefinition('batta_no_kyousou');
  runner.assert(batta, 'batta card exists');
  var effects = global.CardEffectFormatter.formatCardEffects(batta);
  var combined = effects.join(' ');
  runner.assert(/200|２００/.test(combined), 'batta effect contains 200: ' + combined);
});

// ============================================================
// 12. Effect formatter: 飛蝗の凶相 shows all own insects target
// ============================================================
runner.test('SSB12 Effect formatter: 飛蝗の凶相 shows all own insects target', function () {
  installDom();
  var batta = global.getCardDefinition('batta_no_kyousou');
  var effects = global.CardEffectFormatter.formatCardEffects(batta);
  var combined = effects.join(' ');
  runner.assert(combined.indexOf('自分のすべての虫') !== -1, 'batta mentions all own insects: ' + combined);
});

// ============================================================
// 13. Effect formatter: 飛蝗の凶相 shows duration
// ============================================================
runner.test('SSB13 Effect formatter: 飛蝗の凶相 shows turn-end duration', function () {
  installDom();
  var batta = global.getCardDefinition('batta_no_kyousou');
  var effects = global.CardEffectFormatter.formatCardEffects(batta);
  var combined = effects.join(' ');
  runner.assert(combined.indexOf('ターン終了時まで') !== -1, 'batta mentions turn-end duration: ' + combined);
});

// ============================================================
// 14. Starter spell/enhancement card details are not empty
// ============================================================
runner.test('SSB14 Starter spell and enhancement card details are not empty', function () {
  installDom();
  var spellCards = ['jinkaichu_no_bakunetsudan', 'niji_no_kakehashi', 'mushi_no_ibuki', 'batta_no_kyousou'];
  var enhCards = ['minomushi_no_kakuremino', 'kamikiri_no_daigaku', 'tamamushiiro_no_uka', 'hariganemushi_no_michizure'];
  var formatter = global.CardEffectFormatter;

  spellCards.forEach(function (id) {
    var def = global.getCardDefinition(id);
    runner.assert(def, id + ' exists');
    var effects = formatter.formatCardEffects(def);
    runner.assert(effects.length > 0, id + ' has formatted card effects: ' + effects.join('; '));
  });

  enhCards.forEach(function (id) {
    var def = global.getCardDefinition(id);
    runner.assert(def, id + ' exists');
    var enhEffects = formatter.formatEnhancementEffects(def);
    var passiveEffects = [];
    if (def.passiveAbilities) {
      def.passiveAbilities.forEach(function (pa) {
        if (pa.effectText) passiveEffects.push(pa.effectText);
      });
    }
    runner.assert(enhEffects.length > 0 || passiveEffects.length > 0, id + ' has formatted effects');
  });
});

// ============================================================
// 15. Internal enum strings don't leak to player-facing text
// ============================================================
runner.test('SSB15 Internal enum strings do not leak to player-facing text', function () {
  installDom();
  var formatter = global.CardEffectFormatter;
  var leakedPatterns = [
    'DEAL_DAMAGE_TO_TARGET', 'APPLY_STAT_MODIFIER_TO_ALL_OWN_FIELD',
    'OPPONENT_FIELD_INSECT', 'TURN_FACE_DOWN', 'RETRIEVE_FROM_DISCARD',
    'COLOR_OVERRIDE', 'SACRIFICE_OWN_INSECT', 'MOVE_SELF',
    'CONTINUOUS_ATTACK', 'ONCE_PER_FIELD_STAY'
  ];

  // Test against all starter cards
  var allIds = ['jinkaichu_no_bakunetsudan', 'niji_no_kakehashi', 'mushi_no_ibuki', 'batta_no_kyousou',
    'minomushi_no_kakuremino', 'kamikiri_no_daigaku', 'tamamushiiro_no_uka', 'hariganemushi_no_michizure'];

  allIds.forEach(function (id) {
    var def = global.getCardDefinition(id);
    if (!def) return;
    var effects = formatter.formatCardEffects(def);
    var enhEffects = formatter.formatEnhancementEffects(def);
    var allText = effects.concat(enhEffects).join(' ');
    leakedPatterns.forEach(function (pattern) {
      runner.assert(allText.indexOf(pattern) === -1, id + ' should not contain enum: ' + pattern + ' in "' + allText + '"');
    });
  });
});

// ============================================================
// 16. CSS uses dynamic viewport (100dvh)
// ============================================================
runner.test('SSB16 CSS uses dynamic viewport (100dvh) with fixed height', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  runner.assert(/100dvh/.test(css), 'uses 100dvh for dynamic viewport');
  runner.assert(/height:\s*100dvh/.test(css), 'mobile-frame uses height: 100dvh');
  runner.assert(/overflow:\s*hidden/.test(css), 'mobile-frame locks overflow');
});

// ============================================================
// 17. Portrait layout compact enough for single-screen
// ============================================================
runner.test('SSB17 Portrait zones use viewport-responsive compact sizing', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  runner.assert(/\.zone\s*\{[^}]*padding:\s*clamp\(/.test(css), 'zone padding is viewport-responsive');
  runner.assert(/\.control-bar\s*\{[^}]*padding:\s*clamp\(/.test(css), 'control bar padding is viewport-responsive');
  runner.assert(/\.topbar\s*\{[^}]*min-height:\s*clamp\(/.test(css), 'topbar min-height is viewport-responsive');
});

// ============================================================
// 18. Battle log inline/ticker style in portrait
// ============================================================
runner.test('SSB18 Battle log uses compact inline style', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  runner.assert(/\.log-section\s*\{[^}]*margin:\s*clamp\(/.test(css), 'log section has responsive compact margin');
  runner.assert(/\.log-title\s*\{[^}]*display:\s*inline/.test(css), 'log title is inline');
  runner.assert(/\.battle-log\s*\{[^}]*display:\s*inline/.test(css), 'battle log entries render inline (ticker)');
});

// ============================================================
// 19. Card detail modal uses dvh
// ============================================================
runner.test('SSB19 Card detail modal uses dvh units', function () {
  var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'battle.css'), 'utf8');
  runner.assert(/\.modal-content\s*\{[^}]*88dvh/.test(css), 'modal uses dvh');
  runner.assert(/\.modal-body\s*\{[^}]*68dvh/.test(css), 'modal body uses dvh');
});

// ============================================================
// 20. Effect formatter: individual effect text generation
// ============================================================
runner.test('SSB20 Effect formatter generates correct text for individual effects', function () {
  installDom();
  var f = global.CardEffectFormatter;

  // DEAL_DAMAGE_TO_TARGET
  var d1 = f.formatCardEffect({ type: 'DEAL_DAMAGE_TO_TARGET', target: 'OPPONENT_FIELD_INSECT', amount: 600 });
  runner.assert(d1.indexOf('600') !== -1, 'DEAL_DAMAGE includes amount');
  runner.assert(d1.indexOf('相手') !== -1, 'DEAL_DAMAGE includes opponent');

  // APPLY_STAT_MODIFIER_TO_ALL_OWN_FIELD
  var d2 = f.formatCardEffect({ type: 'APPLY_STAT_MODIFIER_TO_ALL_OWN_FIELD', stat: 'AP', amount: 200, duration: 'UNTIL_END_OF_TURN' });
  runner.assert(d2.indexOf('200') !== -1, 'STAT_MODIFIER includes amount');
  runner.assert(d2.indexOf('自分のすべての虫') !== -1, 'STAT_MODIFIER includes all own insects');
  runner.assert(d2.indexOf('ターン終了時まで') !== -1, 'STAT_MODIFIER includes duration');

  // Enhancement: stat
  var e1 = f.formatEnhancementEffect({ stat: 'AP', amount: 300 });
  runner.assert(e1.indexOf('300') !== -1, 'enhancement stat includes amount');
  runner.assert(e1.indexOf('攻撃力') !== -1, 'enhancement stat includes stat label');

  // Enhancement: COLOR_OVERRIDE
  var e2 = f.formatEnhancementEffect({ type: 'COLOR_OVERRIDE', colors: ['RED', 'BLUE', 'GREEN'] });
  runner.assert(e2.indexOf('赤') !== -1, 'color override mentions red');
  runner.assert(e2.indexOf('青') !== -1, 'color override mentions blue');
  runner.assert(e2.indexOf('緑') !== -1, 'color override mentions green');
});

async function runAll() { console.log('==== Single-Screen Battle Test ===='); return runner.runAll(); }
if (require.main === module) runAll();
module.exports = { runAll: runAll };
