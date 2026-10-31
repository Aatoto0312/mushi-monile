'use strict';
// HTTPS Pages URL is fulfilled locally; the WSS constructor is mocked. No public connection.
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {build}=require('../../scripts/build-online-candidate.cjs'),{VERSIONS}=require('../lib/runtime.cjs');const pw=require(process.env.MUSHI_PLAYWRIGHT_PATH||'playwright');
for(const engine of ['chromium','webkit'])test(engine+' Pages HTTPS origin selects configured WSS and ignores URL endpoint overrides',async t=>{
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'mushi-pages-config-'));t.after(()=>{assert.equal(path.dirname(parent),path.resolve(os.tmpdir()));assert(path.basename(parent).startsWith('mushi-pages-config-'));fs.rmSync(parent,{recursive:true,force:true});});
 const candidate=path.join(parent,'candidate'),manifest=build(candidate),allowed=new Set(manifest.files.map(f=>f.path));
 const browser=await pw[engine].launch(engine==='chromium'?{channel:'msedge'}:{});t.after(()=>browser.close());const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://aatoto0312.github.io/mushi-monile/**',async route=>{const name=new URL(route.request().url()).pathname.slice('/mushi-monile/'.length);if(!allowed.has(name))return route.fulfill({status:404,body:''});const mime={'.js':'text/javascript','.html':'text/html','.json':'application/json','.css':'text/css','.png':'image/png'};return route.fulfill({status:200,contentType:mime[path.extname(name)]||'application/octet-stream',body:fs.readFileSync(path.join(candidate,'site',name))});});
 await page.addInitScript(versions=>{window.opened=[];window.WebSocket=class{constructor(url,protocol){opened.push({url,protocol});setTimeout(()=>this.onmessage?.({data:JSON.stringify({type:'HELLO',versions,bootId:'fixture',presets:[],playableIds:[]})}),0);}send(){}close(){}};},VERSIONS);
 await page.goto('https://aatoto0312.github.io/mushi-monile/online-b.html?endpoint=wss://foreign.example/ws');await page.waitForFunction(()=>!document.querySelector('#create').disabled);
 assert.deepEqual(await page.evaluate(()=>opened),[{url:'wss://banked-outgrow-parakeet.ngrok-free.dev/ws',protocol:'mushi-online-v1'}]);assert.deepEqual(errors,[]);
});
