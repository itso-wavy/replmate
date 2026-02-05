import type { StoresPageData, StoresPageState } from '@/types/domain/pages';
import { dummyStores } from '../stores';

/**
 * 스토어 페이지용 목 데이터
 */
export const mockStoresPageData: StoresPageData = {
  stores: dummyStores.map((store) => ({
    ...store,
    productCount: Math.floor(Math.random() * 50) + 5, // 5~55개
    replyCount: Math.floor(Math.random() * 100) + 10, // 10~110개
    pendingReviewCount: Math.floor(Math.random() * 20), // 0~20개
  })),
  subscription: {
    id: 1,
    status: 'active',
    startedAt: new Date('2025-01-15T00:00:00Z'),
    currentPeriodStart: new Date('2026-01-01T00:00:00Z'),
    currentPeriodEnd: new Date('2026-02-01T00:00:00Z'),
    cancelAtPeriodEnd: false,
    canceledAt: null,
  },
};

/**
 * 스토어 페이지 전체 상태 (필터/정렬 포함)
 */
export const mockStoresPageState: StoresPageState = {
  ...mockStoresPageData,
  filters: {
    isActive: null,
    isVerified: null,
    platform: null,
    searchQuery: '',
  },
  sortBy: 'recent',
  isLoading: false,
};
