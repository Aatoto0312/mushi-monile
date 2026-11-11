/* Opt in on the A prototype pages. The existing CPU and online adapters stay shared. */
(function(root){
 'use strict';
 const create=root.MushiBattleBoard.create;
 root.MushiBattleBoard={create(host){
  return create(host,{cardHeadings:true,handExpanded:true,arenaLabel:'A案 旧UI進化型 対戦盤面'});
 }};
})(window);
