import { SubscriptionStatus } from '../enums';
import type { PlanDto } from './plan';

// ==========================================================
// 사용자 (Users)
// ==========================================================

// GET /api/v1/users/me 유저 프로필 조회
export interface UserDto {
  id: number;
  email: string | null;
  name: string | null;
  phoneNumber: string | null;
  authProvider: 'kakao' | 'naver' | 'google' | null;
  authProviderId: string | null;
  isVerified: boolean;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  needsTermsAgreement: boolean;
}

// GET /api/v1/users/me/plan 유저 플랜 조회
export interface DowngradeInfoDto {
  plan: PlanDto;
  effectiveDate: string;
}

// 등록된 결제수단 (다날 BillKey 표시 정보)
// 결제수단 변경 직후에는 카드사명/카드번호가 null일 수 있고 다음 정기결제(OTBILL) 성공 시 채워진다
export interface PaymentMethodDto {
  cardCompany: string | null;
  cardNumber: string | null; // 마스킹 (예: "1111-11**-****-1111")
}

export interface UserPlanInfo {
  planStatus: SubscriptionStatus;
  subscription: SubscriptionDto;
  plan: PlanDto;
  downgrade: DowngradeInfoDto | null;
  paymentMethod: PaymentMethodDto | null;
}

// 스웨거 SubscriptionStatus enum: pending | active | canceled
// (UserPlanInfo.planStatus의 PlanStatus와는 다른 enum — 혼동 주의)
export interface SubscriptionDto {
  id: number;
  status: string;
  startedAt: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
}

// GET /api/v1/users/me/notification-settings 알림 설정 조회
export interface NotificationSettingsDto {
  emailEnabled: boolean;
  smsEnabled: boolean;
  updatedAt: string;
}

// POST /api/v1/users/me/receipt 영수증 요청 응답 (스웨거: ReceiptRequestResultDto)
export interface ReceiptRequestResultDto {
  id: number;
  status: 'pending' | 'completed' | 'rejected';
  requestedAt: string;
  processedAt: string | null;
  note: string | null; // 반려 사유 / 메모
}

/** @deprecated 스웨거 명칭 정렬 — `ReceiptRequestResultDto` 사용 */
export type ReceiptRequestDto = ReceiptRequestResultDto;

// DELETE /api/v1/users/me 사용자 탈퇴 요청
// 유료 구독 중 + 해지 예약 전이면 백엔드가 탈퇴 거부 → 해지 예약 후 재요청
export interface DeleteUserRequest {
  forfeitSubscriptionAgreed: boolean;
}

// DELETE /api/v1/users/me/plan 플랜 해지 응답
export interface CancelSubscriptionResponse {
  subscriptionId: number;
  planName: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

// POST /api/v1/users/me/plan/reactivate 플랜 재활성화(해지 철회) 응답
export interface ReactivateSubscriptionResponse {
  subscriptionId: number;
  planName: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

// POST /api/v1/users/me/plan/cancel-downgrade 다운그레이드 예약 취소 응답
export interface CancelDowngradeResponse {
  subscriptionId: number;
  planName: string;
  currentPeriodEnd: string;
}

// PUT /api/v1/users/me/plan 플랜 변경 요청
export interface ChangePlanRequest {
  planId: number;
}

// PUT /api/v1/users/me/plan 플랜 변경 응답 (업그레이드 결제 주문 / 다운그레이드 예약 통합)
export interface ChangePlanResponse {
  isUpgrade: boolean;
  fromPlanName: string;
  toPlanName: string;
  // 업그레이드 전용
  orderId: number | null;
  amount: number | null;
  /** @deprecated 활성 빌링키 있으면 OTBILL 비동기 결제로 자동 진행. 결제창 진입 경로는 별도 분기 */
  paymentUrl: string | null;
  /**
   * true: 활성 빌링키로 OTBILL 비동기 결제 진행 중 — 프론트는 결제창 진입 금지, userPlan 폴링/SSE 대기
   * false: 다날 결제창 진입 필요 (`/payments/danal/auth/{orderId}` AUTH 호출)
   */
  paymentPending: boolean;
  // 다운그레이드 전용 — 현재 기간 종료일에 새 플랜 전환
  scheduledAt: string | null;
}

// GET /api/v1/users/me/plan/change-preview?plan_id=N 다음 결제 안내
export interface ChangePlanNextPayment {
  billingDate: string; // 업그레이드=오늘 즉시 결제, 다운그레이드=현재 기간 종료일
  amount: number; // 업그레이드=일할 차액, 다운그레이드=새 플랜 월 결제 금액
  replyQuotaLimit: number;
  immediateAvailableReplyQuota: number | null; // 업그레이드 전용 (일할 재계산 후 잔여)
}

// GET /api/v1/users/me/plan/change-preview 플랜 변경 미리보기 응답
export interface ChangePlanPreviewResponse {
  isUpgrade: boolean;
  currentPlan: PlanDto;
  targetPlan: PlanDto;
  cancelAtPeriodEndScheduled: boolean; // true면 변경 진행 시 해지 예약 자동 해제
  nextPayment: ChangePlanNextPayment;
  remainingDays: number | null; // 업그레이드 전용
}

// POST /api/v1/users/me/verify-identity/kcp/trade-reg KCP 본인확인 거래등록 응답
// 프론트는 callUrl로 regCertKey를 form POST해 KCP 인증창을 띄운다.
export interface KcpTradeRegDto {
  ordrIdxx: string;
  callUrl: string;
  regCertKey: string;
}
