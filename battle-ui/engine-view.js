(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(()=>require('node:crypto').randomBytes(12).toString('hex'));else root.MushiEngineView=factory(()=>Array.from(root.crypto.getRandomValues(new Uint8Array(12)),b=>b.toString(16).padStart(2,'0')).join(''));})(globalThis,function(opaque){'use strict';
function run(r,s,op,ids=[]){const c=r.context,p=op.playerId;
  switch(op.kind){
    case 'SET_FOOD':return c.setFood(s,p,op.source);
    case 'DRAW':return c.drawCardOnce(s,p);
    case 'TO_SET':return c.enterSetPhase(s);
    case 'MAIN':return c.enterMainPhase(s);
    case 'SUMMON':return c.summonInsect(s,p,op.source);
    case 'ALTERNATIVE':return c.summonInsect(s,p,op.source,{alternative:true});
    case 'SPELL':return c.useSpell(s,p,op.source);
    case 'ENHANCE':return c.useEnhancement(s,p,op.source,op.target,op.color);
    case 'ATTACK':return c.performAttack(s,op.source,op.target,op.targetType,op.skillId,op.sacrifice);
    case 'MULTI_ATTACK':return c.beginMultiTargetAttackSelection(s,op.source,op.skillId);
    case 'FIELD_ABILITY':return c.activateFieldAbility(s,p,op.source,op.abilityIndex);
    case 'END':return c.endTurn(s);
    case 'CHOICE':return c.resolveChoiceSelection(s,p,op.value);
    case 'TERRITORY_CHOICE':return c.resolvePendingTerritoryChoice(s,op.value);
    case 'CARDS':return c.resolveCardSelection(s,p,ids,true);
    case 'TERRITORY':if(ids.length!==1)throw Error('SELECTION_INVALID');return c.resolveTerritoryDrawSelection(s,p,ids[0]);
    case 'SPELL_TARGET':if(ids.length!==1)throw Error('SELECTION_INVALID');return c.resolveSpellTargetSelection(s,p,ids[0]);
    case 'DISCARD':if(ids.length!==1)throw Error('SELECTION_INVALID');return c.resolveDiscardInsectSelection(s,p,ids[0]);
    case 'CANCEL_CARD_PAYMENT':return c.cancelPendingEnhancementPayment(s,p);
    case 'CANCEL_ATTACK_COST':return c.cancelPendingAttackCost(s,p);
    default:throw Error('ACTION_INVALID');
  }
}
function applyCapability(r,state,capabilities,id,selectedRefs=[]){
  const cap=capabilities.get(id);
  if(!cap||!Array.isArray(selectedRefs)||selectedRefs.length>40||new Set(selectedRefs).size!==selectedRefs.length)throw Error('ACTION_INVALID');
  if(selectedRefs.some(ref=>typeof ref!=='string'||!cap.selectionRefs.has(ref)))throw Error('SELECTION_INVALID');
  const ids=selectedRefs.map(ref=>cap.selectionRefs.get(ref)),draft=r.restore(state);
  run(r,draft,cap.operation,ids);
  // Logs/events are not gameplay storage. Bound these without changing rule data.
  draft.battleLog=draft.battleLog.slice(-200);draft.battleEvents=draft.battleEvents.slice(-200);
  return draft;
}
function prepareView(r,s,viewer){
  if(viewer!=='SPECTATOR'&&!s.playerOrder.includes(viewer))throw Error('PLAYER_INVALID');
  const c=r.context,refs=new Map(),reverse=new Map(),capabilities=new Map();
  function ref(id){if(!refs.has(id)){const value=opaque();refs.set(id,value);reverse.set(value,id);}return refs.get(id);}
  function card(inst,zone,pid,forceHidden=false,inspectOwnHidden=false){
    // Some existing moves keep the instance faceDown flag after it enters hand/discard.
    // Visibility follows the current zone, never a stale territory flag.
    const hidden=forceHidden||zone==='DECK'||zone==='HAND'&&pid!==viewer||zone==='RESOLVING'&&pid!==viewer||['FIELD','FOOD','TERRITORY','DISCARD'].includes(zone)&&!!inst.faceDown&&!(inspectOwnHidden&&zone==='FOOD'&&pid===viewer);
    if(hidden)return {ref:ref(inst.instanceId),hidden:true,label:'裏向きのカード',zone};
    const d=c.getCardDefinition(inst.cardId);
    const result={ref:ref(inst.instanceId),hidden:false,zone,cardId:inst.cardId,name:d?d.name:'カード',ownerId:inst.ownerId,controllerId:pid};
    if(d&&d.type==='INSECT'){
      result.currentHp=inst.currentHp;result.maxHp=c.calculateMaxHp(inst,s);result.color=c.getEffectiveColor(inst);result.attacked=!!inst.attackedThisTurn;
      result.skills=c.getEffectiveAttackSkills(s,inst).map(skill=>({name:skill.name,ap:c.getEffectiveAP(s,inst,skill.baseAp,skill)}));
    }
    if(inst.attachments)result.attachments=inst.attachments.map(a=>card(a,'ATTACHMENT',pid));
    return result;
  }
  function locate(id,forceHidden=false,inspectOwnHidden=false){const attachment=c.findAttachment(s,id),holder=attachment||c.findAnywhere(s,id);return holder?card(holder.instance,attachment?'ATTACHMENT':holder.zone,holder.playerId,forceHidden||!!(attachment&&attachment.host.faceDown),inspectOwnHidden):{ref:ref(id),hidden:true,label:'カード',zone:'UNKNOWN'};}
  const view={viewerId:viewer,turn:s.turnNumber,phase:s.phase,activePlayerId:s.activePlayerId,firstPlayerId:s.firstPlayerId,winner:s.winner||null,players:{},actions:[],decision:null,unsupportedDecision:false,blockedReason:null};
  for(const pid of s.playerOrder){const p=s.player(pid),out={id:pid,availableCost:p.availableCost,counts:{}};
    for(const zone of ['hand','deck','territory','food','field','discard','resolving']){out.counts[zone]=p[zone].length;if(zone!=='deck')out[zone]=p[zone].map(inst=>card(inst,zone.toUpperCase(),pid));}
    // Hidden hand slots must not disclose stable Engine ordering/draw identity.
    if(pid!==viewer)out.hand.sort((a,b)=>a.ref.localeCompare(b.ref));
    view.players[pid]=out;
  }
  if(viewer==='SPECTATOR')return {view,capabilities};
  const title=id=>{const h=c.findAnywhere(s,id)||c.findAttachment(s,id),d=h&&c.getCardDefinition(h.instance.cardId);return d?d.name:'カード';};
  function add(operation,label,source,target,selectionIds=[],preview=true){
    const op={...operation,playerId:viewer};
    if(preview){try{const draft=r.restore(s);run(r,draft,op);if(JSON.stringify(draft)===JSON.stringify(s))return;}catch{return;}}
    const id=opaque(),selectionRefs=new Map(selectionIds.map(id=>[ref(id),id]));
    capabilities.set(id,{operation:op,selectionRefs});
    const dto={id,kind:op.kind,label};if(source)dto.sourceRef=ref(source);if(target)dto.targetRef=ref(target);
    if(op.sacrifice)dto.additionalCostRefs=[ref(op.sacrifice)];
    if(op.kind==='ATTACK'||op.kind==='MULTI_ATTACK'){
      const actor=c.findAnywhere(s,op.source).instance,skill=c.getEffectiveAttackSkills(s,actor).find(skill=>skill.id===op.skillId);
      dto.skill={name:skill.name,ap:c.getEffectiveAP(s,actor,skill.baseAp,skill)};
    }
    view.actions.push(dto);return id;
  }
  const pending=s.pendingEffect;
  if(s.phase==='GAME_OVER')return {view,capabilities};
  if(pending){
    if(pending.playerId!==viewer)return {view,capabilities};
    const paymentStatus=c.getPendingEnhancementPaymentStatus(s);
    if(paymentStatus){add({kind:'CANCEL_CARD_PAYMENT'},'支払いを取り消す');if(!paymentStatus.canContinue)return {view,capabilities};}
    if(pending.type==='CHOICE_SELECTION'){
      for(const option of pending.options)add({kind:'CHOICE',value:option.value},String(option.label).slice(0,180),null,null,[],false);
    }else if(pending.type==='TERRITORY_DRAW_CHOICE'){
      for(const value of pending.options)add({kind:'TERRITORY_CHOICE',value},value==='USE_TOBIDASU'?'とびだすを使用':'手札へ加える',null,null,[],false);
    }else{
      const types={CARD_SELECTION:'CARDS',TERRITORY_DRAW_SELECTION:'TERRITORY',SPELL_TARGET_SELECTION:'SPELL_TARGET',DISCARD_INSECT_SELECTION:'DISCARD'},kind=types[pending.type];
      if(!kind){view.unsupportedDecision=true;view.blockedReason='UNSUPPORTED_DECISION';return {view,capabilities};}
      const costStatus=c.getPendingAttackCostStatus(s);
      if(costStatus&&!costStatus.canContinue){add({kind:'CANCEL_ATTACK_COST'},'続行できない攻撃を取り消す',null,null,[],false);return {view,capabilities};}
      const fieldCandidates=c.getPendingFieldAbilityCandidates(s,pending);
      const entryConstraints=c.getPendingEntrySelectionConstraints(s,pending);
      const bounds=entryConstraints?.selectionBounds||pending;
      const max=pending.type==='CARD_SELECTION'?bounds.maxSelections:1,min=pending.type==='CARD_SELECTION'?bounds.minSelections:1;
      const options=paymentStatus?paymentStatus.candidateIds:costStatus?costStatus.candidateIds:entryConstraints?entryConstraints.options:fieldCandidates||pending.options||[];
      if(options.length<min){view.blockedReason='SELECTION_UNAVAILABLE';return {view,capabilities};}
      const id=add({kind},'選択を決定',null,null,options,false);
      view.decision={actionId:id,min,max,exact:bounds.exactSelections??(kind==='CARDS'?null:1),ordered:true,
        options:options.map(id=>locate(id,!!pending.hiddenSelection,!!pending.continuation?.effect?.inspectOwnHidden)),atMostOneGroups:(entryConstraints?entryConstraints.atMostOneGroups:pending.selectionAtMostOneGroups||[]).map(group=>group.map(ref)),groups:(pending.selectionGroups||[]).map(group=>group.map(ref)),partitions:(pending.selectionPartitions||[]).map(group=>group.map(ref)),combinations:(pending.allowedCombinations||[]).map(group=>group.map(ref))};
      if(pending.hiddenSelection)view.decision.options.sort((a,b)=>a.ref.localeCompare(b.ref));
    }
    if(!view.actions.length)view.blockedReason='ENGINE_NO_LEGAL_COMMAND';
    return {view,capabilities};
  }
  if(s.activePlayerId!==viewer)return {view,capabilities};
  const player=s.player(viewer);
  if(s.phase==='DRAW_PHASE'){add({kind:'DRAW'},'カードを引く');add({kind:'TO_SET'},'セットフェイズへ');}
  if(s.phase==='SET_PHASE'){
    for(const held of player.hand)add({kind:'SET_FOOD',source:held.instanceId},'エサにする：'+title(held.instanceId),held.instanceId);
    add({kind:'MAIN'},'メインフェイズへ');
  }
  if(s.phase==='MAIN_PHASE'){
    for(const held of player.hand){const d=c.getCardDefinition(held.cardId);if(!d||!d.isPlayable())continue;
      if(d.type==='INSECT')for(const method of c.getAvailableSummonMethods(s,viewer,held.instanceId))add({kind:method.type==='NORMAL'?'SUMMON':'ALTERNATIVE',source:held.instanceId},method.type==='NORMAL'?'場に出す：'+d.name+'（'+method.cost+'）':'代替コストで場に出す：'+d.name,held.instanceId);
      if(d.type==='SPELL')add({kind:'SPELL',source:held.instanceId},'術を使う：'+d.name,held.instanceId);
      if(d.type==='ENHANCEMENT'){
        const special=d.enhancementEffects.some(e=>e.type==='REVIVE_TWO_TRACKED_INSECTS'||e.type==='SUMMON_ATTACHED_FROM_HAND');
        if(special)add({kind:'ENHANCE',source:held.instanceId},'強化を使う：'+d.name,held.instanceId);
        else{const colors=[...new Set(d.enhancementEffects.flatMap(e=>e.type==='COLOR_OVERRIDE'&&e.colors?Array.from(e.colors):[]))];
          for(const target of c.getEnhancementTargetCandidates(s,viewer,held.instanceId))for(const color of colors.length?colors:[null])add({kind:'ENHANCE',source:held.instanceId,target:target.instanceId,color},d.name+' → '+title(target.instanceId)+(color?' / '+color:''),held.instanceId,target.instanceId);
        }
      }
    }
    for(const source of player.field){
      for(const ability of c.getFieldAbilityActions(s,viewer,source.instanceId))add({kind:'FIELD_ABILITY',source:source.instanceId,abilityIndex:ability.abilityIndex},'特性：'+ability.label,source.instanceId);
      for(const skill of c.getEffectiveAttackSkills(s,source)){
        const targets=c.getLegalAttackTargets(s,source.instanceId,skill.id);if(!targets.length)continue;
        if((skill.effects||[]).some(e=>e.type==='ATTACK_MULTIPLE_TARGETS')){add({kind:'MULTI_ATTACK',source:source.instanceId,skillId:skill.id},skill.name+'（複数対象）',source.instanceId);continue;}
        const sacrifices=c.skillRequiresSacrifice(skill)?Array.from(c.getSacrificeCandidates(s,source.instanceId)).map(card=>card.instanceId):[null];
        for(const target of targets)for(const sacrifice of sacrifices){const targetId=target.targetType==='INSECT'?target.instance.instanceId:null;add({kind:'ATTACK',source:source.instanceId,target:targetId,targetType:target.targetType,skillId:skill.id,sacrifice},skill.name+' → '+(targetId?title(targetId):'相手への直接攻撃')+(sacrifice?' / 破壊：'+title(sacrifice):''),source.instanceId,targetId);}
      }
    }
    add({kind:'END'},'ターン終了');
  }
  if(!view.actions.length)view.blockedReason='ENGINE_NO_LEGAL_COMMAND';
  return {view,capabilities};
}
return {prepareView,applyCapability};
});
