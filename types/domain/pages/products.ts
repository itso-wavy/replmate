import type { ProductDomain } from '../product';
import type { StoreDomain } from '../store';

/**
 * 상품 페이지 데이터
 */
export interface ProductsPageData {
  selectedStore: StoreDomain | null;
  products: ProductDomain[];
  targetProductCount: number;
  maxProductCount: number;
}

/**
 * 상품 필터 상태
 */
export interface ProductFilters {
  isTarget?: boolean | null;
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  hasReviews?: boolean;
}

/**
 * 상품 정렬 옵션
 */
export type ProductSortOption =
  | 'recent' // 등록일 최신순
  | 'name' // 상품명 순
  | 'price-asc' // 가격 낮은순
  | 'price-desc' // 가격 높은순
  | 'review-count'; // 리뷰 많은순

/**
 * 상품 페이지 상태
 */
export interface ProductsPageState extends ProductsPageData {
  filters: ProductFilters;
  sortBy: ProductSortOption;
  selectedProductIds: number[];
  isLoading: boolean;
}

/**
 * 상품 테이블 행 데이터 (UI 상태 포함)
 */
export interface ProductTableRow extends ProductDomain {
  isSelected: boolean;
  isEditing: boolean;
}
