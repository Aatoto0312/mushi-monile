'use strict';
function makeEndpointConfig(plan){
  if(!plan||typeof plan.hostname!=='string'||!/^[-a-z0-9]+\.ngrok-free\.(?:dev|app)$/.test(plan.hostname)||!/^[-a-z0-9]{1,40}$/.test(plan.endpointName)||plan.upstream!=='http://127.0.0.1:8787'||plan.websocketPath!=='/ws')throw Error('PLAN_INVALID');
  return ['version: 3','endpoints:','  - name: '+plan.endpointName,'    url: https://'+plan.hostname,'    upstream:','      url: '+plan.upstream,''].join('\n');
}
if(require.main===module)process.stdout.write(makeEndpointConfig(require('../ngrok-plan.json')));
module.exports={makeEndpointConfig};
