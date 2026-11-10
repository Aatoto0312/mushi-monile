'use strict';
require('./engine-loader.js');
const catalog=require('../js/cards/full-catalog-data.js');
const all=global.cardRegistry.getAll();
const known=new Map(catalog.map(x=>[x.id,x]));
const remaining=all.filter(d=>!d.isPlayable()&&d.implementationStatus!=='test');
function textOf(d){const x=known.get(d.id)||d;return [...(x.skills||[]).map(v=>v.effectText||''),...(x.passiveAbilities||[]).map(v=>v.effectText||''),...(x.cardEffects||[]).map(v=>v.effectText||''),...(x.enhancementEffects||[]).map(v=>v.effectText||'')].filter(Boolean).join(' / ');}
function classify(d){const text=textOf(d);const t=(d.type||'');let score=0;const reasons=[];
if(!text.trim()){score-=10;reasons.push('効果テキストなし');}
if(t==='INSECT')score-=2;
if(/攻撃力|体力|ダメージ|回復|コスト|破壊|捨て札/.test(text)){score+=2;reasons.push('既存の基本効果候補');}
if(/選び|選んで|指定|最大|任意|してもよい/.test(text)){score+=4;reasons.push('選択処理');}
if(/裏向き|表向き|縄張り|エサ場|場に出|ターン終了|次のターン/.test(text)){score+=5;reasons.push('状態・タイミング処理');}
if(/代わりに|場合|たび|まで|すべて|同時|入れ替|繰り返|連続|相手の|コピー|交換/.test(text)){score+=7;reasons.push('条件・複合処理');}
if(/特殊|例外|無効|できない|禁止|置き換|勝利|敗北/.test(text)){score+=8;reasons.push('特殊裁定');}
if(text.length>110){score+=6;reasons.push('長文効果');}
if(text.length>220)score+=8;
if(d.implementationStatus==='PARTIAL'){score-=4;reasons.push('既存部分実装あり');}
const tier=score<=2?'A':score<=10?'B':score<=19?'C':'D';
return {id:d.id,name:d.name,type:t,set:d.set,status:d.implementationStatus,score,tier,reasons,text:text.slice(0,350)};}
const ranked=remaining.map(classify).sort((a,b)=>a.score-b.score||a.id.localeCompare(b.id));
const statuses={};all.forEach(d=>statuses[d.implementationStatus]=(statuses[d.implementationStatus]||0)+1);
console.log('REMAINING_PRIORITY_JSON '+JSON.stringify({total:all.length,playable:all.filter(d=>d.isPlayable()).length,remaining:ranked.length,statuses,ranked}));
