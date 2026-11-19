'use strict';
function setup(c,s,extra){
 s.phase='MAIN_PHASE';s.turnNumber=3;s.activePlayerId='P1';s.pendingEffect=null;s.freeCardUse=null;s.battleEvents=[];
 for(const pid of s.playerOrder)for(const zone of ['field','hand','food','discard','territory'])s.player(pid)[zone]=[];
 s.player('P1').availableCost=0;
 function put(id,zone,pid='P1'){const d=c.getCardDefinition(id),x=new c.CardInstance({instanceId:s.nextInstanceId(),cardId:id,ownerId:pid,controllerId:pid,zone,baseHp:d.baseHp,currentHp:d.baseHp});s.player(pid)[zone.toLowerCase()].push(x);return x;}
 const source=put('set6_001','FIELD'),target=put('set6_016','FIELD','P2');target.currentHp=5000;
 put('set1_116','HAND');put('set1_123','HAND');put('set6_016','FOOD');put('set6_016','FOOD');if(extra)put(extra,'HAND');
 return {source,target};
}
module.exports={setup};
