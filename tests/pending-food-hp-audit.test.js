// Pending, explicitly incomplete SET7-34; NOT a release regression test. Kept red, no assertion weakening.
'use strict';require('./engine-loader');require('../js/engine/cpu-agent');const h=require('./helpers'),R=require('./lib'),r=new R();
function fixture(){const s=h.newGame({rng:()=>0});h.toMainPhase(s);s.turnNumber=3;for(const p of s.playerOrder)for(const z of ['field','hand','food','discard'])s.player(p)[z]=[];s.player('P1').availableCost=20;return s;}
function hand(s,id,p='P1'){const d=getCardDefinition(id);r.assert(d,'missing '+id);return h.addToHandRaw(s,p,d);}
function food(s,id,down=true,p='P1'){const x=h.addToFoodRaw(s,p,getCardDefinition(id));x.faceDown=down;return x;}
function rejectsAtomic(s,fn){const before=JSON.stringify(s);let threw=false;try{fn();}catch(e){threw=true;}r.assert(threw);r.assertEqual(JSON.stringify(s),before);}
const d=getCardDefinition('set7_034'),prior=d.implementationStatus;d.implementationStatus='test';
r.test('White-stripe continuous stats count only own current-controller hidden food without identity',()=>{const s=fixture(),x=hand(s,'set7_034');summonInsect(s,'P1',x.instanceId);const a=food(s,'kabutomushi'),b=food(s,'jinkaichu_no_bakunetsudan');food(s,'kabutomushi',false);food(s,'kabutomushi',true,'P2');r.assertEqual(calculateMaxHp(x,s),1400);r.assertEqual(getEffectiveAP(s,x,700),900);a.faceDown=false;r.assertEqual(calculateMaxHp(x,s),1300);x.faceDown=true;r.assertEqual(getEffectiveAP(s,x,700),700);x.faceDown=false;s.player('P1').field=[];s.player('P2').field.push(x);x.controllerId='P2';r.assertEqual(getEffectiveAP(s,x,700),800);b.faceDown=false;r.assertEqual(getEffectiveAP(s,x,700),800);});
module.exports=r;if(require.main===module)r.runAll().then(x=>{if(x.failed)process.exitCode=1;});
