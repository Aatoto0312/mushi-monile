'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawn}=require('node:child_process');
test('Windows job kills owned process when watchdog is forcibly terminated',async()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'mushi-owned-job-')),ready=path.join(root,'pid'),fixture=path.join(root,'child.cjs');fs.writeFileSync(fixture,"require('fs').writeFileSync(process.argv[2],String(process.pid));setInterval(()=>{},1000);");
  const source=path.resolve(__dirname,'../lib/OwnedJob.cs');const quote=s=>"'"+s.replaceAll("'","''")+"'";
  const script=`Add-Type -Path ${quote(source)}; [MushiOwnedJob]::Run(${quote(process.execPath)}, @(${quote(fixture)},${quote(ready)}), ${process.pid}, 10000)`;
  const worker=spawn('powershell.exe',['-NoProfile','-NonInteractive','-Command',script],{windowsHide:true,stdio:'ignore'});let pid;
  try{const deadline=Date.now()+12000;while(!fs.existsSync(ready)&&Date.now()<deadline)await new Promise(r=>setTimeout(r,30));assert(fs.existsSync(ready),'job child must start');pid=Number(fs.readFileSync(ready));worker.kill();await new Promise(r=>worker.once('exit',r));let alive=true;for(let i=0;i<100;i++){try{process.kill(pid,0);}catch{alive=false;break;}await new Promise(r=>setTimeout(r,20));}assert.equal(alive,false,'job child must not outlive killed watchdog');}finally{worker.kill();if(pid)try{process.kill(pid);}catch{}}
});
test('Windows job independently notices guardian death and deadline expiry',async()=>{
  const source=path.resolve(__dirname,'../lib/OwnedJob.cs'),quote=s=>"'"+s.replaceAll("'","''")+"'";
  for(const mode of ['guardian','deadline']){
    const root=fs.mkdtempSync(path.join(os.tmpdir(),'mushi-owned-loss-')),ready=path.join(root,'pid'),workerId=path.join(root,'worker'),fixture=path.join(root,'child.cjs');fs.writeFileSync(fixture,"require('fs').writeFileSync(process.argv[2],String(process.pid));setInterval(()=>{},1000);");
    const script=`Add-Type -Path ${quote(source)}; [MushiOwnedJob]::Run(${quote(process.execPath)}, @(${quote(fixture)},${quote(ready)}), PARENT_ID, ${mode==='deadline'?800:10000})`;
    const code=`const cp=require('child_process'),fs=require('fs');const worker=cp.spawn('powershell.exe',['-NoProfile','-NonInteractive','-Command',${JSON.stringify(script)}.replace('PARENT_ID',String(process.pid))],{windowsHide:true,stdio:'ignore'});fs.writeFileSync(${JSON.stringify(workerId)},String(worker.pid));setInterval(()=>{},1000);`;
    const guardian=spawn(process.execPath,['-e',code],{windowsHide:true,stdio:'ignore'});let pid,worker;
    try{const deadline=Date.now()+12000;while(!fs.existsSync(ready)&&Date.now()<deadline)await new Promise(r=>setTimeout(r,20));assert(fs.existsSync(ready),'owned child must start');pid=Number(fs.readFileSync(ready));worker=Number(fs.readFileSync(workerId));if(mode==='guardian')guardian.kill();let alive=true;for(let i=0;i<150;i++){try{process.kill(pid,0);}catch{alive=false;break;}await new Promise(r=>setTimeout(r,20));}assert.equal(alive,false,mode+' must kill agent independently');}finally{guardian.kill();for(const id of [worker,pid])if(id)try{process.kill(id);}catch{}}
  }
});
