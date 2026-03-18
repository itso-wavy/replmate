import { Card } from '@/components/ui/card';

import { DashboardLayout, StoreCombobox } from '../_components';
import { StoreReplysTable } from './_components';

const ReplysPage = () => {
  return (
    <DashboardLayout
      heading='리플 확인'
      description='매일 오전 6시에 새로운 리플이 업데이트됩니다.'
      alerts={[]}
    >
      <Card className='flex flex-1 flex-col gap-0 overflow-visible px-0 py-0 *:px-4'>
        {/* Controls Bar */}
        <div className='bg-background sticky top-0 z-10 flex w-full items-center justify-between rounded-t-2xl py-4 shadow-[0_3px_5px_0_rgba(0,0,0,0.05)]'>
          <StoreCombobox />
        </div>

        <div className='relative'>
          <StoreReplysTable maxRows={20} />

          {/* <TableActionPanel /> */}
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default ReplysPage;
