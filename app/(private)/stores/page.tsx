'use client';

import { useEffect, useState } from 'react';

import { StoreLimitExceededModal } from '@/components/modal';
import { dummyStoreAlert } from '@/dummy/alerts';
import { dummyStores } from '@/dummy/stores';
import { dummySubscription } from '@/dummy/subscription';
import { sortStoreList } from '@/lib/utils';

import { DashboardLayout } from '../_components';
import { AddNewCard, StoreCard } from './_components';

const StoresPage = () => {
  const [isPlanLimitModalOpen, setIsPlanLimitModalOpen] = useState(false);
  const sortedStoreList = sortStoreList(dummyStores);

  useEffect(() => {
    // TODO: 백엔드에서 '조정 필요' 상태 확인
    const needsAdjustment = false; // 임시
    if (needsAdjustment) setIsPlanLimitModalOpen(true);
  }, []);

  return (
    <DashboardLayout
      heading='쇼핑몰 연동'
      description={
        // FIXME:
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
      alerts={[dummyStoreAlert]}
    >
      <div className='grid auto-rows-[minmax(315px,auto)] grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4'>
        {sortedStoreList.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
        <AddNewCard />
      </div>

      {isPlanLimitModalOpen && (
        <StoreLimitExceededModal
          stores={sortedStoreList}
          maxAllowed={3} // TODO: 새롭게 변경될 플랜의 맥스 연동 수
          open={isPlanLimitModalOpen}
          onOpenChange={setIsPlanLimitModalOpen}
        />
      )}
    </DashboardLayout>
  );
};

export default StoresPage;
