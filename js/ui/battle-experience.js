/* Presentation enhancements only. All actions are dispatched through the existing BattleUI. */
(function () {
  'use strict';
  function init() {
    var battle=window.MushiBattle;if(!battle)return;
    var ui=battle.ui, inspector=document.getElementById('zone-inspector');
    var body=document.getElementById('inspector-body'), title=document.getElementById('inspector-title');
    var inspecting=null, restoreFocus=null, restoreInstanceId=null;
    var controls=document.querySelector('.control-bar');
    controls.insertBefore(document.getElementById('tutorial-guide'),controls.querySelector('.btn-row'));
    ['namiageha','okamakiri','kabutomushi'].forEach(function(id){var def=window.getCardDefinition(id);if(def)document.getElementById('hero-cards').appendChild(window.MushiCardVisuals.create(def,{decorative:true,eager:true}));});
    function open(titleText) { title.textContent=titleText;body.replaceChildren();if(!inspector.open)inspector.showModal(); }
    function sideId(side) { return side==='self'?(ui.cpuMode?'P1':ui.state.activePlayerId):(ui.cpuMode?'P2':ui.state.opponentOf(ui.state.activePlayerId)); }
    function paragraph(text,className) {var p=document.createElement('p');p.className=className||'inspector-note';p.textContent=text;return p;}
    function inspect(side,zone,label) {
      inspecting={side:side,zone:zone,label:label};
      var playerId=sideId(side),player=ui.state.player(playerId),instances=player[zone]||[];
      open((side==='self'?'あなた':'相手')+'の'+label+' · '+instances.length+'枚');
      var publicZone=zone==='food'||zone==='discard';
      if(!publicZone) {
        body.appendChild(paragraph(zone==='territory'?'縄張りは残り'+instances.length+'枚。裏向きの内容は公開されません。攻撃で獲得するときに選択できます。':label+'は'+instances.length+'枚です。内容は公開されません。'));
        // Face-up territory is public; never consult the definition of a hidden card.
        if(zone!=='territory')return;
        instances=instances.filter(function(inst){return !inst.faceDown;});
      } else body.appendChild(paragraph('カードをタップすると詳細を確認できます。対象選択中は、光っているカードを選んでください。'));
      if(!instances.length&&publicZone){body.appendChild(paragraph('ここにはまだカードがありません。'));return;}
      var grid=document.createElement('div');grid.className='inspector-grid';body.appendChild(grid);
      instances.forEach(function(inst){
        var def=window.CardUI.getDef(inst),button=document.createElement('button');
        button.type='button';button.className='inspector-card';
        var original=document.querySelector('#'+side+'-'+zone+'-zone [data-instance-id="'+inst.instanceId+'"]');
        if(original&&original.classList.contains('legal-target'))button.classList.add('legal-target');
        var pending=window.getPendingEffect(ui.state),selected=pending&&pending.selectedIds&&pending.selectedIds.indexOf(inst.instanceId)!==-1;
        if(selected){button.classList.add('is-pending-selected');button.setAttribute('aria-pressed','true');}
        button.appendChild(window.MushiCardVisuals.create(def));button.appendChild(document.createTextNode(def?def.name:'カード'));
        if(selected)button.appendChild(document.createTextNode(' · 選択済'));
        button.onclick=function(){inspector.close();inspecting=null;if(publicZone&&original)original.click();else ui.showCardDetail(inst,[]);};grid.appendChild(button);
      });
    }
    document.querySelectorAll('.aux-strip .zone-group').forEach(function(group){
      var zone=group.querySelector('[id$="-zone"]');if(!zone)return;
      var parts=zone.id.split('-'),label=group.querySelector('.zone-label').childNodes[0].textContent.trim();
      group.setAttribute('role','button');group.setAttribute('tabindex','0');group.setAttribute('aria-haspopup','dialog');
      function activate(){if(group.classList.contains('has-direct-target'))ui.onDirectAttack();else inspect(parts[0],parts[1],label);}
      group.addEventListener('click',function(e){if(e.target.closest('[data-instance-id]'))return;activate();});
      group.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
    });
    document.getElementById('inspector-close').onclick=function(){inspector.close();};
    inspector.addEventListener('close',function(){inspecting=null;});
    inspector.addEventListener('click',function(e){if(e.target===inspector){var r=inspector.getBoundingClientRect();if(e.clientY<r.top||e.clientX<r.left||e.clientX>r.right)inspector.close();}});
    document.getElementById('btn-battle-help').onclick=function(){
      inspecting=null;open('盤面の見方');var grid=document.createElement('div');grid.className='help-grid';
      [['場と手札','相手とあなたの表示で場を区別します。低い横画面では、相手の場・自分の場・手札を左から順に並べます。手札をタップすると詳細と現在の操作が開きます。カードが多いときは横にスクロールできます。'],['エサとコスト','エサの枚数と、今使えるコストを別々に表示しています。エサの欄を押すと公開カードを確認できます。'],['縄張り・山札・捨て札','数字は現在の枚数です。捨て場を押すと全カードを確認できます。非公開カードの内容は表示しません。'],['選択と攻撃','明るい枠は選択可能なカード、金色の枠は選択中のカードや対象です。カード上のHP・APは現在の値です。'],['対戦記録','ヘッダーの「ログ」からこれまでの行動を確認できます。']].forEach(function(item){var p=document.createElement('p'),strong=document.createElement('strong');strong.textContent=item[0];p.appendChild(strong);p.appendChild(document.createTextNode(item[1]));grid.appendChild(p);});body.appendChild(grid);
    };
    document.getElementById('btn-setup-back').onclick=function(){document.getElementById('deck-select-overlay').style.display='none';ui.newGame();};
    // Completing the tutorial must close its guide using the existing controller lifecycle.
    document.getElementById('btn-tuto-close').onclick=function(){ui.exitTutorial();};
    var baseRender=ui.render;
    ui.render=function(){baseRender.apply(ui,arguments);decorate();};
    var baseAttackButtons=ui.renderAttackButtons;
    ui.renderAttackButtons=function(){baseAttackButtons.apply(ui,arguments);directCue();};
    function directCue(){
      var group=document.querySelector('#zone-top .zone-group--territory');
      var legal=ui.actionState.mode==='attackTarget'&&(ui.actionState.legalTargets||[]).some(function(t){return t.targetType==='LEADER';});
      group.classList.toggle('has-direct-target',legal);
      group.setAttribute('aria-label',legal?'相手本体へ直接攻撃':group.querySelector('.zone-label').textContent.trim()+'を確認');
    }
    function decorate() {
      var s=ui.state, own=sideId('self');
      document.getElementById('zone-bottom').classList.toggle('is-current-side',s.activePlayerId===own);
      document.getElementById('zone-top').classList.toggle('is-current-side',s.activePlayerId!==own);
      document.querySelectorAll('.aux-strip .zone-group').forEach(function(group){
        var selectable=!!group.querySelector('.legal-target');
        group.classList.toggle('has-pending-target',selectable);
        group.setAttribute('aria-label',group.querySelector('.zone-label').textContent.trim()+(selectable?'から対象を選択':'を確認'));
      });
      var completeActions=document.getElementById('tutorial-complete-actions');
      var complete=ui.tutorialController&&ui.tutorialController.isComplete();
      var gameBox=document.querySelector('#game-over .pass-box');
      if(complete){
        document.getElementById('tutorial-guide').style.display='none';
        gameBox.appendChild(completeActions);
        document.getElementById('btn-new-game-2').style.display='none';
        document.getElementById('game-result-summary').textContent='チュートリアル完了。次は自分のデッキで戦ってみましょう。';
      }else{
        document.getElementById('tutorial-guide').appendChild(completeActions);
        document.getElementById('btn-new-game-2').style.display='';
        document.getElementById('game-result-summary').textContent='ターン '+s.turnNumber+' · 対戦の記録';
      }
      var player=s.player(own),pending=window.getPendingEffect(s);
      if(!pending&&ui.actionState.mode==='idle') {
        var hint='';
        if(ui.cpuMode&&s.activePlayerId==='P2')hint='相手のターンです。盤面と公開カードを確認できます。';
        else if(s.phase===window.Phases.SET_PHASE)hint=player.foodSetThisTurn?'エサをセットしました。メインフェイズへ進めます。':'手札を1枚エサにするか、そのままメインフェイズへ。';
        else if(s.phase===window.Phases.MAIN_PHASE)hint='手札から虫を出す・術を使う ／ 場の虫で攻撃';
        else if(s.phase===window.Phases.DRAW_PHASE)hint='山札からカードを引いて、ターンを始めましょう。';
        document.getElementById('status-text').textContent=hint;
      }
      player.hand.forEach(function(inst){
        var node=document.querySelector('#self-hand-zone [data-instance-id="'+inst.instanceId+'"]');if(!node)return;
        var playable=false,def=window.CardUI.getDef(inst);
        if(s.activePlayerId===own&&!pending){
          if(s.phase===window.Phases.SET_PHASE)playable=player.foodSetThisTurn<window.RULES.MAX_FOOD_PER_SET;
          if(s.phase===window.Phases.MAIN_PHASE&&def&&def.type===window.CardTypes.INSECT)playable=window.getAvailableSummonMethods(s,own,inst.instanceId).length>0;
        }
        if(pending&&pending.playerId===own&&pending.options&&pending.options.indexOf(inst.instanceId)!==-1)playable=true;
        node.classList.toggle('is-playable',playable);
      });
      if(inspector.open&&inspecting){var current=inspecting;inspect(current.side,current.zone,current.label);}
      directCue();
    }
    // Existing non-native battle dialogs get focus containment and Escape-to-close for card details.
    var overlays=Array.from(document.querySelectorAll('.overlay,.modal-overlay'));
    function visible(el){return getComputedStyle(el).display!=='none';}
    var lastOverlay=null;
    function syncOverlay(){
      var shown=overlays.filter(visible),top=shown[shown.length-1];
      var lobby=document.getElementById('mode-select-overlay');if(visible(lobby))top=lobby;
      document.querySelector('.battle-viewport').inert=!!top;
      if(top!==lastOverlay){
        if(top){
          if(!lastOverlay){restoreFocus=document.activeElement;var card=restoreFocus.closest('[data-instance-id]');restoreInstanceId=card&&card.dataset.instanceId;}
          var first=Array.from(top.querySelectorAll('button:not(:disabled),a,select')).find(function(node){return node.getClientRects().length;});if(first)first.focus({preventScroll:true});
        }else{
          var equivalent=restoreInstanceId&&document.querySelector('.battle-viewport [data-instance-id="'+restoreInstanceId+'"]');
          var candidate=[restoreFocus,equivalent].find(function(node){return node&&node.isConnected&&node.getClientRects().length&&!node.closest('[inert]');});
          if(!candidate)candidate=Array.from(document.querySelectorAll('.control-bar button:not(:disabled),#self-hand-zone button')).find(function(node){return node.getClientRects().length;});
          if(candidate)candidate.focus({preventScroll:true});
        }
        lastOverlay=top||null;
      }
    }
    overlays.forEach(function(overlay){new MutationObserver(syncOverlay).observe(overlay,{attributes:true,attributeFilter:['style']});});
    document.addEventListener('keydown',function(e){
      if(inspector.open)return;
      if(e.key==='Escape'&&visible(document.getElementById('card-detail-modal'))){ui.hideCardDetail();return;}
      if(e.key!=='Tab'||!lastOverlay)return;
      var focusable=Array.from(lastOverlay.querySelectorAll('button:not(:disabled),a,select')).filter(function(x){return x.getClientRects().length;});
      if(!focusable.length)return;var first=focusable[0],last=focusable[focusable.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    });
    syncOverlay();decorate();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
}());
