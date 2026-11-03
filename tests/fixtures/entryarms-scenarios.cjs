'use strict';const cases=['set7_054','set7_055'];
function setup(c,s,id){s.phase='MAIN_PHASE';s.turnNumber=3;s.activePlayerId='P1';s.pendingEffect=null;for(const p of s.playerOrder)for(const z of ['field','hand','food','discard','territory'])s.player(p)[z]=[];s.player('P1').availableCost=10;
function put(k,z,p='P1',down=false){const d=c.getCardDefinition(k),x=new c.CardInstance({instanceId:s.nextInstanceId(),cardId:k,ownerId:p,controllerId:p,zone:z,baseHp:d.baseHp,currentHp:d.baseHp,faceDown:down});s.player(p)[z.toLowerCase()].push(x);return x;}
put(id,'HAND');put('set6_016','FIELD','P2');put('set5_004','FIELD','P2');
put('kabutomushi','FIELD');
}
module.exports={cases,setup};
