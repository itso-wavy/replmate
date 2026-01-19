'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { dummyAlerts, dummyPlan, dummyReplys } from '@/dummy/dashboard';
import { useUser } from '@/store/authStore';
import { Alert, AlertType } from '@/types';

import { DashboardLayout } from '../_components';
import {
  DashboardPlanCard,
  type DashboardReply,
  DashboardReplyCard,
  DashboardStoresCard,
  DashboardTodayCard,
  RecentRepliesTable,
} from './_components';

const DashboardPage = () => {
  const router = useRouter();
  const user = useUser();

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
      alerts={sortDashboardAlerts(dummyAlerts)}
    >
      <>
        <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
          <DashboardPlanCard
            isIdentifyed={user?.is_verified}
            plan={dummyPlan}
          />
          <DashboardTodayCard todayReplys={0} />
          <DashboardReplyCard replys={dummyReplys} />
          <DashboardStoresCard stores={2} />
        </div>

        <Card className='block p-4'>
          <div className='flex w-full items-center justify-between pt-1 pb-2'>
            <h2 className='typo-heading-18 px-2'>최근 생성된 리플</h2>
            <Button variant='ghost' onClick={() => router.push('/replys')}>
              전체 보기
            </Button>
          </div>

          {/* <RecentRepliesTable replies={dummyReplies} /> */}
        </Card>
      </>
    </DashboardLayout>
  );
};

export default DashboardPage;
