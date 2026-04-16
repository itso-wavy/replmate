'use client';

import { notFound } from 'next/navigation';

import { ChevronLeft } from 'lucide-react';

import { PlanChangeModal, ReactivatePlanModal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { PlanCard, PlansFooter } from './_components';
import { usePlansPage } from './_hooks/usePlansPage';

const PlansPage = () => {
  const {
    userPlan,
    isPlanLoading,
    isPlansLoading,
    plans,
    planStatus,
    isCancelScheduled,
    isFree,
    isUnverified,
    isDowngradeScheduled,
    selectedPlan,
    isModalOpen,
    modalStep,
    isConfirmPending,
    isReactivatePending,
    handleSelectPlan,
    handleCloseModal,
    handleConfirm,
    handleReactivate,
    getPlanRelation,
    goBack,
  } = usePlansPage();

  if (
    !isPlanLoading &&
    (!userPlan?.plan || isUnverified || isDowngradeScheduled)
  )
    notFound();

  const getModalRelation = () => {
    if (!selectedPlan) return 'upgrade';
    if (isCancelScheduled && selectedPlan.id === userPlan?.plan?.id)
      return 'reactivate';
    return getPlanRelation(selectedPlan) === 'downgrade'
      ? 'downgrade'
      : 'upgrade';
  };

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
                  onSelect={handleSelectPlan}
                />
              ))}
        </div>

        <PlansFooter />
      </div>

      {selectedPlan && userPlan?.plan && (
        <>
          <ReactivatePlanModal
            open={isModalOpen && getModalRelation() === 'reactivate'}
            onOpenChange={(open) => !open && handleCloseModal()}
            periodEnd={userPlan.subscription.currentPeriodEnd}
            onConfirm={handleReactivate}
            isPending={isReactivatePending}
          />
          <PlanChangeModal
            open={isModalOpen && getModalRelation() !== 'reactivate'}
            onOpenChange={(open) => !open && handleCloseModal()}
            selectedPlan={selectedPlan}
            currentPlan={userPlan.plan}
            step={modalStep}
            onConfirm={handleConfirm}
            isPending={isConfirmPending}
          />
        </>
      )}
    </div>
  );
};

export default PlansPage;
