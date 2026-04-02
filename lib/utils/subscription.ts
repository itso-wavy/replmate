import type { PlanDomain } from '@/types/domain/plan';

/**
 * 구독 상태 타입
 * - free: 무료 플랜
 * - active: 유료 구독 중 (해지 예정 없음)
 * - canceling: 유료 구독 해지 대기 중 (cancelAtPeriodEnd = true)
 */
export type SubscriptionStatusType = 'free' | 'active' | 'canceling';

/**
 * 플랜 + 구독 정보를 기반으로 구독 상태 타입을 반환
 */
export function getSubscriptionStatus(
  plan?: PlanDomain | null,
  subscription?: { cancelAtPeriodEnd: boolean } | null
): SubscriptionStatusType {
  if (!plan || plan.monthlyPrice === 0) return 'free';
  if (subscription?.cancelAtPeriodEnd) return 'canceling';
  return 'active';
}

/**
 * 회원탈퇴 가능 여부 반환
 * 유료 구독 활성 중(active)에는 탈퇴 불가
 */
export function canWithdraw(status: SubscriptionStatusType): boolean {
  return status !== 'active';
}
