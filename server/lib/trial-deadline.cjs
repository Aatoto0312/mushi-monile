'use strict';
function trialDeadline(value,now=Date.now()){
  const deadline=value?Date.parse(value):now+1800000;
  if(!Number.isFinite(deadline)||deadline<=now||deadline-now>1800000)throw Error('TRIAL_DEADLINE_INVALID');
  return {iso:new Date(deadline).toISOString(),remainingMs:Math.floor(deadline-now)};
}
module.exports={trialDeadline};
