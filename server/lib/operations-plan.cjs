'use strict';
const path=require('node:path');
// A description only. This module cannot register tasks or change Windows.
function buildTaskPlan({account,nodePath,workspace}={}){
  const validPath=value=>typeof value==='string'&&path.win32.isAbsolute(value)&&!/[\x00-\x1f"<>|]/.test(value);
  if(typeof account!=='string'||!account.trim()||/[\x00-\x1f"<>|]/.test(account)||/^(?:NT AUTHORITY\\)?(?:SYSTEM|LOCAL SERVICE|NETWORK SERVICE)$/i.test(account)||!validPath(nodePath)||!validPath(workspace)||path.win32.basename(nodePath).toLowerCase()!=='node.exe')throw Error('PLAN_INVALID');
  return {
    taskName:'Mushijingi Online Beta',account,trigger:'AtStartup',startupDelay:'PT45S',logonType:'Password',runLevel:'Limited',
    executable:nodePath,arguments:['server/supervisor.cjs'],workingDirectory:workspace,
    executionTimeLimit:'PT0S',stopOnBattery:false,startWhenAvailable:true,multipleInstances:'IgnoreNew',
    restartInterval:'PT1M',restartCount:10,requiresApproval:true,requiresStoredWindowsCredential:true,
    changesTailscale:false,changesRemoteDesktop:false,changesPowerPlan:false,
    prerequisites:['APPROVED_TASK_REGISTRATION','NATIVE_WINDOWS_CREDENTIAL_ENTRY','SUPERVISOR_VERIFIED','TUNNEL_MACHINE_LOCAL_CREDENTIALS','LOG_ACL_APPROVED','EXTERNAL_WSS_VERIFIED'],
    limitations:['S4U is not selected: Microsoft documents no network access under S4U.','Windows credentials must be entered locally through Windows UI after approval, never through chat or repository files.','The account and local tunnel credential files must work without an interactive sign-in.','Task Scheduler restart settings do not guarantee recovery while the PC sleeps or has no network.','The referenced supervisor must be implemented and tested before registration.']
  };
}
module.exports={buildTaskPlan};
