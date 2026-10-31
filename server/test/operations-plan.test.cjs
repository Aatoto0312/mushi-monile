'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
test('pre-login recovery plan uses a limited credentialed boot task without touching remote access',()=>{
  const {buildTaskPlan}=require('../lib/operations-plan.cjs');
  const plan=buildTaskPlan({account:'DESKTOP\\owner',nodePath:'C:\\Program Files\\nodejs\\node.exe',workspace:'C:\\Users\\owner\\mushi-online-beta'});
  assert.equal(plan.trigger,'AtStartup');assert.equal(plan.logonType,'Password');assert.equal(plan.runLevel,'Limited');
  assert.equal(plan.account,'DESKTOP\\owner');assert.equal(plan.requiresApproval,true);
  assert.equal(plan.stopOnBattery,false);assert.equal(plan.executionTimeLimit,'PT0S');
  assert.equal(plan.changesTailscale,false);assert.equal(plan.changesRemoteDesktop,false);assert.equal(plan.changesPowerPlan,false);
  assert(plan.prerequisites.includes('APPROVED_TASK_REGISTRATION'));
  assert(plan.prerequisites.includes('NATIVE_WINDOWS_CREDENTIAL_ENTRY'));
  assert(plan.prerequisites.includes('TUNNEL_MACHINE_LOCAL_CREDENTIALS'));
  assert.equal(plan.requiresStoredWindowsCredential,true);
  assert(!JSON.stringify(plan).includes('SYSTEM'));assert(!Object.hasOwn(plan,'password'));
});
test('operations plan rejects unsafe or incomplete executable paths and service identities',()=>{
  const {buildTaskPlan}=require('../lib/operations-plan.cjs');
  const good={account:'DESKTOP\\owner',nodePath:'C:\\Program Files\\nodejs\\node.exe',workspace:'C:\\Users\\owner\\mushi-online-beta'};
  for(const patch of [{account:'SYSTEM'},{account:'NT AUTHORITY\\SYSTEM'},{account:''},{nodePath:'node.exe'},{workspace:'..'},{nodePath:'C:\\node.exe" -evil'}])assert.throws(()=>buildTaskPlan({...good,...patch}),/PLAN_INVALID/);
});
