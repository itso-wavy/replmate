import { api } from '@/lib/api';
import { PRODUCT_ENDPOINTS } from '@/lib/endpoints';
import {
  ProductDetailDomain,
  ProductDetailDto,
  ProductDomain,
  ProductDto,
  toProductDetailDomain,
  toProductDomain,
  toProductDomainList,
} from '@/types';

// ============================================================================
// 상품 조회
// ============================================================================

/**
 * 스토어별 상품 목록 조회
 */
export async function getProducts(
  storeId: string | number
): Promise<ProductDomain[]> {
  const response = await api.get<ProductDto[]>(
    PRODUCT_ENDPOINTS.GET_PRODUCTS(storeId)
  );
  return toProductDomainList(response.data);
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
 */
export async function updateProduct(
  productId: string | number,
  data: Partial<{
    isTarget: boolean;
  }>
): Promise<ProductDomain> {
  const response = await api.patch<ProductDto>(
    PRODUCT_ENDPOINTS.UPDATE_PRODUCT(productId),
    data
  );
  return toProductDomain(response.data);
}
