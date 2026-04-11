/** ------------------- 인증 타입 ------------------- */
// 인증 제공자
export enum AuthProvider {
  GOOGLE = 'google',
  KAKAO = 'kakao',
  NAVER = 'naver',
}

// 본인인증 제공자
export enum VerifyIdentityProvider {
  TEST = 'test', // 개발/테스트용 (항상 성공)
  PASS = 'pass', // PASS 본인인증 (추후 연동)
}

// 약관 타입
export enum TermsType {
  TERMS_OF_SERVICE = 'terms_of_service', // 서비스 이용약관
  PRIVACY_POLICY = 'privacy_policy', // 개인정보 처리방침
  PERSONAL_INFO_COLLECTION = 'privacy_consent', // 개인정보 수집 및 이용
  MARKETING_CONSENT = 'marketing_consent', // 마케팅 정보 수신 동의
}

/** ------------------- 구독 타입 ------------------- */
// 구독 모델(이걸 프론트에서 가지고 있어야 할까?)
export enum SubscriptionModel {
  BASIC = 'basic',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}

// 구독 상태 구분(PlanStatus)
export enum SubscriptionStatus {
  UNVERIFIED = 'unverified', // 미인증
  FREE = 'free', // 무료(인증 + 미결제)
  PAID_ACTIVE = 'active', // 유료(해지 없음)
  PAID_CANCEL_SCHEDULED = 'cancel_pending', // 유료(해지 대기)
  PAID_PLAN_DOWNGRADE_SCHEDULED = 'downgrade_scheduled', // 유료(하위 플랜으로 변경 예정, 상위 플랜 변경은 즉시 이뤄짐)
}

/** --------------------- 스토어 관련 타입 --------------------- */
// 스토어 상태
export enum StoreStatus {
  PENDING = 'pending', // 승인 대기
  REJECTED = 'rejected', // 반려
  INACTIVE = 'inactive', // 비활성
  ACTIVE = 'active', // 활성
  DEACTIVATING = 'deactivating', // 비활성화 예정
}

// 스토어 관리자 인증 상태
export enum VerificationStatus {
  PENDING = 'pending', // 검증 대기
  SUCCESS = 'success', // 검증 성공
  FAILED = 'failed', // 검증 실패
}

// 스토어 플랫폼 타입 (platform 하위 타입)
export enum PlatformType {
  SMARTSTORE = 'smartstore',
  BRANDSTORE = 'brandstore',
}

/** --------------------- 리플 옵션 타입 --------------------- */
// 리플 톤
export enum ReplyTone {
  FRIENDLY = 'friendly', // 친근한
  FORMAL = 'formal', // 격식있는
  AUTO = 'auto', // 자동
}

export const replyToneLabelMap: Record<ReplyTone, string> = {
  [ReplyTone.FRIENDLY]: '친근하게',
  [ReplyTone.FORMAL]: '정중하게',
  [ReplyTone.AUTO]: '자동(맞춤)',
} as const;

// 리플 길이(LengthType)
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

/** --------------------- 리플 타입 --------------------- */
// 리플 상태
export enum ReplyStatus {
  DRAFT = 'draft', // 초안 - AI가 생성한 상태, 아직 수정/내보내기 전
  EDITED = 'edited', // 수정됨 - 사용자가 텍스트를 수정한 상태
  EXPORTED = 'exported', // 내보내기됨 - 리플을 실제로 적용/내보낸 상태
  RESET = 'reset', // 리셋됨 - 다시 생성하거나 초기화한 상태
}

/** --------------------- 알림(Reminder) 타입 --------------------- */
// 리마인더 카테고리
export type ReminderCategory = 'plan' | 'store' | 'product';

// 리마인더 레벨
export enum ReminderLevel {
  SUCCESS = 'SUCCESS',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

// 리마인더 이벤트 (백엔드 ReminderEvent)
export enum ReminderEvent {
  // ERROR
  PAYMENT_FAILED = 'PAYMENT_FAILED',

  // WARNING
  STORE_VERIFICATION_REJECTED = 'STORE_VERIFICATION_REJECTED',
  STORE_CONNECTION_REQUIRED = 'STORE_CONNECTION_REQUIRED',
  STORE_ADJUSTMENT_REQUIRED = 'STORE_ADJUSTMENT_REQUIRED',
  PRODUCT_ADJUSTMENT_REQUIRED = 'PRODUCT_ADJUSTMENT_REQUIRED',

  // INFO
  STORE_ADJUSTMENT_SCHEDULED = 'STORE_ADJUSTMENT_SCHEDULED',
  PRODUCT_ADJUSTMENT_SCHEDULED = 'PRODUCT_ADJUSTMENT_SCHEDULED',
}

// 이벤트별 meta 타입
export interface PaymentFailedMeta {
  daysUntilDowngrade: number;
}
export interface StoreVerificationRejectedMeta {
  storeId: number;
  storeName: string;
  reason: string;
}
export interface AdjustmentRequiredMeta {
  planId: number;
  planName: string;
  dueDate: string;
  currentStoreCount: number;
  currentProductCount: number;
  maxStoreCount: number;
  maxProductCount: number;
}
export interface AdjustmentScheduledMeta {
  planId: number;
  planName: string;
  effectiveDate: string;
  maxStoreCount: number;
  maxProductCount: number;
}

export type ReminderMeta =
  | PaymentFailedMeta
  | StoreVerificationRejectedMeta
  | AdjustmentRequiredMeta
  | AdjustmentScheduledMeta
  | Record<string, never>;

/** --------------------- 기타 타입 --------------------- */
// Job 상태 타입 정의
export enum JobStatus {
  WAITING = 'waiting',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

// Job 타입 정의
export enum JobType {
  STORE_SCRAPING = 'store_scraping',
  PRODUCT_REPLY = 'product_reply',
  AI_REPLY = 'ai_reply',
  TEST_REPLY = 'test_reply',
  SCHEDULED_SCRAPING = 'scheduled_scraping',
  SUBSCRIPTION_CHECK = 'subscription_check',
}

// 사용량 이벤트 타입
export enum UsageEventType {
  FREE_GRANT = 'free_grant', // 무료 지급 사용량
  SUBSCRIPTION_GRANT = 'subscription_grant', // 구독 지급 사용량
  USE = 'use', // 구독 사용량 소비
  TEST_USE = 'test_use', // 테스트 사용량 소비
  TEST_GRANT = 'test_grant', // 테스트 사용량 부여
  MANUAL_ADJUST = 'manual_adjust', // 수동 조정
}

// 연락처 문의 상태
export enum ContactStatus {
  RECEIVED = 'received', // 접수
  IN_PROGRESS = 'in_progress', // 처리 중
  ANSWERED = 'answered', // 답변 완료
}
