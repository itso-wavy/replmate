import type { PlanDto } from './plan';

// ============================================================================
// 사용자 (Users)
// ============================================================================

// GET /api/v1/users/me 유저 프로필 조회
export interface UserDto {
  id: number;
  email: string | null;
  name: string | null;
  phoneNumber: string | null;
  authProvider: string | null;
  authProviderId: string | null;
  isVerified: boolean;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  needsTermsAgreement: boolean;
}

// GET /api/v1/users/me/plan 유저 플랜 조회
export interface UserPlanResponseData {
  subscription: SubscriptionDto;
  plan: PlanDto;
}

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

// POST /api/v1/users/me/receipt 영수증 요청
export interface ReceiptRequestDto {
  id: number;
  userId: number;
  subscriptionId: number;
  status: string;
  requestedAt: string;
  processedAt: string | null;
  note: string | null;
}

// DELETE /api/v1/users/me 사용자 탈퇴 요청
export interface DeleteUserRequest {
  forfeitSubscriptionAgreed: boolean;
}

// DELETE /api/v1/users/me/plan 플랜 해지 응답
export interface CancelSubscriptionResponse {
  subscription: SubscriptionDto;
  message: string;
}

// POST /api/v1/users/me/plan/reactivate 플랜 재활성화 응답
export interface ReactivateSubscriptionResponse {
  subscription: SubscriptionDto;
  message: string;
}

// GET /api/v1/users/me/plan 사용자 플랜 정보 (user 필드 제거)
export interface UserPlanInfo {
  subscription: SubscriptionDto;
  plan: PlanDto;
}
