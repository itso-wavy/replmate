'use client';

import {
  ProductSaveConfirmModal,
  RecommandPlanUpgradeModal,
  UnsavedProductChangesModal,
} from '@/components/modal';
import { Card } from '@/components/ui/card';
import { dummyProducts } from '@/dummy/products';

import { DashboardLayout, StoreCombobox } from '../_components';
import {
  ProductCountIndicator,
  StoreProductsTable,
  TableActionPanel,
} from './_components';
import { useProductsPage } from './_hooks/useProductsPage';

const ProductsPage = () => {
  const {
    products,
    selectedIds,
    lastSaved,
    activeModal,
    setActiveModal,
    maxAllowed,
    isDirty,
    isLoading,
    currentPage,
    totalPages,
    storeName,
    handlePageChange,
    handleToggle,
    handleSave,
    handleConfirmSave,
    handleReset,
    handleStoreChange,
    handleLeaveWithoutSaving,
    handleSaveAndLeave,
  } = useProductsPage();

  return (
    <DashboardLayout
      heading='상품 관리'
      description='리플을 자동 생성할 상품을 선택해 주세요.'
    >
      <Card className='flex flex-1 flex-col gap-0 overflow-visible px-0 py-0 *:px-4'>
        {/* Controls Bar */}
        <div className='bg-background sticky top-0 z-10 flex w-full items-center justify-between rounded-t-2xl py-4 shadow-[0_3px_5px_0_rgba(0,0,0,0.05)]'>
          <StoreCombobox onStoreChange={handleStoreChange} />

          <ProductCountIndicator
            selectedCount={selectedIds.size}
            maxAllowed={maxAllowed}
          />
        </div>

        <div className='relative'>
          <StoreProductsTable
            products={products}
            selectedIds={selectedIds}
            onToggle={handleToggle}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          {isDirty && (
            <TableActionPanel
              storeName={storeName}
              selectedCount={selectedIds.size}
              maxAllowed={maxAllowed}
              lastSaved={lastSaved}
              isDirty={isDirty}
              onSave={handleSave}
              onReset={handleReset}
            />
          )}
        </div>
      </Card>

      <RecommandPlanUpgradeModal
        title='상품 선택 저장'
        description={`등록 가능한 상품 한도를 초과했습니다.\n더 많은 상품을 선택하려면 플랜을 업그레이드해주세요.`}
        open={activeModal === 'limitExceeded'}
        onOpenChange={(open) => !open && setActiveModal(null)}
      />

      <ProductSaveConfirmModal
        open={activeModal === 'saveConfirm'}
        onOpenChange={(open) => !open && setActiveModal(null)}
        onConfirm={handleConfirmSave}
      />

      <UnsavedProductChangesModal
        open={activeModal === 'unsavedChanges'}
        onOpenChange={(open) => !open && setActiveModal(null)}
        title='저장하지 않은 변경 사항'
        description={`저장하지 않은 변경 사항이 있습니다.\n저장하지 않고 이동하시겠습니까?`}
        onLeaveWithoutSaving={handleLeaveWithoutSaving}
        onSaveAndLeave={handleSaveAndLeave}
      />
    </DashboardLayout>
  );
};

export default ProductsPage;
