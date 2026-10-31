/* CPU lifecycle only; rules and AI remain in the existing Engine/CpuRunner. */
(function(root){'use strict';function init(){
 const ui=root.MushiBattle.ui,adapter=root.MushiCpuAdapter,runtime=adapter.createRuntime(root);
 const shell=document.createElement('section');shell.id='cpu-b-shell';shell.className='battle-shell';shell.hidden=true;shell.innerHTML='<header class="cpu-b-header"><a href="toolbox.html">Toolbox</a><strong>CPU対戦</strong><span id="cpu-b-notice" role="status"></span></header><section id="board" aria-label="CPU対戦 B案"><div id="b-battle"></div></section><dialog id="cpu-b-menu" aria-label="CPU対戦メニュー"><h2>CPU対戦</h2><div></div><button data-close>閉じる</button></dialog>';document.body.append(shell);
 const sheet=shell.querySelector('#cpu-b-menu'),menuBody=sheet.querySelector('div'),notice=shell.querySelector('#cpu-b-notice'),host=shell.querySelector('#board'),board=root.MushiBattleBoard.create(shell.querySelector('#b-battle')),style=document.querySelector('#cpu-b-style');
 const legacyButton=document.createElement('button');legacyButton.id='cpu-b-return';legacyButton.textContent='B案UIへ';legacyButton.hidden=true;document.body.append(legacyButton);
 const legacyQuery=new URLSearchParams(location.search).get('battleUi')==='legacy';let started=false,useB=!legacyQuery,version=0,prepared=null,snapshot=null,busy=false,error='';
 const active=()=>started&&ui.cpuMode&&!ui.tutorialController&&useB;
 function visible(){const on=active();shell.hidden=!on;style.disabled=!on;document.body.classList.toggle('cpu-b-active',on);legacyButton.hidden=!(started&&ui.cpuMode&&!useB&&!legacyQuery);if(on){for(const id of ['compact-actions','compact-log','compact-instructions','zone-inspector']){const d=document.getElementById(id);if(d?.open)d.close();}}if(!on){board.reset();if(sheet.open)sheet.close();}return on;}
 function button(label,fn){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>{sheet.close();fn();};return b;}
 function menu(){menuBody.replaceChildren(button('対戦ログ',()=>{menuBody.replaceChildren();for(const entry of ui.state.battleLog.slice(-200)){const p=document.createElement('p');p.textContent='T'+entry.turnNumber+' '+entry.text;menuBody.append(p);}sheet.showModal();}),button('もう一度対戦',()=>ui.newGame()),button('デッキを選び直す',()=>ui.returnToDeckSelect()),button('旧UIへ切り替え',()=>{useB=false;visible();ui.render();}),button('操作ヘルプ',()=>{menuBody.textContent='カード→行動→技→光る対象の順に操作します。手札は展開・横スクロールできます。操作一覧で全ての合法操作を確認できます。';sheet.showModal();}));sheet.showModal();}
 sheet.querySelector('[data-close]').onclick=()=>sheet.close();legacyButton.onclick=()=>{useB=true;ui.render();};
 function show(){if(!visible())return;const state=ui.state,key=JSON.stringify(state);if(key!==snapshot){snapshot=key;version++;prepared=adapter.prepare(runtime,state);}
 const ended=state.phase===root.Phases.GAME_OVER,blocked=prepared.view.blockedReason;
 const view={room:{version,phase:ended?'ENDED':blocked?'ABORTED':'PLAYING',paused:false,reason:blocked,result:ended?{winner:state.winner}:null},battle:prepared.view};host.dataset.version=version;host.dataset.roomPhase=view.room.phase;notice.textContent=error;
 board.render({view,connected:true,busy,mode:'cpu',resultLabel:ended?(state.winner==='P1'?'あなたの勝利':'CPUの勝利'):null,names:{own:'あなた',other:'CPU'},authorityLabel:'対戦エンジンの合法操作',menu,replay:()=>ui.newGame(),act(a,refs){if(busy)return;busy=true;try{if(!prepared.view.actions.some(x=>x.id===a.id))throw Error('盤面が更新されました。選び直してください。');ui.state=adapter.dispatch(runtime,ui.engine,prepared,a.id,refs);ui._resetActionState();error='';}catch(e){error=root.MushijingiUiPresenter.safeErrorMessage(e);}finally{busy=false;ui.render();}}});
 }
 const render=ui.render;ui.render=function(){render.apply(ui,arguments);show();};
 const begin=ui._beginNewGame;ui._beginNewGame=function(){started=false;visible();const result=begin.apply(ui,arguments);started=ui.cpuMode;snapshot=null;error='';if(ui.cpuRunner){const log=ui.cpuRunner.onActionLog;ui.cpuRunner.onActionLog=function(message){log(message);if(/失敗|安全停止/.test(message)){error=message;notice.textContent=message;}};}show();return result;};
 for(const name of ['_openDeckSelect','showModeSelect','startVsHuman','startTutorial']){const original=ui[name];ui[name]=function(){started=false;visible();return original.apply(ui,arguments);};}
 root.MushiCpuBattle={refresh:()=>ui.render(),useLegacy(value){useB=!value;visible();ui.render();},get active(){return active();}};
 show();
 }if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();})(window);
