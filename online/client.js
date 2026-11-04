(function(){
  'use strict';
  const $=id=>document.getElementById(id),sessionKey='mushiOnlineSeatV1';
  let socket,contract,hello,current,seat=null,connected=false,busy=false,retry=0,retryTimer,decisionVersion=null,localDecks=[],lastCommand=null;
  // Presentation adapters only: every displayed effective value comes from the server.
  window.ZONES={FIELD:'FIELD',FOOD:'FOOD',HAND:'HAND',DISCARD:'DISCARD',TERRITORY:'TERRITORY'};
  window.calculateMaxHp=instance=>instance.onlineMaxHp;
  // The legacy thumbnail API has no skill identity. Suppress its AP inference;
  // effective AP is rendered per skill directly from the authoritative DTO below.
  window.getEffectiveAP=()=>null;
  window.getEffectiveColor=instance=>instance.onlineColor;
  const phases={SET_PHASE:'セット',MAIN_PHASE:'メイン',DRAW_PHASE:'ドロー',GAME_OVER:'対戦終了'};
  function notice(text){$('notice').textContent=text||'';}
  function button(label,fn,kind){const b=document.createElement('button');b.type='button';b.textContent=label;b.disabled=!connected||busy;if(kind)b.dataset.kind=kind;b.onclick=fn;return b;}
  function closeOverlay(){if($('overlay').open)$('overlay').close();}
  function openOverlay(title){$('overlay-title').textContent=title;$('overlay-body').replaceChildren();if(!$('overlay').open)$('overlay').showModal();return $('overlay-body');}
  function send(type,fields={}){
    if(!connected||busy)return;busy=true;
    const packet={type,requestId:crypto.randomUUID().replaceAll('-',''),versions:contract,...fields};
    lastCommand=packet;socket.send(JSON.stringify(packet));render();
  }
  function act(action,refs=[]){closeOverlay();send('ACTION',{version:current.room.version,actionId:action.id,selectedRefs:refs});}
  function instance(dto){return {instanceId:dto.ref,cardId:dto.cardId,faceDown:dto.hidden,currentHp:dto.currentHp,onlineMaxHp:dto.maxHp,onlineColor:dto.color,attackedThisTurn:dto.attacked,attachments:(dto.attachments||[]).map(instance)};}
  function locationOf(ref){
    if(!current||!current.battle)return null;
    for(const player of Object.values(current.battle.players))for(const zone of ['hand','field','food','territory','discard','resolving'])for(const [index,dto] of (player[zone]||[]).entries()){
      const position=(current.battle.viewerId==='SPECTATOR'?player.id:player.id===current.battle.viewerId?'あなた':'相手')+'の'+({hand:'手札',field:'場',food:'エサ',territory:'縄張り',discard:'捨て場',resolving:'解決中'}[zone])+(index+1);
      if(dto.ref===ref)return {dto,position};
      for(const [n,attachment] of (dto.attachments||[]).entries())if(attachment.ref===ref)return {dto:attachment,position:position+'に付いた強化'+(n+1)};
    }return null;
  }
  function describe(dto,index){
    if(dto.hidden)return '裏向き '+(index+1);
    const location=locationOf(dto.ref),parts=[dto.name];if(location)parts.push(location.position);
    if(dto.currentHp!=null)parts.push('HP '+dto.currentHp+'/'+dto.maxHp);
    if(dto.attachments&&dto.attachments.length)parts.push('強化 '+dto.attachments.map(a=>a.hidden?'裏向き':a.name).join('・'));
    if(dto.ownerId&&dto.controllerId&&dto.ownerId!==dto.controllerId)parts.push('持ち主: '+(current.battle.viewerId==='SPECTATOR'?dto.ownerId:dto.ownerId===current.battle.viewerId?'あなた':'相手'));
    return parts.join(' / ');
  }
  function actionLabel(action){const parts=[action.label];if(action.skill)parts.push(action.skill.name+' / 現在AP '+action.skill.ap);for(const [key,title] of [['sourceRef','使用元'],['targetRef','対象']])if(action[key]){const found=locationOf(action[key]);if(found)parts.push(title+': '+describe(found.dto,0));}for(const ref of action.additionalCostRefs||[]){const found=locationOf(ref);if(found)parts.push('追加コスト: '+describe(found.dto,0));}return parts.join('\n');}
  function card(dto,zone){
    let el;if(dto.hidden){el=document.createElement('button');el.type='button';el.className='battle-card online-back';el.textContent='蟲';el.setAttribute('aria-label','裏向きのカード');el.dataset.hidden='true';}
    else{el=CardUI.renderCard(instance(dto),zone,{online:true});el.dataset.cardId=dto.cardId;el.setAttribute('aria-label',dto.name+(dto.currentHp!=null?' HP '+dto.currentHp:''));}
    el.dataset.ref=dto.ref;el.disabled=busy||!connected;
    const actions=current&&current.battle?current.battle.actions.filter(a=>a.sourceRef===dto.ref):[];
    if(actions.length)el.classList.add('can-act');el.onclick=()=>inspect(dto,actions);return el;
  }
  function inspect(dto,actions){
    const body=openOverlay(dto.hidden?'裏向きのカード':dto.name);
    for(const action of actions)body.append(button(actionLabel(action),()=>act(action),action.kind));
    appendCardDetails(dto,body);
    if(dto.attachments&&dto.attachments.length){body.append(document.createTextNode('装着中の強化'));for(const attachment of dto.attachments)body.append(button(attachment.hidden?'裏向きの強化':attachment.name,()=>inspect(attachment,[])));}
  }
  function appendCardDetails(dto,body){
    if(dto.hidden){const p=document.createElement('p');p.textContent='カードの表面は非公開です。';body.append(p);return;}
    const def=getCardDefinition(dto.cardId),p=document.createElement('div');p.className='online-detail';
    const lines=['印刷コスト '+def.cost];if(dto.currentHp!=null)lines.push('HP '+dto.currentHp+'/'+dto.maxHp);
    for(const skill of dto.skills||[])lines.push('現在の技: '+skill.name+' / AP '+skill.ap);
    for(const skill of def.skills||[])lines.push(skill.name+' '+(skill.description||skill.effectText||''));
    for(const trait of [...(def.traits||[]),...(def.passiveAbilities||[])])lines.push(trait.name+' '+(trait.effectText||(trait.effects||[]).map(e=>CardEffectFormatter.formatCardEffect(e)).join('、')));
    for(const effect of def.cardEffects||[])lines.push(CardEffectFormatter.formatCardEffect(effect));
    for(const effect of def.enhancementEffects||[])lines.push(CardEffectFormatter.formatEnhancementEffect(effect));
    if(def.effectText)lines.push(def.effectText);if(def.trait)lines.push(typeof def.trait==='string'?def.trait:'');
    p.textContent=lines.filter(Boolean).join('\n');body.append(p);
    if(window.MushiCardVisuals)body.append(MushiCardVisuals.create(def,{decorative:false}));
  }
  function showActions(){const body=openOverlay('現在できる操作');for(const action of current&&current.battle?current.battle.actions:[]){if(current.battle.decision&&action.id===current.battle.decision.actionId)continue;body.append(button(actionLabel(action),()=>act(action),action.kind));}if(!body.children.length)body.textContent='現在は操作を待っています。';}
  function lane(name,cards,zone){const list=document.querySelector('[data-zone="'+name+'"]'),left=list.scrollLeft;list.replaceChildren(...cards.map(dto=>card(dto,zone)));list.scrollLeft=left;}
  function status(id,p,label){
    const el=$(id),strong=document.createElement('strong');strong.textContent=label+' コスト '+p.availableCost;el.replaceChildren(strong);
    for(const [zone,title] of [['hand','手'],['deck','山'],['territory','縄'],['food','エサ'],['discard','捨']]){
      el.append(button(title+p.counts[zone],()=>{const body=openOverlay(label+' · '+title);if(zone==='deck'){body.textContent='山札の順序・内容は非公開です。';return;}const list=document.createElement('div');list.className='online-cards';list.style.minHeight='150px';list.append(...p[zone].map(dto=>card(dto,zone.toUpperCase())));body.append(list);}));
    }
  }
  function showDecision(){
    if(busy)return;
    const d=current.battle.decision;if(!d){if(decisionVersion!==null)closeOverlay();decisionVersion=null;return;}
    if(decisionVersion===current.room.version&&$('overlay').open)return;decisionVersion=current.room.version;
    const body=openOverlay('カードを選択'),summary=document.createElement('p');summary.textContent=d.min+'〜'+d.max+'枚を順に選択してください。';body.append(summary);
    const selected=[],choices=document.createElement('div');choices.className='online-choice-list';
    const confirm=button('選択を決定',()=>act({id:d.actionId},selected.slice()),'CONFIRM_SELECTION');
    function refresh(){confirm.disabled=!connected||busy||selected.length<d.min||selected.length>d.max||(d.exact!=null&&selected.length!==d.exact);for(const b of choices.children){const order=selected.indexOf(b.dataset.ref);b.setAttribute('aria-pressed',String(order>=0));b.textContent=b.dataset.label+(order>=0?' ['+(order+1)+']':'');}}
    d.options.forEach((dto,index)=>{const label=describe(dto,index);const b=button(label,()=>{const i=selected.indexOf(dto.ref);if(i>=0)selected.splice(i,1);else if(selected.length<d.max)selected.push(dto.ref);refresh();});b.dataset.ref=dto.ref;b.dataset.label=label;b.dataset.hidden=String(dto.hidden);choices.append(b);});
    body.append(choices);
    if(d.options.some(dto=>!dto.hidden)){
      const details=document.createElement('details'),heading=document.createElement('summary'),list=document.createElement('div');heading.textContent='選択候補の詳細を確認';list.className='online-candidate-details';
      d.options.forEach((dto,index)=>{if(dto.hidden)return;const entry=document.createElement('details'),title=document.createElement('summary');title.textContent=describe(dto,index);entry.append(title);appendCardDetails(dto,entry);list.append(entry);});details.append(heading,list);body.append(details);
    }
    body.append(confirm);refresh();
  }
  function render(){
    if(!current||!current.battle||current.room.phase==='LOBBY')window.MushiOnlineBattle?.reset();
    $('create').disabled=$('join').disabled=$('watch').disabled=!connected||busy||!!seat;
    if(!current){$('entrance').hidden=!!seat;return;}
    const room=current.room,battle=current.battle;const inLobby=room.phase==='LOBBY',watching=seat.role==='SPECTATOR';
    $('entrance').hidden=true;$('room').hidden=!inLobby&&!!battle;$('board').hidden=inLobby||!battle;$('board').dataset.roomPhase=room.phase;$('board').dataset.version=room.version;
    $('room-code').textContent=room.code;$('participants').textContent=room.players.map(p=>p.id+' '+p.name+' '+(p.deckSelected?'デッキ選択済み ':'デッキ未選択 ')+(p.connected?'接続中':'切断中')+' '+(p.ready?'準備完了':'準備中')).join(' / ');
    $('membership').textContent=(watching?'観戦者':seat.playerId+'として参加')+' · 観戦 '+(room.spectatorCount||0)+'人';
    for(const id of ['deck-label','deck-preview','deck-apply','ready'])$(id).hidden=watching;
    const me=room.players.find(p=>p.id===seat.playerId);$('ready').disabled=!inLobby||!connected||busy||!me||!me.deckSelected;$('ready').textContent=me&&me.ready?'準備を取り消す':'準備完了';$('deck-apply').disabled=!inLobby||!connected||busy||!!(me&&me.ready)||deckErrors(selectedDeck()).length>0;$('leave').disabled=!connected||busy;
    if(!battle){if(!inLobby)notice(room.reason==='HOST_LEFT'?'ホストが退出したためルームを終了しました。':'ルームは終了しました。退出して作り直してください。');return;}
    const own=battle.players[watching?'P1':battle.viewerId],other=battle.players[watching?'P2':battle.viewerId==='P1'?'P2':'P1'];
    if(window.MushiOnlineBattle){window.MushiOnlineBattle.render({view:current,connected,busy,act,menu:()=>{$('menu').click();}});return;}
    document.querySelector('.player-field h2').firstChild.textContent=watching?'P1の場 ':'あなたの場 ';document.querySelector('.opponent-field h2').firstChild.textContent=watching?'P2の場 ':'相手の場 ';document.querySelector('.hand h2').firstChild.textContent=watching?'P1の手札（非公開） ':'手札 ';
    $('turn-status').textContent='ターン '+battle.turn+' · '+(phases[battle.phase]||battle.phase)+' · '+(watching?battle.activePlayerId+'の番 · 観戦中':battle.activePlayerId===battle.viewerId?'あなたの番':'相手の番');
    status('opponent-status',other,watching?'P2':'相手');status('player-status',own,watching?'P1':'あなた');lane('opponent-field',other.field,'FIELD');lane('player-field',own.field,'FIELD');lane('player-hand',own.hand,'HAND');lane('opponent-hand',other.hand,'HAND');
    const actionBox=$('actions');actionBox.replaceChildren();
    if(room.phase==='ENDED'||room.phase==='ABORTED'||room.phase==='EXPIRED'){
      closeOverlay();const p=document.createElement('p');p.className='online-result';p.textContent=room.phase==='ENDED'?(watching?(room.result&&room.result.winner?room.result.winner+'の勝利':'対戦終了'):room.result&&room.result.winner===seat.playerId?'あなたの勝利':'対戦終了'):'試合中断: '+room.reason;actionBox.append(p);
    }else if(room.paused){const p=document.createElement('p');p.textContent='相手の再接続を待っています（最大5分）';actionBox.append(p);}
    else{for(const action of battle.actions.filter(a=>!a.sourceRef&&(!battle.decision||a.id!==battle.decision.actionId)))actionBox.append(button(action.label,()=>act(action),action.kind));if(!battle.actions.length){const p=document.createElement('p');p.textContent=watching?'観戦中 · 操作できません':'相手の操作を待っています';actionBox.append(p);}showDecision();}
  }
  function readSeat(){try{return JSON.parse(sessionStorage.getItem(sessionKey));}catch{return null;}}
  function saveSeat(){try{if(seat)sessionStorage.setItem(sessionKey,JSON.stringify(seat));else sessionStorage.removeItem(sessionKey);}catch{notice('このブラウザでは再接続情報を保存できません。');}}
  function selectedDeck(){
    const [kind,id]=$('deck-select').value.split(':');
    if(kind==='saved')return localDecks[Number(id)];
    if(kind==='preset'&&STARTER_DECK_RECIPES[id])return {formatVersion:'mushijingi-deck/1.0',cardDataVersion:'card-registry/1',rulesetId:'ruleset:standard:v1',deckName:STARTER_DECK_RECIPES[id].name,cards:Object.entries(STARTER_DECK_RECIPES[id].cardCounts).map(([canonicalCardId,quantity])=>({canonicalCardId,quantity}))};
    return null;
  }
  function deckErrors(deck){
    if(!deck)return ['保存デッキが見つかりません。Toolboxで選び直してください。'];
    if(!Array.isArray(deck.cards)||deck.cards.some(c=>!c||typeof c.canonicalCardId!=='string'||!Number.isInteger(c.quantity)||c.quantity<=0))return ['保存デッキのカード情報を読み込めません。Toolboxで確認してください。'];
    const errors=[];
    if(deck.formatVersion!=='mushijingi-deck/1.0'||deck.cardDataVersion!=='card-registry/1'||deck.rulesetId!=='ruleset:standard:v1')errors.push('デッキの形式・カードデータのバージョンが一致しません。');
    errors.push(...MushijingiDeckRuntime.validateForBattle(deck,cardRegistry).errors);
    const allowed=new Set(hello?.playableIds||[]);if(deck.cards.some(c=>!allowed.has(c.canonicalCardId)))errors.push('このサーバーでは使用できないカードが含まれています。');
    return errors;
  }
  function deckNote(){const deck=selectedDeck(),errors=deckErrors(deck),text=errors.length?errors.join(' / '):'選択中：'+deck.deckName+' · 20枚（サーバーで最終確認）';if($('deck-readiness'))$('deck-readiness').textContent=text;if($('preferred-deck'))$('preferred-deck').textContent=new URLSearchParams(location.search).has('deck')?text:'';}
  function populateDecks(){
    const select=$('deck-select'),previous=select.value;select.replaceChildren();for(const preset of hello.presets){const o=new Option(preset.name,'preset:'+preset.id);select.add(o);}
    try{localDecks=MushijingiDeckRuntime.parseStore(localStorage.getItem(MushijingiDeckRuntime.STORAGE_KEY)).decks;}catch{localDecks=[];}
    localDecks.forEach((deck,index)=>{const valid=deckErrors(deck).length===0,option=new Option((deck.deckName||'保存デッキ')+(valid?'':'（使用条件を確認してください）'),'saved:'+index);option.disabled=!valid;select.add(option);});
    const requested=new URLSearchParams(location.search).get('deck');
    if(requested){const index=localDecks.findIndex(d=>d.deckId===requested);if(index>=0)select.value='saved:'+index;else{const missing=new Option('指定された保存デッキが見つかりません','missing');missing.disabled=true;select.add(missing);select.value='missing';}}
    else if([...select.options].some(o=>o.value===previous&&!o.disabled))select.value=previous;
    deckNote();
  }
  function connect(endpoint){
    clearTimeout(retryTimer);$('connection').textContent='接続中';socket=new WebSocket(endpoint,'mushi-online-v1');
    socket.onmessage=event=>{
      let m;try{m=JSON.parse(event.data);}catch{return;}
      if(m.type==='HELLO'){
        if(Object.keys(contract).some(key=>contract[key]!==m.versions[key])){notice('ゲームデータが更新されています。ページを再読込してください。');socket.onclose=null;socket.close();return;}
        hello=m;connected=true;busy=false;retry=0;$('connection').textContent='接続済み';populateDecks();
        seat=readSeat();if(seat){notice(seat.bootId!==m.bootId?'サーバーが再起動しました。前の試合の状態を確認します。':'対戦へ再接続しています。');send('RESUME',{code:seat.roomCode,token:seat.token});}else render();
      }else if(m.type==='SESSION'){seat={...seat,...m};saveSeat();}
      else if(m.type==='ACK'){busy=false;if(lastCommand&&m.requestId===lastCommand.requestId&&lastCommand.type==='LEAVE'){seat=null;current=null;saveSeat();$('room').hidden=$('board').hidden=true;closeOverlay();render();}}
      else if(m.type==='VIEW'){if(!current||current.room.version!==m.room.version){closeOverlay();decisionVersion=null;}current=m;busy=false;notice('');render();}
      else if(m.type==='ERROR'){
        busy=false;const errors={STALE_STATE:'状態が更新されました。もう一度選択してください。',SPECTATOR_LIMIT:'観戦枠が満員です（最大3人）。',SPECTATOR_READ_ONLY:'観戦者は対戦操作できません。',DECK_VERSION:'保存デッキの形式・カードデータが一致しません。Toolboxで確認してください。',DECK_INVALID:'このデッキは使用できません。20枚・同名2枚・対戦対応を確認してください。',ROOM_STATE:'このルームは終了済み、または現在その操作ができません。',ROOM_FULL:'ルームは満員、または開始済みです。',ROOM_UNAVAILABLE:'ルームがありません。再起動・期限切れの場合は作り直してください。',AUTH_INVALID:'再接続できません。ルームを作り直してください。',SELECTION_INVALID:'選択条件を確認してください。'};
        notice(errors[m.code]||'操作できませんでした: '+m.code);
        if(['ROOM_UNAVAILABLE','AUTH_INVALID'].includes(m.code)){seat=null;current=null;saveSeat();$('room').hidden=$('board').hidden=true;closeOverlay();}
        if(m.code==='STALE_STATE'){decisionVersion=null;closeOverlay();send('SYNC');}render();
      }else if(m.type==='ROOM_EXPIRED'){seat=null;current=null;saveSeat();$('room').hidden=$('board').hidden=true;closeOverlay();notice('ルームの有効期限が切れました。新しく作成してください。');render();}
      else if(m.type==='SERVER_STOPPING')notice('サーバー停止のため試合を中断します。復旧後に新しいルームを作成してください。');
    };
    socket.onclose=event=>{connected=false;busy=false;closeOverlay();$('connection').textContent='切断中';render();if(event.code===4001){notice('別の接続で再開されました。この画面の再接続を停止しました。');return;}retryTimer=setTimeout(()=>connect(endpoint),Math.min(15000,1000*2**Math.min(retry++,4)));};
    socket.onerror=()=>notice('サーバーへ接続できません。Toolbox・CPU対戦はホームから利用できます。');
  }
  $('watch').onclick=()=>send('WATCH',{code:$('code').value.trim()});
  $('create').onclick=()=>send('CREATE',{name:$('name').value});$('join').onclick=()=>send('JOIN',{name:$('name').value,code:$('code').value.trim()});
  $('deck-preview').onclick=()=>{
    const [kind,id]=$('deck-select').value.split(':'),body=openOverlay('使用デッキ');
    const deck=selectedDeck();if(!deck){body.textContent=deckErrors(null).join(' / ');return;}
    const result=MushijingiDeckRuntime.validateForBattle(deck,cardRegistry),summary=document.createElement('p');summary.textContent=result.valid?'20枚 · 構築ルール確認済み（最終判定はサーバー）':result.errors.join(' / ');body.append(summary);
    for(const entry of deck.cards){const line=document.createElement('p');line.textContent=(getCardDefinition(entry.canonicalCardId)?.name||entry.canonicalCardId)+' × '+entry.quantity;body.append(line);}
  };
  $('deck-select').onchange=()=>{deckNote();render();};
  $('deck-apply').onclick=()=>{if(deckErrors(selectedDeck()).length){deckNote();return;}const value=$('deck-select').value,[kind,id]=value.split(':');send('DECK',{version:current.room.version,...(kind==='preset'?{preset:id}:{deck:localDecks[Number(id)]})});};
  $('ready').onclick=()=>send('READY',{version:current.room.version,ready:!current.room.players.find(p=>p.id===seat.playerId)?.ready});
  $('leave').onclick=()=>{if(confirm('このルームを退出しますか？'))send('LEAVE',{version:current.room.version});};
  $('copy-code').onclick=async()=>{try{await navigator.clipboard.writeText(current.room.code);notice('ルームコードをコピーしました。');}catch{notice('表示されているルームコードを手動で共有してください。');}};
  $('close-overlay').onclick=()=>{closeOverlay();};
  $('menu').onclick=()=>{const body=openOverlay('オンライン対戦 β');body.append(document.createTextNode('接続状態: '+$('connection').textContent));if(current){body.append(document.createTextNode('対戦ID '+current.room.matchId));body.append(button('現在できる操作の一覧',showActions,'ACTION_LIST'));body.append(button('サーバーの状態を再取得',()=>{closeOverlay();send('SYNC');}));body.append(button('選択へ戻る',()=>{closeOverlay();decisionVersion=null;render();}));if(current.room.phase==='PLAYING'&&seat.role!=='SPECTATOR')body.append(button('投了',()=>{if(confirm('この試合を投了しますか？')){closeOverlay();send('RESIGN',{version:current.room.version});}}));else body.append(button(seat.role==='SPECTATOR'?'観戦を終了して戻る':'ルームを終了して戻る',()=>{closeOverlay();send('LEAVE',{version:current.room.version});}));}const home=document.createElement('a');home.href='index.html';home.textContent='ホーム（接続中の試合は一時切断）';body.append(home);};
  Promise.all([fetch('online/config.json',{cache:'no-store'}).then(r=>r.json()),fetch('online/contract.json',{cache:'no-store'}).then(r=>r.json())]).then(([config,versions])=>{
    contract=versions;const local=['127.0.0.1','localhost'].includes(location.hostname);let endpoint=local?config.localEndpoint:config.productionEnabled&&config.productionEndpoint;
    if(!endpoint){notice('オンライン対戦は公開準備中です。Toolbox・CPU対戦はホームから利用できます。');$('connection').textContent='未公開';return;}
    const url=new URL(endpoint);if(url.username||url.password||url.search||url.hash||url.pathname!=='/ws'||(local?url.protocol!=='ws:'||url.hostname!=='127.0.0.1'||(url.port!=='8787'&&url.host!==location.host):url.protocol!=='wss:'||!config.allowedProductionHosts.includes(url.hostname)))throw Error('接続先設定が不正です');
    connect(url.href);
  }).catch(()=>{notice('接続設定を読み込めません。再読込してください。');$('connection').textContent='設定エラー';});
})();
