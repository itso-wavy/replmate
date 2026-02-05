import type {
  ProductsPageData,
  ProductsPageState,
} from '@/types/domain/pages';
import { dummyStores } from '../stores';
import { dummyProducts } from '../products';

/**
 * 상품 페이지용 목 데이터
 */
export const mockProductsPageData: ProductsPageData = {
  selectedStore: dummyStores[0], // 첫 번째 스토어 선택
  products: dummyProducts.filter((p) => p.storeId === 1), // 첫 번째 스토어의 상품들
  targetProductCount: dummyProducts.filter(
    (p) => p.storeId === 1 && p.isTarget
  ).length,
  maxProductCount: 10, // FREE 플랜 기준
};

/**
 * 상품 페이지 전체 상태 (필터/정렬 포함)
 */
export const mockProductsPageState: ProductsPageState = {
  ...mockProductsPageData,
  filters: {
    isTarget: null,
    searchQuery: '',
  },
  sortBy: 'recent',
  selectedProductIds: [],
  isLoading: false,
};
