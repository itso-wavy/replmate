import { useMemo } from 'react';

import { useMyStores } from '@/hooks/useStores';
import { sortStoreList } from '@/lib/utils';

export function useStoresPage() {
  const { data: myStoresData, isLoading: isStoresLoading } = useMyStores();
  const stores = myStoresData?.stores ?? [];
  const storeQuota = myStoresData?.storeQuota;
  const sortedStores = useMemo(() => sortStoreList(stores), [stores]);

  // 백엔드 quota 가 진실. stores.length 와 다를 수 있음 (visible vs registered)
  const registeredStoreCount = storeQuota?.registered ?? 0;
  const storeQuotaTotal = storeQuota?.max ?? 0;

  // 플랜 다운그레이드로 한도를 초과한 상태 (조정 필요)
  const needsAdjustment = storeQuota ? storeQuota.used > storeQuota.max : false;

  // 쇼핑몰 추가 버튼: 한도 도달/초과
  const storeLimitExceeded = storeQuota ? storeQuota.remaining <= 0 : false;

  return {
    sortedStores,
    registeredStoreCount,
    storeQuotaTotal,
    needsAdjustment,
    storeLimitExceeded,
    isLoading: isStoresLoading,
  };
}
