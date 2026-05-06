import {
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from '@phosphor-icons/react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '../ui/pagination';

interface TablePaginationProps {
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
}

const TablePagination = ({
  onPageChange,
  currentPage,
  totalPages,
}: TablePaginationProps) => {
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (page) =>
      page === 1 ||
      page === totalPages ||
      (page >= currentPage - 1 && page <= currentPage + 1)
  );

  return (
    <div className='py-4'>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              aria-label='Go to first page'
              onClick={() => !isFirst && onPageChange(1)}
              disabled={isFirst}
            >
              <CaretDoubleLeftIcon />
            </PaginationLink>
          </PaginationItem>

          <PaginationItem className='mr-0.5'>
            <PaginationLink
              aria-label='Go to previous page'
              onClick={() => !isFirst && onPageChange(currentPage - 1)}
              disabled={isFirst}
            >
              <CaretLeftIcon />
            </PaginationLink>
          </PaginationItem>

          {pages.flatMap((page, idx, arr) => {
            const items = [
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => onPageChange(page)}
                  className='cursor-pointer'
                >
                  {page}
                </PaginationLink>
              </PaginationItem>,
            ];
            const next = arr[idx + 1];
            if (next && next - page > 1) {
              items.push(
                <PaginationItem key={`gap-${page}`} className='-mx-3'>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            return items;
          })}

          <PaginationItem className='ml-0.5'>
            <PaginationLink
              aria-label='Go to next page'
              onClick={() => !isLast && onPageChange(currentPage + 1)}
              disabled={isLast}
            >
              <CaretRightIcon />
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              aria-label='Go to final page'
              onClick={() => !isLast && onPageChange(totalPages)}
              disabled={isLast}
            >
              <CaretDoubleRightIcon />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TablePagination;
