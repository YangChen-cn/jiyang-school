// Shared by the prompt, calendar and MVU. Dates are in the story's local calendar.
function campusDate(value) {
  const date = typeof value === 'string' ? value.replaceAll('/', '-') : '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return '';
  const parsed = new Date(date + 'T12:00:00Z');
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date ? date : '';
}

function campusYear(value) {
  const year = Number(value);
  return Number.isInteger(year) && year >= 1000 && year <= 9900 ? year : 2020;
}

function campusAnchor(edge, year) {
  return edge ? `${year + edge[0]}-${edge[1]}` : '';
}

function campusPeriod(periods, date, year, academic) {
  if (academic === '已毕业') return periods.find(period => period.id === '已毕业');
  date = campusDate(date);
  if (!date) return null;
  return periods.find(period => date >= campusAnchor(period.start, year) && date <= campusAnchor(period.end, year)) || null;
}

function campusAgeAt(birthday, date) {
  const birth = campusDate(birthday);
  const now = campusDate(date);
  if (!birth || !now || birth > now) return null;
  return Number(now.slice(0, 4)) - Number(birth.slice(0, 4)) - Number(now.slice(5) < birth.slice(5));
}

function campusPlayerClass(identity, academic) {
  // Keep custom identities, transfers and class changes from the story.
  if (identity !== '暨阳中学高二重点班学生' && identity !== '暨阳中学高三重点班学生') return identity;
  if (academic === '已毕业') return '暨阳中学毕业生';
  if (academic === '高三上' || academic === '高三下') return '暨阳中学高三重点班学生';
  return identity;
}
