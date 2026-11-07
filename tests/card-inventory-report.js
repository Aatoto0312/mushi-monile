'use strict';
require('./engine-loader.js');
const records=require('../js/cards/full-catalog-data.js');
const statuses={};const remaining=[];
for(const r of records){const d=global.getCardDefinition(r.id);const status=d?(d.isPlayable()?'PLAYABLE':(d.implementationStatus||'UNRECOGNIZED')):'NOT_REGISTERED';statuses[status]=(statuses[status]||0)+1;if(status!=='PLAYABLE')remaining.push({id:r.id,name:r.name,type:r.type,set:r.set,status});}
console.log('CARD_INVENTORY '+JSON.stringify({total:records.length,statuses,remaining}));
