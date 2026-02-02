import { api } from '@/lib/api';
import { USAGE_ENDPOINTS } from '@/lib/endpoints';
import {
  UsageLedgerDomain,
  UsageLedgerDto,
  UsageQuotaDomain,
  UsageQuotaDto,
  toUsageLedgerDomainList,
  toUsageQuotaDomain,
} from '@/types';

// ============================================================================
// 사용량 조회
// ============================================================================

/**
 * 구독 사용량 조회 (월별 리플 생성 사용량)
 */
export async function getUsageQuota(): Promise<UsageQuotaDomain> {
  const response = await api.get<UsageQuotaDto>(USAGE_ENDPOINTS.GET_QUOTA);
  return toUsageQuotaDomain(response.data);
}

/**
 * 테스트 사용량 조회 (일일 테스트 사용량)
 */
export async function getTestQuota(): Promise<UsageQuotaDomain> {
  const response = await api.get<UsageQuotaDto>(USAGE_ENDPOINTS.GET_TEST_QUOTA);
  return toUsageQuotaDomain(response.data);
}

/**
 * 사용 내역 조회
 */
export async function getUsageHistory(params?: {
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}): Promise<UsageLedgerDomain[]> {
  const response = await api.get<UsageLedgerDto[]>(
    USAGE_ENDPOINTS.GET_USAGE_HISTORY,
    { params }
  );
  return toUsageLedgerDomainList(response.data);
}
