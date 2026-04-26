import { useMemo } from 'react';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { SentimentBadge } from '@/components/global';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { ReplyDomain } from '@/types';

// Make some columns!
const columns: ColumnDef<ReplyDomain>[] = [
  {
    id: 'productName',
    header: '상품명',
    accessorFn: (row) => row.product.name,
    cell: ({ getValue }) => (
      <div className='font-medium'>{getValue() as string}</div>
    ),
    size: 3,
  },
  {
    id: 'sentimentLevel',
    header: () => <div className='text-center'>감정 분석</div>,
    accessorFn: (row) => row.sentimentLevel,
    cell: ({ getValue }) => {
      return (
        <div className='text-center'>
          <SentimentBadge size='sm' score={getValue() as number} />
        </div>
      );
    },
    size: 2,
  },
  {
    id: 'content',
    header: '리플 내용',
    accessorFn: (row) => row.aiText,
    cell: ({ getValue }) => {
      const content = getValue() as string;
      return (
        <div
          className='typo-body-14 truncate hover:overflow-visible hover:break-words hover:whitespace-normal'
          title={content}
        >
          {content}
        </div>
      );
    },
    size: 8,
  },
  {
    id: 'createdAt',
    header: '작성일',
    accessorFn: (row) => row.createdAt,
    cell: ({ getValue }) => <div>{formatDate(getValue() as string)}</div>,
    size: 2,
  },
];

interface RecentRepliesTableProps {
  replies: ReplyDomain[];
  maxRows?: number;
}

const RecentRepliesTable = ({
  replies,
  maxRows = 15,
}: RecentRepliesTableProps) => {
  // 백엔드에서 정렬된 상태로 전달받으므로 프론트 정렬 생략
  // const sortedReplies = [...replies].sort((a, b) => {
  //   const dateA = new Date(a.createdAt).getTime();
  //   const dateB = new Date(b.createdAt).getTime();
  //   return dateB - dateA;
  // });

  const data = useMemo(() => replies.slice(0, maxRows), [replies, maxRows]);

  const table = useReactTable({
    data,
    columns,
    defaultColumn: { minSize: 0 },
    getCoreRowModel: getCoreRowModel(), // 데이터를 행으로 변환
  });

  const totalSize = table
    .getAllColumns()
    .reduce((sum, col) => sum + col.getSize(), 0);

  return (
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
        {table.getRowModel().rows?.length ? (
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
              className='h-[200px] text-center'
            >
              7일 이내에 생성된 리플이 없습니다.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default RecentRepliesTable;
