import { UsageQuotaSubscriptionDomain } from '@/types';

export const dummySubscription: UsageQuotaSubscriptionDomain = {
  planName: '무료 플랜',
  updatedAt: new Date('2025-01-01T00:00:00Z'),
  replyQuotaTotal: 30,
  replyQuotaUsed: 20,
  storeQuotaUsed: 3,
  storeQuotaTotal: 5,
};
