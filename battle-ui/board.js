/* Common presentation only. Adapter supplies a redacted view and a capability sender. */
(function(root){'use strict';
 const P=root.MushiBattlePresentation;
 function create(host){
  host.innerHTML=`<main class="arena live-arena" aria-label="B案 共通対戦盤面">
   <header class="player opponent"><span class="avatar">◈</span><b data-role="other-name">相手</b><div class="stats" data-role="other-stats"></div><button data-role="menu">☰</button></header>
   <section class="field enemy"><div class="lane-title">相手の場 <small>横へスワイプ ›</small></div><div id="enemy" class="cards" data-role="other-field"></div></section>
   <section class="ribbon" aria-live="polite"><span data-role="turn"></span><b data-role="instruction"></b><span data-role="phase"></span><div class="target-controls" data-role="target-controls" hidden><button data-role="direct" hidden>直接攻撃</button><button data-role="back" hidden>戻る</button><button data-role="cancel" hidden>キャンセル</button></div></section>
   <section class="field own"><div class="lane-title">自分の場 <small>横へスワイプ ›</small></div><div id="own" class="cards" data-role="own-field"></div></section>
   <section class="player self"><span class="avatar">✧</span><b data-role="own-name">あなた</b><div class="stats" data-role="own-stats"></div></section>
   <section class="hand"><button id="hand-toggle" data-role="hand-toggle" aria-expanded="false"></button><div id="hand" class="cards" data-role="hand"></div></section>
   <footer class="rail"><button data-role="all-actions">操作一覧</button><button data-role="menu">ログ・設定</button><button id="end" class="primary" data-role="end">ターン終了</button></footer>
  </main><dialog id="sheet" aria-label="カード・操作"><header><div><small data-role="kicker"></small><h1 data-role="title"></h1></div><button id="close" data-role="close" aria-label="閉じる">×</button></header><div id="sheet-body" data-role="body"></div><footer id="sheet-actions" data-role="footer" hidden></footer></dialog>`;
  const $=name=>host.querySelector('[data-role="'+name+'"]'),arena=host.querySelector('.arena'),dialog=host.querySelector('dialog');
  let ctx,view,vm,version,selected=null,targetGroup=null,expanded=false,chosen=[];
  const definition=id=>root.getCardDefinition(id);
  const enabled=()=>!!ctx?.connected&&!ctx.busy&&!view.room.paused&&view.room.phase==='PLAYING'&&!vm.spectator;
  function button(text,fn,kind){const b=document.createElement('button');b.type='button';b.textContent=text;if(kind)b.dataset.kind=kind;b.onclick=fn;return b;}
  function actionButton(a,fn){const b=button(a.label,fn||(()=>execute(a)),a.kind);b.disabled=!enabled();return b;}
  function dismiss(){if(dialog.open)dialog.close();}
  function open(title,kicker=ctx?.authorityLabel||'公開カード / サーバー同期'){
   $('title').textContent=title;$('kicker').textContent=kicker;$('body').replaceChildren();$('body').scrollTop=0;$('footer').replaceChildren();$('footer').hidden=true;
   if(!dialog.open)dialog.showModal();return $('body');
  }
  function image(card){const wrap=document.createElement('div');wrap.className='art';if(card.hidden){wrap.classList.add('hidden-art');wrap.textContent='蟲';}else wrap.append(root.MushiCardVisuals.create(card.definition,{eager:true}));return wrap;}
  function find(ref){for(const p of Object.values(view.battle.players))for(const zone of ['field','hand','food','territory','discard','resolving'])for(const c of p[zone]||[]){if(c.ref===ref)return P.publicCard(c,definition);for(const a of c.attachments||[])if(a.ref===ref)return P.publicCard(a,definition);}return null;}
  function effectText(effect){return effect.effectText||effect.description||effect.text||root.CardEffectFormatter.formatCardEffect(effect);}
  function traits(card){const d=card.definition||{};return [...(d.skills||[]).filter(s=>s.timing!=='ATTACK'),...(d.passiveAbilities||[])];}
  function unit(card){
   const b=button('',()=>tap(card.ref));b.className='unit';b.dataset.ref=card.ref;b.dataset.hidden=String(card.hidden);
   b.setAttribute('aria-label',card.hidden?'裏向きのカード':card.name+(card.hp!=null?' HP '+card.hp:''));
   if(card.ref===selected)b.classList.add('selected');if(card.attacked)b.classList.add('used');
   if(!card.hidden&&enabled()&&vm.actions.some(a=>a.sourceRef===card.ref))b.classList.add('can-act');
   if(targetGroup){const allowed=P.targetActions(targetGroup,card.ref).length>0;b.classList.add(allowed?'target':'unavailable');b.setAttribute('aria-disabled',String(!allowed));}
   if(!ctx.connected||ctx.busy)b.disabled=true;
   b.append(image(card));
   if(!card.hidden){b.dataset.cardId=card.cardId;const hp=document.createElement('span');hp.className='hp';hp.textContent=card.hp!=null?'HP '+card.hp+' / '+card.maxHp:'コスト '+card.cost;
    const ap=document.createElement('span');ap.className='ap';ap.textContent=card.skills.length?'AP '+card.skills.map(s=>s.ap).join(' / '):({SPELL:'術',ENHANCEMENT:'強化'}[card.definition.type]||'');
    const mark=document.createElement('span');mark.className='markers';mark.textContent=[...traits(card).map(t=>t.name),card.attachments.length?'強化 '+card.attachments.length:'',card.attacked?'攻撃済み':'',b.classList.contains('can-act')?'操作可':''].filter(Boolean).join(' · ');b.append(hp,ap,mark);
   }return b;
  }
  function tap(ref){
   if(targetGroup){const candidates=P.targetActions(targetGroup,ref);if(candidates.length)resolveVariant(candidates);return;}
   selected=ref;draw();showCard();
  }
  function showCard(){const c=find(selected);if(!c)return;const body=open(c.name,(c.zone==='HAND'?'手札':c.controllerId===view.battle.viewerId?'自分の場':'カード')+'：行動を選択');const actions=vm.actions.filter(a=>a.sourceRef===selected);
   const guide=document.createElement('p');guide.className='battle-action-guide';guide.textContent=(actions.some(a=>a.kind==='ATTACK'||a.kind==='MULTI_ATTACK')?'攻撃する → 技を選択 → 光る対象をタップ。':actions.some(a=>a.targetRef)?'対象名を確認して、使用する操作を選択してください。':'使用する操作を選択してください。')+' 詳細は「カード詳細」で確認できます。';body.append(guide);
   const attacks=P.attackGroups(vm.actions,selected);if(attacks.length){const b=button('攻撃する',showSkills);b.disabled=!enabled();body.append(b);}
   for(const a of actions.filter(a=>!['ATTACK','MULTI_ATTACK','ENHANCE'].includes(a.kind)))body.append(actionButton(a));
   const enhancements=actions.filter(a=>a.kind==='ENHANCE');if(enhancements.length)body.append(button('強化を使う',()=>chooseTargets({name:'強化の装着先',actions:enhancements})));
   body.append(button('カード詳細',()=>details(c)),button('キャンセル',cancel));
   if(!actions.length){const p=document.createElement('p');p.textContent=vm.spectator?'観戦中です':enabled()?'このカードで現在できる操作はありません':'接続・相手の操作を待っています';body.append(p);}
  }
  function details(c){const body=open(c.name,'カード詳細');if(c.hidden){body.textContent='カードの表面は非公開です。';return;}
   const grid=document.createElement('div');grid.className='detail-grid';const art=image(c);art.className='detail-art';grid.append(art);
   const facts=document.createElement('p');facts.className='facts';facts.textContent='印刷コスト '+c.cost+(c.hp!=null?' / 現在HP '+c.hp+' / '+c.maxHp:'')+' / '+(c.definition.color||'無色');grid.append(facts);
   const skills=document.createElement('div');skills.className='skills-text';
   for(const skill of c.skills){const p=document.createElement('p');p.textContent='現在の技：'+skill.name+' / AP '+skill.ap;skills.append(p);}
   for(const skill of c.definition.skills||[]){const p=document.createElement('p');p.textContent=skill.name+' '+(skill.effectText||skill.description||(skill.effects||[]).map(effectText).join('、'));skills.append(p);}
   for(const trait of c.definition.passiveAbilities||[]){const p=document.createElement('p');p.textContent='印刷特性：'+trait.name+' '+(trait.effectText||trait.description||(trait.effects||[]).map(effectText).join('、'));skills.append(p);}
   for(const text of [...root.CardEffectFormatter.formatCardEffects(c.definition),...root.CardEffectFormatter.formatEnhancementEffects(c.definition)]){const p=document.createElement('p');p.textContent=text;skills.append(p);}
   const note=document.createElement('p');note.className='note';note.textContent=(ctx.mode==='cpu'?'現在HP・APは対戦エンジンの値です。':'現在HP・APはサーバーの値です。')+'印刷特性の説明と、現在の発動可否は異なります。全文は実カード画像でも確認できます。';skills.append(note);grid.append(skills);body.append(grid);
   body.append(button('実カード画像を拡大',()=>{const body=open(c.name,'CARD IMAGE');const visual=image(c);visual.classList.add('zoom-art');body.append(visual,button('詳細へ戻る',()=>details(c)));}));
   const attached=document.createElement('section');attached.className='attachments';const title=document.createElement('h2');title.textContent='装着中の強化 '+c.attachments.length;attached.append(title);
   for(const a of c.attachments){const b=button(a.name,()=>details(a));b.prepend(image(a));attached.append(b);}body.append(attached);
   const actions=document.createElement('section');actions.className='action-section';if(vm.actions.some(a=>a.sourceRef===c.ref))actions.append(button('このカードの行動',()=>{selected=c.ref;showCard();}));actions.append(button('盤面へ戻る',cancel));$('footer').replaceChildren(actions);$('footer').hidden=false;
  }
  function showSkills(){const body=open('攻撃技を選択',ctx.mode==='cpu'?'エンジンが許可した技':'サーバーが許可した技');for(const group of P.attackGroups(vm.actions,selected)){const b=button(group.name+(group.ap!=null?' / AP '+group.ap:''),()=>chooseTargets(group));b.dataset.skill='true';b.className='skill-option';b.disabled=!enabled();body.append(b);}body.append(button('戻る',showCard),button('キャンセル',cancel));}
  function chooseTargets(group){
   if(!enabled())return;
   if(group.actions.every(a=>!a.targetRef)){resolveVariant(group.actions);return;}
   targetGroup=group;expanded=false;dismiss();draw();
  }
  function resolveVariant(actions){
   if(actions.length===1){execute(actions[0]);return;}
   const body=open('追加の選択','サーバーが許可した組み合わせ');for(const a of actions){const extras=(a.additionalCostRefs||[]).map(ref=>{const c=find(ref);return c?c.name+' HP '+c.hp:'指定カード';});const b=actionButton(a);b.textContent=a.label+(extras.length?' / 追加コスト '+extras.join('、'):'');body.append(b);}body.append(button('対象選択へ戻る',()=>{dismiss();draw();}));
  }
  function execute(a,refs=[]){if(!enabled()||!vm.actions.some(x=>x.id===a.id))return;dismiss();targetGroup=null;selected=null;ctx.act(a,refs);}
  function cancel(){selected=null;targetGroup=null;dismiss();draw();}
  function allActions(){const body=open('現在できる操作',ctx.mode==='cpu'?'対戦エンジンの合法操作':'すべてサーバー発行の操作');if(vm.decision)body.append(button('効果の選択へ戻る',showDecision));for(const a of vm.actions)if(a.id!==vm.decision?.actionId)body.append(actionButton(a));if(!vm.actions.length)body.textContent=vm.spectator?'観戦中です':'現在は操作を待っています';body.append(button('盤面へ戻る',cancel));}
  function showChoice(){
   const actions=vm.actions.filter(a=>a.kind==='CHOICE'||a.kind==='TERRITORY_CHOICE');
   if(!actions.length||!enabled())return;
   const body=open('効果を選択','色などの選択');
   const hint=document.createElement('p');hint.textContent='使用する効果を選んでください。';body.append(hint);
   for(const action of actions)body.append(actionButton(action));
  }
  function showDecision(){
   const d=vm.decision;if(!d||!enabled())return;
   const body=open('カードを選択','効果の解決');chosen=[];
   const summary=document.createElement('p');summary.textContent='選択中：0 / '+d.max+'枚（最大'+d.max+'枚）。カードをタップすると選択・解除できます。複数出す場合は、すべて選んでから決定してください。';body.append(summary);
   const list=document.createElement('div');list.className='online-choice-list';body.append(list);
   const confirm=button('選択を決定',()=>{const a=vm.actions.find(a=>a.id===d.actionId);if(a)execute(a,chosen.slice());},'CONFIRM_SELECTION');
   function refresh(){summary.textContent='選択中：'+chosen.length+' / '+d.max+'枚（最大'+d.max+'枚）。'+(d.max>1?'2枚出す場合は2枚とも選んでから決定してください。':'カードを選んで決定してください。');confirm.textContent='選択を決定（'+chosen.length+'枚）';confirm.disabled=(chosen.length>0&&d.firstOptions?.length&&!d.firstOptions.includes(chosen[0]))||(d.atMostOneGroups||[]).some(group=>group.filter(ref=>chosen.includes(ref)).length>1)||!enabled()||chosen.length<d.min||chosen.length>d.max||(d.exact!=null&&chosen.length!==d.exact)||(d.combinations?.length&&!d.combinations.some(group=>group.length===chosen.length&&group.every(ref=>chosen.includes(ref))));for(const b of list.children){const n=chosen.indexOf(b.dataset.ref);b.disabled=n<0&&((!chosen.length&&d.firstOptions?.length&&!d.firstOptions.includes(b.dataset.ref))||(d.atMostOneGroups||[]).some(group=>group.includes(b.dataset.ref)&&group.some(ref=>chosen.includes(ref))));b.setAttribute('aria-pressed',String(n>=0));b.textContent=b.dataset.label+(n>=0?' ['+(n+1)+']':'');}}
   d.options.forEach((dto,i)=>{const label=P.optionLabel(dto,i,view.battle.viewerId),b=button(label,()=>{const index=chosen.indexOf(dto.ref);if(index>=0)chosen.splice(index,1);else if(chosen.length<d.max)chosen.push(dto.ref);if(chosen.length&&d.firstOptions?.length&&!d.firstOptions.includes(chosen[0]))chosen=[];refresh();});b.dataset.ref=dto.ref;b.dataset.label=label;b.dataset.hidden=String(dto.hidden);list.append(b);});
   const previews=document.createElement('details'),heading=document.createElement('summary');heading.textContent='公開候補のカード詳細';previews.append(heading);
   for(const dto of d.options.filter(x=>!x.hidden)){const c=P.publicCard(dto,definition);const row=document.createElement('details'),title=document.createElement('summary');title.textContent=P.optionLabel(dto,0,view.battle.viewerId);row.append(title,image(c));const text=document.createElement('p');text.textContent=(c.skills||[]).map(s=>s.name+' AP '+s.ap).join(' / ');row.append(text);previews.append(row);}body.append(previews);
   $('footer').append(confirm);$('footer').hidden=false;refresh();
  }
  function zones(player,zone){const body=open(player.id+' / '+zone,'公開範囲のカード');if(zone==='deck'){body.textContent='山札の内容と順序は非公開です。';return;}const list=document.createElement('div');list.className='zone-list';for(const dto of player[zone]||[]){const c=P.publicCard(dto,definition),b=button(c.name,()=>details(c));b.append(image(c));list.append(b);}body.append(list);}
  function stats(role,player){const el=$(role);el.replaceChildren();const cost=document.createElement('span');cost.textContent='コスト';const value=document.createElement('b');value.textContent=player.availableCost;cost.append(value);el.append(cost);for(const [zone,label] of [['hand','手'],['deck','山'],['territory','縄'],['food','エサ'],['discard','捨']]){const b=button('',()=>zones(player,zone));b.append(document.createTextNode(label));const n=document.createElement('b');n.textContent=player.counts[zone];b.append(n);el.append(b);}}
  function draw(){
   if(!ctx||!vm)return;if(!vm.own.hand.length)expanded=false;arena.classList.toggle('hand-expanded',expanded);arena.dataset.mode=targetGroup?'target':'idle';
   for(const [role,cards] of [['other-field',vm.other.field],['own-field',vm.own.field],['hand',vm.own.hand]]){const lane=$(role),left=lane.scrollLeft;lane.dataset.count=cards.length;lane.replaceChildren(...cards.map(unit));lane.scrollLeft=left;}
   const b=view.battle;stats('other-stats',vm.other);stats('own-stats',vm.own);$('own-name').textContent=vm.spectator?'P1':ctx.names?.own||'あなた';$('other-name').textContent=vm.spectator?'P2':ctx.names?.other||'相手';
   $('turn').textContent='TURN '+b.turn;$('phase').textContent=({SET_PHASE:'SET',MAIN_PHASE:'MAIN',DRAW_PHASE:'DRAW',GAME_OVER:'END'}[b.phase]||b.phase);
   let instruction=vm.spectator?'観戦中':b.activePlayerId===b.viewerId?'あなたの番':'相手の番';
   if(targetGroup)instruction=targetGroup.name+'：光る対象を選択';
   if(view.room.phase!=='PLAYING')instruction=view.room.phase==='ENDED'?P.resultLabel(view.room,b.viewerId,vm.spectator):'試合中断：'+(view.room.reason||view.room.phase);
   else if(!ctx.connected)instruction='通信が切断されました。再接続中…';else if(view.room.paused)instruction='相手の再接続を待っています（最大5分）';else if(ctx.busy)instruction='操作を送信中…';else if(b.blockedReason)instruction='処理を継続できません：'+b.blockedReason;else if(vm.decision)instruction='効果の選択を行ってください';else if(vm.actions.some(a=>['CHOICE','TERRITORY_CHOICE'].includes(a.kind)))instruction='操作一覧から効果を選択してください';
   $('instruction').textContent=instruction;$('instruction').title=instruction;$('target-controls').hidden=!targetGroup;
   $('hand-toggle').textContent=(expanded?'⌄ 収納':'⌃ 展開')+' · 手札 '+vm.own.counts.hand+'枚';$('hand-toggle').setAttribute('aria-expanded',String(expanded));$('hand-toggle').disabled=!!targetGroup||!vm.own.hand.length;
   $('back').hidden=$('cancel').hidden=!targetGroup;
   $('direct').hidden=!targetGroup||!targetGroup.actions.some(a=>!a.targetRef);$('direct').disabled=!enabled();$('direct').onclick=()=>targetGroup&&resolveVariant(targetGroup.actions.filter(a=>!a.targetRef));
   const end=vm.actions.find(a=>a.kind==='END'),next=vm.actions.find(a=>['MAIN','DRAW','TO_SET'].includes(a.kind));const mainAction=end||next;
   $('end').textContent=mainAction?.label||'相手の操作待ち';$('end').disabled=!enabled()||!mainAction||!!targetGroup;$('end').onclick=()=>mainAction&&execute(mainAction);
   if(view.room.phase==='ENDED'&&ctx.replay){$('end').textContent='もう一度対戦';$('end').disabled=false;$('end').onclick=ctx.replay;}
   $('all-actions').disabled=!enabled()||!vm.actions.length;
  }
  $('hand-toggle').onclick=()=>{expanded=!expanded;draw();};$('all-actions').onclick=allActions;
  function showPublicLog(){const body=open('対戦ログ','公開情報のみ / 時系列');const entries=view.battle.publicLog||[];if(!entries.length)body.textContent='公開行動はまだありません。';for(const entry of entries){const line=document.createElement('p');line.textContent='T'+entry.turn+' '+entry.text;body.append(line);}body.scrollTop=body.scrollHeight;}
  host.querySelectorAll('[data-role="menu"]').forEach(b=>b.onclick=()=>{const body=open('対戦メニュー');body.append(button('対戦ログ',showPublicLog),button('設定・退出など',()=>{dismiss();ctx.menu();}));});
  $('back').onclick=()=>{const enhancement=targetGroup?.actions.every(a=>a.kind==='ENHANCE');targetGroup=null;draw();if(enhancement)showCard();else showSkills();};$('cancel').onclick=cancel;$('close').onclick=cancel;
  dialog.addEventListener('cancel',e=>{e.preventDefault();cancel();});
  return {render(next){const changed=view!==next.view||version!==next.view.room.version;ctx=next;view=next.view;vm=P.board(view.battle,definition);if(changed||!next.connected||next.busy){version=view.room.version;selected=null;targetGroup=null;dismiss();}draw();if(!dialog.open){if(vm.decision)showDecision();else if(vm.actions.some(a=>a.kind==='CHOICE'||a.kind==='TERRITORY_CHOICE'))showChoice();}},reset:cancel};
 }
 root.MushiBattleBoard={create};
})(window);
