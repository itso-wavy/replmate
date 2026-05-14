import { useMemo } from 'react';

import { useReminders } from '@/hooks/useReminders';
import { useUserPlan } from '@/hooks/useUser';
import { useMyStores } from '@/hooks/useStores';
import { sortStoreList } from '@/lib/utils';
import {
  AdjustmentRequiredMeta,
  ReminderEvent,
  StoreStatus,
  SubscriptionStatus,
} from '@/types';

export function useStoresPage() {
  const { data: myStoresData, isLoading: isStoresLoading } = useMyStores();
  const { data: userPlan } = useUserPlan();
  const { data: reminders = [] } = useReminders();

  const stores = myStoresData?.stores ?? [];
  const storeQuota = myStoresData?.storeQuota;
  const sortedStores = useMemo(() => sortStoreList(stores), [stores]);

  // 백엔드 quota 가 진실. stores.length 와 다를 수 있음 (visible vs registered)
  const registeredStoreCount = storeQuota?.registered ?? 0;
  const storeQuotaTotal = storeQuota?.max ?? 0;

  // 쇼핑몰 추가 버튼: 한도 도달/초과
  const storeLimitExceeded = storeQuota ? storeQuota.remaining <= 0 : false;

  // 강제 조정 모달 트리거: 다운그레이드/해지 대기 + 변경 후 한도 초과
  const isPendingDowngrade =
    userPlan?.planStatus === SubscriptionStatus.PAID_PLAN_DOWNGRADE_SCHEDULED ||
    userPlan?.planStatus === SubscriptionStatus.PAID_CANCEL_SCHEDULED;

  const adjustmentReminder = reminders.find(
    (r) => r.event === ReminderEvent.STORE_ADJUSTMENT_REQUIRED
  );
  const futureMaxStoreCount = adjustmentReminder
    ? (adjustmentReminder.meta as AdjustmentRequiredMeta).maxStoreCount
    : undefined;

  const futureOccupiedCount = stores.filter(
    (s) => s.status === StoreStatus.PENDING || s.status === StoreStatus.ACTIVE
  ).length;

  const needsAdjustment =
    isPendingDowngrade &&
    futureMaxStoreCount !== undefined &&
    futureOccupiedCount > futureMaxStoreCount;

  return {
    sortedStores,
    registeredStoreCount,
    storeQuotaTotal,
    needsAdjustment,
    storeLimitExceeded,
    futureMaxStoreCount,
    isLoading: isStoresLoading,
  };
}
