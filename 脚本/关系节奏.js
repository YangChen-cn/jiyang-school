const relationshipLimits = [
  ['苏晓樯', '好感度', 3, 4],
  ['温书语', '好感度', 2, 3],
  ['沈幼楚', '好感度', 2, 3],
  ['沈幼楚', '信任度', 3, 4],
  ['陈芷汀', '好感度', 3, 4],
  ['慕佳芊', '好感度', 2, 2],
  ['虞淑婉', '好感度', 2, 2],
];

function limitRelationshipGains(state, before) {
  if (!state?.剧情 || !before) return;

  const oldUsage = before.剧情?.当日关系增量;
  const previousDate = campusDate(oldUsage?.日期) || campusDate(before.世界?.日期);
  const currentDate = campusDate(state.世界?.日期);
  const day = currentDate > previousDate ? currentDate : previousDate;
  const prior = oldUsage?.日期 === day ? oldUsage.已用 : undefined;
  const used = {};

  for (const [person, metric, perTurn, perDay] of relationshipLimits) {
    const key = `${person}.${metric}`;
    const already = Math.max(0, Math.min(Number(prior?.[key]) || 0, perDay));
    if (already) used[key] = already;

    const oldScore = before[person]?.[metric];
    const newScore = state[person]?.[metric];
    if (!Number.isFinite(oldScore) || !Number.isFinite(newScore) || newScore <= oldScore) continue;

    const gain = Math.max(0, Math.min(newScore - oldScore, perTurn, perDay - already, 100 - oldScore));
    state[person][metric] = oldScore + gain;
    if (gain) used[key] = already + gain;
  }

  state.剧情.当日关系增量 = {日期: day, 已用: used};
}
