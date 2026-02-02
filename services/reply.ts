import { api } from '@/lib/api';
import { REPLY_ENDPOINTS } from '@/lib/endpoints';
import {
  ReplyDomain,
  ReplyDto,
  TestReplyDomain,
  TestReplyDto,
  toReplyDomainList,
  toTestReplyDomain,
} from '@/types';

// ============================================================================
// 리플 조회
// ============================================================================

/**
 * 리플 목록 조회
 */
export async function getReplies(params?: {
  storeId?: number;
  productId?: number;
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
 */
export async function testReply(data: {
  reviewText: string;
  storeId?: number;
  tone?: string;
  lengthType?: string;
  includeEmoji?: boolean;
}): Promise<TestReplyDomain> {
  const response = await api.post<TestReplyDto>(
    REPLY_ENDPOINTS.TEST_REPLY,
    data
  );
  return toTestReplyDomain(response.data);
}
