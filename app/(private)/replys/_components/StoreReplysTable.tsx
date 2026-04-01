'use client';

import TablePagination from '@/components/global/TablePagination';
import { Spinner } from '@/components/ui/spinner';
import type { ReplyDomain } from '@/types';

import ReplyCard from './ReplyCard';

interface StoreReplysTableProps {
  replies: ReplyDomain[];
  isLoading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const StoreReplysTable = ({
  replies = [],
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}: StoreReplysTableProps) => {
  const isEmpty = !isLoading && replies?.length === 0;

  return (
    <div className='flex flex-col gap-4 py-4'>
      <div className='flex flex-col gap-4'>
        {isLoading ? (
          <div className='flex h-[400px] items-center justify-center'>
            <Spinner className='size-6' />
          </div>
        ) : isEmpty ? (
          <div className='typo-body-14 text-muted-foreground flex h-[400px] items-center justify-center text-center'>
            조회할 수 있는 리플이 없습니다.
          </div>
        ) : (
          replies.map((reply) => <ReplyCard key={reply.id} reply={reply} />)
        )}
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default StoreReplysTable;
