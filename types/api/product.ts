import { Pagination } from './common';

// ============================================================================
// 상품 (Products)
// ============================================================================

// GET /api/v1/stores/{store_id}/products?page=1&size=20
export interface ProductDto {
  id: number;
  storeId: number;
  name: string;
  price: number | null;
  currency?: string;
  imageUrl: string | null;
  isTarget: boolean;
  reviewCount: number | null;
  lastReviewSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
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

export type ProductList = Pagination & { items: ProductDto[] };
