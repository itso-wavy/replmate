// common
export { default as TermModal } from './TermModal';
export { default as LogoutModal } from './LogoutModal';

// Dashboard

// Stores
export { default as AddNewStoreFormModal } from './AddNewStoreFormModal';
export { default as StoreLimitExceededModal } from './StoreLimitExceededModal';
export { default as RecommandPlanUpgradeModal } from './RecommandPlanUpgradeModal';
export { default as UnlinkStoreConfirmModal } from './UnlinkStoreConfirmModal';
export { default as VerificationRequiredModal } from './VerificationRequiredModal';

// Products
export { default as ProductSaveConfirmModal } from './ProductSaveConfirmModal';
export { default as UnsavedProductChangesModal } from './UnsavedProductChangesModal';

/*
▣ 플랜 업그레이드 유도 팝업

 <RecommandPlanUpgradeModal
  title='상품 선택 저장'
  description={`등록 가능한 상품 한도를 초과 했습니다.\n더 많은 상품을 선택하려면 플랜을 업그레이드해주세요.`}
  open={activeModal === 'limitExceeded'}
  onOpenChange={(open) => !open && setActiveModal(null)}
/> 
*/
