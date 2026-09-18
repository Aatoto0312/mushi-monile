'use strict';
const assert = require('node:assert/strict');
require('./engine-loader.js');
function element(tag) {
  return { tagName:tag, children:[], dataset:{}, style:{}, className:'', textContent:'',
    classList:{add(){}}, setAttribute(){}, addEventListener(){}, appendChild(child){this.children.push(child);return child;} };
}
global.document={createElement:element};
global.window=global;
require('../shared/card-art-manifest.js');
require('../shared/card-visuals.js');
require('../js/ui/card-ui.js');
const card={instanceId:'hidden-test',cardId:'kabutomushi',faceDown:true};
const hidden=CardUI.renderCard(card,ZONES.FIELD);
assert(hidden.className.includes('face-down'),'A face-down field card must not reveal its card artwork or identity');
assert(!JSON.stringify(hidden).includes('カブトムシ'),'Hidden card name must not be present in accessible DOM');
assert.equal(MushiCardVisuals.artwork({set:'STARTER',officialNumber:'40/130'}).image,MushiCardVisuals.artwork({set:'BOOSTER_SET_1',officialNumber:'40/130'}).image);
assert.equal(MushiCardVisuals.artwork({set:'UNKNOWN',officialNumber:'40/130'}),null,'Unknown cards must not borrow unrelated artwork');
assert.equal(MushiCardVisuals.artwork({set:'STARTER',officialNumber:null}),null);
assert.equal(Object.keys(MushiCardArt).length,501);
require('../js/ui/battle-ui.js');
const helpers=require('./helpers.js');
const state=helpers.newGame({rng:helpers.firstPlayerRng});
state.activePlayerId='P1';state.phase=Phases.MAIN_PHASE;
let passedDevice=false;
const ui=Object.assign(Object.create(BattleUI.prototype),{state,cpuMode:true,actionState:{mode:'idle'},cancelAttack(){},render(){},showPassOverlay(){passedDevice=true;}});
ui.onEndTurn();
assert.equal(passedDevice,false,'CPU games must not open the hotseat device-passing overlay');
console.log('Astra presentation: 7 assertions passed');
