import {
  SubscriptionStatus,
  UsageEventType,
  UsageLedgerDomain,
  UsageQuotaSubscriptionDomain,
  UserPlanDomain,
} from '@/types';

export const dummySubscription: UsageQuotaSubscriptionDomain = {
  planName: '무료 플랜',
  updatedAt: new Date('2025-01-01T00:00:00Z'),
  replyQuotaTotal: 30,
  replyQuotaUsed: 20,
  storeQuotaUsed: 3,
  storeQuotaTotal: 5,
};

// 구독 관리 페이지용 더미 데이터

export const dummyUserPlanInfo: UserPlanDomain = {
  planStatus: SubscriptionStatus.PAID_ACTIVE,
  plan: {
    id: 2,
    name: 'STARTER',
    title: '스타터 플랜',
    description: '소규모 쇼핑몰을 운영하는 분들을 위한 플랜',
    monthlyPrice: 0,
    currency: 'KRW',
    monthlyReplyQuota: 300,
    maxStoreCount: 2,
    maxProductPerStore: 50,
    maxTestPerDay: 20,
  },
  subscription: {
    id: 1,
    status: 'active',
    startedAt: new Date('2026-01-04T00:00:00Z'),
    currentPeriodStart: new Date('2026-01-04T00:00:00Z'),
    currentPeriodEnd: new Date('2026-02-04T00:00:00Z'),
    cancelAtPeriodEnd: false,
    canceledAt: null,
  },
};

export const dummyUsageRemaining = 270;

export const dummyUsageLedger: UsageLedgerDomain[] = [
  {
    id: 1,
    eventType: UsageEventType.USE,
    deltaQuantity: -10,
    storeId: 1,
    planId: null,
    occurredAt: new Date('2026-01-25T00:00:00Z'),
    meta: { storeName: '쇼핑몰B' },
  },
  {
    id: 2,
    eventType: UsageEventType.USE,
    deltaQuantity: -5,
    storeId: 2,
    planId: null,
    occurredAt: new Date('2026-01-25T00:00:00Z'),
    meta: { storeName: '쇼핑몰A' },
  },
  {
    id: 3,
    eventType: UsageEventType.SUBSCRIPTION_GRANT,
    deltaQuantity: 100,
    storeId: null,
    planId: 2,
    occurredAt: new Date('2026-01-24T11:30:00Z'),
    meta: { planName: 'STARTER 플랜' },
  },
  {
    id: 4,
    eventType: UsageEventType.USE,
    deltaQuantity: -10,
    storeId: 1,
    planId: null,
    occurredAt: new Date('2026-01-28T00:00:00Z'),
    meta: { storeName: '쇼핑몰B' },
  },
  {
    id: 5,
    eventType: UsageEventType.USE,
    deltaQuantity: -5,
    storeId: 2,
    planId: null,
    occurredAt: new Date('2026-01-24T00:00:00Z'),
    meta: { storeName: '쇼핑몰A' },
  },
  {
    id: 6,
    eventType: UsageEventType.FREE_GRANT,
    deltaQuantity: 100,
    storeId: null,
    planId: null,
    occurredAt: new Date('2026-01-24T14:30:00Z'),
    meta: null,
  },
];
