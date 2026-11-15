// Shared by the message writeback and the read-only preview of old snapshots.
function normalizeCampus(value, today, activityIds) {
  const now = campusDate(today);
  const list = posts => Array.isArray(posts) ? posts.filter(post =>
    post && typeof post.标识 === 'string' && post.标识 && typeof post.标题 === 'string' && typeof post.摘要 === 'string'
  ) : [];
  const isNotice = post => post.渠道 === '公告' || post.渠道 === '班群';
  const knownActivity = post => isNotice(post) && activityIds.includes(post.活动标识);
  const dates = post => [campusDate(post.确认开始), campusDate(post.确认结束)];
  const scheduleRecord = (status, start, end) => {
    if (start && end && start <= end) return {状态: status, 开始: start, 结束: end};
    if (status === '已撤销' || status === '已结束') return {状态: status};
    return null;
  };
  const schedule = {};
  for (const id of activityIds) {
    const record = value?.日程?.[id];
    if (!['已确认', '已结束', '已撤销'].includes(record?.状态)) continue;
    const normalized = scheduleRecord(record.状态, campusDate(record.开始), campusDate(record.结束));
    if (normalized) {
      if (normalized.状态 === '已确认' && now && normalized.结束 < now) normalized.状态 = '已结束';
      schedule[id] = normalized;
    }
  }

  const legacy = list(value?.消息);
  // Only dated official notices, or explicit withdrawals of those notices,
  // may be promoted from the old mixed array.
  const legacyNotice = post => {
    const [start, end] = dates(post);
    const trustedGroup = post.渠道 === '班群' && /老师|班主任|班长|吴臻臻|教务|年级组|校方/.test(post.来源 || '');
    return (post.渠道 === '公告' || trustedGroup) && knownActivity(post) && (scheduleRecord('已确认', start, end) ||
      post.状态 === '已撤销' || (post.渠道 === '公告' && post.状态 === '已结束'));
  };
  const datedLegacy = legacy.filter(legacyNotice);
  const notices = [...datedLegacy, ...list(value?.有效公告).filter(isNotice)];
  const seenPosts = new Set();
  const seenActivities = new Set();
  const active = [];
  const soon = now ? Date.parse(now) + 7 * 86400000 : 0;
  for (let i = notices.length - 1; i >= 0; i--) {
    const post = notices[i];
    const id = knownActivity(post) ? post.活动标识 : null;
    if (seenPosts.has(post.标识) || (id && seenActivities.has(id))) continue;
    seenPosts.add(post.标识);
    if (id) seenActivities.add(id);
    const [start, end] = dates(post);
    const dated = start && end && start <= end;
    const existing = id ? schedule[id] : null;
    const result = post.状态 === '已撤销' ? '已撤销'
      : post.状态 === '已结束' || (dated && now && end < now) ? '已结束' : '已确认';
    if (result === '已确认' && !dated && ['已撤销', '已结束'].includes(existing?.状态)) continue;
    if (id) {
      const record = scheduleRecord(result, dated ? start : existing?.开始, dated ? end : existing?.结束);
      if (record) schedule[id] = record;
    }
    if (result === '已确认') active.push({post, i, near: Boolean(id && now && dated && Date.parse(start) <= soon)});
  }
  const announcements = active.sort((a, b) => Number(b.near) - Number(a.near) || b.i - a.i)
    .slice(0, 3).sort((a, b) => a.i - b.i).map(({post}) => post);
  const seenDynamics = new Set();
  const feed = [...legacy.filter(post => !legacyNotice(post)), ...list(value?.动态流)]
    .reverse().filter(post => {
      if (seenDynamics.has(post.标识) || seenPosts.has(post.标识)) return false;
      seenDynamics.add(post.标识);
      return true;
    }).slice(0, 6).reverse().map(post => {
      const {活动标识, 确认开始, 确认结束, ...dynamic} = post;
      return dynamic;
    });
  return {有效公告: announcements, 动态流: feed, 日程: schedule};
}
