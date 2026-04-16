'use client';

import { useState } from 'react';

import { toast } from 'sonner';

import { useUsageHistory, useUsageQuota } from '@/hooks/useUsage';
import {
  useCancelDowngrade,
  useCancelPlan,
  useReactivatePlan,
  useRequestReceipt,
  useUserPlan,
} from '@/hooks/useUser';
import { SubscriptionStatus } from '@/types';

const PAGE_SIZE = 50;

type SubscribeModal =
  | 'cancelSubscription'
  | 'cancelDowngrade'
  | 'cancelUnsubscribe'
  | 'paymentChange'
  | 'receipt'
  | null;

const PAID_STATUSES: SubscriptionStatus[] = [
  SubscriptionStatus.PAID_ACTIVE,
  SubscriptionStatus.PAID_CANCEL_SCHEDULED,
  SubscriptionStatus.PAID_PLAN_DOWNGRADE_SCHEDULED,
];

export function useSubscribePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModal, setActiveModal] = useState<SubscribeModal>(null);

  const closeModal = () => setActiveModal(null);

  // ── 데이터 ─────────────────────────────────────────────
  const { data: userPlan } = useUserPlan();
  const { data: quota } = useUsageQuota();
  const { data: historyData, isLoading: isHistoryLoading } = useUsageHistory({
    page: currentPage,
    size: PAGE_SIZE,
  });

  // ── 뮤테이션 ───────────────────────────────────────────
  const { mutateAsync: cancelPlan, isPending: isCancelSubscriptionPending } =
    useCancelPlan();
  const { mutateAsync: reactivatePlan, isPending: isCancelUnsubscribePending } =
    useReactivatePlan();
  const { mutateAsync: cancelDowngrade, isPending: isCancelDowngradePending } =
    useCancelDowngrade();
  const { mutateAsync: requestReceipt, isPending: isReceiptPending } =
    useRequestReceipt();

  // ── 파생 상태 ──────────────────────────────────────────
  const isPaid = userPlan
    ? PAID_STATUSES.includes(userPlan.planStatus)
    : false;

  const quotaTotal = userPlan?.plan.monthlyReplyQuota ?? 0;
  const quotaRemaining = quota?.remaining ?? 0;
  const quotaUsed = quotaTotal - quotaRemaining;
  const quotaPercent =
    quotaTotal > 0
      ? Math.min(Math.round((quotaUsed / quotaTotal) * 100), 100)
      : 0;

  // ── 확인 핸들러 ────────────────────────────────────────
  const handleCancelSubscription = async () => {
    try {
      await cancelPlan();
      closeModal();
      toast.success(
        '구독 해지 예약이 완료되었습니다.\n현재 이용 중인 플랜 종료일까지는 혜택을 계속 사용할 수 있습니다.'
      );
    } catch {
      toast.error('요청에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const handleCancelDowngrade = async () => {
    try {
      await cancelDowngrade();
      closeModal();
      toast.success(
        '변경 예약이 취소되었습니다.\n현재 이용 중인 플랜 구독이 정상적으로 유지됩니다.'
      );
    } catch {
      toast.error('요청에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const handleCancelUnsubscribe = async () => {
    try {
      await reactivatePlan();
      closeModal();
      toast.success(
        '해지 요청이 취소되었습니다.\n현재 이용 중인 플랜 구독이 정상적으로 유지됩니다.'
      );
    } catch {
      toast.error('요청에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const handleReceiptConfirm = async () => {
    try {
      await requestReceipt();
      closeModal();
      toast.success(
        '영수증 요청이 완료되었습니다.\n등록된 이메일로 영업일 기준 2~3일 이내 발송됩니다.'
      );
    } catch {
      toast.error('요청에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  return {
    // 사용자 / 플랜
    isPaid,
    userPlan,

    // 이용량
    quotaTotal,
    quotaUsed,
    quotaPercent,

    // 사용 이력
    usageLedger: historyData?.items ?? [],
    totalPages: historyData?.totalPages || 1,
    currentPage,
    isHistoryLoading,
    onPageChange: setCurrentPage,

    // 모달
    activeModal,
    setActiveModal,
    closeModal,

    // pending
    isCancelSubscriptionPending,
    isCancelDowngradePending,
    isCancelUnsubscribePending,
    isReceiptPending,

    // 확인 핸들러
    handleCancelSubscription,
    handleCancelDowngrade,
    handleCancelUnsubscribe,
    handleReceiptConfirm,
  };
}
