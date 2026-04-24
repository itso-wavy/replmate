'use client';

import { useRouter } from 'next/navigation';

import { useState } from 'react';

import { toast } from 'sonner';

import type { PlanModalState } from '@/components/modal/PlanChangeModals';
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
  const [modalState, setModalState] = useState<PlanModalState | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanDomain | null>(null);

  // 뮤테이션
  const { mutateAsync: changePlan, isPending: isChangePlanPending } =
    useChangePlan();
  const { mutateAsync: reactivatePlan, isPending: isReactivatePending } =
    useReactivatePlan();

  const closeModal = () => {
    setModalState(null);
    setSelectedPlan(null);
  };

  const openPlanSelection = (plan: PlanDomain) => {
    setSelectedPlan(plan);

    if (isCancelScheduled && plan.id === userPlan?.plan?.id) {
      setModalState('keepSubscription');
      return;
    }

    const state: PlanModalState = isFree
      ? 'subscribe'
      : plan.monthlyPrice > (userPlan?.plan?.monthlyPrice ?? 0)
        ? 'upgrade'
        : 'downgrade';

    setModalState(state);
  };

  const handleConfirm = async () => {
    if (!selectedPlan || !user) return;

    if (modalState === 'downgrade') {
      try {
        await changePlan(selectedPlan.id);
        setModalState('downgradeSuccess');
      } catch {
        toast.error('요청에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }
      return;
    }

    // subscribe / upgrade: changePlan API → 결제 URL 리다이렉트
    // toast.error('결제 모듈 연동 준비 중입니다.');
    try {
      // FIXME: RESPONSE TYPE
      const { payment_url } = await changePlan(selectedPlan.id);
      if (payment_url) {
        window.location.href = payment_url;
      } else {
        setModalState('upgradeSuccess');
        router.push(ROUTES.SUBSCRIBE);
      }
    } catch {
      toast.error('요청에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const handleKeepSubscription = async () => {
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

  const goBack = () => router.push(ROUTES.SUBSCRIBE);

  return {
    // 데이터
    userPlan,
    isPlanLoading,
    isPlansLoading,
    plans: isFree ? allPlans : allPlans.filter((p) => p.monthlyPrice > 0),
    planStatus,
    isFree,
    isCancelScheduled,
    isUnverified,
    isDowngradeScheduled,
    // 모달
    modalState,
    selectedPlan,
    isConfirmPending: isChangePlanPending,
    isKeepSubscriptionPending: isReactivatePending,
    // 액션
    openPlanSelection,
    closeModal,
    handleConfirm,
    handleKeepSubscription,
    goBack,
  };
};
