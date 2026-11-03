'use strict';
const cases=[['set6_017','gold',2000,1000],['set7_035','colors',300,300],['set7_057','damage',500,0]];
function setup(c,s,id,variant){
 s.phase='MAIN_PHASE';s.turnNumber=3;s.activePlayerId='P1';s.pendingEffect=null;
 for(const p of s.playerOrder)for(const z of ['field','hand','discard','food','territory'])s.player(p)[z]=[];
 function put(pid,k,z,down=false){const d=c.getCardDefinition(k),x=new c.CardInstance({instanceId:s.nextInstanceId(),cardId:k,ownerId:pid,controllerId:pid,zone:z,baseHp:d.baseHp,currentHp:d.baseHp,faceDown:down});s.player(pid)[z.toLowerCase()].push(x);return x;}
 s.player('P1').availableCost=10;s.player('P2').availableCost=10;put('P1',id,'HAND');
 if(variant==='gold')put('P1','set2_050','HAND');
 else{for(const k of (variant==='colors'?['namitentou','namitentou','kabutomushi','tonosamabatta','set6_048','jinkaichu_no_bakunetsudan']:['namitentou','jinkaichu_no_bakunetsudan','kabutomushi']))put('P1',k,'FOOD',true);put('P1','kabutomushi','FOOD');put('P2','set5_004','FOOD',true);}
 const opponent=put('P2','kabutomushi','FIELD');if(variant==='gold'){opponent.baseHp=5000;opponent.currentHp=5000;}if(variant==='damage')put('P2','set5_004','FIELD');
}
module.exports={cases,setup};


