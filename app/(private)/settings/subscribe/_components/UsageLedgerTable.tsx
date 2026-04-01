'use client';

import { useMemo } from 'react';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import TablePagination from '@/components/global/TablePagination';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { UsageLedgerDomain } from '@/types/domain/usage';
import { UsageEventType } from '@/types/enums';

const usageEventLabelMap: Record<UsageEventType, string> = {
  [UsageEventType.USE]: '이동',
  [UsageEventType.FREE_GRANT]: '충전',
  [UsageEventType.SUBSCRIPTION_GRANT]: '충전',
  [UsageEventType.MANUAL_ADJUST]: '조정',
};

const getUsageDetail = (
  eventType: UsageEventType,
  meta: Record<string, unknown> | null
) => {
  if (eventType === UsageEventType.USE) {
    return meta?.storeName ? `리플 생성 (${meta.storeName})` : '리플 생성';
  }
  if (eventType === UsageEventType.SUBSCRIPTION_GRANT) {
    return meta?.planName ? `월간 충전 (${meta.planName})` : '월간 충전';
  }
  if (eventType === UsageEventType.FREE_GRANT) {
    return '무료 충전';
  }
  return '수동 조정';
};

interface UsageLedgerTableProps {
  items: UsageLedgerDomain[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const UsageLedgerTable = ({
  items,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: UsageLedgerTableProps) => {
  const columns: ColumnDef<UsageLedgerDomain>[] = useMemo(
    () => [
      {
        id: 'occurredAt',
        header: '일시',
        accessorFn: (row) => row.occurredAt,
        cell: ({ getValue }) => (
          <div className='text-muted-foreground'>
            {formatDate(getValue() as Date, 'yyyy.MM.dd HH:mm')}
          </div>
        ),
      },
      {
        id: 'eventType',
        header: '구분',
        accessorFn: (row) => row.eventType,
        cell: ({ row }) => (
          <span
            className={cn(
              'typo-caption-12 rounded-full px-2.5 py-0.5 font-medium',
              row.original.deltaQuantity < 0
                ? 'bg-rose-50 text-rose-500'
                : 'bg-brand-50 text-brand-500'
            )}
          >
            {usageEventLabelMap[row.original.eventType]}
          </span>
        ),
      },
      {
        id: 'deltaQuantity',
        header: '변경 수량',
        accessorFn: (row) => row.deltaQuantity,
        cell: ({ getValue }) => {
          const delta = getValue() as number;
          return (
            <div
              className={cn(
                'font-medium tabular-nums',
                delta < 0 ? 'text-rose-500' : 'text-brand-500'
              )}
            >
              {delta > 0 ? '+' : ''}
              {delta}
            </div>
          );
        },
      },
      {
        id: 'detail',
        header: '상세',
        cell: ({ row }) => (
          <div className='text-muted-foreground'>
            {getUsageDetail(row.original.eventType, row.original.meta)}
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className='typo-button-14 bg-muted/50'
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow className='hover:bg-inherit'>
              <TableCell
                colSpan={columns.length}
                className='typo-body-14 text-muted-foreground h-[200px] text-center'
              >
                <Spinner className='mx-auto size-6' />
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className='hover:bg-inherit'>
              <TableCell
                colSpan={columns.length}
                className='typo-body-14 text-muted-foreground h-[200px] text-center'
              >
                리플 사용 이력이 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default UsageLedgerTable;
