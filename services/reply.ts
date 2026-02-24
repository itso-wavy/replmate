import { api } from '@/lib/api';
import { REPLY_ENDPOINTS } from '@/lib/endpoints';
import type { JobTicketDto } from '@/types/api/job';
import type { CreateTestReplyRequest, ReplyDto } from '@/types/api/reply';
import { ReplyDomain, toReplyDomainList } from '@/types/domain/reply';

// ============================================================================
// 리플 조회
// ============================================================================

/**
 * 리플 목록 조회
 * storeId 필수
 */
export async function getReplies(params: {
  storeId: number;
  productId?: number;
  reviewId?: number;
  status?: string;
  todayOnly?: boolean;
  page?: number;
  size?: number;
}): Promise<ReplyDomain[]> {
  const response = await api.get<ReplyDto[]>(REPLY_ENDPOINTS.GET_REPLIES, {
    params,
  });
  return toReplyDomainList(response.data);
}

// ============================================================================
// 리플 테스트
// ============================================================================

/**
 * 테스트 AI 리플 생성
 * POST /api/v1/replies/test
 * 비동기 Job 방식 - 202 Accepted, JobTicketDto 반환
 * Job 결과는 GET /api/v1/jobs/{job_id} 또는 SSE 스트림으로 조회
 */
export async function testReply(
  data: CreateTestReplyRequest
): Promise<JobTicketDto> {
  const response = await api.post<JobTicketDto>(
    REPLY_ENDPOINTS.TEST_REPLY,
    data
  );
  return response.data;
}
