import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
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
  return (
    <div className='py-4'>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className='hover:bg-accent cursor-pointer'
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
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
                    onClick={() => onPageChange(page)}
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
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TablePagination;
