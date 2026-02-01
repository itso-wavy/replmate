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

export interface ApiResponse<T = unknown> {
  data: T | null;
  httpStatus: number | null;
  messageKo: string | null;
  messageEn: string | null;
  errorKey: string | null;
  errorCode: number | null; // 에러 코드
  devNote: string | null;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
}
