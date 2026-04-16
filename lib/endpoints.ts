import { TermsType } from '@/types/enums';

export const API_BASE = process.env.NEXT_PUBLIC_API_URL;
export const VERSION = process.env.NEXT_PUBLIC_API_VERSION;

// ==========================================================
// 인증 & 세션 (OAuth, Session)
// ==========================================================

export const OAUTH_ENDPOINTS = {
  // OAuth 로그인 시작 (백엔드가 소셜 OAuth 처리)
  OAUTHS_SAMPLE: `${API_BASE}/${VERSION}/oauths/sample/callback`,
  KAKAO_LOGIN: `${API_BASE}/${VERSION}/oauths/kakao/login`,
  GOOGLE_LOGIN: `${API_BASE}/${VERSION}/oauths/google/login`,
  NAVER_LOGIN: `${API_BASE}/${VERSION}/oauths/naver/login`,
};

export const SESSION_ENDPOINTS = {
  LOGOUT: `${API_BASE}/${VERSION}/session/logout`,
} as const;

// ==========================================================
// 사용자 (Users)
// ==========================================================

export const USER_ENDPOINTS = {
  // 사용자 정보
  GET_USER: `${API_BASE}/${VERSION}/users/me`,

  // 사용자 탈퇴
  DELETE_USER: `${API_BASE}/${VERSION}/users/me`,

  // 사용자 플랜
  GET_USER_PLAN: `${API_BASE}/${VERSION}/users/me/plan`,
  CHANGE_PLAN: `${API_BASE}/${VERSION}/users/me/plan`,
  CANCEL_PLAN: `${API_BASE}/${VERSION}/users/me/plan`,
  REACTIVATE_PLAN: `${API_BASE}/${VERSION}/users/me/plan/reactivate`,
  CANCEL_DOWNGRADE: `${API_BASE}/${VERSION}/users/me/plan/cancel-downgrade`,

  // 영수증 요청
  REQUEST_RECEIPT: `${API_BASE}/${VERSION}/users/me/receipt`,

  // 약관 동의
  AGREE_TERMS: `${API_BASE}/${VERSION}/users/me/terms-agreements`,

  // 알림 설정
  GET_NOTIFICATION_SETTINGS: `${API_BASE}/${VERSION}/users/me/notification-settings`,
  UPDATE_NOTIFICATION_SETTINGS: `${API_BASE}/${VERSION}/users/me/notification-settings`,

  // 본인인증
  VERIFY_IDENTITY: `${API_BASE}/${VERSION}/users/me/verify-identity`,
  VERIFY_IDENTITY_PROVIDERS: `${API_BASE}/${VERSION}/users/me/verify-identity/providers`,
} as const;

// ==========================================================
// 약관 (Terms)
// ==========================================================

export const TERMS_ENDPOINTS = {
  // 약관 조회
  GET_TERMS_LIST: `${API_BASE}/${VERSION}/terms`,
  GET_TERMS_TYPES: `${API_BASE}/${VERSION}/terms/types`,
  GET_TERMS_BY_TYPE: (type: TermsType) => `${API_BASE}/${VERSION}/terms/type/${type}`,
} as const;

// ==========================================================
// 플랜 (Plans)
// ==========================================================

export const PLAN_ENDPOINTS = {
  // 전체 플랜 목록
  GET_PLANS: `${API_BASE}/${VERSION}/plans`,
} as const;

// ==========================================================
// 결제 (Payments)
// ==========================================================

export const PAYMENT_ENDPOINTS = {
  // 결제 콜백 응답 샘플
  SAMPLE_CALLBACK: `${API_BASE}/${VERSION}/payments/sample/callback`,
  // Mock 결제 처리
  MOCK_PAYMENT: (orderId: string) => `${API_BASE}/${VERSION}/payments/mock/${orderId}`,
  // 토스 결제 콜백
  TOSS_CALLBACK: `${API_BASE}/${VERSION}/payments/toss/callback`,
} as const;

