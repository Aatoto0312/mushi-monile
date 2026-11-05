'use strict';
const cases=['set7_023','set7_027'].flatMap(id=>['variable','hand','replacement','high'].map(v=>[id,v]));
function setup(c,s,id,variant){
 s.phase='MAIN_PHASE';s.turnNumber=3;s.activePlayerId='P1';s.pendingEffect=null;
 for(const p of s.playerOrder)for(const z of ['field','hand','food','discard','territory'])s.player(p)[z]=[];
 s.player('P1').availableCost=20;
 function put(cardId,zone,p='P1'){const d=c.getCardDefinition(cardId);if(!d)throw Error('MISSING_COUNTER_DEFINITION '+cardId);const x=new c.CardInstance({instanceId:s.nextInstanceId(),cardId,ownerId:p,controllerId:p,zone,baseHp:d.baseHp,currentHp:d.baseHp});s.player(p)[zone.toLowerCase()].push(x);return x;}
 const watcher=put(id,'FIELD','P2');
 if(variant==='variable')put(id,'FIELD','P2');
 if(variant==='replacement'){const a=put('set1_102','HAND','P2');s.player('P2').hand=[];a.zone='ATTACHMENT';watcher.attachments.push(a);}
 const spell=put(variant==='hand'?'set1_125':variant==='variable'?'set3_054':variant==='high'?'set2_053':'mushi_no_ibuki','HAND');
 let target=null,privateCard=null;
 if(variant==='hand'){target=put('kabutomushi','HAND');privateCard=put('okamakiri','HAND');}
 if(variant==='variable'||variant==='high'){target=put('namitentou','FIELD','P2');target.currentHp=3000;}
 return {spell,watcher,target,privateCard};
}
module.exports={cases,setup};
