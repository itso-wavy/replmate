import { Card } from '@/components/ui/card';
import { dummyProductAlert } from '@/dummy/alerts';

import { DashboardLayout, StoreCombobox } from '../_components';
import {
  ProductCountIndicator,
  StoreProductsTable,
  TableActionPanel,
} from './_components';

const ProductsPage = () => {
  // 상태 관리 여기서
  // 선택한 쇼핑몰
  // 선택한 상품 목록
  // 구독 상태 등
  return (
    <DashboardLayout
      heading='상품 관리'
      description='리플을 자동 생성할 상품을 선택해 주세요.'
      alerts={[dummyProductAlert]}
    >
      <Card className='flex flex-1 flex-col gap-0 overflow-visible px-0 py-0 *:px-4'>
        {/* Controls Bar */}
        <div className='bg-background sticky top-0 z-10 flex w-full items-center justify-between rounded-t-2xl py-4 shadow-[0_3px_5px_0_rgba(0,0,0,0.05)]'>
          <StoreCombobox />

          <ProductCountIndicator />
        </div>

        <div className='relative'>
          <StoreProductsTable maxRows={20} />

          <TableActionPanel />
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default ProductsPage;

/*
▣ 플랜 업그레이드 유도 팝업

 <RecommandPlanUpgradeModal
  title='상품 선택 저장'
  description={`등록 가능한 상품 한도를 초과 했습니다.\n더 많은 상품을 선택하려면 플랜을 업그레이드해주세요.`}
  open={activeModal === 'limitExceeded'}
  onOpenChange={(open) => !open && setActiveModal(null)}
/> 
*/
