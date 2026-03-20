import { RotateCcw, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemSeparator,
} from '@/components/ui/item';

interface TableActionPanelProps {
  storeName: string;
  selectedCount: number;
  maxAllowed: number;
  lastSaved: Date | null;
  isDirty: boolean;
  onSave: () => void;
  onReset: () => void;
  isSaving?: boolean;
}

const formatLastSaved = (date: Date) =>
  `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

const TableActionPanel = ({
  storeName,
  selectedCount,
  maxAllowed,
  lastSaved,
  isDirty,
  onSave,
  onReset,
  isSaving,
}: TableActionPanelProps) => {
  return (
    <Item
      variant='outline'
      className='bg-card border-primary fixed right-1/2 bottom-[110px] left-1/2 z-50 w-fit -translate-x-1/2 gap-1 shadow-md *:whitespace-nowrap'
    >
      <div className='flex items-center'>
        <ItemContent className='typo-button-14 flex flex-col gap-1'>
          <div className='text-foreground flex items-center'>
            <div className='mr-1.5'>{storeName || '쇼핑몰'}</div>
            <div className='text-foreground-description-muted rounded-[8px] border px-1.5 py-1'>
              <span className='text-foreground'>{selectedCount}</span>
              <span className='mx-0.5'>/</span>
              <span>{maxAllowed}</span>
            </div>
          </div>

          {lastSaved && (
            <p className='typo-caption-12 text-muted-foreground'>
              마지막 저장: {formatLastSaved(lastSaved)}
            </p>
          )}
        </ItemContent>

        <ItemSeparator orientation='vertical' className='mx-6 h-7' />

        <ItemActions className='flex-row gap-2'>
          <Button
            variant='outline'
            onClick={onReset}
            disabled={!isDirty || isSaving}
          >
            <RotateCcw />
          </Button>
          <Button onClick={onSave} disabled={isSaving}>
            <Save />
            저장하기
          </Button>
        </ItemActions>
      </div>
    </Item>
  );
};

export default TableActionPanel;
