'use client';

import { useEffect, useState } from 'react';

import { StoreLimitExceededModal } from '@/components/modal';

import { DashboardLayout } from '../_components';
import { AddNewCard, StoreCard } from './_components';
import { useStoresPage } from './_hooks/useStoresPage';

const StoresPage = () => {
  const [isPlanLimitModalOpen, setIsPlanLimitModalOpen] = useState(false);
  const {
    sortedStores,
    registeredStoreCount,
    storeQuotaTotal,
    needsAdjustment,
    storeLimitExceeded,
    futureMaxStoreCount,
  } = useStoresPage();

  useEffect(() => {
    if (needsAdjustment) setIsPlanLimitModalOpen(true);
  }, [needsAdjustment]);

  return (
    <DashboardLayout
      heading='쇼핑몰 관리'
      description={
        <span className='align-center flex'>
          <span>연동할 쇼핑몰을 등록해 주세요.</span>
          <span className='align-center typo-body-16 ml-0.5 flex font-medium text-zinc-900 *:inline-block *:h-0'>
            <span className='typo-link-14'>(</span>
            {/* 승인 대기/활성/비활성화 예정 쇼핑몰 수의 합산*/}
            <span>등록된 쇼핑몰 {registeredStoreCount}</span>
            <span>/</span>
            {/* 최대 허용 쇼핑몰 수 */}
            <span>{storeQuotaTotal}개</span>
            <span className='typo-link-14'>)</span>
          </span>
        </span>
      }
    >
      <div className='grid auto-rows-[minmax(315px,auto)] grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-4'>
        {sortedStores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
        <AddNewCard storeLimitExceeded={storeLimitExceeded} />
      </div>

      {isPlanLimitModalOpen && futureMaxStoreCount !== undefined && (
        <StoreLimitExceededModal
          stores={sortedStores}
          maxAllowed={futureMaxStoreCount}
          open={isPlanLimitModalOpen}
          onOpenChange={setIsPlanLimitModalOpen}
        />
      )}
    </DashboardLayout>
  );
};

export default StoresPage;
