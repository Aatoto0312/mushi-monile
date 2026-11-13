/* Presentation only: consume a confirmed result; never decide a winner. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.MushiBattleResult=api;})(globalThis,function(){
 'use strict';
 const STORAGE_KEY='mushijingiResultSeenV1';
 function describe(room,viewerId,names={}){
  if(room?.phase!=='ENDED'||!room.result)return null;
  const {winner,reason}=room.result,spectator=viewerId==='SPECTATOR';
  if(winner==null)return {title:reason==='GAME_OVER'?'引き分け':'対戦終了',tone:'neutral'};
  if(spectator)return {title:(names[winner]||winner)+'の勝利',tone:'neutral'};
  return {title:winner===viewerId?'勝利！':'敗北…',tone:winner===viewerId?'win':'loss'};
 }
 function createLedger(storage){
  let seen=[];try{const value=JSON.parse(storage?.getItem(STORAGE_KEY)||'[]');if(Array.isArray(value))seen=value.filter(x=>typeof x==='string').slice(-32);}catch{}
  return {claim(key){if(seen.includes(key))return false;seen.push(key);seen=seen.slice(-32);try{storage?.setItem(STORAGE_KEY,JSON.stringify(seen));}catch{}return true;}};
 }
 function create(doc,storage){
  const ledger=createLedger(storage),dialog=doc.createElement('dialog'),trigger=doc.createElement('button');
  dialog.className='battle-result-popup';dialog.setAttribute('aria-labelledby','battle-result-title');
  dialog.innerHTML='<div class="result-glow" aria-hidden="true"></div><p class="result-kicker">対戦結果</p><h2 id="battle-result-title"></h2><p class="result-note"></p><div class="result-actions"><button type="button" data-result="board">盤面を見る</button><button type="button" data-result="replay">もう一度対戦</button><button type="button" data-result="menu">メニューへ</button></div>';
  trigger.type='button';trigger.className='battle-result-open action-btn-wide';trigger.textContent='対戦結果';trigger.hidden=true;doc.body.append(dialog);
  let current=null,key=null,replaced=null,previousFocus;
  function restore(){if(replaced){replaced.element.hidden=replaced.hidden;replaced=null;}}
  function close(){if(dialog.open)dialog.close();current?.onBoard?.();if(trigger.isConnected&&!trigger.hidden)trigger.focus({preventScroll:true});else previousFocus?.focus?.({preventScroll:true});}
  function open(){if(!current||dialog.open)return;previousFocus=doc.activeElement;dialog.showModal();dialog.querySelector('[data-result="board"]').focus();}
  trigger.onclick=open;
  dialog.querySelector('[data-result="board"]').onclick=close;
  for(const [kind,handler] of [['replay','onReplay'],['menu','onMenu']])dialog.querySelector('[data-result="'+kind+'"]').onclick=()=>{if(!current||dialog.querySelector('[data-result="'+kind+'"]').disabled)return;const fn=current[handler];close();fn?.();};
  dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  function clear(){current=null;key=null;trigger.hidden=true;restore();if(dialog.open)dialog.close();}
  return {open,clear,update(next){
   const result=describe(next.room,next.viewerId,next.names);if(!result){clear();return;}
   const nextKey=next.key+':'+next.viewerId,changed=key!==nextKey;
   if(changed&&dialog.open)dialog.close();current=next;key=nextKey;
   restore();if(next.replaceButton){replaced={element:next.replaceButton,hidden:next.replaceButton.hidden};next.replaceButton.hidden=true;}
   next.anchor.append(trigger);trigger.hidden=false;trigger.setAttribute('aria-label','対戦結果：'+result.title);
   dialog.dataset.tone=result.tone;dialog.querySelector('h2').textContent=result.title;
   dialog.querySelector('.result-note').textContent=next.note||'盤面を見ると、最後のカードと状態を確認できます。';
   const replay=dialog.querySelector('[data-result="replay"]');replay.disabled=!next.onReplay||!!next.busy;
   replay.textContent=next.replayLabel||'もう一度対戦';dialog.querySelector('[data-result="menu"]').disabled=!next.onMenu||!!next.busy;
   if(changed&&ledger.claim(nextKey))open();
  },get element(){return dialog;}};
 }
 return {describe,createLedger,create};
});
