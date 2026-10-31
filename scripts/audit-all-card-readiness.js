"use strict";
// Read-only inventory: legacy runtime labels are not final-audit certificates.
require('../tests/engine-loader.js');
var records=require('../js/cards/full-catalog-data.js');
var loader=require('../js/cards/catalog-card-loader.js');
var catalog=require('../shared/card-data/registry-catalog.js');
var rulingQuestions=require('./set5-ruling-questions.json').questions;
function audit(){
  var registry=new global.CardRegistry(),wired={};
  global.cardRegistry.getAll().forEach(function(def){registry.register(def);wired[def.id]=true;});
  loader.registerCatalogDefinitions(registry,records);
  var cards=catalog.fromRegistry(registry).map(function(card){
    var implemented=card.playable||card.implementationStatus==='IMPLEMENTED';
    return {cardId:card.cardId,canonicalCardId:card.canonicalCardId,printingId:card.printingId,
      officialNumber:card.officialNumber,name:card.name,set:card.set,
      implementationStatus:card.implementationStatus,battleDefinitionConnected:!!wired[card.cardId],
      stages:{CATALOGED:true,IMPLEMENTED:!!implemented,PLAYABLE:!!card.playable,AUDITED:false},
      auditState:'FINAL_AUDIT_PENDING',sourceRefs:card.sourceRefs||[],rulingQuestionIds:rulingQuestions.filter(function(question){return question.cardIds.indexOf(card.cardId)!==-1;}).map(function(question){return question.id;})};
  });
  var sets={},identities={},issues=[];
  cards.forEach(function(card){
    var counts=sets[card.set]||(sets[card.set]={cataloged:0,connected:0,implemented:0,playable:0,audited:0,statuses:{}});
    counts.cataloged++;if(card.battleDefinitionConnected)counts.connected++;
    ['IMPLEMENTED','PLAYABLE','AUDITED'].forEach(function(stage){if(card.stages[stage])counts[stage.toLowerCase()]++;});
    counts.statuses[card.implementationStatus]=(counts.statuses[card.implementationStatus]||0)+1;
    if(identities[card.printingId])issues.push('duplicate printing '+card.printingId);identities[card.printingId]=true;
    if(!card.officialNumber)issues.push('missing official number '+card.cardId);
    if(!card.canonicalCardId)issues.push('missing canonical identity '+card.cardId);
  });
  return {total:cards.length,playable:cards.filter(function(card){return card.stages.PLAYABLE;}).length,
    notes:['Declared legacy availability is preserved; no final audit inferred from tests or file existence.',
      'PARTIAL connected definitions are not counted as completed IMPLEMENTED cards.',
      'AUDITED is reserved for an explicit final card-level audit, not a historical completion note.'],sets:sets,issues:issues,rulingQuestions:rulingQuestions,cards:cards};
}
function markdown(report){
  var order=['STARTER','BOOSTER_SET_1','BOOSTER_SET_2','BOOSTER_SET_3','BOOSTER_SET_4','BOOSTER_SET_5','BOOSTER_SET_6','BOOSTER_SET_7','BOOSTER_SET_8'];
  var lines=['# Battle card readiness snapshot','','Generated with `node scripts/audit-all-card-readiness.js --markdown`.',
    'All entries: '+report.total+'; declared PLAYABLE: '+report.playable+'.',
    'This is a progress inventory. AUDITED requires a new explicit final audit; historical labels are not certificates. Partial wiring is listed separately from completed implementation.','',
    '| SET | Number | ID | Name | CATALOGED | Battle connected | IMPLEMENTED | PLAYABLE | AUDITED | Runtime status |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |'];
  report.cards.slice().sort(function(a,b){return order.indexOf(a.set)-order.indexOf(b.set)||parseInt(a.officialNumber)-parseInt(b.officialNumber);}).forEach(function(card){
    function flag(value){return value?'yes':'pending';}
    lines.push('| '+[card.set,card.officialNumber,card.cardId,card.name,'yes',flag(card.battleDefinitionConnected),flag(card.stages.IMPLEMENTED),flag(card.stages.PLAYABLE),flag(card.stages.AUDITED),card.implementationStatus].join(' | ')+' |');
  });
  lines.push('','## Open ruling questions','');
  (report.rulingQuestions||[]).forEach(function(question){lines.push('- '+question.id+' ['+question.status+'] '+question.cardIds.join(' / ')+': '+question.question);});
  return lines.join('\n');
}
module.exports=audit;module.exports.markdown=markdown;
if(require.main===module){var report=audit();if(process.argv.includes('--markdown')){console.log(markdown(report));}else console.log(JSON.stringify(process.argv.includes('--summary')?{total:report.total,playable:report.playable,sets:report.sets,issues:report.issues,rulingQuestions:report.rulingQuestions}:report,null,2));if(report.issues.length)process.exitCode=1;}
