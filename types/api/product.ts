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
  isTarget: boolean;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
}

// PATCH /api/v1/products/{product_id} 상품 업데이트 응답
export interface ProductInfoDto {
  product: ProductDetailDto;
  job: JobTicketDto | null;
}

export type ProductList = Pagination & { items: ProductDto[] };
