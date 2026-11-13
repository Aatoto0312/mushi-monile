'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {describe,createLedger}=require('../battle-ui/result-popup.js');
test('only authoritative results produce player-relative or neutral outcomes',()=>{
 for(const viewerId of ['P1','P2','SPECTATOR'])for(const winner of ['P1','P2',null]){
  const result=describe({phase:'ENDED',result:{winner,reason:'GAME_OVER'}},viewerId,{P1:'甲',P2:'乙'});
  assert.equal(result.title,winner===null?'引き分け':viewerId==='SPECTATOR'?({P1:'甲',P2:'乙'}[winner]+'の勝利'):viewerId===winner?'勝利！':'敗北…');
  assert.equal(result.tone,winner===null||viewerId==='SPECTATOR'?'neutral':viewerId===winner?'win':'loss');
 }
 assert.equal(describe({phase:'PLAYING'},'P1'),null);
 assert.equal(describe({phase:'ABORTED'},'P1'),null);
 assert.equal(describe({phase:'ENDED',result:null},'P1'),null);
 assert.equal(describe({phase:'ENDED',result:{winner:'P1',reason:'RESIGNED'}},'P2').title,'敗北…');
 assert.equal(describe({phase:'ENDED',result:{winner:null,reason:'UNKNOWN'}},'P1').title,'対戦終了');
});
test('presentation ledger deduplicates rerenders and restored connections but permits new matches',()=>{
 const values=new Map(),storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)};
 const a=createLedger(storage);assert(a.claim('match1:P1'));assert(!a.claim('match1:P1'));assert(a.claim('match1:P2'));
 assert(!createLedger(storage).claim('match1:P1'));assert(createLedger(storage).claim('match2:P1'));
 assert.equal(values.size,1);assert(![...values.values()][0].includes('token'));
});
test('storage refusal and corrupted records do not break result presentation; history is bounded',()=>{
 const bad={getItem(){throw Error('denied');},setItem(){throw Error('denied');}};
 const a=createLedger(bad);assert(a.claim('x'));assert(!a.claim('x'));
 let saved;const b=createLedger({getItem:()=>'{broken',setItem:(k,v)=>saved=v});
 for(let i=0;i<50;i++)assert(b.claim('m'+i));assert(JSON.parse(saved).length<=32);
});
