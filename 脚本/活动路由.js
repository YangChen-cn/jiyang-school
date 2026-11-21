function campusEventPhase(activity, calendar, date, year) {
  const confirmed = calendar?.[activity.id];
  if (confirmed?.状态 === '已撤销') return {kind: 'cancelled', label: '正式通知已撤销。仅在被问及时回应通知与已发生的准备。'};
  if (confirmed?.状态 === '已结束') return {kind: 'after', label: '活动已结束。仅承接实际安排、公开结果与已发生的经历。'};

  const start = confirmed?.开始 || campusAnchor(activity.start, year);
  const end = confirmed?.结束 || campusAnchor(activity.end, year);
  if (!start) return {kind: 'undated', label: '日期未确认。按当年农历与已知安排回答，先核对日期。'};
  const range = start === end ? start : `${start} 至 ${end}`;
  const window = `${confirmed ? '正式日期' : '预计窗口'} ${range}`;
  if (date < start) return {kind: 'before', label: `${window}，尚未开始。只写询问与筹备。`};
  if (date > end) return {kind: 'after', label: `${window}，日期已过。只承接已经发生的事。`};
  if (confirmed) return {kind: 'live', label: `${window}。按当前时段、场所及实际安排判断是否正在进行。`};
  if (activity.id === 'summer-practice') return {kind: 'window', label: `${window}。可询问工读或家教机会，岗位和排班现场确认。`};
  return {kind: 'window', label: `${window}。可查通知或筹备，活动是否开始以当前现场为准。`};
}

function campusRoutes(periods, state) {
  const rawDate = state.世界?.日期;
  const hasDate = rawDate != null && rawDate !== '';
  const year = campusYear(state.世界?.起始年份);
  const date = hasDate ? campusDate(rawDate) : `${year}-09-01`;
  const calendarPeriod = campusPeriod(periods, date, year);
  const period = state.剧情?.学期 === '已毕业' ? campusPeriod(periods, date, year, '已毕业') : calendarPeriod;
  // The class can still hold its graduation gathering after a confirmed early ceremony.
  const activities = period?.id === '已毕业' && calendarPeriod?.id === '高三下'
    ? calendarPeriod.activities.filter(activity => activity.id === 'graduation-night') : period?.activities || [];
  const calendar = normalizeCampus(state.校园, date, periods.flatMap(p => (p.activities || []).map(a => a.id))).日程;
  const phases = Object.fromEntries(activities.map(a => [a.id, campusEventPhase(a, calendar, date, year)]));
  const location = state.世界?.当前位置;
  const focus = state.剧情?.校园活动;
  const active = hasDate ? activities.filter(a => ['window', 'live'].includes(phases[a.id].kind)) : [];
  const named = focus && active.find(a => a.name === focus || a.id === focus || a.aliases?.includes(focus));
  const onSite = active.filter(a => phases[a.id].kind === 'live' && a.routePlaces?.includes(location));
  return {period, phases, activate: named?.entry || (onSite.length === 1 ? onSite[0].entry : '')};
}
