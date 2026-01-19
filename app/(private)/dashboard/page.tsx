'use client';

import { useRouter } from 'next/navigation';

import { CustomAlertProps } from '@/components/global/CustomAlert';
import CustomAlert from '@/components/global/CustomAlert';
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

  const getDashboardAlerts = (alerts: CustomAlertProps[]) => {
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
      alerts={getDashboardAlerts(dummyAlerts)}
    >
      {/* {} */}
    </DashboardLayout>
  );
};

export default DashboardPage;
