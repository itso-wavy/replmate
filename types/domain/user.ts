import type {
  UserDto,
  SubscriptionDto,
  NotificationSettingsDto,
} from '@/types/api/user';
import type { PlanDomain } from './plan';

// ============================================================================
// 사용자 도메인
// ============================================================================

/**
 * 사용자 도메인 모델
 */
export interface UserDomain {
  id: number;
  email: string | null;
  name: string | null;
  phoneNumber: string | null;
  authProvider: string | null;
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
 * 사용자 + 플랜 + 구독 통합 정보
 */
export interface UserWithPlanDomain {
  user: UserDomain;
  plan: PlanDomain;
  subscription: SubscriptionDomain;
}

/**
 * 알림 설정 도메인
 */
export interface NotificationSettingsDomain {
  emailEnabled: boolean;
  smsEnabled: boolean;
  updatedAt: Date;
}

// ============================================================================
// 변환 함수
// ============================================================================

/**
 * UserDto → UserDomain 변환
 */
export function toUserDomain(dto: UserDto): UserDomain {
  return {
    ...dto,
    verifiedAt: dto.verifiedAt ? new Date(dto.verifiedAt) : null,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}

/**
 * SubscriptionDto → SubscriptionDomain 변환
 */
export function toSubscriptionDomain(
  dto: SubscriptionDto,
): SubscriptionDomain {
  return {
    ...dto,
    startedAt: new Date(dto.startedAt),
    currentPeriodStart: new Date(dto.currentPeriodStart),
    currentPeriodEnd: new Date(dto.currentPeriodEnd),
    canceledAt: dto.canceledAt ? new Date(dto.canceledAt) : null,
  };
}

/**
 * NotificationSettingsDto → NotificationSettingsDomain 변환
 */
export function toNotificationSettingsDomain(
  dto: NotificationSettingsDto,
): NotificationSettingsDomain {
  return {
    ...dto,
    updatedAt: new Date(dto.updatedAt),
  };
}
