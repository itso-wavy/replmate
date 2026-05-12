import type {
  CancelDowngradeResponse,
  CancelSubscriptionResponse,
  ChangePlanNextPayment,
  ChangePlanPreviewResponse,
  ChangePlanResponse,
  DowngradeInfoDto,
  NotificationSettingsDto,
  PaymentMethodDto,
  ReactivateSubscriptionResponse,
  ReceiptRequestResultDto,
  SubscriptionDto,
  UserDto,
} from '@/types/api/user';
import { AuthProvider, SubscriptionStatus } from '@/types/enums';

import type { PlanDomain } from './plan';
import { toPlanDomain } from './plan';

// Re-export PlanDomain for convenience
export type { PlanDomain };

// ==========================================================
// 사용자 도메인
// ==========================================================

/**
 * 사용자 도메인 모델
 */
export interface UserDomain {
  id: number;
  email: string | null;
  name: string | null;
  phoneNumber: string | null;
  authProvider: AuthProvider | null;
  authProviderId: string | null;
  isVerified: boolean;
  verifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  needsTermsAgreement: boolean;
}

/**
 * 구독 정보 도메인
 */
export interface SubscriptionDomain {
  id: number;
  status: string;
  startedAt: Date;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt: Date | null;
}

/**
 * 다운그레이드 예약 정보
 */
export interface DowngradeDomain {
  plan: PlanDomain;
  effectiveDate: Date;
}

/**
 * 등록된 결제수단 (다날 BillKey 표시 정보)
 */
export interface PaymentMethodDomain {
  cardCompany: string | null;
  cardNumber: string | null;
}

/**
 * 사용자 플랜 정보 (플랜 + 구독 + 결제수단)
 */
export interface UserPlanDomain {
  planStatus: SubscriptionStatus;
  plan: PlanDomain;
  subscription: SubscriptionDomain;
  downgrade: DowngradeDomain | null;
  paymentMethod: PaymentMethodDomain | null;
}

/**
 * 사용자 + 플랜 + 구독 통합 정보
 */
export interface UserWithPlanDomain {
  user: UserDomain;
  plan: PlanDomain;
  subscription: SubscriptionDomain;
}

/**
 * 영수증 발급 요청 도메인
 */
export interface ReceiptRequestDomain {
  id: number;
  status: 'pending' | 'completed' | 'rejected';
  requestedAt: Date;
  processedAt: Date | null;
  note: string | null;
}

/**
 * 알림 설정 도메인
 */
export interface NotificationSettingsDomain {
  emailEnabled: boolean;
  smsEnabled: boolean;
  updatedAt: Date;
}

/**
 * 플랜 변경 응답 도메인 (업그레이드 / 다운그레이드 통합)
 */
export interface ChangePlanDomain {
  isUpgrade: boolean;
  fromPlanName: string;
  toPlanName: string;
  orderId: number | null;
  amount: number | null;
  /** @deprecated 결제창 진입 경로는 별도 분기로 결정 */
  paymentUrl: string | null;
  paymentPending: boolean;
  scheduledAt: Date | null;
}

/**
 * 플랜 변경 미리보기 - 다음 결제 안내
 */
export interface ChangePlanNextPaymentDomain {
  billingDate: Date;
  amount: number;
  replyQuotaLimit: number;
  immediateAvailableReplyQuota: number | null;
}

/**
 * 플랜 변경 미리보기 응답 도메인
 */
export interface ChangePlanPreviewDomain {
  isUpgrade: boolean;
  currentPlan: PlanDomain;
  targetPlan: PlanDomain;
  cancelAtPeriodEndScheduled: boolean;
  nextPayment: ChangePlanNextPaymentDomain;
  remainingDays: number | null;
}

/**
 * 구독 취소 응답 도메인
 */
