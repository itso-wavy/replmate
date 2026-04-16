'use client';

import { notFound } from 'next/navigation';

import { Suspense } from 'react';

import { ChevronLeft } from 'lucide-react';

import { PlanChangeModal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { PlanCard, PlansFooter } from './_components';
import { usePlansPage } from './_hooks/usePlansPage';

// TODO: 서치파라미터로 selected={} 플랜명 또는 id 받기 => 선택 모달 띄우기
const PlansPageContent = () => {
  const {
    userPlan,
    isPlanLoading,
    allPlans,
    isPlansLoading,
    plans,
    planStatus,
    isCancelScheduled,
    isFree,
    isUnverified,
    isDowngradeScheduled,
    selectedPlan,
    isModalOpen,
    handleSelectPlan,
    handleCloseModal,
    // getPlanRelation,
    goBack,
  } = usePlansPage();

  if (
    !isPlanLoading &&
    (!userPlan?.plan || isUnverified || isDowngradeScheduled)
  )
    notFound();

  // TODO: 해지 예정 상태에서 현재 플랜 선택 시 "구독 유지" 모달
  const getModalRelation = () => {
    // if (!selectedPlan) return 'upgrade' as const;
    // if (isCancelScheduled && selectedPlan.id === currentPlan.id) {
    //   return 'reactivate' as const;
    // }
    // return getPlanRelation(selectedPlan) === 'downgrade'
    //   ? 'downgrade'
    //   : 'upgrade';
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

      {/* 플랜 변경 모달 */}
      {selectedPlan && (
        <PlanChangeModal
          open={isModalOpen}
          onOpenChange={(open) => !open && handleCloseModal()}
          selectedPlan={selectedPlan}
          currentPlan={userPlan?.plan}
          planStatus={planStatus}
          relation={getModalRelation()}
          onConfirm={() => {
            // TODO: API 연결
            handleCloseModal();
          }}
        />
      )}
    </div>
  );
};

const PlansPage = () => (
  <Suspense>
    <PlansPageContent />
  </Suspense>
);

export default PlansPage;
