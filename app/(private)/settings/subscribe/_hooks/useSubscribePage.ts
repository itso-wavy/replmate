'use client';

import { useState } from 'react';

import { toast } from 'sonner';

import {
  dummyUsageLedger,
  dummyUsageRemaining,
  dummyUserPlanInfo,
} from '@/dummy';
import { useUsageHistory, useUsageQuota } from '@/hooks/useUsage';
import {
  useCancelPlan,
  useReactivatePlan,
  useRequestReceipt,
  useUserPlan,
} from '@/hooks/useUser';
import { UserStore } from '@/store/userStore';

const PAGE_SIZE = 50;

export function useSubscribePage() {
  const user = UserStore.useUser();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: userPlan, isLoading: isPlanLoading } = useUserPlan();
  const { data: quota, isLoading: isQuotaLoading } = useUsageQuota();
  const { data: historyData, isLoading: isHistoryLoading } = useUsageHistory({
    page: currentPage,
    size: PAGE_SIZE,
  });

  const { mutateAsync: cancelPlan } = useCancelPlan();
  const { mutateAsync: reactivatePlan } = useReactivatePlan();
  const { mutateAsync: requestReceipt } = useRequestReceipt();

  const isVerified = user?.isVerified ?? false;
  const isFree = (userPlan?.plan.monthlyPrice ?? 0) === 0;

  const quotaTotal = userPlan?.plan.monthlyReplyQuota ?? 0;
  const quotaRemaining = quota?.remaining ?? 0;
  const quotaUsed = quotaTotal - quotaRemaining;
  const quotaPercent =
    quotaTotal > 0
      ? Math.min(Math.round((quotaUsed / quotaTotal) * 100), 100)
      : 0;

  const ledgerItems = historyData?.items ?? [];

  const handlePlanChange = () => {
    // TODO: 플랜 변경 페이지로 이동
  };

  const handlePaymentChange = () => {
    // TODO: 결제 정보 변경 모달
  };

  const handleReactivate = async () => {
    try {
      await reactivatePlan();
      toast.success('구독이 재활성화되었습니다.');
    } catch {
      toast.error('구독 재활성화에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleCancelPlan = async () => {
    try {
      await cancelPlan();
      toast.success('구독이 해지 신청되었습니다.');
    } catch {
      toast.error('구독 해지에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleRequestReceipt = async () => {
    try {
      await requestReceipt();
      toast.success('영수증 요청이 완료되었습니다.');
    } catch {
      toast.error('영수증 요청에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return {
    isVerified,
    isFree,
    userPlan,
    isPlanLoading,
    quotaTotal,
    quotaUsed,
    quotaPercent,
    isQuotaLoading,
    ledgerItems,
    totalPages: historyData?.totalPages || 1,
    currentPage,
    isHistoryLoading,
    onPageChange: setCurrentPage,
    handlePlanChange,
    handlePaymentChange,
    handleReactivate,
    handleCancelPlan,
    handleRequestReceipt,
  };
}
