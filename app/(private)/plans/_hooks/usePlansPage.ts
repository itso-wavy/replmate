'use client';

import { useRouter } from 'next/navigation';

import { useEffect, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { PlanModalState } from '@/components/modal/PlanChangeModals';
import { ROUTES } from '@/constants/nav-menu';
import {
  useChangePlan,
  useDanalCheckout,
  usePlans,
  usePreviewChangePlan,
  useReactivatePlan,
  useReminders,
  useUserPlan,
} from '@/hooks';
import { queryKeys } from '@/lib/queryKeys';
import { getUserPlan } from '@/services/user';
import { UserStore } from '@/store/userStore';
import type { PlanDomain } from '@/types';
import type { ChangePlanDomain } from '@/types/domain/user';
import { ReminderEvent, SubscriptionStatus } from '@/types/enums';

const POLLING_INTERVAL_MS = 1000;

export const usePlansPage = () => {
  const router = useRouter();
  const qc = useQueryClient();

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
  // confirm 시점 preview의 immediateAvailableReplyQuota 스냅샷.
  // 결제 후 preview 캐시 갱신/invalidate되어도 success 모달이 confirm 시점 값을 그대로 표시하도록 보존.
  const [instantQuotaSnapshot, setInstantQuotaSnapshot] = useState<
    number | null
  >(null);

  // paymentPending=true 결과 대기 상태 — confirm 버튼 pending 유지 + 모달 배경/ESC 닫기 차단
  const [isPaymentPolling, setIsPaymentPolling] = useState(false);
  // 폴링 대상 plan / 시작 시각 — 모달이 닫혀도 ref로 유지되어 결과 도착 시 success 모달 복구.
  const pollingTargetRef = useRef<{
    plan: PlanDomain;
    instantQuota: number | null;
    startedAt: Date;
  } | null>(null);

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

  // 리마인더 — PAYMENT_FAILED 수신 시 폴링 중단 + 토스트
  const { data: reminders } = useReminders();

  // ── 폴링 effect ─────────────────────────────────────────
  // paymentPending=true 응답 후 백엔드 OTBILL 처리 완료까지 plan.id 변경 확인.
  // 일치 시 캐시 setQueryData + success 모달 전환.
  useEffect(() => {
    if (!isPaymentPolling) return;
    let cancelled = false;

    const tick = async () => {
      if (cancelled) return;
      try {
        const result = await getUserPlan();
        const target = pollingTargetRef.current;
        if (target && result.plan?.id === target.plan.id) {
          qc.setQueryData(queryKeys.user.plan(), result);
          setSelectedPlan(target.plan);
          setInstantQuotaSnapshot(target.instantQuota);
          setModalState('upgradeSuccess');
          setIsPaymentPolling(false);
          pollingTargetRef.current = null;
          return;
        }
      } catch {
        // 폴링 응답 에러는 무시 — 다음 tick에서 재시도
      }
      if (!cancelled) {
        timeoutId = setTimeout(tick, POLLING_INTERVAL_MS);
      }
    };

    let timeoutId = setTimeout(tick, POLLING_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [isPaymentPolling, qc]);

  // ── PAYMENT_FAILED reminder watch ──────────────────────
  // 폴링 진행 중일 때만 감시. 시작 시점 이후 생성된 PAYMENT_FAILED 발견 시 중단 + 토스트.
  useEffect(() => {
    if (!isPaymentPolling) return;
    const target = pollingTargetRef.current;
    if (!target || !reminders) return;

    const failed = reminders.find(
      (r) =>
        r.event === ReminderEvent.PAYMENT_FAILED &&
        r.createdAt > target.startedAt
    );
    if (failed) {
      setIsPaymentPolling(false);
      pollingTargetRef.current = null;
      toast.error(failed.message || '결제에 실패했습니다.');
    }
  }, [reminders, isPaymentPolling]);

  const closeModal = () => {
    const wasSuccess =
      modalState === 'upgradeSuccess' || modalState === 'downgradeSuccess';
    setModalState(null);
    // 폴링 진행 중이면 결과 도착 시 success 모달 복구를 위해 state 유지
    if (!isPaymentPolling) {
      setSelectedPlan(null);
      setChangeResult(null);
      setInstantQuotaSnapshot(null);
    }
    if (wasSuccess) router.push(ROUTES.SUBSCRIBE);
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

    // preview 캐시는 결제 직후 invalidate/refetch될 수 있으므로 confirm 시점 값을 저장.
    const snapshotQuota =
      preview?.nextPayment?.immediateAvailableReplyQuota ?? null;

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
    //   → plan.id 폴링 + PAYMENT_FAILED reminder watch로 결과 대기
    // - paymentPending=false (빌링키 X): orderId 발급 → 다날 결제창(팝업) 진입
    try {
      const result = await changePlan(selectedPlan.id);
      const { orderId, paymentPending } = result;

      if (paymentPending) {
        pollingTargetRef.current = {
          plan: selectedPlan,
          instantQuota: snapshotQuota,
          startedAt: new Date(),
        };
        setChangeResult(result);
        setIsPaymentPolling(true);
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
        // 다날 결제 완료 후 백엔드 플랜 변경 — cache stale 처리.
        // refetchType: 'none' = 활성 observer(현재 /plans) 즉시 refetch 안 함.
        // 사용자가 success 모달 닫고 /settings/subscribe 이동 시 stale 감지 → fresh fetch.
        qc.invalidateQueries({
          queryKey: queryKeys.user.plan(),
          exact: true,
          refetchType: 'none',
        });
        setChangeResult(result);
        setInstantQuotaSnapshot(snapshotQuota);
        setModalState('upgradeSuccess');
      } else {
        toast.error('결제가 완료되지 않았습니다.');
      }
    } catch (e) {
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
    instantQuotaSnapshot,
    isConfirmPending:
      isChangePlanPending || isCheckoutPending || isPaymentPolling,
    isKeepSubscriptionPending: isReactivatePending,
    // 액션
    openPlanSelection,
    closeModal,
    handleConfirm,
    handleKeepSubscription,
    goBack,
  };
};
