'use client';

import { useRouter } from 'next/navigation';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { toast } from 'sonner';

import {
  useProducts,
  useUpdateProduct,
  useUserProductQuota,
} from '@/hooks/useProducts';
import { useMyStores } from '@/hooks/useStores';
import { useUserPlan } from '@/hooks/useUser';
import { NavigationGuardStore } from '@/store/navigationGuardStore';
import { StoreStore } from '@/store/storeStore';

const PAGE_SIZE = 20;

export type ProductModalType =
  | 'limitExceeded'
  | 'saveConfirm'
  | 'unsavedChanges'
  | null;

function setsEqual(a: Set<number>, b: Set<number>) {
  if (a.size !== b.size) return false;
  for (const id of a) {
    if (!b.has(id)) return false;
  }
  return true;
}

export function useProductsPage() {
  const router = useRouter();
  const selectedStoreId = StoreStore.useSelectedStoreId();
  const { setSelectedStore } = StoreStore.useActions();
  const { data: planData } = useUserPlan();
  const { data: myStoresData } = useMyStores();
  const { data: productQuota } = useUserProductQuota();
  const stores = myStoresData?.stores ?? [];

  const selectedStore = stores.find((s) => s.id === selectedStoreId);

  // 유저 단위 maxProductCount에서 현재 스토어 외 다른 스토어들이 점유한 active 카운트를 제외 → 현재 스토어 선택 한도
  const maxProductCount = planData?.plan.maxProductCount ?? 0;
  const otherStoresActiveCount = (productQuota?.storeProductCounts ?? [])
    .filter((s) => s.storeId !== selectedStoreId)
    .reduce((acc, s) => acc + s.activeCount, 0);
  const maxAllowed = Math.max(0, maxProductCount - otherStoresActiveCount);

  const [currentPage, setCurrentPage] = useState(1);
  const [initialIds, setInitialIds] = useState<Set<number>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [activeModal, setActiveModal] = useState<ProductModalType>(null);

  // 스토어 전환 가드용: 전환하려는 storeId 보관
  const pendingStoreIdRef = useRef<number | null>(null);

  const { data: productData, isLoading: isProductsLoading } = useProducts(
    selectedStoreId ?? 0,
    { page: currentPage, size: PAGE_SIZE }
  );

  const products = productData?.products.items ?? [];

  // 스토어 변경 시 초기화
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds(new Set());
    setInitialIds(new Set());
    setLastSaved(null);
  }, [selectedStoreId]);

  // 페이지 데이터 로드 시 현재 페이지 isTarget 상태로 초기화
  useEffect(() => {
    if (!productData?.products.items) return;
    const targetIds = new Set(
      productData.products.items.filter((p) => p.isTarget).map((p) => p.id)
    );
    setInitialIds(targetIds);
    setSelectedIds(new Set(targetIds));
  }, [productData?.products.items]);

  const isDirty = useMemo(
    () => !setsEqual(selectedIds, initialIds),
    [selectedIds, initialIds]
  );

  // --- 네비게이션 가드 연동 ---
  const pendingUrl = NavigationGuardStore.usePendingUrl();
  const { setGuard, clearGuard, clearPending } =
    NavigationGuardStore.useActions();

  const { mutateAsync: updateProduct } = useUpdateProduct(selectedStoreId ?? 0);

  const performSave = useCallback(async () => {
    const added = [...selectedIds].filter((id) => !initialIds.has(id));
    const removed = [...initialIds].filter((id) => !selectedIds.has(id));

    await Promise.all([
      ...added.map((id) =>
        updateProduct({ productId: id, data: { isTarget: true } })
      ),
      ...removed.map((id) =>
        updateProduct({ productId: id, data: { isTarget: false } })
      ),
    ]);

    setInitialIds(new Set(selectedIds));
    setLastSaved(new Date());
  }, [selectedIds, initialIds, updateProduct]);

  // isDirty 변경 시 가드 등록/해제
  useEffect(() => {
    setGuard(isDirty, performSave);
  }, [isDirty, performSave, setGuard]);

  // unmount 시 가드 해제
  useEffect(() => {
    return () => clearGuard();
  }, [clearGuard]);

  // pendingUrl이 설정되면 unsavedChanges 모달 표시
  useEffect(() => {
    if (pendingUrl && isDirty) {
      setActiveModal('unsavedChanges');
    }
  }, [pendingUrl, isDirty]);

  const handleToggle = (id: number) => {
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
    if (!selectedStoreId) {
      toast.error('쇼핑몰을 먼저 선택해 주세요.');
      return;
    }

    if (selectedIds.size > maxAllowed) {
      setActiveModal('limitExceeded');
      return;
    }
    setActiveModal('saveConfirm');
  };

  const handleReset = () => {
    setSelectedIds(new Set(initialIds));
  };

  const handleConfirmSave = async () => {
    try {
      await performSave();
      setActiveModal(null);
      toast.success('저장이 완료되었습니다.');
    } catch {
      toast.error('저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  // --- UnsavedChangesModal 콜백 ---
  const handleLeaveWithoutSaving = () => {
    setActiveModal(null);
    // 스토어 전환 케이스
    if (pendingStoreIdRef.current !== null) {
      setSelectedStore(pendingStoreIdRef.current);
      pendingStoreIdRef.current = null;
      return;
    }
    // 페이지 이동 케이스
    if (pendingUrl) {
      const url = pendingUrl;
      clearPending();
      clearGuard();
      router.push(url);
    }
  };

  const handleSaveAndLeave = async () => {
    if (!selectedStoreId) {
      toast.error('쇼핑몰을 먼저 선택해 주세요.');
      return;
    }

    try {
      await performSave();
      toast.success('저장이 완료되었습니다.');
      setActiveModal(null);
      // 스토어 전환 케이스
      if (pendingStoreIdRef.current !== null) {
        setSelectedStore(pendingStoreIdRef.current);
        pendingStoreIdRef.current = null;
        return;
      }
      // 페이지 이동 케이스
      if (pendingUrl) {
        const url = pendingUrl;
        clearPending();
        clearGuard();
        router.push(url);
      }
    } catch {
      toast.error('저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  // 스토어 전환 가드
  const handleStoreChange = (storeId: number) => {
    if (isDirty) {
      pendingStoreIdRef.current = storeId;
      setActiveModal('unsavedChanges');
      return;
    }
    setSelectedStore(storeId);
  };

  // 브라우저 탭 이탈/새로고침/뒤로가기 가드
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
    totalPages: productData?.products.totalPages || 1,
    storeName: selectedStore?.name ?? '',
    handlePageChange: setCurrentPage,
    handleToggle,
    handleSave,
    handleConfirmSave,
    handleReset,
    handleStoreChange,
    handleLeaveWithoutSaving,
    handleSaveAndLeave,
  };
}
