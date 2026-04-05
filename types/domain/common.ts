// ==========================================================
// 공통 도메인 유틸리티 타입
// ==========================================================

/**
 * 페이지네이션 정보를 포함하는 리스트
 */
export interface WithPagination<T> {
  items: T[];
  currentPage: number;
  size: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * 로딩 상태를 포함하는 데이터
 */
export interface WithLoading<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * 선택 가능한 항목
 */
export interface Selectable {
  isSelected: boolean;
}

/**
 * 편집 가능한 항목
 */
export interface Editable {
  isEditing: boolean;
}

/**
 * 날짜 범위
 */
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

/**
 * 정렬 옵션
 */
export interface SortOption<T = string> {
  field: T;
  direction: 'asc' | 'desc';
}

/**
 * 필터 상태 기본 인터페이스
 */
export interface FilterState {
  searchQuery?: string;
  dateRange?: DateRange;
  // 페이지별로 확장 가능
}
