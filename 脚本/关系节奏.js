const relationshipLimits = [
  ['苏晓樯', '好感度', 3, 8],
  ['温书语', '好感度', 2, 7],
  ['沈幼楚', '好感度', 2, 7],
  ['沈幼楚', '信任度', 3, 4],
  ['许念安', '好感度', 2, 7],
  ['陈芷汀', '好感度', 3, 8],
  ['慕佳芊', '好感度', 2, 6],
  ['虞淑婉', '好感度', 2, 6],
];

function limitRelationshipGains(state, before, narrative = '') {
  if (!state?.剧情 || !before) return;

  const previous = Array.isArray(before.剧情?.已结算重大情感事件) ? before.剧情.已结算重大情感事件 : [];
  const settled = previous.filter(e => e && typeof e.事件 === 'string' && typeof e.角色 === 'string' && typeof e.指标 === 'string').map(e => ({事件:e.事件, 角色:e.角色, 指标:e.指标, ...(typeof e.事实 === 'string' ? {事实:e.事实} : {})}));
  const applications = Array.isArray(state.剧情.重大情感申请) ? state.剧情.重大情感申请 : [];
  const body = typeof narrative === 'string' ? narrative.split(/<UpdateVariable\b/i)[0] : '';
  const hasQuote = value => typeof value === 'string' && value.trim().length >= 4 && body.includes(value.trim());
  const same = (a, b) => a.角色 === b.角色 && a.指标 === b.指标 && (a.事件 === b.事件 || (a.事实 && a.事实 === b.事实));

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

    const oldScore = before[person]?.[metric] ?? (person === '许念安' ? 0 : undefined);
    const newScore = state[person]?.[metric];
    if (!Number.isFinite(oldScore) || !Number.isFinite(newScore) || newScore === oldScore) continue;

    const candidate = applications.find(e => e && e.角色 === person && e.指标 === metric && typeof e.事件 === 'string' && e.事件.trim() && hasQuote(e.事实原文) && hasQuote(e.知情原文) && e.知情原文.includes(person));
    if (candidate) {
      const event = {事件:candidate.事件.trim(), 角色:person, 指标:metric, 事实:candidate.事实原文.trim()};
      if (settled.some(e => same(e, event))) state[person][metric] = oldScore;
      else {
        state[person][metric] = Math.max(0, Math.min(100, newScore));
        settled.push(event);
      }
      continue;
    }
    if (newScore <= oldScore) continue;

    const gain = Math.max(0, Math.min(newScore - oldScore, perTurn, perDay - already, 100 - oldScore));
    state[person][metric] = oldScore + gain;
    if (gain) used[key] = already + gain;
  }

  state.剧情.当日关系增量 = {日期: day, 已用: used};
  state.剧情.已结算重大情感事件 = settled;
  state.剧情.重大情感申请 = [];
}
