'use strict';
const cases=[['set5_044','emerge',10,1600],['set8_045','adult',7,300],['set6_003','attach',5,700],['set6_033','green',5,900],['set7_009','family',7,500]];
function setup(c,s,id,variant){
 const d=c.getCardDefinition(id);if(!d||!d.isPlayable())throw Error('UNCERTIFIED_GROWTH_CARD '+id);
 s.phase='MAIN_PHASE';s.turnNumber=3;s.activePlayerId='P1';s.pendingEffect=null;
 for(const p of s.playerOrder)for(const z of ['field','hand','discard','food'])s.player(p)[z]=[];
 function put(pid,cardId,z){const d=c.getCardDefinition(cardId),a=new c.CardInstance({instanceId:s.nextInstanceId(),cardId,ownerId:pid,controllerId:pid,zone:z,baseHp:d.baseHp,currentHp:d.baseHp});s.player(pid)[z.toLowerCase()].push(a);return a;}
 put('P1',id,variant==='emerge'?'DISCARD':'HAND');s.player('P1').availableCost=10;
 const target=put('P2','set5_004','FIELD');target.baseHp=5000;target.currentHp=5000;
 if(variant==='emerge'){put('P1','set2_034','FIELD');put('P1','set4_057','HAND');}
 if(variant==='adult'){put('P1','set2_016','HAND');put('P1','set2_032','HAND');}
 if(variant==='attach'){put('P1','minomushi_no_kakuremino','HAND');put('P1','set3_048','HAND');put('P1','set2_050','HAND');}
 if(variant==='green')put('P1','tonosamabatta','FIELD');
 if(variant==='family')put('P1','set4_001','FIELD');
}
module.exports={cases,setup};
