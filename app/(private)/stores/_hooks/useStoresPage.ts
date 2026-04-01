import { useMemo } from 'react';

import { useMyStores } from '@/hooks/useStores';
import { useUserPlan } from '@/hooks/useUser';
import { getRegisteredStoreList, sortStoreList } from '@/lib/utils';

export function useStoresPage() {
  const { data: myStoresData, isLoading: isStoresLoading } = useMyStores();
  const stores = myStoresData?.stores ?? [];
  const { data: planData, isLoading: isPlanLoading } = useUserPlan();
  const sortedStores = useMemo(() => sortStoreList(stores), [stores]);

  const registeredStoreCount = useMemo(
    () => getRegisteredStoreList(stores).length,
    [stores]
  );

  const storeQuotaTotal = planData?.plan.maxStoreCount ?? 0;

  // 플랜 다운그레이드로 인해 등록 쇼핑몰 수가 한도를 초과한 상태 (조정 필요)
  const needsAdjustment =
    storeQuotaTotal > 0 && registeredStoreCount > storeQuotaTotal;

  // 쇼핑몰 추가 버튼: 한도에 도달했거나 초과한 상태
  const storeLimitExceeded =
    storeQuotaTotal > 0 && registeredStoreCount >= storeQuotaTotal;

  return {
    sortedStores,
    registeredStoreCount,
    storeQuotaTotal,
    needsAdjustment,
    storeLimitExceeded,
    isLoading: isStoresLoading || isPlanLoading,
  };
}
