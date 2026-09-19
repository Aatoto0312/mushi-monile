/* Layout adapter: reads UI/state, never writes GameState or dispatches new rules. */
(function(){
 'use strict';
 function init(){
  var ui=window.MushiBattle&&window.MushiBattle.ui;if(!ui)return;
  var root=document.querySelector('.battle-viewport'),controls=root.querySelector('.control-bar');
  var guide=document.getElementById('tutorial-guide');
  ['top','bottom'].forEach(function(side){
   var zone=document.getElementById('zone-'+side),row=document.createElement('div');row.className='compact-status';
   row.appendChild(zone.querySelector('.player-info'));row.appendChild(zone.querySelector('.aux-strip'));zone.prepend(row);
   zone.querySelector('.zone-group--field > .zone-label').textContent=side==='top'?'相手の場':'自分の場';
  });
  function dialog(name){
   var d=document.createElement('dialog');d.className='compact-dialog';d.id='compact-'+name;
   var header=document.createElement('header'),title=document.createElement('strong'),close=document.createElement('button');
   title.textContent={log:'バトルログ',instructions:'操作の案内',actions:'操作を選択'}[name];title.id=d.id+'-title';d.setAttribute('aria-labelledby',title.id);
   close.textContent='閉じる';close.className='mini-btn';close.addEventListener('click',function(){d.close();});header.append(title,close);d.append(header);document.body.append(d);return d;
  }
  var log=dialog('log'),instructions=dialog('instructions'),actions=dialog('actions');
  var logFull=document.querySelector('.log-full');log.append(logFull);logFull.style.display='block';
  var logButton=document.createElement('button');logButton.type='button';logButton.className='mini-btn';logButton.id='btn-compact-log';logButton.textContent='ログ';
  document.querySelector('.topbar-right').prepend(logButton);
  logButton.addEventListener('click',function(){logFull.style.display='block';log.showModal();log.scrollTop=log.scrollHeight;});
  var settings=document.getElementById('btn-new-game');settings.textContent='⚙';settings.setAttribute('aria-label','対戦設定');
  var message=document.createElement('p');message.className='tutorial-copy';instructions.append(message);
  var exit=document.createElement('button');exit.textContent='チュートリアルを終了';exit.className='mini-btn tutorial-exit';instructions.append(exit);
  exit.addEventListener('click',function(){instructions.close();document.getElementById('btn-tutorial-exit').click();});
  var status=document.getElementById('status-text');status.setAttribute('role','button');status.tabIndex=0;status.setAttribute('aria-label','操作の案内を詳しく読む');
  function showInstructions(){message.textContent=ui.tutorialController&&ui.tutorialController.active?document.getElementById('tutorial-message').textContent:status.textContent;exit.hidden=!document.body.classList.contains('tutorial-active');instructions.showModal();}
  status.addEventListener('click',showInstructions);status.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();showInstructions();}});
  var skill=document.getElementById('skill-select-row');actions.append(skill);
  var end=document.getElementById('btn-end-turn'),endPlaceholder=document.createElement('button');
  endPlaceholder.className='action-btn-wide';endPlaceholder.type='button';endPlaceholder.disabled=true;endPlaceholder.textContent='ターン終了';endPlaceholder.title='メインフェイズで操作できます';controls.querySelector('.btn-row').append(endPlaceholder);
  function syncEnd(){endPlaceholder.hidden=end.style.display!=='none'&&end.textContent==='ターン終了';}
  new MutationObserver(syncEnd).observe(end,{attributes:true,attributeFilter:['style'],childList:true,characterData:true,subtree:true});syncEnd();
  new MutationObserver(function(){var shown=skill.style.display!=='none'&&skill.children.length>0;if(shown&&!actions.open)actions.showModal();if(!shown&&actions.open)actions.close();}).observe(skill,{childList:true,attributes:true,attributeFilter:['style']});
  actions.addEventListener('close',function(){if(skill.style.display!=='none'&&skill.children.length)document.getElementById('btn-cancel-attack').click();});
  var lanes=[];
  ['opp-field-zone','self-field-zone','self-hand-zone'].forEach(function(id){
   var lane=document.getElementById(id),group=lane.parentElement;
   function arrow(direction){var b=document.createElement('button');b.type='button';b.className='scroll-cue scroll-cue--'+(direction<0?'prev':'next');b.textContent=direction<0?'‹':'›';b.setAttribute('aria-label',(direction<0?'前':'次')+'のカード');b.addEventListener('click',function(){lane.scrollBy({left:direction*Math.max(82,lane.clientWidth-82),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});});group.append(b);return b;}
   var prev=arrow(-1),next=arrow(1);
   function update(){prev.hidden=lane.scrollLeft<=1;next.hidden=lane.scrollLeft+lane.clientWidth>=lane.scrollWidth-2;}
   lane.addEventListener('scroll',update,{passive:true});new ResizeObserver(update).observe(lane);new MutationObserver(update).observe(lane,{childList:true,subtree:true});lanes.push(update);
  });
  function layout(){
   var landscape=root.clientWidth>root.clientHeight;
   var style=getComputedStyle(root),available=root.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom);
   root.classList.toggle('compact-landscape',landscape);root.classList.toggle('compact-low',landscape&&available<360);
   root.classList.toggle('compact-tight',!landscape&&available<552);
   root.classList.toggle('compact-fallback',available<(landscape?234:518)||root.clientWidth<(landscape?480:320));
   lanes.forEach(function(f){f();});
  }
  new ResizeObserver(layout).observe(root);window.addEventListener('resize',layout);
  function decorate(){
   root.querySelectorAll('.cost-text').forEach(function(n){n.textContent=n.textContent.replace('使用可能コスト: ','コスト');});
   root.querySelectorAll('.pname').forEach(function(n){n.textContent=n.textContent.replace(/\s*\(P[12]\)\s*/g,'').replace('（先攻）',' · 先').replace('（後攻）',' · 後');});
   root.querySelectorAll('.compact-status .zone-label').forEach(function(n){var text=n.firstChild;if(text&&text.nodeType===3)text.textContent=text.textContent.replace('手札','手').replace('山札','山').replace('縄張り','縄').replace('捨て場','捨');});
   if(document.body.classList.contains('tutorial-active'))status.textContent=document.getElementById('tutorial-step').textContent+' · '+document.getElementById('tutorial-message').textContent;
   layout();
  }
  var render=ui.render;ui.render=function(){render.apply(ui,arguments);decorate();};
  new MutationObserver(function(){if(document.body.classList.contains('tutorial-active'))status.textContent=document.getElementById('tutorial-step').textContent+' · '+document.getElementById('tutorial-message').textContent;}).observe(guide,{childList:true,subtree:true,characterData:true});
  decorate();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
}());
