// ─── 유틸 ────────────────────────────────────
export function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}
export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
export function pad(n) {
  return String(n).padStart(2, '0');
}
export function toStr(y, m, d) {
  return `${y}-${pad(m)}-${pad(d)}`;
}
export function toNum(s) {
  return s ? parseInt(s.replace(/-/g, ''), 10) : 0;
}
export function shiftDate(s, days) {
  const d = new Date(s);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
export function buildWeeks(year, month) {
  const firstDow = new Date(year, month - 1, 1).getDay();
  const total = new Date(year, month, 0).getDate();
  const weeks = [];
  let week = Array(firstDow).fill(null);
  for (let d = 1; d <= total; d++) {
    week.push({ day: d, year, month });
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}
export function isPast(t) {
  return toNum(t.end_date) < toNum(getTodayStr());
}

export const emptyTask = dateStr => ({
  id: uid(),
  name: '',
  estimated_hours: '',
  priority: 'medium',
  start_date: dateStr || getTodayStr(),
  end_date: dateStr || getTodayStr(),
  category: 'UI/로직',
  note: '',
  actual_hours: null,
});
