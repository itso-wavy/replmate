import { api } from '@/lib/api';
import { JOB_ENDPOINTS } from '@/lib/endpoints';
import type { JobDto } from '@/types/api/job';
import { JobDomain, toJobDomain } from '@/types/domain/job';

/**
 * Job 상태 조회
 * GET /api/v1/jobs/{job_id}
 */
export async function getJob(jobId: string): Promise<JobDomain> {
  const response = await api.get<JobDto>(JOB_ENDPOINTS.GET_JOB(jobId));
  return toJobDomain(response.data);
}

/**
 * Job 진행도 SSE 스트림 구독
 * GET /api/v1/jobs/{job_id}/stream
 * EventSource를 반환하여 호출 측에서 이벤트 핸들링
 */
export function streamJob(jobId: string): EventSource {
  const url = JOB_ENDPOINTS.STREAM_JOB(jobId);
  return new EventSource(url, { withCredentials: true });
}
