export const CATEGORY_COLORS = {
  개발: { bg: '#e8edff', border: '#3b5bdb', text: '#1c3faa' },
  QA: { bg: '#fff0f6', border: '#c2255c', text: '#9a1239' },
  배포: { bg: '#f3f0ff', border: '#7048e8', text: '#4c2889' },
  기획: { bg: '#f3fbe8', border: '#2f9e44', text: '#1e6e2d' },
  디자인: { bg: '#fff3e0', border: '#e67700', text: '#b35900' },
  기타: { bg: '#f1f3f5', border: '#868e96', text: '#495057' },
};
export const CATEGORIES = Object.keys(CATEGORY_COLORS);

export const PRIORITY_META = {
  high: { label: '높음', color: '#e03131' },
  medium: { label: '보통', color: '#e67700' },
  low: { label: '낮음', color: '#2f9e44' },
};

export const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
export const MONTHS = [
  { year: 2026, month: 3, label: 'March' },
  { year: 2026, month: 4, label: 'April' },
];
export const VISIBLE = 3;
export const TODAY_STR = new Date().toISOString().slice(0, 10);
