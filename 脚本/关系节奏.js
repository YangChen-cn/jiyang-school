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

const dailyAffectionLimit = 12;

function normalizeRelationshipScore(value) {
  const score = Number(value);
  return Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : undefined;
}

function limitRelationshipGains(state, before) {
  if (!state) return;

  const previous = before?.剧情?.当日好感增量;
  const trackedDay = campusDate(previous?.日期);
  const day = [trackedDay, campusDate(before?.世界?.日期), campusDate(state.世界?.日期)].sort().at(-1);
  // 日期更正或暂缺时沿用本剧情分支的额度，直到剧情推进到更晚的一天。
  const previousUsage = !trackedDay || trackedDay === day ? previous?.已用 : undefined;
  const usage = {};

  for (const [person, metric] of relationshipMetrics) {
    const character = state[person];
    const score = normalizeRelationshipScore(character?.[metric]);

    if (score !== undefined) character[metric] = score;
    if (metric !== '好感度' || !before) continue;

    const already = Math.min(dailyAffectionLimit, normalizeRelationshipScore(previousUsage?.[person]) ?? 0);
    if (already) usage[person] = already;
    if (score === undefined) continue;

    const oldScore = normalizeRelationshipScore(before[person]?.[metric]) ?? 0;
    if (score > oldScore) {
      const gain = Math.min(score - oldScore, dailyAffectionLimit - already);
      character[metric] = oldScore + gain;
      if (gain) usage[person] = already + gain;
    }
  }

  if (before) (state.剧情 ??= {}).当日好感增量 = { 日期: day, 已用: usage };

  if (state.剧情) {
    delete state.剧情.当日关系增量;
    delete state.剧情.重大情感申请;
    delete state.剧情.已结算重大情感事件;
    delete state.剧情.推进节奏;
    delete state.剧情.事件冷却;
    delete state.剧情.上次焦点角色;
  }
}
