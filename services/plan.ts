import { api } from '@/lib/api';
import { PLAN_ENDPOINTS } from '@/lib/endpoints';
import { PlanDomain, PlanDto, toPlanDomain, toPlanDomainList } from '@/types';

// ============================================================================
// 플랜 조회
// ============================================================================

/**
 * 전체 플랜 목록 조회
 */
export async function getPlans(): Promise<PlanDomain[]> {
  const response = await api.get<PlanDto[]>(PLAN_ENDPOINTS.GET_PLANS);
  return toPlanDomainList(response.data);
}

// ============================================================================
// 플랜 관리 (관리자 전용)
// ============================================================================

/**
 * 플랜 수정 (관리자 전용)
 */
export async function updatePlan(
  planId: number,
  data: Partial<{
    title: string | null;
    description: string | null;
    monthlyPrice: number;
    monthlyReplyQuota: number;
    maxStoreCount: number;
    maxProductPerStore: number;
    maxTestPerDay: number;
    isActive: boolean;
  }>
): Promise<PlanDomain> {
  const response = await api.put<PlanDto>(
    PLAN_ENDPOINTS.UPDATE_PLAN(planId),
    data
  );
  return toPlanDomain(response.data);
}
