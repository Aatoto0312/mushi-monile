'use strict';const cases=['set6_056','set8_055','set7_063','set6_047','set6_020'];
function setup(c,s,id){s.phase='MAIN_PHASE';s.turnNumber=3;s.activePlayerId='P1';s.pendingEffect=null;for(const p of s.playerOrder)for(const z of ['field','hand','food','discard','territory'])s.player(p)[z]=[];s.player('P1').availableCost=10;
function put(k,z,p='P1',down=false){const d=c.getCardDefinition(k),x=new c.CardInstance({instanceId:s.nextInstanceId(),cardId:k,ownerId:p,controllerId:p,zone:z,baseHp:d.baseHp,currentHp:d.baseHp,faceDown:down});s.player(p)[z.toLowerCase()].push(x);return x;}
put(id,'HAND');put('kabutomushi','FIELD','P2');put('set5_004','FIELD','P2');
if(id==='set6_056'){put('set7_035','FOOD');put('kabutomushi','FOOD');put('namitentou','FOOD','P1',true);}
if(id==='set8_055')put('set6_062','HAND');
if(id==='set7_063'){for(const k of ['namitentou','kabutomushi','tonosamabatta','set6_048'])put(k,'FOOD');}
if(id==='set6_047'){put('namitentou','DISCARD','P2');put('jinkaichu_no_bakunetsudan','DISCARD','P2');}
if(id==='set6_020'){put('kabutomushi','FIELD');put('minomushi_no_kakuremino','HAND');put('minomushi_no_kakuremino','HAND');}
}
module.exports={cases,setup};
