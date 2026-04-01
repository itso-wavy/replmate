export const SECTION_ID = {
  HERO: 'hero',
  FEATURES: 'features',
  PRICE: 'price',
  SUPPORT: 'support',
} as const;

export const GNB_MENU = [
  {
    label: '서비스 소개',
    href: '/#features',
  },
  {
    label: '요금제',
    href: '/#price',
  },
  {
    label: '고객지원',
    href: '/#support',
  },
];

export const DASHBOARD_MENU = [
  {
    label: '대시보드',
    href: '/dashboard',
  },
  {
    label: '쇼핑몰 관리',
    href: '/stores',
  },
  {
    label: '상품 관리',
    href: '/products',
  },
  {
    label: '리플 옵션',
    href: '/options',
  },
  {
    label: '리플 확인',
    href: '/replys',
  },
  {
    label: '구독 관리',
    href: '/settings/subscribe',
  },
];

export const SETTINGS_MENU = [
  { label: '구독 관리', href: '/settings/subscribe' },
  { label: '계정 관리', href: '/settings/account' },
];
