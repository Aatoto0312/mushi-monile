(function (global) {
  'use strict';
  var basicV01 = {
    id: 'basic-v01', title: 'はじめての蟲神器',
    description: 'ドローから勝利まで、実際のカード操作で基本対戦を体験します。',
    initialState: { turnNumber: 2, activePlayerId: 'P1', firstPlayerId: 'P1', drawCardId: 'akiakane', foodCardId: 'namitentou', spellCardId: 'mushi_no_ibuki', enhancementCardId: 'kamikiri_no_daigaku', opponentInsectCardId: 'nijuuyaahoshitentou', directAttackerCardId: 'kanabun', startingFood: 3, opponentTerritoryCardId: 'namitentou' },
    steps: [
      { id: 'draw', message: 'まず山札から1枚ドローしましょう。', allowedActions: ['DRAW'], completionCondition: { type: 'INSTANCE_IN_ZONE', ref: 'drawCardInstanceId', zone: 'HAND' } },
      { id: 'set-food', message: '光っているカードをエサに置きましょう。', allowedActions: ['HAND_CARD', 'SET_FOOD'], allowedRefs: ['foodCardInstanceId'], completionCondition: { type: 'INSTANCE_IN_ZONE', ref: 'foodCardInstanceId', zone: 'FOOD' } },
      { id: 'enter-main', message: 'メインフェイズへ進みましょう。', allowedActions: ['ENTER_MAIN'], completionCondition: { type: 'PHASE', phase: 'MAIN_PHASE' } },
      { id: 'summon', message: 'ドローしたアキアカネを場に出しましょう。', allowedActions: ['HAND_CARD', 'SUMMON'], allowedRefs: ['drawCardInstanceId'], completionCondition: { type: 'INSTANCE_IN_ZONE', ref: 'drawCardInstanceId', zone: 'FIELD' } },
      { id: 'weakness-attack', message: 'アキアカネで緑の虫を攻撃。弱点はダメージが2倍です。', allowedActions: ['FIELD_CARD', 'SKILL', 'ATTACK_TARGET'], allowedRefs: ['drawCardInstanceId', 'opponentInsectInstanceId'], skillId: 'tobikakaru', completionCondition: { type: 'DAMAGE_EVENT', sourceRef: 'drawCardInstanceId', targetRef: 'opponentInsectInstanceId', multiplier: 2, destroyed: true } },
      { id: 'attack-territory-resolution', message: '虫を倒したため、相手の縄張りが1枚手札へ移ります。', allowedActions: [], completionCondition: { type: 'INSTANCE_IN_ZONE', ref: 'attackTerritoryInstanceId', zone: 'HAND' }, autoResolve: 'OPPONENT_TERRITORY', autoResolveRef: 'attackTerritoryInstanceId' },
      { id: 'direct-attack', message: 'カナブン1体目で相手本体を直接攻撃しましょう。', allowedActions: ['FIELD_CARD', 'SKILL', 'DIRECT_ATTACK'], allowedRefs: ['firstDirectAttackerInstanceId'], skillId: 'taiatari', completionCondition: { type: 'PENDING', pendingType: 'TERRITORY_DRAW_SELECTION', playerId: 'P2' } },
      { id: 'territory-to-hand', message: '直接攻撃で相手の縄張りが手札へ移ります。', allowedActions: [], completionCondition: { type: 'INSTANCE_IN_ZONE', ref: 'opponentTerritoryInstanceId', zone: 'HAND' }, autoResolve: 'OPPONENT_TERRITORY', autoResolveRef: 'opponentTerritoryInstanceId' },
      { id: 'use-spell', message: '術「蟲の息吹」を使ってみましょう。', allowedActions: ['HAND_CARD', 'USE_SPELL'], allowedRefs: ['spellInstanceId'], completionCondition: { type: 'INSTANCE_IN_ZONE', ref: 'spellInstanceId', zone: 'FOOD' } },
      { id: 'use-enhancement', message: '「天牛の大顎」を場の虫に装着しましょう。', allowedActions: ['HAND_CARD', 'USE_ENHANCEMENT', 'ENHANCEMENT_TARGET'], allowedRefs: ['enhancementInstanceId', 'enhancementTargetInstanceId'], completionCondition: { type: 'ATTACHMENT', attachmentRef: 'enhancementInstanceId', targetRef: 'enhancementTargetInstanceId' } },
      { id: 'final-direct-attack', message: '残ったカナブンで直接攻撃し、対戦を終わらせましょう。', allowedActions: ['FIELD_CARD', 'SKILL', 'DIRECT_ATTACK'], allowedRefs: ['finalDirectAttackerInstanceId'], skillId: 'taiatari', completionCondition: { type: 'GAME_OVER', winner: 'P1' } }
    ]
  };
  global.TUTORIAL_SCENARIOS = { basicV01: basicV01 };
})(typeof window !== 'undefined' ? window : globalThis);
