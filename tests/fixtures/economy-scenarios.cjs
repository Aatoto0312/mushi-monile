'use strict';const cases=['set6_002','set6_012','set7_013','set6_060','set7_058'];
function setup(c,s,id){s.phase='MAIN_PHASE';s.turnNumber=3;s.activePlayerId='P1';s.pendingEffect=null;for(const p of s.playerOrder)for(const z of ['field','hand','food','discard','territory'])s.player(p)[z]=[];s.player('P1').availableCost=10;
 function put(k,z,p='P1',down=false){const d=c.getCardDefinition(k),x=new c.CardInstance({instanceId:s.nextInstanceId(),cardId:k,ownerId:p,controllerId:p,zone:z,baseHp:d.baseHp,currentHp:d.baseHp,faceDown:down});s.player(p)[z.toLowerCase()].push(x);return x;}
 const spell=c.getCardDefinition(id).type==='SPELL';put(id,spell?'HAND':'FIELD');
 if(!spell)put('jinkaichu_no_bakunetsudan','TERRITORY','P2',true);
 if(id==='set6_002')for(let i=0;i<5;i++)put('kabutomushi','HAND','P2');
 if(id==='set6_012'){put('namitentou','FOOD','P1',true);put('namitentou','FOOD','P1',true);put('kabutomushi','FOOD','P1',true);}
 if(id==='set7_013')put('kabutomushi','DISCARD','P2');
 if(id==='set6_060')put('kabutomushi','DISCARD');
 if(id==='set7_058'){put('kabutomushi','FIELD','P2');put('set5_004','FIELD','P2');put('namitentou','FOOD');put('kabutomushi','FOOD');put('namitentou','FOOD','P1',true);}
}
module.exports={cases,setup};
