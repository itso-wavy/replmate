// ============================================================================
// 작업 (Jobs)
// ============================================================================

// GET /api/v1/jobs/{job_id} Job 상태 조회
export interface JobDto {
  id: string;
  userId: number;
  type: string;
  status: string;
  progress: number;
  result: Record<string, unknown> | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}
