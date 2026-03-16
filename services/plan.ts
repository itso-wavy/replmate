import { api } from '@/lib/api';
import { PLAN_ENDPOINTS } from '@/lib/endpoints';
import { PlanDomain, PlanDto, toPlanDomain, toPlanDomainList } from '@/types';

// ============================================================================
// 플랜 조회
// ============================================================================

/**
 * 플랜 목록 조회
 * @param includeFree - 무료 플랜 포함 여부 (기본값: false, swagger query param: include_free)
 */
export async function getPlans(includeFree?: boolean): Promise<PlanDomain[]> {
  const response = await api.get<PlanDto[]>(PLAN_ENDPOINTS.GET_PLANS, {
    params: { include_free: includeFree },
  });
  return toPlanDomainList(response.data);
}

