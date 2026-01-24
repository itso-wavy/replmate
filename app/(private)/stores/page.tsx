'use client';

import { useEffect, useState } from 'react';

import { compareDesc } from 'date-fns';

import { StoreLimitExceededModal } from '@/components/modal';
import { dummyStores, storeAlert } from '@/dummy/stores';
import { dummySubscription } from '@/dummy/subscription';

import { DashboardLayout } from '../_components';
import { AddNewCard, StoreCard } from './_components';

const StoresPage = () => {
  const [isPlanLimitModalOpen, setIsPlanLimitModalOpen] = useState(false);

  useEffect(() => {
    // TODO: 백엔드에서 '조정 필요' 상태 확인
    const needsAdjustment = true; // 임시
    if (needsAdjustment) setIsPlanLimitModalOpen(true);
  }, []);

  return (
    <DashboardLayout
      heading='쇼핑몰 연동'
      description={
        <span className='align-center flex'>
          <span>연동할 쇼핑몰을 등록해 주세요.</span>
          <span className='align-center text-warmgray-900 typo-body-16 ml-0.5 flex font-medium *:inline-block *:h-0'>
            <span className='typo-link-14'>(</span>
            {/* 인증 완료 상태인 현재 등록 쇼핑몰 수 */}
            <span>활성 상태: {dummySubscription.storeQuotaUsed}</span>
            <span>/</span>
            {/* 최대 허용 쇼핑몰 수 */}
            <span>{dummySubscription.storeQuotaTotal}개</span>
            <span className='typo-link-14'>)</span>
          </span>
        </span>
      }
      alerts={[storeAlert]}
    >
      <div className='grid auto-rows-[minmax(350px,auto)] grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4'>
        {/* 최신 순 정렬 */}
        {[...dummyStores]
          .sort((a, b) =>
            compareDesc(new Date(a.createdAt), new Date(b.createdAt))
          )
          .map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        <AddNewCard />
      </div>

      {isPlanLimitModalOpen && (
        <StoreLimitExceededModal
          stores={dummyStores}
          maxAllowed={3} // TODO: 새롭게 변경될 플랜의 맥스 연동 수
          open={isPlanLimitModalOpen}
          onOpenChange={setIsPlanLimitModalOpen}
        />
      )}
    </DashboardLayout>
  );
};

export default StoresPage;
