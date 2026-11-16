'use strict';
const cases=['set6_063','set6_064'];
function setup(c,s,id){
 s.phase='MAIN_PHASE';s.turnNumber=3;s.activePlayerId='P1';s.pendingEffect=null;
 for(const p of s.playerOrder)for(const z of ['field','hand','food','discard','territory','deck','resolving'])s.player(p)[z]=[];
 s.player('P1').availableCost=20;
 function put(k,z,p='P1'){const d=c.getCardDefinition(k),x=new c.CardInstance({instanceId:s.nextInstanceId(),cardId:k,ownerId:p,controllerId:p,zone:z,baseHp:d.baseHp,currentHp:d.baseHp,faceDown:z==='DECK'||z==='TERRITORY'});s.player(p)[z.toLowerCase()].push(x);return x;}
 put(id,'HAND');put('kabutomushi','FIELD');const enemy=put('namitentou','FIELD','P2');enemy.currentHp=5000;enemy.baseHp=5000;
 put('namitentou','HAND','P2');put('kabutomushi','TERRITORY','P2');
 if(id==='set6_063'){put('jinkaichu_no_bakunetsudan','DECK');put('namitentou','DECK');}
 else put('jinkaichu_no_bakunetsudan','DECK');
 put('kabutomushi','DECK');
}
module.exports={cases,setup};
