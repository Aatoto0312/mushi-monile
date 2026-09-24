'use strict';require('./engine-loader.js');var TestRunner=require('./lib.js');var runner=new TestRunner();
var playable=[1,3,4,5,6,8,9,10,11,12,14,15,16,17,19,22,23,26,29,30,31,32,34,35,38,41,42,43,46,47,48,49,50,51,57,61];
runner.test('SET4 alpha releases only cards with completed focused evidence',function(){
 for(var n=1;n<=64;n++){var d=getCardDefinition('set4_'+String(n).padStart(3,'0')),ready=playable.indexOf(n)!==-1;runner.assertEqual(d.implementationStatus,ready?'PLAYABLE':'PARTIAL',d.id);runner.assertEqual(d.isPlayable(),ready,d.id);}
});
module.exports=runner;if(require.main===module)runner.runAll();
