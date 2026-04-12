'use client';

import { useMemo } from 'react';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { TablePagination } from '@/components/global';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn, formatDate } from '@/lib/utils';
import { UsageEventType, UsageLedgerDomain } from '@/types';

const usageEventLabelMap: Record<UsageEventType, string> = {
  [UsageEventType.GRANT]: '충전',
  [UsageEventType.USE]: '사용',
  [UsageEventType.TEST_USE]: '사용',
  [UsageEventType.TEST_GRANT]: '충전',
};

const getUsageDetail = (
  eventType: UsageEventType,
  reason: string | null | undefined,
  meta: Record<string, unknown> | null
) => {
  if (eventType === UsageEventType.USE) {
    return meta?.storeName ? `리플 생성 (${meta.storeName})` : '리플 생성';
  }
  if (eventType === UsageEventType.TEST_USE) {
    return meta?.storeName ? `테스트 리플 (${meta.storeName})` : '테스트 리플';
  }
  if (eventType === UsageEventType.TEST_GRANT) {
    return '테스트 사용량 충전';
  }
  if (eventType === UsageEventType.GRANT) {
    if (meta?.planName) return `월간 충전 (${meta.planName})`;
    if (reason) return reason;
    return '충전';
  }
  return '-';
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
          <div>{formatDate(getValue() as Date, 'yyyy.MM.dd HH:mm')}</div>
        ),
        size: 5,
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
        size: 3,
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
        size: 5,
      },
      {
        id: 'detail',
        header: '상세',
        cell: ({ row }) => (
          <div>{getUsageDetail(row.original.eventType, row.original.reason, row.original.meta)}</div>
        ),
        size: 8,
      },
    ],
    []
  );

  const table = useReactTable({
    data: items,
    columns,
    defaultColumn: { minSize: 0 },
    getCoreRowModel: getCoreRowModel(),
  });

  const totalSize = table
    .getAllColumns()
    .reduce((sum, col) => sum + col.getSize(), 0);

  return (
    <>
      <Table className='table-fixed'>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className='typo-button-14 bg-muted/50'
                  style={{ width: `${(header.getSize() / totalSize) * 100}%` }}
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

        <TableBody className='typo-body-14'>
          {isLoading ? (
            <TableRow className='hover:bg-inherit'>
              <TableCell
                colSpan={columns.length}
                className='h-[200px] text-center'
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
