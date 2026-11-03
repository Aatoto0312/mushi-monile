'use strict';
const cases=[['set8_019','day',1200,1000,'set8_036'],['set8_021','night',900,800,'set8_038'],['set8_036','death',1200,1000,'set8_019'],['set8_038','death',900,800,'set8_021']];
function setup(c,s,id,variant,hp,ap,partner){
 for(const k of ['set8_019','set8_021','set8_036','set8_038']){const d=c.getCardDefinition(k);if(!d||!d.isPlayable())throw Error('UNCERTIFIED_EMERGENCE '+k);}
 s.phase='MAIN_PHASE';s.turnNumber=3;s.activePlayerId=variant==='death'?'P2':'P1';s.pendingEffect=null;
 for(const p of s.playerOrder)for(const z of ['field','hand','discard','food','territory'])s.player(p)[z]=[];
 function put(pid,k,z){const d=c.getCardDefinition(k),a=new c.CardInstance({instanceId:s.nextInstanceId(),cardId:k,ownerId:pid,controllerId:pid,zone:z,baseHp:d.baseHp,currentHp:d.baseHp});s.player(pid)[z.toLowerCase()].push(a);return a;}
 s.player('P1').availableCost=10;s.player('P2').availableCost=10;
 if(variant==='death'){put('P1',id,'FIELD');put('P1',partner,'HAND');const a=put('P2','set5_004','FIELD');a.baseHp=5000;a.currentHp=5000;}
 else{put('P1',id,variant==='night'?'DISCARD':'HAND');put('P1',partner,'FIELD');put('P1',variant==='night'?'set4_057':'set2_051','HAND');const a=put('P2','set5_004','FIELD');a.baseHp=5000;a.currentHp=5000;}
}
module.exports={cases,setup};
