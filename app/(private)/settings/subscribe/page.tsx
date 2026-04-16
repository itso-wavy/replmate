'use client';

import { ReceiptText } from 'lucide-react';

import {
  CancelDowngradeModal,
  CancelSubscriptionModal,
  CancelUnsubscribeModal,
  PaymentChangeModal,
  ReceiptRequestModal,
} from '@/components/modal';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  dummyUserPlanActive,
  dummyUserPlanCancelScheduled,
  dummyUserPlanDowngradeScheduled,
  dummyUserPlanFree,
  dummyUserPlanUnverified,
} from '@/dummy';

import { InnerPageLayout, InnerPageSection } from '../_components';
import { SubscriptionInfo, UsageLedgerTable } from './_components';
import { useSubscribePage } from './_hooks/useSubscribePage';

const SubscribePage = () => {
  const {
    isPaid,
    userPlan,
    quotaTotal,
    quotaUsed,
    quotaPercent,
    usageLedger,
    totalPages,
    currentPage,
    isHistoryLoading,
    onPageChange,
    isCancelSubscriptionModalOpen,
    setIsCancelSubscriptionModalOpen,
    handleCancelSubscription,
    isCancelSubscriptionPending,
    isCancelDowngradeModalOpen,
    setIsCancelDowngradeModalOpen,
    handleCancelDowngrade,
    isCancelDowngradePending,
    isCancelUnsubscribeModalOpen,
    setIsCancelUnsubscribeModalOpen,
    handleCancelUnsubscribe,
    isCancelUnsubscribePending,
    // ===================================
    isPaymentChangeModalOpen,
    setIsPaymentChangeModalOpen,
    // ===================================
    isReceiptModalOpen,
    setIsReceiptModalOpen,
    handleReceiptConfirm,
    isReceiptPending,
  } = useSubscribePage();

  return (
    <InnerPageLayout heading='구독 관리'>
      {/* 구독 정보 */}
      {userPlan && (
        <InnerPageSection heading='구독 정보'>
          <SubscriptionInfo
            userPlan={dummyUserPlanCancelScheduled}
            onPaymentChange={() => setIsPaymentChangeModalOpen(true)}
            onReactivate={() => setIsCancelUnsubscribeModalOpen(true)}
            onCancelPlan={() => setIsCancelSubscriptionModalOpen(true)}
            onCancelDowngrade={() => setIsCancelDowngradeModalOpen(true)}
          />
        </InnerPageSection>
      )}

      {/* 이용량 모니터링 */}
      <InnerPageSection heading='이용량 모니터링'>
        <div>
          <div className='typo-body-14 mb-1.5 flex items-center justify-between'>
            <span className='text-muted-foreground'>리플 생성</span>
            <div className='flex h-0 items-center font-medium tabular-nums'>
              <span>{quotaUsed}</span>
              <span className='font-inherit mx-1'>/</span>
              <span>{quotaTotal}</span>
            </div>
          </div>
          <Progress value={quotaPercent} className='h-2' />
          <p className='typo-caption-12 text-muted-foreground mt-2.5 text-right'>
            결제일(또는 갱신일)에 초기화됩니다.
          </p>
        </div>
      </InnerPageSection>

      {/* 결제 내역 요청 (유료 플랜 구독 중) */}
      {isPaid && (
        <InnerPageSection heading='결제 내역 요청'>
          <div className='flex items-center justify-between gap-2'>
            <p className='typo-body-14 text-foreground-description'>
              <span>결제 영수증은 담당자에게 요청하실 수 있습니다.</span>{' '}
              <span>요청시 모든 결제 내역을 이메일로 보내 드립니다.</span>
            </p>
            <div className='flex items-center justify-center gap-4'>
              <Button
                onClick={() => setIsReceiptModalOpen(true)}
                isPending={isReceiptPending}
                variant='outline'
                className='bg-input/30 text-brand-500 hover:text-brand-500/80 min-w-[80px] shrink-0'
              >
                <ReceiptText size={12} className='text-primary' />
                영수증 요청
              </Button>
            </div>
          </div>
        </InnerPageSection>
      )}

      {/* 리플 사용 이력 */}
      <InnerPageSection heading='리플 사용 이력'>
        <UsageLedgerTable
          items={usageLedger}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          isLoading={isHistoryLoading}
        />
      </InnerPageSection>

      {/* 모달 */}
      {userPlan && (
        <>
          <CancelSubscriptionModal
            open={isCancelSubscriptionModalOpen}
            onOpenChange={setIsCancelSubscriptionModalOpen}
            currentPlan={userPlan.plan}
            nextPlanName={userPlan.downgrade?.plan.name.toUpperCase()}
            onConfirm={handleCancelSubscription}
            periodEnd={userPlan.subscription.currentPeriodEnd}
            isPending={isCancelSubscriptionPending}
          />

          {userPlan.downgrade && (
            <CancelDowngradeModal
              open={isCancelDowngradeModalOpen}
              onOpenChange={setIsCancelDowngradeModalOpen}
              nextPlanName={userPlan.downgrade.plan.name.toUpperCase()}
              nextRenewalDate={userPlan.downgrade.effectiveDate}
              onConfirm={handleCancelDowngrade}
              isPending={isCancelDowngradePending}
            />
          )}

          <CancelUnsubscribeModal
            open={isCancelUnsubscribeModalOpen}
            onOpenChange={setIsCancelUnsubscribeModalOpen}
            periodEnd={userPlan.subscription.currentPeriodEnd}
            onConfirm={handleCancelUnsubscribe}
            isPending={isCancelUnsubscribePending}
          />

          <PaymentChangeModal
            open={isPaymentChangeModalOpen}
            onOpenChange={setIsPaymentChangeModalOpen}
          />

          <ReceiptRequestModal
            open={isReceiptModalOpen}
            onOpenChange={setIsReceiptModalOpen}
            onConfirm={handleReceiptConfirm}
            isPending={isReceiptPending}
          />
        </>
      )}
    </InnerPageLayout>
  );
};

export default SubscribePage;
