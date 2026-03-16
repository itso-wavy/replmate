// ============================================================================
// API 공통 타입
// ============================================================================
export interface Pagination {
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
  error: string | null; // 에러 코드 키 (swagger: "error")
  errorCode: number | null; // 숫자 에러 코드
  devNote: string | null;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
}