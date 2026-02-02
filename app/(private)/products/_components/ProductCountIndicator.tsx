'use client';

import { AlertCircle } from 'lucide-react';

import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { dummyStores } from '@/dummy/stores';
import { dummySubscription } from '@/dummy/subscription';
import { getActiveStoreList } from '@/lib/utils';
import { UserStore } from '@/store/userStore';

// interface ProductCountIndicatorProps {
//   selectedTotalProducts: number;
//   capableTotalProducts: number;
// }

/* 
{
  selectedTotalProducts,
  capableTotalProducts,
}: ProductCountIndicatorProps
 */
const ProductCountIndicator = () => {
  const planInfo = UserStore.usePlanInfo();
  const activeStores = getActiveStoreList(dummyStores);

  // TODO: API 기반 데이터로 변경하기
  const { selectedTotalProducts, capableTotalProducts } = dummySubscription;

  return (
    <Card className='bg-input/30 border-input px-3 py-2'>
      <div className='text-foreground-description typo-body-14 flex items-center font-medium *:whitespace-nowrap'>
        <Tooltip defaultOpen={true}>
          <TooltipTrigger>
            <AlertCircle size={14} className='text-primary' />
          </TooltipTrigger>
          <TooltipContent className='bg-brand-800 *:bg-brand-800 px-4 whitespace-pre-line'>
            <p>{`활성화 상태의 모든 쇼핑몰에서 관리 대상으로 선택한 상품의 합산을 나타냅니다.`}</p>
          </TooltipContent>
        </Tooltip>

        <span className='mr-2 ml-1.5'>전체 상품</span>
        <div className='flex h-0 items-center'>
          <span className='text-primary typo-body-16 font-semibold'>
            {selectedTotalProducts | 0}
          </span>
          <span className='mx-1'>/</span>
          <span className='font-semibold'>{capableTotalProducts | 0}</span>
        </div>
        <span className='ml-0.5'>개</span>
      </div>
    </Card>
  );
};

export default ProductCountIndicator;
