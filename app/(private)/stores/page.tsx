import { compareDesc } from 'date-fns';

import { dummyStores, storeAlert } from '@/dummy/stores';
import { dummySubscription } from '@/dummy/subscription';

import { DashboardLayout } from '../_components';
import { AddNewCard, StoreCard } from './_components';

const StoresPage = () => {
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
    </DashboardLayout>
  );
};

export default StoresPage;
