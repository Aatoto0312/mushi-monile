'use strict';
const cases=['set5_054','set7_064'];
function setup(c,s,id){
 s.phase='MAIN_PHASE';s.turnNumber=3;s.activePlayerId='P1';s.pendingEffect=null;
 for(const p of s.playerOrder)for(const z of ['field','hand','food','discard','territory','resolving'])s.player(p)[z]=[];
 s.player('P1').availableCost=20;
 function put(k,z,p='P1',down=false){const d=c.getCardDefinition(k),x=new c.CardInstance({instanceId:s.nextInstanceId(),cardId:k,ownerId:p,controllerId:p,zone:z,baseHp:d.baseHp,currentHp:d.baseHp,faceDown:down});s.player(p)[z.toLowerCase()].push(x);return x;}
 put(id,'HAND');
 if(id==='set5_054')put('kabutomushi','DISCARD');
 else{const host=put('kabutomushi','FIELD');host.attackedThisTurn=true;put('set1_102','DISCARD');}
 const opponent=put('kabutomushi','FIELD','P2');opponent.currentHp=5000;opponent.baseHp=5000;
 put('namitentou','TERRITORY','P2',true);
}
module.exports={cases,setup};
