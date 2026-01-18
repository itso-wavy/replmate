import { Pagination } from './common';
import { UsageEventType } from './enums';

// ============================================================================
// 사용량 (Usage)
// ============================================================================

// GET /api/v1/usage/quota 이번달 남은 구독 사용량
export interface UsageQuotaSubscription {
  userId: number;
  remaining: number;
  updatedAt: string;
  // replyQuotaUsed: number;
  // replyQuotaTotal: number;
}

//GET /api/v1/usage/free-quota 스토어당 오늘 남은 무료 리플 미리보기 사용량
export interface UsageQuotaFree {
  store_id: number;
  remaining: number;
  updated_at: string;
  // replyQuotaUsed: number;
  // replyQuotaTotal: number;
}

// GET /api/v1/usage/history?page=1&size=20
export interface UsageHistoryItem {
  id: number;
  event_type: UsageEventType; // 이벤트 타입
  delta_quantity: number; // 사용량 증감
  store_id: number;
  plan_id: number;
  occurred_at: string; // 발생 일시
  meta: {
    // 메타 정보
    reply_id: number;
    review_id: number;
  };
}

export type UsageHistoryList = Pagination & { items: UsageHistoryItem[] };
