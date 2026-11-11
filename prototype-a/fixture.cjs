'use strict';
// Test-only deterministic states. All identities, text, stats and images use the registry.
function setup(c,s,ownCount=4,otherCount=3,handCount=4){
 s.phase='MAIN_PHASE';s.turnNumber=3;s.activePlayerId='P1';s.pendingEffect=null;
 const own=['kabutomushi','okamakiri','namiageha_larva','set7_002'];
 const other=['kabutomushi','namitentou','namiageha'];
 const hand=['namitentou','mushi_no_ibuki','kamikiri_no_daigaku','kabutomushi'];
 for(const pid of s.playerOrder){
  for(const zone of ['field','hand','food','territory','discard','resolving'])s.player(pid)[zone]=[];
  s.player(pid).availableCost=20;
 }
 function put(pid,id,zone){
  const d=c.getCardDefinition(id);
  if(!d?.isPlayable())throw Error('FIXTURE_CARD_NOT_PLAYABLE '+id);
  const card=new c.CardInstance({instanceId:s.nextInstanceId(),cardId:id,ownerId:pid,controllerId:pid,zone,baseHp:d.baseHp,currentHp:d.baseHp,faceDown:zone==='TERRITORY'});
  s.player(pid)[zone.toLowerCase()].push(card);
 }
 for(let i=0;i<ownCount;i++)put('P1',own[i%own.length],'FIELD');
 for(let i=0;i<otherCount;i++)put('P2',other[i%other.length],'FIELD');
 for(let i=0;i<handCount;i++)put('P1',hand[i%hand.length],'HAND');
 for(const pid of s.playerOrder)for(let i=0;i<6;i++)put(pid,'namitentou','TERRITORY');
}
module.exports={setup};
