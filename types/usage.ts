import { Pagination } from './common';
import { UsageEventType } from './enums';

// ============================================================================
// 사용량 (Usage)
// ============================================================================

// GET /api/v1/usage/quota 이번달 남은 구독 사용량
export interface UsageQuotaDto {
  userId: number;
  remaining: number;
  updatedAt: string;
}

// GET /api/v1/usage/test-quota 오늘 남은 리플 테스트 사용량
export interface TestUsageQuotaDto {
  userId: number;
  remaining: number;
  updatedAt: string;
}

// GET /api/v1/usage/history?page=1&size=20
export interface UsageLedgerDto {
  id: number;
  eventType: UsageEventType;
  deltaQuantity: number;
  storeId: number;
  planId: number;
  occurredAt: string;
  meta: {
    replyId?: number;
    reviewId?: number;
  };
}

export type UsageHistoryList = Pagination & { items: UsageLedgerDto[] };
