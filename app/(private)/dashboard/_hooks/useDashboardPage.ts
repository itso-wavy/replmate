'use client';

import { useMemo } from 'react';

import { useReplies } from '@/hooks/useReplies';
import { useMyStores } from '@/hooks/useStores';
import { useUsageQuota } from '@/hooks/useUsage';
import { useUserPlan } from '@/hooks/useUser';
import { getActiveStoreList } from '@/lib/utils';
import type { ReplyDomain, UsageQuotaSubscriptionDomain } from '@/types';

export function useDashboardPage() {
  const { data: myStoresData, isLoading: isStoresLoading } = useMyStores();
  const stores = myStoresData?.stores;
  const { data: userPlan, isLoading: isPlanLoading } = useUserPlan();
  const { data: usageQuota, isLoading: isQuotaLoading } = useUsageQuota();

  const activeStores = useMemo(
    () => getActiveStoreList(stores ?? []),
    [stores]
  );
  const firstActiveStoreId = activeStores[0]?.id;

  const { data: todayRepliesData, isLoading: isTodayLoading } = useReplies({
    storeId: firstActiveStoreId ?? 0,
    todayOnly: true,
    size: 1,
  });

  const { data: recentRepliesData, isLoading: isRepliesLoading } = useReplies({
    storeId: firstActiveStoreId ?? 0,
    size: 15,
  });

  const subscription = useMemo<UsageQuotaSubscriptionDomain | null>(() => {
    if (!userPlan || !usageQuota) return null;
    const { plan, subscription: sub } = userPlan;
    return {
      planName: plan.name,
      updatedAt: sub.currentPeriodEnd,
      replyQuotaTotal: plan.monthlyReplyQuota,
      replyQuotaUsed: plan.monthlyReplyQuota - usageQuota.remaining,
      storeQuotaTotal: plan.maxStoreCount,
      storeQuotaUsed: activeStores.length,
    };
  }, [userPlan, usageQuota, activeStores]);

  const recentReplies = useMemo<ReplyDomain[]>(
    () => recentRepliesData?.items ?? [],
    [recentRepliesData]
  );

  const isLoading =
    isStoresLoading ||
    isPlanLoading ||
    isQuotaLoading ||
    isTodayLoading ||
    isRepliesLoading;

  return {
    stores: stores ?? [],
    activeStores,
    subscription,
    todayReplyCount: todayRepliesData?.totalCount ?? 0,
    recentReplies,
    isLoading,
  };
}
