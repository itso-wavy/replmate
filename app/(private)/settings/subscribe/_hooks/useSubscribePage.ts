'use client';

import { useState } from 'react';

import { toast } from 'sonner';

import { useUsageHistory, useUsageQuota } from '@/hooks/useUsage';
import {
  useCancelPlan,
  useReactivatePlan,
  useRequestReceipt,
  useUserPlan,
} from '@/hooks/useUser';
import { UserStore } from '@/store/userStore';
import { SubscriptionStatus } from '@/types';

const PAGE_SIZE = 50;

export function useSubscribePage() {
  const user = UserStore.useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const { data: userPlan, isLoading: isPlanLoading } = useUserPlan();
  const { data: quota, isLoading: isQuotaLoading } = useUsageQuota();
  const { data: historyData, isLoading: isHistoryLoading } = useUsageHistory({
    page: currentPage,
    size: PAGE_SIZE,
  });

  const { mutateAsync: cancelPlan, isPending: isCancelPending } =
    useCancelPlan();
  const { mutateAsync: reactivatePlan } = useReactivatePlan();
  const { mutateAsync: requestReceipt, isPending: isReceiptPending } =
    useRequestReceipt();

  const isVerified = user?.isVerified ?? false;
  const isFree = userPlan?.planStatus === SubscriptionStatus.FREE;

  const quotaTotal = userPlan?.plan.monthlyReplyQuota ?? 0;
  const quotaRemaining = quota?.remaining ?? 0;
  const quotaUsed = quotaTotal - quotaRemaining;
  const quotaPercent =
    quotaTotal > 0
      ? Math.min(Math.round((quotaUsed / quotaTotal) * 100), 100)
      : 0;

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
      toast.error('구독 재활성화에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const handleCancelPlan = () => {
    setIsCancelModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    try {
      await cancelPlan();
      setIsCancelModalOpen(false);
      toast.success(
        '구독 해지 예약이 완료되었습니다.\n현재 이용 중인 플랜 종료일까지는 혜택을 계속 사용할 수 있습니다.'
      );
    } catch {
      toast.error('요청에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const handleRequestReceipt = () => {
    setIsReceiptModalOpen(true);
  };

  const handleReceiptConfirm = async () => {
    try {
      await requestReceipt();
      setIsReceiptModalOpen(false);
      toast.success(
        '영수증 요청이 완료되었습니다.\n등록된 이메일로 영업일 기준 2~3일 이내 발송됩니다.'
      );
    } catch (err) {
      console.log(err);
      toast.error('요청에 실패했습니다. 잠시 후 다시 시도해 주세요.');
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
    usageLedger: historyData?.items ?? [],
    totalPages: historyData?.totalPages || 1,
    currentPage,
    isHistoryLoading,
    onPageChange: setCurrentPage,
    handlePlanChange,
    handlePaymentChange,
    handleReactivate,
    handleCancelPlan,
    handleRequestReceipt,
    isCancelModalOpen,
    setIsCancelModalOpen,
    isCancelPending,
    handleCancelConfirm,
    isReceiptModalOpen,
    setIsReceiptModalOpen,
    isReceiptPending,
    handleReceiptConfirm,
  };
}
