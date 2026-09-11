(function () {
  'use strict';
  var core = window.MushijingiToolboxCore;
  var allCards = [], byPrinting = Object.create(null), elements = {}, selectedCardId = null;
  var store = core.parseDeckStore(null);
  var TYPES = { INSECT: '虫', SPELL: '術', ENHANCEMENT: '強化' };
  var COLORS = { RED: '赤', BLUE: '青', GREEN: '緑' };

  function esc(value) { return String(value).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function field(state, labels) {
    var shown = core.displayFieldState(state);
    if (shown.state === 'known' && labels && labels[shown.text]) { shown.text = labels[shown.text]; }
    return '<span class="field-state state-' + esc(shown.state) + '">' + esc(shown.text) + '</span>';
  }
  function ref(card) { return { printingId: card.printing.printingId, canonicalCardId: card.canonicalCardId }; }
  function cardHtml(card) {
    var color = core.displayFieldState(card.rules.color);
    var colorClass = color.state === 'known' ? ' color-' + color.text.toLowerCase() : ' color-unknown';
    return '<article class="card-row' + colorClass + '"><button class="card-open" type="button" data-card-id="' + esc(card.canonicalCardId) + '">' +
      '<span class="card-number">' + field(card.printing.officialNumberDisplay) + '</span><span class="card-name">' + esc(card.canonicalName) +
      '</span><span class="card-id">' + esc(card.canonicalCardId) + '</span><span class="card-facts"><span>' + field(card.rules.type,TYPES) +
      '</span><span>' + field(card.rules.color,COLORS) + '</span><span>Cost ' + field(card.rules.cost) + '</span><span>HP ' + field(card.rules.baseHp) +
      '</span><span>Rare ' + field(card.printing.rarity) + '</span></span></button><button class="card-add" type="button" data-add="' +
      esc(card.printing.printingId) + '" aria-label="' + esc(card.canonicalName) + 'をデッキに追加">＋ デッキ</button></article>';
  }
  function filters() { return { query: elements.search.value, type: elements.type.value, color: elements.color.value, cost: elements.cost.value }; }
  function renderCards() {
    var cards = core.filterCards(allCards, filters());
    elements.count.textContent = cards.length + '件 / 24件'; elements.empty.hidden = cards.length !== 0;
    elements.list.innerHTML = cards.map(cardHtml).join('');
    elements.list.querySelectorAll('[data-card-id]').forEach(function (b) { b.onclick = function () { openDetail(b.dataset.cardId); }; });
    elements.list.querySelectorAll('[data-add]').forEach(function (b) { b.onclick = function () { addPrinting(b.dataset.add); }; });
  }
  function structured(value) {
    if (value === null || value === undefined) { return '-'; }
    if (typeof value !== 'object') { return esc(value); }
    if (Array.isArray(value)) { return value.length ? '<ol class="structured-list">' + value.map(function(x){return '<li>'+structured(x)+'</li>';}).join('') + '</ol>' : '<span class="empty-value">該当データなし</span>'; }
    if (value.state) { return field(value); }
    return '<dl class="structured-object">' + Object.keys(value).map(function(k){return '<div><dt>'+esc(k)+'</dt><dd>'+structured(value[k])+'</dd></div>';}).join('') + '</dl>';
  }
  function section(title,value) { return '<section class="detail-section"><h3>'+esc(title)+'</h3>'+structured(value)+'</section>'; }
  function verifications(items) {
    return items.length ? items.map(function(v){return '<details class="verification"><summary><span class="verification-label status-'+esc(v.status.toLowerCase())+'">'+esc(core.verificationLabel(v.status))+'</span> <code>'+esc(v.fieldPath)+'</code></summary>'+section('出典',v.sourceRefs||[])+section('注記',v.notes||[])+'</details>';}).join('') : '<p class="empty-value">未確認</p>';
  }
  function openDetail(id) {
    var card = allCards.find(function(x){return x.canonicalCardId===id;}); if (!card) { return; } selectedCardId=id;
    elements.detailContent.innerHTML='<header class="detail-title-block"><p>'+field(card.printing.officialNumberDisplay)+'</p><h2 id="detail-title">'+esc(card.canonicalName)+'</h2><code>'+esc(id)+'</code></header><div class="detail-basics"><div><span>レアリティ</span>'+field(card.printing.rarity)+'</div><div><span>タイプ</span>'+field(card.rules.type,TYPES)+'</div><div><span>色</span>'+field(card.rules.color,COLORS)+'</div><div><span>コスト</span>'+field(card.rules.cost)+'</div><div><span>HP</span>'+field(card.rules.baseHp)+'</div></div>'+section('技',card.rules.skills)+section('特性',card.rules.traits)+section('術の効果',card.rules.spellEffects)+section('強化効果',card.rules.enhancementEffects)+section('常在・誘発効果',card.rules.passiveEffects)+section('タグ',card.tags)+'<section class="detail-section"><h3>検証状態</h3>'+verifications(card.verifications)+'</section>';
    elements.detail.showModal();
  }
  function newId() { return 'deck:toolbox:' + Date.now().toString(36) + Math.floor(Math.random()*1679616).toString(36).padStart(4,'0'); }
  function makeDeck() { return core.createDeck({deckId:newId(),deckName:core.DEFAULT_DECK_NAME,cardDataVersion:window.__toolboxCardDataVersion,rulesetId:'ruleset:starter:v1'}); }
  function active() { return store.decks.find(function(d){return d.deckId===store.activeDeckId;}) || null; }
  function ensureActive() { var d=active(); if(d){return d;} d=makeDeck(); store.decks.push(d); store.activeDeckId=d.deckId; return d; }
  function replace(deck) { store.decks=store.decks.map(function(d){return d.deckId===deck.deckId?deck:d;}); }
  function addPrinting(id) { var card=byPrinting[id]; if(!card){return;} replace(core.addCard(ensureActive(),ref(card))); elements.storageMessage.textContent=card.canonicalName+'を追加しました（保存前）'; renderDeck(); }
  function renderSelector() { elements.deckSelector.innerHTML=store.decks.map(function(d){return '<option value="'+esc(d.deckId)+'">'+esc(d.deckName)+'</option>';}).join(''); elements.deckSelector.value=store.activeDeckId; }
  function renderStats(stats) {
    var rows=[['虫',stats.types.INSECT],['術',stats.types.SPELL],['強化',stats.types.ENHANCEMENT],['赤',stats.colors.RED],['青',stats.colors.BLUE],['緑',stats.colors.GREEN],['色 未確認',stats.colors.unknown]];
    elements.deckStats.innerHTML=rows.map(function(x){return '<div><strong>'+x[1]+'</strong><span>'+x[0]+'</span></div>';}).join('');
    var costs=Object.keys(stats.costs).sort(function(a,b){return Number(a)-Number(b);}); elements.costStats.innerHTML='<strong>コスト分布</strong>'+(costs.length?costs.map(function(c){return '<span>Cost '+esc(c)+': '+stats.costs[c]+'</span>';}).join(''):'<span>カードなし</span>');
  }
  function entryHtml(entry,totals) {
    var card=byPrinting[entry.printingId], name=card?card.canonicalName:entry.canonicalCardId;
    var warning=card&&core.cardHasDataWarning(card)?'<span class="data-warning">未確認情報あり</span>':'';
    var facts=card?field(card.rules.type,TYPES)+' '+field(card.rules.color,COLORS)+' Cost '+field(card.rules.cost):'カードDB未解決';
    return '<article class="deck-entry"><div class="deck-entry-info"><strong>'+esc(name)+'</strong>'+warning+'<small>'+facts+'</small><small>同名合計: '+totals[entry.canonicalCardId]+'枚</small></div><div class="quantity-controls"><button type="button" data-dec="'+esc(entry.printingId)+'">−</button><b>'+entry.quantity+'</b><button type="button" data-inc="'+esc(entry.printingId)+'">＋</button></div><button class="remove-card" type="button" data-remove="'+esc(entry.printingId)+'">削除</button></article>';
  }
  function renderDeck() {
    var deck=ensureActive(), stats=core.calculateDeckStats(deck,allCards), totals=core.aggregateByCanonicalCardId(deck.cards); renderSelector();
    elements.deckName.value=deck.deckName; elements.deckTotal.textContent=stats.total; elements.navDeckTotal.textContent=stats.total; elements.deckEntryCount.textContent=deck.cards.length+'種類'; elements.emptyDeck.hidden=deck.cards.length!==0;
    elements.deckList.innerHTML=deck.cards.map(function(e){return entryHtml(e,totals);}).join(''); renderStats(stats);
    elements.deckList.querySelectorAll('[data-inc]').forEach(function(b){b.onclick=function(){replace(core.incrementCard(active(),b.dataset.inc));renderDeck();};});
    elements.deckList.querySelectorAll('[data-dec]').forEach(function(b){b.onclick=function(){replace(core.decrementCard(active(),b.dataset.dec));renderDeck();};});
    elements.deckList.querySelectorAll('[data-remove]').forEach(function(b){b.onclick=function(){replace(core.removeCard(active(),b.dataset.remove));renderDeck();};});
  }
  function persist(message) { try { localStorage.setItem(core.DECK_STORAGE_KEY,core.serializeDeckStore(store)); elements.storageMessage.textContent=message; } catch(e) { elements.storageMessage.textContent='保存できませんでした。ブラウザの保存設定を確認してください。'; } }
  function save() { var d=core.buildDeckFormat(core.renameDeck(ensureActive(),elements.deckName.value)); replace(d); persist('「'+d.deckName+'」を保存しました'); renderDeck(); }
  function createNew() { var d=makeDeck(); store.decks.push(d); store.activeDeckId=d.deckId; persist('新しいデッキを作成しました'); renderDeck(); }
  function removeDeck() { var d=active(); if(!d||!confirm('「'+d.deckName+'」を削除しますか？')){return;} store.decks=store.decks.filter(function(x){return x.deckId!==d.deckId;}); store.activeDeckId=store.decks.length?store.decks[0].deckId:null; ensureActive(); persist('デッキを削除しました'); renderDeck(); }
  function switchView(view) { elements.cardsView.hidden=view!=='cards'; elements.decksView.hidden=view!=='decks'; document.querySelectorAll('[data-view]').forEach(function(b){var on=b.dataset.view===view;b.classList.toggle('active',on);if(on){b.setAttribute('aria-current','page');}else{b.removeAttribute('aria-current');}}); if(view==='decks'){renderDeck();} scrollTo(0,0); }
  function restore() { try{store=core.parseDeckStore(localStorage.getItem(core.DECK_STORAGE_KEY));}catch(e){store=core.parseDeckStore('{broken');} ensureActive(); if(store.recoveryWarning){elements.storageMessage.textContent=store.recoveryWarning;} }
  function bind() {
    [elements.search,elements.type,elements.color,elements.cost].forEach(function(c){c.addEventListener(c===elements.search?'input':'change',renderCards);});
    elements.clear.onclick=function(){elements.search.value='';elements.type.value='';elements.color.value='';elements.cost.value='';renderCards();}; elements.close.onclick=function(){elements.detail.close();};
    elements.detail.onclick=function(e){if(e.target===elements.detail){elements.detail.close();}}; elements.detailAdd.onclick=function(){var c=allCards.find(function(x){return x.canonicalCardId===selectedCardId;});if(c){addPrinting(c.printing.printingId);}};
    document.querySelectorAll('[data-view]').forEach(function(b){b.onclick=function(){switchView(b.dataset.view);};}); elements.saveDeck.onclick=save; elements.newDeck.onclick=createNew; elements.deleteDeck.onclick=removeDeck;
    elements.deckSelector.onchange=function(){store.activeDeckId=elements.deckSelector.value;renderDeck();}; elements.deckName.oninput=function(){replace(core.renameDeck(active(),elements.deckName.value));elements.storageMessage.textContent='未保存の変更があります';};
  }
  function init() {
    var ids=['search-input','type-filter','color-filter','cost-filter','clear-filters','result-count','card-list','empty-message','load-error','card-detail','close-detail','detail-add','detail-content','cards-view','decks-view','deck-selector','deck-name','save-deck','new-deck','delete-deck','storage-message','deck-total','nav-deck-total','deck-stats','cost-stats','deck-entry-count','empty-deck-message','deck-list'];
    var names=['search','type','color','cost','clear','count','list','empty','error','detail','close','detailAdd','detailContent','cardsView','decksView','deckSelector','deckName','saveDeck','newDeck','deleteDeck','storageMessage','deckTotal','navDeckTotal','deckStats','costStats','deckEntryCount','emptyDeck','deckList']; ids.forEach(function(id,i){elements[names[i]]=document.getElementById(id);}); bind();
    fetch('shared/card-data/starter-v1.json',{cache:'no-store'}).then(function(r){if(!r.ok){throw new Error('HTTP '+r.status);}return r.json();}).then(function(data){window.__toolboxCardDataVersion=data.dataVersion;allCards=core.sortCardsByOfficialNumber(core.buildToolboxCards(data));allCards.forEach(function(c){byPrinting[c.printing.printingId]=c;});restore();elements.list.setAttribute('aria-busy','false');renderCards();renderDeck();}).catch(function(error){elements.list.setAttribute('aria-busy','false');elements.count.textContent='読込失敗';elements.error.hidden=false;elements.error.textContent='共通カードDBを読み込めませんでした。HTTPサーバー経由でtoolbox.htmlを開いてください。 ('+error.message+')';});
  }
  document.addEventListener('DOMContentLoaded',init);
}());
