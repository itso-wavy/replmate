'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { dummyStores } from '@/dummy';
import {
  getProductsByStoreId,
  getTotalTargetProductCount,
} from '@/dummy/products';
import { formatDate, formatPrice } from '@/lib/utils';
import { StoreStore } from '@/store/storeStore';
import { UserStore } from '@/store/userStore';
import { ProductDomain } from '@/types';

interface StoreProductsTableProps {
  maxRows?: number;
}

const StoreProductsTable = ({ maxRows = 15 }: StoreProductsTableProps) => {
  const selectedStoreId = StoreStore.useSelectedStoreId();
  const planInfo = UserStore.usePlanInfo();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // 스토어 변경 시 초기화
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, [selectedStoreId]);

  const maxAllowed = planInfo?.maxProductPerStore || 0;
  const itemsPerPage = maxRows;

  const currentStore = dummyStores.find((s) => s.id === selectedStoreId);

  const products = useMemo(() => {
    if (!selectedStoreId) return [];
    return getProductsByStoreId(selectedStoreId);
  }, [selectedStoreId]);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return products.slice(start, start + itemsPerPage);
  }, [products, currentPage, itemsPerPage]);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= maxAllowed) {
          toast.error(`최대 ${maxAllowed}개까지 선택할 수 있습니다.`);
          return prev;
        }
        next.add(id);
      }
      return next;
    });
  };

  const handleSave = () => {
    setLastSaved(new Date());
    toast.success('저장되었습니다.');
  };

  const formatLastSaved = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${h}시 ${m}분 ${s}초`;
  };

  // 컬럼 정의
  const columns: ColumnDef<ProductDomain>[] = useMemo(
    () => [
      {
        id: 'select',
        header: () => null,
        cell: ({ row }) => (
          <Checkbox
            checked={selectedIds.has(row.original.id.toString())}
            onCheckedChange={() => handleToggle(row.original.id.toString())}
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
    [selectedIds, maxAllowed]
  );

  const table = useReactTable({
    data: paginatedProducts,
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

      <div className='py-4'>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className='hover:bg-accent cursor-pointer'
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                      className='cursor-pointer'
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              return null;
            })}
            <PaginationItem>
              <PaginationNext
                className='hover:bg-accent cursor-pointer'
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default StoreProductsTable;
