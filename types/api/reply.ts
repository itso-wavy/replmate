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

// POST /api/v1/replies/test 리플 테스트 응답
export interface TestReplyDto {
  aiText: string;
  tone: string | null;
  lengthType: string | null;
  includeEmoji: boolean;
  usageCount: number;
}

export type ReplyList = Pagination & { items: ReplyDto[] };

export type SentimentType = 'positive' | 'negative' | 'neutral';
