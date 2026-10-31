'use strict';
const {createServer}=require('./index.cjs');
const PUBLIC_ORIGIN='https://aatoto0312.github.io';
function createPublicServer(options={}){return createServer({...options,allowedOrigins:[PUBLIC_ORIGIN],isAllowedOrigin:undefined});}
if(require.main===module){const api=createPublicServer();api.start().then(()=>console.log('PUBLIC_API_LOOPBACK_READY')).catch(()=>{console.error('PUBLIC_API_START_FAILED');process.exitCode=1;});for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>api.stop().then(()=>process.exit(0)));}
module.exports={createPublicServer,PUBLIC_ORIGIN};
