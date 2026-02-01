// ============================================================================
// 작업 (Jobs)
// ============================================================================

// GET /api/v1/jobs/{job_id} Job 상태 조회
// 주의: 백엔드가 snake_case를 camelCase로 자동 변환하는 경우 아래 필드명이 맞습니다.
// 만약 snake_case 그대로 온다면 필드명을 변경해야 합니다.
export interface JobDto {
  id: string;
  type: string;
  status: string;
  progress: number;
  message: string | null;
  targetId: number | null; // target_id
  userId: number | null; // user_id
  result: Record<string, unknown> | null;
  error: string | null;
  createdAt: string | null; // created_at
  startedAt: string | null; // started_at
  completedAt: string | null; // completed_at
}
