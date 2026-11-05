'use strict';const cases=['single','stack'];
function setup(c,s,variant){s.phase='MAIN_PHASE';s.turnNumber=3;s.activePlayerId='P1';s.pendingEffect=null;s.pendingUseCounters=[];for(const p of s.playerOrder)for(const z of ['hand','field','food','territory','discard'])s.player(p)[z]=[];s.player('P1').availableCost=20;
 function put(id,z,p='P1'){const d=c.getCardDefinition(id),x=new c.CardInstance({instanceId:s.nextInstanceId(),cardId:id,ownerId:p,controllerId:p,zone:z,baseHp:d.baseHp,currentHp:d.baseHp});s.player(p)[z.toLowerCase()].push(x);return x;}
 put('set7_060','HAND');if(variant==='stack')put('set7_060','HAND');for(let i=0;i<4;i++){put('namitentou','FOOD');put('namitentou','FOOD','P2');}put('mushi_no_ibuki','HAND','P2');put('mushi_no_ibuki','HAND','P2');s.player('P2').deck=[];put('mushi_no_ibuki','DECK','P2');
}module.exports={cases,setup};
