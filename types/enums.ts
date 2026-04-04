/** ------------------- 인증 타입 ------------------- */
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

/** ------------------- 구독 타입 ------------------- */
// 구독 모델(이걸 프론트에서 가지고 있어야 할까?)
export enum SubscriptionModel {
  BASIC = 'basic',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}

// 구독 상태 구분(PlanStatus)
export enum SubscriptionStatus {
  UNVERIFIED = 'pending', // 미인증
  FREE = 'free', // 무료(인증 + 미결제)
  PAID_ACTIVE = 'active', // 유료(해지 없음)
  PAID_CANCEL_SCHEDULED = 'CANCEL_PENDING', // 유료(해지 대기)
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

// 스토어 플랫폼 타입
export enum PlatformType {
  // FIXME: API가 'naver'를 반환 중 — 백엔드에서 값 통일 후 제거 필요
  NAVER_SMART_STORE = 'naver',
  NAVER_BRAND_STORE = 'naver_brand_store',
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

/** --------------------- 알림 타입 --------------------- */
// 요청 카테고리
export type AlertCategory = 'plan' | 'store' | 'product';

// 요청 레벨
export type AlertLevel = 'INFO' | 'WARNING' | 'ERROR';

// 알림 타입
export enum AlertType {
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

// 알람 클라이언트 선언 타입 // TODO: toAlert 변경하면서 삭제 대상
export enum CAlertType {
  STORE_AUTH_REJECTED = 'STORE_AUTH_REJECTED ',
  STORE_ADJUSTMENT_REQUIRED_DETAIL = 'STORE_ADJUSTMENT_REQUIRED_DETAIL',
  PRODUCT_ADJUSTMENT_REQUIRED_DETAIL = 'PRODUCT_ADJUSTMENT_REQUIRED_DETAIL',
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

export type AlertsMeta =
  | PaymentFailedMeta
  | StoreVerificationRejectedMeta
  | AdjustmentRequiredMeta
  | AdjustmentScheduledMeta
  | Record<string, never>;

/** --------------------- 기타 타입 --------------------- */
export enum JobStatus {
  WAITING = 'waiting',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

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
