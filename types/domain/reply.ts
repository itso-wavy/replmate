import type { ReplyDto, ReviewDto, SentimentType } from '@/types/api/reply';
import type { Pagination } from '@/types/api/common';
import { toProductDomain, type ProductDomain } from './product';

/**
 * 리뷰 Domain 타입
 */
export interface ReviewDomain {
  id: number;
  /** 리뷰 작성자 (예: "yu****"). API DTO에 없는 프론트엔드 전용 필드 */
  reviewer: string | null;
  rating: number | null;
  content: string;
  reviewedAt: Date | null;
}

/**
 * 리플 Domain 타입
 * API DTO의 날짜 문자열을 Date 객체로 변환
 * NOTE: editedText, status, tone 등 추가 필드는 실제 백엔드 응답에 포함될 수 있어 유지합니다.
 */
export interface ReplyDomain {
  id: number;
  review: ReviewDomain;
  product: ProductDomain;
  aiText: string;
  editedText: string | null;
  status: string;
  tone: string | null;
  lengthType: string | null;
  includeEmoji: boolean;
  usageCount: number;
  sentimentScore: number | null;
  exportedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 리플 목록 Domain 타입 (페이지네이션 포함)
 */
export type ReplyListDomain = Pagination & { items: ReplyDomain[] };

/**
 * 감정 분석 정보를 포함한 리플 확장 타입
 * 프론트엔드에서 리뷰 감정 분석 표시 시 사용
 */
export interface ReplyWithSentiment extends ReplyDomain {
  sentiment?: SentimentType;
}

/**
 * ReviewDto를 ReviewDomain으로 변환
 * @param dto - API에서 받은 ReviewDto
 * @returns ReviewDomain 객체
 */
export function toReviewDomain(dto: ReviewDto): ReviewDomain {
  return {
    id: dto.id,
    reviewer: null,
    rating: dto.rating,
    content: dto.content,
    reviewedAt: dto.reviewedAt ? new Date(dto.reviewedAt) : null,
  };
}

/**
 * ReplyDto를 ReplyDomain으로 변환
 * @param dto - API에서 받은 ReplyDto
 * @returns ReplyDomain 객체
 */
export function toReplyDomain(dto: ReplyDto): ReplyDomain {
  return {
    id: dto.id,
    review: toReviewDomain(dto.review),
    product: toProductDomain(dto.product),
    aiText: dto.aiText,
    editedText: dto.editedText,
    status: dto.status,
    tone: dto.tone,
    lengthType: dto.lengthType,
    includeEmoji: dto.includeEmoji,
    usageCount: dto.usageCount,
    sentimentScore: null,
    exportedAt: dto.exportedAt ? new Date(dto.exportedAt) : null,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}

/**
 * ReplyDto 배열을 ReplyDomain 배열로 변환
 * @param dtos - API에서 받은 ReplyDto 배열
 * @returns ReplyDomain 배열
 */
export function toReplyDomainList(dtos: ReplyDto[]): ReplyDomain[] {
  return dtos.map(toReplyDomain);
}

/**
 * Sentinel 타입 export
 */
export type { SentimentType };
