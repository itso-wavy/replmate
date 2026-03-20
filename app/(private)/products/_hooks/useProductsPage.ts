'use client';

import { useEffect, useMemo, useState } from 'react';

import { toast } from 'sonner';

import { useProducts, useUpdateProduct } from '@/hooks/useProducts';
import { useMyStores } from '@/hooks/useStores';
import { useUserPlan } from '@/hooks/useUser';
import { StoreStore } from '@/store/storeStore';

const PAGE_SIZE = 20;

export type ProductModalType =
  | 'limitExceeded'
  | 'saveConfirm'
  | 'unsavedChanges'
  | null;

function setsEqual(a: Set<string>, b: Set<string>) {
  if (a.size !== b.size) return false;
  for (const id of a) {
    if (!b.has(id)) return false;
  }
  return true;
}

export function useProductsPage() {
  const selectedStoreId = StoreStore.useSelectedStoreId();
  const { data: planData } = useUserPlan();
  const { data: stores = [] } = useMyStores();

  const selectedStore = stores.find((s) => s.id === selectedStoreId);

  const maxAllowed = planData?.plan.maxProductPerStore ?? 0;

  const [currentPage, setCurrentPage] = useState(1);
  const [initialIds, setInitialIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [activeModal, setActiveModal] = useState<ProductModalType>(null);

  const { data: productData, isLoading: isProductsLoading } = useProducts(
    selectedStoreId ?? 0,
    { page: currentPage, size: PAGE_SIZE }
  );

  const products = productData?.items ?? [];
  const totalPages = productData?.totalPages ?? 1;

  // 스토어 변경 시 초기화
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds(new Set());
    setInitialIds(new Set());
    setLastSaved(null);
  }, [selectedStoreId]);

  // 페이지 데이터 로드 시 현재 페이지 isTarget 상태로 초기화
  useEffect(() => {
    if (!productData?.items) return;
    const targetIds = new Set(
      productData.items.filter((p) => p.isTarget).map((p) => p.id.toString())
    );
    setInitialIds(targetIds);
    setSelectedIds(new Set(targetIds));
  }, [productData?.items]);

  const isDirty = useMemo(
    () => !setsEqual(selectedIds, initialIds),
    [selectedIds, initialIds]
  );

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= maxAllowed) {
          toast.error(`최대 ${maxAllowed}개까지만 선택 가능합니다.`);
          return prev;
        }
        next.add(id);
      }
      return next;
    });
  };

  const handleSave = () => {
    if (selectedIds.size > maxAllowed) {
      setActiveModal('limitExceeded');
      return;
    }
    setActiveModal('saveConfirm');
  };

  const handleReset = () => {
    setSelectedIds(new Set(initialIds));
  };

  const { mutateAsync: updateProduct } = useUpdateProduct(
    selectedStoreId ?? 0
  );

  const handleConfirmSave = async () => {
    const added = [...selectedIds].filter((id) => !initialIds.has(id));
    const removed = [...initialIds].filter((id) => !selectedIds.has(id));

    try {
      await Promise.all([
        ...added.map((id) =>
          updateProduct({ productId: Number(id), data: { isTarget: true } })
        ),
        ...removed.map((id) =>
          updateProduct({ productId: Number(id), data: { isTarget: false } })
        ),
      ]);

      setInitialIds(new Set(selectedIds));
      setLastSaved(new Date());
      setActiveModal(null);
      toast.success('저장이 완료되었습니다.');
    } catch {
      toast.error('저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  // 브라우저 탭 이탈/새로고침 가드
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  return {
    products,
    selectedIds,
    lastSaved,
    activeModal,
    setActiveModal,
    maxAllowed,
    isDirty,
    isLoading: isProductsLoading,
    currentPage,
    totalPages,
    storeName: selectedStore?.name ?? '',
    handlePageChange: setCurrentPage,
    handleToggle,
    handleSave,
    handleConfirmSave,
    handleReset,
  };
}
