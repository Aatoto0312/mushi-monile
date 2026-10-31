'use strict';
const fs=require('node:fs'),path=require('node:path'),{ROOT,VERSIONS}=require('./lib/runtime.cjs');
fs.mkdirSync(path.join(ROOT,'online'),{recursive:true});
fs.writeFileSync(path.join(ROOT,'online/contract.json'),JSON.stringify(VERSIONS,null,2)+'\n');
console.log('Updated online/contract.json from current trusted Engine sources');
