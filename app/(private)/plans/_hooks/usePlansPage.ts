'use client';

import { useRouter } from 'next/navigation';

import { useState } from 'react';

import { toast } from 'sonner';

import type { PlanModalState } from '@/components/modal/PlanChangeModals';
import { ROUTES } from '@/constants/nav-menu';
import {
  useChangePlan,
  useDanalCheckout,
  usePlans,
  usePreviewChangePlan,
  useReactivatePlan,
  useUserPlan,
} from '@/hooks';
import { UserStore } from '@/store/userStore';
import type { PlanDomain } from '@/types';
import type { ChangePlanDomain } from '@/types/domain/user';
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
  const [changeResult, setChangeResult] = useState<ChangePlanDomain | null>(
    null
  );

  // 플랜 변경 미리보기 — 결제 확정 모달(subscribe/upgrade/downgrade) 진입 시에만 조회
  const isPreviewable =
    modalState === 'subscribe' ||
    modalState === 'upgrade' ||
    modalState === 'downgrade';
  const { data: preview, isLoading: isPreviewLoading } = usePreviewChangePlan(
    selectedPlan?.id ?? null,
    isPreviewable
  );

  // 뮤테이션
  const { mutateAsync: changePlan, isPending: isChangePlanPending } =
    useChangePlan();

  const { mutateAsync: reactivatePlan, isPending: isReactivatePending } =
    useReactivatePlan();

  const { mutateAsync: danalCheckout, isPending: isCheckoutPending } =
    useDanalCheckout();

  const closeModal = () => {
    setModalState(null);
    setSelectedPlan(null);
    setChangeResult(null);
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
        const result = await changePlan(selectedPlan.id);
        setChangeResult(result);
        setModalState('downgradeSuccess');
      } catch {
        toast.error('요청에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }
      return;
    }

    // subscribe / upgrade
    // - paymentPending=true (활성 빌링키 O): 서버가 OTBILL 비동기 결제 진행 중. 결제창 진입 금지
    //   → userPlan 폴링/SSE로 결과 대기 (현 구현은 결과 토스트만, 후속 SSE 연동 시 갱신)
    // - paymentPending=false (빌링키 X): orderId 발급 → 다날 결제창(팝업) 진입
    try {
      const result = await changePlan(selectedPlan.id);
      const { orderId, paymentPending } = result;

      if (paymentPending) {
        // TODO: userPlan SSE/폴링 결과 수신 후 success 모달 전환
        setChangeResult(result);
        setModalState('upgradeSuccess');
        return;
      }

      if (orderId == null) {
        throw new Error('주문 ID가 없어 결제창을 열 수 없습니다.');
      }

      const { success } = await danalCheckout({
        orderId,
        planId: selectedPlan.id,
      });

      if (success) {
        setChangeResult(result);
        setModalState('upgradeSuccess');
      } else {
        closeModal();
        toast.error('결제가 완료되지 않았습니다.');
      }
    } catch (e) {
      closeModal();
      toast.error(
        e instanceof Error && e.message
          ? e.message
          : '요청에 실패했습니다. 잠시 후 다시 시도해 주세요.'
      );
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
    preview,
    isPreviewLoading,
    changeResult,
    isConfirmPending: isChangePlanPending || isCheckoutPending,
    isKeepSubscriptionPending: isReactivatePending,
    // 액션
    openPlanSelection,
    closeModal,
    handleConfirm,
    handleKeepSubscription,
    goBack,
  };
};
