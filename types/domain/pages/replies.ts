import type { ReplyDomain, ReviewDomain } from '../reply';
import type { ProductDomain } from '../product';
import type { StoreDomain } from '../store';

/**
 * 리플 페이지 데이터
 */
export interface RepliesPageData {
  replies: ReplyDomain[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

/**
 * 리플 필터 상태
 */
export interface ReplyFilters {
  storeId?: number | null;
  productId?: number | null;
  status?: 'draft' | 'edited' | 'exported' | 'reset' | null;
  sentiment?: 'positive' | 'neutral' | 'negative' | null;
  searchQuery?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * 리플 정렬 옵션
 */
export type ReplySortOption =
  | 'recent' // 생성일 최신순
  | 'oldest' // 생성일 오래된순
  | 'sentiment-high' // 긍정도 높은순
  | 'sentiment-low'; // 긍정도 낮은순

/**
 * 리플 페이지 상태
 */
export interface RepliesPageState extends RepliesPageData {
  filters: ReplyFilters;
  sortBy: ReplySortOption;
  selectedReplyIds: number[];
  isLoading: boolean;
}

/**
 * 리플 테이블 행 데이터 (리뷰 + 리플 + 상품 정보 조합)
 */
export interface ReplyTableRow extends ReplyDomain {
  review: ReviewDomain;
  product: ProductDomain;
  store: StoreDomain;
  isSelected: boolean;
}
