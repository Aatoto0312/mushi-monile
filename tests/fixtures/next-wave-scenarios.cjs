'use strict';
const cases=['set6_058','set8_061','set7_040','set8_037'];
function setup(c,s,id){
 s.phase='MAIN_PHASE';s.turnNumber=3;s.activePlayerId='P1';s.pendingEffect=null;
 for(const p of s.playerOrder)for(const z of ['field','hand','food','discard','territory'])s.player(p)[z]=[];
 s.player('P1').availableCost=20;
 function put(k,z,p='P1',down=false){const d=c.getCardDefinition(k),x=new c.CardInstance({instanceId:s.nextInstanceId(),cardId:k,ownerId:p,controllerId:p,zone:z,baseHp:d.baseHp,currentHp:d.baseHp,faceDown:down});s.player(p)[z.toLowerCase()].push(x);return x;}
 const spell=c.getCardDefinition(id).type==='SPELL';put(id,spell?'HAND':'FIELD');
 const own=put('kabutomushi','FIELD'),other=put('namitentou','FIELD','P2');other.currentHp=5000;other.baseHp=5000;
 put('namitentou','HAND','P2');put('kabutomushi','FOOD','P2',true);
 put('namitentou','TERRITORY','P2',true);
 if(id==='set6_058'){const att=put('kamikiri_no_daigaku','HAND');s.player('P1').hand.pop();att.zone='ATTACHMENT';own.attachments.push(att);}
}
module.exports={cases,setup};
