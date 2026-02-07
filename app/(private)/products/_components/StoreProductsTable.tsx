'use client';

import { useMemo } from 'react';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { dummyProducts } from '@/dummy/products';
import { formatDate, formatPrice } from '@/lib/utils';
import { ProductDomain } from '@/types';

// Make some columns!
const columns: ColumnDef<ProductDomain>[] = [
  /* 
  TODO:  체크박스 추가하기  */
  {
    id: 'id',
    header: '상품 번호',
    accessorFn: (row) => row.id,
    size: 200, // 컬럼 너비 (선택)
    cell: ({ getValue }) => (
      <div className='font-medium'>{getValue() as number}</div>
    ),
  },
  {
    id: 'name',
    header: '상품명',
    accessorFn: (row) => row.name,
    cell: ({ getValue }) => (
      <div className='font-medium'>{getValue() as string}</div>
    ),
  },
  {
    id: 'price',
    header: '가격',
    accessorFn: (row) => row.price,
    cell: ({ getValue }) => {
      const price = getValue() as number | null;
      return (
        <div className='font-medium'>
          {price !== null ? formatPrice(price) : '-'}원
        </div>
      );
    },
  },
  {
    id: 'reviewCount',
    header: () => '평점',
    accessorFn: (row) => row.reviewCount,
    cell: ({ getValue }) => {
      const count = getValue() as number | null;
      return <div className='text-center'>{count !== null ? count : '-'}</div>;
    },
  },
  {
    id: 'registeredAt',
    header: '등록일',
    accessorFn: (row) => row.registeredAt,
    cell: ({ getValue }) => {
      const date = getValue() as Date | null;
      return <div>{date ? formatDate(date.toISOString()) : '-'}</div>;
    },
  },
];

interface StoreProductsTableProps {
  maxRows?: number;
}

const StoreProductsTable = ({ maxRows = 15 }: StoreProductsTableProps) => {
  // 최신순 정렬
  const filteredAndSortedProducts = useMemo(() => {
    const products = dummyProducts;

    // 등록일 기준 내림차순 정렬 (최신순)
    const sorted = [...products].sort((a, b) => {
      const dateA = a.registeredAt ? a.registeredAt.getTime() : 0;
      const dateB = b.registeredAt ? b.registeredAt.getTime() : 0;
      return dateB - dateA;
    });

    return sorted.slice(0, maxRows);
  }, [maxRows]);

  const table = useReactTable({
    data: filteredAndSortedProducts,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
  );
};

export default StoreProductsTable;
