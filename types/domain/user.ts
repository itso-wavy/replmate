import type {
  DowngradeInfoDto,
  NotificationSettingsDto,
  ReceiptRequestDto,
  SubscriptionDto,
  UserDto,
} from '@/types/api/user';
import { AuthProvider, SubscriptionStatus } from '@/types/enums';

import type { PlanDomain } from './plan';

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
 * 사용자 플랜 정보 (플랜 + 구독 정보)
 */
export interface UserPlanDomain {
  planStatus: SubscriptionStatus;
  plan: PlanDomain;
  subscription: SubscriptionDomain;
  downgrade: DowngradeDomain | null;
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
 * ReceiptRequestDto → ReceiptRequestDomain 변환
 */
export function toReceiptRequestDomain(
  dto: ReceiptRequestDto
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
