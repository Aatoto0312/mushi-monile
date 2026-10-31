'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawnSync}=require('node:child_process');
test('interactive credential setup avoids Store AppData virtualization',()=>{
  const source=fs.readFileSync(path.resolve(__dirname,'../Configure-NgrokCredential.ps1'),'utf8');
  assert(source.includes("Join-Path $env:USERPROFILE '.mushijingi-online-beta/ngrok'"));
  assert(!source.includes('Join-Path $env:LOCALAPPDATA'));
});
test('ngrok preparation binds the assigned HTTPS name to only the verified loopback API',()=>{
  const {makeEndpointConfig}=require('../lib/ngrok-preparation.cjs'),plan=require('../ngrok-plan.json'),yaml=makeEndpointConfig(plan);
  assert(yaml.includes('version: 3'));assert(yaml.includes('https://banked-outgrow-parakeet.ngrok-free.dev'));assert(yaml.includes('http://127.0.0.1:8787'));assert(!yaml.includes('authtoken'));assert(!/8788|8789|3389/.test(yaml));assert.equal(plan.publicExposureApproved,false);
  const frontend=require('../../online/config.json');assert.equal(frontend.productionEnabled,false);assert.equal(frontend.productionEndpoint,'wss://'+plan.hostname+plan.websocketPath);assert.deepEqual(frontend.allowedProductionHosts,[plan.hostname]);
  for(const patch of [{hostname:'https://evil.invalid'},{hostname:'host\nagent:'},{upstream:'http://127.0.0.1:8789'},{upstream:'http://0.0.0.0:8787'},{endpointName:'bad\nname'}])assert.throws(()=>makeEndpointConfig({...plan,...patch}),/PLAN_INVALID/);
});
test('an empty token is rejected before creating a credential directory',()=>{
  const directory=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'mushi-ngrok-empty-')),'credentials'),modulePath=path.resolve(__dirname,'../lib/NgrokCredential.psm1');
  const script=`$ErrorActionPreference='Stop'; Import-Module '${modulePath.replaceAll("'","''")}' -Force; $secret=New-Object Security.SecureString; try{Save-NgrokCredential -Directory '${directory.replaceAll("'","''")}' -Token $secret -EndpointYaml 'version: 3'; exit 2}catch{exit 0}`;
  const env={...process.env,PSModulePath:path.join(process.env.SystemRoot,'System32/WindowsPowerShell/v1.0/Modules')};
  const result=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',script],{env,encoding:'utf8',windowsHide:true,timeout:15000});assert.equal(result.status,0);assert.equal(fs.existsSync(directory),false);
});
test('pasting the whole setup command is rejected without saving it as a token',()=>{
  const directory=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'mushi-ngrok-command-')),'credentials'),modulePath=path.resolve(__dirname,'../lib/NgrokCredential.psm1');
  const script=`$ErrorActionPreference='Stop'; Import-Module '${modulePath.replaceAll("'","''")}' -Force; $secret=ConvertTo-SecureString 'ngrok config add-authtoken FAKE_COMMAND' -AsPlainText -Force; try{Save-NgrokCredential -Directory '${directory.replaceAll("'","''")}' -Token $secret -EndpointYaml 'version: 3'; exit 2}catch{exit 0}`;
  const env={...process.env,PSModulePath:path.join(process.env.SystemRoot,'System32/WindowsPowerShell/v1.0/Modules')};const result=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',script],{env,encoding:'utf8',windowsHide:true,timeout:15000});assert.equal(result.status,0);assert.equal(fs.existsSync(directory),false);assert(!result.stdout.includes('FAKE_COMMAND'));
});
test('credential helper writes a fake secret only to a new restricted directory without echo or overwrite',()=>{
  const directory=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'mushi-ngrok-')),'credentials');
  const modulePath=path.resolve(__dirname,'../lib/NgrokCredential.psm1');
  const script=`$ErrorActionPreference='Stop'; Import-Module '${modulePath.replaceAll("'","''")}' -Force; $secret=ConvertTo-SecureString 'FAKE_TEST_TOKEN_NOT_A_CREDENTIAL' -AsPlainText -Force; $result=Save-NgrokCredential -Directory '${directory.replaceAll("'","''")}' -Token $secret -EndpointYaml 'version: 3'; if((Get-Acl -LiteralPath '${directory.replaceAll("'","''")}').Access | Where-Object IsInherited){throw 'Inherited ACL'}; $failed=$false; try{Save-NgrokCredential -Directory '${directory.replaceAll("'","''")}' -Token $secret -EndpointYaml 'changed'}catch{$failed=$true}; if(-not $failed){throw 'Overwrite allowed'}; $result | ConvertTo-Json -Compress`;
  // A Node child must not inherit PowerShell7's module lookup for Windows PowerShell5.1.
  const env={...process.env,PSModulePath:path.join(process.env.SystemRoot,'System32/WindowsPowerShell/v1.0/Modules')};
  const result=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',script],{env,encoding:'utf8',windowsHide:true,timeout:15000});
  assert.equal(result.status,0,result.stderr);assert(!result.stdout.includes('FAKE_TEST_TOKEN'));assert(!result.stderr.includes('FAKE_TEST_TOKEN'));
  const auth=fs.readFileSync(path.join(directory,'auth.yml'),'utf8');assert(auth.includes('FAKE_TEST_TOKEN_NOT_A_CREDENTIAL'));assert.equal(fs.readFileSync(path.join(directory,'endpoint.yml'),'utf8'),'version: 3');
});
