import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { queryKeys } from '@/lib/queryKeys';
import {
  PlatformType,
  ReminderEvent,
  ReminderLevel,
  StoreStatus,
  SubscriptionStatus,
} from '@/types/enums';

import { useStoresPage } from '../useStoresPage';

vi.mock('@/services/store', () => ({
  getMyStores: vi.fn(),
}));

vi.mock('@/hooks/useUser', () => ({
  useUserPlan: vi.fn(() => ({ data: undefined })),
}));

vi.mock('@/hooks/useReminders', () => ({
  useReminders: vi.fn(() => ({ data: [] })),
}));

import { useReminders } from '@/hooks/useReminders';
import { useUserPlan } from '@/hooks/useUser';
import { getMyStores } from '@/services/store';

const makeWrapper = (queryClient: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

const newQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
    },
  });

const makeStore = (id: number, status = StoreStatus.ACTIVE) => ({
  id,
  name: `쇼핑몰${id}`,
  url: `https://smartstore.naver.com/${id}`,
  platform: 'naver',
  platformType: PlatformType.SMARTSTORE,
  status,
});

const makeAdjustmentReminder = (maxStoreCount: number) => ({
  id: 1,
  category: 'store' as const,
  event: ReminderEvent.STORE_ADJUSTMENT_REQUIRED,
  level: ReminderLevel.WARNING,
  createdAt: new Date(),
  meta: {
    planId: 1,
    planName: 'Basic',
    dueDate: '2026-05-21',
    currentStoreCount: 2,
    currentProductCount: 0,
    maxStoreCount,
    maxProductCount: 20,
  },
});

describe('useStoresPage', () => {
  beforeEach(() => {
    vi.mocked(getMyStores).mockReset();
    vi.mocked(useUserPlan).mockReturnValue({ data: undefined } as any);
    vi.mocked(useReminders).mockReturnValue({ data: [] } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('storeQuota 기반으로 registered/total 을 반환한다', async () => {
    vi.mocked(getMyStores).mockResolvedValue({
      stores: [makeStore(1), makeStore(2)],
      storeQuota: { max: 5, registered: 3, used: 3, remaining: 2 },
    });

    const qc = newQueryClient();
    const { result } = renderHook(() => useStoresPage(), {
      wrapper: makeWrapper(qc),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.registeredStoreCount).toBe(3);
    expect(result.current.storeQuotaTotal).toBe(5);
    expect(result.current.storeLimitExceeded).toBe(false);
    expect(result.current.needsAdjustment).toBe(false);
  });

  it('stores.length 가 아닌 storeQuota.registered 를 사용한다 (visible vs registered)', async () => {
    vi.mocked(getMyStores).mockResolvedValue({
      stores: [makeStore(1, StoreStatus.REJECTED), makeStore(2)],
      storeQuota: { max: 5, registered: 1, used: 1, remaining: 4 },
    });

    const qc = newQueryClient();
    const { result } = renderHook(() => useStoresPage(), {
      wrapper: makeWrapper(qc),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.sortedStores).toHaveLength(2);
    expect(result.current.registeredStoreCount).toBe(1);
  });

  it('remaining 이 0 이면 storeLimitExceeded=true', async () => {
    vi.mocked(getMyStores).mockResolvedValue({
      stores: [makeStore(1), makeStore(2)],
      storeQuota: { max: 2, registered: 2, used: 2, remaining: 0 },
    });

    const qc = newQueryClient();
    const { result } = renderHook(() => useStoresPage(), {
      wrapper: makeWrapper(qc),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.storeLimitExceeded).toBe(true);
    expect(result.current.needsAdjustment).toBe(false);
  });

  it('다운그레이드 예약 + 한도 초과 알람이 있으면 needsAdjustment=true', async () => {
    vi.mocked(getMyStores).mockResolvedValue({
      stores: [makeStore(1), makeStore(2)],
      storeQuota: { max: 2, registered: 2, used: 2, remaining: 0 },
    });
    vi.mocked(useUserPlan).mockReturnValue({
      data: { planStatus: SubscriptionStatus.PAID_PLAN_DOWNGRADE_SCHEDULED },
    } as any);
    vi.mocked(useReminders).mockReturnValue({
      data: [makeAdjustmentReminder(1)],
    } as any);

    const qc = newQueryClient();
    const { result } = renderHook(() => useStoresPage(), {
      wrapper: makeWrapper(qc),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.needsAdjustment).toBe(true);
    expect(result.current.futureMaxStoreCount).toBe(1);
  });

  it('다운그레이드 예약이어도 알람이 없으면 needsAdjustment=false', async () => {
    vi.mocked(getMyStores).mockResolvedValue({
      stores: [makeStore(1), makeStore(2), makeStore(3)],
      storeQuota: { max: 2, registered: 3, used: 3, remaining: 0 },
    });
    vi.mocked(useUserPlan).mockReturnValue({
      data: { planStatus: SubscriptionStatus.PAID_PLAN_DOWNGRADE_SCHEDULED },
    } as any);

    const qc = newQueryClient();
    const { result } = renderHook(() => useStoresPage(), {
      wrapper: makeWrapper(qc),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.needsAdjustment).toBe(false);
  });

  it('데이터 미수신 시 가드값(0/false)을 반환한다', async () => {
    vi.mocked(getMyStores).mockImplementation(() => new Promise(() => {}));

    const qc = newQueryClient();
    qc.setQueryData(queryKeys.stores.list(), undefined);

    const { result } = renderHook(() => useStoresPage(), {
      wrapper: makeWrapper(qc),
    });

    expect(result.current.registeredStoreCount).toBe(0);
    expect(result.current.storeQuotaTotal).toBe(0);
    expect(result.current.needsAdjustment).toBe(false);
    expect(result.current.storeLimitExceeded).toBe(false);
  });
});
