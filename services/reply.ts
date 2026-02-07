import { api } from '@/lib/api';
import { REPLY_ENDPOINTS } from '@/lib/endpoints';
import type { JobTicketDto } from '@/types/api/job';
import type { ReplyDto } from '@/types/api/reply';
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
 * 리플 테스트 (미리보기)
 * 비동기 Job 방식 - 202 Accepted, JobTicketDto 반환
 * storeId 필수
 */
export async function testReply(data: {
  reviewText: string;
  storeId: number;
  tone?: string;
  lengthType?: string;
  includeEmoji?: boolean;
}): Promise<JobTicketDto> {
  const response = await api.post<JobTicketDto>(
    REPLY_ENDPOINTS.TEST_REPLY,
    data
  );
  return response.data;
}
