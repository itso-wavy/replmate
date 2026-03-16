import { api } from '@/lib/api';
import { PRODUCT_ENDPOINTS } from '@/lib/endpoints';
import type {
  ProductDetailDto,
  ProductInfoDto,
  ProductList,
} from '@/types/api/product';
import {
  ProductDetailDomain,
  ProductListDomain,
  toProductDetailDomain,
  toProductDomainList,
} from '@/types/domain/product';

// ============================================================================
// 상품 조회
// ============================================================================

/**
 * 스토어별 상품 목록 조회 (페이지네이션)
 * GET /api/v1/stores/{store_id}/products?page=1&size=20
 * @returns 상품 목록 + 페이지네이션 정보
 */
export async function getProducts(
  storeId: string | number,
  params?: { page?: number; size?: number }
): Promise<ProductListDomain> {
  const response = await api.get<ProductList>(
    PRODUCT_ENDPOINTS.GET_PRODUCTS(storeId),
    { params }
  );
  const { items, ...pagination } = response.data;
  return {
    ...pagination,
    items: toProductDomainList(items),
  };
}

/**
 * 상품 상세 조회
 */
export async function getProductDetail(
  productId: string | number
): Promise<ProductDetailDomain> {
  const response = await api.get<ProductDetailDto>(
    PRODUCT_ENDPOINTS.GET_PRODUCT_DETAIL(productId)
  );
  return toProductDetailDomain(response.data);
}

// ============================================================================
// 상품 수정
// ============================================================================

/**
 * 상품 타겟 여부 변경
 * 응답: ProductInfoDto (product + job)
 */
export async function updateProduct(
  productId: string | number,
  data: Partial<{
    isTarget: boolean;
  }>
): Promise<ProductInfoDto> {
  const response = await api.patch<ProductInfoDto>(
    PRODUCT_ENDPOINTS.UPDATE_PRODUCT(productId),
    data
  );
  return response.data;
}
