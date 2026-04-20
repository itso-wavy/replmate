'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/nav-menu';
import { dummyRecentReplies } from '@/dummy/replies';
import { UserStore } from '@/store/userStore';

import { DashboardLayout } from '../_components';
import {
  DashboardPlanCard,
  DashboardReplyCard,
  DashboardStoresCard,
  DashboardTodayCard,
  RecentRepliesTable,
} from './_components';
import { useDashboardPage } from './_hooks/useDashboardPage';

const DashboardPage = () => {
  const router = useRouter();
  const user = UserStore.useUser();

  const { stores, subscription, todayReplyCount, recentReplies, isLoading } =
    useDashboardPage();

  if (isLoading || !subscription) {
    return (
      <DashboardLayout heading='대시보드'>
        <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className='h-[160px] rounded-2xl' />
          ))}
        </div>
        <Skeleton className='h-[300px] rounded-2xl' />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout heading='대시보드'>
      <>
        <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
          <DashboardPlanCard
            isIdentifyed={user?.isVerified ?? false}
            subscription={subscription}
          />
          <DashboardTodayCard todayReplyCount={todayReplyCount} />
          <DashboardReplyCard subscription={subscription} />
          <DashboardStoresCard stores={stores} />
        </div>

        <Card className='block p-4'>
          <div className='flex h-[56px] w-full items-center justify-between pt-1 pb-2'>
            <div className='typo-heading-18 px-2'>최근 생성된 리플</div>
            <Button
              variant='outline'
              onClick={() => router.push(ROUTES.REPLYS)}
              className='h-[36px]! rounded-[12px] bg-transparent'
            >
              전체 보기
            </Button>
          </div>

          <RecentRepliesTable replies={recentReplies} />
        </Card>
      </>
    </DashboardLayout>
  );
};

export default DashboardPage;
