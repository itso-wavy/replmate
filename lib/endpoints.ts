import { TermsType } from '@/types/enums';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
export const API_BASE_V1 = `${API_BASE}/v1`;

// ==========================================================
// 인증 & 세션 (OAuth, Session)
// ==========================================================

export const OAUTH_ENDPOINTS = {
  // OAuth 로그인 시작 (백엔드가 소셜 OAuth 처리)
  OAUTHS_SAMPLE: `${API_BASE_V1}/oauths/sample/callback`,
  KAKAO_LOGIN: `${API_BASE_V1}/oauths/kakao/login`,
  GOOGLE_LOGIN: `${API_BASE_V1}/oauths/google/login`,
  NAVER_LOGIN: `${API_BASE_V1}/oauths/naver/login`,
};

export const SESSION_ENDPOINTS = {
  LOGOUT: `${API_BASE_V1}/session/logout`,
} as const;

// ==========================================================
// 사용자 (Users)
// ==========================================================

export const USER_ENDPOINTS = {
  // 사용자 정보
  GET_USER: `${API_BASE_V1}/users/me`,

  // 사용자 탈퇴
  DELETE_USER: `${API_BASE_V1}/users/me`,

  // 사용자 상품 quota (스토어별 breakdown 포함)
  GET_PRODUCT_QUOTA: `${API_BASE_V1}/users/me/product-quota`,

  // 사용자 플랜
  GET_USER_PLAN: `${API_BASE_V1}/users/me/plan`,
  CHANGE_PLAN: `${API_BASE_V1}/users/me/plan`,
  CANCEL_PLAN: `${API_BASE_V1}/users/me/plan`,
  REACTIVATE_PLAN: `${API_BASE_V1}/users/me/plan/reactivate`,
  CANCEL_DOWNGRADE: `${API_BASE_V1}/users/me/plan/cancel-downgrade`,
  // 플랜 변경 미리보기 (업그레이드/다운그레이드 결제 금액 + 다음 결제일 안내)
  CHANGE_PLAN_PREVIEW: `${API_BASE_V1}/users/me/plan/change-preview`,

  // 영수증 요청
  REQUEST_RECEIPT: `${API_BASE_V1}/users/me/receipt`,

  // 약관 동의
  AGREE_TERMS: `${API_BASE_V1}/users/me/terms-agreements`,

  // 알림 설정
  GET_NOTIFICATION_SETTINGS: `${API_BASE_V1}/users/me/notification-settings`,
  UPDATE_NOTIFICATION_SETTINGS: `${API_BASE_V1}/users/me/notification-settings`,

  // KCP 본인확인 거래등록 (운영용, 인증창 호출 정보 발급)
  VERIFY_IDENTITY_KCP_TRADE_REG: `${API_BASE_V1}/users/me/verify-identity/kcp/trade-reg`,
  // [TEST] KCP 본인확인 시작 (개발/테스트 환경 전용, stg/prod 404)
  VERIFY_IDENTITY_KCP_TEST: `${API_BASE_V1}/users/me/verify-identity/kcp/test`,
} as const;

// ==========================================================
// 약관 (Terms)
// ==========================================================

export const TERMS_ENDPOINTS = {
  // 약관 조회
  GET_TERMS_LIST: `${API_BASE_V1}/terms`,
  GET_TERMS_BY_TYPE: (type: TermsType) => `${API_BASE_V1}/terms/type/${type}`,
} as const;

// ==========================================================
// 플랜 (Plans)
// ==========================================================

export const PLAN_ENDPOINTS = {
  // 전체 플랜 목록
  GET_PLANS: `${API_BASE_V1}/plans`,
} as const;

// ==========================================================
// 결제 (Payments)
// ==========================================================

export const PAYMENT_ENDPOINTS = {
  // 다날 결제창 시작 (server-driven AUTH 흐름)
  // POST → DanalAuthResponse(startUrl/startParams) 반환 → 프론트가 form POST로 결제창 진입
  // 결제 완료 후 다날이 서버 `/danal/callback`으로 콜백 → 서버가 frontend로 redirect
  DANAL_AUTH: (orderId: string | number) =>
    `${API_BASE_V1}/payments/danal/auth/${orderId}`,
  // 결제수단 변경 — 기존 빌링키 DELBILLKEY + 신규 AUTH(ISBILL=N)
  // 응답은 DANAL_AUTH와 동일한 DanalAuthResponse → form POST로 결제창 진입
  // 콜백 복귀: {frontend_url}/payments/danal/callback?status=success|error|cancel&orderId=...
  METHOD_CHANGE: `${API_BASE_V1}/payments/method/change`,
  // [TEST] 다날 결제 시작 (개발/테스트 환경 전용, stg/prod 404)
  DANAL_TEST: `${API_BASE_V1}/payments/danal/test`,
} as const;

