'use client';

import { useMemo } from 'react';

import { toAlert } from '@/constants/alerts';
import { useReminders } from '@/hooks/useReminders';
import { useReplies } from '@/hooks/useReplies';
import { useMyStores } from '@/hooks/useStores';
import { useUsageQuota } from '@/hooks/useUsage';
import { useUserPlan } from '@/hooks/useUser';
import { getActiveStoreList } from '@/lib/utils';
import type { Alert, UsageQuotaSubscriptionDomain } from '@/types';

import type { DashboardReply } from '../_components';

export function useDashboardPage() {
  const { data: remindersData } = useReminders();
  const { data: myStoresData, isLoading: isStoresLoading } = useMyStores();
  const stores = myStoresData?.stores;
  const { data: userPlan, isLoading: isPlanLoading } = useUserPlan();
  const { data: usageQuota, isLoading: isQuotaLoading } = useUsageQuota();

  const activeStores = useMemo(
    () => getActiveStoreList(stores ?? []),
    [stores]
  );
  const firstActiveStoreId = activeStores[0]?.id;

  // 오늘의 작업 수 (첫번째 활성 스토어 기준)
  // TODO: 전체 스토어 합산으로 개선 필요
  const { data: todayRepliesData, isLoading: isTodayLoading } = useReplies({
    storeId: firstActiveStoreId ?? 0,
    todayOnly: true,
    size: 1,
  });

  // 최근 리플 목록 (첫번째 활성 스토어 기준)
  const { data: recentRepliesData, isLoading: isRepliesLoading } = useReplies({
    storeId: firstActiveStoreId ?? 0,
    size: 15,
  });

  // subscription 데이터 조합: plan + usageQuota + activeStores
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

  // ReminderDomain → Alert 변환
  const alerts = useMemo<Alert[]>(() => {
    if (!remindersData) return [];
    return remindersData.flatMap((r) => {
      const alert = toAlert(r);
      return alert ? [alert] : [];
    });
  }, [remindersData]);

  // ReplyDomain → DashboardReply 변환
  const recentReplies = useMemo<DashboardReply[]>(() => {
    if (!recentRepliesData?.items) return [];
    return recentRepliesData.items.map((reply) => ({
      id: reply.id,
      productName: reply.product.name,
      sentiment: {
        type: 'neutral' as const, // TODO: API 미제공, 추후 연동 예정
        score: 0,
      },
      content: reply.editedText ?? reply.aiText,
      createdAt: reply.createdAt.toISOString(),
    }));
  }, [recentRepliesData]);

  const isLoading =
    isStoresLoading ||
    isPlanLoading ||
    isQuotaLoading ||
    isTodayLoading ||
    isRepliesLoading;

  return {
    stores: stores ?? [],
    activeStores,
    alerts,
    subscription,
    todayReplyCount: todayRepliesData?.totalCount ?? 0,
    recentReplies,
    isLoading,
  };
}
