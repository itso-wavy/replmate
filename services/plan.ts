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

