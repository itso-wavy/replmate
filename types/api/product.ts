import { Pagination } from './common';
import type { JobTicketDto } from './job';

// ==========================================================
// 상품 (Products)
// ==========================================================

// GET /api/v1/stores/{store_id}/products?page=1&size=20
export interface ProductDto {
  id: number;
  name: string;
  externalId: string | null;
  price: number | null;
  currency: string;
  isTarget: boolean;
  avgRating: number | null;
  reviewCount: number | null;
  registeredAt: string | null;
}

// GET /api/v1/products/{product_id}
export interface ProductDetailDto {
  id: number;
  storeId: number;
  name: string;
  price: number | null;
  externalId: string | null;
  category: string | null;
  avgRating: number | null;
  reviewCount: number | null;
  productUrl: string | null;
  registeredAt: string | null;
  isTarget: boolean;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
}

// GET /api/v1/stores/{store_id}/products - 상품 quota 정보
/** @deprecated 1.5.0 Drop 예정. 유저 단위 quota는 `GET /users/me/product-quota` 사용 */
export interface ProductQuotaDto {
  maxProductCount: number;
  currentProductCount: number;
  remaining: number;
}

// GET /api/v1/stores/{store_id}/products - 전체 응답
export interface StoreProductsDto {
  /** @deprecated 1.5.0 Drop 예정. `GET /users/me/product-quota` 사용 */
  productQuota?: ProductQuotaDto;
  lastTargetChangedAt: string | null;
  products: ProductList;
}

// GET /api/v1/users/me/product-quota - 스토어별 상품 카운트
export interface StoreProductCountDto {
  storeId: number;
  activeCount: number;
  totalCount: number;
}

// GET /api/v1/users/me/product-quota - 내 상품 quota (스토어별 breakdown 포함)
export interface UserProductQuotaDto {
  maxProductCount: number;
  currentProductCount: number;
  remaining: number;
  storeProductCounts: StoreProductCountDto[];
}

// PATCH /api/v1/products/{product_id} 상품 업데이트 응답
export interface ProductInfoDto {
  product: ProductDetailDto;
  job: JobTicketDto | null;
}

export type ProductList = Pagination & { items: ProductDto[] };
