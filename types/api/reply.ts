import type { Pagination } from './common';
import type { ProductDto } from './product';

// ============================================================================
// 리플 (Replies)
// ============================================================================

export interface ReviewDto {
  id: number;
  rating: number | null;
  content: string;
  reviewedAt: string | null;
}

// GET /api/v1/replies 리플 목록 조회
// NOTE: Swagger 명세 기준 필드(id, review, product, aiText, createdAt) 외에
// 아래 추가 필드는 실제 백엔드 응답에 포함될 수 있어 유지합니다.
export interface ReplyDto {
  id: number;
  review: ReviewDto;
  product: ProductDto;
  aiText: string;
  editedText: string | null;
  status: string;
  tone: string | null;
  lengthType: string | null;
  includeEmoji: boolean;
  usageCount: number;
  exportedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// POST /api/v1/replies/test 테스트 AI 리플 생성 요청
// 응답: 202 Accepted + JobTicketDto (types/api/job.ts 참고)
export interface CreateTestReplyRequest {
  storeId: number;
  review: string;
  tone?: string;
  lengthType?: string;
  includeEmoji?: boolean;
  guideline?: string;
}

export type ReplyList = Pagination & { items: ReplyDto[] };

export type SentimentType = 'positive' | 'negative' | 'neutral';
