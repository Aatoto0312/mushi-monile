/* Opt in on the A prototype pages. The existing CPU and online adapters stay shared. */
(function(root){
 'use strict';
 const create=root.MushiBattleBoard.create;
 root.MushiBattleBoard={create(host){
  const v2=document.documentElement.dataset.aVersion==='v2';
  return create(host,{cardHeadings:true,handExpanded:!v2,arenaLabel:'A案'+(v2?'v2':'v1')+' 旧UI進化型 対戦盤面'});
 }};
})(window);
