/** 리플 옵션 타입 */
// 리플 톤
export enum ReplyTone {
  FRIENDLY = 'friendly',
  FORMAL = 'formal',
  AUTO = 'auto',
}

export const replyToneLabelMap: Record<ReplyTone, string> = {
  [ReplyTone.FRIENDLY]: '친근하게',
  [ReplyTone.FORMAL]: '정중하게',
  [ReplyTone.AUTO]: '자동(맞춤)',
} as const;

// 리플 길이
export enum ReplyLength {
  SHORT = 'short',
  LONG = 'long',
  AUTO = 'auto',
}

export const replyLengthLabelMap: Record<ReplyLength, string> = {
  [ReplyLength.SHORT]: '짧게',
  [ReplyLength.AUTO]: '자동(맞춤)',
  [ReplyLength.LONG]: '길게',
} as const;

export const replyLengthSteps: ReplyLength[] = [
  ReplyLength.SHORT,
  ReplyLength.AUTO,
  ReplyLength.LONG,
];

// 이모지 포함 여부
export const replyEmojiOptions = [
  { value: true, label: '포함' },
  { value: false, label: '미포함' },
] as const;

/** 스토어 관련 타입 */
// 스토어 관리자 인증 상태
export enum VerificationStatus {
  PENDING = 'pending', // 검증 대기
  SUCCESS = 'success', // 검증 성공
  FAILED = 'failed', // 검증 실패
}

// 스토어 플랫폼 타입
export enum PlatformType {
  // FIXME: API가 'naver'를 반환 중 — 백엔드에서 값 통일 후 제거 필요
  NAVER_SMART_STORE = 'naver',
  NAVER_BRAND_STORE = 'naver_brand_store',
}

// 스토어 상태 (Swagger 260207 기준)
export type StoreStatus =
  | 'pending' // 승인 대기
  | 'rejected' // 반려
  | 'inactive' // 비활성
  | 'active' // 활성
  | 'deactivating'; // 비활성화 예정

// 리플 상태 (Swagger 기준)
export type ReplyStatus = 'draft' | 'edited' | 'exported' | 'reset';

// 구독 상태
export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  TRIAL = 'trial',
  PAST_DUE = 'past_due',
}

// 인증 제공자
export enum AuthProvider {
  GOOGLE = 'google',
  KAKAO = 'kakao',
  NAVER = 'naver',
}

// 약관 타입
export enum TermsType {
  TERMS_OF_SERVICE = 'terms_of_service', // 서비스 이용약관
  PRIVACY_POLICY = 'privacy_policy', // 개인정보 처리방침
  PERSONAL_INFO_COLLECTION = 'privacy_consent', // 개인정보 수집 및 이용
  MARKETING_CONSENT = 'marketing_consent', // 마케팅 정보 수신 동의
}

/** 알림 */
// 알림 타입
export enum ReminderType {
  SUBSCRIPTION_STORE_CHANGE = 'subscription_store_change', // 구독 플랜 변경으로 인한 쇼핑몰 수 조정 알림
  SUBSCRIPTION_PRODUCT_CHANGE = 'subscription_product_change', // 구독 플랜 변경으로 인한 상품수 조정 알림
  STORE_VERIFICATION_REJECTED = 'store_verification_rejected', // 쇼핑몰 관리자 인증 반려 알림
  STORE_CONNECTION_REQUIRED = 'store_connection_required', // 쇼핑몰 연동 필요 알림
}

// 알림 상태
export enum ReminderStatus {
  ACTIVE = 'active', // 현재 표시 중인 알림
  EXPIRED = 'expired', // 만료되어 더 이상 표시되지 않는 알림
}

// 사용량 이벤트 타입
export enum UsageEventType {
  FREE_GRANT = 'free_grant', // 무료 지급 사용량
  SUBSCRIPTION_GRANT = 'subscription_grant', // 구독 지급 사용량
  USE = 'use', // 사용
  MANUAL_ADJUST = 'manual_adjust', // 수동 조정
}

// 연락처 문의 상태
export enum ContactStatus {
  RECEIVED = 'received', // 접수
  IN_PROGRESS = 'in_progress', // 처리 중
  ANSWERED = 'answered', // 답변 완료
}

// TODO: 알람 클라이언트 선언 타입
export enum AlertType {
  // Error
  PAYMENT_FAILED = 'PAYMENT_FAILED ',

  // Warning
  STORE_AUTH_REJECTED = 'STORE_AUTH_REJECTED ',
  STORE_ADJUSTMENT_REQUIRED = 'STORE_ADJUSTMENT_REQUIRED ',
  PRODUCT_ADJUSTMENT_REQUIRED = 'PRODUCT_ADJUSTMENT_REQUIRED',
  STORE_CONNECTION_REQUIRED = 'STORE_CONNECTION_REQUIRED ',
  STORE_ADJUSTMENT_REQUIRED_DETAIL = 'STORE_ADJUSTMENT_REQUIRED_DETAIL',
  PRODUCT_ADJUSTMENT_REQUIRED_DETAIL = 'PRODUCT_ADJUSTMENT_REQUIRED_DETAIL',

  // Info
  STORE_ADJUSTMENT_SCHEDULED = 'STORE_ADJUSTMENT_SCHEDULED ',
  PRODUCT_ADJUSTMENT_SCHEDULED = 'PRODUCT_ADJUSTMENT_SCHEDULED',
}

// 리마인더 카테고리 (Swagger 기준)
export type ReminderCategory = 'plan' | 'store' | 'product';

// 리마인더 레벨 (Swagger 기준)
export type ReminderLevel = 'INFO' | 'WARNING' | 'ERROR';

// 리마인더 이벤트 (Swagger 기준)
export type ReminderEvent =
  | 'plan_expiring_soon'
  | 'plan_expired'
  | 'quota_running_low'
  | 'store_verification_required'
  | 'store_auth_expired'
  | 'product_sync_needed'
  | 'product_limit_reached';