// ==========================================================
// 스토어 (Stores)
// ==========================================================
export const STORE_ENDPOINTS = {
  // 유저 스토어 목록 조회 (경로 변경: /stores/me -> /users/me/stores)
  GET_MY_STORES: `${API_BASE_V1}/users/me/stores`,
  // 플랫폼 타입 목록 조회
  GET_PLATFORM_TYPES: `${API_BASE_V1}/stores/platform-types`,
  // 스토어 URL 중복 확인 (GET으로 변경, query param 사용)
  CHECK_STORE_URL: `${API_BASE_V1}/stores/url-check`,
  // 스토어 리플 옵션 조회
  GET_REPLY_OPTIONS: (storeId: string | number) =>
    `${API_BASE_V1}/stores/${storeId}/reply-options`,
  // 스토어 리플 옵션 수정
  UPDATE_REPLY_OPTIONS: (storeId: string | number) =>
    `${API_BASE_V1}/stores/${storeId}/reply-options`,
  // 스토어 상세 조회
  GET_STORE_DETAIL: (storeId: string | number) =>
    `${API_BASE_V1}/stores/${storeId}`,
  // 스토어 수정
  UPDATE_STORE: (storeId: string | number) =>
    `${API_BASE_V1}/stores/${storeId}`,
  // 스토어 삭제
  DELETE_STORE: (storeId: string | number) =>
    `${API_BASE_V1}/stores/${storeId}`,
  // 스토어 생성
  CREATE_STORE: `${API_BASE_V1}/stores`,
  // 스토어별 상품 목록 조회
  GET_STORE_PRODUCTS: (storeId: string | number) =>
    `${API_BASE_V1}/stores/${storeId}/products`,
  // Presigned URL 발급 (단건)
  GET_PRESIGNED_URL: `${API_BASE_V1}/stores/presigned-url`,
  // Presigned URL 일괄 발급 (최대 3개)
  GET_PRESIGNED_URLS: `${API_BASE_V1}/stores/presigned-urls`,
  // Presigned URL 테스트 업로드
  TEST_UPLOAD: `${API_BASE_V1}/stores/test-upload`,
  // 인증 이미지 업데이트 (imageKey 기반)
  UPDATE_VERIFICATION_IMAGE: (storeId: string | number) =>
    `${API_BASE_V1}/stores/${storeId}/verification-image`,
  // 스토어 벌크 업데이트
  UPDATE_STORES_BULK: `${API_BASE_V1}/users/me/stores`,
} as const;

// ==========================================================
// 상품 (Products)
// ==========================================================
export const PRODUCT_ENDPOINTS = {
  // 상품 조회 (스토어별)
  GET_PRODUCTS: (storeId: string | number) =>
    `${API_BASE_V1}/stores/${storeId}/products`,

  // 개별 상품 조회
  GET_PRODUCT_DETAIL: (productId: string | number) =>
    `${API_BASE_V1}/products/${productId}`,

  // 상품 정보 업데이트
  UPDATE_PRODUCT: (productId: string | number) =>
    `${API_BASE_V1}/products/${productId}`,
} as const;

// ==========================================================
// 리플 (Replies)
// ==========================================================

export const REPLY_ENDPOINTS = {
  // 리플 목록 조회
  GET_REPLIES: `${API_BASE_V1}/users/me/replies`,

  // 리플 테스트 (미리보기)
  TEST_REPLY: `${API_BASE_V1}/replies/test`,

  // 테스트 리플 결과 조회
  TEST_REPLY_RESULT: (jobId: string) => `${API_BASE_V1}/replies/test/${jobId}`,
} as const;

// ==========================================================
// 사용량 (Usage)
// ==========================================================

export const USAGE_ENDPOINTS = {
  // 사용량 조회
  GET_QUOTA: `${API_BASE_V1}/usage/quota`, // 구독 사용량
  GET_TEST_QUOTA: `${API_BASE_V1}/usage/test-quota`, // 테스트 사용량
  GET_USAGE_HISTORY: `${API_BASE_V1}/usage/history`, // 사용 내역
} as const;

// ==========================================================
// 알림 (Reminders)
// ==========================================================

export const REMINDER_ENDPOINTS = {
  // 알림 조회
  GET_REMINDERS: `${API_BASE_V1}/reminders`,
  // 알림 SSE 스트림 (생성/삭제 실시간 푸시)
  STREAM_REMINDERS: `${API_BASE_V1}/reminders/stream`,
} as const;

// ==========================================================
// 문의 (Contacts)
// ==========================================================

export const CONTACT_ENDPOINTS = {
  // 문의 생성
  CREATE_CONTACT: `${API_BASE_V1}/contacts`,
} as const;

// ==========================================================
// 작업 (Jobs)
// ==========================================================

export const JOB_ENDPOINTS = {
  // Job 상태 조회
  GET_JOB: (jobId: string) => `${API_BASE_V1}/jobs/${jobId}`,
  // Job 진행도 SSE 스트림
  STREAM_JOB: (jobId: string) => `${API_BASE_V1}/jobs/${jobId}/stream`,
} as const;

// ==========================================================
// 서비스 정보 (Service Info)
// ==========================================================
export const SERVICE_INFO_ENDPOINTS = {
  // 서비스 정보 조회
  GET_SERVICE_INFO: `${API_BASE_V1}/service-info`,
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
