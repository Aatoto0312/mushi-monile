'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
test('external controller refuses exposure without explicit approval and an interactive console',()=>{
  const {validateLaunch}=require('../test-session.cjs');assert.throws(()=>validateLaunch([],true),/APPROVAL_REQUIRED/);assert.throws(()=>validateLaunch(['--approved-30-minute-test'],false),/INTERACTIVE_CONSOLE_REQUIRED/);assert.doesNotThrow(()=>validateLaunch(['--approved-30-minute-test'],true));
});
