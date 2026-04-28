import type { ReplyStatus, TermsType } from '@/types/enums';

export const queryKeys = {
  user: {
    all: () => ['user'] as const,
    me: () => ['user', 'me'] as const,
    plan: () => ['user', 'plan'] as const,
    notifications: () => ['user', 'notifications'] as const,
  },
  stores: {
    all: () => ['stores'] as const,
    list: () => ['stores', 'list'] as const,
    detail: (storeId: number) => ['stores', storeId] as const,
    replyOptions: (storeId: number) =>
      ['stores', storeId, 'replyOptions'] as const,
    platformTypes: () => ['stores', 'platformTypes'] as const,
  },
  products: {
    all: () => ['products'] as const,
    list: (storeId: number, params?: { page?: number; size?: number }) =>
      ['products', storeId, params] as const,
    detail: (productId: number) => ['products', productId] as const,
  },
  replies: {
    all: () => ['replies'] as const,
    list: (params: {
      storeId: number;
      reviewId?: number;
      status?: ReplyStatus;
      todayOnly?: boolean;
      page?: number;
      size?: number;
    }) => ['replies', params] as const,
  },
  usage: {
    all: () => ['usage'] as const,
    quota: () => ['usage', 'quota'] as const,
    testQuota: (storeId: number) => ['usage', 'testQuota', storeId] as const,
    history: (params?: { page?: number; size?: number }) =>
      ['usage', 'history', params] as const,
  },
  plans: {
    all: () => ['plans'] as const,
    list: (includeFree?: boolean) => ['plans', includeFree] as const,
  },
  terms: {
    all: () => ['terms'] as const,
    list: () => ['terms', 'list'] as const,
    byType: (type: TermsType) => ['terms', type] as const,
  },
  reminders: {
    all: () => ['reminders'] as const,
    list: (params?: { category?: string; level?: string }) =>
      ['reminders', 'list', params] as const,
  },
};
