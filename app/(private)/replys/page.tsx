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

/* 
플랫폼: 네이버 브랜드 스토어
상품명: [80일분] 얼라이브 원스데일리 포맨 종합 멀티 남성 비타민 80정 1박스
캡처 2개 필요 */
