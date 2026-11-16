const relationshipMetrics = [
  ['苏晓樯', '好感度'],
  ['温书语', '好感度'],
  ['沈幼楚', '好感度'],
  ['沈幼楚', '信任度'],
  ['陈芷汀', '好感度'],
  ['慕佳芊', '好感度'],
  ['虞淑婉', '好感度'],
  ['许念安', '好感度'],
  ['许念安', '控制欲'],
];

function limitRelationshipGains(state) {
  if (!state) return;

  for (const [person, metric] of relationshipMetrics) {
    if (!state[person] || state[person][metric] === undefined) continue;
    const val = Number(state[person][metric]);
    if (Number.isFinite(val)) {
      state[person][metric] = Math.max(0, Math.min(100, Math.round(val)));
    }
  }

  if (state.剧情) {
    delete state.剧情.当日关系增量;
    delete state.剧情.重大情感申请;
    delete state.剧情.已结算重大情感事件;
    delete state.剧情.推进节奏;
    delete state.剧情.事件冷却;
    delete state.剧情.上次焦点角色;
  }
}
