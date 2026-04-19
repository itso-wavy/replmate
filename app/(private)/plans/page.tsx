'use client';

import { notFound } from 'next/navigation';

import { ChevronLeft } from 'lucide-react';

import { KeepSubscriptionModal, PlanChangeModals } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { PlanCard, PlansFooter } from './_components';
import { usePlansPage } from './_hooks/usePlansPage';

const PlansPage = () => {
  const {
    // 데이터
    userPlan,
    isPlanLoading,
    isPlansLoading,
    plans,
    planStatus,
    isFree,
    isUnverified,
    isDowngradeScheduled,
    // 모달
    modalState,
    selectedPlan,
    isConfirmPending,
    isKeepSubscriptionPending,
    // 액션
    openPlanSelection,
    closeModal,
    handleConfirm,
    handleKeepSubscription,
    goBack,
  } = usePlansPage();

  if (
    !isPlanLoading &&
    (!userPlan?.plan || isUnverified || isDowngradeScheduled)
  )
    notFound();

  return (
    <div className='text-foreground relative mx-auto pt-5'>
      <div className='flex items-center px-7 py-5'>
        <Button
          size='icon-lg'
          variant='ghost'
          onClick={goBack}
          className='mr-2 rounded-[10px]'
        >
          <ChevronLeft className='size-7' />
        </Button>
        <h1 className='typo-heading-28'>
          {isFree ? '플랜 구독' : '플랜 변경'}
        </h1>
      </div>

      <div className='mx-auto mt-8 max-w-[1280px] px-7'>
        {/* 플랜 subgrid */}
        <div className='grid grid-cols-2 gap-4 md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lg:[grid-template-rows:auto_auto_auto_auto_1fr]'>
          {isPlansLoading || !userPlan
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className='h-[400px]' />
              ))
            : plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  currentPlanId={userPlan.plan.id}
                  currentPlanPrice={userPlan.plan.monthlyPrice}
                  currentPlanStatus={planStatus}
                  onSelect={openPlanSelection}
                />
              ))}
        </div>

        <PlansFooter />
      </div>

      {modalState === 'keepSubscription' && (
        <KeepSubscriptionModal
          open
          onOpenChange={(open) => !open && closeModal()}
          periodEnd={userPlan!.subscription.currentPeriodEnd}
          onConfirm={handleKeepSubscription}
          isPending={isKeepSubscriptionPending}
        />
      )}

      {selectedPlan && modalState && modalState !== 'keepSubscription' && (
        <PlanChangeModals
          state={modalState}
          currentPlan={userPlan!.plan}
          selectedPlan={selectedPlan}
          onClose={closeModal}
          onConfirm={handleConfirm}
          isConfirmPending={isConfirmPending}
        />
      )}
    </div>
  );
};

export default PlansPage;
