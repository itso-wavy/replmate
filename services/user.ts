import { api } from '@/lib/api';
import { USER_ENDPOINTS } from '@/lib/endpoints';
import type { PlanDto } from '@/types/api/plan';
import type {
  CancelSubscriptionResponse,
  DeleteUserRequest,
  NotificationSettingsDto,
  ReactivateSubscriptionResponse,
  SubscriptionDto,
  UserDto,
  UserPlanInfo,
} from '@/types/api/user';
import { PlanDomain, toPlanDomain } from '@/types/domain/plan';
import {
  NotificationSettingsDomain,
  SubscriptionDomain,
  UserDomain,
  toNotificationSettingsDomain,
  toSubscriptionDomain,
  toUserDomain,
} from '@/types/domain/user';

// ============================================================================
// 사용자 정보
// ============================================================================

/**
 * 현재 로그인한 사용자 정보 조회
 */
export async function getUser(): Promise<UserDomain> {
  const response = await api.get<UserDto>(USER_ENDPOINTS.GET_USER);
  return toUserDomain(response.data);
}

/**
 * 사용자 탈퇴
 */
export async function deleteUser(data: DeleteUserRequest): Promise<void> {
  await api.delete(USER_ENDPOINTS.DELETE_USER, { data });
}

// ============================================================================
// 사용자 플랜
// ============================================================================

/**
 * 사용자 플랜 정보 (플랜 + 구독 정보)
 */
export interface UserPlanDomain {
  plan: PlanDomain;
  subscription: SubscriptionDomain;
}

/**
 * 사용자의 플랜 정보 조회 (플랜 + 구독 정보, user 필드 제거)
 */
export async function getUserPlan(): Promise<UserPlanDomain> {
  const response = await api.get<UserPlanInfo>(USER_ENDPOINTS.GET_USER_PLAN);

  return {
    plan: toPlanDomain(response.data.plan),
    subscription: toSubscriptionDomain(response.data.subscription),
  };
}

/**
 * 플랜 변경
 */
export async function changePlan(planId: number): Promise<SubscriptionDomain> {
  const response = await api.put<SubscriptionDto>(USER_ENDPOINTS.CHANGE_PLAN, {
    planId,
  });
  return toSubscriptionDomain(response.data);
}

/**
 * 플랜 해지 (다음 결제일에 자동 해지)
 */
export async function cancelPlan(): Promise<CancelSubscriptionResponse> {
  const response = await api.delete<CancelSubscriptionResponse>(
    USER_ENDPOINTS.CANCEL_PLAN
  );
  return response.data;
}

/**
 * 플랜 재활성화 (해지 취소)
 */
export async function reactivatePlan(): Promise<ReactivateSubscriptionResponse> {
  const response = await api.post<ReactivateSubscriptionResponse>(
    USER_ENDPOINTS.REACTIVATE_PLAN
  );
  return response.data;
}

// ============================================================================
// 영수증
// ============================================================================

/**
 * 영수증 요청
 */
export async function requestReceipt(data: {
  email: string;
  year: number;
  month: number;
}): Promise<void> {
  await api.post(USER_ENDPOINTS.REQUEST_RECEIPT, data);
}

// ============================================================================
// 약관 동의
// ============================================================================

/**
 * 약관 동의
 */
export async function agreeTerms(termsIds: number[]): Promise<void> {
  await api.post(USER_ENDPOINTS.AGREE_TERMS, {
    termsIds,
  });
}

// ============================================================================
// 알림 설정
// ============================================================================

/**
 * 알림 설정 조회
 */
export async function getNotificationSettings(): Promise<NotificationSettingsDomain> {
  const response = await api.get<NotificationSettingsDto>(
    USER_ENDPOINTS.GET_NOTIFICATION_SETTINGS
  );
  return toNotificationSettingsDomain(response.data);
}

/**
 * 알림 설정 수정
 */
export async function updateNotificationSettings(
  settings: Partial<{
    emailEnabled: boolean;
    smsEnabled: boolean;
  }>
): Promise<NotificationSettingsDomain> {
  const response = await api.put<NotificationSettingsDto>(
    USER_ENDPOINTS.UPDATE_NOTIFICATION_SETTINGS,
    settings
  );
  return toNotificationSettingsDomain(response.data);
}

// ============================================================================
// 본인인증
// ============================================================================

/**
 * 본인인증
 */
export async function verifyIdentity(data: {
  name: string;
  phoneNumber: string;
  verificationCode: string;
}): Promise<UserDomain> {
  const response = await api.post<UserDto>(
    USER_ENDPOINTS.VERIFY_IDENTITY,
    data
  );
  return toUserDomain(response.data);
}
