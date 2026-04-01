'use client';

import { useState } from 'react';

import { ReceiptText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  dummyUsageLedger,
  dummyUsageRemaining,
  dummyUserPlanInfo,
} from '@/dummy/subscription';
import { formatDate } from '@/lib/utils';
import { UserStore } from '@/store/userStore';

import { InnerPageLayout, InnerPageSection } from '../_components';
import { SubscriptionInfo, UsageLedgerTable } from './_components';

const ITEMS_PER_PAGE = 5;

const SubscribePage = () => {
  const user = UserStore.useUser();
  const [currentPage, setCurrentPage] = useState(1);

  const userPlan = dummyUserPlanInfo;
  const ledger = dummyUsageLedger;
  const remaining = dummyUsageRemaining;

  const isVerified = user?.isVerified ?? false;
  const isFree = userPlan.plan.monthlyPrice === 0;

  const quotaTotal = userPlan.plan.monthlyReplyQuota;
  const quotaUsed = quotaTotal - remaining;
  const quotaPercent = Math.min(
    Math.round((quotaUsed / quotaTotal) * 100),
    100
  );

  const totalPages = Math.ceil(ledger.length / ITEMS_PER_PAGE);
  const pagedLedger = ledger.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePlanChange = () => {};
  const handlePaymentChange = () => {};
  const handleReactivate = () => {};
  const handleRequestReceipt = () => {};

  return (
    <InnerPageLayout heading='구독 관리'>
      {/* 구독 정보 */}
      <InnerPageSection heading='구독 정보'>
        <SubscriptionInfo
          userPlan={userPlan}
          isVerified={isVerified}
          onPlanChange={handlePlanChange}
          onPaymentChange={handlePaymentChange}
          onReactivate={handleReactivate}
        />
      </InnerPageSection>

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

      {/* 결제 내역 요청 (유료 플랜) */}
      {!isFree && (
        <InnerPageSection heading='결제 내역 요청'>
          <div className='flex items-center justify-between gap-2'>
            <p className='typo-body-16 text-foreground-description flex flex-col lg:flex-row'>
              <span>결제 영수증은 담당자에게 요청하실 수 있습니다. </span>
              <span>요청시 모든 결제 내역을 이메일로 보내 드립니다.</span>
            </p>
            <Button
              onClick={handleRequestReceipt}
              variant='outline'
              className='shrink-0'
            >
              <ReceiptText size={14} />
              영수증 요청
            </Button>
          </div>
        </InnerPageSection>
      )}

      {/* 리플 사용 이력 */}
      <InnerPageSection heading='리플 사용 이력'>
        <UsageLedgerTable
          items={dummyUsageLedger} // FIXME: 더미데이터 실데이터로 교체
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </InnerPageSection>
    </InnerPageLayout>
  );
};

export default SubscribePage;
