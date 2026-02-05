import type { DashboardPageData } from '@/types/domain/pages';
import { dummyUsers } from '../users';
import { dummyPlans } from '../plans';

/**
 * 대시보드 페이지용 목 데이터
 */
export const mockDashboardPageData: DashboardPageData = {
  user: dummyUsers[0],
  plan: dummyPlans[0], // FREE 플랜
  subscription: {
    id: 1,
    status: 'active',
    startedAt: new Date('2025-01-15T00:00:00Z'),
    currentPeriodStart: new Date('2026-01-01T00:00:00Z'),
    currentPeriodEnd: new Date('2026-02-01T00:00:00Z'),
    cancelAtPeriodEnd: false,
    canceledAt: null,
  },
  recentReplies: [], // TODO: Reply 더미 데이터 작성 후 추가
  usageQuota: {
    userId: 1,
    remaining: 30,
    updatedAt: new Date('2026-02-04T00:00:00Z'),
  },
  testQuota: {
    userId: 1,
    remaining: 5,
    updatedAt: new Date('2026-02-04T00:00:00Z'),
  },
};
