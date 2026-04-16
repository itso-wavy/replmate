'use client';

import { useRouter } from 'next/navigation';

import { useState } from 'react';

import { ROUTES } from '@/constants/nav-menu';
import {
  dummyUserPlanActive,
  dummyUserPlanCancelScheduled,
  dummyUserPlanDowngradeScheduled,
  dummyUserPlanFree,
  dummyUserPlanUnverified,
} from '@/dummy';
import { usePlans, useUserPlan } from '@/hooks';
import type { PlanDomain } from '@/types';
import { SubscriptionStatus } from '@/types/enums';

export const usePlansPage = () => {
  const router = useRouter();

  const { data: userPlan, isLoading: isPlanLoading } = useUserPlan();
  const { data: allPlans = [], isLoading: isPlansLoading } = usePlans(true); // includeFree: true
  const planStatus = userPlan?.planStatus ?? SubscriptionStatus.FREE;
  const currentPlan = userPlan?.plan;

  // 파생 states
  const isUnverified = planStatus === SubscriptionStatus.UNVERIFIED;
  const isFree = planStatus === SubscriptionStatus.FREE;

  const isActive = planStatus === SubscriptionStatus.PAID_ACTIVE;
  const isCancelScheduled =
    planStatus === SubscriptionStatus.PAID_CANCEL_SCHEDULED;
  const isDowngradeScheduled =
    planStatus === SubscriptionStatus.PAID_PLAN_DOWNGRADE_SCHEDULED;

  // 모달 상태
  const [selectedPlan, setSelectedPlan] = useState<PlanDomain | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectPlan = (plan: PlanDomain) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  const goBack = () => router.push(ROUTES.SUBSCRIBE);

  // 플랜 관계 판별 (PAID_ACTIVE 상태에서만 의미 있음)
  // const getPlanRelation = (plan: PlanDomain) => {
  //   if (plan.id === userPlan?.plan?.id) return 'current' as const;
  //   if (plan.monthlyPrice > userPlan?.plan?.monthlyPrice)
  //     return 'upgrade' as const;
  //   return 'downgrade' as const;
  // };

  return {
    userPlan,
    isPlanLoading,
    allPlans,
    isPlansLoading,
    plans: isFree ? allPlans : allPlans.filter((p) => p.monthlyPrice > 0),
    planStatus,
    isFree,
    isCancelScheduled,
    isUnverified,
    isDowngradeScheduled,
    selectedPlan,
    isModalOpen,
    handleSelectPlan,
    handleCloseModal,
    // getPlanRelation,
    goBack,
  };
};
