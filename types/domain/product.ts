import type { ProductDto, ProductDetailDto } from '@/types/api/product';
import type { Pagination } from '@/types/api/common';

/**
 * 상품 Domain 타입
 * API DTO의 날짜 문자열을 Date 객체로 변환
 */
export interface ProductDomain {
  id: number;
  name: string;
  externalId: string | null;
  price: number | null;
  currency: string;
  isTarget: boolean;
  avgRating: number | null;
  reviewCount: number | null;
  registeredAt: Date | null;
}

/**
 * 상품 상세 Domain 타입
 */
export interface ProductDetailDomain {
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
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 상품 목록 Domain 타입 (페이지네이션 포함)
 */
export type ProductListDomain = Pagination & { items: ProductDomain[] };

/**
 * 스토어 정보를 포함한 상품 확장 타입
 * 프론트엔드에서 상품 목록 표시 시 스토어 정보가 필요한 경우 사용
 */
export interface ProductWithStore extends ProductDomain {
  storeName?: string;
  storePlatform?: string;
}

/**
 * ProductDto를 ProductDomain으로 변환
 * @param dto - API에서 받은 ProductDto
 * @returns ProductDomain 객체
 */
export function toProductDomain(dto: ProductDto): ProductDomain {
  return {
    id: dto.id,
    name: dto.name,
    externalId: dto.externalId,
    price: dto.price,
    currency: dto.currency,
    isTarget: dto.isTarget,
    avgRating: dto.avgRating,
    reviewCount: dto.reviewCount,
    registeredAt: dto.registeredAt ? new Date(dto.registeredAt) : null,
  };
}

/**
 * ProductDto 배열을 ProductDomain 배열로 변환
 * @param dtos - API에서 받은 ProductDto 배열
 * @returns ProductDomain 배열
 */
export function toProductDomainList(dtos: ProductDto[]): ProductDomain[] {
  return dtos.map(toProductDomain);
}

/**
 * ProductDetailDto를 ProductDetailDomain으로 변환
 * @param dto - API에서 받은 ProductDetailDto
 * @returns ProductDetailDomain 객체
 */
export function toProductDetailDomain(
  dto: ProductDetailDto
): ProductDetailDomain {
  return {
    id: dto.id,
    storeId: dto.storeId,
    name: dto.name,
    price: dto.price,
    externalId: dto.externalId,
    category: dto.category,
    avgRating: dto.avgRating,
    reviewCount: dto.reviewCount,
    productUrl: dto.productUrl,
    isTarget: dto.isTarget,
    isNew: dto.isNew,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}
