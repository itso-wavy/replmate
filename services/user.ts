import { api } from '@/lib/api';
import { USER_ENDPOINTS } from '@/lib/endpoints';
import type { AgreeTermsResponseData } from '@/types/api/term';
import type {
  CancelDowngradeResponse,
  CancelSubscriptionResponse,
  ChangePlanPreviewResponse,
  ChangePlanRequest,
  ChangePlanResponse,
  DeleteUserRequest,
  KcpTradeRegDto,
  NotificationSettingsDto,
  ReactivateSubscriptionResponse,
  ReceiptRequestResultDto,
  UserDto,
  UserPlanInfo,
} from '@/types/api/user';
import { toPlanDomain } from '@/types/domain/plan';
import {
  CancelDowngradeDomain,
  CancelSubscriptionDomain,
  ChangePlanDomain,
  ChangePlanPreviewDomain,
  NotificationSettingsDomain,
  ReactivateSubscriptionDomain,
  ReceiptRequestDomain,
  UserDomain,
  UserPlanDomain,
  toCancelDowngradeDomain,
  toCancelSubscriptionDomain,
  toChangePlanDomain,
  toChangePlanPreviewDomain,
  toDowngradeDomain,
  toNotificationSettingsDomain,
  toPaymentMethodDomain,
  toReactivateSubscriptionDomain,
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
  const response = await api.get<UserDto>(USER_ENDPOINTS.GET_USER);
  return toUserDomain(response.data);
}

/**
 * 사용자 탈퇴
 * - 유료 구독 중이고 해지 예약되지 않은 경우 백엔드가 거부 → UI에서 해지 예약 유도
 * - 해지 예약된 경우(cancelAtPeriodEnd=true) 또는 무료 플랜은 탈퇴 가능
 */
export async function deleteUser(data: DeleteUserRequest): Promise<void> {
  await api.delete(USER_ENDPOINTS.DELETE_USER, { data });
}

// ==========================================================
// 사용자 플랜
// ==========================================================
/**
 * 사용자의 플랜 정보 조회 (플랜 + 구독 + 결제수단)
 */
export async function getUserPlan(): Promise<UserPlanDomain> {
  const { data } = await api.get<UserPlanInfo>(USER_ENDPOINTS.GET_USER_PLAN);

  return {
    planStatus: data.planStatus,
    plan: toPlanDomain(data.plan),
    subscription: toSubscriptionDomain(data.subscription),
    downgrade: data.downgrade ? toDowngradeDomain(data.downgrade) : null,
    paymentMethod: data.paymentMethod
      ? toPaymentMethodDomain(data.paymentMethod)
      : null,
  };
}

/**
 * 플랜 변경 미리보기
 * - 업그레이드: 결제일=오늘, 결제 금액=일할 차액, 즉시 사용 가능 리플 한도(일할 재계산) 포함
 * - 다운그레이드: 결제일=현재 기간 종료일, 결제 금액=새 플랜 풀 금액
 * - cancelAtPeriodEndScheduled=true 면 변경 진행 시 해지 예약 자동 해제
 */
export async function previewChangePlan(
  planId: number
): Promise<ChangePlanPreviewDomain> {
  const response = await api.get<ChangePlanPreviewResponse>(
    USER_ENDPOINTS.CHANGE_PLAN_PREVIEW,
    { params: { plan_id: planId } }
  );
  return toChangePlanPreviewDomain(response.data);
}

/**
 * 플랜 변경
 * - 업그레이드 + 활성 빌링키 O → paymentPending=true. OTBILL 비동기 결제 진행.
 *   프론트는 결제창 진입 금지, userPlan 폴링/SSE로 결과 대기
 * - 업그레이드 + 빌링키 X → paymentPending=false + orderId. 다날 결제창 진입 필요
 *   (`/payments/danal/auth/{orderId}` AUTH 호출)
 * - 다운그레이드 → scheduledAt(현재 기간 종료일) 반환, 즉시 결제 없음
 */
export async function changePlan(planId: number): Promise<ChangePlanDomain> {
  const body: ChangePlanRequest = { planId };
  const response = await api.put<ChangePlanResponse>(
    USER_ENDPOINTS.CHANGE_PLAN,
    body
  );
  return toChangePlanDomain(response.data);
}

/**
 * 플랜 해지 (다음 결제일에 자동 해지 — cancelAtPeriodEnd=true)
 */
export async function cancelPlan(): Promise<CancelSubscriptionDomain> {
  const response = await api.delete<CancelSubscriptionResponse>(
    USER_ENDPOINTS.CANCEL_PLAN
  );
  return toCancelSubscriptionDomain(response.data);
}

/**
 * 다운그레이드 예약 취소
 */
export async function cancelDowngrade(): Promise<CancelDowngradeDomain> {
  const response = await api.post<CancelDowngradeResponse>(
    USER_ENDPOINTS.CANCEL_DOWNGRADE
  );
  return toCancelDowngradeDomain(response.data);
}

/**
 * 플랜 재활성화 (해지 취소)
 */
export async function reactivatePlan(): Promise<ReactivateSubscriptionDomain> {
  const response = await api.post<ReactivateSubscriptionResponse>(
    USER_ENDPOINTS.REACTIVATE_PLAN
  );
  return toReactivateSubscriptionDomain(response.data);
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
  const response = await api.post<ReceiptRequestResultDto>(
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
