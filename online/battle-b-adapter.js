/* Reuse online/client.js transport, authentication, versions and busy guard. */
(function(){'use strict';
 const board=window.MushiBattleBoard.create(document.getElementById('b-battle'));
 window.MushiOnlineBattle={render:state=>{
  const notice=document.getElementById('notice');
  if(state.connected&&!state.busy&&notice.textContent==='対戦へ再接続しています。')notice.textContent='';
  board.render(state);
 },reset:()=>board.reset()};
})();
