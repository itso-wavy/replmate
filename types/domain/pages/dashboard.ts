import type { UserDomain, SubscriptionDomain } from '../user';
import type { PlanDomain } from '../plan';
import type { ReplyDomain } from '../reply';
import type { UsageQuotaDomain } from '../usage';

/**
 * 대시보드 페이지 데이터
 */
export interface DashboardPageData {
  user: UserDomain;
  plan: PlanDomain;
  subscription: SubscriptionDomain;
  recentReplies: ReplyDomain[];
  usageQuota: UsageQuotaDomain;
  testQuota: UsageQuotaDomain;
}

/**
 * 대시보드 통계 카드 데이터
 */
export interface DashboardStatsCard {
  label: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

/**
 * 대시보드 최근 리플 테이블 행 데이터
 */
export interface DashboardReplyRow {
  id: number;
  productName: string;
  reviewContent: string;
  replyContent: string;
  sentiment: {
    type: 'positive' | 'neutral' | 'negative';
    score: number;
  };
  createdAt: Date;
}
