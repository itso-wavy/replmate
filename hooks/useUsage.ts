import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryKeys';
import { getTestQuota, getUsageHistory, getUsageQuota } from '@/services/usage';

export const useUsageQuota = () =>
  useQuery({
    queryKey: queryKeys.usage.quota(),
    queryFn: getUsageQuota,
  });

export const useTestQuota = (storeId: number) =>
  useQuery({
    queryKey: queryKeys.usage.testQuota(storeId),
    queryFn: () => getTestQuota(storeId),
    enabled: !!storeId,
  });

export const useUsageHistory = (params?: { page?: number; size?: number }) =>
  useQuery({
    queryKey: queryKeys.usage.history(params),
    queryFn: () => getUsageHistory(params),
  });
