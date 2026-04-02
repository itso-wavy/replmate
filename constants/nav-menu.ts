// (public)
export const LANDING_SECTIONS = {
  HERO: 'hero',
  FEATURES: 'features',
  PRICE: 'price',
  SUPPORT: 'support',
} as const;

export const LANDING_GNB_MENU = [
  {
    label: '서비스 소개',
    href: `/#${LANDING_SECTIONS.FEATURES}`,
  },
  {
    label: '요금제',
    href: `/#${LANDING_SECTIONS.PRICE}`,
  },
  {
    label: '고객지원',
    href: `/#${LANDING_SECTIONS.SUPPORT}`,
  },
] as const;

// (private)
export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  TERMS_AGREEMENT: '/terms-agreement',
  DASHBOARD: '/dashboard',
  STORES: '/stores',
  PRODUCTS: '/products',
  OPTIONS: '/options',
  REPLYS: '/replys',
  SETTINGS: '/settings',
  SUBSCRIBE: '/settings/subscribe',
  ACCOUNT: '/settings/account',
} as const;

export const DASHBOARD_MENU = [
  {
    label: '대시보드',
    href: ROUTES.DASHBOARD,
  },
  {
    label: '쇼핑몰 관리',
    href: ROUTES.STORES,
  },
  {
    label: '상품 관리',
    href: ROUTES.PRODUCTS,
  },
  {
    label: '리플 옵션',
    href: ROUTES.OPTIONS,
  },
  {
    label: '리플 확인',
    href: ROUTES.REPLYS,
  },
  {
    label: '구독 관리',
    href: ROUTES.SUBSCRIBE,
  },
] as const;

export const SETTINGS_MENU = [
  { label: '구독 관리', href: ROUTES.SUBSCRIBE },
  { label: '계정 관리', href: ROUTES.ACCOUNT },
] as const;
