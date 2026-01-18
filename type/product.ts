import { Pagination } from './common';

// ============================================================================
// 상품 (Products)
// ============================================================================
// GET /api/v1/stores/{store_id}/products?page=1&size=20
export interface Product {
  id: number;
  storeId: number;
  name: string;
  price: number;
  currency: string;
  imageUrl: string;
  isActive: true;
  reviewCount: number;
  lastReviewSyncedAt: string;
  createdAt: string;
  updatedAt: string;
}

// GET /api/v1/products/{product_id}
export interface ProductDetail {
  id: number;
  store_id: number;
  external_id: string;
  category: string;
  name: string;
  price: number;
  avg_rating: number;
  review_count: number;
  product_url: number;
  is_target: boolean; // 자동 리뷰 생성 여부
  is_new: boolean;
  created_at: string;
  updated_at: string;
}

export type ProductList = Pagination & { items: Product[] };
