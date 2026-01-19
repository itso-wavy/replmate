import { UsageQuotaSubscription } from '@/types';

export const dummySubscription: UsageQuotaSubscription = {
  planName: 'Basic',
  userId: 123,
  updatedAt: '2025-01-01T00:00:00Z',
  storeQuotaUsed: 2,
  storeQuotaTotal: 5,
  productQuotaUsed: 10,
  productQuotaTotal: 30,
  replyQuotaUsed: 50,
  replyQuotaTotal: 100,
};
