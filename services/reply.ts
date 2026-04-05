import { api } from '@/lib/api';
import { REPLY_ENDPOINTS } from '@/lib/endpoints';
import {
  CreateTestReplyRequest,
  JobTicketDto,
  ReplyList,
  ReplyListDomain,
  ReplyStatus,
  toReplyDomainList,
} from '@/types';

// ==========================================================
// 리플 조회
// ==========================================================

/**
 * 리플 목록 조회 (페이지네이션)
 * GET /api/v1/replies?storeId=1&status=draft&todayOnly=true&page=1&size=20
 * @param params.storeId - 필수: 스토어 ID
 * @param params.reviewId - 선택: 특정 리뷰의 리플만 조회
 * @param params.status - 선택: 리플 상태 필터 (draft | edited | exported | reset)
 * @param params.todayOnly - 선택: 오늘 생성된 리플만 조회 (기본값: true)
 * @param params.page - 선택: 페이지 번호 (기본값: 1)
 * @param params.size - 선택: 페이지 크기 (기본값: 20)
 * @returns 리플 목록 + 페이지네이션 정보
 */
export async function getReplies(params: {
  storeId: number;
  reviewId?: number;
  status?: ReplyStatus;
  todayOnly?: boolean;
  page?: number;
  size?: number;
}): Promise<ReplyListDomain> {
  const response = await api.get<ReplyList>(REPLY_ENDPOINTS.GET_REPLIES, {
    params,
  });
  const { items, ...pagination } = response.data;
  return {
    ...pagination,
    items: toReplyDomainList(items),
  };
}

// ==========================================================
// 리플 테스트
// ==========================================================

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
