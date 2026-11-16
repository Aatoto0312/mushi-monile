'use strict';
const cases=[['set7_004','batch-centipede'],['set8_003','batch-devil'],['set6_001','batch-dragonmantis'],['set8_013','batch-ant-mimic']];
function setup(c,s,id){
 s.phase='MAIN_PHASE';s.turnNumber=3;s.activePlayerId='P1';s.pendingEffect=null;s.freeCardUse=null;
 for(const p of s.playerOrder)for(const z of ['field','hand','food','discard','territory'])s.player(p)[z]=[];
 s.player('P1').availableCost=id==='set8_003'?0:20;
 function put(cardId,zone,p='P1'){const d=c.getCardDefinition(cardId),x=new c.CardInstance({instanceId:s.nextInstanceId(),cardId,ownerId:p,controllerId:p,zone,baseHp:d.baseHp,currentHp:d.baseHp});s.player(p)[zone.toLowerCase()].push(x);return x;}
 const source=put(id,id==='set8_003'?'HAND':'FIELD'),target=put('set6_016','FIELD','P2');target.currentHp=3000;
 if(id==='set8_003'){const host=put('set6_016','FIELD'),e=put('set1_102','HAND');s.player('P1').hand=s.player('P1').hand.filter(x=>x!==e);e.zone='ATTACHMENT';host.attachments=[e];}
 if(id==='set6_001'){put('set7_054','HAND');put('set2_054','HAND');put('jinkaichu_no_bakunetsudan','HAND');}
 if(id==='set8_013'){const ant=c.cardRegistry.getAll().find(d=>d.type==='INSECT'&&d.cost<=2&&(d.tags||[]).some(t=>t.endsWith('アリ科'))&&d.skills.some(x=>x.timing==='ATTACK'));if(!ant)throw Error('No playable ant donor fixture');put(ant.id,'FIELD');}
 return {sourceInstanceId:source.instanceId,targetInstanceId:target.instanceId};
}
module.exports={cases,setup};
