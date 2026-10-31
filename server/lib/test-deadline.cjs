'use strict';
function superviseSession(children,options={}){
  const duration=options.durationMs??1800000,grace=options.graceMs??1500;
  if(!Number.isFinite(duration)||duration<=0||duration>1800000)throw Error('DEADLINE_INVALID');
  let stopping=false,resolve;const done=new Promise(r=>resolve=r);
  const exited=child=>child.exitCode!==null||child.signalCode!==null;
  async function stop(reason='MANUAL_STOP'){
    if(stopping)return done;stopping=true;clearTimeout(timer);
    // Agent is first: close the internet edge before terminating the game server.
    for(const child of children){
      if(exited(child))continue;
      await new Promise(finish=>{
        let forced;const end=()=>{clearTimeout(forced);finish();};child.once('exit',end);
        forced=setTimeout(()=>{if(!exited(child))child.kill();},grace);
        if(child.connected)try{child.send({type:'SHUTDOWN'});}catch{child.kill();}else child.kill();
        if(exited(child))end();
      });
    }
    resolve(reason);return done;
  }
  const timer=setTimeout(()=>stop('DEADLINE'),duration);
  function observe(child){child.once('exit',()=>{if(!stopping)stop('CHILD_EXIT');});child.once('error',()=>{if(!stopping)stop('CHILD_ERROR');});if(exited(child))queueMicrotask(()=>stop('CHILD_EXIT'));}
  for(const child of children)observe(child);
  function track(child,first=false){if(stopping){child.kill();throw Error('SESSION_STOPPED');}if(first)children.unshift(child);else children.push(child);observe(child);}
  return {done,stop,track};
}
module.exports={superviseSession};
