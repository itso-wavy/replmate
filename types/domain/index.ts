/**
 * Domain 타입 전체 Export
 * API DTO를 프론트엔드에서 사용하기 편한 형태로 변환한 타입들
 */

// Plan
export type { PlanDomain } from './plan';
export { toPlanDomain, toPlanDomainList } from './plan';

// Store
export type {
  StoreDomain,
  StoreReplyOptionsDomain,
  StoreWithStats,
} from './store';
export {
  toStoreDomain,
  toStoreDomainList,
  toStoreReplyOptionsDomain,
} from './store';

// Product
export type {
  ProductDomain,
  ProductDetailDomain,
  ProductListDomain,
  ProductWithStore,
} from './product';
export {
  toProductDomain,
  toProductDomainList,
  toProductDetailDomain,
} from './product';

// Reply
export type {
  ReviewDomain,
  ReplyDomain,
  TestReplyDomain,
  ReplyListDomain,
  ReplyWithSentiment,
  SentimentType,
} from './reply';
export {
  toReviewDomain,
  toReplyDomain,
  toReplyDomainList,
  toTestReplyDomain,
} from './reply';

// Usage
export type {
  UsageQuotaDomain,
  TestUsageQuotaDomain,
  UsageLedgerDomain,
  UsageHistoryListDomain,
  UsageQuotaSubscriptionDomain,
  UsageAnalytics,
} from './usage';
export {
  toUsageQuotaDomain,
  toTestUsageQuotaDomain,
  toUsageLedgerDomain,
  toUsageLedgerDomainList,
  toUsageQuotaSubscriptionDomain,
} from './usage';

// Contact
export type { ContactDomain, ContactWithReply } from './contact';
export { toContactDomain, toContactDomainList } from './contact';

// Reminder
export type {
  ReminderDomain,
  ReminderWithReadStatus,
  GroupedReminders,
} from './reminder';
export {
  toReminderDomain,
  toReminderDomainList,
  groupRemindersByCategory,
} from './reminder';

// Job
export type {
  JobDomain,
  JobStatus,
  JobType,
  JobWithProgress,
} from './job';
export {
  toJobDomain,
  toJobDomainList,
  toJobWithProgress,
  getJobStatusColor,
  getJobTypeIcon,
} from './job';
