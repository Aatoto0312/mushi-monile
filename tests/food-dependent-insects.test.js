'use strict';
require('./engine-loader.js');
const h=require('./helpers.js'),Runner=require('./lib.js'),r=new Runner();
function game(){const s=h.newGame({rng:h.firstPlayerRng});h.toMainPhase(s);return s;}
function ap(s,c){const d=getCardDefinition(c.cardId),sk=d.skills[0];return getEffectiveAP(s,c,sk.baseAp,sk);}
r.test('SET6-13 larva counts only face-up aphid-family insects in own food for HP and AP',()=>{
 const s=game(),c=h.putInsectOnField(s,'P1','set6_013'),d=getCardDefinition(c.cardId),a=h.addToFoodRaw(s,'P1',getCardDefinition('set6_045')),b=h.addToFoodRaw(s,'P1',getCardDefinition('set8_046'));
 r.assertEqual(calculateMaxHp(c,s),d.baseHp+200);r.assertEqual(ap(s,c),d.skills[0].baseAp+200);
 b.faceDown=true;r.assertEqual(calculateMaxHp(c,s),d.baseHp+100);r.assertEqual(ap(s,c),d.skills[0].baseAp+100);
 a.faceDown=true;r.assertEqual(calculateMaxHp(c,s),d.baseHp);r.assertEqual(ap(s,c),d.skills[0].baseAp);
});
r.test('SET6-30 adult independently gains and loses aphid food bonus',()=>{
 const s=game(),c=h.putInsectOnField(s,'P1','set6_030'),d=getCardDefinition(c.cardId),a=h.addToFoodRaw(s,'P1',getCardDefinition('set6_045'));
 r.assertEqual(calculateMaxHp(c,s),d.baseHp+100);r.assertEqual(ap(s,c),d.skills[0].baseAp+100);
 s.player('P1').food.splice(s.player('P1').food.indexOf(a),1);r.assertEqual(calculateMaxHp(c,s),d.baseHp);r.assertEqual(ap(s,c),d.skills[0].baseAp);
});
r.test('SET7-16 requires all three visible food colors and grants AP only',()=>{
 const s=game(),c=h.putInsectOnField(s,'P1','set7_016'),d=getCardDefinition(c.cardId);
 const red=h.addToFoodRaw(s,'P1',getCardDefinition('set2_001')),blue=h.addToFoodRaw(s,'P1',getCardDefinition('set2_016')),green=h.addToFoodRaw(s,'P1',getCardDefinition('set6_045'));
 r.assertEqual(ap(s,c),d.skills[0].baseAp+800);r.assertEqual(calculateMaxHp(c,s),d.baseHp);
 blue.faceDown=true;r.assertEqual(ap(s,c),d.skills[0].baseAp);
 blue.faceDown=false;red.faceDown=true;r.assertEqual(ap(s,c),d.skills[0].baseAp);
 red.faceDown=false;r.assertEqual(ap(s,c),d.skills[0].baseAp+800);
});
module.exports=r;if(require.main===module)r.runAll().then(x=>{if(x.failed)process.exitCode=1;});
