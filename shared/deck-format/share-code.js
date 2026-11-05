/* MJD1: ASCII ID front coding + quantity bytes, CRC32, unpadded base64url.
 * Only card composition travels; catalog order and deck metadata are irrelevant.
 * CRC detects accidental corruption, not authenticity or ownership.
 */
(function(root,factory){'use strict';var api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.MushijingiDeckShare=api;}(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function fail(text){throw new Error(text);}
  function crc(bytes){var n=0xffffffff;bytes.forEach(function(b){n^=b;for(var k=0;k<8;k++)n=(n>>>1)^((n&1)?0xedb88320:0);});return(n^0xffffffff)>>>0;}
  function validate(entries,catalog){
    if(!Array.isArray(entries)||!entries.length||entries.length>40)fail('デッキは20枚必要です。');
    var byId=Object.create(null),totals=Object.create(null),names=Object.create(null),sum=0;
    (catalog||[]).forEach(function(c){byId[c.cardId]=c;});
    entries.forEach(function(e){if(!e||typeof e.canonicalCardId!=='string'||!/^[A-Za-z0-9_:-]{1,96}$/.test(e.canonicalCardId))fail('カードIDの形式が不正です。');var c=byId[e.canonicalCardId];if(!c)fail('不明なカードIDです：'+e.canonicalCardId);if(!Number.isInteger(e.quantity)||e.quantity<1||e.quantity>2)fail('カードの枚数は1枚または2枚で指定してください。');totals[c.cardId]=(totals[c.cardId]||0)+e.quantity;names[c.name]=(names[c.name]||0)+e.quantity;sum+=e.quantity;});
    Object.keys(names).forEach(function(n){if(names[n]>2)fail(n+'は同名合計2枚までです。');});
    if(sum!==20)fail('デッキは20枚必要です（現在'+sum+'枚）。');
    return Object.keys(totals).sort().map(function(id){return{canonicalCardId:id,quantity:totals[id]};});
  }
  function base64(bytes){return btoa(String.fromCharCode.apply(null,bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
  function encode(deck,catalog){
    var entries=validate(deck&&deck.cards,catalog),bytes=[entries.length],previous='';
    entries.forEach(function(e){var id=e.canonicalCardId,prefix=0;while(prefix<id.length&&prefix<previous.length&&id[prefix]===previous[prefix])prefix++;var tail=id.slice(prefix);bytes.push(prefix,tail.length);for(var i=0;i<tail.length;i++)bytes.push(tail.charCodeAt(i));bytes.push(e.quantity);previous=id;});
    var check=crc(bytes);bytes.push(check>>>24,(check>>>16)&255,(check>>>8)&255,check&255);return'MJD1.'+base64(bytes);
  }
  function decode(code,catalog){
    if(typeof code!=='string'||code.length>4096)fail('共有コードが長すぎるか、形式が不正です。');code=code.trim();
    if(!code.startsWith('MJD1.'))fail('未対応の共有コード形式です。MJD1のコードを入力してください。');
    var body=code.slice(5);if(!/^[A-Za-z0-9_-]{8,2800}$/.test(body)||body.length%4===1)fail('共有コードの形式が不正です。');
    var bytes;try{bytes=Array.from(atob(body.replace(/-/g,'+').replace(/_/g,'/')),function(c){return c.charCodeAt(0);});}catch(e){fail('共有コードの形式が不正です。');}
    if(base64(bytes)!==body||bytes.length<5||bytes.length>2048)fail('共有コードの形式が不正です。');
    var data=bytes.slice(0,-4),end=bytes.slice(-4),expected=((end[0]<<24)|(end[1]<<16)|(end[2]<<8)|end[3])>>>0;if(crc(data)!==expected)fail('共有コードが破損しています。コピーし直してください。');
    var offset=0,count=data[offset++],previous='',entries=[];if(count<1||count>20)fail('デッキは20枚必要です。');
    for(var i=0;i<count;i++){var prefix=data[offset++],length=data[offset++];if(prefix===undefined||length===undefined||prefix>previous.length||!length||prefix+length>96||offset+length>=data.length)fail('共有コードの形式が不正です。');var id=previous.slice(0,prefix)+String.fromCharCode.apply(null,data.slice(offset,offset+length));offset+=length;if(id<=previous)fail('共有コードの形式が不正です。');entries.push({canonicalCardId:id,quantity:data[offset++]});previous=id;}
    if(offset!==data.length)fail('共有コードの形式が不正です。');return{cards:validate(entries,catalog)};
  }
  return Object.freeze({encode:encode,decode:decode});
}));