export interface CancelSubscriptionDomain {
  subscriptionId: number;
  planName: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

/**
 * 구독 재활성화 응답 도메인
 */
export interface ReactivateSubscriptionDomain {
  subscriptionId: number;
  planName: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

/**
 * 다운그레이드 예약 취소 응답 도메인
 */
export interface CancelDowngradeDomain {
  subscriptionId: number;
  planName: string;
  currentPeriodEnd: Date;
}

// ==========================================================
// 변환 함수
// ==========================================================

/**
 * UserDto → UserDomain 변환
 */
export function toUserDomain(dto: UserDto): UserDomain {
  return {
    ...dto,
    authProvider: dto.authProvider as AuthProvider | null,
    verifiedAt: dto.verifiedAt ? new Date(dto.verifiedAt) : null,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}

/**
 * SubscriptionDto → SubscriptionDomain 변환
 */
export function toSubscriptionDomain(dto: SubscriptionDto): SubscriptionDomain {
  return {
    ...dto,
    startedAt: new Date(dto.startedAt),
    currentPeriodStart: new Date(dto.currentPeriodStart),
    currentPeriodEnd: new Date(dto.currentPeriodEnd),
    canceledAt: dto.canceledAt ? new Date(dto.canceledAt) : null,
  };
}

/**
 * DowngradeInfoDto → DowngradeDomain 변환
 */
export function toDowngradeDomain(dto: DowngradeInfoDto): DowngradeDomain {
  return {
    plan: toPlanDomain(dto.plan),
    effectiveDate: new Date(dto.effectiveDate),
  };
}

/**
 * PaymentMethodDto → PaymentMethodDomain 변환
 */
export function toPaymentMethodDomain(
  dto: PaymentMethodDto
): PaymentMethodDomain {
  return {
    cardCompany: dto.cardCompany,
    cardNumber: dto.cardNumber,
  };
}

/**
 * ReceiptRequestResultDto → ReceiptRequestDomain 변환
 */
export function toReceiptRequestDomain(
  dto: ReceiptRequestResultDto
): ReceiptRequestDomain {
  return {
    ...dto,
    requestedAt: new Date(dto.requestedAt),
    processedAt: dto.processedAt ? new Date(dto.processedAt) : null,
  };
}

/**
 * NotificationSettingsDto → NotificationSettingsDomain 변환
 */
export function toNotificationSettingsDomain(
  dto: NotificationSettingsDto
): NotificationSettingsDomain {
  return {
    ...dto,
    updatedAt: new Date(dto.updatedAt),
  };
}

/**
 * ChangePlanResponse → ChangePlanDomain 변환
 */
export function toChangePlanDomain(dto: ChangePlanResponse): ChangePlanDomain {
  return {
    ...dto,
    scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
  };
}

/**
 * ChangePlanNextPayment → ChangePlanNextPaymentDomain 변환
 */
export function toChangePlanNextPaymentDomain(
  dto: ChangePlanNextPayment
): ChangePlanNextPaymentDomain {
  return {
    billingDate: new Date(dto.billingDate),
    amount: dto.amount,
    replyQuotaLimit: dto.replyQuotaLimit,
    immediateAvailableReplyQuota: dto.immediateAvailableReplyQuota,
  };
}

/**
 * ChangePlanPreviewResponse → ChangePlanPreviewDomain 변환
 */
export function toChangePlanPreviewDomain(
  dto: ChangePlanPreviewResponse
): ChangePlanPreviewDomain {
  return {
    isUpgrade: dto.isUpgrade,
    currentPlan: toPlanDomain(dto.currentPlan),
    targetPlan: toPlanDomain(dto.targetPlan),
    cancelAtPeriodEndScheduled: dto.cancelAtPeriodEndScheduled,
    nextPayment: toChangePlanNextPaymentDomain(dto.nextPayment),
    remainingDays: dto.remainingDays,
  };
}

/**
 * CancelSubscriptionResponse → CancelSubscriptionDomain 변환
 */
export function toCancelSubscriptionDomain(
  dto: CancelSubscriptionResponse
): CancelSubscriptionDomain {
  return {
    ...dto,
    currentPeriodEnd: new Date(dto.currentPeriodEnd),
  };
}

/**
 * ReactivateSubscriptionResponse → ReactivateSubscriptionDomain 변환
 */
export function toReactivateSubscriptionDomain(
  dto: ReactivateSubscriptionResponse
): ReactivateSubscriptionDomain {
  return {
    ...dto,
    currentPeriodEnd: new Date(dto.currentPeriodEnd),
  };
}

/**
 * CancelDowngradeResponse → CancelDowngradeDomain 변환
 */
export function toCancelDowngradeDomain(
  dto: CancelDowngradeResponse
): CancelDowngradeDomain {
  return {
    ...dto,
    currentPeriodEnd: new Date(dto.currentPeriodEnd),
  };
}
