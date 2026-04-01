'use client';

import { useMemo } from 'react';

import { Card } from '@/components/ui/card';
import { alertsConfig, toAlert } from '@/constants/alerts';
import { useReminders } from '@/hooks';
import { Alert, AlertType } from '@/types';

import { DashboardLayout, StoreCombobox } from '../_components';
import { StoreReplysTable } from './_components';
import { useReplysPage } from './_hooks/useReplysPage';

const ReplysPage = () => {
  const {
    hasStores,
    replies,
    isLoading,
    currentPage,
    totalPages,
    onPageChange,
    handleStoreChange,
  } = useReplysPage({
    PAGE_SIZE: 20,
  });

  const { data: remindersData } = useReminders();

  const alerts = useMemo<Alert[]>(() => {
    const result: Alert[] = [];

    if (!hasStores) {
      result.push(alertsConfig[AlertType.STORE_CONNECTION_REQUIRED]);
    }

    if (remindersData) {
      remindersData.forEach((r) => {
        const alert = toAlert(r);
        if (alert) result.push(alert);
      });
    }

    return result;
  }, [hasStores, remindersData]);

  return (
    <DashboardLayout
      heading='리플 확인'
      description='매일 오전 6시에 새로운 리플이 업데이트됩니다.'
      alerts={alerts}
    >
      <Card className='flex flex-1 flex-col gap-0 overflow-visible px-0 py-0 *:px-4'>
        {/* Controls Bar */}
        <div className='bg-background sticky top-0 z-10 flex w-full items-center justify-between rounded-t-2xl py-4 shadow-[0_3px_5px_0_rgba(0,0,0,0.05)]'>
          <StoreCombobox onStoreChange={handleStoreChange} />
        </div>

        <div className='relative'>
          <StoreReplysTable
            replies={replies}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default ReplysPage;
