'use client';

import { AlertCircle } from 'lucide-react';

import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
interface ProductCountIndicatorProps {
  selectedCount: number;
  maxAllowed: number;
}

const ProductCountIndicator = ({
  selectedCount,
  maxAllowed,
}: ProductCountIndicatorProps) => {
  return (
    <Card className='bg-input/30 border-input px-3 py-2'>
      <div className='text-foreground-description typo-body-14 flex items-center font-medium *:whitespace-nowrap'>
        <Tooltip defaultOpen={true}>
          <TooltipTrigger>
            <AlertCircle size={14} className='text-primary' />
          </TooltipTrigger>
          <TooltipContent className='bg-brand-800 *:bg-brand-800 px-4 whitespace-pre-line'>
            <p>{`현재 활성화된 전체 쇼핑몰의 상품 선택 합계입니다.`}</p>
          </TooltipContent>
        </Tooltip>

        <span className='mr-2 ml-1.5'>전체 상품</span>
        <div className='flex h-0 items-center'>
          <span className='text-primary typo-body-16 font-semibold'>
            {selectedCount}
          </span>
          <span className='mx-1'>/</span>
          <span className='font-semibold'>{maxAllowed}</span>
        </div>
        <span className='ml-0.5'>개</span>
      </div>
    </Card>
  );
};

export default ProductCountIndicator;
