'use client';

import { useRouter } from 'next/navigation';

import { useState } from 'react';

import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { toast } from 'sonner';

import { ROUTES } from '@/constants/nav-menu';
import {
  useChangePlan,
  usePlans,
  useReactivatePlan,
  useUserPlan,
} from '@/hooks';
import { UserStore } from '@/store/userStore';
import type { PlanDomain } from '@/types';
import { SubscriptionStatus } from '@/types/enums';

type ModalStep = 'confirm' | 'upgrade-complete' | 'downgrade-complete';

export const usePlansPage = () => {
  const router = useRouter();

  const { data: userPlan, isLoading: isPlanLoading } = useUserPlan();
  const { data: allPlans = [], isLoading: isPlansLoading } = usePlans(true);
  const planStatus = userPlan?.planStatus ?? SubscriptionStatus.FREE;
  const user = UserStore.useUser();

  // 파생 states
  const isUnverified = planStatus === SubscriptionStatus.UNVERIFIED;
  const isFree = planStatus === SubscriptionStatus.FREE;
  const isCancelScheduled =
    planStatus === SubscriptionStatus.PAID_CANCEL_SCHEDULED;
  const isDowngradeScheduled =
    planStatus === SubscriptionStatus.PAID_PLAN_DOWNGRADE_SCHEDULED;

  // 모달 상태
  const [selectedPlan, setSelectedPlan] = useState<PlanDomain | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>('confirm');

  // 뮤테이션
  const { mutateAsync: changePlan, isPending: isChangePlanPending } =
    useChangePlan();
  const { mutateAsync: reactivatePlan, isPending: isReactivatePending } =
    useReactivatePlan();

  const handleSelectPlan = (plan: PlanDomain) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
    setModalStep('confirm');
  };

  // ── 플랜 변경 확인 (업그레이드: Toss / 다운그레이드: API) ──
  const handleConfirm = async () => {
    if (!selectedPlan || !user) return;

    const isDowngrade =
      selectedPlan.monthlyPrice < (userPlan?.plan?.monthlyPrice ?? 0);

    if (isDowngrade) {
      try {
        await changePlan(selectedPlan.id);
        setModalStep('downgrade-complete');
      } catch {
        toast.error('요청에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }
      return;
    }

    // 업그레이드 / 신규 구독: Toss 결제
    try {
      const tossPayments = await loadTossPayments(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!
      );
      const payment = tossPayments.payment({ customerKey: String(user.id) });
      await payment.requestBillingAuth({
        method: 'CARD',
        successUrl: `${window.location.origin}/payment/billing/success?planId=${selectedPlan.id}`,
        failUrl: `${window.location.origin}/payment/billing/fail`,
        customerEmail: user.email ?? undefined,
        customerName: user.name ?? undefined,
      });
    } catch {
      toast.error('요청에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  // ── 구독 유지 (ReactivatePlanModal) ───────────────────────
  const handleReactivate = async () => {
    try {
      await reactivatePlan();
      handleCloseModal();
      toast.success(
        '해지 요청이 취소되었습니다.\n현재 이용 중인 플랜 구독이 정상적으로 유지됩니다.'
      );
    } catch {
      toast.error('요청에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const goBack = () => router.push(ROUTES.SUBSCRIBE);

  // 플랜 관계 판별
  const getPlanRelation = (plan: PlanDomain) => {
    if (plan.id === userPlan?.plan?.id) return 'current' as const;
    if (plan.monthlyPrice > (userPlan?.plan?.monthlyPrice ?? 0))
      return 'upgrade' as const;
    return 'downgrade' as const;
  };

  return {
    userPlan,
    isPlanLoading,
    isPlansLoading,
    plans: isFree ? allPlans : allPlans.filter((p) => p.monthlyPrice > 0),
    planStatus,
    isFree,
    isCancelScheduled,
    isUnverified,
    isDowngradeScheduled,
    selectedPlan,
    isModalOpen,
    modalStep,
    isConfirmPending: isChangePlanPending,
    isReactivatePending,
    handleSelectPlan,
    handleCloseModal,
    handleConfirm,
    handleReactivate,
    getPlanRelation,
    goBack,
  };
};
