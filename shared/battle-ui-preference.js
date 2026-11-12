/* Presentation preference only. Decks and online reconnection seats use their existing stores. */
(function(root){
 'use strict';
 const KEY='mushijingiBattleUiV1';
 const valid=value=>value==='legacy'||value==='new';
 function read(){
  const explicit=new URLSearchParams(location.search).get('battleUi');
  if(valid(explicit))return explicit;
  try{const saved=localStorage.getItem(KEY);if(valid(saved))return saved;}catch{}
  return 'new';
 }
 function save(mode){if(valid(mode))try{localStorage.setItem(KEY,mode);}catch{}}
 function choose(mode){
  if(!valid(mode))return;
  save(mode);
  const url=new URL(location.href);url.searchParams.set('battleUi',mode);
  history.replaceState(history.state,'',url);
 }
 function onlineUrl(deckId){
  const file=read()==='legacy'?'online.html':'online-b.html';
  return file+(deckId?'?deck='+encodeURIComponent(deckId):'');
 }
 function init(){
  const mode=document.documentElement.dataset.onlineUi;
  const explicit=new URLSearchParams(location.search).get('battleUi');
  if(valid(mode))save(mode);else if(valid(explicit))save(explicit);
  document.querySelectorAll('[data-online-entry]').forEach(link=>{link.href=onlineUrl();});
  document.querySelectorAll('[data-ui-choice]').forEach(link=>{
   const deckId=new URLSearchParams(location.search).get('deck');
   if(deckId){const url=new URL(link.href);url.searchParams.set('deck',deckId);link.href=url;}
   link.addEventListener('click',()=>save(link.dataset.uiChoice));
  });
  if(mode==='legacy')document.getElementById('menu').addEventListener('click',()=>{
   const link=document.createElement('a'),deckId=new URLSearchParams(location.search).get('deck');
   link.href='online-b.html'+(deckId?'?deck='+encodeURIComponent(deckId):'');
   link.textContent='新UIへ切り替え';link.dataset.uiChoice='new';
   link.addEventListener('click',()=>save('new'));
   document.getElementById('overlay-body').append(link);
  });
 }
 root.MushiBattleUiPreference={KEY,read,save,choose,onlineUrl};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})(window);
