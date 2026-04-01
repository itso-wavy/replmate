'use client';

import { useMemo } from 'react';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import TablePagination from '@/components/global/TablePagination';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate, formatPrice } from '@/lib/utils';
import { ProductDomain } from '@/types';

interface StoreProductsTableProps {
  products: ProductDomain[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const StoreProductsTable = ({
  products,
  selectedIds,
  onToggle,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}: StoreProductsTableProps) => {
  const columns: ColumnDef<ProductDomain>[] = useMemo(
    () => [
      {
        id: 'select',
        header: () => null,
        cell: ({ row }) => (
          <Checkbox
            checked={selectedIds.has(row.original.id.toString())}
            onCheckedChange={() => onToggle(row.original.id.toString())}
          />
        ),
        size: 40,
      },
      {
        id: 'productNumber',
        header: '상품 번호',
        accessorFn: (row) => row.externalId,
        size: 200,
        cell: ({ getValue }) => (
          <div className='font-medium'>{getValue() as string}</div>
        ),
      },
      {
        id: 'name',
        header: '상품명',
        accessorFn: (row) => row.name,
        cell: ({ getValue }) => (
          <div className='truncate' title={getValue() as string}>
            {getValue() as string}
          </div>
        ),
      },
      {
        id: 'price',
        header: '가격',
        accessorFn: (row) => row.price,
        cell: ({ getValue }) => {
          const price = getValue() as number | null;
          return <div>{price !== null ? `${formatPrice(price)}` : '-'}</div>;
        },
      },
      {
        id: 'rating',
        header: () => '평점',
        accessorFn: (row) => ({
          avgRating: row.avgRating,
          reviewCount: row.reviewCount,
        }),
        cell: ({ getValue }) => {
          const { avgRating, reviewCount } = getValue() as {
            avgRating: number | null;
            reviewCount: number | null;
          };
          if (avgRating === null) return <div>-</div>;
          return (
            <div>
              ★ {avgRating.toFixed(1)}
              {reviewCount !== null && `(${reviewCount.toLocaleString()})`}
            </div>
          );
        },
      },
      {
        id: 'registeredAt',
        header: '등록일',
        accessorFn: (row) => row.registeredAt,
        cell: ({ getValue }) => {
          const date = getValue() as Date | null;
          return <div>{date ? formatDate(date) : '-'}</div>;
        },
      },
    ],
    [selectedIds, onToggle]
  );

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
          {isLoading ? (
            <TableRow className='hover:bg-inherit'>
              <TableCell
                colSpan={columns.length}
                className='typo-body-14 text-muted-foreground h-[400px] text-center'
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
                className='typo-body-14 text-muted-foreground h-[400px] text-center'
              >
                조회할 수 있는 상품이 없습니다.
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

export default StoreProductsTable;
