(function () {
  'use strict';
  var core=window.MushijingiToolboxCore, catalog=window.MushijingiRegistryCatalog;
  var runtime=window.MushijingiDeckRuntime, presenter=window.MushijingiUiPresenter;
  var cards=[], byId=Object.create(null), store, el={}, selected=null, toastTimer, dirty=false;
  function esc(v) { return String(v==null?'-':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function label(v,kind) { return presenter.label(v,kind); }
  function id() { return 'deck:toolbox:'+Date.now().toString(36)+Math.floor(Math.random()*1679616).toString(36).padStart(4,'0'); }
  function makeDeck() { return core.createDeck({deckId:id(),deckName:core.DEFAULT_DECK_NAME,cardDataVersion:'card-registry/1',rulesetId:'ruleset:standard:v1'}); }
  function active() { return store.decks.find(function(d){return d.deckId===store.activeDeckId;})||null; }
  function ensure() { var d=active();if(d)return d;d=makeDeck();store.decks.push(d);store.activeDeckId=d.deckId;return d; }
  function replace(d) { store.decks=store.decks.map(function(x){return x.deckId===d.deckId?d:x;});dirty=true; }
  function notify(message) {
    el.message.textContent=message; el.toast.textContent=message; el.toast.hidden=false;
    var feedback=document.getElementById('detail-feedback'); if(feedback)feedback.textContent=message;
    clearTimeout(toastTimer);toastTimer=setTimeout(function(){el.toast.hidden=true;},3200);
  }
  function currentFilters() { return {query:el.search.value,set:el.set.value,type:el.type.value,color:el.color.value,cost:el.cost.value,rarity:el.rarity.value,implementationStatusGroup:el.status.value}; }
  function total(deck) { return (deck.cards||[]).reduce(function(n,x){return n+x.quantity;},0); }
  function copies(c) { return ensure().cards.reduce(function(n,x){return n+(byId[x.canonicalCardId]&&byId[x.canonicalCardId].name===c.name?x.quantity:0);},0); }
  function cardRow(c) {
    var count=copies(c);
    return '<article class="card-row color-'+esc(String(c.color||'unknown').toLowerCase())+'"><button type="button" class="card-open" data-card-id="'+esc(c.cardId)+'" aria-label="'+esc(c.name)+'の詳細"><span class="catalog-art" data-art="'+esc(c.cardId)+'"></span><span class="card-number">'+esc(label(c.set,'set'))+' · '+esc(c.officialNumber)+'</span><span class="card-name">'+esc(c.name)+'</span><span class="card-facts"><span>'+esc(label(c.type))+(c.cost!=null?' · コスト '+esc(c.cost):'')+'</span><span class="availability '+(c.playable?'playable':'')+'">'+(c.playable?'対戦対応':'閲覧用')+'</span></span></button><button type="button" class="card-add" data-add="'+esc(c.cardId)+'" aria-label="'+esc(c.name)+'をデッキに追加">'+(count?count+'枚 採用中 · ＋':'＋ デッキに追加')+'</button></article>';
  }
  function mountArt(scope) { scope.querySelectorAll('[data-art]').forEach(function(node){var c=byId[node.dataset.art];if(c)node.appendChild(window.MushiCardVisuals.create(c,{decorative:true}));}); }
  function renderCards() {
    var found=core.buildCatalogView(cards,currentFilters(),el.sort.value,presenter.statusGroup);
    el.count.textContent=found.length+' / '+cards.length+'種';el.empty.hidden=!!found.length;el.list.innerHTML=found.map(cardRow).join('');mountArt(el.list);
    el.list.querySelectorAll('[data-card-id]').forEach(function(b){b.onclick=function(){detail(b.dataset.cardId);};});
    el.list.querySelectorAll('[data-add]').forEach(function(b){b.onclick=function(){add(b.dataset.add);};});
    var n=[el.set,el.type,el.color,el.cost,el.rarity,el.status].filter(function(x){return x.value;}).length;
    document.getElementById('filter-summary').textContent=n?n+'条件で絞り込み':'すべてのカード';
  }
  function section(title,body) { return body?'<section class="detail-section"><h3>'+esc(title)+'</h3>'+body+'</section>':''; }
  function namedEntries(items,showAp) { return(items||[]).map(function(item){var ap=showAp&&item.ap!=null?'（AP '+esc(item.ap)+'）':'';return'<div class="detail-entry"><strong>'+esc(item.name)+ap+'</strong>'+(item.text?'<p>'+esc(item.text)+'</p>':'')+'</div>';}).join(''); }
  function textEntries(items) { return(items||[]).map(function(text){return'<p class="detail-effect-text">'+esc(text)+'</p>';}).join(''); }
  function detail(cardId) {
    var c=byId[cardId];if(!c)return;selected=cardId;var d=presenter.presentCardDetail(c,window.CardEffectFormatter);
    el.detailContent.innerHTML='<div class="observation-card" data-art="'+esc(cardId)+'"></div><header class="detail-title-block"><p>'+esc(c.officialNumber)+' / '+esc(label(c.set,'set'))+'</p><h2 id="detail-title">'+esc(c.name)+'</h2><p class="detail-readiness">'+(c.playable?'対戦で使用できます':'図鑑で閲覧できます。このカードの対戦処理は未対応です。')+'</p></header><p id="detail-feedback" role="status" aria-live="polite"></p><div class="detail-basics">'+d.basics.map(function(item){return'<div><span>'+esc(item.label)+'</span>'+esc(item.value)+'</div>';}).join('')+'</div>'+section('技',namedEntries(d.skills,true))+section('特性',namedEntries(d.traits,false))+section(c.type==='INSECT'?'その他の効果':'効果',textEntries(d.effects))+section('裁定',textEntries(d.rulings));
    mountArt(el.detailContent);el.detailContent.scrollTop=0;el.detail.showModal();
  }
  function updateCounts() { el.list.querySelectorAll('[data-add]').forEach(function(b){var n=copies(byId[b.dataset.add]);b.textContent=n?n+'枚 採用中 · ＋':'＋ デッキに追加';}); }
  function add(cardId) {
    var c=byId[cardId],d=ensure();if(!c)return;
    if(total(d)>=20){notify('20枚に達しています。デッキからカードを減らしてください。');return;}
    if(copies(c)>=2){notify('同名カードは合計2枚までです。');return;}
    replace(core.addCatalogCard(d,c));renderDeck();updateCounts();notify(c.name+'を追加しました · '+total(active())+' / 20枚（保存前）');
  }
  function deckEntry(x) {
    var c=byId[x.canonicalCardId];
    return '<article class="deck-entry"><button class="deck-thumbnail" data-detail="'+esc(x.canonicalCardId)+'" aria-label="'+esc(c?c.name:'不明なカード')+'の詳細"><span data-art="'+esc(x.canonicalCardId)+'"></span></button><div class="deck-entry-info"><strong>'+esc(c?c.name:'不明なカード')+'</strong><small>'+esc(c?(c.cost!=null?'コスト '+c.cost+' · ':'')+label(c.type):'カード情報を確認できません')+'</small>'+(c&&!c.playable?'<small class="data-warning">対戦未対応</small>':'')+'</div><div class="quantity-controls"><button data-dec="'+esc(x.printingId)+'" aria-label="'+esc(c?c.name:'カード')+'を1枚減らす">−</button><b>'+x.quantity+'</b><button data-inc="'+esc(x.canonicalCardId)+'" aria-label="'+esc(c?c.name:'カード')+'を1枚増やす">＋</button></div><button class="remove-card" data-remove="'+esc(x.printingId)+'" aria-label="'+esc(c?c.name:'カード')+'をすべて削除">削除</button></article>';
  }
  function renderDeck() {
    var d=ensure(),v=core.validateDeck(d,cards);
    el.selector.innerHTML=store.decks.map(function(x){return'<option value="'+esc(x.deckId)+'">'+esc(x.deckName)+'</option>';}).join('');el.selector.value=d.deckId;el.name.value=d.deckName;
    el.deckTotal.textContent=v.totalCards+' / 20';el.navTotal.textContent=v.totalCards;el.entryCount.textContent=d.cards.length+'種類';
    document.getElementById('catalog-deck-name').textContent=d.deckName;document.getElementById('catalog-deck-count').textContent=v.totalCards+' / 20';
    el.emptyDeck.hidden=!!d.cards.length;el.deckList.innerHTML=d.cards.map(deckEntry).join('');mountArt(el.deckList);
    var types={INSECT:0,SPELL:0,ENHANCEMENT:0},curve=[0,0,0,0,0,0,0,0];
    d.cards.forEach(function(x){var c=byId[x.canonicalCardId];if(c){types[c.type]=(types[c.type]||0)+x.quantity;if(c.cost!=null)curve[Math.min(7,c.cost)]+=x.quantity;}});
    el.deckStats.innerHTML=Object.keys(types).map(function(t){return'<div><strong>'+types[t]+'</strong><span>'+esc(label(t))+'</span></div>';}).join('');
    el.costStats.innerHTML='<div class="cost-curve" aria-label="コスト別枚数">'+curve.map(function(n,i){return'<div aria-label="コスト'+i+(i===7?'以上':'')+' '+n+'枚"><span>'+n+'</span><i style="height:'+Math.max(3,n*5)+'px"></i><small>'+i+(i===7?'+':'')+'</small></div>';}).join('')+'</div><p class="deck-validation '+(v.battleReady?'ready':'')+'">'+esc(v.battleReady?'準備完了。この20枚で対戦できます。':v.errors.concat(v.warnings).join(' '))+'</p>';
    el.battle.disabled=!v.battleReady;
    el.deckList.querySelectorAll('[data-detail]').forEach(function(b){b.onclick=function(){detail(b.dataset.detail);};});
    el.deckList.querySelectorAll('[data-inc]').forEach(function(b){b.onclick=function(){add(b.dataset.inc);};});
    el.deckList.querySelectorAll('[data-dec]').forEach(function(b){b.onclick=function(){replace(core.decrementCard(active(),b.dataset.dec));renderDeck();updateCounts();notify('カードを1枚減らしました（保存前）');};});
    el.deckList.querySelectorAll('[data-remove]').forEach(function(b){b.onclick=function(){replace(core.removeCard(active(),b.dataset.remove));renderDeck();updateCounts();notify('カードをデッキから外しました（保存前）');};});
  }
  function persist(msg) {
    try{localStorage.setItem(core.DECK_STORAGE_KEY,core.serializeDeckStore(store));dirty=false;notify(msg);return true;}
    catch(e){if(window.console&&console.error)console.error('Deck storage failed',e);notify('保存できませんでした。空き容量やブラウザの保存設定を確認して、もう一度お試しください。');return false;}
  }
  function save(){var d=core.buildDeckFormat(core.renameDeck(ensure(),el.name.value));replace(d);var ok=persist('「'+d.deckName+'」を保存しました。');renderDeck();return ok;}
  function view(name) {
    el.cardsView.hidden=name!=='cards';el.decksView.hidden=name!=='decks';
    document.querySelectorAll('.app-nav [data-view]').forEach(function(b){var on=b.dataset.view===name;b.classList.toggle('active',on);if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
    document.getElementById('collection-title').textContent=name==='decks'?'わたしのデッキ':'蟲の図鑑';
    document.getElementById('collection-subtitle').textContent=name==='decks'?'20枚に込める、あなただけの戦略。':'一匹ずつ知る。自分だけの組み合わせを見つける。';
    if(name==='decks')renderDeck();else updateCounts();history.replaceState(null,'','#'+name);window.scrollTo(0,0);
  }
  function options() {
    var values=core.deriveFilterOptions(cards);
    ['set','type','color','cost','rarity'].forEach(function(k){values[k].forEach(function(v){var o=document.createElement('option');o.value=v;o.textContent=label(v,k);el[k].appendChild(o);});});
    var seen=Object.create(null);values.implementationStatus.forEach(function(v){var group=presenter.statusGroup(v);if(seen[group])return;seen[group]=true;var o=document.createElement('option');o.value=group;o.textContent=label(v,'implementationStatus');el.status.appendChild(o);});
  }
  function bind() {
    [el.search,el.set,el.type,el.color,el.cost,el.rarity,el.status,el.sort].forEach(function(x){x.addEventListener(x===el.search?'input':'change',renderCards);});
    el.clear.onclick=function(){[el.search,el.set,el.type,el.color,el.cost,el.rarity,el.status].forEach(function(x){x.value='';});el.sort.value='officialNumber';renderCards();};
    el.close.onclick=function(){el.detail.close();};el.detailAdd.onclick=function(){add(selected);};el.save.onclick=save;
    el.detail.addEventListener('click',function(e){if(e.target===el.detail){var r=el.detail.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)el.detail.close();}});
    el.duplicate.onclick=function(){var d=core.duplicateDeck(ensure(),{deckId:id()});store.decks.push(d);store.activeDeckId=d.deckId;persist('デッキを複製しました。');renderDeck();updateCounts();};
    el.newDeck.onclick=function(){var d=makeDeck();store.decks.push(d);store.activeDeckId=d.deckId;dirty=true;renderDeck();updateCounts();notify('新しいデッキを作成しました。図鑑からカードを選びましょう。');};
    el.deleteDeck.onclick=function(){var d=active();if(!d||!confirm('「'+d.deckName+'」を削除しますか？'))return;store.decks=store.decks.filter(function(x){return x.deckId!==d.deckId;});store.activeDeckId=store.decks[0]?store.decks[0].deckId:null;ensure();persist('デッキを削除しました。');renderDeck();updateCounts();};
    el.battle.onclick=function(){if(!save())return;sessionStorage.setItem(runtime.HANDOFF_KEY,active().deckId);location.href='index.html?deck='+encodeURIComponent(active().deckId);};
    el.selector.onchange=function(){store.activeDeckId=el.selector.value;renderDeck();updateCounts();};el.name.oninput=function(){replace(core.renameDeck(active(),el.name.value));};
    document.querySelectorAll('[data-view]').forEach(function(b){b.onclick=function(){view(b.dataset.view);};});
    window.addEventListener('beforeunload',function(e){if(dirty){e.preventDefault();e.returnValue='';}});
  }
  function init() {
    var m={search:'search-input',set:'set-filter',type:'type-filter',color:'color-filter',cost:'cost-filter',rarity:'rarity-filter',status:'status-filter',sort:'sort-select',clear:'clear-filters',count:'result-count',list:'card-list',empty:'empty-message',detail:'card-detail',close:'close-detail',detailAdd:'detail-add',detailContent:'detail-content',cardsView:'cards-view',decksView:'decks-view',selector:'deck-selector',name:'deck-name',save:'save-deck',duplicate:'duplicate-deck',newDeck:'new-deck',deleteDeck:'delete-deck',battle:'battle-deck',message:'storage-message',deckTotal:'deck-total',navTotal:'nav-deck-total',deckStats:'deck-stats',costStats:'cost-stats',entryCount:'deck-entry-count',emptyDeck:'empty-deck-message',deckList:'deck-list',toast:'collection-toast'};
    Object.keys(m).forEach(function(k){el[k]=document.getElementById(m[k]);});
    try{cards=catalog.fromRegistry(window.cardRegistry);cards.forEach(function(c){byId[c.cardId]=c;});
      try{store=core.parseDeckStore(localStorage.getItem(core.DECK_STORAGE_KEY));}catch(e){store=core.parseDeckStore(null);store.recoveryWarning='保存データを読み込めません。ブラウザの保存設定を確認してください。';}
      ensure();options();bind();el.list.setAttribute('aria-busy','false');renderCards();renderDeck();
      var edit=new URLSearchParams(location.search).get('edit');if(edit&&store.decks.some(function(d){return d.deckId===edit;})){store.activeDeckId=edit;view('decks');}else if(location.hash==='#decks')view('decks');if(store.recoveryWarning)notify(store.recoveryWarning);
    }catch(e){var error=document.getElementById('load-error');error.hidden=false;error.textContent='カード情報を読み込めませんでした。ページを再読み込みしてください。';el.list.setAttribute('aria-busy','false');console.error(e);}
  }
  document.addEventListener('DOMContentLoaded',init);
}());
