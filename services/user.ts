import { api } from '@/lib/api';
import { USER_ENDPOINTS } from '@/lib/endpoints';
import type { AgreeTermsResponseData } from '@/types/api/term';
import type {
  CancelSubscriptionResponse,
  DeleteUserRequest,
  KcpTradeRegDto,
  NotificationSettingsDto,
  ReactivateSubscriptionResponse,
  ReceiptRequestDto,
  UserPlanInfo,
} from '@/types/api/user';
import { toPlanDomain } from '@/types/domain/plan';
import {
  NotificationSettingsDomain,
  ReceiptRequestDomain,
  UserDomain,
  UserPlanDomain,
  toNotificationSettingsDomain,
  toReceiptRequestDomain,
  toSubscriptionDomain,
  toUserDomain,
} from '@/types/domain/user';

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
    planStatus: data.planStatus,
    plan: toPlanDomain(data.plan),
    subscription: toSubscriptionDomain(data.subscription),
    downgrade: data.downgrade
      ? {
          plan: toPlanDomain(data.downgrade.plan),
          effectiveDate: new Date(data.downgrade.effectiveDate),
        }
      : null,
  };
}

export interface ChangePlanResponse {
  amount: number;
  fromPlanName: string;
  isUpgrade?: boolean;
  orderId: number;
  toPlanName: string;
  paymentUrl: string;
}

/**
 * 플랜 변경
 * 결제 주문을 생성합니다.
 * 실제 플랜 변경은 결제 완료 후 webhook에서 처리됩니다.
 */
export async function changePlan(planId: number): Promise<ChangePlanResponse> {
  const response = await api.put<ChangePlanResponse>(
    USER_ENDPOINTS.CHANGE_PLAN,
    { planId }
  );

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
 * 다운그레이드 예약 취소
 */
export async function cancelDowngrade(): Promise<void> {
  await api.post(USER_ENDPOINTS.CANCEL_DOWNGRADE);
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
export async function requestReceipt(): Promise<ReceiptRequestDomain> {
  const response = await api.post<ReceiptRequestDto>(
    USER_ENDPOINTS.REQUEST_RECEIPT
  );
  return toReceiptRequestDomain(response.data);
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
// 본인인증 (KCP)
// ==========================================================
/**
 * KCP 본인확인 거래등록 (1단계)
  - 운영 환경(trade-reg): 응답의 callUrl에 registration certificate key를 form-POST하여 KCP 인증창 호출
 * 인증 완료 시 백엔드가 환경별 frontend URL로 RedirectResponse 처리
  - 운영 환경(trade-reg): RedirectResponse + app.frontend_url
  - 테스트 환경(/kcp/test): Redis에 redirect 플래그 저장 → 콜백에서 꺼내 분기
 */
export async function verifyIdentityKcpTradeReg(): Promise<KcpTradeRegDto> {
  const response = await api.post<KcpTradeRegDto>(
    USER_ENDPOINTS.VERIFY_IDENTITY_KCP_TRADE_REG
  );
  return response.data;
}
