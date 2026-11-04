'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const {ROOT,VERSIONS,createRuntime}=require('../server/lib/runtime.cjs');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
// Release cache tag: bump for the next public release, together with Toolbox's tag.
const ASSET_VERSION='monochrome-444-v1';
function versioned(url){if(/^(?:[a-z]+:|\/\/|#)/i.test(url))return url;const [base,fragment]=url.split('#'),[name,query]=base.split('?');if(!/\.(?:js|css|png|jpe?g|svg|webp|ico|woff2)$/.test(name))return url;const params=new URLSearchParams(query);params.set('v',ASSET_VERSION);return name+'?'+params+(fragment?'#'+fragment:'');}
const explicit=['index.html','toolbox.html','online.html','online-b.html','online/client.js','online/online.css','online/battle-b-adapter.js','online/config.json','online/contract.json','battle-ui/board.js','battle-ui/presentation.js','battle-ui/board.css','battle-ui/engine-view.js','battle-ui/cpu-adapter.js','battle-ui/cpu-controller.js','battle-ui/cpu.css','prototype-b/style.css','prototype-b/base.css','prototype-b/forest.png'];
function filesIn(dir){const base=path.join(ROOT,dir);if(!fs.existsSync(base))return [];return fs.readdirSync(base,{withFileTypes:true}).flatMap(e=>{const relative=dir+'/'+e.name;if(e.isSymbolicLink())throw Error('SYMLINK_REFUSED');if(e.name.startsWith('.'))return [];if(e.isDirectory())return filesIn(relative);return /\.(js|css|json|png|jpe?g|webp|svg|ico|woff2)$/.test(e.name)&&!/(?:\.local\.|\.test\.|credential|authtoken)/i.test(e.name)?[relative]:[];});}
function git(args){return execFileSync('git',args,{cwd:ROOT,stdio:['ignore','pipe','pipe']});}
function build(out){
 out=path.resolve(out);if(out===ROOT||out.startsWith(ROOT+path.sep))throw Error('OUTPUT_MUST_BE_OUTSIDE_REPOSITORY');if(fs.existsSync(out))throw Error('OUTPUT_EXISTS');
 const config=JSON.parse(fs.readFileSync(path.join(ROOT,'online/config.json'))),plan=JSON.parse(fs.readFileSync(path.join(ROOT,'server/ngrok-plan.json')));
 if(config.productionEndpoint!=='wss://'+plan.hostname+'/ws'||!config.allowedProductionHosts.includes(plan.hostname))throw Error('ENDPOINT_PLAN_MISMATCH');
 const files=[...new Set([...explicit,...['js','css','shared','toolbox','assets'].flatMap(filesIn)])].sort();
 for(const file of files){const stat=fs.lstatSync(path.join(ROOT,file));if(stat.isSymbolicLink()||!stat.isFile())throw Error('MISSING_BROWSER_ASSET');}
 fs.mkdirSync(path.join(out,'site'),{recursive:true});
 const manifest={createdAt:new Date().toISOString(),assetVersion:ASSET_VERSION,sourceHead:git(['rev-parse','HEAD']).toString().trim(),mainHead:git(['rev-parse','main']).toString().trim(),versions:VERSIONS,runtime:createRuntime().meta,files:[],forbiddenRoots:['server/','docs/','tests/','.ai-worker/']};
 for(const file of files){
  let data=fs.readFileSync(path.join(ROOT,file));
  if(file==='online/config.json')data=Buffer.from(JSON.stringify({...config,productionEnabled:true},null,2)+'\n');
  if(file==='online/contract.json')data=Buffer.from(JSON.stringify(VERSIONS,null,2)+'\n');
  // Match text assets published by Git rather than Windows checkout CRLF bytes.
  if(/\.(?:html|js|css|json)$/.test(file))data=Buffer.from(data.toString('utf8').replace(/\r\n/g,'\n'));
  if(file.endsWith('.html'))data=Buffer.from(data.toString().replace(/((?:src|href)=["'])([^"']+)(["'])/g,(_,a,url,b)=>a+versioned(url)+b));
  if(file.endsWith('.css'))data=Buffer.from(data.toString().replace(/url\((["']?)([^"')]+)\1\)/g,(_,quote,url)=>'url('+quote+versioned(url)+quote+')'));
  let main='added';try{main=hash(git(['show','main:'+file]))===hash(data)?'unchanged':'modified';}catch{}
  const dest=path.join(out,'site',file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,data,{flag:'wx'});manifest.files.push({path:file,bytes:data.length,sha256:hash(data),main});
 }
 // Keep the existing legacy Pages/Jekyll build and exclude non-site repository roots.
 const pagesConfig=fs.readFileSync(path.join(ROOT,'_config.yml'),'utf8').replace(/\r\n/g,'\n');
 fs.writeFileSync(path.join(out,'site/_config.yml'),pagesConfig);manifest.files.push({path:'_config.yml',bytes:Buffer.byteLength(pagesConfig),sha256:hash(pagesConfig),main:'generated',kind:'pages-build-config'});
 fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');return manifest;
}
if(require.main===module){const index=process.argv.indexOf('--out');if(index<0||!process.argv[index+1])throw Error('USE --out NEW_DIRECTORY');const m=build(process.argv[index+1]);console.log(JSON.stringify({files:m.files.length,catalog:m.runtime.catalogCount,playable:m.runtime.playableCount,sourceHead:m.sourceHead}));}
module.exports={build};
