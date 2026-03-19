export const CATEGORY_COLORS = {
  'UI/로직': { bg: '#fcfce6', border: '#f1dd00', text: '#786e00' },
  API연동: { bg: '#e6fcf5', border: '#0ca678', text: '#087f5b' },
  기타: { bg: '#e8edff', border: '#3b5bdb', text: '#1c3faa' },
  // 기타: { bg: '#f1f3f5', border: '#868e96', text: '#495057' },
  QA: { bg: '#fff0f6', border: '#c2255c', text: '#9a1239' },
};
export const CATEGORIES = Object.keys(CATEGORY_COLORS);

export const PRIORITY_META = {
  high: { label: '높음', color: '#e03131' },
  medium: { label: '보통', color: '#e69900' },
  low: { label: '낮음', color: '#495057' },
};

export const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
export const MONTHS = [
  { year: 2026, month: 3, label: 'March' },
  { year: 2026, month: 4, label: 'April' },
];
export const VISIBLE = 3;
