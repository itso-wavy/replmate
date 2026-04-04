// ============================================================
// API 공통 타입
// ============================================================
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
  message: string | null;
  error: string | null; // 에러 코드 키 (swagger: "error")
  errorCode: string | null;
  devNote: string | null;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
}
