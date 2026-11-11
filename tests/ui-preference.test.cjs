'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function fixture(search='',saved,blocked=false){
 const values=new Map([['mushijingiToolboxDecksV1','preserve existing decks']]);
 if(saved)values.set('mushijingiBattleUiV1',saved);
 const context={URL,URLSearchParams,location:new URL('https://example.test/mushi-monile/index.html'+search),document:{readyState:'loading',addEventListener(){}},localStorage:{getItem:k=>{if(blocked)throw Error('blocked');return values.get(k)||null;},setItem:(k,v)=>{if(blocked)throw Error('blocked');values.set(k,v);}}};
 context.window=context;context.history={state:{preserved:true},replaceState:(state,title,url)=>{context.location=new URL(url);}};
 vm.runInNewContext(fs.readFileSync('shared/battle-ui-preference.js','utf8'),context);
 return {api:context.MushiBattleUiPreference,context,values};
}
test('explicit old UI URL overrides stored new choice and switching preserves deck query',()=>{
 const f=fixture('?deck=my-deck&battleUi=legacy','new');assert.equal(f.api.read(),'legacy');f.api.choose('new');assert.equal(f.api.read(),'new');assert.equal(f.context.location.searchParams.get('deck'),'my-deck');assert.equal(f.values.get('mushijingiToolboxDecksV1'),'preserve existing decks');assert.equal(f.values.get(f.api.KEY),'new');
});
test('saved old and new choices select existing online entry paths',()=>{
 const f=fixture('','legacy');assert.equal(f.api.read(),'legacy');assert.equal(f.api.onlineUrl('a b'),'online.html?deck=a%20b');f.api.choose('new');assert.equal(f.api.onlineUrl(),'online-b.html');
});
test('unavailable storage still allows explicit old UI and a new UI switch',()=>{
 const f=fixture('?battleUi=legacy',null,true);assert.equal(f.api.read(),'legacy');f.api.choose('new');assert.equal(f.api.read(),'new');
});
