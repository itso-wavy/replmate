'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { dummyDashboardAlerts } from '@/dummy/alerts';
import { dummyReplies } from '@/dummy/dashboard';
import { dummySubscription } from '@/dummy/subscription';
import { UserStore } from '@/store/userStore';
import { Alert, AlertType } from '@/types';

import { DashboardLayout } from '../_components';
import {
  DashboardPlanCard,
  DashboardReplyCard,
  DashboardStoresCard,
  DashboardTodayCard,
  RecentRepliesTable,
} from './_components';

const DashboardPage = () => {
  const router = useRouter();
  const user = UserStore.useUser();

  const sortDashboardAlerts = (alerts: Alert[]) => {
    const paymentFailureAlerts = [];
    const otherAlerts = [];
    const sortedAlerts = alerts.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    for (const alert of sortedAlerts) {
      if (alert.type === AlertType.PAYMENT_FAILED) {
        paymentFailureAlerts.push(alert);
      } else {
        otherAlerts.push(alert);
      }
    }

    const top3Alerts = paymentFailureAlerts.concat(otherAlerts).slice(0, 3);

    return top3Alerts;
  };

  return (
    <DashboardLayout
      heading='대시보드'
      alerts={sortDashboardAlerts(dummyDashboardAlerts)}
    >
      <>
        <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
          <DashboardPlanCard
            isIdentifyed={user?.isVerified!}
            subscription={dummySubscription}
          />
          <DashboardTodayCard todayReplyCount={0} />
          <DashboardReplyCard subscription={dummySubscription} />
          <DashboardStoresCard subscription={dummySubscription} />
        </div>

        <Card className='block p-4'>
          <div className='flex w-full items-center justify-between pt-1 pb-2'>
            <div className='typo-heading-18 px-2'>최근 생성된 리플</div>
            <Button variant='ghost' onClick={() => router.push('/replys')}>
              전체 보기
            </Button>
          </div>

          <RecentRepliesTable replies={dummyReplies} />
        </Card>
      </>
    </DashboardLayout>
  );
};

export default DashboardPage;
