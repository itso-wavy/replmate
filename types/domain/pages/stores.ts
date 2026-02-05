import type { StoreWithStats } from '../store';
import type { SubscriptionDomain } from '../user';

/**
 * 스토어 페이지 데이터
 */
export interface StoresPageData {
  stores: StoreWithStats[];
  subscription: SubscriptionDomain;
}

/**
 * 스토어 정렬 옵션
 */
export type StoreSortOption =
  | 'recent' // 최신순
  | 'name' // 이름순
  | 'active' // 활성화 우선
  | 'verified'; // 인증 완료 우선

/**
 * 스토어 필터 상태
 */
export interface StoreFilters {
  isActive?: boolean | null;
  isVerified?: boolean | null;
  platform?: string | null;
  searchQuery?: string;
}

/**
 * 스토어 페이지 상태
 */
export interface StoresPageState extends StoresPageData {
  filters: StoreFilters;
  sortBy: StoreSortOption;
  isLoading: boolean;
}
