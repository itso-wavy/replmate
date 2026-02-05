import type { RepliesPageData, RepliesPageState } from '@/types/domain/pages';

/**
 * 리플 페이지용 목 데이터
 * TODO: Reply 더미 데이터 작성 후 업데이트 필요
 */
export const mockRepliesPageData: RepliesPageData = {
  replies: [],
  totalCount: 0,
  currentPage: 1,
  pageSize: 20,
};

/**
 * 리플 페이지 전체 상태 (필터/정렬 포함)
 */
export const mockRepliesPageState: RepliesPageState = {
  ...mockRepliesPageData,
  filters: {
    storeId: null,
    productId: null,
    status: null,
    sentiment: null,
    searchQuery: '',
  },
  sortBy: 'recent',
  selectedReplyIds: [],
  isLoading: false,
};
