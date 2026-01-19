'use client';

import { useRouter } from 'next/navigation';

import { CustomAlertProps } from '@/components/global/CustomAlert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { dummyAlerts } from '@/dummy/dashboard';
import { AlertType } from '@/types/enums';

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

  const sortDashboardAlerts = (alerts: CustomAlertProps[]) => {
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
          {/* <DashboardPlanCard
            isIdentifyed={dummyUser.isIdentifyed}
            plan={dummyUser.plan}
          />
          <DashboardTodayCard todayReplys={0} />
          <DashboardReplyCard replys={dummyUser.replys} />
          <DashboardStoresCard stores={2} /> */}
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
