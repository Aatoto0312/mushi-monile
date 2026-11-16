'use strict';
const deck=require('./batch-deck-scenarios.cjs'),enhancement=require('./batch-enhancement-scenarios.cjs'),insect=require('./batch-insect-scenarios.cjs');
const cases=[...deck.cases.map(id=>({id,setup:deck.setup})),...enhancement.cases.map(id=>({id,setup:enhancement.setup})),...insect.cases.map(([id])=>({id,setup:insect.setup}))];
module.exports={cases};
