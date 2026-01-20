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
  GET_TERMS_TYPES: `${API_BASE}/terms/types`,
  GET_TERMS_BY_TYPE: (type: TermsType) => `${API_BASE}/terms/type/${type}`,
} as const;

// ============================================================================
// 플랜 (Plans)
// ============================================================================

export const PLAN_ENDPOINTS = {
  // 전체 플랜 목록
  GET_PLANS: `${API_BASE}/plans`,

  // 플랜 관리 (관리자 전용)
  UPDATE_PLAN: (planId: number) => `${API_BASE}/plans/${planId}`,
} as const;

// ============================================================================
// 스토어 (Stores)
// ============================================================================
export const STORE_ENDPOINTS = {
  // 유저 스토어 목록 조회
  GET_MY_STORES: `${API_BASE}/stores/me`,
  // 플랫폼 목록 조회
  GET_PLATFORMS: `${API_BASE}/stores/platforms`,
  // 스토어 URL 중복 확인
  CHECK_STORE_URL: `${API_BASE}/stores/url-check`,
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
  // 스토어 삭제
  DELETE_STORE: (storeId: string | number) => `${API_BASE}/stores/${storeId}`,
  // 스토어 생성
  CREATE_STORE: `${API_BASE}/stores`,
  // 스토어별 상품 목록 조회
  GET_STORE_PRODUCTS: (storeId: string | number) =>
    `${API_BASE}/stores/${storeId}/products`,
  // 스토어 인증 이미지 업로드
  UPLOAD_VERIFICATION_IMAGE: (storeId: string | number) =>
    `${API_BASE}/stores/${storeId}/verification-image`,
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

  // 상품 정보 업데이트
  UPDATE_PRODUCT: (productId: string | number) =>
    `${API_BASE}/products/${productId}`,
} as const;

// ============================================================================
// 리플 (Replies)
// ============================================================================

export const REPLY_ENDPOINTS = {
  // 리플 목록 조회
  GET_REPLIES: `${API_BASE}/replies`,

  // 리플 테스트 (미리보기)
  TEST_REPLY: `${API_BASE}/replies/test`,
} as const;

// ============================================================================
// 사용량 (Usage)
// ============================================================================

export const USAGE_ENDPOINTS = {
  // 사용량 조회
  GET_QUOTA: `${API_BASE}/usage/quota`, // 구독 사용량
  GET_TEST_QUOTA: `${API_BASE}/usage/test-quota`, // 테스트 사용량
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
  CHANGE_PLAN: `${API_BASE}/users/me/plan`,
  CANCEL_PLAN: `${API_BASE}/users/me/plan`,
  REACTIVATE_PLAN: `${API_BASE}/users/me/plan/reactivate`,

  // 영수증 요청
  REQUEST_RECEIPT: `${API_BASE}/users/me/receipt`,

  // 약관 동의
  AGREE_TERMS: `${API_BASE}/users/me/terms-agreements`,

  // 알림 설정
  GET_NOTIFICATION_SETTINGS: `${API_BASE}/users/me/notification-settings`,
  UPDATE_NOTIFICATION_SETTINGS: `${API_BASE}/users/me/notification-settings`,

  // 본인인증
  VERIFY_IDENTITY: `${API_BASE}/users/me/verify-identity`,
} as const;

// ============================================================================
// 알림 (Reminders)
// ============================================================================

export const REMINDER_ENDPOINTS = {
  // 알림 조회
  GET_REMINDERS: `${API_BASE}/reminders`,
} as const;

// ============================================================================
// 문의 (Contacts)
// ============================================================================

export const CONTACT_ENDPOINTS = {
  // 문의 목록
  GET_CONTACTS: `${API_BASE}/contacts`,
  // 문의 생성
  CREATE_CONTACT: `${API_BASE}/contacts`,
  // 문의 단건 조회
  GET_CONTACT: (contactId: number) => `${API_BASE}/contacts/${contactId}`,
} as const;

// ============================================================================
// 작업 (Jobs)
// ============================================================================

export const JOB_ENDPOINTS = {
  // Job 상태 조회
  GET_JOB: (jobId: string) => `${API_BASE}/jobs/${jobId}`,
  // Job 진행도 SSE 스트림
  STREAM_JOB: (jobId: string) => `${API_BASE}/jobs/${jobId}/stream`,
} as const;

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
  REMINDER: REMINDER_ENDPOINTS,
  CONTACT: CONTACT_ENDPOINTS,
  JOB: JOB_ENDPOINTS,
} as const;
