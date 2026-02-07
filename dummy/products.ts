import type { ProductDomain } from '@/types';

/**
 * 스토어 ID를 키로 하는 상품 목데이터
 * 실제 API: GET /api/v1/stores/{store_id}/products
 */
export const dummyProductsByStore: Record<number, ProductDomain[]> = {
  // 쇼핑몰A (id: 1) - 고양이 용품 전문
  1: [
    {
      id: 1,
      name: '이바나 츄르비츠 가다랑어&참치맛',
      externalId: 'PROD-001',
      price: 23000,
      currency: 'KRW',
      isTarget: true,
      avgRating: 4.5,
      reviewCount: 625,
      registeredAt: new Date('2025-11-01T00:00:00Z'),
    },
    {
      id: 2,
      name: '이바나 츄르비츠 닭가슴살&게맛살',
      externalId: 'PROD-002',
      price: 23000,
      currency: 'KRW',
      isTarget: false,
      avgRating: 4.3,
      reviewCount: 625,
      registeredAt: new Date('2025-11-01T00:00:00Z'),
    },
    {
      id: 3,
      name: '이바나 츄르비츠 연어&치즈맛',
      externalId: 'PROD-003',
      price: 23000,
      currency: 'KRW',
      isTarget: false,
      avgRating: 4.7,
      reviewCount: 625,
      registeredAt: new Date('2025-11-01T00:00:00Z'),
    },
    {
      id: 4,
      name: '로얄캐닌 키튼 고양이 사료',
      externalId: 'PROD-004',
      price: 45000,
      currency: 'KRW',
      isTarget: false,
      avgRating: 4.8,
      reviewCount: 1200,
      registeredAt: new Date('2025-11-02T00:00:00Z'),
    },
    {
      id: 5,
      name: '고양이 낚시대 (깃털형)',
      externalId: 'PROD-005',
      price: 5000,
      currency: 'KRW',
      isTarget: false,
      avgRating: 4.0,
      reviewCount: 30,
      registeredAt: new Date('2025-11-03T00:00:00Z'),
    },
    {
      id: 6,
      name: '프리미엄 벤토나이트 모래 6kg',
      externalId: 'PROD-006',
      price: 18000,
      currency: 'KRW',
      isTarget: true,
      avgRating: 4.6,
      reviewCount: 892,
      registeredAt: new Date('2025-11-04T00:00:00Z'),
    },
    {
      id: 7,
      name: '평판형 스크래쳐 대형',
      externalId: 'PROD-007',
      price: 12000,
      currency: 'KRW',
      isTarget: false,
      avgRating: 4.2,
      reviewCount: 150,
      registeredAt: new Date('2025-11-05T00:00:00Z'),
    },
    {
      id: 8,
      name: '고양이 유산균 30p',
      externalId: 'PROD-008',
      price: 32000,
      currency: 'KRW',
      isTarget: false,
      avgRating: 4.4,
      reviewCount: 420,
      registeredAt: new Date('2025-11-06T00:00:00Z'),
    },
    {
      id: 9,
      name: '우주선 이동장 (핑크)',
      externalId: 'PROD-009',
      price: 48000,
      currency: 'KRW',
      isTarget: false,
      avgRating: 4.1,
      reviewCount: 80,
      registeredAt: new Date('2025-11-07T00:00:00Z'),
    },
    {
      id: 10,
      name: '동결건조 북어 트릿',
      externalId: 'PROD-010',
      price: 15000,
      currency: 'KRW',
      isTarget: false,
      avgRating: 4.5,
      reviewCount: 200,
      registeredAt: new Date('2025-11-08T00:00:00Z'),
    },
  ],

  // 쇼핑몰F (id: 6) - 반려동물 종합몰
  6: [
    {
      id: 11,
      name: '강아지 덴탈껌 (대형견용)',
      externalId: 'PROD-011',
      price: 15000,
      currency: 'KRW',
      isTarget: true,
      avgRating: 4.6,
      reviewCount: 340,
      registeredAt: new Date('2025-10-15T00:00:00Z'),
    },
    {
      id: 12,
      name: '오리고기 저키 100g',
      externalId: 'PROD-012',
      price: 8000,
      currency: 'KRW',
      isTarget: false,
      avgRating: 4.4,
      reviewCount: 520,
      registeredAt: new Date('2025-10-16T00:00:00Z'),
    },
    {
      id: 13,
      name: '강아지 방석 (M사이즈)',
      externalId: 'PROD-013',
      price: 35000,
      currency: 'KRW',
      isTarget: true,
      avgRating: 4.7,
      reviewCount: 180,
      registeredAt: new Date('2025-10-17T00:00:00Z'),
    },
    {
      id: 14,
      name: '노즈워크 장난감 세트',
      externalId: 'PROD-014',
      price: 22000,
      currency: 'KRW',
      isTarget: false,
      avgRating: 4.3,
      reviewCount: 95,
      registeredAt: new Date('2025-10-18T00:00:00Z'),
    },
    {
      id: 15,
      name: '반려동물 자동급식기',
      externalId: 'PROD-015',
      price: 89000,
      currency: 'KRW',
      isTarget: false,
      avgRating: 4.5,
      reviewCount: 230,
      registeredAt: new Date('2025-10-19T00:00:00Z'),
    },
  ],
};

/**
 * 특정 스토어의 상품 목록 조회
 * @param storeId - 스토어 ID
 * @returns 해당 스토어의 상품 목록
 */
export const getProductsByStoreId = (
  storeId: number | null
): ProductDomain[] => {
  if (storeId === null) return [];
  return dummyProductsByStore[storeId] ?? [];
};

/**
 * 특정 스토어의 타겟 상품 개수 조회
 * @param storeId - 스토어 ID
 * @returns 타겟 상품 개수
 */
export const getTargetProductCountByStoreId = (
  storeId: number | null
): number => {
  return getProductsByStoreId(storeId).filter((p) => p.isTarget).length;
};

/**
 * 여러 스토어의 전체 타겟 상품 개수 조회
 * @param storeIds - 스토어 ID 배열
 * @returns 전체 타겟 상품 개수
 */
export const getTotalTargetProductCount = (storeIds: number[]): number => {
  return storeIds.reduce((total, storeId) => {
    return total + getTargetProductCountByStoreId(storeId);
  }, 0);
};

/**
 * 전체 상품 목록 (하위 호환성 유지용)
 * @deprecated 스토어별 조회를 권장합니다
 */
export const dummyProducts: ProductDomain[] =
  Object.values(dummyProductsByStore).flat();
