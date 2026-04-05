// ==========================================================
// 작업 (Jobs)
// ==========================================================

// Job 생성 시 반환되는 티켓
export interface JobTicketDto {
  jobId: string;
  status: string;
}

// GET /api/v1/jobs/{job_id} Job 상태 조회 응답
export interface JobDto {
  id: string;
  type: string;
  status: string;
  progress: number;
  message: string | null;
  targetId: number | null;
  userId: number | null;
  result: Record<string, unknown> | null;
  error: string | null;
  createdAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
}
