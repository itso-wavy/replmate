import type { Pagination } from './common';
import type { ReplyLength, ReplyTone } from './enums';
import type { Product } from './product';

// ============================================================================
// 리플 (Replies)
// ============================================================================

export interface Review {
  id: number;
  rating: number;
  content: string;
  reviewedAt: string;
}

export interface Reply {
  id: number;
  review: Review;
  product: Product;
  aiText: string;
  editedText: string;
  status: string;
  tone: ReplyTone;
  lengthType: ReplyLength;
  includeEmoji: boolean;
  usageCount: number;
  exportedAt: string;
  createdAt: string;
  updatedAt: string;
  // isDel: boolean;
  // deletedAt: string | null;
}

// GET /api/v1/stores/{store_id}/reply-options
export interface ReplyOption {
  id?: number;
  storeId: number;
  // defaultTone: ReplyTone;
  // defaultLength: ReplyLength;
  tone: ReplyTone;
  lengthType: ReplyLength;
  includeEmoji: boolean;
  brandGuideline: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ReplyList = Pagination & { items: Reply[] };
