'use strict';
const cases=[['set7_049','reveal',9,200,0,'set5_004',5000],['set8_029','conceal',9,200,0,'set5_004',5000],['set8_011','destroy',5,700,0,'set5_004',5000],['set8_007','damage',6,600,0,'set5_004',4400],['set8_005','retrieve',8,200,0,'set5_004',5000]];
cases.push(['set8_015','phalanx',4,1000,0,'set5_004',5000],['set8_016','phalanx',5,700,0,'set5_004',5000],['set8_018','phalanx',6,500,0,'set5_004',5000],['set8_022','phalanx',7,400,0,'set5_004',5000]);
cases.push(['set6_016','revive',4,1000,0,'set5_004',5000]);
function setup(c,s,id,k){const d=c.getCardDefinition(id);if(!d.isPlayable())throw Error('UNCERTIFIED_ENTRY_SCENARIO '+id);s.phase='MAIN_PHASE';s.turnNumber=3;s.activePlayerId='P1';s.pendingEffect=null;for(const p of s.playerOrder)for(const z of ['field','hand','discard','food'])s.player(p)[z]=[];function put(pid,cardId,z,down=false){const d=c.getCardDefinition(cardId),a=new c.CardInstance({instanceId:s.nextInstanceId(),cardId,ownerId:pid,controllerId:pid,zone:z,faceDown:down,baseHp:d.baseHp,currentHp:d.baseHp});s.player(pid)[z.toLowerCase()].push(a);return a;}put('P1',id,'HAND');s.player('P1').availableCost=10;const high=put('P2','set5_004','FIELD');high.baseHp=5000;high.currentHp=5000;
if(k==='revive'){put('P1','set6_016','DISCARD');put('P1','minomushi_no_kakuremino','DISCARD');}
if(k==='phalanx'){put('P1','set8_022','HAND');put('P1','namitentou','HAND');if(id!=='set8_015')put('P1','set8_015','HAND');}
if(k==='reveal'){put('P1','set5_020','FOOD',true);put('P1','set1_003','FOOD');put('P2','set1_003','FOOD',true);}
if(k==='conceal'){put('P2','set5_020','FOOD');put('P2','set5_043','FOOD');put('P2','set5_020','FOOD',true);put('P1','set1_003','FOOD');}
if(k==='destroy')put('P2','namitentou','FIELD');
if(k==='damage')put('P1','jinkaichu_no_bakunetsudan','DISCARD');
if(k==='retrieve'){put('P1','set3_048','DISCARD');put('P1','minomushi_no_kakuremino','DISCARD');}}
module.exports={cases,setup};
