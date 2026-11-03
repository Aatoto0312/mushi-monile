'use strict';const cases=['set8_048','set6_052','set6_050','set6_053','set5_053'];
function setup(c,s,id){s.phase='MAIN_PHASE';s.turnNumber=3;s.activePlayerId='P1';s.pendingEffect=null;for(const p of s.playerOrder)for(const z of ['field','hand','food','discard','territory'])s.player(p)[z]=[];s.player('P1').availableCost=10;
function put(k,z,p='P1',down=false){const d=c.getCardDefinition(k),x=new c.CardInstance({instanceId:s.nextInstanceId(),cardId:k,ownerId:p,controllerId:p,zone:z,baseHp:d.baseHp,currentHp:d.baseHp,faceDown:down});s.player(p)[z.toLowerCase()].push(x);return x;}
put(id,'HAND');put('set6_016','FIELD','P2');put('set5_004','FIELD','P2');
put(id==='set8_048'?'set2_001':id==='set6_053'?'set4_001':id==='set5_053'?'set2_007':'set2_036','FIELD');if(id==='set8_048'){put(id,'DISCARD');put(id,'DISCARD');}
if(id==='set6_050'){put(id,'FOOD');put('set3_046','HAND');}if(id==='set6_053'){put(id,'DISCARD');put(id,'DISCARD');put('set4_001','HAND');}
}
module.exports={cases,setup};
