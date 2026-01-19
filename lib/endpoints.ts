import { TermsType } from '@/types/enums';

export const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// ============================================================================
// 인증 & 세션 (OAuth, Session)
// ============================================================================

export const OAUTH_ENDPOINTS = {
  // OAuth 로그인
  // GET_KAKAO_CALLBACK: `${API_BASE}/oauths/kakao/login`,
  // GET_GOOGLE_CALLBACK: `${API_BASE}/oauths/google/login`,
  // GET_NAVER_CALLBACK: `${API_BASE}/oauths/naver/login`,
  KAKAO: `${API_BASE}/oauths/kakao`,
  GOOGLE: `${API_BASE}/oauths/google`,
  NAVER: `${API_BASE}/oauths/naver`,
};

export const SESSION_ENDPOINTS = {
  // 세션 관리
  SESSION_REFRESH: `${API_BASE}/session/refresh`,
  LOGOUT: `${API_BASE}/session/logout`,
} as const;

// ============================================================================
// 약관 (Terms)
// ============================================================================

export const TERMS_ENDPOINTS = {
  // 약관 조회
  GET_TERMS_LIST: `${API_BASE}/terms`,
  GET_TERMS_DETAIL: (type: TermsType) => `${API_BASE}/terms/${type}`,
} as const;

// ============================================================================
// 플랜 (Plans)
// ============================================================================

export const PLAN_ENDPOINTS = {
  // 전체 플랜 목록
  GET_PLANS: `${API_BASE}/plans`,
  // GET_USER_PLAN: `${API_BASE}/plan`,

  // // 플랜 관리
  // UPDATE_PLAN: `${API_BASE}/plan`,
  // DELETE_PLAN: `${API_BASE}/plan`,
} as const;

// ============================================================================
// 스토어 (Stores)
// ============================================================================
export const STORE_ENDPOINTS = {
  // 유저 스토어 목록 조회
  GET_MY_STORES: `${API_BASE}/stores/me`,
  // 플랫폼 목록 조회
  GET_PLATFORMS: `${API_BASE}/stores/platforms`,
  // 스토어 리플 옵션 조회
  GET_REPLY_OPTIONS: (storeId: string | number) =>
    `${API_BASE}/stores/${storeId}/reply-options`,
  // 스토어 리플 옵션 수정
  UPDATE_REPLY_OPTIONS: (storeId: string | number) =>
    `${API_BASE}/stores/${storeId}/reply-options`,
  // 스토어 상세 조회
  GET_STORE_DETAIL: (storeId: string | number) =>
    `${API_BASE}/stores/${storeId}`,
  // 스토어 활성화 상태 변경
  UPDATE_STORE_STATUS: (storeId: string | number) =>
    `${API_BASE}/stores/${storeId}`,
  DELETE_STORE: (storeId: string | number) => `${API_BASE}/stores/${storeId}`,
  CREATE_STORE: `${API_BASE}/stores`,
  // 스토어 URL 중복 확인
  CHECK_STORE_URL: `${API_BASE}/stores/url-check`,
  // 스토어별 상품 목록 조회
  GET_STORE_PRODUCTS: (storeId: string | number) =>
    `${API_BASE}/stores/${storeId}/products`,
} as const;

// ============================================================================
// 상품 (Products)
// ============================================================================
export const PRODUCT_ENDPOINTS = {
  // 상품 조회 (스토어별)
  GET_PRODUCTS: (storeId: string | number) =>
    `${API_BASE}/stores/${storeId}/products`,

  // 개별 상품 조회
  GET_PRODUCT_DETAIL: (productId: string | number) =>
    `${API_BASE}/products/${productId}`,

  UPDATE_PRODUCT: `${API_BASE}/products`,
} as const;

// ============================================================================
// 리플 (Replies)
// ============================================================================

export const REPLY_ENDPOINTS = {
  // 리플 생성
  CREATE_REPLY: `${API_BASE}/replies`,

  // 리플 테스트 (미리보기)
  TEST_REPLY: `${API_BASE}/replies/test`,
};

// ============================================================================
// 사용량 (Usage)
// ============================================================================

export const USAGE_ENDPOINTS = {
  // 사용량 조회
  GET_QUOTA: `${API_BASE}/usage/quota`, // 전체 할당량
  GET_FREE_QUOTA: `${API_BASE}/usage/free-quota`, // 무료 할당량
  GET_USAGE_HISTORY: `${API_BASE}/usage/history`, // 사용 내역
} as const;

// ============================================================================
// 사용자 (Users)
// ============================================================================

export const USER_ENDPOINTS = {
  // 사용자 정보
  GET_USER: `${API_BASE}/users/me`,

  // 사용자 탈퇴
  DELETE_USER: `${API_BASE}/users/me`,

  // 사용자 플랜
  GET_USER_PLAN: `${API_BASE}/users/me/plan`,

  // 약관 동의
  AGREE_TERMS: `${API_BASE}/users/me/terms-agreements`,

  // TODO: 본인인증
} as const;

// ============================================================================
// 알림 (Reminders)
// ============================================================================

// export const REMINDER_ENDPOINTS = {
//   // 알림 조회
//   GET_REMINDERS: `${API_BASE}/reminders`,
//   GET_REMINDER_DETAIL: (reminderId: string | number) =>
//     `${API_BASE}/reminders/${reminderId}`,
// } as const;

// ============================================================================
// 결제 (Receipt)
// ============================================================================

// export const PAYMENT_ENDPOINTS = {
//   // 영수증 요청
//   REQUEST_RECEIPT: `${API_BASE}/receipt`,
// } as const;

// ============================================================================
// API 메타데이터 (개발/참고용)
// ============================================================================

export const API_METADATA = {
  // 에러 상태 코드 매핑
  COMMON_ERRORS: {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
  },
} as const;

// ============================================================================
// 모든 엔드포인트 통합 (참고용)
// ============================================================================

export const ENDPOINTS = {
  OAUTH: OAUTH_ENDPOINTS,
  SESSION: SESSION_ENDPOINTS,
  TERMS: TERMS_ENDPOINTS,
  PLAN: PLAN_ENDPOINTS,
  STORE: STORE_ENDPOINTS,
  PRODUCT: PRODUCT_ENDPOINTS,
  REPLY: REPLY_ENDPOINTS,
  USAGE: USAGE_ENDPOINTS,
  USER: USER_ENDPOINTS,
  // REMINDER: REMINDER_ENDPOINTS,
  // PAYMENT: PAYMENT_ENDPOINTS,
} as const;
