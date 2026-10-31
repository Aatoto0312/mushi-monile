'use strict';
// Exact, source-backed deltas against the immutable legacy snapshot. These are
// metadata corrections, never permission to ignore arbitrary snapshot fields.
var corrections=Object.freeze([Object.freeze({canonicalCardId:'tonosamabatta',field:'tags',from:Object.freeze(['starter']),to:Object.freeze(['starter','バッタ科']),reasonCode:'OFFICIAL_METADATA_CORRECTION',sourceRef:'https://mushijingi.jimdofree.com/q-a-よくある質問-1/第４弾のカードについて/',notes:'Neptune QA explicitly identifies the starter grasshopper as バッタ科; printed71/130 scan confirms it.'})]);
function matches(cardId,field,before,after){return corrections.some(function(correction){return correction.canonicalCardId===cardId&&correction.field===field&&JSON.stringify(before)===JSON.stringify(correction.from)&&JSON.stringify(after)===JSON.stringify(correction.to);});}
module.exports={corrections:corrections,matches:matches};
