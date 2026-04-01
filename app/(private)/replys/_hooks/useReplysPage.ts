import { useEffect, useState } from 'react';

import { useReplies } from '@/hooks/useReplies';
import { StoreStore } from '@/store/storeStore';

export function useReplysPage({ PAGE_SIZE }: { PAGE_SIZE: number }) {
  const selectedStoreId = StoreStore.useSelectedStoreId();
  const { setSelectedStore } = StoreStore.useActions();
  const [currentPage, setCurrentPage] = useState(1);

  // 스토어 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStoreId]);

  const { data, isLoading } = useReplies({
    storeId: selectedStoreId ?? 0,
    page: currentPage,
    size: PAGE_SIZE,
  });

  const handleStoreChange = (storeId: number) => {
    setSelectedStore(storeId);
  };

  return {
    replies: data?.items ?? [],
    isLoading,
    currentPage,
    totalPages: data?.totalPages ?? 1,
    onPageChange: setCurrentPage,
    handleStoreChange,
  };
}
