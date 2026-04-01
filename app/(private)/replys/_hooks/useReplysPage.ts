import { useEffect, useMemo, useState } from 'react';

import { dummyRepliesByStore } from '@/dummy';
import { useMyStores } from '@/hooks';
import { useReplies } from '@/hooks/useReplies';
import { getActiveStoreList } from '@/lib/utils';
import { StoreStore } from '@/store/storeStore';

export function useReplysPage({ PAGE_SIZE }: { PAGE_SIZE: number }) {
  const selectedStoreId = StoreStore.useSelectedStoreId();
  const { setSelectedStore } = StoreStore.useActions();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: myStoresData } = useMyStores();
  const stores = myStoresData?.stores ?? [];

  const activeStores = useMemo(() => getActiveStoreList(stores), [stores]);
  const hasStores = activeStores.length > 0;

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
    hasStores,
    // replies: data?.items ?? [],
    replies: dummyRepliesByStore[1],
    isLoading,
    currentPage,
    totalPages: data?.totalPages ?? 1,
    onPageChange: setCurrentPage,
    handleStoreChange,
  };
}
