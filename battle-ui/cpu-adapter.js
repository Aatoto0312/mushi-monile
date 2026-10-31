(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./engine-view.js'));else root.MushiCpuAdapter=factory(root.MushiEngineView);})(globalThis,function(G){'use strict';
 function createRuntime(context){return {context,restore:s=>Object.assign(new context.GameState(),JSON.parse(JSON.stringify(s)))};}
 function prepare(runtime,state){const prepared=G.prepareView(runtime,state,'P1');prepared.snapshot=JSON.stringify(state);return prepared;}
 function dispatch(runtime,engine,prepared,id,refs){if(prepared.snapshot!==JSON.stringify(engine.state))throw Error('STATE_CHANGED');const next=G.applyCapability(runtime,engine.state,prepared.capabilities,id,refs||[]);engine.state=next;if(runtime.context.TurnEngine)engine.turn=new runtime.context.TurnEngine(next);return next;}
 return {createRuntime,prepare,dispatch};
});
