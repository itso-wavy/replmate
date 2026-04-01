import type { Pagination } from './common';
import type { ProductDto } from './product';

export interface ReviewDto {
  id: number;
  rating: number | null;
  content: string;
  reviewedAt: string | null;
}

export interface ReplyDto {
  id: number;
  review: ReviewDto;
  product: ProductDto;
  aiText: string;
  sentimentLevel: number | null;
  createdAt: string;
}

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
