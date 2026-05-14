'use client';

import { useState } from 'react';

import { AxiosError } from 'axios';
import { toast } from 'sonner';

import {
  dummyUserPlanActive,
  dummyUserPlanCancelScheduled,
  dummyUserPlanDowngradeScheduled,
  dummyUserPlanFree,
  dummyUserPlanUnverified,
} from '@/dummy';
import { useChangePaymentMethod } from '@/hooks/useChangePaymentMethod';
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
  | 'receipt'
  | null;

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
  const {
    mutateAsync: changePaymentMethod,
    isPending: isChangePaymentMethodPending,
  } = useChangePaymentMethod();

  // ── 파생 상태 ──────────────────────────────────────────
  const isVerified = userPlan?.planStatus !== SubscriptionStatus.UNVERIFIED;

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

  const handlePaymentChange = async () => {
    try {
      const result = await changePaymentMethod();
      if (result.status === 'success') {
        toast.success('결제 정보 변경이 완료되었습니다.');
      } else if (result.status === 'error') {
        toast.error(
          '결제 정보 변경에 실패했습니다. 잠시 후 다시 시도해 주세요.'
        );
      }
      // cancel — 사용자 취소 → 토스트 생략
    } catch (e) {
      toast.error(
        e instanceof Error && e.message
          ? e.message
          : '요청에 실패했습니다. 잠시 후 다시 시도해 주세요.'
      );
    }
  };

  const handleReceiptConfirm = async () => {
    try {
      await requestReceipt();
      closeModal();
      toast.success(
        '영수증 요청이 완료되었습니다.\n등록된 이메일로 영업일 기준 2~3일 이내 발송됩니다.'
      );
    } catch (err) {
      closeModal();
      const errorCode =
        err instanceof AxiosError ? err?.response?.data.errorCode : null;
      const message =
        errorCode === 7001
          ? '이미 대기 중인 영수증 요청이 있습니다.'
          : errorCode === 7002
            ? '영수증 요청은 24시간 내에 한번만 가능합니다.'
            : '요청에 실패했습니다. 잠시 후 다시 시도해 주세요.';
      toast.error(message);
    }
  };

  return {
    // 사용자 / 플랜
    isVerified,
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
    isChangePaymentMethodPending,

    // 확인 핸들러
    handleCancelSubscription,
    handleCancelDowngrade,
    handleCancelUnsubscribe,
    handleReceiptConfirm,
    handlePaymentChange,
  };
}
