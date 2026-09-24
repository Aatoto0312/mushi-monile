'use strict';require('./engine-loader.js');var TestRunner=require('./lib.js');var runner=new TestRunner();
runner.test('SET4 wires all 64 canonical identities and preserves the audited alpha boundary',function(){
  const records=require('../js/cards/full-catalog-data.js').filter(x=>x.set==='BOOSTER_SET_4');
  runner.assertEqual(records.length,64);
  const ids=new Set();
  records.forEach(function(record){
    const def=getCardDefinition(record.id);
    runner.assert(def,'missing '+record.id);
    runner.assertEqual(def.name,record.name);
    runner.assertEqual(def.officialNumber,record.officialNumber);
    runner.assertEqual(def.type,record.type);
    var ready=require('../js/cards/set4-cards.js').alphaPlayableNumbers.indexOf(Number(record.officialNumber.split('/')[0]))!==-1;
    runner.assertEqual(def.implementationStatus,ready?'PLAYABLE':'PARTIAL');
    runner.assertEqual(def.isPlayable(),ready);
    ids.add(def.id);
  });
  runner.assertEqual(ids.size,64);
});
module.exports=runner;if(require.main===module)runner.runAll();
