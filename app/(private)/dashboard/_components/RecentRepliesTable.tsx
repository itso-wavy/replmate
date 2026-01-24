import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import SentimentBadge from '@/components/global/SentimentBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/date';
import { SentimentType } from '@/types';

// Define your row shape
export interface DashboardReply {
  id: number;
  productName: string;
  sentiment: {
    type: SentimentType;
    score: number;
  };
  content: string;
  createdAt: string;
}

// Make some columns!
const columns: ColumnDef<DashboardReply>[] = [
  {
    id: 'productName',
    header: '상품명',
    accessorFn: (row) => row.productName,
    cell: ({ getValue }) => (
      <div className='font-medium'>{getValue() as string}</div>
    ),
  },
  {
    id: 'sentiment',
    header: () => <div className='text-center'>감정 분석</div>,
    accessorFn: (row) => row.sentiment,
    cell: ({ getValue }) => {
      const sentiment = getValue() as { type: SentimentType; score: number };
      return (
        <div className='text-center'>
          <SentimentBadge sentiment={sentiment.type} />
        </div>
      );
    },
  },
  {
    id: 'content',
    header: '리플 내용',
    accessorFn: (row) => row.content,
    size: 300,
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
  },
  {
    id: 'createdAt',
    header: '작성일',
    accessorFn: (row) => row.createdAt,
    cell: ({ getValue }) => <div>{formatDate(getValue() as string)}</div>,
  },
];

interface RecentRepliesTableProps {
  replies: DashboardReply[];
  maxRows?: number;
}

const RecentRepliesTable = ({
  replies,
  maxRows = 15,
}: RecentRepliesTableProps) => {
  // 4. 작성시간 기준 내림차순 정렬 (최신순)
  const sortedReplies = [...replies].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA; // 내림차순: 최신 날짜가 먼저
  });

  const table = useReactTable({
    data: sortedReplies.slice(0, maxRows),
    columns,
    getCoreRowModel: getCoreRowModel(), // 데이터를 행으로 변환
  });

  return (
    <Table className='table-fixed'>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className='typo-button-14 bg-muted/50'
                style={{ width: `${header.getSize()}px` }}
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
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className='typo-body-14 text-muted-foreground h-[200px] text-center'
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
