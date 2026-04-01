import type { Pagination } from '@/types/api/common';
import type { ReplyDto, ReviewDto, SentimentType } from '@/types/api/reply';

import { type ProductDomain, toProductDomain } from './product';

export interface ReviewDomain {
  id: number;
  reviewer: string | null;
  rating: number | null;
  content: string;
  reviewedAt: Date | null;
}

export interface ReplyDomain {
  id: number;
  review: ReviewDomain;
  product: ProductDomain;
  aiText: string;
  sentimentLevel: number | null;
  createdAt: Date;
}

export type ReplyListDomain = Pagination & { items: ReplyDomain[] };

export interface ReplyWithSentiment extends ReplyDomain {
  sentiment?: SentimentType;
}

export function toReviewDomain(dto: ReviewDto): ReviewDomain {
  return {
    id: dto.id,
    reviewer: null,
    rating: dto.rating,
    content: dto.content,
    reviewedAt: dto.reviewedAt ? new Date(dto.reviewedAt) : null,
  };
}

export function toReplyDomain(dto: ReplyDto): ReplyDomain {
  return {
    id: dto.id,
    review: toReviewDomain(dto.review),
    product: toProductDomain(dto.product),
    aiText: dto.aiText,
    sentimentLevel: dto.sentimentLevel,
    createdAt: new Date(dto.createdAt),
  };
}

export function toReplyDomainList(dtos: ReplyDto[]): ReplyDomain[] {
  return dtos.map(toReplyDomain);
}

export type { SentimentType };
