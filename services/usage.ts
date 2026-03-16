import { api } from '@/lib/api';
import { USAGE_ENDPOINTS } from '@/lib/endpoints';
import type {
  TestUsageQuotaDto,
  UsageHistoryList,
  UsageQuotaDto,
} from '@/types/api/usage';
import {
  TestUsageQuotaDomain,
  UsageHistoryListDomain,
  UsageQuotaDomain,
  toTestUsageQuotaDomain,
  toUsageLedgerDomainList,
  toUsageQuotaDomain,
} from '@/types/domain/usage';

// ============================================================================
// 사용량 조회
// ============================================================================

/**
 * 구독 사용량 조회 (이번 달 남은 리플 생성 사용량)
 */
export async function getUsageQuota(): Promise<UsageQuotaDomain> {
  const response = await api.get<UsageQuotaDto>(USAGE_ENDPOINTS.GET_QUOTA);
  return toUsageQuotaDomain(response.data);
}

/**
 * 테스트 사용량 조회 (오늘 남은 리플 테스트 사용량)
 * @param storeId - 필수: 스토어 ID
 */
export async function getTestQuota(
  storeId: number
): Promise<TestUsageQuotaDomain> {
  const response = await api.get<TestUsageQuotaDto>(
    USAGE_ENDPOINTS.GET_TEST_QUOTA,
    { params: { storeId } }
  );
  return toTestUsageQuotaDomain(response.data);
}

/**
 * 사용 이력 조회 (페이지네이션)
 * GET /api/v1/usage/history?page=1&size=20
 * @returns 사용 이력 목록 + 페이지네이션 정보
 */
export async function getUsageHistory(params?: {
  page?: number;
  size?: number;
}): Promise<UsageHistoryListDomain> {
  const response = await api.get<UsageHistoryList>(
    USAGE_ENDPOINTS.GET_USAGE_HISTORY,
    { params }
  );
  const { items, ...pagination } = response.data;
  return {
    ...pagination,
    items: toUsageLedgerDomainList(items),
  };
}
