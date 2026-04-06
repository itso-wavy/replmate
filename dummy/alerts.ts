import type { ReminderDto } from '@/types/api/reminder';
import { ReminderEvent, ReminderLevel } from '@/types/enums';
import {
  ReminderDomain,
  toReminderDomainList,
} from '@/types/domain/reminder';

export interface AlertsPageDummySet {
  reminders: ReminderDto[];
  alerts: ReminderDomain[];
}

function createReminder(
  reminder: Omit<ReminderDto, 'title' | 'message' | 'createdAt'> & {
    title?: string;
    message?: string;
    createdAt?: string;
  }
): ReminderDto {
  return {
    ...reminder,
    title: reminder.title ?? '',
    message: reminder.message ?? '',
    createdAt: reminder.createdAt ?? '2026-04-01T09:00:00+09:00',
  };
}

function createPageDummySet(reminders: ReminderDto[]): AlertsPageDummySet {
  return {
    reminders,
    alerts: toReminderDomainList(reminders),
  };
}

const dashboardReminders: ReminderDto[] = [
  createReminder({
    id: 101,
    category: 'plan',
    event: ReminderEvent.PAYMENT_FAILED,
    level: ReminderLevel.ERROR,
    createdAt: '2026-04-06T09:00:00+09:00',
    meta: {
      daysUntilDowngrade: 2,
    },
  }),
  createReminder({
    id: 102,
    category: 'store',
    event: ReminderEvent.STORE_VERIFICATION_REJECTED,
    level: ReminderLevel.WARNING,
    createdAt: '2026-04-05T14:20:00+09:00',
    meta: {
      storeId: 3,
      storeName: '루미아틀리에',
      reason: '관리자 인증 이미지에서 상호명이 확인되지 않았습니다.',
    },
  }),
  createReminder({
    id: 103,
    category: 'store',
    event: ReminderEvent.STORE_ADJUSTMENT_REQUIRED,
    level: ReminderLevel.WARNING,
    createdAt: '2026-04-04T11:00:00+09:00',
    meta: {
      planId: 1,
      planName: '무료 플랜',
      dueDate: '2026.04.10',
      currentStoreCount: 3,
      currentProductCount: 18,
      maxStoreCount: 1,
      maxProductCount: 10,
    },
  }),
  createReminder({
    id: 104,
    category: 'product',
    event: ReminderEvent.PRODUCT_ADJUSTMENT_REQUIRED,
    level: ReminderLevel.WARNING,
    createdAt: '2026-04-03T18:00:00+09:00',
    meta: {
      planId: 1,
      planName: '무료 플랜',
      dueDate: '2026.04.10',
      currentStoreCount: 1,
      currentProductCount: 25,
      maxStoreCount: 1,
      maxProductCount: 10,
    },
  }),
];

const storesPageReminders: ReminderDto[] = [
  createReminder({
    id: 201,
    category: 'store',
    event: ReminderEvent.STORE_ADJUSTMENT_REQUIRED,
    level: ReminderLevel.WARNING,
    createdAt: '2026-04-05T10:00:00+09:00',
    meta: {
      planId: 1,
      planName: '무료 플랜',
      dueDate: '2026.04.10',
      currentStoreCount: 3,
      currentProductCount: 18,
      maxStoreCount: 1,
      maxProductCount: 10,
    },
  }),
  createReminder({
    id: 202,
    category: 'store',
    event: ReminderEvent.STORE_ADJUSTMENT_SCHEDULED,
    level: ReminderLevel.INFO,
    createdAt: '2026-04-05T09:00:00+09:00',
    meta: {
      planId: 1,
      planName: '무료 플랜',
      effectiveDate: '2026.04.10',
      maxStoreCount: 1,
      maxProductCount: 10,
    },
  }),
];

const productsPageReminders: ReminderDto[] = [
  createReminder({
    id: 301,
    category: 'store',
    event: ReminderEvent.STORE_CONNECTION_REQUIRED,
    level: ReminderLevel.WARNING,
    createdAt: '2026-04-05T13:00:00+09:00',
    meta: {},
  }),
  createReminder({
    id: 302,
    category: 'product',
    event: ReminderEvent.PRODUCT_ADJUSTMENT_REQUIRED,
    level: ReminderLevel.WARNING,
    createdAt: '2026-04-05T12:00:00+09:00',
    meta: {
      planId: 1,
      planName: '무료 플랜',
      dueDate: '2026.04.10',
      currentStoreCount: 1,
      currentProductCount: 25,
      maxStoreCount: 1,
      maxProductCount: 10,
    },
  }),
  createReminder({
    id: 303,
    category: 'product',
    event: ReminderEvent.PRODUCT_ADJUSTMENT_SCHEDULED,
    level: ReminderLevel.INFO,
    createdAt: '2026-04-05T11:00:00+09:00',
    meta: {
      planId: 1,
      planName: '무료 플랜',
      effectiveDate: '2026.04.10',
      maxStoreCount: 1,
      maxProductCount: 10,
    },
  }),
];

const optionsPageReminders: ReminderDto[] = [
  createReminder({
    id: 401,
    category: 'store',
    event: ReminderEvent.STORE_CONNECTION_REQUIRED,
    level: ReminderLevel.WARNING,
    createdAt: '2026-04-05T13:30:00+09:00',
    meta: {},
  }),
];

const repliesPageReminders: ReminderDto[] = [
  createReminder({
    id: 501,
    category: 'store',
    event: ReminderEvent.STORE_CONNECTION_REQUIRED,
    level: ReminderLevel.WARNING,
    createdAt: '2026-04-05T14:00:00+09:00',
    meta: {},
  }),
];

export const dummyDashboardAlerts = createPageDummySet(dashboardReminders);
export const dummyStoresPageAlerts = createPageDummySet(storesPageReminders);
export const dummyProductsPageAlerts = createPageDummySet(productsPageReminders);
export const dummyOptionsPageAlerts = createPageDummySet(optionsPageReminders);
export const dummyRepliesPageAlerts = createPageDummySet(repliesPageReminders);

export const dummyAlertsByPage = {
  dashboard: dummyDashboardAlerts,
  stores: dummyStoresPageAlerts,
  products: dummyProductsPageAlerts,
  options: dummyOptionsPageAlerts,
  replies: dummyRepliesPageAlerts,
} as const;
