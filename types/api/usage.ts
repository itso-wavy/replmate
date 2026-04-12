import { UsageEventType } from '../enums';
import { Pagination } from './common';

// ==========================================================
// 사용량 (Usage)
// ==========================================================

// GET /api/v1/usage/quota 이번달 남은 구독 사용량
export interface UsageQuotaDto {
  userId: number;
  remaining: number;
  updatedAt: string;
}

// GET /api/v1/usage/test-quota 오늘 남은 리플 테스트 사용량
export interface TestUsageQuotaDto {
  storeId: number;
  remaining: number;
  limit: number;
  updatedAt: string;
}

// GET /api/v1/usage/history?page=1&size=20
export interface UsageLedgerDto {
  id: number;
  eventType: UsageEventType;
  reason: string | null;
  deltaQuantity: number;
  storeId: number | null;
  planId: number | null;
  occurredAt: string;
  meta: Record<string, unknown> | null;
}

export type UsageHistoryList = Pagination & { items: UsageLedgerDto[] };
