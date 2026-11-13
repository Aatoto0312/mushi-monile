/* CPU lifecycle adapter. Engine/AI and the final state remain untouched. */
(function(root){'use strict';function init(){
 const ui=root.MushiBattle.ui;let storage;try{storage=root.sessionStorage;}catch{}
 const popup=root.MushiBattleResult.create(document,storage);let matchId=crypto.randomUUID();
 function clear(){popup.clear();}
 const begin=ui._beginNewGame;ui._beginNewGame=function(){clear();matchId=crypto.randomUUID();return begin.apply(ui,arguments);};
 for(const method of ['_openDeckSelect','showModeSelect','startVsHuman','startTutorial']){const original=ui[method];ui[method]=function(){clear();return original.apply(ui,arguments);};}
 const render=ui.render;ui.render=function(){render.apply(ui,arguments);
  if(!ui.cpuMode||ui.tutorialController){clear();return;}
  const state=ui.state,newUi=root.MushiCpuBattle.active;
  document.getElementById('game-over').style.display='none';
  if(state.phase===root.Phases.GAME_OVER){document.getElementById('cpu-thinking').style.display='none';if(!newUi)document.getElementById('status-text').textContent='対戦終了。カードをタップして最後の状態を確認できます。';}
  const end=newUi?document.querySelector('#b-battle [data-role="end"]'):null;
  popup.update({key:'cpu:'+matchId,room:{phase:state.phase===root.Phases.GAME_OVER?'ENDED':'PLAYING',result:{winner:state.winner,reason:'GAME_OVER'}},viewerId:'P1',
   anchor:newUi?end.parentElement:document.querySelector('.control-bar .btn-row'),replaceButton:end,
   onBoard:()=>ui.hideCardDetail(),onReplay:()=>ui.newGame(),onMenu:()=>{ui.returnToDeckSelect();ui.hideDeckSelect();ui.showModeSelect();}});
 };
 }if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})(window);
