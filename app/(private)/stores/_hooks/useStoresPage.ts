import { useMemo } from 'react';

import { toAlert } from '@/constants/alerts';
import { useReminders } from '@/hooks/useReminders';
import { useMyStores } from '@/hooks/useStores';
import { useUserPlan } from '@/hooks/useUser';
import { getRegisteredStoreList, sortStoreList } from '@/lib/utils';
import type { Alert } from '@/types';

export function useStoresPage() {
  const { data: stores = [], isLoading: isStoresLoading } = useMyStores();
  const { data: planData, isLoading: isPlanLoading } = useUserPlan();
  const { data: reminders = [] } = useReminders();

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

  const alerts = useMemo<Alert[]>(
    () =>
      reminders.flatMap((r) => {
        const alert = toAlert(r);
        return alert ? [alert] : [];
      }),
    [reminders]
  );

  return {
    sortedStores,
    registeredStoreCount,
    storeQuotaTotal,
    needsAdjustment,
    storeLimitExceeded,
    alerts,
    isLoading: isStoresLoading || isPlanLoading,
  };
}
