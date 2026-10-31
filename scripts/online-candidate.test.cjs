const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {build}=require('./build-online-candidate.cjs');
test('public candidate contains matched contracts and browser assets, excludes infrastructure and refuses overwrite',()=>{
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'mushi-release-test-')),out=path.join(parent,'candidate');
 try{const manifest=build(out);const names=manifest.files.map(f=>f.path);assert(names.includes('online-b.html'));assert(names.includes('toolbox.html'));assert(names.includes('battle-ui/board.js'));assert(!names.some(n=>/^(server|docs|tests|\.ai-worker)\//.test(n)));assert(!names.some(n=>/\.local\.|token|credential|trial\.cjs/.test(n)));
 const config=JSON.parse(fs.readFileSync(path.join(out,'site/online/config.json')));assert.equal(config.productionEnabled,true);assert.equal(config.productionEndpoint,'wss://banked-outgrow-parakeet.ngrok-free.dev/ws');
 const html=fs.readFileSync(path.join(out,'site/online-b.html'),'utf8');assert(manifest.assetVersion);assert([...html.matchAll(/(?:src|href)="([^"?#]+\.(?:js|css))([^\"]*)"/g)].every(m=>m[2]==='?v='+manifest.assetVersion),'one release version prevents stale cached UI/card scripts');
 assert.deepEqual(JSON.parse(fs.readFileSync(path.join(out,'site/online/contract.json'))),require('../server/lib/runtime.cjs').VERSIONS);
 assert.equal(manifest.runtime.catalogCount,565);assert.throws(()=>build(out),/EXISTS/);
 assert(!fs.existsSync(path.join(out,'site/.nojekyll')));assert(fs.readFileSync(path.join(out,'site/_config.yml'),'utf8').includes('  - server\n'));
 }finally{assert.equal(path.dirname(parent),path.resolve(os.tmpdir()));assert(path.basename(parent).startsWith('mushi-release-test-'));fs.rmSync(parent,{recursive:true,force:true});}
});
