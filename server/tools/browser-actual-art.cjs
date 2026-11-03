'use strict';
// Test transport only: retain actual publisher-card scans, never placeholder art.
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const pattern=/^https:\/\/mushijingi\.com\/images\/card\/\d+\.jpg(?:\?[^#]*)?$/;
function createActualArtCache(fetcher=fetch){
 const cache=new Map(),receipts=new Map(),errors=[];
 async function get(url){
  if(!pattern.test(url))throw Error('ART_SOURCE_NOT_ALLOWED');
  const key=new URL(url).origin+new URL(url).pathname;
  if(!cache.has(key))cache.set(key,(async()=>{const response=await fetcher(key,{signal:AbortSignal.timeout(15000)});if(response.status!==200)throw Error('ART_HTTP_'+response.status);const bytes=Buffer.from(await response.arrayBuffer());if(bytes.length<4||bytes[0]!==255||bytes[1]!==216||bytes[2]!==255)throw Error('ART_NOT_JPEG');receipts.set(key,{url:key,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});return bytes;})());
  return cache.get(key);
 }
 async function install(page,t){
  await page.route(pattern,async route=>{try{await route.fulfill({status:200,contentType:'image/jpeg',body:await get(route.request().url())});}catch(error){errors.push(error.message);await route.abort('failed');}});
  t.after(()=>{assert.deepEqual(errors,[],'actual card art downloads must succeed; no fallback images');t.diagnostic(JSON.stringify({actualArtSources:receipts.size,actualArtBytes:[...receipts.values()].reduce((n,r)=>n+r.bytes,0)}));});
 }
 return {get,install,receipts,errors};
}
const cache=createActualArtCache();module.exports={createActualArtCache,installActualArt:cache.install};
