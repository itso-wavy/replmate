import { UsageEventType } from '../enums';
import { Pagination } from './common';

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

// ============================================================================
// 대시보드용 (프론트엔드 전용)
// ============================================================================

// 대시보드에서 사용하는 구독 정보 (사용자 플랜 + 사용량 통합)
export interface UsageQuotaSubscription {
  planName: string;
  updatedAt: string;
  replyQuotaTotal: number;
  replyQuotaUsed: number;
  storeQuotaTotal: number;
  storeQuotaUsed: number;
}
