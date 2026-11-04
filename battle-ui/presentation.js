(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.MushiBattlePresentation=api;})(globalThis,function(){
 'use strict';
 function publicCard(dto,definition){
  if(dto.hidden)return {ref:dto.ref,hidden:true,name:'裏向きのカード',zone:dto.zone};
  const def=definition(dto.cardId)||{};
  return {ref:dto.ref,hidden:false,cardId:dto.cardId,name:dto.name||def.name,zone:dto.zone,
   hp:dto.currentHp,maxHp:dto.maxHp,color:dto.color,cost:def.cost,attacked:!!dto.attacked,
   skills:dto.skills||[],definition:def,ownerId:dto.ownerId,controllerId:dto.controllerId,
   attachments:(dto.attachments||[]).map(c=>publicCard(c,definition))};
 }
 function board(battle,definition){
  const spectator=battle.viewerId==='SPECTATOR',ownId=spectator?'P1':battle.viewerId,otherId=ownId==='P1'?'P2':'P1';
  const player=id=>{const p=battle.players[id];return {...p,field:(p.field||[]).map(c=>publicCard(c,definition)),hand:(p.hand||[]).map(c=>publicCard(c,definition))};};
  return {own:player(ownId),other:player(otherId),spectator,actions:spectator?[]:battle.actions||[],decision:spectator?null:battle.decision};
 }
 function attackGroups(actions,source){
  const groups=new Map();for(const a of actions.filter(a=>a.sourceRef===source&&['ATTACK','MULTI_ATTACK'].includes(a.kind))){
   const key=JSON.stringify([a.kind,a.skill?.name||a.label,a.skill?.ap]);
   if(!groups.has(key))groups.set(key,{name:a.skill?.name||a.label,ap:a.skill?.ap,actions:[]});groups.get(key).actions.push(a);
  }return [...groups.values()];
 }
 function targetActions(group,ref){return group.actions.filter(a=>a.targetRef===ref);}
 function optionLabel(dto,index){return dto.hidden?'裏向きのカード '+(index+1):dto.name+(dto.currentHp!=null?' HP '+dto.currentHp+'/'+dto.maxHp:'')+' / '+({HAND:'手札',FIELD:'場',FOOD:'エサ',TERRITORY:'縄張り',DISCARD:'捨て場',ATTACHMENT:'強化'}[dto.zone]||dto.zone||'公開カード');}
 function resultLabel(room,viewerId,spectator){
  if(room.phase!=='ENDED')return '';
  if(!room.result)return '対戦終了';
  const winner=room.result.winner;
  if(winner==null)return room.result.reason==='GAME_OVER'?'引き分け':'対戦終了';
  return spectator?winner+'の勝利':winner===viewerId?'あなたの勝利':'あなたの敗北';
 }
 return {publicCard,board,attackGroups,targetActions,optionLabel,resultLabel};
});
