import { api } from '@/lib/api';
import { USER_ENDPOINTS } from '@/lib/endpoints';
import type { AgreeTermsResponseData } from '@/types/api/term';
import type {
  CancelSubscriptionResponse,
  DeleteUserRequest,
  NotificationSettingsDto,
  ReactivateSubscriptionResponse,
  UserDto,
  UserPlanInfo,
} from '@/types/api/user';
import { toPlanDomain } from '@/types/domain/plan';
import {
  NotificationSettingsDomain,
  UserDomain,
  UserPlanDomain,
  toNotificationSettingsDomain,
  toSubscriptionDomain,
  toUserDomain,
} from '@/types/domain/user';
import { SubscriptionStatus, VerifyIdentityProvider } from '@/types/enums';

// ==========================================================
// 사용자 정보
// ==========================================================

/**
 * 현재 로그인한 사용자 정보 조회
 */
export async function getUser(): Promise<UserDomain> {
  const response = await api.get<import('@/types/api/user').UserDto>(
    USER_ENDPOINTS.GET_USER
  );
  return toUserDomain(response.data);
}

/**
 * 사용자 탈퇴
 */
export async function deleteUser(data: DeleteUserRequest): Promise<void> {
  await api.delete(USER_ENDPOINTS.DELETE_USER, { data });
}

// ==========================================================
// 사용자 플랜
// ==========================================================
/**
 * 사용자의 플랜 정보 조회 (플랜 + 구독 정보)
 */
export async function getUserPlan(): Promise<UserPlanDomain> {
  const { data } = await api.get<UserPlanInfo>(USER_ENDPOINTS.GET_USER_PLAN);

  return {
    planStatus: data.planStatus as SubscriptionStatus, // TODO: 정확히 확인
    plan: toPlanDomain(data.plan),
    subscription: toSubscriptionDomain(data.subscription),
  };
}

/**
 * 플랜 변경
 * 결제 주문을 생성하고 결제 URL을 반환합니다.
 * 실제 플랜 변경은 결제 완료 후 webhook에서 처리됩니다.
 * @returns 결제 URL (string) 또는 무료 플랜 변경 시 null
 */
export async function changePlan(planId: number): Promise<string | null> {
  const response = await api.put<string | null>(USER_ENDPOINTS.CHANGE_PLAN, {
    planId,
  });
  return response.data;
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

// ==========================================================
// 영수증
// ==========================================================

/**
 * 영수증 발급 요청
 * 요청 바디 없음 (세션 쿠키로 사용자 식별)
 * 24시간 내 재요청 불가 / 대기 중인 요청이 있으면 추가 요청 불가
 */
export async function requestReceipt(): Promise<void> {
  await api.post(USER_ENDPOINTS.REQUEST_RECEIPT);
}

// ==========================================================
// 약관 동의
// ==========================================================

/**
 * 약관 동의
 * @returns 동의한 약관 목록
 */
export async function agreeTerms(
  termsIds: number[]
): Promise<AgreeTermsResponseData | null> {
  const response = await api.post<AgreeTermsResponseData>(
    USER_ENDPOINTS.AGREE_TERMS,
    { termsIds }
  );
  return response.data;
}

// ==========================================================
// 알림 설정
// ==========================================================

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
 * 알림 설정 수정 (부분 수정 가능)
 * PATCH /api/v1/users/me/notification-settings
 */
export async function updateNotificationSettings(
  settings: Partial<{
    emailEnabled: boolean;
    smsEnabled: boolean;
  }>
): Promise<NotificationSettingsDomain> {
  const response = await api.patch<NotificationSettingsDto>(
    USER_ENDPOINTS.UPDATE_NOTIFICATION_SETTINGS,
    settings
  );
  return toNotificationSettingsDomain(response.data);
}

// ==========================================================
// 본인인증
// ==========================================================

/**
 * 본인인증 제공자 목록 조회
 * 응답: ["test", "pass"]
 */
export async function getVerifyIdentityProviders(): Promise<string[]> {
  const response = await api.get<string[]>(
    USER_ENDPOINTS.VERIFY_IDENTITY_PROVIDERS
  );
  return response.data;
}

/**
 * 본인인증 완료 처리
 * - test: impUid 검증 없이 항상 성공 (개발/테스트용)
 * - pass: PASS 본인인증 (추후 연동, impUid 필요) // TODO:
 */
export async function verifyIdentity(
  provider: VerifyIdentityProvider = VerifyIdentityProvider.TEST,
  impUid?: string
): Promise<UserDomain> {
  const response = await api.post<UserDto>(USER_ENDPOINTS.VERIFY_IDENTITY, {
    provider,
    ...(impUid && { impUid }),
  });
  return toUserDomain(response.data);
}
