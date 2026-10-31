'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'../..');
const SCRIPTS=['js/cards/card-definition.js','js/cards/card-instance.js','js/cards/card-registry.js','js/cards/starter-cards.js','js/cards/set1-cards.js','js/cards/full-catalog-data.js','js/cards/set2-cards.js','js/cards/set3-cards.js','js/cards/set4-cards.js','js/cards/set5-cards.js','shared/deck-format/runtime.js','js/engine/game-state.js','js/engine/rules.js','js/engine/stat-modifier.js','js/engine/zone-engine.js','js/engine/battle-engine.js','js/engine/turn-engine.js','js/engine/game-engine.js'];
const hash=files=>crypto.createHash('sha256').update(files.map(file=>file+'\n'+fs.readFileSync(path.join(ROOT,file),'utf8').replace(/\r\n/g,'\n')).join('\n')).digest('hex');
const VERSIONS=Object.freeze({protocol:'mushi-online/1',engine:hash(SCRIPTS),cards:hash(SCRIPTS.filter(file=>file.startsWith('js/cards/')))});
function createRuntime(){
  // Trusted repository code only. VM separates match globals, not attacker authority.
  const context=vm.createContext({console:{log(){},warn(){},error(){}}});
  for(const file of SCRIPTS)new vm.Script(fs.readFileSync(path.join(ROOT,file),'utf8'),{filename:file}).runInContext(context,{timeout:5000});
  const definitions=context.cardRegistry.getAll().filter(d=>d.set&&d.isPlayable());
  const catalogIds=new Set(context.MushijingiFullCatalogData.map(d=>d.id));
  context.cardRegistry.getAll().filter(d=>d.set).forEach(d=>catalogIds.add(d.id));
  const meta=Object.freeze({...VERSIONS,catalogCount:catalogIds.size,playableCount:definitions.length});
  function preset(id){const recipe=context.STARTER_DECK_RECIPES[id];if(!recipe)throw new Error('DECK_INVALID');return {formatVersion:'mushijingi-deck/1.0',deckId:'deck:online:'+id.toLowerCase(),deckName:recipe.name,cardDataVersion:'card-registry/1',rulesetId:'ruleset:standard:v1',cards:Object.entries(recipe.cardCounts).map(([canonicalCardId,quantity])=>({canonicalCardId,printingId:'registry:'+canonicalCardId,quantity}))};}
  function validateDeck(deck){
    if(!deck||deck.formatVersion!=='mushijingi-deck/1.0'||deck.cardDataVersion!=='card-registry/1'||deck.rulesetId!=='ruleset:standard:v1')throw new Error('DECK_VERSION');
    if(!Array.isArray(deck.cards)||deck.cards.length<1||deck.cards.length>20||deck.cards.some(entry=>!entry||typeof entry.canonicalCardId!=='string'||entry.canonicalCardId.length>80||!Number.isInteger(entry.quantity)||entry.quantity<1||entry.quantity>2))throw new Error('DECK_INVALID');
    const safe={cards:deck.cards.map(entry=>({canonicalCardId:entry.canonicalCardId,quantity:entry.quantity}))};
    const result=context.MushijingiDeckRuntime.validateForBattle(safe,context.cardRegistry);
    if(!result.valid||result.definitions.some(d=>!d.set||d.implementationStatus==='test'))throw new Error('DECK_INVALID');
    return result.definitions;
  }
  function start(first,second,rng=()=>crypto.randomInt(0x100000000)/0x100000000){return context.startGame(new context.GameState(),validateDeck(first),validateDeck(second),rng);}
  function restore(snapshot){return Object.assign(new context.GameState(),JSON.parse(JSON.stringify(snapshot)));}
  return {context,meta,preset,validateDeck,start,restore,definitions};
}
module.exports={createRuntime,VERSIONS,SCRIPTS,ROOT};
