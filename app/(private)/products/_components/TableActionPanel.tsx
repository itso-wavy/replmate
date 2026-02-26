import { RotateCcw, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item';

const TableActionPanel = () => {
  return (
    <Item
      variant='outline'
      className='bg-card border-primary fixed right-1/2 bottom-[110px] left-1/2 z-50 w-fit -translate-x-1/2 gap-1 shadow-md *:whitespace-nowrap'
    >
      <div className='flex items-center'>
        <ItemContent className='typo-button-14 flex flex-row gap-4'>
          <div className='text-foreground flex items-center'>
            <div className='mr-1.5'>쇼핑몰A</div>
            <div className='text-foreground-description-muted rounded-[8px] border px-1.5 py-1'>
              <span className='text-foreground'>5</span>
              <span className='mx-0.5'>/</span>
              <span>10</span>
            </div>
          </div>

          <div className='text-foreground-description flex items-center'>
            <div className='mr-1.5'>전체</div>
            <div className='text-foreground-description-muted rounded-[8px] border px-1.5 py-1'>
              <span>5</span>
              <span className='mx-0.5'>/</span>
              <span>10</span>
            </div>
          </div>
        </ItemContent>

        <ItemSeparator orientation='vertical' className='mx-6 h-7' />

        <ItemActions className='flex-row gap-2'>
          <Button variant='outline'>
            <RotateCcw />
            {/* 초기화 */}
          </Button>
          <Button>
            <Save />
            {/* 저장하기 */}
          </Button>
        </ItemActions>
      </div>

      {/* <p className='typo-caption-12 text-muted-foreground mx-auto mt-1'>
        마지막 저장: 2026년 2월 3일 12:08
      </p> */}
    </Item>
  );
};

export default TableActionPanel;
