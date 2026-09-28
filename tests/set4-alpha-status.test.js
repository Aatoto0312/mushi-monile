'use strict';require('./engine-loader.js');var TestRunner=require('./lib.js');var runner=new TestRunner();
var playable=Array.from({length:64},function(_,index){return index+1;});
runner.test('SET4 releases all cards after completed focused evidence',function(){
 for(var n=1;n<=64;n++){var d=getCardDefinition('set4_'+String(n).padStart(3,'0')),ready=playable.indexOf(n)!==-1;runner.assertEqual(d.implementationStatus,ready?'PLAYABLE':'PARTIAL',d.id);runner.assertEqual(d.isPlayable(),ready,d.id);}
});
module.exports=runner;if(require.main===module)runner.runAll();
