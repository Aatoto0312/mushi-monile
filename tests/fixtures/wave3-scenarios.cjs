'use strict';
const cases=[['set6_024','haru',9,200],['set7_007','black',7,600]];
function setup(c,s,id,variant){
 const d=c.getCardDefinition(id);if(!d||!d.isPlayable())throw Error('UNCERTIFIED '+id);
 s.phase='MAIN_PHASE';s.turnNumber=3;s.activePlayerId='P1';s.pendingEffect=null;
 for(const p of s.playerOrder)for(const z of ['field','hand','discard','food'])s.player(p)[z]=[];
 function put(pid,cardId,z){const d=c.getCardDefinition(cardId),a=new c.CardInstance({instanceId:s.nextInstanceId(),cardId,ownerId:pid,controllerId:pid,zone:z,baseHp:d.baseHp,currentHp:d.baseHp});s.player(pid)[z.toLowerCase()].push(a);return a;}
 put('P1',id,variant==='emerge'?'DISCARD':'HAND');s.player('P1').availableCost=10;
 const target=put('P2','set5_004','FIELD');target.baseHp=5000;target.currentHp=5000;
 if(variant==='haru'){put('P2','namitentou','FOOD');put('P2','kabutomushi','FOOD');put('P1','minomushi_no_kakuremino','HAND');put('P1','kabutomushi','HAND');}
 if(variant==='black'){put('P1','namitentou','FOOD');put('P1','kabutomushi','FOOD');}
}
module.exports={cases,setup};
