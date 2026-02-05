import { Card } from '@/components/ui/card';
import { dummyProductAlert } from '@/dummy/alerts';

import { DashboardLayout, StoreCombobox } from '../_components';
import { ProductCountIndicator, StoreProductsTable } from './_components';

const ProductsPage = () => {
  return (
    <DashboardLayout
      heading='상품 관리'
      description='리플을 자동 생성할 상품을 선택해 주세요.'
      alerts={[dummyProductAlert]}
    >
      <Card className='block flex-col p-4'>
        {/* Controls Bar */}
        <div className='flex w-full items-center justify-between pt-1 pb-2'>
          <StoreCombobox />

          <ProductCountIndicator />
        </div>

        <StoreProductsTable maxRows={20} />
      </Card>
    </DashboardLayout>
  );
};

export default ProductsPage;
