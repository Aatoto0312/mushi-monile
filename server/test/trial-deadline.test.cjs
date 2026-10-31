'use strict';const test=require('node:test'),assert=require('node:assert/strict'),{trialDeadline}=require('../lib/trial-deadline.cjs');
test('retry preserves original approved expiry and cannot extend or use an expired trial',()=>{
  const now=Date.now(),original=new Date(now+60000).toISOString();assert.equal(trialDeadline(original,now).remainingMs,60000);assert.equal(trialDeadline(original,now+1000).remainingMs,59000);
  for(const value of ['bad',new Date(now-1).toISOString(),new Date(now+1800001).toISOString()])assert.throws(()=>trialDeadline(value,now),/INVALID/);
});