// ==========================================================
// 스토어 (Stores)
// ==========================================================
export const STORE_ENDPOINTS = {
  // 유저 스토어 목록 조회 (경로 변경: /stores/me -> /users/me/stores)
  GET_MY_STORES: `${API_BASE}/${VERSION}/users/me/stores`,
  // 플랫폼 목록 조회
  GET_PLATFORMS: `${API_BASE}/${VERSION}/stores/platforms`,
  // 플랫폼 타입 목록 조회
  GET_PLATFORM_TYPES: `${API_BASE}/${VERSION}/stores/platform-types`,
  // 스토어 URL 중복 확인 (GET으로 변경, query param 사용)
  CHECK_STORE_URL: `${API_BASE}/${VERSION}/stores/url-check`,
  // 스토어 리플 옵션 조회
  GET_REPLY_OPTIONS: (storeId: string | number) =>
    `${API_BASE}/${VERSION}/stores/${storeId}/reply-options`,
  // 스토어 리플 옵션 수정
  UPDATE_REPLY_OPTIONS: (storeId: string | number) =>
    `${API_BASE}/${VERSION}/stores/${storeId}/reply-options`,
  // 스토어 상세 조회
  GET_STORE_DETAIL: (storeId: string | number) =>
    `${API_BASE}/${VERSION}/stores/${storeId}`,
  // 스토어 수정
  UPDATE_STORE: (storeId: string | number) => `${API_BASE}/${VERSION}/stores/${storeId}`,
  // 스토어 삭제
  DELETE_STORE: (storeId: string | number) => `${API_BASE}/${VERSION}/stores/${storeId}`,
  // 스토어 생성
  CREATE_STORE: `${API_BASE}/${VERSION}/stores`,
  // 스토어별 상품 목록 조회
  GET_STORE_PRODUCTS: (storeId: string | number) =>
    `${API_BASE}/${VERSION}/stores/${storeId}/products`,
  // Presigned URL 발급
  GET_PRESIGNED_URL: `${API_BASE}/${VERSION}/stores/presigned-url`,
  // Presigned URL 테스트 업로드
  TEST_UPLOAD: `${API_BASE}/${VERSION}/stores/test-upload`,
  // 인증 이미지 업데이트 (imageKey 기반)
  UPDATE_VERIFICATION_IMAGE: (storeId: string | number) =>
    `${API_BASE}/${VERSION}/stores/${storeId}/verification-image`,
  // 스토어 벌크 업데이트
  UPDATE_STORES_BULK: `${API_BASE}/${VERSION}/users/me/stores`,
} as const;

// ==========================================================
// 상품 (Products)
// ==========================================================
export const PRODUCT_ENDPOINTS = {
  // 상품 조회 (스토어별)
  GET_PRODUCTS: (storeId: string | number) =>
    `${API_BASE}/${VERSION}/stores/${storeId}/products`,

  // 개별 상품 조회
  GET_PRODUCT_DETAIL: (productId: string | number) =>
    `${API_BASE}/${VERSION}/products/${productId}`,

  // 상품 정보 업데이트
  UPDATE_PRODUCT: (productId: string | number) =>
    `${API_BASE}/${VERSION}/products/${productId}`,
} as const;

// ==========================================================
// 리플 (Replies)
// ==========================================================

export const REPLY_ENDPOINTS = {
  // 리플 목록 조회
  GET_REPLIES: `${API_BASE}/${VERSION}/users/me/replies`,

  // 리플 테스트 (미리보기)
  TEST_REPLY: `${API_BASE}/${VERSION}/replies/test`,

  // 테스트 리플 결과 조회
  TEST_REPLY_RESULT: (jobId: string) => `${API_BASE}/${VERSION}/replies/test/${jobId}`,
} as const;

// ==========================================================
// 사용량 (Usage)
// ==========================================================

export const USAGE_ENDPOINTS = {
  // 사용량 조회
  GET_QUOTA: `${API_BASE}/${VERSION}/usage/quota`, // 구독 사용량
  GET_TEST_QUOTA: `${API_BASE}/${VERSION}/usage/test-quota`, // 테스트 사용량
  GET_USAGE_HISTORY: `${API_BASE}/${VERSION}/usage/history`, // 사용 내역
} as const;

// ==========================================================
// 알림 (Reminders)
// ==========================================================

export const REMINDER_ENDPOINTS = {
  // 알림 조회
  GET_REMINDERS: `${API_BASE}/${VERSION}/reminders`,
} as const;

// ==========================================================
// 문의 (Contacts)
// ==========================================================

export const CONTACT_ENDPOINTS = {
  // 문의 생성
  CREATE_CONTACT: `${API_BASE}/${VERSION}/contacts`,
} as const;

// ==========================================================
// 작업 (Jobs)
// ==========================================================

export const JOB_ENDPOINTS = {
  // Job 상태 조회
  GET_JOB: (jobId: string) => `${API_BASE}/${VERSION}/jobs/${jobId}`,
  // Job 진행도 SSE 스트림
  STREAM_JOB: (jobId: string) => `${API_BASE}/${VERSION}/jobs/${jobId}/stream`,
} as const;

// ==========================================================
// 서비스 정보 (Service Info)
// ==========================================================
export const SERVICE_INFO_ENDPOINTS = {
  // 서비스 정보 조회
  GET_SERVICE_INFO: `${API_BASE}/${VERSION}/service-info`,
} as const;

// ==========================================================
// API 메타데이터 (개발/참고용)
// ==========================================================

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

// ==========================================================
// 모든 엔드포인트 통합 (참고용)
// ==========================================================

export const ENDPOINTS = {
  OAUTH: OAUTH_ENDPOINTS,
  SESSION: SESSION_ENDPOINTS,
  USER: USER_ENDPOINTS,
  TERMS: TERMS_ENDPOINTS,
  PLAN: PLAN_ENDPOINTS,
  PAYMENT: PAYMENT_ENDPOINTS,
  STORE: STORE_ENDPOINTS,
  PRODUCT: PRODUCT_ENDPOINTS,
  REPLY: REPLY_ENDPOINTS,
  USAGE: USAGE_ENDPOINTS,
  REMINDER: REMINDER_ENDPOINTS,
  CONTACT: CONTACT_ENDPOINTS,
  JOB: JOB_ENDPOINTS,
  SERVICE_INFO: SERVICE_INFO_ENDPOINTS,
} as const;
