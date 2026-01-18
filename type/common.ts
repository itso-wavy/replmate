// ============================================================================
// API 공통 타입
// ============================================================================
export interface Pagination {
  // id: number;
  currentPage: number;
  size: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  errorCode: number;
  message: string;
  devNote: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
}
